
window.addEventListener('load',()=>{
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



/*监听组件的自定义属性值，变化时触发函数，用于已经绑定事件用于自身的组件，如颜色选择器、滑块输入框组合、为空自动填充文案的输入框、导航tab、下拉选项等*/
// 使用 yn_comp.js 提供的统一 getUserMix API
// 注册各种类型的回调函数
getUserMix.register('color', getUserColor);
getUserMix.register('number', getUserNumber);
getUserMix.register('text', getUserText);
getUserMix.register('select', getUserSelect);


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


