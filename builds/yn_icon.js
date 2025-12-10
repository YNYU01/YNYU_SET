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

function svgS(viewBox,width,height,style){
  style = style ? `style="${style}"` : '';
  return `<svg viewBox="${viewBox}" width="${width}" height="${height}" ${style} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">`;
}

function pathS(fill,stroke,strokeWidth,strokeLinecap,strokeLinejoin){
  if(fill){
    if(fill === 'auto'){
      fill = 'fill="var(--fill, var(--mainColor))" ';
    }else if(fill === 'check'){
      fill = 'fill="var(--check,transparent)"';
    }else{
      fill = `fill="${fill}"`;
    }
  }else{
    fill = 'fill="none"';
  }
  if(stroke){
    if(stroke === 'auto'){
      stroke = 'stroke="var(--bod, var(--mainColor))"';
    }else if(stroke === 'check'){
      stroke = 'stroke="var(--check,transparent)"';
    }else if(stroke === 'fill'){
      stroke = 'stroke="var(--fill, var(--mainColor))"';
    }else{
      stroke = `stroke="${stroke}"`;
    }
  }else{
    stroke = '';
  }
  if(strokeWidth){
    strokeWidth = `stroke-width="${strokeWidth}"`;
  }else{
    strokeWidth = '';
  }
  if(strokeLinecap){
    strokeLinecap = `stroke-linecap="${strokeLinecap}"`;
  }else{
    strokeLinecap = '';
  }
  if(strokeLinejoin){
    strokeLinejoin = `stroke-linejoin="${strokeLinejoin}"`;
  }else{
    strokeLinejoin = '';
  }
  return `${fill} ${stroke} ${strokeWidth} ${strokeLinecap} ${strokeLinejoin}`;
}

function circleS(cx,cy,r){
  cx = cx || cx === 0 ? `cx="${cx}"` : '';
  cy = cy || cy === 0 ? `cy="${cy}"` : '';
  r = r ? `r="${r}"` : '0';
  return `${cx} ${cy} ${r}`;
}
function rectS(width,height,x,y,rx){
  width = width ? `width="${width}"` : '';
  height = height ? `height="${height}"` : '';
  x = x || x === 0 ? `x="${x}"` : '0';
  y = y || y === 0 ? `y="${y}"` : '0';
  rx = rx ? `rx="${rx}"` : '0';
  return `${x} ${y} ${width} ${height} ${rx}`;
}
function icon(num){
  return svgS(`0 0 ${num} ${num}`,`100%`,`100%`);
}


// 自定义元素定义（图标类等）
class btntheme extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${svgS('0 0 12 12','100%','100%','display: var(--df-l);')}
      <circle ${circleS(6,6,2)} ${pathS('auto')}/>
      <rect ${rectS(1.5,3,5,9,0.75)} ${pathS('auto')}/>
      <g transform="matrix(0.71,0.71,-0.71,0.71,6.1716,-0.0710)">
        <rect ${rectS(1.5,3,3.1716,7.4142,0.75)}  ${pathS('auto')}/>
      </g>
      <rect ${rectS(1.5,3,5.25,0,0.75)} ${pathS('auto')}/>
      <g transform="matrix(0.71,0.71,-0.71,0.71,3.5355,-6.4350)">
        <rect ${rectS(1.5,3,9.5355,1.0503,0.75)} ${pathS('auto')}/>
      </g>
      <g transform="matrix(0,1,-1,0,17,-7)">
        <rect ${rectS(1.5,3,12,5,0.75)} ${pathS('auto')}/>
      </g>
      <g transform="matrix(-0.71,0.71,-0.71,-0.71,25.4349,8.5355)">
        <rect ${rectS(1.5,3,10.94975,9.5355,0.75)} ${pathS('auto')}/>
      </g>
      <g transform="matrix(0,1,-1,0,8,2)">
        <rect ${rectS(1.5,3,3,5,0.75)} ${pathS('auto')}/>
      </g>
      <g transform="matrix(-0.71,0.71,-0.71,-0.71,10.0710,2.1715)">
        <rect ${rectS(1.5,3,4.5858,3.1715,0.75)} ${pathS('auto')}/>
      </g>
    </svg>
    ${svgS('0 0 12 12','100%','100%','display: var(--df-d)')}
      <path ${pathS('auto')}
        d="M6.74095 7.20492C8.45736 5.06247 8.03004 2.13137 6.78349 0.510498C9.4218 1.02783 12.3263 4.8253 10.1544 8.53954C7.7955 12.5735 2.92016 11.7551 1.00684 9.13921C2.17 9.48723 4.88124 9.52624 6.74095 7.20492Z"      
      />
    `;
  }
};
customElements.define('btn-theme', btntheme);

class btnlang extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(22)}
      <rect ${rectS(22,22,0,0,6)} ${pathS('auto')}/>
        <circle ${circleS(11,11,9)} ${pathS(null,'var(--bod,var(--boxBak))','1.7')}/>
        <path ${pathS(null,'var(--bod,var(--boxBak))','1.7')} d="M11.9358 19.71C9.42543 19.71 7.39038 15.8104 7.39038 11C7.39038 6.18962 9.42543 2.29004 11.9358 2.29004"/>
        <path ${pathS(null,'var(--bod,var(--boxBak))','1.7')} d="M10.1006 19.71C12.6109 19.71 14.646 15.8104 14.646 11C14.646 6.18962 12.6109 2.29004 10.1006 2.29004"/>
        <path ${pathS(null,'var(--bod,var(--boxBak))','1.7')} d="M2.63794 8.10303H19.2913"/>
        <path ${pathS(null,'var(--bod,var(--boxBak))','1.7')} d="M2.63794 14.0339H19.2913"/>
      </svg>
    `;
  }
};
customElements.define('btn-lang', btnlang);

class btnsearch extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      ${icon(24)}
        <circle ${circleS(12,11,8.5)} ${pathS(null,'auto','3')}/>
        <path ${pathS(null,'auto','3','round')} d="M18 18L21.5 21.5" />
    </svg>
    
    `;
  }
};
customElements.define('btn-search', btnsearch);

class btnshow extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(10)}
      <path class="path1" ${pathS('auto')} d="M5.5,2L8,2L8,4.5L10,4.5L10,0L5.5,0L5.5,2Z"/>
      <path class="path2" ${pathS('auto')} d="M4.5,8L2,8L2,5.5L0,5.5L0,10L4.5,10L4.5,8Z"/>
    </svg>
    `;
  }
};
customElements.define('btn-show', btnshow);

class btndown extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <path ${pathS('auto')} d="M4 15H16V13H19V19H1V13H4V15ZM12 8H16L10 14L4 8H8V1H12V8Z"/>
    </svg>
    `;
  }
};
customElements.define('btn-down', btndown);

class btnset extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(18)}
      <path ${pathS('auto')} d="M7 4H11L10.5 0H7.5L7 4Z"/>
      <path ${pathS('auto')} d="M11.1212 4.05011L13.9496 6.87853L16.4245 3.69655L14.3031 1.57523L11.1212 4.05011Z"/>
      <path ${pathS('auto')} d="M13.9802 6.94922V10.9492L17.9802 10.4492V7.44922L13.9802 6.94922Z"/>
      <path ${pathS('auto')} d="M14.0203 11.0505L11.1919 13.8789L14.3739 16.3538L16.4952 14.2325L14.0203 11.0505Z"/>
      <path ${pathS('auto')} d="M11 14L7 14L7.5 18L10.5 18L11 14Z"/>
      <path ${pathS('auto')} d="M6.8786 13.9499L4.05017 11.1215L1.5753 14.3034L3.69662 16.4248L6.8786 13.9499Z"/>
      <path ${pathS('auto')} d="M4.01965 11.0508L4.01965 7.05078L0.0196531 7.55078L0.0196533 10.5508L4.01965 11.0508Z"/>
      <path ${pathS('auto')} d="M3.97943 6.94952L6.80785 4.12109L3.62587 1.64622L1.50455 3.76754L3.97943 6.94952Z"/>
      <circle ${circleS(9,9,5)} ${pathS(null,'auto','1')}/>
      <circle ${circleS(9,9,3)} ${pathS('auto')}/>
    </svg>
    `;
  }
};
customElements.define('btn-set', btnset);

