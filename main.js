class iconcoin extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<div data-coin-b class="pos-a df-cc"><div></div></div>
    <div data-coin-c class="pos-a df-cc"></div>
    <div data-coin-a class="df-cc" >
     <div class="df-cc" data-en-text="$">
      ¥
     </div> 
    </div>
    `;
    this.style.order = this.getAttribute('data-coin')
}
};
customElements.define('icon-coin', iconcoin);

let worksName = document.querySelectorAll('[data-worksname]');
let worksNamePath = document.querySelectorAll('[data-worksname-path]');
let sideMix = document.querySelector('[data-tab-side-mix]');
let sideMask = document.querySelector('[data-side-mask]');
let btnMore = document.getElementById('btn-more');
let headMove = document.querySelector('[data-head-move]');
let coinAll = document.querySelector('[data-coin-all]');
let coins = coinAll.querySelectorAll('[data-coin]');
let coinCut = document.querySelector('[data-coin-cut]')

window.addEventListener('load',()=>{
  //viewPage('individual');
  worksName.forEach(item => {
    item.style.animation = 'colormove2 1s';
    item.style.backgroundSize = '0';
    item.style.backgroundPosition = '100%';
  });
  addCoinMotion();
});

window.addEventListener('resize',()=>{
});


worksName.forEach(item => {

  item.parentNode.addEventListener('mouseenter',()=>{
    item.style.animation = 'colormove1 1s';
    item.style.backgroundSize = '100%';
    item.style.backgroundPosition = '0%';
  });

  item.parentNode.addEventListener('mouseleave',()=>{
    item.style.animation = 'colormove2 1s';
    item.style.backgroundSize = '0';
    item.style.backgroundPosition = '100%';
  });

  if(ISMOBILE){
    item.parentNode.addEventListener('animationend',()=>{
      item.style.animation = '';
    });

    item.parentNode.addEventListener('touchstart',()=>{
      item.setAttribute('data-touch','true')
      item.style.animation = 'colormove1 1s';
      item.style.backgroundSize = '100%';
      item.style.backgroundPosition = '0%';
      document.addEventListener('touchstart',(event)=>{
        if(!item.contains(event.target) && item.getAttribute('data-touch') == 'true'){
          item.style.animation = 'colormove2 1s';
          item.style.backgroundSize = '0';
          item.style.backgroundPosition = '100%';
          item.setAttribute('data-touch','false')
        }
      });  
    });
  }
  
})

worksNamePath.forEach(item => {
  let pathlength = item.getTotalLength();
  item.style.setProperty('--bod-array',pathlength)
});

headMove.addEventListener('click',()=>{
  //viewPage('support')
})

headMove.addEventListener('mouseenter',(event)=>{
  event.target.style.animationPlayState = 'paused';
  coinCut.style.animationPlayState = 'paused';
  let fills = event.target.querySelectorAll('[data-head-fill]');
  let paths = event.target.querySelectorAll('[data-head-path]');
  fills.forEach(item => {
    item.style.animationPlayState = 'paused';
  });
  paths.forEach(item => {
    item.style.animationPlayState = 'paused';
  });
  coins.forEach(item => {
    item.style.animationPlayState = 'paused';
  });
});

headMove.addEventListener('mouseleave',(event)=>{
  event.target.style.animationPlayState = 'running';
  coinCut.style.animationPlayState = 'running';
  let fills = event.target.querySelectorAll('[data-head-fill]');
  let paths = event.target.querySelectorAll('[data-head-path]');
  fills.forEach(item => {
    item.style.animationPlayState = 'running';
  });
  paths.forEach(item => {
    item.style.animationPlayState = 'running';
  });
  coins.forEach(item => {
    item.style.animationPlayState = 'running';
  });
});

document.getElementById('btn-more').addEventListener('change',(event)=>{
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
    },300)
  }
});

document.addEventListener('click',(event)=>{
  if(!sideMix.contains(event.target) && sideMask.style.display !== 'none' && sideMix.style.display !== 'none' && btnMore.checked == true ){
    btnMore.checked = false;
    let inputEvent = new Event('change',{bubbles:true});
    btnMore.dispatchEvent(inputEvent);
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

function addCoinMotion(){
  coins.forEach(item => {
    let deg = item.getAttribute('data-coin') * 10;
    let jump = item.getAttribute('data-coin') * 0.25;
    setInterval(()=>{
      if(deg <= 360){
        item.style.setProperty('--coin-r', deg + 'deg');
        item.style.setProperty('--coin-jump', jump + 's');
        deg++
      } else {
        deg = 0
      }
    },5)
  })
}