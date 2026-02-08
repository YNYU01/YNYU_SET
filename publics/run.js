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

let PLUGINAPP = ROOT.getAttribute('data-plugin');

let IS_PLUGIN_ENV = false;
//插件也要兼容非插件的其他生产环境
if (PLUGINAPP && !ISLOCAL) {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  const isStandardWebDomain = hostname && 
    (hostname.includes('.') || hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname));
  
  // 如果是标准 Web 域名，则不是插件环境；否则是插件环境
  if ((protocol === 'http:' || protocol === 'https:') && isStandardWebDomain) {
    IS_PLUGIN_ENV = false; // 标准 Web 环境，使用 localStorage
  } else {
    IS_PLUGIN_ENV = true; // 插件环境（可能是 Figma、MasterGo 等），使用插件存储 API
  }
}

/**
 * 使localStorage兼容浏览器/插件环境
 */
var storageMix = (function() {
  // 插件环境下的内存缓存
  const pluginCache = new Map();
  // 待处理的异步请求回调
  const pendingRequests = new Map();
  // 是否已初始化消息监听
  let messageListenerInitialized = false;
  
  // 初始化插件消息监听（仅插件环境）
  function initPluginMessageListener() {
    if (messageListenerInitialized || !IS_PLUGIN_ENV) return;
    
    window.addEventListener('message', (message) => {
      // 检查是否是插件返回的存储数据
      // 消息格式可能是: {pluginMessage: [data, key]} 或 {pluginMessage: {pluginMessage: [data, key]}}
      if (message.data && message.data.pluginMessage) {
        let pluginMsg = message.data.pluginMessage;
        
        // 处理双重包装的情况
        if (pluginMsg && pluginMsg.pluginMessage) {
          pluginMsg = pluginMsg.pluginMessage;
        }
        
        // 检查是否是 getlocal 的返回格式: [data, key]
        // 其中 data 是存储的值，key 是存储的键名
        if (Array.isArray(pluginMsg) && pluginMsg.length === 2 && typeof pluginMsg[1] === 'string') {
          const [data, key] = pluginMsg;
          // 更新缓存
          pluginCache.set(key, data);
          // 触发等待的回调
          if (pendingRequests.has(key)) {
            const callbacks = pendingRequests.get(key);
            callbacks.forEach(cb => {
              if (typeof cb === 'function') {
                cb(data);
              }
            });
            pendingRequests.delete(key);
          }
        }
      }
    });
    
    messageListenerInitialized = true;
  }
  
  return {
    get: (key) => {
      // 非插件环境（文件协议、本地服务器、HTTP/HTTPS）：直接使用 localStorage
      if (!IS_PLUGIN_ENV) {
        try {
          return window.localStorage.getItem(key);
        } catch(e) {
          console.warn('localStorage.getItem failed:', e);
          return null;
        }
      }
      
      // 插件环境：先检查缓存，如果没有则请求并返回 null（异步）
      initPluginMessageListener();
      
      // 如果缓存中有，直接返回
      if (pluginCache.has(key)) {
        return pluginCache.get(key);
      }
      
      // 缓存中没有，发送请求（异步，不等待结果）
      if (typeof toolMessage === 'function') {
        toolMessage([key, 'getlocal'], PLUGINAPP);
      }
      
      // 返回 null，实际值会通过 message 事件异步更新到缓存
      return null;
    },
    
    set: (key, value) => {
      // 非插件环境（文件协议、本地服务器、HTTP/HTTPS）：直接使用 localStorage
      if (!IS_PLUGIN_ENV) {
        try {
          window.localStorage.setItem(key, value);
          return true;
        } catch(e) {
          console.warn('localStorage.setItem failed:', e);
          return false;
        }
      }
      
      // 插件环境：更新缓存并发送请求
      initPluginMessageListener();
      
      // 立即更新缓存（乐观更新）
      pluginCache.set(key, value);
      
      // 发送异步请求
      try {
        if (typeof toolMessage === 'function') {
          toolMessage([[key, value], 'setlocal'], PLUGINAPP);
        }
        return true;
      } catch(e) {
        console.warn('toolMessage not available:', e);
        return false;
      }
    },
    
    // 异步获取（仅插件环境，用于需要等待结果的场景）
    getAsync: (key, callback) => {
      if (!IS_PLUGIN_ENV) {
        // 非插件环境，同步返回
        const value = window.localStorage.getItem(key);
        if (callback) callback(value);
        return Promise.resolve(value);
      }
      
      initPluginMessageListener();
      
      // 如果缓存中有，立即返回
      if (pluginCache.has(key)) {
        const value = pluginCache.get(key);
        if (callback) callback(value);
        return Promise.resolve(value);
      }
      
      // 缓存中没有，注册回调并发送请求
      if (!pendingRequests.has(key)) {
        pendingRequests.set(key, []);
      }
      pendingRequests.get(key).push(callback);
      
      // 发送请求
      if (typeof toolMessage === 'function') {
        toolMessage([key, 'getlocal'], PLUGINAPP);
      }
      
      // 返回 Promise
      return new Promise((resolve) => {
        if (!pendingRequests.has(key)) {
          pendingRequests.set(key, []);
        }
        pendingRequests.get(key).push((value) => {
          resolve(value);
        });
      });
    },
    
    // 清除缓存（用于调试或重置）
    clearCache: () => {
      pluginCache.clear();
      pendingRequests.clear();
    }
  };
})();

