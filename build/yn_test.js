let HREF_ALL = document.querySelectorAll('a');
let A_BACK = document.querySelectorAll('[data-back]');
let LINK_ALL = document.querySelectorAll('[data-link-to]');

let ISLOCAL = window.location.protocol === 'file:' || window.location.hostname === 'localhost';
let ISBACK = document.referrer && document.referrer !== window.location.href;

window.addEventListener('load',()=>{
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

});
