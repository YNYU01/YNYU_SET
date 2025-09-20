
window.addEventListener('load',()=>{
  document.getElementById('noise').className = 'tex-noise';
  // 检查 API 支持
  if (!window.showDirectoryPicker) {
    alert('当前浏览器不支持文件系统访问 API，请使用 Chrome/Edge 86+');
    document.getElementById('auth-btn').disabled = true;
    document.getElementById('status').textContent = '不支持 File System Access API';
    return;
  }

  // 创建实例
  window.fontManager = new FontManager();
  window.fontManager.init();
  if(ISMOBILE || window.innerWidth <= 750){

  } else {

  }

});

window.addEventListener('resize',/*防抖*/debounce(()=>{

},500));

document.querySelectorAll('[data-fontname]').forEach(node => {
  node.style.fontFamily = node.getAttribute('data-fontname');
});
/*
getElementMix('data-addlocalfont-btn').addEventListener('click',async ()=>{
  try {
    const dirHandle = await window.showDirectoryPicker();
    console.log('选中的目录:', dirHandle.name);
  } catch (err) {
      console.error('用户取消或权限被拒:', err);
  }
});
*/

/**
     * 字体管理器 - 支持持久化权限 + 子目录分类
     */
class FontManager {
  constructor() {
    this.dirHandle = null;
    this.handleName = localStorage.getItem('handleName') || '';
    this.localkey = 'localfonts'
    this.fontMap = new Map(); // folderPath → fonts[]
    this.isInitialized = false;

    this.button = getElementMix('data-addlocalfont-btn');
    this.statusEl = document.getElementById('status');
    this.listEl = document.getElementById('font-list');

    this.button.addEventListener('click', () => this.requestPermission());
  }

  async init() {
    let localfonts = localStorage.getItem(this.localkey);
    if(localfonts){
      this.updateStatus(['(上次加载)','(Last fonts)']);
      this.fontMap = new Map(JSON.parse(localfonts));
      this.renderFontList();
    }else{
      this.updateStatus(['(暂无文件): ','(No fonts)']);
    }
  }


  // 请求用户授权目录
  async requestPermission() {
    try {
      const handle = await window.showDirectoryPicker();
      const perm = await handle.requestPermission({ mode: 'read' });
      if (perm !== 'granted') throw new Error('No permission');
      
      this.dirHandle = handle;
      localStorage.setItem('handleName',handle.name);
      await this.loadFonts();

    } catch (err) {
      console.error(err);
      this.updateTips(['无法获取文件',"Can't get any files"]);
    }
  }

  // 递归扫描目录并分类
  async loadFonts() {
    this.fontMap = new Map();

    try {
      await this.scanDirectory(this.dirHandle, '');
      this.renderFontList();
      this.updateTips([
        `✅ 扫描完成，共 ${this.getTotalFontCount()} 个字体`,
        `✅ Scan completed, ${this.getTotalFontCount()} fonts in total`
      ]);
    } catch (err) {
      console.error(err);
      this.updateTips([
        `⛔ 扫描失败`,
        `⛔ Scan failed`
      ]);
    }
  }

