/**
 * 动态生成小功能列表
 * 功能层级：模块>功能点/集>表单/按钮，模块用于tab切换，功能点/集可查看说明
 * 文案类型需用['中文XXX','EnglishXXX']分别记录
 * 表单类型基于yn_comp.js组件库
 * 表单逐行记录，CSS控制默认间隙和自适应宽度，分隔间隙需加多分隔对象,可设置分隔值，不设置则按默认间隙两倍
 */
const skillList = [
  {
    icon: '',/*svg注册组件*/
    title: ['',''],/*一级功能模块*/
    skills: [
      {
        name: ['',''],/*二级功能名*/
        tips: ['',''],/*功能说明*/
        comps:[/*功能按钮，逐行*/
          [/*单行*/
            {
              type: "SELECT",/* BUTTON | INPUT_ICON | RANGE_INT | SELECT | */
              buttonMain: false,/*如为主按钮则特殊样式 */
              selectOption:[
                ['',''],
                ['',''],
              ],
              isView: true,/*是否外显*/
              isVIP: false,/*是否高级功能*/
            },
            {
              type: "GAP",
              gap: null,
              isView: true,
              isVIP: false,
            },
          ],
        ], 
        isStart: false,/*用户收藏后保存本地数据并置顶*/
      },
    ],
  },
]

/**
 * 克隆到常用功能
 */
let userSkillStart = ['二级功能名','二级功能名']

let toUserTips = {
  worktime: ["🔒下班时间不建议工作~ (付费解锁)","🔒You shouldn't work after work!(pay to unlock)"],
  random: [
    ["❤ 久坐伤身, 快起来走两步吧~","❤ Get up and take a walk now~"],
    ["❤ 身心要紧, 不舒服及时休息~","❤ Put down your work and rest in time~"],
    ["❤ 工具提效, 是为了多陪家人~","❤ Spend more time with your family~"],
    ["❤ 支持开源, 要价值而非价格~","❤ Support open source and design~"],
    ["❤ 久坐伤身, 快起来走两步吧~","❤ Get up and take a walk now~"],
    ["❤ 身心要紧, 不舒服及时休息~","❤ Put down your work and rest in time~"],
    ["❤ 工具提效, 是为了多陪家人~","❤ Spend more time with your family~"],
    ["❤ 支持开源, 要价值而非价格~","❤ Support open source and design~"],
  ],
};

let helpData = {
  create: [
    ["p",
    "本页功能主要用于批量创建画板、图层等",
    "This page is used for batch creation of frames, layers, etc"],
    ["li",
    "传入大图（长图）可创建大小均匀的切片组，以避免压缩",
    "Upload large images (long images) will create slice groups to avoid compression"],
    ["li",
    "传入带命名、长宽等信息的表格数据则创建画板",
    "Upload table data with name, length, width, and other information, will will create frames"],
    ["li",
    "传入由本系列插件生成的兼容文件则创建图层",
    "Upload files by YN+ will create layers"],
    ["br","",""],
    ["p",
    "拖拽和上传文件会立即生成用以确认最终生成内容的标签/大纲",
    "Dragging or uploading files will immediately convert to <span data-highlight> tags/catalogue </span>"],
    ["li",
    "拖拽的文件需统一为图片类、表格类或兼容文件，不能混杂",
    ""],
    ["li",
    "上传文件设置了具体格式，不支持的格式将无法点选",
    ""],
    ["br","",""],
    ["p",
    "通过文本框输入数据，需要点击第一个按钮来生成标签/大纲",
    ""],
    ["li",
    "输入表格数据无需包含表头、单位，可双击文本框查看示例",
    ""],
    ["li",
    "可以选中文件里的画板或图层并点击，点击第二个按钮获取命名和长宽数据",
    ""],
    ["li",
    "如果需要制作更复杂的模板，点击第三个按钮前往资源助手",
    ""],
    ["br","",""],
    ["p",
    "表格数据默认按命名、长宽、目标文件大小、目标文件格式、补充信息的顺序读取列，如需修改规则可点击第四个按钮展开高级设置",
    ""],
    ["li",
    "修改列顺序规则时需注意,必须包含命名和长宽"
    ,""],
    ["li",
    "画板名默认带w×h后缀，如“kv 1920×1080 ”，可选择其他预设或自行定义",
    ""],
  ]
}

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
const userImg = document.getElementById('input-user-img');
const userTable = document.getElementById('input-user-table');
const userTableTitle = document.getElementById('input-user-table-title');
const userZy = document.getElementById('input-user-zy');
const fileInfo = document.querySelector('[data-file-info]');
const frameName =  document.getElementById('input-framename');
const helpCreate = document.querySelector('[data-help="create"]');
const dailog = document.querySelector('[data-dailog]');
const dailogBox = document.querySelector('[data-dailog-box]');

let isResize = false;
let reStartW,reStartH,reStartX,reStartY;
let tableTitleMust = userTableTitle.getAttribute('placeholder').split(',');
let imageType = document.getElementById('input-user-img').getAttribute('accept');
let tableType = document.getElementById('input-user-table').getAttribute('accept');
let zyType = document.getElementById('input-user-zy').getAttribute('accept');
let frameNmaeSelect = [];
frameName.nextElementSibling.querySelectorAll('[data-option="option"]')
.forEach(item => {
  frameNmaeSelect.push(item.getAttribute('data-option-value'));
});

