/*初始数据*/
let skillSecInfo = [
  {
    id: 'inSituRasterize',
    name: ["原地栅格化","in-situ rasterize"],
  },
  {
    id: 'easeTransform',
    name: ["斜切","skew"],
    /*name: ["简单变形","ease transform"],*/
  },
  {
    id: 'uniformScale',
    name: ["等比缩放","uniform scale"],
  },
  {
    id: 'alterImageFill',
    name: ["图片填充修改","alter image fill"],
  },
  {
    id: 'clipByGrid',
    name: ["宫格裁切","clip by grid"],
  },
  {
    id: 'SplitText',
    name: ["拆分文本","split text"],
  },
  {
    id: 'MergeText',
    name: ["合并文本","merge text"],
  },
  {
    id: 'LayersLayout',
    name: ["图层&布局","layers layout"],
  },
  {
    id: 'GetPath',
    name: ["提取路径","get path"],
  },
  {
    id: 'GetEditableSVG',
    name: ["获取可编辑SVG","get editable SVG"],
  },
  {
    id: '',
    name: ["",""],
  },
  {
    id: '',
    name: ["",""],
  },
]

let toUserTips = {
  worktime: ["🔒下班时间不建议工作~ (付费解锁)","🔒You shouldn't work after work!(pay to unlock)"],
  random: [
    ["久坐伤身, 快起来走两步吧~","Get up and take a walk now~"],
    ["身心要紧, 不舒服及时休息~","Put down your work and rest in time~"],
    ["工具提效, 是为了多陪家人~","Spend more time with your family~"],
    ["支持开源, 要价值而非价格~","Support open source and design~"],
    ["久坐伤身, 快起来走两步吧~","Get up and take a walk now~"],
    ["身心要紧, 不舒服及时休息~","Put down your work and rest in time~"],
    ["工具提效, 是为了多陪家人~","Spend more time with your family~"],
    ["支持开源, 要价值而非价格~","Support open source and design~"],
  ],
};

let helpData = {
  create: [
    ["p",
    "本页功能主要用于/++ 批量创建画板、图层等 ++/",
    "This page is used for batch creation of /++ frames, layers, etc ++/"],
    ["li",
    "传入大图（长图）可创建大小均匀的切片组, 以避免压缩",
    "Upload large images (long images) will create slice groups to avoid compression"],
    ["li",
    "传入带命名、宽高等信息的表格数据则创建画板",
    "Upload table data with name, width, height, and other information, will will create frames"],
    ["li",
    "传入由本系列插件生成的兼容文件则创建图层",
    "Upload files by YN+ or other compatible file will create layers"],
    ["li",
    "图片支持格式: <br> /++ .jpg | .jpeg | .jfif | .webp | .png | .apng | .gif ++/",
    "Image file type:<br> /++ .jpg | .jpeg | .jfif | .webp | .png | .apng | .gif ++/"],
    ["li",
    "表格支持格式: <br> /++ .csv | .xls | .xlsx ++/",
    "Table file type: <br> /++ .csv | .xls | .xlsx ++/"],
    ["li",
    "兼容文件支持格式: <br>/++ .zy | .sketch | .svg | .xml | .json | .zip | .rar | .7z ++/",
    "Compatible file type: <br> /++ .zy | .sketch | .svg | .xml | .json | .zip | .rar | .7z ++/"],
    ["br","",""],
    ["p",
    "拖拽和上传文件会立即生成用以确认最终生成内容的/++ 标签/大纲 ++/",
    "Dragging or uploading files will immediately convert to /++ tags/catalogue ++/"],
    ["li",
    "拖拽的文件需全部是为图片类、全部是表格类或全部是兼容文件, /++ 不能混杂类型 ++/",
    "Drag and drop files must be all images, tables, or compatible files. /++ Mixed file types are not allowed ++/"],
    ["li",
    "上传文件设置了具体格式, 不支持的格式将无法点选",
    "The three upload buttons restrict the file format, and unsupported formats cannot be uploaded"],
    ["br","",""],
    ["p",
    "通过文本框输入数据, 需要点击第一个按钮来生成标签/大纲",
    "If input data through the textarea, click the first button to convert the data to tags/catalogue"],
    ["li",
    "输入表格数据无需包含表头、单位, /++ 可双击文本框查看示例 ++/",
    "Does not need to include a table header or unit./++ May double-click the textarea to fill an example <span>"],
    ["li",
    "可以选中文件里的画板或图层, 然后点击第二个按钮获取命名和宽高数据",
    "Select frames or layers in the file, and then click the second button to obtain theirs name, width and height data"],
    ["li",
    "如果需要制作更复杂的模板, 点击第三个按钮前往资源助手",
    "If you need to create more complex templates, click the third button to go to the /++ YN+ ListEase ++/ online"],
    ["br","",""],
    ["p",
    "表格数据默认按/++ 命名、宽高、目标文件大小、目标文件格式、补充信息 ++/的顺序读取列, 如需修改规则可点击第四个按钮展开高级设置",
    "Table data is read in the order of /++ name, width, height, target file size, target file format, and supplementary information ++/ by default. To modify the rules, click the fourth button to expand advanced settings"],
    ["li",
    "修改列顺序规则时需注意,必须包含命名和宽高"
    ,"When modifying column order rules, it is important to include /++ name, width and height ++/"],
    ["li",
    "画板名默认带w×h后缀, 如/++ kv 1920×1080 ++/, 可选择其他预设或自行定义",
    "The frame defaults to a suffix with width and height,such as /++ kv 1920 × 1080 ++/, you can selected a presets or input oneself"],
  ],
  sheet: [
    ["p",
    "使用本功能需要掌握【组件】和【组件属性】等基本知识",
    ""],
    ["li",
    "组件使元素能保持一致的样式, 并通过实例的/++ 继承性 ++/实现批量控制样式",
    ""],
    ["li",
    "组件属性是将需要修改的样式以表单的形式放在属性栏最上方, 方便/++ 参数化管理组件 ++/",
    ""],
    ["p",
    "表格由至少两个组件: /++ xxx@th(表头) | xxx@td(表数据) ++/, 嵌套自动布局而成, 请注意, 这里采用先按列再按行的布局, 与常见表格逻辑相反, 但更适合设计领域",
    "The table should build with auto-layout from least 2 components: /++ xxx@th(table-header) | xxx@td(table-data) ++/. Please note that the layout here is based on columns first and then rows, which is opposite to the common table logic but more suitable for the design field"],
    ["li",
    "首次使用该功能, 建议直接点击按钮生成一个表格示例, 以便理解其中的规范要求",
    ""],
    ["li",
    "默认生成3*3的表格, 也可以输入具体行列来生成, 但随后填充数据时会自动调节行列",
    ""],
    ["li",
    "默认先生成表头和表格组件, 如选中了命名为xxx@th和xxx@td的组件, 则会直接生成表格",
    ""],
    ["li",
    "组件必须包含用多个图层实现的描边和填充, 并绑定/++ 布尔类型组件属性: --bod-l(左描边) | --bod-r(右描边) | --bod-t(上描边) | --bod-b(下描边) | --fills(填充) ++/",
    ""],
    ["li",
    "组件会先包裹在一个列中xxx@column, xxx@th会始终在第一个, 然后多个列会包裹在一个表中xxx@table",
    ""],
    ["li",
    "组件必须包含一个文字图层, 并绑定/++ 字符类型组件属性: --data(数值/文本) ++/",
    ""],
    ["br","",""],
    ["p",
    "因为【组件属性】功能的强大, 我们会有很多办法实现批量替换数据, 不仅限于表格, 因此【表格】可视为【批量替换数据】的一种特殊情况",
    ""],
    ["li",
    "使用【文本数据映射】时, 仅检索xxx@table下,每列xxx@column的xxx@th和xxx@td的--data属性进行修改",
    ""],
    ["li",
    "如需要更复杂的组件属性组合, 需使用【组件属性映射】功能来完成数据映射",
    ""],
    ["li",
    "【文本数据映射】不需要表头作为查找组件属性的依据, 直接按行列对应关系填充数据, 【组件属性映射】则需要将对应组件属性名作为表头, 按图层顺序修改对应的值",
    ""],
    ["li",
    "【组件属性映射】对变体的选项值也同样生效,需设置唯一的变体属性名(默认是Property) 需避免存在同名的情况, 变体集内的组件命名无影响",
    ""],
    ["br","",""],
    ["p",
    "通过将xxx@th和xxx@td组件宽度设置为充满, 我们可以轻松地用xxx@column控制列宽,也可以直接在图层里连选列内的xxx@td, 而选中行的方式可能比较复杂",
    ""],
    ["li",
    "【选中单行】功能可以查找相邻父级同位置的图层, 请确保图层结构的一致性",
    ""],
    ["li",
    "【选中多行】功能可以选中多个单行",
    ""],
    ["li",
    "【区域选中】功能类似框选, 会在选中两个xxx@td形成的框内所有的xxx@td ",
    ""],
    ["li",
    "【连续选中】功能可类似文本段落的连选, 会从第一个xxx@td开始逐行选中, 到第二个xxx@td结束",
    ""],
    ["li",
    "选中后插件还是聚焦状态，此时无法对画布内容进行操作，可以用鼠标中建点击画布区域以重新聚焦到画布",
    ""],
    ["br","",""],
    ["p",
    "为弥补组件属性的局限性问题, 可使用【标签属性映射】来完成 /++ #xxx.fill(填充色值) | #xxx.stroke(描边色值) | #xxx.fillStyle(填充样式名) | #xxx.strokeStyle(描边样式名)| #xxx.visible(可见性true/false) | #xxx.opacity(透明度0~1) | #xxx.fontSize(字号) ++/ 的参数化控制",
    ""],
    ["li",
    "选中的对象将按图层顺序对应每一行的数值,修改时会先判断对象是否带标签, 然后再遍历子对象, 对象/子对象本身可以包含多个标签, 可以存在不同的标签组合，/++ 注意标签与命名或其他标签之间要用空格隔开 ++/, 这对实现更复杂的样式变化很有用 ",
    ""],
    ["li",
    "",
    ""],
    ["li",
    "",
    ""],
    ["br","",""],
    ["p",
    "",
    ""],
    ["li",
    "",
    ""],
    ["br","",""],
  ]
};

