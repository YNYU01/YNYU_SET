const ROOT = document.documentElement;
let ISMOBILE = false;
let MOBILE_KEYS = /mobile | android | iphone | ipad | blackberry | windows phone/i

if(MOBILE_KEYS.test(navigator.userAgent.toLowerCase()) || window.innerWidth <= 750){
  ISMOBILE = true;
  ROOT.setAttribute('data-mobile','true');
} else {
  ROOT.setAttribute('data-mobile','false');
  ISMOBILE = false;
}

if(localStorage.getItem('userTheme') == 'light'){
  ROOT.setAttribute("data-theme","light");
}
if(localStorage.getItem('userTheme') == 'dark'){
  ROOT.setAttribute("data-theme","dark");
}
if(!localStorage.getItem('userTheme')){
  ROOT.setAttribute("data-theme","light");
  localStorage.setItem('userTheme','light');
}

if(localStorage.getItem('userLanguage') == 'En'){
  ROOT.setAttribute("data-language","En");
}
if(localStorage.getItem('userLanguage') == 'Zh'){
  ROOT.setAttribute("data-language","Zh");
}
if(!localStorage.getItem('userLanguage')){
  ROOT.setAttribute("data-language","En");
  localStorage.setItem('userLanguage','En');
}