window.addEventListener('load',()=>{
  if(window.innerWidth < 300){
    TV_MOVE = true;
  } else {
    TV_MOVE = false;
  };
  reTV();
  loadFont();
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
  },500);
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
    textW = random[num].length * -2 + 'ch'
  }else{
    textW = random[num].length * -1 + 'ch'
  }
  TV_text.parentNode.style.setProperty('--tv-w',textW)

}

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
  let files = userImg.files;
  reFileInfo(files);
  let reader = new FileReader();
});
userTable.addEventListener('change',(e)=>{
  let files = userTable.files;
  reFileInfo(files);
});
userZy.addEventListener('change',(e)=>{
  let files = userZy.files;
  reFileInfo(files);
});
function reFileInfo(files){
  let languge = ROOT.getAttribute('data-language');
  let fileLength = '<span style="color: var(--code2)">' + files.length + '</span>'
  let fileName1 = files.length == 1 ? files[0].name : files[0].name + ' ...等 ' + fileLength + '  个文件';
  let fileName2 = files.length == 1 ? files[0].name : files[0].name + ' ... ' + fileLength + ' files';
  fileName1 = '📁 ' + fileName1;
  fileName2 = '📁 ' + fileName2;
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
  dropUp.style.filter = 'drop-shadow(0 0 4px var(--mainColor))';
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
  let files = Array.from(e.dataTransfer.files).sort((a, b) => b.size - a.size);
  reFileInfo(files);
  let reader = new FileReader();
});
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
  if(dailogBox.innerHTML.split(helpData.create[0][1]).length == 1){
    dailogBox.innerHTML = '';
    let node = document.createElement('div');
    node.className = 'df-ffc';
    helpData.create.forEach(item =>{
      let line = document.createElement(item[0]);
      line.innerHTML = item[1];
      line.setAttribute('data-en-text',item[2]);
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
  if(e.target !== dailogBox){
    dailog.style.display = 'none';
  }
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

/*监听组件的自定义属性值，变化时触发函数，用于已经绑定事件用于自身的组件，如颜色选择器、滑块输入框组合、为空自动填充文案的输入框、导航tab、下拉选项等*/
let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if(mutation.type === 'attributes'){
      switch(mutation.attributeName){
        case 'data-tab-pick':getUserTab(mutation.target); break;
        case 'data-select-value':getUserSelect(mutation.target); break;
      }
    }
  })
});
let userEvent_tab = document.querySelectorAll('[data-tab-pick]');
userEvent_tab.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-tab-pick']};
  observer.observe(item,config);
});
let userEvent_select = document.querySelectorAll('[data-select]');
userEvent_select.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-select-value']};
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

function getUserSelect(node){
  let userSelect = node.getAttribute('data-select-value');
  if(userSelect){
    if(node.previousElementSibling == frameName){
      frameName.value = userSelect;
    }
  }
}

function addSkill(){
  skillList.forEach(model => {
    let skillModel = document.createElement('div');
    skillModel.setAttribute('data-skillModel',model.title[1]);

    let tabSkill = document.createElement('div');
    tabSkill.setAttribute('data-tabSkill',model.title[1]);

    page_skills.appendChild(skillModel);
    tab_skills.appendChild(tabSkill)
  })
  userSkillStart.forEach(skill => {

  })
}

//生成导出标签
function addExport(frameDataOld,frameDataNew,isNew) {
  //console.log(frameData)
  var index = 0;
  if(isNew == 'new'){
    exportNum = 0;
    tagsContainer2.innerHTML = "";
    frameData = frameDataNew;
  }else{
    frameData = frameDataNew;
    index = exportNum//避免序号错乱
  }

  for (var i = 0; i < frameData.length; i++) {
    var option = `<option value="` + frameData[i].type + `">` + frameData[i].type + `</option>`
    var options = "";
    typeAllow.forEach(item => {
      if( item != frameData[i].type){
        options += `<option value="` + item + `">` + item + `</option>`
      }
    })
    var filetype = `<select id="imgtype-` + (i + index) + `" class="input-btn-skill" 
    name="文件格式"
    style="width: 60px; min-width: 60px; height:22px; width: 14ch; color: var(--mainColor); font-size: 12;" 
    onchange="
    var name = document.getElementById('fileName-' +` + (i + index) + `);
    var text = name.value.split('.')[0] + '.' + this.value; 
    name.value = text;
    message([[this.value,'` + frameData[i].id + `'],'exportTypeSet']);
    imgExportData[`+ (i + index) +`].fileName = text ">
      `+ option + options +`
    </select>`
    var info = `<div class="info">
      <span style="opacity: 0.5;">` + ((i + index) + 1) + `.</span>
      <input type="text" class="input-nobg" id="fileName-` + (i + index) + `"value="` + frameData[i].name + `.` + frameData[i].type + `" 
      onKeyPress="if(window.event.keyCode==13) this.blur()" 
      onchange="imgExportData[`+ (i + index) +`].fileName = this.value; 
      var type = this.value.split('.')[1] ? this.value.split('.')[1].toLowerCase() : '';
      if (type && typeAllow.includes(type)){
      document.getElementById('imgtype-' +` + (i + index) + `).value = type;
      } else {
       this.value = this.value.split('.')[0] + '.' + document.getElementById('imgtype-' +` + (i + index) + `).value;
      }
      
      //console.log(imgExportData.map(item => item.fileName))"/>
    </div>`;
    var size = '<span id="imgsize-'+ (i + index) +'" style="color:var(--mainColor2);opacity: 0.8;"></span>';
    var setsize = `<div class="input-btn-skill" style="width: 60px; min-width: 60px; height:20px" >
      <input  id="exportSize-` + (i + index) + `" type="text" class="input-btn-skill" 
      style="border:0px; height: 18px;" value="` + frameData[i].s + `" 
      onKeyPress="if(window.event.keyCode==13) this.blur()" 
      onchange="message([[this.value,'` + frameData[i].id + `'],'exportSizeSet']);
      imgExportData[`+ (i + index) +`].s = this.value;
      console.log(imgExportData.map(item => item.s))"/>
      <div class="input-btn-skill" style="border:0px; width:30px; border-radius: 0px ;background-color: var(--boxGry); opacity: 0.8;  color:var(--mainColor)">k</div>
      </div>`
    var chk = `
    <input id="chk-export-` + (i + index) + `" type="checkbox" style="display: none;" />
    <label for="chk-export-` + (i + index) + `" class="chk-export-key set" style="width:100%; display: flex;align-items: center;gap: 4px;">
      `+ info +`
      <svg style="display:var(--export-edit);" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="14" height="14" viewBox="0 0 10 10">
          <g transform="matrix(0.8660253882408142,0.5,-0.5,0.8660253882408142,1.3172291698792833,-2.3877065935394057)">
            <path fill="var(--has)" d="M8.4255957421875,1.264617919671875L8.4255957421875,6.264129638671875Q8.4255957421875,6.313379638671875,8.4159857421875,6.361679638671875Q8.4063857421875,6.409969638671875,8.3875357421875,6.455469638671875Q8.3686957421875,6.500969638671875,8.3413357421875,6.541909638671875Q8.3139757421875,6.582859638671875,8.2791557421875,6.617679638671875Q8.244325742187499,6.652499638671875,8.2033857421875,6.679859638671875Q8.1624357421875,6.707219638671875,8.1169357421875,6.726069638671875Q8.0714457421875,6.744909638671875,8.0231457421875,6.754519638671875Q7.9748457421875,6.764129638671875,7.9255957421875,6.764129638671875Q7.8640457421875,6.764129638671875,7.8043357421875,6.749199638671875L4.9928757421875,6.046379638671875Q4.9117407421875,6.026099638671875,4.8416217421875,5.980519638671875Q4.7715037421875,5.934939638671875,4.7200357421875,5.869019638671875Q4.6685667421875,5.803099638671875,4.6413517421875,5.724019638671875Q4.6141357421875,5.644939638671875,4.6141357421875,5.561309638671875Q4.6141357421875,5.512059638671875,4.6237427421875,5.463759638671875Q4.6333507421875,5.415469638671875,4.6521957421875,5.369969638671875Q4.6710417421875,5.324469638671875,4.6984007421875,5.283519638671875Q4.7257607421875,5.2425796386718755,4.7605827421875,5.207759638671876Q4.7954047421875,5.172929638671874,4.8363507421875,5.145579638671875Q4.8772967421875,5.118219638671874,4.9227937421875,5.099369638671876Q4.9682907421875,5.080519638671875,5.0165906421875,5.0709196386718745Q5.0648900421875,5.061309638671875,5.1141357421875,5.061309638671875Q5.1756846421875,5.061309638671875,5.2353957421875,5.0762396386718756L5.2358847421875,5.076359638671875L7.4255957421875,5.623749638671875L7.4255957421875,1.264129638671875Q7.4255957421875,1.214883938671875,7.435205742187501,1.166584538671875Q7.4448157421875,1.118284638671875,7.4636557421875,1.0727876386718749Q7.4825057421875005,1.027290638671875,7.5098657421875,0.986344638671875Q7.5372257421875,0.945398638671875,7.5720457421875,0.910576638671875Q7.6068657421875,0.875754638671875,7.6478157421875,0.848394638671875Q7.6887557421874995,0.821035638671875,7.7342557421875,0.802189638671875Q7.7797557421875005,0.783344638671875,7.8280557421875,0.7737366386718749Q7.8763557421875,0.764129638671875,7.9255957421875,0.764129638671875Q7.9748457421875,0.764129638671875,8.0231457421875,0.7737366386718749Q8.0714457421875,0.783344638671875,8.1169357421875,0.802189638671875Q8.1624357421875,0.821035638671875,8.2033857421875,0.848394638671875Q8.244325742187499,0.875754638671875,8.2791557421875,0.910576638671875Q8.3139757421875,0.945398638671875,8.3413357421875,0.986344638671875Q8.3686957421875,1.027290638671875,8.3875357421875,1.0727876386718749Q8.4063857421875,1.118284638671875,8.4159857421875,1.166584538671875Q8.4255957421875,1.214883938671875,8.4255957421875,1.264129638671875L8.4255957421875,1.264617919671875Z" fill-rule="evenodd" fill-opacity="1"/>
          </g>
          <rect stroke="var(--boxBod)" x="0.5" y="0.5" width="9" height="9" rx="1.5" fill-opacity="0" stroke-opacity="1"  fill="none" stroke-width="1"/>
      </svg>
    </label>`
    var node = document.createElement('div');
    node.className = "tags-exports";
    node.id = "tags-exports-" + (i + index);
    node.innerHTML = '<div style="display:flex;gap:4px; align-items: center; width:100%;"><div class="btn-text" style="width:14px; height:14px; z-index:1;"onclick="this.parentNode.parentNode.remove();imgExportData['+ (i + index) +`].fileName = ''"><btn-close style=" opacity: 0.6;"></btn-close></div>` + chk + '</div><div class="set">' + size + '<div style="display:flex; gap:4px">'  + setsize + filetype + '</div></div>';
    tagsContainer2.appendChild(node);
    console.log("创建导出：第" + (i + index))
    exportNum++
  }

}
//删除导出标签
function noExport(e){
  if(e == 'all'){
    tagsContainer2.innerHTML = "";
    imgExportData = [];
    imgExportInfo = [];
    exportNum = 0;
    exportInfo.innerHTML = "[-- 未选中容器 --]"
  }
}

