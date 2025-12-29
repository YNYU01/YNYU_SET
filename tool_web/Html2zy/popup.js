/**
 * Html2zy Popup Script
 * 处理扩展弹窗的交互逻辑
 */

(function() {
  'use strict';

  let elementSnapshots = []; // 存储完整的元素快照数据
  let selectedIndices = new Set(); // 选中的元素索引

  // DOM 元素引用
  const elements = {
    cssSelector: document.getElementById('cssSelector'),
    scanButton: document.getElementById('scanButton'),
    elementsList: document.getElementById('elementsList'),
    exportButton: document.getElementById('exportButton'),
    status: document.getElementById('status')
  };

  /**
   * 显示状态消息
   */
  function showStatus(message, type = 'success',time = 3000) {
    let lang = ROOT.getAttribute('data-language');
    elements.status.textContent = lang === 'Zh' ? message[0] : message[1];
    elements.status.className = `status ${type}`;
    setTimeout(() => {
      elements.status.className = 'status';
      elements.status.textContent = '';
    }, time);
  }

  /**
   * 获取当前选项
   */
  function getOptions() {
    return {
      includeHidden: false,
      includeInvisible: false,
      includeOverflow: false
    };
  }

  /**
   * 检查并注入 content script（如果需要）
   */
  async function ensureContentScript(tabId) {
    try {
      // 尝试发送 ping 消息检查 content script 是否已注入
      await chrome.tabs.sendMessage(tabId, { type: 'ping' });
      return true;
    } catch (error) {
      // Content script 未注入，尝试注入
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
        // 等待一小段时间让脚本初始化
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
      } catch (injectError) {
        console.error('无法注入 content script:', injectError);
        return false;
      }
    }
  }

  /**
   * 安全地发送消息到 content script
   */
  async function sendMessageToContent(message) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // 检查是否是特殊页面（不允许注入）
      if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://'))) {
        throw new Error('此页面不支持快照功能（Chrome 内部页面）');
      }

      // 确保 content script 已注入
      const injected = await ensureContentScript(tab.id);
      if (!injected) {
        throw new Error('无法注入内容脚本，请刷新页面后重试');
      }

      // 发送消息
      const response = await chrome.tabs.sendMessage(tab.id, message);
      
      if (!response) {
        throw new Error('未收到响应，content script 可能未正确加载');
      }
      
      return response;
    } catch (error) {
      if (error.message.includes('Receiving end does not exist')) {
        throw new Error('Content script 未加载，请刷新页面后重试');
      }
      throw error;
    }
  }

  /**
   * 扫描元素
   */
  async function scanElements() {
    const selector = elements.cssSelector.value.trim();
    if (!selector) {
      showStatus(['请输入 CSS 选择器','Please input CSS selector'], 'error');
      return;
    }

    try {
      showStatus(['正在扫描...','Scanning...'], 'success');
      
      const response = await sendMessageToContent({
        type: 'snapshotSelector',
        selector: selector,
        options: getOptions()
      });

      if (response && response.success) {
        const data = response.data;
        
        // 处理单个或多个元素（data 现在是包含单个元素快照的数组）
        if (Array.isArray(data) && data.length > 0) {
          // 过滤掉 null 或无效的快照数据
          elementSnapshots = data
            .map((el, idx) => ({
              snapshot: el,
              selector: selector,
              index: idx
            }))
            .filter(item => item.snapshot !== null && item.snapshot !== undefined);
          
          // 重新设置索引
          elementSnapshots.forEach((item, idx) => {
            item.index = idx;
          });
        } else {
          showStatus(['未找到匹配的元素','No matching elements found'], 'error');
          return;
        }
        
        // 如果过滤后没有有效元素，显示错误
        if (elementSnapshots.length === 0) {
          showStatus(['未找到有效的元素（可能所有元素都被隐藏）','No valid elements found (all elements may be hidden)'], 'error');
          return;
        }

        // 默认选中所有元素
        selectedIndices.clear();
        elementSnapshots.forEach((_, idx) => selectedIndices.add(idx));

        // 显示元素列表
        await renderElementsList();
        
        elements.exportButton.disabled = false;
        showStatus([`找到 ${elementSnapshots.length} 个匹配元素`,`Found ${elementSnapshots.length} matching elements`], 'success');
      } else {
        showStatus([`错误: ${response ? response.error : '未知错误'}`,`Error: ${response ? response.error : 'Unknown error'}`], 'error');
        elements.elementsList.innerHTML = '';
      }
    } catch (error) {
      showStatus([`错误: ${error.message}`,`Error: ${error.message}`], 'error');
      elements.elementsList.innerHTML = '';
    }
  }

  /**
   * 渲染元素列表
   */
  async function renderElementsList() {
    let lang = ROOT.getAttribute('data-language');
    elements.elementsList.innerHTML = '';
    
    if (elementSnapshots.length === 0) {
      return;
    }

    // 为每个元素创建列表项
    for (let i = 0; i < elementSnapshots.length; i++) {
      const item = elementSnapshots[i];
      const snapshot = item.snapshot;
      
      // 获取元素标识信息
      const tagName = snapshot.tagName || 'unknown';
      const id = snapshot.id || '';
      const bodradius = snapshot.styles.borderRadius || '';
      const classes = snapshot.classes || [];
      const h2zyValue = snapshot.dataH2zy || '';
      
      // 生成预览图
      let previewUrl = '';
      try {
        const previewResponse = await sendMessageToContent({
          type: 'generatePreview',
          selector: item.selector,
          index: i
        });
        if (previewResponse && previewResponse.success && previewResponse.imageData) {
          previewUrl = previewResponse.imageData;
          // 保存预览图数据到 elementSnapshots 中以便后续复用
          elementSnapshots[i].preview = previewResponse.imageData;
        }
      } catch (e) {
        console.warn('生成预览图失败:', e);
      }

      //创建预览图
      const previewbox = document.createElement('div');
      previewbox.setAttribute('data-previewbox', '');
      previewbox.className = 'w100 tex-pixelbg ovy noscrollbar';

      const preview = document.createElement('img');
      preview.src = previewUrl;
      preview.alt = lang === 'Zh' ? '预览图' : 'Preview';
      preview.onload = function() {
        if(this.width > 360) {
          // aspectRatio 需要字符串格式，并设置 height: auto 确保比例正确
          this.style.aspectRatio = `${this.width} / ${this.height}`;
          this.style.width = '360px';
          this.style.height = 'auto';
        } else {
          this.style.marginLeft = `${(360 - this.width) / 2}px`;
        }
        if(this.height < 100){
          this.style.marginTop = `${(100 - this.height) / 2}px`;
        }
        preview.style.borderRadius = bodradius;
      };
      preview.onerror = function() {
        this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40"><rect width="60" height="40" fill="%23f0f0f0"/><text x="30" y="20" text-anchor="middle" font-size="10" fill="%23999">无预览</text></svg>';
      };

      
      previewbox.appendChild(preview);

      // 创建列表项
      const listItem = document.createElement('div');
      listItem.setAttribute('data-tag-element', '');
      listItem.className = 'w100 df-ffc gap4';
      listItem.dataset.index = i;

      const infoline = document.createElement('div');
      infoline.className = 'w100 df-sc gap4';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `h2zy-chk-${i}`;
      checkbox.setAttribute('data-input', '');
      checkbox.checked = selectedIndices.has(i);
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          selectedIndices.add(i);
        } else {
          selectedIndices.delete(i);
        }
        updateExportButton();
      });
      infoline.appendChild(checkbox);

      let checkboxLabel = document.createElement('label');
      checkboxLabel.setAttribute('for', `h2zy-chk-${i}`);
      checkboxLabel.className = 'df-cc wh-14 check pos-r';
      checkboxLabel.innerHTML = '<btn-check-tick></btn-check-tick>';
      infoline.appendChild(checkboxLabel);

      const title = document.createElement('input');
      title.setAttribute('data-h2zy-name', i);
      title.className = 'w100 nobod';
      title.type = 'text';
      title.value = `${i + 1}.${h2zyValue ? h2zyValue : tagName} ${id ? `#${id}` : ''} ${classes.length > 0 ? `.${classes[0]}` : ''}`;
      title.setAttribute('data-input', '');
      title.addEventListener('change', (e) => {
        console.log(e.target.value);
      });
      infoline.appendChild(title);

      const actions = document.createElement('div');
      actions.className = 'df-lc gap4';
      
      const locateBtn = document.createElement('div');
      locateBtn.setAttribute('data-btn', 'sec');
      locateBtn.setAttribute('data-en-text','Locate');
      locateBtn.setAttribute('data-zh-text','定位');
      locateBtn.className = 'bod-r4 df-cc';
      locateBtn.textContent = lang === 'Zh' ? '定位' : 'Locate';
      locateBtn.addEventListener('click', () => {
        locateElement(item.selector, i);
      });
      actions.appendChild(locateBtn);

      const copyBtn = document.createElement('div');
      copyBtn.setAttribute('data-btn', 'sec');
      copyBtn.setAttribute('data-en-text','Copy');
      copyBtn.setAttribute('data-zh-text','复制');
      copyBtn.className = 'bod-r4 df-cc';
      copyBtn.textContent = lang === 'Zh' ? '复制' : 'Copy';
      copyBtn.addEventListener('click', () => {
        copySingleJSON(i);
      });
      actions.appendChild(copyBtn);

      infoline.appendChild(actions);

      let viewbtn = document.createElement('input');
      viewbtn.type = 'checkbox';
      viewbtn.id = `h2zy-view-${i}`;
      viewbtn.setAttribute('data-input', '');
      viewbtn.checked = false;
      viewbtn.addEventListener('change', (e) => {
        if (e.target.checked) {
          previewbox.style.display = 'block';
        } else {
          previewbox.style.display = 'none';
        }
      });
      infoline.appendChild(viewbtn);

      let viewbtnLabel = document.createElement('label');
      viewbtnLabel.setAttribute('for', `h2zy-view-${i}`);
      viewbtnLabel.setAttribute('data-btn','op');
      viewbtnLabel.className = 'df-cc wh-20';
      viewbtnLabel.innerHTML = '<btn-view></btn-view>';
      infoline.appendChild(viewbtnLabel);

      listItem.appendChild(infoline);
      listItem.appendChild(previewbox);

      elements.elementsList.appendChild(listItem);
    }

    updateExportButton();
  }

  /**
   * 定位元素（在 body 顶部生成线框）
   */
  async function locateElement(selector, index) {
    try {
      const response = await sendMessageToContent({
        type: 'highlightElement',
        selector: selector,
        index: index
      });
      
      if (response && response.success) {
        showStatus(['元素已定位','Element located'], 'success');
      }
    } catch (error) {
      showStatus([`定位失败: ${error.message}`,`Failed to locate: ${error.message}`], 'error');
    }
  }

  /**
   * 复制单个元素的 JSON
   */
  async function copySingleJSON(index) {
    if (index < 0 || index >= elementSnapshots.length) {
      showStatus(['索引无效','Invalid index'], 'error');
      return;
    }

    try {
      const snapshot = elementSnapshots[index].snapshot;
      const json = JSON.stringify(snapshot, null, 2);
      await navigator.clipboard.writeText(json);
      showStatus([`已复制第 ${index + 1} 个元素的 JSON`,`Copied the JSON of the ${index + 1}th element`], 'success');
    } catch (error) {
      showStatus([`复制失败: ${error.message}`,`Failed to copy: ${error.message}`], 'error');
    }
  }

  /**
   * 更新导出按钮状态
   */
  function updateExportButton() {
    const hasSelected = selectedIndices.size > 0;
    elements.exportButton.disabled = !hasSelected;
  }

  /**
   * 导出选中元素
   */
  async function exportElements() {
    if (selectedIndices.size === 0) {
      showStatus(['请至少选择一个元素','Please select at least one element'], 'error');
      return;
    }

    try {
      showStatus(['正在打包导出...','Packaging export...'], 'success');
      
      // 收集选中的元素
      const selectedSnapshots = Array.from(selectedIndices)
        .sort((a, b) => a - b)
        .map(idx => elementSnapshots[idx]);

      // 获取输入框的值（data-h2zy-name="i"）
      const firstSelectedIndex = Array.from(selectedIndices).sort((a, b) => a - b)[0];
      const nameInput = document.querySelector(`input[data-h2zy-name="${firstSelectedIndex}"]`);
      const inputValue = nameInput ? nameInput.value.trim() : '';
      
      // 创建导出数据（复用已生成的预览图）
      const exportData = {
        timestamp: new Date().toISOString(),
        url: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].url,
        count: selectedSnapshots.length,
        elements: selectedSnapshots.map((item, idx) => {
          const snapshot = item.snapshot;
          const h2zyValue = snapshot.dataH2zy || '';
          const tagName = snapshot.tagName || 'unknown';
          
          return {
            index: idx + 1,
            name: h2zyValue ? `${idx + 1}-${h2zyValue}` : `${idx + 1}-${tagName}`,
            selector: item.selector,
            dataH2zy: h2zyValue,
            snapshot: snapshot,
            preview: item.preview || null // 复用已生成的预览图
          };
        })
      };

      // 创建 ZIP 压缩包
      const zip = new JSZip();
      
      // 添加 JSON 数据文件
      const json = JSON.stringify(exportData, null, 2);
      zip.file('export.json', json);
      
      // 添加预览图（如果有）
      exportData.elements.forEach((element, idx) => {
        if (element.preview) {
          // 将 base64 图片转换为二进制
          const base64Data = element.preview.replace(/^data:image\/\w+;base64,/, '');
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          zip.file(`preview_${idx + 1}.png`, bytes);
        }
      });

      // 生成 ZIP 文件
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      
      // 生成文件名：输入框值 + "_html2zy" + 时间戳
      const timestamp = Date.now();
      const fileName = inputValue 
        ? `${inputValue}_html2zy_${timestamp}.zip`
        : `html2zy_${timestamp}.zip`;
      
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showStatus([`成功导出 ${selectedIndices.size} 个元素`,`Successfully exported ${selectedIndices.size} elements`], 'success');
    } catch (error) {
      showStatus([`导出失败: ${error.message}`,`Failed to export: ${error.message}`], 'error');
    }
  }

  // 事件监听
  elements.scanButton.addEventListener('click', scanElements);
  elements.cssSelector.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      scanElements();
    }
  });
  elements.exportButton.addEventListener('click', exportElements);

})();