/*静态数据或对象*/
const UI_MINI = [200,460];
const UI = [300,660];
const UI_BIG = [620,660];
const sideMix = document.querySelector('[data-side-mix]');
const sideMask = document.querySelector('[data-side-mask]');
const btnMore = document.getElementById('btn-more');
const btnResize = document.querySelector('[data-resize-window]');
const btnBig = document.getElementById('big');
const TV_text = document.querySelector('[data-tv-text]');
const dropUp = document.querySelector('[data-drop="upload"]');
const fileInfo = document.querySelector('[data-file-info]');
const btnHelp = document.querySelectorAll('[data-help]');
const dailog = document.querySelector('[data-dailog]');
const dailogBox = document.querySelector('[data-dailog-box]');
const skillTypeBox = document.querySelector('[data-skilltype-box]');
const skillAllBox = document.querySelector('[data-skills-box]');
const skillSecNode = document.querySelectorAll('[data-skill-sec]');
const skillStar = document.querySelectorAll('[data-skill-star]');
const skillAllModel = document.querySelectorAll('[data-skillmodule]');
const skillStarModel = document.querySelector('[data-skillmodule="Useful & Starts"]');
const selectInfoBox = document.querySelectorAll('[data-selects-node]');
const createTagsBox = document.querySelector('[data-create-tags]');
const cataloguesBox = document.querySelector('[data-create-catalogues]');
const skillBtnMain = document.querySelectorAll('[data-btn="skill-main"]');
const clearTags = document.querySelector('[data-create-tags-box]').querySelector('btn-close').parentNode;
const convertTags = document.getElementById('upload-set-1');
const getTableText = document.getElementById('upload-set-2');
const chkTablestyle = document.getElementById('chk-tablestyle');
const chkSelectcomp = document.getElementById('chk-selectcomp');
const createAnyBtn = document.querySelector('[data-create-any]')
const createTableBtn = document.querySelector('[data-create-table]');
const tableStyleSet = document.querySelector('[data-tablestyle-set]');

let skillModel = [];
let skilltypeNameNode = skillTypeBox.querySelectorAll('[data-skilltype-name]');
skilltypeNameNode.forEach(item => {
  let name1 = item.getAttribute('data-zh-text');
  name1 = name1 ? name1 : item.textContent.trim();
  let name2 = item.getAttribute('data-en-text');
  skillModel.push([name1,name2]);
});
let isSkillScroll = true;
let tableStyle = [
  {th:[0,0,0,0,1],td:[0,0,0,0,'rowSpace']},//横间格区分色
  {th:[0,0,0,0,'columnSpace'],td:[0,0,0,0,'columnSpace']},//竖间格区分色
  {th:[0,0,0,0,1],td:[0,0,0,0,0]},//无描边
  {th:[0,0,0,0,1],td:[1,0,1,0,0]},//仅横线
  {th:[0,0,0,0,1],td:[0,1,0,1,0]},//仅竖线
  {th:[0,0,0,0,1],td:[1,1,1,1,0]},//全描边
  {th:[0,0,0,0,0],td:[0,0,0,0,0]},//无描边（表头无区分色
  {th:[1,0,1,0,0],td:[1,0,1,0,0]},//仅横线（表头无区分色
  {th:[0,1,0,1,0],td:[0,1,0,1,0]},//仅竖线（表头无区分色
  {th:[1,1,1,1,0],td:[1,1,1,1,0]},//全描边（表头无区分色
];

/*表单绑定*/
const userImg = document.getElementById('input-user-img');
const userTable = document.getElementById('input-user-table');
const userZy = document.getElementById('input-user-zy');
const userTableTitle = document.getElementById('input-user-table-title');
const frameName =  document.getElementById('input-framename');
const userText = document.getElementById('upload-textarea');

const pixelScale = document.getElementById('input-pixelScale');
let scaleSetX = getElementMix('data-scaleset-x').querySelector('[data-input="value"]');
let scaleSetY = getElementMix('data-scaleset-y').querySelector('[data-input="value"]');
let skewSetX = getElementMix('data-skewset-x').querySelector('[data-input="value"]');
let skewSetY = getElementMix('data-skewset-y').querySelector('[data-input="value"]');

/*动态数据或对象*/
let CreateImageInfo = [];
let CreateTableInfo = [];
let SelectNodeInfo = [];

let isResize = false;
let reStartW,reStartH,reStartX,reStartY;
let tableTitleMust = userTableTitle.getAttribute('placeholder').split(',');
let imageType = document.getElementById('input-user-img').getAttribute('accept').split(',').map(item => item.replace('.',''));
let tableType = document.getElementById('input-user-table').getAttribute('accept').split(',').map(item => item.replace('.',''));
let zyType = document.getElementById('input-user-zy').getAttribute('accept');
let frameNmaeSelect = [];
frameName.nextElementSibling.querySelectorAll('[data-option="option"]')
.forEach(item => {
  frameNmaeSelect.push(item.getAttribute('data-option-value'));
});