//生成图片标签
function addImg(imgsName) {
  tagsContainer1.innerHTML = "";
  var icon = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="20" height="16" viewBox="0 0 16 13.75732421875">
    <rect x="0" y="11.75732421875" width="16" height="2" rx="0" fill="#6E6E6E" fill-opacity="1"/>
    <g transform="matrix(0.7071067690849304,-0.7071067690849304,0.7071067690849304,0.7071067690849304,-2.3430887013528263,2.8286348765686853)">
      <rect x="2.242919921875" y="4.24267578125" width="6" height="9" rx="0" fill="#6E6E6E" fill-opacity="1"/>
      <path d="M5.242919921875,10.24267578125L6.727839921875,11.75775578125L8.242919921875,13.24267578125L6.727839921875,14.727595781249999L5.242919921875,16.24267578125L3.757999921875,14.727595781249999L2.242919921875001,13.24267578125L3.757999921875,11.75775578125L5.242919921875,10.24267578125Z" fill="#6E6E6E" fill-opacity="1"/>
    </g>
  </svg>
  `
  for (var i = 0; i < imgsName.length; i++) {
    //tagsContainer1.innerHTML += '<div class="tags-imports">' + icon + '<div style="width:4px"></div><input id="imgName-' + i + '" class="input-btn-skill" style="border: 0;text-align: left;" type="text" value="' + imgsName[i].name + '" onchange="imgsNameNew[' + i + '].name = this.value; if (!this.value){this.value = imgsName[' + i + '].name;console.log(`恢复原命名`,imgsName[' + i + ']) }"/></div>';
    tagsContainer1.innerHTML += '<div class="tags-imports"><div style="width:4px">' + (i + 1) + '.' + imgsName[i] + '</div>';

  }
}

//生成编辑标签
function addEdit(type,copynode) {
  if(copynode){
    copyEdit = copynode.parentNode
  } else {
    editTag.scrollTop = 0;
  }
  if ( editTag.children.length !== 0){
    document.getElementById('chk-editor-' + editorPick).checked = false
  }
  var chk = '<input id="chk-editor-' + editorNum + '" type="checkbox" checked=" true" style="display:none" onchange="editorChk(this,' + editorNum + ')"/>'
  var main = type;
  var close = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 17 17"><g><g><rect x="3.5" y="7.5" width="10" height="2" rx="0" fill="var(--mainColor)" fill-opacity="1"/></g><g><ellipse cx="8.5" cy="8.5" rx="8" ry="8" fill-opacity="0" stroke-opacity="1" stroke="var(--mainColor)" fill="none" stroke-width="1"/></g></g></svg>';
  var set = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 18 18"><g><path d="M3.59452,1.67756L6.80722,3.70617L7.6445,0L10.3555,0L11.1928,3.70617L14.4055,1.67756L16.3224,3.59452L14.2938,6.80722L18,7.64451L18,10.3555L14.2938,11.1928L16.3224,14.4055L14.4055,16.3224L11.1928,14.2938L10.3555,18L7.64451,18L6.80722,14.2938L3.59452,16.3224L1.67756,14.4055L3.70617,11.1928L0,10.3555L0,7.64451L3.70617,6.80722L1.67756,3.59452L3.59452,1.67756ZM13.5,9C13.5,11.4853,11.4853,13.5,9,13.5C6.51472,13.5,4.5,11.4853,4.5,9C4.5,6.51472,6.51472,4.5,9,4.5C11.4853,4.5,13.5,6.51472,13.5,9ZM9.00006,11.9999C10.6569,11.9999,12.0001,10.6568,12.0001,8.99994C12.0001,7.34308,10.6569,5.99994,9.00006,5.99994C7.34321,5.99994,6.00006,7.34308,6.00006,8.99994C6.00006,10.6568,7.34321,11.9999,9.00006,11.9999Z" fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1"/></g></svg>';
  var copy = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 11 11"><g><g><path d="M5,2L4,2L4,4L2,4L2,5L4,5L4,7L5,7L5,5L7,5L7,4L5,4L5,2Z" fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1"/></g><g><path d="M0,2.5L0,6.5Q0,7.53553,0.732233,8.26777Q1.29574,8.83127,2.03888,8.96112Q2.16872,9.70426,2.73223,10.2678Q3.46447,11,4.5,11L8.5,11Q9.53553,11,10.2678,10.2678Q11,9.53553,11,8.5L11,4.5Q11,3.46447,10.2678,2.73223Q9.70426,2.16872,8.96112,2.03888Q8.83127,1.29574,8.26777,0.732233Q7.53553,0,6.5,0L2.5,0Q1.46447,0,0.732233,0.732233Q0,1.46447,0,2.5ZM9,3.08099L9,6.5Q9,7.53553,8.26777,8.26777Q7.53553,9,6.5,9L3.08099,9Q3.18864,9.30996,3.43934,9.56066Q3.87868,10,4.5,10L8.5,10Q9.12132,10,9.56066,9.56066Q10,9.12132,10,8.5L10,4.5Q10,3.87868,9.56066,3.43934Q9.30996,3.18864,9,3.08099ZM1.43934,7.56066Q1,7.12132,1,6.5L1,2.5Q1,1.87868,1.43934,1.43934Q1.87868,1,2.5,1L6.5,1Q7.12132,1,7.56066,1.43934Q8,1.87868,8,2.5L8,6.5Q8,7.12132,7.56066,7.56066Q7.12132,8,6.5,8L2.5,8Q1.87868,8,1.43934,7.56066Z" fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1"/></g></g></svg>';
  if (type == 'HSL') {

  }
  if (type == '透视') {

  }
  if (type == '渐变映射') {

  }
  if (type == '滤镜') {

  }
  if (type == '变形') {

  }
  var newEdit = document.createElement('div')
  newEdit.id = 'edits-'+ editorNum;
  newEdit.className = 'edits';
  newEdit.draggable = true;
  newEdit.innerHTML = chk + '<label for="chk-editor-' + editorNum + '" class="tags-editor"><div class="btn-text" style="width:10px;height:10px" onclick="if(this.parentNode.parentNode.firstChild.checked !== true) { this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)};">' + close + '</div>' + type + '<div class="btn-text" style="width:10px;height:10px"></div></label>' +  '<div class="btn-text" style="width:10px;height:10px;position: absolute;top:7px;right:-8px;" onclick="addEdit(this.parentNode.innerText,this);">' + copy + '</div>'
  if ( editTag.children.length == 0 ){
    editTag.appendChild(newEdit)
  } else {
    if (copynode){
      editTag.insertBefore(newEdit,copyEdit)
    } else {
      editTag.insertBefore(newEdit,editTag.children[0])
    }
  }
  
  editorPick = editorNum;
  editorNum++;
  editsID()
}
function editorChk(node,e) {
    if (e !== editorPick) {
      document.getElementById('chk-editor-' + editorPick).checked = false;
      node.checked = true;
      editorPick = e;
      //console.log("new", editorPick, e)
    } else {
        //node.checked = false;
        //console.log("copy", editorPick, e)
        node.checked = true;
        //console.log("old", editorPick, e)

  }
}

//拖拽编辑标签
function editsID(){  
  for (var i = 0; i < dragSources.length; i++) {
    dragSources[i].addEventListener('dragstart', function(event) {
      event.dataTransfer.setData("text/plain", event.target.id); 
      dropStartY = event.clientY;
    });
  
    dragSources[i].addEventListener('dragend', function(event) {
      event.dataTransfer.clearData("text/plain");
      dropEndY = event.clientY;
    });
  }
}

//梯度变化类型
function chkMix(type,checked){
  if (checked){
    mixType.push(type)
    //console.log(mixType)
  } else {

    if(mixType.includes(type)){
      mixType = mixType.filter(item => item !== type)
      //console.log(mixType)
    }
  }
}

//查找相似类型
function chkSame(type,checked){
  if (checked){
    searchSameType.push(type)
  } else {

    if(searchSameType.includes(type)){
      searchSameType = searchSameType.filter(item => item !== type)
    }
  }
}


//查找并选中
function searchToRe(info) {
  message([{ area: searchArea, type: searchType, info: info }, 'searchToRe'])
}
//查找类型
function chkSearchType(e) {
  if (e.id.split("-")[2] !== searchType) {
    message([{ area: searchArea, type: e.id.split("-")[2], info: searchInfo }, 'searchToRe'])
  }
  //var type = ["Text", "Component", "ComponentSet", "Font"]
  var type = ["Text", "Name"]

  for (var i = 0; i < type.length; i++) {
    document.getElementById("chk-for-" + type[i]).checked = false
  }

  e.checked = true
  searchType = e.id.split("-")[2]

}

//输入倍数
function chkNum(e) {
  for (var i = 0; i < 4; i++) {
    document.getElementById('chk-num-list').style.opacity = '1';
    document.getElementById('chk-num-' + i).checked = false;
    document.getElementById('chk-num-' + e).checked = true;
  }
  document.getElementById('input-num-2').value = e + 1;
  document.getElementById('input-num-2').style.color = 'var(--boxBod)';
}

//选择倍数
function numSize() {
  for (var i = 0; i < 4; i++) {
    document.getElementById('chk-num-' + i).checked = false;

  }
  document.getElementById('input-num-2').style.color = 'var(--mainColor)';
  if (document.getElementById('input-num-2').value != "") {
    document.getElementById('chk-num-list').style.opacity = '0.5';
  } else {
    document.getElementById('chk-num-list').style.opacity = '1';
  }
}


//缩放中心
function chkScaleCenter(e) {
  var center = ["TL", "TC", "TR", "CL", "CC", "CR", "BL", "BC", "BR"]
  for (var i = 0; i < center.length; i++) {
    document.getElementById("chk-scale-" + center[i]).checked = false
  }
  e.checked = true
  scaleCenter = e.id.split("-")[2]
}
//缩放类型
function chkScaleType(e) {
  var type = ["W", "H", "WH"]
  if (scaleType != e.id.split("-")[2]) {
    if (e.id.split("-")[2] == "WH") {
      document.getElementById("input-num-scale").value = 100;
    } else {
      document.getElementById("input-num-scale").value = 0;
    }
  }
  for (var i = 0; i < type.length; i++) {
    document.getElementById("chk-scale-" + type[i]).checked = false
  }

  e.checked = true
  scaleType = e.id.split("-")[2]

}
//等比缩放
function chkScale(s) {
  //message([{center:scaleCenter,type:scaleType,value:s},'scaleSelf'])
}

//遍历剩余标签，读取对应数组的宽高，并发往主线程，以创建画板
function createrObj() {
  if (createrType == "frame") {
    console.log('已上传数量：' + allFrame.length);

    for (var i = 0; i < allFrame.length; i++) {
      if (document.getElementById('tag-' + i).style.display !== 'none') {
        finalFrame.push(allFrame[i])
      }
    }
    console.log('已选择：' + finalFrame.length);
    message([finalFrame, "createrframe"])
    finalFrame = [];
  }

}

//选择转矢量类型
function chkVector(e) {
  for (var i = 0; i < 4; i++) {
    document.getElementById('chk-vector-' + i).checked = false;
    document.getElementById('chk-vector-' + e).checked = true;
  }
}

//返回图片宽高信息和分段，恢复图片原尺寸
function imgURLtoWH(e) {
  var img = new Image();
  img.src = e.imgURL;
  img.onload = function () {
    message([{ w:img.width, h:img.height,index:e.index}, 'imgWH'])
  }
}

//添加噪点
function noise() {
  var noiseV = document.getElementById('input-num-tjzs').value
  var dom = document.createElement('canvas');
  dom.width = 512;
  dom.height = 512;
  var ctx = dom.getContext('2d');
  /*
  for (let y = 0; y < e[0]; y++) {
    for (let x = 0; x < e[1]; x++) {
      var color = Math.floor(Math.random() * 12 + (255 - 16)).toString(16);
      ctx.fillStyle = `#${color}${color}${color}`;
      ctx.fillRect(x, y, 1, 1);
    };
  };
  */
  for (var i = 0; i < noiseV * 65536; i++) {
    var x = Math.random() * dom.width;
    var y = Math.random() * dom.height;
    var color = Math.floor(Math.random() * 6 + (255 - 16)).toString(16);
    //ctx.fillStyle = `#${color}${color}${color}`;
    ctx.fillStyle = 'rgba(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + (Math.random() * 0.5 + 0.5) + ')';
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 0.5, 0, 6);
    ctx.fill();
  }
  var url = dom.toDataURL(`image/png`, 0.6);
  return B64ToU8A(url.split(',')[1]);

}


