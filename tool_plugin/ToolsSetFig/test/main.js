// ========== DOM 管理器 ==========
/**
 * DOM 元素管理器 - 封装所有 DOM 查询，提供缓存和统一访问
 */
const DOM = (() => {
  const cache = new Map();
  
  // DOM 查询辅助函数（带缓存）
  function query(selector, useCache = true) {
    if (useCache && cache.has(selector)) {
      return cache.get(selector);
    }
    const element = document.querySelector(selector);
    if (element && useCache) {
      cache.set(selector, element);
    }
    return element;
  }
  
  function queryAll(selector, useCache = true) {
    const cacheKey = `all:${selector}`;
    if (useCache && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      // 如果缓存的元素仍然存在于 DOM 中，返回缓存
      if (cached.length > 0 && cached[0].isConnected) {
        return cached;
      }
      // 否则清除缓存，重新查询
      cache.delete(cacheKey);
    }
    const elements = document.querySelectorAll(selector);
    // 只缓存非空结果
    if (elements.length > 0 && useCache) {
      cache.set(cacheKey, elements);
    }
    return elements;
  }
  
  function getById(id, useCache = true) {
    const cacheKey = `id:${id}`;
    if (useCache && cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    const element = document.getElementById(id);
    if (element && useCache) {
      cache.set(cacheKey, element);
    }
    return element;
  }
  
  // 初始化所有 DOM 元素
  const elements = {
    // 界面控制
    sideMix: () => query('[data-side-mix]'),
    sideMask: () => query('[data-side-mask]'),
    btnMore: () => getById('btn-more'),
    btnResize: () => query('[data-resize-window]'),
    btnBig: () => getById('big'),
    TV_text: () => query('[data-tv-text]'),
    
    // 对话框
    dailog: () => query('[data-dailog]'),
    dailogBox: () => query('[data-dailog-box]'),
    dailogImg: () => query('[data-dailogimg]'),
    dailogImgBox: () => query('[data-dailogimg-box]'),
    dailogSearchBox: () => query('[data-dailogsearch-box]'),
    dailogLogin: () => query('[data-dailoglogin]'),
    dailogLoginBox: () => query('[data-dailoglogin-box]'),
    
    // 上传相关
    dropUp: () => query('[data-drop="upload"]'),
    fileInfo: () => query('[data-file-info]'),
    userImg: () => getById('input-user-img'),
    userTable: () => getById('input-user-table'),
    userZy: () => getById('input-user-zy'),
    userText: () => getById('upload-textarea'),
    skewscaleViewPick: () => getById('skewscale-view-pick'),
    
    // 表单元素
    userTableTitle: () => getById('input-user-table-title'),
    frameName: () => getById('input-framename'),
    pixelScale: () => getById('input-pixelScale'),
    uniformS: () => getById('uniform-set-s'),
    uniformW: () => getById('uniform-set-w'),
    uniformH: () => getById('uniform-set-h'),
    
    // 技能相关
    skillSearchInput: () => getById('skillsearch'),
    skillTypeBox: () => query('[data-skilltype-box]'),
    skillAllBox: () => query('[data-skills-box]'),
    skillSecNode: () => queryAll('[data-skill-sec]'),
    skillStar: () => queryAll('[data-skill-star]'),
    skillAllModel: () => queryAll('[data-skillmodule]'),
    skillStarModel: () => query('[data-skillmodule="Useful & Starts"]'),
    skillBtnMain: () => queryAll('[data-btn="skill-main"]'),
    
    // 标签相关
    createTagsBox: () => query('[data-create-tags]'),
    cataloguesBox: () => query('[data-create-catalogues]'),
    exportTagsBox: () => query('[data-export-tags]'),
    clearCreateTags: () => {
      const box = query('[data-create-tags-box]');
      return box ? box.querySelector('btn-close')?.parentNode : null;
    },
    
    // 编辑器
    editorViewbox: () => query('[data-editor-viewbox]'),
    imgnumSet: () => getById('imgnum-set'),
    
    // 按钮
    btnHelpDoc: () => query('[data-btn="help"]'),
    btnHelp: () => queryAll('[data-help]'),
    convertTags: () => getById('upload-set-1'),
    getTableText: () => getById('upload-set-2'),
    templateBtn: () => getById('upload-set-3'),
    chkTablestyle: () => getById('chk-tablestyle'),
    chkSelectcomp: () => getById('chk-selectcomp'),
    createAnyBtn: () => query('[data-create-any]'),
    exportAnyBtn: () => query('[data-export-any]'),
    createTableBtn: () => query('[data-create-table]'),
    tableStyleSet: () => query('[data-tablestyle-set]'),
    styleTosheet: () => query('[data-en-text="Style To Sheet"]'),
    sheetTostyle: () => query('[data-en-text="Sheet To Style"]'),
    btnLinkstyle: () => query('[data-linkstyle-add]'),
    btnSelectstyle: () => query('[data-selectstyle-add]'),
    btnVariables: () => query('[data-variables-add]'),
    
    // 管理列表
    manageLinkstyleList: () => query('[data-manage-linkstyle-list]'),
    manageSelectstyleList: () => query('[data-manage-selectstyle-list]'),
    manageVariablesList: () => query('[data-manage-variables-list]'),
    
    // 选择信息
    selectInfoBox: () => queryAll('[data-selects-node]'),
    
    // 动态查询的元素（不缓存）
    scaleSetX: () => getElementMix('data-scaleset-x')?.querySelector('[data-input="value"]'),
    scaleSetY: () => getElementMix('data-scaleset-y')?.querySelector('[data-input="value"]'),
    skewSetX: () => getElementMix('data-skewset-x')?.querySelector('[data-input="value"]'),
    skewSetY: () => getElementMix('data-skewset-y')?.querySelector('[data-input="value"]'),
    skewRangeX: () => getElementMix('data-skewset-x')?.querySelector('[data-input="range"]'),
    skewRangeY: () => getElementMix('data-skewset-y')?.querySelector('[data-input="range"]'),
    scaleRangeX: () => getElementMix('data-scaleset-x')?.querySelector('[data-input="range"]'),
    scaleRangeY: () => getElementMix('data-scaleset-y')?.querySelector('[data-input="range"]'),
  };
  
  // 返回代理对象，实现懒加载
  return new Proxy({}, {
    get(target, prop) {
      if (elements[prop]) {
        return elements[prop]();
      }
      return undefined;
    }
  });
})();

// ========== 状态管理器 ==========
/**
 * 应用状态管理器 - 封装所有全局状态变量
 */
const State = (() => {
  const state = {
    // 技能相关
    skillModel: [],
    isSkillScroll: true,
    skillsSearch: [],
    
    // 表格样式（从 data.js 引用）
    tableStyle: TABLE_STYLE,
    
    // 创建数据
    createImageInfo: [],
    createTableInfo: [],
    cataloguesInfo: [],
    
    // 导出数据
    exportImageInfo: [],
    
    // 选择数据
    selectNodeInfo: [],
    
    // 编辑器信息
    editorInfo: {
      preview: '', // u8a
      set: [], // {type:HSL | HUE | }
      new: [], // {type:image | fills | node,content:[u8a | array]}
    },
    
    // 界面状态
    isResize: false,
    reStartW: null,
    reStartH: null,
    reStartX: null,
    reStartY: null,
    textareaLineNum: 20,
    
    // 文件类型
    imageType: [],
    tableType: [],
    zyType: [],
    tableTitleMust: [],
    frameNmaeSelect: [],
  };
  
  return {
    get(key) {
      return state[key];
    },
    set(key, value) {
      state[key] = value;
    },
    reset(key) {
      if (Array.isArray(state[key])) {
        state[key] = [];
      } else if (typeof state[key] === 'object' && state[key] !== null) {
        state[key] = {};
      } else {
        state[key] = null;
      }
    }
  };
})();

// 初始化技能模型
(function initSkillModel() {
  const skilltypeNameNode = DOM.skillAllModel;
  if (skilltypeNameNode) {
    skilltypeNameNode.forEach(item => {
      let name1 = item.getAttribute('data-skillmodule-zh');
      name1 = name1 ? name1 : item.textContent.trim();
      let name2 = item.getAttribute('data-skillmodule');
      State.get('skillModel').push([name1, name2]);
    });
  }
})();

// 初始化文件类型和配置
(function initFileTypes() {
  if (DOM.userImg) {
    State.set('imageType', DOM.userImg.getAttribute('accept')?.split(',').map(item => item.replace('.','')) || []);
  }
  if (DOM.userTable) {
    State.set('tableType', DOM.userTable.getAttribute('accept')?.split(',').map(item => item.replace('.','')) || []);
  }
  if (DOM.userZy) {
    State.set('zyType', DOM.userZy.getAttribute('accept')?.split(',').map(item => item.replace('.','')) || []);
  }
  if (DOM.userTableTitle) {
    State.set('tableTitleMust', DOM.userTableTitle.getAttribute('placeholder')?.split(',') || []);
  }
  if (DOM.frameName?.nextElementSibling) {
    const options = DOM.frameName.nextElementSibling.querySelectorAll('[data-option="option"]');
    const frameNmaeSelect = [];
    options.forEach(item => {
      frameNmaeSelect.push(item.getAttribute('data-option-value'));
    });
    State.set('frameNmaeSelect', frameNmaeSelect);
  }
})();

// ========== 状态变量访问 ==========
// 注意：状态变量应通过 State.get() 和 State.set() 访问，以保持状态同步
// 以下提供便捷访问函数，但建议直接使用 State.get/set 以保持一致性

// 获取状态（只读访问）
const getState = (key) => State.get(key);
// 设置状态
const setState = (key, value) => State.set(key, value);

// 常用状态的便捷访问（保持向后兼容，但建议逐步迁移到直接使用 State）
// 这些变量在代码中会被直接赋值，所以保留为 let 变量
let skillModel = State.get('skillModel');
let isSkillScroll = State.get('isSkillScroll');
let skillsSearch = State.get('skillsSearch');
let tableStyle = State.get('tableStyle');
let CreateImageInfo = State.get('createImageInfo');
let CreateTableInfo = State.get('createTableInfo');
let CataloguesInfo = State.get('cataloguesInfo');
let ExportImageInfo = State.get('exportImageInfo');
let SelectNodeInfo = State.get('selectNodeInfo');
let EditorInfo = State.get('editorInfo');
let isResize = State.get('isResize');
let textareaLineNum = State.get('textareaLineNum');
let imageType = State.get('imageType');
let tableType = State.get('tableType');
let zyType = State.get('zyType');
let tableTitleMust = State.get('tableTitleMust');
let frameNmaeSelect = State.get('frameNmaeSelect');

// ========== 工具函数 ==========
// 创建图片对象 URL（统一管理，便于后续优化和内存管理）
function createImageObjectURL(data, format = 'png'){
  if (!data) return null;
  const blob = data instanceof Blob ? data : new Blob([data], {type: `image/${format}`});
  return URL.createObjectURL(blob);
};

// 释放对象 URL（避免内存泄漏）
function revokeImageObjectURL(url){
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

//设置跳转链接
let hrefDoc = DOM.btnHelpDoc?.getAttribute('href');
if (hrefDoc && DOM.btnHelpDoc) {
  DOM.btnHelpDoc.setAttribute('href',`${hrefDoc}?type=fig&lan=${ROOT.getAttribute('data-language')}`);
}
let hrefTemplate = DOM.templateBtn?.getAttribute('href');
if (hrefTemplate && DOM.templateBtn) {
  DOM.templateBtn.setAttribute('href',`${hrefTemplate}?lan=${ROOT.getAttribute('data-language')}`);
}

getElementMix('language-1')?.addEventListener('change',()=>{
  if (DOM.btnHelpDoc && hrefDoc) {
    DOM.btnHelpDoc.setAttribute('href',`${hrefDoc}?type=fig&lan=${ROOT.getAttribute('data-language')}`);
  }
  if (DOM.templateBtn && hrefTemplate) {
    DOM.templateBtn.setAttribute('href',`${hrefTemplate}?lan=${ROOT.getAttribute('data-language')}`);
  }
});

// ========== 初始化事件 ==========
// 窗口加载事件
window.addEventListener('load',()=>{
  let time = getTime('HH')[0];
  if(time*1 > 20 && !PULGIN_LOCAL){
    nullPage();
    ISWORK_TIME = false;
    addToUserTips('worktime');
    return;
  };
  setTimeout(() => {
    /*clear*/
    let tabs = ['create','export','editor','variable','sheet','more tools']
    //viewPage(tabs[5])
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
    }, DELAY.TIPS_INTERVAL);
    addSearchs();
  }, DELAY.INIT);
});