window.addEventListener('load',()=>{
  /*clear*/
  viewPage('more tools')
  /**/;
  if(window.innerWidth < 300){
    TV_MOVE = true;
  } else {
    TV_MOVE = false;
  };
  reTV();
  loadFont();
  reSkillNum();
  addSkillTitle();
  addToUserTips();
  setInterval(() => {
    addToUserTips();
  }, 12000);
});

window.addEventListener('resize',()=>{
/*防抖*/
let MOVE_TIMEOUT;
if(MOVE_TIMEOUT){
    clearTimeout(MOVE_TIMEOUT)
};
MOVE_TIMEOUT = setTimeout(()=>{
  if(window.innerWidth < 300){
    TV_MOVE = true;
  } else {
    TV_MOVE = false;
  }
},500);
});


/* ---界面初始化--- */

/**
 * 重载字体样式
 * @param {node | null} area -可传入重载范围, 可以是元素本身, 或id/自定义属性等唯一值；
 */
function loadFont(area){
  let loadFontAfter = [
    "data-en-text",
    "data-en-input",
    "data-en-placeholder",
    "data-turnto",
    "data-back",
  ];
  let areas;
  if(area){
    areas = getElementMix(area);
  } else {
    areas = document;
  };
  setTimeout(()=>{
    loadFontAfter.forEach(key => {
      let nodes = areas.querySelectorAll(`[${key}]`);
      nodes.forEach(item => {
        item.style.fontFamily = '"Shanggu Sans", Arial, Helvetica, sans-serif';
      })
    });
  },100);
};
//动态变化公屏文案
function addToUserTips(){
  let languge = ROOT.getAttribute('data-language');
  let num = languge == 'Zh' ? 0 : 1;
  let languge2 = languge == 'Zh' ? 'en' : 'zh';
  let random = toUserTips.random[Math.floor(Math.random()*toUserTips.random.length)]
  TV_text.textContent = random[num]
  TV_text.setAttribute('data-'+ languge2 +'-text',random[1 - num]);
  TV_text.setAttribute('data-'+ languge.toLowerCase() +'-text',random[num]);
  let textW
  if(num){
    textW = random[num].length * -1 - 4 + 'ch';//英文1ch
  }else{
    textW = random[num].length * -2 - 4 + 'ch';//中文2ch
  }
  TV_text.parentNode.style.setProperty('--tv-w',textW)

};
//添加带tips的功能标题
function addSkillTitle(){
  skillSecNode.forEach(secnode =>{
    let secid = secnode.getAttribute('data-skill-sec');
    if(secid){
      let info = skillSecInfo.find(item => item.id == secid);
      let node = document.createElement('div');
      node.setAttribute('data-skill-title','');
      node.className = 'df-lc';
      let layerindex = Array.from(secnode.parentNode.children).findIndex(item => item == secnode);
      let num = document.createElement('div');
      num.textContent = (layerindex + 1) + '.';
      node.appendChild(num);
      num.setAttribute('style','opacity: 0.3;');
      num.setAttribute('data-skill-index','');
      let name = document.createElement('div');
      let languge = ROOT.getAttribute('data-language');
      name.setAttribute('data-zh-text',info.name[0]);
      name.setAttribute('data-en-text',info.name[1]);
      name.setAttribute('data-skill-sec-name','');
      let text = languge == 'Zh' ? info.name[0] : info.name[1];
      name.innerHTML = text;
      node.appendChild(name);
      secnode.prepend(node);
      //重置文字样式
      loadFont(secnode.parentNode);
    };
  });
};
//处理选中图层的信息
function reSelectInfo(info){
  SelectNodeInfo = info;
  if(info[0][0] !== null){
    ROOT.setAttribute('data-selects','true');
    selectInfoBox.forEach(item => {
      let main = item.querySelector('[data-selects-info="main"]');
      let sec = item.querySelector('[data-selects-info="sec"]');
      let num = item.querySelector('[data-selects-info="num"]');
      main.textContent = info[0][0];
      sec.textContent = info[1] ? info[1][0] : '';
      num.textContent = info.length;
    });
  } else{
    ROOT.setAttribute('data-selects','false')
  };  
  if(info.length == 1){
    //console.log(info[0][3])
    let transform = info[0][3];
    skewSetX.value = transform[0];
    skewSetY.value = transform[1];
    //scaleSetX.value = transform[2];
    //scaleSetY.value = transform[3];
    const inputEvent = new Event('input', { bubbles: true });
    skewSetX.dispatchEvent(inputEvent);
    skewSetY.dispatchEvent(inputEvent);
    //scaleSetX.dispatchEvent(inputEvent);
    //scaleSetY.dispatchEvent(inputEvent);
  };
  if(info.length > 1){
    ROOT.setAttribute('data-selects-more','true');
  }else{
    ROOT.setAttribute('data-selects-more','false');
  };
};
//按用户偏好修改界面大小
function reRootSize(info){
  if(info[0] > UI[0]){
    btnBig.checked = true;
  } else {
    btnBig.checked = false;
  };
};


/* ---界面交互--- */

