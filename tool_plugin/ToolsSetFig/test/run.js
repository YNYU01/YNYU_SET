
let PLUGIN_THEME = document.documentElement.getAttribute('data-theme');
let PLUGIN_LANGUAGE = document.documentElement.getAttribute('data-language');

toolMessage(['userTheme','getlocal'],'fig');
toolMessage(['userLanguage','getlocal'],'fig');

window.addEventListener('message',(message)=>{
  let isPluginMessge = message.data && message.data.type && message.data.type == 'figma-ex-page-info';
  if(!isPluginMessge){
    let info = message.data.pluginMessage.pluginMessage[0];
    let type = message.data.pluginMessage.pluginMessage[1];
    switch (type){
      case 'userTheme': PLUGIN_THEME = info;break
      case 'userLanguage': PLUGIN_LANGUAGE = info;break
    }
    console.log(PLUGIN_THEME,PLUGIN_LANGUAGE)
    if(PLUGIN_THEME == 'light'){
      ROOT.setAttribute("data-theme","light");
      setTheme(true,false);
    }
    if(PLUGIN_THEME == 'dark'){
      ROOT.setAttribute("data-theme","dark");
      setTheme(false,false);
    }
    if(PLUGIN_LANGUAGE == 'Zh'){
      ROOT.setAttribute("data-language","Zh");
      setLanguage(false);
    }
    if(PLUGIN_LANGUAGE == 'En'){
      ROOT.setAttribute("data-language","En");
      setLanguage(true);
    }
  }
});

/**
 * @param {Array} data - [info,typeName/skillName]
 * @param {string} app - 'fig' | 'mg'
 */
function toolMessage(data,app){
  switch (app){
    case 'fig': parent.postMessage({pluginMessage:data},"*"); break
    case 'mg' : parent.postMessage(data,"*");break
  }
}
