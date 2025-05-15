
const HTML_MAIN_ZH = `<!--
- 『云即』系列开源计划
- © 2024-2025 云雨 lvynyu@163.com；
- 本项目遵循GPL3.0协议；
- 本项目禁止用于违法行为，如有，与作者无关；
- 商用及二次编辑需保留本项目的版权声明，且必须开源；
- 代码中引用其他库的部分应遵循对应许可；
- 使用当前代码时禁止删除或修改本声明；
-->
<html data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no">
  <meta name="description" content="about this web">
  <link rel="icon" href="https://www.ynyuset.cn/VI/ICON_YNYUSET.png" type="image/png">
  <link rel="stylesheet" href="yn_style.css">
</head>
<body class="noselect df-ct">
  <script src="yn_comp.js"></script>
</body>
</html>`;

const HTML_MAIN_EN = `<!--
- [YNYU_SET] OPEN DESIGN & SOURCE
- © 2024-2025 YNYU lvynyu2@gmail.com;
- Must comply with GNU GENERAL PUBLIC LICENSE Version 3;
- Prohibit the use of this project for illegal activities. If such behavior occurs, it is not related to this project;
- For commercial use or secondary editing, it is necessary to retain the copyright statement of this project and must continue to open source it;
- For external libraries referenced in the project, it is necessary to comply with the corresponding open source protocols;
- When using the code of this project, it is prohibited to delete this statement
-->
<html data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no">
  <meta name="description" content="about this web">
  <link rel="icon" href="https://www.ynyuset.cn/VI/ICON_YNYUSET.png" type="image/png">
  <link rel="stylesheet" href="yn_style.css">
</head>
<body class="noselect df-ct">
  <script src="yn_comp.js"></script>
</body>
</html>`;


window.addEventListener('load',()=>{

});

window.addEventListener('resize',()=>{
});

if(localStorage.getItem('userLanguage') == 'Zh'){
  document.querySelector('[data-code="HTML_main"]').innerHTML = HTML_MAIN_ZH.replace(/</g,'&lt;').replace(/>/g,'&gt;');
} else {
  document.querySelector('[data-code="HTML_main"]').innerHTML = HTML_MAIN_EN.replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
document.getElementById('switch').addEventListener('change',(event) => {
  if(event.target.checked){
    ROOT.style.setProperty('--btn-copy-df','flex');
  }else{
    ROOT.style.setProperty('--btn-copy-df','none');
  }
})

document.querySelectorAll('[data-back]').forEach(item => {
  item.addEventListener('click',() => {
    let isnew = item.getAttribute('data-link-isnew') == 'true' ? true : false;
    let linkurl = item.getAttribute('data-link-to');
    let link = document.createElement('a');
    link.href = linkurl;
    if(isnew){
      link.target = '_blank';
    }
    link.click()
  })
})

/*监听组件的自定义属性值，变化时触发函数，用于已经绑定事件用于自身的组件，如颜色选择器、滑块输入框组合、为空自动填充文案的输入框、导航tab、下拉选项等*/
let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if(mutation.type === 'attributes'){
      switch(mutation.attributeName){
        case 'data-color-hex':getUserColor(mutation.target); break;
        case 'data-number-value':getUserNumber(mutation.target); break;
        case 'data-text-value':getUserText(mutation.target); break;
        case 'data-select-value':getUserSelect(mutation.target); break;
      }
    }
  })
});
let userEvent_color = document.querySelectorAll('[data-color]');
userEvent_color.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-color-hex']};
  observer.observe(item,config);
});
let userEvent_number = document.querySelectorAll('[data-number]');
userEvent_number.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-number-value']};
  observer.observe(item,config);
});
let userEvent_text = document.querySelectorAll('[data-text]');
userEvent_text.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-text-value']};
  observer.observe(item,config);
});
let userEvent_select = document.querySelectorAll('[data-select]');
userEvent_select.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-select-value']};
  observer.observe(item,config);
});

function getUserColor(node){
  let color = {
    HEX:node.getAttribute('data-color-hex'),
    RGB:node.getAttribute('data-color-rgb'),
    HSL:node.getAttribute('data-color-hsl'),
    HSV:node.getAttribute('data-color-hsv'),
  }
  //console.log(color)
}

function getUserNumber(node){
  let number = node.getAttribute('data-number-value')
  //console.log(number)
}

function getUserText(node){
  let text = node.getAttribute('data-text-value')
  //console.log(text)
}

function getUserSelect(node){
  let select = node.getAttribute('data-select-value')
  //console.log(text)
}