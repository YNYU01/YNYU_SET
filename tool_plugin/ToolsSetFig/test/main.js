/*静态数据或对象*/
const UI_MINI = [208,460];
const UI = [300,660];
const UI_BIG = [620,660];
const sideMix = document.querySelector('[data-side-mix]');
const sideMask = document.querySelector('[data-side-mask]');
const btnHelpDoc = document.querySelector('[data-btn="help"]');
const btnMore = document.getElementById('btn-more');
const btnResize = document.querySelector('[data-resize-window]');
const btnBig = document.getElementById('big');
const TV_text = document.querySelector('[data-tv-text]');
const dropUp = document.querySelector('[data-drop="upload"]');
const fileInfo = document.querySelector('[data-file-info]');
const btnHelp = document.querySelectorAll('[data-help]');
const dailog = document.querySelector('[data-dailog]');
const dailogBox = document.querySelector('[data-dailog-box]');
const dailogImg = document.querySelector('[data-dailogimg]');
const dailogImgBox = document.querySelector('[data-dailogimg-box]');
const dailogSearchBox = document.querySelector('[data-dailogsearch-box]');
const dailogLogin = document.querySelector('[data-dailoglogin]');
const dailogLoginBox = document.querySelector('[data-dailoglogin-box]');
const imgnumSet = document.getElementById('imgnum-set');
const skillSearchInput = document.getElementById('skillsearch');
const skillTypeBox = document.querySelector('[data-skilltype-box]');
const skillAllBox = document.querySelector('[data-skills-box]');
const skillSecNode = document.querySelectorAll('[data-skill-sec]');
const skillStar = document.querySelectorAll('[data-skill-star]');
const skillAllModel = document.querySelectorAll('[data-skillmodule]');
const skillStarModel = document.querySelector('[data-skillmodule="Useful & Starts"]');
const selectInfoBox = document.querySelectorAll('[data-selects-node]');
const createTagsBox = document.querySelector('[data-create-tags]');
const cataloguesBox = document.querySelector('[data-create-catalogues]');
const editorViewbox = document.querySelector('[data-editor-viewbox]');
const exportTagsBox = document.querySelector('[data-export-tags]');
const skillBtnMain = document.querySelectorAll('[data-btn="skill-main"]');
const clearCreateTags = document.querySelector('[data-create-tags-box]').querySelector('btn-close').parentNode;
const convertTags = document.getElementById('upload-set-1');
const getTableText = document.getElementById('upload-set-2');
const templateBtn = document.getElementById('upload-set-3');
const chkTablestyle = document.getElementById('chk-tablestyle');
const chkSelectcomp = document.getElementById('chk-selectcomp');
const createAnyBtn = document.querySelector('[data-create-any]');
const exportAnyBtn = document.querySelector('[data-export-any]');
const createTableBtn = document.querySelector('[data-create-table]');
const tableStyleSet = document.querySelector('[data-tablestyle-set]');
const styleTosheet = document.querySelector('[data-en-text="Style To Sheet"]');
const sheetTostyle = document.querySelector('[data-en-text="Sheet To Style"]');
const btnLinkstyle = document.querySelector('[data-linkstyle-add]');
const btnSelectstyle = document.querySelector('[data-selectstyle-add]');
const btnVariables = document.querySelector('[data-variables-add]');
const manageLinkstyleList = document.querySelector('[data-manage-linkstyle-list]');
const manageSelectstyleList = document.querySelector('[data-manage-selectstyle-list]');
const manageVariablesList = document.querySelector('[data-manage-variables-list]');


