const flowBox = document.querySelector('[data-flow-box]');
const flowBoxRightbtn = document.querySelector('[data-rightbtn-flewbox]');
const modList = document.querySelector('[data-flow-modlist]');
const modelAll = document.querySelector('[data-flow-model-all]');


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

flowBox.addEventListener('contextmenu',(e)=>{
  e.preventDefault();
  flowBoxRightbtn.style.display = 'flex';
  reSafeTopLeft(e,flowBox,flowBoxRightbtn);
});

flowBoxRightbtn.addEventListener('contextmenu',(e)=>{
  e.preventDefault();
  flowBoxRightbtn.style.display = 'flex';
  reSafeTopLeft(e,flowBox,flowBoxRightbtn);
});

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
  return(X,Y)
};

document.addEventListener('click',(e) => {
  if(!flowBoxRightbtn.contains(e.target)){
    flowBoxRightbtn.style.display = 'none';
  };
  //closeShowNexts(modList,'show-modsec-all');
  function closeShowNexts(area,input){
    if(typeof input == 'string'){
      input = getElementMix(input);
    }
    if(!area.contains(e.target)){
      input.checked = false;
      let inputEvent = new Event('change',{bubbles:true});
      input.dispatchEvent(inputEvent);
    };
  };
});

document.addEventListener('keydown',(e) => {
  if(e.ctrlKey && (e.key === 'o' || e.key === 'O')){
    e.preventDefault();
  };
  if(e.ctrlKey && (e.key === 's' || e.key === 'S')){
    e.preventDefault();
  };
  if(e.ctrlKey && (e.shiftKey && e.key === 's' || e.key === 'S')){
    e.preventDefault();
  };
  if(e.ctrlKey && e.key === '\\'){
    e.preventDefault();
    console.log(e.key)
  };
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