  async scanDirectory(handle, currentPath) {
    for await (const [name, entry] of handle.entries()) {
      const fullPath = currentPath ? `${currentPath}/${name}` : name;

      if (entry.kind === 'file') {
        if (/\.(ttf|otf|woff|woff2)$/i.test(name)) {
          const file = await entry.getFile();
          const fontObj = await this.readFontMetadata(file);
          //console.log(fontObj)
          const folder = currentPath || '';
          if (!this.fontMap.has(folder)) {
            this.fontMap.set(folder, []);
          }
          this.fontMap.get(folder).push(fontObj);
        }
      } else if (entry.kind === 'directory') {
        await this.scanDirectory(entry, fullPath);
      }

      //console.log(this.fontMap)
    }
  }

  
  // 读取单个字体的元数据（仅 familyName 和 postScriptName）
  async readFontMetadata(file) {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const font = opentype.parse(arrayBuffer);
      //console.log(font)
      return {
        filename: file.name,
        size: file.size,
        familyName: font.names.fontFamily.en || font.names.fontFamily.zh || 'Unknown',
        postScriptName: font.names.postScriptName.en || 'Unknown',
      };
    } catch (e) {
      console.warn(`解析失败: ${file.name}`, e);
      return null;
    }
  }



  // 渲染分类列表（支持点击折叠）
  renderFontList() {
    this.listEl.innerHTML = '';

    if (this.fontMap.size === 0) {
      const li = document.createElement('div');
      li.textContent = '未找到字体文件';
      this.listEl.appendChild(li);
      return;
    }

    for (const [folder, fonts] of this.fontMap) {
      const folderName = folder == '' ? this.handleName : folder;
      let input = document.createElement('input');
      input.type = 'checkbox';
      input.id = 'show_' + folderName;
      this.listEl.appendChild(input);
      let header = document.createElement('label');
      header.setAttribute('for','show_' + folderName)
      header.className = 'show-next';
      header.textContent = `${folderName} ×${fonts.length}`;
      this.listEl.appendChild(header);

      const container = document.createElement('div');
      container.setAttribute('data-fontlist-font','');

      fonts.forEach(font => {
        const li = document.createElement('div');
        li.className = 'filename';
        li.textContent = `${font.filename} (${(font.size / 1024).toFixed(1)} KB)`;
        container.appendChild(li);
      });

      this.listEl.appendChild(container);

      // 折叠/展开
      input.addEventListener('change', () => {
        showNext(input,header.nextElementSibling,'block',true)
      });
    }
    this.saveToCache();
    console.log(localStorage.getItem(this.localkey))
  }

  // 保存到 localStorage
  saveToCache() {
    localStorage.setItem(this.localkey, JSON.stringify(Array.from(this.fontMap)));
  }
  
  getTotalFontCount() {
    let count = 0;
    for (const fonts of this.fontMap.values()) {
      count += fonts.length;
    }
    return count;
  }

  // UI 控制
  updateTips(text) {
    if(text){
      tipsAll(text,2000);
    };
  }

  updateStatus(text) {
    this.statusEl.setAttribute('data-zh-text',text[0]);
    this.statusEl.setAttribute('data-en-text',text[1]);
    this.statusEl.textContent = ROOT.getAttribute('data-language') == 'Zh' ? text[0] : text[1];
  }

}


/*监听组件的自定义属性值，变化时触发函数，用于已经绑定事件用于自身的组件，如颜色选择器、滑块输入框组合、为空自动填充文案的输入框、导航tab、下拉选项等*/
let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if(mutation.type === 'attributes'){
      switch(mutation.attributeName){
        case 'data-color-hex':getUserColor(mutation.target); break;
        case 'data-number-value':getUserNumber(mutation.target); break;
        case 'data-text-value':getUserText(mutation.target); break;
        case 'data-select-value':getUserSelect(mutation.target); break;
      }
    }
  })
});
let userEvent_color = document.querySelectorAll('[data-color]');
userEvent_color.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-color-hex']};
  observer.observe(item,config);
});
let userEvent_number = document.querySelectorAll('[data-number]');
userEvent_number.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-number-value']};
  observer.observe(item,config);
});
let userEvent_text = document.querySelectorAll('[data-text]');
userEvent_text.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-text-value']};
  observer.observe(item,config);
});
let userEvent_select = document.querySelectorAll('[data-select]');
userEvent_select.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-select-value']};
  observer.observe(item,config);
});


function getUserColor(node){
  let color = {
    HEX:node.getAttribute('data-color-hex'),
    RGB:node.getAttribute('data-color-rgb'),
    HSL:node.getAttribute('data-color-hsl'),
    HSV:node.getAttribute('data-color-hsv'),
  }
  //console.log(color)
}

function getUserNumber(node){
  let number = node.getAttribute('data-number-value');
  if(node.getAttribute('data-egfont-size') !== null){
    ROOT.style.setProperty('--egfont-size',number + 'px');
    //console.log(number + 'px')
  }
  //console.log(number)
}

function getUserText(node){
  let text = node.getAttribute('data-text-value');
  if(node.getAttribute('data-egfont-text') !== null){
    let egfont = document.querySelectorAll('[data-egfont]');
    egfont.forEach(item => {
      item.textContent = text;
    })
  }
  //console.log(text)
}

function getUserSelect(node){
  let select = node.getAttribute('data-select-value');
  //console.log(text)
}