let tool = new TOOL_JS();
//侧边栏展开
btnMore.addEventListener('change',(event)=>{
  if(event.target.checked){
    sideMix.style.display = 'flex';
    sideMask.style.display = 'block';
    sideMix.style.animation = 'sideUp 0.3s ease-out';
    sideMask.style.animation = 'loadOp 0.3s ';
  } else {
    sideMix.style.animation = 'sideOver 0.3s ease-out';
    sideMask.style.animation = 'overOp 0.3s ease-out';
    setTimeout(()=>{ 
      sideMix.style.display = 'none'
      sideMask.style.display = 'none'
    },280)
  }
});
//侧边栏关闭
document.addEventListener('click',(event)=>{
  if(!sideMix.contains(event.target) && sideMask.style.display !== 'none' && sideMix.style.display !== 'none' && btnMore.checked == true ){
    btnMore.checked = false;
    let inputEvent = new Event('change',{bubbles:true});
    btnMore.dispatchEvent(inputEvent);
  }
});
//缩放窗口
btnResize.addEventListener('mousedown',(event)=>{
  isResize = true;
  let reNodeStyle = document.defaultView.getComputedStyle(ROOT);
  reStartW = parseInt(reNodeStyle.width,10);
  reStartH = parseInt(reNodeStyle.height,10);
  reStartX = event.clientX;
  reStartY = event.clientY;
  //console.log(reStartW,reStartH)
  document.addEventListener('mousemove',(e)=>{
    if(isResize){
      let w = reStartW + e.clientX - reStartX;
      let h = reStartH + e.clientY - reStartY;
      w = Math.max(w,UI_MINI[0]);
      h = Math.max(h,UI_MINI[1]);
      toolMessage([[w,h],'resize'],PLUGINAPP);
      /*//
      console.log(w,h)
      ROOT.style.width = w;
      ROOT.style.height = h;
      //*/
      
      /*防抖*/
      let MOVE_TIMEOUT;
      if(MOVE_TIMEOUT){
          clearTimeout(MOVE_TIMEOUT)
      };
      MOVE_TIMEOUT = setTimeout(()=>{
        storageMix.set('userResize',[w,h]);
        if(w > UI[0]){
          btnBig.checked = true;
        } else {
          btnBig.checked = false;
        }
      },500);
    }
  });
  document.addEventListener('mouseup',()=>{
    isResize = false;
  })
});
//打印所选对象
document.getElementById('bottom').addEventListener('dblclick',()=>{
  toolMessage(['','getnode'],PLUGINAPP)
});
//最大化窗口
btnBig.addEventListener('change',()=>{
  let w = window.innerWidth;
  let h = window.innerHeight;
  if(btnBig.checked){
    if(w < UI[0] || h < UI[1]){
      toolMessage([false,'big'],PLUGINAPP);
      btnBig.checked = false;
    }else{
      toolMessage([true,'big'],PLUGINAPP);
    }
  }else{
    toolMessage([false,'big'],PLUGINAPP);
  }
});
//点击上传
userImg.addEventListener('change',(e)=>{
  let files = Array.from(userImg.files);
  reFileInfo(files);
  addImageTags(files)
});
userTable.addEventListener('change',(e)=>{
  let files = Array.from(userTable.files);
  reFileInfo(files);
  addTableText(files)
});
userZy.addEventListener('change',(e)=>{
  let files = Array.from(userZy.files);
  reFileInfo(files);
  addZyCatalogue(files)
});
//拖拽上传
let dragAreaInfo;
dropUp.addEventListener('dragover',(e)=>{
  dragAreaInfo = dropUp.getBoundingClientRect();
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  dropUp.style.filter = 'drop-shadow(0 0 4px let(--mainColor))';
  dropUp.style.setProperty('--drop-df','collapse');
});
dropUp.addEventListener('dragleave',(e)=>{
  let x = e.clientX;
  let y = e.clientY;
  let areaX = dragAreaInfo.x;
  let areaY = dragAreaInfo.y;
  let areaW = dragAreaInfo.width;
  let areaH = dragAreaInfo.height;
  if( x <= areaX || x >= areaX + areaW || y <= areaY || y >= areaY + areaH){
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dropUp.style.filter = '';
    dropUp.style.setProperty('--drop-df','visible');
  }
});
dropUp.addEventListener('drop',(e)=>{
  e.stopPropagation();
  e.preventDefault();
  dropUp.style.filter = '';
  dropUp.style.setProperty('--drop-df','visible');
  let files = Array.from(e.dataTransfer.files);
  let filesTypes = [...new Set(files.map(item => item.name.split('.')[item.name.split('.').length - 1].toLowerCase()))];
  let sameType = null;
  
  if(filesTypes.filter(item => imageType.includes(item)).length == filesTypes.length){
    sameType = 'image';
  };
  if(filesTypes.filter(item => tableType.includes(item)).length == filesTypes.length){
    sameType = 'table';
  };
  if(filesTypes.filter(item => zyType.includes(item)).length == filesTypes.length){
    sameType = 'zy';
  };
  if(sameType){
    files = files.sort((a, b) => b.size - a.size);
    reFileInfo(files);
    switch (sameType){
      case 'image': addImageTags(files,true);break
      case 'table': addTableText(files,true);break
      case 'zy': addZyCatalogue(files,true);break
    }
  } else {
    tipsAll(['只能上传同类型文件','The file type must meet the requirements'],3000)
  }
  
});
//创建内容
createAnyBtn.addEventListener('click',()=>{
  let type = createTagsBox.parentNode.getAttribute('data-create-tags-box');
  switch (type){
    case 'image':
      let images = getFinalInfo(CreateImageInfo);
      tipsAll(['读取中, 请耐心等待','Reading, please wait a moment'],images.length * 800);
      setTimeout(()=>{
        toolMessage([images,'createImage'],PLUGINAPP);
      },100);
    ;break
    case 'table':
      //console.log(CreateTableInfo)
      let tables = getFinalInfo(CreateTableInfo,true);
      tipsAll(['读取中, 请耐心等待','Reading, please wait a moment'],CreateTableInfo.length * 100);
      setTimeout(()=>{
        toolMessage([tables,'createFrame'],PLUGINAPP);
      },100);
    ;break
    case 'zy': ;break
  };
  //移除未勾选的数据
  function getFinalInfo(info,isname){
    let finalCreate = [...info]
    let nocreateTag = createTagsBox.querySelectorAll('[data-create-final="false"]');
    nocreateTag.forEach(item => {
      let id = item.querySelector('input').id;
      let idnum = id.split('_')[id.split('_').length - 1];
      finalCreate.splice(idnum,1);
    });
    if(isname){
      let createTag = createTagsBox.querySelectorAll('[data-create-final="true"]');
      createTag.forEach((item,index) => {
        let name = item.querySelector('[data-create-info="name"]').textContent.trim()
        finalCreate[index].name = name;
      });
    };
    return finalCreate;
  };
});
//功能列表滚动绑定tab
skillAllModel.forEach(item =>{
  item.addEventListener('mouseenter',() => {
    isSkillScroll = false;
    let modelid = item.getAttribute('data-skillmodule');
    let index = skillModel.findIndex(skill => skill.includes(modelid));
    let tab = skillTypeBox.querySelector(`[data-radio-data="${(index + 1)}"]`);
    tab.click();
  });
});
skillTypeBox.addEventListener('mouseenter',() => {
  isSkillScroll = true;
});

//加载图片
function loadImage(file){
  return new Promise((resolve,reject) => {
    const reader = new FileReader()
    reader.onload = (e)=>{
      const image = new Image();
      image.onload = ()=> resolve(image);
      image.onerror = (error)=> reject(error);
      image.src = e.target.result;
    };
    reader.onerror = (error)=>{reject(error)};
    reader.readAsDataURL(file);
  });
};
//加载表格
function loadTable(file){
  return new Promise((resolve,reject) => {
    const reader = new FileReader();
    let type = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
     if(type == 'xls' || type == 'xlsx'){
      reader.onload = (e)=>{
        let zip = new JSZip();
        zip.loadAsync(reader.result)
        .then((zipContents)=>{
          zip.file('xl/worksheets/sheet1.xml').async('string')
          .then((sheetContent)=>{
            zip.file('xl/sharedStrings.xml').async('string')
            .then((strContent)=>{
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(sheetContent,'text/xml');
              const rows = getTag(xmlDoc,'row');
              const strDoc = parser.parseFromString(strContent,'text/xml');
              const sis = getTag(strDoc,'si');
              let sharedStrings = [];
              for( let i = 0; i < sis.length; i++){
                let t = getTag(sis[i],'t');
                sharedStrings.push(t[0].textContent.trim());
              };
              let XY = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
              let rowTitle = getTag(rows[0],'c')
              let maxlength = XY.indexOf(rowTitle[rowTitle.length - 1].getAttribute('r').replace(/[0-9]/g,''))*1 + 1;
              let titles =  getRow(0,maxlength) + '\n';
              let values = '';
              for(let i = 1; i < rows.length; i++){
                let value = getRow(i,maxlength);
                if(i == rows.length - 1){
                  values += value;
                } else {
                  values += value + '\n';
                };
              };
              resolve(titles + values.trim());
              //console.log(titles + values)
              function getTag(xml,name){
                return xml.getElementsByTagName(name);
              };
              function getRow(index,length){
                let text = '';
                for( let i = 0; i < length; i++){
                  let v;
                  let c = rows[index].querySelector(`[r="${XY[i] + (index + 1)}"]`);
                  if(c){
                    v = getTag(c,'v')[0].textContent;
                    if(c.getAttribute('t') == 's'){
                      v = sharedStrings[v*1];
                    };
                  }else{
                    v = ''
                  }    
                  if(i == length - 1){
                    text += v;
                  } else {
                    text += v + '\t';
                  }
                };
                return text;
              };
            }); 
          });
        });
      };
      reader.onerror = (error)=>{reject(error)};
      reader.readAsArrayBuffer(file);
     };
     if(type == 'csv'){
      reader.onload = (e)=>{
        let csvData = reader.result;
        let values = csvData.replace(/\r/g,'').replace(/\,/g,'\t');
        //console.log(values) 
        resolve(values.trim())
      };
      reader.onerror = (error)=>{reject(error)};
      reader.readAsText(file);
     };
  });
}

