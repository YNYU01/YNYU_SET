const TOOL_INFO = [
  {
    name: ["云即·工具集 Figma版","    YN+ToolsSet Fig"],
    icon:"",
    url:"",
    about:[
      [
      "说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案",
      "This is a plug-in for XXX function. Please pay attention to the following issues"
      ],
      [
        "说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案",
        "This is a plug-in for XXX function. Please pay attention to the following issues"
        ],
        [
          "说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案",
          "This is a plug-in for XXX function. Please pay attention to the following issues"
          ],
    ],
    keyword:[
      ["插件","Plug-in"],
    ]
  },
  {
    name: ["云即·工具集 Mastergo版","YN+ToolsSet Mg"],
    icon:"",
    url:"",
    about:[
      [
      "说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案",
      "This is a plug-in for XXX function. Please pay attention to the following issues"
      ],
    ],
    keyword:[
      ["插件","Plug-in"],
    ]
  },
  {
    name: ["云即·工具集 PS版","YN+ToolsSet Ps"],
    icon:"",
    url:"",
    about:[
      [
      "说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案",
      "This is a plug-in for XXX function. Please pay attention to the following issues"
      ],
    ],
    keyword:[
      ["插件","Plug-in"],
    ]
  },
  {
    name: ["云即·资源助手","YN+ListEase"],
    icon:"",
    url:"",
    about:[
      [
      "说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案",
      "This is a plug-in for XXX function. Please pay attention to the following issues"
      ],
    ],
    keyword:[
      ["网页","Web"],
    ]
  },
  
];

let randomColor = [
  "var(--code1)",
  "var(--code2)",
  "var(--code3)",
  "var(--code4)",
  "var(--code5)",
  "var(--code6)",
  "var(--code7)",
  "var(--code8)",
  "var(--code9)",
  "var(--code10)",
];

let toolList = document.querySelector('[data-tool-list]');


window.addEventListener('load',()=>{
  document.getElementById('noise').className = 'tex-noise';
  addToolCard(TOOL_INFO);
  if(ISMOBILE || window.innerWidth <= 750){

  } else {

  }

});

window.addEventListener('resize',()=>{
  /*防抖*/
  let MOVE_TIMEOUT;
  if(MOVE_TIMEOUT){
      clearTimeout(MOVE_TIMEOUT)
  };
  MOVE_TIMEOUT = setTimeout(()=>{
    if(window.innerWidth <= 750){

    } else {

    }
  },500);
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
  //console.log(number)
}

function getUserText(node){
  let text = node.getAttribute('data-text-value');
  //console.log(text)
}

function getUserSelect(node){
  let select = node.getAttribute('data-select-value');
  //console.log(text)
}


function addToolCard(toolsObj){
  toolsObj.forEach((tools,index) => {
    
    let tool3d = document.createElement('div');
    tool3d.setAttribute('data-tool-3d','');

    let toolbox = document.createElement('div');
    toolbox.setAttribute('data-tool-box',index);
    toolbox.style.animationDelay = index + 's'

    tool3d.addEventListener('mouseleave',()=>{
      toolbox.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
    tool3d.addEventListener('mousemove',(event)=>{
      if(!ISMOBILE){
        let cardTop = toolbox.querySelector('[data-tool-card]').offsetTop
        let bound = toolbox.getBoundingClientRect();
        let x = bound.left;
        let y = bound.top;
        let w = toolbox.offsetWidth;
        let h = toolbox.offsetHeight;
        let xx = event.clientX - x;
        let yy = event.clientY - y;
        let TB = (yy - (h + cardTop)/2)/h * -20;
        let LR = (xx - w/2)/w * 30;
        toolbox.style.transform = `rotateY(${LR}deg) rotateX(${TB}deg)`;
      };
    });

    let toolicon = document.createElement('div');
    toolicon.setAttribute('data-tool-icon','');
    toolbox.appendChild(toolicon);

    let toolicard = document.createElement('div');
    toolicard.setAttribute('data-tool-card','');
    let tooltitle = document.createElement('div');
    tooltitle.setAttribute('data-tool-title','');
    
    let toolname = document.createElement('div');
    toolname.innerHTML = tools.name[0];
    toolname.setAttribute('data-en-text',tools.name[1]);
    tooltitle.appendChild(toolname);
    let tooltag = document.createElement('div');
    tooltag.setAttribute('data-tool-tag','');
    tooltag.className = 'df-cc';
    tools.keyword.forEach(item => {
      let tags = document.createElement('div');
      tags.style.setProperty('--tagsColor',randomColor[Math.floor(Math.random()*10)])
      tags.setAttribute('data-tooltags','')
      tags.setAttribute('data-en-text',item[1])
      tags.innerHTML = item[0];
      tooltag.appendChild(tags);
    });
    tooltitle.appendChild(tooltag);
    let toolmore = document.createElement('a');
    toolmore.className =  'df-cc';
    toolmore.setAttribute('data-tool-more','');
    if(tools.url){
      toolmore.setAttribute('href',tools.url);
      toolmore.setAttribute('target','_blank');
      toolmore.setAttribute('rel','noopener noreferrer');
    };
    toolmore.innerHTML = `<div data-en-text="MORE">了解更多</div>
    <div style="width:20px; height:20px; --arrow-w:2; transform:translate(2px,1px) rotate(-45deg);">
      <svg width="100%" height="100%" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.71411 11.3821H20.7141" stroke="#000" stroke-width="var(--arrow-w)" stroke-linecap="round"></path>
        <path d="M13.3421 4.38208L20.7141 11.3821L13.3421 18.3821" stroke="#000" stroke-width="var(--arrow-w)" ></path>
      </svg>
    </div>`;
    tooltitle.appendChild(toolmore);
    toolicard.appendChild(tooltitle);

    let toolabout = document.createElement('div');
    toolabout.setAttribute('data-tool-about','');
    toolabout.className = 'noscrollbar df-ffc tex-dot'
    tools.about.forEach(item => {
      let aboutli = document.createElement('li');
      aboutli.setAttribute('data-li-style','2');
      aboutli.setAttribute('data-en-text',item[1]);
      aboutli.innerHTML = item[0];
      toolabout.appendChild(aboutli);
    })
    toolicard.appendChild(toolabout);

    toolbox.appendChild(toolicard);

    tool3d.appendChild(toolbox);
    toolList.appendChild(tool3d);
  });

  //底部固定留空，防遮挡
  let bottomMust = document.createElement('div');
  bottomMust.className = 'w100 fl0'
  bottomMust.style.height = '40px';
  toolList.appendChild(bottomMust);

  //最后重置下语言
  if(ROOT.getAttribute('data-language') == 'En'){
    setLanguage(true);
    setLanguage(false);
  }
}