class btnre extends HTMLElement {
  constructor() {
      super();
      this.innerHTML = `
      ${icon(20)}
        <path ${pathS('auto')}  d="M12.2855,7.6274L11.71607,9.7524003L6.11928,3.5940002612L14.0454,1.05907L13.5682,2.840080261231C16.2837,4.1933303,18,6.9662403,18,10.000240261230468C18,12.14093026123047,17.142,14.192330261230468,15.618,15.695630261230468C15.8708,14.991330261230468,16,14.248530261230469,16,13.500230261230469C16,10.989500261230468,14.554,8.703270261230468,12.2855,7.6273202612304685ZM6.43178,17.16043026123047L5.95456,18.94143026123047L13.8807,16.40643026123047L8.28393,10.248070261230469L7.71452,12.373130261230468C5.446,11.29723026123047,4,9.010970261230469,4,6.500240261230469C4,5.751890261230469,4.12923,5.009170261230469,4.38199,4.304810261230468C2.857956,5.808120261230469,2,7.859530261230469,2,10.000240261230468C2,13.03423026123047,3.71629,15.80713026123047,6.43178,17.16043026123047Z"/>
      </svg>
      `;
  }
}
customElements.define('btn-re', btnre);

class btnchange extends HTMLElement {
  constructor() {
      super();
      this.innerHTML = `
      ${svgS('0 -1 18 14','100%','100%')}
          <path ${pathS('auto')} d="M7.84606,8.54545L7.84606,10L4,8.25454L4,7.09091L7.07693,7.09091L7.84606,7.09091L13.99991,7.09091L13.99991,8.54545L7.84606,8.54545ZM10.15385,3.45455L10.15385,2L13.99996,3.74546L13.99996,5L10.15385,5L4,5L4,3.45455L10.15385,3.45455Z"/>
          <rect ${rectS(16,12,1,0,5)} ${pathS(null,'auto',1.5)}/>
          </svg>
      `;
  }
}
customElements.define('btn-change', btnchange);

class btnreset extends HTMLElement {
  constructor() {
      super();
      this.innerHTML = `
      ${icon(20)}
        <path ${pathS(null,'auto',2.5,'round')} d="M5 9V7.83333C5 5.99238 6.27919 4.5 7.85714 4.5H15"/>
        <path ${pathS('auto')} d="M13.5 1.54031C13.5 1.12106 13.985 0.887973 14.3123 1.14988L17.5239 3.71913C18.0243 4.11946 18.0243 4.88054 17.5239 5.28087L14.3123 7.85012C13.985 8.11203 13.5 7.87894 13.5 7.45969V1.54031Z"/>
        <path ${pathS(null,'auto',2.5,'round')} d="M15 11V12.1667C15 14.0076 13.7208 15.5 12.1429 15.5H5"/>
        <path ${pathS('auto')} d="M6.5 18.4597C6.5 18.8789 6.01503 19.112 5.68765 18.8501L2.47609 16.2809C1.97568 15.8805 1.97568 15.1195 2.47609 14.7191L5.68765 12.1499C6.01503 11.888 6.5 12.1211 6.5 12.5403L6.5 18.4597Z"/>
      </svg>
      `;
  }
}
customElements.define('btn-reset', btnreset);

class btninfo extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(18)}
      <g transform="translate(7,3.5),scale(0.9)">
        <rect ${rectS(2,2,1,0,1)} ${pathS('auto')}/>
        <rect ${rectS(2,2,0,4,1)} ${pathS('auto')}/>
        <rect ${rectS(2,8,1,4,1)} ${pathS('auto')}/>
        <rect ${rectS(4.5,2,0,10,1)} ${pathS('auto')}/>
      </g>
      <circle ${circleS(9,9,8)} ${pathS(null,'auto',1.5)}/>
    </svg>
    `;
    this.className = 'btn-op wh100'
  }
};
customElements.define('btn-info', btninfo);

class btnclose extends HTMLElement {
  constructor() {
    super();
    this.className = 'btn-op'
    this.innerHTML = `
    ${icon(18)}
      <circle ${circleS(9,9,8)} ${pathS(null,'auto',1.5)}/>
      <rect ${rectS(12,1.5,3,8,1)} transform="rotate(45 9 8.75)" ${pathS('auto')}/>
      <rect ${rectS(12,1.5,3,8,1)} transform="rotate(135 9 8.75 )" ${pathS('auto')}/>
    </svg>
    `;
  }
};
customElements.define('btn-close', btnclose);

class btncheck extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(18)}
      <circle ${circleS(9,9,8)} ${pathS('var(--fill,transparent)','var(--bod,var(--mainColor))','1.2')}/>
      <circle ${circleS(9,9,5)} ${pathS('check')}/>
    </svg>
    `;
  }
};
customElements.define('btn-check', btncheck);

