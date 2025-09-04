
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

window.addEventListener('resize',()=>{
  /*防抖*/
  let MOVE_TIMEOUT;
  if(MOVE_TIMEOUT){
      clearTimeout(MOVE_TIMEOUT)
  };
  MOVE_TIMEOUT = setTimeout(()=>{
    if(window.innerWidth <= 750){

    } else {

    }
  },500);
});

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

class FontManager {
  constructor() {
    this.dirHandle = null;
    this.fonts = [];
    this.isInitialized = false;

    this.button = getElementMix('data-addlocalfont-btn');
    this.statusEl = document.getElementById('status');
    this.listEl = document.getElementById('font-list');

    // 绑定事件
    this.button.addEventListener('click', () => this.requestPermission());
  }

  // =============== 初始化入口 ===============
  async init() {
    this.updateStatus('检查权限...');
    this.updateButton('disabled', '正在检查...');

    try {
      // 尝试恢复已有权限
      this.dirHandle = await this.restoreDirectoryHandle();

      if (this.dirHandle) {
        console.log('✅ 已恢复目录权限，自动加载');
        this.updateButton('disabled', '权限已授予');
        await this.loadFonts(); // 自动加载
      } else {
        console.log('⚠️ 无权限或目录失效');
        this.updateButton('enabled');
        this.updateStatus('请授权访问字体目录');
      }
    } catch (err) {
      console.error('初始化失败:', err);
      this.updateButton('enabled', '重新授权');
      this.updateStatus('授权失败，请重试');
    } finally {
      this.isInitialized = true;
      // 可触发“准备就绪”事件
      this.onReady();
    }
  }

  // =============== 恢复权限 ===============
  async restoreDirectoryHandle() {
    try {
      // 方法1：尝试使用 storage.getDirectory()（Chrome 持久化支持）
      const root = await navigator.storage.getDirectory();
      const savedName = localStorage.getItem('savedDirectoryName');
      console.log(root)
      if (!savedName) return null;

      // 遍历根目录，找匹配的目录
      for await (const [name, handle] of root.entries()) {
        if (handle.kind === 'directory' && name === savedName) {
          const perm = await handle.queryPermission({ mode: 'read' });
          if (perm === 'granted') {
            return handle;
          }
        }
      }
    } catch (e) {
      console.warn('恢复权限失败:', e);
    }
    return null;
  }

  // =============== 请求权限 ===============
  async requestPermission() {
    if (!this.buttonEnabled()) return;

    this.updateButton('disabled', '请选择目录...');

    try {
      const handle = await window.showDirectoryPicker();
      const perm = await handle.requestPermission({ mode: 'read' });
      if (perm !== 'granted') {
        throw new Error('权限被拒绝');
      }

      // 保存目录名用于后续恢复
      localStorage.setItem('savedDirectoryName', handle.name);
      this.dirHandle = handle;

      this.updateButton('disabled', '权限已授予');
      await this.loadFonts(); // 授权后立即加载

    } catch (err) {
      console.error('授权失败:', err);
      this.updateButton('enabled', '重新授权');
      this.updateStatus('授权失败，请重试');
    }
  }

  // =============== 加载字体（支持子文件夹分类） ===============
  async loadFonts() {
    this.updateStatus('正在扫描字体文件...');

    try {
      const fontMap = new Map(); // 使用 Map 更灵活：路径 → 字体数组

      // 递归遍历目录
      await this.scanDirectory(this.dirHandle, '', fontMap);

      this.fontMap = fontMap; // 保存分类结果
      this.renderFontList();
      this.updateStatus(`✅ 扫描完成，共 ${this.getTotalFontCount()} 个字体`);

    } catch (err) {
      console.error('扫描失败:', err);
      this.updateStatus('目录读取失败，请重新授权');
      this.clearSavedDirectory();
      this.updateButton('enabled', '重新授权');
      this.dirHandle = null;
    }
  }

