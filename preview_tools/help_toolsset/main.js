const content1 = document.querySelector('[data-page-id="content1"]');
const content2 = document.querySelector('[data-page-id="content2"]');
const btnMore = document.getElementById('btn-more');

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

  if(node.getAttribute('data-tab-for') == 'content1'){
    //log(111)
    //将radio移动到每个label后面，得到二级目录的列表
    richDoc.creDocAll(content1,'toolsset','function',{isSearch:true, parentSearch:document.querySelector('[data-dailogsearch-box]')});

  };
  if(node.getAttribute('data-tab-for') == 'content2'){
    //log(222)
    //richDoc.creDocAll(content2,'toolsset','algorithm');

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