// 窗口大小调整事件
window.addEventListener('resize',/*防抖*/debounce(()=>{
  if(window.innerWidth < 300){
    TV_MOVE = true;
  } else {
    TV_MOVE = false;
  };
}, DELAY.DEBOUNCE, true));

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
  DOM.TV_text.textContent = random[num];
  DOM.TV_text.setAttribute('data-'+ languge2 +'-text',random[1 - num]);
  DOM.TV_text.setAttribute('data-'+ languge.toLowerCase() +'-text',random[num]);
  let textW;
  if(num){
    textW = random[num].length * -1 - 4 + 'ch';//英文1ch
  }else{
    textW = random[num].length * -2 - 4 + 'ch';//中文2ch
  }
  DOM.TV_text.parentNode.style.setProperty('--tv-w',textW)

};
//添加更多功能的二级标题
function addSkillTitle(){
  // 获取技能节点（每次调用时重新查询，确保获取最新元素）
  const skillSecNodes = DOM.skillSecNode;
  
  // 检查 skillSecNodes 和 skillSecInfo 是否存在
  if (!skillSecNodes || skillSecNodes.length === 0) {
    console.warn('addSkillTitle: skillSecNodes not found');
    return;
  }
  
  if (!skillSecInfo || !Array.isArray(skillSecInfo)) {
    console.warn('addSkillTitle: skillSecInfo not found or not an array');
    return;
  }
  
  skillSecNodes.forEach(secnode =>{
    if (!secnode) return;
    
    let secid = secnode.getAttribute('data-skill-sec');
    if(secid){
      let info = skillSecInfo.find(item => item && item.id == secid);
      
      // 检查是否找到对应的信息
      if (!info || !info.name) {
        console.warn(`addSkillTitle: info not found for secid: ${secid}`);
        return;
      }
      
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
      if (secnode.parentNode) {
        loadFont(secnode.parentNode);
      }
    };
  });
};

// ========== 选中图层信息处理辅助函数 ==========
// 更新选中信息的显示
function updateSelectInfoDisplay(info){
  DOM.selectInfoBox.forEach(item => {
    const main = item.querySelector('[data-selects-info="main"]');
    const sec = item.querySelector('[data-selects-info="sec"]');
    const num = item.querySelector('[data-selects-info="num"]');
    if (main) main.textContent = info[0][0];
    if (sec) sec.textContent = info[1] ? info[1][0] : '';
    if (num) num.textContent = info.length;
  });
};

// 更新变换控制（斜切）
function updateTransformControls(transform){
  if (DOM.skewSetX && DOM.skewRangeX) {
    DOM.skewSetX.value = transform[0];
    DOM.skewRangeX.value = transform[0];
  }
  if (DOM.skewSetY && DOM.skewRangeY) {
    DOM.skewSetY.value = transform[1];
    DOM.skewRangeY.value = transform[1];
  }
  if (DOM.scaleSetX && DOM.scaleRangeX) {
    DOM.scaleSetX.value = transform[2];
    DOM.scaleRangeX.value = transform[2];
  }
  if (DOM.scaleSetY && DOM.scaleRangeY) {
    DOM.scaleSetY.value = transform[3];
    DOM.scaleRangeY.value = transform[3];
  }
};

// 更新裁剪设置
function updateClipSettings(clipRC){
  const clipHSet = getElementMix('data-clip-h-set');
  const clipWSet = getElementMix('data-clip-w-set');
  
  if (clipHSet && clipWSet) {
    // 清除所有选中状态
    clipHSet.querySelectorAll('[data-radio-main="true"]').forEach(item => {
      item.setAttribute('data-radio-main','false');
    });
    clipWSet.querySelectorAll('[data-radio-main="true"]').forEach(item => {
      item.setAttribute('data-radio-main','false');
    });
    
    // 设置新的选中状态
    const clipHItem = clipHSet.querySelector(`[data-radio-data="${clipRC[1]}"]`);
    const clipWItem = clipWSet.querySelector(`[data-radio-data="${clipRC[0]}"]`);
    if (clipHItem) clipHItem.setAttribute('data-radio-main','true');
    if (clipWItem) clipWItem.setAttribute('data-radio-main','true');
  }
};

//处理选中图层的信息（基础）
function reSelectInfo(info){
  SelectNodeInfo = info;
  
  // 更新选中状态
  if(info[0][0] !== null){
    ROOT.setAttribute('data-selects','true');
    updateSelectInfoDisplay(info);
  } else{
    ROOT.setAttribute('data-selects','false');
  };
  
  // 单个选中时的特殊处理
  if(info.length == 1){
    // 更新变换控制
    if (info[0][3]) {
      updateTransformControls(info[0][3]);
    }
    
    // 更新裁剪设置
    if (info[0][4]) {
      updateClipSettings(info[0][4]);
    }
  };
  
  // 多选状态
  if(info.length > 1){
    ROOT.setAttribute('data-selects-more','true');
  }else{
    ROOT.setAttribute('data-selects-more','false');
  };
};

//按用户偏好修改界面大小
function reRootSize(info){
  if(info[0] > UI[0]){
    DOM.btnBig.checked = true;
  } else {
    DOM.btnBig.checked = false;
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
      DOM.dailogSearchBox.parentNode.style.display = 'none';
      viewPage(list.page[1]);
      let viewskill = getElementMix('data-page-id="page"').querySelector(`[data-en-text="${list.name[1]}"]`);
      if(!viewskill) return;
      viewskill.scrollIntoView({behavior:"smooth",block: "center"});
      setTimeout(()=>{
        addFindBox(viewskill,list);
      },500);
    };
    turnto.appendChild(btn);
    DOM.dailogSearchBox.appendChild(turnto)
  });
 
  //重置文字样式
  loadFont(DOM.dailogSearchBox);
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

//========== 界面交互 ==========

let tool = new TOOL_JS();
//侧边栏展开
// ========== 侧边栏控制辅助函数 ==========
// 打开侧边栏
function openSidebar(){
  if (!DOM.sideMix || !DOM.sideMask) return;
  DOM.sideMix.style.display = 'flex';
  DOM.sideMask.style.display = 'block';
  DOM.sideMix.style.animation = 'sideUp 0.3s ease-out';
  DOM.sideMask.style.animation = 'loadOp 0.3s';
};

// 关闭侧边栏
function closeSidebar(){
  if (!DOM.sideMix || !DOM.sideMask) return;
  DOM.sideMix.style.animation = 'sideOver 0.3s ease-out';
  DOM.sideMask.style.animation = 'overOp 0.3s ease-out';
  setTimeout(()=>{ 
    DOM.sideMix.style.display = 'none';
    DOM.sideMask.style.display = 'none';
  }, DELAY.SIDEBAR_CLOSE);
};

//侧边栏展开/关闭
DOM.btnMore.addEventListener('change',(event)=>{
  if(event.target.checked){
    openSidebar();
  } else {
    closeSidebar();
  }
});
//侧边栏关闭（点击外部区域）
document.addEventListener('mousedown',(event)=>{
  if (!DOM.sideMix || !DOM.sideMask || !DOM.btnMore) return;
  
  const isOutside = !DOM.sideMix.contains(event.target);
  const isVisible = DOM.sideMask.style.display !== 'none' && DOM.sideMix.style.display !== 'none';
  const isOpen = DOM.btnMore.checked === true;
  
  if(isOutside && isVisible && isOpen){
    DOM.btnMore.checked = false;
    const inputEvent = new Event('change', {bubbles: true});
    DOM.btnMore.dispatchEvent(inputEvent);
  }
});
//缩放窗口
// 保存窗口大小的防抖函数
const saveWindowSize = debounce((w, h) => {
  storageMix.set('userResize',[w,h]);
  if(w > UI[0]){
    DOM.btnBig.checked = true;
  } else {
    DOM.btnBig.checked = false;
  }
}, DELAY.RESIZE_SAVE);

DOM.btnResize.addEventListener('mousedown',(event)=>{
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
      
      // 使用防抖函数保存窗口大小
      saveWindowSize(w, h);
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
// 搜索处理函数
function handleSearchInput(){
  const input = DOM.skillSearchInput;
  if (!input) return;
  
  if(input.value.trim() == ''){
    document.querySelectorAll('[data-search-turnto]').forEach(item => {
      item.setAttribute('data-search-pick','false');
    });
    return;
  };
  
  let value = input.value.toLowerCase().trim();
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
    if (!list) return;
    
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
  });
};

// 使用防抖函数优化搜索
DOM.skillSearchInput?.addEventListener('input', debounce(handleSearchInput, DELAY.SEARCH));
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
  setTimeout(()=>{findBox.remove()}, DELAY.FIND_BOX_REMOVE);
}
//最大化窗口
DOM.btnBig.addEventListener('change',()=>{
  let w = window.innerWidth;
  let h = window.innerHeight;
  if(DOM.btnBig.checked){
    if(w < UI[0] || h < UI[1]){
      toolMessage([false,'big'],PLUGINAPP);
      DOM.btnBig.checked = false;
    }else{
      toolMessage([true,'big'],PLUGINAPP);
    }
  }else{
    toolMessage([false,'big'],PLUGINAPP);
  }
});
//点击上传
DOM.userImg.addEventListener('change',(e)=>{
  let files = Array.from(DOM.userImg.files);
  reFileInfo(files);
  addImageTags(files)
});
DOM.userTable.addEventListener('change',(e)=>{
  let files = Array.from(DOM.userTable.files);
  reFileInfo(files);
  addTableText(files)
});
DOM.userZy.addEventListener('change',(e)=>{
  let files = Array.from(DOM.userZy.files);
  reFileInfo(files);
  addZyCatalogue(files)
});
//拖拽上传
let dragAreaInfo;
DOM.dropUp.addEventListener('dragover',(e)=>{
  dragAreaInfo = DOM.dropUp.getBoundingClientRect();
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  DOM.dropUp.style.filter = 'drop-shadow(0 0 4px let(--mainColor))';
  DOM.dropUp.style.setProperty('--drop-df','collapse');
});
DOM.dropUp.addEventListener('dragleave',(e)=>{
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
    DOM.dropUp.style.filter = '';
    DOM.dropUp.style.setProperty('--drop-df','visible');
  }
});
// ========== 文件上传策略函数 ==========
// 文件上传策略映射
const FILE_UPLOAD_STRATEGIES = {
  'image': (files) => addImageTags(files, true),
  'table': (files) => addTableText(files, true),
  'zy': (files) => addZyCatalogue(files)
};

