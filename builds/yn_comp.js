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

class btntheme extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 12 12">
      <g>
      <g>
        <rect x="5" y="9" width="1.5" height="3" rx="0" 
        fill="var(--theme-l)" fill-opacity="1" />
      </g>
      <g transform="matrix(0.71,0.71,-0.71,0.71,6.1715640705951955,-0.07104350035297102)">
        <rect x="3.171539306640625" y="7.414215087890625" width="1.5" height="3" rx="0" 
        fill="var(--theme-l)" fill-opacity="1" />
      </g>
      <g>
        <rect x="5.25" y="0" width="1.5" height="3" rx="0" 
        fill="var(--theme-l)" fill-opacity="1" />
      </g>
      <g>
        <ellipse cx="6" cy="6" rx="2" ry="2" 
        fill="var(--theme-l)" fill-opacity="1" />
      </g>
      <g transform="matrix(0.71,0.71,-0.71,0.71,3.5355376705865638,-6.435017716257789)">
        <rect x="9.5355224609375" y="1.050262451171875" width="1.5" height="3" rx="0" 
        fill="var(--theme-l)" fill-opacity="1" />
      </g>
      <g transform="matrix(5.400848479553133e-8,1,-1,5.400848479553133e-8,16.999999351898182,-7.000000270042424)">
        <rect x="12" y="5" width="1.5" height="3" rx="0" 
        fill="var(--theme-l)" fill-opacity="1" />
      </g>
      <g transform="matrix(-0.71,0.71,-0.71,-0.71,25.434929892247965,8.535490881769874)">
        <rect x="10.94970703125" y="9.535491943359375" width="1.5" height="3" rx="0" 
        fill="var(--theme-l)" fill-opacity="1" />
      </g>
      <g transform="matrix(5.400848479553133e-8,1,-1,5.400848479553133e-8,7.999999837974546,1.999999729957576)">
        <rect x="3" y="5" width="1.5" height="3" rx="0" fill="var(--theme-l)" 
        fill-opacity="1" />
      </g>
      <g transform="matrix(-0.71,0.71,-0.71,-0.71,10.070989280409776,2.1715382450511242)">
        <rect x="4.58575439453125" y="3.171539306640625" width="1.5" height="3" rx="0" 
        fill="var(--theme-l)" fill-opacity="1" />
      </g>
      </g>
    </svg>
    <svg style="position: absolute; top: -2px; left: 0;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 12 12">
      <g>
      <path fill-rule="evenodd" fill="var(--theme-d)" fill-opacity="1"
      d="M1.38229,8.82346Q1.51731,8.82346,1.65217,8.81683Q1.78702,8.81021,1.92139,8.79697Q2.05576,8.78374,2.18931,8.76393Q2.32287,8.74411,2.45529,8.71777Q2.58771,8.69143,2.71868,8.65863Q2.84966,8.62582,2.97886,8.58663Q3.10806,8.54743,3.23519,8.50195Q3.36231,8.45646,3.48705,8.40479Q3.61179,8.35312,3.73385,8.2954Q3.8559,8.23767,3.97498,8.17402Q4.09405,8.11038,4.20986,8.04096Q4.32567,7.97155,4.43793,7.89654Q4.55019,7.82153,4.65864,7.7411Q4.76709,7.66067,4.87146,7.57501Q4.97583,7.48936,5.07587,7.39869Q5.17591,7.30801,5.27138,7.21254Q5.36685,7.11707,5.45752,7.01703Q5.5482,6.91699,5.63385,6.81262Q5.7195,6.70825,5.79993,6.5998Q5.88036,6.49135,5.95538,6.37909Q6.03039,6.26683,6.0998,6.15102Q6.16921,6.03521,6.23286,5.91614Q6.29651,5.79706,6.35423,5.67501Q6.41196,5.55295,6.46363,5.42821Q6.5153,5.30347,6.56079,5.17635Q6.60627,5.04922,6.64547,4.92002Q6.68466,4.79082,6.71747,4.65985Q6.75027,4.52888,6.77661,4.39645Q6.80295,4.26403,6.82276,4.13047Q6.84258,3.99692,6.85581,3.86255Q6.86904,3.72818,6.87567,3.59333Q6.88229,3.45847,6.88229,3.32346Q6.88229,2.87639,6.81009,2.4352Q6.73789,1.99401,6.59539,1.57027Q6.45288,1.14653,6.24381,0.751369Q6.03474,0.356206,5.7646,-0.00000434251Q5.98378,0.0569073,6.19753,0.131643Q6.41128,0.206379,6.61817,0.298434Q6.82506,0.390488,7.02368,0.499238Q7.2223,0.607988,7.41131,0.732697Q7.60032,0.857406,7.77844,0.99723Q7.95655,1.13705,8.12257,1.29105Q8.28859,1.44504,8.44139,1.61216Q8.59419,1.77928,8.73274,1.95839Q8.87128,2.13751,8.99463,2.3274Q9.11798,2.5173,9.22531,2.71669Q9.33263,2.91609,9.4232,3.12363Q9.51377,3.33117,9.58698,3.54546Q9.66018,3.75974,9.71552,3.97932Q9.77086,4.19889,9.80796,4.42228Q9.84507,4.64566,9.86368,4.87134Q9.88229,5.09701,9.88229,5.32346Q9.88229,5.45847,9.87567,5.59333Q9.86904,5.72818,9.85581,5.86255Q9.84258,5.99692,9.82276,6.13047Q9.80295,6.26403,9.77661,6.39645Q9.75027,6.52888,9.71747,6.65985Q9.68466,6.79082,9.64546,6.92002Q9.60627,7.04922,9.56079,7.17635Q9.5153,7.30347,9.46363,7.42821Q9.41196,7.55295,9.35423,7.67501Q9.29651,7.79706,9.23286,7.91614Q9.16921,8.03521,9.0998,8.15102Q9.03039,8.26683,8.95538,8.37909Q8.88036,8.49135,8.79993,8.5998Q8.7195,8.70825,8.63385,8.81262Q8.5482,8.91699,8.45752,9.01703Q8.36685,9.11707,8.27138,9.21254Q8.17591,9.30801,8.07587,9.39869Q7.97583,9.48936,7.87146,9.57501Q7.76709,9.66067,7.65864,9.7411Q7.55019,9.82153,7.43793,9.89654Q7.32567,9.97155,7.20986,10.041Q7.09405,10.1104,6.97498,10.174Q6.8559,10.2377,6.73385,10.2954Q6.61179,10.3531,6.48705,10.4048Q6.36231,10.4565,6.23519,10.5019Q6.10806,10.5474,5.97886,10.5866Q5.84966,10.6258,5.71868,10.6586Q5.58771,10.6914,5.45529,10.7178Q5.32287,10.7441,5.18931,10.7639Q5.05576,10.7837,4.92139,10.797Q4.78702,10.8102,4.65217,10.8168Q4.51731,10.8235,4.38229,10.8235Q4.06502,10.8235,3.74985,10.787Q3.43469,10.7505,3.1258,10.678Q2.81692,10.6055,2.51842,10.498Q2.21992,10.3905,1.93577,10.2494Q1.65161,10.1082,1.38557,9.93536Q1.11953,9.76249,0.87513,9.56018Q0.630731,9.35786,0.411216,9.12879Q0.191702,8.89971,-0.0000144195,8.64691Q0.679868,8.82346,1.38229,8.82346Z" 
      />
      </g>
    </svg>
    `;
  }
};
customElements.define('btn-theme', btntheme);

class btnclose extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="wh100 btn-op" style="border:1px var(--boxBod) solid; padding:20%; box-sizing: border-box; flex:0 0 auto; border-radius: 50%;">
        <svg width="100%" height="100%" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.52515" y="0.318024" width="8" height="1" transform="rotate(45 1.52515 0.318024)" fill="var(--mainColor)"/>
          <rect x="7.18188" y="1.02512" width="8" height="1" transform="rotate(135 7.18188 1.02512)" fill="var(--mainColor)"/>
        </svg>
      </div>
    `;
  }
};
customElements.define('btn-close', btnclose);

