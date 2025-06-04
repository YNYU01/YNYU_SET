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
let coinCut = document.querySelector('[data-coin-cut]');
let rectBg = document.querySelectorAll('[data-rect-bg]');

let randomColor = [
  "var(--code1)",
  "var(--code2)",
  "var(--code3)",
  "var(--code4)",
  "var(--code5)",
  "var(--code6)",
  "var(--code7)",
  "var(--code8)",
  "var(--code9)",
  "var(--code10)",
];

window.addEventListener('load',()=>{
  //viewPage('individual');
  document.getElementById('noise').className = 'noise';
  worksName.forEach(item => {
    item.style.animation = 'colormove2 1s';
    item.style.backgroundSize = '0';
    item.style.backgroundPosition = '100%';
  });
  addCoinMotion();
  reRectBg(ROOT.getAttribute('data-theme'));
});

window.addEventListener('resize',()=>{
});

THEME_SWITCH.forEach(item => {
  item.addEventListener('change',()=>{
    reRectBg(ROOT.getAttribute('data-theme'));
  });
});

worksName.forEach(item => {
  if(ISMOBILE){ 
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
  } else {
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
  }
  
});


worksNamePath.forEach(item => {
  let pathlength = item.getTotalLength();
  item.style.setProperty('--bod-array',pathlength)
});

headMove.addEventListener('click',()=>{
  //viewPage('support')
});

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
};

let rectBgInterval = null;

function reRectBg(theme){
  let copy = document.querySelector('[data-rectbg-copy]');
  if(copy){
    copy.remove();
  }
  if(rectBgInterval !== null){
    clearInterval(rectBgInterval);
    rectBgInterval = null;
  } else {
    roNum();
    roNum();
    roNum();
    roNum();
    roNum();
  }

  addCopy();
  rectBgInterval = setInterval(()=>{
    rectBg.forEach(item => {
      item.setAttribute('fill','none')
      item.setAttribute('fill-opacity','0')
    });
    roNum();
    roNum();
    roNum();
    roNum();
    roNum();
  },5000);

  function addCopy(){
    let div = document.createElement('div');
    div.setAttribute('data-rectbg-copy','')
    div.className = 'pos-a';
    div.setAttribute('style','width: 120%; height: 150%; z-index: -1;')
    let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width','100%');
    svg.setAttribute('height','100%');
    svg.setAttribute('viewBox','0 0 432 370');

    let defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
    rectBg.forEach((item,index) => {
      let id = 'linearMix' + index;
      let wh = item.getAttribute('width');
      let lineW = 14;
      let lineGap = 0.3;
      if(ROOT.getAttribute('data-mobile') == 'true'){
        lineW = 14;
        lineGap = 0.8;
      }
      let lineNum = Math.floor(wh/(lineW + lineGap));
      let lineW100 = lineW/wh * 100;
      let lineGap100 = lineGap/wh  * 100;
      let lineEnd100 = null;
      if(wh%(lineW + lineGap) !== 0){
        lineEnd100 = wh%(lineW + lineGap) / wh  * 100;
      }
      //console.log(wh,lineNum,lineW100,lineGap100,lineEnd100)
      let linearGradient = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
      linearGradient.id = id;
      if(index%2 == 1){
        linearGradient.setAttribute('x1','0%');
        linearGradient.setAttribute('y1','0%');
        linearGradient.setAttribute('x2','100%');
        linearGradient.setAttribute('y2','0%');
      }else{
        linearGradient.setAttribute('x1','0%');
        linearGradient.setAttribute('y1','0%');
        linearGradient.setAttribute('x2','0%');
        linearGradient.setAttribute('y2','100%');
      }
      
      linearGradient.innerHTML = '';
      let star = 0;
      let color = theme == 'light' ? '#eeeeee' : '#202020';
      color = color ? color : 'rgba(0,0,0,0)';
      for(let i = 0; i < lineNum; i++){
        let stop = `<stop offset="${star}%" style="stop-color:${color}; stop-opacity:0"></stop>
        <stop offset="${star + lineW100}%" style="stop-color:${color}; stop-opacity:0"></stop>
        <stop offset="${star + lineW100}%" style="stop-color:${color}; stop-opacity:1"></stop>
        <stop offset="${star + lineW100 + lineGap100}%" style="stop-color:${color}; stop-opacity:1"></stop>
        `
        if(i == lineNum - 1 && lineEnd100 !== null){
          stop += `<stop offset="${star + lineW100 + lineGap100}%" style="stop-color:${color}; stop-opacity:0"></stop>
          <stop offset="100%" style="stop-color:${color}; stop-opacity:0"></stop>
          `
        }

        star = star + lineW100 + lineGap100;
        linearGradient.innerHTML += stop;
      };
      defs.appendChild(linearGradient);
    });
    let g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('transform','rotate(45 500 150) translate(0,0)')
    rectBg.forEach((item,index) => {
      let rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      rect.setAttribute('x',item.getAttribute('x'));
      rect.setAttribute('y',item.getAttribute('y'));
      rect.setAttribute('width',item.getAttribute('width'));
      rect.setAttribute('height',item.getAttribute('height'));
      rect.setAttribute('fill','url(#linearMix' + index + ')');
      rect.setAttribute('data-rect-bg2','');
      g.appendChild(rect);
    });
    
    svg.appendChild(defs);
    svg.appendChild(g);
    div.appendChild(svg);
    rectBg[0].parentNode.parentNode.parentNode.parentNode.appendChild(div);
    rectBg[0].parentNode.parentNode.parentNode.parentNode.insertBefore(div,rectBg[0].parentNode.parentNode.parentNode)
  }

  function roNum(){
    let num = Math.floor(Math.random()*rectBg.length)
    rectBg[num].setAttribute('fill',randomColor[Math.floor(Math.random()*10)])
    rectBg[num].setAttribute('fill-opacity',0.1)
  }
}