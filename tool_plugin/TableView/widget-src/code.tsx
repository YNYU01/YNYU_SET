const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, waitForTask, Rectangle, Frame, Line, useEffect } = widget

// 颜色转换辅助函数
function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
        a: 1,
      }
    : null
}

// HSL 转 RGB
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = h / 360
  s = s / 100
  l = l / 100
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

// RGB 转 Hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

// RGB 转 HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r = r / 255
  g = g / 255
  b = b / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// 从 Hex 颜色提取 HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  
  const r = Math.round(rgb.r * 255)
  const g = Math.round(rgb.g * 255)
  const b = Math.round(rgb.b * 255)
  
  return rgbToHsl(r, g, b)
}

// 颜色映射配置类型
type ColorMappingConfig = {
  // 主题色作用在哪个部位（primaryTarget 使用主题色的完整 HSL）
  // 如果为 null 或 undefined，表示主题色不直接赋予任何部位，所有部位都基于主题色计算衍生值
  primaryTarget?: 'bgColor' | 'headerFillColor' | 'cellFillColor' | null
  // 饱和度阈值范围（用于控制整体饱和度范围，有的样式很灰，有的很纯）
  saturationRange?: { min: number, max: number } // 默认不限制，使用原始饱和度
  // 有效色阶范围（1-15）：用于限制色阶的使用范围
  // 如 1-15 是全色阶，3-8 是集中暗色，8-15 是集中亮色
  // 当 isSpaceBetween 为 true 时，min-max 变成要剔除的色阶区间（用于取极暗极亮）
  lightnessRange?: { 
    min: number, 
    max: number, // 色阶范围 1-15
    isSpaceBetween?: boolean, // 如果为 true，min-max 是要剔除的区间，否则是有效范围
    defaultLevel?: number // 建议的色阶值（1-15），用于当当前色阶不在有效范围内时自动调整
  }
  // RGB 偏移（色彩平衡）：用于实现复古主题等效果
  // R 正值偏黄/暖色，负值偏紫/冷色
  // G 正值偏绿，负值偏品红
  // B 正值偏蓝，负值偏黄
  rgbOffset?: { r?: number, g?: number, b?: number } // 范围通常 -50 到 +50
  // 其他部位的计算规则
  bgColor?: { 
    lightnessOffset?: number, 
    saturationOffset?: number, 
    saturationMultiplier?: number,
    color?: 'black' | 'white', // 直接指定为黑色或白色
    rgbOffset?: { r?: number, g?: number, b?: number } // 部位级别的 RGB 偏移（会叠加到全局偏移）
  }
  headerFillColor?: { 
    lightnessOffset?: number, 
    saturationOffset?: number, 
    saturationMultiplier?: number,
    color?: 'black' | 'white',
    rgbOffset?: { r?: number, g?: number, b?: number }
  }
  cellFillColor?: { 
    lightnessOffset?: number, 
    saturationOffset?: number, 
    saturationMultiplier?: number,
    color?: 'black' | 'white',
    rgbOffset?: { r?: number, g?: number, b?: number },
    opacity?: number // 透明度，范围 0-1，默认 0.4
  }
  headerTextColor?: { 
    contrastThreshold?: number, // 根据亮度自动判断，threshold 是判断阈值（默认使用黑白）
    color?: 'black' | 'white' | 'theme' // 直接指定为黑色、白色或主题色
  }
  cellTextColor?: { 
    contrastThreshold?: number,
    color?: 'black' | 'white' | 'theme'
  }
  strokeColor?: { 
    lightnessOffset?: number, 
    relativeTo?: 'headerFillColor' | 'cellFillColor' | 'bgColor', // 相对于某个颜色的亮度偏移
    color?: 'black' | 'white' | 'theme', // 直接指定为黑色、白色或主题色
    rgbOffset?: { r?: number, g?: number, b?: number }
  }
}

// 颜色映射预设方案
const colorMappingPresets: Record<string, ColorMappingConfig> = {
  'Normal': {//普通
    primaryTarget: 'bgColor',
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 10, max: 90},
    lightnessRange: { min: 5, max: 10, isSpaceBetween: true, defaultLevel: 11 },
    bgColor: {}, // 使用主题色
    headerFillColor: { lightnessOffset: 13, saturationMultiplier: 0.8 },
    cellFillColor: { lightnessOffset: 13, saturationMultiplier: 0.8 },
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { lightnessOffset: 20, relativeTo: 'headerFillColor' }
  },
  'Soft': {//柔和
    primaryTarget: 'bgColor',
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 10, max: 80 },
    lightnessRange: { min: 6, max: 10, isSpaceBetween: true, defaultLevel: 13 },
    bgColor: {}, // 使用主题色
    headerFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
    cellFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { lightnessOffset: 10, relativeTo: 'headerFillColor' }
  },
  'Fashion': {//时尚
    primaryTarget: 'headerFillColor',
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 50, max: 90 },
    lightnessRange: { min: 9, max: 11, defaultLevel: 10},
    bgColor: {lightnessOffset: 405, saturationMultiplier: 0.95},
    headerFillColor: {},
    cellFillColor: { lightnessOffset: 10, saturationMultiplier: 1 ,opacity: 0.3},
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { lightnessOffset: 0.1, relativeTo: 'headerFillColor' }
  },
  'Contrast': {//对比
    // primaryTarget 设为 null，表示主题色不直接赋予任何部位，所有部位都基于主题色计算衍生值
    primaryTarget: null,
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 50, max: 90 },
    lightnessRange: { min: 9, max: 15, defaultLevel: 12},
    bgColor: {color: 'white'},
    headerFillColor: {color: 'black'},
    cellFillColor: { lightnessOffset: 0, saturationMultiplier: 1, opacity: 0.8 },
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { color: 'black' }
  },
  'Vivid': {//鲜艳
    primaryTarget: 'bgColor',
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 80, max: 100 },
    lightnessRange: { min: 1, max: 13, defaultLevel: 10},
    bgColor: {}, // 使用主题色
    headerFillColor: { lightnessOffset: 25, saturationMultiplier: 0.9 },
    cellFillColor: { lightnessOffset: 25, saturationMultiplier: 0.9 },
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { lightnessOffset: 10, relativeTo: 'bgColor' }
  },
  'Pastel': {//粉嫩
    primaryTarget: 'bgColor',
    rgbOffset: { r: -10, g: -40, b: 20 },
    saturationRange: { min: 40, max: 100 },
    lightnessRange: { min: 12, max: 15, defaultLevel: 14},
    bgColor: {}, // 使用主题色
    headerFillColor: { lightnessOffset: 15, saturationMultiplier: 0.9 },
    cellFillColor: { lightnessOffset: 15, saturationMultiplier: 0.9 },
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { lightnessOffset: 10, relativeTo: 'bgColor' }
  },
  'Retro': {//复古
    primaryTarget: 'bgColor',
    rgbOffset: { r: 40, g: 30, b: -20 },
    saturationRange: { min: 10, max: 70 },
    lightnessRange: { min: 1, max: 14, defaultLevel: 10},
    bgColor: {}, // 使用主题色
    headerFillColor: { lightnessOffset: 30, saturationMultiplier: 0.5 },
    cellFillColor: { lightnessOffset: 30, saturationMultiplier: 0.5},
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { lightnessOffset: 0, relativeTo: 'bgColor' }
  },
  'Neon': {//霓虹
    primaryTarget: null,
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 80, max: 100 },
    lightnessRange: { min: 5, max: 12, defaultLevel: 7 },
    bgColor: {color: 'black'}, 
    headerFillColor: { lightnessOffset: 5, saturationMultiplier: 1 },
    cellFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
    headerTextColor: { color: 'black' },
    cellTextColor: { color: 'theme' },
    strokeColor: { color: 'theme'}
  },
}

