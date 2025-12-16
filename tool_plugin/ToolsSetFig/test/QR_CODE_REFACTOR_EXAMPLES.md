# 二维码功能重构 - 代码对比示例

## 1. 裁切框控制器对比

### 重构前：QRCodeGridController (344行)
```javascript
class QRCodeGridController {
  constructor(gridSelector, resizeSelector, viewBoxSelector) {
    this.grid = document.querySelector(gridSelector);
    this.resize = document.querySelector(resizeSelector);
    this.viewBox = document.querySelector(viewBoxSelector);
    this.page = this.grid.closest('[data-page-main]'); // 业务特定
    // ... 硬编码为1:1比例
  }
  
  adjustGridToFitParent() {
    if(this.isDragging || this.isResizing || 
       this.page.getAttribute('data-page-main') == 'library') return; // 业务逻辑
    // ... 只能处理正方形
  }
  
  handleResizeStart(e) {
    // ... 固定1:1比例逻辑
  }
}
```

### 重构后：CropBoxController (通用化)
```javascript
/**
 * 通用裁切框控制器
 * @example
 * const cropBox = new CropBoxController({
 *   gridSelector: '[data-crop-box]',
 *   aspectRatio: { w: 1, h: 1 }, // 1:1比例，或null表示任意比例
 *   onChanged: (x, y, width, height) => {
 *     console.log('裁切区域变化:', { x, y, width, height });
 *   }
 * });
 */
class CropBoxController {
  constructor(options) {
    const {
      gridSelector,
      resizeSelector,
      viewBoxSelector,
      aspectRatio = null,        // {w:1, h:1} 或 null
      lockAspect = true,
      minSize = 50,
      autoCenter = true,
      autoFit = true,
      enabled = true,
      onChanged = null
    } = options;
    
    this.grid = document.querySelector(gridSelector);
    this.resize = document.querySelector(resizeSelector);
    this.viewBox = document.querySelector(viewBoxSelector);
    this.aspectRatio = aspectRatio;
    this.lockAspect = lockAspect;
    this.minSize = minSize;
    this.autoCenter = autoCenter;
    this.autoFit = autoFit;
    this.enabled = enabled;
    this.onChanged = onChanged;
    
    // 移除业务特定引用（this.page等）
    this.init();
  }
  
  adjustGridToFitParent() {
    if(!this.enabled || this.isDragging || this.isResizing) return;
    // ... 通用逻辑，支持任意比例
  }
  
  handleResizeStart(e) {
    // ... 根据aspectRatio动态处理
    if(this.aspectRatio) {
      // 锁定比例
    } else {
      // 任意比例
    }
  }
  
  // 新增：获取当前裁切区域（供外部使用）
  getCropRegion() {
    const rect = this.grid.getBoundingClientRect();
    const parentRect = this.viewBox.getBoundingClientRect();
    return {
      x: rect.left - parentRect.left,
      y: rect.top - parentRect.top,
      width: rect.width,
      height: rect.height
    };
  }
  
  // 新增：设置裁切区域（供外部使用）
  setCropRegion(region) {
    // ...
  }
}

// 二维码使用（1:1比例）
const qrcodeCropBox = new CropBoxController({
  gridSelector: '[data-qrcode-grid]',
  resizeSelector: '[data-qrcode-grid-resize]',
  viewBoxSelector: '[data-qrcode-view-box]',
  aspectRatio: { w: 1, h: 1 },
  onChanged: (x, y, w, h) => {
    // 二维码特定处理
  }
});

// 编辑页使用（任意比例）
const editCropBox = new CropBoxController({
  gridSelector: '[data-edit-crop-box]',
  aspectRatio: null, // 任意比例
  onChanged: (x, y, w, h) => {
    // 编辑页处理
  }
});
```

## 2. 滤镜控件对比

### 重构前：硬编码在getUserNumber函数中
```javascript
function getUserNumber(node){
  let number = node.getAttribute('data-number-value');
  
  // 硬编码的if分支
  if(node.getAttribute('data-qrcode-brightness') !== null){
    getElementMix('data-qrcode-view').style.setProperty('--brightness',number/100);
  };
  if(node.getAttribute('data-qrcode-contrast') !== null){
    getElementMix('data-qrcode-view').style.setProperty('--contrast',number/100);
  };
  if(node.getAttribute('data-qrcode-invert') !== null){
    getElementMix('data-qrcode-view').style.setProperty('--invert',number/100);
  };
  if(node.getAttribute('data-qrcode-sharpen') !== null){
    // 特殊的锐化处理...
    const convolve = document.getElementById('convolve');
    // ... 复杂的矩阵计算
  }
}
```

