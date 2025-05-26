class btndown extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 15H16V13H19V19H1V13H4V15ZM12 8H16L10 14L4 8H8V1H12V8Z" fill="var(--mainColor)"/>
    </svg>
    `;
  }
};
customElements.define('btn-down', btndown);

class btnset extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 18 18">
    <path fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1" d="M6.80722,3.70617L3.59452,1.67756L1.67756,3.59452L3.70617,6.80722L0,7.64451L0,10.3555L3.70617,11.1928L1.67756,14.4055L3.59452,16.3224L6.80722,14.2938L7.64451,18L10.3555,18L11.1928,14.2938L14.4055,16.3224L16.3224,14.4055L14.2938,11.1928L18,10.3555L18,7.64451L14.2938,6.80722L16.3224,3.59452L14.4055,1.67756L11.1928,3.70617L10.3555,0L7.6445,0L6.80722,3.70617ZM9,13.5Q9.11047,13.5,9.2208,13.4946Q9.33114,13.4892,9.44108,13.4783Q9.55101,13.4675,9.66028,13.4513Q9.76956,13.4351,9.8779,13.4135Q9.98625,13.392,10.0934,13.3651Q10.2006,13.3383,10.3063,13.3062Q10.412,13.2742,10.516,13.2369Q10.62,13.1997,10.7221,13.1575Q10.8241,13.1152,10.924,13.0679Q11.0239,13.0207,11.1213,12.9686Q11.2187,12.9166,11.3135,12.8598Q11.4082,12.803,11.5001,12.7416Q11.5919,12.6802,11.6806,12.6144Q11.7694,12.5486,11.8548,12.4785Q11.9402,12.4085,12.022,12.3343Q12.1039,12.2601,12.182,12.182Q12.2601,12.1039,12.3343,12.022Q12.4085,11.9402,12.4785,11.8548Q12.5486,11.7694,12.6144,11.6806Q12.6802,11.5919,12.7416,11.5001Q12.803,11.4082,12.8598,11.3135Q12.9166,11.2187,12.9686,11.1213Q13.0207,11.0239,13.0679,10.924Q13.1152,10.8241,13.1575,10.7221Q13.1997,10.62,13.2369,10.516Q13.2742,10.412,13.3062,10.3063Q13.3383,10.2006,13.3651,10.0934Q13.392,9.98625,13.4135,9.8779Q13.4351,9.76956,13.4513,9.66028Q13.4675,9.55101,13.4783,9.44108Q13.4892,9.33114,13.4946,9.2208Q13.5,9.11047,13.5,9Q13.5,8.88953,13.4946,8.7792Q13.4892,8.66886,13.4783,8.55892Q13.4675,8.44899,13.4513,8.33971Q13.4351,8.23044,13.4135,8.12209Q13.392,8.01375,13.3651,7.90659Q13.3383,7.79943,13.3062,7.69372Q13.2742,7.58801,13.2369,7.48399Q13.1997,7.37998,13.1575,7.27792Q13.1152,7.17586,13.0679,7.076Q13.0207,6.97614,12.9686,6.87871Q12.9166,6.78129,12.8598,6.68654Q12.803,6.59178,12.7416,6.49993Q12.6802,6.40808,12.6144,6.31935Q12.5486,6.23062,12.4785,6.14523Q12.4085,6.05984,12.3343,5.97798Q12.2601,5.89613,12.182,5.81802Q12.1039,5.73991,12.022,5.66572Q11.9402,5.59153,11.8548,5.52145Q11.7694,5.45137,11.6806,5.38557Q11.5919,5.31976,11.5001,5.25839Q11.4082,5.19701,11.3135,5.14022Q11.2187,5.08343,11.1213,5.03135Q11.0239,4.97928,10.924,4.93205Q10.8241,4.88482,10.7221,4.84254Q10.62,4.80027,10.516,4.76305Q10.412,4.72584,10.3063,4.69377Q10.2006,4.6617,10.0934,4.63486Q9.98625,4.60802,9.8779,4.58647Q9.76956,4.56491,9.66028,4.54871Q9.55101,4.5325,9.44108,4.52167Q9.33114,4.51084,9.2208,4.50542Q9.11047,4.5,9,4.5Q8.88953,4.5,8.7792,4.50542Q8.66886,4.51084,8.55892,4.52167Q8.44899,4.5325,8.33971,4.54871Q8.23044,4.56491,8.12209,4.58647Q8.01375,4.60802,7.90659,4.63486Q7.79943,4.6617,7.69372,4.69377Q7.58801,4.72584,7.48399,4.76305Q7.37998,4.80027,7.27792,4.84254Q7.17586,4.88482,7.076,4.93205Q6.97614,4.97928,6.87871,5.03135Q6.78129,5.08343,6.68654,5.14022Q6.59178,5.19701,6.49993,5.25839Q6.40808,5.31976,6.31935,5.38557Q6.23062,5.45137,6.14523,5.52145Q6.05984,5.59153,5.97798,5.66572Q5.89613,5.73991,5.81802,5.81802Q5.73991,5.89613,5.66572,5.97798Q5.59153,6.05984,5.52145,6.14523Q5.45137,6.23062,5.38557,6.31935Q5.31976,6.40808,5.25839,6.49993Q5.19701,6.59178,5.14022,6.68654Q5.08343,6.78129,5.03135,6.87871Q4.97928,6.97614,4.93205,7.076Q4.88482,7.17586,4.84254,7.27792Q4.80027,7.37998,4.76305,7.48399Q4.72584,7.58801,4.69377,7.69372Q4.6617,7.79943,4.63486,7.90659Q4.60802,8.01375,4.58647,8.12209Q4.56491,8.23044,4.54871,8.33971Q4.5325,8.44899,4.52167,8.55892Q4.51084,8.66886,4.50542,8.7792Q4.5,8.88953,4.5,9Q4.5,9.11047,4.50542,9.2208Q4.51084,9.33114,4.52167,9.44108Q4.5325,9.55101,4.54871,9.66028Q4.56491,9.76956,4.58647,9.8779Q4.60802,9.98625,4.63486,10.0934Q4.6617,10.2006,4.69377,10.3063Q4.72584,10.412,4.76305,10.516Q4.80027,10.62,4.84254,10.7221Q4.88482,10.8241,4.93205,10.924Q4.97928,11.0239,5.03135,11.1213Q5.08343,11.2187,5.14022,11.3135Q5.19701,11.4082,5.25839,11.5001Q5.31976,11.5919,5.38557,11.6806Q5.45137,11.7694,5.52145,11.8548Q5.59153,11.9402,5.66572,12.022Q5.73991,12.1039,5.81802,12.182Q5.89613,12.2601,5.97798,12.3343Q6.05984,12.4085,6.14523,12.4785Q6.23062,12.5486,6.31935,12.6144Q6.40808,12.6802,6.49993,12.7416Q6.59178,12.803,6.68654,12.8598Q6.78129,12.9166,6.87871,12.9686Q6.97614,13.0207,7.076,13.0679Q7.17586,13.1152,7.27792,13.1575Q7.37998,13.1997,7.48399,13.2369Q7.58801,13.2742,7.69372,13.3062Q7.79943,13.3383,7.90659,13.3651Q8.01375,13.392,8.12209,13.4135Q8.23044,13.4351,8.33971,13.4513Q8.44899,13.4675,8.55892,13.4783Q8.66886,13.4892,8.7792,13.4946Q8.88953,13.5,9,13.5Z" ></path>
    <ellipse fill="var(--mainColor)" fill-opacity="1" cx="8.999999761581421" cy="8.999999761581421" rx="2.999999761581421" ry="2.999999761581421" ></ellipse>
    </svg>
    `;
  }
};
customElements.define('btn-set', btnset);


