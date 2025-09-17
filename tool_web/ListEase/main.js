const flowBox = document.querySelector('[data-flow-box]');
const flowBoxRightbtn = document.querySelector('[data-rightbtn-flewbox]');
const modList = document.querySelector('[data-flow-modlist]');
const modelAll = document.querySelector('[data-flow-model-all]');
const selectArea = document.querySelector('[data-selectarea]');
const rightBtn = document.querySelectorAll('[data-rightbtn]');
const rightBtnList = document.querySelectorAll('[data-rightbtn-list]');


window.addEventListener('load',()=>{
  document.getElementById('noise').className = 'tex-noise';
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

window.addEventListener('blur',()=>{
  rightBtn.forEach(item => {
    item.style.display = 'none';
  });
});

flowBox.addEventListener('contextmenu',(e)=>{
  e.preventDefault();
  flowBoxRightbtn.style.display = 'flex';
  let xys = reSafeTopLeft(e,flowBox,flowBoxRightbtn).xys;
  let lists = flowBoxRightbtn.querySelectorAll('[data-rightbtn-list]');

  lists.forEach(item => {
    let x = '',y = '';
    switch (xys[0]){
      case 'L':
        x = 'left: calc(100% + 4px); ';
      break
      case 'C':
        x = 'left: calc(100% + 4px); ';
      break
      case 'R':
        x = 'right: calc(100% + 4px); ';
      break
    };
    switch (xys[1]){
      case 'T':
        y = 'top: 0; ';
      break
      case 'C':
        y = 'top: 0; ';
      break
      case 'B':
        y = 'bottom: 0; ';
      break
    };
    item.setAttribute('style',x + y);
  });
});

modList.addEventListener('contextmenu',(e)=>{
  e.preventDefault();
});

flowBoxRightbtn.addEventListener('contextmenu',(e)=>{
  e.preventDefault();
  flowBoxRightbtn.style.display = 'flex';
  reSafeTopLeft(e,flowBox,flowBoxRightbtn);
});


let isSelecting = false;
let isMoving = false;
let [selectStartX,selectStartY] = [0,0];
let [moveStartX,moveStartY,scrollLeft,scrollTop] = [0,0];

flowBox.addEventListener('mousedown',(e)=>{
  e.preventDefault()
  if(e.button === 0 && (e.target == flowBox || e.target == getElementMix('data-flow-editor')) ){
    [selectStartX,selectStartY] = [e.clientX,e.clientY];
    isSelecting = true;  
  };
  if(e.button === 1 ){
    [moveStartX,moveStartY,scrollLeft,scrollTop] = [e.clientX,e.clientY,flowBox.scrollLeft,flowBox.scrollTop];
    isMoving = true;
  }
});

flowBox.addEventListener('mousemove',(e)=>{
  if(isSelecting){
    let areaW = e.clientX - selectStartX;
    let areaH = e.clientY - selectStartY;
    if(areaW == 0 || areaH == 0 || (Math.abs(areaW) < 10 && Math.abs(areaH) < 10)) return;

    closeShowNexts(e,modList,'show-modsec-all');
    closeShowNexts(e,modList,'show-model-all');
    let x,y,w,h;
    if(areaW > 0){
      x = 'left: ' + selectStartX + 'px; ';
      w = 'width: ' + areaW  + 'px; ';
    } else {
      x = 'right: ' + (flowBox.offsetWidth - selectStartX) + 'px; ';
      w = 'width: ' + areaW * -1 + 'px; ';
    };

    if(areaH > 0){
      y = 'top: ' + selectStartY + 'px; ';
      h = 'height: ' + areaH  + 'px; ';
    } else {
      y = 'bottom: ' + (flowBox.offsetHeight + 60 - selectStartY) + 'px; ';
      h = 'height: ' + areaH * -1 + 'px; ';
    };

    selectArea.setAttribute('style', 'display: block; ' + x + y + w + h);
  };
  if(isMoving){
    let moveW = e.clientX - moveStartX;
    let moveH = e.clientY - moveStartY;

    flowBox.scrollLeft = scrollLeft - moveW;
    flowBox.scrollTop = scrollTop - moveH;
  }
});

flowBox.addEventListener('mouseup',(e)=>{
  selectArea.setAttribute('style','display: none;');
  [selectStartX,selectStartY] = [0,0];
  [moveStartX,moveStartY] = [0,0];
  isSelecting = false;
  isMoving = false;
});

document.addEventListener('click',(e) => {
  let closeNodes = [];
  let closeNexts = [];
  
  
  let rightBtnListCloses = Array.from(rightBtnList).map(item =>  [item.parentNode,item]);

  closeNodes.push(...Array.from(rightBtn));
  closeNexts.push(...rightBtnListCloses);

  closeNodes.forEach(item => {
    if(!item.contains(e.target)){
      item.style.display = 'none';
    };
  });
  closeNexts.forEach(item => {
    if(!item[0].contains(e.target)){
      item[1].style.display = 'none';
    };
  });
  //closeShowNexts(e,modList,'show-modsec-all');
});

document.addEventListener('keydown',(e) => {
  if(e.ctrlKey && (e.key === 'o' || e.key === 'O')){
    e.preventDefault();
    //导入本地文件
  };
  if(e.ctrlKey && (e.key === 's' || e.key === 'S')){
    e.preventDefault();
    //导出为本地文件
  };
  if(e.ctrlKey && e.shiftKey && (e.key === 's' || e.key === 'S')){
    e.preventDefault();
    //仅导出数据
  };
  if(e.ctrlKey && e.key === '\\'){
    e.preventDefault();
    //隐藏/显示所有菜单
  };
  if(e.ctrlKey && (e.key === 'a' || e.key === 'A')){
    e.preventDefault();
    //全选
  };
  if(e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A')){
    e.preventDefault();
    //反选
  };
  if(e.ctrlKey && (e.key === 'r' || e.key === 'R')){
    e.preventDefault();
    //刷新数据
  };
});

//模拟change事件来关闭展开的内容
function closeShowNexts(e,area,input){
  if(typeof input == 'string'){
    input = getElementMix(input);
  }
  if(!area.contains(e.target)){
    input.checked = false;
    let inputEvent = new Event('change',{bubbles:true});
    input.dispatchEvent(inputEvent);
  };
};

//生成安全的坐标
function reSafeTopLeft(event,area,node){
  let popW = node.offsetWidth;
  let maxX = area.offsetWidth - popW;
  let popH = node.offsetHeight;
  let maxY = area.offsetHeight - popH;
  let X = Math.min(event.clientX,maxX);
  let Y = Math.min(event.clientY,maxY);
  X = X == maxX ? event.clientX - popW : X;
  Y = Y == maxY ? event.clientY - popH : Y;
  node.style.left = X;
  node.style.top = Y;
  //返回九宫象限
  let xys = ['L','T']
  if(X >= (maxX + popW)/3){
    xys[0] = 'C'
  };
  if(X >= (maxX + popW)/1.5){
    xys[0] = 'R'
  };
  if(Y >= (maxY + popH)/3){
    xys[1] = 'C'
  };
  if(Y >= (maxY + popH)/1.5){
    xys[1] = 'B'
  };
  return {x: X, y: Y, w: popW, h: popH, xys: xys}
};

//节点生成与更新
class ZY_NODE {
  constructor(flowBox,allNodeDatas = []) {
    /*节点容器*/
    this.flowBox = flowBox && getElementMix(flowBox) ? getElementMix(flowBox) || this.Error('noFlowBox') : document.querySelector('[data-flow-box]') || this.Error('noFlowBox');
    this.allNodeDatas = this.addNode(allNodeDatas);
    this.allNodes = [];
  }

  addNode(nodeDatas){
    nodeDatas.forEach(data => {

    })
  }

  Error(type){
    switch (type){
      case 'noFlowBox':

      break
      case 'voidConnect':

      break
      default :
      tipsAll(['未知错误：' + type,'Unknown Error: ' + type],2000) 
      console.log(type);
    }
  }
}

let testNodes = [
  {}
]

let FLOW_BOX = new ZY_NODE(null,testNodes)



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
  if(node.getAttribute('data-egfont-size') !== null){
    ROOT.style.setProperty('--egfont-size',number + 'px');
    //console.log(number + 'px')
  }
  //console.log(number)
}

function getUserText(node){
  let text = node.getAttribute('data-text-value');
  if(node.getAttribute('data-egfont-text') !== null){
    let egfont = document.querySelectorAll('[data-egfont]');
    egfont.forEach(item => {
      item.textContent = text;
    })
  }
  //console.log(text)
}

function getUserSelect(node){
  let select = node.getAttribute('data-select-value');
  //console.log(text)
}


