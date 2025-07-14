let skillSecInfo = [
  {
    id: 'inSituRasterize',
    name: ["原地栅格化","in-situ rasterize"],
    tips:  ["",""],
  },
  {
    id: 'easeTransform',
    name: ["简单变形","ease transform"],
    tips:  ["",""],
  },
  {
    id: 'uniformScale',
    name: ["等比缩放","uniform scale"],
    tips:  ["",""],
  },
  {
    id: 'alterImageFill',
    name: ["图片填充修改","alter image fill"],
    tips:  ["",""],
  },
  {
    id: 'clipGrid',
    name: ["宫格裁切","clip grid"],
    tips:  ["",""],
  },
  {
    id: 'SplitText',
    name: ["拆分文本","split text"],
    tips:  ["",""],
  },
  {
    id: 'MergeText',
    name: ["合并文本","merge text"],
    tips:  ["",""],
  },
  {
    id: '',
    name: ["",""],
    tips:  ["",""],
  },
  {
    id: '',
    name: ["",""],
    tips:  ["",""],
  },
  {
    id: '',
    name: ["",""],
    tips:  ["",""],
  },
  {
    id: '',
    name: ["",""],
    tips:  ["",""],
  },
  {
    id: '',
    name: ["",""],
    tips:  ["",""],
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
    "本页功能主要用于<span data-highlight> 批量创建画板、图层等 </span>",
    "This page is used for batch creation of <span data-highlight> frames, layers, etc </span>"],
    ["li",
    "传入大图（长图）可创建大小均匀的切片组，以避免压缩",
    "Upload large images (long images) will create slice groups to avoid compression"],
    ["li",
    "传入带命名、宽高等信息的表格数据则创建画板",
    "Upload table data with name, width, height, and other information, will will create frames"],
    ["li",
    "传入由本系列插件生成的兼容文件则创建图层",
    "Upload files by YN+ or other compatible file will create layers"],
    ["li",
    "图片支持格式: <br> <span data-highlight> .jpg | .jpeg | .jfif | .webp | .png | .apng | .gif </span>",
    "Image file type:<br> <span data-highlight> .jpg | .jpeg | .jfif | .webp | .png | .apng | .gif </span>"],
    ["li",
    "表格支持格式: <br> <span data-highlight> .csv | .xls | .xlsx </span>",
    "Table file type: <br> <span data-highlight> .csv | .xls | .xlsx </span>"],
    ["li",
    "兼容文件支持格式: <br><span data-highlight> .zy | .sketch | .svg | .xml | .json | .zip | .rar | .7z </span>",
    "Compatible file type: <br> <span data-highlight> .zy | .sketch | .svg | .xml | .json | .zip | .rar | .7z </span>"],
    ["br","",""],
    ["p",
    "拖拽和上传文件会立即生成用以确认最终生成内容的<span data-highlight> 标签/大纲 </span>",
    "Dragging or uploading files will immediately convert to <span data-highlight> tags/catalogue </span>"],
    ["li",
    "拖拽的文件需全部是为图片类、全部是表格类或全部是兼容文件，<span data-highlight>不能混杂类型</span>",
    "Drag and drop files must be all images, tables, or compatible files. <span data-highlight> Mixed file types are not allowed </span>"],
    ["li",
    "上传文件设置了具体格式，不支持的格式将无法点选",
    "The three upload buttons restrict the file format, and unsupported formats cannot be uploaded"],
    ["br","",""],
    ["p",
    "通过文本框输入数据，需要点击第一个按钮来生成标签/大纲",
    "If input data through the textarea, click the first button to convert the data to tags/catalogue"],
    ["li",
    "输入表格数据无需包含表头、单位，<span data-highlight>可双击文本框查看示例</span>",
    "Does not need to include a table header or unit.<span data-highlight> May double-click the textarea to fill an example <span>"],
    ["li",
    "可以选中文件里的画板或图层，然后点击第二个按钮获取命名和宽高数据",
    "Select frames or layers in the file, and then click the second button to obtain theirs name, width and height data"],
    ["li",
    "如果需要制作更复杂的模板，点击第三个按钮前往资源助手",
    "If you need to create more complex templates, click the third button to go to the <span data-highlight> YN+ ListEase </span> online"],
    ["br","",""],
    ["p",
    "表格数据默认按<span data-highlight>命名、宽高、目标文件大小、目标文件格式、补充信息</span>的顺序读取列，如需修改规则可点击第四个按钮展开高级设置",
    "Table data is read in the order of <span data-highlight> name, width, height, target file size, target file format, and supplementary information </span> by default. To modify the rules, click the fourth button to expand advanced settings"],
    ["li",
    "修改列顺序规则时需注意,必须包含命名和宽高"
    ,"When modifying column order rules, it is important to include <span data-highlight> name, width and height </span>"],
    ["li",
    "画板名默认带w×h后缀，如“kv 1920×1080 ”，可选择其他预设或自行定义",
    "The frame defaults to a suffix with width and height,such as 'kv 1920 × 1080', you can selected a presets or input oneself"],
  ]
}