let QUERY_PARAMS = getQueryParams();

//非插件环境初始化,实际由yn_comp.js/插件的main.js触发setTheme和setLanguage
if(!PLUGINAPP){
  if(storageMix.get('userTheme') == 'light'){
    ROOT.setAttribute("data-theme","light");
  }else if(storageMix.get('userTheme') == 'dark'){
    ROOT.setAttribute("data-theme","dark");
  }else{
    ROOT.setAttribute("data-theme","light");
    storageMix.set('userTheme','light');
  };

  if(storageMix.get('userLanguage') == 'En'){
    ROOT.setAttribute("data-language","En");
  }else if(storageMix.get('userLanguage') == 'Zh'){
    ROOT.setAttribute("data-language","Zh");
  }else{
    ROOT.setAttribute("data-language","En");
    storageMix.set('userLanguage','En');
    //console.log('userLanguage not set, set to En');
  };

  //链路参数优先级高于存储值
  if(QUERY_PARAMS){
    if(QUERY_PARAMS.lan && QUERY_PARAMS.lan.toLowerCase() == 'zh'){
      ROOT.setAttribute('data-language','Zh');
      storageMix.set('userLanguage','Zh');
    }else if(QUERY_PARAMS.lan && QUERY_PARAMS.lan.toLowerCase() == 'en'){
      ROOT.setAttribute('data-language','En');
      storageMix.set('userLanguage','En');
    }
    if(QUERY_PARAMS.theme && QUERY_PARAMS.theme.toLowerCase() == 'light'){
      ROOT.setAttribute('data-theme','light');
      storageMix.set('userTheme','light');
    }else if(QUERY_PARAMS.theme && QUERY_PARAMS.theme.toLowerCase() == 'dark'){
      ROOT.setAttribute('data-theme','dark');
      storageMix.set('userTheme','dark');
    }
  }
}




//console.log(getUnicode(COPYRIGHT_ZH))

let USER_VISITOR = null;

// 获取用户位置信息的函数
function fetchUserLocation() {
  // 本地/插件等 origin 为 null 或 file: 时，ipapi.co 无 CORS 头会报错，直接跳过不发起请求
  try {
    const origin = typeof location !== 'undefined' ? location.origin : '';
    if (origin === 'null' || origin === '' || (typeof location !== 'undefined' && location.protocol === 'file:')) {
      return;
    }
  } catch (_) { return; }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

  fetch('https://ipapi.co/json/', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    signal: controller.signal
  })
    .then(async (response) => {
      clearTimeout(timeoutId); // 清除超时定时器
      // 检查响应状态
      if (!response.ok) {
        // 429 错误：请求过多
        if (response.status === 429) {
          console.warn('IP定位服务请求频率过高，已跳过。如需使用，请稍后再试。');
          return null;
        }
        // 其他错误
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data) return; // 429 错误时 data 为 null
      
      USER_VISITOR = data;
      const country = data.country_name;
      const countryCode = data.country_code;
      
      if (countryCode && countryCode !== "CN") {
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
      clearTimeout(timeoutId); // 确保在错误时也清除超时定时器
      // 区分不同类型的错误（注：CORS 被拦时浏览器往往只抛出 "Failed to fetch"，e.message 里没有 "CORS"）
      if (e.name === 'AbortError') {
        console.warn('IP定位请求超时，已跳过。');
      } else if (e.message && e.message.includes('CORS')) {
        console.warn('IP定位请求被CORS策略阻止（可能是本地文件环境），已跳过。');
      } else if (e.message && e.message.includes('Failed to fetch')) {
        console.warn('IP定位请求失败（网络错误、服务不可用或CORS限制），已跳过。');
      } else {
        console.warn('IP定位请求出错：', e.message || e);
      }
    });
}

// 执行获取位置信息
if (!ISLOCAL) {
  fetchUserLocation();
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