class btncopy extends HTMLElement {
  constructor() {
    super();
    this.className = 'btn-op'
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 11 11">  
      <path  fill-rule="evenodd" fill="var(--add,transparent)" fill-opacity="1"
      d="M5,2L4,2L4,4L2,4L2,5L4,5L4,7L5,7L5,5L7,5L7,4L5,4L5,2Z"/>
      <path fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1"
      d="M0,2.5L0,6.5Q0,7.53553,0.732233,8.26777Q1.29574,8.83127,2.03888,8.96112Q2.16872,9.70426,2.73223,10.2678Q3.46447,11,4.5,11L8.5,11Q9.53553,11,10.2678,10.2678Q11,9.53553,11,8.5L11,4.5Q11,3.46447,10.2678,2.73223Q9.70426,2.16872,8.96112,2.03888Q8.83127,1.29574,8.26777,0.732233Q7.53553,0,6.5,0L2.5,0Q1.46447,0,0.732233,0.732233Q0,1.46447,0,2.5ZM9,3.08099L9,6.5Q9,7.53553,8.26777,8.26777Q7.53553,9,6.5,9L3.08099,9Q3.18864,9.30996,3.43934,9.56066Q3.87868,10,4.5,10L8.5,10Q9.12132,10,9.56066,9.56066Q10,9.12132,10,8.5L10,4.5Q10,3.87868,9.56066,3.43934Q9.30996,3.18864,9,3.08099ZM1.43934,7.56066Q1,7.12132,1,6.5L1,2.5Q1,1.87868,1.43934,1.43934Q1.87868,1,2.5,1L6.5,1Q7.12132,1,7.56066,1.43934Q8,1.87868,8,2.5L8,6.5Q8,7.12132,7.56066,7.56066Q7.12132,8,6.5,8L2.5,8Q1.87868,8,1.43934,7.56066Z" 
      />
    </svg>
    `;
  }
};
customElements.define('btn-copy', btncopy);

class btnshow extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 10 10">
      <path class="path1" d="M5.5,2L8,2L8,4.5L10,4.5L10,0L5.5,0L5.5,2Z" fill="var(--boxBod)" fill-opacity="1"></path>
      <path class="path2" d="M4.5,8L2,8L2,5.5L0,5.5L0,10L4.5,10L4.5,8Z" fill="var(--boxBod)" fill-opacity="1"></path>
    </svg>
    `;
  }
};
customElements.define('btn-show', btnshow);

class btncheck extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="8" stroke="var(--mainColor)" stroke-width="1" fill="rgba(0,0,0,0)"></circle>
      <circle cx="9" cy="9" r="5" fill="var(--check,transparent)"></circle>
    </svg>
    `;
  }
};
customElements.define('btn-check', btncheck);

class btninfo extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <div class="wh100 fl0" >
      <svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(7,3.5),scale(0.9)">
          <rect x="1" y="0" width="2" height="2" rx="1" fill="var(--icon-info,var(--mainColor))"/>
          <rect x="0" y="4" width="2" height="2" rx="1" fill="var(--icon-info,var(--mainColor))"/>
          <rect x="1" y="4" width="2" height="8" rx="1" fill="var(--icon-info,var(--mainColor))"/>
          <rect x="0" y="10" width="4.5" height="2" rx="1" fill="var(--icon-info,var(--mainColor))"/>
        </g>
        <circle cx="9" cy="9" r="8" stroke="var(--icon-info,var(--mainColor))" stroke-width="1.5" fill="rgba(0,0,0,0)"></circle>
      </svg>
    </div>
    `;
    this.className = 'btn-op wh100'
  }
};
customElements.define('btn-info', btninfo);

