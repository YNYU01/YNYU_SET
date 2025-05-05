//全局变量
const root = document.documentElement;
const dataText = document.getElementById('tableData-text');
const dataTextTips = document.getElementById('table-text-tips');

let tableData;//行列数据
let userTableData;//填充表格或数据流用的数据

class close extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="wh100 btn-text" style="background:rgba(0,0,0,0.5); padding:20%; box-sizing: border-box; flex:0 0 auto; border-radius: 50%;">
        <svg width="100%" height="100%" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.52515" y="0.318024" width="8" height="1" transform="rotate(45 1.52515 0.318024)" fill="var(--mainColor)"/>
          <rect x="7.18188" y="1.02512" width="8" height="1" transform="rotate(135 7.18188 1.02512)" fill="var(--mainColor)"/>
        </svg>
      </div>
    `;
  }
};
customElements.define('btn-close', close);
//封装postmessage
function message(data){
  /*figma*/
  parent.postMessage({pluginMessage:data},"*")
  /*mastergo*/
  //parent.postMessage(data,"*")
}

window.onmessage = (messages) => {

  if(messages.data && messages.data.pluginMessage && messages.data.pluginMessage.pluginMessage){
    //console.log(message.data)
    //console.log(message.data.pluginMessage.pluginMessage)
    /*figma*/
    let pluginDatas = messages.data.pluginMessage.pluginMessage;
    /*mastergo*/
    //let pluginDatas = message.data;

    let info = pluginDatas[0];
    let type = pluginDatas[1];

    if(type == "tableForDoc"){
      //console.log(info)
      let docDataText = ''
      info.forEach((item,index) => {
        item.forEach((items,indexs) => {
          indexs !== (item.length - 1) ? docDataText += items + '\t' : index !== (info.length - 1) ? docDataText += items + '\n' : docDataText += items;
        })
      });
      //console.log(docDataText)
      dataText.value = docDataText;
      dataText.focus()
      userTableData = docDataText;
    }
    if(type == "sendDoc"){
      console.log(info)
    }   
  }
}

dataText.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
      event.preventDefault(); // 阻止默认Tab行为
      const start = this.selectionStart;
      const end = this.selectionEnd;
      const selectedText = this.value.substring(start, end);
      const before = this.value.substring(0, start);
      const after = this.value.substring(end, this.value.length);
      this.value = before + '\t' + selectedText + after; // 用4个空格替换Tab
      this.selectionStart = this.selectionEnd = start + 4; // 设置光标位置
    }
  });