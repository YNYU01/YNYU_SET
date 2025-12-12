let ISWORK_TIME = true;
let userSkillStar = [];

//========== 初始化插件界面偏好(可滞后) ==========
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
    
    // 处理 getlocal 返回的消息格式: [data, key]
    // 这是 storageMix 的异步返回，需要更新 UI
    if (Array.isArray(messages) && messages.length === 2 && typeof messages[1] === 'string') {
      const [data, key] = messages;
      // storageMix 内部已经更新了缓存，这里只需要更新 UI
      if (key === 'userTheme' && data !== null && data !== undefined) {
        data == 'light' ? setTheme(true) : setTheme(false);
        console.log('userTheme:', data);
        return; // 处理完就返回，不继续处理
      } else if (key === 'userLanguage' && data !== null && data !== undefined) {
        data == 'Zh' ? setLanguage(true) : setLanguage(false);
        return; // 处理完就返回，不继续处理
      }
      // 其他 getlocal 返回的键，storageMix 已经处理了缓存，这里不需要额外处理
      // 但如果是业务相关的键（如 tabPick, userSkillStar 等），需要继续处理
      if (key === 'tabPick' || key === 'userSkillStar' || key === 'toolsSetFig_user' || key === 'toolsSetFig_users') {
        // 这些键需要业务处理，继续执行下面的 switch 逻辑
        // 但需要将 key 作为 type，data 作为 info
        type = key;
        info = data;
      } else {
        // 其他键已经由 storageMix 处理，不需要额外处理
        return;
      }
    }
    
    switch (type){
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