class btnchecktick extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(14)}
      <path ${pathS(null,'check','1.6','round','round')} d="M3.91211 6.92286L6.72632 9.66309L10.5033 3.49146"/>
      <rect ${rectS(12,12,1,1,2)} ${pathS(null,'auto','1')}/>
      </svg>
    `;
  }
};
customElements.define('btn-check-tick', btnchecktick);

class btncopy extends HTMLElement {
  constructor() {
    super();
    this.className = 'btn-op'
    this.innerHTML = `
    ${svgS('0 0 11 11','100%','100%')}
      <path ${pathS('var(--add,transparent)')} d="M5,2L4,2L4,4L2,4L2,5L4,5L4,7L5,7L5,5L7,5L7,4L5,4L5,2Z"/>
      <path ${pathS('auto')} fill-rule="evenodd"
        d="M0,2.5L0,6.5Q0,7.53553,0.732233,8.26777Q1.29574,8.83127,2.03888,8.96112Q2.16872,9.70426,2.73223,10.2678Q3.46447,11,4.5,11L8.5,11Q9.53553,11,10.2678,10.2678Q11,9.53553,11,8.5L11,4.5Q11,3.46447,10.2678,2.73223Q9.70426,2.16872,8.96112,2.03888Q8.83127,1.29574,8.26777,0.732233Q7.53553,0,6.5,0L2.5,0Q1.46447,0,0.732233,0.732233Q0,1.46447,0,2.5ZM9,3.08099L9,6.5Q9,7.53553,8.26777,8.26777Q7.53553,9,6.5,9L3.08099,9Q3.18864,9.30996,3.43934,9.56066Q3.87868,10,4.5,10L8.5,10Q9.12132,10,9.56066,9.56066Q10,9.12132,10,8.5L10,4.5Q10,3.87868,9.56066,3.43934Q9.30996,3.18864,9,3.08099ZM1.43934,7.56066Q1,7.12132,1,6.5L1,2.5Q1,1.87868,1.43934,1.43934Q1.87868,1,2.5,1L6.5,1Q7.12132,1,7.56066,1.43934Q8,1.87868,8,2.5L8,6.5Q8,7.12132,7.56066,7.56066Q7.12132,8,6.5,8L2.5,8Q1.87868,8,1.43934,7.56066Z" 
      />
    </svg>
    `;
  }
};
customElements.define('btn-copy', btncopy);

class btngetcolor extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
    <path ${pathS('auto')}
      d="M17.2451 0.843894C18.4624 1.72834 18.7323 3.43233 17.8479 4.64963L17.232 5.49736C16.9119 5.93789 16.48 6.28474 15.9811 6.503L15.6732 6.63776C15.3775 6.76713 15.1218 6.973 14.9313 7.23347L16.4451 8.33327C17.2597 8.92511 17.4403 10.0654 16.8484 10.88C16.2566 11.6946 15.1163 11.8752 14.3017 11.2833L13.759 10.889L10.0388 16.0093L9.88345 16.1982C9.49725 16.6142 8.95078 16.8532 8.37579 16.8495L8.13182 16.863C7.56808 16.9275 7.05142 17.2253 6.71355 17.6903L5.44098 19.4419L5.35853 19.5437C4.92661 20.0266 4.19086 20.1136 3.65542 19.7247L3.55299 19.643C3.10247 19.2399 2.9972 18.5715 3.30122 18.049L3.37261 17.9391L4.59525 16.2563C4.98389 15.7211 5.09173 15.0347 4.89147 14.4098L4.84661 14.2854C4.60525 13.6697 4.67383 12.9777 5.025 12.4233L5.09933 12.3144L8.76818 7.26298L8.22541 6.86864C7.41096 6.27677 7.23027 5.13646 7.82205 4.32193C8.41385 3.50739 9.55418 3.32688 10.3688 3.91857L11.8833 5.01894C12.0722 4.75741 12.188 4.44987 12.2198 4.12877L12.2528 3.79425C12.3065 3.25271 12.5037 2.73473 12.8235 2.29439L13.4394 1.44666C14.3237 0.229035 16.0277 -0.0406572 17.2451 0.843894ZM6.71736 13.49C6.7039 13.5086 6.70057 13.5335 6.70878 13.5549L6.7957 13.7991C6.93098 14.2211 6.99373 14.6572 6.98838 15.0907C7.43137 14.9303 7.90528 14.8463 8.38897 14.8493C8.4013 14.8493 8.41346 14.8437 8.42077 14.8338L12.1409 9.71342L10.3862 8.43855L6.71736 13.49Z" 
    />
    </svg>
    `;
  }
};
customElements.define('btn-getcolor', btngetcolor);

class btncolor extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${svgS('0 0 28 28','100%','100%')}
      <rect ${rectS(20,20,4,4,2)} ${pathS('var(--input-color,#888)')}/>
      <rect ${rectS(26,26,1,1,5)} ${pathS(null,'fill','2')}/>
      </svg>
    `;
  }
};
customElements.define('btn-color', btncolor);

class btnuserimg extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(42)}
      <path ${pathS('auto')} d="M35,18C38.866,18,42,14.866,42,11C42,7.13401,38.866,4,35,4C31.134,4,28,7.13401,28,11C28,14.866,31.134,18,35,18ZM35,6C35.5523,6,36,6.44772,36,7L36,10L39,10C39.5523,10,40,10.4477,40,11C40,11.5523,39.5523,12,39,12L36,12L36,15C36,15.5523,35.5523,16,35,16C34.4477,16,34,15.5523,34,15L34,12L31,12C30.4477,12,30,11.5523,30,11C30,10.4477,30.4477,10,31,10L34,10L34,7C34,6.44772,34.4477,6,35,6Z"/>
      <path ${pathS('auto')} d="M5,14L5,32C5,34.2091,6.79086,36,9,36L31,36C33.2091,36,35,34.2091,35,32L35,20L33,20L33,29.5L31.4848,29.5Q30.9924,29.5,30.6922,29.1097L27.5916,25.0789Q26.7999,24.0497,25.5076,23.9225Q24.2154,23.7953,23.2382,24.6503L21.7345,25.966L18.7349,21.0576Q17.8134,19.54967,16.0478,19.62467Q14.28213,19.69966,13.4918,21.2803L9.15836,29.9472Q8.88197,30.5,8.26393,30.5L7,30.5L7,14Q7,13.17159,7.58579,12.5858Q8.17158,12,9,12L26.0549,12L26.0549,10L9,10C6.79086,10,5,11.7909,5,14ZM7.0359,32.5Q7.26795,34,9,34L31,34Q33,34,33,32L33,31.5L31.4848,31.5Q30.0076,31.5,29.1069,30.3291L26.0063,26.2983Q25.7424,25.9553,25.3117,25.9129Q24.8809,25.8705,24.5552,26.1555L21.2655,29.034L17.028399999999998,22.1005Q16.7212,21.5979,16.1326,21.6229Q15.5441,21.6479,15.2807,22.1748L10.94721,30.8416Q10.11804,32.5,8.26393,32.5L7.0359,32.5ZM27,17.5C27,19.433,25.433,21,23.5,21C21.567,21,20,19.433,20,17.5C20,15.567,21.567,14,23.5,14C25.433,14,27,15.567,27,17.5Z"/>
    </svg>
    `;
  }
};
customElements.define('btn-user-img', btnuserimg);

class btnusertable extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(42)}
      <path ${pathS('auto')} fill-rule="evenodd" d="M26.0549 10H9C6.79086 10 5 11.7909 5 14V32C5 34.2091 6.79086 36 9 36H31C33.2091 36 35 34.2091 35 32V20C32.8567 20 30.8884 19.2508 29.3427 18H17V12H26.0549C26.0186 11.6717 26 11.338 26 11C26 10.662 26.0186 10.3283 26.0549 10ZM9 12H15V18H7V14C7 12.8954 7.89543 12 9 12ZM7 20H15L15 26H7V20ZM7 28H15V34H9C7.89543 34 7 33.1046 7 32V28ZM17 28V34H31C32.1046 34 33 33.1046 33 32V28H17ZM17 20L17 26H33V20H17Z"/>
      <path ${pathS('auto')} d="M35 18C38.866 18 42 14.866 42 11C42 7.13401 38.866 4 35 4C31.134 4 28 7.13401 28 11C28 14.866 31.134 18 35 18ZM35 6C35.5523 6 36 6.44772 36 7V10H39C39.5523 10 40 10.4477 40 11C40 11.5523 39.5523 12 39 12H36V15C36 15.5523 35.5523 16 35 16C34.4477 16 34 15.5523 34 15V12H31C30.4477 12 30 11.5523 30 11C30 10.4477 30.4477 10 31 10L34 10V7C34 6.44772 34.4477 6 35 6Z"/>
    </svg>
    `;
  }
};
customElements.define('btn-user-table', btnusertable);

class btnuserzy extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(42)}
    <path ${pathS('auto')} d="M35 18C38.866 18 42 14.866 42 11C42 7.13401 38.866 4 35 4C31.134 4 28 7.13401 28 11C28 14.866 31.134 18 35 18ZM35 6C35.5523 6 36 6.44772 36 7V10H39C39.5523 10 40 10.4477 40 11C40 11.5523 39.5523 12 39 12H36V15C36 15.5523 35.5523 16 35 16C34.4477 16 34 15.5523 34 15V12H31C30.4477 12 30 11.5523 30 11C30 10.4477 30.4477 10 31 10H34V7C34 6.44772 34.4477 6 35 6Z"/>
    <path ${pathS('auto')} d="M5 14V32C5 34.2091 6.79086 36 9 36H31C33.2091 36 35 34.2091 35 32V20H33V32C33 33.3333 32.3333 34 31 34H9C7.66667 34 7 33.3333 7 32V14C7 13.4477 7.19526 12.9763 7.58579 12.5858C7.97632 12.1953 8.44772 12 9 12H24.0549H26.0549V10H9C6.79086 10 5 11.7909 5 14Z"/>
    <path ${pathS('auto')} d="M13.0245 28H10.6044V25.5962H13.0245V28ZM21.1804 28H14.7324V26.3921L18.4843 21.4383H14.9435V19.538H21.1804V21.146L17.3798 26.0997H21.1804V28ZM29.846 19.538L26.2241 29.3643C26.0454 29.8353 25.8505 30.1926 25.5907 30.4525C25.1034 30.9398 24.47 31.1022 23.7716 31.1022H22.9433V29.2019H23.4305C24.0315 29.2019 24.2751 29.0557 24.4862 28.4385L24.8435 27.3991L21.9525 19.538H24.1776L25.9317 24.7679L27.6209 19.538H29.846Z"/>
    </svg>
    
    `;
  }
};
customElements.define('btn-user-zy', btnuserzy);

