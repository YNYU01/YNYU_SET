const HTML_MAIN = `<html data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no">
  <meta name="description" content="about this web">
  <link rel="icon" href="https://www.ynyuset.cn/VI/ICON_YNYUSET.png" type="image/png">
  <link rel="stylesheet" href="yn_style.css">
  <script src="build/yn_run.js"></script>
</head>
<body class="noselect df-ct">
<script src="yn_comp.js"></script>
<script src="main.js"></script>
</body>
</html>`;

const JS_MAIN = `let observer = new MutationObserver((mutations) => {
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
  let number = node.getAttribute('data-number-value');
  //console.log(number);
}

function getUserText(node){
  let text = node.getAttribute('data-text-value');
  //console.log(text);
}

function getUserSelect(node){
  let select = node.getAttribute('data-select-value');
  //console.log(text);
}
`;

const COMPS_TIPS = {
  "HTML_main":[
    "'包含css、js引入示例，以及必要的版权声明'",
    "'Includes CSS, JS import examples, and necessary copyright notices'"
  ],
  "JS_main":[
    "'包含复合组件传递关键参数要用到的函数示例，以及必要的版权声明'",
    "'Examples of functions used to pass key parameters through composite components, and necessary copyright notices'"
  ],
  "TV":[
    "'用于需要滚动的公告类元素，可设置data-TV的布尔值，控制是否触发滚动'",
    "'Used for announcement elements that require scrolling, the boolean value of \"data-TV\" can be set to control whether scrolling is triggered'"
  ],
  "radio":[
    "'单选切换，可自行丰富样式，建议通过监听自定义属性值变化触发函数'",
    "'Single choice switching allows for customizable styles. It is recommended to trigger functions by monitoring changes in custom attribute values'"
  ],
  "select":[
    "'结构与原生下拉组件类似，主要为了支持移动端显示,以及延展为详情展开等'",
    "'The structure is similar to the native select component, mainly to support mobile display and extend to expand details'"
  ],
  "tabs":[
    "'通过页面数量生成导航标签，可自行丰富样式，注意tab栏和page的相关自定义属性值要匹配'",
    "'By generating navigation tags based on the number of pages, you can enrich the style by yourself, and pay attention to matching the custom attribute values of the tab and page'"
  ],
  "theme":[
    "'通过css变量和自定义属性控制颜色变化，实现亮暗主题'",
    "'Control color changes through CSS variables and custom properties to achieve bright and dark themes'"
  ],
  "check":[
    "'基于原生checkbox，可借助自定义属性的布尔值变化丰富选中/未选中的样式'",
    "'Based on the native checkbox component, the Boolean value changes of custom attributes can be used to enrich the selected/unselected styles'"
  ],
  "switch":[
    "'基于原生checkbox，可通过CSS变量控制大小和圆角，可自行绑定事件'",
    "'Based on the native checkbox, CSS variables can be used to control size and rounded corners, and events can be bound by youself'"
  ],
  "input-range-int":[
    "'基于原生滑块，绑定一个输入框，添加事件绑定可能会冲突，建议通过监听自定义属性值触发函数'",
    "'Based on the native slider, an input box has been bound, so adding event binding may cause conflicts. It is recommended to trigger the function by listening to custom attribute values'"
  ],
  "input-color":[
    "'带系统吸色器（兼容才会显示）、纯CSS取色盘（支持HSV、HSL）、可切换HEX/RGB两种输入方式，绑定较复杂，建议通过监听自定义属性值触发函数'",
    "'Equipped with a system color absorber (displayed only if compatible), a pure CSS color palette (supporting HSV, HSL), and switchable HEX/RGB input methods, it is recommended to trigger the function by listening to custom attribute values'"
  ],
  "input-text":[
    "'原生输入框，仅统一了样式，如有需要可自行添加清空按钮'",
    "'Native input box, only unified style, if necessary, you can add a clear button by yourself'"
  ],
  "input-text-must":[
    "'原生输入框，统一样式基础上绑定兜底数据，建议通过监听自定义属性值变化触发函数'",
    "'Native input box, based on a unified style, bound with fallback data. It is recommended to trigger the function by listening to changes in custom attribute values'"
  ],
  "input-text-max":[
    "'原生输入框，统一样式基础上绑定显示字数要求，建议通过监听自定义属性值变化触发函数'",
    "'Native input box, with a unified style and bound display word count requirements. It is recommended to trigger the function by listening to changes in custom attribute values'"
  ],
  "textarea":[
    "'原生文本框，统一样式基础上绑定清空按钮，建议输入完成后通过按钮获取值来进行下一步函数'",
    "'Native text box, bound with a clear button based on a unified style. It is recommended to obtain the value through the button after inputting to proceed to the next function'"
  ],
  "textarea-eg":[
    "'原生文本框，统一样式基础上绑定清空按钮和输入说明，建议输入完成后通过按钮获取值来进行下一步函数'",
    "'Native text box, with a unified style, bound with a clear button and input instructions. It is recommended to obtain the value through the button after inputting to proceed to the next function'"
  ],
  "turnto":[
    "'图标+悬停才显示文字型按钮，本示例的图标专用于跳转'",
    "'Icon+hover to display text buttons. The icon in this example is specifically designed for jumping'"
  ],
  "back":[
    "'图标+悬停才显示文字型按钮，本示例的图标专用于返回'",
    "'Icon+hover to display text buttons, the icon in this example is dedicated to returning'"
  ],
}