function reCenter(event, node) {
  var XY = [event.pageX - node.x, event.pageY - node.y]
  var x = Math.round(inView.x + XY[0] * inView.s)
  var y = Math.round(inView.y + XY[1] * inView.s)
  singleClick = false;
  //console.log(node)
  //console.log(x,y,node.width,node.height,XY,inView.s)
  message([{ x: x, y: y }, "reCenter"])


}

//斜切
function skew(e) {
  if (e) {
    var skewInfo = {
      x: parseInt(document.getElementById('input-num-skewW').value),
      y: parseInt(document.getElementById('input-num-skewH').value),
      w: parseInt(document.getElementById('input-num-scaleW').value),
      h: parseInt(document.getElementById('input-num-scaleH').value),
    }
    //console.log(skewInfo)
    message([skewInfo, 'skewSet'])
  } else {
    document.getElementById('slider-skewW').value = 0;
    document.getElementById('slider-skewH').value = 0;
    document.getElementById('input-num-skewW').value = 0;
    document.getElementById('input-num-skewH').value = 0;
    document.getElementById('slider-scaleW').value = 100;
    document.getElementById('slider-scaleH').value = 100;
    document.getElementById('input-num-scaleW').value = 100;
    document.getElementById('input-num-scaleH').value = 100;
    message([{ x: 0, y: 0, w: 100, h: 100 }, 'skewSet'])
  }

}