### HTML（需要手动编写每个滤镜）
```html
<div data-qrcode-brightness data-number data-number-value="100" class="df-lc fl1">
  <input data-input="range" type="range" min="10" max="200" value="100">
  <input data-input="value" data-input-must="10,200" data-input-type="int" 
    type="text" class="txt-c mar-l4" style="width: 30px; flex: 0 0 auto;" value="100">
  <div class="df-cc" data-input-unit>%</div>
  <div data-input-reset data-btn="reset">
    <btn-reset></btn-reset>
  </div>
</div>
<!-- 每个滤镜都要重复编写类似的HTML -->
```

### 重构后：FilterControlGenerator
```javascript
/**
 * 滤镜控件生成器
 * 根据配置自动生成滤镜控件HTML并绑定事件
 */
class FilterControlGenerator {
  constructor(container, targetElement, filterConfigs) {
    this.container = container;
    this.targetElement = targetElement;
    this.configs = filterConfigs;
    this.controls = new Map();
    this.generate();
  }
  
  generate() {
    Object.entries(this.configs).forEach(([key, config]) => {
      const control = this.createControl(key, config);
      this.container.appendChild(control.element);
      this.controls.set(key, control);
      
      // 绑定到getUserMix系统
      control.element.setAttribute(`data-filter-${key}`, '');
      this.setupEventListeners(key, config);
    });
  }
  
  createControl(key, config) {
    const wrapper = document.createElement('div');
    wrapper.className = 'df-lc gap4 pad2';
    wrapper.setAttribute(`data-filter-${key}`, '');
    
    // 名称
    const label = document.createElement('div');
    label.className = 'df-cc';
    label.setAttribute('data-any', 'vw240');
    label.setAttribute('data-skill-btnname');
    label.textContent = config.name[0];
    label.setAttribute('data-en-text', config.name[1]);
    wrapper.appendChild(label);
    
    // 滑块+输入框组合
    const control = document.createElement('div');
    control.setAttribute('data-number', '');
    control.setAttribute('data-number-value', config.default);
    control.setAttribute(`data-filter-${key}`, '');
    control.className = 'df-lc fl1';
    
    const range = document.createElement('input');
    range.setAttribute('data-input', 'range');
    range.type = 'range';
    range.min = config.min;
    range.max = config.max;
    range.value = config.default;
    control.appendChild(range);
    
    const input = document.createElement('input');
    input.setAttribute('data-input', 'value');
    input.setAttribute('data-input-must', `${config.min},${config.max}`);
    input.setAttribute('data-input-type', 'int');
    input.type = 'text';
    input.className = 'txt-c mar-l4';
    input.style.cssText = 'width: 30px; flex: 0 0 auto;';
    input.value = config.default;
    control.appendChild(input);
    
    const unit = document.createElement('div');
    unit.className = 'df-cc';
    unit.setAttribute('data-input-unit', '');
    unit.textContent = config.unit || '';
    control.appendChild(unit);
    
    const reset = document.createElement('div');
    reset.setAttribute('data-input-reset', '');
    reset.setAttribute('data-btn', 'reset');
    reset.innerHTML = '<btn-reset></btn-reset>';
    control.appendChild(reset);
    
    wrapper.appendChild(control);
    
    return { element: wrapper, control };
  }
  
  setupEventListeners(key, config) {
    // 使用MutationObserver监听data-number-value变化
    const control = this.controls.get(key).control;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if(mutation.attributeName === 'data-number-value') {
          const value = parseInt(control.getAttribute('data-number-value'));
          this.applyFilter(key, config, value);
        }
      });
    });
    observer.observe(control, { attributes: true });
  }
  
  applyFilter(key, config, value) {
    if(config.apply) {
      config.apply(this.targetElement, value, config);
    } else if(config.cssVar) {
      const transformed = config.transform ? config.transform(value) : value;
      this.targetElement.style.setProperty(config.cssVar, transformed);
    }
  }
}

// 滤镜配置定义
const QRCODE_FILTER_CONFIGS = {
  brightness: {
    name: ['亮度', 'Brightness'],
    min: 10,
    max: 200,
    default: 100,
    unit: '%',
    cssVar: '--brightness',
    transform: (value) => value / 100,
    apply: (element, value) => {
      element.style.setProperty('--brightness', value / 100);
    }
  },
  contrast: {
    name: ['对比度', 'Contrast'],
    min: 10,
    max: 999,
    default: 300,
    unit: '%',
    cssVar: '--contrast',
    transform: (value) => value / 100,
    apply: (element, value) => {
      element.style.setProperty('--contrast', value / 100);
    }
  },
  invert: {
    name: ['反转色', 'Invert'],
    min: 0,
    max: 100,
    default: 0,
    unit: '%',
    cssVar: '--invert',
    transform: (value) => value / 100,
    apply: (element, value) => {
      element.style.setProperty('--invert', value / 100);
    }
  },
  sharpen: {
    name: ['锐化', 'Sharpen'],
    min: 0,
    max: 100,
    default: 0,
    unit: '%',
    type: 'svg',
    svgFilterId: 'convolve',
    apply: (element, value, config) => {
      const convolve = document.getElementById(config.svgFilterId);
      if(!convolve) return;
      
      const intensity = value / 100;
      const centerValue = 1 + (5 - 1) * intensity;
      const edgeValue = 0 + (-1 - 0) * intensity;
      const matrix = [
        0, edgeValue, 0,
        edgeValue, centerValue, edgeValue,
        0, edgeValue, 0
      ];
      const matrixSum = centerValue + 4 * edgeValue;
      const divisor = matrixSum || 1;
      convolve.setAttribute('kernelMatrix', matrix.join(' '));
      convolve.setAttribute('divisor', divisor);
    }
  }
};

// 使用方式（二维码功能）
const filterGenerator = new FilterControlGenerator(
  document.querySelector('[data-qrcode-view-set]'),
  document.querySelector('[data-qrcode-view]'),
  QRCODE_FILTER_CONFIGS
);

// 编辑页使用（可复用相同配置或定义新配置）
const editFilterGenerator = new FilterControlGenerator(
  document.querySelector('[data-edit-filter-set]'),
  document.querySelector('[data-edit-view]'),
  EDIT_FILTER_CONFIGS // 可以使用相同或不同的配置
);
```

