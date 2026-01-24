const content1 = document.querySelector('[data-page-id="content1"]');
const content2 = document.querySelector('[data-page-id="content2"]');
const btnMore = document.getElementById('btn-more');
const skillSearchInput = document.getElementById('skillsearch');
const logBox = document.querySelector('[data-page-name-en="log"]');

/**
 * 日志数据来自构建产物 `logs.generated.js`
 * - 由 `preview_tools/help_toolsset/build_logs.js` 从 `tool_plugin/ToolsSetFig/log.md` 生成
 * - 在页面中注入：window.__TOOLSSET_HELP_LOGS__
 */
const logs = Array.isArray(window.__TOOLSSET_HELP_LOGS__) ? window.__TOOLSSET_HELP_LOGS__ : null;

window.addEventListener('DOMContentLoaded', () => {
  if(window.innerWidth < 550){
    btnMore.checked = false;
    let inputEvent = new Event('change',{bubbles:true});
    btnMore.dispatchEvent(inputEvent);
  }
  if(QUERY_PARAMS && QUERY_PARAMS.sec){
    log(QUERY_PARAMS)
    let tabPick = 'function'
    let secPick = QUERY_PARAMS.sec.replace('_',' ').toLowerCase();

    if(secPick == 'log'){
      tabPick = 'algorithm'
    }else{
      let sec = richDoc.doc.toolsset[QUERY_PARAMS.sec];
      if(sec){
        tabPick = sec.type[1];
      }else{
        secPick = 'create';
      }
    }

    
    richDoc.viewPage([tabPick,secPick]);
  }
});

window.addEventListener('resize', () => {
  if(window.innerWidth < 550){
    btnMore.checked = false;
    let inputEvent = new Event('change',{bubbles:true});
    btnMore.dispatchEvent(inputEvent);
  }
});

getElementMix('data-doc-search').addEventListener('click',()=>{
  getElementMix('data-dailogsearch').style.display = 'flex'
});

window.addEventListener('keydown', (event) => {
  // Ctrl+K 打开搜索
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    getElementMix('data-dailogsearch').style.display = 'flex';
    try {
      // 尝试聚焦输入框（如有）
      const input = getElementMix('data-dailogsearch').querySelector('input, textarea');
      if (input) input.focus();
    } catch (e) {}
  }
  // Escape 关闭搜索
  if (event.key === 'Escape') {
    getElementMix('data-dailogsearch').style.display = 'none';
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
    event.preventDefault();
    if(btnMore.checked){
      btnMore.checked = false;
      let inputEvent = new Event('change',{bubbles:true});
      btnMore.dispatchEvent(inputEvent);
    }else{
      btnMore.checked = true;
      let inputEvent = new Event('change',{bubbles:true});
      btnMore.dispatchEvent(inputEvent);
    }
  }
});

let richDoc = new RICH_DOC();
let skillsSearch = richDoc.allSearchPath['toolsset'];
richDoc.creDocAll(content1,'toolsset','function',{isSearch:true, parentSearch:document.querySelector('[data-dailogsearch-box]')});
richDoc.creDocAll(content2,'toolsset','algorithm',{isSearch:true, parentSearch:document.querySelector('[data-dailogsearch-box]')});
// 日志改为读取构建产物 logs.generated.js（支持 ['code', ...] / 后续可扩展 ['table', ...]）
if(logs){
  richDoc.addLog(logBox, logs);
}else{
  console.warn('[help_toolsset] logs.generated.js missing or invalid: window.__TOOLSSET_HELP_LOGS__');
  richDoc.addLog(logBox, [
    {
      title: ['日志加载失败', 'Failed to load changelog'],
      date: '',
      items: [
        ['li', '未检测到 logs.generated.js，请先运行 build_logs.js 生成。', 'logs.generated.js not found. Please run build_logs.js first.'],
      ],
    },
  ]);
}
let logBoxCode = logBox.querySelectorAll('code');
logBoxCode.forEach(item => {
  Prism.highlightElement(item);
});