// 执行文件上传策略（简化：直接使用策略映射，保留错误处理）
function executeFileUploadStrategy(type, files){
  const strategy = FILE_UPLOAD_STRATEGIES[type];
  if (!strategy) {
    console.warn(`Unknown file type: ${type}`);
    return;
  }
  strategy(files);
};

// ========== 文件格式处理策略函数 ==========
// Markdown 文件处理策略
async function handleMarkdownFile(content, createname){
  const textarea = DOM.userText;
  if (textarea) {
    textarea.value = content.trim();
    textarea.focus();
    try {
      const mds = await tool.MdToObj(content.trim(), createname);
      if (!mds || (Array.isArray(mds) && mds.length === 0)) {
        tipsAll(MESSAGES.ZY_DATA_ERROR, 3000);
        return;
      }
      addTag('zy', mds);
    } catch (error) {
      console.error('Markdown parsing error:', error);
      tipsAll(MESSAGES.ZY_DATA_ERROR, 3000);
    }
  }
};

// SVG 文件处理策略
async function handleSvgFile(content, createname){
  const textarea = DOM.userText;
  if (textarea) {
    textarea.value = content.trim();
    textarea.focus();
    try {
      const svgs = await tool.SvgToObj(content.trim(), createname);
      if (!svgs || (Array.isArray(svgs) && svgs.length === 0)) {
        tipsAll(MESSAGES.ZY_DATA_ERROR, 3000);
        return;
      }
      addTag('zy', svgs);
    } catch (error) {
      console.error('SVG parsing error:', error);
      tipsAll(MESSAGES.ZY_DATA_ERROR, 3000);
    }
  }
};

// ZY 文件处理策略（占位符）
async function handleZyFile(content, createname){
  // TODO: 实现 ZY 文件处理逻辑
  console.warn('handleZyFile: ZY file format not yet implemented');
};

// 文件格式处理策略映射
const FILE_FORMAT_STRATEGIES = {
  'md': handleMarkdownFile,
  'svg': handleSvgFile,
  'zy': handleZyFile
};

// 执行文件格式处理策略（简化：直接使用策略映射，保留错误处理）
async function executeFileFormatStrategy(format, content, createname){
  const strategy = FILE_FORMAT_STRATEGIES[format];
  if (!strategy) {
    console.warn(`Unknown file format: ${format}`);
    return;
  }
  await strategy(content, createname);
};

// 检测文件类型
async function detectFileType(files, filesTypes){
  if (!files || files.length === 0) return null;
  
  // 优先检测真实图片格式（对于可能的图片文件）
  // 先检查扩展名是否可能是图片
  const possibleImageExts = filesTypes.filter(ext => imageType.length > 0 && imageType.includes(ext));
  if (possibleImageExts.length > 0 && files.length > 0) {
    // 对第一个可能的图片文件检测真实格式
    const realyType = await tool.TrueImageFormat(files[0]);
    if (realyType && imageType.includes(realyType)) {
      // 如果真实格式是图片，检查所有文件是否都是图片格式
      if (filesTypes.every(item => imageType.includes(item))) {
        return 'image';
      }
    }
  }
  
  // 通过扩展名判断（需要确保类型数组不为空）
  if (imageType.length > 0 && filesTypes.every(item => imageType.includes(item))) {
    return 'image';
  } else if (tableType.length > 0 && filesTypes.every(item => tableType.includes(item))) {
    return 'table';
  } else if (zyType.length > 0 && filesTypes.every(item => zyType.includes(item))) {
    return 'zy';
  }
  
  // 如果无法通过扩展名判断，再次尝试检测真实格式（作为兜底）
  if (files.length > 0) {
    const realyType = await tool.TrueImageFormat(files[0]);
    if (realyType && imageType.length > 0 && imageType.includes(realyType)) {
      return 'image';
    }
  }
  
  return null;
};

DOM.dropUp.addEventListener('drop',async (e)=>{
  e.stopPropagation();
  e.preventDefault();
  DOM.dropUp.style.filter = '';
  DOM.dropUp.style.setProperty('--drop-df','visible');
  let files = Array.from(e.dataTransfer.files);

  // 提取文件扩展名（更安全的提取方式）
  let filesTypes = [...new Set(files.map(item => {
    const name = item.name;
    const lastDotIndex = name.lastIndexOf('.');
    return lastDotIndex > 0 ? name.substring(lastDotIndex + 1).toLowerCase() : '';
  }).filter(ext => ext !== ''))];
  let sameType = await detectFileType(files, filesTypes);
  
  if(sameType){
    files = files.sort((a, b) => b.size - a.size);
    reFileInfo(files);
    // 使用策略模式处理文件上传
    executeFileUploadStrategy(sameType, files);
  } else {
    tipsAll(MESSAGES.FILE_TYPE_ERROR, 3000);
  }
  
});