// 从主题色计算表格颜色（接受主题色、色阶、映射配置和颜色模式）
function calculateThemeColors(
  themeColorHex: string, 
  levelColorHex: string,
  mappingConfig: ColorMappingConfig,
  colorMode: 'color' | 'monochrome' = 'color'
): {
  bgColor: string
  headerFillColor: string
  headerTextColor: string
  cellFillColor: string
  cellTextColor: string
  strokeColor: string
} {
  // 从主题色提取 HSL
  const themeHsl = hexToHsl(themeColorHex)
  if (!themeHsl) {
    // 如果解析失败，使用默认值
    return {
      bgColor: '#2D2D2D',
      headerFillColor: '#3D3D3D',
      headerTextColor: '#FFFFFF',
      cellFillColor: '#2D2D2D',
      cellTextColor: '#D4D4D4',
      strokeColor: '#666666'
    }
  }
  
  // 从色阶颜色提取亮度（levelColorHex 是灰度色，其亮度代表色阶）
  const levelRgb = hexToRgb(levelColorHex)
  if (!levelRgb) {
    return {
      bgColor: '#2D2D2D',
      headerFillColor: '#3D3D3D',
      headerTextColor: '#FFFFFF',
      cellFillColor: '#2D2D2D',
      cellTextColor: '#D4D4D4',
      strokeColor: '#666666'
    }
  }
  
  // 计算色阶颜色的亮度（0-100）
  const levelR = Math.round(levelRgb.r * 255)
  const levelG = Math.round(levelRgb.g * 255)
  const levelB = Math.round(levelRgb.b * 255)
  const levelHsl = rgbToHsl(levelR, levelG, levelB)
  let lightness = levelHsl.l // 色阶颜色的亮度
  
  // 应用有效色阶范围（将色阶映射到有效范围内）
  if (mappingConfig.lightnessRange) {
    const { min: rangeMin, max: rangeMax, isSpaceBetween } = mappingConfig.lightnessRange
    // 将亮度值转换为色阶（1-15）
    // 色阶颜色是灰度色，亮度值 0-100 对应色阶 1-15
    // 色阶 1 (#000000) 对应亮度 0%，色阶 15 (#FFFFFF) 对应亮度 100%
    // 色阶 n 对应亮度约 (n-1) * 100 / 14
    const currentLevel = Math.max(1, Math.min(15, Math.round((lightness / 100) * 14 + 1) || 1))
    
    let mappedLevel: number
    
    if (isSpaceBetween) {
      // 剔除区间模式：min-max 是要剔除的区间，只使用其他色阶
      // 例如：剔除 5-10，则使用 1-4 和 11-15
      if (currentLevel >= rangeMin && currentLevel <= rangeMax) {
        // 当前色阶在剔除区间内，需要映射到剔除区间外
        // 根据距离剔除区间的远近，映射到最近的有效色阶
        const distanceToMin = currentLevel - rangeMin
        const distanceToMax = rangeMax - currentLevel
        
        if (distanceToMin <= distanceToMax) {
          // 更靠近剔除区间的最小值，映射到 rangeMin - 1（如果存在）
          mappedLevel = Math.max(1, rangeMin - 1)
        } else {
          // 更靠近剔除区间的最大值，映射到 rangeMax + 1（如果存在）
          mappedLevel = Math.min(15, rangeMax + 1)
        }
      } else {
        // 当前色阶不在剔除区间内，保持原色阶
        mappedLevel = currentLevel
      }
    } else {
      // 正常模式：min-max 是有效范围
      if (currentLevel < rangeMin) {
        // 如果当前色阶小于最小有效色阶，映射到最小有效色阶
        mappedLevel = rangeMin
      } else if (currentLevel > rangeMax) {
        // 如果当前色阶大于最大有效色阶，映射到最大有效色阶
        mappedLevel = rangeMax
      } else {
        // 在有效范围内，保持原色阶
        mappedLevel = currentLevel
      }
    }
    
    // 将映射后的色阶转换回亮度值
    // 色阶 n 对应亮度 (n-1) * 100 / 14
    lightness = ((mappedLevel - 1) / 14) * 100
  }
  
  // 判断是否为灰色（饱和度很低）
  const isGray = themeHsl.s < 5
  const actualHue = themeHsl.h
  
  // 检查是否是复古样式（有非零的RGB偏移）
  const hasRetroOffset = mappingConfig.rgbOffset && (
    (mappingConfig.rgbOffset.r !== undefined && mappingConfig.rgbOffset.r !== 0) ||
    (mappingConfig.rgbOffset.g !== undefined && mappingConfig.rgbOffset.g !== 0) ||
    (mappingConfig.rgbOffset.b !== undefined && mappingConfig.rgbOffset.b !== 0)
  )
  
  // 应用饱和度阈值范围
  let baseSaturation = isGray ? 0 : themeHsl.s
  if (mappingConfig.saturationRange) {
    const { min, max } = mappingConfig.saturationRange
    baseSaturation = Math.max(min, Math.min(max, baseSaturation))
  } else {
    // 如果没有指定范围，使用默认范围（10-90）
    baseSaturation = isGray ? 0 : Math.max(10, Math.min(90, baseSaturation))
  }
  
  // 单色模式处理
  if (colorMode === 'monochrome') {
    if (hasRetroOffset) {
      // 有RGB偏移的样式，给一点点饱和度（10以内）
      baseSaturation = Math.min(10, baseSaturation)
    } else {
      // 没有RGB偏移的样式，强制饱和度为0
      baseSaturation = 0
    }
  }
  
  // 根据映射配置计算各个颜色
  // 1. 确定主题色作用在哪个部位
  let primaryL = lightness
  let primaryS = baseSaturation
  
  // 2. 计算各个部位的颜色
  const calculateColor = (
    target: 'bgColor' | 'headerFillColor' | 'cellFillColor',
    config?: { 
      lightnessOffset?: number, 
      saturationOffset?: number, 
      saturationMultiplier?: number,
      color?: 'black' | 'white'
    }
  ): { l: number, s: number, isFixed?: boolean, fixedColor?: string } => {
    // 如果直接指定了颜色，返回固定颜色
    if (config?.color === 'black') {
      return { l: 0, s: 0, isFixed: true, fixedColor: '#000000' }
    }
    if (config?.color === 'white') {
      return { l: 100, s: 0, isFixed: true, fixedColor: '#FFFFFF' }
    }
    
    if (mappingConfig.primaryTarget === target) {
      // 如果这个部位是主题色目标，直接使用主题色
      return { l: primaryL, s: primaryS }
    }
    
    // 否则根据配置计算（基于主题色计算衍生值）
    const configL = config?.lightnessOffset || 0
    const configS = config?.saturationOffset || 0
    const configSMul = config?.saturationMultiplier || 1
    
    let targetL = primaryL + configL
    let targetS = (primaryS + configS) * configSMul
    
    // 限制范围
    targetL = Math.max(0, Math.min(100, targetL))
    targetS = Math.max(0, Math.min(100, targetS))
    
    // 如果是灰色，饱和度为0
    if (isGray) targetS = 0
    
    // 单色模式处理
    if (colorMode === 'monochrome') {
      if (hasRetroOffset) {
        // 有RGB偏移的样式，给一点点饱和度（10以内）
        targetS = Math.min(10, targetS)
      } else {
        // 没有RGB偏移的样式，强制饱和度为0
        targetS = 0
      }
    }
    
    return { l: targetL, s: targetS }
  }
  
  // 应用 RGB 偏移的辅助函数
  const applyRgbOffset = (r: number, g: number, b: number, globalOffset?: { r?: number, g?: number, b?: number }, localOffset?: { r?: number, g?: number, b?: number }): string => {
    let finalR = r
    let finalG = g
    let finalB = b
    
    // 检查是否是复古样式（有非零的全局RGB偏移）
    const hasRetroOffset = globalOffset && (
      (globalOffset.r !== undefined && globalOffset.r !== 0) ||
      (globalOffset.g !== undefined && globalOffset.g !== 0) ||
      (globalOffset.b !== undefined && globalOffset.b !== 0)
    )
    
    // 如果是灰色且不是复古样式，不应用RGB偏移（保持单色）
    if (isGray && !hasRetroOffset) {
      // 直接返回灰度色，不应用任何偏移
      return rgbToHex(Math.round(r), Math.round(g), Math.round(b))
    }
    
    // 先应用全局偏移
    if (globalOffset) {
      finalR += globalOffset.r || 0
      finalG += globalOffset.g || 0
      finalB += globalOffset.b || 0
    }
    
    // 再应用局部偏移（叠加）
    if (localOffset) {
      finalR += localOffset.r || 0
      finalG += localOffset.g || 0
      finalB += localOffset.b || 0
    }
    
    // 限制在 0-255 范围内
    finalR = Math.max(0, Math.min(255, Math.round(finalR)))
    finalG = Math.max(0, Math.min(255, Math.round(finalG)))
    finalB = Math.max(0, Math.min(255, Math.round(finalB)))
    
    return rgbToHex(finalR, finalG, finalB)
  }
  
  // 计算背景色
  const bgConfig = calculateColor('bgColor', mappingConfig.bgColor)
  const bgColor = bgConfig.isFixed ? bgConfig.fixedColor! : (() => {
    const rgb = hslToRgb(actualHue, bgConfig.s, bgConfig.l)
    return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, mappingConfig.bgColor?.rgbOffset)
  })()
  
  // 计算表头填充色
  const headerConfig = calculateColor('headerFillColor', mappingConfig.headerFillColor)
  const headerFillColor = headerConfig.isFixed ? headerConfig.fixedColor! : (() => {
    const rgb = hslToRgb(actualHue, headerConfig.s, headerConfig.l)
    return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, mappingConfig.headerFillColor?.rgbOffset)
  })()
  
  // 计算单元格填充色
  const cellConfig = calculateColor('cellFillColor', mappingConfig.cellFillColor)
  const cellFillColor = cellConfig.isFixed ? cellConfig.fixedColor! : (() => {
    const rgb = hslToRgb(actualHue, cellConfig.s, cellConfig.l)
    return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, mappingConfig.cellFillColor?.rgbOffset)
  })()
  
  // 计算文字颜色（根据配置或亮度自动判断，默认使用黑白）
  let headerTextColor: string
  if (mappingConfig.headerTextColor?.color === 'black') {
    headerTextColor = '#000000'
  } else if (mappingConfig.headerTextColor?.color === 'white') {
    headerTextColor = '#FFFFFF'
  } else if (mappingConfig.headerTextColor?.color === 'theme') {
    // 使用主题色
    const themeRgb = hslToRgb(actualHue, primaryS, primaryL)
    headerTextColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset)
  } else {
    // 默认：根据亮度自动判断使用黑白
    const headerThreshold = mappingConfig.headerTextColor?.contrastThreshold || 50
    headerTextColor = headerConfig.l >= headerThreshold ? '#000000' : '#FFFFFF'
  }
  
  let cellTextColor: string
  if (mappingConfig.cellTextColor?.color === 'black') {
    cellTextColor = '#000000'
  } else if (mappingConfig.cellTextColor?.color === 'white') {
    cellTextColor = '#FFFFFF'
  } else if (mappingConfig.cellTextColor?.color === 'theme') {
    // 使用主题色
    const themeRgb = hslToRgb(actualHue, primaryS, primaryL)
    cellTextColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset)
  } else {
    // 默认：根据亮度自动判断使用黑白
    const cellThreshold = mappingConfig.cellTextColor?.contrastThreshold || 50
    cellTextColor = cellConfig.l >= cellThreshold ? '#000000' : '#FFFFFF'
  }
  
  // 计算描边色
  const strokeConfig = mappingConfig.strokeColor
  let strokeColor: string
  
  // 如果直接指定了颜色，使用固定颜色或主题色
  if (strokeConfig?.color === 'black') {
    strokeColor = '#000000'
  } else if (strokeConfig?.color === 'white') {
    strokeColor = '#FFFFFF'
  } else if (strokeConfig?.color === 'theme') {
    // 使用主题色
    const themeRgb = hslToRgb(actualHue, primaryS, primaryL)
    strokeColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, strokeConfig?.rgbOffset)
  } else {
    // 否则根据配置计算
    let strokeL: number
    let strokeS: number
    
    if (strokeConfig?.relativeTo) {
      // 相对于某个颜色计算
      let baseL: number
      let baseS: number
      if (strokeConfig.relativeTo === 'bgColor') {
        baseL = bgConfig.l
        baseS = bgConfig.s
      } else if (strokeConfig.relativeTo === 'headerFillColor') {
        baseL = headerConfig.l
        baseS = headerConfig.s
      } else { // cellFillColor
        baseL = cellConfig.l
        baseS = cellConfig.s
      }
      
      // 根据色阶亮度决定是增加还是减少亮度
      const offset = strokeConfig.lightnessOffset || 15
      if (lightness < 50) {
        // 暗色阶：描边色比基准色亮
        strokeL = Math.min(100, baseL + offset)
      } else {
        // 亮色阶：描边色比基准色暗
        strokeL = Math.max(0, baseL - offset)
      }
      strokeS = baseS
    } else {
      // 默认基于表头填充色，根据色阶亮度调整
      const offset = strokeConfig?.lightnessOffset || 15
      if (lightness < 50) {
        strokeL = Math.min(100, headerConfig.l + offset)
      } else {
        strokeL = Math.max(0, headerConfig.l - offset)
      }
      strokeS = headerConfig.s
    }
    
    // 单色模式处理
    if (colorMode === 'monochrome') {
      if (hasRetroOffset) {
        // 有RGB偏移的样式，给一点点饱和度（10以内）
        strokeS = Math.min(10, strokeS)
      } else {
        // 没有RGB偏移的样式，强制饱和度为0
        strokeS = 0
      }
    }
    
    const strokeRgb = hslToRgb(actualHue, strokeS, strokeL)
    strokeColor = applyRgbOffset(strokeRgb.r, strokeRgb.g, strokeRgb.b, mappingConfig.rgbOffset, strokeConfig?.rgbOffset)
  }
  
  return {
    bgColor,
    headerFillColor,
    headerTextColor,
    cellFillColor,
    cellTextColor,
    strokeColor
  }
}