let skillModel = [];
let skilltypeNameNode = document.querySelectorAll('[data-skillmodule]');
skilltypeNameNode.forEach(item => {
  let name1 = item.getAttribute('data-skillmodule-zh');
  name1 = name1 ? name1 : item.textContent.trim();
  let name2 = item.getAttribute('data-skillmodule');
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
let skillsSearch = []

/*表单绑定*/
const userImg = document.getElementById('input-user-img');
const userTable = document.getElementById('input-user-table');
const userZy = document.getElementById('input-user-zy');
const userTableTitle = document.getElementById('input-user-table-title');
const frameName =  document.getElementById('input-framename');
const userText = document.getElementById('upload-textarea');
let textareaLineNum = 20;

const pixelScale = document.getElementById('input-pixelScale');
let scaleSetX = getElementMix('data-scaleset-x').querySelector('[data-input="value"]');
let scaleSetY = getElementMix('data-scaleset-y').querySelector('[data-input="value"]');
let skewSetX = getElementMix('data-skewset-x').querySelector('[data-input="value"]');
let skewSetY = getElementMix('data-skewset-y').querySelector('[data-input="value"]');
let skewRangeX = getElementMix('data-skewset-x').querySelector('[data-input="range"]');
let skewRangeY = getElementMix('data-skewset-y').querySelector('[data-input="range"]');
let uniformS = document.getElementById('uniform-set-s');
let uniformW = document.getElementById('uniform-set-w');
let uniformH = document.getElementById('uniform-set-h');

/*动态数据或对象*/
let CreateImageInfo = [];
let CreateTableInfo = [];
let SelectNodeInfo = [];
let ExportImageInfo = [];
let CataloguesInfo = [];
let EditorInfo = {
  preview:'',//u8a
  set:[],//{type:HSL | HUE | }
  new:[],//{type:image | fills | node,content:[u8a | array]}
}

let isResize = false;
let reStartW,reStartH,reStartX,reStartY;
let tableTitleMust = userTableTitle.getAttribute('placeholder').split(',');
let imageType = document.getElementById('input-user-img').getAttribute('accept').split(',').map(item => item.replace('.',''));
let tableType = document.getElementById('input-user-table').getAttribute('accept').split(',').map(item => item.replace('.',''));
let zyType = document.getElementById('input-user-zy').getAttribute('accept').split(',').map(item => item.replace('.',''));
let frameNmaeSelect = [];
frameName.nextElementSibling.querySelectorAll('[data-option="option"]')
.forEach(item => {
  frameNmaeSelect.push(item.getAttribute('data-option-value'));
});

window.addEventListener('load',()=>{
  let time = getTime('HH')[0];
  if(time*1 > 20 && !PULGIN_LOCAL){
    nullPage();
    ISWORK_TIME = false;
    addToUserTips('worktime');
    return;
  };
  setTimeout(() => {
    /*clear*
    let tabs = ['create','export','editor','variable','sheet','more tools']
    viewPage(tabs[2])
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
    addSearchs();
  }, 100);
  
});

window.addEventListener('resize',/*防抖*/debounce(()=>{
  if(window.innerWidth < 300){
    TV_MOVE = true;
  } else {
    TV_MOVE = false;
  };
},500,true));


/* ---界面初始化--- */

//设置跳转链接
let hrefDoc = btnHelpDoc.getAttribute('href');
btnHelpDoc.setAttribute('href',`${hrefDoc}?type=fig&lan=${ROOT.getAttribute('data-language')}`);
let hrefTemplate = templateBtn.getAttribute('href');
templateBtn.setAttribute('href',`${hrefTemplate}?lan=${ROOT.getAttribute('data-language')}`);

getElementMix('language-1').addEventListener('change',()=>{
  //log(111)
  btnHelpDoc.setAttribute('href',`${hrefDoc}?type=fig&lan=${ROOT.getAttribute('data-language')}`);
  templateBtn.setAttribute('href',`${hrefTemplate}?lan=${ROOT.getAttribute('data-language')}`);
});

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
function addToUserTips(kind){
  let languge = ROOT.getAttribute('data-language');
  let num = languge == 'Zh' ? 0 : 1;
  let languge2 = languge == 'Zh' ? 'en' : 'zh';
  let random = toUserTips.random[Math.floor(Math.random()*toUserTips.random.length)]
  if(kind && kind == 'worktime') random = toUserTips.worktime;
  TV_text.textContent = random[num];
  TV_text.setAttribute('data-'+ languge2 +'-text',random[1 - num]);
  TV_text.setAttribute('data-'+ languge.toLowerCase() +'-text',random[num]);
  let textW;
  if(num){
    textW = random[num].length * -1 - 4 + 'ch';//英文1ch
  }else{
    textW = random[num].length * -2 - 4 + 'ch';//中文2ch
  }
  TV_text.parentNode.style.setProperty('--tv-w',textW)

};
//添加更多功能的二级标题
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
//处理选中图层的信息（基础）
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
    skewRangeX.value = transform[0];
    skewSetY.value = transform[1];
    skewRangeY.value = transform[1];
    /*
    const inputEvent = new Event('input', { bubbles: true });
    skewSetX.dispatchEvent(inputEvent);
    skewSetY.dispatchEvent(inputEvent);
    */
    
    let clipRC = info[0][4];
    getElementMix('data-clip-h-set').querySelector(`[data-radio-main="true"]`).setAttribute('data-radio-main','false');
    getElementMix('data-clip-w-set').querySelector(`[data-radio-main="true"]`).setAttribute('data-radio-main','false');
    getElementMix('data-clip-h-set').querySelector(`[data-radio-data="${clipRC[1]}"]`).setAttribute('data-radio-main','true');
    getElementMix('data-clip-w-set').querySelector(`[data-radio-data="${clipRC[0]}"]`).setAttribute('data-radio-main','true');
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
//提取功能点用于搜索定位
function addSearchs(){
  let skillMain = document.querySelectorAll('[data-btn="skill-main"]')
  let language = ROOT.getAttribute('data-language');
  skillMain.forEach(skill => {
    let zh = language == 'Zh' ? skill.textContent : skill.getAttribute('data-zh-text') || null;
    let en = skill.getAttribute('data-en-text') || null;
    if(!en && !zh){
      zh = '保留原图层';
      en = 'Pixel As Copy';
    }
    let ens = en ? en.toLowerCase().split(' ') : [];
    let zhs = zh ? zh.replace(/[a-z0-9\s]/gi,'').split('') : [];
    let key = [...zhs,...ens];
    let page = ['更多功能','more tools'];
    if(!getElementMix('data-page-name-en="more tools"').contains(skill)){
      let pages = document.querySelectorAll('[data-page-name-en]');
      pages.forEach(item => {
        if( item.contains(skill)){
          page = [item.getAttribute('data-page-name'),item.getAttribute('data-page-name-en')];
        };
      });
    };
    let path = [`${page[0]} > ... > ${zh}`,`${page[1]} > ... > ${en}`];
    if(key) skillsSearch.push({name:[zh,en],page:page,key:key,path:path,});
  });

  skillSecInfo.forEach(sec => {
    let page = ['更多功能','more tools'];
    let key = [...sec.name[0].replace(/[a-z0-9\s]/gi,'').split(''),...sec.name[1].toLowerCase().split(' ')]
    let path = [`更多功能 > ${sec.name[0]}`,`more tools > ${sec.name[1]}`]
    skillsSearch.push({name:sec.name,page:page,key:key,path:path,});
  });

  skillsSearch = language == 'Zh' ? skillsSearch.sort((a,b) => a.name[0].localeCompare(b.name[0])) : skillsSearch.sort((a,b) => a.name[1].localeCompare(b.name[1]));
  
  skillsSearch.forEach((list,index) => {
    let turnto = document.createElement('div');
    turnto.setAttribute('data-search-turnto',index);
    turnto.className = 'df-sc';
    let info = document.createElement('div');
    info.setAttribute('data-scroll','');
    info.className = 'df-ffc fl1 scrollbar';
    info.innerHTML = `
    <div data-search-name class="df-lc"
      data-zh-text="${list.name[0]}" 
      data-en-text="${list.name[1]}">
        ${language == 'Zh' ? list.name[0] : list.name[1]}
      </div>
      <div data-search-path 
      data-zh-text="${list.path[0]}" 
      data-en-text="${list.path[1]}">
        ${language == 'Zh' ? list.path[0] : list.path[1]}
    </div>
    `;
    turnto.appendChild(info);
    let btn = document.createElement('div');
    btn.className = 'df-cc'
    btn.setAttribute('data-btn','op');
    btn.setAttribute('data-zh-text','前往');
    btn.setAttribute('data-en-text','View');
    btn.textContent = language == 'Zh' ? '前往' : 'View';
    btn.onclick = ()=>{
      dailogSearchBox.parentNode.style.display = 'none';
      viewPage(list.page[1]);
      let viewskill = getElementMix('data-page-id="page"').querySelector(`[data-en-text="${list.name[1]}"]`);
      if(!viewskill) return;
      viewskill.scrollIntoView({behavior:"smooth",block: "center"});
      setTimeout(()=>{
        addFindBox(viewskill,list);
      },500);
    };
    turnto.appendChild(btn);
    dailogSearchBox.appendChild(turnto)
  });
 
  //重置文字样式
  loadFont(dailogSearchBox);
};

class EDITOR_TAB {
  constructor() {
    this.addset = getElementMix('data-editor-addset');//添加按钮
    this.setlist = getElementMix('data-editor-setlist');//调整列表
    this.setvalue = getElementMix('data-editor-setvalue');//属性窗口
    this.setcode = getElementMix('data-editor-setcode').querySelector('textarea');//代码编辑文本框
    //调整项
    this.editors = [
      {
        type:['色彩','Color'],
        options:[
          {
            name:['HSL','HSL'],
            editable:true,
            pixel:true,
          },
          {
            name:['反转','Invert'],
            editable:true,
            pixel:true,
          },
          {
            name:['色彩平衡','Balance'],
            editable:true,
            pixel:true,
          },
        ]
      },
      {
        type:['质感','Texture'],
        options:[
          {
            name:['颗粒','Graininess'],
            editable:false,
            pixel:true,
          },
          {
            name:['降噪','Denoise'],
            editable:false,
            pixel:true,
          },
          {
            name:['清晰度','noise'],
            editable:false,
            pixel:true,
          },
        ]
      },
      {
        type:['通道','Texture'],
        options:[
          {
            name:['色散','Dispersion'],
            editable:false,
            pixel:true,
          },
          {
            name:['渐变映射','noise'],
            editable:true,
            pixel:true,
          },
          {
            name:['LUT','LUT'],
            editable:true,
            pixel:true,
          },
          {
            name:['通道提取','RGBA'],
            editable:true,
            pixel:true,
          },
        ]
      },
      {
        type:['变形','Transform'],
        options:[
          {
            name:['贝塞尔曲线','Bessel'],
            editable:true,
            pixel:true,
          },
          {
            name:['透视','Perspective'],
            editable:true,
            pixel:true,
          },
        ]
      },
      
    ]
  }

  init(){
    //绑定添加按钮和可选项
    let addlistbox = document.createElement('div');
    addlistbox.setAttribute('data-editor-addlist','');
    addlistbox.setAttribute('data-select-options','');
    addlistbox.className = 'df-ffc pos-a noscrollbar';

    this.editors.forEach(editor => {
      let type = this.addDiffLanguage(addlistbox,editor.type,'div',true);
      type.setAttribute('data-option','type');
      editor.options.forEach(item => {
        let option = this.addDiffLanguage(addlistbox,item.name,'div',true);
        option.setAttribute('data-option','option');
        option.setAttribute('data-editor-editable',item.pixel);
        option.setAttribute('data-editor-pixel',item.editable);
      });

    });

    let editorSetBox = getElementMix('data-editor-setlist-title');
    editorSetBox.appendChild(addlistbox);

    this.addset.addEventListener('click',()=>{
      addlistbox.style.display = 'flex';
    });
    document.addEventListener('mousedown',(e)=>{
      if(!editorSetBox.contains(e.target)){
        addlistbox.style.display = 'none';
      };
    });
  }

  addDiffLanguage(parent,texts,tagname,isRun){
    let language = ROOT.getAttribute('data-language');
    tagname = tagname ? tagname : 'div';
    let diff = document.createElement(tagname);
    let type = 'text';
    //初始化时不需要考虑语言
    let text = isRun ? texts[0] : language == 'Zh' ? texts[0] : texts[1] ;
    switch (tagname){
      case 'div': 
      diff.textContent = text;
      diff.setAttribute('data-zh-' + type,texts[0]);
      diff.setAttribute('data-en-' + type,texts[1]);
      break
      case 'input': 
      diff.value = text;
      diff.setAttribute('data-input-must',texts[0]);
      diff.setAttribute('data-input-must-en',texts[1]);
      break
      default :
      diff.textContent = text;
      diff.setAttribute('data-zh-' + type,texts[0]);
      diff.setAttribute('data-en-' + type,texts[1]);
    };
    parent.appendChild(diff);
    return diff;
  };
}

let Editor = new EDITOR_TAB();
Editor.init();

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
document.addEventListener('mousedown',(event)=>{
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
          clearTimeout(MOVE_TIMEOUT);
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
//空内容提醒
function nullPage(){
  getElementMix('data-page-id').innerHTML = '';
  getElementMix('data-tab').style.pointerEvents = 'none'
};
//搜索功能
skillSearchInput.addEventListener('input',()=>{
  /*防抖*/
  let MOVE_TIMEOUT;
  if(MOVE_TIMEOUT){
      clearTimeout(MOVE_TIMEOUT);
  };
  MOVE_TIMEOUT = setTimeout(()=>{
    if(skillSearchInput.value.trim() == ''){
      document.querySelectorAll('[data-search-turnto]').forEach(item => {
        item.setAttribute('data-search-pick','false');
      });
      return;
    };
    let value = skillSearchInput.value.toLowerCase().trim()
    let values = value.split(' ');
    values = values.map(item => {
      if(item.replace(/[a-z0-9]/gi,'').length > 0){
        return item.replace(/[a-z0-9]/gi,'').split('');
      }
      return item;
    });
    values = [].concat(...values);
    values = [...new Set(values)];

    skillsSearch.forEach((skill,index) => {
      let list = getElementMix(`data-search-turnto="${index}"`);
      let diff = [...new Set([...skill.key,...values])];
      if(value == skill.name[0].toLowerCase().trim() || value == skill.name[1].toLowerCase().trim()){
        list.setAttribute('data-search-pick','true');
        return;
      };
      let samelength = (skill.key.length + values.length - diff.length);
      
      if( samelength > 0 ){
        if(samelength > 1){
          list.setAttribute('data-search-pick','0');
        } else {
          list.setAttribute('data-search-pick','1');
        }
      } else {
        let same = 0;
        values.filter(item => item.length >= 3).forEach(item => {
          skill.key.forEach(key => {
            if(key.includes(item)) same++;
          });
        });
        if(same > 0){
          list.setAttribute('data-search-pick','2');
        }else{
          list.setAttribute('data-search-pick','3');
        }
      }
    })
  },500);
});
function addFindBox(node,info,isForin){
  let renderBounds = node.getBoundingClientRect();
  //console.log(renderBounds);
  if(renderBounds.width == 0 && renderBounds.height == 0){
    if(isForin) return;
    let page = document.querySelector(`[data-page-name-en="${info.page[1]}"]`);
    let inputs = page.querySelectorAll('input[type="checkbox"]');
    inputs = Array.from(inputs).filter(item => item.id.toLowerCase().includes('more'));
    if(inputs){
      inputs.forEach(input => {
        input.checked = input.checked ? false : true;
        let inputEvent = new Event('change',{bubbles:true});
        input.dispatchEvent(inputEvent);
        addFindBox(node,info,true)
      });
    };
  };
  let findBox = document.createElement('div');
  findBox.className = 'pos-a';
  findBox.setAttribute('data-findbox','')
  findBox.setAttribute('style',`width:${renderBounds.width}px; height:${renderBounds.height}px; top:${renderBounds.y - 4}px; left:${renderBounds.x - 4}px`)
  document.querySelector('body').appendChild(findBox);
  setTimeout(()=>{findBox.remove()},2000);
}
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
dropUp.addEventListener('drop',async (e)=>{
  e.stopPropagation();
  e.preventDefault();
  dropUp.style.filter = '';
  dropUp.style.setProperty('--drop-df','visible');
  let files = Array.from(e.dataTransfer.files);

  let filesTypes = [...new Set(files.map(item => item.name.split('.')[item.name.split('.').length - 1].toLowerCase()))];
  let sameType = null;
  
  if(filesTypes.every(item => imageType.includes(item))){
    sameType = 'image';
  };
  if(filesTypes.every(item => tableType.includes(item))){
    sameType = 'table';
  };
  if(filesTypes.every(item => zyType.includes(item))){
    sameType = 'zy';
  };
  if(!sameType){
    let realyType = await tool.TrueImageFormat(files[0]);
    if(realyType && imageType.includes(realyType)){
      sameType = 'image';
    }
  }
  if(sameType){
    files = files.sort((a, b) => b.size - a.size);
    reFileInfo(files);
    switch (sameType){
      case 'image': addImageTags(files,true);break
      case 'table': addTableText(files,true);break
      case 'zy': addZyCatalogue(files);break
    }
  } else {
    tipsAll(['只能上传同类型文件','The file type must meet the requirements'],3000)
  }
  
});


userText.addEventListener('paste',(e) => {
  let pasted = e.clipboardData.getData('text/plain') //await navigator.clipboard.readText();
  
  if(pasted.includes('base64,')){
    userText.setAttribute('data-textarea-wrap','true');
    setTimeout(()=>{userText.scrollTop = 0})
  }else {
    userText.setAttribute('data-textarea-wrap','false');
  }
})
userText.parentNode.querySelector('[data-close]').addEventListener('click',()=>{
  userText.setAttribute('data-textarea-wrap','false');

  let linenums = getElementMix('data-textarea-linenum');
  textareaLineNum = 20;
  linenums.innerHTML = `<div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
  <div>10</div>
  <div>11</div>
  <div>12</div>
  <div>13</div>
  <div>14</div>
  <div>15</div>
  <div>16</div>
  <div>17</div>
  <div>18</div>
  <div>19</div>
  <div>20</div>`;

})
userText.addEventListener('scroll',()=>{
  let numbox = getElementMix('data-textarea-linenum-box');
  let linenums = getElementMix('data-textarea-linenum');
  numbox.scrollTop = userText.scrollTop;
  if(textareaLineNum*16 < userText.scrollTop + userText.offsetHeight){
    let addnum = 100;//Math.min((999 - textareaLineNum),100)
    if (addnum < 0) return;
    for(let i = textareaLineNum; i < textareaLineNum + addnum; i++){
      let linenum = document.createElement('div');
      let num = (i + 1) // <= 9999 ? (i + 1) : '···';
      linenum.textContent = num;
      if(num > 9999 && num <= 99999){
        linenum.setAttribute('style','font-size:9px;');
      }
      if(num > 99999){
        linenum.setAttribute('style','font-size:8px;');
      }
      linenums.appendChild(linenum);
    };
    textareaLineNum += addnum;
  };
});

let userText_BtnUp = getElementMix('data-btn="up"');
let userText_BtnDown = getElementMix('data-btn="down"');
let userText_ScrollUp = null;
let userText_ScrollDown = null;

userText_BtnUp.addEventListener('dblclick',()=>{
  userText.scrollTop = 0;
});
userText_BtnDown.addEventListener('dblclick',()=>{
  userText.scrollTop = userText.scrollHeight;
});

userText_BtnUp.addEventListener('mousedown',()=>{
  userText_ScrollUp = setInterval(()=>{
    userText.scrollTop -= userText.offsetHeight;
  },10);
});
userText_BtnDown.addEventListener('mousedown',()=>{
  userText_ScrollDown = setInterval(()=>{
    userText.scrollTop += userText.offsetHeight;
  },10);
});
userText_BtnUp.addEventListener('mouseup',()=>{
  clearInterval(userText_ScrollUp);
});
userText_BtnDown.addEventListener('mouseup',()=>{
  clearInterval(userText_ScrollDown);
});
userText_BtnUp.addEventListener('mouseleave',()=>{
  clearInterval(userText_ScrollUp);
});
userText_BtnDown.addEventListener('mouseleave',()=>{
  clearInterval(userText_ScrollDown);
});

//切换预览图
getElementMix('data-imgnum-up').addEventListener('click',()=>{
  let oldvalue = imgnumSet.value * 1;
  let maxnum = ExportImageInfo.length;
  imgnumSet.value = (oldvalue + 1) <= maxnum ? (oldvalue + 1) : maxnum;
  if(imgnumSet.value == oldvalue) return;
  imgnumSet.parentNode.setAttribute('data-int-value',imgnumSet.value);
});
getElementMix('data-imgnum-down').addEventListener('click',()=>{
  let oldvalue = imgnumSet.value * 1;
  imgnumSet.value = (oldvalue - 1) >= 1 ? (oldvalue - 1) : 1;
  if(imgnumSet.value == oldvalue) return;
  imgnumSet.parentNode.setAttribute('data-int-value',imgnumSet.value);
});

function btnConvert(isStart){
  let btn = convertTags.querySelector('btn-re');
  btn.style.animation = isStart ? 'loadRo2 2s linear infinite' : '';
  btn.parentNode.style.borderColor = isStart ? 'var(--mainColor)' : 'var(--boxBod)';
}

userText.addEventListener('dblclick',()=>{
  btnConvert(true);
});

userText.addEventListener('input',()=>{
  if(userText.value == ''){
    btnConvert(false);
  } else {
    btnConvert(true);
  }
});

[userText.parentNode.parentNode,getElementMix('upload-moreset-box')].forEach(item => {
  item.addEventListener('mouseenter',()=>{
    if(userText.value == '') return;
    btnConvert(true);
  });
});
[userText.parentNode.parentNode,getElementMix('upload-moreset-box')].forEach(item => {
  item.addEventListener('mouseleave',()=>{
    if(userText.value !== '') return;
    btnConvert(false);
  });
});

//创建内容
createAnyBtn.addEventListener('click',() => {
  let type = createTagsBox.parentNode.parentNode.getAttribute('data-create-tags-box');
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
    case 'zy':
      let zys = getFinalInfo(CataloguesInfo,true);
      tipsAll(['读取中, 请耐心等待','Reading, please wait a moment'],CataloguesInfo.length * 100);
      setTimeout(()=>{
        toolMessage([zys,'createZy'],PLUGINAPP);
      },100);
    ;break
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
  /**/
  let icon = document.querySelector(`[data-skillmodule-for="${item.getAttribute('data-skillmodule')}"]`).previousElementSibling.cloneNode(true);
  icon.setAttribute('data-skilltype-icon','mini');
  item.appendChild(icon);
  /**/
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
};

//添加标签前处理
async function addImageTags(files,isCreate){
  clearCreateTags.click();
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
  clearCreateTags.click();
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
    convertTags.click()
  }
}
function addTableTags(){
  addTag('table',CreateTableInfo);
};
async function addZyCatalogue(files,codetype){
  //log([files,files instanceof FileList , files instanceof File])
  if(codetype){
    addTag('zy',files)
  } else if ( files instanceof FileList || files instanceof File || typeof(files) == 'object'){
    for(let i = 0; i < files.length; i++){
      let file = files[i];
      let format = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
      let filenameRegex = new RegExp('.' + format,'gi');
      let createname = file.name.replace(filenameRegex,'') + '@MD_NODE';
      try{
        let reader = new FileReader();
        reader.onload = async(e)=>{
          switch (format){
            case 'md':
              userText.value = reader.result.trim();
              userText.focus();
              let mds = await tool.MdToObj(reader.result.trim(),createname);
              addTag('zy',mds);
            break
            case 'svg':
              let svgs = await tool.SvgToObj(reader.result.trim(),createname);
              addTag('zy',svgs);
            break
            case 'zy':
      
            break
          }
        };
        reader.onerror = (error)=>{reject(error)};
        reader.readAsText(file);
        
      } catch (error) {
        console.log(error)
      }
      
    };
  }
};
//添加标签-总
function addTag(type,info){
  switch (type){
    case 'image':
      info.forEach((img,index) => {
        let tag = document.createElement('div');
        createTagsBox.parentNode.parentNode.setAttribute('data-create-tags-box','image');
        addTagMain(tag,index,'create');
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
        createTagsBox.parentNode.parentNode.setAttribute('data-create-tags-box','table');
        addTagMain(tag,index,'create');
        let name = document.createElement('div');
        name.setAttribute('data-create-info','name');
        let end = nameRegex
        .replace(/w/g,list.w)
        .replace(/h/g,list.h)

        if(list.type && list.type  !== ''){
          end = end.replace(/type/g,list.type)
        }else{
          end = end.replace(/type/g,'')
        }
        if(list.note && list.note !== ''){
          end = end.replace(/note/g,list.note)
        }else{
          end = end.replace(/note/g,'')
        }
        if(list.s && list.s !== ''){
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
      if(info.zyType){
        CataloguesInfo.push(info);
        //log(info)
        let index = Array.from(cataloguesBox.children).length;
        let tag = document.createElement('div');
        cataloguesBox.parentNode.parentNode.setAttribute('data-create-tags-box','zy');
        let main = addTagMain(tag,index,'zynode');

        let name = document.createElement('input');
        name.type = 'text';
        name.value = info.zyName;
        name.id = 'zynode_n_' + index;
        name.setAttribute('data-input','');
        name.setAttribute('data-zynode-info','name');
        name.className = 'nobod fl1';
        name.addEventListener('change',() => {
          inputMust(name,['text',info.zyName]);
          CataloguesInfo[index].zyName = name.value;
        });
        main.appendChild(name);

        let layerList = document.createElement('div');
        layerList.setAttribute('data-layerlist','');
        let html = marked.parse(userText.value.trim());
        layerList.innerHTML = html;
        tag.appendChild(layerList);
        cataloguesBox.appendChild(tag);
      }else{

      };
    break
    case 'export-img':
      ExportImageInfo.push(...info);
      getElementMix('data-imgnum-max').textContent = ExportImageInfo.length;
      exportTagsBox.innerHTML = '<!--动态填充-->';
      ExportImageInfo.forEach((layer,index) => {
        let tag = document.createElement('div');
        let main = addTagMain(tag,index,'export');
        let name = document.createElement('input');
        name.type = 'text';
        name.value = layer.fileName;
        name.id = 'export_n_' + index;
        name.setAttribute('data-input','');
        name.setAttribute('data-export-info','name');
        name.className = 'nobod fl1';
        name.addEventListener('change',() => {
          inputMust(name,['text',layer.fileName]);
          layer.fileName = name.value;
        });
        main.appendChild(name);
        let checksetbox = document.createElement('div');
        checksetbox.setAttribute('data-export-pick','false');
        checksetbox.setAttribute('data-export-picknum',index);
        checksetbox.setAttribute('style','width: 14px; height: 14px;');
        let checksetid = 'export_pick_' + index;
        let checkset = document.createElement('input');
        checkset.type = 'checkbox';
        checkset.id = checksetid;
        if(getElementMix('exportset-pickall').checked){
          checkset.setAttribute('checked','true');
          checksetbox.setAttribute('data-export-pick','true');
        };
        checkset.addEventListener('change',()=>{
          if(checkset.checked){
            checksetbox.setAttribute('data-export-pick','true');
          } else {
            checksetbox.setAttribute('data-export-pick','false');
            getElementMix('exportset-pickall').checked = false;
          };
        });
        checksetbox.appendChild(checkset)
        let checksetlabel = document.createElement('label');
        checksetlabel.setAttribute('for',checksetid);
        checksetlabel.className = 'check';
        checksetlabel.innerHTML = '<btn-check-tick></btn-check-tick>';
        checksetbox.appendChild(checksetlabel);
        main.appendChild(checksetbox);

        let exportset = document.createElement('div');
        exportset.className = 'df-lc';
        exportset.setAttribute('style','gap: 4px; flex-wrap: wrap;');
        let formatSelect = addSelect(index,['PNG','JPG','JPEG','WEBP'],layer.format)
        exportset.appendChild(formatSelect);

        let sizesetbox = document.createElement('div');
        sizesetbox.className = 'df-lc';
        sizesetbox.setAttribute('data-int-value','');
        sizesetbox.setAttribute('data-export-size',index);
        sizesetbox.setAttribute('style','width: 82px;');
        let sizeset = document.createElement('input');
        sizeset.type = 'text';
        sizeset.id = 'export-size-' + index;
        sizeset.setAttribute('style','height: 22px;');
        sizeset.setAttribute('data-input','');
        sizeset.setAttribute('data-input-type','int');
        sizeset.setAttribute('data-input-must','1,10000');
        if(layer.finalSize){
          sizeset.value = layer.finalSize;
        };
        sizesetbox.appendChild(sizeset);
        let unit = document.createElement('div');
        unit.setAttribute('style','height: fit-content; font-size: 11px');
        unit.setAttribute('data-input-unit','auto');
        unit.textContent = 'KB';
        sizesetbox.appendChild(unit);
        exportset.appendChild(sizesetbox);

        let sizeinfo = document.createElement('div');
        sizeinfo.className = 'df-rc fl1';
        sizeinfo.setAttribute('data-sizeinfo','')
        sizeinfo.setAttribute('style','min-width: 64px; flex-wrap: wrap; opacity: 0.6;');
        sizeinfo.innerHTML += '<div style="width: fit-content">' + layer.width + '×' + layer.height + '</div>';
        sizeinfo.innerHTML += '<div style="width: fit-content; padding-left: 4px">' + Math.floor(layer.u8a.length/10.24)/100 + ' KB →</div>';
        let sizebox = document.createElement('div');
        sizebox.className = 'df-rc';
        sizebox.setAttribute('style','width: fit-content; padding-left: 4px;');
        let realsize = document.createElement('div');
        realsize.textContent = layer.compressed ? Math.floor(layer.compressed.size/10.24)/100 : '--';
        let isminRealsize = layer.compressed ? (layer.u8a.length > layer.compressed.size ? 'true' : 'false') : ''
        realsize.setAttribute('data-export-realsize',isminRealsize);// ''|true|false
        sizebox.appendChild(realsize);
        sizebox.innerHTML += 'KB /';
        let quality  = document.createElement('div');
        quality.setAttribute('data-export-quality','');
        quality.textContent = '10';
        sizebox.appendChild(quality);
        let view = document.createElement('div');
        view.innerHTML = '<btn-view></btn-view>';
        view.setAttribute('style','width:14px; height: 14px;');
        view.className = 'btn-op';
        view.addEventListener('click',()=>{
          imgnumSet.value = index + 1;
          let img = layer.compressed ? layer.compressed : layer.u8a;
          dailogImgBox.innerHTML = '';
          dailogImg.style.display = 'flex';
          let viewimg = document.createElement('img');
          let ismaxW = layer.width >= layer.height ? 'true' : 'false';
          viewimg.setAttribute('data-ismaxW',ismaxW);
          viewimg.src = URL.createObjectURL(new Blob([img],{type:'image/' + layer.format}));
          dailogImgBox.appendChild(viewimg);
          viewimg.setAttribute('data-imgnum-pick',index + 1);
        });
        sizebox.appendChild(view);
        sizeinfo.appendChild(sizebox);
        exportset.appendChild(sizeinfo);

        tag.appendChild(exportset);
        exportTagsBox.appendChild(tag);
      });
    break
  };
  //所有tag都支持二次确认, 以得到最终要生成的内容
  function addTagMain(tag,index,type){
    tag.setAttribute('data-' + type + '-tag',index);
    tag.setAttribute('data-' + type + '-final','true');
    tag.className = type == 'create' ? 'df-lc' : 'df-ffc';

    let main = document.createElement('div');
    main.className = 'df-lc';
    main.setAttribute('style','gap: 4px;');

    let checkbox = document.createElement('div');
    checkbox.setAttribute('style','width: 14px; height: 14px;');
    let checkid = type + '_chk_' + index;
    let checkinput = document.createElement('input');
    checkinput.id = checkid;
    checkinput.type = 'checkbox';
    checkinput.setAttribute('checked','true');
    let checklabel = document.createElement('label');
    checklabel.setAttribute('for',checkid);
    checklabel.className = 'check';
    checklabel.innerHTML = '<btn-check></btn-check>';
    checkbox.appendChild(checkinput);
    checkbox.appendChild(checklabel);
    main.appendChild(checkbox);

    let tagNum = document.createElement('span');
    tagNum.setAttribute('data-tags-index','')
    tagNum.innerHTML += index + 1 + '.';
    main.appendChild(tagNum);
    tag.appendChild(main);
    checkinput.addEventListener('change',()=>{
      if(checkinput.checked){
        tag.setAttribute('data-check-checked','true');
        tag.setAttribute('data-' + type + '-final','true');
      }else{
        tag.setAttribute('data-check-checked','false');
        tag.setAttribute('data-' + type + '-final','false');
      };
    });
    return main;
  };
  //生成下拉选项
  function addSelect(index,options,def){
    let select = document.createElement('div');
    select.className = 'df-lc pos-r';
    select.setAttribute('data-select','');
    select.setAttribute('data-select-value',def);
    select.setAttribute('style','gap: 4px; width: 72px;');
    let value = document.createElement('input');
    value.setAttribute('data-select-input','');
    value.setAttribute('readonly','');
    value.type = 'text'
    value.id = 'export-format-' + index;
    //console.log(def)
    value.value = def;
    
    select.appendChild(value)
    let show = document.createElement('input');
    show.setAttribute('data-select-pick','');
    show.type = 'checkbox'
    show.id = 'format-show-' + index;
    let showlabel =  document.createElement('label');
    showlabel.setAttribute('for','format-show-' + index);
    showlabel.className = 'show-next wh100';
    showlabel.setAttribute('style','position: absolute; top: 0; right: 0;')
    select.appendChild(show);
    select.appendChild(showlabel);
    let optionbox = document.createElement('div');
    optionbox.setAttribute('data-select-options','');
    optionbox.className = 'df-ffc pos-a w100 noscrollbar';
    optionbox.setAttribute('style','display: none; top: 24px; z-index:3;');
    options.forEach(item => {
      let option = document.createElement('div');
      option.setAttribute('data-option','option');
      let isMain = item == def ? 'true' : 'false';
      option.setAttribute('data-option-main',isMain);
      option.setAttribute('data-option-value',item);
      option.textContent = item;
      optionbox.appendChild(option);
    });
    select.appendChild(optionbox);

    /*
    value.addEventListener('change',()=>{
      ExportImageInfo[index].format = value.value;
      show.setAttribute('data-select-pick',value.value);
      console.log(ExportImageInfo)
    });
    */
    return select;
  };
  //更新绑定和钩子
  // 注意：yn_comp.js 已优化为事件委托，动态生成的组件会自动响应，无需再调用 COMP_MAIN()
  // getCompChange 已优化为全局单例，传入容器可提高效率
  let container = null;
  switch(type) {
    case 'image':
    case 'table':
      container = createTagsBox;
      break;
    case 'zy':
      container = cataloguesBox;
      break;
    case 'export-img':
      container = exportTagsBox;
      break;
  }
  getCompChange(container);
  //重置文字样式
  loadFont(createTagsBox.parentNode);
};
//预览导出图片-放大
getElementMix('fullimg').addEventListener('change',(e)=>{
  if(e.target.checked){
    dailogImgBox.setAttribute('data-isfull','true');
  }else{
    dailogImgBox.setAttribute('data-isfull','false');
  };
});
getElementMix('fulleditor').addEventListener('change',(e)=>{
  if(e.target.checked){
    editorViewbox.setAttribute('data-isfull','true');
  }else{
    editorViewbox.setAttribute('data-isfull','false');
  };
});
//编辑预览图
function addEditorView(info){
  let viewimg = editorViewbox.querySelector('img');
  viewimg = viewimg ? viewimg : document.createElement('img');
  let ismaxW = info.width >= info.height ? 'true' : 'false';
  viewimg.setAttribute('data-ismaxW',ismaxW);
  viewimg.src = URL.createObjectURL(new Blob([info.u8a],{type:'image/png'}));
  editorViewbox.appendChild(viewimg);
}
//选中导出标签进行管理
document.getElementById('exportset-pickall').addEventListener('change',(e)=>{
  let picks = exportTagsBox.querySelectorAll('[data-export-pick]');
  picks.forEach(item => {
    let input = item.querySelector('input');
    if(e.target.checked){
      input.checked = true;
      item.setAttribute('data-export-pick','true');
    } else {
      input.checked = false;
      item.setAttribute('data-export-pick','false');
    };
  });
});
//删除所选导出标签
getElementMix('data-export-delete').addEventListener('click',()=>{
  let picks = exportTagsBox.querySelectorAll('[data-export-pick="true"]');
  let picknums = Array.from(picks).map(item => item.getAttribute('data-export-picknum'));
  //console.log(picknums)
  picknums.sort((a,b) => b - a).forEach(num => {
    ExportImageInfo.splice(num,1);
    //console.log(ExportImageInfo)
  });
  picks.forEach(item => {
    item.parentNode.parentNode.remove();
  });
  let finals = exportTagsBox.querySelectorAll('[data-export-pick]');
  finals.forEach((item,index) => {
    item.parentNode.querySelector('[data-tags-index]').textContent = (index + 1) + '. '
    item.parentNode.parentNode.setAttribute('data-export-tag',index)
  });
});
//刷新所选导出标签
getElementMix('data-export-reup').addEventListener('click',()=>{
  let picks = exportTagsBox.querySelectorAll('[data-export-pick="true"]');
  let picknums = Array.from(picks).map(item => item.getAttribute('data-export-picknum'));
  //console.log(picknums)
});
//移除所有导出标签
getElementMix('data-export-tags-delete').addEventListener('click',()=>{
  ExportImageInfo = [];
  exportTagsBox.innerHTML = '<!--动态填充-->';
});

//导出内容
exportAnyBtn.addEventListener('click',()=>{
  let isFinal = []
  for (let i = 0; i < ExportImageInfo.length; i++) {
    let finaltag = getElementMix('data-export-tag="'+ i +'"');
    let isExport = finaltag.getAttribute('data-export-final') == 'true' ? true : false;
    isFinal.push(isExport);
  };
  let zipnames = ExportImageInfo.map(item => item.zipName);
  let zipName = '';
  if([...new Set(zipnames)].length == 1){
    zipName = zipnames[0];
  };
  tool.ExportImgByData(reExport,ExportImageInfo,isFinal,zipName);
  //处理返回的压缩导出状态
  function reExport(index,finalSize,quality,isSuccess){
    let sizespan = getElementMix('data-export-tag="'+ index +'"').querySelector('[data-export-realsize]');
    let qualityspan = getElementMix('data-export-tag="'+ index +'"').querySelector('[data-export-quality]');
    isSuccess = isSuccess ? 'true' : 'false';
    sizespan.textContent = finalSize;
    sizespan.setAttribute('data-export-realsize',isSuccess);
    qualityspan.textContent = quality;
  };
});

getElementMix('data-editor-setbg').addEventListener('change',(e)=>{
  showNext(e.target,'data-color-mix','flex');
  if(e.target.checked){
    let color = getElementMix('data-color-mix').querySelector('[data-color]').getAttribute('data-color-hex')
    editorViewbox.style.setProperty('--bg',color)
  }else{
    editorViewbox.style.setProperty('--bg','none')
  }
})

//管理断链样式
btnLinkstyle.addEventListener('click',()=>{
  toolMessage(['','manageLinkStyle'],PLUGINAPP);
});
//管理样式组
btnSelectstyle.addEventListener('click',()=>{
  toolMessage(['','manageStyleGroup'],PLUGINAPP);
});
//管理变量组
btnVariables.addEventListener('click',()=>{
  toolMessage(['','manageVariableGroup'],PLUGINAPP);
});


//制表文案转数组, 兼容反转行列
function tableTextToArray(tableText,isColumn,mustTitle){
  let lines = tableText.split('\n');
  lines.forEach((item,index) => {
    lines[index] = item.split('\t');
  });
  if(mustTitle){
    let unneed = lines[0].filter(item => !mustTitle.includes(item));
    if(unneed){
      unneed = unneed.map(item => lines[0].findIndex(items => items == item));
      unneed.forEach(num => {
        lines.forEach(line => {
          line.splice(num,1);
        });
      });
    };
  };

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
//移除所有创建标签
clearCreateTags.addEventListener('click',()=>{
  CreateImageInfo = [];
  CreateTableInfo = [];
  CataloguesInfo = [];
  createTagsBox.innerHTML = '';
  cataloguesBox.innerHTML = '';
});
//文本框内容转标签/大纲
convertTags.addEventListener('click',async ()=>{
  clearCreateTags.click();
  let firstline = userText.value.trim().split('\n')[0];
  let isTableText = ['name','w','h'].every(item => firstline.includes(item));
  if(isTableText){
    let tableArray = tableTextToArray(userText.value.trim(),false,userTableTitle.value.split(','));
    let tableObj = tableArrayToObj(tableArray);
    CreateTableInfo = tableObj;

    if(CreateTableInfo.some(item => item.note || item.s)){
      document.getElementById('upload-moreset').checked = true;
      document.querySelector('[for="upload-moreset"]').click();
    };
    setTimeout(()=>{
      addTableTags();
    },100);
  }else if(firstline.includes('svg')){
    let svgs = await tool.SvgToObj(userText.value.trim())
    addZyCatalogue(svgs,'svg')
  }else if(firstline !== ''){
    //tipsAll(['数据格式错误, 请检查~','Data format error, please check~'],3000)
    try{
      let mds = await tool.MdToObj(userText.value.trim());
      //console.log(mds)
      addZyCatalogue(mds,'md')
    } catch {e => {
      console.log(e);
    }};
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
frameName.addEventListener('change',()=>{
  convertTags.click();
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
//刷新样式信息
getElementMix('data-variable-refresh="style"').addEventListener('click',()=>{
  toolMessage(['','getStyleInfo'],PLUGINAPP);
});
//刷新变量信息
getElementMix('data-variable-refresh="variable"').addEventListener('click',()=>{
  toolMessage(['','getVariableInfo'],PLUGINAPP);
});
//修改样式信息读取状态
function reStyleInfo(info){
  let hasstyle = getElementMix('data-variable-hasstyle');
  if(info){
    hasstyle.setAttribute('data-variable-hasstyle','true');
    styleTosheet.setAttribute('data-any','');
  }else{
    hasstyle.setAttribute('data-variable-hasstyle','false');
    styleTosheet.setAttribute('data-any','unclick');
  };
};
//修改样式表信息读取状态
function reStyleSheetInfo(info){
  let hasstylesheet = getElementMix('data-variable-hasstylesheet');
  if(info){
    hasstylesheet.setAttribute('data-variable-hasstylesheet','true');
    sheetTostyle.setAttribute('data-any','');
  }else{
    hasstylesheet.setAttribute('data-variable-hasstylesheet','false');
    sheetTostyle.setAttribute('data-any','unclick');
  };
};
//修改变量信息读取状态
function reVariableInfo(info){
  let hasvar = getElementMix('data-variable-hasvar');
  if(info){
    hasvar.setAttribute('data-variable-hasvar','true');
  }else{
    hasvar.setAttribute('data-variable-hasvar','false');
  };
};
//修改变量表信息读取状态
function reVariableSheetInfo(info){
  let hasvarsheet = getElementMix('data-variable-hasvarsheet');
  if(info){
    hasvarsheet.setAttribute('data-variable-hasvarsheet','true');
  }else{
    hasvarsheet.setAttribute('data-variable-hasvarsheet','false');
  };
};
//新建示例样式
getElementMix('data-variable-addstyle').addEventListener('click',()=>{
  toolMessage(['','addStyle'],PLUGINAPP);
});
//新建样式表
getElementMix('data-variable-addstylesheet').addEventListener('click',()=>{
  toolMessage(['','addStyleSheet'],PLUGINAPP);
});
//新建示例变量
getElementMix('data-variable-addvar').addEventListener('click',()=>{
  toolMessage(['','addVariable'],PLUGINAPP);
});
//新建示例变量表
getElementMix('data-variable-addvarsheet').addEventListener('click',()=>{
  toolMessage(['','addVariableSheet'],PLUGINAPP);
});
//整理样式/变量相关组件和表格
getElementMix('data-variable-relayout').addEventListener('click',()=>{
  toolMessage(['','reVariableLayout'],PLUGINAPP);
});
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
//创建表格
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
        reSkillNum();
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
//拆分文本条件标签选中
getElementMix('data-split-tags').querySelectorAll('[type="checkbox"]').forEach(check => {
  check.addEventListener('change',()=>{
    if(check.checked){
      check.parentNode.parentNode.setAttribute('data-check-checked','true')
    }else{
      check.parentNode.parentNode.setAttribute('data-check-checked','false')
    };
  });
});
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
        clearTimeout(MOVE_TIMEOUT);
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
        case 'Random Theme':sendTableSet('theme');break
        case 'Select a Row':sendTablePick('row');break
        case 'Select many Rows':sendTablePick('allrow');break
        case 'Select Block':sendTablePick('block');break
        case 'Select Inline':sendTablePick('inline');break
        case 'Up Export-set':upSelect('exportset');break
        case 'Up Default':upSelect('default');break
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
      let tagsBox = getElementMix('data-split-tags').querySelectorAll('[data-check-checked="true"]');
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
      let type = document.querySelector('[data-splitword-set]').getAttribute('data-radio-value');
      toolMessage([[[inputs,type],'inputs'],'splitText'],PLUGINAPP);
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
      case 'theme':
        //let num = Math.floor(Math.random() * tableStyle.length * 2)
        //toolMessage([[[...tableStyle,...tableStyle][num],type],'reTable'],PLUGINAPP);
        toolMessage([[tableStyle[styleId],type],'reTable'],PLUGINAPP);
        break
    };
  };

  function sendTablePick(type){
    toolMessage([type,'pickTable'],PLUGINAPP);
  };

  function upSelect(type){
    let exporttype = getElementMix('data-exporttype-set').getAttribute('data-radio-value');
    let types = ['image','zy','rich']
    toolMessage([[types[exporttype - 1],type],'upSelect'],PLUGINAPP);
  };
});
//处理回传的选中对象的数据
function reSelectComp(info){//判断是否选中表格组件
  //console.log(info)
  if(info[0] || info[1] || info[2]){
    chkSelectcomp.checked = true;
    getElementMix('chk-tablestyle').checked = false;
    getElementMix('for="chk-selectcomp"').setAttribute('data-tips-x','left');
    getElementMix('chk-tablestyle').parentNode.style.pointerEvents = 'none';
    getElementMix('chk-tablestyle').parentNode.style.opacity = '0.5';
    getElementMix('data-tablestyle-box').style.display = 'none';
    getElementMix('data-selectcomp-box').style.display = 'flex';
    getElementMix('data-selectcomp-box').setAttribute('data-selectcomp-box','true')
    let comp1 = getElementMix('data-selectcomp-1');
    let comp2 = getElementMix('data-selectcomp-2');
    comp1.textContent = info[0] ? info[0] : 'none';
    comp1.style.opacity = info[0] ? '1' : '0.5';
    comp2.textContent = info[1] ? info[1] : 'none';
    comp2.style.opacity = info[1] ? '1' : '0.5';
    if(!info[1] && info[2]){
      comp2.textContent = info[2] ? info[2] : 'none';
      comp2.style.opacity = info[2] ? '1' : '0.5';
    };
  } else {
    getElementMix('for="chk-selectcomp"').setAttribute('data-tips-x','right');
    getElementMix('chk-tablestyle').parentNode.style.pointerEvents = 'auto';
    getElementMix('chk-tablestyle').parentNode.style.opacity = '1';
    getElementMix('data-selectcomp-box').setAttribute('data-selectcomp-box','false')
  };
 
};
function reSelectDatas(info){//显示收集的表格/组件属性数据
  let text = '';
  if(Array.isArray(info[0])){
    text = tableArrayToText(info);
  }else{
    text = tableObjToText(info);
  };
  let textarea = getElementMix('upload-tablearea');
  textarea.focus();
  textarea.value = text;
};
function editImage(info){
  let [type,id,u8a] = info;
  //log(type);
  let newInfo = [id,u8a]
  toolMessage([newInfo,type],PLUGINAPP);
}

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
// 使用 yn_comp.js 提供的统一 getUserMix API
// 注册各种类型的回调函数（支持8种类型）
getUserMix.register('tab', getUserTab);
getUserMix.register('color', getUserColor);
getUserMix.register('number', getUserNumber);
getUserMix.register('text', getUserText);
getUserMix.register('int', getUserInt);
getUserMix.register('float', getUserFloat);
getUserMix.register('select', getUserSelect);
getUserMix.register('radio', getUserRadio);

// 动态生成组件后，可以传入容器来初始化观察
function getCompChange(container){
  getUserMix.init(container);
}

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
  if(node.parentNode.getAttribute('data-color-mix') !== null){
    editorViewbox.style.setProperty('--bg',color.HEX);
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

function getUserInt(node){
  let int = node.getAttribute('data-int-value');
  if(node.getAttribute('data-export-size') !== null){
    let index = node.getAttribute('data-export-size');
    ExportImageInfo[index].finalSize = int;
    ExportImageInfo[index].compressed = null;
    toolMessage([[ExportImageInfo[index].id,int],'setFinalSize'],PLUGINAPP);
    let tag = getElementMix('data-export-tag="'+ index +'"');
    let realSize = tag.querySelector('[data-export-realsize]');
    realSize.textContent = '--';
    realSize.setAttribute('data-export-realsize','');
    realSize.nextElementSibling.textContent = '10';
  };
  if(node.getAttribute('data-imgnum-input') !== null){
    let viewimg = dailogImgBox.querySelector('img');
    if(int > ExportImageInfo.length){
      imgnumSet.value = viewimg.getAttribute('data-imgnum-pick');
      return
    }
    let layer = ExportImageInfo[int - 1];
    if(!layer) return;
    let img = layer.compressed ? layer.compressed : layer.u8a;
    let ismaxW = layer.width >= layer.height ? 'true' : 'false';
    viewimg.setAttribute('data-ismaxW',ismaxW);
    viewimg.src = URL.createObjectURL(new Blob([img],{type:'image/' + layer.format}));
    dailogImgBox.appendChild(viewimg);
    viewimg.setAttribute('data-imgnum-pick',int);
  }
  //console.log(int)
};

function getUserFloat(node){
  let float = node.getAttribute('data-float-value');
  if(node == uniformS.parentNode){
    let value = float * 1;
    let center = getElementMix('data-transform-center-box').getAttribute('data-radio-value');
    toolMessage([['S',value,center],'rescaleMix'],PLUGINAPP);
    uniformS.value = 1;
  };
  if(node == uniformW.parentNode){
    let value = float * 1;
    let center = getElementMix('data-transform-center-box').getAttribute('data-radio-value');
    toolMessage([['W',value,center],'rescaleMix'],PLUGINAPP);
    uniformW.value = '';
  };
  if(node == uniformH.parentNode){
    let value = float * 1;
    let center = getElementMix('data-transform-center-box').getAttribute('data-radio-value');
    toolMessage([['H',value,center],'rescaleMix'],PLUGINAPP);
    uniformH.value = '';
  };
  //console.log(float)
};

function getUserSelect(node){
  let userSelect = node.getAttribute('data-select-value');
  if(node.parentNode.parentNode.id == 'upload-moreset-box'){
    frameName.value = userSelect;
  }
  if(node.parentNode.parentNode.getAttribute('data-export-tag') !== null){
    let index = node.parentNode.parentNode.getAttribute('data-export-tag');
    ExportImageInfo[index].format = userSelect;
    ExportImageInfo[index].compressed = null;
    let tag = getElementMix('data-export-tag="'+ index +'"');
    let realSize = tag.querySelector('[data-export-realsize]');
    realSize.textContent = '--';
    realSize.setAttribute('data-export-realsize','');
    realSize.nextElementSibling.textContent = '10';
  };
};

function getUserRadio(node){
  let userRadio= node.getAttribute('data-radio-value');
  if(userRadio){
    if(node.getAttribute('data-pixelscale-set') !== null){
      pixelScale.value = userRadio;
    };
    
    if(node.getAttribute('data-clip-w-set') !== null){
      let clipH = getElementMix('data-clip-h-set').querySelector('[data-radio-main="true"]').getAttribute('data-radio-data');
      toolMessage([[userRadio * 1,clipH * 1],'addClipGrid'],PLUGINAPP);
    };
    if(node.getAttribute('data-clip-h-set') !== null){
      let clipW = getElementMix('data-clip-w-set').querySelector('[data-radio-main="true"]').getAttribute('data-radio-data');
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

    if(node.getAttribute('data-exporttype-set') !== null){
      let type = ['image','zy','rich'];
      getElementMix('data-export-tags-box').setAttribute('data-export-tags-box',type[(userRadio - 1)]);
    };

    if(node.parentNode.parentNode.getAttribute('data-variable-type') !== null){
      let vars = getElementMix('data-variable-varmix');
      let styles = getElementMix('data-variable-stylemix');
      if( userRadio == 'variable'){
        vars.style.display = 'flex';
        styles.style.display = 'none';
      }else{
        vars.style.display = 'none';
        styles.style.display = 'flex';
      };
    };
  };
};

// ==================== 用户登录/注册模块 ====================
// 用户认证配置 - 可以后续扩展为 API 调用
const AUTH_CONFIG = {
  // Supabase 配置（如果使用 Supabase，请填写下面的信息）
  USE_SUPABASE: true, // 改为 true 启用 Supabase
  SUPABASE_URL: 'https://darbnumfpfrscqgyeiqe.supabase.co', // 替换为你的 Project URL
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcmJudW1mcGZyc2NxZ3llaXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0OTU1NjksImV4cCI6MjA4MDA3MTU2OX0.UDvrmk8lnumZAu9nugTtEl7WGzxDNhUSfllrCFF4Ws4', // 替换为你的 anon public key
  
  // 自定义 API 配置（如果使用自定义 API）
  API_BASE_URL: null, // 'https://api.ynyuset.cn/auth'
  
  // 本地存储键名（保持不变）
  STORAGE_KEY_USER: 'toolsSetFig_user',
  STORAGE_KEY_USERS: 'toolsSetFig_users'
};

// 存储辅助函数 - 支持 Figma 插件和普通环境
const AuthStorage = {
  // 获取数据（同步版本，仅用于非插件环境）
  get(key) {
    if (!ISPLUGIN || !PLUGINAPP) {
      // 普通环境：使用 localStorage
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    }
    // 插件环境下，数据通过消息回调异步获取，这里返回 null
    // 实际数据会在 run.js 的消息回调中设置到 AuthManager
    return null;
  },

  // 设置数据
  set(key, value) {
    if (ISPLUGIN && PLUGINAPP) {
      // Figma 插件环境：通过 toolMessage 存储
      toolMessage([[key, value], 'setlocal'], PLUGINAPP);
    } else {
      // 普通环境：使用 localStorage
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }
  },

  // 删除数据
  remove(key) {
    if (ISPLUGIN && PLUGINAPP) {
      // Figma 插件环境：设置为 null 来删除
      toolMessage([[key, null], 'setlocal'], PLUGINAPP);
    } else {
      // 普通环境：使用 localStorage
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Failed to remove from localStorage:', e);
      }
    }
  }
};

// 初始化 Supabase 客户端（如果使用）
let supabaseClient = null;
function initSupabaseClient() {
  if (AUTH_CONFIG.USE_SUPABASE) {
    // 检查 Supabase SDK 是否已加载
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      try {
        supabaseClient = supabase.createClient(
          AUTH_CONFIG.SUPABASE_URL,
          AUTH_CONFIG.SUPABASE_ANON_KEY
        );
        console.log('Supabase client initialized successfully');
        return true;
      } catch (e) {
        console.error('Failed to initialize Supabase:', e);
        return false;
      }
    } else {
      console.warn('Supabase SDK not loaded. Check if the script tag is present and loaded correctly.');
      console.log('typeof supabase:', typeof supabase);
      return false;
    }
  }
  return false;
}

// 尝试初始化 Supabase（支持延迟加载）
function tryInitSupabase() {
  if (AUTH_CONFIG.USE_SUPABASE && !supabaseClient) {
    // 如果 SDK 已加载，立即初始化
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      return initSupabaseClient();
    } else {
      // 如果 SDK 未加载，等待一段时间后重试（最多重试 5 次）
      let retries = 0;
      const maxRetries = 5;
      const checkInterval = setInterval(() => {
        retries++;
        if (typeof supabase !== 'undefined' && supabase.createClient) {
          clearInterval(checkInterval);
          initSupabaseClient();
        } else if (retries >= maxRetries) {
          clearInterval(checkInterval);
          console.error('Supabase SDK failed to load after multiple retries');
        }
      }, 200);
    }
  }
}

// 用户认证管理 - 在全局作用域定义，run.js 可以直接访问
var AuthManager = {
  currentUser: null,
  usersList: [], // 存储所有用户列表（用于验证）

  // 设置当前用户（由 run.js 的消息回调调用）
  setCurrentUser(user) {
    this.currentUser = user;
  },

  // 设置用户列表（由 run.js 的消息回调调用）
  setUsersList(users) {
    this.usersList = users || [];
  },

  // 初始化：从存储加载用户信息
  async init() {
    try {
      // 如果使用 Supabase，先检查是否有已登录的会话
      if (AUTH_CONFIG.USE_SUPABASE && supabaseClient) {
        try {
          const { data: { session }, error } = await supabaseClient.auth.getSession();
          if (!error && session?.user) {
            // 获取用户配置信息
            let profile = null;
            try {
              const { data: profileData, error: profileError } = await supabaseClient
                .from('user_profiles')
                .select('username,is_premium')  // 移除空格，避免格式问题
                .eq('id', session.user.id)
                .maybeSingle();  // 使用 maybeSingle() 而不是 single()
              
              if (profileError) {
                console.warn('Failed to fetch user profile in init:', {
                  error: profileError,
                  message: profileError.message,
                  code: profileError.code
                });
                // 如果查询失败，使用默认值
              } else if (profileData) {
                profile = profileData;
                console.log('User profile fetched in init:', profile);
              } else {
                console.log('User profile not found in init, using defaults');
              }
            } catch (e) {
              console.warn('Failed to fetch user profile in init:', e);
              // 表可能不存在或 RLS 策略限制，忽略错误
            }

            this.currentUser = {
              id: session.user.id,
              email: session.user.email,
              username: profile?.username || session.user.email.split('@')[0],
              isPremium: profile?.is_premium || false
            };
            AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USER, this.currentUser);
            this.updateUI();
            return; // Supabase 登录成功，不需要继续
          }
        } catch (e) {
          console.warn('Supabase session check failed:', e);
        }
      }

      // 在插件环境下，数据会通过 run.js 的消息回调异步设置
      // 在非插件环境下，直接从 localStorage 读取
      if (!ISPLUGIN || !PLUGINAPP) {
        const user = AuthStorage.get(AUTH_CONFIG.STORAGE_KEY_USER);
        if (user) {
          this.currentUser = user;
          this.updateUI();
        }
        const users = AuthStorage.get(AUTH_CONFIG.STORAGE_KEY_USERS);
        if (users) {
          this.usersList = users;
        }
      }
      // 插件环境下，数据已在 run.js 初始化时通过 getlocal 请求
      // 会在消息回调中调用 setCurrentUser 和 setUsersList
    } catch (e) {
      console.error('Failed to load user data:', e);
    }
  },

  // 注册
  async register(email, username, password) {
    // 简单验证
    if (!email || !email.includes('@')) {
      return { success: false, error: '请输入有效的邮箱地址' };
    }
    if (!username || username.length < 2) {
      return { success: false, error: '用户名至少需要2个字符' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: '密码至少需要6个字符' };
    }

    // 如果使用 Supabase
    if (AUTH_CONFIG.USE_SUPABASE) {
      // 如果客户端未初始化，尝试初始化
      if (!supabaseClient) {
        console.log('Supabase client not initialized, attempting to initialize...');
        const initResult = tryInitSupabase();
        // 等待一小段时间让初始化完成
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!supabaseClient) {
          console.error('Supabase client initialization failed. Check:', {
            'SDK loaded': typeof supabase !== 'undefined',
            'createClient exists': typeof supabase !== 'undefined' && typeof supabase.createClient !== 'undefined',
            'URL configured': !!AUTH_CONFIG.SUPABASE_URL,
            'Key configured': !!AUTH_CONFIG.SUPABASE_ANON_KEY
          });
          return { success: false, error: 'Supabase 未初始化，请检查配置和网络连接' };
        }
      }
      
      try {
        // 使用 Supabase 注册
        // 注意：如果 Supabase 启用了邮箱确认，需要配置正确的重定向 URL
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: username
            },
            // 如果需要邮箱确认，可以在这里指定重定向 URL
            // emailRedirectTo: 'https://your-domain.com/auth/callback'
          }
        });

        if (error) {
          // 详细记录错误信息，便于调试
          console.error('Supabase registration error:', {
            message: error.message,
            status: error.status,
            code: error.code,
            fullError: error
          });
          
          // 处理错误信息
          let errorMsg = error.message;
          // 检查是否是邮箱已注册的错误
          const isAlreadyRegistered = 
            error.message?.toLowerCase().includes('already registered') ||
            error.message?.toLowerCase().includes('user already registered') ||
            error.message?.toLowerCase().includes('email already registered') ||
            error.status === 422 && error.message?.toLowerCase().includes('exists') ||
            error.code === '23505'; // PostgreSQL unique violation
          
          if (isAlreadyRegistered) {
            errorMsg = '该邮箱已在 Supabase 中注册，请直接登录（清除本地缓存不会删除数据库记录）';
          } else if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
            // 速率限制错误
            const waitTime = error.message.match(/(\d+)\s*seconds?/i)?.[1] || '7';
            errorMsg = `请求过于频繁，请等待 ${waitTime} 秒后再试`;
          } else if (error.message?.toLowerCase().includes('invalid')) {
            errorMsg = '邮箱格式不正确';
          } else {
            // 显示原始错误信息，便于调试
            errorMsg = `注册失败: ${error.message || '未知错误'}`;
          }
          return { success: false, error: errorMsg };
        }

        if (!data.user) {
          return { success: false, error: '注册失败，请重试' };
        }

        // 检查是否有 session（某些 Supabase 配置需要邮箱确认）
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        // 创建用户配置记录（只有在有 session 时才尝试）
        if (session) {
          try {
            const { data: profileData, error: profileError } = await supabaseClient
              .from('user_profiles')
              .insert({
                id: data.user.id,
                username: username,
                is_premium: false
              })
              .select()
              .single();

            if (profileError) {
              console.error('Failed to create user profile:', profileError);
              // 如果插入失败，可能是 RLS 策略问题，但继续执行
              // 用户配置可能由数据库触发器自动创建
            } else {
              console.log('User profile created successfully:', profileData);
            }
          } catch (e) {
            console.error('User profile creation failed:', e);
            // 继续执行，因为用户已经注册成功
          }
        } else {
          // 没有 session，说明需要邮箱确认
          console.log('User registered but needs email confirmation. Profile will be created after confirmation.');
          // 用户配置应该由数据库触发器自动创建
        }

        // 设置当前用户（即使没有 session，也保存基本信息）
        this.currentUser = {
          id: data.user.id,
          email: data.user.email,
          username: username,
          isPremium: false
        };

        // 如果有 session，保存用户信息
        if (session) {
          AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USER, this.currentUser);
          this.updateUI();
          return { success: true, user: this.currentUser };
        } else {
          // 没有 session，提示用户需要确认邮箱
          return { 
            success: true, 
            user: this.currentUser,
            needsConfirmation: true,
            message: '注册成功！请检查邮箱并点击确认链接以完成注册。'
          };
        }
      } catch (e) {
        console.error('Supabase registration failed:', e);
        return { success: false, error: '注册失败，请重试' };
      }
    }

    // 降级到本地存储（仅在未使用 Supabase 时）
    if (AUTH_CONFIG.USE_SUPABASE) {
      // 如果使用 Supabase 但注册失败，不应该降级到本地存储
      return { success: false, error: '注册失败，请检查 Supabase 配置或网络连接' };
    }
    
    // 清除可能存在的旧数据，确保检查的是最新数据
    const existingUsers = this.getUsersList();
    console.log('Checking local users list:', existingUsers);
    if (existingUsers && existingUsers.length > 0 && existingUsers.find(u => u.email === email)) {
      return { success: false, error: '该邮箱已在本地注册，请先清除缓存' };
    }

    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const user = {
      id: userId,
      email: email,
      username: username,
      password: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      isPremium: false
    };

    existingUsers.push(user);
    this.usersList = existingUsers;
    AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USERS, existingUsers);
    
    this.currentUser = { ...user };
    delete this.currentUser.password;
    AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USER, this.currentUser);

    this.updateUI();
    return { success: true, user: this.currentUser };
  },

  // 登录
  async login(email, password) {
    if (!email || !password) {
      return { success: false, error: '请输入邮箱和密码' };
    }

    // 如果使用 Supabase
    if (AUTH_CONFIG.USE_SUPABASE && supabaseClient) {
      try {
        // 使用 Supabase 登录
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          return { success: false, error: '邮箱或密码错误' };
        }

        if (!data.user) {
          return { success: false, error: '登录失败，请重试' };
        }

        // 获取用户配置信息
        let profile = null;
        try {
          // 使用更安全的查询方式，只选择需要的列
          const { data: profileData, error: profileError } = await supabaseClient
            .from('user_profiles')
            .select('username,is_premium')  // 移除空格，避免格式问题
            .eq('id', data.user.id)
            .maybeSingle();  // 使用 maybeSingle() 而不是 single()，如果不存在返回 null 而不是错误

          if (profileError) {
            console.warn('Failed to fetch user profile:', {
              error: profileError,
              message: profileError.message,
              code: profileError.code,
              details: profileError.details
            });
            // 如果查询失败，使用默认值
          } else if (profileData) {
            profile = profileData;
            console.log('User profile fetched successfully:', profile);
          } else {
            // 如果 profile 不存在，尝试创建它
            console.log('User profile not found, attempting to create...');
            try {
              const { data: newProfileData, error: createError } = await supabaseClient
                .from('user_profiles')
                .insert({
                  id: data.user.id,
                  username: data.user.email.split('@')[0], // 使用邮箱前缀作为默认用户名
                  is_premium: false
                })
                .select()
                .maybeSingle();
              
              if (!createError && newProfileData) {
                profile = newProfileData;
                console.log('User profile created successfully during login:', profile);
              } else if (createError) {
                console.warn('Failed to create user profile during login:', createError);
              }
            } catch (e) {
              console.warn('Exception while creating user profile during login:', e);
            }
          }
        } catch (e) {
          console.warn('Failed to fetch user profile:', e);
        }

        // 设置当前用户
        this.currentUser = {
          id: data.user.id,
          email: data.user.email,
          username: profile?.username || data.user.email.split('@')[0],
          isPremium: profile?.is_premium || false
        };

        AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USER, this.currentUser);
        this.updateUI();

        return { success: true, user: this.currentUser };
      } catch (e) {
        console.error('Supabase login failed:', e);
        return { success: false, error: '登录失败，请重试' };
      }
    }

    // 降级到本地存储
    const existingUsers = this.getUsersList();
    const user = existingUsers.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: '邮箱或密码错误' };
    }

    if (user.password !== this.hashPassword(password)) {
      return { success: false, error: '邮箱或密码错误' };
    }

    this.currentUser = { ...user };
    delete this.currentUser.password;
    AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USER, this.currentUser);

    this.updateUI();
    return { success: true, user: this.currentUser };
  },

  // 退出登录
  async logout() {
    // 如果使用 Supabase，先退出 Supabase 会话
    if (AUTH_CONFIG.USE_SUPABASE && supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out failed:', e);
      }
    }
    
    this.currentUser = null;
    AuthStorage.remove(AUTH_CONFIG.STORAGE_KEY_USER);
    this.updateUI();
    this.showLoginForm();
  },

  // 清除所有本地缓存（包括用户数据和用户列表）
  clearLocalCache() {
    this.currentUser = null;
    this.usersList = [];
    // 清除存储中的数据
    AuthStorage.remove(AUTH_CONFIG.STORAGE_KEY_USER);
    AuthStorage.remove(AUTH_CONFIG.STORAGE_KEY_USERS);
    // 确保内存中的数据也被清除
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_USER);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_USERS);
      } catch (e) {
        console.warn('Failed to clear localStorage:', e);
      }
    }
    this.updateUI();
    console.log('本地缓存已清除');
  },

  // 获取用户列表
  getUsersList() {
    if (this.usersList.length > 0 || (ISPLUGIN && PLUGINAPP)) {
      return this.usersList;
    }
    // 非插件环境下，从 localStorage 读取
    const users = AuthStorage.get(AUTH_CONFIG.STORAGE_KEY_USERS);
    this.usersList = users || [];
    return this.usersList;
  },

  // 简单密码哈希（生产环境应使用更安全的方法）
  hashPassword(password) {
    // 简单的哈希，仅用于演示，生产环境应使用 bcrypt 等
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  },

  // 更新 UI
  updateUI() {
    const loginBtn = document.querySelector('[data-user-login-btn]');
    const userName = document.querySelector('[data-user-name]');
    const loginText = document.querySelector('[data-user-login-text]');
    
    if (this.currentUser) {
      // 已登录状态
      if (userName) userName.style.display = 'flex';
      if (loginText) loginText.style.display = 'none';

      let [username,emailname] = [this.currentUser.username,this.currentUser.email.split('@')[0]];

      if (userName) {
        let displayName = username || emailname;
        displayName = displayName.length > 8 ? displayName.substring(0, 8) + '...' : displayName;
        userName.setAttribute('data-en-text',displayName);
        userName.setAttribute('data-zh-text',displayName);
        userName.textContent = displayName;
      }
    } else {
      // 未登录状态
      if (userName) userName.style.display = 'none';
      if (loginText) loginText.style.display = 'block';
    }
  },

  // 显示登录表单
  showLoginForm() {
    const loginForm = document.querySelector('[data-login-form]');
    const registerForm = document.querySelector('[data-register-form]');
    const userInfo = document.querySelector('[data-user-info]');
    
    if (loginForm) loginForm.style.display = 'flex';
    if (registerForm) registerForm.style.display = 'none';
    if (userInfo) userInfo.style.display = 'none';
    
    // 清空表单
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    if (loginEmail) loginEmail.value = '';
    if (loginPassword) loginPassword.value = '';
    this.hideError('login');
  },

  // 显示注册表单
  showRegisterForm() {
    const loginForm = document.querySelector('[data-login-form]');
    const registerForm = document.querySelector('[data-register-form]');
    const userInfo = document.querySelector('[data-user-info]');
    
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'flex';
    if (userInfo) userInfo.style.display = 'none';
    
    // 清空表单
    const registerEmail = document.getElementById('register-email');
    const registerUsername = document.getElementById('register-username');
    const registerPassword = document.getElementById('register-password');
    const registerPasswordConfirm = document.getElementById('register-password-confirm');
    if (registerEmail) registerEmail.value = '';
    if (registerUsername) registerUsername.value = '';
    if (registerPassword) registerPassword.value = '';
    if (registerPasswordConfirm) registerPasswordConfirm.value = '';
    this.hideError('register');
  },

  // 显示用户信息
  showUserInfo() {
    const loginForm = document.querySelector('[data-login-form]');
    const registerForm = document.querySelector('[data-register-form]');
    const userInfo = document.querySelector('[data-user-info]');
    
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    
    if (this.currentUser && userInfo) {
      const displayName = document.querySelector('[data-user-display-name]');
      const displayEmail = document.querySelector('[data-user-display-email]');
      const userAvatar = document.querySelector('[data-user-avatar]');
      const userId = document.querySelector('[data-user-id]');
      const userPremium = document.querySelector('[data-user-premium]');
      let [username,emailname,useremail] = [this.currentUser.username,this.currentUser.email.split('@')[0],this.currentUser.email];
      //先取后两位
      let iconname = username.slice(-2) || emailname.slice(-2);
      //中文昵称只保留一个字
      if(iconname.replace(/[^\u4e00-\u9fa5]/g,'').length > 0){
        iconname = iconname[1];
      }
      if (displayName) displayName.textContent = username || emailname;
      if (displayEmail) displayEmail.textContent = useremail;
      if (userAvatar) userAvatar.textContent = iconname.toUpperCase();
      if (userId) userId.textContent = this.currentUser.id;
      if (userPremium) userPremium.style.display = this.currentUser.isPremium ? 'block' : 'none';
    }
  },

  // 显示错误信息
  showError(type, message) {
    const errorEl = document.querySelector(`[data-${type}-error]`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  },

  // 隐藏错误信息
  hideError(type) {
    const errorEl = document.querySelector(`[data-${type}-error]`);
    if (errorEl) {
      errorEl.style.display = 'none';
    }
  },

  // 检查是否为付费用户
  isPremium() {
    return this.currentUser && this.currentUser.isPremium === true;
  }
};