class btnstar extends HTMLElement {
  constructor() {
      super();
      this.innerHTML = `
      ${icon(20)}
      <path data-skill-star-path ${pathS('auto')} d="M9.10133 5.24013C9.4668 4.4921 10.5329 4.4921 10.8983 5.24013L11.9152 7.32142L14.2089 7.64537C15.0332 7.76179 15.3626 8.77567 14.7642 9.3544L13.099 10.9647L13.4996 13.2462C13.6437 14.0661 12.7812 14.6928 12.0458 14.3024L9.99983 13.2163L7.95381 14.3024C7.21847 14.6928 6.35601 14.0661 6.50002 13.2462L6.9007 10.9647L5.23551 9.3544C4.63703 8.77567 4.96646 7.76179 5.79081 7.64537L8.08446 7.32142L9.10133 5.24013Z"/>
      </svg>
      `;
  }
}
customElements.define('btn-star', btnstar);


class btngetbyselect extends HTMLElement {
  constructor() {
      super();
      this.innerHTML = `
      ${icon(20)}
        <path ${pathS('auto')} d="M18.8157 14.2207C19.7226 14.5107 19.7487 15.7845 18.8547 16.1123L10.4709 19.1855C10.2512 19.266 10.0096 19.2674 9.78931 19.1885L1.21313 16.1152C0.310723 15.7914 0.337167 14.505 1.2522 14.2188L2.41919 13.8535L10.1301 16.6172L17.6672 13.8535L18.8157 14.2207ZM8.89771 7.89746C9.81186 8.73115 10.3983 9.70031 10.8049 10.3096L12.2288 12.4434L12.6243 9.90918C12.708 9.3731 12.7298 8.84584 12.7034 8.33301L18.8167 10.2881C19.7234 10.5782 19.7496 11.8519 18.8557 12.1797L10.4719 15.2529C10.2521 15.3335 10.0107 15.3348 9.79028 15.2559L1.21411 12.1816C0.311182 11.858 0.337567 10.5722 1.25317 10.2861L8.89771 7.89746Z"/>
        <path ${pathS('auto')} d="M2.90601 2.11987L9.23639 0.345091L5.85843 8.12319L2.90601 2.11987Z"/>
        <path ${pathS('auto')} d="M11.6365 9.75528C12.233 5.93585 9.27837 2.47694 7.9768 2.36549L6.13448 5.42255C9.41622 6.02688 10.952 8.72977 11.6365 9.75528Z"/>
      </svg> 
      `;
  }
}
customElements.define('btn-getbyselect', btngetbyselect);

class btnhasselect extends HTMLElement {
  constructor() {
      super();
      this.innerHTML = `
      ${icon(20)}
        <path ${pathS('auto')} d="M18.4265 14.8145C19.3056 15.1165 19.3327 16.35 18.4675 16.6904L10.486 19.8271C10.2536 19.9184 9.9946 19.9195 9.76144 19.8301L1.59738 16.6934C0.722562 16.3569 0.749635 15.1094 1.63839 14.8115L3.17062 14.2988L10.1247 16.9697L16.9206 14.2988L18.4265 14.8145ZM18.4265 10.3438C19.3064 10.6455 19.3333 11.8804 18.4675 12.2207L10.486 15.3574C10.2535 15.4488 9.9947 15.45 9.76144 15.3604L1.59738 12.2236C0.722562 11.8872 0.749635 10.6397 1.63839 10.3418L6.26046 8.79395L9.99972 13L13.7761 8.75098L18.4265 10.3438Z"/>
        <path ${pathS('auto')} d="M8 0.75C9.79493 0.75 11.25 2.20507 11.25 4V5H15L10 11L5 5H8.75V4C8.75 3.58579 8.41421 3.25 8 3.25H3V0.75H8Z"/>
      </svg>
      `;
  }
}
customElements.define('btn-hasselect', btnhasselect);

class btnstyle extends HTMLElement {
  constructor() {
      super();
      this.innerHTML = `
      ${icon(1024)}
        <path ${pathS('auto')} d="M512 0c279.04 0 512 204.8 512 460.8a310.784 310.784 0 0 1-307.2 312.32h-92.672a19.456 19.456 0 0 0-19.456 18.944s0 5.12 6.144 11.264a121.856 121.856 0 0 1 31.744 84.992A132.608 132.608 0 0 1 512 1024a512 512 0 0 1 0-1024z m0 81.92a430.08 430.08 0 0 0 0 860.16 51.2 51.2 0 0 0 51.2-51.2 44.544 44.544 0 0 0-7.168-26.624l-7.168-7.68a102.4 102.4 0 0 1-24.064-64.512 102.4 102.4 0 0 1 102.4-102.4H716.8A228.864 228.864 0 0 0 942.08 460.8c-3.584-204.8-195.584-378.88-430.08-378.88z m240.64 261.12A117.76 117.76 0 1 1 633.344 460.8a117.76 117.76 0 0 1 117.76-117.76zM256 337.92a117.76 117.76 0 1 1-117.76 117.76A117.76 117.76 0 0 1 256 337.92z m496.128 87.04a35.84 35.84 0 1 0 35.84 35.84 35.84 35.84 0 0 0-36.864-35.84zM256 419.84a35.84 35.84 0 1 0 0 71.68 35.84 35.84 0 0 0 0-71.68zM536.576 153.6a117.76 117.76 0 1 1-117.76 117.76 117.76 117.76 0 0 1 117.76-117.76z m0 81.92a35.84 35.84 0 1 0 35.84 35.84 35.84 35.84 0 0 0-35.84-36.352z"/>
      </svg>
      `;
  }
}
customElements.define('btn-style', btnstyle);