// 解析表格文本为数组（按列）
function parseTableText(text: string): string[][] {
  if (!text || !text.trim()) return []
  
  const lines = text.trim().split('\n')
  const rows: string[][] = []
  
  lines.forEach((line) => {
    const cells = line.split('\t')
    rows.push(cells)
  })
  
  // 转置为按列的数组
  if (rows.length === 0) return []
  
  const maxCols = Math.max(...rows.map(row => row.length))
  const columns: string[][] = []
  
  for (let i = 0; i < maxCols; i++) {
    columns.push(rows.map(row => row[i] || ''))
  }
  
  return columns
}

function Widget() {
  // 表格数据：UI 侧处理后的最终数组（按列存储）
  const [processedTableData, setProcessedTableData] = useSyncedState<string[][]>('processedTableData', [])
  const [tableText, setTableText] = useSyncedState('tableText', 'A1\tB1\tC1\na2\tb2\tc2\na3\tb3\tc3\na4\tb4\tc4')
  
  // 表格样式设置
  const [fillStyle, setFillStyle] = useSyncedState('fillStyle', 2) // 1:全填充, 2:横间隔, 3:竖间隔, 4:无填充
  const [strokeStyle, setStrokeStyle] = useSyncedState('strokeStyle', 4) // 1:全描边, 2:仅横线, 3:仅竖线, 4:无描边
  const [isTableHeader, setIsTableHeader] = useSyncedState<boolean>('isTableHeader', true) // 表格样式：true=有表头（包含th、td），false=无表头
  
  // 主题色设置
  const [themeHue, setThemeHue] = useSyncedState('themeHue', '#ff8800') // 主题色相：hex 颜色字符串（默认橙色）
  const [themeLevel, setThemeLevel] = useSyncedState('themeLevel', '#333333') // 主题色阶：hex 颜色字符串（灰度色，亮度代表色阶）
  const [themeStyle, setThemeStyle] = useSyncedState('themeStyle', 'Fashion') // 颜色配比风格
  const [colorMode, setColorMode] = useSyncedState<'color' | 'monochrome'>('colorMode', 'color') // 颜色模式：'color' 彩色模式，'monochrome' 单色模式
  
  // 获取当前使用的颜色映射配置
  const currentMappingConfig = colorMappingPresets[themeStyle] || colorMappingPresets['Fashion']
  
  // 计算实际使用的颜色（使用主题色和映射配置）
  const themeColors = calculateThemeColors(themeHue, themeLevel, currentMappingConfig, colorMode)
  const actualBgColor = themeColors.bgColor
  const actualHeaderFillColor = themeColors.headerFillColor
  const actualHeaderTextColor = themeColors.headerTextColor
  const actualCellFillColor = themeColors.cellFillColor
  const actualCellTextColor = themeColors.cellTextColor
  const actualStrokeColor = themeColors.strokeColor
  
  // 表格尺寸
  const [fontSize, setFontSize] = useSyncedState('fontSize', 12)
  
  // 行列方向：false=正常（第一行是表头），true=反行列（第一列是表头）
  const [isRowColumnSwapped, setIsRowColumnSwapped] = useSyncedState('isRowColumnSwapped', false)

  // 主题色相选项：红橙黄绿青蓝紫灰（作为预设选项，但用户可以选择任意颜色）
  const hueOptions = [
    { option: '#E32322', tooltip: 'Red' },      // 红
    { option: '#E8621F', tooltip: 'Orange-Red' }, // 橙红
    { option: '#F19101', tooltip: 'Orange' },  // 橙
    { option: '#FDC60B', tooltip: 'Yellow-Orange' }, // 黄橙
    { option: '#F4E500', tooltip: 'Yellow' },  // 黄
    { option: '#8CBF26', tooltip: 'Green-Yellow' },  // 绿黄
    { option: '#228822', tooltip: 'Green' },  // 绿
    { option: '#008E5B', tooltip: 'Cyan-Green' },  // 青绿
    { option: '#00ffff', tooltip: 'Cyan' },   // 青
    { option: '#0696BB', tooltip: 'Blue-Green' },   // 蓝绿
    { option: '#2671B2', tooltip: 'Blue' },   // 蓝
    { option: '#444E99', tooltip: 'Purple-Blue' },   // 紫蓝
    { option: '#6D3889', tooltip: 'Purple' }, // 紫
    { option: '#C4037D', tooltip: 'Red-Purple' }, // 红紫
]
  /*[
    { option: '#ff0000', tooltip: 'Red' },      // 红
    { option: '#ff8800', tooltip: 'Orange' },  // 橙
    { option: '#ffff00', tooltip: 'Yellow' },  // 黄
    { option: '#88ff00', tooltip: 'Verdancy' },  // 黄绿
    { option: '#00ff00', tooltip: 'Green' },  // 绿
    { option: '#00ffff', tooltip: 'Cyan' },   // 青
    { option: '#0088FF', tooltip: 'Blue' },   // 蓝
    { option: '#4444FF', tooltip: 'Violet' },   // 紫罗兰
    { option: '#8800ff', tooltip: 'Purple' }, // 紫
    { option: '#880088', tooltip: 'Purplish red' }, // 玫红
  ]
  */
  
  // 色阶选项：0-15 (黑到白) - 作为预设选项，但用户可以选择任意灰度色
  const allLevelOptions = [
    { option: '#000000', tooltip: 'Level 1', level: 1 },
    { option: '#111111', tooltip: 'Level 2', level: 2 },
    { option: '#222222', tooltip: 'Level 3', level: 3 },
    { option: '#333333', tooltip: 'Level 4', level: 4 },
    { option: '#444444', tooltip: 'Level 5', level: 5 },
    { option: '#555555', tooltip: 'Level 6', level: 6 },
    { option: '#666666', tooltip: 'Level 7', level: 7 },
    { option: '#777777', tooltip: 'Level 8', level: 8 },
    { option: '#888888', tooltip: 'Level 9', level: 9 },
    { option: '#999999', tooltip: 'Level 10', level: 10 },
    { option: '#aaaaaa', tooltip: 'Level 11', level: 11 },
    { option: '#bbbbbb', tooltip: 'Level 12', level: 12 },
    { option: '#cccccc', tooltip: 'Level 13', level: 13 },
    { option: '#dddddd', tooltip: 'Level 14', level: 14 },
    { option: '#eeeeee', tooltip: 'Level 15', level: 15 },
  ]
  
  // 根据当前主题的 lightnessRange 过滤色阶选项
  const levelOptions = (() => {
    let filtered: Array<{ option: string, tooltip: string }>
    
    if (!currentMappingConfig.lightnessRange) {
      // 如果没有配置 lightnessRange，显示所有选项
      filtered = allLevelOptions.map(({ level, ...rest }) => rest)
    } else {
      const { min, max, isSpaceBetween, defaultLevel } = currentMappingConfig.lightnessRange
      
      if (isSpaceBetween) {
        // 剔除区间模式：只显示 min-max 范围外的选项
        filtered = allLevelOptions
          .filter(item => item.level < min || item.level > max)
          .map(({ level, ...rest }) => rest)
      } else {
        // 正常模式：只显示 min-max 范围内的选项
        filtered = allLevelOptions
          .filter(item => item.level >= min && item.level <= max)
          .map(({ level, ...rest }) => rest)
      }
      
      // 确保建议值在选项中（即使它不在过滤范围内）
      if (defaultLevel !== undefined) {
        const recommendedOption = allLevelOptions.find(item => item.level === defaultLevel)
        if (recommendedOption) {
          const { level, ...rest } = recommendedOption
          const exists = filtered.some(item => item.option === rest.option)
          if (!exists) {
            filtered.push(rest)
          }
        }
      }
    }
    
    return filtered
  })()

  const themeStyleOptions = [
    { label: 'Normal', option: 'Normal'},
    { label: 'Soft', option: 'Soft'},
    { label: 'Fashion', option: 'Fashion'},
    { label: 'Contrast', option: 'Contrast'},
    { label: 'Vivid', option: 'Vivid'},
    { label: 'Pastel', option: 'Pastel'},
    { label: 'Retro', option: 'Retro'},
    { label: 'Neon', option: 'Neon'},
  ]
  
  const colorModeOptions = [
    { label: 'Colored', option: 'color'},
    { label: 'Monochrome', option: 'monochrome'},
  ]
  
  let iconColor = 'white'
  let iconColorPick = '#3AC989'
  // Property menu
  usePropertyMenu(
    [
      {
        itemType: 'action',
        propertyName: 'openConfig',
        tooltip: 'Open Config',
        icon: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="${iconColor}" d="M19.2041 9.021C19.7148 9.021 20.187 9.29356 20.4424 9.73584L23.6465 15.2856C23.9015 15.7277 23.9016 16.2723 23.6465 16.7144L20.4424 22.2642C20.187 22.7064 19.7148 22.979 19.2041 22.979H12.7959C12.2852 22.979 11.813 22.7064 11.5576 22.2642L8.35352 16.7144C8.09842 16.2723 8.09846 15.7277 8.35352 15.2856L11.5576 9.73584C11.813 9.29356 12.2852 9.021 12.7959 9.021H19.2041Z" stroke-width="1.22526"/>
        <circle fill="${iconColor}" cx="16" cy="16" r="2"/>
        </svg>`
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'action',
        propertyName: 'swapRowColumn',
        tooltip: 'Row Column Swap',
        icon: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect stroke="${isRowColumnSwapped ? iconColor : iconColorPick}" 
          x="9" y="9" width="14" height="6" rx="0.81684" stroke-width="1.22526"/>
          <rect stroke="${isRowColumnSwapped ? iconColorPick : iconColor}" 
          fill="${isRowColumnSwapped ? iconColorPick : iconColor }" 
          fill-opacity="${isRowColumnSwapped ? 0.5 : 0}" 
          x="15" y="9" width="14" height="6" rx="0.81684" transform="rotate(90 15 9)" stroke-width="1.22526"/>
          <rect stroke="${isRowColumnSwapped ? iconColor : iconColorPick}" 
          stroke-opacity="${isRowColumnSwapped ? 0 : 1}" 
          fill="${isRowColumnSwapped ? iconColor : iconColorPick}" 
          fill-opacity="${isRowColumnSwapped ? 0 : 0.5}" 
          x="9" y="9" width="14" height="6" rx="0.81684" stroke-width="1.22526"/>
          <path stroke="${iconColor}" d="M23 18V19C23 21.2091 21.2091 23 19 23H18" stroke-width="1.23"/>
        </svg>
        `
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'action',
        propertyName: 'isTableHeader',
        tooltip: 'Table Header',
        icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${isTableHeader ? iconColorPick : iconColor}" d="M18 16L17.9893 16.2041C17.887 17.2128 17.0357 18 16 18H4C2.96435 18 2.113 17.2128 2.01074 16.2041L2 16V4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V16ZM3 16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V7H3V16Z"/>
        </svg>
        `
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'action',
        propertyName: 'fillStyle1',
        tooltip: 'All Fill',
        icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect fill="${fillStyle === 1 ? iconColorPick : iconColor}" x="2" y="2" width="16" height="16" rx="2"/>
        </svg>
        `
      },
      {
        itemType: 'action',
        propertyName: 'fillStyle2',
        tooltip: 'Row Space',
        icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${fillStyle === 2 ? iconColorPick : iconColor}" d="M18 16L17.9893 16.2041C17.887 17.2128 17.0357 18 16 18H4C2.96435 18 2.113 17.2128 2.01074 16.2041L2 16V4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V16ZM3 14V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V14H3ZM3 10H17V7H3V10Z"/>
        </svg>`
      },
      {
        itemType: 'action',
        propertyName: 'fillStyle3',
        tooltip: 'Column Space',
        icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${fillStyle === 3 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C3.86182 18 3.72697 17.9857 3.59668 17.959C3.46664 17.9324 3.34118 17.8933 3.22168 17.8428C2.50378 17.5392 2 16.8285 2 16V4C2 3.17153 2.50378 2.46081 3.22168 2.15723C3.34118 2.10669 3.46664 2.06765 3.59668 2.04102C3.72697 2.01433 3.86182 2 4 2H16ZM13.7832 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H13.7832V17ZM6.34766 17H9.43555V3H6.34766V17Z"/>
        </svg>`
      },
      {
        itemType: 'action',
        propertyName: 'fillStyle4',
        tooltip: 'No Fill',
        icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${fillStyle === 4 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2H16ZM4 3C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H4Z"/>
        </svg>`
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'action',
        propertyName: 'strokeStyle1',
        tooltip: 'All Strokes',
        icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${strokeStyle === 1 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16L17.9893 16.2041C17.887 17.2128 17.0357 18 16 18H4C2.96435 18 2.113 17.2128 2.01074 16.2041L2 16V4C2 2.89543 2.89543 2 4 2H16ZM10.5 17H16C16.5523 17 17 16.5523 17 16V13H10.5V17ZM3 16C3 16.5523 3.44772 17 4 17H9.5V13H3V16ZM10.5 12H17V8H10.5V12ZM3 12H9.5V8H3V12ZM10.5 7H17V4C17 3.44772 16.5523 3 16 3H10.5V7ZM4 3C3.44772 3 3 3.44772 3 4V7H9.5V3H4Z"/>
        </svg>`
      },
      {
        itemType: 'action',
        propertyName: 'strokeStyle2',
        tooltip: 'Row Strokes',
        icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${strokeStyle === 2 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16L17.9893 16.2041C17.887 17.2128 17.0357 18 16 18H4C2.96435 18 2.113 17.2128 2.01074 16.2041L2 16V4C2 2.89543 2.89543 2 4 2H16ZM3 13V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V13H3ZM3 12H17V8H3V12ZM4 3C3.44772 3 3 3.44772 3 4V7H17V4C17 3.44772 16.5523 3 16 3H4Z"/>
        </svg>`
      },
      {
        itemType: 'action',
        propertyName: 'strokeStyle3',
        tooltip: 'Column Strokes',
        icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${strokeStyle === 3 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2H16ZM4 3C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H9.5V3H4ZM10.5 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H10.5V17Z"/>
        </svg>`
      },
      {
        itemType: 'action',
        propertyName: 'strokeStyle4',
        tooltip: 'No Strokes',
        icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${strokeStyle === 4 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2H16ZM4 3C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H4Z"/>
        </svg>`
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'color-selector',
        propertyName: 'themeHue',
        tooltip: 'Theme Hue',
        options: hueOptions,
        selectedOption: themeHue,
      },
      {
        itemType: 'color-selector',
        propertyName: 'themeLevel',
        tooltip: 'Theme Level',
        options: levelOptions,
        selectedOption: themeLevel,
      },
      {
        itemType: 'dropdown',
        propertyName: 'themeStyle',
        tooltip: 'Theme Style',
        options: themeStyleOptions,
        selectedOption: themeStyle,
      },
      {
        itemType: 'dropdown',
        propertyName: 'colorMode',
        tooltip: 'Color Mode',
        options: colorModeOptions,
        selectedOption: colorMode,
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === 'swapRowColumn') {
        // 反转行列：将按列存储的数据行列互换
        // 当前 processedTableData 是按列存储：[[col0_row0, col0_row1, ...], [col1_row0, col1_row1, ...], ...]
        // 反转后：原来的行变成列，原来的列变成行
        if (processedTableData.length > 0) {
          // 将按列存储转换为按行存储（转置）
          const maxRows = Math.max(...processedTableData.map(col => col.length))
          const rows: string[][] = []
          
          for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
            const row: string[] = []
            for (let colIndex = 0; colIndex < processedTableData.length; colIndex++) {
              row.push(processedTableData[colIndex][rowIndex] || '')
            }
            rows.push(row)
          }
          
          // 现在 rows 是按行存储的，直接作为新的列数据（行列互换）
          // 原来的第一行变成第一列，原来的第二行变成第二列...
          const newColumns = rows
          
          // 更新数据
          setProcessedTableData(newColumns)
          
          // 切换行列方向状态
          setIsRowColumnSwapped(!isRowColumnSwapped)
          
          // 同时切换 row/column space 和 stroke
          // fillStyle: 2 (横间隔) ↔ 3 (竖间隔)
          if (fillStyle === 2) {
            setFillStyle(3)
          } else if (fillStyle === 3) {
            setFillStyle(2)
          }
          // strokeStyle: 2 (仅横线) ↔ 3 (仅竖线)
          if (strokeStyle === 2) {
            setStrokeStyle(3)
          } else if (strokeStyle === 3) {
            setStrokeStyle(2)
          }
          
          // 更新 tableText：将新数据转换回文本格式
          // newColumns 现在是按列存储的，需要转换为按行的文本格式
          const maxRowsForText = Math.max(...newColumns.map(col => col.length))
          const textRows: string[] = []
          for (let rowIndex = 0; rowIndex < maxRowsForText; rowIndex++) {
            const row = newColumns.map(col => col[rowIndex] || '').join('\t')
            textRows.push(row)
          }
          const newText = textRows.join('\n')
          setTableText(newText)
        }
      } else if (propertyName === 'openConfig') {
        waitForTask(
          new Promise<void>((resolve) => {
            figma.showUI(__html__, { width: 300, height: 340, themeColors: true })
            
            // 计算当前的行列数（从 processedTableData 计算）
            const currentColCount = processedTableData.length
            const currentRowCount = processedTableData.length > 0 ? processedTableData[0]?.length || 0 : 0
            
            figma.ui.postMessage({
              type: 'init',
              data: {
                tableText,
                rowCount: currentRowCount,
                colCount: currentColCount,
                fontSize,
                themeColors: themeColors,
              }
            })

            figma.ui.onmessage = (msg) => {
              if (msg.type === 'update') {
                const { 
                  tableText: newText, 
                  processedTableData: newProcessedTableData,
                  fontSize: newFontSize,
                } = msg.data
                setTableText(newText || '')
                if (newProcessedTableData !== undefined) {
                  setProcessedTableData(newProcessedTableData)
                }
                if (newFontSize !== undefined) setFontSize(newFontSize)
              } else if (msg.type === 'close') {
                figma.closePlugin()
                resolve()
              }
            }
          })
        )
      } else if (propertyName === 'fillStyle1') {
        setFillStyle(1)
      } else if (propertyName === 'fillStyle2') {
        setFillStyle(2)
      } else if (propertyName === 'fillStyle3') {
        setFillStyle(3)
      } else if (propertyName === 'fillStyle4') {
        setFillStyle(4)
      } else if (propertyName === 'strokeStyle1') {
        setStrokeStyle(1)
      } else if (propertyName === 'strokeStyle2') {
        setStrokeStyle(2)
      } else if (propertyName === 'strokeStyle3') {
        setStrokeStyle(3)
      } else if (propertyName === 'strokeStyle4') {
        setStrokeStyle(4)
      } else if (propertyName === 'themeHue') {
        // propertyValue 现在是 hex 颜色字符串
        const newHue = propertyValue as string
        setThemeHue(newHue)
      } else if (propertyName === 'themeLevel') {
        // propertyValue 现在是 hex 颜色字符串
        const newLevel = propertyValue as string
        setThemeLevel(newLevel)
      } else if (propertyName === 'themeStyle') {
        // propertyValue 是选择的风格名称
        const newStyle = propertyValue as string
        setThemeStyle(newStyle)
        
        // 切换主题时直接使用建议值
        const newMappingConfig = colorMappingPresets[newStyle] || colorMappingPresets['Fashion']
        if (newMappingConfig.lightnessRange?.defaultLevel !== undefined) {
          const defaultLevel = newMappingConfig.lightnessRange.defaultLevel
          const defaultOption = allLevelOptions.find(item => item.level === defaultLevel)
          if (defaultOption) {
            setThemeLevel(defaultOption.option)
          }
        }
      } else if (propertyName === 'colorMode') {
        // propertyValue 是选择的颜色模式
        const newMode = propertyValue as 'color' | 'monochrome'
        if (newMode === 'color' || newMode === 'monochrome') {
          setColorMode(newMode)
        }
      } else if (propertyName === 'isTableHeader') {
        // 切换表格样式：true <-> false
        setIsTableHeader(!isTableHeader)
      }
    },
  )

  // 直接使用 UI 侧处理后的最终数组
  // processedTableData 已经是按行列数处理好的最终数组，主线程直接使用
  const actualColCount = processedTableData.length
  const actualRowCount = processedTableData.length > 0 ? processedTableData[0]?.length || 0 : 0

  // 计算描边色（需要在渲染之前计算，因为可能在早期 return 中使用）
  const strokeColorRgb = hexToRgb(actualStrokeColor) || { r: 0.4, g: 0.4, b: 0.4, a: 1 }

  // 渲染表格
  if (processedTableData.length === 0 || actualRowCount === 0 || actualColCount === 0) {
    return (
      <AutoLayout
        name="@table"
        direction="vertical"
        stroke={strokeStyle !== 4 ? strokeColorRgb : undefined}
        strokeWidth={strokeStyle !== 4 ? 1 : 0}
        strokeAlign="center"
        spacing={0}
        padding={12}
        fill={hexToRgb(actualBgColor) || { r: 0.18, g: 0.18, b: 0.18, a: 1 }}
        cornerRadius={4}
      >
        <Text 
        fontSize={14} 
        fill="#858585"
        horizontalAlignText="center"
        fontWeight="normal"
        >
          No table data. Use property menu to open config.
        </Text>
      </AutoLayout>
    )
  }

  const bgRgb = hexToRgb(actualBgColor) || { r: 0.18, g: 0.18, b: 0.18, a: 1 }
  // 表头和表格使用各自的填充色，表格填充色可配置透明度
  const headerFillRgb = hexToRgb(actualHeaderFillColor) || { r: 0.24, g: 0.24, b: 0.24, a: 1 }
  const cellFillRgbBase = hexToRgb(actualCellFillColor) || { r: 0.24, g: 0.24, b: 0.24, a: 1 }
  // 从配置中读取透明度，如果没有配置则使用默认值 0.4
  const cellFillOpacity = currentMappingConfig.cellFillColor?.opacity !== undefined 
    ? currentMappingConfig.cellFillColor.opacity 
    : 0.4
  const cellFillRgb = { ...cellFillRgbBase, a: cellFillOpacity }
  const headerTextRgb = hexToRgb(actualHeaderTextColor) || { r: 1, g: 1, b: 1, a: 1 }
  const cellTextRgb = hexToRgb(actualCellTextColor) || { r: 0.83, g: 0.83, b: 0.83, a: 1 }

  // 判断是否显示填充
  // fillStyle: 1=全填充, 2=横间隔(间隔行), 3=竖间隔(间隔列), 4=无填充
  // 表头始终有填充，不受fillStyle影响
  const shouldFillByIndex = (rowIndex: number, colIndex: number, isHeader: boolean = false) => {
    // 表头始终有填充
    if (isHeader) return true
    
    if (fillStyle === 1) return true // 全填充
    if (fillStyle === 2) {
      // 横间隔：间隔行填充
      const actualRowIndex = rowIndex + 1 // 第一行数据=1，第二行数据=2...
      return actualRowIndex % 2 === 0 // 偶数行填充（2, 4, 6...）
    }
    if (fillStyle === 3) {
      // 竖间隔：间隔列填充
      return colIndex % 2 === 0 // 偶数列填充（0, 2, 4...）
    }
    return false // 无填充
  }

  // 判断是否显示描边
  // strokeStyle: 1=全描边, 2=仅横线(保留上下), 3=仅竖线(保留左右), 4=无描边
  const strokeWidth = 1
  
  // 计算各边的描边宽度
  const getStrokeWeights = () => {
    if (strokeStyle === 1) {
      // 全描边：所有边
      return { top: strokeWidth, right: strokeWidth, bottom: strokeWidth, left: strokeWidth }
    } else if (strokeStyle === 2) {
      // 仅横线：保留上下
      return { top: strokeWidth, right: 0, bottom: strokeWidth, left: 0 }
    } else if (strokeStyle === 3) {
      // 仅竖线：保留左右
      return { top: 0, right: strokeWidth, bottom: 0, left: strokeWidth }
    } else {
      // 无描边
      return { top: 0, right: 0, bottom: 0, left: 0 }
    }
  }
  
  const strokeWeights = getStrokeWeights()
  const hasAnyStroke = strokeStyle !== 4

  return (
    <AutoLayout
      name="@table"
      direction="horizontal"
      stroke={hasAnyStroke ? strokeColorRgb : undefined}
      strokeWidth={hasAnyStroke ? strokeWidth : 0}
      strokeAlign="center"
      spacing={0}
      padding={0}
      fill={bgRgb}
      cornerRadius={4}
      width={fontSize * 25}
    >
      {/* 列结构：@table > @column > @th/td */}
      {processedTableData.map((column, colIndex) => {
        // 判断当前列是否应该显示为表头列
        // 正常模式（isRowColumnSwapped = false）：第一行是表头，即 column[0] 是表头
        // 反行列模式（isRowColumnSwapped = true）：第一列是表头，即 colIndex === 0 的所有元素是表头
        // 如果isTableHeader为false，则不使用表头
        const isHeaderColumn = isTableHeader && isRowColumnSwapped ? (colIndex === 0) : false
        const actualRowCount = column.length
        
        return (
        <AutoLayout
          key={`column-${colIndex}`}
          name="@column"
          direction="vertical"
          spacing={0}
          padding={0}
          width="fill-parent"
        >
          {isHeaderColumn ? (
            // 反行列模式：第一列的所有元素都是表头
            column.map((cellValue, rowIndex) => (
              <AutoLayout
                key={`th-${rowIndex}`}
                name="@th"
                direction="vertical"
                spacing={0}
                padding={0}
                width="fill-parent"
                fill={shouldFillByIndex(rowIndex, colIndex, true) ? headerFillRgb : undefined}
              >
                {/* 上描边 */}
                {strokeWeights.top > 0 && (
                  <Rectangle
                    name="@stroke-top"
                    width="fill-parent"
                    height={0}
                    stroke={strokeColorRgb}
                    strokeWidth={strokeWeights.top}
                    strokeAlign="center"
                  />
                )}
                {/* 内容区域：水平布局包含左描边、文本、右描边 */}
                <AutoLayout
                  name="@th-content"
                  direction="horizontal"
                  spacing={0}
                  padding={0}
                  width="fill-parent"
                >
                  {/* 左描边 */}
                  {strokeWeights.left > 0 && (
                    <Rectangle
                      name="@stroke-left"
                      width={0}
                      height="fill-parent"
                      stroke={strokeColorRgb}
                      strokeWidth={strokeWeights.left}
                      strokeAlign="center"
                    />
                  )}
                  {/* 文本 */}
                  <AutoLayout
                    name="@th-text"
                    direction="vertical"
                    spacing={0}
                    padding={8}
                    width="fill-parent"
                  >
                    <Text
                      fontSize={fontSize}
                      fill={headerTextRgb}
                      width="fill-parent"
                      horizontalAlignText="center"
                      fontWeight="bold"
                    >
                      {cellValue || ''}
                    </Text>
                  </AutoLayout>
                  {/* 右描边 */}
                  {strokeWeights.right > 0 && (
                    <Rectangle
                      name="@stroke-right"
                      width={0}
                      height="fill-parent"
                      stroke={strokeColorRgb}
                      strokeWidth={strokeWeights.right}
                      strokeAlign="center"
                    />
                  )}
                </AutoLayout>
                {/* 下描边 */}
                {strokeWeights.bottom > 0 && (
                  <Rectangle
                    name="@stroke-bottom"
                    width="fill-parent"
                    height={0}
                    stroke={strokeColorRgb}
                    strokeWidth={strokeWeights.bottom}
                    strokeAlign="center"
                  />
                )}
              </AutoLayout>
            ))
          ) : (
            <>
              {/* 正常模式：第一行是表头（如果isTableHeader为true） */}
              {!isRowColumnSwapped && isTableHeader && (
                <AutoLayout
                  name="@th"
                  direction="vertical"
                  spacing={0}
                  padding={0}
                  width="fill-parent"
                  fill={shouldFillByIndex(0, colIndex, true) ? headerFillRgb : undefined}
                >
                  {/* 上描边 */}
                  {strokeWeights.top > 0 && (
                    <Rectangle
                      name="@stroke-top"
                      width="fill-parent"
                      height={0}
                      stroke={strokeColorRgb}
                      strokeWidth={strokeWeights.top}
                      strokeAlign="center"
                    />
                  )}
                  {/* 内容区域：水平布局包含左描边、文本、右描边 */}
                  <AutoLayout
                    name="@th-content"
                    direction="horizontal"
                    spacing={0}
                    padding={0}
                    width="fill-parent"
                  >
                    {/* 左描边 */}
                    {strokeWeights.left > 0 && (
                      <Rectangle
                        name="@stroke-left"
                        width={0}
                        height="fill-parent"
                        stroke={strokeColorRgb}
                        strokeWidth={strokeWeights.left}
                        strokeAlign="center"
                      />
                    )}
                    {/* 文本 */}
                    <AutoLayout
                      name="@th-text"
                      direction="vertical"
                      spacing={0}
                      padding={8}
                      width="fill-parent"
                    >
                      <Text
                        fontSize={fontSize}
                        fill={headerTextRgb}
                        width="fill-parent"
                        horizontalAlignText="center"
                        fontWeight="bold"
                      >
                        {column[0] || ''}
                      </Text>
                    </AutoLayout>
                    {/* 右描边 */}
                    {strokeWeights.right > 0 && (
                      <Rectangle
                        name="@stroke-right"
                        width={0}
                        height="fill-parent"
                        stroke={strokeColorRgb}
                        strokeWidth={strokeWeights.right}
                        strokeAlign="center"
                      />
                    )}
                  </AutoLayout>
                  {/* 下描边 */}
                  {strokeWeights.bottom > 0 && (
                    <Rectangle
                      name="@stroke-bottom"
                      width="fill-parent"
                      height={0}
                      stroke={strokeColorRgb}
                      strokeWidth={strokeWeights.bottom}
                      strokeAlign="center"
                    />
                  )}
                </AutoLayout>
              )}

              {/* 数据单元格 @td */}
              {Array.from({ length: Math.max(0, actualRowCount - (isRowColumnSwapped ? 0 : (isTableHeader ? 1 : 0))) }).map((_, rowIndex) => {
                const cellValue = column[isRowColumnSwapped ? rowIndex : (isTableHeader ? rowIndex + 1 : rowIndex)] || ''
                const shouldFillThisCell = shouldFillByIndex(rowIndex, colIndex, false)
                return (
                  <AutoLayout
                    key={`td-${rowIndex}`}
                    name="@td"
                    direction="vertical"
                    spacing={0}
                    padding={0}
                    width="fill-parent"
                    fill={shouldFillThisCell ? cellFillRgb : undefined}
                  >
                    {/* 上描边 */}
                    {strokeWeights.top > 0 && (
                      <Rectangle
                        name="@stroke-top"
                        width="fill-parent"
                        height={0}
                        stroke={strokeColorRgb}
                        strokeWidth={strokeWeights.top}
                        strokeAlign="center"
                      />
                    )}
                    {/* 内容区域：水平布局包含左描边、文本、右描边 */}
                    <AutoLayout
                      name="@td-content"
                      direction="horizontal"
                      spacing={0}
                      padding={0}
                      width="fill-parent"
                    >
                      {/* 左描边 */}
                      {strokeWeights.left > 0 && (
                        <Rectangle
                          name="@stroke-left"
                          width={0}
                          height="fill-parent"
                          stroke={strokeColorRgb}
                          strokeWidth={strokeWeights.left}
                          strokeAlign="center"
                        />
                      )}
                      {/* 文本 */}
                      <AutoLayout
                        name="@td-text"
                        direction="vertical"
                        spacing={0}
                        padding={8}
                        width="fill-parent"
                      >
                        <Text
                          fontSize={fontSize}
                          fill={cellTextRgb}
                          width="fill-parent"
                          horizontalAlignText="center"
                          fontWeight="normal"
                        >
                          {cellValue}
                        </Text>
                      </AutoLayout>
                      {/* 右描边 */}
                      {strokeWeights.right > 0 && (
                        <Rectangle
                          name="@stroke-right"
                          width={0}
                          height="fill-parent"
                          stroke={strokeColorRgb}
                          strokeWidth={strokeWeights.right}
                          strokeAlign="center"
                        />
                      )}
                    </AutoLayout>
                    {/* 下描边 */}
                    {strokeWeights.bottom > 0 && (
                      <Rectangle
                        name="@stroke-bottom"
                        width="fill-parent"
                        height={0}
                        stroke={strokeColorRgb}
                        strokeWidth={strokeWeights.bottom}
                        strokeAlign="center"
                      />
                    )}
                  </AutoLayout>
                )
              })}
            </>
          )}
        </AutoLayout>
        )
      })}
    </AutoLayout>
  )
}

widget.register(Widget)
