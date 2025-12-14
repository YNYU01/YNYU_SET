/**
 * jsQR 二维码矫正工具
 * 独立于解码功能，只负责自动识别和矫正二维码图像
 * 
 * 使用方式：
 *   <script src="jsQR.js"></script>
 *   <script src="jsQR_correct.js"></script>
 *   
 *   const result = jsQRCorrect(imageData.data, imageData.width, imageData.height);
 *   if (result.success) {
 *     const matrix = result.matrix;  // 矫正后的 BitMatrix
 *     const dimension = result.dimension;  // 二维码尺寸（行列数）
 *   } else {
 *     console.error(result.error);
 *   }
 */

(function() {
  'use strict';

  /**
   * 从原始图像中提取并矫正二维码区域
   * 返回原图裁剪区域（保持原分辨率）和模块矩阵（用于生成 SVG）
   * @param {Uint8ClampedArray} data - 原始图像数据
   * @param {number} width - 图像宽度
   * @param {number} height - 图像高度
   * @param {Object} location - 二维码位置信息
   * @param {number} dimension - 二维码模块数（如 21, 25, 37 等）
   * @returns {Object} 包含 croppedImage 和 moduleMatrix
   */

  /**
   * 检测并矫正二维码的方向
   * 根据三个定位点的直角关系，确定正确的左上、右上、左下角
   * @param {Object} p1 - 定位点1
   * @param {Object} p2 - 定位点2
   * @param {Object} p3 - 定位点3
   * @returns {Object} 矫正后的三个角点 { topLeft, topRight, bottomLeft, needsMirror }
   */
  function detectAndCorrectOrientation(p1, p2, p3) {
    // 计算三个点之间的向量
    const v12 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v13 = { x: p3.x - p1.x, y: p3.y - p1.y };
    const v21 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v23 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const v31 = { x: p1.x - p3.x, y: p1.y - p3.y };
    const v32 = { x: p2.x - p3.x, y: p2.y - p3.y };
    
    // 计算向量点积（用于判断直角）
    // 点积接近0表示垂直
    const dot12_13 = v12.x * v13.x + v12.y * v13.y; // p1是直角点
    const dot21_23 = v21.x * v23.x + v21.y * v23.y; // p2是直角点
    const dot31_32 = v31.x * v32.x + v31.y * v32.y; // p3是直角点
    
    // 找到最接近直角的点（点积的绝对值最小）
    const absDot1 = Math.abs(dot12_13);
    const absDot2 = Math.abs(dot21_23);
    const absDot3 = Math.abs(dot31_32);
    
    let rightAnglePoint, otherPoint1, otherPoint2;
    
    if (absDot1 <= absDot2 && absDot1 <= absDot3) {
      // p1是直角点（左上角）
      rightAnglePoint = p1;
      otherPoint1 = p2;
      otherPoint2 = p3;
    } else if (absDot2 <= absDot1 && absDot2 <= absDot3) {
      // p2是直角点（可能是右上角或左下角）
      rightAnglePoint = p2;
      otherPoint1 = p1;
      otherPoint2 = p3;
    } else {
      // p3是直角点（可能是右上角或左下角）
      rightAnglePoint = p3;
      otherPoint1 = p1;
      otherPoint2 = p2;
    }
    
    // 计算从直角点到另外两个点的向量
    const vec1 = { x: otherPoint1.x - rightAnglePoint.x, y: otherPoint1.y - rightAnglePoint.y };
    const vec2 = { x: otherPoint2.x - rightAnglePoint.x, y: otherPoint2.y - rightAnglePoint.y };
    
    // 计算向量与水平方向的夹角（用于判断方向）
    const angle1 = Math.atan2(vec1.y, vec1.x);
    const angle2 = Math.atan2(vec2.y, vec2.x);
    
    // 判断是否需要镜像
    // 标准QR码：左上角是直角点，一个向量指向右侧（0-90°），一个指向下侧（90-180°）
    // 如果两个向量都在同一侧（都在左侧或都在右侧），可能需要镜像
    let needsMirror = false;
    
    // 判断哪个点应该是topRight（右侧），哪个应该是bottomLeft（下侧）
    // 计算向量与标准方向的差异
    const angleToRight = 0; // 右侧（0°）
    const angleToDown = Math.PI / 2; // 下侧（90°）
    
    const dist1ToRight = Math.abs(angle1 - angleToRight);
    const dist1ToDown = Math.abs(angle1 - angleToDown);
    const dist2ToRight = Math.abs(angle2 - angleToRight);
    const dist2ToDown = Math.abs(angle2 - angleToDown);
    
    // 考虑角度的周期性（-180°到180°）
    const normalizeAngleDiff = (diff) => {
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      return Math.abs(diff);
    };
    
    const normDist1ToRight = normalizeAngleDiff(angle1 - angleToRight);
    const normDist1ToDown = normalizeAngleDiff(angle1 - angleToDown);
    const normDist2ToRight = normalizeAngleDiff(angle2 - angleToRight);
    const normDist2ToDown = normalizeAngleDiff(angle2 - angleToDown);
    
    let topRight, bottomLeft;
    
    if (normDist1ToRight < normDist2ToRight && normDist2ToDown < normDist1ToDown) {
      // vec1更接近右侧，vec2更接近下侧
      topRight = otherPoint1;
      bottomLeft = otherPoint2;
    } else if (normDist2ToRight < normDist1ToRight && normDist1ToDown < normDist2ToDown) {
      // vec2更接近右侧，vec1更接近下侧
      topRight = otherPoint2;
      bottomLeft = otherPoint1;
    } else {
      // 如果角度判断不清，使用位置关系
      // topRight应该在直角点的右侧（x更大），bottomLeft应该在下方（y更大）
      if (otherPoint1.x > otherPoint2.x && otherPoint1.y < otherPoint2.y) {
        topRight = otherPoint1;
        bottomLeft = otherPoint2;
      } else if (otherPoint2.x > otherPoint1.x && otherPoint2.y < otherPoint1.y) {
        topRight = otherPoint2;
        bottomLeft = otherPoint1;
      } else {
        // 如果位置关系也不对，可能需要镜像
        // 检查：如果直角点的x坐标大于其他点，说明可能镜像了
        if (rightAnglePoint.x > Math.max(otherPoint1.x, otherPoint2.x)) {
          needsMirror = true;
        }
        // 先按x坐标判断
        topRight = otherPoint1.x > otherPoint2.x ? otherPoint1 : otherPoint2;
        bottomLeft = otherPoint1.x < otherPoint2.x ? otherPoint1 : otherPoint2;
      }
    }
    
    // 检查：如果topRight在直角点左侧，或者bottomLeft在直角点上方，说明需要镜像
    if (topRight.x < rightAnglePoint.x || bottomLeft.y < rightAnglePoint.y) {
      needsMirror = true;
    }
    
    return {
      topLeft: rightAnglePoint,
      topRight: topRight,
      bottomLeft: bottomLeft,
      needsMirror: needsMirror
    };
  }

  function extractAndCorrectQRCode(data, width, height, location, dimension) {
    // jsQR 的 location 对象可能包含不同的属性名：
    // - topLeft / topLeftFinderPattern: 左上角定位点
    // - topRight / topRightFinderPattern: 右上角定位点  
    // - bottomLeft / bottomLeftFinderPattern: 左下角定位点
    // - alignmentPattern: 对齐模式（用于计算右下角）
    
    // 兼容不同的属性名
    const p1 = location.topLeft || location.topLeftFinderPattern;
    const p2 = location.topRight || location.topRightFinderPattern;
    const p3 = location.bottomLeft || location.bottomLeftFinderPattern;
    
    // 检查必要的属性是否存在
    if (!p1 || !p2 || !p3) {
      throw new Error('location 对象缺少必要的角点信息');
    }
    
    // 检测并矫正方向
    const orientation = detectAndCorrectOrientation(p1, p2, p3);
    // 使用检测后的正确角点（不翻转坐标，因为我们最后会翻转模块矩阵）
    // 这样可以从原始图像正确采样，然后在最后翻转矩阵
    let topLeft = orientation.topLeft;
    let topRight = orientation.topRight;
    let bottomLeft = orientation.bottomLeft;
    const needsMirror = orientation.needsMirror;
    
    // 调试信息：记录是否需要镜像
    if (needsMirror) {
    }
    
    // 计算右下角位置（基于三个定位点和对齐模式）
    // 如果存在 alignmentPattern，使用它；否则通过几何关系计算
    let bottomRight;
    if (location.alignmentPattern) {
      bottomRight = location.alignmentPattern;
    } else {
      // 通过三个定位点计算右下角
      bottomRight = {
        x: topRight.x - topLeft.x + bottomLeft.x,
        y: topRight.y - topLeft.y + bottomLeft.y
      };
    }
    
    // 四个角点（按顺序：左上、右上、右下、左下）
    const srcCorners = [
      topLeft,
      topRight,
      bottomRight,
      bottomLeft
    ];
    
    // 计算模块大小（用于扩展边界框）
    const dist1 = Math.sqrt(
      Math.pow(topRight.x - topLeft.x, 2) + 
      Math.pow(topRight.y - topLeft.y, 2)
    );
    const dist2 = Math.sqrt(
      Math.pow(bottomLeft.x - topLeft.x, 2) + 
      Math.pow(bottomLeft.y - topLeft.y, 2)
    );
    const avgDist = (dist1 + dist2) / 2;
    // 定位点中心之间的距离大约是 (dimension - 7) 个模块
    const modulesBetweenFinders = Math.max(1, dimension - 7);
    const moduleSize = avgDist / modulesBetweenFinders;
    
    // 计算边界框（基于定位点中心）
    let minX = Math.min(srcCorners[0].x, srcCorners[1].x, srcCorners[2].x, srcCorners[3].x);
    let maxX = Math.max(srcCorners[0].x, srcCorners[1].x, srcCorners[2].x, srcCorners[3].x);
    let minY = Math.min(srcCorners[0].y, srcCorners[1].y, srcCorners[2].y, srcCorners[3].y);
    let maxY = Math.max(srcCorners[0].y, srcCorners[1].y, srcCorners[2].y, srcCorners[3].y);
    
    // 扩展边界框以包含定位点的外圈
    // 定位点是7x7模块，中心在(3.5, 3.5)，所以从中心到外边缘是3.5个模块
    // 为了紧贴二维码边缘，只扩展定位点外圈的一半（约3.5个模块），不包含静默区
    const expansionModules = 3.5; // 扩展3.5个模块，刚好到定位点外边缘
    const expansionPixels = expansionModules * moduleSize;
    
    minX = minX - expansionPixels;
    maxX = maxX + expansionPixels;
    minY = minY - expansionPixels;
    maxY = maxY + expansionPixels;
    
    // 确保边界在图像范围内
    minX = Math.max(0, Math.floor(minX));
    maxX = Math.min(width - 1, Math.ceil(maxX));
    minY = Math.max(0, Math.floor(minY));
    maxY = Math.min(height - 1, Math.ceil(maxY));
    
    // 计算输出图像尺寸（正方形，基于 dimension）
    // moduleSize 已经在上面计算过了，直接使用
    
    // 确保 outputSize 至少为 dimension（每个模块至少1像素）
    // 并且至少为 100 像素，以确保有足够的细节
    const minOutputSize = Math.max(dimension, 100);
    const calculatedSize = Math.ceil(moduleSize * dimension);
    // 限制最大尺寸，避免裁切区域过大导致明度比值算法不准确
    // 对于点状二维码，过大的裁切区域会导致采样区域过大，阈值计算不准确
    // 编辑模式使用256*256可以识别，说明合适的尺寸有助于识别
    const maxOutputSize = 512; // 最大边不超过512像素（保持足够细节的同时避免过大）
    let outputSize = Math.max(minOutputSize, calculatedSize);
    outputSize = Math.min(outputSize, maxOutputSize);
    
    // 检查 outputSize 是否有效
    if (!outputSize || outputSize <= 0 || !isFinite(outputSize)) {
      throw new Error(`无效的输出尺寸: ${outputSize} (moduleSize: ${moduleSize}, dimension: ${dimension})`);
    }
    
    // 目标正方形的四个角点（按顺序：左上、右上、右下、左下）
    const dstCorners = [
      { x: 0, y: 0 },
      { x: outputSize - 1, y: 0 },
      { x: outputSize - 1, y: outputSize - 1 },
      { x: 0, y: outputSize - 1 }
    ];
    
    // 计算透视变换矩阵：从源四边形到目标正方形
    // 暂时禁用透视变换，先使用简单缩放确保能生成图像
    // TODO: 修复透视变换后重新启用
    let forwardTransform;
    let inverseTransform;
    let usePerspectiveTransform = false; // 暂时禁用，先确保基本功能正常
    
    try {
      forwardTransform = calculatePerspectiveMatrix(srcCorners, dstCorners);
      
      // 检查变换矩阵是否有效
      if (forwardTransform && 
          isFinite(forwardTransform.a11) && isFinite(forwardTransform.a12) && isFinite(forwardTransform.a13) &&
          isFinite(forwardTransform.a21) && isFinite(forwardTransform.a22) && isFinite(forwardTransform.a23) &&
          isFinite(forwardTransform.a31) && isFinite(forwardTransform.a32) && isFinite(forwardTransform.a33)) {
        // 计算逆变换矩阵：从目标正方形到源四边形（用于采样）
        inverseTransform = invertPerspectiveMatrix(forwardTransform);
        
        // 检查逆变换矩阵是否有效
        if (inverseTransform && 
            isFinite(inverseTransform.a11) && isFinite(inverseTransform.a12) && isFinite(inverseTransform.a13) &&
            isFinite(inverseTransform.a21) && isFinite(inverseTransform.a22) && isFinite(inverseTransform.a23) &&
            isFinite(inverseTransform.a31) && isFinite(inverseTransform.a32) && isFinite(inverseTransform.a33)) {
          // 暂时仍然禁用，等基本功能验证后再启用
          // usePerspectiveTransform = true;
        }
      }
    } catch (error) {
        // 透视变换计算出错，使用简单裁剪
    }
    
    // 1. 使用透视变换生成矫正后的图像（保持原分辨率）
    let croppedImage = new ImageData(outputSize, outputSize);
    
    // 辅助函数：从原始图像获取像素值（带边界检查）
    function getPixel(x, y) {
      const ix = Math.floor(x);
      const iy = Math.floor(y);
      if (ix < 0 || ix >= width || iy < 0 || iy >= height) {
        return { r: 255, g: 255, b: 255, a: 0 }; // 超出边界返回白色透明
      }
      const idx = (iy * width + ix) * 4;
      return {
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2],
        a: data[idx + 3]
      };
    }
    
    // 双线性插值采样
    function bilinearSample(x, y) {
      const x1 = Math.floor(x);
      const y1 = Math.floor(y);
      const x2 = x1 + 1;
      const y2 = y1 + 1;
      const fx = x - x1;
      const fy = y - y1;
      
      const p11 = getPixel(x1, y1);
      const p21 = getPixel(x2, y1);
      const p12 = getPixel(x1, y2);
      const p22 = getPixel(x2, y2);
      
      // 双线性插值
      const r = (1 - fx) * (1 - fy) * p11.r + fx * (1 - fy) * p21.r +
                (1 - fx) * fy * p12.r + fx * fy * p22.r;
      const g = (1 - fx) * (1 - fy) * p11.g + fx * (1 - fy) * p21.g +
                (1 - fx) * fy * p12.g + fx * fy * p22.g;
      const b = (1 - fx) * (1 - fy) * p11.b + fx * (1 - fy) * p21.b +
                (1 - fx) * fy * p12.b + fx * fy * p22.b;
      const a = (1 - fx) * (1 - fy) * p11.a + fx * (1 - fy) * p21.a +
                (1 - fx) * fy * p12.a + fx * fy * p22.a;
      
      return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a: Math.round(a) };
    }
    
    // 应用透视变换填充矫正后的图像
    // 先尝试使用透视变换，如果失败则回退到简单缩放
    let transformSuccess = false;
    
    if (usePerspectiveTransform && inverseTransform) {
      // 使用透视变换
      let validPixelCount = 0;
      for (let y = 0; y < outputSize; y++) {
        for (let x = 0; x < outputSize; x++) {
          // 使用逆变换将目标坐标转换为源坐标
          const denominator = inverseTransform.a13 * x + inverseTransform.a23 * y + inverseTransform.a33;
          
          // 检查分母是否为0或无效
          if (Math.abs(denominator) < 1e-10 || !isFinite(denominator)) {
            continue; // 跳过这个像素，稍后用回退方法填充
          }
          
          const srcX = (inverseTransform.a11 * x + inverseTransform.a21 * y + inverseTransform.a31) / denominator;
          const srcY = (inverseTransform.a12 * x + inverseTransform.a22 * y + inverseTransform.a32) / denominator;
          
          // 检查源坐标是否有效且在图像范围内
          if (!isFinite(srcX) || !isFinite(srcY)) {
            continue; // 跳过这个像素
          }
          
          // 检查坐标是否在合理范围内（允许一些边界外的采样）
          if (srcX < -10 || srcX > width + 10 || srcY < -10 || srcY > height + 10) {
            continue; // 坐标太远，跳过
          }
          
          // 使用双线性插值采样
          const pixel = bilinearSample(srcX, srcY);
          const dstIdx = (y * outputSize + x) * 4;
          croppedImage.data[dstIdx] = pixel.r;
          croppedImage.data[dstIdx + 1] = pixel.g;
          croppedImage.data[dstIdx + 2] = pixel.b;
          croppedImage.data[dstIdx + 3] = pixel.a;
          validPixelCount++;
        }
      }
      
      // 如果有效像素太少（少于10%），认为透视变换失败
      if (validPixelCount < outputSize * outputSize * 0.1) {
        // 透视变换有效像素太少，使用简单缩放
        transformSuccess = false;
      } else {
        transformSuccess = true;
      }
    }
    
    // 如果透视变换失败或未使用，使用简单缩放
    if (!transformSuccess) {
      // 回退到简单缩放：将边界框区域缩放到正方形
      const cropWidth = maxX - minX + 1;
      const cropHeight = maxY - minY + 1;
      
      // 确保裁剪区域有效
      if (cropWidth <= 0 || cropHeight <= 0 || !isFinite(cropWidth) || !isFinite(cropHeight)) {
        // 裁剪区域无效，使用整个图像
        // 如果裁剪区域无效，使用整个图像
        for (let y = 0; y < outputSize; y++) {
          for (let x = 0; x < outputSize; x++) {
            const srcX = (x / (outputSize - 1)) * (width - 1);
            const srcY = (y / (outputSize - 1)) * (height - 1);
            const pixel = bilinearSample(srcX, srcY);
            const dstIdx = (y * outputSize + x) * 4;
            croppedImage.data[dstIdx] = pixel.r;
            croppedImage.data[dstIdx + 1] = pixel.g;
            croppedImage.data[dstIdx + 2] = pixel.b;
            croppedImage.data[dstIdx + 3] = pixel.a;
          }
        }
      } else {
        // 使用边界框进行缩放
        for (let y = 0; y < outputSize; y++) {
          for (let x = 0; x < outputSize; x++) {
            // 将目标坐标映射到源图像的边界框
            const srcX = minX + (x / (outputSize - 1)) * (cropWidth - 1);
            const srcY = minY + (y / (outputSize - 1)) * (cropHeight - 1);
            
            // 确保坐标在有效范围内
            const clampedX = Math.max(0, Math.min(width - 1, srcX));
            const clampedY = Math.max(0, Math.min(height - 1, srcY));
            
            // 使用双线性插值采样
            const pixel = bilinearSample(clampedX, clampedY);
            const dstIdx = (y * outputSize + x) * 4;
            croppedImage.data[dstIdx] = pixel.r;
            croppedImage.data[dstIdx + 1] = pixel.g;
            croppedImage.data[dstIdx + 2] = pixel.b;
            croppedImage.data[dstIdx + 3] = pixel.a;
          }
        }
      }
    }
    
    // 2. 生成模块矩阵（用于生成 SVG 点阵）
    // 计算平均灰度值用于自适应阈值
    let sumGray = 0;
    let count = 0;
    for (let y = 0; y < outputSize; y++) {
      for (let x = 0; x < outputSize; x++) {
        const idx = (y * outputSize + x) * 4;
        const r = croppedImage.data[idx];
        const g = croppedImage.data[idx + 1];
        const b = croppedImage.data[idx + 2];
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        sumGray += gray;
        count++;
      }
    }
    const avgGray = sumGray / count;
    const threshold = avgGray;
    
    // 创建模块矩阵（基于 dimension，不是像素数）
    let moduleMatrix = {
      width: dimension,
      height: dimension,
      data: new Uint8ClampedArray(dimension * dimension),
      get: function(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
          return false;
        }
        return !!this.data[y * this.width + x];
      }
    };
    
    // 判断是否是定位点区域（三个7x7的定位点）
    function isFinderPattern(x, y, dim) {
      // 左上角定位点 (0,0) 到 (6,6)
      if (x <= 6 && y <= 6) return true;
      // 右上角定位点 (dim-7,0) 到 (dim-1,6)
      if (x >= dim - 7 && y <= 6) return true;
      // 左下角定位点 (0,dim-7) 到 (6,dim-1)
      if (x <= 6 && y >= dim - 7) return true;
      return false;
    }
    
    // 生成标准定位点图案（7x7 回字形）
    function getFinderPatternValue(x, y, finderX, finderY) {
      // 定位点内的相对坐标
      const relX = x - finderX;
      const relY = y - finderY;
      
      if (relX === 0 || relX === 6 || relY === 0 || relY === 6) {
        return 1; // 外圈：黑
      }
      if (relX === 1 || relX === 5 || relY === 1 || relY === 5) {
        return 0; // 中间：白
      }
      if (relX === 2 || relX === 4 || relY === 2 || relY === 4) {
        return 1; // 内圈：黑
      }
      return 1; // 中心（3,3）：黑
    }
    
    // 将裁剪区域映射到模块矩阵（先识别所有区域，包括定位点）
    // 定位点稍后在翻转后再硬编码替换
    for (let y = 0; y < dimension; y++) {
      for (let x = 0; x < dimension; x++) {
        // 计算每个模块在矫正后图像中的像素范围
        const moduleWidth = outputSize / dimension;   // 每个模块的宽度（像素）
        const moduleHeight = outputSize / dimension;   // 每个模块的高度（像素）
        
        // 计算当前模块在矫正后图像中的像素范围
        const startX = Math.floor(x * moduleWidth);
        const endX = Math.floor((x + 1) * moduleWidth);
        const startY = Math.floor(y * moduleHeight);
        const endY = Math.floor((y + 1) * moduleHeight);
        
        // 采样该模块区域内的像素点，计算平均灰度值
        let sumGray = 0;
        let count = 0;
        
        // 采样策略：如果模块区域较大，采样多个点；如果较小，采样所有点
        const moduleSize = Math.min(endX - startX, endY - startY);
        const sampleStep = moduleSize > 5 ? Math.max(1, Math.floor(moduleSize / 3)) : 1;
        
        for (let py = startY; py < endY; py += sampleStep) {
          for (let px = startX; px < endX; px += sampleStep) {
            if (px >= 0 && px < outputSize && py >= 0 && py < outputSize) {
              const idx = (py * outputSize + px) * 4;
              const r = croppedImage.data[idx];
              const g = croppedImage.data[idx + 1];
              const b = croppedImage.data[idx + 2];
              const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
              sumGray += gray;
              count++;
            }
          }
        }
        
        // 根据平均灰度值决定黑白
        if (count > 0) {
          const avgGray = sumGray / count;
          moduleMatrix.data[y * dimension + x] = avgGray < threshold ? 1 : 0;
        } else {
          // 如果无法采样，默认设为白色
          moduleMatrix.data[y * dimension + x] = 0;
        }
      }
    }

    // 如果检测到需要镜像，水平翻转模块矩阵和 croppedImage
    if (needsMirror) {
      // 翻转模块矩阵
      const flippedMatrix = {
        width: moduleMatrix.width,
        height: moduleMatrix.height,
        data: new Uint8ClampedArray(moduleMatrix.data.length),
        get: function(x, y) {
          if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
          }
          return !!this.data[y * this.width + x];
        }
      };
      
      // 水平翻转：目标位置 (x, y) 的值应该来自源位置 (dimension - 1 - x, y)
      // 也就是说：flippedMatrix[x, y] = moduleMatrix[dimension - 1 - x, y]
      for (let y = 0; y < dimension; y++) {
        for (let x = 0; x < dimension; x++) {
          const srcX = dimension - 1 - x; // 源位置 x 坐标
          const srcIdx = y * dimension + srcX; // 源数据索引
          const dstIdx = y * dimension + x; // 目标数据索引
          flippedMatrix.data[dstIdx] = moduleMatrix.data[srcIdx];
        }
      }
      
      // 赋值翻转后的矩阵
      moduleMatrix = flippedMatrix;
      
      // 同时翻转 croppedImage（用于显示的图像）
      // 先创建一个临时缓冲区来存储翻转后的数据
      const flippedData = new Uint8ClampedArray(croppedImage.data.length);
      for (let y = 0; y < outputSize; y++) {
        for (let x = 0; x < outputSize; x++) {
          const sourceX = outputSize - 1 - x; // 源位置 x 坐标（水平翻转）
          const srcIdx = (y * outputSize + sourceX) * 4; // 源像素的 RGBA 索引
          const dstIdx = (y * outputSize + x) * 4; // 目标像素的 RGBA 索引
          
          // 复制 RGBA 四个通道
          flippedData[dstIdx] = croppedImage.data[srcIdx];         // R
          flippedData[dstIdx + 1] = croppedImage.data[srcIdx + 1]; // G
          flippedData[dstIdx + 2] = croppedImage.data[srcIdx + 2]; // B
          flippedData[dstIdx + 3] = croppedImage.data[srcIdx + 3]; // A
        }
      }
      
      // 将翻转后的数据复制回 croppedImage.data
      croppedImage.data.set(flippedData);
    }
    
    // 检测二维码是否反色（白码黑底）
    // 通过检查定位点的实际颜色来判断：定位点中心应该是黑色，外围应该是白色
    // 如果发现中心是白色而外围是黑色，说明是反色的
    let isInverted = false;
    
    // 在硬编码定位点之前，先检查实际图像中的定位点颜色
    // 检查左上角定位点的中心区域（约3,3）和外围区域（约0,0或6,6）的平均灰度
    const finderModuleSize = outputSize / dimension;
    const centerStartX = Math.floor(2.5 * finderModuleSize);
    const centerEndX = Math.floor(3.5 * finderModuleSize);
    const centerStartY = Math.floor(2.5 * finderModuleSize);
    const centerEndY = Math.floor(3.5 * finderModuleSize);
    const outerStartX = Math.floor(0.5 * finderModuleSize);
    const outerEndX = Math.floor(1.5 * finderModuleSize);
    const outerStartY = Math.floor(0.5 * finderModuleSize);
    const outerEndY = Math.floor(1.5 * finderModuleSize);
    
    let centerGraySum = 0;
    let centerCount = 0;
    let outerGraySum = 0;
    let outerCount = 0;
    
    for (let y = centerStartY; y < centerEndY && y < outputSize; y++) {
      for (let x = centerStartX; x < centerEndX && x < outputSize; x++) {
        const idx = (y * outputSize + x) * 4;
        if (idx < croppedImage.data.length) {
          const gray = 0.2126 * croppedImage.data[idx] + 
                       0.7152 * croppedImage.data[idx + 1] + 
                       0.0722 * croppedImage.data[idx + 2];
          centerGraySum += gray;
          centerCount++;
        }
      }
    }
    
    for (let y = outerStartY; y < outerEndY && y < outputSize; y++) {
      for (let x = outerStartX; x < outerEndX && x < outputSize; x++) {
        const idx = (y * outputSize + x) * 4;
        if (idx < croppedImage.data.length) {
          const gray = 0.2126 * croppedImage.data[idx] + 
                       0.7152 * croppedImage.data[idx + 1] + 
                       0.0722 * croppedImage.data[idx + 2];
          outerGraySum += gray;
          outerCount++;
        }
      }
    }
    
    if (centerCount > 0 && outerCount > 0) {
      const centerAvgGray = centerGraySum / centerCount;
      const outerAvgGray = outerGraySum / outerCount;
      
      // 如果中心比外围亮（反色），则需要对整个矩阵取反
      if (centerAvgGray > outerAvgGray + 30) {  // 增加阈值，避免误判
        isInverted = true;
      }
    }
    
    // 如果检测到反色，只对数据区域（非定位点）取反（1变0，0变1）
    // 定位点区域跳过，因为定位点会硬编码为标准值
    if (isInverted) {
      for (let y = 0; y < dimension; y++) {
        for (let x = 0; x < dimension; x++) {
          // 跳过定位点区域，只对数据区域取反
          if (!isFinderPattern(x, y, dimension)) {
            const idx = y * dimension + x;
            moduleMatrix.data[idx] = moduleMatrix.data[idx] === 1 ? 0 : 1;
          }
        }
      }
    }
    
    // 无论是否需要镜像或反色，都使用硬编码的标准定位点替换定位点区域
    // 这样可以确保定位点总是标准的，不受识别误差影响
    // 定位点不需要取反，因为它是按照标准硬编码的
    for (let y = 0; y < dimension; y++) {
      for (let x = 0; x < dimension; x++) {
        if (isFinderPattern(x, y, dimension)) {
          let finderX, finderY;
          if (x <= 6 && y <= 6) {
            // 左上角
            finderX = 0;
            finderY = 0;
          } else if (x >= dimension - 7 && y <= 6) {
            // 右上角
            finderX = dimension - 7;
            finderY = 0;
          } else {
            // 左下角
            finderX = 0;
            finderY = dimension - 7;
          }
          const patternValue = getFinderPatternValue(x, y, finderX, finderY);
          // 定位点总是按照标准硬编码，不需要取反
          moduleMatrix.data[y * dimension + x] = patternValue;
        }
      }
    }

    return {
      croppedImage: croppedImage, // 如果进行了镜像翻转，这里应该是翻转后的图像
      moduleMatrix: moduleMatrix  // 如果进行了镜像翻转，这里应该是翻转后的矩阵
    };
  }

  /**
   * 计算透视变换矩阵的逆矩阵
   * @param {Object} matrix - 3x3 透视变换矩阵
   * @returns {Object} 逆变换矩阵
   */
  function invertPerspectiveMatrix(matrix) {
    // 计算3x3矩阵的行列式
    const det = 
      matrix.a11 * (matrix.a22 * matrix.a33 - matrix.a23 * matrix.a32) -
      matrix.a12 * (matrix.a21 * matrix.a33 - matrix.a23 * matrix.a31) +
      matrix.a13 * (matrix.a21 * matrix.a32 - matrix.a22 * matrix.a31);
    
    if (Math.abs(det) < 1e-10) {
      // 如果行列式接近0，返回单位矩阵
      return {
        a11: 1, a12: 0, a13: 0,
        a21: 0, a22: 1, a23: 0,
        a31: 0, a32: 0, a33: 1
      };
    }
    
    // 计算伴随矩阵并除以行列式
    const invDet = 1 / det;
    return {
      a11: (matrix.a22 * matrix.a33 - matrix.a23 * matrix.a32) * invDet,
      a12: (matrix.a13 * matrix.a32 - matrix.a12 * matrix.a33) * invDet,
      a13: (matrix.a12 * matrix.a23 - matrix.a13 * matrix.a22) * invDet,
      a21: (matrix.a23 * matrix.a31 - matrix.a21 * matrix.a33) * invDet,
      a22: (matrix.a11 * matrix.a33 - matrix.a13 * matrix.a31) * invDet,
      a23: (matrix.a13 * matrix.a21 - matrix.a11 * matrix.a23) * invDet,
      a31: (matrix.a21 * matrix.a32 - matrix.a22 * matrix.a31) * invDet,
      a32: (matrix.a12 * matrix.a31 - matrix.a11 * matrix.a32) * invDet,
      a33: (matrix.a11 * matrix.a22 - matrix.a12 * matrix.a21) * invDet
    };
  }

  /**
   * 计算透视变换矩阵（3x3矩阵）
   * 将源四边形的四个角点映射到目标正方形的四个角点
   */
  function calculatePerspectiveMatrix(src, dst) {
    // 使用直接线性变换（DLT）算法计算透视变换矩阵
    // 构建方程组 A * h = 0，其中 h 是变换矩阵的9个参数
    
    const A = [];
    
    for (let i = 0; i < 4; i++) {
      const x = src[i].x;
      const y = src[i].y;
      const u = dst[i].x;
      const v = dst[i].y;
      
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, -u]);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y, -v]);
    }
    
    // 使用简化的方法：假设 a33 = 1，求解其他8个参数
    // 构建 8x8 矩阵
    const M = [];
    const b = [];
    
    for (let i = 0; i < 4; i++) {
      const x = src[i].x;
      const y = src[i].y;
      const u = dst[i].x;
      const v = dst[i].y;
      
      M.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
      b.push(u);
      
      M.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
      b.push(v);
    }
    
    // 求解线性方程组（使用高斯消元法简化版）
    // 这里使用更简单的方法：直接计算
    const h = solveLinearSystem(M, b);
    
    return {
      a11: h[0], a12: h[1], a13: h[2],
      a21: h[3], a22: h[4], a23: h[5],
      a31: h[6], a32: h[7], a33: 1
    };
  }

  /**
   * 求解线性方程组（简化版，适用于8x8系统）
   */
  function solveLinearSystem(A, b) {
    const n = A.length;
    const augmented = A.map((row, i) => [...row, b[i]]);
    
    // 高斯消元法
    for (let i = 0; i < n; i++) {
      // 找到主元
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      
      // 交换行
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      
      // 消元
      for (let k = i + 1; k < n; k++) {
        const factor = augmented[k][i] / augmented[i][i];
        for (let j = i; j < n + 1; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
    
    // 回代
    const x = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      x[i] = augmented[i][n];
      for (let j = i + 1; j < n; j++) {
        x[i] -= augmented[i][j] * x[j];
      }
      x[i] /= augmented[i][i];
    }
    
    return x;
  }

  /**
   * 自动识别并矫正二维码图像
   * @param {Uint8ClampedArray} data - RGBA 格式的图像数据
   * @param {number} width - 图像宽度
   * @param {number} height - 图像高度
   * @param {Object} options - 可选配置
   * @param {string} options.inversionAttempts - 反转尝试模式: "attemptBoth" | "invertFirst" | "onlyInvert" | "dontInvert"
   * @returns {Object} 返回结果对象
   *   - success: {boolean} 是否成功
   *   - matrix: {BitMatrix} 矫正后的二维码矩阵（成功时）
   *   - dimension: {number} 二维码尺寸/行列数（成功时）
   *   - location: {Object} 二维码位置信息（成功时）
   *   - error: {string} 错误信息（失败时）
   */
  function jsQRCorrect(data, width, height, options) {
    options = options || {};
    const inversionAttempts = options.inversionAttempts || 'attemptBoth';

    // 参数验证
    if (!data || !(data instanceof Uint8ClampedArray)) {
      return {
        success: false,
        error: '无效的图像数据：必须是 Uint8ClampedArray 类型'
      };
    }

    if (data.length !== width * height * 4) {
      return {
        success: false,
        error: `图像数据长度不匹配：期望 ${width * height * 4}，实际 ${data.length}`
      };
    }

    if (typeof width !== 'number' || width <= 0 || typeof height !== 'number' || height <= 0) {
      return {
        success: false,
        error: '无效的图像尺寸'
      };
    }

    // 检查 jsQR 是否可用
    if (typeof jsQR === 'undefined') {
      return {
        success: false,
        error: 'jsQR 库未加载，请先引入 jsQR.js'
      };
    }

    try {
      // 预处理：处理透明图片
      // 先填充透明背景，这样预览图会显示带背景的图
      let processedData = data;
      let processedWidth = width;
      let processedHeight = height;
      
      // 检查是否有透明像素，如果有，填充灰色背景
      let hasTransparency = false;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) {
          hasTransparency = true;
          break;
        }
      }
      
      if (hasTransparency) {
        // 创建填充灰色背景的新图像数据
        processedData = new Uint8ClampedArray(data.length);
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3] / 255;
          const gray = 128; // 灰色背景（RGB都是128）
          
          // 混合原色和灰色背景
          processedData[i] = Math.round(data[i] * alpha + gray * (1 - alpha));     // R
          processedData[i + 1] = Math.round(data[i + 1] * alpha + gray * (1 - alpha)); // G
          processedData[i + 2] = Math.round(data[i + 2] * alpha + gray * (1 - alpha)); // B
          processedData[i + 3] = 255; // A（完全不透明）
        }
      }
      
      // 使用填充背景后的数据进行识别
      // jsQR基于定位角识别，理论上不应该受图标干扰
      const decodeResult = jsQR(processedData, processedWidth, processedHeight, {
        inversionAttempts: inversionAttempts
      });

      if (!decodeResult || !decodeResult.location) {
        return {
          success: false,
          error: '未检测到二维码，请确保图像中包含清晰的二维码'
        };
      }

      // 从原始图像数据中提取并矫正二维码区域
      const loc = decodeResult.location;
      
      // 使用 jsQR 返回的版本信息来获取准确的尺寸
      // QR码的标准尺寸公式：dimension = 21 + 4 * (version - 1)
      let dimension = 21; // 默认版本1
      if (decodeResult.version) {
        dimension = 21 + 4 * (decodeResult.version - 1);
      } else {
        // 如果没有版本信息，通过定位点距离估算
        // 兼容不同的属性名
        const topLeftFP = loc.topLeft || loc.topLeftFinderPattern;
        const topRightFP = loc.topRight || loc.topRightFinderPattern;
        const bottomLeftFP = loc.bottomLeft || loc.bottomLeftFinderPattern;
        
        if (!topLeftFP || !topRightFP || !bottomLeftFP) {
          return {
            success: false,
            error: 'location 对象缺少必要的定位点信息'
          };
        }
        
        const dist1 = Math.sqrt(
          Math.pow(topRightFP.x - topLeftFP.x, 2) + 
          Math.pow(topRightFP.y - topLeftFP.y, 2)
        );
        const dist2 = Math.sqrt(
          Math.pow(bottomLeftFP.x - topLeftFP.x, 2) + 
          Math.pow(bottomLeftFP.y - topLeftFP.y, 2)
        );
        
        // 定位点之间的距离大约是 7 个模块（定位点本身是 7x7）
        const moduleSize = (dist1 + dist2) / 14;
        const estimatedDimension = Math.round((dist1 + dist2) / 2 / moduleSize) + 7;
        
        // 将估算值对齐到标准 QR 码尺寸（21, 25, 29, 33, 37, 41, ...）
        const standardDimensions = [21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 69, 73, 77, 81, 85, 89, 93, 97, 101, 105, 109, 113, 117, 121, 125, 129, 133, 137, 141, 145, 149, 153, 157, 161, 165, 169, 173, 177];
        dimension = standardDimensions.reduce((prev, curr) => 
          Math.abs(curr - estimatedDimension) < Math.abs(prev - estimatedDimension) ? curr : prev
        );
      }
      
      // 从预处理后的图像中提取二维码区域
      // 返回原图裁剪区域（保持原分辨率）和模块矩阵（用于生成 SVG）
      // 如果原图有透明背景，processedData 已填充灰色背景，预览图会显示带背景的图
      const result = extractAndCorrectQRCode(processedData, processedWidth, processedHeight, loc, dimension);
      
      if (!result || !result.croppedImage || !result.moduleMatrix) {
        return {
          success: false,
          error: '二维码提取和矫正失败'
        };
      }

      return {
        success: true,
        matrix: result.moduleMatrix, // 模块矩阵（用于生成 SVG）
        croppedImage: result.croppedImage, // 原图裁剪区域（用于显示）
        dimension: dimension,
        location: loc,
        decodeResult: decodeResult
      };

    } catch (error) {
      return {
        success: false,
        error: `处理过程中发生错误: ${error.message || error}`
      };
    }
  }

  /**
   * 将矫正后的 BitMatrix 转换为 Canvas ImageData
   * @param {BitMatrix} matrix - 矫正后的二维码矩阵
   * @returns {ImageData} Canvas ImageData 对象
   */
  function matrixToImageData(matrix) {
    if (!matrix || typeof matrix.get !== 'function') {
      throw new Error('无效的矩阵对象');
    }

    const width = matrix.width;
    const height = matrix.height;
    const imageData = new ImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const isBlack = matrix.get(x, y);
        const value = isBlack ? 0 : 255;
        
        imageData.data[index] = value;     // R
        imageData.data[index + 1] = value;  // G
        imageData.data[index + 2] = value;  // B
        imageData.data[index + 3] = 255;    // A
      }
    }

    return imageData;
  }

  /**
   * 将矫正后的 BitMatrix 转换为 SVG 字符串
   * 使用 use 元素克隆模板
   * @param {BitMatrix} matrix - 矫正后的二维码矩阵
   * @param {Object} options - 可选配置
   * @param {number} options.cellSize - 每个单元格的尺寸（像素），默认 10
   * @param {string} options.fillColor - 填充颜色，默认 '#000000'
   * @param {string} options.backgroundColor - 背景颜色，默认 '#ffffff'
   * @returns {string} SVG 字符串
   */
  function matrixToSVG(matrix, options) {
    if (!matrix || typeof matrix.get !== 'function') {
      throw new Error('无效的矩阵对象');
    }

    options = options || {};
    const cellSize = options.cellSize || 10;
    // 使用非黑白颜色，避免反色问题（深灰色和浅灰色）
    const fillColor = options.fillColor || '#333333';  // 深灰色代替黑色
    const backgroundColor = options.backgroundColor || '#cccccc';  // 浅灰色代替白色

    const width = matrix.width;
    const height = matrix.height;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="100%" height="100%">`;
    
    // 定义区域：填充块和背景块模板（使用非黑白颜色）
    svg += `<defs>`;
    svg += `<rect id="cell-fill" fill="${fillColor}" width="1" height="1"/>`;
    svg += `<rect id="cell-bg" fill="${backgroundColor}" width="1" height="1"/>`;
    svg += `</defs>`;
    
    // 为每个位置生成完整的点阵，使用 use 元素引用对应的模板
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const isFill = matrix.get(x, y);  // 1表示填充（原黑色），0表示背景（原白色）
        const templateId = isFill ? 'cell-fill' : 'cell-bg';
        svg += `<use xlink:href="#${templateId}" x="${x}" y="${y}"/>`;
      }
    }
    
    svg += '</svg>';
    return svg;
  }

  /**
   * 将矫正后的 BitMatrix 转换为二维数组（用于生成 SVG rect 元素）
   * @param {BitMatrix} matrix - 矫正后的二维码矩阵
   * @returns {Array<Array<boolean>>} 二维数组，true 表示黑色，false 表示白色
   */
  function matrixToArray(matrix) {
    if (!matrix || typeof matrix.get !== 'function') {
      throw new Error('无效的矩阵对象');
    }

    const width = matrix.width;
    const height = matrix.height;
    const result = [];

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(matrix.get(x, y));
      }
      result.push(row);
    }

    return result;
  }

  // 导出到全局
  if (typeof window !== 'undefined') {
    window.jsQRCorrect = jsQRCorrect;
    window.jsQRCorrect.matrixToImageData = matrixToImageData;
    window.jsQRCorrect.matrixToSVG = matrixToSVG;
    window.jsQRCorrect.matrixToArray = matrixToArray;
  }

  // 支持 CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      correct: jsQRCorrect,
      matrixToImageData: matrixToImageData,
      matrixToSVG: matrixToSVG,
      matrixToArray: matrixToArray
    };
  }

})();