//////使用八叉树提取色表//////
//定义八叉树
class OctreeNode {
  constructor(level, parent) {
      this.level = level; // 当前节点所在的层次
      this.pixelCount = 0; // 当前节点包含的像素数量
      this.redSum = 0;     // 红色分量的总和
      this.greenSum = 0;   // 绿色分量的总和
      this.blueSum = 0;    // 蓝色分量的总和
      this.paletteIndex = -1; // 如果该节点是一个叶子节点，记录其在调色板中的索引
      this.children = new Array(8); // 子节点数组
      this.parent = parent; // 父节点引用
  }

  // 判断当前节点是否为叶子节点
  isLeaf() {
      return this.children.every(child => child === undefined);
  }

  // 获取当前节点的平均颜色
  getAverageColor() {
      if (this.pixelCount === 0) return [0, 0, 0];
      return [
          Math.round(this.redSum / this.pixelCount),
          Math.round(this.greenSum / this.pixelCount),
          Math.round(this.blueSum / this.pixelCount)
      ];
  }
}
//构建八叉树
class OctreeQuantizer {
  constructor(maxDepth) {
      this.maxDepth = maxDepth;
      this.root = new OctreeNode(0, null);
      this.palette = [];
      this.leafNodes = [];
  }

  // 插入一个像素到八叉树中
  insertPixel(pixel) {
      let node = this.root;
      for (let level = 0; level < this.maxDepth; level++) {
          const index = this.getOctantIndex(pixel, level);
          if (!node.children[index]) {
              node.children[index] = new OctreeNode(level + 1, node);
          }
          node = node.children[index];
      }
      node.pixelCount++;
      node.redSum += pixel[0];
      node.greenSum += pixel[1];
      node.blueSum += pixel[2];
  }

  // 根据当前层级获取八叉树索引
  getOctantIndex(pixel, level) {
      const bitShift = 8 - level - 1;
      const redBit = (pixel[0] >> bitShift) & 0x1;
      const greenBit = (pixel[1] >> bitShift) & 0x1;
      const blueBit = (pixel[2] >> bitShift) & 0x1;
      return (redBit << 2) | (greenBit << 1) | blueBit;
  }

