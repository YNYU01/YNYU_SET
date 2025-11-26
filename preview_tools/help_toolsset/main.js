const content1 = document.querySelector('[data-page-id="content1"]');
const content2 = document.querySelector('[data-page-id="content2"]');
const btnMore = document.getElementById('btn-more');
const skillSearchInput = document.getElementById('skillsearch');

let logs = [
  {
    title:['版本V1.0.0（首发版本）','Version V1.0.0 (First version)'],
    date:'2025.11',
    items:[
      ['li','新增功能1','New feature 1'],
      ['li','新增功能2','New feature 2'],
      ['li','新增功能3','New feature 3'],
      ['li','新增功能4','New feature 4'],
      ['li','新增功能5','New feature 5'],
      ['li','新增功能6','New feature 6'],
      ['li','新增功能7','New feature 7'],
      ['li','新增功能8','New feature 8'],
      ['li','新增功能9','New feature 9'],
      ['li','新增功能10','New feature 10'],
    ]
  },
  {
    title:['内测版本','Beta version'],
    date:'2024.7 ~ 2025.11',
    items:[
      ['li','新增功能1','New feature 1'],
      ['li','新增功能2','New feature 2'],
      ['li','新增功能3','New feature 3'],
      ['li','新增功能4','New feature 4'],
      ['li','新增功能5','New feature 5'],
      ['li','新增功能6','New feature 6'],
      ['li','新增功能7','New feature 7'],
      ['li','新增功能8','New feature 8'],
      ['li','新增功能9','New feature 9'],
      ['li','新增功能10','New feature 10'],
    ]
  },
];

window.addEventListener('DOMContentLoaded', () => {
  if(window.innerWidth < 450){
    btnMore.checked = false;
    let inputEvent = new Event('change',{bubbles:true});
    btnMore.dispatchEvent(inputEvent);
  }
});

window.addEventListener('resize', () => {
  if(window.innerWidth < 450){
    btnMore.checked = false;
    let inputEvent = new Event('change',{bubbles:true});
    btnMore.dispatchEvent(inputEvent);
  }else{
    btnMore.checked = true;
    let inputEvent = new Event('change',{bubbles:true});
    btnMore.dispatchEvent(inputEvent);
  }
});

let richDoc = new RICH_DOC();
let skillsSearch = richDoc.allSearchPath['toolsset'];

// 标记内容是否已初始化，避免重复初始化
let content1Initialized = false;
let content2Initialized = false;

// 检查并执行内容初始化的辅助函数
function ensureContentReady(container, type, callback) {
  // 检查容器是否存在且 richDoc 已初始化
  if (!container || !richDoc || !richDoc.doc) {
    // 如果未准备好，使用 requestAnimationFrame 延迟执行
    requestAnimationFrame(() => {
      ensureContentReady(container, type, callback);
    });
    return;
  }
  
  // 执行回调
  callback();
}

//搜索功能
skillSearchInput.addEventListener('input',debounce(()=>{
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

  //log(skillsSearch);
  //return;
  skillsSearch.forEach((skill,index) => {
    let list = getElementMix(`data-search-turnto="${index}"`);
    let diff = [...new Set([...skill.key,...values])];
    //log(diff);
    return
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

// 页面完全加载后，主动初始化默认 tab 的内容
// 这确保即使 tab 切换事件没有触发，默认内容也能正常显示
window.addEventListener('load', () => {
  // 使用 requestAnimationFrame 确保 DOM 完全渲染完成
  requestAnimationFrame(() => {
    // 检查 content1 是否可见且未初始化
    if(content1 && !content1Initialized) {
      const content1Style = window.getComputedStyle(content1);
      // 如果 content1 是可见的（display 不是 none），则初始化内容
      if(content1Style.display !== 'none') {
        ensureContentReady(content1, 'function', () => {
          richDoc.creDocAll(content1,'toolsset','function',{isSearch:true, parentSearch:document.querySelector('[data-dailogsearch-box]')});
          content1Initialized = true;
        });
      }
    }
  });
});

/**
 * @param {Element} node -带有data-tab-pick值的元素, 用于记录用户关闭前所选的tab
 */
function getUserTab(node){
  let tabPickValue = node.getAttribute('data-tab-pick');
  // 只有当 tabPickValue 不是 'false' 时才处理
  if(tabPickValue && tabPickValue !== 'false') {
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
  }

  if(node.getAttribute('data-tab-for') == 'content1'){
    // 避免重复初始化
    if(content1Initialized) return;
    
    // 确保容器和 richDoc 都准备好后再执行
    ensureContentReady(content1, 'function', () => {
      //将radio移动到每个label后面，得到二级目录的列表
      richDoc.creDocAll(content1,'toolsset','function',{isSearch:true, parentSearch:document.querySelector('[data-dailogsearch-box]')});
      content1Initialized = true;
    });
  };
  if(node.getAttribute('data-tab-for') == 'content2'){
    // 避免重复初始化
    if(content2Initialized) return;
    
    // 确保容器和 richDoc 都准备好后再执行
    ensureContentReady(content2, 'algorithm', () => {
      richDoc.creDocAll(content2,'toolsset','algorithm',{isSearch:true, parentSearch:document.querySelector('[data-dailogsearch-box]')});
      let logBox = getElementMix('data-page-name-en="log"');
      if(logBox) {
        richDoc.addLog(logBox,logs);
      }
      content2Initialized = true;
    });
  };

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