class btnview extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      ${icon(1024)}
      <path ${pathS('auto')} d="M512.122 272.146c-247.216 0-412.027 247.216-412.027 247.216s164.811 247.216 412.027 247.216c247.216 0 412.027-247.216 412.027-247.216S759.217 272.146 512.122 272.146z m0 410.207c-90.537 0-163.962-73.424-163.962-163.962s73.424-163.962 163.962-163.962c90.537 0 163.962 73.424 163.962 163.962-0.122 90.658-73.424 163.962-163.962 163.962z m-82.406-163.476c0 21.482 8.86 42.841 24.03 58.012s36.53 24.03 58.012 24.03 42.841-8.86 58.012-24.03c15.17-15.17 24.03-36.53 24.03-58.012s-8.86-42.841-24.03-58.012c-15.17-15.17-36.53-24.03-58.012-24.03s-42.841 8.86-58.012 24.03c-15.17 15.292-24.03 36.53-24.03 58.012z">
      </path>
    </svg>
    `;
  }
};

customElements.define('btn-view', btnview);


class btnlistease extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <circle ${circleS(3,4,2)} ${pathS('auto')}/>
      <path ${pathS(null,'fill')} d="M3 5V10H9"/>
      <path ${pathS(null,'fill')} d="M3 4H9"/>
      <path ${pathS(null,'fill')} d="M3 5V16H9"/>
      <rect ${rectS(12,4,7,8,2)} ${pathS('auto')}/>
      <rect ${rectS(12,4,7,2,2)} ${pathS('auto')}/>
      <rect ${rectS(12,4,7,14,2)} ${pathS('auto')}/>
    </svg>
    `;
  }
};
customElements.define('btn-listease', btnlistease);

class exportimg extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <rect ${rectS(17,16,1.5,2,2)} ${pathS(null,'fill',1.5)} />
      <path ${pathS(null,'fill',1.5,null,'round')} d="M18.5 15.0081L17.0282 12.8347C16.3636 11.8532 14.996 11.6619 14.0875 12.4233L11.6097 14.5L7.55616 8.49945C6.75486 7.31329 5.00327 7.32839 4.22254 8.52818L1.5 12.712"/>
      <circle ${circleS(13.5,7.15747,2.5)} ${pathS('auto')}/>
    </svg>

    `;
  }
};
customElements.define('export-img', exportimg);

class exportzy extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <rect ${rectS(17,16,1.5,2,2)} ${pathS(null,'fill',1.5)} />
      <path ${pathS('auto')} d="M13.0537 10.7266L14.3027 6.85742H15.9492L13.2695 14.1279C13.1374 14.4763 12.993 14.7404 12.8008 14.9326C12.4403 15.2931 11.9718 15.4131 11.4551 15.4131H10.8418V14.0078H11.2031C11.6474 14.0077 11.8272 13.8989 11.9834 13.4424L12.248 12.6738L10.1094 6.85742H11.7559L13.0537 10.7266Z"/>
      <path ${pathS('auto')} d="M10.0186 8.04688L7.20605 11.7119H10.0186V13.1182H5.24707V11.9287L8.02344 8.2627H5.40332V6.85742H10.0186V8.04688Z"/>
    </svg>
    `;
  }
};
customElements.define('export-zy', exportzy);

class exporttext extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <rect ${rectS(17,16,1.5,2,2)} ${pathS(null,'fill',1.5)} />
      <path ${pathS('auto')} d="M16.1181 13.5933C16.685 13.7505 16.7002 14.5498 16.1396 14.728L10.2509 16.5972C10.1359 16.6336 10.0117 16.6339 9.89641 16.5981L3.87395 14.729C3.30848 14.5533 3.32303 13.7472 3.89446 13.5923L4.98137 13.2983L10.0741 14.8784L15.0507 13.2983L16.1181 13.5933ZM16.1181 10.9487C16.6851 11.1059 16.7003 11.9043 16.1396 12.0825L10.2519 13.9526C10.1368 13.9892 10.0127 13.9893 9.89739 13.9536L3.87395 12.0835C3.30864 11.9078 3.32321 11.1028 3.89446 10.9478L7.15813 10.064V12.0522H12.6259V9.98291L16.1181 10.9487Z"/>
      <path ${pathS('auto')} d="M13.5 4.33447L13.4999 7.14766H12.528L12.4413 6.23008H10.6935L10.683 9.46251L11.6259 9.61635V11.0522H8.15778V9.61635L9.22159 9.46251L9.23214 6.23008H7.55867L7.47767 7.14766H6.5L6.50008 4.33447H13.5Z"/>
    </svg>
    `;
  }
};
customElements.define('export-text', exporttext);

class btnfull extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <path ${pathS(null,'auto',1.5,'round','round')} d="M11.3689 8.77466L17.6352 2.50835"/>
      <path ${pathS(null,'auto',1.5,'round','round')} d="M11.5874 2.28952L17.6351 2.50815L17.8537 8.55583"/>
      <path ${pathS(null,'auto',1.5,'round','round')} d="M11.3689 11.3887L17.6352 17.655"/>
      <path ${pathS(null,'auto',1.5,'round','round')} d="M11.5874 17.8738L17.6351 17.6552L17.8537 11.6075"/>
      <path ${pathS(null,'auto',1.5,'round','round')} d="M8.77319 8.77466L2.50689 2.50835"/>
      <path ${pathS(null,'auto',1.5,'round','round')} d="M8.55466 2.28952L2.50698 2.50815L2.28835 8.55583"/>
      <path ${pathS(null,'auto',1.5,'round','round')} d="M8.77319 11.3887L2.50689 17.655"/>
      <path ${pathS(null,'auto',1.5,'round','round')} d="M8.55466 17.8738L2.50698 17.6552L2.28835 11.6075"/>
    </svg>
    `;
  }
};
customElements.define('btn-full', btnfull);

class btndel extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(14)}
      <path ${pathS(null,'fill','1.4','round','round')} d="M2 4.27539H12"/>
      <path ${pathS(null,'fill','1.4','round','round')} d="M10 2.5V1.5H4V2.5"/>
      <path ${pathS(null,'fill','1.4','round','round')} d="M11 4.27539L9.85714 12.2754H4.14286L3 4.27539"/>
      <path ${pathS(null,'fill','1.4','round','round')} d="M6 6.27539V10.2754"/>
      <path ${pathS(null,'fill','1.4','round','round')} d="M8 6.27539V10.2754"/>
    </svg>
    `;
  }
};
customElements.define('btn-del', btndel);

class btnreup extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(14)}
      <path ${pathS(null,'auto','1.4','round','round')} d="M3.62775 3.99177C5.29058 1.78712 8.42578 1.34789 10.6304 3.01071C12.8351 4.67353 13.2743 7.80874 11.6115 10.0134C9.94867 12.218 6.81346 12.6573 4.60881 10.9945C3.34699 10.0427 2.66348 8.60869 2.62141 7.14286"/>
      <path ${pathS(null,'auto','1.4','round','round')} d="M2.99911 2.18428L3.20218 4.65075L5.66323 4.49707"/>
    </svg>
    `;
  }
};
customElements.define('btn-reup', btnreup);

class btnimport extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <path ${pathS('auto')} d="M4 15H16V13H19V19H1V13H4V15ZM8 3.04688C12.1429 3.43349 14 6.24465 14 9.43945V13L13.8936 12.792C12.5735 10.2138 11.4251 8.2507 8 7.93945V12L2 6L8 0V3.04688Z"/>
    </svg>
    `;
  }
};
customElements.define('btn-import', btnimport);

class btncode extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <path ${pathS('auto')} d="M19 19H1V15H19V19ZM9.78516 13.6963H6.78027L10.2148 0.759766H13.2197L9.78516 13.6963ZM3.47754 7.64453L6.3252 12.2285H2.78027L0 7.64453L2.78027 2.22852H6L3.47754 7.64453ZM20 7.64453L17.2197 12.2285H13.6748L16.5225 7.64453L14 2.22852H17.2197L20 7.64453Z"/>
    </svg>
      `;
  }
};
customElements.define('btn-code', btncode);

