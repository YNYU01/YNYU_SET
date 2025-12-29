/**
 * Html2zy Content Script
 * 注入到页面中，用于提取元素信息
 */

(function() {
  'use strict';

  // 元素高亮状态
  let highlightOverlay = null;

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
            textDecoration: pseudoStyle.textDecoration
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
   * 通过选择器快照元素
   */
  function snapshotBySelector(selector, options = {}) {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        throw new Error(`未找到匹配选择器 "${selector}" 的元素`);
      }

      return Array.from(elements).map(el => snapshotElement(el, options));
    } catch (error) {
      throw new Error(`选择器错误: ${error.message}`);
    }
  }


  /**
   * 在 body 顶部生成定位线框
   */
  function createPositionFrame(element) {
    // 移除旧的线框
    if (highlightOverlay) {
      highlightOverlay.remove();
    }

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

    // 滚动到元素位置
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 3秒后自动移除
    setTimeout(() => {
      if (highlightOverlay) {
        highlightOverlay.remove();
        highlightOverlay = null;
      }
    }, 3000);
  }

  /**
   * 高亮指定索引的元素（在 body 顶部生成线框）
   */
  function highlightElementByIndex(selector, index) {
    try {
      const elements = document.querySelectorAll(selector);
      if (index >= 0 && index < elements.length) {
        createPositionFrame(elements[index]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('高亮元素失败:', error);
      return false;
    }
  }

  /**
   * 生成元素预览图
   * 优先使用浏览器原生截图功能，失败则回退到其他方法
   */
  async function generateElementPreview(selector, index) {
    try {
      const elements = document.querySelectorAll(selector);
      if (index < 0 || index >= elements.length) {
        throw new Error('索引超出范围');
      }

      const element = elements[index];

      try {
        const browserPreview = await generatePreviewWithBrowserCapture(element);
        if (browserPreview) {
          return browserPreview;
        }
      } catch (browserError) {
        console.warn('浏览器原生截图失败，尝试其他方法:', browserError);
      }
    } catch (error) {
      console.error('生成预览图失败:', error);
      // 如果失败，尝试使用 canvas 方法
      try {
        const elements = document.querySelectorAll(selector);
        if (index >= 0 && index < elements.length) {
          return generatePreviewWithCanvas(elements[index]);
        }
      } catch (e) {
        console.error('Canvas 预览图生成也失败:', e);
      }
      throw error;
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
          console.warn('等待滚动完成超时，继续执行');
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
   * 使用浏览器原生截图功能生成预览图
   * 使用 Chrome 的 chrome.tabs.captureVisibleTab API
   */
  async function generatePreviewWithBrowserCapture(element) {
    try {
      // 滚动元素到视口中心（确保元素可见）
      element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
      
      // 等待滚动完成 - 使用更可靠的方法
      await waitForScrollComplete(element);
      
      // 重新获取滚动后的位置
      const newRect = element.getBoundingClientRect();      
      // 通过 background script 调用 Chrome 原生截图 API
      const response = await chrome.runtime.sendMessage({
        type: 'captureTab'
      });
      
      if (!response || !response.success || !response.dataUrl) {
        throw new Error('截图失败: ' + (response?.error || '未知错误'));
      }

      // 将截图转换为图片，然后在 Canvas 中裁剪元素区域
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
          try {
            // 计算设备像素比（处理高 DPI 屏幕）
            const devicePixelRatio = window.devicePixelRatio || 1;
            
            // 截图的实际尺寸可能与页面显示尺寸不同（高 DPI 屏幕）
            // 需要计算缩放比例
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const scaleX = img.width / viewportWidth;
            const scaleY = img.height / viewportHeight;
            
            // 计算元素在截图中的位置和尺寸
            const elementX = newRect.left * scaleX;
            const elementY = newRect.top * scaleY;
            const elementWidth = newRect.width * scaleX;
            const elementHeight = newRect.height * scaleY;
            
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
            
            // 返回裁剪后的图片数据
            resolve(canvas.toDataURL('image/png'));
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = function() {
          reject(new Error('加载截图图片失败'));
        };
        img.src = response.dataUrl;
      });
    } catch (error) {
      console.error('浏览器原生截图失败:', error);
      throw error;
    }
  }

  /**
   * 使用 Canvas 生成预览图（备用方法）
   */
  function generatePreviewWithCanvas(element) {
    try {
      const rect = element.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = Math.max(rect.width, 1);
      canvas.height = Math.max(rect.height, 1);
      
      // 使用 html2canvas 的简化版本或直接绘制
      // 这里使用一个简单的占位符
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#999';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚠', canvas.width / 2, canvas.height / 2);
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Canvas 预览图生成失败:', error);
      // 返回一个占位符 SVG
      return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40"><rect width="60" height="40" fill="%23f0f0f0"/><text x="30" y="20" text-anchor="middle" font-size="10" fill="%23999">⚠</text></svg>';
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
    // 处理异步消息
    if (request.type === 'generatePreview') {
      generateElementPreview(request.selector, request.index)
        .then(imageData => {
          sendResponse({ success: true, imageData: imageData });
        })
        .catch(error => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // 保持消息通道开放
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
          const highlighted = highlightElementByIndex(request.selector, request.index);
          sendResponse({ success: highlighted });
          break;

        default:
          sendResponse({ success: false, error: '未知的消息类型' });
      }
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    
    return true; // 保持消息通道开放以支持异步响应
  });

  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    removeHighlight();
  });

})();