const FONTS_INFO = [
    {
      fontFamily:["庄园雅宋","zhuangyuanyasong"],
      fontStyles:[
        {
          fontStyle:["常规","Regular"],
          fontWeight:"500",
          download:"../fonts/otf/zhuangyuanyasong-Regular.otf",
        },
        {
          fontStyle:["粗体","Bold"],
          fontWeight:"700",
          download:'../fonts/otf/zhuangyuanyasong-Bold.otf',
        }
      ],
      keyword:[
        ["衬线体","serif"],
        ["古典","classical"],
      ]
    },
    {
      fontFamily:["铸印体","zhuyinti"],
      fontStyles:[
        {
          fontStyle:["常规","Regular"],
          fontWeight:"500",
          download:"../fonts/otf/zhuyinti-Regular.otf",
        }
      ],
      keyword:[
        ["科技感","technology"],
      ]
    },
];

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
]

window.addEventListener('load',()=>{
  if(ISMOBILE || window.innerWidth <= 750){
    let egfontSizeInput = document.querySelector('[data-egfont-size]').querySelector('[data-input="value"]')
    egfontSizeInput.value = egfontSizeInput.value >= 40 ? 40 : egfontSizeInput.value;
    let inputEvent = new Event('change',{bubbles:true});
    egfontSizeInput.dispatchEvent(inputEvent);
  }
  addFontsCard();
});