  // 递归扫描目录
  async scanDirectory(handle, currentPath, fontMap) {
    for await (const [name, entry] of handle.entries()) {
      const fullPath = currentPath ? `${currentPath}/${name}` : name;

      if (entry.kind === 'file') {
        if (/\.(ttf|otf|woff|woff2)$/i.test(name)) {
          const file = await entry.getFile();
          const fontObj = await this.parseFont(file);

          // 按父路径分类（只取文件夹名）
          const folder = currentPath || ''; // 根目录用空字符串

          if (!fontMap.has(folder)) {
            fontMap.set(folder, []);
          }
          fontMap.get(folder).push(fontObj);
        }
      }

      else if (entry.kind === 'directory') {
        // 递归进入子目录
        await this.scanDirectory(entry, fullPath, fontMap);
      }
    }
  }

  // 获取总字体数量
  getTotalFontCount() {
    let count = 0;
    for (const fonts of this.fontMap.values()) {
      count += fonts.length;
    }
    return count;
  }

  // =============== 字体解析（示例） ===============
  async parseFont(file) {
    // 这里可以集成 opentype.js 等库
    let fontinfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      // 可添加更多元数据
    };

    console.log(fontinfo)
    return fontinfo
  }

  // =============== 渲染列表 ===============
  renderFontList() {
    this.listEl.innerHTML = '';
    this.fonts.forEach(font => {
      const li = document.createElement('li');
      li.textContent = `${font.name} (${(font.size / 1024).toFixed(1)} KB)`;
      this.listEl.appendChild(li);
    });
  }

  // =============== UI 状态管理 ===============
  updateButton(state, text) {
    if (state === 'disabled') {
      this.button.disabled = true;
    } else {
      this.button.disabled = false;
    }
    if(text){
      tipsAll(text,2000);
    };
  }

  buttonEnabled() {
    return !this.button.disabled;
  }

  updateStatus(text) {
    this.statusEl.textContent = text;
  }

  // =============== 工具方法 ===============
  clearSavedDirectory() {
    localStorage.removeItem('savedDirectoryName');
  }

  // =============== 生命周期钩子 ===============
  onReady() {
    console.log('FontManager 初始化完成');
    // 可用于通知其他模块
  }
}

/**
     * 字体管理器 - 支持持久化权限 + 子目录分类
     */
class FontManager1 {
  constructor() {
    this.dirHandle = null;
    this.fontMap = new Map(); // folderPath → fonts[]
    this.isInitialized = false;

    this.button = getElementMix('data-addlocalfont-btn');
    this.statusEl = document.getElementById('status');
    this.listEl = document.getElementById('font-list');

    this.button.addEventListener('click', () => this.requestPermission());
  }

  async init() {
    this.updateStatus('检查持久化权限...');
    this.updateButton('disabled', '检查中...');

    // 尝试启用持久化存储（需用户交互，但 query 不会弹窗）
    await this.ensurePersistentStorage();

    try {
      this.dirHandle = await this.restoreDirectoryHandle();
      if (this.dirHandle) {
        console.log('✅ 恢复权限成功');
        this.updateButton('disabled', '权限已授予');
        await this.loadFonts();
      } else {
        console.log('❌ 无可用权限');
        this.updateButton('enabled', '选择字体目录');
        this.updateStatus('请授权访问字体目录');
      }
    } catch (err) {
      console.error('初始化失败:', err);
      this.updateButton('enabled', '重试');
      this.updateStatus('初始化失败，请重试');
    } finally {
      this.isInitialized = true;
    }
  }

  // 确保请求持久化存储（只在用户交互中有效）
  async ensurePersistentStorage() {
    if (!navigator.storage || !navigator.storage.persist) return false;

    const persisted = await navigator.storage.persisted();
    if (persisted) return true;

    // 尝试请求持久化（部分浏览器会弹窗提示）
    const granted = await navigator.storage.persist?.() || false;
    console.log('持久化存储:', granted ? '已启用' : '被拒绝');
    return granted;
  }

  // 恢复目录句柄（利用 storage.getDirectory 持久化机制）
  async restoreDirectoryHandle() {
    const savedName = localStorage.getItem('savedDirectoryName');
    if (!savedName) return null;

    try {
      const root = await navigator.storage.getDirectory();
      for await (const [name, handle] of root.entries()) {
        if (handle.kind === 'directory' && name === savedName) {
          const perm = await handle.queryPermission({ mode: 'read' });
          if (perm === 'granted') {
            return handle;
          }
        }
      }
    } catch (e) {
      console.warn('恢复权限失败:', e);
    }
    return null;
  }