class skillstar extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <path ${pathS('auto')} d="M9.10133 5.24013C9.4668 4.4921 10.5329 4.4921 10.8983 5.24013L11.9152 7.32142L14.2089 7.64537C15.0332 7.76179 15.3626 8.77567 14.7642 9.3544L13.099 10.9647L13.4996 13.2462C13.6437 14.0661 12.7812 14.6928 12.0458 14.3024L9.99983 13.2163L7.95381 14.3024C7.21847 14.6928 6.35601 14.0661 6.50002 13.2462L6.9007 10.9647L5.23551 9.3544C4.63703 8.77567 4.96646 7.76179 5.79081 7.64537L8.08446 7.32142L9.10133 5.24013Z"/>
      <rect ${pathS(null,'fill')} ${rectS(17,17,1.5,1.5,2)}/>
    </svg>
      `;
  }
};
customElements.define('skill-star', skillstar);

class skillpixel extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <path ${pathS('auto')} d="M7 7H2V2H7V7ZM3 3V6H6V3H3Z"/>
      <rect ${pathS('auto')} x="6" y="4" width="6" height="1" rx="0.5"/>
      <rect ${pathS('auto')} x="4" y="6" width="1" height="6" rx="0.5"/>
      <rect ${pathS('auto')} x="14" y="14" width="4" height="4" rx="1"/>
      <rect ${pathS('auto')} x="8.5" y="14" width="4" height="4" rx="1"/>
      <rect ${pathS('auto')} x="8.5" y="8.5" width="4" height="4" rx="1"/>
      <rect ${pathS('auto')} x="3" y="14" width="4" height="4" rx="1"/>
      <rect ${pathS('auto')} x="14" y="8.5" width="4" height="4" rx="1"/>
      <rect ${pathS('auto')} x="14" y="2" width="4" height="4" rx="1"/>
    </svg>

      `;
  }
};
customElements.define('skill-pixel', skillpixel);

class skilllayer extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <path ${pathS('auto')} d="M9 2L8.99992 4.81319H8.02803L7.94126 3.8956H6.19353L6.19361 8.41026L7.13657 8.5641V10H3.66841V8.5641L4.73222 8.41026L4.73214 3.8956H3.05867L2.97767 4.81319H2L2.00008 2H9Z"/>
      <rect ${pathS('auto')} ${rectS(2.88032,2.88032,14.5825,6.26343,0.458252)} transform="rotate(45 14.5825 6.26343)"/>
      <rect ${pathS('auto')} ${rectS(2.88032,2.88032,14.0735,5.75439,0.458252)} transform="rotate(135 14.0735 5.75439)"/>
      <rect ${pathS('auto')} ${rectS(2.88032,2.88032,14.5825,1.17188,0.458252)} transform="rotate(45 14.5825 1.17188)"/>
      <rect ${pathS('auto')} ${rectS(2.88032,2.88032,19.165,5.75439,0.458252)} transform="rotate(135 19.165 5.75439)"/>
      <rect ${pathS(null,'fill',1.5,'round')} ${rectS(7,7,11.5,11.5,2)} stroke-dasharray="2 2"/>
      <rect ${pathS('auto')} ${rectS(8,8,2,11,2)}/>
    </svg>
      `;
  }
};
customElements.define('skill-layer', skilllayer);

class skillvector extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <path ${pathS('auto')} d="M12.5 7H7.5V2H12.5V7ZM8.5 3V6H11.5V3H8.5Z"/>
      <rect ${pathS('auto')} ${rectS(3,3,1,3,0)}/>
      <rect ${pathS('auto')} ${rectS(3,3,16,3,0)}/>
      <rect ${pathS('auto')} ${rectS(4,1,12,4,0)}/>
      <rect ${pathS('auto')} ${rectS(4,1,4,4,0)}/>
      <path ${pathS(null,'fill',1.5,'round')} d="M17 10C17 7.59975 15.0191 5.57184 12 5M3 10C3 7.58397 4.95063 5.55643 8 5"/>
      <circle ${pathS(null,'fill')} ${circleS(8.5,10.5,1.5)}/>
      <path ${pathS(null,'fill',1.5,'round')} d="M17 13.5731V17.0001C17 17.5523 16.5523 18.0001 16 18.0001H4C3.44772 18.0001 3 17.5523 3 17.0001V13.6103C3 12.7667 3.98031 12.3021 4.63324 12.8363L7.19138 14.9294C7.94689 15.5475 9.03826 15.5299 9.77349 14.8878L11.1597 13.6771C11.5229 13.3139 12.1024 13.285 12.5 13.6103L16.5799 17.1369M17 12V11.5"/>
    </svg>

      `;
  }
};
customElements.define('skill-vector', skillvector);

class skillstyle extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    ${icon(20)}
      <path ${pathS('auto')} d="M7.53784 8.53784C7.53784 7.98556 7.98556 7.53784 8.53784 7.53784H11.4618C12.0141 7.53784 12.4618 7.98556 12.4618 8.53784V11.4618C12.4618 12.0141 12.0141 12.4618 11.4618 12.4618H8.53784C7.98556 12.4618 7.53784 12.0141 7.53784 11.4618V8.53784Z"/>
      <path ${pathS(null,'fill')} d="M17.5 8.125V7C17.5 4.51472 15.4853 2.5 13 2.5H11.875M17.5 11.875V13C17.5 15.4853 15.4853 17.5 13 17.5H11.875M2.5 11.875V13C2.5 15.4853 4.51472 17.5 7 17.5H8.125M2.5 8.125V7C2.5 4.51472 4.51472 2.5 7 2.5H8.125"/>
      <path ${pathS(null,'fill')} d="M5.65112 7.65112C5.65112 6.54655 6.54655 5.65112 7.65112 5.65112H12.3489C13.4535 5.65112 14.3489 6.54655 14.3489 7.65112V12.3489C14.3489 13.4535 13.4535 14.3489 12.3489 14.3489H7.65112C6.54655 14.3489 5.65112 13.4535 5.65112 12.3489V7.65112Z" stroke-dasharray="2.14 2.14"/>
      <circle ${pathS(null,'fill')} ${circleS(10,2.5,1.5)}/>
      <circle ${pathS(null,'fill')} ${circleS(10,17.5,1.5)}/>
      <circle ${pathS(null,'fill')} ${circleS(2.5,10,1.5)}/>
      <circle ${pathS(null,'fill')} ${circleS(17.5,10,1.5)}/>
    </svg>
      `;
  }
};
customElements.define('skill-style', skillstyle);

class inputtypetag extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="var(--mainColor)" d="M20 11.5557L11.5557 20.001L1 9.44434V1H9.44434L20 11.5557ZM6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4Z"></path>
    </svg>
      `;
  }
};
customElements.define('input-typetag', inputtypetag);

