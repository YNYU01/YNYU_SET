const ROOT = document.documentElement
let USER_KEYING = false;
let THEME_SWITCH = document.getElementById("theme");
let COMPS = ['btn-theme','btn-close','btn-copy'];

window.onload = ()=>{
  if(localStorage.getItem('userTheme') == 'light'){
    THEME_SWITCH.checked = false;
    setTheme(true);
  }
  if(!localStorage.getItem('userTheme')){
    THEME_SWITCH.checked = true;
    setTheme(true);
    localStorage.setItem('userTheme','dark');
  }
}

window.onresize = ()=>{
  reTV()
}
THEME_SWITCH.onchange = ()=>{
  if(THEME_SWITCH.checked){
    setTheme(false)
  }else{
    setTheme(true)
  }
}

document.addEventListener('keydown',(event) => {
  if (event.isComposing) {
    USER_KEYING = true;
  } else {
    USER_KEYING = false;
  }
})

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
      <div class="wh100 btn-text" style="border:1px var(--boxBod) solid; padding:20%; box-sizing: border-box; flex:0 0 auto; border-radius: 50%;">
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
    this.className = 'btn-text'
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 11 11">  
      <path  fill-rule="evenodd" fill="var(--add,transparent)" fill-opacity="1"
      d="M5,2L4,2L4,4L2,4L2,5L4,5L4,7L5,7L5,5L7,5L7,4L5,4L5,2Z"/>
      <path fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1"
      d="M0,2.5L0,6.5Q0,7.53553,0.732233,8.26777Q1.29574,8.83127,2.03888,8.96112Q2.16872,9.70426,2.73223,10.2678Q3.46447,11,4.5,11L8.5,11Q9.53553,11,10.2678,10.2678Q11,9.53553,11,8.5L11,4.5Q11,3.46447,10.2678,2.73223Q9.70426,2.16872,8.96112,2.03888Q8.83127,1.29574,8.26777,0.732233Q7.53553,0,6.5,0L2.5,0Q1.46447,0,0.732233,0.732233Q0,1.46447,0,2.5ZM9,3.08099L9,6.5Q9,7.53553,8.26777,8.26777Q7.53553,9,6.5,9L3.08099,9Q3.18864,9.30996,3.43934,9.56066Q3.87868,10,4.5,10L8.5,10Q9.12132,10,9.56066,9.56066Q10,9.12132,10,8.5L10,4.5Q10,3.87868,9.56066,3.43934Q9.30996,3.18864,9,3.08099ZM1.43934,7.56066Q1,7.12132,1,6.5L1,2.5Q1,1.87868,1.43934,1.43934Q1.87868,1,2.5,1L6.5,1Q7.12132,1,7.56066,1.43934Q8,1.87868,8,2.5L8,6.5Q8,7.12132,7.56066,7.56066Q7.12132,8,6.5,8L2.5,8Q1.87868,8,1.43934,7.56066Z" 
      />
    </svg>
    `;
    this.setAttribute('onclick',`copy(this.parentNode.parentNode,'egcode')`)
  }
};
customElements.define('btn-copy', btncopy);

/**
 * 使输入的内容保持正确的范围
 * @param {Element} node 
 * @param {Array} info -形式为[格式要求,值]的数组：['int',min,max] | ['text',any] | ['hex','#000000'] 
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
    let num = value.replace(/\D/g,'').trim()
    return num ? num*1 : nullText;
  }
  if(type === "text"){
    if(node.value == '' || node.value.length < 1){
      let nullText = info[1];
      let maxlength = node.getAttribute("maxlength")
      nullText = maxlength ? nullText.substring(0,maxlength) : nullText
      node.value = nullText
    }
  }
}

function reTV(){
  let TV_MOVE = document.querySelectorAll('[data-TV="true"]');
  TV_MOVE.forEach(item => {
    let long = item.offsetWidth + item.parentNode.offsetWidth;
    item.style.setProperty('--tv-s',Math.floor(long/30) + 's')
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
function setTheme(isLight){
  if(isLight){
    ROOT.setAttribute("data-theme","light");
    localStorage.setItem('userTheme','light');
  }else{
    ROOT.setAttribute("data-theme","dark");
    localStorage.setItem('userTheme','dark');
  }
}

/**
 * 
 * @param {Element} node - 包裹了需要被复制的内容的容器，也可以是{id:xxx}
 * @param {any} type - egcode | inputvalue | self | topng
 */
function copy(node,type){
  node = node.innerHTML ? node : document.getElementById(node.id);
  if(type === 'egcode'){
    let key = node.getAttribute('data-copy');
    let htmlcode = node.innerHTML.split(key + ':')[1];
    
    if(key === "HTML_main"){
      htmlcode = `<html data-theme="dark">
<head>
  <link rel="stylesheet" href="yn_style.css">
  <!-- 引入 Prism JS -->
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/prism.min.js"></script>
</head>
<body class="noselect df-ct">
  <script src="yn_comp.js"></script>
</body>
</html>`
    } else {
      COMPS.forEach(item => {
        if(htmlcode.split('<'+ item + '>').length > 1){
          let keys = new RegExp('<'+ item + '>[\\s\\S]*?<\/'+ item + '>','g');
          htmlcode = htmlcode.replace(keys,'<' + item + '><!--此处需引入css和js库--></'+ item + '>')
          //htmlcode = htmlcode.replace(/ +/g,' ')
        }
      })
    }
    //console.log(htmlcode)
    navigator.clipboard.writeText(htmlcode.trim()) .then(function() {});
  }
  
}