  // 合并叶子节点以减少颜色数量
  reduceColors(targetColors) {
      while (this.leafNodes.length > targetColors) {
          let deepestNode = null;
          for (const leaf of this.leafNodes) {
              if (!deepestNode || leaf.level > deepestNode.level) {
                  deepestNode = leaf;
              }
          }
          this.mergeNode(deepestNode);
      }
  }

  // 合并一个节点
  mergeNode(node) {
      if (!node.isLeaf()) return;

      node.parent.pixelCount += node.pixelCount;
      node.parent.redSum += node.redSum;
      node.parent.greenSum += node.greenSum;
      node.parent.blueSum += node.blueSum;
      node.parent.children[node.getIndex()] = undefined;

      const index = this.leafNodes.indexOf(node);
      if (index !== -1) {
          this.leafNodes.splice(index, 1);
      }
      if (node.parent.isLeaf()) {
          this.leafNodes.push(node.parent);
      }
  }

  // 生成调色板
  generatePalette() {
      this.leafNodes = [];
      this.collectLeaves(this.root);

      this.palette = this.leafNodes.map((leaf, index) => {
          leaf.paletteIndex = index;
          return leaf.getAverageColor();
      });
  }

  // 收集所有叶子节点
  collectLeaves(node) {
      if (node.isLeaf()) {
          this.leafNodes.push(node);
      } else {
          for (const child of node.children) {
              if (child) {
                  this.collectLeaves(child);
              }
          }
      }
  }

  // 获取调色板
  getPalette() {
      return this.palette;
  }
}

//载入图片数据
async function imgDataSet(imgDataOld,imgDataNew,isNew) {
  //console.log(imgExportInfo)
    if(isNew == "new"){
      imgExportData = [];
      var imgData = imgDataNew;
      for (var i = 0; i < imgData.length; i++) {
        var fileName = document.getElementById('fileName-' + i).value;
        var s = document.getElementById('exportSize-' + i).value;
        var colorBox = await getColorBox2(imgData[i]);//八叉树法
        imgExportData.push({u8a:imgData[i],src:U8AToB64(imgData[i]),fileName: fileName,s:s,col:colorBox})
        //console.log(imgExportData)
        if ( imgData[i].length/1000 <= s || s == ''){
          document.getElementById('imgsize-' + i).innerHTML =  Math.floor(imgData[i].length/1000)  + 'k /无需压缩' 
        } else {
          document.getElementById('imgsize-' + i).innerHTML =  Math.floor(imgData[i].length/1000) + 'k /<span style="color:var(--liColor1)">待压缩</span>' 
        }
    }
    }else{
      var imgData = imgDataNew;

      var index = exportNum - imgDataNew.length
      //console.log(exportNum,index)
      for (var i = 0; i < imgData.length; i++) {
        
        if ( document.getElementById('fileName-' + (i + index)) ){
          var fileName = document.getElementById('fileName-' + (i + index)).value
          var s = document.getElementById('exportSize-' + (i + index)).value
        } else {
          var fileName = ''
          var s = ''
        }
        var colorBox = await getColorBox2(imgData[i]);//八叉树法 
        imgExportData.push({u8a:imgData[i],src:U8AToB64(imgData[i]),fileName: fileName,s:s,col:colorBox})
      }

      //console.log(imgExportData)
      for (var i = 0; i < imgData.length; i++) {
        //console.log((i + index - 1))
        if ( imgExportData[(i + index)].u8a.length/1000 <= imgExportData[(i + index)].s || imgExportData[(i + index)].s == ''){
          document.getElementById('imgsize-' + (i + index)).innerHTML =  Math.floor(imgExportData[(i + index)].u8a.length/1000)  + 'k /无需压缩' 
        } else {
          document.getElementById('imgsize-' + (i + index)).innerHTML =  Math.floor(imgExportData[(i + index)].u8a.length/1000) + 'k /<span style="color:var(--liColor1)">待压缩</span>' 
        }
      }

    }

}
function getColorBox2(imgDatas){
  return new Promise((resolve, reject) => {
    var blob = new Blob([imgDatas], { type: 'image/png' }); 
    var url = URL.createObjectURL(blob);
    var img = new Image()
    img.src = url;

    img.onload = function(){
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img,0,0)
      var imageData = ctx.getImageData(0,0,img.width,img.height)
      var data = imageData.data;

      function quantizeImage(datas) {
        const octree = new OctreeQuantizer(3); // 设置最大深度

        // 插入每个像素到八叉树中
        for (let i = 0; i <  datas.length; i += 4) {
            const r =  datas[i];
            const g =  datas[i + 1];
            const b =  datas[i + 2];
            octree.insertPixel([r, g, b]);
        }

        // 减少颜色数量
        octree.reduceColors(128);

        // 生成调色板
        octree.generatePalette();

        return octree.getPalette();
      }

      resolve(quantizeImage(imageData.data))

    }
  })
}

//导出图片为zip
async function exportImg(){
  //console.log(666)
  if(imgExportData.length > 0){
    //console.log(777)
    try {
      //console.log(888)
      const compressedImages = await compressImages(imgExportData);
      createZipAndDownload(compressedImages);
    } catch (error) {
      console.error('处理过程中发生错误:', error);
    }
  }
  
}