class inputfontsize extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="var(--mainColor)" d="M13.0001 6.5H11.0001C11.0001 5.39543 10.1046 4.5 9.00006 4.5H8.50006L8.50003 14.5C8.50003 15.3284 9.1716 16 10 16V18H4.00003V16C4.82846 16 5.50003 15.3284 5.50003 14.5L5.50006 4.5H5.00006C3.89549 4.5 3.00006 5.39543 3.00006 6.5H1.00006L1 1.5H13L13.0001 6.5Z"></path>
      <path fill="var(--mainColor)" d="M19 11.5H17.667C17.6668 10.7637 17.0693 10.167 16.333 10.167H16V15C16.0001 15.5523 16.4478 16 17 16V18H12.5V16C13.0523 16 13.5 15.5523 13.5 15V10.167H13.167C12.4308 10.167 11.8332 10.7637 11.833 11.5H10.5V7.5H19V11.5Z"></path>
    </svg>
      `;
  }
};
customElements.define('input-fontsize', inputfontsize);

class inputtabletitle extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path stroke="var(--mainColor)" fill="var(--mainColor)" d="M1.40967 3.66602C1.40967 2.56145 2.3051 1.66602 3.40967 1.66602H7.40967V6.59054H1.40967V3.66602Z"></path>
      <rect stroke="var(--mainColor)" x="1.40967" y="7.13843" width="5.63721" height="5.5603"></rect>
      <path stroke="var(--mainColor)" d="M1.40967 12.6987H7.04688V18.2185H3.40967C2.3051 18.2185 1.40967 17.3231 1.40967 16.2185V12.6987Z"></path>
      <path stroke="var(--mainColor)" fill="var(--mainColor)" d="M9.86572 2.19995H17C18.1046 2.19995 19 3.09538 19 4.19995V7.36918H9.86572V2.19995Z"></path>
      <rect stroke="var(--mainColor)" x="9.86572" y="7.36914" width="9.13428" height="5.7478"></rect>
      <path stroke="var(--mainColor)" d="M9.86572 13.1169H19V17.0002C19 18.1048 18.1046 19.0002 17 19.0002H9.86572V13.1169Z"></path>
    </svg>
      `;
  }
};
customElements.define('input-tabletitle', inputtabletitle);

class inputnamerule extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect fill="var(--mainColor)" x="16" y="4" width="4" height="2" rx="1"></rect>
      <rect fill="var(--mainColor)" y="4" width="8.5" height="2" rx="1"></rect>
      <rect fill="var(--mainColor)" y="16" width="20" height="2" rx="1"></rect>
      <rect fill="var(--mainColor)" x="18" y="4" width="17" height="2" rx="1" transform="rotate(90 18 4)"></rect>
      <rect fill="var(--mainColor)" x="4" y="2" width="20" height="2" rx="1" transform="rotate(90 4 2)"></rect>
      <path fill="var(--mainColor)" d="M6.97137 16.0954C6.62768 16.3986 6.09115 16.1182 6.14391 15.6629L6.71709 10.717L10.7051 12.8016L6.97137 16.0954Z"></path>
      <path fill="var(--mainColor)" d="M11.3154 11.5259L7.35709 9.45685L11.5784 1.38079C11.8343 0.891339 12.4385 0.701954 12.9279 0.957792L15.1138 2.10035C15.6032 2.35618 15.7926 2.96036 15.5368 3.44982L11.3154 11.5259Z"></path>
    </svg>
      `;
  }
};
customElements.define('input-namerule', inputnamerule);

class tabsheettype extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="var(--mainColor)" fill-rule="evenodd" clip-rule="evenodd" d="M7.89746 2.57129C7.3268 3.58479 7 4.75402 7 6C7 6.54045 7.06376 7.06601 7.17969 7.57129H3V12.0713H9.5V11.3604C9.81125 11.6219 10.146 11.8557 10.5 12.0605V12.0713H10.5176C11.5434 12.661 12.7318 13 14 13C15.4877 13 16.866 12.5345 18 11.7432V16.5713L17.9893 16.7754C17.887 17.7841 17.0357 18.5713 16 18.5713H4C2.96435 18.5713 2.113 17.7841 2.01074 16.7754L2 16.5713V4.57129C2.00016 3.46686 2.89553 2.57129 4 2.57129H7.89746ZM3 16.5713C3 17.1236 3.44772 17.5713 4 17.5713H9.5V13.0713H3V16.5713ZM10.5 17.5713H16C16.5523 17.5713 17 17.1236 17 16.5713V13.0713H10.5V17.5713Z"></path>
      <path fill="var(--mainColor)" fill-rule="evenodd" clip-rule="evenodd" d="M14 0C17.3137 0 20 2.68629 20 6C20 9.31371 17.3137 12 14 12C10.6863 12 8 9.31371 8 6C8 2.68629 10.6863 0 14 0ZM13.2246 8.71582V10.3145H14.8828V8.71582H13.2246ZM13.9941 1.68555C12.6002 1.68555 11.4709 2.59895 11.4707 4.08887H13.0322C13.0324 3.53626 13.3574 3.0918 13.9941 3.0918C14.5948 3.09191 14.9677 3.51247 14.9678 4.07715C14.9678 4.34154 14.8114 4.63044 14.6191 4.88281L13.7295 6.02441C13.4171 6.43292 13.2725 6.75774 13.2725 7.27441V7.63477H14.835V7.38184C14.8351 7.17761 14.9317 6.92569 15.0518 6.76953L15.9404 5.5918C16.2769 5.14715 16.5293 4.68975 16.5293 4.08887C16.5291 2.56299 15.3519 1.68565 13.9941 1.68555Z"></path>
    </svg>
      `;
  }
};
customElements.define('tab-sheettype', tabsheettype);

