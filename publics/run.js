const COPYRIGHT_ZH = `\u002d\u0020\u300e\u4e91\u5373\u300f\u7cfb\u5217\u5f00\u6e90\u8ba1\u5212\u000a\u002d\u0020\u00a9\u0020\u0032\u0030\u0032\u0034\u002d\u0032\u0030\u0032\u0035\u0020\u4e91\u96e8\u0020\u006c\u0076\u0079\u006e\u0079\u0075\u0040\u0031\u0036\u0033\u002e\u0063\u006f\u006d\uff1b\u000a\u002d\u0020\u672c\u9879\u76ee\u9075\u5faa\u0047\u0050\u004c\u0033\u002e\u0030\u534f\u8bae\uff1b\u000a\u002d\u0020\u672c\u9879\u76ee\u7981\u6b62\u7528\u4e8e\u8fdd\u6cd5\u884c\u4e3a\uff0c\u5982\u6709\uff0c\u4e0e\u4f5c\u8005\u65e0\u5173\uff1b\u000a\u002d\u0020\u5546\u7528\u53ca\u4e8c\u6b21\u7f16\u8f91\u9700\u4fdd\u7559\u672c\u9879\u76ee\u7684\u7248\u6743\u58f0\u660e\uff0c\u4e14\u5fc5\u987b\u5f00\u6e90\uff1b\u000a\u002d\u0020\u4ee3\u7801\u4e2d\u5f15\u7528\u5176\u4ed6\u5e93\u7684\u90e8\u5206\u5e94\u9075\u5faa\u5bf9\u5e94\u8bb8\u53ef\uff1b\u000a\u002d\u0020\u4f7f\u7528\u5f53\u524d\u4ee3\u7801\u65f6\u7981\u6b62\u5220\u9664\u6216\u4fee\u6539\u672c\u58f0\u660e\uff1b\u000a
`;

const COPYRIGHT_EN = `- [YNYU_SET] OPEN DESIGN & SOURCE
- © 2024-2025 YNYU lvynyu2@gmail.com;
- Must comply with GNU GENERAL PUBLIC LICENSE Version 3;
- Prohibit the use of this project for illegal activities. If such behavior occurs, it is not related to this project;
- For commercial use or secondary editing, it is necessary to retain the copyright statement of this project and must continue to open source it;
- For external libraries referenced in the project, it is necessary to comply with the corresponding open source protocols;
- When using the code of this project, it is prohibited to delete this statement;
`;

const ROOT = document.documentElement;

let ISMOBILE = false;
let MOBILE_KEYS = /mobile | android | iphone | ipad | blackberry | windows phone/i

if(MOBILE_KEYS.test(navigator.userAgent.toLowerCase()) || window.innerWidth <= 750){
  ISMOBILE = true;
  ROOT.setAttribute('data-mobile','true');
} else {
  ROOT.setAttribute('data-mobile','false');
  ISMOBILE = false;
}

let ISLOCAL = false;
if (window.location.protocol === 'file:' || window.location.hostname === 'localhost'){
  ISLOCAL = true;
};

var storageMix = {
  get: (key)=>{
    return window.localStorage.getItem(key);
  },
  set: (key,value)=>{
    window.localStorage.setItem(key,value);
  }
};

if(!ISLOCAL){
  if(storageMix.get('userTheme') == 'light'){
    ROOT.setAttribute("data-theme","light");
  }else if(storageMix.get('userTheme') == 'dark'){
    ROOT.setAttribute("data-theme","dark");
  }else{
    ROOT.setAttribute("data-theme","light");
  };

  if(storageMix.get('userLanguage') == 'En'){
    ROOT.setAttribute("data-language","En");
  }else if(storageMix.get('userLanguage') == 'Zh'){
    ROOT.setAttribute("data-language","Zh");
  }else{
    ROOT.setAttribute("data-language","En");
    storageMix.set('userLanguage','En');
    console.log('userLanguage not set, set to En');
  };

  let QUERY_PARAMS = getQueryParams();
  if(QUERY_PARAMS){
    if(QUERY_PARAMS.lan && QUERY_PARAMS.lan.toLowerCase() == 'zh'){
      ROOT.setAttribute('data-language','Zh');
      storageMix.set('userLanguage','Zh');
    }else if(QUERY_PARAMS.lan && QUERY_PARAMS.lan.toLowerCase() == 'en'){
      ROOT.setAttribute('data-language','En');
      storageMix.set('userLanguage','En');
      console.log('QUERY_PARAMS: lan=en, set to En');
    }
  }
}

//console.log(getUnicode(COPYRIGHT_ZH))

let USER_VISITOR = null;
if(!ISLOCAL){
  fetch('https://ipapi.co/json/')
  .then(async (response) => response.json())
  .then(data => {
      USER_VISITOR = data;
      const country = data.country_name;
      const countryCode = data.country_code;
      if(countryCode !== "CN"){
        let links = document.querySelectorAll('link');
        let scripts = document.querySelectorAll('script');
  
        links.forEach(item => {
          let oldHref = item.getAttribute('href');
          if(oldHref && !oldHref.includes('ynyuset.cn')){
            // 只替换域名中的 .cn，但排除 ynyuset.cn
            item.setAttribute('href',oldHref.replace(/(https?:\/\/[^\/]+)\.cn(\/|$)/g, '$1$2'));
          }
        });
        scripts.forEach(item => {
          let oldSrc = item.getAttribute('src');
          if(oldSrc && !oldSrc.includes('ynyuset.cn')){
            // 只替换域名中的 .cn，但排除 ynyuset.cn
            item.setAttribute('src',oldSrc.replace(/(https?:\/\/[^\/]+)\.cn(\/|$)/g, '$1$2'));
          };
        });

        console.log(`访问者国家/地区：${country} (${countryCode}),已切换对应资源链接`)
      }
  })
  .catch(e => {
    console.log(e)
  });
}

//setTimeout(()=>{console.log(USER_VISITOR)},500)


// 读取访问链接中?后的内容并解析为对象
function getQueryParams() {
  let query = window.location.search.substring(1);
  let params = {};
  if(query) {
    query.split("&").forEach(function(part) {
      let item = part.split("=");
      let key = decodeURIComponent(item[0] || "");
      let value = decodeURIComponent(item[1] || "");
      if(key) {
        params[key] = value;
      }
    });
  }
  return params;
}


function getUnicode(text){
  return text.replace(/[^]/g,(char)=>{
    return "\\u" + ("0000" + char.charCodeAt(0).toString(16)).slice(-4)
  })
}