let skillModel = [];
let skilltypeNameNode = document.querySelector('[data-skilltype-box]').querySelectorAll('[data-skilltype-name]')
skilltypeNameNode.forEach(item => {
  let name1 = item.getAttribute('data-zh-text');
  name1 = name1 ? name1 : item.textContent.trim();
  let name2 = item.getAttribute('data-en-text');
  skillModel.push([name1,name2]);
});

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
const helpCreate = document.querySelector('[data-help="create"]');
const dailog = document.querySelector('[data-dailog]');
const dailogBox = document.querySelector('[data-dailog-box]');
const skillSecNode = document.querySelectorAll('[data-skill-sec]');
const skillStar = document.querySelectorAll('[data-skill-star]');
const skillStarModel = document.querySelector('[data-skillmodule="Useful & Starts"]')
const selectNodeInfo = document.querySelectorAll('[data-selects-node]');
const createTagsBox = document.querySelector('[data-create-tags]')

/*表单绑定*/
const userImg = document.getElementById('input-user-img');
const userTable = document.getElementById('input-user-table');
const userZy = document.getElementById('input-user-zy');
const userTableTitle = document.getElementById('input-user-table-title');
const frameName =  document.getElementById('input-framename');
const pixelScale = document.getElementById('input-pixelScale');

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
  //viewPage('more tools');
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

let loadFontAfter = [
  "data-en-text",
  "data-en-input",
  "data-en-placeholder",
  "data-turnto",
  "data-back",
]

function loadFont(){
  setTimeout(()=>{
    loadFontAfter.forEach(key => {
      let nodes = document.querySelectorAll(`[${key}]`);
      nodes.forEach(item => {
        item.style.fontFamily = '"Shanggu Sans", Arial, Helvetica, sans-serif';
      })
    });
  },100);
}

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

}

function addSkillTitle(){
  skillSecNode.forEach(secnode =>{
    let secid = secnode.getAttribute('data-skill-sec');
    if(secid){
      let info = skillSecInfo.find(item => item.id == secid);
      let node = document.createElement('div');
      node.setAttribute('data-skill-title','');
      node.className = 'df-lc';
      let tips = document.createElement('div');
      tips.setAttribute('data-tips','');
      tips.setAttribute('data-tips-x','left');
      tips.setAttribute('data-tips-y','top');
      tips.setAttribute('style',`--tips-text:'${info.tips[0]}'; --tips-text-en:'${info.tips[1]}';`);
      tips.innerHTML = '<btn-info></btn-info>'
      node.appendChild(tips);
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
      loadFont();
    };
  });
}

