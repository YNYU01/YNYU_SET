let HREF_ALL = document.querySelectorAll('a');
let A_BACK = document.querySelectorAll('[data-back]');
let LINK_ALL = document.querySelectorAll('[data-link-to]');

let ISLOCAL = window.location.protocol === 'file:' || window.location.hostname === 'localhost';
let ISBACK = document.referrer && document.referrer !== window.location.href;

window.addEventListener('load',()=>{
  document.getElementById('noise').className = 'tex-noise';
  if(ISLOCAL){
    HREF_ALL.forEach(item => {
      let href = item.getAttribute('href');
      switch (href){
        case '/': item.setAttribute('href','index.html'); break;
        case 'home' : item.setAttribute('href','home.html'); break;
        case '../' : item.setAttribute('href','../index.html'); break;
      };
    }); 
  };

  LINK_ALL.forEach(item => {
    let link = item.getAttribute('data-link-to');
    if(link){
      if(ISLOCAL){
        if(item.getAttribute('data-back')){
          item.setAttribute('href',link  + '.html');
        } else {
          item.setAttribute('href',link  + '/index.html');
        }
      } else {
        item.setAttribute('href',link);
      };
    } 
  });
  
  A_BACK.forEach(item => {
    if(ISBACK || (document.referrer == '' && ISLOCAL)){
      //console.log(document.referrer)
      item.addEventListener('click',(event)=>{
        event.preventDefault();
        window.history.back();
      });
    } else {
      //console.log(666)
      item.target = '_blank';
    };
  });
  
  loadFont();
});


let loadFontAfter = [
  "data-en-text",
  "data-en-input",
  "data-en-placeholder",
  "data-turnto",
  "data-back",
]

function loadFont(){
  setTimeout(()=>{
    loadFontAfter.forEach(key => {
      let nodes = document.querySelectorAll(`[${key}]`);
      nodes.forEach(item => {
        item.style.fontFamily = '"Shanggu Sans", Arial, Helvetica, sans-serif';
      })
    });
  },500);
}