const copyElements = document.querySelectorAll('[data-copy]');


window.addEventListener('load',()=>{
  
});

window.addEventListener('resize',()=>{

});

document.querySelector('[data-code="JS_main"]').innerHTML = JS_MAIN.replace(/</g,'&lt;').replace(/>/g,'&gt;');

document.querySelector('[data-code="HTML_main"]').innerHTML = HTML_MAIN.replace(/</g,'&lt;').replace(/>/g,'&gt;');

document.getElementById('language-1').addEventListener('change',(event) => {
  if(event.target.checked){
    document.querySelector('[data-code="HTML_main"]').innerHTML = HTML_MAIN.replace(/</g,'&lt;').replace(/>/g,'&gt;');
    Prism.highlightElement(document.querySelector('[data-code="HTML_main"]'));
  }else{
    document.querySelector('[data-code="HTML_main"]').innerHTML = HTML_MAIN.replace(/</g,'&lt;').replace(/>/g,'&gt;');
    Prism.highlightElement(document.querySelector('[data-code="HTML_main"]'));
  }
})

document.getElementById('switch-1').addEventListener('change',(event) => {
  if(event.target.checked){
    ROOT.style.setProperty('--btn-copy-df','flex');
  }else{
    ROOT.style.setProperty('--btn-copy-df','none');
  }
});

copyElements.forEach(node => {
  let copyBtn = node.querySelector('[data-copy-btn]');
  let infoTips = node.querySelector('[data-tips]');
  let key = node.getAttribute('data-copy');


  if(COMPS_TIPS[key]){
    infoTips.style.setProperty('--tips-text',COMPS_TIPS[key][0]);
    infoTips.style.setProperty('--tips-text-en',COMPS_TIPS[key][1]);
  }

  copyBtn.addEventListener('click',()=>{
    let language = ROOT.getAttribute('data-language');
    let htmlcode = node.innerHTML.split(key + ':')[1];
    if(key === "HTML_main"){
      htmlcode = language == 'Zh' ? '<!--' + COPYRIGHT_ZH + '-->' + HTML_MAIN : '<!--' + COPYRIGHT_EN + '-->' + HTML_MAIN;
    } else if ( key === "JS_main"){
      htmlcode = language == 'Zh' ? '/**\n' + COPYRIGHT_ZH + '\n*/' + JS_MAIN : '/**\n' + COPYRIGHT_EN + '\n*/' + JS_MAIN;
    } else {
      let tips = language == 'Zh' ? '<!--自定义标签，需引入css和js库才能生效-->' : '<!--Importing css and js libraries to make it effective-->'
      COMPS.forEach(item => {
        if(htmlcode.split('<'+ item ).length > 1){
          let keys = new RegExp('<'+ item + '[\\s\\S]*?<\/'+ item + '>','g');
          htmlcode = htmlcode.replace(keys,'<' + item + '>' + tips + '</'+ item + '>')
        };
      });
    }
    let copyrights = language == 'Zh' ? "\n<!-- © 2024-2025 『云即』系列开源计划 @云雨 lvynyu@163.com https://www.ynyuset.cn -->" : "\n<!-- © 2024-2025 [YNYU_SET] OPEN DESIGN & SOURCE @YNYU lvynyu2@gmail.com https://www.ynyuset.cn -->";
    copy(node,'text',htmlcode.trim() + copyrights);
  });
});


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
  let number = node.getAttribute('data-number-value');
  //console.log(number);
}

function getUserText(node){
  let text = node.getAttribute('data-text-value');
  //console.log(text);
}

function getUserSelect(node){
  let select = node.getAttribute('data-select-value');
  //console.log(text);
}