DOM.userText.addEventListener('paste',(e) => {
  let pasted = e.clipboardData.getData('text/plain') //await navigator.clipboard.readText();
  
  if(pasted.includes('base64,')){
    DOM.userText.setAttribute('data-textarea-wrap','true');
    setTimeout(()=>{DOM.userText.scrollTop = 0})
  }else {
    DOM.userText.setAttribute('data-textarea-wrap','false');
  }
})
DOM.userText.parentNode.querySelector('[data-close]').addEventListener('click',()=>{
  DOM.userText.setAttribute('data-textarea-wrap','false');

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
DOM.userText.addEventListener('scroll',()=>{
  let numbox = getElementMix('data-textarea-linenum-box');
  let linenums = getElementMix('data-textarea-linenum');
  numbox.scrollTop = DOM.userText.scrollTop;
  if(textareaLineNum*16 < DOM.userText.scrollTop + DOM.userText.offsetHeight){
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
  DOM.userText.scrollTop = 0;
});
userText_BtnDown.addEventListener('dblclick',()=>{
  DOM.userText.scrollTop = DOM.userText.scrollHeight;
});

userText_BtnUp.addEventListener('mousedown',()=>{
  userText_ScrollUp = setInterval(()=>{
    DOM.userText.scrollTop -= DOM.userText.offsetHeight;
  },10);
});
userText_BtnDown.addEventListener('mousedown',()=>{
  userText_ScrollDown = setInterval(()=>{
    DOM.userText.scrollTop += DOM.userText.offsetHeight;
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
  let oldvalue = DOM.imgnumSet.value * 1;
  let maxnum = ExportImageInfo.length;
  DOM.imgnumSet.value = (oldvalue + 1) <= maxnum ? (oldvalue + 1) : maxnum;
  if(DOM.imgnumSet.value == oldvalue) return;
  DOM.imgnumSet.parentNode.setAttribute('data-int-value',DOM.imgnumSet.value);
});
getElementMix('data-imgnum-down').addEventListener('click',()=>{
  let oldvalue = DOM.imgnumSet.value * 1;
  DOM.imgnumSet.value = (oldvalue - 1) >= 1 ? (oldvalue - 1) : 1;
  if(DOM.imgnumSet.value == oldvalue) return;
  DOM.imgnumSet.parentNode.setAttribute('data-int-value',DOM.imgnumSet.value);
});

function btnConvert(isStart){
  let btn = DOM.convertTags.querySelector('btn-re');
  btn.style.animation = isStart ? 'loadRo2 2s linear infinite' : '';
  btn.parentNode.style.borderColor = isStart ? 'var(--mainColor)' : 'var(--boxBod)';
}

DOM.userText.addEventListener('dblclick',()=>{
  btnConvert(true);
});

DOM.userText.addEventListener('input',()=>{
  if(DOM.userText.value == ''){
    btnConvert(false);
  } else {
    btnConvert(true);
  }
});

[DOM.userText.parentNode.parentNode,getElementMix('upload-moreset-box')].forEach(item => {
  item.addEventListener('mouseenter',()=>{
    if(DOM.userText.value == '') return;
    btnConvert(true);
  });
});
[DOM.userText.parentNode.parentNode,getElementMix('upload-moreset-box')].forEach(item => {
  item.addEventListener('mouseleave',()=>{
    if(DOM.userText.value !== '') return;
    btnConvert(false);
  });
});

//创建内容
// ========== 创建内容辅助函数 ==========
//移除未勾选的数据
function getFinalInfo(info,isname){
  if (!info || !Array.isArray(info)) {
    return [];
  }
  let finalCreate = [...info];
  const tagsBox = DOM.createTagsBox;
  if (!tagsBox) {
    console.warn('getFinalInfo: createTagsBox not found');
    return finalCreate;
  }
  
  let nocreateTag = tagsBox.querySelectorAll('[data-create-final="false"]');
  nocreateTag.forEach(item => {
    const input = item.querySelector('input');
    if (input && input.id) {
      let idnum = input.id.split('_')[input.id.split('_').length - 1];
      finalCreate.splice(idnum,1);
    }
  });
  
  if(isname){
    let createTag = tagsBox.querySelectorAll('[data-create-final="true"]');
    createTag.forEach((item,index) => {
      const nameEl = item.querySelector('[data-create-info="name"]');
      if (nameEl) {
        finalCreate[index].name = nameEl.textContent.trim();
      }
    });
  };
  return finalCreate;
};

// ========== 创建内容策略函数 ==========
// 创建图片策略
function createImageStrategy(){
  const images = getFinalInfo(CreateImageInfo);
  if (images.length === 0) {
    console.warn('createImageStrategy: No images to create');
    return;
  }
  tipsAll(MESSAGES.READING, images.length * 800);
  setTimeout(()=>{
    toolMessage([images,'createImage'],PLUGINAPP);
  },100);
};

// 创建表格策略
function createTableStrategy(){
  const tables = getFinalInfo(CreateTableInfo,true);
  if (tables.length === 0) {
    console.warn('createTableStrategy: No tables to create');
    return;
  }
  tipsAll(MESSAGES.READING, CreateTableInfo.length * 100);
  setTimeout(()=>{
    toolMessage([tables,'createFrame'],PLUGINAPP);
  },100);
};

// 创建资源目录策略
function createZyStrategy(){
  const zys = getFinalInfo(CataloguesInfo,true);
  if (zys.length === 0) {
    console.warn('createZyStrategy: No catalogues to create');
    return;
  }
  tipsAll(MESSAGES.READING, CataloguesInfo.length * 100);
  setTimeout(()=>{
    toolMessage([zys,'createZy'],PLUGINAPP);
  },100);
};

// ========== 创建内容策略映射 ==========
const CREATE_STRATEGIES = {
  'image': createImageStrategy,
  'table': createTableStrategy,
  'zy': createZyStrategy
};

// 执行创建策略（简化：直接使用策略映射，保留错误处理）
function executeCreateStrategy(type){
  const strategy = CREATE_STRATEGIES[type];
  if (!strategy) {
    console.warn(`Unknown create type: ${type}`);
    return;
  }
  strategy();
};

//创建内容（策略模式重构）
DOM.createAnyBtn?.addEventListener('click',() => {
  const tagsBox = DOM.createTagsBox;
  if (!tagsBox || !tagsBox.parentNode || !tagsBox.parentNode.parentNode) {
    console.warn('createAnyBtn: createTagsBox structure not found');
    return;
  }
  let type = tagsBox.parentNode.parentNode.getAttribute('data-create-tags-box');
  if (!type) {
    console.warn('createAnyBtn: No type attribute found');
    return;
  }
  executeCreateStrategy(type);
});
//功能列表滚动绑定tab
DOM.skillAllModel.forEach(item =>{
  /**/
  let icon = document.querySelector(`[data-skillmodule-for="${item.getAttribute('data-skillmodule')}"]`).previousElementSibling.cloneNode(true);
  icon.setAttribute('data-skilltype-icon','mini');
  item.appendChild(icon);
  /**/
  item.addEventListener('mouseenter',() => {
    isSkillScroll = false;
    let modelid = item.getAttribute('data-skillmodule');
    let index = skillModel.findIndex(skill => skill.includes(modelid));
    let tab = DOM.skillTypeBox.querySelector(`[data-radio-data="${(index + 1)}"]`);
    tab.click();
  });
});
DOM.skillTypeBox.addEventListener('mouseenter',() => {
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
  DOM.clearCreateTags.click();
  let sizes = files.map(item => item.size);
  let sizeAll = sizes.reduce((a,b) => a + b, 0);
  sizeAll = sizeAll*1 == NaN ? files.length : sizeAll; //大图至少算1M大小
  tipsAll(MESSAGES.READING, sizeAll/1024/1024 * 100); //加载1M需要100毫秒
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
  DOM.clearCreateTags.click();
  DOM.userText.focus();
  DOM.userText.value = '';
  let tableText;
  if(typeof(files) == 'string'){
    tableText = files;
  } else {
    tableText = await loadTable(files[0])
  }
  DOM.userText.value = tableText;
  
  // 如果是拖拽上传（isTags=true），需要先验证表格格式
  if(isTags){
    // 检查第一行是否包含表格必需的字段
    const firstline = tableText.trim().split('\n')[0];
    const isTableText = ['name','w','h'].every(item => firstline.includes(item));
    
    if(!isTableText){
      // 表格格式错误，提示用户
      tipsAll(MESSAGES.TABLE_DATA_ERROR, 3000);
      return; // 不继续处理，不调用 convertTags.click()
    }
    
    // 验证表格数据是否可以正确解析
    try {
      let tableArray = tableTextToArray(tableText, false, DOM.userTableTitle.value.split(','));
      if(!tableArray || tableArray.length < 2){
        tipsAll(MESSAGES.TABLE_DATA_ERROR, 3000);
        return;
      }
      let tableObj = tableArrayToObj(tableArray);
      if(!tableObj || tableObj.length === 0){
        tipsAll(MESSAGES.TABLE_DATA_ERROR, 3000);
        return;
      }
      CreateTableInfo = tableObj;
      // 格式正确，触发转换
      DOM.convertTags.click();
    } catch (error) {
      console.error('Table data parsing error:', error);
      tipsAll(MESSAGES.TABLE_DATA_ERROR, 3000);
      return;
    }
  } else {
    // 手动输入的情况，直接解析（允许用户尝试不同格式）
    let tableArray = tableTextToArray(tableText);
    let tableObj = tableArrayToObj(tableArray);
    CreateTableInfo = tableObj;
  }
}
function addTableTags(){
  addTag('table',CreateTableInfo);
};
async function addZyCatalogue(files,codetype){
  //log([files,files instanceof FileList , files instanceof File])
  if(codetype){
    // 如果指定了 codetype，说明是从文本框转换来的，直接添加标签
    addTag('zy',files)
  } else if ( files instanceof FileList || files instanceof File || (Array.isArray(files) && files.length > 0)){
    // 拖拽上传的情况，需要验证文件格式
    let hasError = false;
    let processedCount = 0;
    
    for(let i = 0; i < files.length; i++){
      let file = files[i];
      // 更安全的扩展名提取
      const lastDotIndex = file.name.lastIndexOf('.');
      const format = lastDotIndex > 0 ? file.name.substring(lastDotIndex + 1).toLowerCase() : '';
      
      // 检查格式是否支持（md, svg, zy）
      const supportedFormats = ['md', 'svg', 'zy'];
      if (!format || !supportedFormats.includes(format)) {
        hasError = true;
        continue;
      }
      
      let filenameRegex = new RegExp('.' + format,'gi');
      let createname = file.name.replace(filenameRegex,'') + '@MD_NODE';
      
      try{
        let reader = new FileReader();
        reader.onload = async(e)=>{
          try {
            // 使用策略模式处理文件格式
            await executeFileFormatStrategy(format, reader.result, createname);
            processedCount++;
          } catch (error) {
            console.error('File format processing error:', error);
            hasError = true;
          }
        };
        reader.onerror = (error)=>{
          console.error('FileReader error:', error);
          hasError = true;
        };
        reader.readAsText(file);
        
      } catch (error) {
        console.error('File processing error:', error);
        hasError = true;
      }
    };
    
    // 如果所有文件处理都失败，提示错误
    if (hasError && processedCount === 0) {
      tipsAll(MESSAGES.ZY_DATA_ERROR, 3000);
    }
  }
};

// ========== 标签处理辅助函数 ==========
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

  return select;
};

// ========== 标签创建策略函数 ==========
// 图片标签策略
function createImageTagStrategy(info){
  info.forEach((img,index) => {
    let tag = document.createElement('div');
    DOM.createTagsBox.parentNode.parentNode.setAttribute('data-create-tags-box','image');
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
        DOM.dailogBox.innerHTML = '';
        DOM.dailog.style.display = 'flex';
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
        DOM.dailogBox.appendChild(cutinfo);
      });
    }
    DOM.createTagsBox.appendChild(tag);
  });
};

// 表格标签策略
function createTableTagStrategy(info){
  let nameRegex = DOM.frameName.value;
  info.forEach((list,index) => {
    let tag = document.createElement('div');
    DOM.createTagsBox.parentNode.parentNode.setAttribute('data-create-tags-box','table');
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
    DOM.createTagsBox.appendChild(tag);
  });
};

// 资源目录标签策略
function createZyTagStrategy(info){
  if(info.zyType){
    CataloguesInfo.push(info);
    //log(info)
    let index = Array.from(DOM.cataloguesBox.children).length;
    let tag = document.createElement('div');
    DOM.cataloguesBox.parentNode.parentNode.setAttribute('data-create-tags-box','zy');
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
    switch(info.zyType){
      case 'md':
        let html = marked.parse(DOM.userText.value.trim());
        layerList.innerHTML = html;
        layerList.addEventListener('dblclick',async()=>{
          
          let imgdata = await tool.DomToImagedata(layerList,{scale:3});
          imgdata.fileName = info.zyName;
          //console.log(imgdata)
          tool.ExportImgByData(hasExport,[imgdata],false,imgdata.fileName)
          function hasExport(index,finalSize,quality,isSuccess){
            log(index,finalSize,quality,isSuccess)
          };
          
        });
        break;
      case 'svg':
        break;
    }
    tag.appendChild(layerList);
    DOM.cataloguesBox.appendChild(tag);
  }else{

  };
};

// 导出图片标签策略
function createExportImgTagStrategy(info){
  ExportImageInfo.push(...info);
  getElementMix('data-imgnum-max').textContent = ExportImageInfo.length;
  DOM.exportTagsBox.innerHTML = '<!--动态填充-->';
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
      DOM.imgnumSet.value = index + 1;
      let img = layer.compressed ? layer.compressed : layer.u8a;
      DOM.dailogImgBox.innerHTML = '';
      DOM.dailogImg.style.display = 'flex';
      let viewimg = document.createElement('img');
      let ismaxW = layer.width >= layer.height ? 'true' : 'false';
      viewimg.setAttribute('data-ismaxW',ismaxW);
      viewimg.src = URL.createObjectURL(new Blob([img],{type:'image/' + layer.format}));
      DOM.dailogImgBox.appendChild(viewimg);
      viewimg.setAttribute('data-imgnum-pick',index + 1);
    });
    sizebox.appendChild(view);
    sizeinfo.appendChild(sizebox);
    exportset.appendChild(sizeinfo);

    tag.appendChild(exportset);
    DOM.exportTagsBox.appendChild(tag);
  });
};

// ========== 获取容器辅助函数 ==========
function getContainerByType(type){
  switch(type) {
    case 'image':
    case 'table':
      return DOM.createTagsBox;
    case 'zy':
      return DOM.cataloguesBox;
    case 'export-img':
      return DOM.exportTagsBox;
    default:
      return null;
  }
};

//添加标签-总（策略模式重构）
function addTag(type,info){
  // 策略注册表
  const TAG_STRATEGIES = {
    'image': createImageTagStrategy,
    'table': createTableTagStrategy,
    'zy': createZyTagStrategy,
    'export-img': createExportImgTagStrategy
  };

  // 获取策略函数
  const strategy = TAG_STRATEGIES[type];
  if (!strategy) {
    console.error(`Unknown tag type: ${type}`);
    return;
  }

  // 执行策略
  strategy(info);

  // 公共后处理逻辑
  const container = getContainerByType(type);
  if (container) {
    getCompChange(container);
  }
  //重置文字样式
  loadFont(DOM.createTagsBox.parentNode);
};

//预览导出图片-放大
getElementMix('fullimg').addEventListener('change',(e)=>{
  if(e.target.checked){
    DOM.dailogImgBox.setAttribute('data-isfull','true');
  }else{
    DOM.dailogImgBox.setAttribute('data-isfull','false');
  };
});
getElementMix('fulleditor').addEventListener('change',(e)=>{
  if(e.target.checked){
    DOM.editorViewbox.setAttribute('data-isfull','true');
  }else{
    DOM.editorViewbox.setAttribute('data-isfull','false');
  };
});
//编辑预览图
function addEditorView(info){
  let viewimg = DOM.editorViewbox.querySelector('img');
  viewimg = viewimg ? viewimg : document.createElement('img');
  let ismaxW = info.width >= info.height ? 'true' : 'false';
  viewimg.setAttribute('data-ismaxW',ismaxW);
  viewimg.src = URL.createObjectURL(new Blob([info.u8a],{type:'image/png'}));
  DOM.editorViewbox.appendChild(viewimg);
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
  DOM.exportTagsBox.innerHTML = '<!--动态填充-->';
});

//导出内容
DOM.exportAnyBtn.addEventListener('click',()=>{
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
    DOM.editorViewbox.style.setProperty('--bg',color)
  }else{
    DOM.editorViewbox.style.setProperty('--bg','none')
  }
})