### HTML（简化为容器）
```html
<!-- 只需要一个容器，控件由JS动态生成 -->
<div class="bod-d df-ffc gap4 pad4 mar-b4" data-qrcode-view-set>
  <!-- FilterControlGenerator会自动生成控件 -->
</div>
```

## 3. 像素网格生成对比

### 重构前：convertImageToPixelGrid函数 (303行)
```javascript
async function convertImageToPixelGrid(img, imgView){
  // 硬编码查找二维码特定元素
  let viewBox = getElementMix('data-qrcode-view-box');
  let grid = getElementMix('data-qrcode-grid');
  let gridNumInput = document.getElementById('input-qrcode-grid');
  let imageResult = getElementMix('data-qrcode-ruslt="image"');
  
  // ... 大量硬编码的二维码特定逻辑
  
  // 只能生成黑白
  for (let y = 0; y < dimension; y++) {
    for (let x = 0; x < dimension; x++) {
      // 二值化处理
      moduleMatrix.data[y * dimension + x] = avgGray < threshold ? 1 : 0;
    }
  }
  
  // 直接操作DOM
  imageResult.innerHTML = svg;
  return true;
}
```

### 重构后：PixelGridGenerator类
```javascript
/**
 * 像素网格生成器
 * 支持黑白和彩色模式，可配置采样算法
 */
class PixelGridGenerator {
  constructor(options = {}) {
    const {
      gridNum = 25,
      mode = 'monochrome',        // 'monochrome' | 'color'
      threshold = 'auto',         // 'auto' | number | 'otsu'
      sampling = 'average',       // 'average' | 'center' | 'mode'
      transparent = true,
      outputFormat = 'svg'        // 'svg' | 'canvas' | 'imagedata'
    } = options;
    
    this.gridNum = gridNum;
    this.mode = mode;
    this.threshold = threshold;
    this.sampling = sampling;
    this.transparent = transparent;
    this.outputFormat = outputFormat;
  }
  
  /**
   * 生成像素网格
   * @param {ImageData} imageData - 源图片数据
   * @param {Object} cropRegion - 裁切区域 {x, y, width, height}
   * @returns {Promise<Object>} 生成结果
   */
  async generate(imageData, cropRegion = null) {
    // 裁切图片数据（如果提供了裁切区域）
    let processedData = cropRegion 
      ? this.cropImageData(imageData, cropRegion)
      : imageData;
    
    // 根据模式处理
    let matrix;
    if(this.mode === 'monochrome') {
      matrix = await this.generateMonochrome(processedData);
    } else {
      matrix = await this.generateColor(processedData);
    }
    
    // 根据输出格式生成结果
    return this.formatOutput(matrix);
  }
  
  async generateMonochrome(imageData) {
    // 计算阈值
    const threshold = this.calculateThreshold(imageData);
    
    // 采样并二值化
    const dimension = this.gridNum;
    const matrix = {
      width: dimension,
      height: dimension,
      data: new Uint8ClampedArray(dimension * dimension),
      mode: 'monochrome'
    };
    
    const imgSize = Math.min(imageData.width, imageData.height);
    const moduleSize = imgSize / dimension;
    
    for (let y = 0; y < dimension; y++) {
      for (let x = 0; x < dimension; x++) {
        const sample = this.sampleRegion(imageData, x, y, moduleSize);
        
        // 处理透明
        if(this.transparent && sample.alpha < 128) {
          matrix.data[y * dimension + x] = 2; // 透明标记
        } else {
          matrix.data[y * dimension + x] = sample.gray < threshold ? 1 : 0;
        }
      }
    }
    
    return matrix;
  }
  
  async generateColor(imageData) {
    // 彩色模式（未来扩展）
    const dimension = this.gridNum;
    const matrix = {
      width: dimension,
      height: dimension,
      data: new Array(dimension * dimension),
      mode: 'color'
    };
    
    const imgSize = Math.min(imageData.width, imageData.height);
    const moduleSize = imgSize / dimension;
    
    for (let y = 0; y < dimension; y++) {
      for (let x = 0; x < dimension; x++) {
        const sample = this.sampleRegion(imageData, x, y, moduleSize, true);
        matrix.data[y * dimension + x] = {
          r: sample.r,
          g: sample.g,
          b: sample.b,
          alpha: sample.alpha
        };
      }
    }
    
    return matrix;
  }
  
  formatOutput(matrix) {
    switch(this.outputFormat) {
      case 'svg':
        return { svg: this.matrixToSVG(matrix) };
      case 'canvas':
        return { canvas: this.matrixToCanvas(matrix) };
      case 'imagedata':
        return { imagedata: this.matrixToImageData(matrix) };
      default:
        return { matrix };
    }
  }
  
  matrixToSVG(matrix) {
    if(matrix.mode === 'monochrome') {
      return this.monochromeToSVG(matrix);
    } else {
      return this.colorToSVG(matrix);
    }
  }
  
  monochromeToSVG(matrix) {
    // 当前的黑白SVG生成逻辑
    // ...
  }
  
  colorToSVG(matrix) {
    // 彩色SVG生成（未来扩展）
    // ...
  }
  
  // 辅助方法...
  sampleRegion(imageData, x, y, moduleSize, includeColor = false) {
    // 采样逻辑
  }
  
  calculateThreshold(imageData) {
    // 阈值计算逻辑
  }
}

// 使用方式（二维码功能）
const pixelGenerator = new PixelGridGenerator({
  gridNum: 25,
  mode: 'monochrome',
  outputFormat: 'svg'
});

// 在convertImageToQRCode中使用
const result = await pixelGenerator.generate(imageData, cropRegion);
imageResult.innerHTML = result.svg;

// 未来扩展：彩色像素艺术
const colorGenerator = new PixelGridGenerator({
  gridNum: 50,
  mode: 'color',
  outputFormat: 'canvas'
});
const colorResult = await colorGenerator.generate(imageData);
```