class btncolor extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 28 20">
      <rect x="3" y="3" width="22" height="14" rx="2"  fill="var(--input-color,#888)"></rect>
    </svg>
    `;
  }
};
customElements.define('btn-color', btncolor);

class btngetcolor extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.2451 0.843894C18.4624 1.72834 18.7323 3.43233 17.8479 4.64963L17.232 5.49736C16.9119 5.93789 16.48 6.28474 15.9811 6.503L15.6732 6.63776C15.3775 6.76713 15.1218 6.973 14.9313 7.23347L16.4451 8.33327C17.2597 8.92511 17.4403 10.0654 16.8484 10.88C16.2566 11.6946 15.1163 11.8752 14.3017 11.2833L13.759 10.889L10.0388 16.0093L9.88345 16.1982C9.49725 16.6142 8.95078 16.8532 8.37579 16.8495L8.13182 16.863C7.56808 16.9275 7.05142 17.2253 6.71355 17.6903L5.44098 19.4419L5.35853 19.5437C4.92661 20.0266 4.19086 20.1136 3.65542 19.7247L3.55299 19.643C3.10247 19.2399 2.9972 18.5715 3.30122 18.049L3.37261 17.9391L4.59525 16.2563C4.98389 15.7211 5.09173 15.0347 4.89147 14.4098L4.84661 14.2854C4.60525 13.6697 4.67383 12.9777 5.025 12.4233L5.09933 12.3144L8.76818 7.26298L8.22541 6.86864C7.41096 6.27677 7.23027 5.13646 7.82205 4.32193C8.41385 3.50739 9.55418 3.32688 10.3688 3.91857L11.8833 5.01894C12.0722 4.75741 12.188 4.44987 12.2198 4.12877L12.2528 3.79425C12.3065 3.25271 12.5037 2.73473 12.8235 2.29439L13.4394 1.44666C14.3237 0.229035 16.0277 -0.0406572 17.2451 0.843894ZM6.71736 13.49C6.7039 13.5086 6.70057 13.5335 6.70878 13.5549L6.7957 13.7991C6.93098 14.2211 6.99373 14.6572 6.98838 15.0907C7.43137 14.9303 7.90528 14.8463 8.38897 14.8493C8.4013 14.8493 8.41346 14.8437 8.42077 14.8338L12.1409 9.71342L10.3862 8.43855L6.71736 13.49Z" 
      fill-rule="evenodd" clip-rule="evenodd" fill="var(--mainColor)"/>
    </svg>
    `;
  }
};
customElements.define('btn-getcolor', btngetcolor);