richDoc.creDocList();

getElementMix('language-2').addEventListener('change',()=>{
  richDoc.reSortSearch();
  logBoxCode.forEach(item => {
    Prism.highlightElement(item);
  });
});

//搜索功能
skillSearchInput.addEventListener('input',debounce(()=>{
  if(skillSearchInput.value.trim() == ''){
    document.querySelectorAll('[data-search-turnto]').forEach(item => {
      item.setAttribute('data-search-pick','false');
    });
    return;
  };
  let value = skillSearchInput.value.toLowerCase().trim()
  let values = value.replace(/[^\u4e00-\u9fa5\w\s]/g, ' ').trim().split(' ');
  values = values.map(item => {
    if(item.replace(/[a-z0-9]/gi,'').length > 0){
      return item.replace(/[a-z0-9]/gi,'').split('');
    }
    return item;
  });
  values = [].concat(...values);
  values = [...new Set(values)];

  //log(skillsSearch);
  //return;
  skillsSearch.forEach((skill,index) => {
    log(values)
    let list = getElementMix(`data-search-turnto="${skill.id}"`);
    //log([list,index]);
    let diff = [...new Set([...skill.key,...values])];
    //log(diff);
    //return
    if(value == skill.name[0].toLowerCase().trim() || value == skill.name[1].toLowerCase().trim()){
      list.setAttribute('data-search-pick','true');
      return;
    };
    let samelength = (skill.key.length + values.length - diff.length);
    //log([skill.key,values,samelength])
    if( samelength > 0 ){
      if(samelength > 1){
        list.setAttribute('data-search-pick','0');
        
      } else {
        list.setAttribute('data-search-pick','1');
        log([skill.key,values,samelength])
      }
    } else {
      let same = 0;
      values.filter(item => item.length >= 3).forEach(item => {
        skill.key.forEach(key => {
          if(key.includes(item)) {
            same++;
            log([key,item,same]);
          };
        });
      });
      if(same > 0){
        list.setAttribute('data-search-pick','2');
      }else{
        list.setAttribute('data-search-pick','3');
      }
    }
  })
},500));


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

// 在页面加载完成后，确保观察器能够监听到动态生成的 tab 元素
// 注意：yn_comp.js 中已经在 window.load 时调用了 getUserMix.init()
// 但为了确保 tab 元素生成后能够被观察到，我们在 DOMContentLoaded 时也初始化一次
document.addEventListener('DOMContentLoaded', () => {
  // 使用容器参数，确保能够观察到特定容器内的元素
  const container = document.querySelector('[data-page-id="help_toolsset"]');
  if(container) {
    getUserMix.init(container);
  }
});

/**
 * @param {Element} node -带有data-tab-pick值的元素, 用于记录用户关闭前所选的tab
 */
function getUserTab(node){
  let tabPickValue = node.getAttribute('data-tab-pick');
  let tabPick = tabPickValue.split('tab_')[1];
  
  if(node.getAttribute('data-page-id') == 'list'){
    if(tabPick == 'function'){
      content1.style.display = 'block';
      content2.style.display = 'none';
    }else if(tabPick == 'algorithm'){
      content1.style.display = 'none';
      content2.style.display = 'block';
    };
  };

  if(node.parentNode.getAttribute('data-doc-content') !== ''){
    content1.scrollTop = 0;
    content2.scrollTop = 0;
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
};

function getUserText(node){
  let text = node.getAttribute('data-text-value');
  //console.log(text)
};

function getUserInt(node){
  let int = node.getAttribute('data-int-value');
  //console.log(int)
};

function getUserFloat(node){
  let float = node.getAttribute('data-float-value');
  //console.log(float)
};

function getUserSelect(node){
  let userSelect = node.getAttribute('data-select-value');

};

function getUserRadio(node){
  let userRadio= node.getAttribute('data-radio-value');

};