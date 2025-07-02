
let PLUGIN_THEME;
let PLUGIN_LANGUAGE;
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
  }
});