//单个图片的压缩
function compressImage(blob,quality,type,colorBox) {
   //console.log(u8a,quality,type)
    if (type == 'jpg' || type == 'jpeg'){
      //console.log(type)
      return new Promise((resolve, reject) => {
        //var blob = new Blob([u8a], { type: 'image/jpeg' });
        var file = new File([blob],'image.jpg',{type:'image/jpeg'})
        //console.log(file)
        new Compressor(file, {
          quality:quality/10,
          success(result) {
            resolve(result);
          },
          error(err) {
            reject(err);
          },
        });
      });
    } else if ( type == 'png') {
      var colorThief = new ColorThief();
      return new Promise((resolve, reject) => {
        //var blob = new Blob([u8a], { type: 'image/png' });    
        if(quality == 10){
          resolve(blob)
        } else {
          var url = URL.createObjectURL(blob);
          var img = new Image()
          img.src = url;

          img.onload = function(){
            var palette = colorThief.getPalette(img,20,1)//提取关键颜色
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d')
            ctx.drawImage(img,0,0)
            var imageData = ctx.getImageData(0,0,img.width,img.height)
            var data = imageData.data;
            var colorcut = new Promise((resolve, reject) => {
              var deep = [0,2,6,8,12,14,16,18,20,22]
              var newStep = deep[Math.floor(10 - quality)];  

              function toStep(value,step){//通过步长限定色值（失真）
                return Math.round(value/step)*step
              }

              function findColor(r,g,b){//通过色板简化颜色（保真）
                var palette2 = [...palette,...colorBox];
                //console.log(palette2)
                var minDist = Infinity;
                var keyColor = null;
                
                if ( !palette2.includes([r,g,b])){
                  for ( var i = 0; i < palette2.length; i++){
                    //var dist = Math.abs(palette2[i][0] - r) + Math.abs(palette2[i][1] - g) + Math.abs(palette2[i][2] - b);
                    var dist = Math.sqrt(
                      Math.pow(palette2[i][0] - r,2) + Math.pow(palette2[i][1] - g,2) + Math.pow(palette2[i][2] - b,2)
                    )
                    if ( dist < minDist){
                      minDist = dist;
                      keyColor = [palette2[i][0],palette2[i][1],palette2[i][2]]
                    }
                  }
                } else {
                  keyColor = [r,g,b]
                }
                
                return keyColor
              }

              //*
              for (var i = 0; i < data.length; i += 4){
                var [r,g,b,a] = [data[i],data[i + 1],data[i + 2],data[i + 3]];
                var x = (i / 4) % img.width,y = Math.floor((i / 4) / img.width);//获取像素坐标
                if(r !== g && r !== b && g !== b ){
                  data[i] = toStep(r,newStep);
                  data[i + 1] = toStep(g,newStep);
                  data[i + 2] = toStep(b,newStep);
                }
                if ( quality < 5){
                  if ( a < 10 || a > 245){
                    data[i + 3] = a;
                  } else {
                    var stepA = Math.ceil(2.5 * ((10 - quality)/10 + 1));
                    newA = Math.floor((a - 1) / stepA) * stepA + 1;
                    ea = newA - data[i + 3];
                    data[i + 3] = newA;

                    function floyd(dx,dy,factor){//误差扩散
                      if (x + dx >= 0 && x + dx < img.width && y + dy < img.height){
                        var newIndex = ((y + dy) * img.width + (x + dx)) * 4;//当前像素的周围像素
                        data[newIndex + 3] += ea * factor;//抖动
                      }
                    }
                    //*
                    floyd(1,0,7/32)
                    floyd(-1,1,3/32)
                    floyd(0,1,4/32)
                    floyd(1,1,2/32)
                    floyd(2,0,6/32)
                    floyd(-2,2,2/32)
                    floyd(0,2,5/32)
                    floyd(2,2,3/32)//矩阵
                    //*/
                  }
                } else {
                  data[i + 3] = a;
                }
              }
              //*/

              if ( quality == 9){
                for (var i = 0; i < data.length; i += 4){
                  var [r,g,b,a] = [data[i],data[i + 1],data[i + 2],data[i + 3]];
                  var x = (i / 4) % img.width,y = Math.floor((i / 4) / img.width);//获取像素坐标
                  if(r !== g && r !== b && g !== b ){
                    var cl = findColor(r,g,b);
                    var er = r - cl[0], eg = g - cl[1], eb = b - cl[2];
                    data[i] = cl[0];
                    data[i + 1] = cl[1];
                    data[i + 2] = cl[2];
                    function floyd(dx,dy,factor){//误差扩散
                      if (x + dx >= 0 && x + dx < img.width && y + dy < img.height){
                        var newIndex = ((y + dy) * img.width + (x + dx)) * 4;//当前像素的周围像素
                        data[newIndex] += er * factor;
                        data[newIndex + 1] += eg * factor;
                        data[newIndex + 2] += eb * factor;//抖动
                      }
                    }
                    //*
                    floyd(1,0,7/32)
                    floyd(-1,1,3/32)
                    floyd(0,1,4/32)
                    floyd(1,1,2/32)
                    floyd(2,0,6/32)
                    floyd(-2,2,2/32)
                    floyd(0,2,5/32)
                    floyd(2,2,3/32)//矩阵
                    //*/
                    
                  }
                }

              }
              ctx.putImageData(imageData,0,0);
              canvas.toBlob(function(blob){
                resolve(blob)
              },'image/png')
            })

            resolve(colorcut)
          }
        }
        
      })
      //return new Blob([u8a], { type: 'image/png' });
    } else if ( type == 'webp') {
      return new Promise((resolve, reject) => {
        //var blob = new Blob([u8a], { type: 'image/png' });
        var url = URL.createObjectURL(blob);
        var img = new Image()
        img.src = url;

        img.onload = function(){
          var palette = colorThief.getPalette(img,20,1)
          //console.log(Math.pow(2,quality*10))
          var canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext('2d')
          ctx.drawImage(img,0,0)
          canvas.toBlob(function(blob){
            resolve(blob)
          },'image/webp',(quality/10))
        }
      })
    }
  
}

// 批量压缩
async function compressImages(imgExportData) {
  //console.log(999)
  var imageDataArray = imgExportData.map(item => item.u8a)
  var targetSize = imgExportData.map(item => item.s*1000)
  var type = imgExportData.map(item => item.fileName.split('.').pop())
  var colorBox = imgExportData.map(item => item.col)
  const compressedImages = [];
  for (let i = 0; i < imageDataArray.length; i++) {
    var quality = 10; // 初始压缩质量
    //console.log(111)
    var result = new Blob([imageDataArray[i]], { type: 'image/png' });//初始化
    //console.log(222,result.size,[i],imageDataArray[i].length,targetSize[i])
    //if (targetSize[i] && imageDataArray[i].length > targetSize[i] ){//已删除该判断，会导致非png格式编码错误
    var newBlob = new Blob([imageDataArray[i]], { type: 'image/jpeg' });
      do {
        try {
          result = await compressImage(newBlob, quality,type[i],colorBox[i]);
          if (quality == 9){//先上256色+扩散算法，后面靠减色压缩
            newBlob = result;
          }
          if (targetSize[i] && result.size > targetSize[i] && quality > 1) {
            if ( quality - 1 >= 0){
              console.log("压缩质量:" + quality )
              quality -= 1; // 如果超过目标大小，减少质量再次尝试
            } else {
              quality = 0;
            }
            
            //console.log(result.size/1000 + 'k')
          } else {
            if ( !targetSize[i] || result.size <= targetSize[i] ){
              //console.log(targetSize[i])
              document.getElementById('imgsize-' + i ).innerHTML =  Math.floor(result.size/1000) + "k /质量:" + Math.ceil(quality) 
            } else {
              if (result.size){
                document.getElementById('imgsize-' + i ).innerHTML = '<span style="color:var(--liColor1)">' +  Math.floor(result.size/1000) + "k /压缩失败</span>"
              } else {
                document.getElementById('imgsize-' + i ).innerHTML = '<span style="color:var(--liColor1)">' +  Math.floor(result.length/1000) + "k /压缩失败</span>"
              }
              
            }
            //console.log(result)
            break;
          }
        } catch (error) {
          console.error('压缩过程中发生错误:', error);
          break;
        }
      } while (result.size > targetSize[i]);
    //}//已删除该判断，会导致非png格式编码错误
    

    compressedImages.push(result);
  }
  return compressedImages;
}