## 4. 二维码核心功能对比

### 重构前：convertImageToQRCode函数 (263行)
```javascript
async function convertImageToQRCode(img = null, triggerType = 'upload'){
  // 大量硬编码的元素查找
  let imgView = getElementMix('data-qrcode-view');
  let viewBox = getElementMix('data-qrcode-view-box');
  let grid = getElementMix('data-qrcode-grid');
  // ...
  
  // 复杂的裁切区域计算（混在函数中）
  let viewBoxRect = viewBox.getBoundingClientRect();
  let gridRect = grid.getBoundingClientRect();
  // ... 大量计算逻辑
  
  // 识别失败后调用硬编码的函数
  let gridResult = await convertImageToPixelGrid(img, imgView);
}
```

### 重构后：使用模块化组件
```javascript
/**
 * 二维码转换功能（使用模块化组件）
 */
class QRCodeConverter {
  constructor(options) {
    this.cropBox = options.cropBox;
    this.pixelGenerator = options.pixelGenerator;
    this.imgView = options.imgView;
    this.imageResult = options.imageResult;
    this.gridInput = options.gridInput;
    this.dataInput = options.dataInput;
  }
  
  async convert(img, triggerType = 'upload') {
    // 1. 获取裁切区域（通过cropBox，无需手动计算）
    const cropRegion = this.cropBox.getCropRegion();
    
    // 2. 获取图片数据
    const imageData = await this.getImageData(img, cropRegion);
    
    // 3. 识别二维码
    const qrResult = jsQRCorrect(imageData.data, imageData.width, imageData.height);
    
    if(qrResult.success) {
      return await this.handleQRSuccess(qrResult, imageData);
    } else {
      return await this.handleQRFailure(img, triggerType);
    }
  }
  
  async handleQRSuccess(result, imageData) {
    // 生成SVG
    const svg = jsQRCorrect.matrixToSVG(result.matrix, {...});
    this.imageResult.innerHTML = svg;
    
    // 更新网格数
    this.updateGridNumber(result.dimension);
    
    // 解码内容
    const decodeResult = jsQR(imageData.data, imageData.width, imageData.height);
    if(decodeResult) {
      this.updateDataInput(decodeResult.data);
    }
    
    return true;
  }
  
  async handleQRFailure(img, triggerType) {
    if(triggerType === 'scan') {
      // 只提示，不生成
      return false;
    }
    
    // 使用pixelGenerator生成像素网格
    const imageData = await this.getImageData(img);
    const cropRegion = this.cropBox.getCropRegion();
    const result = await this.pixelGenerator.generate(imageData, cropRegion);
    
    this.imageResult.innerHTML = result.svg;
    return true;
  }
  
  async getImageData(img, cropRegion) {
    // 统一的图片数据获取逻辑
  }
  
  updateGridNumber(dimension) {
    // 更新网格数输入框
  }
  
  updateDataInput(data) {
    // 更新数据输入框
  }
}

// 初始化
const qrcodeConverter = new QRCodeConverter({
  cropBox: qrcodeCropBox,
  pixelGenerator: pixelGenerator,
  imgView: document.querySelector('[data-qrcode-view]'),
  imageResult: document.querySelector('[data-qrcode-ruslt="image"]'),
  gridInput: document.getElementById('input-qrcode-grid'),
  dataInput: document.getElementById('input-qrcode-data')
});

// 使用
await qrcodeConverter.convert(img, 'upload');
```

