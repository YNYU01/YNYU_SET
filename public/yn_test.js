const COPYRIGHT_ZH = `- 『云即』系列开源计划
- © 2024-2025 云雨 lvynyu@163.com；
- 本项目遵循GPL3.0协议；
- 本项目禁止用于违法行为，如有，与作者无关；
- 商用及二次编辑需保留本项目的版权声明，且必须开源；
- 代码中引用其他库的部分应遵循对应许可；
- 使用当前代码时禁止删除或修改本声明；
`;

const COPYRIGHT_EN = `- [YNYU_SET] OPEN DESIGN & SOURCE
- © 2024-2025 YNYU lvynyu2@gmail.com;
- Must comply with GNU GENERAL PUBLIC LICENSE Version 3;
- Prohibit the use of this project for illegal activities. If such behavior occurs, it is not related to this project;
- For commercial use or secondary editing, it is necessary to retain the copyright statement of this project and must continue to open source it;
- For external libraries referenced in the project, it is necessary to comply with the corresponding open source protocols;
- When using the code of this project, it is prohibited to delete this statement;
`;

let HREF_ALL = document.querySelectorAll('a');
let A_BACK = document.querySelectorAll('[data-back]');
let LINK_ALL = document.querySelectorAll('[data-link-to]');

let ISLOCAL = window.location.protocol === 'file:' || window.location.hostname === 'localhost';
let ISBACK = document.referrer && document.referrer !== window.location.href;

window.addEventListener('load',()=>{
  if(ISLOCAL){
    HREF_ALL.forEach(item => {
      let href = item.getAttribute('href');
      switch (href){
        case '/': item.setAttribute('href','index.html'); break;
        case 'home' : item.setAttribute('href','home.html'); break;
        case '../' : item.setAttribute('href','../index.html'); break;
      };
    }); 
  };

  LINK_ALL.forEach(item => {
    let link = item.getAttribute('data-link-to');
    if(link){
      if(ISLOCAL){
        if(item.getAttribute('data-back')){
          item.setAttribute('href',link  + '.html');
        } else {
          item.setAttribute('href',link  + '/index.html');
        }
      } else {
        item.setAttribute('href',link);
      };
    } 
  });
  
  A_BACK.forEach(item => {
    if(ISBACK || (document.referrer == '' && ISLOCAL)){
      //console.log(document.referrer)
      item.addEventListener('click',(event)=>{
        event.preventDefault();
        window.history.back();
      });
    } else {
      //console.log(666)
      item.target = '_blank';
    };
  });

});
