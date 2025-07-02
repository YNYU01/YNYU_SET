toolMessage(['userTheme','getlocal'],'fig');
toolMessage(['userLanguage','getlocal'],'fig');

window.addEventListener('message',(message)=>{
  if(message.data && message.data.type && message.data.type !== 'figma-ex-page-info'){
    console.log(message)
  }
})