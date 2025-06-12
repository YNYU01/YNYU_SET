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
    <svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="var(--mainColor)" d="M7 4H11L10.5 0H7.5L7 4Z"/>
      <path fill="var(--mainColor)" d="M11.1212 4.05011L13.9496 6.87853L16.4245 3.69655L14.3031 1.57523L11.1212 4.05011Z"/>
      <path fill="var(--mainColor)" d="M13.9802 6.94922V10.9492L17.9802 10.4492V7.44922L13.9802 6.94922Z"/>
      <path fill="var(--mainColor)" d="M14.0203 11.0505L11.1919 13.8789L14.3739 16.3538L16.4952 14.2325L14.0203 11.0505Z"/>
      <path fill="var(--mainColor)" d="M11 14L7 14L7.5 18L10.5 18L11 14Z"/>
      <path fill="var(--mainColor)" d="M6.8786 13.9499L4.05017 11.1215L1.5753 14.3034L3.69662 16.4248L6.8786 13.9499Z"/>
      <path fill="var(--mainColor)" d="M4.01965 11.0508L4.01965 7.05078L0.0196531 7.55078L0.0196533 10.5508L4.01965 11.0508Z"/>
      <path fill="var(--mainColor)" d="M3.97943 6.94952L6.80785 4.12109L3.62587 1.64622L1.50455 3.76754L3.97943 6.94952Z"/>
      <circle cx="9" cy="9" r="5" stroke="var(--mainColor)" stroke-weight="1"/>
      <circle cx="9" cy="9" r="3" fill="var(--mainColor)"/>
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
        },
        {
          fontStyle:["破形","Mask"],
          fontWeight:"700",
          download:"../fonts/otf/zhuyinti-Mask.otf",
        }
      ],
      keyword:[
        ["科技感","technology"],
      ]
    },
    {
      fontFamily:["锻刀体","duandaoti"],
      fontStyles:[
        {
          fontStyle:["细体","Light"],
          fontWeight:"300",
          download:"../fonts/otf/duandaoti-Light.otf",
        },
        {
          fontStyle:["常规","Regular"],
          fontWeight:"500",
          download:"../fonts/otf/duandaoti-Regular.otf",
        },
      ],
      keyword:[
        ["实验性","experimental"],
      ]
    },
];

const findTags = document.querySelector('[data-findtags]');
const egfontMoreset = document.getElementById('egfont-moreset');
const egfontCardList = document.querySelector('[data-fontcard-list]');
const egfontSetText = document.querySelector('[data-egfont-text]');

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
  document.getElementById('noise').className = 'tex-noise';
  if(ISMOBILE || window.innerWidth <= 750){
    let egfontSizeInput = document.querySelector('[data-egfont-size]');
    let oldfontsize = egfontSizeInput.getAttribute('data-number-value');
    let newfontsize = oldfontsize >= 32 ? 32 : oldfontsize;
    egfontSizeInput.setAttribute('data-number-value',newfontsize);
    egfontSizeInput.querySelectorAll('input').forEach(item => {item.value = newfontsize})
  } else {
    egfontMoreset.checked = false;
    let inputEvent = new Event('change',{bubbles:true});
    egfontMoreset.dispatchEvent(inputEvent);
  }
  addFontsCard(FONTS_INFO);
});

window.addEventListener('resize',()=>{
  /*防抖*/
  let MOVE_TIMEOUT;
  if(MOVE_TIMEOUT){
      clearTimeout(MOVE_TIMEOUT)
  };
  MOVE_TIMEOUT = setTimeout(()=>{
    if(!ISMOBILE){
      if(window.innerWidth <= 750){
        let egfontSizeInput = document.querySelector('[data-egfont-size]');
        let oldfontsize = egfontSizeInput.getAttribute('data-number-value');
        let newfontsize = oldfontsize >= 60 ? 40 : oldfontsize;
        egfontSizeInput.setAttribute('data-number-value',newfontsize);
        egfontSizeInput.querySelectorAll('input').forEach(item => {item.value = newfontsize});
      } else {
        let egfontSizeInput = document.querySelector('[data-egfont-size]');
        let oldfontsize = egfontSizeInput.getAttribute('data-number-value');
        let newfontsize = oldfontsize == 40 ? 70 : oldfontsize;
        egfontSizeInput.setAttribute('data-number-value',newfontsize);
        egfontSizeInput.querySelectorAll('input').forEach(item => {item.value = newfontsize});
      };
    };  
  },500);
});

findTags.addEventListener('input',(event)=>{ 
  const fontCards = document.querySelectorAll('[data-fontcard]');
  let canFind = 0;
  fontCards.forEach(node => {
    let tagsNode = node.querySelectorAll('[data-fonttags]');
    let styleName = [];
    tagsNode.forEach(item => {
      styleName.push(...item.getAttribute('data-fonttags').toLowerCase().split(','));
    }); 
    let finds = event.target.value.toLowerCase().split(',');
    if(styleName.some(item => finds.includes(item))){
      node.style.setProperty('--tagsColor-pick','var(--themeColor)');
      //node.style.display = 'flex';
      canFind++
    } else {
      node.style.setProperty('--tagsColor-pick','var(--mainColor)');
      //node.style.display = 'none';
    };
    if(event.target.value == ''){
      node.style.display = 'flex';
      canFind = fontCards.length
    };
  });
});