class tabtablestyle extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="var(--mainColor)" d="M7.96875 7.57129H3V12.0713H6.61914L6.50391 13.0713H3V16.5713C3 17.1236 3.44772 17.5713 4 17.5713H9.5V15.4512L10.5 14.5693V17.5713H16C16.5523 17.5713 17 17.1236 17 16.5713V13.0713H12.1982L12.5205 12.7871L13.332 12.0713H17V7.57129H15.2656L17.5137 3.26758C17.8157 3.61783 17.9999 4.07254 18 4.57129V16.5713L17.9893 16.7754C17.887 17.7841 17.0357 18.5713 16 18.5713H4C2.96435 18.5713 2.113 17.7841 2.01074 16.7754L2 16.5713V4.57129C2.00016 3.46686 2.89553 2.57129 4 2.57129H10.583L7.96875 7.57129Z"></path>
      <path fill="var(--mainColor)" d="M11.8598 12.0372L8.12642 15.3311C7.78273 15.6343 7.24651 15.3537 7.29927 14.8985L7.87154 9.95317L11.8598 12.0372ZM12.7329 0.616255C12.9887 0.127036 13.5931 -0.0621097 14.0825 0.193403L16.269 1.33598C16.7583 1.59183 16.9475 2.19621 16.6919 2.68559L12.4702 10.7618L8.51216 8.69243L12.7329 0.616255Z"></path>
    </svg>
      `;
  }
};
customElements.define('tab-tablestyle', tabtablestyle);

class btnvariable extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="var(--mainColor)" d="M18.6963 14.9325L18.9217 15.4821C18.7361 15.7539 18.464 16.0317 18.1055 16.3154C17.7531 16.599 17.3748 16.8384 16.9705 17.0334C16.5722 17.2284 16.2061 17.3259 15.8721 17.3259C15.7203 17.3259 15.5913 17.2934 15.4853 17.2284C15.3778 17.1693 15.2906 17.0629 15.2236 16.9093L13.6839 13.4787C13.4954 13.6856 13.2576 13.9338 12.9706 14.2233C12.6836 14.5129 12.4167 14.8202 12.1699 15.1452C11.9306 15.4644 11.774 15.7805 11.7 16.0938C11.6539 16.2888 11.6515 16.4661 11.6928 16.6256C11.3365 16.797 11.0013 16.9566 10.6871 17.1043C10.3729 17.2521 10.0731 17.3259 9.78766 17.3259C9.41725 17.3259 9.27601 17.1398 9.36395 16.7675C9.43932 16.4483 9.67742 16.0701 10.0783 15.6328C10.4852 15.1955 10.9787 14.7257 11.5588 14.2233C12.145 13.721 12.7373 13.2187 13.3357 12.7164L11.9546 9.57831L10.4188 10.4116L10.1955 9.85311C10.2692 9.74673 10.4283 9.58717 10.6729 9.37442C10.9235 9.16167 11.212 8.94301 11.5383 8.71845C11.872 8.48797 12.2035 8.29295 12.5327 8.13339C12.8679 7.97382 13.157 7.89404 13.3998 7.89404C13.6002 7.89404 13.7416 7.97678 13.824 8.14225C14.1141 8.73913 14.3779 9.30646 14.6152 9.84424C14.8539 10.3761 15.0823 10.8873 15.3004 11.3778C15.8049 10.8873 16.1696 10.5002 16.3945 10.2166C16.6268 9.92698 16.7787 9.70832 16.85 9.56058C16.9227 9.40693 16.9682 9.29169 16.9863 9.21486C17.0212 9.06712 17.03 8.94006 17.0126 8.83369C16.9952 8.72731 16.9804 8.63571 16.9682 8.55888C17.451 8.34023 17.8182 8.18657 18.0699 8.09793C18.329 8.00337 18.5153 7.94723 18.6288 7.9295C18.7498 7.90586 18.8406 7.89404 18.9014 7.89404C19.2475 7.89404 19.3738 8.09202 19.2803 8.48797C19.2035 8.813 18.9735 9.18236 18.5904 9.59604C18.2073 10.0097 17.7509 10.4382 17.2212 10.8814C16.6928 11.3187 16.1642 11.7442 15.6354 12.1579L17.1613 15.8012L18.6963 14.9325Z"></path>
      <path fill="var(--mainColor)" d="M9.21571 6.44182L7.11722 15.3266C6.86854 16.3795 6.4285 17.245 5.79708 17.9233C5.17077 18.608 4.45035 19.115 3.63583 19.4444C2.83972 19.7664 2.1347 19.7328 1.37649 19.6673C1.07065 19.6415 0.804865 19.5865 0.579128 19.5026C0.346753 19.4186 0.250398 19.2926 0.290065 19.1247C0.299218 19.086 0.326223 19.0278 0.371078 18.9503L1.37599 17.4776C1.82495 17.6843 2.26956 17.8813 2.70982 18.0686C3.73148 18.5033 4.04851 18.19 4.44744 16.809C4.59146 16.3117 4.71992 15.824 4.83282 15.346L6.91597 6.44182H4.54654L4.64952 6.00581C4.71818 5.71514 4.82776 5.51813 4.97827 5.41478C5.13695 5.30497 5.35898 5.25007 5.64438 5.25007H7.19745L7.34848 4.6106C7.59258 3.5771 8.00177 2.74385 8.57605 2.11084C9.15034 1.47782 9.81361 1.01598 10.5659 0.725311C11.3248 0.434641 12.0925 0.289307 12.869 0.289307C12.9951 0.289307 13.1728 0.295766 13.4021 0.308685C13.638 0.321603 13.8726 0.3539 14.1059 0.405575C14.3475 0.45079 14.5423 0.525072 14.6905 0.628421C14.8401 0.725311 14.8952 0.857727 14.8555 1.02567C14.8387 1.09672 14.7842 1.18715 14.6919 1.29696L13.6485 2.59529C13.2133 2.33045 12.8066 2.085 12.4286 1.85892C12.0506 1.63285 11.6924 1.51981 11.3539 1.51981C10.9092 1.51981 10.5834 1.73297 10.3765 2.15928C10.1778 2.57914 9.98767 3.1734 9.80612 3.94206L9.49719 5.25007H12.3544L12.256 5.6667C12.1889 5.95091 12.0752 6.15115 11.915 6.26741C11.7615 6.38368 11.542 6.44182 11.2566 6.44182H9.21571Z"></path>
    </svg>
      `;
  }
};
customElements.define('btn-variable', btnvariable);

class btnrelayout extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect fill="var(--mainColor)" x="3" y="3" width="3" height="3"></rect>
      <rect fill="var(--mainColor)" x="9" y="3" width="3" height="3"></rect>
      <rect fill="var(--mainColor)" x="15" y="3" width="3" height="3"></rect>
      <rect fill="var(--mainColor)" x="3" y="9" width="3" height="3"></rect>
      <rect fill="var(--mainColor)" x="9" y="9" width="3" height="3"></rect>
      <rect fill="var(--mainColor)" x="15" y="9" width="3" height="3"></rect>
      <rect fill="var(--mainColor)" x="3" y="15" width="3" height="3"></rect>
      <rect fill="var(--mainColor)" x="9" y="15" width="3" height="3"></rect>
      <rect fill="var(--mainColor)" x="15" y="15" width="3" height="3"></rect>
    </svg>
      `;
  }
};
customElements.define('btn-relayout', btnrelayout);

class inputregexpenter extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path stroke-width="0.25" stroke="var(--mainColor)" fill="var(--mainColor)" d="M15.0417 9.94629C15.0416 11.6031 13.6985 12.9462 12.0417 12.9463H8.29461V13.999C8.29455 14.4246 7.79631 14.6557 7.47137 14.3809L4.57976 11.9346C4.10782 11.5352 4.10788 10.8067 4.57976 10.4072L7.47137 7.96094C7.79633 7.68597 8.29461 7.91709 8.29461 8.34277V9.39551H11.4909V5.13379H15.0417V9.94629Z"></path>
      <rect stroke="var(--mainColor)" x="2" y="2" width="16" height="16" rx="2"></rect>
      <rect fill="var(--mainColor)" x="2" y="21" width="16" height="2" rx="1"></rect>
    </svg>
  `;
  }
};
customElements.define('input-regexpenter', inputregexpenter);

class inputregexpnull extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path stroke-width="0.25" stroke="var(--mainColor)" fill="var(--mainColor)" d="M14.4007 5.40071C15.0952 6.09516 15.0952 7.22121 14.4007 7.91564L12.5149 9.80149L14.4007 11.6873C15.0951 12.3817 15.0951 13.5078 14.4007 14.2023C13.7063 14.8967 12.5803 14.8967 11.8858 14.2023L9.99997 12.3164L8.11413 14.2023C7.41969 14.8967 6.29365 14.8967 5.5992 14.2023C4.90476 13.5078 4.90476 12.3818 5.5992 11.6873L7.48505 9.80149L5.5992 7.91564C4.90476 7.2212 4.90476 6.09516 5.5992 5.40071C6.29366 4.70641 7.41973 4.70632 8.11413 5.40071L9.99997 7.28656L11.8858 5.40071C12.5803 4.70627 13.7063 4.70627 14.4007 5.40071Z"></path>
      <rect stroke="var(--mainColor)" x="2" y="2" width="16" height="16" rx="2"></rect>
      <rect fill="var(--mainColor)" x="2" y="21" width="16" height="2" rx="1"></rect>
    </svg>
    `;
  }
};
customElements.define('input-regexpnull', inputregexpnull);

class btngoto extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.71411 11.3821H20.7141" stroke="var(--mainColor)" stroke-width="var(--arrow-w)" stroke-linecap="round"></path>
      <path d="M12.3421 2.38208L20.7141 11.3821L12.3421 20.3821" stroke="var(--mainColor)" stroke-width="var(--arrow-w)" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
    `;
  }
};
customElements.define('btn-goto', btngoto);