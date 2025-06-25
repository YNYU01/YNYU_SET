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