function reSelectInfo(info){
 if(info.length > 0){
  ROOT.setAttribute('data-selects','true');
  selectNodeInfo.forEach(item => {
    let main = item.querySelector('[data-selects-info="main"]');
    let sec = item.querySelector('[data-selects-info="sec"]');
    let num = item.querySelector('[data-selects-info="num"]');
    main.textContent = info[0][0];
    sec.textContent = info[1] ? info[1][0] : '';
    num.textContent = info.length;
  });
  if(info.length > 1){
    ROOT.setAttribute('data-selects-more','true');
  }else{
    ROOT.setAttribute('data-selects-more','false');
  }
 }else{
  ROOT.setAttribute('data-selects','false')
 }
}


/* ---界面交互--- */

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
});
userZy.addEventListener('change',(e)=>{
  let files = Array.from(userZy.files);
  reFileInfo(files);
});
function reFileInfo(files){
  let languge = ROOT.getAttribute('data-language');
  let fileLength = '<span style="color: let(--code2)">' + files.length + '</span>'
  let fileName1 = files.length == 1 ? files[0].name : files[0].name + ' ...等 ' + fileLength + '  个文件';
  let fileName2 = files.length == 1 ? files[0].name : files[0].name + ' ... ' + fileLength + ' files';
  fileName1 = '📁 ' + TextMaxLength(fileName1,20,'..');
  fileName2 = '📁 ' + TextMaxLength(fileName2,20,'..');
  fileInfo.setAttribute('data-zh-text',fileName1);
  fileInfo.setAttribute('data-en-text',fileName2);
  if(languge == "Zh"){
    fileInfo.innerHTML = fileName1;
  }else{
    fileInfo.innerHTML = fileName2;
  };
}
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
      case 'image': addImageTags(files);break
      case 'table': addTableTags(files);break
      case 'zy': addZyCatalogue(files);break
    }
  } else {
    tipsAll(['只能上传同类型文件','The file type must meet the requirements'],3000)
  }
  
});


function loadImage(file){
  return new Promise((resolve,reject) => {
    const reader = new FileReader()
    reader.onload = (e)=>{
      const image = new Image();
      image.onload = ()=> resolve(image);
      image.onerror = (error)=> reject(error);
      image.src = e.target.result;
    };
    reader.onerror = (error)=>{reject(error)}
    reader.readAsDataURL(file)
  });
}

async function addImageTags(files){
  let sizes = files.map(item => item.size);
  let sizeAll = sizes.reduce((a,b) => a + b, 0);
  sizeAll = sizeAll*1 == NaN ? files.length : sizeAll; //大图至少算1M大小
  tipsAll(['读取中，请耐心等待','Reading, please wait a moment'],sizeAll/1024/1024 * 100); //加载1M需要100毫秒
  let tagsInfo = [];
  for(let i = 0; i < files.length; i++){
    let file = files[i];
    let name = file.name.split('.').filter(item => !imageType.includes(item.toLowerCase())).join('_');
    try{
      let image = await loadImage(file);
      let cuts = await CUT_IMAGE(image);
      tagsInfo.push({n:name,w:image.width,h:image.height,cuts:cuts});
      if(i == files.length - 1){
        addTag('image',tagsInfo)
      }
    } catch (error) {
      console.log(error)
    }
    
  };
}

function addTag(type,info){
  createTagsBox.innerHTML = '';
  switch (type){
    case 'image':
      info.forEach((img,index) => {
        let tag = document.createElement('div');
        createTagsBox.parentNode.setAttribute('data-create-tags-box','image');
        tag.setAttribute('data-create-tag','');
        tag.setAttribute('data-create-final','true');
        tag.className = 'df-lc';

        let checkbox = document.createElement('div');
        checkbox.setAttribute('style','width: 14px; height: 14px;');
        let checkid = 'cr_img_chk_' + index;
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

        let name = document.createElement('div');
        name.setAttribute('data-create-info','name');
        name.innerHTML = TextMaxLength(img.n,16,'...');
        tag.appendChild(name);
        if(img.cuts.length > 1){
          let span = document.createElement('span');
          let text = ROOT.getAttribute('data-language') == 'Zh' ? "切片" : "Slice"
          span.innerHTML = `▶ 
          <span style="color: var(--themeColor)">${img.cuts.length}</span>
          <span data-en-text="Slice" data-zh-text="切片">${text}</span>
          ` ;
          tag.appendChild(span);
          span.addEventListener('dblclick',()=>{
            console.log(img.cuts)
          });
        }
        createTagsBox.appendChild(tag);

        checkinput.addEventListener('change',()=>{
          if(checkinput.checked){
            tag.setAttribute('data-check-checked','true');
            tag.setAttribute('data-create-final','true');
          }else{
            tag.setAttribute('data-check-checked','false');
            tag.setAttribute('data-create-final','false');
          }
        });
      });
    ;break
    case 'zy':
      info.forEach(layer => {
        let catalogue = document.createElement('div');
        catalogue.setAttribute('data-create-catalogue','');
      });
  }
}