// 初始化登录模块和事件绑定
async function initAuthModule() {
  // 初始化 Supabase 客户端（如果使用）
  if (AUTH_CONFIG.USE_SUPABASE) {
    tryInitSupabase();
  }
  
  // 初始化用户状态（包括检查 Supabase 会话）
  await AuthManager.init();
  
  // 登录按钮点击事件
  const userLoginBtn = document.querySelector('[data-user-login-btn]');
  if (userLoginBtn) {
    userLoginBtn.addEventListener('click', () => {
      if (AuthManager.currentUser) {
        // 已登录，显示用户信息
        AuthManager.showUserInfo();
        if (dailogLogin) dailogLogin.style.display = 'flex';
      } else {
        // 未登录，显示登录表单
        AuthManager.showLoginForm();
        if (dailogLogin) dailogLogin.style.display = 'flex';
      }
    });
  }
}

// 登录表单切换
const btnShowRegister = document.querySelector('[data-btn-show-register]');
if (btnShowRegister) {
  btnShowRegister.addEventListener('click', () => {
    AuthManager.showRegisterForm();
  });
}

const btnShowLogin = document.querySelector('[data-btn-show-login]');
if (btnShowLogin) {
  btnShowLogin.addEventListener('click', () => {
    AuthManager.showLoginForm();
  });
}