  // 请求用户授权目录
  async requestPermission() {
    if (!this.buttonEnabled()) return;

    this.updateButton('disabled', '请选择目录...');

    try {
      // 👇 关键：在用户点击中调用，确保持久化生效
      await this.ensurePersistentStorage();

      const handle = await window.showDirectoryPicker();
      const perm = await handle.requestPermission({ mode: 'read' });
      if (perm !== 'granted') throw new Error('权限被拒绝');

      // 保存目录名用于恢复
      localStorage.setItem('savedDirectoryName', handle.name);
      this.dirHandle = handle;

      this.updateButton('disabled', '权限已授予');
      await this.loadFonts();

    } catch (err) {
      if (err.name !== 'AbortError') { // 用户取消
        console.error('授权失败:', err);
        this.updateButton('enabled', '重新授权');
        this.updateStatus('授权失败，请重试');
      } else {
        this.updateButton('enabled', '选择字体目录');
        this.updateStatus('用户取消授权');
      }
    }
  }

  // 递归扫描目录并分类
  async loadFonts() {
    this.updateStatus('正在扫描字体文件...');
    this.fontMap = new Map();

    try {
      await this.scanDirectory(this.dirHandle, '');
      this.renderFontList();
      this.updateStatus(`✅ 扫描完成，共 ${this.getTotalFontCount()} 个字体`);
    } catch (err) {
      console.error('扫描失败:', err);
      this.handleScanError();
    }
  }

  async scanDirectory(handle, currentPath) {
    for await (const [name, entry] of handle.entries()) {
      const fullPath = currentPath ? `${currentPath}/${name}` : name;

      if (entry.kind === 'file') {
        if (/\.(ttf|otf|woff|woff2)$/i.test(name)) {
          const file = await entry.getFile();
          const fontObj = await this.parseFont(file);

          const folder = currentPath || '';
          if (!this.fontMap.has(folder)) {
            this.fontMap.set(folder, []);
          }
          this.fontMap.get(folder).push(fontObj);
        }
      }

      else if (entry.kind === 'directory') {
        await this.scanDirectory(entry, fullPath);
      }
    }
  }

  // 解析字体文件（示例）
  async parseFont(file) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };
  }

  // 渲染分类列表（支持点击折叠）
  renderFontList() {
    this.listEl.innerHTML = '';

    if (this.fontMap.size === 0) {
      const li = document.createElement('li');
      li.textContent = '未找到字体文件';
      this.listEl.appendChild(li);
      return;
    }

    for (const [folder, fonts] of this.fontMap) {
      const folderName = folder || '根目录';
      const header = document.createElement('li');
      header.role = 'heading';
      header.textContent = `${folderName} (${fonts.length} 个)`;
      this.listEl.appendChild(header);

      const container = document.createElement('ul');
      container.dataset.expanded = 'true';

      fonts.forEach(font => {
        const li = document.createElement('li');
        li.className = 'file';
        li.textContent = `${font.name} (${(font.size / 1024).toFixed(1)} KB)`;
        container.appendChild(li);
      });

      this.listEl.appendChild(container);

      // 折叠/展开
      header.addEventListener('click', () => {
        const isExpanded = container.dataset.expanded === 'true';
        container.dataset.expanded = String(!isExpanded);
        container.style.display = isExpanded ? 'none' : 'block';
      });
    }

    // 默认展开
    this.listEl.querySelectorAll('ul').forEach(ul => (ul.style.display = 'block'));
  }

  getTotalFontCount() {
    let count = 0;
    for (const fonts of this.fontMap.values()) {
      count += fonts.length;
    }
    return count;
  }

  // 扫描出错处理
  handleScanError() {
    this.updateStatus('目录读取失败（可能已移动或权限丢失）');
    this.clearSavedDirectory();
    this.dirHandle = null;
    this.updateButton('enabled', '重新选择');
  }

  // UI 控制
  updateButton(state, text) {
    this.button.disabled = state === 'disabled';
    if(text){
      tipsAll(text,2000);
    };
  }

  buttonEnabled() {
    return !this.button.disabled;
  }

  updateStatus(text) {
    this.statusEl.textContent = text;
  }

  clearSavedDirectory() {
    localStorage.removeItem('savedDirectoryName');
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


