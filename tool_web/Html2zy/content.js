/**
 * Html2zy Content Script
 * 注入到页面中，用于提取元素信息
 */

(function() {
  'use strict';

  // 元素高亮状态
  let highlightOverlay = null;

  // 缓存语言设置（默认英文）
  let cachedLanguage = 'En';

  // 截图缓存管理
  const SCREENSHOT_CACHE_PREFIX = 'h2zy_screenshot_';
  const SCREENSHOT_CACHE_SESSION_KEY = 'h2zy_screenshot_session';
  
  // 全局元素数据管理（以data-h2zy为唯一键，页面生命周期内有效）
  // 结构: { [dataH2zy]: { snapshot, preview, selector, index, customName } }
  let globalElementsData = {};
  const GLOBAL_DATA_STORAGE_KEY = 'h2zy_global_elements_data';
  
  /**
   * 初始化全局数据（页面加载时检查是否需要清除）
   */
  function initGlobalElementsData() {
    try {
      // 使用与screenshot cache相同的session标识，确保同步
      const currentSession = sessionStorage.getItem(SCREENSHOT_CACHE_SESSION_KEY);
      const lastSession = sessionStorage.getItem('h2zy_global_data_session');
      
      // 如果会话不同（页面刷新），清除旧数据
      if (lastSession && lastSession !== currentSession) {
        globalElementsData = {};
        sessionStorage.removeItem(GLOBAL_DATA_STORAGE_KEY);
      } else {
        // 尝试从sessionStorage恢复元数据（如果存在）
        const stored = sessionStorage.getItem(GLOBAL_DATA_STORAGE_KEY);
        if (stored) {
          try {
            const storedData = JSON.parse(stored);
            // 只恢复元数据（selector, index, customName），snapshot需要重新生成
            globalElementsData = {};
            for (const [key, value] of Object.entries(storedData)) {
              globalElementsData[key] = {
                selector: value.selector,
                index: value.index,
                customName: value.customName || null,
                // snapshot需要在扫描时重新生成
                snapshot: null
              };
            }
          } catch (e) {
            globalElementsData = {};
          }
        }
      }
      
      // 保存当前会话标识（与screenshot cache同步）
      if (currentSession) {
        sessionStorage.setItem('h2zy_global_data_session', currentSession);
      }
    } catch (error) {
      console.warn('初始化全局数据失败:', error);
      globalElementsData = {};
    }
  }
  
  /**
   * 保存全局数据到sessionStorage
   */
  function saveGlobalElementsData() {
    try {
      // 只保存元数据，不保存snapshot和preview（太大）
      // snapshot每次扫描时重新生成，preview从screenshot cache获取
      const dataToSave = {};
      for (const [key, value] of Object.entries(globalElementsData)) {
        dataToSave[key] = {
          selector: value.selector,
          index: value.index,
          customName: value.customName || null
        };
      }
      sessionStorage.setItem(GLOBAL_DATA_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('保存全局数据失败:', error);
    }
  }
  
  /**
   * 获取所有元素数据
   */
  function getAllElementsData() {
    // 为每个元素补充preview（从screenshot cache获取）
    const result = {};
    for (const [dataH2zy, data] of Object.entries(globalElementsData)) {
      result[dataH2zy] = {
        ...data,
        preview: getCachedScreenshot(dataH2zy) || null
      };
    }
    return result;
  }
  
  /**
   * 获取单个元素数据
   */
  function getElementData(dataH2zy) {
    if (!dataH2zy || !globalElementsData[dataH2zy]) {
      return null;
    }
    
    const data = globalElementsData[dataH2zy];
    return {
      ...data,
      preview: getCachedScreenshot(dataH2zy) || null
    };
  }
  
  /**
   * 设置元素数据
   */
  function setElementData(dataH2zy, data) {
    if (!dataH2zy) return false;
    
    // 合并现有数据，保留customName等用户编辑的数据
    const existing = globalElementsData[dataH2zy] || {};
    globalElementsData[dataH2zy] = {
      ...existing,
      ...data,
      dataH2zy: dataH2zy, // 确保包含dataH2zy
      // 保留customName（如果新数据没有提供）
      customName: data.customName !== undefined ? data.customName : existing.customName
    };
    
    // snapshot和preview太大，不持久化到sessionStorage
    // 只持久化元数据
    saveGlobalElementsData();
    return true;
  }
  
  /**
   * 删除元素数据
   */
  function removeElementData(dataH2zy) {
    if (dataH2zy && globalElementsData[dataH2zy]) {
      delete globalElementsData[dataH2zy];
      saveGlobalElementsData();
      return true;
    }
    return false;
  }
  
  // 初始化全局数据
  initGlobalElementsData();
  
  /**
   * 初始化截图缓存（页面加载时清除旧缓存）
   */
  function initScreenshotCache() {
    try {
      const currentSession = Date.now().toString();
      const lastSession = sessionStorage.getItem(SCREENSHOT_CACHE_SESSION_KEY);
      
      // 如果会话不同，清除所有旧缓存
      if (lastSession && lastSession !== currentSession) {
        clearScreenshotCache();
      }
      
      // 保存当前会话标识
      sessionStorage.setItem(SCREENSHOT_CACHE_SESSION_KEY, currentSession);
    } catch (error) {
      console.warn('初始化截图缓存失败:', error);
    }
  }

  /**
   * 清除所有截图缓存
   */
  function clearScreenshotCache() {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(SCREENSHOT_CACHE_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('清除截图缓存失败:', error);
    }
  }

  /**
   * 获取缓存的截图
   */
  function getCachedScreenshot(dataH2zy) {
    if (!dataH2zy) return null;
    
    try {
      const cacheKey = SCREENSHOT_CACHE_PREFIX + dataH2zy;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        // 验证缓存的数据格式
        if (cached.startsWith('data:image')) {
          return cached;
        }
      }
    } catch (error) {
      console.warn('获取缓存截图失败:', error);
    }
    
    return null;
  }

  /**
   * 保存截图到缓存
   */
  function saveScreenshotToCache(dataH2zy, imageData) {
    if (!dataH2zy || !imageData || !imageData.startsWith('data:image')) {
      return false;
    }
    
    try {
      const cacheKey = SCREENSHOT_CACHE_PREFIX + dataH2zy;
      sessionStorage.setItem(cacheKey, imageData);
      return true;
    } catch (error) {
      console.warn('保存截图到缓存失败:', error);
      // 如果存储空间不足，尝试清除一些旧缓存
      try {
        clearScreenshotCache();
        sessionStorage.setItem(cacheKey, imageData);
        return true;
      } catch (retryError) {
        console.warn('重试保存截图缓存失败:', retryError);
        return false;
      }
    }
  }

  // 初始化缓存（页面加载时）
  initScreenshotCache();

  // 监听页面刷新事件，清除缓存
  window.addEventListener('beforeunload', () => {
    clearScreenshotCache();
  });

  /**
   * 根据当前语言获取消息
   * @param {Array} messages - [中文消息, 英文消息]
   * @returns {string} 当前语言对应的消息
   */
  function getMessage(messages) {
    if (!Array.isArray(messages) || messages.length < 2) {
      return messages[0] || String(messages);
    }
    return cachedLanguage === 'Zh' ? messages[0] : messages[1];
  }

  /**
   * 安全地获取元素的 className 字符串
   * 处理 SVG 元素的 SVGAnimatedString 类型
   */
  function getClassName(element) {
    try {
      if (!element) {
        return '';
      }
      
      const className = element.className;
      
      // 如果 className 不存在或为 null/undefined
      if (className === null || className === undefined) {
        return '';
      }
      
      // SVG 元素的 className 是 SVGAnimatedString 对象
      if (typeof className === 'object') {
        // 检查是否有 baseVal 属性（SVGAnimatedString）
        if (className.baseVal !== undefined && className.baseVal !== null) {
          const baseVal = className.baseVal;
          return typeof baseVal === 'string' ? baseVal : String(baseVal || '');
        }
        // 其他对象类型，尝试转换为字符串
        try {
          return String(className);
        } catch (e) {
          return '';
        }
      }
      
      // 普通元素的 className 是字符串
      if (typeof className === 'string') {
        return className;
      }
      
      // 其他情况，强制转换为字符串
      return String(className || '');
    } catch (e) {
      // 任何错误都返回空字符串
      return '';
    }
  }

  /**
   * 获取元素的位置和尺寸信息
   */
  function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    let width = rect.width;
    let height = rect.height;
    
    // SVG 元素特殊处理：使用 SVG 的实际宽高属性
    if (element.tagName && element.tagName.toLowerCase() === 'svg') {
      const svgWidth = element.getAttribute('width');
      const svgHeight = element.getAttribute('height');
      const viewBox = element.getAttribute('viewBox');
      
      // 如果有明确的 width 和 height 属性，优先使用
      if (svgWidth && !svgWidth.includes('%')) {
        const parsedWidth = parseFloat(svgWidth);
        if (!isNaN(parsedWidth) && parsedWidth > 0) {
          width = parsedWidth;
        }
      }
      if (svgHeight && !svgHeight.includes('%')) {
        const parsedHeight = parseFloat(svgHeight);
        if (!isNaN(parsedHeight) && parsedHeight > 0) {
          height = parsedHeight;
        }
      }
      
      // 如果通过 viewBox 计算尺寸
      if (viewBox && (width === 0 || height === 0)) {
        const viewBoxValues = viewBox.split(/\s+/);
        if (viewBoxValues.length >= 4) {
          const viewBoxWidth = parseFloat(viewBoxValues[2]);
          const viewBoxHeight = parseFloat(viewBoxValues[3]);
          if (!isNaN(viewBoxWidth) && viewBoxWidth > 0 && width === 0) {
            width = viewBoxWidth;
          }
          if (!isNaN(viewBoxHeight) && viewBoxHeight > 0 && height === 0) {
            height = viewBoxHeight;
          }
        }
      }
    }
    
    // 如果 getBoundingClientRect 返回的尺寸为 0（元素可能不可见），尝试多种方法获取尺寸
    if (width === 0 || height === 0) {
      // 方法1: 使用 offsetWidth/offsetHeight（即使元素不可见也可能有值）
      if (width === 0 && element.offsetWidth > 0) {
        width = element.offsetWidth;
      }
      if (height === 0 && element.offsetHeight > 0) {
        height = element.offsetHeight;
      }
      
      // 方法2: 如果还是 0，尝试使用 scrollWidth/scrollHeight
      if (width === 0 && element.scrollWidth > 0) {
        width = element.scrollWidth;
      }
      if (height === 0 && element.scrollHeight > 0) {
        height = element.scrollHeight;
      }
      
      // 方法3: 如果还是 0，尝试从计算样式中获取宽高
      if (width === 0 || height === 0) {
        const computed = window.getComputedStyle(element);
        const computedWidth = computed.width;
        const computedHeight = computed.height;
        
        // 解析计算样式中的宽高值（可能是 "100px", "auto", "100%" 等）
        if (width === 0 && computedWidth && computedWidth !== 'auto' && computedWidth !== '0px') {
          const parsedWidth = parseFloat(computedWidth);
          if (!isNaN(parsedWidth) && parsedWidth > 0) {
            width = parsedWidth;
          }
        }
        if (height === 0 && computedHeight && computedHeight !== 'auto' && computedHeight !== '0px') {
          const parsedHeight = parseFloat(computedHeight);
          if (!isNaN(parsedHeight) && parsedHeight > 0) {
            height = parsedHeight;
          }
        }
      }
      
      // 方法4: 如果还是 0，尝试使用 clientWidth/clientHeight
      if (width === 0 && element.clientWidth > 0) {
        width = element.clientWidth;
      }
      if (height === 0 && element.clientHeight > 0) {
        height = element.clientHeight;
      }
    }
    
    return {
      x: rect.left + scrollX,
      y: rect.top + scrollY,
      width: width,
      height: height,
      top: rect.top + scrollY,
      left: rect.left + scrollX,
      right: rect.right + scrollX,
      bottom: rect.bottom + scrollY,
      scrollX: scrollX,
      scrollY: scrollY
    };
  }

  /**
   * 内联化 SVG 样式：将外联样式和 CSS 变量转换为内联样式
   * @param {SVGElement} svgElement - SVG 根元素
   * @returns {SVGElement} - 处理后的 SVG 元素（克隆）
   */
  function inlineSVGStyles(svgElement) {
    try {
      // 克隆 SVG 元素，避免修改原始元素
      const clonedSvg = svgElement.cloneNode(true);
      
      // 获取 SVG 的实际渲染宽高（优先使用 getBoundingClientRect 获取实际渲染尺寸）
      const svgRect = svgElement.getBoundingClientRect();
      let svgWidth = svgRect.width;
      let svgHeight = svgRect.height;
      
      // 如果 getBoundingClientRect 返回的尺寸无效或为 0，尝试其他方法
      if (!svgWidth || svgWidth === 0 || !svgHeight || svgHeight === 0) {
        // 方法1: 尝试从计算样式获取
        const computedStyle = window.getComputedStyle(svgElement);
        const computedWidth = parseFloat(computedStyle.width);
        const computedHeight = parseFloat(computedStyle.height);
        
        if (computedWidth && !isNaN(computedWidth) && computedWidth > 0) {
          svgWidth = computedWidth;
        }
        if (computedHeight && !isNaN(computedHeight) && computedHeight > 0) {
          svgHeight = computedHeight;
        }
        
        // 方法2: 如果仍然无效，尝试从属性获取（排除百分比）
        if (!svgWidth || svgWidth === 0) {
          const widthAttr = svgElement.getAttribute('width');
          if (widthAttr && !widthAttr.includes('%')) {
            const parsedWidth = parseFloat(widthAttr);
            if (!isNaN(parsedWidth) && parsedWidth > 0) {
              svgWidth = parsedWidth;
            }
          }
        }
        
        if (!svgHeight || svgHeight === 0) {
          const heightAttr = svgElement.getAttribute('height');
          if (heightAttr && !heightAttr.includes('%')) {
            const parsedHeight = parseFloat(heightAttr);
            if (!isNaN(parsedHeight) && parsedHeight > 0) {
              svgHeight = parsedHeight;
            }
          }
        }
        
        // 方法3: 如果仍然无效，尝试从 viewBox 计算
        if ((!svgWidth || svgWidth === 0) || (!svgHeight || svgHeight === 0)) {
          const viewBox = svgElement.getAttribute('viewBox');
          if (viewBox) {
            const viewBoxValues = viewBox.split(/\s+/).map(v => parseFloat(v));
            if (viewBoxValues.length >= 4 && !viewBoxValues.some(v => isNaN(v))) {
              const [, , viewBoxWidth, viewBoxHeight] = viewBoxValues;
              if (viewBoxWidth > 0 && viewBoxHeight > 0) {
                // 如果宽度无效，使用 viewBox 的宽高比和已知高度计算
                if (!svgWidth || svgWidth === 0) {
                  if (svgHeight && svgHeight > 0) {
                    svgWidth = (viewBoxWidth / viewBoxHeight) * svgHeight;
                  } else {
                    svgWidth = viewBoxWidth;
                  }
                }
                // 如果高度无效，使用 viewBox 的宽高比和已知宽度计算
                if (!svgHeight || svgHeight === 0) {
                  if (svgWidth && svgWidth > 0) {
                    svgHeight = (viewBoxHeight / viewBoxWidth) * svgWidth;
                  } else {
                    svgHeight = viewBoxHeight;
                  }
                }
              }
            }
          }
        }
        
        // 方法4: 如果仍然无效，使用默认值
        if (!svgWidth || svgWidth === 0) {
          svgWidth = 100; // 默认宽度
        }
        if (!svgHeight || svgHeight === 0) {
          svgHeight = 100; // 默认高度
        }
      }
      
      // 递归处理所有 SVG 子节点
      function processNode(clonedNode, originalNode) {
        if (!clonedNode || clonedNode.nodeType !== 1) return; // 只处理元素节点
        if (!originalNode || originalNode.nodeType !== 1) return;
        
        // 获取原始节点的计算样式
        const computedStyle = window.getComputedStyle(originalNode);
        
        // 处理颜色属性（fill, stroke）
        const colorAttrs = ['fill', 'stroke'];
        colorAttrs.forEach(attr => {
          const computedValue = computedStyle[attr];
          const currentValue = originalNode.getAttribute(attr);
          const inlineStyle = originalNode.style.getPropertyValue(attr);
          
          // 如果当前值包含 CSS 变量，需要检查计算后的值
          if (currentValue && currentValue.includes('var(')) {
            // 如果计算后的值是黑色（rgb(0, 0, 0) 或 #000），可能是变量不存在导致的回退
            // 检查是否真的是变量不存在（通过检查内联样式和属性）
            const isBlackFallback = computedValue === 'rgb(0, 0, 0)' || 
                                   computedValue === 'rgb(0,0,0)' ||
                                   computedValue === '#000' || 
                                   computedValue === '#000000' ||
                                   computedValue === 'black';
            
            if (isBlackFallback) {
              // 检查内联样式和属性，如果都包含 var()，说明变量不存在
              const hasVarInInline = inlineStyle && inlineStyle.includes('var(');
              const hasVarInAttr = currentValue.includes('var(');
              
              if (hasVarInInline || hasVarInAttr) {
                // 变量不存在，设置为透明
                clonedNode.setAttribute(attr, 'transparent');
              } else {
                // 确实是黑色，使用计算后的值
                clonedNode.setAttribute(attr, computedValue);
              }
            } else if (computedValue && computedValue !== 'none' && computedValue !== 'transparent') {
              // 使用计算后的实际颜色值
              clonedNode.setAttribute(attr, computedValue);
            } else if (computedValue === 'none' || computedValue === 'transparent') {
              // 保持透明
              clonedNode.setAttribute(attr, 'transparent');
            }
          } else if (!currentValue || currentValue.includes('url(')) {
            // 没有设置值或使用了 url()，使用计算后的值
            if (computedValue && computedValue !== 'none') {
              // 如果计算值是黑色，且原始没有设置，可能是默认值，保持透明
              const isBlackDefault = computedValue === 'rgb(0, 0, 0)' || 
                                    computedValue === 'rgb(0,0,0)' ||
                                    computedValue === '#000' || 
                                    computedValue === '#000000' ||
                                    computedValue === 'black';
              if (isBlackDefault && !currentValue) {
                // 没有原始值且是黑色，可能是默认值，设置为透明
                clonedNode.setAttribute(attr, 'transparent');
              } else {
                clonedNode.setAttribute(attr, computedValue);
              }
            }
          }
        });
        
        // 处理透明度属性（fill-opacity, stroke-opacity）
        const opacityAttrs = ['fill-opacity', 'stroke-opacity'];
        opacityAttrs.forEach(attr => {
          const currentValue = originalNode.getAttribute(attr);
          const inlineStyle = originalNode.style.getPropertyValue(attr);
          
          // 从计算样式获取值（使用 getPropertyValue，因为 SVG 属性名包含连字符）
          let computedValue = computedStyle.getPropertyValue(attr);
          
          // 如果当前值包含 CSS 变量，需要检查计算后的值
          if (currentValue && currentValue.includes('var(')) {
            // 如果计算值无效（空、NaN、或仍然是变量），设置为 1
            if (!computedValue || computedValue === '' || computedValue.trim() === '' || computedValue.includes('var(') || isNaN(parseFloat(computedValue))) {
              clonedNode.setAttribute(attr, '1');
            } else {
              // 使用计算后的值
              const opacityValue = parseFloat(computedValue);
              if (!isNaN(opacityValue) && opacityValue >= 0 && opacityValue <= 1) {
                clonedNode.setAttribute(attr, opacityValue.toString());
              } else {
                // 值超出范围，设置为 1
                clonedNode.setAttribute(attr, '1');
              }
            }
          } else if (inlineStyle && inlineStyle.includes('var(')) {
            // 内联样式包含变量
            // 如果计算值无效，设置为 1
            if (!computedValue || computedValue === '' || computedValue.trim() === '' || computedValue.includes('var(') || isNaN(parseFloat(computedValue))) {
              clonedNode.setAttribute(attr, '1');
            } else {
              const opacityValue = parseFloat(computedValue);
              if (!isNaN(opacityValue) && opacityValue >= 0 && opacityValue <= 1) {
                clonedNode.setAttribute(attr, opacityValue.toString());
              } else {
                clonedNode.setAttribute(attr, '1');
              }
            }
          } else if (!currentValue) {
            // 没有设置值，检查计算样式
            // 如果计算值不是默认值（1），设置它
            if (computedValue && computedValue.trim() !== '' && computedValue !== '1') {
              const opacityValue = parseFloat(computedValue);
              if (!isNaN(opacityValue) && opacityValue >= 0 && opacityValue <= 1) {
                clonedNode.setAttribute(attr, opacityValue.toString());
              }
            }
          } else {
            // 有值且不包含变量，验证并设置
            const opacityValue = parseFloat(currentValue);
            if (!isNaN(opacityValue) && opacityValue >= 0 && opacityValue <= 1) {
              clonedNode.setAttribute(attr, opacityValue.toString());
            } else {
              // 值无效，设置为 1
              clonedNode.setAttribute(attr, '1');
            }
          }
        });
        
        // 处理 transform
        const transform = computedStyle.transform;
        let currentTransform = originalNode.getAttribute('transform');
        let transformProcessed = false;
        
        // 处理 SVG transform 属性（可能包含 rotate(angle x y) 这种带旋转中心点的旋转）
        if (currentTransform) {
          // 将 rotate(angle x y) 转换为复合模式（translate + rotate + translate）
          // 匹配 rotate(angle x y) 格式，支持空格分隔
          const rotateWithCenterMatch = currentTransform.match(/rotate\s*\(\s*([^\s,)]+)\s+([^\s,)]+)\s+([^\s,)]+)\s*\)/);
          if (rotateWithCenterMatch) {
            const angle = parseFloat(rotateWithCenterMatch[1]);
            const cx = parseFloat(rotateWithCenterMatch[2]);
            const cy = parseFloat(rotateWithCenterMatch[3]);
            
            if (!isNaN(angle) && !isNaN(cx) && !isNaN(cy)) {
              // 转换为复合模式：translate(cx, cy) rotate(angle) translate(-cx, -cy)
              const compositeTransform = `translate(${cx},${cy}) rotate(${angle}) translate(${-cx},${-cy})`;
              
              // 替换原来的 rotate(angle x y) 为复合模式
              // 如果还有其他 transform，需要合并
              let otherTransforms = currentTransform.replace(/rotate\s*\(\s*[^\s,)]+\s+[^\s,)]+\s+[^\s,)]+\s*\)/g, '').trim();
              // 清理多余的空格
              otherTransforms = otherTransforms.replace(/\s+/g, ' ').trim();
              
              if (otherTransforms && otherTransforms.length > 0) {
                // 如果有其他 transform，将复合模式放在前面
                clonedNode.setAttribute('transform', `${compositeTransform} ${otherTransforms}`);
              } else {
                clonedNode.setAttribute('transform', compositeTransform);
              }
              transformProcessed = true;
            }
          }
          
          // 如果还有其他 transform 且没有处理过，保持原值（但不包含变量）
          if (!transformProcessed && !currentTransform.includes('var(') && !currentTransform.match(/rotate\s*\(\s*[^\s,)]+\s+[^\s,)]+\s+[^\s,)]+\s*\)/)) {
            clonedNode.setAttribute('transform', currentTransform);
            transformProcessed = true;
          }
        }
        
        // 处理 CSS transform（计算样式）
        if (transform && transform !== 'none' && !transformProcessed) {
          // 如果当前没有 transform 属性，或者使用的是 CSS 变量，使用计算后的值
          if (!currentTransform || currentTransform.includes('var(')) {
            // 将 matrix() 转换为 SVG transform 格式
            if (transform.startsWith('matrix')) {
              // matrix(a, b, c, d, e, f) -> transform="matrix(a b c d e f)"
              const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
              if (matrixMatch) {
                const values = matrixMatch[1].split(',').map(v => v.trim()).join(' ');
                clonedNode.setAttribute('transform', `matrix(${values})`);
              }
            } else if (transform.startsWith('matrix3d')) {
              // matrix3d 转换为 2D matrix（取前 6 个值）
              const matrixMatch = transform.match(/matrix3d\(([^)]+)\)/);
              if (matrixMatch) {
                const values = matrixMatch[1].split(',').map(v => v.trim()).slice(0, 6).join(' ');
                clonedNode.setAttribute('transform', `matrix(${values})`);
              }
            } else {
              // 其他 transform 值直接使用
              clonedNode.setAttribute('transform', transform);
            }
          }
        }
        
        // 处理宽高百分比
        const width = originalNode.getAttribute('width');
        const height = originalNode.getAttribute('height');
        
        if (width && width.includes('%')) {
          const percent = parseFloat(width) / 100;
          const actualWidth = svgWidth * percent;
          if (!isNaN(actualWidth) && actualWidth > 0) {
            clonedNode.setAttribute('width', actualWidth);
          }
        }
        
        if (height && height.includes('%')) {
          const percent = parseFloat(height) / 100;
          const actualHeight = svgHeight * percent;
          if (!isNaN(actualHeight) && actualHeight > 0) {
            clonedNode.setAttribute('height', actualHeight);
          }
        }
        
        // 处理 viewBox 相关的百分比（x, y, width, height）
        const x = originalNode.getAttribute('x');
        const y = originalNode.getAttribute('y');
        const cx = originalNode.getAttribute('cx');
        const cy = originalNode.getAttribute('cy');
        const r = originalNode.getAttribute('r');
        const rx = originalNode.getAttribute('rx');
        const ry = originalNode.getAttribute('ry');
        
        // 处理 x, y 百分比
        if (x && x.includes('%')) {
          const percent = parseFloat(x) / 100;
          const actualX = svgWidth * percent;
          if (!isNaN(actualX)) {
            clonedNode.setAttribute('x', actualX);
          }
        }
        if (y && y.includes('%')) {
          const percent = parseFloat(y) / 100;
          const actualY = svgHeight * percent;
          if (!isNaN(actualY)) {
            clonedNode.setAttribute('y', actualY);
          }
        }
        
        // 处理 cx, cy 百分比
        if (cx && cx.includes('%')) {
          const percent = parseFloat(cx) / 100;
          const actualCx = svgWidth * percent;
          if (!isNaN(actualCx)) {
            clonedNode.setAttribute('cx', actualCx);
          }
        }
        if (cy && cy.includes('%')) {
          const percent = parseFloat(cy) / 100;
          const actualCy = svgHeight * percent;
          if (!isNaN(actualCy)) {
            clonedNode.setAttribute('cy', actualCy);
          }
        }
        
        // 处理 r, rx, ry 百分比（相对于 SVG 的较小边）
        const svgSize = Math.min(svgWidth, svgHeight);
        if (r && r.includes('%')) {
          const percent = parseFloat(r) / 100;
          const actualR = svgSize * percent;
          if (!isNaN(actualR) && actualR > 0) {
            clonedNode.setAttribute('r', actualR);
          }
        }
        if (rx && rx.includes('%')) {
          const percent = parseFloat(rx) / 100;
          const actualRx = svgWidth * percent;
          if (!isNaN(actualRx) && actualRx > 0) {
            clonedNode.setAttribute('rx', actualRx);
          }
        }
        if (ry && ry.includes('%')) {
          const percent = parseFloat(ry) / 100;
          const actualRy = svgHeight * percent;
          if (!isNaN(actualRy) && actualRy > 0) {
            clonedNode.setAttribute('ry', actualRy);
          }
        }
        
        // 处理其他可能包含 CSS 变量的属性
        const opacity = computedStyle.opacity;
        if (opacity !== '1' && opacity !== '') {
          const currentOpacity = originalNode.getAttribute('opacity');
          if (!currentOpacity || currentOpacity.includes('var(')) {
            clonedNode.setAttribute('opacity', opacity);
          }
        }
        
        // 递归处理子节点
        const clonedChildren = Array.from(clonedNode.children);
        const originalChildren = Array.from(originalNode.children);
        for (let i = 0; i < Math.min(clonedChildren.length, originalChildren.length); i++) {
          processNode(clonedChildren[i], originalChildren[i]);
        }
      }
      
      // 处理根 SVG 元素的宽高：使用实际渲染尺寸替换所有宽高值（包括百分比、100%等）
      // 确保 svgCode 中的宽高是实际像素值，而不是百分比或其他相对值
      if (svgWidth && svgWidth > 0) {
        clonedSvg.setAttribute('width', svgWidth);
      }
      if (svgHeight && svgHeight > 0) {
        clonedSvg.setAttribute('height', svgHeight);
      }
      
      // 处理所有子节点（同时处理克隆节点和原始节点）
      const clonedChildren = Array.from(clonedSvg.children);
      const originalChildren = Array.from(svgElement.children);
      for (let i = 0; i < Math.min(clonedChildren.length, originalChildren.length); i++) {
        processNode(clonedChildren[i], originalChildren[i]);
      }
      
      return clonedSvg;
    } catch (e) {
      console.warn('Failed to inline SVG styles:', e);
      // 如果处理失败，返回原始元素的克隆
      return svgElement.cloneNode(true);
    }
  }

  /**
   * 将伪元素解析为独立的 div 元素快照
   */
  function createPseudoElementSnapshot(element, pseudoType, parentPosition) {
    try {
      const pseudoStyle = window.getComputedStyle(element, pseudoType);
      
      // 检查伪元素是否存在（content 不为 'none' 或 'normal'）
      const content = pseudoStyle.content;
      if (!content || content === 'none' || content === 'normal') {
        return null;
      }
      
      // 解析 content 值（去除引号）
      let textContent = null;
      if (content && content !== 'none' && content !== 'normal') {
        // 提取 content 中的文本内容（去除引号）
        const contentMatch = content.match(/["'](.*?)["']/);
        if (contentMatch) {
          textContent = contentMatch[1];
        } else if (content.startsWith('attr(')) {
          // 处理 attr() 情况
          textContent = content;
        } else {
          textContent = content.replace(/["']/g, '');
        }
      }
      
      // 计算伪元素的位置和尺寸
      const parentRect = element.getBoundingClientRect();
      const parentX = parentPosition.x || parentRect.left;
      const parentY = parentPosition.y || parentRect.top;
      const parentWidth = parentPosition.width || parentRect.width;
      const parentHeight = parentPosition.height || parentRect.height;
      
      // 解析位置值
      const parseValue = (value) => {
        if (!value || value === 'auto') return 0;
        const num = parseFloat(value);
        if (isNaN(num)) return 0;
        return num;
      };
      
      const top = parseValue(pseudoStyle.top);
      const right = parseValue(pseudoStyle.right);
      const bottom = parseValue(pseudoStyle.bottom);
      const left = parseValue(pseudoStyle.left);
      const width = parseValue(pseudoStyle.width);
      const height = parseValue(pseudoStyle.height);
      
      // 计算实际位置（相对于父元素）
      let x = parentX;
      let y = parentY;
      
      if (pseudoStyle.position === 'absolute' || pseudoStyle.position === 'fixed') {
        if (left !== 0 && left !== 'auto') {
          x = parentX + left;
        } else if (right !== 0 && right !== 'auto') {
          x = parentX + parentWidth - right - (width || 0);
        }
        
        if (top !== 0 && top !== 'auto') {
          y = parentY + top;
        } else if (bottom !== 0 && bottom !== 'auto') {
          y = parentY + parentHeight - bottom - (height || 0);
        }
      } else {
        // relative 或 static，相对于父元素内容区域
        x = parentX + left;
        y = parentY + top;
      }
      
      // 提取样式
      const styles = {
        // 颜色相关
        color: pseudoStyle.color,
        backgroundColor: pseudoStyle.backgroundColor,
        // 背景图片/渐变处理：如果是渐变色则记录，如果是图片则不记录
        backgroundImage: (() => {
          const bgImage = pseudoStyle.backgroundImage;
          if (!bgImage || bgImage === 'none') {
            return null;
          }
          // 检查是否是渐变色（linear-gradient, radial-gradient, conic-gradient, repeating-linear-gradient, repeating-radial-gradient）
          const gradientPattern = /(linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient)/i;
          if (gradientPattern.test(bgImage)) {
            return bgImage; // 是渐变色，记录下来
          }
          // 如果是图片（url(...)），则不记录（返回 null）
          return null;
        })(),
        // 字体相关
        fontSize: pseudoStyle.fontSize,
        fontFamily: pseudoStyle.fontFamily,
        fontWeight: pseudoStyle.fontWeight,
        fontStyle: pseudoStyle.fontStyle,
        lineHeight: pseudoStyle.lineHeight,
        textAlign: pseudoStyle.textAlign,
        textDecoration: pseudoStyle.textDecoration,
        textTransform: pseudoStyle.textTransform,
        fontVariantCaps: pseudoStyle.fontVariantCaps || pseudoStyle.fontVariant, // 支持 font-variant-caps 和 font-variant
        // 位置相关
        position: pseudoStyle.position,
        top: pseudoStyle.top,
        right: pseudoStyle.right,
        bottom: pseudoStyle.bottom,
        left: pseudoStyle.left,
        // 尺寸相关
        width: pseudoStyle.width,
        height: pseudoStyle.height,
        // 边框相关
        borderColor: pseudoStyle.borderColor,
        borderWidth: pseudoStyle.borderWidth,
        borderStyle: pseudoStyle.borderStyle,
        borderRadius: pseudoStyle.borderRadius,
        borderTopColor: pseudoStyle.borderTopColor,
        borderTopWidth: pseudoStyle.borderTopWidth,
        borderTopStyle: pseudoStyle.borderTopStyle,
        borderRightColor: pseudoStyle.borderRightColor,
        borderRightWidth: pseudoStyle.borderRightWidth,
        borderRightStyle: pseudoStyle.borderRightStyle,
        borderBottomColor: pseudoStyle.borderBottomColor,
        borderBottomWidth: pseudoStyle.borderBottomWidth,
        borderBottomStyle: pseudoStyle.borderBottomStyle,
        borderLeftColor: pseudoStyle.borderLeftColor,
        borderLeftWidth: pseudoStyle.borderLeftWidth,
        borderLeftStyle: pseudoStyle.borderLeftStyle,
        // 其他样式
        display: pseudoStyle.display,
        visibility: pseudoStyle.visibility,
        opacity: pseudoStyle.opacity,
        zIndex: pseudoStyle.zIndex,
        transform: pseudoStyle.transform,
        boxShadow: pseudoStyle.boxShadow
      };
      
      // 判断是否为纯文字伪元素（没有绝对定位、填充色等）
      const isPureText = textContent && 
                        pseudoStyle.position !== 'absolute' && 
                        pseudoStyle.position !== 'fixed' &&
                        (!pseudoStyle.backgroundColor || 
                         pseudoStyle.backgroundColor === 'transparent' || 
                         pseudoStyle.backgroundColor === 'rgba(0, 0, 0, 0)' ||
                         pseudoStyle.backgroundColor === 'rgba(0,0,0,0)') &&
                        (!pseudoStyle.borderWidth || 
                         pseudoStyle.borderWidth === '0px' || 
                         parseFloat(pseudoStyle.borderWidth) === 0) &&
                        (!pseudoStyle.transform || 
                         pseudoStyle.transform === 'none') &&
                        (!pseudoStyle.boxShadow || 
                         pseudoStyle.boxShadow === 'none');
      
      // 如果是纯文字伪元素，标记为 span 类型
      if (isPureText) {
        return {
          tagName: 'span',
          id: null,
          classes: [],
          position: {
            x: parentPosition.x,
            y: parentPosition.y,
            width: 0,
            height: 0
          },
          styles: {
            // 只保留文本相关的样式
            color: pseudoStyle.color,
            fontSize: pseudoStyle.fontSize,
            fontFamily: pseudoStyle.fontFamily,
            fontWeight: pseudoStyle.fontWeight,
            fontStyle: pseudoStyle.fontStyle,
            lineHeight: pseudoStyle.lineHeight,
            textDecoration: pseudoStyle.textDecoration,
            textTransform: pseudoStyle.textTransform,
            fontVariantCaps: pseudoStyle.fontVariantCaps || pseudoStyle.fontVariant // 支持 font-variant-caps 和 font-variant
          },
          textContent: textContent,
          children: [],
          isPseudoText: true, // 标记为伪元素文本
          pseudoType: pseudoType
        };
      }
      
      // 创建伪元素快照（作为 div）
      return {
        tagName: 'div',
        id: null,
        classes: [],
        position: {
          x: x,
          y: y,
          width: width || 0,
          height: height || 0
        },
        styles: styles,
        textContent: textContent,
        children: []
      };
    } catch (e) {
      console.warn(`Failed to extract ${pseudoType} as element:`, e);
      return null;
    }
  }

  /**
   * 提取元素的基础样式信息
   */
  function extractBasicStyles(element) {
    const computed = window.getComputedStyle(element);
    
    return {
      // Box sizing 相关（用于判断宽度是否包含 padding 和 border）
      boxSizing: computed.boxSizing, // 'content-box' 或 'border-box'
      // 颜色相关
      color: computed.color,
      backgroundColor: computed.backgroundColor,
      // 背景图片/渐变处理：如果是渐变色则记录，如果是图片则不记录
      backgroundImage: (() => {
        const bgImage = computed.backgroundImage;
        if (!bgImage || bgImage === 'none') {
          return null;
        }
        // 检查是否是渐变色（linear-gradient, radial-gradient, conic-gradient, repeating-linear-gradient, repeating-radial-gradient）
        const gradientPattern = /(linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient)/i;
        if (gradientPattern.test(bgImage)) {
          return bgImage; // 是渐变色，记录下来
        }
        // 如果是图片（url(...)），则不记录（返回 null）
        return null;
      })(),
      borderColor: computed.borderColor,
      borderWidth: computed.borderWidth,
      borderStyle: computed.borderStyle,
      borderRadius: computed.borderRadius,
      borderTopLeftRadius: computed.borderTopLeftRadius,
      borderTopRightRadius: computed.borderTopRightRadius,
      borderBottomRightRadius: computed.borderBottomRightRadius,
      borderBottomLeftRadius: computed.borderBottomLeftRadius,
      borderTopColor: computed.borderTopColor,
      borderTopWidth: computed.borderTopWidth,
      borderTopStyle: computed.borderTopStyle,
      borderRightColor: computed.borderRightColor,
      borderRightWidth: computed.borderRightWidth,
      borderRightStyle: computed.borderRightStyle,
      borderBottomColor: computed.borderBottomColor,
      borderBottomWidth: computed.borderBottomWidth,
      borderBottomStyle: computed.borderBottomStyle,
      borderLeftColor: computed.borderLeftColor,
      borderLeftWidth: computed.borderLeftWidth,
      borderLeftStyle: computed.borderLeftStyle,
      // 字体相关
      fontSize: computed.fontSize,
      fontFamily: computed.fontFamily,
      fontWeight: computed.fontWeight,
      fontStyle: computed.fontStyle,
      lineHeight: computed.lineHeight,
      textAlign: computed.textAlign,
      textDecoration: computed.textDecoration,
      textTransform: computed.textTransform,
      fontVariantCaps: computed.fontVariantCaps || computed.fontVariant, // 支持 font-variant-caps 和 font-variant
      // 文字换行相关
      whiteSpace: computed.whiteSpace, // 'normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line' 等
      wordWrap: computed.wordWrap || computed.overflowWrap, // 'normal', 'break-word' 等
      wordBreak: computed.wordBreak, // 'normal', 'break-all', 'keep-all' 等
      // 定位相关
      position: computed.position,
      zIndex: computed.zIndex,
      // 可见性相关
      opacity: computed.opacity,
      visibility: computed.visibility,
      // 超出裁剪相关
      overflow: computed.overflow,
      overflowX: computed.overflowX,
      overflowY: computed.overflowY,
      // Transform 相关
      transform: computed.transform,
      transformOrigin: computed.transformOrigin,
      transformStyle: computed.transformStyle,
      perspective: computed.perspective,
      perspectiveOrigin: computed.perspectiveOrigin,
      // Padding 相关样式
      padding: computed.padding,
      paddingTop: computed.paddingTop,
      paddingRight: computed.paddingRight,
      paddingBottom: computed.paddingBottom,
      paddingLeft: computed.paddingLeft,
      // Margin 相关样式
      margin: computed.margin,
      marginTop: computed.marginTop,
      marginRight: computed.marginRight,
      marginBottom: computed.marginBottom,
      marginLeft: computed.marginLeft,
      // Display 相关样式
      display: computed.display,
      justifyContent: computed.justifyContent,
      alignItems: computed.alignItems,
      alignContent: computed.alignContent,
      alignSelf: computed.alignSelf,
      flexDirection: computed.flexDirection,
      flexWrap: computed.flexWrap,
      flexGrow: computed.flexGrow,
      flexShrink: computed.flexShrink,
      flexBasis: computed.flexBasis,
      gap: computed.gap,
      rowGap: computed.rowGap,
      columnGap: computed.columnGap,
      gridTemplateColumns: computed.gridTemplateColumns,
      gridTemplateRows: computed.gridTemplateRows,
      gridTemplateAreas: computed.gridTemplateAreas,
      gridAutoColumns: computed.gridAutoColumns,
      gridAutoRows: computed.gridAutoRows,
      gridAutoFlow: computed.gridAutoFlow,
      gridColumn: computed.gridColumn,
      gridRow: computed.gridRow,
      gridArea: computed.gridArea
    };
  }

  /**
   * 获取元素的直接文本内容（不包括子元素的文本）
   */
  function getDirectTextContent(element) {
    if (!element) {
      return null;
    }
    
    // 如果没有子节点，直接返回 null
    if (!element.childNodes || element.childNodes.length === 0) {
      return null;
    }
    
    const textNodes = [];
    for (let i = 0; i < element.childNodes.length; i++) {
      const node = element.childNodes[i];
      // 只提取文本节点（nodeType === 3），不包括元素节点（nodeType === 1）
      // Node.TEXT_NODE 的值是 3
      if (node.nodeType === 3) {
        const text = node.textContent ? node.textContent.trim() : '';
        if (text) {
          textNodes.push(text);
        }
      }
    }
    
    const directText = textNodes.join(' ').trim();
    return directText || null;
  }

  /**
   * 快照单个元素（第一阶段：基础样式）
   */
  /**
   * 检查元素是否是"透明容器"（没有样式和布局，只是作为子元素的容器）
   * 如果是透明容器，应该跳过它，直接将子元素提升到父级
   */
  function isTransparentContainer(element, computed, styles) {
    const tagName = element.tagName.toLowerCase();
    
    // 标准 HTML 标签列表（常见的块级和行内元素）
    const standardTags = [
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'section', 'article', 'aside', 'nav', 'header', 'footer', 'main',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'form', 'fieldset', 'legend', 'label',
      'a', 'button', 'input', 'textarea', 'select', 'option',
      'img', 'video', 'audio', 'canvas', 'svg', 'iframe',
      'blockquote', 'pre', 'code', 'em', 'strong', 'b', 'i', 'u', 's',
      'br', 'hr', 'meta', 'link', 'script', 'style',
      'html', 'head', 'body'
    ];
    
    // 如果是标准标签，不跳过（即使没有样式也可能有语义）
    if (standardTags.includes(tagName)) {
      return false;
    }
    
    // 检查是否有子元素（没有子元素的元素不应该被跳过）
    const hasChildren = element.children && element.children.length > 0;
    if (!hasChildren) {
      return false;
    }
    
    // 检查是否有布局相关的样式
    const hasLayout = computed.position !== 'static' ||
                     computed.display === 'flex' ||
                     computed.display === 'grid' ||
                     computed.display === 'inline-flex' ||
                     computed.display === 'inline-grid' ||
                     computed.float !== 'none';
    
    // 检查是否有视觉样式
    const hasVisualStyles = 
      (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent') ||
      (styles.borderWidth && parseFloat(styles.borderWidth) > 0) ||
      (styles.borderRadius && parseFloat(styles.borderRadius) > 0) ||
      (styles.boxShadow && styles.boxShadow !== 'none') ||
      (styles.opacity && parseFloat(styles.opacity) < 1) ||
      (styles.transform && styles.transform !== 'none') ||
      (styles.paddingTop && parseFloat(styles.paddingTop) > 0) ||
      (styles.paddingRight && parseFloat(styles.paddingRight) > 0) ||
      (styles.paddingBottom && parseFloat(styles.paddingBottom) > 0) ||
      (styles.paddingLeft && parseFloat(styles.paddingLeft) > 0) ||
      (styles.marginTop && parseFloat(styles.marginTop) !== 0) ||
      (styles.marginRight && parseFloat(styles.marginRight) !== 0) ||
      (styles.marginBottom && parseFloat(styles.marginBottom) !== 0) ||
      (styles.marginLeft && parseFloat(styles.marginLeft) !== 0) ||
      (styles.width && styles.width !== 'auto') ||
      (styles.height && styles.height !== 'auto') ||
      (styles.minWidth && styles.minWidth !== 'auto' && styles.minWidth !== '0px') ||
      (styles.minHeight && styles.minHeight !== 'auto' && styles.minHeight !== '0px') ||
      (styles.maxWidth && styles.maxWidth !== 'none') ||
      (styles.maxHeight && styles.maxHeight !== 'none');
    
    // 如果有布局或视觉样式，不是透明容器
    if (hasLayout || hasVisualStyles) {
      return false;
    }
    
    // 检查是否有文本内容（有文本内容的元素不应该被跳过）
    const hasText = element.textContent && element.textContent.trim().length > 0;
    if (hasText) {
      // 检查文本是否只来自子元素（如果是，可以跳过）
      const directText = getDirectTextContent(element);
      if (directText && directText.trim().length > 0) {
        return false; // 有直接文本内容，不是透明容器
      }
    }
    
    // 自定义标签 + 没有布局 + 没有视觉样式 + 只有子元素 = 透明容器
    return true;
  }

  function snapshotElement(element, options = {}) {
    const includeHidden = options.includeHidden !== false;
    const includeInvisible = options.includeInvisible !== false;
    
    // 检查是否应该包含此元素
    const computed = window.getComputedStyle(element);
    const isHidden = computed.display === 'none';
    const isInvisible = computed.visibility === 'hidden' || 
                       computed.opacity === '0' ||
                       computed.opacity === '0.0';
    
    if (isHidden && !includeHidden) {
      return null;
    }
    
    if (isInvisible && !includeInvisible) {
      return null;
    }

    const tagName = element.tagName.toLowerCase();
    const position = getElementPosition(element);
    const styles = extractBasicStyles(element);
    
    // 检查是否是透明容器（自定义标签，没有样式和布局，只是作为子元素的容器）
    if (isTransparentContainer(element, computed, styles)) {
      // 跳过透明容器，直接处理子元素并返回它们的快照数组
      // 注意：这里返回一个特殊对象，包含所有子元素的快照
      const childSnapshots = [];
      if (element.children && element.children.length > 0) {
        for (let i = 0; i < element.children.length; i++) {
          const childSnapshot = snapshotElement(element.children[i], options);
          if (childSnapshot) {
            // 子元素的坐标已经是相对于页面的，但透明容器本身的位置不影响布局
            // 所以子元素的坐标保持不变（相对于透明容器的父元素）
            childSnapshots.push(childSnapshot);
          }
        }
      }
      // 返回一个标记，表示这是被提升的子元素
      // 在调用处需要特殊处理：直接将子元素添加到父级的 children 中
      return {
        _isPromotedChildren: true,
        children: childSnapshots
      };
    }
    
    // 如果是 input 元素，记录 type 属性
    let inputType = null;
    if (tagName === 'input' && element.type) {
      inputType = element.type.toLowerCase();
    }

    const classNameStr = getClassName(element);
    // 确保 classNameStr 是字符串类型
    const safeClassName = typeof classNameStr === 'string' ? classNameStr : String(classNameStr || '');
    
    // 获取文本内容
    let textContent = null;
    
    // 表单元素：优先使用 value，如果没有 value 则使用 placeholder
    const formElements = ['input', 'textarea', 'select', 'button'];
    if (formElements.includes(tagName)) {
      if (tagName === 'input' || tagName === 'textarea') {
        // input 和 textarea：使用 value，如果没有则使用 placeholder
        textContent = element.value || element.placeholder || null;
      } else if (tagName === 'select') {
        // select：使用选中的 option 的文本，如果没有选中则使用第一个 option
        const selectedOption = element.options[element.selectedIndex];
        if (selectedOption) {
          textContent = selectedOption.text || selectedOption.value || null;
        } else if (element.options.length > 0) {
          textContent = element.options[0].text || element.options[0].value || null;
        }
      } else if (tagName === 'button') {
        // button：使用文本内容或 value
        textContent = element.textContent?.trim() || element.value || null;
      }
    } else {
      // 普通元素：获取直接文本内容（不包括子元素的文本）
      const directText = getDirectTextContent(element);
      textContent = directText ? directText.substring(0, 100) : null; // 只保留前100个字符
    }
    
    // 获取 data-h2zy 属性
    const dataH2zy = element.getAttribute('data-h2zy') || null;
    
    const snapshot = {
      tagName: tagName,
      id: element.id || null,
      classes: safeClassName ? safeClassName.split(/\s+/).filter(c => c) : [],
      position: position,
      styles: styles,
      textContent: null, // 初始化为 null，如果只有文本没有子元素才设置
      children: [],
      dataH2zy: dataH2zy // 记录 data-h2zy 属性值
    };
    
    // 如果是 input 元素，记录 type 属性
    if (inputType) {
      snapshot.inputType = inputType;
    }

    // 将伪元素解析为独立的元素
    // ::before 放在 children 数组的开头
    const beforeElement = createPseudoElementSnapshot(element, '::before', position);
    
    // 检查是否有 ::after 伪元素
    let afterElement = null;
    try {
      const afterStyle = window.getComputedStyle(element, '::after');
      const afterContent = afterStyle.content;
      if (afterContent && afterContent !== 'none' && afterContent !== 'normal') {
        afterElement = createPseudoElementSnapshot(element, '::after', position);
      }
    } catch (e) {
      // 忽略错误
    }
    
    // 检查是否有纯文字的伪元素
    const beforeIsText = beforeElement && beforeElement.isPseudoText;
    const afterIsText = afterElement && afterElement.isPseudoText;
    
    // 检查是否有子元素（不包括纯文字伪元素）
    const hasChildren = element.children && element.children.length > 0;
    
    // 收集所有需要合并的文本片段
    const textFragments = [];
    
    // 1. ::before 伪元素文本
    if (beforeIsText) {
      textFragments.push({
        text: beforeElement.textContent,
        styles: beforeElement.styles,
        type: 'before'
      });
    }
    
    // 2. 原容器文本
    if (textContent) {
      textFragments.push({
        text: textContent,
        styles: {
          color: styles.color,
          fontSize: styles.fontSize,
          fontFamily: styles.fontFamily,
          fontWeight: styles.fontWeight,
          fontStyle: styles.fontStyle,
          lineHeight: styles.lineHeight,
          textDecoration: styles.textDecoration
        },
        type: 'main'
      });
    }
    
    // 3. ::after 伪元素文本
    if (afterIsText) {
      textFragments.push({
        text: afterElement.textContent,
        styles: afterElement.styles,
        type: 'after'
      });
    }
    
    // 如果有纯文字伪元素或需要合并的文本片段，创建大 span 包裹所有文本
    if (textFragments.length > 0 && (beforeIsText || afterIsText || (textContent && hasChildren))) {
      // 创建大 span（外层容器）
      const wrapperSpan = {
        tagName: 'span',
        id: null,
        classes: [],
        position: {
          x: position.x,
          y: position.y,
          width: 0,
          height: 0
        },
        styles: {
          // 使用原容器的文本样式作为默认样式
          color: styles.color,
          fontSize: styles.fontSize,
          fontFamily: styles.fontFamily,
          fontWeight: styles.fontWeight,
          fontStyle: styles.fontStyle,
          lineHeight: styles.lineHeight,
          textDecoration: styles.textDecoration,
          // 记录 whiteSpace、wordWrap、wordBreak，用于文本换行判断
          whiteSpace: styles.whiteSpace,
          wordWrap: styles.wordWrap || styles.overflowWrap,
          wordBreak: styles.wordBreak
        },
        textContent: null, // 大 span 不直接包含文本
        children: []
      };
      
      // 将每个文本片段创建为小 span
      textFragments.forEach(fragment => {
        const textSpan = {
          tagName: 'span',
          id: null,
          classes: [],
          position: {
            x: position.x,
            y: position.y,
            width: 0,
            height: 0
          },
          styles: fragment.styles,
          textContent: fragment.text,
          children: []
        };
        wrapperSpan.children.push(textSpan);
      });
      
      snapshot.children.push(wrapperSpan);
    } else if (textContent && !hasChildren && !beforeIsText && !afterIsText) {
      // 只有文本，没有子元素，也没有纯文字伪元素：保留 textContent
      snapshot.textContent = textContent;
    } else if (textContent && hasChildren && !beforeIsText && !afterIsText) {
      // 有文本和子元素，但没有纯文字伪元素：将文本包装成 span
      const textSpanSnapshot = {
        tagName: 'span',
        id: null,
        classes: [],
        position: {
          x: position.x,
          y: position.y,
          width: 0,
          height: 0
        },
        styles: {
          color: styles.color,
          fontSize: styles.fontSize,
          fontFamily: styles.fontFamily,
          fontWeight: styles.fontWeight,
          fontStyle: styles.fontStyle,
          lineHeight: styles.lineHeight,
          textDecoration: styles.textDecoration
        },
        textContent: textContent,
        children: []
      };
      snapshot.children.push(textSpanSnapshot);
    }
    
    // 如果不是纯文字伪元素，将伪元素添加到 children
    if (beforeElement && !beforeIsText) {
      snapshot.children.push(beforeElement);
    }
    if (afterElement && !afterIsText) {
      // afterElement 会在后面添加到 children，这里先不处理
    }

    // 特殊元素处理
    if (tagName === 'svg') {
      // SVG 元素：保留完整的 SVG 代码，用于 Figma 快速导入
      try {
        // 内联化 SVG 样式（将外联样式和 CSS 变量转换为内联样式）
        const inlinedSvg = inlineSVGStyles(element);
        // 使用内联化后的 SVG 代码
        snapshot.svgCode = inlinedSvg.outerHTML || inlinedSvg.innerHTML || element.outerHTML || element.innerHTML;
        snapshot.isSpecialElement = true;
        snapshot.specialType = 'svg';
        // SVG 元素不递归处理子元素，因为已经包含在 svgCode 中
        return snapshot;
      } catch (e) {
        console.warn('Failed to extract SVG code:', e);
        // 如果内联化失败，使用原始 SVG 代码
        try {
          snapshot.svgCode = element.outerHTML || element.innerHTML;
          snapshot.isSpecialElement = true;
          snapshot.specialType = 'svg';
          return snapshot;
        } catch (e2) {
          console.warn('Failed to extract SVG code (fallback):', e2);
        }
      }
    } else if (tagName === 'video') {
      // Video 元素：提取视频源和相关信息
      snapshot.isSpecialElement = true;
      snapshot.specialType = 'video';
      snapshot.videoSrc = element.src || null;
      snapshot.videoPoster = element.poster || null;
      snapshot.videoControls = element.controls || false;
      snapshot.videoAutoplay = element.autoplay || false;
      snapshot.videoLoop = element.loop || false;
      snapshot.videoMuted = element.muted || false;
      // Video 元素通常不需要递归处理子元素（track、source 等）
      return snapshot;
    } else if (tagName === 'canvas') {
      // Canvas 元素：提取画布数据
      snapshot.isSpecialElement = true;
      snapshot.specialType = 'canvas';
      try {
        snapshot.canvasDataURL = element.toDataURL('image/png');
        snapshot.canvasWidth = element.width;
        snapshot.canvasHeight = element.height;
      } catch (e) {
        console.warn('Failed to extract canvas data:', e);
      }
      // Canvas 元素不需要递归处理子元素
      return snapshot;
    } else if (tagName === 'iframe') {
      // Iframe 元素：提取 iframe 源
      snapshot.isSpecialElement = true;
      snapshot.specialType = 'iframe';
      snapshot.iframeSrc = element.src || null;
      snapshot.iframeTitle = element.title || null;
      // Iframe 元素不需要递归处理子元素
      return snapshot;
    } else if (tagName === 'img') {
      // Image 元素：提取图片源和相关信息
      snapshot.isSpecialElement = true;
      snapshot.specialType = 'img';
      snapshot.imgSrc = element.src || null;
      snapshot.imgAlt = element.alt || null;
      snapshot.imgNaturalWidth = element.naturalWidth || null;
      snapshot.imgNaturalHeight = element.naturalHeight || null;
      // Image 元素不需要递归处理子元素
      return snapshot;
    }

    // 普通元素：递归处理子元素
    if (element.children && element.children.length > 0) {
      for (let i = 0; i < element.children.length; i++) {
        const childSnapshot = snapshotElement(element.children[i], options);
        if (childSnapshot) {
          // 检查是否是提升的子元素（透明容器的子元素被提升）
          if (childSnapshot._isPromotedChildren && childSnapshot.children) {
            // 将提升的子元素直接添加到当前快照的 children 中
            for (const promotedChild of childSnapshot.children) {
              // 将坐标转换为相对于当前父元素的坐标
              if (promotedChild.position && position) {
                promotedChild.position.x = promotedChild.position.x - position.x;
                promotedChild.position.y = promotedChild.position.y - position.y;
                // 更新其他相关坐标
                promotedChild.position.left = promotedChild.position.left - position.left;
                promotedChild.position.top = promotedChild.position.top - position.top;
                promotedChild.position.right = promotedChild.position.right - position.right;
                promotedChild.position.bottom = promotedChild.position.bottom - position.bottom;
              }
              snapshot.children.push(promotedChild);
            }
          } else {
            // 普通子元素：将坐标转换为相对于父元素的坐标
            if (childSnapshot.position && position) {
              childSnapshot.position.x = childSnapshot.position.x - position.x;
              childSnapshot.position.y = childSnapshot.position.y - position.y;
              // 更新其他相关坐标
              childSnapshot.position.left = childSnapshot.position.left - position.left;
              childSnapshot.position.top = childSnapshot.position.top - position.top;
              childSnapshot.position.right = childSnapshot.position.right - position.right;
              childSnapshot.position.bottom = childSnapshot.position.bottom - position.bottom;
            }
            snapshot.children.push(childSnapshot);
          }
        }
      }
    }

    // ::after 放在 children 数组的末尾（如果不是纯文字伪元素）
    if (afterElement && !afterElement.isPseudoText) {
      snapshot.children.push(afterElement);
    }

    return snapshot;
  }

  /**
   * 查找所有带 data-h2zy 属性的元素
   */
  function findElementsByDataH2zy() {
    const elements = document.querySelectorAll('[data-h2zy]');
    return Array.from(elements).map(el => ({
      tagName: el.tagName.toLowerCase(),
      id: el.id || null,
      className: getClassName(el),
      dataH2zy: el.getAttribute('data-h2zy'),
      selector: generateSelector(el)
    }));
  }

  /**
   * 为所有匹配的元素注入data-h2zy属性（仅注入属性，不注入UI）
   * 用于后续的定位和截图
   * 注意：如果选择器是 [data-h2zy]，只会为已有该属性的元素注入（不会导致死循环）
   */
  function injectDataH2zyToElements(selector) {
    try {
      const elements = document.querySelectorAll(selector);
      let injectedCount = 0;
      elements.forEach((element, index) => {
        // 检查元素是否已有data-h2zy属性，没有才设置
        // 这样可以避免在选择器是 [data-h2zy] 时导致死循环
        if (!element.hasAttribute('data-h2zy')) {
          const hash = injectDataH2zy(element, index);
          if (hash) {
            injectedCount++;
          }
        }
      });
      return injectedCount;
    } catch (error) {
      console.error('注入data-h2zy失败:', error);
      return 0;
    }
  }

  /**
   * 根据data-h2zy查找元素并重新生成预览图和snapshot（刷新时调用，不使用缓存）
   * 流程：定位（滚动到元素）-> 截图 -> 更新缓存预览图 -> 返回结果
   */
  async function regeneratePreviewByDataH2zy(dataH2zy) {
    try {
      const element = document.querySelector(`[data-h2zy="${dataH2zy}"]`);
      if (!element) {
        throw new Error(getMessage(['未找到对应的元素','Element not found']));
      }
      
      const selector = generateSelector(element);
      const allElements = document.querySelectorAll(selector);
      const index = Array.from(allElements).indexOf(element);
      
      if (index < 0) {
        throw new Error(getMessage(['无法确定元素索引','Cannot determine element index']));
      }
      
      // 1. 先定位元素（滚动到元素位置）
      if (!isElementFullyVisible(element)) {
        await scrollElementToTop(element);
        // 等待滚动完成
        await waitForScrollComplete(element, 3000);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // 2. 重新生成snapshot（不使用全局数据中的缓存）
      const snapshot = snapshotElement(element, {});
      
      // 3. 重新生成预览图（强制刷新，不使用缓存）
      const preview = await generateElementPreview(selector, index, false);
      
      // 4. 更新缓存预览图
      if (preview && preview.startsWith('data:image')) {
        saveScreenshotToCache(dataH2zy, preview);
      }
      
      // 5. 更新全局数据，但保留customName
      const existingCustomName = globalElementsData[dataH2zy]?.customName || null;
      setElementData(dataH2zy, {
        snapshot: snapshot,
        selector: selector,
        index: index,
        customName: existingCustomName // 保留用户编辑的名称
      });
      
      return {
        success: true,
        imageData: preview,
        snapshot: snapshot,
        selector: selector,
        index: index
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 通过选择器快照元素（扫描时调用）
   * 如果元素已有data-h2zy，从全局数据获取；如果没有，创建新的
   */
  function snapshotBySelector(selector, options = {}) {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        throw new Error(getMessage([`未找到匹配选择器 "${selector}" 的元素`,`No elements found matching selector "${selector}"`]));
      }

      // 读取到匹配元素时自动注入data-h2zy属性，方便后续定位和截图
      // 不注入任何UI，只注入属性
      if (options.injectDataH2zy !== false) {
        injectDataH2zyToElements(selector);
      }

      // 处理每个元素，如果已有data-h2zy，从全局数据获取；如果没有，创建新的
      const result = [];
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const dataH2zy = element.getAttribute('data-h2zy');
        
        if (dataH2zy && globalElementsData[dataH2zy]) {
          // 元素已有data-h2zy且全局数据中存在，使用全局数据
          const existingData = globalElementsData[dataH2zy];
          // 更新selector和index（可能变化）
          existingData.selector = selector;
          existingData.index = i;
          // 保留customName（用户编辑的名称）
          result.push({
            ...existingData.snapshot,
            dataH2zy: dataH2zy,
            selector: selector,
            index: i
          });
        } else {
          // 元素没有data-h2zy或全局数据中不存在，创建新的snapshot
          const snapshot = snapshotElement(element, options);
          if (snapshot) {
            const dataH2zy = snapshot.dataH2zy || element.getAttribute('data-h2zy');
            if (dataH2zy) {
              // 保存到全局数据
              setElementData(dataH2zy, {
                snapshot: snapshot,
                selector: selector,
                index: i,
                customName: null // 初始没有自定义名称
              });
            }
            result.push(snapshot);
          }
        }
      }

      return result;
    } catch (error) {
      // 如果错误消息已经包含错误信息，直接抛出；否则添加前缀
      const errorMsg = error.message || getMessage(['未知错误','Unknown error']);
      throw new Error(errorMsg);
    }
  }


  /**
   * 确保元素可见并定位（共用函数，用于截图和定位框生成）
   * 按照截图逻辑依次判断处理，确保元素正常显示
   * @param {Element} element - 要定位的元素
   * @param {string} dataH2zy - 元素的data-h2zy属性值（可选，用于日志）
   * @returns {boolean} 是否成功定位元素
   */
  async function ensureElementVisibleAndPositioned(element, dataH2zy = '') {
    if (!element) {
      return false;
    }

    try {
      // 1. 检查元素是否可见
      if (!isElementVisible(element)) {
        console.warn(`元素 ${dataH2zy || 'unknown'} 不可见`);
        return false;
      }

      // 2. 检查元素是否可以通过滚动定位来显示
      if (!canElementBeScrolledIntoView(element)) {
        console.warn(`元素 ${dataH2zy || 'unknown'} 无法通过滚动定位`);
        return false;
      }

      // 3. 判断元素有没有完全显示在窗口
      if (isElementFullyVisible(element)) {
        // 完全显示，无需滚动
        return true;
      }

      // 4. 未完全显示，滚动到顶部
      await scrollElementToTop(element);
      
      // 5. 滚动后再次判断元素有没有完全展示
      if (isElementFullyVisible(element)) {
        // 完全展示
        return true;
      }

      // 6. 仍未完全展示，但至少部分可见，也算成功
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return true;
      }

      return false;
    } catch (error) {
      console.error(`确保元素可见失败 ${dataH2zy || 'unknown'}:`, error);
      return false;
    }
  }

  /**
   * 在 body 顶部生成定位线框
   * 使用共用的元素定位逻辑，确保元素正常显示后再生成定位框
   */
  async function createPositionFrame(element) {
    // 移除旧的线框
    if (highlightOverlay) {
      highlightOverlay.remove();
      highlightOverlay = null;
    }

    // 获取元素的data-h2zy属性（用于日志和定位）
    const dataH2zy = element.getAttribute('data-h2zy') || '';

    // 使用共用的元素定位逻辑，确保元素正常显示
    const positioned = await ensureElementVisibleAndPositioned(element, dataH2zy);
    
    if (!positioned) {
      console.warn(`无法定位元素 ${dataH2zy || 'unknown'}，无法生成定位框`);
      return false;
    }

    // 等待一下确保滚动完全稳定
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 获取元素位置并创建定位框
    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // 创建线框元素
    const frame = document.createElement('div');
    frame.style.position = 'absolute';
    frame.style.left = (rect.left + scrollX) + 'px';
    frame.style.top = (rect.top + scrollY) + 'px';
    frame.style.width = rect.width + 'px';
    frame.style.height = rect.height + 'px';
    frame.style.border = '2px solid #1cc992';
    frame.style.boxSizing = 'border-box';
    frame.style.pointerEvents = 'none';
    frame.style.zIndex = '2147483647';
    frame.style.backgroundColor = 'rgba(28, 201, 146, 0.1)';
    frame.id = 'html2zy-position-frame';
    
    // 插入到 body 最顶部
    document.body.insertBefore(frame, document.body.firstChild);
    highlightOverlay = frame;

    // 延长显示时间（5秒），确保用户能看到定位框
    setTimeout(() => {
      if (highlightOverlay && highlightOverlay.id === 'html2zy-position-frame') {
        highlightOverlay.remove();
        highlightOverlay = null;
      }
    }, 1000);

    return true;
  }

  /**
   * 高亮指定索引的元素（在 body 顶部生成线框）
   * 优先使用data-h2zy查找元素，确保获取实时的准确的元素状态
   */
  async function highlightElementByIndex(selector, index, dataH2zy = null) {
    try {
      let element = null;

      // 优先通过data-h2zy查找元素（确保获取实时的准确的元素状态）
      if (dataH2zy) {
        element = document.querySelector(`[data-h2zy="${dataH2zy}"]`);
        if (element) {
          // 找到元素，使用共用的定位逻辑生成定位框
          const success = await createPositionFrame(element);
          return success;
        }
        // 如果通过data-h2zy找不到，fallback到selector+index
        console.warn(`通过data-h2zy="${dataH2zy}"未找到元素，尝试使用selector+index`);
      }

      // 使用selector+index查找元素（fallback）
      const elements = document.querySelectorAll(selector);
      if (index >= 0 && index < elements.length) {
        element = elements[index];
        // 使用共用的定位逻辑生成定位框
        const success = await createPositionFrame(element);
        return success;
      }

      return false;
    } catch (error) {
      console.error('高亮元素失败:', error);
      return false;
    }
  }

  /**
   * 生成简单的哈希值（用于data-h2zy属性）
   */
  function generateSimpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * 为元素生成并注入data-h2zy属性
   */
  function injectDataH2zy(element, index) {
    if (!element) return null;
    
    // 如果已有data-h2zy，直接返回
    const existing = element.getAttribute('data-h2zy');
    if (existing) return existing;
    
    // 生成基于元素特征的哈希
    const elementInfo = `${element.tagName}-${element.id || ''}-${index}-${Date.now()}`;
    const hash = generateSimpleHash(elementInfo);
    element.setAttribute('data-h2zy', hash);
    
    return hash;
  }

  /**
   * 生成简单的占位图（纯色背景，无文字）
   * 基于宽高信息快速生成，作为初始值
   */
  function generateSimplePlaceholder(width, height) {
    try {
      const w = Math.max(Math.round(width || 200), 1);
      const h = Math.max(Math.round(height || 150), 1);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = w;
      canvas.height = h;
      
      // 只绘制纯色背景，无文字无边框
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, w, h);
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      // 如果canvas失败，返回最小SVG占位符
      const w = Math.max(Math.round(width || 200), 1);
      const h = Math.max(Math.round(height || 150), 1);
      return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="%23f5f5f5"/></svg>`;
    }
  }

  // 缓存完整的页面截图，供所有元素共享使用
  let cachedFullPageScreenshot = null;
  let cachedScreenshotTimestamp = 0;
  const SCREENSHOT_CACHE_DURATION = 5000; // 5秒内复用截图

  /**
   * 获取完整的页面截图（带缓存）
   */
  async function getFullPageScreenshot(forceRefresh = false) {
    const now = Date.now();
    
    // 如果缓存有效且不强制刷新，直接返回
    if (!forceRefresh && cachedFullPageScreenshot && (now - cachedScreenshotTimestamp) < SCREENSHOT_CACHE_DURATION) {
      return cachedFullPageScreenshot;
    }
    
    try {
      const response = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(getMessage(['截图请求超时','Screenshot request timeout'])));
        }, 10000);
        
        chrome.runtime.sendMessage(
          { type: 'captureTab' },
          (response) => {
            clearTimeout(timeout);
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(response);
            }
          }
        );
      });
      
      if (response && response.success && response.dataUrl) {
        cachedFullPageScreenshot = response.dataUrl;
        cachedScreenshotTimestamp = now;
        return response.dataUrl;
      }
      
      throw new Error(getMessage(['截图失败','Screenshot failed']));
    } catch (error) {
      cachedFullPageScreenshot = null;
      throw error;
    }
  }

  /**
   * 从完整页面截图中裁切元素区域（兼容函数，内部调用带位置参数的版本）
   * @param {HTMLElement} element - 要截图的元素
   * @param {string} fullScreenshotDataUrl - 完整页面截图
   * @param {boolean} preserveFullSize - 是否保持元素完整尺寸（未显示区域透明）
   */
  async function cropElementFromScreenshot(element, fullScreenshotDataUrl, preserveFullSize = false) {
    // 立即获取元素位置
    const rect = element.getBoundingClientRect();
    const visibleRect = getElementVisibleRect(element);
    return cropElementFromScreenshotWithPosition(element, fullScreenshotDataUrl, rect, visibleRect, preserveFullSize);
  }

  /**
   * 从完整页面截图中裁切元素区域（使用指定的位置信息）
   * @param {HTMLElement} element - 要截图的元素（用于验证，实际使用传入的位置）
   * @param {string} fullScreenshotDataUrl - 完整页面截图
   * @param {DOMRect} rect - 元素的位置信息（截图时获取的）
   * @param {Object} visibleRect - 元素可见区域信息（截图时获取的）
   * @param {boolean} preserveFullSize - 是否保持元素完整尺寸（未显示区域透明）
   */
  async function cropElementFromScreenshotWithPosition(element, fullScreenshotDataUrl, rect, visibleRect, preserveFullSize = false) {
    return new Promise((resolve, reject) => {
      // 使用传入的位置信息，而不是重新获取（确保位置和截图对应）
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 验证元素尺寸
      if (rect.width <= 0 || rect.height <= 0) {
        reject(new Error(getMessage(['元素尺寸无效','Invalid element dimensions'])));
        return;
      }
      
      if (viewportWidth <= 0 || viewportHeight <= 0) {
        reject(new Error(getMessage(['视口尺寸无效','Invalid viewport dimensions'])));
        return;
      }
      
      const img = new Image();
      const timeout = setTimeout(() => {
        reject(new Error(getMessage(['图片加载超时','Image load timeout'])));
      }, 10000);
      
      img.onload = function() {
        clearTimeout(timeout);
        try {
          // 使用传入的位置信息，确保位置和截图对应
          // 计算缩放比例
          // Chrome的captureVisibleTab返回的图片尺寸可能与视口尺寸不同（高DPI屏幕）
          // 直接使用图片实际尺寸和视口尺寸的比例
          let scaleX = img.width / viewportWidth;
          let scaleY = img.height / viewportHeight;
          
          // 验证缩放比例
          if (scaleX <= 0 || scaleY <= 0 || !isFinite(scaleX) || !isFinite(scaleY)) {
            console.warn('缩放比例异常', { scaleX, scaleY, imgWidth: img.width, imgHeight: img.height, viewportWidth, viewportHeight });
            // 如果比例异常，尝试使用设备像素比修正
            const devicePixelRatio = window.devicePixelRatio || 1;
            scaleX = img.width / (viewportWidth * devicePixelRatio);
            scaleY = img.height / (viewportHeight * devicePixelRatio);
            
            // 如果还是异常，使用1:1比例（不推荐，但至少不会崩溃）
            if (scaleX <= 0 || scaleY <= 0 || !isFinite(scaleX) || !isFinite(scaleY)) {
              console.error('缩放比例计算失败，使用1:1比例', { imgWidth: img.width, imgHeight: img.height, viewportWidth, viewportHeight, devicePixelRatio });
              scaleX = 1;
              scaleY = 1;
            }
          }
          
          // 创建 Canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (preserveFullSize) {
            // 保持元素完整尺寸，未显示区域透明
            canvas.width = Math.max(Math.round(rect.width * scaleX), 1);
            canvas.height = Math.max(Math.round(rect.height * scaleY), 1);
            
            // 计算可见区域在截图中的位置
            const visibleX = Math.max(0, visibleRect.left * scaleX);
            const visibleY = Math.max(0, visibleRect.top * scaleY);
            const visibleWidth = Math.min(visibleRect.width * scaleX, img.width - visibleX);
            const visibleHeight = Math.min(visibleRect.height * scaleY, img.height - visibleY);
            
            // 计算可见区域在画布中的位置（相对于元素）
            const offsetX = (visibleRect.left - rect.left) * scaleX;
            const offsetY = (visibleRect.top - rect.top) * scaleY;
            
            // 绘制可见区域到画布
            if (visibleWidth > 0 && visibleHeight > 0) {
              ctx.drawImage(
                img,
                Math.round(visibleX), Math.round(visibleY),
                Math.round(visibleWidth), Math.round(visibleHeight),
                Math.round(offsetX), Math.round(offsetY),
                Math.round(visibleWidth), Math.round(visibleHeight)
              );
            }
            // 其他区域保持透明（默认）
          } else {
            // 只裁剪可见区域
            const elementX = Math.max(0, rect.left * scaleX);
            const elementY = Math.max(0, rect.top * scaleY);
            const elementWidth = Math.min(rect.width * scaleX, img.width - elementX);
            const elementHeight = Math.min(rect.height * scaleY, img.height - elementY);
            
            // 验证裁剪区域
            if (elementWidth <= 0 || elementHeight <= 0) {
              reject(new Error(getMessage(['裁剪区域无效','Invalid crop area'])));
              return;
            }
            
            canvas.width = Math.max(Math.round(elementWidth), 1);
            canvas.height = Math.max(Math.round(elementHeight), 1);
            
            // 绘制裁剪后的区域
            ctx.drawImage(
              img,
              Math.round(elementX), Math.round(elementY),
              Math.round(elementWidth), Math.round(elementHeight),
              0, 0,
              canvas.width, canvas.height
            );
          }
          
          resolve(canvas.toDataURL('image/png'));
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = function() {
        clearTimeout(timeout);
        reject(new Error(getMessage(['加载截图图片失败','Failed to load screenshot image'])));
      };
      
      img.src = fullScreenshotDataUrl;
    });
  }

  /**
   * 检查元素是否可见（在DOM中且尺寸有效）
   */
  function isElementVisible(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  /**
   * 检查元素是否可以通过滚动定位来显示
   */
  function canElementBeScrolledIntoView(element) {
    if (!element) return false;
    
    // 检查元素是否在文档中
    if (!document.contains(element)) return false;
    
    // 检查元素是否有有效尺寸
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    
    // 检查元素是否在可滚动容器内
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      const overflow = style.overflow + style.overflowX + style.overflowY;
      if (overflow.includes('scroll') || overflow.includes('auto')) {
        return true;
      }
      parent = parent.parentElement;
    }
    
    // 检查页面是否可滚动
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const documentWidth = Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth
    );
    
    return documentHeight > window.innerHeight || documentWidth > window.innerWidth;
  }

  /**
   * 检查元素是否完全显示在窗口内
   */
  function isElementFullyVisible(element) {
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    return (
      rect.top >= 0 && 
      rect.left >= 0 && 
      rect.bottom <= viewportHeight && 
      rect.right <= viewportWidth &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  /**
   * 获取元素在视口中的可见区域
   */
  function getElementVisibleRect(element) {
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    return {
      top: Math.max(0, rect.top),
      left: Math.max(0, rect.left),
      bottom: Math.min(viewportHeight, rect.bottom),
      right: Math.min(viewportWidth, rect.right),
      width: Math.min(viewportWidth, rect.right) - Math.max(0, rect.left),
      height: Math.min(viewportHeight, rect.bottom) - Math.max(0, rect.top)
    };
  }

  /**
   * 滚动元素到顶部
   */
  async function scrollElementToTop(element) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // 计算元素在文档中的绝对位置
    let elementTop = rect.top + scrollY;
    let elementLeft = rect.left + scrollX;
    
    // 如果元素在可滚动容器内，需要计算相对于容器的位置
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      const parentStyle = window.getComputedStyle(parent);
      const overflow = parentStyle.overflow + parentStyle.overflowX + parentStyle.overflowY;
      if (overflow.includes('scroll') || overflow.includes('auto')) {
        const parentRect = parent.getBoundingClientRect();
        const parentScrollTop = parent.scrollTop || 0;
        const parentScrollLeft = parent.scrollLeft || 0;
        
        // 计算元素相对于滚动容器的位置
        const relativeTop = rect.top - parentRect.top + parentScrollTop;
        const relativeLeft = rect.left - parentRect.left + parentScrollLeft;
        
        // 滚动容器到元素位置
        parent.scrollTo({
          left: relativeLeft,
          top: relativeTop,
          behavior: 'auto'
        });
        
        // 等待容器滚动完成
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 重新获取元素位置
        const newRect = element.getBoundingClientRect();
        elementTop = newRect.top + scrollY;
        elementLeft = newRect.left + scrollX;
        break;
      }
      parent = parent.parentElement;
    }
    
    // 滚动窗口到元素位置（确保元素顶部在视口顶部）
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const currentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // 计算需要滚动的距离
    const targetScrollTop = elementTop;
    const targetScrollLeft = elementLeft;
    
    // 只有当需要滚动时才执行
    if (Math.abs(targetScrollTop - currentScrollTop) > 1 || Math.abs(targetScrollLeft - currentScrollLeft) > 1) {
      // 使用 scrollIntoView 作为主要方法（更可靠）
      element.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'nearest'
      });
      
      // 等待滚动完成
      await waitForScrollComplete(element, 3000);
      
      // 额外等待确保滚动完成
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 验证滚动是否成功
      const afterRect = element.getBoundingClientRect();
      const afterScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // 如果元素顶部仍然不在视口顶部，尝试直接滚动
      if (afterRect.top > 10) {
        const finalTop = afterRect.top + afterScrollTop - 10; // 留10px边距
        window.scrollTo({
          left: targetScrollLeft,
          top: finalTop,
          behavior: 'auto'
        });
        await waitForScrollComplete(element, 3000);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } else {
      // 已经在目标位置，只需等待一下
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }


  /**
   * 生成单个元素的预览图
   * 策略：先检查缓存，然后返回占位图，最后尝试截图替换
   */
  async function generateElementPreview(selector, index, useCachedScreenshot = true) {
    let element = null;
    
    try {
      const elements = document.querySelectorAll(selector);
      if (index < 0 || index >= elements.length) {
        throw new Error(getMessage(['索引超出范围','Index out of range']));
      }

      element = elements[index];
      
      if (!element) {
        throw new Error(getMessage(['元素不存在','Element not found']));
      }

      // 注入data-h2zy属性
      const dataH2zy = injectDataH2zy(element, index);

      // 第一步：检查缓存，如果有且元素仍然存在，直接使用（仅在useCachedScreenshot为true时）
      if (useCachedScreenshot && dataH2zy) {
        const cachedScreenshot = getCachedScreenshot(dataH2zy);
        if (cachedScreenshot) {
          // 验证元素是否仍然存在且位置合理
          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return cachedScreenshot;
          }
        }
      }

      // 获取元素尺寸信息（JSON提取最快）
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // 第二步：立即生成占位图（基于宽高信息）
      const placeholder = generateSimplePlaceholder(width, height);
      
      // 第三步：按照新策略尝试截图
      try {
        let croppedImage = null;
        
        // 使用共用的元素定位逻辑，确保元素正常显示（与定位框生成共用）
        const positioned = await ensureElementVisibleAndPositioned(element, dataH2zy);
        
        if (!positioned) {
          // 无法定位元素，返回占位图
          console.warn(`元素 ${dataH2zy || index} 无法定位，返回占位图`);
          return placeholder;
        }

        // 元素已定位，等待一下确保位置稳定
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 在截图前立即获取元素位置（确保位置和截图对应）
        const rectBeforeScreenshot = element.getBoundingClientRect();
        const visibleRectBeforeScreenshot = getElementVisibleRect(element);
        
        // 判断是否完全可见
        if (isElementFullyVisible(element)) {
          // 完全显示，直接截图并裁剪
          const fullScreenshot = await getFullPageScreenshot(!useCachedScreenshot);
          // 使用截图前获取的位置信息进行裁切
          croppedImage = await cropElementFromScreenshotWithPosition(
            element, 
            fullScreenshot, 
            rectBeforeScreenshot, 
            visibleRectBeforeScreenshot,
            false
          );
        } else {
          // 部分可见，只截取展示的部分，但画布保持元素大小，未能截取的区域保持透明
          const fullScreenshot = await getFullPageScreenshot(!useCachedScreenshot);
          // 使用截图前获取的位置信息进行裁切
          croppedImage = await cropElementFromScreenshotWithPosition(
            element, 
            fullScreenshot, 
            rectBeforeScreenshot, 
            visibleRectBeforeScreenshot,
            true
          );
        }
        
        // 验证截图内容
        if (croppedImage && croppedImage.startsWith('data:image')) {
          // 截图成功，保存到缓存
          if (dataH2zy) {
            saveScreenshotToCache(dataH2zy, croppedImage);
          }
          return croppedImage;
        }
      } catch (screenshotError) {
        // 截图失败，尝试使用缓存（仅在useCachedScreenshot为true时）
        if (useCachedScreenshot && dataH2zy) {
          const cachedScreenshot = getCachedScreenshot(dataH2zy);
          if (cachedScreenshot) {
            console.warn(`元素 ${index} 截图失败，使用缓存:`, screenshotError);
            return cachedScreenshot;
          }
        }
        // 没有缓存或不允许使用缓存，静默处理，返回占位图
        console.warn(`元素 ${index} 截图失败:`, screenshotError);
      }
      
      // 返回占位图
      return placeholder;
      
    } catch (error) {
      console.error('生成预览图过程中出错:', error);
      // 出错时，仅在useCachedScreenshot为true时尝试使用缓存
      if (useCachedScreenshot && element) {
        const dataH2zy = element.getAttribute('data-h2zy');
        if (dataH2zy) {
          const cachedScreenshot = getCachedScreenshot(dataH2zy);
          if (cachedScreenshot) {
            return cachedScreenshot;
          }
        }
      }
      // 没有缓存或不允许使用缓存，返回占位图
      const rect = element ? element.getBoundingClientRect() : { width: 200, height: 150 };
      return generateSimplePlaceholder(rect.width, rect.height);
    }
  }

  /**
   * 批量生成元素预览图
   * 返回：{ previews: [图片数据], failedIndices: [失败序号], message: 提示信息 }
   */
  async function generateElementPreviewsBatch(selector, indices) {
    const previews = [];
    const failedIndices = [];
    
    try {
      const elements = document.querySelectorAll(selector);
      
      // 先为所有元素生成占位图，并检查缓存
      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        if (index >= 0 && index < elements.length) {
          const element = elements[index];
          const rect = element.getBoundingClientRect();
          
          // 注入data-h2zy
          const dataH2zy = injectDataH2zy(element, index);
          
          // 检查缓存
          if (dataH2zy) {
            const cachedScreenshot = getCachedScreenshot(dataH2zy);
            if (cachedScreenshot && rect.width > 0 && rect.height > 0) {
              previews[i] = cachedScreenshot;
              continue; // 使用缓存，跳过后续处理
            }
          }
          
          previews[i] = generateSimplePlaceholder(rect.width, rect.height);
        } else {
          previews[i] = generateSimplePlaceholder(200, 150);
        }
      }
      
      // 第二步：逐个逐个截图更新（模拟刷新逻辑，复用已验证的刷新功能）
      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        if (index < 0 || index >= elements.length) {
          failedIndices.push(index);
          continue;
        }
        
        // 如果已经有缓存，跳过
        if (previews[i] && previews[i].startsWith('data:image') && !previews[i].includes('placeholder')) {
          continue;
        }
        
        const element = elements[index];
        const dataH2zy = element ? element.getAttribute('data-h2zy') : null;
        
        if (!dataH2zy) {
          // 没有data-h2zy，尝试使用generateElementPreview
          try {
            const preview = await generateElementPreview(selector, index, true);
            if (preview && preview.startsWith('data:image')) {
              previews[i] = preview;
            } else {
              failedIndices.push(index);
            }
          } catch (error) {
            console.warn(`批量处理元素 ${index} 失败:`, error);
            failedIndices.push(index);
          }
          continue;
        }
        
        try {
          // 模拟刷新：调用 regeneratePreviewByDataH2zy（已验证可用的刷新逻辑）
          const refreshResult = await regeneratePreviewByDataH2zy(dataH2zy);
          
          if (refreshResult && refreshResult.success && refreshResult.imageData) {
            previews[i] = refreshResult.imageData;
            // regeneratePreviewByDataH2zy 内部已经保存到缓存和全局数据
          } else {
            // 刷新失败，尝试使用缓存
            const cachedScreenshot = getCachedScreenshot(dataH2zy);
            if (cachedScreenshot) {
              previews[i] = cachedScreenshot;
            } else {
              // 没有缓存，保留占位图
              failedIndices.push(index);
            }
          }
        } catch (error) {
          console.warn(`批量处理元素 ${index} (data-h2zy: ${dataH2zy}) 失败:`, error);
          // 尝试使用缓存
          const cachedScreenshot = getCachedScreenshot(dataH2zy);
          if (cachedScreenshot) {
            previews[i] = cachedScreenshot;
          } else {
            failedIndices.push(index);
          }
        }
      }
      
      // 生成提示信息
      let message = null;
      if (failedIndices.length > 0) {
        const indicesStr = failedIndices.map(i => i + 1).join(', ');
        message = getMessage([
          `以下元素无法生成有效预览图（序号：${indicesStr}）`,
          `Unable to generate valid previews for elements (indices: ${indicesStr})`
        ]);
      }
      
      return {
        previews: previews,
        failedIndices: failedIndices,
        message: message
      };
      
    } catch (error) {
      console.error('批量生成预览图失败:', error);
      // 即使出错也返回占位图
      return {
        previews: previews.length > 0 ? previews : indices.map(() => generateSimplePlaceholder(200, 150)),
        failedIndices: failedIndices,
        message: getMessage(['批量生成预览图时发生错误','Error occurred while generating previews in batch'])
      };
    }
  }

  /**
   * 等待滚动完成
   * 通过监听滚动事件和检查元素位置来确保滚动真正完成
   */
  async function waitForScrollComplete(element, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      let lastScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      let lastElementTop = element.getBoundingClientRect().top;
      let lastElementLeft = element.getBoundingClientRect().left;
      let scrollTimer = null;
      let rafId = null;
      
      const checkScrollComplete = () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const currentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const currentRect = element.getBoundingClientRect();
        const currentElementTop = currentRect.top;
        const currentElementLeft = currentRect.left;
        
        // 检查滚动位置和元素位置是否稳定
        const scrollChanged = 
          Math.abs(currentScrollTop - lastScrollTop) > 1 ||
          Math.abs(currentScrollLeft - lastScrollLeft) > 1;
        const elementMoved = 
          Math.abs(currentElementTop - lastElementTop) > 1 ||
          Math.abs(currentElementLeft - lastElementLeft) > 1;
        
        if (scrollChanged || elementMoved) {
          // 滚动还在进行中，更新位置并继续等待
          lastScrollTop = currentScrollTop;
          lastScrollLeft = currentScrollLeft;
          lastElementTop = currentElementTop;
          lastElementLeft = currentElementLeft;
          
          // 清除之前的定时器，重新设置
          if (scrollTimer) clearTimeout(scrollTimer);
          scrollTimer = setTimeout(() => {
            cleanup();
            resolve();
          }, 100); // 100ms 内没有变化则认为滚动完成
          
          // 继续检查
          rafId = requestAnimationFrame(checkScrollComplete);
        } else {
          // 滚动已经稳定，等待一小段时间确保完全停止
          if (scrollTimer) clearTimeout(scrollTimer);
          scrollTimer = setTimeout(() => {
            cleanup();
            resolve();
          }, 50);
        }
        
        // 超时检查
        if (Date.now() - startTime > timeout) {
          cleanup();
          console.warn('等待滚动完成超时，继续执行','Waiting for scroll completion timed out, continuing execution');
          resolve(); // 超时也继续执行，而不是拒绝
        }
      };
      
      const cleanup = () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener('scroll', onScroll, true);
      };
      
      const onScroll = () => {
        // 滚动事件触发时，通过 requestAnimationFrame 检查
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(checkScrollComplete);
      };
      
      // 监听滚动事件（包括所有滚动容器）
      window.addEventListener('scroll', onScroll, true);
      
      // 立即开始检查
      rafId = requestAnimationFrame(checkScrollComplete);
      
      // 初始延迟，给滚动一些启动时间
      setTimeout(() => {
        checkScrollComplete();
      }, 50);
    });
  }

  /**
   * 确保元素在视口内且可见
   */
  async function ensureElementVisible(element, maxAttempts = 3) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const rect = element.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 检查元素是否在视口内
      const isInViewport = 
        rect.top >= 0 && 
        rect.left >= 0 && 
        rect.bottom <= viewportHeight && 
        rect.right <= viewportWidth &&
        rect.width > 0 &&
        rect.height > 0;
      
      if (isInViewport) {
        // 等待一小段时间确保渲染完成
        await new Promise(resolve => setTimeout(resolve, 200));
        return true;
      }
      
      // 滚动元素到视口中心
      element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
      await waitForScrollComplete(element, 2000);
      
      // 等待页面稳定
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // 最后一次检查
    const finalRect = element.getBoundingClientRect();
    return finalRect.width > 0 && finalRect.height > 0;
  }

  /**
   * 使用浏览器原生截图功能生成预览图
   * 使用 Chrome 的 chrome.tabs.captureVisibleTab API
   * 添加重试机制以提高成功率
   */
  async function generatePreviewWithBrowserCapture(element, maxRetries = 3) {
    let lastError = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // 确保元素在视口内且可见
        const isVisible = await ensureElementVisible(element);
        if (!isVisible) {
          throw new Error(getMessage(['元素不在视口内或不可见','Element is not in viewport or not visible']));
        }
        
        // 重新获取元素位置（滚动后可能改变）
        const newRect = element.getBoundingClientRect();
        
        // 验证元素尺寸
        if (newRect.width <= 0 || newRect.height <= 0) {
          throw new Error(getMessage(['元素尺寸无效','Invalid element dimensions']));
        }
        
        // 等待额外的渲染时间，确保所有内容都已加载
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 通过 background script 调用 Chrome 原生截图 API
        const response = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(getMessage(['截图请求超时','Screenshot request timeout'])));
          }, 10000); // 10秒超时
          
          chrome.runtime.sendMessage(
            { type: 'captureTab' },
            (response) => {
              clearTimeout(timeout);
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
              } else {
                resolve(response);
              }
            }
          );
        });
        
        if (!response || !response.success || !response.dataUrl) {
          throw new Error(getMessage(['截图失败: ' + (response?.error || '未知错误'),'Screenshot failed: ' + (response?.error || 'Unknown error')]));
        }

        // 将截图转换为图片，然后在 Canvas 中裁剪元素区域
        const result = await new Promise((resolve, reject) => {
          const img = new Image();
          const imgTimeout = setTimeout(() => {
            reject(new Error(getMessage(['图片加载超时','Image load timeout'])));
          }, 10000);
          
          img.onload = function() {
            clearTimeout(imgTimeout);
            try {
              // 计算设备像素比（处理高 DPI 屏幕）
              const devicePixelRatio = window.devicePixelRatio || 1;
              
              // 截图的实际尺寸可能与页面显示尺寸不同（高 DPI 屏幕）
              // 需要计算缩放比例
              const viewportWidth = window.innerWidth;
              const viewportHeight = window.innerHeight;
              
              // 防止除零错误
              if (viewportWidth <= 0 || viewportHeight <= 0) {
                throw new Error(getMessage(['视口尺寸无效','Invalid viewport dimensions']));
              }
              
              const scaleX = img.width / viewportWidth;
              const scaleY = img.height / viewportHeight;
              
              // 计算元素在截图中的位置和尺寸
              const elementX = Math.max(0, newRect.left * scaleX);
              const elementY = Math.max(0, newRect.top * scaleY);
              const elementWidth = Math.min(newRect.width * scaleX, img.width - elementX);
              const elementHeight = Math.min(newRect.height * scaleY, img.height - elementY);
              
              // 验证裁剪区域
              if (elementWidth <= 0 || elementHeight <= 0) {
                throw new Error(getMessage(['裁剪区域无效','Invalid crop area']));
              }
              
              // 创建 Canvas 并裁剪元素区域
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = Math.max(Math.round(elementWidth), 1);
              canvas.height = Math.max(Math.round(elementHeight), 1);
              
              // 绘制裁剪后的区域
              ctx.drawImage(
                img,
                Math.round(elementX), Math.round(elementY),
                Math.round(elementWidth), Math.round(elementHeight),
                0, 0,
                canvas.width, canvas.height
              );
              
              // 验证canvas内容
              const imageData = ctx.getImageData(0, 0, Math.min(canvas.width, 10), Math.min(canvas.height, 10));
              const hasContent = imageData.data.some((val, idx) => idx % 4 !== 3 && val !== 0);
              
              if (!hasContent && canvas.width > 10 && canvas.height > 10) {
                throw new Error(getMessage(['截图内容为空','Screenshot content is empty']));
              }
              
              // 返回裁剪后的图片数据
              resolve(canvas.toDataURL('image/png'));
            } catch (error) {
              reject(error);
            }
          };
          
          img.onerror = function() {
            clearTimeout(imgTimeout);
            reject(new Error(getMessage(['加载截图图片失败','Failed to load screenshot image'])));
          };
          
          img.src = response.dataUrl;
        });
        
        // 成功返回
        return result;
        
      } catch (error) {
        lastError = error;
        console.warn(`截图尝试 ${attempt + 1}/${maxRetries} 失败:`, error);
        
        // 如果不是最后一次尝试，等待一段时间后重试
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1))); // 递增等待时间
        }
      }
    }
    
    // 所有重试都失败
    throw lastError || new Error(getMessage(['截图失败：所有重试均失败','Screenshot failed: all retries exhausted']));
  }

  /**
   * 使用 Canvas 生成预览图（备用方法）
   * 使用 SVG foreignObject 来渲染 HTML 元素到 Canvas
   */
  async function generatePreviewWithCanvas(element) {
    try {
      const rect = element.getBoundingClientRect();
      
      // 验证元素尺寸
      if (rect.width <= 0 || rect.height <= 0) {
        throw new Error(getMessage(['元素尺寸无效','Invalid element dimensions']));
      }
      
      // 克隆元素以避免影响原页面
      const clonedElement = element.cloneNode(true);
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.width = rect.width + 'px';
      clonedElement.style.height = rect.height + 'px';
      
      // 尝试使用 SVG foreignObject 方法
      try {
        // 获取元素的样式
        const computedStyle = window.getComputedStyle(element);
        const elementHTML = element.outerHTML;
        
        // 创建 SVG，使用 foreignObject 嵌入 HTML
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
            <foreignObject width="${rect.width}" height="${rect.height}">
              <div xmlns="http://www.w3.org/1999/xhtml" style="
                width: ${rect.width}px;
                height: ${rect.height}px;
                overflow: hidden;
                font-family: ${computedStyle.fontFamily || 'Arial'};
                font-size: ${computedStyle.fontSize || '14px'};
                color: ${computedStyle.color || '#000'};
                background: ${computedStyle.backgroundColor || 'transparent'};
              ">
                ${elementHTML}
              </div>
            </foreignObject>
          </svg>
        `;
        
        const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        return new Promise((resolve, reject) => {
          const img = new Image();
          const timeout = setTimeout(() => {
            URL.revokeObjectURL(url);
            reject(new Error(getMessage(['SVG渲染超时','SVG render timeout'])));
          }, 5000);
          
          img.onload = function() {
            clearTimeout(timeout);
            try {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = Math.max(Math.round(rect.width), 1);
              canvas.height = Math.max(Math.round(rect.height), 1);
              
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              URL.revokeObjectURL(url);
              
              resolve(canvas.toDataURL('image/png'));
            } catch (error) {
              URL.revokeObjectURL(url);
              reject(error);
            }
          };
          
          img.onerror = function() {
            clearTimeout(timeout);
            URL.revokeObjectURL(url);
            reject(new Error(getMessage(['SVG图片加载失败','SVG image load failed'])));
          };
          
          img.src = url;
        });
      } catch (svgError) {
        console.warn('SVG方法失败，使用降级方案:', svgError);
        // SVG方法失败，使用更简单的方法
        throw svgError;
      }
    } catch (error) {
      console.error('Canvas生成预览图失败:', error);
      
      // 最后的降级方案：生成一个包含元素信息的占位图
      try {
        const rect = element.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const width = Math.max(rect.width, 200);
        const height = Math.max(rect.height, 150);
        
        canvas.width = width;
        canvas.height = height;
        
        // 绘制背景
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, width, height);
        
        // 绘制边框
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, width, height);
        
        // 绘制文字信息
        ctx.fillStyle = '#999';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const tagName = element.tagName || 'ELEMENT';
        const text = `${tagName} (${Math.round(rect.width)}×${Math.round(rect.height)})`;
        ctx.fillText(text, width / 2, height / 2 - 10);
        
        ctx.font = '12px Arial';
        ctx.fillText(getMessage(['预览图生成失败','Preview generation failed']), width / 2, height / 2 + 10);
        
        return canvas.toDataURL('image/png');
      } catch (fallbackError) {
        console.error('降级方案也失败:', fallbackError);
        // 返回一个最小的占位符 SVG
        const width = Math.max(element.getBoundingClientRect().width || 200, 200);
        const height = Math.max(element.getBoundingClientRect().height || 150, 150);
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="%23f5f5f5" stroke="%23ddd"/><text x="${width/2}" y="${height/2}" text-anchor="middle" font-size="12" fill="%23999">${getMessage(['预览图不可用','Preview unavailable'])}</text></svg>`;
      }
    }
  }

  /**
   * 移除高亮线框
   */
  function removeHighlight() {
    if (highlightOverlay) {
      highlightOverlay.remove();
      highlightOverlay = null;
    }
  }


  /**
   * 生成元素的 CSS 选择器
   */
  function generateSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    
    let selector = element.tagName.toLowerCase();
    const classNameStr = getClassName(element);
    // 确保 classNameStr 是字符串类型
    const safeClassName = typeof classNameStr === 'string' ? classNameStr : String(classNameStr || '');
    if (safeClassName) {
      const classes = safeClassName.split(/\s+/).filter(c => c);
      if (classes.length > 0) {
        selector += '.' + classes[0];
      }
    }
    
    // 添加父元素信息以提高唯一性
    let path = [selector];
    let parent = element.parentElement;
    let depth = 0;
    while (parent && depth < 3) {
      if (parent.id) {
        path.unshift(`#${parent.id}`);
        break;
      }
      path.unshift(parent.tagName.toLowerCase());
      parent = parent.parentElement;
      depth++;
    }
    
    return path.join(' > ');
  }

  /**
   * 监听来自 popup 的消息
   */
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 从消息中获取语言设置并更新缓存
    if (request.language) {
      cachedLanguage = request.language;
    }

    // 处理异步消息
    if (request.type === 'generatePreview') {
      generateElementPreview(request.selector, request.index, request.forceRefresh !== false)
        .then(imageData => {
          sendResponse({ success: true, imageData: imageData });
        })
        .catch(error => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // 保持消息通道开放
    }

    if (request.type === 'generatePreviewsBatch') {
      generateElementPreviewsBatch(request.selector, request.indices || [])
        .then(result => {
          sendResponse({ success: true, ...result });
        })
        .catch(error => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // 保持消息通道开放
    }

    if (request.type === 'regeneratePreviewByDataH2zy') {
      regeneratePreviewByDataH2zy(request.dataH2zy)
        .then(result => {
          sendResponse(result);
        })
        .catch(error => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // 保持消息通道开放
    }

    if (request.type === 'injectDataH2zy') {
      const count = injectDataH2zyToElements(request.selector);
      sendResponse({ success: true, count: count });
      return true;
    }

    if (request.type === 'getCachedScreenshot') {
      const cachedScreenshot = getCachedScreenshot(request.dataH2zy);
      sendResponse({ 
        success: !!cachedScreenshot, 
        imageData: cachedScreenshot || null 
      });
      return true;
    }

    if (request.type === 'getAllElementsData') {
      const allData = getAllElementsData();
      sendResponse({ success: true, data: allData });
      return true;
    }

    if (request.type === 'getElementData') {
      const data = getElementData(request.dataH2zy);
      sendResponse({ success: !!data, data: data });
      return true;
    }

    if (request.type === 'setElementData') {
      const success = setElementData(request.dataH2zy, request.data);
      sendResponse({ success: success });
      return true;
    }

    if (request.type === 'removeElementData') {
      const success = removeElementData(request.dataH2zy);
      sendResponse({ success: success });
      return true;
    }

    try {
      switch (request.type) {
        case 'ping':
          // 用于检查 content script 是否已注入
          sendResponse({ success: true, ready: true });
          break;

        case 'snapshotSelector':
          const selectorSnapshot = snapshotBySelector(request.selector, request.options);
          sendResponse({ success: true, data: selectorSnapshot });
          break;


        case 'highlightElement':
          highlightElementByIndex(request.selector, request.index, request.dataH2zy || null)
            .then(highlighted => {
              sendResponse({ success: highlighted });
            })
            .catch(error => {
              sendResponse({ success: false, error: error.message });
            });
          return true; // 保持消息通道开放

        default:
          sendResponse({ success: false, error: getMessage(['未知的消息类型','Unknown message type']) });
      }
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    
    return true; // 保持消息通道开放以支持异步响应
  });

  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    removeHighlight();
    // 页面刷新时清除截图缓存
    clearScreenshotCache();
  });

})();

