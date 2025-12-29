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
    listSection: document.getElementById('listSection'),
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
        
        // 处理单个或多个元素
        if (data.element) {
          // 单个元素
          elementSnapshots = [{ snapshot: data.element, selector: selector, index: 0 }];
        } else if (data.elements && data.elements.length > 0) {
          // 多个元素
          elementSnapshots = data.elements.map((el, idx) => ({
            snapshot: el,
            selector: selector,
            index: idx
          }));
        } else {
          showStatus(['未找到匹配的元素','No matching elements found'], 'error');
          elements.listSection.style.display = 'none';
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
        }
      } catch (e) {
        console.warn('生成预览图失败:', e);
      }

      // 创建列表项
      const listItem = document.createElement('div');
      listItem.className = 'element-item';
      listItem.dataset.index = i;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'element-checkbox';
      checkbox.checked = selectedIndices.has(i);
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          selectedIndices.add(i);
        } else {
          selectedIndices.delete(i);
        }
        updateExportButton();
      });

      const preview = document.createElement('img');
      preview.className = 'element-preview';
      preview.src = previewUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40"><rect width="60" height="40" fill="%23f0f0f0"/><text x="30" y="20" text-anchor="middle" font-size="10" fill="%23999">无预览</text></svg>';
      preview.alt = '预览图';
      preview.onerror = function() {
        this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40"><rect width="60" height="40" fill="%23f0f0f0"/><text x="30" y="20" text-anchor="middle" font-size="10" fill="%23999">无预览</text></svg>';
      };

      const info = document.createElement('div');
      info.className = 'element-info';
      
      const title = document.createElement('div');
      title.className = 'element-info-title';
      const nameParts = [];
      if (h2zyValue) {
        nameParts.push(`${i + 1}-${h2zyValue}`);
      } else {
        nameParts.push(`${i + 1}-${tagName}`);
      }
      if (id) nameParts.push(`#${id}`);
      if (classes.length > 0) nameParts.push(`.${classes[0]}`);
      title.textContent = nameParts.join(' ');
      
      const desc = document.createElement('div');
      desc.className = 'element-info-desc';
      const descParts = [];
      if (snapshot.position) {
        descParts.push(`${Math.round(snapshot.position.width)}×${Math.round(snapshot.position.height)}`);
      }
      if (snapshot.textContent) {
        const text = snapshot.textContent.substring(0, 30);
        if (text.length < snapshot.textContent.length) {
          descParts.push(text + '...');
        } else {
          descParts.push(text);
        }
      }
      desc.textContent = descParts.join(' | ') || '无描述';

      info.appendChild(title);
      info.appendChild(desc);

      const actions = document.createElement('div');
      actions.className = 'element-actions';
      
      const locateBtn = document.createElement('button');
      locateBtn.className = 'element-action-btn';
      locateBtn.textContent = '定位';
      locateBtn.title = '在页面中定位此元素';
      locateBtn.addEventListener('click', () => {
        locateElement(item.selector, i);
      });

      const copyBtn = document.createElement('button');
      copyBtn.className = 'element-action-btn';
      copyBtn.textContent = '复制';
      copyBtn.title = '复制此元素的 JSON';
      copyBtn.addEventListener('click', () => {
        copySingleJSON(i);
      });

      actions.appendChild(locateBtn);
      actions.appendChild(copyBtn);

      listItem.appendChild(checkbox);
      listItem.appendChild(preview);
      listItem.appendChild(info);
      listItem.appendChild(actions);

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

      // 创建导出数据
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
            snapshot: snapshot
          };
        })
      };

      // 生成预览图
      for (let i = 0; i < selectedSnapshots.length; i++) {
        const item = selectedSnapshots[i];
        try {
          const previewResponse = await sendMessageToContent({
            type: 'generatePreview',
            selector: item.selector,
            index: item.index
          });
          if (previewResponse && previewResponse.success && previewResponse.imageData) {
            exportData.elements[i].preview = previewResponse.imageData;
          }
        } catch (e) {
          console.warn('生成预览图失败:', e);
        }
      }

      // 创建 JSON 文件
      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // 生成文件名
      const timestamp = Date.now();
      const h2zyValues = selectedSnapshots
        .map(item => item.snapshot.dataH2zy)
        .filter(v => v)
        .join('_');
      const fileName = h2zyValues 
        ? `html2zy-export-${h2zyValues}-${timestamp}.json`
        : `html2zy-export-${timestamp}.json`;
      
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