findTags.addEventListener('change',(event)=>{ 
  const fontCards = document.querySelectorAll('[data-fontcard]');
  let canFind = 0;
  fontCards.forEach(node => {
    let tagsNode = node.querySelectorAll('[data-fonttags]');
    let styleName = [];
    tagsNode.forEach(item => {
      styleName.push(...item.getAttribute('data-fonttags').toLowerCase().split(','));
    }); 
    let finds = event.target.value.toLowerCase().split(',');
    if(styleName.some(item => finds.includes(item))){
      node.style.display = 'flex';
      canFind++
    } else {
      node.style.display = 'none';
    };
    if(event.target.value == ''){
      node.style.display = 'flex';
      canFind = fontCards.length
    };
  });
  if(canFind == 0){
      
  }
});

findTags.addEventListener('keydown',(event)=>{
  if (event.key === 'Enter') {
    let inputEvent = new Event('change',{bubbles:true});
    findTags.dispatchEvent(inputEvent);
  }
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
  console.log(text)
}

function getUserSelect(node){
  let select = node.getAttribute('data-select-value');
  //console.log(text)
}

function addFontsCard(fontsObj){
  let text = egfontSetText.getAttribute('data-text-value');
  fontsObj.forEach((fonts,index) => {
    let card = document.createElement('div');
    card.className = 'df-ffc w100';
    card.setAttribute('data-fontcard','');
    card.setAttribute('data-keyword',[fonts.keyword])

    let cardTitleMix = document.createElement('div');
    cardTitleMix.className = 'fontcard-title df-lc';
    cardTitleMix.style.flexWrap = 'wrap';
    cardTitleMix.style.rowGap = '4px';

    let cardTitle = document.createElement('div');
    cardTitle.setAttribute('data-en-text',fonts.fontFamily[1]);
    cardTitle.innerHTML = fonts.fontFamily[0];
    cardTitleMix.appendChild(cardTitle);
    let fontDown = document.createElement('div');
    fontDown.setAttribute('style','width:14px; height:14px;');
    fontDown.innerHTML = '<btn-down></btn-down>';
    fontDown.addEventListener('click',()=>{

    })
    cardTitleMix.appendChild(fontDown);

    fonts.keyword.forEach(item => {
      let tags = document.createElement('div');
      tags.style.setProperty('--tagsColor',randomColor[Math.floor(Math.random()*10)])
      tags.setAttribute('data-fonttags',item[0] + ',' + item[1]);
      tags.setAttribute('data-en-text',item[1])
      tags.innerHTML = item[0];
      cardTitleMix.appendChild(tags);

      tags.addEventListener('click',(event)=>{
        let tagsText = event.target.textContent.toLowerCase();
        let inputEvent = new Event('input',{bubbles:true});
        if(findTags.value == ''){
          findTags.value = tagsText;
          findTags.dispatchEvent(inputEvent);
        } else if(!findTags.value.toLowerCase().split(',').includes(tagsText)){
          findTags.value +=  ',' + tagsText;
          findTags.dispatchEvent(inputEvent);
        };
        findTags.focus();
        if(egfontMoreset.checked){
          egfontMoreset.checked = false;
          let inputEvent = new Event('change',{bubbles:true});
          egfontMoreset.dispatchEvent(inputEvent);
        }
      })
    });

    let cardTitleInput = document.createElement('input');
    cardTitleInput.type = 'checkbox'
    cardTitleInput.id = 'fontshow_' + index;
    cardTitleMix.appendChild(cardTitleInput);
    let cardTitleLable = document.createElement('label');
    cardTitleLable.setAttribute('for','fontshow_' + index);
    cardTitleLable.className = 'show-next h100';
    cardTitleLable.style.minWidth = '18px';
    cardTitleLable.style.flex = '1';

    cardTitleMix.appendChild(cardTitleLable)
    card.appendChild(cardTitleMix);

    let cardEgBox = document.createElement('div');
    cardEgBox.className = 'df-ffc w100';
    cardEgBox.style.gap = '10px';
    fonts.fontStyles.forEach(item => {
      let difStyle = document.createElement('div');
      difStyle.className = 'df-ffc pos-r';
      difStyle.style.gap = '4px';

      let egfontTitle = document.createElement('div');
      let styleName = `<div data-any="pc" data-en-text="${item.fontStyle[1]}">${item.fontStyle[0]}</div>`;
      let styleName2 = `<div data-any="pe" data-en-text="${item.fontStyle[1][0]}${item.fontStyle[1][1]}">${item.fontStyle[0][0]}${item.fontStyle[0][1]}</div>`;

      //let down = '<div style="width:14px; height:14px; display:var(--down-df,none)"><btn-down></btn-down></div>'
      //egfontTitle.setAttribute('download','');
      //egfontTitle.href = item.download;
      egfontTitle.className = 'fontcard-title-style df-lc pos-a'
      egfontTitle.style.gap = '4px';
      egfontTitle.innerHTML = styleName + styleName2;
      difStyle.appendChild(egfontTitle);

      let egfontText = document.createElement('div');
      egfontText.setAttribute('data-egfont','');
      egfontText.className = 'w100';
      egfontText.style.fontFamily = fonts.fontFamily[1];//英文名
      egfontText.style.fontWeight = item.fontWeight;
      egfontText.innerHTML = text; 
      difStyle.appendChild(egfontText);

      cardEgBox.appendChild(difStyle)
    });
    card.appendChild(cardEgBox);
    
    egfontCardList.appendChild(card);
    cardTitleInput.addEventListener('change',() => {showNext(cardTitleInput,cardEgBox,'flex')})
    
  });

  //底部固定留空，防遮挡
  let bottomMust = document.createElement('div');
  bottomMust.className = 'w100 fl0'
  bottomMust.style.height = '40px';
  egfontCardList.appendChild(bottomMust);

  //最后重置下语言
  if(ROOT.getAttribute('data-language') == 'En'){
    setLanguage(true);
    setLanguage(false);
  }
}