// 登录按钮
const btnLogin = document.querySelector('[data-btn-login]');
if (btnLogin) {
  btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;
    
    AuthManager.hideError('login');
    
    const result = await AuthManager.login(email, password);
    if (result.success) {
      AuthManager.showUserInfo();
    } else {
      AuthManager.showError('login', result.error || '登录失败，请重试');
    }
  });
}

// 注册按钮
const btnRegister = document.querySelector('[data-btn-register]');
let isRegistering = false; // 防止重复提交
if (btnRegister) {
  btnRegister.addEventListener('click', async () => {
    // 防止重复提交
    if (isRegistering) {
      return;
    }
    
    const email = document.getElementById('register-email')?.value.trim();
    const username = document.getElementById('register-username')?.value.trim();
    const password = document.getElementById('register-password')?.value;
    const passwordConfirm = document.getElementById('register-password-confirm')?.value;
    
    AuthManager.hideError('register');
    
    // 基本验证
    if (!email || !username || !password) {
      AuthManager.showError('register', '请填写所有必填项');
      return;
    }
    
    if (password !== passwordConfirm) {
      AuthManager.showError('register', '两次输入的密码不一致');
      return;
    }
    
    // 禁用按钮并显示加载状态
    isRegistering = true;
    const originalText = btnRegister.textContent;
    btnRegister.disabled = true;
    btnRegister.style.opacity = '0.6';
    btnRegister.style.pointerEvents = 'none';
    btnRegister.textContent = '注册中...';
    
    let result = null;
    let shouldKeepDisabled = false;
    
    try {
      result = await AuthManager.register(email, username, password);
      if (result.success) {
        if (result.needsConfirmation) {
          // 需要邮箱确认
          AuthManager.showError('register', result.message || '注册成功！请检查邮箱并点击确认链接。');
          // 3秒后切换到登录表单
          setTimeout(() => {
            AuthManager.showLoginForm();
            AuthManager.hideError('register');
          }, 3000);
        } else {
          // 注册成功且已登录
          AuthManager.showUserInfo();
        }
      } else {
        AuthManager.showError('register', result.error || '注册失败，请重试');
        
        // 如果是速率限制错误，保持按钮禁用一段时间
        if (result.error?.includes('等待') || result.error?.includes('秒')) {
          shouldKeepDisabled = true;
          const waitTime = parseInt(result.error.match(/(\d+)\s*秒/)?.[1] || '7') * 1000;
          setTimeout(() => {
            isRegistering = false;
            btnRegister.disabled = false;
            btnRegister.style.opacity = '1';
            btnRegister.style.pointerEvents = 'auto';
            btnRegister.textContent = originalText;
          }, waitTime);
          return;
        }
      }
    } catch (e) {
      console.error('Registration error:', e);
      AuthManager.showError('register', '注册失败，请重试');
    } finally {
      // 恢复按钮状态（除非是速率限制）
      if (!shouldKeepDisabled) {
        isRegistering = false;
        btnRegister.disabled = false;
        btnRegister.style.opacity = '1';
        btnRegister.style.pointerEvents = 'auto';
        btnRegister.textContent = originalText;
      }
    }
  });
}