window.addEventListener('resize',()=>{
  /*防抖*/
  let MOVE_TIMEOUT;
  if(MOVE_TIMEOUT){
      clearTimeout(MOVE_TIMEOUT)
  };
  MOVE_TIMEOUT = setTimeout(()=>{
    if(window.innerWidth <= 750){
      let egfontSizeInput = document.querySelector('[data-egfont-size]').querySelector('[data-input="value"]')
      egfontSizeInput.value = egfontSizeInput.value >= 40 ? 40 : egfontSizeInput.value;
      let inputEvent = new Event('change',{bubbles:true});
      egfontSizeInput.dispatchEvent(inputEvent);
    } else {
      let egfontSizeInput = document.querySelector('[data-egfont-size]').querySelector('[data-input="value"]')
      egfontSizeInput.value = egfontSizeInput.value == 40 ? 70 : egfontSizeInput.value;
      let inputEvent = new Event('change',{bubbles:true});
      egfontSizeInput.dispatchEvent(inputEvent);
    }
  },500);
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

function addFontsCard(){
  let egfontSetText = document.querySelector('[data-egfont-text]');
  let text = egfontSetText.getAttribute('data-text-value');
  let egfontCardList = document.querySelector('[data-fontcard-list]');
  FONTS_INFO.forEach((fonts,index) => {
    let card = document.createElement('div');
    card.className = 'df-ffc w100';
    card.setAttribute('data-fontcard','');
    card.setAttribute('data-keyword',[fonts.keyword])
    let cardTitleInput = document.createElement('input');
    cardTitleInput.type = 'checkbox'
    cardTitleInput.id = 'fontshow_' + index;
    card.appendChild(cardTitleInput);

    let cardTitleLable = document.createElement('label');
    cardTitleLable.setAttribute('for','fontshow_' + index);
    cardTitleLable.className ='fontcard-title show-next df-lc';
    let cardTitle = document.createElement('div');
    cardTitle.setAttribute('data-en-text',fonts.fontFamily[1]);
    cardTitle.innerHTML = fonts.fontFamily[0];
    cardTitleLable.appendChild(cardTitle)
    fonts.keyword.forEach(item => {
      let tags = document.createElement('div');
      tags.style.setProperty('--tagsColor',randomColor[Math.floor(Math.random()*10)])
      tags.setAttribute('data-fonttags',item[0] + ',' + item[1]);
      tags.setAttribute('data-en-text',item[1])
      tags.innerHTML = item[0];
      cardTitleLable.appendChild(tags)
    })
    card.appendChild(cardTitleLable);

    let carEgBox = document.createElement('div');
    carEgBox.className = 'df-ffc w100';
    carEgBox.style.gap = '10px';
    fonts.fontStyles.forEach(item => {
      let difStyle = document.createElement('div');
      difStyle.className = 'df-ffc pos-r';
      difStyle.style.gap = '4px';

      let egfontTitle = document.createElement('a');
      let styleName = `<div data-en-text="${item.fontStyle[1]}">${item.fontStyle[0]}</div>`;
      let down = '<div style="width:14px; height:14px; display:var(--down-df,none)"><btn-down></btn-down></div>'
      egfontTitle.setAttribute('download','');
      egfontTitle.setAttribute('data-any','pc');
      egfontTitle.href = item.download;
      egfontTitle.className = 'fontcard-title-style df-lc pos-a'
      egfontTitle.style.gap = '4px';
      egfontTitle.innerHTML = styleName + down;
      difStyle.appendChild(egfontTitle);

      let egfontText = document.createElement('div');
      egfontText.setAttribute('data-egfont','');
      egfontText.className = 'w100';
      egfontText.style.fontFamily = fonts.fontFamily[1];//英文名
      egfontText.style.fontWeight = item.fontWeight;
      egfontText.innerHTML = text; 
      difStyle.appendChild(egfontText);

      carEgBox.appendChild(difStyle)
    });
    card.appendChild(carEgBox);
    
    egfontCardList.appendChild(card);
    cardTitleInput.addEventListener('change',() => {showNext(cardTitleInput,carEgBox,'flex')})
    
  });
  reLanguage()
}

function reLanguage(){
  let languageSwi = document.querySelector('[data-language-check]');
  let inputEvent = new Event('change',{bubbles:true});
  languageSwi.dispatchEvent(inputEvent);
}