## 5. 整体代码组织对比

### 重构前：单文件1058行
```
main.js
  ├── QRCodeGridController (344行) - 只能用于二维码
  ├── convertImageToPixelGrid (303行) - 硬编码二维码逻辑
  ├── convertImageToQRCode (263行) - 混入大量元素查找和计算
  ├── 事件绑定 (148行)
  └── getUserNumber中的滤镜处理 (24行) - 硬编码
```

### 重构后：模块化组织
```
modules/
  ├── cropBox/
  │   └── CropBoxController.js (250行) - 通用裁切框
  │
  ├── filterControl/
  │   ├── FilterControlGenerator.js (150行) - 滤镜控件生成器
  │   └── filterConfig.js (50行) - 滤镜配置
  │
  └── pixelGrid/
      └── PixelGridGenerator.js (200行) - 像素网格生成器

features/
  └── qrcode/
      ├── qrcode.js (200行) - 二维码核心功能
      └── qrcodeConfig.js (50行) - 二维码配置

main.js
  └── 初始化代码 (50行) - 组装各模块
```

## 总结

### 代码量变化
- **重构前**: 1058行（单文件，难以复用）
- **重构后**: ~900行（模块化，高度复用）

### 复用性提升
- ✅ 裁切框：可用于任何图片裁切场景
- ✅ 滤镜控件：可用于编辑页面
- ✅ 像素网格：可用于像素艺术生成

### 可维护性提升
- ✅ 职责清晰：每个模块只做一件事
- ✅ 配置驱动：修改配置而非代码
- ✅ 易于测试：模块可独立测试
- ✅ 易于扩展：添加新功能更容易