function addTableTags(files){
  
}
function addZyCatalogue(files){
  
}
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
    tipsAll(['请用指定单词，并用逗号隔开','Must use example words and separated by commas'],3000);
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
//上传|拖拽|输入 的规则说明
helpCreate.addEventListener('click',()=>{
  if(dailogBox.innerHTML.split(helpData.create[0][1].split('<')[0]).length == 1){
    dailogBox.innerHTML = '';
    let node = document.createElement('div');
    node.className = 'df-ffc';
    helpData.create.forEach(item =>{
      let line = document.createElement(item[0]);
      let span =  document.createElement('span');
      span.innerHTML = item[1];
      span.setAttribute('data-en-text',item[2]);
      line.appendChild(span)
      if(item[0] == 'li'){
        line.setAttribute('data-li-style','2')
      }
      node.appendChild(line);
    });
    dailogBox.appendChild(node);
    //最后重置下语言
    if(ROOT.getAttribute('data-language') == 'En'){
      setLanguage(true);
      setLanguage(false);
    };
    //重置文字样式
    loadFont();
  };
  dailog.style.display = 'flex';
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
      }
    };
    reSkillNum();
    skillNode.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
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
};
function reSkillNum(){
  let models = document.querySelectorAll('[data-skillmodule]');
  models.forEach(model => {
    let skills = model.querySelectorAll('[data-skill-sec]');
    model.setAttribute('data-skillnum',skills.length);//剩一个时不能继续收藏
    model.setAttribute('data-skillnum-odd',skills.length%2);//单数显示占位，排版好看些
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


/**
 * 模拟点击tab切换页面，测试时更方便，能直接显示目标页面
 * @param {string} name - 应该传入tab的英文名
 */
function viewPage(name){
  let tab = document.getElementById(`tab_${name}_0`);
  tab.checked = true;
  let inputEvent = new Event('change',{bubbles:true});
  tab.dispatchEvent(inputEvent);
}


/* ---钩子--- */

/*监听组件的自定义属性值，变化时触发函数，用于已经绑定事件用于自身的组件，如颜色选择器、滑块输入框组合、为空自动填充文案的输入框、导航tab、下拉选项等*/
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
 * @param {Element} node -带有data-tab-pick值的元素，用于记录用户关闭前所选的tab
 */
function getUserTab(node){
  let tabPick = node.getAttribute('data-tab-pick').split('tab_')[1]
  if(tabPick){
    storageMix.set('tabPick',tabPick);
  }
}

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
  if(node.getAttribute('data-skewset-x') !== null){
    node.parentNode.parentNode.parentNode.style.setProperty('--skewX',number)
  };
  if(node.getAttribute('data-skewset-y') !== null){
    node.parentNode.parentNode.parentNode.style.setProperty('--skewY',number)
  };
  if(node.getAttribute('data-scaleset-x') !== null){
    node.parentNode.parentNode.parentNode.style.setProperty('--scaleX',number)
  };
  if(node.getAttribute('data-scaleset-y') !== null){
    node.parentNode.parentNode.parentNode.style.setProperty('--scaleY',number)
  };
}

function getUserText(node){
  let text = node.getAttribute('data-text-value');
  //console.log(text)
}

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
    if(node.getAttribute('data-clip-w-set')  !== null){
      let set = node.parentNode.parentNode.querySelector('[data-clip-w]');
      let sets = set.querySelectorAll('[data-clip-set]');
      set.setAttribute('data-clip-w',userRadio);
      sets.forEach(item => {
        item.setAttribute('style','');
      });
    }
    if(node.getAttribute('data-clip-h-set')  !== null){
      let set = node.parentNode.parentNode.querySelector('[data-clip-h]');
      let sets = set.querySelectorAll('[data-clip-set]');
      set.setAttribute('data-clip-h',userRadio);
      sets.forEach(item => {
        item.setAttribute('style','');
      });
    }
  }
}