class cardcolorpick extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <div data-input-color="box" class="df-ffc" style="gap: 4px; display: none; --hsl-h: 0; --hsl-s: 0; --hsl-l: 53; --hsv-s: 0; --hsv-v: 53;">
      <div data-input-color="hsv"></div>
      <div data-number-value="0" class="df-lc" style="gap: 4px;">
        <input data-input="hsl-h" type="range" min="0" max="360" value="0"/>
        <input data-input="value" data-input-color="hsl-h" data-input-must="0-360" type="text" class="txt-c" style="padding: 1px 1px; width: 22px; font-size: 10; flex: 0 0 auto;" value="0" />  
      </div>
    </div>
    `;
    this.className = 'pos-a'
    this.style.top = 'var(--colorcard-top)'
    this.style.left = 'var(--colorcard-left)'
  }
};
customElements.define('card-colorpick', cardcolorpick);

let ISLOCAL = false;
if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || PULGIN_LOCAL){
  ISLOCAL = true;
};

let GETCOLOR = null;
let TIPS_TIMES = [];
let USER_KEYING = false;
let COMPS = ['btn-theme','btn-close','btn-copy','btn-show','btn-info','btn-check','btn-color','btn-getcolor','card-colorpick'];

let TV = document.querySelectorAll('[data-TV]');//轮播公告
let TV_MOVE = false;//用于结合一定条件触发轮播
let TAB_AUTO = document.querySelectorAll('[data-tab="auto"]');
let TIPS = document.getElementById('tips-all');
let TIPS_TEXT = document.getElementById('tips-all-text');
let THEME_SWITCH = document.querySelectorAll("[data-theme-check]");
let LANGUAGE_SWITCH = document.querySelectorAll("[data-language-check]");

function COMP_MAIN(){
  /*可动态添加的元素*/
  let SELECT_PICK = document.querySelectorAll('[data-select-pick]');
  let SELECT_OPTION = document.querySelectorAll('[data-option="option"]');
  let INPUT = document.querySelectorAll('[data-input]');//所有input类型组件
  let INPUT_CHECK = document.querySelectorAll('[data-check]');
  let INPUT_MUST_TEXT = document.querySelectorAll('[data-input-type="text"]');//所有必填且为空时返回一个默认值的组件
  let INPUT_MUST_INT = document.querySelectorAll('[data-input-type="int"]');//所有必填且为空时返回一个默认值的组件
  let INPUT_MUST_FLOAT = document.querySelectorAll('[data-input-type="float"]');//所有必填且为空时返回一个默认值的组件
  let INPUT_MAX = document.querySelectorAll('[data-input-max]');//所有设置最大输入字数的组件
  let INPUT_RANGE = document.querySelectorAll('[data-input="range"]');//所有滑块类型,注意要进一步判断自定义属性的值
  let INPUT_VALUE = document.querySelectorAll('[data-input="value"]');
  let INPUT_GETCOLOR = document.querySelectorAll('[data-getcolor]')
  let INPUT_COLOR = document.querySelectorAll('[data-input="colorpick"]');
  let INPUT_COLOR_TYPE = document.querySelectorAll('[data-input="colortype"]');
  let INPUT_HEX = document.querySelectorAll('[data-input="hex"]');
  let INPUT_RGB = document.querySelectorAll('[data-input="rgb"]');
  let INPUT_HSL_H = document.querySelectorAll('[data-input="hsl-h"]');
  let INPUT_COLORPICK_BOX = document.querySelectorAll('[data-input-color="box"]');
  let INPUT_COLORPICK_HSL = document.querySelectorAll('[data-input-color="hsl"]');
  let INPUT_COLORPICK_HSL_H = document.querySelectorAll('[data-input-color="hsl-h"]');
  let INPUT_COLORPICK_HSV = document.querySelectorAll('[data-input-color="hsv"]');
  let TEXTAREA = document.querySelectorAll('[data-textarea]');
  let TEXTAREA_EG = document.querySelectorAll('[data-textarea="eg"]');
  let CLOSE_CLEAR = document.querySelectorAll('[data-close="clear"]');
  let CLOSE_CLOSE = document.querySelectorAll('[data-close="close"]');
  let RADIO = document.querySelectorAll('[data-radio]');
  let RESET = document.querySelectorAll('[data-input-reset]');


  SELECT_PICK.forEach(item => {
    let options = item.parentNode.querySelector('[data-select-options]');
    let otherscroll = document.querySelectorAll('[data-scroll]')
    item.addEventListener('change', () => {
      if(item.checked){
        options.style.display = 'flex';
        otherscroll.forEach(items => {
          items.style.overflowY = 'hidden';
        })
      } else {
        options.style.display = 'none';
        otherscroll.forEach(items => {
          items.style.overflowY = 'scroll';
        })
      }
    });
    document.addEventListener('mousedown', function (event) {
      let inputs = item.parentNode;
      if(!item.contains(event.target) && !inputs.contains(event.target) && document.activeElement){
        item.checked = false
        options.style.display = 'none';
        otherscroll.forEach(items => {
          items.style.overflowY = 'scroll';
        })
      }
    })
  });

  SELECT_OPTION.forEach(item => {
    item.addEventListener('click',() => {
      let select = item.parentNode.parentNode;
      let oldOption = select.querySelector('[data-option-main="true"]');
      let optionValue = item.textContent;
      oldOption.setAttribute('data-option-main','false');
      item.setAttribute('data-option-main','true');
      select.setAttribute('data-select-value',optionValue);
      select.querySelector('[data-select-input]').value = optionValue;
    })
  });

  INPUT.forEach(item => {
    item.addEventListener('keydown',(event) => {
      if (event.key === 'Enter') {
        item.blur()
      }
    });
    item.setAttribute('data-input-default',item.value);
  });

  INPUT_CHECK.forEach(item => {
    item.addEventListener('change',(event) => {
      let check = document.querySelector(`[data-check-name="${item.getAttribute('data-check-for')}"]`)
      if(check){
        if(item.checked){
          check.setAttribute('data-check-checked','true');
        } else {
          check.setAttribute('data-check-checked','false');
        }
      }
    });
  });

  INPUT_MUST_TEXT.forEach(item => {
    item.addEventListener('change',() => {
      let info = item.getAttribute('data-input-must');
      let infoEn = item.getAttribute('data-input-must-en');
      if(infoEn){
        inputMust(item,['text',[info,infoEn]]);
      } else {
        inputMust(item,['text',info]);
      }
      
      item.parentNode.setAttribute('data-text-value',item.value);
    });
  });

  INPUT_MUST_INT.forEach(item => {
    if(!item.getAttribute('data-value')){//类型冲突
      let info = item.getAttribute('data-input-must');
      let max = info.split(',')[1] * 1;
      let min = info.split(',')[0] * 1;
      max = max ? max : 0;
      min = min ? min : 0;
      info = [min,max];
      item.addEventListener('change',() => {
      if(item.value < min || item.value > max || (item.value.replace(/[0-9]/g,'').trim().length > 0 && item.value.replace(/[0-9]/g,'').trim() !== '-')){
        tipsAll(['数值错误，已修正','Wrong type, fixed'],1000,3);
        inputMust(item,['int',...info]);
      }
        item.parentNode.setAttribute('data-int-value',item.value);
      });
    };
  });
  INPUT_MUST_FLOAT.forEach(item => {
    if(!item.getAttribute('data-value')){//类型冲突
      let info = item.getAttribute('data-input-must');
      let max = info.split(',')[1] * 1;
      let min = info.split(',')[0] * 1;
      max = max ? max : 0;
      min = min ? min : 0;
      info = [min,max];
      item.addEventListener('change',() => {
        if(item.value < min || item.value > max || item.value.replace(/[^0-9]/g,'').trim().length == 0 || item.value.replace(/[0-9]/g,'').trim().length > 1){
          inputMust(item,['float',...info]);
        };
        item.parentNode.setAttribute('data-float-value',item.value);
      });
      
    };
  });

  INPUT_MAX.forEach(item => {
    item.addEventListener('input',() => {
      if(!USER_KEYING){
        if(item.nextElementSibling){
          item.nextElementSibling.querySelector('span').innerHTML = item.value.length;
        } else {
          let node = document.createElement('div')
          node.className = 'pos-a';
          node.style.right = '2px';
          node.style.fontSize = '9px';
          node.style.opacity = '0.6';
          node.innerHTML = `<span>${item.value.length}</span>/${item.getAttribute('maxlength')}`
          item.parentNode.appendChild(node)
        }
      };
    })
  });

  INPUT_RANGE.forEach(item => {
    item.addEventListener('input',() => {
      item.nextElementSibling.value = item.value;
      item.parentNode.setAttribute('data-number-value',item.value);
    })
  });

  INPUT_VALUE.forEach(item => {
    let info = item.getAttribute('data-input-must');
    let max = info.split(',')[1] * 1;
    let min = info.split(',')[0] * 1;
    max = max !== null ? max : 0;
    min = min !== null ? min : 0;
    info = [min,max];
    item.addEventListener('input',() => {
      item.previousElementSibling.value = item.value;
      item.parentNode.setAttribute('data-number-value',item.value);
    });
    item.addEventListener('change',() => {
      if(item.value < min || item.value > max || (item.value.replace(/[0-9]/g,'').trim().length > 0 && item.value.replace(/[0-9]/g,'').trim() !== '-')){
        tipsAll(['数值错误，已修正','Wrong type, fixed'],1000,3);
        inputMust(item,['int',...info]);
      }
      item.previousElementSibling.value = item.value;
      item.parentNode.setAttribute('data-number-value',item.value);
    })
  });

  INPUT_COLOR.forEach(item => {
    item.addEventListener('click',() => {
      let colorbox = item.parentNode.querySelector('[data-input-color="box"]');
      if(colorbox){
        colorbox.style.display = 'flex';
      }
    })
  });

  INPUT_COLOR_TYPE.forEach(item => {
    item.addEventListener('change',() => {
      if(item.checked){
        item.previousElementSibling.setAttribute('data-input','rgb');
        let HEX = hexTorgb(item.previousElementSibling.value);
        item.previousElementSibling.value =  `rgb(${HEX[0]},${HEX[1]},${HEX[2]})`
      } else {
        item.previousElementSibling.setAttribute('data-input','hex');
        let RGB = item.previousElementSibling.value.toLowerCase().replace('rgb(','').replace(')','').split(',')
        item.previousElementSibling.value = rgbTohex(RGB[0] * 1,RGB[1] * 1,RGB[2] * 1);
      }
    })
  });

  INPUT_COLORPICK_BOX.forEach(item => {
    document.addEventListener('mousedown', function (event) {
      let inputs = item.parentNode.parentNode;
      if(!item.contains(event.target) && !inputs.contains(event.target) && document.activeElement){
        item.style.display = 'none';
      }
    })
  });

  INPUT_HEX.forEach(item => {
    item.addEventListener('change',() => {
      let colortype = item.getAttribute('data-input');
      let info = colortype == 'hex' ? '#888888' : 'rgb(136,136,136)';
      inputMust(item,[colortype,info])
      item.parentNode.style.setProperty("--input-color",item.value);
      let colorbox = item.parentNode.querySelector('[data-input-color="box"]');
      let colorrange = item.parentNode.querySelector('[data-input="hsl-h"]');
      let colorvalue = item.parentNode.querySelector('[data-input-color="hsl-h"]');
      let RGB = item.value.split('#').length > 1 ? hexTorgb(item.value) : item.value.toLowerCase().replace('rgb(','').replace(')','').split(',');
      let HEX = item.value.split('#').length > 1 ? item.value : rgbTohex(RGB[0],RGB[1],RGB[2]);
      let HSL = rgbTohsl(RGB[0],RGB[1],RGB[2]);
      let HSV = hslTohsv(HSL[0],HSL[1],HSL[2]);
      colorrange.value = HSL[0];
      colorvalue.value = HSL[0];
      colorbox.style.setProperty("--hsl-h",HSL[0]);
      colorbox.style.setProperty("--hsl-s",HSL[1]);
      colorbox.style.setProperty("--hsl-l",HSL[2]);
      colorbox.style.setProperty("--hsv-s",HSV[1]);
      colorbox.style.setProperty("--hsv-v",HSV[2]);
      item.parentNode.setAttribute('data-color-hex',HEX);
      item.parentNode.setAttribute('data-color-rgb',`rgb(${RGB[0]},${RGB[1]},${RGB[2]})`);
      item.parentNode.setAttribute('data-color-hsl',`hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`);
      item.parentNode.setAttribute('data-color-hsv',`hsv(${HSV[0]},${HSV[1]}%,${HSV[2]}%)`);
    })
  });

  INPUT_RGB.forEach(item => {
    item.addEventListener('change',() => {
      let colortype = item.getAttribute('data-input');
      let info = colortype == 'hex' ? '#888888' : 'rgb(136,136,136)';
      inputMust(item,[colortype,info])
      item.parentNode.style.setProperty("--input-color",item.value);
      let colorbox = item.parentNode.querySelector('[data-input-color="box"]');
      let colorrange = item.parentNode.querySelector('[data-input="hsl-h"]');
      let colorvalue = item.parentNode.querySelector('[data-input-color="hsl-h"]');
      let RGB = item.value.split('#').length > 1 ? hexTorgb(item.value) : item.value.toLowerCase().replace('rgb(','').replace(')','').split(',');
      let HEX = item.value.split('#').length > 1 ? item.value : rgbTohex(RGB[0],RGB[1],RGB[2]);
      let HSL = rgbTohsl(RGB[0],RGB[1],RGB[2]);
      let HSV = hslTohsv(HSL[0],HSL[1],HSL[2]);
      colorrange.value = HSL[0];
      colorvalue.value = HSL[0];
      colorbox.style.setProperty("--hsl-h",HSL[0]);
      colorbox.style.setProperty("--hsl-s",HSL[1]);
      colorbox.style.setProperty("--hsl-l",HSL[2]);
      colorbox.style.setProperty("--hsv-s",HSV[1]);
      colorbox.style.setProperty("--hsv-v",HSV[2]);
      item.parentNode.setAttribute('data-color-hex',HEX);
      item.parentNode.setAttribute('data-color-rgb',`rgb(${RGB[0]},${RGB[1]},${RGB[2]})`);
      item.parentNode.setAttribute('data-color-hsl',`hsl(${HSL[0]},${HSL[1]}%,${HSL[2]}%)`);
      item.parentNode.setAttribute('data-color-hsv',`hsv(${HSV[0]},${HSV[1]}%,${HSV[2]}%)`);
    })
  });

  INPUT_HSL_H.forEach(item => {
    item.addEventListener('input',() => {
      item.parentNode.parentNode.style.setProperty("--hsl-h",item.value);
      let colorcomp = item.parentNode.parentNode.parentNode.parentNode;
      let oldHSL = colorcomp.getAttribute('data-color-hsl').replace('hsl(','').replace(')','').split(',').map(item => item.replace('%',''));
      let newRGB = hslTorgb(item.value,oldHSL[1],oldHSL[2],255);
      let newHEX = rgbTohex(newRGB[0],newRGB[1],newRGB[2]);
      let newHSV = hslTohsv(item.value,oldHSL[1],oldHSL[2])
      let colorinput1 = colorcomp.querySelector('[data-input="hex"]');
      let colorinput2 = colorcomp.querySelector('[data-input="rgb"]');
      if(colorinput1){
        colorinput1.value = newHEX;
      }
      if(colorinput2){
        colorinput2.value = `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`
      }
      colorcomp.style.setProperty("--input-color",newHEX);
      colorcomp.setAttribute('data-color-hex',newHEX);
      colorcomp.setAttribute('data-color-rgb',`rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`);
      colorcomp.setAttribute('data-color-hsl',`hsl(${item.value},${oldHSL[1]}%,${oldHSL[2]}%)`);
      colorcomp.setAttribute('data-color-hsv',`hsv(${newHSV[0]},${newHSV[1]}%,${newHSV[2]}%)`);
      item.nextElementSibling.value = item.value;
    });
  });

  INPUT_COLORPICK_HSL_H.forEach(item => {
    item.addEventListener('input',() => {
      item.parentNode.parentNode.style.setProperty("--hsl-h",item.value);
      let colorcomp = item.parentNode.parentNode.parentNode.parentNode;
      let oldHSL = colorcomp.getAttribute('data-color-hsl').replace('hsl(','').replace(')','').split(',').map(item => item.replace('%',''));
      let newRGB = hslTorgb(item.value,oldHSL[1],oldHSL[2],255);
      let newHEX = rgbTohex(newRGB[0],newRGB[1],newRGB[2]);
      let newHSV = hslTohsv(item.value,oldHSL[1],oldHSL[2])
      let colorinput1 = colorcomp.querySelector('[data-input="hex"]');
      let colorinput2 = colorcomp.querySelector('[data-input="rgb"]');
      if(colorinput1){
        colorinput1.value = newHEX;
      }
      if(colorinput2){
        colorinput2.value = `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`
      }
      colorcomp.style.setProperty("--input-color",newHEX);
      colorcomp.setAttribute('data-color-hex',newHEX);
      colorcomp.setAttribute('data-color-rgb',`rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`);
      colorcomp.setAttribute('data-color-hsl',`hsl(${item.value},${oldHSL[1]}%,${oldHSL[2]}%)`);
      colorcomp.setAttribute('data-color-hsv',`hsv(${newHSV[0]},${newHSV[1]}%,${newHSV[2]}%)`);
    });
  });

  INPUT_COLORPICK_HSV.forEach(item => {
    item.addEventListener('click',(event) => {
      let x = event.clientX;
      let y = event.clientY;
      let w = item.offsetWidth;
      let h = item.offsetHeight;
      let startX = item.getBoundingClientRect().left;
      let startY = item.getBoundingClientRect().top;
      //console.log(x,y,w,h,startX,startY)
      let hsvS = Math.floor((x - startX)/w * 100);
      let hsvV = 100 - Math.floor((y - startY)/h * 100);
      hsvS = hsvS <= 100 ? hsvS : 100;
      hsvV = hsvV <= 100 ? hsvV : 100;
      hsvS = hsvS >= 0 ? hsvS : 0;
      hsvV = hsvV >= 0 ? hsvV : 0;
      let colorcomp = item.parentNode.parentNode.parentNode;
      let oldHSV = colorcomp.getAttribute('data-color-hsv').replace('hsv(','').replace(')','').split(',').map(item => item.replace('%',''));
      let newHSL = hsvTohsl(oldHSV[0],hsvS,hsvV);
      let newRGB = hslTorgb(newHSL[0],newHSL[1],newHSL[2],255);
      let newHEX = rgbTohex(newRGB[0],newRGB[1],newRGB[2]);
      let colorinput1 = colorcomp.querySelector('[data-input="hex"]');
      let colorinput2 = colorcomp.querySelector('[data-input="rgb"]');
      if(colorinput1){
        colorinput1.value = newHEX;
      }
      if(colorinput2){
        colorinput2.value = `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`
      }
      item.parentNode.style.setProperty("--hsv-s",hsvS);
      item.parentNode.style.setProperty("--hsv-v",hsvV);
      item.parentNode.style.setProperty("--hsl-s",newHSL[1]);
      item.parentNode.style.setProperty("--hsl-l",newHSL[2]);
      colorcomp.style.setProperty("--input-color",newHEX);
      colorcomp.setAttribute('data-color-hex',newHEX);
      colorcomp.setAttribute('data-color-rgb',`rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`);
      colorcomp.setAttribute('data-color-hsl',`hsl(${newHSL[0]},${newHSL[1]}%,${newHSL[2]}%)`);
      colorcomp.setAttribute('data-color-hsv',`hsv(${oldHSV[0]},${hsvS}%,${hsvV}%)`);
    });
  });

  INPUT_COLORPICK_HSL.forEach(item => {
    item.addEventListener('click',(event) => {
      let x = event.clientX;
      let y = event.clientY;
      let w = item.offsetWidth;
      let h = item.offsetHeight;
      let startX = item.getBoundingClientRect().left;
      let startY = item.getBoundingClientRect().top;
      //console.log(x,y,w,h,startX,startY)
      let hslS = Math.floor((x - startX)/w * 100);
      let hslL = 100 - Math.floor((y - startY)/h * 100);
      hslS = hslS <= 100 ? hslS : 100;
      hslL = hslL <= 100 ? hslL : 100;
      hslS = hslS >= 0 ? hslS : 0;
      hslL = hslL >= 0 ? hslL : 0;
      let colorcomp = item.parentNode.parentNode.parentNode;
      let oldHSL= colorcomp.getAttribute('data-color-hsl').replace('hsl(','').replace(')','').split(',').map(item => item.replace('%',''));
      let newHSV = hslTohsv(oldHSL[0],hslS,hslL)
      let newRGB = hslTorgb(oldHSL[0],hslS,hslL,255);
      let newHEX = rgbTohex(newRGB[0],newRGB[1],newRGB[2]);
      let colorinput1 = colorcomp.querySelector('[data-input="hex"]');
      let colorinput2 = colorcomp.querySelector('[data-input="rgb"]');
      if(colorinput1){
        colorinput1.value = newHEX;
      }
      if(colorinput2){
        colorinput2.value = `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`
      }
      item.parentNode.style.setProperty("--hsl-s",hslS);
      item.parentNode.style.setProperty("--hsl-l",hslL);
      item.parentNode.style.setProperty("--hsv-s",newHSV[1]);
      item.parentNode.style.setProperty("--hsv-v",newHSV[2]);
      colorcomp.style.setProperty("--input-color",newHEX);
      colorcomp.setAttribute('data-color-hex',newHEX);
      colorcomp.setAttribute('data-color-rgb',`rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`);
      colorcomp.setAttribute('data-color-hsv',`hsv(${newHSV[0]},${newHSV[1]}%,${newHSV[2]}%)`);
      colorcomp.setAttribute('data-color-hsl',`hsl(${oldHSL[0]},${hslS}%,${hslL}%)`);
    });
  });

  INPUT_GETCOLOR.forEach(item => {
    item.addEventListener('click', () => {
      if(GETCOLOR){
        GETCOLOR.open()
        .then(USER_COLOR => {
            // returns hex color value (#RRGGBB) of the selected pixel
            let newHEX = USER_COLOR.sRGBHex;
            let newRGB = hexTorgb(newHEX);
            let colorcomp = item.parentNode;
            let colorinput1 = colorcomp.querySelector('[data-input="hex"]');
            let colorinput2 = colorcomp.querySelector('[data-input="rgb"]');
            if(colorinput1){
              colorinput1.value = newHEX;
              let inputEvent = new Event('change',{bubbles:true});
              colorinput1.dispatchEvent(inputEvent);
            }
            if(colorinput2){
              colorinput2.value = `rgb(${newRGB[0]},${newRGB[1]},${newRGB[2]})`;
              let inputEvent = new Event('change',{bubbles:true});
              colorinput2.dispatchEvent(inputEvent);
            }
            
        })
        .catch(error => {
            // handle the user choosing to exit eyedropper mode without a selection
        });
      }
    })
  });

  TEXTAREA.forEach(item => {//调整输入逻辑
    let otherscroll = document.querySelectorAll('[data-scroll]')
    item.addEventListener('keydown',(event) => {
      if (event.key === 'Tab') {
        event.preventDefault(); // 阻止默认Tab行为
        const start = item.selectionStart;
        const end = item.selectionEnd;
        const selectedText = item.value.substring(start, end);
        const before = item.value.substring(0, start);
        const after = item.value.substring(end, item.value.length);
        item.value = before + '\t' + selectedText + after; // 用4个空格替换Tab
        item.selectionStart = item.selectionEnd = start + 4; // 设置光标位置
      }
    });
    item.addEventListener('focus',() => { 
      otherscroll.forEach(items => {
        items.style.overflowY = 'hidden';
      })
    })
    item.addEventListener('blur',() => {
      otherscroll.forEach(items => {
        items.style.overflowY = 'scroll';
      })
    })
  });

  TEXTAREA_EG.forEach(item => {//调整输入逻辑
    let tips = item.parentNode.querySelector('[data-textarea="tips"]');
    item.addEventListener('focus',() => { 
      tips.style.display = "none";
    })
    item.addEventListener('blur',() => {
      if(item.value == ''){
        tips.style.display = "flex";
      }else{
        tips.style.display = "none";
      }
    })
    item.addEventListener('dblclick',() => {
      if (item.value == '' ) {
        let egtext = item.getAttribute('data-eg');
        if(ROOT.getAttribute('data-language') == 'En'){
          egtext = item.getAttribute('data-eg-en');
        }
        egtext = egtext.replace(/\\n/g,'\n').replace(/\\t/g,'\t');//.replace(/\&nbsp;/g,'&nbsp;')
        if(egtext){
          item.value = egtext;
        }
      }
    })
  });

  CLOSE_CLEAR.forEach(item => {//清空输入内容
    item.addEventListener('click',() => {
      let hasvalue = [...item.parentNode.querySelectorAll('textarea'),...item.parentNode.querySelectorAll('input[type="text"]')];
      hasvalue.forEach(items => {
        items.value = '';
        if(items.getAttribute('data-textarea') == 'eg'){
          items.parentNode.querySelector('[data-textarea="tips"]').style.display = "flex";
        };
        let inputEvent = new Event('input',{bubbles:true});
        items.dispatchEvent(inputEvent);
        let inputEvent2 = new Event('change',{bubbles:true});
        items.dispatchEvent(inputEvent2);
      });
      
    })
  });

  CLOSE_CLOSE.forEach(item =>{//关闭对象
    item.addEventListener('click',() => {
      let closeNode = document.querySelector(`[data-close-id="${item.getAttribute('data-close-for')}"]`);
      if(closeNode) {
        closeNode.style.display = 'none'
      };
    });
  });

  RADIO.forEach(item => {
    item.addEventListener('click',()=>{
      let radio = item.parentNode;
      let oldpick = radio.querySelector('[data-radio-main="true"]');
      let data = item.getAttribute('data-radio-data');
      if(oldpick){
        oldpick.setAttribute('data-radio-main','false');
      }
      item.setAttribute('data-radio-main','true');
      radio.setAttribute('data-radio-value',data);
      if(item.parentNode.parentNode.getAttribute('data-scroll') !== null){
        let allradio = Array.from(item.parentNode.querySelectorAll('[data-radio-data]'));
        let index = allradio.indexOf(item);
        let inline = index > allradio.length/2 ? 'nearest' : 'center';
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: inline,
        });
        if( index > allradio.length/2  && item.nextElementSibling){
          item.nextElementSibling.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        };
      };
    });
  });

  RESET.forEach(item => {
    item.addEventListener('click',()=>{
      
      let input = item.parentNode.querySelectorAll('input');
      input.forEach(node =>{
        let defaultValue = node.getAttribute('data-input-default');
        if(!defaultValue){
          switch (node.type){
            case 'text': if( node.value * 1 !== NaN){defaultValue = 0}else{node.value = ''} ;break
            case 'range': defaultValue = node.getAttribute('min') || 0;break
          }
        };
        node.parentNode.setAttribute('data-number-value',defaultValue)
        node.value = defaultValue;
      });
    });
  });
}

window.addEventListener('load',()=>{
  afterAllMust();
  COMP_MAIN();
  
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

  if(storageMix.get('userTheme') == 'light'){
    setTheme(true,false);
  };

  if(storageMix.get('userTheme') == 'dark'){
    setTheme(false,false);
  };

  if(!storageMix.get('userTheme') && !ISPLUGIN){
    setTheme(true,false);
  };


  if(storageMix.get('userLanguage') == 'En'){
    setLanguage(false);
  };
  if(storageMix.get('userLanguage') == 'Zh'){
    setLanguage(true);
  };
  if(!storageMix.get('userLanguage') && !ISPLUGIN){
    setLanguage(false);
  };
});

window.addEventListener('resize',()=>{
  /*防抖*/
  let MOVE_TIMEOUT;
  if(MOVE_TIMEOUT){
      clearTimeout(MOVE_TIMEOUT)
  };
  MOVE_TIMEOUT = setTimeout(()=>{
    afterAllMust()
  },500)
});

function afterAllMust(){
  reTV();
}

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


TAB_AUTO.forEach((item,index) => {
  let pagefor = document.querySelector(`[data-page-id="${item.getAttribute('data-tab-for')}"]`);
  let tabsfor = pagefor.querySelectorAll('[data-page-name]');
  
  tabsfor.forEach(items => {
    let tabsforEn = items.getAttribute('data-page-name-en');
    let keyid = tabsforEn ? `tab_${tabsforEn}` : `tab_${items.getAttribute('data-page-name')}`;
    let id = keyid + '_' + index;
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
        items.style.display = 'flex';
      }
      input.addEventListener('change',() => {
        for(let i = 0; i < TAB_AUTO.length; i++){
          document.getElementById(items.parentNode.getAttribute('data-tab-pick') + '_' + i).checked = false;
          document.getElementById(keyid + '_' + i).checked = true;
        }
        let oldpage = document.querySelector(`[data-page-name="${items.parentNode.getAttribute('data-tab-pick').split('_')[1]}"]`);
        if(!oldpage){
          oldpage = document.querySelector(`[data-page-name-en="${items.parentNode.getAttribute('data-tab-pick').split('_')[1]}"]`);
        }
        oldpage.style.display = 'none';
        items.style.display = 'flex';
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
      if(tabsforEn){
        label.setAttribute('data-en-text',tabsforEn);
      }
      label.className = items.getAttribute('data-page-tabclass');
      label.innerHTML = items.getAttribute('data-page-name');
      item.appendChild(input);
      item.appendChild(label);
    };
  });
  
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
function copy(node,type,other){
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
function getElementMix(mix){
  if(!mix) return null;
  let node = mix;
  node = node instanceof HTMLElement ? node : document.getElementById(mix);
  node = node instanceof HTMLElement ? node : document.querySelector(`[${mix}]`);
  node = node instanceof HTMLElement ? node : null;
  return node;
}