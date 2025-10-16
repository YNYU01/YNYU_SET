PULGIN_LOCAL = true;
let userSkillStar = [];
if (ISPLUGIN){
  ROOT.setAttribute('data-mobile','false');
  ISMOBILE = false;
  toolMessage(['userTheme','getlocal'],PLUGINAPP);
  toolMessage(['userLanguage','getlocal'],PLUGINAPP);
  toolMessage(['userResize','getlocal'],PLUGINAPP);
  toolMessage(['tabPick','getlocal'],PLUGINAPP);
  toolMessage(['userSkillStar','getlocal'],PLUGINAPP);
}

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
      case 'tabPick': viewPage(info);break
      case 'userSkillStar': userSkillStar = info || []; moveSkillStar(userSkillStar);break
      case 'selectInfo': reSelectInfo(info);break
      case 'selectInfoMain': addTableText(tableObjToText(info));break
      case 'selectComp': reSelectComp(info);break
      case 'selectDatas': reSelectDatas(info);break
      case 'exportImgInfo': addTag('export-img',info);break
      case 'editorView': addEditorView(info);break
    };
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



