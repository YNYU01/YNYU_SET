const ROOT = document.documentElement;

let ISLOCAL = false;
if (window.location.protocol === 'file:' || window.location.hostname === 'localhost'){
  ISLOCAL = true;
};

let PULGIN_LOCAL = true;
let PLUGINAPP = ROOT.getAttribute('data-plugin');
let ISWORK_TIME = true;
let userSkillStar = [];

/**
 * 使localStorage兼容浏览器/插件环境
 */
var storageMix = {
  get: (key)=>{
    if(PLUGINAPP){
      if(typeof toolMessage === 'function'){
        toolMessage([key,'getlocal'],PLUGINAPP);
      };
    } else {
      return window.localStorage.getItem(key);
    }
  },
  set: (key,value)=>{
    if(PLUGINAPP){
      try {
        if(typeof toolMessage === 'function'){
          toolMessage([[key,value],'setlocal'],PLUGINAPP);
        }
      } catch(e) {
        // toolMessage 未定义或调用失败时静默处理
        console.warn('toolMessage not available:', e);
      };
    } else {
      window.localStorage.setItem(key,value);
    };
  }
};

let USER_VISITOR = null;
if(!ISLOCAL){
  fetch('https://ipapi.co/json/')
  .then(async (response) => response.json())
  .then(data => {
      USER_VISITOR = data;
      const country = data.country_name;
      const countryCode = data.country_code;
      if(countryCode !== "CN"){
        let links = document.querySelectorAll('link');
        let scripts = document.querySelectorAll('script');
  
        links.forEach(item => {
          let oldHref = item.getAttribute('href');
          if(oldHref && !oldHref.includes('ynyuset.cn')){
            // 只替换域名中的 .cn，但排除 ynyuset.cn
            item.setAttribute('href',oldHref.replace(/(https?:\/\/[^\/]+)\.cn(\/|$)/g, '$1$2'));
          }
        });
        scripts.forEach(item => {
          let oldSrc = item.getAttribute('src');
          if(oldSrc && !oldSrc.includes('ynyuset.cn')){
            // 只替换域名中的 .cn，但排除 ynyuset.cn
            item.setAttribute('src',oldSrc.replace(/(https?:\/\/[^\/]+)\.cn(\/|$)/g, '$1$2'));
          };
        });

        console.log(`访问者国家/地区：${country} (${countryCode}),已切换对应资源链接`)
      }
  })
  .catch(e => {
    console.log(e)
  });
}

//========== 初始化插件界面偏好 ==========
toolMessage(['userTheme','getlocal'],PLUGINAPP);
toolMessage(['userLanguage','getlocal'],PLUGINAPP);
toolMessage(['userResize','getlocal'],PLUGINAPP);
toolMessage(['tabPick','getlocal'],PLUGINAPP);
toolMessage(['userSkillStar','getlocal'],PLUGINAPP);
toolMessage(['toolsSetFig_user','getlocal'],PLUGINAPP);
toolMessage(['toolsSetFig_users','getlocal'],PLUGINAPP);
 
window.addEventListener('message',(message)=>{
  let isPluginMessge = message.data && message.data.type && message.data.type == 'figma-ex-page-info';
  if(!isPluginMessge){
    let messages = message.data.pluginMessage.pluginMessage || ['',''];
    let info = messages[0];
    let type = messages[1];
    if(typeof(info) == 'string' && (info.split('[').length > 1 || info.split('{').length > 1)){
      info = JSON.parse(info);
    }
    switch (type){
      case 'userTheme': info == 'light' ? setTheme(true,false) : setTheme(false,false);break
      case 'userLanguage': info == 'Zh' ? setLanguage(true) : setLanguage(false);break
      case 'userResize': reRootSize(info);break
    };
    if(ISWORK_TIME && info){
      switch (type){
        case 'tabPick': viewPage(info);break
        case 'userSkillStar': userSkillStar = info || []; moveSkillStar(userSkillStar);break
        case 'toolsSetFig_user': 
          if(typeof AuthManager !== 'undefined') {
            AuthManager.setCurrentUser(info);
            AuthManager.updateUI();
          };
        break
        case 'toolsSetFig_users': 
          if(typeof AuthManager !== 'undefined') {
            AuthManager.setUsersList(info);
          };
        break
      };
    }
  };
});

/**
 * @param {Array} data - [info,typeName/skillName]
 * @param {string} app - PLUGINAPP(需定义) | 'fig' | 'mg'
 */
function toolMessage(data,app){
  switch (app){
    case 'fig': parent.postMessage({pluginMessage:data},"*"); break
    case 'mg' : parent.postMessage(data,"*");break
  }
}