//管理断链样式
DOM.btnLinkstyle.addEventListener('click',()=>{
  toolMessage(['','manageLinkStyle'],PLUGINAPP);
});
//管理样式组
DOM.btnSelectstyle.addEventListener('click',()=>{
  toolMessage(['','manageStyleGroup'],PLUGINAPP);
});
//管理变量组
DOM.btnVariables.addEventListener('click',()=>{
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
DOM.clearCreateTags.addEventListener('click',()=>{
  CreateImageInfo = [];
  CreateTableInfo = [];
  CataloguesInfo = [];
  DOM.createTagsBox.innerHTML = '';
  DOM.cataloguesBox.innerHTML = '';
});
//文本框内容转标签/大纲
DOM.convertTags.addEventListener('click',async ()=>{
  DOM.clearCreateTags.click();
  let firstline = DOM.userText.value.trim().split('\n')[0];
  let isTableText = ['name','w','h'].every(item => firstline.includes(item));
  if(isTableText){
    let tableArray = tableTextToArray(DOM.userText.value.trim(),false,DOM.userTableTitle.value.split(','));
    let tableObj = tableArrayToObj(tableArray);
    CreateTableInfo = tableObj;

    if(CreateTableInfo.some(item => item.note || item.s)){
      document.getElementById('upload-moreset').checked = true;
      document.querySelector('[for="upload-moreset"]').click();
    };
    setTimeout(()=>{
      addTableTags();
    }, DELAY.CONVERT_TAGS);
  }else if(firstline.includes('svg')){
    let svgs = await tool.SvgToObj(DOM.userText.value.trim())
    addZyCatalogue(svgs,'svg')
  }else if(firstline !== ''){
    //tipsAll(['数据格式错误, 请检查~','Data format error, please check~'],3000)
    try{
      let mds = await tool.MdToObj(DOM.userText.value.trim());
      //console.log(mds)
      addZyCatalogue(mds,'md')
    } catch (e) {
      console.error('Failed to parse markdown:', e);
    }
  };
});
//从所选图层获取数据
DOM.getTableText.addEventListener('click',()=>{
  toolMessage(['','getTableBySelects'],PLUGINAPP);
});
//显示所上传文件名（优化：提取逻辑，提高可读性）
function reFileInfo(files){
  if (!files || files.length === 0 || !DOM.fileInfo) {
    return;
  }
  
  const language = ROOT.getAttribute('data-language');
  const fileCount = files.length;
  const fileLength = `<span style="color: var(--code2)">${fileCount}</span>`;
  
  // 构建文件名显示文本
  const fileName1 = fileCount === 1 
    ? files[0].name 
    : `${files[0].name} ...等 ${fileLength} 个文件`;
  const fileName2 = fileCount === 1 
    ? files[0].name 
    : `${files[0].name} ... ${fileLength} files`;
  
  // 截断文本并添加图标
  const displayName1 = '📁 ' + tool.TextMaxLength(fileName1, 20, '..');
  const displayName2 = '📁 ' + tool.TextMaxLength(fileName2, 20, '..');
  
  // 设置多语言属性
  DOM.fileInfo.setAttribute('data-zh-text', displayName1);
  DOM.fileInfo.setAttribute('data-en-text', displayName2);
  
  // 根据当前语言显示
  DOM.fileInfo.innerHTML = language === "Zh" ? displayName1 : displayName2;
};
//设置画板命名格式
DOM.frameName.addEventListener('input',()=>{
  if(frameNmaeSelect.includes(DOM.frameName.value)){
    DOM.frameName.nextElementSibling.querySelector(`[data-option-value="${DOM.frameName.value}"]`).click();
  }else{
    DOM.frameName.nextElementSibling.querySelector(`[data-select-input]`).value = '';
  };
});
DOM.frameName.addEventListener('change',()=>{
  DOM.convertTags.click();
});
//设置画板数据表头规则
DOM.userTableTitle.addEventListener('change',()=>{
  DOM.userTableTitle.value = reTableTitle(DOM.userTableTitle.value);
});
// ========== 表格标题处理辅助函数 ==========
// 确保包含必需的字段
function ensureRequiredFields(texts){
  const required = ['name', 'w', 'h'];
  const result = [...new Set(texts)];
  required.forEach(field => {
    if(!result.includes(field)){
      result.push(field);
    }
  });
  return result;
};

// 验证并清理表格标题
function validateTableTitle(text){
  if(text == ''){
    return '';
  }
  
  let texts = text.split(',').map(item => item.trim());
  
  // 检查是否包含无效单词
  const invalidWords = texts.filter(item => !tableTitleMust.includes(item));
  if(invalidWords.length > 0){
    tipsAll(MESSAGES.TABLE_TITLE_WORDS_ERROR, 3000);
    texts = texts.filter(item => tableTitleMust.includes(item));
    
    if(texts.length == 0){
      return 'name,w,h';
    }
  }
  
  // 去重
  texts = [...new Set(texts)];
  
  // 检查是否包含必需字段
  const hasRequired = texts.includes('name') && texts.includes('w') && texts.includes('h');
  
  if(!hasRequired){
    tipsAll(MESSAGES.TABLE_TITLE_REQUIRED_ERROR, 3000);
    texts = ensureRequiredFields(texts);
  } else if(texts.length !== [...new Set(text.split(',').map(item => item.trim()))].length){
    // 检查是否有重复（在去重前）
    tipsAll(MESSAGES.TABLE_TITLE_REPEAT_ERROR, 3000);
  }
  
  return texts.join(',');
};

//设置画板数据表头规则（简化重构）
function reTableTitle(text){
  return validateTableTitle(text);
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
    DOM.styleTosheet.setAttribute('data-any','');
  }else{
    hasstyle.setAttribute('data-variable-hasstyle','false');
    DOM.styleTosheet.setAttribute('data-any','unclick');
  };
};
//修改样式表信息读取状态
function reStyleSheetInfo(info){
  let hasstylesheet = getElementMix('data-variable-hasstylesheet');
  if(info){
    hasstylesheet.setAttribute('data-variable-hasstylesheet','true');
    DOM.sheetTostyle.setAttribute('data-any','');
  }else{
    hasstylesheet.setAttribute('data-variable-hasstylesheet','false');
    DOM.sheetTostyle.setAttribute('data-any','unclick');
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
DOM.chkTablestyle.addEventListener('change',()=>{
  DOM.chkTablestyle.checked = true;
  getElementMix('chk-selectcomp').checked = false;
  getElementMix('data-selectcomp-box').style.display = 'none';
  getElementMix('data-tablestyle-box').style.display = 'flex';
  toolMessage([false,'selectComp'],PLUGINAPP);
});
DOM.chkSelectcomp.addEventListener('change',()=>{
  DOM.chkSelectcomp.checked = true;
  getElementMix('chk-tablestyle').checked = false;
  getElementMix('data-tablestyle-box').style.display = 'none';
  getElementMix('data-selectcomp-box').style.display = 'flex';
  toolMessage([true,'selectComp'],PLUGINAPP);
});
//创建表格
DOM.createTableBtn.addEventListener('click',()=>{
  let comp1 = getElementMix('data-selectcomp-1').textContent;
  let comp2 = getElementMix('data-selectcomp-2').textContent;
  comp1 = comp1 == 'none' ? null : comp1;
  comp2 = comp2 == 'none' ? null : comp2;
  let styleId = DOM.tableStyleSet.getAttribute('data-radio-value') - 1;
  if(getElementMix('chk-tablestyle').checked){
    toolMessage([[tableStyle[styleId]],'creTable'],PLUGINAPP);
  }else{
    toolMessage([[tableStyle[styleId],comp1,comp2],'creTable'],PLUGINAPP);
  };
});
//上传|拖拽|输入 的规则说明
DOM.btnHelp.forEach(item => {
  item.addEventListener('click',()=>{
    let key = item.getAttribute('data-help');
    if(DOM.dailogBox.innerHTML.split(helpData[key][0][1].split('<')[0]).length == 1){
      DOM.dailogBox.innerHTML = '';
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
      DOM.dailogBox.appendChild(node);
      //最后重置下语言
      if(ROOT.getAttribute('data-language') == 'En'){
        setLanguage(true);
        setLanguage(false);
      };
      //重置文字样式
      loadFont(DOM.dailogBox);
    };
    DOM.dailog.style.display = 'flex';
  });
});
//点击弹窗外关闭弹窗
DOM.dailog.addEventListener('click',(e)=>{
  if(!DOM.dailogBox.contains(e.target)){
    DOM.dailog.style.display = 'none';
  };
});
//收藏功能
DOM.skillStar.forEach(item =>{
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
      DOM.skillStarModel.prepend(skillNode);
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
DOM.pixelScale.addEventListener('change',()=>{
  let set = document.querySelector('[data-pixelscale-set]');
  let sets = set.querySelectorAll('[data-radio-data]');
  let num = [];
  sets.forEach(item => {
    num.push(item.getAttribute('data-radio-data'));
  })
  if(num.includes(DOM.pixelScale.value)){
    set.querySelector(`[data-radio-data="${DOM.pixelScale.value}"]`);
  }else{
    num.forEach(item => {
      set.querySelector(`[data-radio-data="${item}"]`).setAttribute('data-radio-main','false')
    });
  };
});
//返回裁切方案以栅格化
DOM.skillAllBox.querySelector('[data-pixel-copy]').addEventListener('click',()=>{
  
});
//按各自比例/统一宽高进行等比缩放
function scaleRWH(){

};
//斜切拉伸
function sendTransform(){
  let data = {
    x: DOM.skewSetX.value * 1,
    y: DOM.skewSetY.value * 1,
    w: DOM.scaleSetX.value * 1,
    h: DOM.scaleSetY.value * 1,
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

// QR码网格拖拽和调整大小功能 - 类封装
class QRCodeGridController {
  constructor(gridSelector, resizeSelector, viewBoxSelector) {
    // DOM 元素引用
    this.grid = document.querySelector(gridSelector);
    this.resize = document.querySelector(resizeSelector);
    this.viewBox = document.querySelector(viewBoxSelector);
    
    if(!this.grid || !this.resize || !this.viewBox) {
      console.warn('QRCodeGridController: 缺少必要的DOM元素');
      return;
    }
    
    // 获取实际的父容器（绝对定位的容器）
    this.parent = this.grid.parentElement;
    //所在页面
    this.page = this.grid.closest('[data-page-main]');
    
    // 状态变量
    this.isDragging = false;
    this.isResizing = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.gridStartX = 0;
    this.gridStartY = 0;
    this.resizeStartX = 0;
    this.resizeStartY = 0;
    this.gridStartWidth = 0;
    this.isInitialized = false;
    
    // 事件监听器引用（用于后续清理）
    this.mousemoveHandler = null;
    this.mouseupHandler = null;
    this.resizeObserver = null;
    this.resizeTimeout = null;
    
    // 初始化
    this.init();
  }
  
  // 自动调整裁剪框大小为父元素的80%
  setGridSizeToEightyPercent() {
    const parentRect = this.parent.getBoundingClientRect();
    if(parentRect.width > 0 && parentRect.height > 0) {
      const eightyPercent = Math.min(parentRect.width, parentRect.height) * 0.8;
      this.grid.style.width = eightyPercent + 'px';
      return true;
    }
    return false;
  }
  
  // 拖拽开始处理
  handleDragStart(e) {
    // 如果点击的是调整大小按钮，不触发拖拽
    if(e.target === this.resize || this.resize.contains(e.target)) {
      return;
    }
    
    this.isDragging = true;
    this.grid.classList.add('dragging');
    
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    
    // 获取当前元素的位置（相对于父容器）
    const computedStyle = window.getComputedStyle(this.grid);
    this.gridStartX = parseFloat(computedStyle.left) || 0;
    this.gridStartY = parseFloat(computedStyle.top) || 0;
    
    e.preventDefault();
  }
  
  // 调整大小开始处理
  handleResizeStart(e) {
    this.isResizing = true;
    
    const gridRect = this.grid.getBoundingClientRect();
    this.resizeStartX = e.clientX;
    this.resizeStartY = e.clientY;
    this.gridStartWidth = gridRect.width;
    
    // 保存初始位置，调整大小时保持位置不变（从左上角固定）
    const computedStyle = window.getComputedStyle(this.grid);
    this.gridStartX = parseFloat(computedStyle.left) || 0;
    this.gridStartY = parseFloat(computedStyle.top) || 0;
    
    e.preventDefault();
    e.stopPropagation();
  }
  
  // 鼠标移动处理
  handleMouseMove(e) {
    if(this.isDragging) {
      const parentRect = this.parent.getBoundingClientRect();
      const gridRect = this.grid.getBoundingClientRect();
      
      // 计算新位置（相对于父容器）
      let newX = this.gridStartX + (e.clientX - this.dragStartX);
      let newY = this.gridStartY + (e.clientY - this.dragStartY);
      
      // 限制在父元素范围内
      const maxX = parentRect.width - gridRect.width;
      const maxY = parentRect.height - gridRect.height;
      
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      
      this.grid.style.left = newX + 'px';
      this.grid.style.top = newY + 'px';
    }
    
    if(this.isResizing) {
      const parentRect = this.parent.getBoundingClientRect();
      
      // 计算鼠标移动的距离
      const deltaX = e.clientX - this.resizeStartX;
      const deltaY = e.clientY - this.resizeStartY;
      
      // 使用较大的绝对值来保持1:1比例，方向由主要移动方向决定
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const delta = absX > absY ? deltaX : deltaY;
      
      // 计算新宽度（保持1:1比例）
      let newWidth = this.gridStartWidth + delta;
      
      // 限制最小和最大尺寸
      const minWidth = 50;
      // 最大尺寸为父元素的大小（考虑当前位置）
      const maxWidth = Math.min(parentRect.width - this.gridStartX, parentRect.height - this.gridStartY);
      
      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      
      // 确保不超出父元素范围
      if(this.gridStartX + newWidth > parentRect.width) {
        newWidth = parentRect.width - this.gridStartX;
      }
      if(this.gridStartY + newWidth > parentRect.height) {
        newWidth = parentRect.height - this.gridStartY;
      }
      
      this.grid.style.width = newWidth + 'px';
      // aspect-ratio 会自动保持高度
    }
  }
  
  // 鼠标释放处理
  handleMouseUp() {
    if(this.isDragging) {
      this.isDragging = false;
      this.grid.classList.remove('dragging');
    }
    if(this.isResizing) {
      this.isResizing = false;
    }
  }
  
  // 自动居中裁剪框
  centerGrid() {
    const parentRect = this.parent.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(this.grid);
    const currentWidth = parseFloat(computedStyle.width);
    
    // 检查父元素是否有有效尺寸
    if(parentRect.width <= 0 || parentRect.height <= 0) {
      return false; // 父元素尺寸无效，稍后重试
    }
    
    // 如果宽度无效，返回false
    if(!currentWidth || currentWidth <= 0) {
      return false;
    }
    
    // 计算居中位置
    const centerLeft = (parentRect.width - currentWidth) / 2;
    const centerTop = (parentRect.height - currentWidth) / 2;
    
    // 直接设置居中位置
    this.grid.style.left = Math.max(0, centerLeft) + 'px';
    this.grid.style.top = Math.max(0, centerTop) + 'px';
    
    return true;
  }
  
  // 调整裁剪框以适应父元素大小
  adjustGridToFitParent() {
    if(this.isDragging || this.isResizing || this.page.getAttribute('data-page-main') == 'library') return; // 如果正在拖拽或调整大小，不自动调整
    
    const parentRect = this.parent.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(this.grid);
    const currentWidth = parseFloat(computedStyle.width) || 200;
    const currentLeft = parseFloat(computedStyle.left) || 0;
    const currentTop = parseFloat(computedStyle.top) || 0;
    
    let newWidth = currentWidth;
    let newLeft = currentLeft;
    let newTop = currentTop;
    
    // 如果裁剪框宽度超出父元素，缩小它
    if(newWidth > parentRect.width) {
      newWidth = parentRect.width;
    }
    
    // 如果裁剪框高度超出父元素（考虑1:1比例），缩小它
    if(newWidth > parentRect.height) {
      newWidth = parentRect.height;
    }
    
    // 确保最小尺寸
    const minWidth = 180;
    if(newWidth < minWidth) {
      newWidth = minWidth;
    }
    
    // 检查位置是否超出范围，如果超出则调整位置
    if(newLeft + newWidth > parentRect.width) {
      newLeft = Math.max(0, parentRect.width - newWidth);
    }
    if(newTop + newWidth > parentRect.height) {
      newTop = Math.max(0, parentRect.height - newWidth);
    }
    
    // 如果位置为负，重置为0
    if(newLeft < 0) newLeft = 0;
    if(newTop < 0) newTop = 0;
    
    // 应用调整
    if(newWidth !== currentWidth) {
      this.grid.style.width = newWidth + 'px';
    }
    if(newLeft !== currentLeft) {
      this.grid.style.left = newLeft + 'px';
    }
    if(newTop !== currentTop) {
      this.grid.style.top = newTop + 'px';
    }
  }
  
  // 初始化裁剪框
  initializeGrid() {
    // 先自动调整大小为80%
    const sizeSet = this.setGridSizeToEightyPercent();
    if(sizeSet) {
      // 然后自动居中
      this.centerGrid();
      // 标记已初始化
      this.isInitialized = true;
      // 最后检查是否需要调整以适应父元素（防止超出范围）
      this.adjustGridToFitParent();
    }
  }
  
  // 尝试初始化
  tryInitialize() {
    const parentRect = this.parent.getBoundingClientRect();
    // 确保父元素有有效尺寸
    if(parentRect.width > 0 && parentRect.height > 0) {
      this.initializeGrid();
    } else {
      // 如果父元素尺寸无效，稍后重试（最多重试10次）
      let retryCount = 0;
      const maxRetries = 10;
      const retryInterval = setInterval(() => {
        retryCount++;
        const rect = this.parent.getBoundingClientRect();
        if(rect.width > 0 && rect.height > 0) {
          this.initializeGrid();
          clearInterval(retryInterval);
        } else if(retryCount >= maxRetries) {
          clearInterval(retryInterval);
          // 即使尺寸无效也尝试初始化
          this.initializeGrid();
        }
      }, 50);
    }
  }
  
  // 初始化事件监听
  init() {
    if(!this.grid || !this.resize || !this.viewBox) return;
    
    // 绑定事件监听器
    this.grid.addEventListener('mousedown', (e) => this.handleDragStart(e));
    this.resize.addEventListener('mousedown', (e) => this.handleResizeStart(e));
    
    // 使用箭头函数绑定this，并保存引用以便后续清理
    this.mousemoveHandler = (e) => this.handleMouseMove(e);
    this.mouseupHandler = () => this.handleMouseUp();
    
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('mouseup', this.mouseupHandler);
    
    // 使用 ResizeObserver 监听父元素大小变化
    this.resizeObserver = new ResizeObserver(() => {
      if(!this.isInitialized) {
        // 初始化时先调整大小，再居中
        this.initializeGrid();
      } else {
        // 已初始化后，只调整以适应父元素
        this.adjustGridToFitParent();
      }
    });
    
    this.resizeObserver.observe(this.parent);
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        if(!this.isInitialized) {
          // 初始化时先调整大小，再居中
          this.initializeGrid();
        } else {
          // 已初始化后，只调整以适应父元素
          this.adjustGridToFitParent();
        }
      }, 100); // 防抖处理
    });
    
    // 延迟初始化
    if(document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.tryInitialize(), 100);
      });
    } else {
      setTimeout(() => this.tryInitialize(), 100);
    }
  }
  
  // 销毁方法（清理事件监听器）
  destroy() {
    if(this.mousemoveHandler) {
      document.removeEventListener('mousemove', this.mousemoveHandler);
    }
    if(this.mouseupHandler) {
      document.removeEventListener('mouseup', this.mouseupHandler);
    }
    if(this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if(this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }
}

// 创建实例
const qrcodeGridController = new QRCodeGridController(
  '[data-qrcode-grid]',
  '[data-qrcode-grid-resize]',
  '[data-qrcode-view-box]'
);


//========== 处理函数 ==========

// ========== 小功能按钮辅助函数 ==========
//返回裁切方案以栅格化
function sendPixel(name){
  let mix = DOM.skillAllBox.querySelector('[data-pixel-mix]').getAttribute('data-select-value').split('≤ ')[1].split('px')[0]*1;
  let s = DOM.pixelScale.value;
  let cuts = [];
  tipsAll(MESSAGES.READING, SelectNodeInfo.length * 800);
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

// ========== 表格设置策略函数 ==========
// 应用预设样式策略
function applyTableStyleStrategy(){
  const styleId = tableStyleSet?.getAttribute('data-radio-value') - 1;
  if (styleId >= 0 && tableStyle && tableStyle[styleId]) {
    toolMessage([[tableStyle[styleId],'style'],'reTable'],PLUGINAPP);
  } else {
    console.warn('applyTableStyleStrategy: Invalid styleId or tableStyle');
  }
};

// 添加行列策略
function addTableRowColStrategy(){
  const H = getElementMix('table-column-num');
  const V = getElementMix('table-row-num');
  if (H && V) {
    toolMessage([[[H.value,V.value],'add'],'reTable'],PLUGINAPP);
    H.value = 0;
    V.value = 0;
  } else {
    console.warn('addTableRowColStrategy: H or V element not found');
  }
};

// 减少行列策略
function reduceTableRowColStrategy(){
  const H = getElementMix('table-column-num');
  const V = getElementMix('table-row-num');
  if (H && V) {
    toolMessage([[[H.value * -1,V.value * -1],'reduce'],'reTable'],PLUGINAPP);
    H.value = 0;
    V.value = 0;
  } else {
    console.warn('reduceTableRowColStrategy: H or V element not found');
  }
};

// 随机主题策略
function randomTableThemeStrategy(){
  const styleId = tableStyleSet?.getAttribute('data-radio-value') - 1;
  if (styleId >= 0 && tableStyle && tableStyle[styleId]) {
    // 可选：随机主题逻辑
    // let num = Math.floor(Math.random() * tableStyle.length * 2);
    // toolMessage([[[...tableStyle,...tableStyle][num],'theme'],'reTable'],PLUGINAPP);
    toolMessage([[tableStyle[styleId],'theme'],'reTable'],PLUGINAPP);
  } else {
    console.warn('randomTableThemeStrategy: Invalid styleId or tableStyle');
  }
};

// ========== 表格设置策略映射 ==========
const TABLE_SET_STRATEGIES = {
  'style': applyTableStyleStrategy,
  'add': addTableRowColStrategy,
  'reduce': reduceTableRowColStrategy,
  'theme': randomTableThemeStrategy
};

// 执行表格设置策略（简化：直接使用策略映射，保留错误处理）
function sendTableSet(type){
  const strategy = TABLE_SET_STRATEGIES[type];
  if (!strategy) {
    console.warn(`Unknown table set type: ${type}`);
    return;
  }
  strategy();
};

function sendTablePick(type){
  toolMessage([type,'pickTable'],PLUGINAPP);
};

function upSelect(type){
  let exporttype = getElementMix('data-exporttype-set').getAttribute('data-radio-value');
  let types = ['image','zy','rich']
  toolMessage([[types[exporttype - 1],type],'upSelect'],PLUGINAPP);
};

// ========== 小功能按钮策略映射 ==========
// 单击策略映射
const SKILL_STRATEGIES = {
  'Pixel As Copy': () => sendPixel('Pixel As Copy'),
  'Pixel Overwrite': () => sendPixel('Pixel Overwrite'),
  'Split By Conditions': () => sendSplit('tags'),
  'Split By Symbol': () => sendSplit('inputs'),
  'Mapping Names': () => sendTable('mapName'),
  'Mapping Texts': () => sendTable('mapText'),
  'Mapping Properties': () => sendTable('mapPro'),
  'Mapping Tags': () => sendTable('mapTag'),
  'Get Names': () => sendTable('getName'),
  'Get Texts': () => sendTable('getText'),
  'Get Properties': () => sendTable('getPro'),
  'Get Tags': () => sendTable('getTag'),
  'Apply Preset': () => sendTableSet('style'),
  'Add C/R': () => sendTableSet('add'),
  'Reduce C/R': () => sendTableSet('reduce'),
  'Random Theme': () => sendTableSet('theme'),
  'Select a Row': () => sendTablePick('row'),
  'Select many Rows': () => sendTablePick('allrow'),
  'Select Block': () => sendTablePick('block'),
  'Select Inline': () => sendTablePick('inline'),
  'Up Export-set': () => upSelect('exportset'),
  'Up Default': () => upSelect('default')
};

// 双击策略映射（可根据需要添加特定处理函数）
const SKILL_DBLCLICK_STRATEGIES = {
  // 示例：如果有特定双击处理，可以在这里添加
  // 'Pixel As Copy': () => sendPixelDoubleClick('Pixel As Copy'),
  // 'Mapping Names': () => sendTableDoubleClick('mapName'),
};

//执行小功能策略（单击）
function executeSkillStrategy(skillname){
  const strategy = SKILL_STRATEGIES[skillname];
  if (strategy) {
    strategy();
  } else {
    // 默认策略：发送消息
    toolMessage(['',skillname],PLUGINAPP);
  }
};

//执行小功能策略（双击）
function executeSkillDoubleClickStrategy(skillname){
  const strategy = SKILL_DBLCLICK_STRATEGIES[skillname];
  if (strategy) {
    strategy();
  } else {
    // 兜底处理：发送消息
    toolMessage([true,skillname],PLUGINAPP);
  }
};

//点击即执行的功能（策略模式重构）
DOM.skillBtnMain.forEach(btn => {
  let clickTimer = null;
  
  // 双击事件处理（策略模式）
  btn.addEventListener('dblclick',()=>{
    // 清除单击事件的定时器
    if(clickTimer){
      clearTimeout(clickTimer);
      clickTimer = null;
    };
    
    const skillname = btn.getAttribute('data-en-text');
    if(btn.getAttribute('data-btn-dblclick') !== null && skillname){
      executeSkillDoubleClickStrategy(skillname);
    };
  });
  
  // 单击事件处理（带防抖）
  btn.addEventListener('click',()=>{
    const skillname = btn.getAttribute('data-en-text');
    if (!skillname) return;
    
    // 清除之前的定时器
    if(clickTimer){
      clearTimeout(clickTimer);
    };
    
    // 设置新的定时器
    clickTimer = setTimeout(()=>{
      executeSkillStrategy(skillname);
      clickTimer = null;
    }, DELAY.SKILL_CLICK);
  });
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


//=========== 监听函数 ===========


// 监听粘贴事件
document.addEventListener('paste', async (e) => {
    if(!DOM.skewscaleViewPick.checked) return;
    
    e.preventDefault();
    console.log(e.clipboardData);
    console.log(e.clipboardData.types);
    if(e.clipboardData.types.includes('text/html')){
        const html = e.clipboardData.getData('text/html');
        console.log(html);
    }
    if(e.clipboardData.types.includes('text/plain')){
        const text = e.clipboardData.getData('text/plain');
        console.log(text);
    }

});

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
    DOM.editorViewbox.style.setProperty('--bg',color.HEX);
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
    let viewimg = DOM.dailogImgBox.querySelector('img');
    if(int > ExportImageInfo.length){
      DOM.imgnumSet.value = viewimg.getAttribute('data-imgnum-pick');
      return
    }
    let layer = ExportImageInfo[int - 1];
    if(!layer) return;
    let img = layer.compressed ? layer.compressed : layer.u8a;
    let ismaxW = layer.width >= layer.height ? 'true' : 'false';
    viewimg.setAttribute('data-ismaxW',ismaxW);
    viewimg.src = URL.createObjectURL(new Blob([img],{type:'image/' + layer.format}));
    DOM.dailogImgBox.appendChild(viewimg);
    viewimg.setAttribute('data-imgnum-pick',int);
  }
  if(node.getAttribute('data-qrcode-grid-num') !== null){
    getElementMix('data-qrcode-grid').style.setProperty('--grid',int);
  };
  //console.log(int)
};

function getUserFloat(node){
  let float = node.getAttribute('data-float-value');
  if(node == DOM.uniformS.parentNode){
    let value = float * 1;
    let center = getElementMix('data-transform-center-box').getAttribute('data-radio-value');
    toolMessage([['S',value,center],'rescaleMix'],PLUGINAPP);
    DOM.uniformS.value = 1;
  };
  if(node == DOM.uniformW.parentNode){
    let value = float * 1;
    let center = getElementMix('data-transform-center-box').getAttribute('data-radio-value');
    toolMessage([['W',value,center],'rescaleMix'],PLUGINAPP);
    DOM.uniformW.value = '';
  };
  if(node == DOM.uniformH.parentNode){
    let value = float * 1;
    let center = getElementMix('data-transform-center-box').getAttribute('data-radio-value');
    toolMessage([['H',value,center],'rescaleMix'],PLUGINAPP);
    DOM.uniformH.value = '';
  };
  //console.log(float)
};

function getUserSelect(node){
  let userSelect = node.getAttribute('data-select-value');
  if(node.parentNode.parentNode.id == 'upload-moreset-box'){
    DOM.frameName.value = userSelect;
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
      DOM.pixelScale.value = userRadio;
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
      let model = DOM.skillAllBox.querySelector(`[data-skillmodule="${modelid}"]`);
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
// 用户认证配置和国际化文本已移至 data.js，直接使用全局变量 AUTH_CONFIG 和 AUTH_I18N

// 获取认证模块的多语言文本
function getAuthText(key, ...args) {
  const lang = getLanguageIntime() || 'zh';
  const langMap = AUTH_I18N[lang] || AUTH_I18N.zh;
  let text = langMap[key] || key;
  
  // 支持参数替换 {0}, {1}, ...
  if (args && args.length > 0) {
    args.forEach((arg, index) => {
      text = text.replace(`{${index}}`, arg);
    });
  }
  
  return text;
}

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

// 用户认证管理
var AuthManager = {
  currentUser: null,
  usersList: [], // 存储所有用户列表（用于验证）

  // 设置当前用户
  setCurrentUser(user) {
    this.currentUser = user;
  },

  // 设置用户列表
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

  // 验证用户名格式
  validateUsername(username) {
    if (!username) {
      return { 
        valid: false, 
        error: AUTH_I18N.zh.usernameTooShort,
        errorEn: AUTH_I18N.en.usernameTooShort
      };
    }
    // 用户名只能包含字母、数字、下划线和连字符，长度2-20
    //不能是纯数字或纯符号
    if (/^\d+$/.test(username) || /^-+$/.test(username)) {
      return { 
        valid: false, 
        error: AUTH_I18N.zh.usernameInvalidChars,
        errorEn: AUTH_I18N.en.usernameInvalidChars
      };
    }
    const usernameRegex = /^[a-zA-Z0-9_-]{2,20}$/;
    if (!usernameRegex.test(username)) {
      if (username.length < 2 || username.length > 20) {
        return { 
          valid: false, 
          error: AUTH_I18N.zh.usernameInvalidLength,
          errorEn: AUTH_I18N.en.usernameInvalidLength
        };
      }
      return { 
        valid: false, 
        error: AUTH_I18N.zh.usernameInvalidChars,
        errorEn: AUTH_I18N.en.usernameInvalidChars
      };
    }
    return { valid: true };
  },

  // 验证密码格式
  validatePassword(password) {
    if (!password) {
      return { 
        valid: false, 
        error: AUTH_I18N.zh.passwordTooShort,
        errorEn: AUTH_I18N.en.passwordTooShort
      };
    }
    // 密码只能包含字母、数字和常见符号，长度6-50
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,50}$/;
    if (!passwordRegex.test(password)) {
      if (password.length < 6 || password.length > 50) {
        return { 
          valid: false, 
          error: AUTH_I18N.zh.passwordInvalidLength,
          errorEn: AUTH_I18N.en.passwordInvalidLength
        };
      }
      return { 
        valid: false, 
        error: AUTH_I18N.zh.passwordInvalidChars,
        errorEn: AUTH_I18N.en.passwordInvalidChars
      };
    }
    return { valid: true };
  },

  // 注册
  async register(email, username, password) {
    // 简单验证
    if (!email || !email.includes('@')) {
      return { success: false, error: getAuthText('invalidEmail') };
    }
    // 验证用户名
    const usernameValidation = this.validateUsername(username);
    if (!usernameValidation.valid) {
      return { success: false, error: usernameValidation.error };
    }
    // 验证密码
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
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
          return { success: false, error: getAuthText('supabaseNotInitialized') };
        }
      }
      
      try {
        // 使用 Supabase 注册
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: username
            },
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
            error.code === '23505' || // PostgreSQL unique violation
            error.message?.toLowerCase().includes('duplicate') ||
            error.message?.toLowerCase().includes('already exists');
          
          if (isAlreadyRegistered) {
            errorMsg = getAuthText('emailAlreadyRegistered');
          } else if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
            // 速率限制错误
            const waitTime = error.message.match(/(\d+)\s*seconds?/i)?.[1] || '7';
            errorMsg = getAuthText('rateLimitError', waitTime);
          } else if (error.message?.toLowerCase().includes('invalid')) {
            errorMsg = getAuthText('invalidEmailFormat');
          } else {
            // 显示原始错误信息，便于调试
            errorMsg = getAuthText('registrationFailed', error.message || getAuthText('unknownError'));
          }
          return { success: false, error: errorMsg };
        }

        if (!data.user) {
          return { success: false, error: getAuthText('registrationFailedRetry') };
        }
        
        // 验证用户是否真的是新创建的（Supabase 可能返回已存在的用户对象而不报错）
        const now = new Date();
        const createdAt = data.user.created_at ? new Date(data.user.created_at) : null;
        const timeDiff = createdAt ? (now - createdAt) / 1000 : null; // 秒
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        // 检查用户配置是否已存在（最可靠的检查方法）
        try {
          const { data: existingProfile } = await supabaseClient
            .from('user_profiles')
            .select('id')
            .eq('id', data.user.id)
            .maybeSingle();
          
          if (existingProfile) {
            if (session) await supabaseClient.auth.signOut();
            return { success: false, error: getAuthText('emailAlreadyRegistered') };
          }
        } catch (e) {
          // 查询失败，继续其他检查
        }
        
        // 检查用户是否真的是新创建的
        // 新注册的用户创建时间应该在几秒内，如果超过10秒很可能是已存在的用户
        if (timeDiff !== null && timeDiff > 10) {
          if (session) await supabaseClient.auth.signOut();
          return { success: false, error: getAuthText('emailAlreadyRegistered') };
        }
        
        // 如果用户已确认邮箱且创建时间超过3秒，肯定是已存在的用户
        if (data.user.email_confirmed_at && timeDiff !== null && timeDiff > 3) {
          if (session) await supabaseClient.auth.signOut();
          return { success: false, error: getAuthText('emailAlreadyRegistered') };
        }
        
        // 如果用户有登录历史，说明是已存在的用户
        if (data.user.last_sign_in_at && timeDiff !== null && timeDiff > 5) {
          const lastSignIn = new Date(data.user.last_sign_in_at);
          if ((now - lastSignIn) / 1000 > 5) {
            if (session) await supabaseClient.auth.signOut();
            return { success: false, error: getAuthText('emailAlreadyRegistered') };
          }
        }
        
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
              
              // 检查是否是唯一约束冲突（用户已存在）
              const isDuplicateError = 
                profileError.code === '23505' || // PostgreSQL unique violation
                profileError.message?.toLowerCase().includes('duplicate') ||
                profileError.message?.toLowerCase().includes('already exists') ||
                profileError.message?.toLowerCase().includes('unique constraint');
              
              if (isDuplicateError) {
                // 用户配置已存在，说明用户之前已注册
                await supabaseClient.auth.signOut();
                return { success: false, error: getAuthText('emailAlreadyRegistered') };
              }
              
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
            message: getAuthText('registrationSuccess')
          };
        }
      } catch (e) {
        console.error('Supabase registration failed:', e);
        return { success: false, error: getAuthText('registrationFailedRetry') };
      }
    }

    // 降级到本地存储（仅在未使用 Supabase 时）
    if (AUTH_CONFIG.USE_SUPABASE) {
      // 如果使用 Supabase 但注册失败，不应该降级到本地存储
      return { success: false, error: getAuthText('registrationFailedConfig') };
    }
    
    // 清除可能存在的旧数据，确保检查的是最新数据
    const existingUsers = this.getUsersList();
    console.log('Checking local users list:', existingUsers);
    if (existingUsers && existingUsers.length > 0 && existingUsers.find(u => u.email === email)) {
      return { success: false, error: getAuthText('emailAlreadyRegisteredLocal') };
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
      return { success: false, error: getAuthText('enterEmailPassword') };
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
          return { success: false, error: getAuthText('emailPasswordIncorrect') };
        }

        if (!data.user) {
          return { success: false, error: getAuthText('loginFailedRetry') };
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
        return { success: false, error: getAuthText('loginFailedRetry') };
      }
    }

    // 降级到本地存储
    const existingUsers = this.getUsersList();
    const user = existingUsers.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: getAuthText('emailPasswordIncorrect') };
    }

    if (!this.verifyPassword(password, user.password)) {
      return { success: false, error: getAuthText('emailPasswordIncorrect') };
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
    console.log(getAuthText('localCacheCleared'));
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

  // 密码哈希（使用盐值和多重哈希，安全性要求不高）
  hashPassword(password, salt = null) {
    // 使用固定盐值（可以改为从配置读取）
    const defaultSalt = 'ynyuset_toolsetfig_2024';
    const usedSalt = salt || defaultSalt;
    
    // 组合密码和盐值
    const saltedPassword = password + usedSalt + password.length;
    
    // 使用改进的哈希算法（djb2 变种）
    let hash = 5381; // djb2 初始值
    for (let i = 0; i < saltedPassword.length; i++) {
      const char = saltedPassword.charCodeAt(i);
      hash = ((hash << 5) + hash) + char; // hash * 33 + char
    }
    
    // 二次哈希以增加安全性
    const hashStr = Math.abs(hash).toString(36);
    let secondHash = 0;
    for (let i = 0; i < hashStr.length; i++) {
      secondHash = ((secondHash << 5) - secondHash) + hashStr.charCodeAt(i);
      secondHash = secondHash & secondHash; // 转换为 32 位整数
    }
    
    // 返回组合的哈希值（包含盐值标识）
    return `h_${Math.abs(secondHash).toString(36)}_${hashStr}`;
  },

  // 验证密码（支持新旧哈希格式，向后兼容）
  verifyPassword(password, storedHash) {
    if (!password || !storedHash) {
      return false;
    }
    
    // 新格式：以 h_ 开头
    if (storedHash.startsWith('h_')) {
      return storedHash === this.hashPassword(password);
    }
    
    // 旧格式：兼容旧的简单哈希算法
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return storedHash === hash.toString();
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
    
    // 隐藏验证提示
    const registerUsernameError = document.getElementById('register-username-error');
    const registerPasswordError = document.getElementById('register-password-error');
    if (registerUsernameError) registerUsernameError.style.display = 'none';
    if (registerPasswordError) registerPasswordError.style.display = 'none';
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
        if (DOM.dailogLogin) DOM.dailogLogin.style.display = 'flex';
      } else {
        // 未登录，显示登录表单
        AuthManager.showLoginForm();
        if (DOM.dailogLogin) DOM.dailogLogin.style.display = 'flex';
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
      AuthManager.showError('login', result.error || getAuthText('loginFailedRetry'));
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
      AuthManager.showError('register', getAuthText('fillAllRequired'));
      return;
    }
    
    if (password !== passwordConfirm) {
      AuthManager.showError('register', getAuthText('passwordsNotMatch'));
      return;
    }
    
    // 禁用按钮并显示加载状态
    isRegistering = true;
    const originalText = btnRegister.textContent;
    btnRegister.disabled = true;
    btnRegister.style.opacity = '0.6';
    btnRegister.style.pointerEvents = 'none';
    btnRegister.textContent = getAuthText('registering');
    
    let result = null;
    let shouldKeepDisabled = false;
    
    try {
      result = await AuthManager.register(email, username, password);
      if (result.success) {
        if (result.needsConfirmation) {
          // 需要邮箱确认
          AuthManager.showError('register', result.message || getAuthText('registrationSuccessShort'));
          // 3秒后切换到登录表单
          setTimeout(() => {
            AuthManager.showLoginForm();
            AuthManager.hideError('register');
            //自动填充好账号邮箱
            document.getElementById('login-email').value = email;
          }, 3000);
        } else {
          // 注册成功且已登录
          AuthManager.showUserInfo();
        }
      } else {
        AuthManager.showError('register', result.error || getAuthText('registrationFailedRetry'));
        
        // 如果是速率限制错误，保持按钮禁用一段时间
        const lang = getLanguageIntime() || 'zh';
        const waitPattern = lang === 'zh' ? /(\d+)\s*秒/ : /(\d+)\s*seconds?/i;
        const rateLimitKeywords = lang === 'zh' ? ['等待', '秒'] : ['wait', 'seconds'];
        const isRateLimitError = rateLimitKeywords.some(keyword => 
          result.error?.toLowerCase().includes(keyword.toLowerCase())
        );
        if (isRateLimitError) {
          shouldKeepDisabled = true;
          const waitTime = parseInt(result.error.match(waitPattern)?.[1] || '7') * 1000;
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
      AuthManager.showError('register', getAuthText('registrationFailedRetry'));
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

// 用户名实时验证
const registerUsername = document.getElementById('register-username');
const registerUsernameError = document.getElementById('register-username-error');
if (registerUsername && registerUsernameError) {
  const updateUsernameValidation = () => {
    const username = registerUsername.value.trim();
    if (username) {
      const validation = AuthManager.validateUsername(username);
      if (!validation.valid) {
        // 显示错误提示（支持中英文）
        registerUsernameError.style.display = 'block';
        registerUsernameError.textContent = getLanguageIntime() === 'zh' ? validation.error : validation.errorEn || validation.error;
        registerUsernameError.setAttribute('data-zh-text', validation.error);
        registerUsernameError.setAttribute('data-en-text', validation.errorEn || validation.error);
      } else {
        // 隐藏错误提示
        registerUsernameError.style.display = 'none';
      }
    } else {
      // 输入为空时隐藏错误提示
      registerUsernameError.style.display = 'none';
    }
  };
  
  registerUsername.addEventListener('input', updateUsernameValidation);
  registerUsername.addEventListener('blur', updateUsernameValidation);
}

// 密码实时验证
const registerPassword = document.getElementById('register-password');
const registerPasswordError = document.getElementById('register-password-error');
if (registerPassword && registerPasswordError) {
  const updatePasswordValidation = () => {
    const password = registerPassword.value;
    if (password) {
      const validation = AuthManager.validatePassword(password);
      if (!validation.valid) {
        // 显示错误提示（支持中英文）
        registerPasswordError.style.display = 'block';
        registerPasswordError.textContent = getLanguageIntime() === 'zh' ? validation.error : validation.errorEn || validation.error;
        registerPasswordError.setAttribute('data-zh-text', validation.error);
        registerPasswordError.setAttribute('data-en-text', validation.errorEn || validation.error);
      } else {
        // 隐藏错误提示
        registerPasswordError.style.display = 'none';
      }
    } else {
      // 输入为空时隐藏错误提示
      registerPasswordError.style.display = 'none';
    }
  };
  
  registerPassword.addEventListener('input', updatePasswordValidation);
  registerPassword.addEventListener('blur', updatePasswordValidation);
}

// 退出登录按钮
const btnLogout = document.querySelector('[data-btn-logout]');
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    AuthManager.logout();
  });
};

// 关闭登录弹窗
function setupLoginDialogClose() {
  if (DOM.dailogLogin) {
    // 点击弹窗外部关闭
    DOM.dailogLogin.addEventListener('click', (e) => {
      if (e.target === DOM.dailogLogin) {
        DOM.dailogLogin.style.display = 'none';
      }
    });
  };
};

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
};

function getLanguageIntime(){
  return ROOT.getAttribute('data-language').toLowerCase();
};

