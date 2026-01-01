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
    status: document.getElementById('status'),
    tickAll: document.getElementById('elements-tickall'),
    viewAll: document.getElementById('elements-viewall'),
    resetAll: document.querySelector('[data-elements-resetall]')
  };

  /**
   * 根据当前语言获取消息
   * @param {Array} messages - [中文消息, 英文消息]
   * @returns {string} 当前语言对应的消息
   */
  function getMessage(messages) {
    if (!Array.isArray(messages) || messages.length < 2) {
      return messages[0] || String(messages);
    }
    try {
      const lang = ROOT.getAttribute('data-language');
      return lang === 'Zh' ? messages[0] : messages[1];
    } catch (e) {
      // 如果 ROOT 不可用，默认返回英文
      return messages[1] || messages[0];
    }
  }

  // 用于存储当前的状态定时器，以便清除之前的定时器
  let statusTimer = null;
  
  /**
   * 显示状态消息
   * @param {string|Array} message - 消息字符串或 [中文, 英文] 数组
   * @param {string} type - 消息类型
   * @param {number} time - 显示时长（毫秒），0表示永久显示直到下次调用
   */
  function showStatus(message, type = 'success', time = 3000) {
    // 清除之前的状态定时器，避免被覆盖
    if (statusTimer) {
      clearTimeout(statusTimer);
      statusTimer = null;
    }
    
    let textContent;
    if (typeof message === 'string') {
      // 如果已经是字符串，直接使用
      textContent = message;
    } else if (Array.isArray(message) && message.length >= 2) {
      // 如果是数组，根据语言选择
      let lang = ROOT.getAttribute('data-language');
      textContent = lang === 'Zh' ? message[0] : message[1];
    } else {
      // 其他情况，尝试转换为字符串
      textContent = String(message);
    }
    
    elements.status.textContent = textContent;
    elements.status.className = `status ${type}`;
    
    // 如果time为0，表示永久显示（直到下次调用showStatus）
    if (time > 0) {
      statusTimer = setTimeout(() => {
        elements.status.className = 'status';
        elements.status.textContent = '';
        statusTimer = null;
      }, time);
    }
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
        throw new Error(getMessage(['此页面不支持快照功能（Chrome 内部页面）','This page does not support snapshot functionality (Chrome internal pages)']));
      }

      // 确保 content script 已注入
      const injected = await ensureContentScript(tab.id);
      if (!injected) {
        throw new Error(getMessage(['无法注入内容脚本，请刷新页面后重试','Failed to inject content script, please refresh the page and try again']));
      }

      // 获取当前语言并添加到消息中
      const lang = ROOT.getAttribute('data-language') || 'En';
      const messageWithLang = {
        ...message,
        language: lang
      };

      // 发送消息
      const response = await chrome.tabs.sendMessage(tab.id, messageWithLang);
      
      if (!response) {
        throw new Error(getMessage(['未收到响应，content script 可能未正确加载','No response received, content script may not be correctly loaded']));
      }
      
      return response;
    } catch (error) {
      if (error.message.includes('Receiving end does not exist')) {
        throw new Error(getMessage(['Content script 未加载，请刷新页面后重试','Content script not loaded, please refresh the page and try again']));
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
          // 从全局数据获取完整信息（包括preview和customName）
          const allGlobalData = await sendMessageToContent({ type: 'getAllElementsData' });
          const globalDataMap = (allGlobalData && allGlobalData.success) ? allGlobalData.data : {};
          
          // 构建elementSnapshots数组，每个元素引用全局数据
          elementSnapshots = data
            .map((el, idx) => {
              const dataH2zy = el.dataH2zy;
              const globalData = dataH2zy ? globalDataMap[dataH2zy] : null;
              
              return {
                snapshot: el,
                selector: el.selector || selector,
                index: el.index !== undefined ? el.index : idx,
                dataH2zy: dataH2zy,
                // 从全局数据获取preview和customName
                preview: globalData ? (globalData.preview || null) : null,
                customName: globalData ? (globalData.customName || null) : null
              };
            })
            .filter(item => item.snapshot !== null && item.snapshot !== undefined);
          
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

        // 第一步：显示元素列表（只显示占位图或缓存，不触发滚动和截图）
        await renderElementsList();
        
        elements.exportButton.disabled = false;
        // 不在这里显示状态，让 generatePreviewsForList 中的状态提示显示
        
        // 第二步：遍历所有元素的data-h2zy，逐个调用刷新函数生成预览图
        await generatePreviewsForList();
        
        // 第三步：更新列表显示（使用新生成的预览图）
        await renderElementsList();
        
        showStatus([`成功生成 ${elementSnapshots.length} 个元素的预览图`,`Successfully generated previews for ${elementSnapshots.length} elements`], 'success');
      } else {
        console.log(response);
        showStatus(response ? response.error : getMessage(['未知错误', 'Unknown error']), 'error');
        elements.elementsList.innerHTML = '';
      }
    } catch (error) {
      showStatus(error.message, 'error');
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
      
      // 第一步：只使用占位图或缓存，不触发滚动和截图
      // 优先使用item.preview，如果没有则从缓存获取，都没有则使用占位图
      let previewUrl = item.preview || '';
      
      // 如果还没有预览图，且有dataH2zy，从缓存获取
      if (!previewUrl && h2zyValue) {
        try {
          const cacheResponse = await sendMessageToContent({
            type: 'getCachedScreenshot',
            dataH2zy: h2zyValue
          });
          if (cacheResponse && cacheResponse.success && cacheResponse.imageData) {
            previewUrl = cacheResponse.imageData;
            // 更新elementSnapshots
            elementSnapshots[i].preview = previewUrl;
          }
        } catch (e) {
          console.warn('获取缓存预览图失败:', e);
        }
      }
      
      // 如果还是没有预览图，使用占位图（不触发截图，等列表生成后再统一处理）
      if (!previewUrl) {
        // 从snapshot中获取元素尺寸
        const width = snapshot.position?.width || snapshot.styles?.width || 200;
        const height = snapshot.position?.height || snapshot.styles?.height || 150;
        previewUrl = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="%23f5f5f5" stroke="%23ddd"/></svg>`;
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
      // 初始化截图状态属性（未开始截图）
      listItem.setAttribute('data-h2zy-picking', '');

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
          listItem.setAttribute('data-tag-element', '');
        } else {
          selectedIndices.delete(i);
          listItem.setAttribute('data-tag-element', 'false');
          elements.tickAll.checked = false;
        }
        updateExportButton();
      });
      infoline.appendChild(checkbox);

      let checkboxLabel = document.createElement('label');
      checkboxLabel.setAttribute('for', `h2zy-chk-${i}`);
      checkboxLabel.className = 'df-cc wh-14 check pos-r';
      checkboxLabel.innerHTML = '<btn-check-tick></btn-check-tick>';
      infoline.appendChild(checkboxLabel);

      let numSpan = document.createElement('span');
      numSpan.setAttribute('data-h2zy-num', '');
      numSpan.className = 'op6';
      numSpan.innerHTML = `${i + 1}. `;
      infoline.appendChild(numSpan);

      // 元素名称输入框
      const title = document.createElement('input');
      title.setAttribute('data-h2zy-name', i);
      title.className = 'w100 nobod';
      title.type = 'text';
      // 使用customName或默认名称
      const defaultName = `${h2zyValue ? h2zyValue : tagName} ${id ? `#${id}` : ''} ${classes.length > 0 ? `.${classes[0]}` : ''}`;
      title.value = item.customName || defaultName;
      title.setAttribute('data-input', '');
      title.addEventListener('change', async (e) => {
        const newName = e.target.value.trim();
        // 更新elementSnapshots
        elementSnapshots[i].customName = newName || null;
        // 更新全局数据中的customName
        if (h2zyValue) {
          try {
            await sendMessageToContent({
              type: 'setElementData',
              dataH2zy: h2zyValue,
              data: { customName: newName || null }
            });
          } catch (err) {
            console.warn('更新customName失败:', err);
          }
        }
      });
      infoline.appendChild(title);

      const locateBtn = document.createElement('div');
      locateBtn.setAttribute('data-tips', 'auto');
      locateBtn.setAttribute('data-tips-x', 'right');
      locateBtn.setAttribute('data-tips-y', 'top');
      locateBtn.setAttribute('data-tips-text', '定位');
      locateBtn.setAttribute('data-tips-text-en', 'Locate');
      locateBtn.className = 'df-cc wh-20 pos-r';
      locateBtn.innerHTML = '<btn-locate data-btn="op"></btn-locate>';
      locateBtn.addEventListener('click', () => {
        locateElement(item.selector, i, h2zyValue);
      });
      infoline.appendChild(locateBtn);

      const copyBtn = document.createElement('div');
      copyBtn.setAttribute('data-tips', 'auto');
      copyBtn.setAttribute('data-tips-x', 'right');
      copyBtn.setAttribute('data-tips-y', 'top');
      copyBtn.setAttribute('data-tips-text', '复制数据');
      copyBtn.setAttribute('data-tips-text-en', 'Copy Json');
      copyBtn.className = 'df-cc wh-18 pos-r';
      copyBtn.innerHTML = '<btn-copy data-btn="op"></btn-copy>';
      copyBtn.addEventListener('click', () => {
        copySingleJSON(i);
      });
      infoline.appendChild(copyBtn);

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
          elements.viewAll.checked = false;
        }
      });
      infoline.appendChild(viewbtn);

      let viewbtnLabel = document.createElement('label');
      viewbtnLabel.setAttribute('for', `h2zy-view-${i}`);
      viewbtnLabel.setAttribute('data-tips', 'auto');
      viewbtnLabel.setAttribute('data-tips-x', 'right');
      viewbtnLabel.setAttribute('data-tips-y', 'top');
      viewbtnLabel.setAttribute('data-tips-text', '预览图');
      viewbtnLabel.setAttribute('data-tips-text-en', 'Preview');
      viewbtnLabel.className = 'df-cc wh-20 pos-r';
      viewbtnLabel.innerHTML = '<export-img data-btn="op"></export-img>';
      infoline.appendChild(viewbtnLabel);

      //刷新按钮
      let refreshBtn = document.createElement('div');
      refreshBtn.setAttribute('id', `h2zy-reset-${i}`);
      refreshBtn.setAttribute('data-tips', 'auto');
      refreshBtn.setAttribute('data-tips-x', 'right');
      refreshBtn.setAttribute('data-tips-y', 'top');
      refreshBtn.setAttribute('data-tips-text', '刷新数据');
      refreshBtn.setAttribute('data-tips-text-en', 'Refresh Data');
      refreshBtn.className = 'df-cc wh-20 pos-r';
      refreshBtn.innerHTML = '<btn-reset data-btn="op"></btn-reset>';
      refreshBtn.addEventListener('click', async () => {
        await refreshElementSnapshot(i, item.selector, h2zyValue);
      });
      infoline.appendChild(refreshBtn);

      listItem.appendChild(infoline);
      listItem.appendChild(previewbox);

      elements.elementsList.appendChild(listItem);
    }

    updateExportButton();
  }

  /**
   * 为列表中的所有元素生成预览图（逐个调用刷新函数）
   */
  async function generatePreviewsForList() {
    if (elementSnapshots.length === 0) {
      return;
    }
    
    // 显示状态提示
    showStatus(['正在截取预览图，请稍候','Capturing previews, please wait'], 'loading', elementSnapshots.length * 2000);
    
    // 遍历所有元素，逐个生成预览图
    for (let i = 0; i < elementSnapshots.length; i++) {
      const item = elementSnapshots[i];
      const dataH2zy = item.dataH2zy;
      
      // 如果已经有缓存预览图，跳过
      if (item.preview && item.preview.startsWith('data:image') && !item.preview.includes('placeholder')) {
        continue;
      }
      
      // 如果没有data-h2zy，跳过（无法使用刷新函数）
      if (!dataH2zy) {
        continue;
      }
      
      try {
        // 获取列表项并设置截图状态为"picking"（正在截图）
        const listItem = document.querySelector(`[data-tag-element][data-index="${i}"]`);
        if (listItem) {
          listItem.setAttribute('data-h2zy-picking', 'picking');
        }
        
        // 先显示定位框，让用户知道正在截取元素
        await sendMessageToContent({
          type: 'highlightElement',
          selector: item.selector,
          index: item.index !== undefined ? item.index : i,
          dataH2zy: dataH2zy
        });
        
        // 等待定位框显示稳定后截图（缩短等待时间，定位框显示1秒后开始截图）
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 调用刷新函数生成预览图（与刷新按钮调用的函数相同）
        const refreshResponse = await sendMessageToContent({
          type: 'regeneratePreviewByDataH2zy',
          dataH2zy: dataH2zy
        });
        
        if (refreshResponse && refreshResponse.success && refreshResponse.imageData) {
          // 更新elementSnapshots中的预览图
          elementSnapshots[i].preview = refreshResponse.imageData;
          elementSnapshots[i].snapshot = refreshResponse.snapshot;
          elementSnapshots[i].selector = refreshResponse.selector;
          elementSnapshots[i].index = refreshResponse.index;
          
          // 更新UI中的预览图
          if (listItem) {
            const previewbox = listItem.querySelector('[data-previewbox]');
            if (previewbox) {
              const preview = previewbox.querySelector('img');
              if (preview) {
                preview.src = refreshResponse.imageData;
              }
            }
            // 设置截图状态为"done"（已完成）
            listItem.setAttribute('data-h2zy-picking', 'done');
          }
        } else {
          // 截图失败，移除状态属性
          if (listItem) {
            listItem.setAttribute('data-h2zy-picking', '');
          }
        }
      } catch (error) {
        console.warn(`为元素 ${i} (data-h2zy: ${dataH2zy}) 生成预览图失败:`, error);
        // 失败时尝试使用缓存
        if (dataH2zy) {
          try {
            const cacheResponse = await sendMessageToContent({
              type: 'getCachedScreenshot',
              dataH2zy: dataH2zy
            });
            if (cacheResponse && cacheResponse.success && cacheResponse.imageData) {
              elementSnapshots[i].preview = cacheResponse.imageData;
            }
          } catch (e) {
            // 忽略缓存获取失败
          }
        }
      }
    }
  }

  /**
   * 定位元素（在 body 顶部生成线框）
   * 优先使用data-h2zy查找元素，确保获取实时的准确的元素状态
   */
  async function locateElement(selector, index, dataH2zy) {
    try {
      const response = await sendMessageToContent({
        type: 'highlightElement',
        selector: selector,
        index: index,
        dataH2zy: dataH2zy || null
      });
      
      if (response && response.success) {
        showStatus(['元素已定位','Element located'], 'success');
      } else {
        showStatus([`定位失败: ${response?.error || '未知错误'}`,`Failed to locate: ${response?.error || 'Unknown error'}`], 'error');
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
   * 刷新单个元素的快照和预览图
   * 根据 data-h2zy 值快速定位并重新生成（不使用缓存）
   */
  async function refreshElementSnapshot(index, selector, dataH2zy) {
    if (index < 0 || index >= elementSnapshots.length) {
      showStatus(['索引无效','Invalid index'], 'error');
      return;
    }

    if (!dataH2zy) {
      showStatus(['元素缺少data-h2zy属性','Element missing data-h2zy attribute'], 'error');
      return;
    }

    try {
      // 获取列表项并设置截图状态为"picking"（正在截图）
      const listItem = document.querySelector(`[data-tag-element][data-index="${index}"]`);
      if (listItem) {
        listItem.setAttribute('data-h2zy-picking', 'picking');
      }
      
      showStatus(['正在刷新...','Refreshing...'], 'success');

      // 调用regeneratePreviewByDataH2zy强制刷新（不使用缓存）
      const regenerateResponse = await sendMessageToContent({
        type: 'regeneratePreviewByDataH2zy',
        dataH2zy: dataH2zy
      });

      if (regenerateResponse && regenerateResponse.success) {
        // 更新elementSnapshots
        elementSnapshots[index].snapshot = regenerateResponse.snapshot;
        elementSnapshots[index].selector = regenerateResponse.selector;
        elementSnapshots[index].index = regenerateResponse.index;
        elementSnapshots[index].preview = regenerateResponse.imageData;
        
        // 保留customName（不更新）
        
        // 重新渲染该元素项
        await updateElementItemUI(index);
        
        // 等待图片加载完成（如果预览图存在）
        if (regenerateResponse.imageData) {
          await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // 即使加载失败也继续
            img.src = regenerateResponse.imageData;
            // 设置超时，避免无限等待
            setTimeout(() => resolve(), 2000);
          });
        }
        
        // 设置截图状态为"done"（已完成）
        if (listItem) {
          listItem.setAttribute('data-h2zy-picking', 'done');
        }
        
        // 等待一下确保所有更新完成
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 批量刷新时不显示单个元素的成功提示，避免频繁更新状态
        // showStatus([`已刷新第 ${index + 1} 个元素`,`Refreshed the ${index + 1}th element`], 'success');
        return;
      }

      // 刷新失败，移除状态属性
      if (listItem) {
        listItem.setAttribute('data-h2zy-picking', '');
      }
      
      throw new Error(regenerateResponse?.error || getMessage(['刷新失败','Refresh failed']));
    } catch (error) {
      console.error('刷新元素快照失败:', error);
      
      // 获取列表项并移除截图状态
      const listItem = document.querySelector(`[data-tag-element][data-index="${index}"]`);
      if (listItem) {
        listItem.setAttribute('data-h2zy-picking', '');
      }
      
      showStatus([`刷新失败: ${error.message}`,`Refresh failed: ${error.message}`], 'error');
    }
  }

  /**
   * 更新单个元素项的 UI
   */
  async function updateElementItemUI(index) {
    if (index < 0 || index >= elementSnapshots.length) {
      return;
    }

    const item = elementSnapshots[index];
    const snapshot = item.snapshot;
    const listItem = document.querySelector(`[data-tag-element][data-index="${index}"]`);
    
    if (!listItem) {
      return;
    }

    let lang = ROOT.getAttribute('data-language');
    
    // 更新标题（保留customName或使用默认名称）
    const title = listItem.querySelector(`input[data-h2zy-name="${index}"]`);
    if (title) {
      const tagName = snapshot.tagName || 'unknown';
      const id = snapshot.id || '';
      const classes = snapshot.classes || [];
      const h2zyValue = snapshot.dataH2zy || '';
      const defaultName = `${index + 1}.${h2zyValue ? h2zyValue : tagName} ${id ? `#${id}` : ''} ${classes.length > 0 ? `.${classes[0]}` : ''}`;
      // 保留customName或使用默认名称
      title.value = item.customName || defaultName;
    }

    // 更新预览图
    const previewbox = listItem.querySelector('[data-previewbox]');
    if (previewbox && item.preview) {
      const preview = previewbox.querySelector('img');
      if (preview) {
        preview.src = item.preview;
        // 重新计算尺寸
        preview.onload = function() {
          const bodradius = snapshot.styles.borderRadius || '';
          if(this.width > 360) {
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
      }
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
      
      // 获取页面 URL
      const pageUrl = (await chrome.tabs.query({ active: true, currentWindow: true }))[0].url;
      
      // 创建 ZIP 压缩包
      const zip = new JSZip();
      
      // 生成时间戳（用于文件命名）
      const timestamp = Date.now();
      
      // 为每个元素创建独立的 JSON 文件和对应的预览图
      for (let idx = 0; idx < selectedSnapshots.length; idx++) {
        const item = selectedSnapshots[idx];
        const snapshot = item.snapshot;
        const h2zyValue = snapshot.dataH2zy || '';
        const tagName = snapshot.tagName || 'unknown';
        const elementIndex = idx + 1;
        
        // 生成文件名：使用customName（用户编辑的名称）+ 时间戳
        // 如果customName为空，使用默认名称
        let fileName = '';
        if (item.customName && item.customName.trim()) {
          // 清理文件名（移除不允许的字符）
          const cleanName = item.customName.trim().replace(/[<>:"/\\|?*]/g, '_');
          fileName = `${cleanName}`;
        } else {
          // 使用默认名称
          const defaultName = h2zyValue ? `${elementIndex}-${h2zyValue}` : `${elementIndex}-${tagName}`;
          fileName = `${defaultName}`;
        }
        
        // 创建单个元素的 JSON 数据
        // element 属性必须是一个对象，包含 tagName, id, children 等属性
        // 不能是数组 elements，也不能是展开的形式
        // 为了保持向后兼容，从 element 对象及其所有子元素中递归移除 dataH2zy 字段（已在顶层）
        function removeDataH2zyFromElement(elementObj) {
          if (!elementObj || typeof elementObj !== 'object') {
            return elementObj;
          }
          
          // 创建副本，避免修改原对象
          const cleaned = { ...elementObj };
          
          // 移除 dataH2zy 字段
          if (cleaned.dataH2zy !== undefined) {
            delete cleaned.dataH2zy;
          }
          
          // 递归处理 children 数组
          if (Array.isArray(cleaned.children)) {
            cleaned.children = cleaned.children.map(child => removeDataH2zyFromElement(child));
          }
          
          return cleaned;
        }
        
        const elementForExport = removeDataH2zyFromElement(snapshot);
        
        const elementData = {
          timestamp: new Date().toISOString(),
          url: pageUrl,
          index: elementIndex,
          name: item.customName || fileName,
          selector: item.selector,
          dataH2zy: h2zyValue,
          element: elementForExport // 移除所有 dataH2zy 后的 snapshot，保持与旧格式兼容
        };
        
        // 添加 JSON 文件（使用文件名）
        const json = JSON.stringify(elementData, null, 2);
        zip.file(`${fileName}.json`, json);
        
        // 获取预览图（优先使用item.preview，如果没有则从缓存获取）
        let previewImage = item.preview || null;
        
        // 如果还没有预览图，且有dataH2zy，从缓存获取
        if (!previewImage && h2zyValue) {
          try {
            const cacheResponse = await sendMessageToContent({
              type: 'getCachedScreenshot',
              dataH2zy: h2zyValue
            });
            if (cacheResponse && cacheResponse.success && cacheResponse.imageData) {
              previewImage = cacheResponse.imageData;
            }
          } catch (e) {
            console.warn('获取缓存预览图失败:', e);
          }
        }
        
        // 添加对应的预览图（使用相同的文件名）
        if (previewImage) {
          // 将 base64 图片转换为二进制
          const base64Data = previewImage.replace(/^data:image\/\w+;base64,/, '');
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          zip.file(`${fileName}.png`, bytes);
        }
      }

      // 生成 ZIP 文件
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      
      // 生成压缩包文件名：简单的时间戳（已在循环前定义）
      const zipFileName = `html2zy_${timestamp}.zip`;
      
      a.download = zipFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showStatus([`成功导出 ${selectedIndices.size} 个元素`,`Successfully exported ${selectedIndices.size} elements`], 'success');
    } catch (error) {
      showStatus([`导出失败: ${error.message}`,`Failed to export: ${error.message}`], 'error');
    }
  }

  /**
   * 初始化：打开插件时自动扫描 [data-h2zy] 元素
   */
  async function initAutoScan() {
    // 设置默认选择器为 [data-h2zy]
    const defaultSelector = '[data-h2zy]';
    elements.cssSelector.value = defaultSelector;
    
    try {
      // 尝试扫描
      const selector = elements.cssSelector.value.trim();
      if (!selector) {
        return;
      }

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
          // 从全局数据获取完整信息（包括preview和customName）
          const allGlobalData = await sendMessageToContent({ type: 'getAllElementsData' });
          const globalDataMap = (allGlobalData && allGlobalData.success) ? allGlobalData.data : {};
          
          // 构建elementSnapshots数组，每个元素引用全局数据
          elementSnapshots = data
            .map((el, idx) => {
              const dataH2zy = el.dataH2zy;
              const globalData = dataH2zy ? globalDataMap[dataH2zy] : null;
              
              return {
                snapshot: el,
                selector: el.selector || selector,
                index: el.index !== undefined ? el.index : idx,
                dataH2zy: dataH2zy,
                // 从全局数据获取preview和customName
                preview: globalData ? (globalData.preview || null) : null,
                customName: globalData ? (globalData.customName || null) : null
              };
            })
            .filter(item => item.snapshot !== null && item.snapshot !== undefined);
          
          // 如果找到了元素
          if (elementSnapshots.length > 0) {
            // 默认选中所有元素
            selectedIndices.clear();
            elementSnapshots.forEach((_, idx) => selectedIndices.add(idx));

            // 显示元素列表
            await renderElementsList();
            
            elements.exportButton.disabled = false;
            showStatus([`找到 ${elementSnapshots.length} 个匹配元素`,`Found ${elementSnapshots.length} matching elements`], 'success');
            return; // 成功找到元素，退出
          }
        }
      }
      
      // 未找到元素，显示错误提示，清空输入框并聚焦
      showStatus(['暂未发现已匹配元素，可先通过选择器扫描','No matched elements found, please scan with selector first'], 'error');
      elements.cssSelector.value = '';
      elements.cssSelector.focus();
      
    } catch (error) {
      // 扫描失败时的处理
      console.warn('自动扫描失败:', error);
      showStatus(['暂未发现已匹配元素，可先通过选择器扫描','No matched elements found, please scan with selector first'], 'error');
      elements.cssSelector.value = '';
      elements.cssSelector.focus();
    }
  }

  elements.tickAll.addEventListener('change', (e) => {
    if (e.target.checked) {
      for (let i = 0; i < elementSnapshots.length; i++) {
        let tickBtn = document.getElementById(`h2zy-chk-${i}`);
        tickBtn.checked = true;
        tickBtn.dispatchEvent(new Event('change'));
      }
    } else {
      for (let i = 0; i < elementSnapshots.length; i++) {
        let tickBtn = document.getElementById(`h2zy-chk-${i}`);
        tickBtn.checked = false;
        tickBtn.dispatchEvent(new Event('change'));
      }
    }
    updateExportButton();
  });

  elements.viewAll.addEventListener('change', (e) => {
    if (e.target.checked) {
      for (let i = 0; i < elementSnapshots.length; i++) {
        let previewBtn = document.getElementById(`h2zy-view-${i}`);
        previewBtn.checked = true;
        previewBtn.dispatchEvent(new Event('change'));
      }
    } else {
      for (let i = 0; i < elementSnapshots.length; i++) {
        let previewBtn = document.getElementById(`h2zy-view-${i}`);
        previewBtn.checked = false;
        previewBtn.dispatchEvent(new Event('change'));
      }
    }
    updateExportButton();
  });

  elements.resetAll.addEventListener('click', async () => {
    // 串行执行刷新，避免并发问题
    showStatus(['正在批量刷新...','Batch refreshing...'], 'loading', 0); // 0表示永久显示直到完成
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < elementSnapshots.length; i++) {
      const item = elementSnapshots[i];
      if (item && item.dataH2zy) {
        try {
          // 直接调用刷新函数，确保完全等待完成
          // refreshElementSnapshot 内部已经等待了所有异步操作（包括图片加载）
          await refreshElementSnapshot(i, item.selector, item.dataH2zy);
          successCount++;
          
          // 额外等待一下确保所有更新完全完成
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`批量刷新元素 ${i} 失败:`, error);
          failCount++;
          // 继续处理下一个元素，不中断整个流程
          // 等待一下再继续下一个，避免连续失败
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    
    updateExportButton();
    showStatus([`批量刷新完成：成功 ${successCount} 个，失败 ${failCount} 个`,`Batch refresh completed: ${successCount} succeeded, ${failCount} failed`], 'success');
  });

  // 事件监听
  elements.scanButton.addEventListener('click', scanElements);
  elements.cssSelector.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      scanElements();
    }
  });
  elements.exportButton.addEventListener('click', exportElements);

  // 页面加载完成后自动扫描
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoScan);
  } else {
    // DOM 已经加载完成，直接执行
    initAutoScan();
  }

})();
