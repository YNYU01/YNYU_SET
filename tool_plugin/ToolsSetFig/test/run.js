let ISWORK_TIME = true;
let userSkillStar = [];

//========== 初始化插件界面偏好(可滞后) ==========
// 非插件环境：直接从storageMix同步获取（延迟到window.load确保函数已定义）
if (!IS_PLUGIN_ENV) {
  // 使用window.load事件确保所有脚本已加载
  window.addEventListener('load', () => {
    // 初始化tabPick
    const savedTabPick = storageMix.get('tabPick');
    if (savedTabPick && typeof viewPage === 'function') {
      viewPage(savedTabPick);
    }
    
    // 初始化userSkillStar
    const savedUserSkillStar = storageMix.get('userSkillStar');
    if (savedUserSkillStar) {
      try {
        userSkillStar = JSON.parse(savedUserSkillStar);
        if (Array.isArray(userSkillStar) && userSkillStar.length > 0 && typeof moveSkillStar === 'function') {
          moveSkillStar(userSkillStar);
        }
      } catch(e) {
        console.warn('Failed to parse userSkillStar:', e);
        userSkillStar = [];
      }
    }
  });
} else {
  // 插件环境：异步获取
  toolMessage(['tabPick','getlocal'],PLUGINAPP);
  toolMessage(['userSkillStar','getlocal'],PLUGINAPP);
}
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
      case 'userTheme': info == 'light' ? setTheme(true) : setTheme(false);break
      case 'userLanguage': info == 'Zh' ? setLanguage(true) : setLanguage(false);break
      case 'userResize': reRootSize(info);break
      case 'userInfo':
          // 检查是否为未登录或匿名用户
          let isLoggedIn = false;
          if (info && info.name) {
            const userName = info.name.trim();
            isLoggedIn = userName !== '' && userName !== 'Anonymous' && userName !== '匿名';
          }
          const loginBtn = document.querySelector('[data-user-login-btn]');
          if (loginBtn) loginBtn.style.display = isLoggedIn ? 'flex' : 'none';
        break
    };
    if(ISWORK_TIME){
      switch (type){
        case 'tabPick': viewPage(info);break
        case 'userSkillStar':userSkillStar = info || []; moveSkillStar(userSkillStar);break
        
        case 'toolsSetFig_user': 
          if(typeof AuthManager !== 'undefined') {
            AuthManager.setCurrentUser(info);
            AuthManager.updateUI();
            // 同步到 State 中的 userInfo
            if(typeof State !== 'undefined') {
              State.set('userInfo', info);
            }
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