/* 核心功能 */

function CUT_IMAGE(image,mix){
  return new Promise((resolve,reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    requestAnimationFrame(function draw() {
      // 绘制图片
      ctx.drawImage(image, 0, 0);
      let cutAreas = CUT_AREA({ w: canvas.width, h: canvas.height, x: 0, y: 0, s: 1 },mix | 4096);
      // 检查图片是否完全绘制
      if (image.complete) {
        let cuts = [];
        for (let i = 0; i < cutAreas.length; i++) {
          let canvas2 = document.createElement("canvas");
          let w = cutAreas[i].w;
          let h = cutAreas[i].h;
          let x = cutAreas[i].x;
          let y = cutAreas[i].y;
          canvas2.width = w;
          canvas2.height = h;
          let ctx2 = canvas2.getContext("2d");
          ctx2.drawImage(canvas, x, y, w, h, 0, 0, w, h);
          let imgData = CanvasToU8A(canvas2);
          cuts.push({ img: imgData, w: w, h: h, x: x, y: y });
          if (i == cutAreas.length - 1) {
            resolve(cuts);
          };
        };
      };
    });
  });
}


/**
 * 均匀裁切方案，可用于瓦片切图和长图分割
 * @param { object } info - {w:,h:,x:,y:,s:}原始宽高、坐标(如有)、栅格化倍率(如有)
 * @param { number } mix - 4096 | 2048 | 1024
 */
function CUT_AREA(info,mix) {
  let W = info.w, H = info.h;//图片宽高
  let Ws = info.w, Hs = info.h;//非尾部的裁剪宽高
  let lastWs = info.w, lastHs = info.h;//尾部的裁剪宽高
  let X = info.x || 0, Y = info.y || 0;//裁切区坐标
  let cutW = 1, cutH = 1;//纵横裁剪数量
  let cutAreas = [];//从左到右，从上到下记录的裁切区域集
  let isCut = (W * info.s <= mix && H * info.s <= mix);//不超过最大尺寸的不裁切

  if (isCut) {
    return [{w:W,h:H,x:X,y:Y}];
  } else {
    cutW = Math.ceil((W * info.s) / mix);
    cutH = Math.ceil((H * info.s) / mix);
    Ws = Math.ceil(W / cutW);
    Hs = Math.ceil(H / cutH);
    lastWs = W - (Ws * (cutW - 1));//有小数点则向上取整，最后一截短一些
    lastHs = H - (Hs * (cutH - 1));

    for (let i = 0; i < (cutW * cutH); i++) {
      if ((i + 1) % cutW == 0 && i !== (cutW * cutH) - 1 && i !== 0) {
        cutAreas.push({ w: lastWs, h: Hs, x: X, y: Y, });
        Y = Y + Hs;
        X = info.x;
      } else if (i == (cutW * cutH) - 1) {
        cutAreas.push({ w: lastWs, h: lastHs, x: X, y: Y,});
      } else {
        if (i > (cutW * (cutH - 1)) - 1) {
          cutAreas.push({ w: Ws, h: lastHs, x: X, y: Y });
        } else {
          cutAreas.push({ w: Ws, h: Hs, x: X, y: Y });
        }
        if (cutW == 1) {
          X = info.x;
          Y = Y + Hs;
        } else {
          X = X + Ws;
        }
      }
    }

    return cutAreas;
  }

}