// 创建ZIP文件并提供下载
function createZipAndDownload(compressedImages) {
  var MN = new Date()
  var M = String(MN.getMonth() + 1).padStart(2, '0');
  var N = String(MN.getDate()).padStart(2, '0');
  var HHMMSS = String(MN.getHours()).padStart(2, '0') + String(MN.getMinutes()).padStart(2, '0') + String(MN.getSeconds()).padStart(2, '0');
  var zip = new JSZip();

  var imgs = imgExportData;
  compressedImages.forEach((blob, index) => {
    var path = imgs[index].fileName.split('/');
    var name = path.pop();
    if (imgs[index].fileName.split('/').length == 2) {
      var folder = zip.folder(path[0]);
      folder.file(name,blob);
    } else if (imgs[index].fileName.split('/').length == 3) {
      var folder1 = zip.folder(path[0]);
      var folder2 = folder1.folder(path[1]);
      folder2.file(name,blob);
    } else {
      zip.file(name,blob);
    }
  });


  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, docInfo + '-' + M + N + '_' + HHMMSS + '.zip');
  });
}

//大图导入裁剪
function cutImg(file, name) {
  if (file instanceof File) {
    // 处理文件
    //console.log('这是一个文件');
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var url = URL.createObjectURL(new Blob([data]));
      cutImgToCanvas(url)
    };
  } else if (typeof file === 'string') {
    // 处理字符串
    //console.log(file)
    cutImgToCanvas(file)
    //console.log('这是一个字符串');
  } else {
    // 其他类型的处理
    console.log('未知类型输入');
  }



  function cutImgToCanvas(url) {

    var canvas = document.createElement("canvas")
    var ctx = canvas.getContext("2d")

    var image = new Image();
    image.src = url;
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;

      requestAnimationFrame(function draw() {
        // 绘制图片
        ctx.drawImage(image, 0, 0);
        var cuts = creCutArea({ w: canvas.width, h: canvas.height, x: 0, y: 0, s: 1 },4096);
        // 检查图片是否完全绘制
        if (image.complete) {
          //console.log(cuts.length)
          var cutImgs = []
          for (var i = 0; i < cuts.length; i++) {
            var canvas2 = document.createElement("canvas");
            canvas2.width = cuts[i].w;
            canvas2.height = cuts[i].h;
            var ctx2 = canvas2.getContext("2d");
            //requestAnimationFrame(function draw() {
            ctx2.drawImage(canvas, cuts[i].x, cuts[i].y, cuts[i].w, cuts[i].h, 0, 0, cuts[i].w, cuts[i].h);
            var imgData = new Uint8Array(atob(canvas2.toDataURL('image/png').split(',')[1]).split('').map(function (c) { return c.charCodeAt(0); }));
            if (cuts.length > 1) {
              cutImgs.push({ img: imgData, w: canvas2.width, h: canvas2.height, name: name + "-" + (i + 1), x: cuts[i].x, y: cuts[i].y })
            } else {
              cutImgs.push({ img: imgData, w: canvas2.width, h: canvas2.height, name: name, x: cuts[i].x, y: cuts[i].y })
            }

            //});  
            if (i == cuts.length - 1) {
              //console.log(cutImgs)
              message([cutImgs, 'pixelIm'])
            }
          }

        }

      });
    }

  }

}

//svg拆解
function processSVG(svgCode) {

  // 创建一个新的DOM解析器
  var parser = new DOMParser();
  // 解析SVG代码
  var svgDoc = parser.parseFromString(svgCode, 'text/xml');
  var svgRoot = svgDoc.documentElement;
  //console.log(svgRoot)
  // 结果数组
  var result = [];
  // 开始遍历
  traverse(svgRoot);
  function traverse(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName.toLowerCase() === 'image') {
        // 处理image节点
        var imgs = cutImg(node.getAttribute('xlink:href'), "图片")
      }
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      traverse(node.childNodes[i]);
    }
  }
}

//裁切方案
function creCutArea(info,mix) {//{w:,h:,x:,y:,s:}
  var W = info.w, H = info.h;//图片宽高
  var Ws = info.w, Hs = info.h;//非尾部部分的裁剪宽高
  var lastWs = info.w, lastHs = info.h;//尾部的裁剪宽高
  var X = info.x, Y = info.y;//裁切区坐标
  var cutW = 1, cutH = 1;//纵横裁剪数量
  var cuts = [];//从左到右，从上到小的裁切区域集
  var tips;
  //切割方案
  if (W * info.s <= mix && H * info.s <= mix) {//4K以内，正常生成
    cuts = [{ w: W, h: H, x: info.x, y: info.y, s: 1 }]
    return cuts;
  } else {//多行列宫格
    cutW = Math.ceil((W * info.s) / mix)
    cutH = Math.ceil((H * info.s) / mix)
    if (W % cutW == 0) { //宽度刚好等分
      Ws = W / cutW
      lastWs = Ws

    } else { //有小数点
      Ws = Math.ceil(W / cutW) //向上取整，最后一截短一些
      lastWs = W - (Ws * (cutW - 1))
    }
    if (H % cutH == 0) { //长度刚好等分
      Hs = H / cutH
      lastHs = Hs
      tips = "高被整除"
    } else { //有小数点
      Hs = Math.ceil(H / cutH) //向上取整，最后一截短一些
      lastHs = H - (Hs * (cutH - 1))
      tips = "高不能整除，剩余：" + lastHs
    }

    // 拆分图像数据
    for (var i = 0; i < (cutW * cutH); i++) {

      if ((i + 1) % cutW == 0 && i !== (cutW * cutH) - 1 && i !== 0) {
        cuts.push({ w: lastWs, h: Hs, x: X, y: Y, });
        Y = Y + Hs;
        X = info.x;
      } else if (i == (cutW * cutH) - 1) {
        cuts.push({ w: lastWs, h: lastHs, x: X, y: Y, t: tips });
      } else {
        if (i > (cutW * (cutH - 1)) - 1) {
          cuts.push({ w: Ws, h: lastHs, x: X, y: Y });
        } else {
          cuts.push({ w: Ws, h: Hs, x: X, y: Y });
        }

        if (cutW == 1) {
          X = info.x;
          Y = Y + Hs;
        } else {
          X = X + Ws;
        }

      }

    }
    return cuts;
  }

}
