if (ISPLUGIN){
  toolMessage(['userTheme','getlocal'],PLUGINAPP);
  toolMessage(['userLanguage','getlocal'],PLUGINAPP);
  toolMessage(['tabPick','getlocal'],PLUGINAPP);
}

window.addEventListener('message',(message)=>{
  let isPluginMessge = message.data && message.data.type && message.data.type == 'figma-ex-page-info';
  if(!isPluginMessge){
    let messages = message.data.pluginMessage.pluginMessage || ['',''];
    let info = messages[0];
    let type = messages[1];
    switch (type){
      case 'userTheme': info == 'light' ? setTheme(true,false) : setTheme(false,false);break
      case 'userLanguage': info == 'Zh' ? setLanguage(true) : setLanguage(false);break
      case 'tabPick': viewPage(info);break
    }
  }
});

/**
 * @param {Array} data - [info,typeName/skillName]
 * @param {string} app - PLUGINAPP | 'mg'
 */
function toolMessage(data,app){
  switch (app){
    case 'fig': parent.postMessage({pluginMessage:data},"*"); break
    case 'mg' : parent.postMessage(data,"*");break
  }
}