//添加标签前处理
async function addImageTags(files,isCreate){
  clearTags.click();
  let sizes = files.map(item => item.size);
  let sizeAll = sizes.reduce((a,b) => a + b, 0);
  sizeAll = sizeAll*1 == NaN ? files.length : sizeAll; //大图至少算1M大小
  tipsAll(['读取中, 请耐心等待','Reading, please wait a moment'],sizeAll/1024/1024 * 100); //加载1M需要100毫秒
  for(let i = 0; i < files.length; i++){
    let file = files[i];
    let name = file.name.split('.').filter(item => !imageType.includes(item.toLowerCase())).join('_');
    try{
      let image = await loadImage(file);
      let cuts = await tool.CUT_IMAGE(image);
      CreateImageInfo.push({n:name,w:image.width,h:image.height,cuts:cuts});
      if(i == files.length - 1){
        addTag('image',CreateImageInfo);
        if(isCreate){//仅图片类型是在拖拽上传时立即生成
          toolMessage([CreateImageInfo,'createImage'],PLUGINAPP);
        }
      }
    } catch (error) {
      console.log(error)
    }
    
  };
}
async function addTableText(files,isTags){
  clearTags.click();
  userText.focus();
  userText.value = '';
  let tableText;
  if(typeof(files) == 'string'){
    tableText = files;
  } else {
    tableText = await loadTable(files[0])
  }
  userText.value = tableText;
  let tableArray = tableTextToArray(tableText);
  let tableObj = tableArrayToObj(tableArray);
  CreateTableInfo = tableObj;
  //console.log(tableArray,tableTextToArray(tableText,true),tableObj)
  if(isTags){
    document.getElementById('upload-set-1').click()
  }
}
function addTableTags(){
  addTag('table',CreateTableInfo);
};
function addZyCatalogue(files,isCreate){
  
};
//添加标签-总
function addTag(type,info){
  switch (type){
    case 'image':
      info.forEach((img,index) => {
        let tag = document.createElement('div');
        createTagsBox.parentNode.setAttribute('data-create-tags-box','image');
        addTagMain(tag,index);
        let name = document.createElement('div');
        name.setAttribute('data-create-info','name');
        name.innerHTML = tool.TextMaxLength(img.n,16,'...');
        tag.appendChild(name);
        if(img.cuts.length > 1){
          let span = document.createElement('span');
          span.setAttribute('style','cursor: var(--pointer,pointer)');
          let text = ROOT.getAttribute('data-language') == 'Zh' ? "切片" : "Slice"
          span.innerHTML = `▶ 
          <span style="color: var(--themeColor)">${img.cuts.length}</span>
          <span data-en-text="Slice" data-zh-text="切片">${text}</span>
          ` ;
          tag.appendChild(span);
          span.addEventListener('click',()=>{
            dailogBox.innerHTML = '';
            dailog.style.display = 'flex';
            let cutinfo = document.createElement('div');
            cutinfo.className = 'w100 df-ffc';
            cutinfo.setAttribute('style','gap: 4px');
            img.cuts.forEach((cut,num) => { 
              let blob = new Blob([cut.img],{ type: 'image/png' });
              let cutone = document.createElement('span');
              cutone.innerHTML = `▶ 
              <span data-en-text="Slice" data-zh-text="切片">${text}</span>
              <span> &nbsp;${(num + 1)}</span>
              ` ;
              cutinfo.appendChild(cutone);
              let cutimgbox = document.createElement('a');
              cutimgbox.className = 'w100 df-cc'
              cutimgbox.href = URL.createObjectURL(blob);
              cutimgbox.setAttribute('download', tool.TextMaxLength(img.n,16,'...') + '_' + text + (num + 1)  + '.png')
              let cutimg = document.createElement('img');
              cutimg.setAttribute('style','width: 80%;');
              cutimg.src = URL.createObjectURL(blob);
              cutimgbox.appendChild(cutimg);
              cutinfo.appendChild(cutimgbox);
            });
            dailogBox.appendChild(cutinfo);
          });
        }
        createTagsBox.appendChild(tag);
      });
    break
    case 'table':
      let nameRegex = frameName.value;
      info.forEach((list,index) => {
        let tag = document.createElement('div');
        createTagsBox.parentNode.setAttribute('data-create-tags-box','table');
        addTagMain(tag,index);
        let name = document.createElement('div');
        name.setAttribute('data-create-info','name');
        let end = nameRegex
        .replace(/w/g,list.w)
        .replace(/h/g,list.h)

        if(list.type){
          end = end.replace(/type/g,list.type)
        }else{
          end = end.replace(/type/g,'')
        }
        if(list.add){
          end = end.replace(/add/g,list.add)
        }else{
          end = end.replace(/add/g,'')
        }
        if(list.s){
          end = end.replace(/s/g,list.s + 'k');
        } else {
          end = end.replace(/s/g,'');
        };
        name.innerHTML = `${list.name}${end}`.trim();
        if(nameRegex == 'none'){
          name.innerHTML = list.name;
        };
        tag.appendChild(name);
        createTagsBox.appendChild(tag);
      });
    break
    case 'zy':
      info.forEach(layer => {
        
      });
    break
  };
  //所有tag都支持二次确认, 以得到最终要生成的内容
  function addTagMain(tag,index){
    tag.setAttribute('data-create-tag','');
    tag.setAttribute('data-create-final','true');
    tag.className = 'df-lc';

    let checkbox = document.createElement('div');
    checkbox.setAttribute('style','width: 14px; height: 14px;');
    let checkid = 'cr_chk_' + index;
    let checkinput = document.createElement('input');
    checkinput.id = checkid;
    checkinput.type = 'checkbox';
    checkinput.setAttribute('checked','true');
    let checklabel = document.createElement('label');
    checklabel.setAttribute('for',checkid);
    checklabel.className = 'check'
    checklabel.innerHTML = '<btn-check></btn-check>'
    checkbox.appendChild(checkinput);
    checkbox.appendChild(checklabel);
    tag.appendChild(checkbox);
    let tagNum = document.createElement('span');
    tagNum.setAttribute('data-tags-index','')
    tagNum.innerHTML += index + 1 + '.';
    tag.appendChild(tagNum);
    checkinput.addEventListener('change',()=>{
      if(checkinput.checked){
        tag.setAttribute('data-check-checked','true');
        tag.setAttribute('data-create-final','true');
      }else{
        tag.setAttribute('data-check-checked','false');
        tag.setAttribute('data-create-final','false');
      };
    });
    
  };
  //重置文字样式
  loadFont(createTagsBox.parentNode);
};
//制表文案转数组, 兼容反转行列
function tableTextToArray(tableText,isColumn){
  let lines = tableText.split('\n');
  lines.forEach((item,index) => {
    lines[index] = item.split('\t');
  });
  let columns = lines[0].map((_, i) => lines.map(row => row[i]));
  if(isColumn){
    return columns;
  }else{
    return lines;
  }
};
//制表数组转对象组
function tableArrayToObj(tableArray){
  let keys = tableArray[0];
  let objs = [];
  for(let i = 1; i < tableArray.length; i++){
    let obj = {};
    tableArray[i].forEach((item,index) => {
      obj[keys[index]] = isNaN(item * 1) ? item : item * 1;;
    });
    objs.push(obj);
  };
  return objs;
};
//制表数组转制表文案
function tableArrayToText(Array){
  let values = '';
  for(let i = 0; i < Array.length; i++){
    let text = Array[i].join('\t');
    if(i == Array.length - 1){
      values += text;
    }else{
      values += text + '\n';
    };
  };
  return values;
};
//对象组转制表文案
function tableObjToText(obj){
  let header = Object.keys(obj[0]).join('\t') + '\n';
  let values = '';
  for(let i = 0; i < obj.length; i++){
    let text = Object.values(obj[i]).join('\t');
    if(i == obj.length - 1){
      values += text;
    }else{
      values += text + '\n';
    };
  };
  return header + values;
};
//移除标签
clearTags.addEventListener('click',()=>{
  CreateImageInfo = [];
  CreateTableInfo = [];
  createTagsBox.innerHTML = '';
  cataloguesBox.innerHTML = '';
});
//文本框内容转标签/大纲
convertTags.addEventListener('click',()=>{
  clearTags.click();
  let firstline = userText.value.trim().split('\n')[0];
  let isTableText = !['name','w','h'].some(item => !firstline.includes(item));
  if(isTableText){
    let tableArray = tableTextToArray(userText.value.trim());
    let tableObj = tableArrayToObj(tableArray);
    CreateTableInfo = tableObj;
    if(CreateTableInfo.some(item => item.add) && !frameName.value.includes('add') && userTableTitle.value.includes('add')){
      document.getElementById('upload-moreset').checked = true;
      document.querySelector('[for="upload-moreset"]').click();
      document.querySelector('[data-option-value="add w×h s"]').click();
    } else if(CreateTableInfo.some(item => item.s) && !frameName.value.includes('s') && userTableTitle.value.includes('s')){
      document.getElementById('upload-moreset').checked = true;
      document.querySelector('[for="upload-moreset"]').click();
      document.querySelector('[data-option-value=" w×h s"]').click();
    };
    setTimeout(()=>{
      addTableTags();
    },100);
  }else if(firstline.includes('svg')){

  }
  else{
    tipsAll(['数据格式错误, 请检查~','Data format error, please check~'],3000)
  };
});
//从所选图层获取数据
getTableText.addEventListener('click',()=>{
  toolMessage(['','getTableBySelects'],PLUGINAPP);
});
//显示所上传文件名
function reFileInfo(files){
  let languge = ROOT.getAttribute('data-language');
  let fileLength = '<span style="color: let(--code2)">' + files.length + '</span>'
  let fileName1 = files.length == 1 ? files[0].name : files[0].name + ' ...等 ' + fileLength + '  个文件';
  let fileName2 = files.length == 1 ? files[0].name : files[0].name + ' ... ' + fileLength + ' files';
  fileName1 = '📁 ' + tool.TextMaxLength(fileName1,20,'..');
  fileName2 = '📁 ' + tool.TextMaxLength(fileName2,20,'..');
  fileInfo.setAttribute('data-zh-text',fileName1);
  fileInfo.setAttribute('data-en-text',fileName2);
  if(languge == "Zh"){
    fileInfo.innerHTML = fileName1;
  }else{
    fileInfo.innerHTML = fileName2;
  };
};
//设置画板命名格式
frameName.addEventListener('input',()=>{
  if(frameNmaeSelect.includes(frameName.value)){
    frameName.nextElementSibling.querySelector(`[data-option-value="${frameName.value}"]`).click();
  }else{
    frameName.nextElementSibling.querySelector(`[data-select-input]`).value = '';
  };
});
//设置画板数据表头规则
userTableTitle.addEventListener('change',()=>{
  userTableTitle.value = reTableTitle(userTableTitle.value);
});
function reTableTitle(text){
  if(text == ''){
    return '';
  }
  //首先必须是逗号隔开的单词形式
  let regex = /^[a-z]+$/;
  let texts = text.split(',');
  if(texts.some(item => !tableTitleMust.includes(item))){
    tipsAll(['请用指定单词, 并用逗号隔开','Must use example words and separated by commas'],3000);
    texts = texts.filter(item => tableTitleMust.includes(item));
    if(texts.length == 0){
      return 'name,w,h'
    } else {
      if(texts.includes('name') && texts.includes('w') && texts.includes('h')){
        return [...new Set(texts)].join(',');
      }else{
        texts = [...new Set(texts)];
        if(!texts.includes('name')){
          texts.push('name')
        };
        if(!texts.includes('w')){
          texts.push('w')
        };
        if(!texts.includes('h')){
          texts.push('h')
        }
        return texts.join(',');
      }
    }
  }else{ 
    if(texts.includes('name') && texts.includes('w') && texts.includes('h')){
      if(texts.length == [...new Set(texts)].length){
        return text;
      }else{
        tipsAll(['单词重复','The word is repeated'],3000);
        return [...new Set(texts)].join(',');
      }
    }else{
      tipsAll(['必须包含name、w、h','Must include name, w, h'],3000);
      texts = [...new Set(texts)];
      if(!texts.includes('name')){
        texts.push('name')
      };
      if(!texts.includes('w')){
        texts.push('w')
      };
      if(!texts.includes('h')){
        texts.push('h')
      }
      return texts.join(',');
    }
  }; 
};
//设置表格初始样式
chkTablestyle.addEventListener('change',()=>{
  chkTablestyle.checked = true;
  getElementMix('chk-selectcomp').checked = false;
  getElementMix('data-selectcomp-box').style.display = 'none';
  getElementMix('data-tablestyle-box').style.display = 'flex';
  toolMessage([false,'selectComp'],PLUGINAPP);
});
chkSelectcomp.addEventListener('change',()=>{
  chkSelectcomp.checked = true;
  getElementMix('chk-tablestyle').checked = false;
  getElementMix('data-tablestyle-box').style.display = 'none';
  getElementMix('data-selectcomp-box').style.display = 'flex';
  toolMessage([true,'selectComp'],PLUGINAPP);
});
//处理回传的选中对象的数据
function reSelectComp(info){
 //console.log(info)
 if(info[0] || info[1]){
  getElementMix('data-selectcomp-box').setAttribute('data-selectcomp-box','true')
  let comp1 = getElementMix('data-selectcomp-1');
  let comp2 = getElementMix('data-selectcomp-2');
  comp1.textContent = info[0] ? info[0] : 'none';
  comp1.style.opacity = info[0] ? '1' : '0.5';
  comp2.textContent = info[1] ? info[1] : 'none';
  comp2.style.opacity = info[1] ? '1' : '0.5';
 } else {
  getElementMix('data-selectcomp-box').setAttribute('data-selectcomp-box','false')
 };

};
function reSelectDatas(info){
  let text = tableArrayToText(info);
  let textarea = getElementMix('upload-tablearea');
  textarea.focus();
  textarea.value = text;
};
createTableBtn.addEventListener('click',()=>{
  let comp1 = getElementMix('data-selectcomp-1').textContent;
  let comp2 = getElementMix('data-selectcomp-2').textContent;
  comp1 = comp1 == 'none' ? null : comp1;
  comp2 = comp2 == 'none' ? null : comp2;
  let styleId = tableStyleSet.getAttribute('data-radio-value') - 1;
  if(getElementMix('chk-tablestyle').checked){
    toolMessage([[tableStyle[styleId]],'creTable'],PLUGINAPP);
  }else{
    toolMessage([[tableStyle[styleId],comp1,comp2],'creTable'],PLUGINAPP);
  };
});
//上传|拖拽|输入 的规则说明
btnHelp.forEach(item => {
  item.addEventListener('click',()=>{
    let key = item.getAttribute('data-help');
    if(dailogBox.innerHTML.split(helpData[key][0][1].split('<')[0]).length == 1){
      dailogBox.innerHTML = '';
      let node = document.createElement('div');
      node.className = 'df-ffc';
      helpData[key].forEach(item =>{
        let line = document.createElement(item[0]);
        let span =  document.createElement('span');
        span.innerHTML = item[1].replace(/\/\+\+/g,`<span data-highlight>`).replace(/\+\+\//g,'</span>');
        span.setAttribute('data-en-text',item[2].replace(/\/\+\+/g,`<span data-highlight>`).replace(/\+\+\//g,'</span>'));
        line.appendChild(span)
        if(item[0] == 'li'){
          line.setAttribute('data-li-style','2');
        };
        node.appendChild(line);
      });
      dailogBox.appendChild(node);
      //最后重置下语言
      if(ROOT.getAttribute('data-language') == 'En'){
        setLanguage(true);
        setLanguage(false);
      };
      //重置文字样式
      loadFont(dailogBox);
    };
    dailog.style.display = 'flex';
  });
});
//点击弹窗外关闭弹窗
dailog.addEventListener('click',(e)=>{
  if(!dailogBox.contains(e.target)){
    dailog.style.display = 'none';
  };
});
//收藏功能
skillStar.forEach(item =>{
  item.addEventListener('click',()=>{
    let isStar = item.getAttribute('data-skill-star');
    let skillId = item.parentNode.getAttribute('data-skill-sec');
    if(skillId){
      let cover = document.querySelector(`[data-skill-cover="${skillId}"]`);
      let skillNode = document.querySelector(`[data-skill-sec="${skillId}"]`);
      if(isStar == "true"){
        item.setAttribute('data-skill-star','false');
        cover.parentNode.insertBefore(skillNode,cover);
        userSkillStar = userSkillStar.filter(id => id !== skillId);
        storageMix.set('userSkillStar',JSON.stringify(userSkillStar));
        cover.remove();
      } else {
        let numModel = skillNode.parentNode.getAttribute('data-skillnum');
        if(numModel == 2){
          tipsAll(['禁止收藏整个模块的功能',"Don't star all functions of same module"],3000,4)
        }else{
          moveSkillStar([skillId]);
          userSkillStar.push(skillId);
          storageMix.set('userSkillStar',JSON.stringify(userSkillStar));
          /*
          skillNode.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
          */
        };
      };
    };
  });
});
function moveSkillStar(stars){
  stars.forEach(item => {
    let skillNode = document.querySelector(`[data-skill-sec="${item}"]`);
    if(skillNode){
      let cover = document.createElement('div');
      cover.setAttribute('data-skill-cover',item);
      cover.setAttribute('style','display: none');
      skillNode.parentNode.insertBefore(cover,skillNode);
      skillStarModel.prepend(skillNode);
      let star = skillNode.querySelector('[data-skill-star]');
      star.setAttribute('data-skill-star','true')
    };
  });
  reSkillNum();
};
function reSkillNum(){
  let models = document.querySelectorAll('[data-skillmodule]');
  models.forEach(model => {
    let skills = model.querySelectorAll('[data-skill-sec]');
    model.setAttribute('data-skillnum',skills.length);//剩一个时不能继续收藏
    model.setAttribute('data-skillnum-odd',skills.length%2);//单数显示占位, 排版好看些
  });
};
//重置全部
document.querySelectorAll('[data-reset-all]').forEach(reall => {
  reall.addEventListener('click',()=>{
    let btnReAll = reall.parentNode.parentNode.querySelectorAll('[data-input-reset]');
    btnReAll.forEach(item =>{
      item.click();
    });
  });
});
//栅格化像素倍率绑定
pixelScale.addEventListener('change',()=>{
  let set = document.querySelector('[data-pixelscale-set]');
  let sets = set.querySelectorAll('[data-radio-data]');
  let num = [];
  sets.forEach(item => {
    num.push(item.getAttribute('data-radio-data'));
  })
  if(num.includes(pixelScale.value)){
    set.querySelector(`[data-radio-data="${pixelScale.value}"]`);
  }else{
    num.forEach(item => {
      set.querySelector(`[data-radio-data="${item}"]`).setAttribute('data-radio-main','false')
    });
  };
});
//返回裁切方案以栅格化
skillAllBox.querySelector('[data-pixel-copy]').addEventListener('click',()=>{
  
});
//按各自比例/统一宽高进行等比缩放
function scaleRWH(){

};
//split标签绑定
getElementMix('data-split-tags').querySelectorAll('input').forEach(item => {
  item.addEventListener('change',()=>{
    let tag = item.parentNode.parentNode
    if(item.checked){
      tag.setAttribute('data-check-checked','true');
      tag.setAttribute('data-split-final','true');
    }else{
      tag.setAttribute('data-check-checked','false');
      tag.setAttribute('data-split-final','false');
    };
  });
});
//斜切拉伸
function sendTransform(){
  let data = {
    x: skewSetX.value * 1,
    y: skewSetY.value * 1,
    w: scaleSetX.value * 1,
    h: scaleSetY.value * 1,
  }
  toolMessage([data,'transformMix'],PLUGINAPP);
};
//点击即执行的功能
skillBtnMain.forEach(btn => {
  let MOVE_TIMEOUT;
  btn.addEventListener('dblclick',()=>{
    if(MOVE_TIMEOUT){
        clearTimeout(MOVE_TIMEOUT);
    };
    let skillname = btn.getAttribute('data-en-text');
    if(btn.getAttribute('data-btn-dblclick') !== null){
      switch (skillname){
        default : toolMessage([true,skillname],PLUGINAPP);break
      };
    };
  });
  btn.addEventListener('click',()=>{
    let skillname = btn.getAttribute('data-en-text');
    /*防抖*/
    if(MOVE_TIMEOUT){
        clearTimeout(MOVE_TIMEOUT)
    };
    MOVE_TIMEOUT = setTimeout(()=>{
      switch (skillname){
        case 'Pixel As Copy':sendPixel(skillname);break
        case 'Pixel Overwrite':sendPixel(skillname);break
        case 'Reset All Transform':;break
        case 'Split By Conditions':sendSplit('tags');break
        case 'Split By Symbol':sendSplit('inputs');break
        case 'Mapping Names':sendTable('mapName');break
        case 'Mapping Texts':sendTable('mapText');break
        case 'Mapping Properties':sendTable('mapPro');break
        case 'Mapping Tags':sendTable('mapTag');break
        case 'Get Names':sendTable('getName');break
        case 'Get Texts':sendTable('getText');break
        case 'Get Properties':sendTable('getPro');break
        case 'Get Tags':sendTable('getTag');break
        case 'Apply Preset':sendTableSet('style');break
        case 'Add C/R':sendTableSet('add');break
        case 'Reduce C/R':sendTableSet('reduce');break
        case 'Select a Row':sendTablePick('row');break
        case 'Select many Rows':sendTablePick('allrow');break
        case 'Select Block':sendTablePick('block');break
        case 'Select Inline':sendTablePick('inline');break
        default : toolMessage(['',skillname],PLUGINAPP);break
      };
    },500);
  });
  

  function sendPixel(name){
    //返回裁切方案以栅格化
    let mix = skillAllBox.querySelector('[data-pixel-mix]').getAttribute('data-select-value').split('≤ ')[1].split('px')[0]*1;
    let s = pixelScale.value;
    let cuts = [];
    tipsAll(['读取中, 请耐心等待','Reading, please wait a moment'],SelectNodeInfo.length * 800);
    setTimeout(()=>{
      SelectNodeInfo.forEach((item) => {
      let w = item[1];
      let h = item[2];
      let cut = tool.CUT_AREA({w:w,h:h,x:0,y:0,s:s},mix);
      cuts.push(cut);
    });
    //console.log(cuts);
    toolMessage([cuts,name],PLUGINAPP);
    },100);
  };

  function sendSplit(type){
    if(type == 'tags'){
      let tagsBox = getElementMix('data-split-tags').querySelectorAll('[data-split-final="true"]');
      let tags = [];
      tagsBox.forEach(item => {
        let tag = item.querySelector('[data-split-info="name"]').getAttribute('data-en-text');
        tags.push(tag);
      });
      //console.log(tags)
      toolMessage([[tags,'tags'],'splitText'],PLUGINAPP);
    };
    if(type == 'inputs'){
      let inputs = document.getElementById('split-word').value;
      let typeNum = document.querySelector('[data-splitword-set]').getAttribute('data-radio-value');
      toolMessage([[[inputs,typeNum * 1],'inputs'],'splitText'],PLUGINAPP);
    };
  };

  function sendTable(type){
    let data = '';
    let clone = true;
    let reduce = false;
    let enters = getElementMix('input-linefeed').value;
    let nulls = getElementMix('input-nulldata').value;
    if(type == 'mapName' || type == 'mapText' ){
      data = tableTextToArray(getElementMix('upload-tablearea').value.trim(),true);
    };
    if(type == 'mapPro' || type == 'mapTag' ){
      data = tableArrayToObj(tableTextToArray(getElementMix('upload-tablearea').value.trim()))
    };
    if(type.includes('map')){
      clone = getElementMix('switch-autoclone').checked;
      reduce = getElementMix('switch-autoreduce').checked;
    };
    
    toolMessage([{data:data,clone:clone,reduce:reduce,enters:enters,nulls:nulls},type],PLUGINAPP);
  };

  function sendTableSet(type){
    let styleId = tableStyleSet.getAttribute('data-radio-value') - 1;
    let H = getElementMix('table-column-num');
    let V = getElementMix('table-row-num');
    switch (type){
      case 'style':
        toolMessage([[tableStyle[styleId],type],'reTable'],PLUGINAPP);
      ;break
      case 'add':
        toolMessage([[[H.value,V.value],type],'reTable'],PLUGINAPP);
        H.value = 0;
        V.value = 0;
      ;break
      case 'reduce':
        toolMessage([[[H.value * -1,V.value * -1],type],'reTable'],PLUGINAPP);
        H.value = 0;
        V.value = 0;
      ;break
    };
  };

  function sendTablePick(type){
    toolMessage([type,'pickTable'],PLUGINAPP);
  };
});


/**
 * 模拟点击tab切换页面, 测试时更方便, 能直接显示目标页面
 * @param {string} name - 应该传入tab的英文名
 */
function viewPage(name){
  let tab = document.getElementById(`tab_${name}_0`);
  tab.checked = true;
  let inputEvent = new Event('change',{bubbles:true});
  tab.dispatchEvent(inputEvent);
};


/* ---钩子--- */

/*监听组件的自定义属性值, 变化时触发函数, 用于已经绑定事件用于自身的组件, 如颜色选择器、滑块输入框组合、为空自动填充文案的输入框、导航tab、下拉选项等*/
let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if(mutation.type === 'attributes'){
      switch(mutation.attributeName){
        case 'data-tab-pick':getUserTab(mutation.target); break;
        case 'data-color-hex':getUserColor(mutation.target); break;
        case 'data-number-value':getUserNumber(mutation.target); break;
        case 'data-text-value':getUserText(mutation.target); break;
        case 'data-select-value':getUserSelect(mutation.target); break;
        case 'data-radio-value':getUserRadio(mutation.target); break;
      }
    }
  })
});
let userEvent_tab = document.querySelectorAll('[data-tab-pick]');
userEvent_tab.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-tab-pick']};
  observer.observe(item,config);
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
let userEvent_radio = document.querySelectorAll('[data-radio-value]');
userEvent_radio.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-radio-value']};
  observer.observe(item,config);
});

