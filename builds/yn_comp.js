/**
  * 『云即』系列开源计划
  * © 2024-2025 云雨 lvynyu@163.com；
  * 本项目遵循GPL3.0协议；
  * 本项目禁止用于违法行为，如有，与作者无关；
  * 商用及二次编辑需保留本项目的版权声明，且必须开源；
  * 代码中引用其他库的部分应遵循对应许可；
  * 使用当前代码时禁止删除或修改本声明；
  * 
  * [YNYU_SET] OPEN DESIGN & SOURCE
  * © 2024-2025 YNYU lvynyu2@gmail.com;
  * Must comply with GNU GENERAL PUBLIC LICENSE Version 3;
  * Prohibit the use of this project for illegal activities. If such behavior occurs, it is not related to this project;
  * For commercial use or secondary editing, it is necessary to retain the copyright statement of this project and must continue to open source it;
  * For external libraries referenced in the project, it is necessary to comply with the corresponding open source protocols;
  * When using the code of this project, it is prohibited to delete this statement;
*/

// 确保 storageMix 可用（优先使用 window.storageMix，确保全局可访问）
// 如果局部作用域中没有 storageMix，使用全局的 window.storageMix
if(typeof storageMix === 'undefined' && typeof window !== 'undefined' && window.storageMix){
  var storageMix = window.storageMix;
}
class cardcolorpick extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <div data-input-color="box" data-color-view="false" class="df-ffc" style="gap: 4px; --hsl-h: 0; --hsl-s: 0; --hsl-l: 53; --hsv-s: 0; --hsv-v: 53;">
      <div data-input-color="hsv"></div>
      <div data-number-value="0" class="df-lc" style="gap: 4px;">
        <input data-input="hsl-h" type="range" min="0" max="360" value="0"/>
        <input data-input="value" data-input-color="hsl-h" data-input-must="0,360" type="text" class="txt-c" style="padding: 1px 1px; width: 22px; font-size: 10; flex: 0 0 auto;" value="0" />  
      </div>
    </div>
    `;
    this.className = 'pos-a'
  }
};
customElements.define('card-colorpick', cardcolorpick);

let GETCOLOR = null;
let TIPS_TIMES = [];
let USER_KEYING = false;
let COMPS = ['btn-theme','btn-close','btn-copy','btn-show','btn-info','btn-check','btn-color','btn-getcolor','card-colorpick'];

let TV = document.querySelectorAll('[data-TV]');
let TV_MOVE = false;
let TAB_AUTO = document.querySelectorAll('[data-tab="auto"]');
let TIPS = document.getElementById('tips-all');
let TIPS_TEXT = document.getElementById('tips-all-text');
let THEME_SWITCH = document.querySelectorAll("[data-theme-check]");
let LANGUAGE_SWITCH = document.querySelectorAll("[data-language-check]");

/**
 * COMP_MAIN_2.0 - 使用事件委托，自动处理动态生成的元素
 * 无需每次动态添加后重新运行绑定函数
 */
function COMP_MAIN(){
  
  // ========== 使用事件委托处理所有动态元素 ==========
  
  // 1. 下拉选择 - 使用事件委托
  document.addEventListener('change', (e) => {
    const item = e.target.closest('[data-select-pick]');
    if (!item) return;
    
    const options = item.parentNode.querySelector('[data-select-options]');
    const otherscroll = document.querySelectorAll('[data-scroll]');
    
    if (item.checked) {
      if (options) options.style.display = 'flex';
      otherscroll.forEach(items => {
        items.style.overflowY = 'hidden';
      });
    } else {
      if (options) options.style.display = 'none';
      otherscroll.forEach(items => {
        items.style.overflowY = 'scroll';
      });
    }
  });
  
  // 点击外部关闭下拉框 - 使用事件委托
  document.addEventListener('mousedown', (e) => {
    const selectPick = e.target.closest('[data-select-pick]');
    const selectContainer = e.target.closest('[data-select]');
    
    // 查找所有打开的下拉框
    document.querySelectorAll('[data-select-pick]:checked').forEach(item => {
      const inputs = item.parentNode;
      if (!item.contains(e.target) && !inputs.contains(e.target) && document.activeElement) {
        item.checked = false;
        const options = item.parentNode.querySelector('[data-select-options]');
        if (options) options.style.display = 'none';
        const otherscroll = document.querySelectorAll('[data-scroll]');
        otherscroll.forEach(items => {
          items.style.overflowY = 'scroll';
        });
      }
    });
  });

  // 2. 下拉选项点击 - 使用事件委托
  document.addEventListener('click', (e) => {
    const option = e.target.closest('[data-option="option"]');
    if (!option) return;
    
    const select = option.closest('[data-select]');
    if (!select) return;
    
    const oldOption = select.querySelector('[data-option-main="true"]');
    if (!oldOption) return;
    
    // 获取中英文值
    const currentLanguage = ROOT.getAttribute('data-language');
    const zhValue = option.getAttribute('data-option-value') || option.textContent;
    const enValue = option.getAttribute('data-en-text') || zhValue;
    
    // 根据当前语言选择对应的值
    const optionValue = (currentLanguage === 'En' && enValue) ? enValue : zhValue;
    
    oldOption.setAttribute('data-option-main', 'false');
    option.setAttribute('data-option-main', 'true');
    select.setAttribute('data-select-value', optionValue);
    
    const input = select.querySelector('[data-select-input]');
    if (input) {
      input.value = optionValue;
      // 更新中英文属性
      input.setAttribute('data-zh-input', zhValue);
      input.setAttribute('data-en-input', enValue);
    }
    
    /*切换选项后是否关闭下拉框*/
    let isClose = select.getAttribute('data-select-close') == 'true' ? true : false;
    if (isClose) {
      const pickCheckbox = select.querySelector('[data-select-pick]');
      if (pickCheckbox) {
        pickCheckbox.checked = false;
      };
      const optionsContainer = select.querySelector('[data-select-options]');
      if (optionsContainer) {
        optionsContainer.style.display = 'none';
      };
    };

  });

  // 3. 输入框通用处理 - 使用事件委托
  document.addEventListener('keydown', (e) => {
    const item = e.target.closest('input[data-input]');
    if (!item) return;
    if (e.key === 'Enter') {
      item.blur();
    }
  });

  // 初始化设置默认值
  document.querySelectorAll('input[data-input]').forEach(item => {
    if (!item.hasAttribute('data-input-default')) {
      item.setAttribute('data-input-default', item.value);
    }
  });

  // 4. 复选框 - 使用事件委托
  document.addEventListener('change', (e) => {
    const item = e.target.closest('[data-check]');
    if (!item) return;
    
    const checkName = item.getAttribute('data-check-for');
    if (!checkName) return;
    
    const check = document.querySelector(`[data-check-name="${checkName}"]`);
    if (check) {
      if (item.checked) {
        check.setAttribute('data-check-checked', 'true');
      } else {
        check.setAttribute('data-check-checked', 'false');
      }
    }
  });

  // 5. 必填文本输入 - 使用事件委托
  document.addEventListener('change', (e) => {
    const item = e.target.closest('[data-input-type="text"]');
    if (!item) return;
    
    const info = item.getAttribute('data-input-must');
    const infoEn = item.getAttribute('data-input-must-en');
    
    if (info) {
      if (infoEn) {
        inputMust(item, ['text', [info, infoEn]]);
      } else {
        inputMust(item, ['text', info]);
      }
      item.parentNode.setAttribute('data-text-value', item.value);
    }
  });

  // 6. 必填整数输入 - 使用事件委托
  document.addEventListener('change', (e) => {
    const item = e.target.closest('[data-input-type="int"]');
    if (!item) return;
    if (item.getAttribute('data-value')) return; // 类型冲突
    
    const info = item.getAttribute('data-input-must');
    if (!info) return;
    
    const max = info.split(',')[1] * 1;
    const min = info.split(',')[0] * 1;
    const maxVal = max ? max : 0;
    const minVal = min ? min : 0;
    
    if (item.value < minVal || item.value > maxVal || (item.value.replace(/[0-9]/g, '').trim().length > 0 && item.value.replace(/[0-9]/g, '').trim() !== '-')) {
      tipsAll(['数值错误，已修正', 'Wrong type, fixed'], 1000, 3);
      inputMust(item, ['int', minVal, maxVal]);
    }
    item.parentNode.setAttribute('data-int-value', item.value);
  });

  // 7. 必填浮点数输入 - 使用事件委托
  document.addEventListener('change', (e) => {
    const item = e.target.closest('[data-input-type="float"]');
    if (!item) return;
    if (item.getAttribute('data-value')) return; // 类型冲突
    
    const info = item.getAttribute('data-input-must');
    if (!info) return;
    
    const max = info.split(',')[1] * 1;
    const min = info.split(',')[0] * 1;
    const maxVal = max ? max : 0;
    const minVal = min ? min : 0;
    
    if (item.value < minVal || item.value > maxVal || item.value.replace(/[^0-9\.]/g, '').trim().length == 0 || item.value.replace(/[0-9]/g, '').trim().length > 1) {
      inputMust(item, ['float', minVal, maxVal]);
    }
    item.parentNode.setAttribute('data-float-value', item.value);
  });

  // 8. 最大字数限制 - 使用事件委托
  document.addEventListener('input', (e) => {
    const item = e.target.closest('[data-input-max]');
    if (!item || USER_KEYING) return;
    
    if (item.nextElementSibling) {
      const span = item.nextElementSibling.querySelector('span');
      if (span) span.innerHTML = item.value.length;
    } else {
      const node = document.createElement('div');
      node.className = 'pos-a';
      node.style.right = '2px';
      node.style.fontSize = '9px';
      node.style.opacity = '0.6';
      node.innerHTML = `<span>${item.value.length}</span>/${item.getAttribute('maxlength')}`;
      item.parentNode.appendChild(node);
    }
  });

  // 9. 滑块输入 - 使用事件委托
  document.addEventListener('input', (e) => {
    const item = e.target.closest('[data-input="range"]');
    if (!item) return;
    
    if (item.nextElementSibling) {
      item.nextElementSibling.value = item.value;
    }
    item.parentNode.setAttribute('data-number-value', item.value);
  });

  // 10. 数值输入框 - 使用事件委托
  document.addEventListener('input', (e) => {
    const item = e.target.closest('[data-input="value"]');
    if (!item) return;
    
    if (item.previousElementSibling) {
      item.previousElementSibling.value = item.value;
    }
    item.parentNode.setAttribute('data-number-value', item.value);
  });

  document.addEventListener('change', (e) => {
    const item = e.target.closest('[data-input="value"]');
    if (!item) return;
    
    const info = item.getAttribute('data-input-must');
    if (!info) return;
    
    const max = info.split(',')[1] * 1;
    const min = info.split(',')[0] * 1;
    const maxVal = max !== null ? max : 0;
    const minVal = min !== null ? min : 0;
    console.log(maxVal,minVal)

    if(isNaN(item.value) || item.value == ''){
      item.value = 0;
    }
    
    if (item.value < minVal || item.value > maxVal || (item.value.replace(/[0-9]/g, '').trim().length > 0 && item.value.replace(/[0-9]/g, '').trim() !== '-')) {
      tipsAll(['数值错误，已修正', 'Wrong type, fixed'], 1000, 3);
      inputMust(item, ['int', minVal, maxVal]);
    }
    if (item.previousElementSibling) {
      item.previousElementSibling.value = item.value;
    }
    item.parentNode.setAttribute('data-number-value', item.value);
  });

  // 11. 颜色选择器相关 - 使用事件委托
  document.addEventListener('click', (e) => {
    const item = e.target.closest('[data-input="colorpick"]');
    if (!item) return;
    
    const colorcomp = item.closest('[data-color]');
    if (!colorcomp) return;
    
    const colorbox = item.parentNode.querySelector('[data-input-color="box"]');
    if (colorbox) {
      // 根据当前模式确保取色盘类型正确
      const colortypeBtn = colorcomp.querySelector('[data-input="colortype"]');
      if (colortypeBtn) {
        const currentMode = colortypeBtn.getAttribute('data-colortype-mode') || 'hex';
        const colorPicker = colorbox.querySelector('[data-input-color="hsv"], [data-input-color="hsl"]');
        if (colorPicker) {
          const currentPickerType = colorPicker.getAttribute('data-input-color');
          // 如果当前模式是hsl但取色盘是hsv，需要切换
          if (currentMode === 'hsl' && currentPickerType === 'hsv') {
            const hslPicker = document.createElement('div');
            hslPicker.setAttribute('data-input-color', 'hsl');
            colorPicker.replaceWith(hslPicker);
          } else if (currentMode !== 'hsl' && currentPickerType === 'hsl') {
            // 如果当前模式不是hsl但取色盘是hsl，需要切换回hsv
            const hsvPicker = document.createElement('div');
            hsvPicker.setAttribute('data-input-color', 'hsv');
            colorPicker.replaceWith(hsvPicker);
          }
        }
      }
      colorbox.setAttribute('data-color-view', 'true');
    }
  });

  // 颜色类型切换（循环切换：hex -> rgb -> hsl -> hex）
  document.addEventListener('click', (e) => {
    const item = e.target.closest('[data-input="colortype"]');
    if (!item) return;
    
    const colorcomp = item.closest('[data-color]');
    if (!colorcomp) return;
    
    const prevInput = item.parentNode.querySelector('input[data-input]');//item.previousElementSibling;
    if (!prevInput) return;
    
    const currentMode = item.getAttribute('data-colortype-mode') || 'hex';
    let nextMode, nextValue, nextDataInput;
    
    // 获取当前颜色值
    const hexValue = colorcomp.getAttribute('data-color-hex');
    const rgbValue = colorcomp.getAttribute('data-color-rgb');
    const hslValue = colorcomp.getAttribute('data-color-hsl');
    
    // 循环切换：hex -> rgb -> hsl -> hex
    if (currentMode === 'hex') {
      nextMode = 'rgb';
      nextValue = rgbValue;
      nextDataInput = 'rgb';
    } else if (currentMode === 'rgb') {
      nextMode = 'hsl';
      nextValue = hslValue;
      nextDataInput = 'hsl';
    } else {
      nextMode = 'hex';
      nextValue = hexValue;
      nextDataInput = 'hex';
    }
    
    // 更新模式
    item.setAttribute('data-colortype-mode', nextMode);
    prevInput.setAttribute('data-input', nextDataInput);
    prevInput.value = nextValue;
    
    // 更新伪元素显示的色值
    updateColortypeTooltip(item, colorcomp, nextMode);
    
    // 切换取色盘模式
    const colorbox = colorcomp.querySelector('[data-input-color="box"]');
    if (colorbox) {
      const colorPicker = colorbox.querySelector('[data-input-color="hsv"], [data-input-color="hsl"]');
      if (colorPicker) {
        // hex和rgb使用hsv，hsl使用hsl
        if (nextMode === 'hsl') {
          // 如果当前是hsv，需要创建hsl取色盘
          if (colorPicker.getAttribute('data-input-color') === 'hsv') {
            const hslPicker = document.createElement('div');
            hslPicker.setAttribute('data-input-color', 'hsl');
            colorPicker.replaceWith(hslPicker);
          }
        } else {
          // hex和rgb使用hsv
          if (colorPicker.getAttribute('data-input-color') === 'hsl') {
            const hsvPicker = document.createElement('div');
            hsvPicker.setAttribute('data-input-color', 'hsv');
            colorPicker.replaceWith(hsvPicker);
          }
        }
      }
    }
  });
  
  // 更新颜色类型按钮的提示文本
  function updateColortypeTooltip(button, colorcomp, currentMode) {
    const hexValue = colorcomp.getAttribute('data-color-hex');
    const rgbValue = colorcomp.getAttribute('data-color-rgb');
    const hslValue = colorcomp.getAttribute('data-color-hsl');
    
    let other1, other2;
    if (currentMode === 'hex') {
      other1 = rgbValue;
      other2 = hslValue;
    } else if (currentMode === 'rgb') {
      other1 = hexValue;
      other2 = hslValue;
    } else {
      other1 = hexValue;
      other2 = rgbValue;
    }
    
    button.style.setProperty('--other1', `'${other1}'`);
    button.style.setProperty('--other2', `'${other2}'`);
  }
  
  // 初始化所有颜色类型按钮的提示文本
  document.querySelectorAll('[data-input="colortype"]').forEach(button => {
    const colorcomp = button.closest('[data-color]');
    if (colorcomp) {
      const currentMode = button.getAttribute('data-colortype-mode') || 'hex';
      updateColortypeTooltip(button, colorcomp, currentMode);
    }
  });

  // 颜色选择框关闭
  document.addEventListener('mousedown', (e) => {
    document.querySelectorAll('[data-input-color="box"]').forEach(item => {
      const inputs = item.parentNode.parentNode;
      if (!item.contains(e.target) && !inputs.contains(e.target) && document.activeElement) {
        item.setAttribute('data-color-view', 'false');
      }
    });
  });

  // 12. 单选按钮 - 使用事件委托（关键改进）
  document.addEventListener('click', (e) => {
    const item = e.target.closest('[data-radio]');
    if (!item) return;
    
    const radio = item.parentNode;
    const oldpick = radio.querySelector('[data-radio-main="true"]');
    const data = item.getAttribute('data-radio-data');
    
    if (oldpick && oldpick !== item) {
      oldpick.setAttribute('data-radio-main', 'false');
    }
    item.setAttribute('data-radio-main', 'true');
    radio.setAttribute('data-radio-value', data);
    
    // 处理滚动定位
    if (item.parentNode.parentNode && item.parentNode.parentNode.getAttribute('data-scroll') !== null) {
      const allradio = Array.from(item.parentNode.querySelectorAll('[data-radio-data]'));
      const index = allradio.indexOf(item);
      const inline = index > allradio.length / 2 ? 'nearest' : 'center';
      item.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: inline,
      });
      if (index > allradio.length / 2 && item.nextElementSibling) {
        item.nextElementSibling.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }
    }
  });

  // 13. 重置按钮 - 使用事件委托
  document.addEventListener('click', (e) => {
    const item = e.target.closest('[data-input-reset]');
    if (!item) return;
    
    const input = item.parentNode.querySelectorAll('input');
    input.forEach(node => {
      let defaultValue = node.getAttribute('data-input-default');
      if (!defaultValue) {
        switch (node.type) {
          case 'text':
            if (node.value * 1 !== NaN) {
              defaultValue = 0;
            } else {
              node.value = '';
            }
            break;
          case 'range':
            defaultValue = node.getAttribute('min') || 0;
            break;
        }
      }
      node.parentNode.setAttribute('data-number-value', defaultValue);
      node.value = defaultValue;
    });
  });

  // 14. 文本域处理 - 使用事件委托
  document.addEventListener('keydown', (e) => {
    const item = e.target.closest('textarea[data-textarea]');
    if (!item) return;
    
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = item.selectionStart;
      const end = item.selectionEnd;
      const selectedText = item.value.substring(start, end);
      const before = item.value.substring(0, start);
      const after = item.value.substring(end, item.value.length);
      item.value = before + '\t' + selectedText + after;
      item.selectionStart = item.selectionEnd = start + 1;
    }
  });

  document.addEventListener('focus', (e) => {
    const item = e.target.closest('textarea[data-textarea]');
    if (!item) return;
    
    const otherscroll = document.querySelectorAll('[data-scroll]');
    otherscroll.forEach(items => {
      items.style.overflowY = 'hidden';
    });
  }, true);

  document.addEventListener('blur', (e) => {
    const item = e.target.closest('textarea[data-textarea]');
    if (!item) return;
    
    const otherscroll = document.querySelectorAll('[data-scroll]');
    otherscroll.forEach(items => {
      items.style.overflowY = 'scroll';
    });
  }, true);

  // 文本域示例填充
  document.addEventListener('focus', (e) => {
    const item = e.target.closest('textarea[data-textarea="eg"]');
    if (!item) return;
    
    const tips = item.parentNode.querySelector('[data-textarea="tips"]');
    if (tips) tips.style.display = 'none';
  }, true);

  document.addEventListener('blur', (e) => {
    const item = e.target.closest('textarea[data-textarea="eg"]');
    if (!item) return;
    
    const tips = item.parentNode.querySelector('[data-textarea="tips"]');
    if (tips) {
      if (item.value == '') {
        tips.style.display = 'flex';
      } else {
        tips.style.display = 'none';
      }
    }
  }, true);

  document.addEventListener('dblclick', (e) => {
    const item = e.target.closest('textarea[data-textarea="eg"]');
    if (!item || item.value != '') return;
    
    let egtext = item.getAttribute('data-eg');
    const ROOT = document.documentElement;
    if (ROOT.getAttribute('data-language') == 'En') {
      egtext = item.getAttribute('data-eg-en');
    }
    egtext = egtext.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    if (egtext) {
      item.value = egtext;
    }
  });

  // 15. 清空按钮 - 使用事件委托
  document.addEventListener('click', (e) => {
    const item = e.target.closest('[data-close="clear"]');
    if (!item) return;
    
    const hasvalue = [...item.parentNode.querySelectorAll('textarea'), ...item.parentNode.querySelectorAll('input[type="text"]')];
    hasvalue.forEach(items => {
      items.value = '';
      if (items.getAttribute('data-textarea') == 'eg') {
        const tips = items.parentNode.querySelector('[data-textarea="tips"]');
        if (tips) tips.style.display = 'flex';
      }
      const inputEvent = new Event('input', { bubbles: true });
      items.dispatchEvent(inputEvent);
      const inputEvent2 = new Event('change', { bubbles: true });
      items.dispatchEvent(inputEvent2);
    });
  });

  // 16. 关闭按钮 - 使用事件委托
  document.addEventListener('click', (e) => {
    const item = e.target.closest('[data-close="close"]');
    if (!item) return;
    
    const closeFor = item.getAttribute('data-close-for');
    if (!closeFor) return;
    
    const closeNode = document.querySelector(`[data-close-id="${closeFor}"]`);
    if (closeNode) {
      closeNode.style.display = 'none';
    }
  });

  // ========== 其他需要直接绑定的逻辑（颜色选择器等复杂交互）==========
  // 这些需要在元素存在时初始化，但也可以通过 MutationObserver 处理动态添加
  
  // HEX/RGB/HSL 颜色输入变化
  document.addEventListener('change', (e) => {
    const item = e.target.closest('[data-input="hex"], [data-input="rgb"], [data-input="hsl"]');
    if (!item) return;
    
    const colortype = item.getAttribute('data-input');
    const info = colortype == 'hex' ? '#888888' : colortype == 'rgb' ? 'rgb(136,136,136)' : 'hsl(0,0%,53%)';
    inputMust(item, [colortype, info]);
    item.parentNode.style.setProperty('--input-color', item.value);
    
    const colorbox = item.parentNode.querySelector('[data-input-color="box"]');
    const colorrange = item.parentNode.querySelector('[data-input="hsl-h"]');
    const colorvalue = item.parentNode.querySelector('[data-input-color="hsl-h"]');
    
    let RGB, HEX, HSL, HSV;
    if (colortype === 'hsl') {
      const hslMatch = item.value.toLowerCase().replace('hsl(', '').replace(')', '').split(',');
      HSL = hslMatch.map(item => parseFloat(item.replace('%', '').trim()));
      RGB = hslTorgb(HSL[0], HSL[1], HSL[2], 255);
      HEX = rgbTohex(RGB[0], RGB[1], RGB[2]);
      HSV = hslTohsv(HSL[0], HSL[1], HSL[2]);
    } else {
      RGB = item.value.split('#').length > 1 ? hexTorgb(item.value) : item.value.toLowerCase().replace('rgb(', '').replace(')', '').split(',').map(v => parseFloat(v.trim()));
      HEX = item.value.split('#').length > 1 ? item.value : rgbTohex(RGB[0], RGB[1], RGB[2]);
      HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
      HSV = hslTohsv(HSL[0], HSL[1], HSL[2]);
    }
    
    if (colorrange) colorrange.value = HSL[0];
    if (colorvalue) colorvalue.value = HSL[0];
    if (colorbox) {
      const hslPicker = colorbox.querySelector('[data-input-color="hsl"]');
      const colorpickW = hslPicker ? hslPicker.offsetWidth : 110; // 默认值，可从 CSS 变量获取
      const colorpickH = hslPicker ? hslPicker.offsetHeight : 110;
      
      colorbox.style.setProperty('--hsl-h', HSL[0]);
      // HSL 使用像素值，需要将百分比转换为像素
      colorbox.style.setProperty('--hsl-s', (HSL[1] / 100 * colorpickW) + 'px');
      colorbox.style.setProperty('--hsl-l', (HSL[2] / 100 * colorpickH) + 'px');
      colorbox.style.setProperty('--hsv-s', HSV[1]);
      colorbox.style.setProperty('--hsv-v', HSV[2]);
    }
    
    // 只在值真正改变时才设置属性，避免重复触发 MutationObserver
    const colorParent = item.parentNode;
    const currentHex = colorParent.getAttribute('data-color-hex');
    if (currentHex !== HEX) {
      colorParent.setAttribute('data-color-hex', HEX);
      colorParent.setAttribute('data-color-rgb', `rgb(${RGB[0]},${RGB[1]},${RGB[2]})`);
      colorParent.setAttribute('data-color-hsl', `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`);
      colorParent.setAttribute('data-color-hsv', `hsv(${HSV[0]},${HSV[1]}%,${HSV[2]}%)`);
      // 更新颜色类型按钮的提示文本
      const colortypeBtn = colorParent.querySelector('[data-input="colortype"]');
      if (colortypeBtn) {
        const currentMode = colortypeBtn.getAttribute('data-colortype-mode') || 'hex';
        updateColortypeTooltip(colortypeBtn, colorParent, currentMode);
      }
    }
  });

  // 17. HSL H 值变化（range 和 text input）
  document.addEventListener('input', (e) => {
    const item = e.target.closest('[data-input="hsl-h"], [data-input-color="hsl-h"]');
    if (!item) return;
    
    const colorcomp = item.closest('[data-color-hex]') || item.parentNode.parentNode.parentNode.parentNode;
    if (!colorcomp) return;
    
    const oldHSLAttr = colorcomp.getAttribute('data-color-hsl');
    if (!oldHSLAttr) return;
    
    const oldHSL = oldHSLAttr.replace('hsl(', '').replace(')', '').split(',').map(item => item.replace('%', '').trim());
    // 输入阶段：仅在当前值为合法数字时才联动更新颜色；空值/非法值时暂不更新
    let newH = parseFloat(item.value);
    if (isNaN(newH)) {
      return;
    }
    const newRGB = hslTorgb(newH, oldHSL[1], oldHSL[2], 255);
    const newHEX = rgbTohex(newRGB[0], newRGB[1], newRGB[2]);
    const newHSV = hslTohsv(newH, oldHSL[1], oldHSL[2]);
    
    const colorinput1 = colorcomp.querySelector('[data-input="hex"]');
    const colorinput2 = colorcomp.querySelector('[data-input="rgb"]');
    const colorinput3 = colorcomp.querySelector('[data-input="hsl"]');
    if (colorinput1) {
      colorinput1.value = newHEX;
    }
    if (colorinput2) {
      colorinput2.value = `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`;
    }
    // HSL 模式下，拖动 H 滑块或在 H 输入框中输入时，同步更新 HSL 文本输入框的值
    if (colorinput3) {
      colorinput3.value = `hsl(${newH},${oldHSL[1]}%,${oldHSL[2]}%)`;
    }
    
    const colorbox = colorcomp.querySelector('[data-input-color="box"]');
    if (colorbox) {
      colorbox.style.setProperty('--hsl-h', newH);
    }
    
    // 只在值真正改变时才设置属性，避免重复触发 MutationObserver
    const currentHex = colorcomp.getAttribute('data-color-hex');
    if (currentHex !== newHEX) {
      colorcomp.style.setProperty('--input-color', newHEX);
      colorcomp.setAttribute('data-color-hex', newHEX);
      colorcomp.setAttribute('data-color-rgb', `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`);
      colorcomp.setAttribute('data-color-hsl', `hsl(${newH},${oldHSL[1]}%,${oldHSL[2]}%)`);
      colorcomp.setAttribute('data-color-hsv', `hsv(${newHSV[0]},${newHSV[1]}%,${newHSV[2]}%)`);
      // 更新颜色类型按钮的提示文本
      const colortypeBtn = colorcomp.querySelector('[data-input="colortype"]');
      if (colortypeBtn) {
        const currentMode = colortypeBtn.getAttribute('data-colortype-mode') || 'hex';
        updateColortypeTooltip(colortypeBtn, colorcomp, currentMode);
      }
    }
    
    // 同步另一个 HSL H 输入框
    const otherHSLH = colorcomp.querySelector(item.getAttribute('data-input') === 'hsl-h' 
      ? '[data-input-color="hsl-h"]' 
      : '[data-input="hsl-h"]');
    if (otherHSLH) {
      otherHSLH.value = newH;
    }
  });

  // 18. 颜色选择器拖拽（HSV/HSL 颜色面板）
  // 使用 Map 来跟踪每个元素的拖拽状态
  const colorPickMoving = new Map();
  
  function colorPickMix(e, item, type, isMobile) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!item) return;
    
    const x = isMobile ? e.touches[0].clientX : e.clientX;
    const y = isMobile ? e.touches[0].clientY : e.clientY;
    const w = item.offsetWidth;
    const h = item.offsetHeight;
    const startX = item.getBoundingClientRect().left;
    const startY = item.getBoundingClientRect().top;
    
    let SS = Math.floor((x - startX) / w * 100);
    let VL = 100 - Math.floor((y - startY) / h * 100);
    SS = SS <= 100 ? SS : 100;
    VL = VL <= 100 ? VL : 100;
    SS = SS >= 0 ? SS : 0;
    VL = VL >= 0 ? VL : 0;
    
    const colorcomp = item.closest('[data-color-hex]') || item.parentNode.parentNode.parentNode;
    if (!colorcomp) return;
    
    const colortype = item.getAttribute('data-input-color');
    const oldColorAttr = colorcomp.getAttribute('data-color-' + colortype);
    if (!oldColorAttr) return;
    
    const oldColor = oldColorAttr.replace(colortype + '(', '').replace(')', '').split(',').map(item => item.replace('%', '').trim());
    
    if (colortype == 'hsl') {
      const newHSV = hslTohsv(oldColor[0], SS, VL);
      const newRGB = hslTorgb(oldColor[0], SS, VL, 255);
      const newHEX = rgbTohex(newRGB[0], newRGB[1], newRGB[2]);
      const colorinput1 = colorcomp.querySelector('[data-input="hex"]');
      const colorinput2 = colorcomp.querySelector('[data-input="rgb"]');
      const colorinput3 = colorcomp.querySelector('[data-input="hsl"]');
      if (colorinput1) {
        colorinput1.value = newHEX;
      }
      if (colorinput2) {
        colorinput2.value = `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`;
      }
      // HSL 模式下，点击取色盘时同步更新 HSL 文本输入框的显示值
      if (colorinput3) {
        colorinput3.value = `hsl(${oldColor[0]},${SS}%,${VL}%)`;
      }
      const colorbox = item.parentNode;
      if (colorbox) {
        // HSL 使用像素值，需要将百分比转换为像素
        // ::after 使用 transform: translate(-50%, 50%)，所以需要直接设置为像素位置
        colorbox.style.setProperty('--hsl-s', (SS / 100 * w) + 'px');
        colorbox.style.setProperty('--hsl-l', (VL / 100 * h) + 'px');
        colorbox.style.setProperty('--hsv-s', newHSV[1]);
        colorbox.style.setProperty('--hsv-v', newHSV[2]);
      }
      // 只在值真正改变时才设置属性，避免重复触发 MutationObserver
      const currentHex = colorcomp.getAttribute('data-color-hex');
      if (currentHex !== newHEX) {
        colorcomp.style.setProperty('--input-color', newHEX);
        colorcomp.setAttribute('data-color-hex', newHEX);
        colorcomp.setAttribute('data-color-rgb', `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`);
        colorcomp.setAttribute('data-color-hsv', `hsv(${newHSV[0]},${newHSV[1]}%,${newHSV[2]}%)`);
        colorcomp.setAttribute('data-color-hsl', `hsl(${oldColor[0]},${SS}%,${VL}%)`);
        // 更新颜色类型按钮的提示文本
        const colortypeBtn = colorcomp.querySelector('[data-input="colortype"]');
        if (colortypeBtn) {
          const currentMode = colortypeBtn.getAttribute('data-colortype-mode') || 'hex';
          updateColortypeTooltip(colortypeBtn, colorcomp, currentMode);
        }
      }
    } else {
      const newHSL = hsvTohsl(oldColor[0], SS, VL);
      const newRGB = hslTorgb(newHSL[0], newHSL[1], newHSL[2], 255);
      const newHEX = rgbTohex(newRGB[0], newRGB[1], newRGB[2]);
      const colorinput1 = colorcomp.querySelector('[data-input="hex"]');
      const colorinput2 = colorcomp.querySelector('[data-input="rgb"]');
      const colorinput3 = colorcomp.querySelector('[data-input="hsl"]');
      if (colorinput1) {
        colorinput1.value = newHEX;
      }
      if (colorinput2) {
        colorinput2.value = `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`;
      }
      // HSV 模式下拖拽/点击取色盘时，也在后台同步更新 HSL 文本值，保证数据一致
      if (colorinput3) {
        colorinput3.value = `hsl(${newHSL[0]},${newHSL[1]}%,${newHSL[2]}%)`;
      }
      const colorbox = item.parentNode;
      if (colorbox) {
        colorbox.style.setProperty('--hsv-s', SS);
        colorbox.style.setProperty('--hsv-v', VL);
        // HSL 使用像素值，需要将百分比转换为像素
        // ::after 使用 transform: translate(-50%, 50%)，所以需要直接设置为像素位置
        colorbox.style.setProperty('--hsl-s', (newHSL[1] / 100 * w) + 'px');
        colorbox.style.setProperty('--hsl-l', (newHSL[2] / 100 * h) + 'px');
      }
      // 只在值真正改变时才设置属性，避免重复触发 MutationObserver
      const currentHex = colorcomp.getAttribute('data-color-hex');
      if (currentHex !== newHEX) {
        colorcomp.style.setProperty('--input-color', newHEX);
        colorcomp.setAttribute('data-color-hex', newHEX);
        colorcomp.setAttribute('data-color-rgb', `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`);
        colorcomp.setAttribute('data-color-hsl', `hsl(${newHSL[0]},${newHSL[1]}%,${newHSL[2]}%)`);
        colorcomp.setAttribute('data-color-hsv', `hsv(${oldColor[0]},${SS}%,${VL}%)`);
        // 更新颜色类型按钮的提示文本
        const colortypeBtn = colorcomp.querySelector('[data-input="colortype"]');
        if (colortypeBtn) {
          const currentMode = colortypeBtn.getAttribute('data-colortype-mode') || 'hex';
          updateColortypeTooltip(colortypeBtn, colorcomp, currentMode);
        }
      }
    }
  }
  
  // 鼠标和触摸事件处理
  let activeColorPickItem = null;
  
  document.addEventListener('mousedown', (e) => {
    const item = e.target.closest('[data-input-color="hsv"], [data-input-color="hsl"]');
    if (!item) return;
    
    activeColorPickItem = item;
    colorPickMoving.set(item, true);
    const colortype = item.getAttribute('data-input-color');
    colorPickMix(e, item, colortype, false);
  });
  
  document.addEventListener('touchstart', (e) => {
    const item = e.target.closest('[data-input-color="hsv"], [data-input-color="hsl"]');
    if (!item) return;
    
    activeColorPickItem = item;
    colorPickMoving.set(item, true);
    const colortype = item.getAttribute('data-input-color');
    colorPickMix(e, item, colortype, true);
  }, { passive: false });
  
  // 标记是否发生了拖拽操作（用于区分点击和拖拽）
  let hasMoved = false;
  
  document.addEventListener('mousemove', (e) => {
    if (activeColorPickItem && colorPickMoving.get(activeColorPickItem)) {
      hasMoved = true; // 标记发生了拖拽
      const colortype = activeColorPickItem.getAttribute('data-input-color');
      colorPickMix(e, activeColorPickItem, colortype, false);
    }
  });
  
  document.addEventListener('touchmove', (e) => {
    if (activeColorPickItem && colorPickMoving.get(activeColorPickItem)) {
      hasMoved = true; // 标记发生了拖拽
      const colortype = activeColorPickItem.getAttribute('data-input-color');
      colorPickMix(e, activeColorPickItem, colortype, true);
    }
  }, { passive: false });
  
  document.addEventListener('click', (e) => {
    const item = e.target.closest('[data-input-color="hsv"], [data-input-color="hsl"]');
    // 如果发生了拖拽或者是正在拖拽中，则忽略 click 事件（避免重复触发）
    if (!item || colorPickMoving.get(item) || hasMoved) {
      hasMoved = false; // 重置拖拽标记
      return;
    }
    
    const colortype = item.getAttribute('data-input-color');
    colorPickMix(e, item, colortype, false);
  });
  
  document.addEventListener('mouseup', () => {
    // 延迟清除标志，避免 click 事件误触发（click 会在 mouseup 之后触发）
    setTimeout(() => {
      if (hasMoved) {
        hasMoved = false; // 重置拖拽标记
      }
      activeColorPickItem = null;
      colorPickMoving.clear();
    }, 0);
  });
  
  document.addEventListener('touchend', () => {
    // 延迟清除标志，避免 click 事件误触发
    setTimeout(() => {
      if (hasMoved) {
        hasMoved = false; // 重置拖拽标记
      }
      activeColorPickItem = null;
      colorPickMoving.clear();
    }, 0);
  });

  // 19. 吸色管功能
  document.addEventListener('click', (e) => {
    const item = e.target.closest('[data-getcolor]');
    if (!item || !GETCOLOR) return;
    
    GETCOLOR.open()
      .then(USER_COLOR => {
        const newHEX = USER_COLOR.sRGBHex;
        const newRGB = hexTorgb(newHEX);
        const colorcomp = item.closest('[data-color-hex]') || item.parentNode;
        if (!colorcomp) return;
        
        const colorinput1 = colorcomp.querySelector('[data-input="hex"]');
        const colorinput2 = colorcomp.querySelector('[data-input="rgb"]');
        const colorbox = colorcomp.querySelector('[data-input-color="box"]');
        const colorrange = colorcomp.querySelector('[data-input="hsl-h"]');
        const colorvalue = colorcomp.querySelector('[data-input-color="hsl-h"]');
        
        let HSL = rgbTohsl(newRGB[0], newRGB[1], newRGB[2]);
        let HSV = hslTohsv(HSL[0], HSL[1], HSL[2]);
        
        // 更新输入框值（仅在值真正改变时更新，避免触发不必要的 change 事件）
        if (colorinput1 && colorinput1.value !== newHEX) {
          colorinput1.value = newHEX;
        }
        const rgbValue = `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`;
        if (colorinput2 && colorinput2.value !== rgbValue) {
          colorinput2.value = rgbValue;
        }
        
        // 更新 HSL H 值
        if (colorrange && colorrange.value != HSL[0]) {
          colorrange.value = HSL[0];
        }
        if (colorvalue && colorvalue.value != HSL[0]) {
          colorvalue.value = HSL[0];
        }
        
        // 更新颜色选择器样式
        if (colorbox) {
          const hslPicker = colorbox.querySelector('[data-input-color="hsl"]');
          const colorpickW = hslPicker ? hslPicker.offsetWidth : 110;
          const colorpickH = hslPicker ? hslPicker.offsetHeight : 110;
          
          colorbox.style.setProperty('--hsl-h', HSL[0]);
          colorbox.style.setProperty('--hsl-s', (HSL[1] / 100 * colorpickW) + 'px');
          colorbox.style.setProperty('--hsl-l', (HSL[2] / 100 * colorpickH) + 'px');
          colorbox.style.setProperty('--hsv-s', HSV[1]);
          colorbox.style.setProperty('--hsv-v', HSV[2]);
        }
        
        // 直接设置属性，而不是通过触发 change 事件（避免重复触发）
        colorcomp.style.setProperty('--input-color', newHEX);
        colorcomp.setAttribute('data-color-hex', newHEX);
        colorcomp.setAttribute('data-color-rgb', rgbValue);
        colorcomp.setAttribute('data-color-hsl', `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`);
        colorcomp.setAttribute('data-color-hsv', `hsv(${HSV[0]},${HSV[1]}%,${HSV[2]}%)`);
        // 更新颜色类型按钮的提示文本
        const colortypeBtn = colorcomp.querySelector('[data-input="colortype"]');
        if (colortypeBtn) {
          const currentMode = colortypeBtn.getAttribute('data-colortype-mode') || 'hex';
          updateColortypeTooltip(colortypeBtn, colorcomp, currentMode);
        }
      })
      .catch(error => {
        // 用户取消选择，不做处理
      });
  });
};

/**
 * getUserMix - 统一的组件属性监听系统
 * 支持监听自定义属性变化并触发回调，自动处理动态生成的元素
 * 
 * 使用方法：
 * 1. 注册全局回调：getUserMix.register('select', (node) => { ... })
 * 2. 直接调用：getUserMix.select(node, (node) => { ... })
 * 3. 扩展新类型：getUserMix.addType('custom', 'data-custom-value', '[data-custom]')
 */
const getUserMix = (function() {
  // 存储各种类型的回调函数
  const callbacks = {};
  
  // 类型配置：{ type: { selector, attribute, attributeFilter } }
  const typeConfigs = {
    'color': {
      selector: '[data-color]',
      attribute: 'data-color-hex',
      attributeFilter: ['data-color-hex']
    },
    'number': {
      selector: '[data-number]',
      attribute: 'data-number-value',
      attributeFilter: ['data-number-value']
    },
    'text': {
      selector: '[data-text]',
      attribute: 'data-text-value',
      attributeFilter: ['data-text-value']
    },
    'int': {
      selector: '[data-int-value]',
      attribute: 'data-int-value',
      attributeFilter: ['data-int-value']
    },
    'float': {
      selector: '[data-float-value]',
      attribute: 'data-float-value',
      attributeFilter: ['data-float-value']
    },
    'select': {
      selector: '[data-select]',
      attribute: 'data-select-value',
      attributeFilter: ['data-select-value']
    },
    'radio': {
      selector: '[data-radio-value]',
      attribute: 'data-radio-value',
      attributeFilter: ['data-radio-value']
    },
    'tab': {
      selector: '[data-tab-pick]',
      attribute: 'data-tab-pick',
      attributeFilter: ['data-tab-pick']
    }
  };
  
  // 全局 MutationObserver（单例）
  let observer = null;
  let observedElements = new WeakSet();
  
  // 初始化 observer
  function initObserver() {
    if (observer) return;
    
    observer = new MutationObserver((mutations) => {
      // 使用 Map<Element, Set<type>> 去重：
      // - 同一元素同一类型在同一批次内只触发一次
      // - 不同元素各自都会触发，不会被错误合并
      const processed = new Map(); // key: Element, value: Set<type>
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attributeName = mutation.attributeName;
          const target = mutation.target;
          
          // 查找对应的类型
          for (const [type, config] of Object.entries(typeConfigs)) {
            if (config.attributeFilter.includes(attributeName)) {
              if (!processed.has(target)) {
                processed.set(target, new Set());
              }
              processed.get(target).add(type);
              break;
            }
          }
        }
      });
      
      // 批量执行回调：每个元素的每种类型只执行一次
      processed.forEach((types, target) => {
        types.forEach(type => {
          if (callbacks[type]) {
            callbacks[type].forEach(callback => {
              try {
                callback(target);
              } catch (e) {
                console.error(`Error in getUserMix callback for type "${type}":`, e);
              }
            });
          }
        });
      });
    });
    
    // 监听动态添加的元素
    const dynamicObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查新添加的元素及其子元素
            for (const [type, config] of Object.entries(typeConfigs)) {
              const elements = [];
              
              // 检查元素本身
              if (node.matches && node.matches(config.selector)) {
                elements.push(node);
              }
              
              // 检查子元素
              if (node.querySelectorAll) {
                const children = node.querySelectorAll(config.selector);
                elements.push(...Array.from(children));
              }
              
              // 观察新元素
              elements.forEach(item => {
                if (!observedElements.has(item)) {
                  const config_obs = {attributes: true, attributeFilter: config.attributeFilter};
                  observer.observe(item, config_obs);
                  observedElements.add(item);
                }
              });
            }
          }
        });
      });
    });
    
    // 开始观察文档变化
    dynamicObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 是否已初始化观察
  let isObserved = false;
  
  // 观察元素
  function observeElements(container) {
    if (!observer) initObserver();
    
    // 如果已经观察过整个文档，且没有传入容器，则跳过
    if (isObserved && !container) {
      return;
    }
    
    const root = container || document;
    
    for (const [type, config] of Object.entries(typeConfigs)) {
      const elements = root.querySelectorAll(config.selector);
      elements.forEach(item => {
        if (!observedElements.has(item)) {
          const config_obs = {attributes: true, attributeFilter: config.attributeFilter};
          observer.observe(item, config_obs);
          observedElements.add(item);
        }
      });
    }
    
    // 标记已观察整个文档
    if (!container) {
      isObserved = true;
    }
  }
  
  // 返回公共API
  return {
    /**
     * 注册全局回调
     * @param {string} type - 类型：'color', 'number', 'text', 'int', 'float', 'select', 'radio', 'tab'
     * @param {function} callback - 回调函数，接收 node 参数
     */
    register(type, callback) {
      if (!typeConfigs[type]) {
        console.warn(`getUserMix.register: Unknown type "${type}"`);
        return;
      }
      if (typeof callback !== 'function') {
        console.warn(`getUserMix.register: callback must be a function`);
        return;
      }
      
      if (!callbacks[type]) {
        callbacks[type] = [];
      }
      callbacks[type].push(callback);
      
      // 初始化并观察已存在的元素
      observeElements();
    },
    
    /**
     * 添加新的类型
     * @param {string} type - 类型名称
     * @param {string} attribute - 监听的属性名，如 'data-custom-value'
     * @param {string} selector - 选择器，如 '[data-custom]'
     */
    addType(type, attribute, selector) {
      if (typeConfigs[type]) {
        console.warn(`getUserMix.addType: Type "${type}" already exists`);
        return;
      }
      
      typeConfigs[type] = {
        selector: selector,
        attribute: attribute,
        attributeFilter: [attribute]
      };
      
      // 重新观察已存在的元素
      observeElements();
    },
    
    /**
     * 直接调用回调（用于手动触发）
     * @param {string} type - 类型
     * @param {Element} node - 节点
     * @param {function} callback - 可选的回调函数（临时回调，不会注册为全局回调）
     */
    call(type, node, callback) {
      if (!typeConfigs[type]) {
        console.warn(`getUserMix.call: Unknown type "${type}"`);
        return;
      }
      
      // 执行临时回调
      if (callback && typeof callback === 'function') {
        try {
          callback(node);
        } catch (e) {
          console.error(`Error in getUserMix temporary callback for type "${type}":`, e);
        }
      }
      
      // 执行全局回调
      if (callbacks[type]) {
        callbacks[type].forEach(cb => {
          try {
            cb(node);
          } catch (e) {
            console.error(`Error in getUserMix callback for type "${type}":`, e);
          }
        });
      }
    },
    
    /**
     * 初始化观察（通常在页面加载后调用）
     * @param {Element} container - 可选，指定容器
     */
    init(container) {
      observeElements(container);
    },
    
    // 便捷方法：直接调用各种类型
    color(node, callback) { this.call('color', node, callback); },
    number(node, callback) { this.call('number', node, callback); },
    text(node, callback) { this.call('text', node, callback); },
    int(node, callback) { this.call('int', node, callback); },
    float(node, callback) { this.call('float', node, callback); },
    select(node, callback) { this.call('select', node, callback); },
    radio(node, callback) { this.call('radio', node, callback); },
    tab(node, callback) { this.call('tab', node, callback); }
  };
})();

window.addEventListener('load', () => {
  afterAllMust();
  COMP_MAIN(); // 只需运行一次，动态元素会自动响应
  getUserMix.init(); // 初始化组件属性监听系统
  
  if (window.EyeDropper == undefined || ISMOBILE) {
    //console.error('EyeDropper API is not supported on this platform');
    ROOT.style.setProperty('--colorcard-left','0');
    ROOT.style.setProperty('--getcolor-df','none');
  } else {
    ROOT.style.setProperty('--colorcard-left','18px');
    ROOT.style.setProperty('--getcolor-df','block');
    GETCOLOR = new EyeDropper()
    //console.log('该浏览器支持吸色管')
  };

  if(!PLUGINAPP){
    if(storageMix.get('userTheme') == 'light'){
      setTheme(true,false);
    } else if(storageMix.get('userTheme') == 'dark'){
      setTheme(false,false);
    } else {
      setTheme(true,false);
    };

    if(storageMix.get('userLanguage') == 'En'){
      setLanguage(false);
    } else if(storageMix.get('userLanguage') == 'Zh'){
      setLanguage(true);
    } else {
      setLanguage(false);
    };
  };
});


window.addEventListener('resize',/*防抖*/debounce(()=>{
  afterAllMust();
},500));

function afterAllMust(){
  reTV();
};

LANGUAGE_SWITCH.forEach(item => {
  item.addEventListener('change',()=>{
    if(item.checked){
      setLanguage(true,true);
    }else{
      setLanguage(false,true);
    }
  });
});

THEME_SWITCH.forEach(item => {
  item.addEventListener('change',()=>{
    if(item.checked){
      setTheme(false,true)
    }else{
      setTheme(true,true)
    }
  });
});


TAB_AUTO.forEach((item) => {

  let pagefor = document.querySelector(`[data-page-id="${item.getAttribute('data-tab-for')}"]`);
  if(!pagefor) return;
  
  let tabsfor = pagefor.querySelectorAll('[data-page-name]');
  
  tabsfor.forEach((items,index) => {
    let tabsforEn = items.getAttribute('data-page-name-en');
    let keyid = tabsforEn ? `tab_${tabsforEn}` : `tab_${items.getAttribute('data-page-name')}`;
    let tabNum = item.getAttribute('data-tab-index') | '0';
    let id = keyid + '_' + tabNum;
    let checked = items.getAttribute('data-page-main') === 'true' ? true : false;
    
    if(tabsforEn == 'gap'){
      let tabgap = document.createElement('div')
      tabgap.className = items.getAttribute('data-page-tabclass');
      item.appendChild(tabgap);
    } else {
      let input = document.createElement('input');
      input.type = 'checkbox'
      input.id = id;
      input.checked = checked;
      input.style.display = 'none';
      if(checked){
        items.parentNode.setAttribute('data-tab-pick',keyid);
        items.setAttribute('data-page-main','true');
      }
      input.addEventListener('change',() => {
        let oldTabPick = items.parentNode.getAttribute('data-tab-pick');
        if(oldTabPick){
          let oldInput = document.getElementById(oldTabPick + '_' + tabNum);
          if(oldInput){
            oldInput.checked = false;
          }
        }
        input.checked = true;
        if(oldTabPick){
          let oldPageName = oldTabPick.split('_')[1];
          let oldpage = document.querySelector(`[data-page-name="${oldPageName}"]`);
          if(!oldpage){
            oldpage = document.querySelector(`[data-page-name-en="${oldPageName}"]`);
          }
          if(oldpage){
            oldpage.setAttribute('data-page-main','false');
          }
        }
        items.setAttribute('data-page-main','true');
        items.parentNode.setAttribute('data-tab-pick',keyid);
        if(input.parentNode.getAttribute('data-scroll') !== null){
          let allinput = Array.from(input.parentNode.querySelectorAll('input'));
          let index = allinput.indexOf(input);
          let inline = index >= allinput.length/2 ? 'nearest' : 'center';
          input.nextElementSibling.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: inline,
          });
          if(index >= allinput.length/2 && input.nextElementSibling && input.nextElementSibling.nextElementSibling && input.nextElementSibling.nextElementSibling.nextElementSibling){
            input.nextElementSibling.nextElementSibling.nextElementSibling.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          };
        }
        
      });

      let label = document.createElement('label');
      label.setAttribute('for',id);
      label.setAttribute('data-tab-index',index);
      if(tabsforEn){
        label.setAttribute('data-en-text',tabsforEn);
      }
      label.className = items.getAttribute('data-page-tabclass');
      label.innerHTML = items.getAttribute('data-page-name');
      item.appendChild(input);
      item.appendChild(label);
    };
  });

  setTimeout(() => {
    item.setAttribute('data-tab-pick', 'true');
  }, 100);
  
});

document.addEventListener('keydown',(event) => {
  if (event.isComposing) {
    USER_KEYING = true;
  } else {
    USER_KEYING = false;
  }
})

document.querySelectorAll('[data-link]').forEach(item => {
  item.addEventListener('click',()=>{
    let isnew = item.getAttribute('data-link-isnew') == 'true' ? true : false;
    let linkurl = item.getAttribute('data-link-to');
    if(linkurl){
      let link = document.createElement('a');
      link.href = linkurl;
      if(isnew){
        link.target = '_blank';
      }
      link.click()
    }
  })
});

/**
 * 使输入的内容保持正确的范围
 * @param {Element} node 
 * @param {Array} info -形式为[格式要求,极值/默认值]的数组：['int',min,max] | ['text',any] | ['hex','#000000'] 
 */
function inputMust(node,info){
  let type = info[0];
  if(type === "int"){
    let min = info[1]
    let max = info[2]
    let num = toInt(node.value,info[1])
    if(num >= min && num <= max){
      node.value = num;
    }else{
      node.value = num > max ? max : min;
    }
  }
  function toInt(value,nullText){
    let add = value[0] == '-' ? -1 : 1;
    let num = value.replace(/\D/g,'').trim()
    return num ? num*add : nullText;
  }
  if(type === "float"){
    let min = info[1]
    let max = info[2]
    let num = node.value.replace(/[^0-9\.]/g,'').trim()
    if(num >= min && num <= max){
      node.value = num;
    }else{
      node.value = num > max ? max : min;
    }
  }
  if(type === "text"){
    if(node.value == '' || node.value.length < 1){
      let nullText;
      if(typeof info[1] !== 'string'){
        nullText = ROOT.getAttribute('data-language') == 'En' ? info[1][1] : info[1][0];
      } else {
        nullText = info[1];
      }
      
      let maxlength = node.getAttribute("maxlength")
      nullText = maxlength ? nullText.substring(0,maxlength) : nullText;
      node.value = nullText
    }
  }
  if(type === "hex"){
    if(node.value.toLowerCase().split('rgb(').length > 1){//兼容rgb
      let RGB = node.value.toLowerCase().replace('rgb(','').replace(')','').split(',')
      RGB = RGB.map(item => item.replace(/[^0-9a-fA-F]/g,'').trim())
      if(RGB.length == 3){
        node.value = rgbTohex(RGB[0],RGB[1],RGB[2]);
      } else {
        tipsAll(['请输入正确的色值','Should be color'],1000);
      }
    } else {
      let values = '#' +  node.value.replace(/[#]/g,'');
      if (values == '#' || values.replace(/[0-9a-fA-F]/g,'').trim().length > 1) {
      node.value = info[1];
      tipsAll(['请输入正确的色值','Should be color'],1000);
      } else {
          if (node.value.length < 7) {
          if (node.value[0] == '#') {
              var a = node.value.replace(/[#]/g,'');
              if (a.length == 3) {
              node.value = "#" + a + a
              }
              if (a.length == 2) {
              node.value = "#" + a + a + a
              }
              if (a.length == 1) {
              node.value = "#" + a + a + a + a + a + a
              }
              if (a.length == 4) {
              node.value = "#" + a + "00"
              }
              if (a.length == 5) {
              node.value = "#" + a + "0"
              }
          } else {
              var c = node.value.replace(/[#]/g,'')
              if (c.length == 3) {
              node.value = "#" + c + c
              }
              if (c.length == 2) {
              node.value = "#" + c + c + c
              }
              if (c.length == 1) {
              node.value = "#" + c + c + c + c + c + c
              }
              if (c.length == 4) {
              node.value = "#" + c + "00"
              }
              if (c.length == 5) {
              node.value = "#" + c + "0"
              }
              if (c.length == 6) {
              node.value = "#" + c
              }
          }
          } else {
              if (node.value.replace(/[#]/g,'').replace(/[^0-9a-fA-F]/g,'').trim().length >= 6) {
                  node.value = '#' + node.value.replace(/[#]/g,'').replace(/[^0-9a-fA-F]/g,'').trim().substring(0, 6);
              } else {
                  node.value = info[1]
                  tipsAll(['请输入正确的色值','Should be color'],1000);
              }
          }
      }
    }
  }
  if(type === "rgb"){
    if(node.value.toLowerCase().split('#').length > 1){//兼容HEX
      let values = '#' +  node.value.replace(/[#]/g,'');
      if (values == '#' || values.replace(/[0-9a-fA-F]/g,'').trim().length > 1) {
      node.value = info[1];
      tipsAll(['请输入正确的色值','Should be color'],1000);
      } else {
          if (node.value.length < 7) {
          if (node.value[0] == '#') {
              var a = node.value.replace(/[#]/g,'');
              if (a.length == 3) {
              node.value = hexTorgb("#" + a + a);
              }
              if (a.length == 2) {
              node.value = hexTorgb("#" + a + a + a);
              }
              if (a.length == 1) {
              node.value = hexTorgb("#" + a + a + a + a + a + a);
              }
              if (a.length == 4) {
              node.value = hexTorgb("#" + a + "00");
              }
              if (a.length == 5) {
              node.value = hexTorgb("#" + a + "0");
              }
          } else {
              var c = node.value.replace(/[#]/g,'')
              if (c.length == 3) {
              node.value = hexTorgb("#" + c + c);
              }
              if (c.length == 2) {
              node.value = hexTorgb("#" + c + c + c);
              }
              if (c.length == 1) {
              node.value = hexTorgb("#" + c + c + c + c + c + c);
              }
              if (c.length == 4) {
              node.value = hexTorgb("#" + c + "00");
              }
              if (c.length == 5) {
              node.value = hexTorgb("#" + c + "0");
              }
              if (c.length == 6) {
              node.value = hexTorgb("#" + c);
              }
          }
          } else {
              if (node.value.replace(/[#]/g,'').replace(/[^0-9a-fA-F]/g,'').trim().length >= 6) {
                  node.value = hexTorgb('#' + node.value.replace(/[#]/g,'').replace(/[^0-9a-fA-F]/g,'').trim().substring(0, 6));
              } else {
                  node.value = info[1]
                  tipsAll(['请输入正确的色值','Should be color'],1000);
              }
          }
      }
    } else if (node.value.toLowerCase().split('rgb(').length > 1){
      let RGB = node.value.toLowerCase().replace('rgb(','').replace(')','').split(',')
      RGB = RGB.map(item => item.replace(/[^0-9a-fA-F]/g,'').trim());
      
      if(RGB.length == 3){
        RGB.forEach((item,index) => {
          if(item * 1 >= 255){
            RGB[index] = 255
          }
        });
        node.value = `rgb(${RGB[0]},${RGB[1]},${RGB[2]})`
      } else {
        tipsAll(['请输入正确的色值','Should be color'],1000);
      }
    }
  }
  if(type === "hsl"){
    if(node.value.toLowerCase().split('#').length > 1){//兼容HEX
      let values = '#' +  node.value.replace(/[#]/g,'');
      if (values == '#' || values.replace(/[0-9a-fA-F]/g,'').trim().length > 1) {
      node.value = info[1];
      tipsAll(['请输入正确的色值','Should be color'],1000);
      } else {
          if (node.value.length < 7) {
          if (node.value[0] == '#') {
              var a = node.value.replace(/[#]/g,'');
              if (a.length == 3) {
              let hex = "#" + a + a;
              let RGB = hexTorgb(hex);
              let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
              node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              }
              if (a.length == 2) {
              let hex = "#" + a + a + a;
              let RGB = hexTorgb(hex);
              let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
              node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              }
              if (a.length == 1) {
              let hex = "#" + a + a + a + a + a + a;
              let RGB = hexTorgb(hex);
              let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
              node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              }
              if (a.length == 4) {
              let hex = "#" + a + "00";
              let RGB = hexTorgb(hex);
              let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
              node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              }
              if (a.length == 5) {
              let hex = "#" + a + "0";
              let RGB = hexTorgb(hex);
              let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
              node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              }
          } else {
              var c = node.value.replace(/[#]/g,'')
              if (c.length == 3) {
              let hex = "#" + c + c;
              let RGB = hexTorgb(hex);
              let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
              node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              }
              if (c.length == 2) {
              let hex = "#" + c + c + c;
              let RGB = hexTorgb(hex);
              let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
              node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              }
              if (c.length == 1) {
              let hex = "#" + c + c + c + c + c + c;
              let RGB = hexTorgb(hex);
              let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
              node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              }
              if (c.length == 4) {
              let hex = "#" + c + "00";
              let RGB = hexTorgb(hex);
              let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
              node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              }
              if (c.length == 5) {
              let hex = "#" + c + "0";
              let RGB = hexTorgb(hex);
              let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
              node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              }
              if (c.length == 6) {
              let hex = "#" + c;
              let RGB = hexTorgb(hex);
              let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
              node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              }
          }
          } else {
              if (node.value.replace(/[#]/g,'').replace(/[^0-9a-fA-F]/g,'').trim().length >= 6) {
                  let hex = '#' + node.value.replace(/[#]/g,'').replace(/[^0-9a-fA-F]/g,'').trim().substring(0, 6);
                  let RGB = hexTorgb(hex);
                  let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
                  node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`;
              } else {
                  node.value = info[1]
                  tipsAll(['请输入正确的色值','Should be color'],1000);
              }
          }
      }
    } else if (node.value.toLowerCase().split('rgb(').length > 1){//兼容RGB
      let RGB = node.value.toLowerCase().replace('rgb(','').replace(')','').split(',')
      RGB = RGB.map(item => item.replace(/[^0-9]/g,'').trim());
      if(RGB.length == 3){
        RGB.forEach((item,index) => {
          if(item * 1 >= 255){
            RGB[index] = 255
          }
        });
        let HSL = rgbTohsl(RGB[0], RGB[1], RGB[2]);
        node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`
      } else {
        tipsAll(['请输入正确的色值','Should be color'],1000);
      }
    } else if (node.value.toLowerCase().split('hsl(').length > 1){
      let HSL = node.value.toLowerCase().replace('hsl(','').replace(')','').split(',')
      HSL = HSL.map(item => item.replace(/[^0-9.]/g,'').trim());
      if(HSL.length == 3){
        HSL.forEach((item,index) => {
          if(index === 0){
            if(item * 1 >= 360){
              HSL[index] = 360
            } else if(item * 1 < 0){
              HSL[index] = 0
            }
          } else {
            if(item * 1 >= 100){
              HSL[index] = 100
            } else if(item * 1 < 0){
              HSL[index] = 0
            }
          }
        });
        node.value = `hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`
      } else {
        tipsAll(['请输入正确的色值','Should be color'],1000);
      }
    }
  }
}

function reTV(){
  TV.forEach(item => {
    let long = item.offsetWidth + item.parentNode.offsetWidth;
    item.style.setProperty('--tv-s',Math.floor(long/30) + 's');
    item.setAttribute('data-tv',TV_MOVE)
  })

}

/**
 * 
 * @param {boolean} isLight -默认为深色主题，为true时改为亮色主题
 * 通过[data-theme:"light" | "dark"]配合css的自定义属性控制
 * --mainColor: ;//主要字色，护眼对比，不建议黑/白
   --mainColor2: ;//主要字色，高对比，如黑/白
   --themeColor: ;//主题色，高亮彩色
   --themeColor2: ;//辅助色，高亮彩色
   --code1: ;//代码高亮
   --code2: ;//代码高亮
   --boxBod: ;//控件描边色
   --boxBak: ;//控件/大背景色
   --boxGry: ;//模块底色、过渡色
   --liColor: ;//高亮警示色，通常用红
   --swi-af: ;//switch拇指控件填充颜色
   --swi-bod: ;//switch描边颜色
   --swi-bak: ;//switch底色颜色
   --range-af: ;//滑块拇指控件颜色
 */
function setTheme(isLight,istips){
  if(isLight){
    ROOT.setAttribute("data-theme","light");
    THEME_SWITCH.forEach(item => {
      item.checked = false;
    });
    storageMix.set('userTheme','light');
    if(istips){
      tipsAll(['已切换为亮色主题','Change to light theme'],2000,3);
    };
  }else{
    ROOT.setAttribute("data-theme","dark");
    THEME_SWITCH.forEach(item => {
      item.checked = true;
    });
    storageMix.set('userTheme','dark');
    if(istips){
      tipsAll(['已切换为暗色主题','Change to dark theme'],2000,3);
    };
  };
}

function setLanguage(isZh,istips){
  if(isZh){
    ROOT.setAttribute("data-language","Zh");
    LANGUAGE_SWITCH.forEach(item => {
      item.checked = true;
      item.parentNode.style.setProperty('--swi-text',`'Zh'`);
    });
    storageMix.set('userLanguage','Zh');
    if(istips){
      tipsAll('已切换为中文',2000,3);
    }
    let texts = document.querySelectorAll('[data-zh-text]');
    texts.forEach(item => {
      item.innerHTML = item.getAttribute('data-zh-text');
    });

    let inputs = document.querySelectorAll('[data-zh-input]');
    inputs.forEach(item => {
      item.value = item.getAttribute('data-zh-input');
    });

    let placeholders = document.querySelectorAll('[data-zh-placeholder]');
    placeholders.forEach(item => {
      item.placeholder = item.getAttribute('data-zh-placeholder');
    });

  }else{
    ROOT.setAttribute("data-language","En");
    LANGUAGE_SWITCH.forEach(item => {
      item.checked = false;
      item.parentNode.style.setProperty('--swi-text',`'En'`);
    });
    storageMix.set('userLanguage','En');
    if(istips){
      tipsAll('Change to English',2000,3);
    }

    let texts = document.querySelectorAll('[data-en-text]');
    texts.forEach(item => {
      item.setAttribute('data-zh-text',item.innerHTML);
      item.innerHTML = item.getAttribute('data-en-text');
    });

    let inputs = document.querySelectorAll('[data-en-input]');
    inputs.forEach(item => {
      item.setAttribute('data-zh-input',item.value);
      item.value = item.getAttribute('data-en-input');
    });

    let placeholders = document.querySelectorAll('[data-en-placeholder]');
    placeholders.forEach(item => {
      let placeholder = item.placeholder;
      item.setAttribute('data-zh-placeholder',placeholder);
      item.placeholder = item.getAttribute('data-en-placeholder');
    });
  }
}

/**
 * 
 * @param {Element} node - 包裹了需要被复制的内容的容器，也可以是{id:xxx}
 * @param {any} type - text | self | toimg
 * @param {string?} other - 通过其他方法得到的用于复制的字符串或图片信息
 */
function copyMix(node,type,other){
  let copyText = '';
  node = node.innerHTML ? node : document.getElementById(node.id);
  if(!node){
    node = {
      textContent:'',
      innerHTML:''
    }
  }
  if(type === 'text'){
    if(other){
      copyText = other;
    } else {
      copyText = node.textContent;
    }
  };
  if(type === 'self'){
    copyText = node.innerHTML;
  };
  if(type === 'toimg'){
    
  };
  navigator.clipboard.writeText(copyText) 
  .then(function() {
    tipsAll(['复制成功','Successfully copied'],2000);
  });
}

/**
 * 全局提示
 * @param {string | Array} string - 全局提示内容,可以是单个文案或多语言数组
 * @param {number} time - 提示停留时间
 * @param {number?} num  - 提示次数（如有）
 */
function tipsAll(string,time,num){
  if(typeof string !== 'string'){
    string = ROOT.getAttribute('data-language') == 'En' ? string[1] : string[0]
  }
  if(num){
    if(TIPS_TIMES.some(item => item.split('#')[0] == string )){
      //console.log(TIPS_TIMES)
      TIPS_TIMES.forEach((item,index)=> {
        if(item.split('#')[0] == string){
          if( item.split('#')[1]*1 > 1){
            TIPS_TIMES[index] = item.split('#')[0] + '#' + (item.split('#')[1]*1 - 1);
            //console.log(item.split('#')[0] + '#' + (item.split('#')[1]*1 - 1))
            TIPS.style.display = "flex";
            TIPS_TEXT.innerHTML = string;
          }
        }
      });
      } else {
        TIPS_TIMES.push(string + '#' + num);
        TIPS.style.display = "flex";
        TIPS_TEXT.innerHTML = string;
      }
  } else {
    TIPS.style.display = "flex";
    TIPS_TEXT.innerHTML = string;
  }
  
  setTimeout(()=>{
    TIPS.style.animation = "overOp 0.2s"//退场
    setTimeout(()=>{//重置
      TIPS.style.display = "none";
      TIPS_TEXT.innerHTML = '';
      TIPS.style.animation = "boxUp 0.2s"
    },190)//必须小于上一个动画的时长，不然会播两个动画
  },time)
}

/**
 * 
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 * @returns '#' + R + G + B
 */
function rgbTohex(r,g,b){
  r = r * 1;
  g = g * 1;
  b = b * 1;
  let R = r.toString(16).padStart(2,0);
  let G = g.toString(16).padStart(2,0);
  let B = b.toString(16).padStart(2,0);
  return '#' + R + G + B;
}

/**
 * 
 * @param {string} hex - '#' + R + G + B
 * @returns {Array} [R,G,B]
 */
function hexTorgb(hex){
  let R = parseInt(hex[1] + hex[2], 16);
  let G = parseInt(hex[3] + hex[4], 16);
  let B = parseInt(hex[5] + hex[6], 16);
  return [R,G,B]
}

/**
 * 
 * @param {number} r - 浮点数或0-255
 * @param {number} g - 浮点数或0-255
 * @param {number} b - 浮点数或0-255
 * @returns {Array} [H,S,L]
 */
function rgbTohsl(r,g,b){
  /*转为浮点数*/
  r = r * 1 <= 255 ? r/255 : 1;
  g = g * 1 <= 255 ? g/255 : 1;
  b = b * 1 <= 255 ? b/255 : 1;
  /*不能为负数*/
  r = r >= 0 ? r : 0;
  g = g >= 0 ? g : 0;
  b = b >= 0 ? b : 0;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // 灰度色
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return [h, s, l];

}

/**
 * 
 * @param {number} h - 0-360 或 %360
 * @param {number | string} s - 可带%，0-100 或 %100
 * @param {number | string} l - 可带%，0-100 或 %100
 * @param { 1 | 100 | 255} maxNum - 浮点数 | 百分数 | 十进制值（0-255）
 * @returns [R,G,B]
 */
function hslTorgb(h, s, l,maxNum) {
  //去掉符号
  s = s * 1 !== 'NaN' ? s : s.replace("%","") * 1;
  l = l * 1 !== 'NaN' ? l : l.replace("%","") * 1;
  //约束取值
  h = h >= 0 ? h : 360 + h%360;
  s = s >= 0 ? s : 100 + s%100;
  l = l >= 0 ? l : 100 + l%100;
  h = h <= 360 ? h : h%360;
  s = s <= 100 ? s : s%100;
  l = l <= 100 ? l : l%100;
  // 将色相h从角度转换为弧度
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
      // 饱和度为0时是灰色，使用亮度作为RGB所有值
      r = g = b = l;
  } else {
      const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
  }

 
  return [Math.round(r * maxNum),Math.round(g * maxNum),Math.round(b * maxNum)];
}

/**
 * 
 * @param {number} h - 0-360 或 %360
 * @param {number | string} s - 可带%，0-100 或 %100
 * @param {number | string} l - 可带%，0-100 或 %100
 * @returns [H,S,V]
 */
function hslTohsv(h,s,l) {
  //去掉符号
  s = s * 1 !== 'NaN' ? s : s.replace("%","") * 1;
  l = l * 1 !== 'NaN' ? l : l.replace("%","") * 1;
  //转为浮点数
  s /= 100;
  l /= 100;

  let v;
  if (s === 0) {
      // 如果饱和度为0，则HSV的饱和度也为0，明度等于HSL的亮度
      v = l;
      return [h,0,Math.floor(v * 100)];
  } else {
      if (l <= 0.5) {
          v = l * (1 + s);
      } else {
          v = l + s - l * s;
      }
      let sv = (2 * (v - l)) / v;
      if (l == 0){
          sv = s
      }
      if (l == 1){
          sv = 0
      }
      return [h,Math.floor(sv * 100),Math.floor(v * 100)]; // 返回HSV值，乘以100以匹配常见的百分比表示法
  }
}

/**
 * 
 * @param {number} h - 0-360 或 %360
 * @param {number | string} s - 可带%，0-100 或 %100
 * @param {number | string} v - 可带%，0-100 或 %100
 * @returns [H,S,l]
 */
function hsvTohsl(h, s, v) {
  //去掉符号
  s = s * 1 !== 'NaN' ? s : s.replace("%","");
  v = v * 1 !== 'NaN' ? v : v.replace("%","");
  //转为浮点数
  s /= 100;
  v /= 100;
  let l = (2 - s) * v / 2;

  if (l !== 0) {
      if (l === 1) {
          s = 0;
      } else {
          s = s * v / (l < 0.5 ? 2 * l : 2 - 2 * l);
      }
  } else {
      s = 0;
  }
  return [h,Math.floor(s * 100),Math.floor(l * 100)]; // 返回HSL值，乘以100以匹配常见的百分比表示法

}

/**
 * 下拉组件拓展
 * @param {Element | string} node1 - checkbox对象本身 | ID | 自定义属性
 * @param {Element | string} node2 - 需要显影的对象本身 | ID | 自定义属性
 * @param {string} display -显示后的display值，一般为block | flex
 * @param {string} checked -显示后的checked值，一般是选中（true）情况下收起，未选中情况下展开，如需反转，要设为false
 */
function showNext(node1,node2,display,checked){
  let nodeA = getElementMix(node1),nodeB = getElementMix(node2);
  display = display || 'block';
  checked = checked ? false : true;//一般是选中情况下收起，未选中情况下展开，如需反转，要设为false
  nodeB.style.display = (nodeA.checked == checked) ? display : 'none';
}

/**
 * 封装console.log()打印，让打印内容按条件可选择仅在本地环境打印
 * @param {any} info
 * @param {string} type -local | online | all | null(=local)
 */
function log(info,type){
  switch (type){
    case 'local' :if(ISLOCAL){console.log(info)};break
    case 'online' :if(!ISLOCAL){console.log(info)};break
    case 'all' :console.log(info);break
    default :if(ISLOCAL){console.log(info)};break
  }
}

/**
 * @param {string} regex - 带格式占位的字符串，如"YYYY年MM月DD日"
 * @param {Boolean} isZh - 是否用中文表示
 */
function getDate(regex,isZh){
  let now = new Date();
  let YYYY = now.getFullYear();
  let M = now.getMonth()*1 + 1;
  let MM = M.toString().padStart(2,'0');
  let D = now.getDate();
  let DD = D.toString().padStart(2,'0');
  let numZh = ['〇','一','二','三','四','五','六','七','八','九','十','十一','十二'];
  if(isZh){
    YYYY = Array.from(YYYY.toString()).map(item => {return numZh[item*1]} ).join('');
    M = numZh[M];
    MM = M;
    if(D >= 10){
      D = Array.from(D.toString());
      D[0] = D[0] == '1' ? '十' : numZh[D[0]*1] + '十';
      D[1] = D[1] == '0' ? '' : numZh[D[1]*1];
      D = D.join('');
    } else {
      D = numZh[D];
    };
    DD = D;
    //console.log(`${YYYY}年${MM}月${DD}日`)
  }
  regex = regex.replace('YYYY',YYYY);
  regex = regex.replace('MM',MM);
  regex = regex.replace('DD',DD);
  regex = regex.replace('M',M);
  regex = regex.replace('D',D);
  return [regex,[YYYY,MM,DD]];
}

/**
 * @param {string} regex - 带格式占位的字符串，如"YYYY年MM月DD日"
 * @param {Boolean} is12 - 是否用12小时制
 */
function getTime(regex,is12){
  let now = new Date();
  let H = now.getHours();
  let HH = H.toString().padStart(2,'0');
  let M = now.getMinutes();
  let MM = M.toString().padStart(2,'0');
  let S = now.getSeconds();
  let SS = S.toString().padStart(2,'0');
  if(is12){
    if(H >= 12){
      H = H - 12;
      HH = H.toString().padStart(2,'0');
    }
  }
  regex = regex.replace('HH',HH);
  regex = regex.replace('MM',MM);
  regex = regex.replace('SS',SS);
  regex = regex.replace('H',H);
  regex = regex.replace('M',M);
  regex = regex.replace('S',S);
  return [regex,[HH,MM,SS]];
}

//通用X轴滚动
let scrollNode = document.querySelectorAll('[data-scroll]');
scrollNode.forEach(item =>{
  scrollX(item)
})
function scrollX(node){
  let nodeScroll = false;
  let nodeStartX,nodeScrollLeft;
  node.addEventListener('mousedown',(event)=>{
    nodeScroll = true;
    nodeStartX = event.clientX;
    nodeScrollLeft = node.scrollLeft;  
    document.addEventListener('mousemove',(e)=>{
      if(nodeScroll){
        let move = e.clientX - nodeStartX;
        node.scrollLeft = nodeScrollLeft - move;
      }
    });
    document.addEventListener('mouseup',()=>{
      nodeScroll = false;
    })
  });
}

/**
 * 兼容传入的是 对象本身 | ID | 自定义属性
 * @param {Element | id | Attribute} node 
 */
function getElementMix(mix, { 
  isCreate = false, 
  tagName = 'div', 
  parent = document.body 
} = {}) {
  if (!mix) return null;
  
  // 查找现有元素
  let node = mix instanceof HTMLElement ? mix : 
             document.getElementById(mix) || 
             document.querySelector(`[${mix}]`);
  
  // 创建新元素
  if (!node && isCreate) {
    node = document.createElement(tagName);
    mix.startsWith('data-') ? node.setAttribute(mix, '') : 
    node.setAttribute('id', mix);
    parent.appendChild(node);
  }
  
  return node || null;
}

//模拟change事件来关闭展开的内容
function closeShowNexts(e,area,input,isChecked){
  if(typeof input == 'string'){
    input = getElementMix(input);
  }
  if(typeof area == 'string'){
    area = getElementMix(area);
  }
  if(!area.contains(e.target)){
    isChecked = isChecked ? true : false
    input.checked = isChecked;
    let inputEvent = new Event('change',{bubbles:true});
    input.dispatchEvent(inputEvent);
  };
};

//防抖函数
/**
 * 立即执行且自动防抖的函数包装器
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 防抖延迟(毫秒)
 * @param {boolean} immediate - 是否立即执行（第一次调用时立即执行，后续调用防抖）
 * @returns {Function} 防抖后的函数
 * 
 * @example
 * // 标准防抖（延迟执行）
 * btn.addEventListener('click', debounce((e) => {
 *   console.log('clicked', e.target);
 * }, 500));
 * 
 * // 立即执行防抖（第一次立即执行，后续防抖）
 * input.addEventListener('input', debounce((e) => {
 *   console.log('input', e.target.value);
 * }, 300, true));
 */
function debounce(fn, delay, immediate = false) {
  let timer = null;
  let hasExecuted = false; // 用于立即执行模式的标志
  
  return function execute(...args) {
    const context = this; // 保存 this 上下文
    const callNow = immediate && !hasExecuted; // 是否立即执行
    
    // 清除之前的定时器
    clearTimeout(timer);
    
    // 立即执行模式：第一次调用时立即执行
    if (callNow) {
      fn.apply(context, args);
      hasExecuted = true;
      // 延迟后重置标志，允许下次立即执行
      timer = setTimeout(() => {
        hasExecuted = false;
        timer = null;
      }, delay);
      return;
    }
    
    // 标准防抖模式：延迟执行
    timer = setTimeout(() => {
      fn.apply(context, args);
      timer = null;
      if (immediate) {
        hasExecuted = false; // 重置标志
      }
    }, delay);
  };
};