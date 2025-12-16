# convertImageToPixelGrid 和 convertImageToQRCode 代码优化分析

## 代码重复分析

### 1. DOM 元素获取（重复度：100%）

**重复代码**：
- 获取 `imgView`、`viewMode`
- 获取 `viewBox`、`grid`
- `convertImageToQRCode` 还获取 `inputData`、`imageResult`

**优化建议**：提取为共用函数 `getQRCodeElements()`

### 2. EDIT 模式下裁剪框计算（重复度：90%）

**重复代码位置**：
- `convertImageToPixelGrid`: 3375-3433行
- `convertImageToQRCode`: 3721-3782行

**重复逻辑**：
```javascript
// 两者都有：
let viewBoxRect = viewBox.getBoundingClientRect();
let gridRect = grid.getBoundingClientRect();
let gridLeft = gridRect.left - viewBoxRect.left;
let gridTop = gridRect.top - viewBoxRect.top;
let gridSize = Math.min(gridRect.width, gridRect.height);
let viewBoxSize = Math.min(viewBoxRect.width, viewBoxRect.height);
```

**差异**：
- `convertImageToQRCode` 还计算了 `domScale = Math.ceil(256 / gridSize)`
- `convertImageToPixelGrid` 还计算了图片相对于 viewBox 的位置（用于计算 cropX, cropY）

**优化建议**：提取为共用函数 `getCropRegionInEditMode(viewBox, grid, img)`

### 3. EDIT 模式下图片数据获取（重复度：95%）

**重复代码位置**：
- `convertImageToPixelGrid`: 3460-3513行
- `convertImageToQRCode`: 3748-3782行

**重复逻辑**：
```javascript
// 完全相同：
let imgDataResult = await tool.DomToImagedata(imgView, {scale: domScale});
// 创建临时 canvas 和 tempImg
let tempCanvas = document.createElement('canvas');
let tempCtx = tempCanvas.getContext('2d');
let tempImg = new Image();
let blobUrl = URL.createObjectURL(new Blob([imgDataResult.u8a], {type: 'image/png'}));
// 等待加载
await new Promise((resolve, reject) => { ... });
// 绘制到 canvas
tempCanvas.width = imgDataResult.width;
tempCanvas.height = imgDataResult.height;
tempCtx.drawImage(tempImg, 0, 0);
// 计算裁剪区域（像素坐标）
let scale = imgDataResult.width / viewBoxSize;
let actualCropX = Math.floor(gridLeft * scale);
let actualCropY = Math.floor(gridTop * scale);
let actualCropSize = Math.floor(gridSize * scale);
// 边界检查
actualCropX = Math.max(0, Math.min(actualCropX, ...));
actualCropY = Math.max(0, Math.min(actualCropY, ...));
actualCropSize = Math.min(actualCropSize, ...);
// 获取 ImageData
imageData = tempCtx.getImageData(actualCropX, actualCropY, actualCropSize, actualCropSize);
URL.revokeObjectURL(blobUrl);
```

**差异**：
- `convertImageToQRCode` 使用 `domScale`（根据 gridSize 计算）
- `convertImageToPixelGrid` 使用 `scale: 1`

**优化建议**：提取为共用函数 `getImageDataFromDomToImageData(imgView, cropRegion, options)`

### 4. AUTO 模式下图片加载（重复度：80%）

**重复代码**：
```javascript
// convertImageToQRCode (3788-3827行)
await new Promise((resolve, reject) => {
  if(imageToUse.complete){
    resolve();
  }else{
    imageToUse.onload = resolve;
    imageToUse.onerror = reject;
  }
});
canvas.width = imageToUse.naturalWidth || imageToUse.width;
canvas.height = imageToUse.naturalHeight || imageToUse.height;
ctx.drawImage(imageToUse, 0, 0);
imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// convertImageToPixelGrid (3437-3454行, 3520-3544行)
await new Promise((resolve, reject) => {
  if(img.complete){
    resolve();
  }else{
    img.onload = resolve;
    img.onerror = reject;
  }
});
// 计算中心正方形区域
let imgNaturalWidth = img.naturalWidth || img.width;
let imgNaturalHeight = img.naturalHeight || img.height;
let minSize = Math.min(imgNaturalWidth, imgNaturalHeight);
cropX = (imgNaturalWidth - minSize) / 2;
cropY = (imgNaturalHeight - minSize) / 2;
cropSize = minSize;
// 然后绘制到 canvas 并裁剪
```

**优化建议**：提取为共用函数 `waitForImageLoad(img)` 和 `getImageDataFromImg(img, cropRegion?)`

### 5. 边界检查和裁剪区域计算（重复度：100%）

**重复代码**：
```javascript
// 两个函数都有类似的边界检查：
actualCropX = Math.max(0, Math.min(actualCropX, canvas.width - 1));
actualCropY = Math.max(0, Math.min(actualCropY, canvas.height - 1));
actualCropSize = Math.min(actualCropSize, canvas.width - actualCropX);
actualCropSize = Math.min(actualCropSize, canvas.height - actualCropY);
```

**优化建议**：提取为共用函数 `clampCropRegion(cropX, cropY, cropSize, maxWidth, maxHeight)`

## 可以共用的数据结构

### 1. CropRegion 对象

```javascript
{
  x: number,        // 裁剪区域的 x 坐标（相对于图片）
  y: number,        // 裁剪区域的 y 坐标（相对于图片）
  width: number,    // 裁剪区域的宽度
  height: number,   // 裁剪区域的高度
  pixelX: number,   // 像素坐标 x
  pixelY: number,   // 像素坐标 y
  pixelWidth: number,  // 像素宽度
  pixelHeight: number  // 像素高度
}
```

### 2. ImageSource 对象

```javascript
{
  img: HTMLImageElement,      // 图片元素
  imgView: HTMLElement,       // 图片容器
  viewMode: 'AUTO' | 'EDIT',  // 视图模式
  originalImageSrc?: string   // 原始图片 src（AUTO 模式用）
}
```

## 优化方案

### 方案一：提取共用辅助函数（推荐）

1. **`getQRCodeElements()`** - 获取所有需要的 DOM 元素
2. **`getCropRegionInEditMode(viewBox, grid, img)`** - EDIT 模式下计算裁剪区域
3. **`getImageDataFromDomToImageData(imgView, cropRegion, options)`** - EDIT 模式下获取 ImageData
4. **`waitForImageLoad(img)`** - 等待图片加载完成
5. **`getImageDataFromImg(img, cropRegion?)`** - 从 img 元素获取 ImageData
6. **`clampCropRegion(cropX, cropY, cropSize, maxWidth, maxHeight)`** - 边界检查和裁剪

### 方案二：统一的图片数据获取函数

创建一个统一的函数 `getImageDataForQRCode(img, imgView, options)`，根据 viewMode 自动选择处理方式。

### 代码量对比

**当前代码量**：
- `convertImageToPixelGrid`: ~220行
- `convertImageToQRCode`: ~270行
- 总计：~490行
- 重复代码：~150行

**优化后预估**：
- 共用函数：~150行
- `convertImageToPixelGrid`: ~100行（减少 120行）
- `convertImageToQRCode`: ~150行（减少 120行）
- 总计：~400行（减少 90行，约 18%）

## 优化收益

1. **代码可维护性**：修改逻辑时只需修改一处
2. **代码可读性**：主函数逻辑更清晰
3. **代码复用性**：其他功能也可以使用这些辅助函数
4. **减少 Bug**：避免两处代码不一致导致的 Bug
5. **测试更容易**：可以单独测试每个辅助函数