/**
 * @param {Element} node -带有data-tab-pick值的元素, 用于记录用户关闭前所选的tab
 */
function getUserTab(node){
  let tabPick = node.getAttribute('data-tab-pick').split('tab_')[1]
  if(tabPick){
    storageMix.set('tabPick',tabPick);
    if(tabPick == 'more tools'){
      toolMessage(['','selectInfo'],PLUGINAPP);
    }
  }
};

function getUserColor(node){
  let color = {
    HEX:node.getAttribute('data-color-hex'),
    RGB:node.getAttribute('data-color-rgb'),
    HSL:node.getAttribute('data-color-hsl'),
    HSV:node.getAttribute('data-color-hsv'),
  }
  //console.log(color)
};

function getUserNumber(node){
  let number = node.getAttribute('data-number-value');
  if(node.getAttribute('data-skewset-x') !== null){
    node.parentNode.parentNode.parentNode.style.setProperty('--skewX',number)
    sendTransform();
  };
  if(node.getAttribute('data-skewset-y') !== null){
    node.parentNode.parentNode.parentNode.style.setProperty('--skewY',number)
    sendTransform();
  };
  if(node.getAttribute('data-scaleset-x') !== null){
    node.parentNode.parentNode.parentNode.style.setProperty('--scaleX',number)
    sendTransform();
  };
  if(node.getAttribute('data-scaleset-y') !== null){
    node.parentNode.parentNode.parentNode.style.setProperty('--scaleY',number)
    sendTransform();
  };
};

