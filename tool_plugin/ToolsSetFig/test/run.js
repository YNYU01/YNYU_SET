PULGIN_LOCAL = true;
let ISWORK_TIME = true;
let userSkillStar = [];

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

