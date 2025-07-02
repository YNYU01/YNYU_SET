/*
PLUGIN_THEME = 'dark';
PLUGIN_LANGUAGE = 'Zh';
*/

toolMessage(['userTheme','getlocal'],'fig');
toolMessage(['userLanguage','getlocal'],'fig');

window.addEventListener('message',(message)=>{
  let isPluginMessge = message.data && message.data.type && message.data.type !== 'figma-ex-page-info';
  if(isPluginMessge){
    let info = message[0];
    let type = message[1];
    switch (type){
      case 'userTheme': PLUGIN_THEME = info ;break
      case 'userLanguage': PLUGIN_LANGUAGE = info ;break
    }
  }
})