function getUserText(node){
  let text = node.getAttribute('data-text-value');
  //console.log(text)
};

function getUserSelect(node){
  let userSelect = node.getAttribute('data-select-value');
  if(userSelect){
    if(node.previousElementSibling == frameName){
      frameName.value = userSelect;
    };
  };
};

function getUserRadio(node){
  let userRadio= node.getAttribute('data-radio-value');
  if(userRadio){
    if(node.getAttribute('data-pixelscale-set') !== null){
      pixelScale.value = userRadio;
    };
    
    if(node.getAttribute('data-clip-w-set') !== null){
      let clipH = getElementMix('data-clip-h-set').getAttribute('data-radio-value');
      toolMessage([[userRadio * 1,clipH * 1],'addClipGrid'],PLUGINAPP);
    };
    if(node.getAttribute('data-clip-h-set') !== null){
      let clipW = getElementMix('data-clip-w-set').getAttribute('data-radio-value');
      toolMessage([[clipW * 1,userRadio * 1],'addClipGrid'],PLUGINAPP);
    };
    
    if(node.getAttribute('data-skilltype-box') !== null){
      let modelid = skillModel[userRadio - 1][1];
      //console.log(modelid);
      let model = skillAllBox.querySelector(`[data-skillmodule="${modelid}"]`);
      let skillnode = model.querySelector('[data-skill-sec]');
      if(isSkillScroll){
        skillnode.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      };
    };
  }
};