// 退出登录按钮
const btnLogout = document.querySelector('[data-btn-logout]');
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    AuthManager.logout();
  });
}

// 清除本地缓存按钮
const btnClearCache = document.querySelector('[data-btn-clear-cache]');
if (btnClearCache) {
  btnClearCache.addEventListener('click', () => {
    if (confirm('确定要清除所有本地缓存吗？这将删除本地存储的用户数据。')) {
      AuthManager.clearLocalCache();
      AuthManager.showLoginForm();
      alert('本地缓存已清除');
    }
  });
}

// 关闭登录弹窗
function setupLoginDialogClose() {
  if (dailogLogin) {
    // 点击弹窗外部关闭
    dailogLogin.addEventListener('click', (e) => {
      if (e.target === dailogLogin) {
        dailogLogin.style.display = 'none';
      }
    });
    
    // ESC 键关闭（避免重复绑定）
    if (!dailogLogin.hasAttribute('data-esc-listener')) {
      dailogLogin.setAttribute('data-esc-listener', 'true');
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dailogLogin && dailogLogin.style.display === 'flex') {
          dailogLogin.style.display = 'none';
        }
      });
    }
  }
}

// 确保在 DOM 加载后执行初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAuthModule();
    setupLoginDialogClose();
  });
} else {
  // DOM 已经加载完成
  initAuthModule();
  setupLoginDialogClose();
}

// AuthManager 已在全局作用域中定义，run.js 可以直接访问
// 在打包后，run.js 和 main.js 都在同一个文档中，可以直接使用
