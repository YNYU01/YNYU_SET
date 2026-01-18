const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, waitForTask, Rectangle, Frame, Line, useEffect, Input } = widget

// ============================================================================
// 工具函数（颜色转换）
// ============================================================================
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

// ============================================================================
// 类型定义
// ============================================================================

// 表格配置类型（整合所有配置）
type TableConfig = {
  // 数据
  data: string[][]  // 按列存储的表格数据
  isRowColumnSwapped: boolean  // 行列是否交换
  
  // 尺寸
  fontSize: number
  rowHeights: Record<number, number>  // 行高配置，单位：像素
  colWidths: Record<number, number | 'fill'>  // 列宽配置，单位：像素或 'fill'
  tableWidth: number  // 表格宽度（当所有列都是 fill 时使用）
  
  // 主题（整合样式配置）
  theme: {
    hue: string  // 主题色相：hex 颜色字符串
    level: string  // 主题色阶：hex 颜色字符串（灰度色，亮度代表色阶）
    style: string  // 颜色配比风格（如 'Fashion', 'Soft' 等）
    colorMode: 'color' | 'monochrome'  // 颜色模式：'color' 彩色模式，'monochrome' 单色模式
    // 样式配置整合到主题中
    hasHeader: boolean  // 是否有表头
    fillStyle: 1 | 2 | 3 | 4  // 1:全填充, 2:横间隔, 3:竖间隔, 4:无填充
    strokeStyle: 1 | 2 | 3 | 4  // 1:全描边, 2:仅横线, 3:仅竖线, 4:无描边
  }
  
  // UI 状态
  showRowColHeaders: boolean  // 显示行号列号
  pickedRowIndex: number  // 当前选中的行索引（-1表示未选中/隐藏）
  pickedColIndex: number  // 当前选中的列索引（-1表示未选中/隐藏）
}

// 颜色映射配置类型
type ColorMappingConfig = {
  // 主题色作用在哪个部位（primaryTarget 使用主题色的完整 HSL）
  // 如果为 null 或 undefined，表示主题色不直接赋予任何部位，所有部位都基于主题色计算衍生值
  primaryTarget?: 'bgColor' | 'headerFillColor' | 'cellFillColor' | null
  // 饱和度阈值范围（用于控制整体饱和度范围，有的样式很灰，有的很纯）
  saturationRange?: { min: number, max: number } // 默认不限制，使用原始饱和度
  // 有效色阶范围（1-15）：用于限制色阶的使用范围
  // level 数组指定有效的色阶，如果不设置则全部色阶都有效
  // 例如：[1,2,3,4,11,12,13,14,15] 表示只使用极暗和极亮的色阶
  lightnessRange?: { 
    level?: number[], // 有效的色阶数组（1-15），不设置时全部色阶都有效
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
    color?: 'black' | 'white' | 'theme', // 直接指定为黑色、白色或主题色
    lightnessOffset?: number,
    relativeTo?: 'headerFillColor' | 'cellFillColor' | 'bgColor',
    rgbOffset?: { r?: number, g?: number, b?: number }
  }
  cellTextColor?: { 
    contrastThreshold?: number,
    color?: 'black' | 'white' | 'theme',
    lightnessOffset?: number,
    relativeTo?: 'headerFillColor' | 'cellFillColor' | 'bgColor',
    rgbOffset?: { r?: number, g?: number, b?: number }
  }
  strokeColor?: { 
    lightnessOffset?: number, 
    relativeTo?: 'headerFillColor' | 'cellFillColor' | 'bgColor', // 相对于某个颜色的亮度偏移
    color?: 'black' | 'white' | 'theme', // 直接指定为黑色、白色或主题色
    rgbOffset?: { r?: number, g?: number, b?: number }
  }
  // 行列数格子的样式配置
  indexBgColor?: {
    colors?: [string, string], // [normal color, pick color]，直接指定颜色
    opacity?: [number, number], // [normal opacity, pick opacity]，范围 0-1，默认 [1, 1]
    // 基于主题色计算的配置（normal 和 pick 分别配置）
    normal?: {
      lightnessOffset?: number,
      relativeTo?: 'headerFillColor' | 'cellFillColor' | 'bgColor',
      color?: 'black' | 'white' | 'theme',
      rgbOffset?: { r?: number, g?: number, b?: number }
    },
    pick?: {
      lightnessOffset?: number,
      relativeTo?: 'headerFillColor' | 'cellFillColor' | 'bgColor',
      color?: 'black' | 'white' | 'theme',
      rgbOffset?: { r?: number, g?: number, b?: number }
    }
  }
  indexStrokeColor?: {
    colors?: [string, string], // [normal color, pick color]，直接指定颜色
    opacity?: [number, number], // [normal opacity, pick opacity]，范围 0-1，默认 [1, 1]
    // 基于主题色计算的配置（normal 和 pick 分别配置）
    normal?: {
      lightnessOffset?: number,
      relativeTo?: 'headerFillColor' | 'cellFillColor' | 'bgColor',
      color?: 'black' | 'white' | 'theme',
      rgbOffset?: { r?: number, g?: number, b?: number }
    },
    pick?: {
      lightnessOffset?: number,
      relativeTo?: 'headerFillColor' | 'cellFillColor' | 'bgColor',
      color?: 'black' | 'white' | 'theme',
      rgbOffset?: { r?: number, g?: number, b?: number }
    }
  }
  indexTextColor?: {
    colors?: [string, string], // [normal color, pick color]，直接指定颜色
    opacity?: [number, number], // [normal opacity, pick opacity]，范围 0-1，默认 [1, 1]
    // 基于主题色计算的配置（normal 和 pick 分别配置）
    normal?: {
      lightnessOffset?: number,
      relativeTo?: 'headerFillColor' | 'cellFillColor' | 'bgColor',
      color?: 'black' | 'white' | 'theme',
      contrastThreshold?: number, // 根据亮度自动判断使用黑白，threshold 是判断阈值（默认 50）
      rgbOffset?: { r?: number, g?: number, b?: number }
    },
    pick?: {
      lightnessOffset?: number,
      relativeTo?: 'headerFillColor' | 'cellFillColor' | 'bgColor',
      color?: 'black' | 'white' | 'theme',
      contrastThreshold?: number, // 根据亮度自动判断使用黑白，threshold 是判断阈值（默认 50）
      rgbOffset?: { r?: number, g?: number, b?: number }
    }
  }
  // 表格样式配置（可选，如果设置则会在切换主题时应用）
  hasHeader?: boolean  // 是否有表头
  fillStyle?: 1 | 2 | 3 | 4  // 1:全填充, 2:横间隔, 3:竖间隔, 4:无填充
  strokeStyle?: 1 | 2 | 3 | 4  // 1:全描边, 2:仅横线, 3:仅竖线, 4:无描边
}

// ============================================================================
// 颜色映射预设
// ============================================================================
const colorMappingPresets: Record<string, ColorMappingConfig> = {
  'Normal': {//普通
    primaryTarget: 'bgColor',
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 10, max: 90},
    lightnessRange: { level: [1,2,3,4,11,12,13,14,15], defaultLevel: 13 },
    bgColor: {}, // 使用主题色
    headerFillColor: { lightnessOffset: 13, saturationMultiplier: 0.8 },
    cellFillColor: { lightnessOffset: 13, saturationMultiplier: 0.8 },
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { lightnessOffset: 20, relativeTo: 'headerFillColor' },
    indexTextColor: {
      normal: { contrastThreshold: 50 },
    },
    // 样式配置
    hasHeader: true,
    fillStyle: 2,
    strokeStyle: 1,
  },
  'Soft': {//柔和
    primaryTarget: 'bgColor',
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 10, max: 80 },
    lightnessRange: { level: [1,2,3,4,5,11,12,13,14,15], defaultLevel: 14 },
    bgColor: {}, // 使用主题色
    headerFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
    cellFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
    headerTextColor: { lightnessOffset: 30, relativeTo: 'headerFillColor' },
    cellTextColor: { lightnessOffset: 30, relativeTo: 'headerFillColor'},
    strokeColor: { lightnessOffset: 10, relativeTo: 'headerFillColor' },
    indexTextColor: {
      normal: { lightnessOffset: 30, relativeTo: 'headerFillColor' },
    },
    indexStrokeColor: {
      pick: { lightnessOffset: 40, relativeTo: 'headerFillColor' },
    },
    indexBgColor: {
      pick: { lightnessOffset: 40, relativeTo: 'headerFillColor' }
    },
    // 样式配置
    hasHeader: true,
    fillStyle: 2,
    strokeStyle: 1,
  },
  'Fashion': {//时尚
    primaryTarget: 'headerFillColor',
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 50, max: 90 },
    lightnessRange: { level: [9,10,11], defaultLevel: 10},
    bgColor: {lightnessOffset: 405, saturationMultiplier: 0.95},
    headerFillColor: {},
    cellFillColor: { lightnessOffset: 10, saturationMultiplier: 1 ,opacity: 0.3},
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { lightnessOffset: 0.1, relativeTo: 'headerFillColor' },
    // 样式配置
    hasHeader: true,
    fillStyle: 2,
    strokeStyle: 4,
  },
  'Contrast': {//对比
    // primaryTarget 设为 null，表示主题色不直接赋予任何部位，所有部位都基于主题色计算衍生值
    primaryTarget: null,
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 50, max: 90 },
    lightnessRange: { level: [9,10,11,12,13,14,15], defaultLevel: 12},
    bgColor: {color: 'white'},
    headerFillColor: {color: 'black'},
    cellFillColor: { lightnessOffset: 0, saturationMultiplier: 1, opacity: 0.8 },
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { color: 'black' },
    indexBgColor: {
      pick: {lightnessOffset: 20, relativeTo: 'cellFillColor' }
    },
    indexStrokeColor: {
      pick: {lightnessOffset: 20, relativeTo: 'cellFillColor' }
    },
    indexTextColor: {
      pick: {color: 'black'}
    },
    // 样式配置
    hasHeader: true,
    fillStyle: 2,
    strokeStyle: 1,
  },
  'Vivid': {//鲜艳
    primaryTarget: 'bgColor',
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 80, max: 100 },
    lightnessRange: { level: [1,2,3,4,5,6,7,8,9,10,11,12,13], defaultLevel: 10},
    bgColor: {}, // 使用主题色
    headerFillColor: { lightnessOffset: 25, saturationMultiplier: 0.9 },
    cellFillColor: { lightnessOffset: 25, saturationMultiplier: 0.9 },
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { lightnessOffset: 10, relativeTo: 'bgColor' },
    // 样式配置
    hasHeader: true,
    fillStyle: 2,
    strokeStyle: 1,
  },
  'Pastel': {//粉嫩
    primaryTarget: 'bgColor',
    rgbOffset: { r: -10, g: -40, b: 20 },
    saturationRange: { min: 40, max: 100 },
    lightnessRange: { level: [12,13,14,15], defaultLevel: 14},
    bgColor: {}, // 使用主题色
    headerFillColor: { lightnessOffset: 15, saturationMultiplier: 0.9 },
    cellFillColor: { lightnessOffset: 15, saturationMultiplier: 0.9 },
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { lightnessOffset: 10, relativeTo: 'bgColor' },
    // 样式配置
    hasHeader: true,
    fillStyle: 2,
    strokeStyle: 1,
  },
  'Retro': {//复古
    primaryTarget: 'bgColor',
    rgbOffset: { r: 40, g: 30, b: -20 },
    saturationRange: { min: 10, max: 70 },
    lightnessRange: { level: [1,2,3,4,5,6,7,8,9,10,11,12,13,14], defaultLevel: 10},
    bgColor: {}, // 使用主题色
    headerFillColor: { lightnessOffset: 30, saturationMultiplier: 0.5 },
    cellFillColor: { lightnessOffset: 30, saturationMultiplier: 0.5},
    headerTextColor: { contrastThreshold: 50 },
    cellTextColor: { contrastThreshold: 50 },
    strokeColor: { lightnessOffset: 0, relativeTo: 'bgColor' },
    indexBgColor: {
      pick:{ lightnessOffset: 60, relativeTo: 'bgColor'}
    },
    // 样式配置
    hasHeader: true,
    fillStyle: 2,
    strokeStyle: 4,
  },
  'Neon': {//霓虹
    primaryTarget: null,
    rgbOffset: { r: 0, g: 0, b: 0 },
    saturationRange: { min: 80, max: 100 },
    lightnessRange: { level: [5,6,7,8,9,10,11,12], defaultLevel: 7 },
    bgColor: {color: 'black'}, 
    headerFillColor: { lightnessOffset: 5, saturationMultiplier: 1 },
    cellFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
    headerTextColor: { color: 'black' },
    cellTextColor: { color: 'theme' },
    strokeColor: { color: 'theme'},
    indexBgColor: {
      pick: {color: 'white'}
    },
    // 样式配置
    hasHeader: true,
    fillStyle: 2,
    strokeStyle: 2,
  },
}
// ============================================================================
// 主题色计算函数
// ============================================================================
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
  indexBgColor: { normal: string, pick: string }
  indexStrokeColor: { normal: string, pick: string }
  indexTextColor: { normal: string, pick: string }
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
      strokeColor: '#666666',
      indexBgColor: { normal: 'transparent', pick: '#D4D4D4' },
      indexStrokeColor: { normal: '#666666', pick: '#666666' },
      indexTextColor: { normal: '#666666', pick: '#2E2E2E' }
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
      strokeColor: '#666666',
      indexBgColor: { normal: 'transparent', pick: '#D4D4D4' },
      indexStrokeColor: { normal: '#666666', pick: '#666666' },
      indexTextColor: { normal: '#666666', pick: '#2E2E2E' }
    }
  }
  
  // 计算色阶颜色的亮度（0-100）
  // 直接从色阶颜色提取亮度值，不进行任何映射
  // lightnessRange.level 只用于菜单选项的过滤，不影响颜色计算逻辑
  const levelR = Math.round(levelRgb.r * 255)
  const levelG = Math.round(levelRgb.g * 255)
  const levelB = Math.round(levelRgb.b * 255)
  const levelHsl = rgbToHsl(levelR, levelG, levelB)
  let lightness = levelHsl.l // 直接使用色阶颜色的亮度值，不做任何修改
  
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
  const headerTextConfig = mappingConfig.headerTextColor
  if (headerTextConfig?.color === 'black') {
    headerTextColor = '#000000'
  } else if (headerTextConfig?.color === 'white') {
    headerTextColor = '#FFFFFF'
  } else if (headerTextConfig?.color === 'theme') {
    // 使用主题色
    const themeRgb = hslToRgb(actualHue, primaryS, primaryL)
    headerTextColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, headerTextConfig?.rgbOffset)
  } else if (headerTextConfig?.relativeTo || headerTextConfig?.lightnessOffset !== undefined) {
    // 支持主题色延伸：根据 relativeTo 和 lightnessOffset 计算
    let headerTextL: number
    let headerTextS: number
    
    if (headerTextConfig.relativeTo) {
      // 相对于某个颜色计算
      let baseL: number
      let baseS: number
      if (headerTextConfig.relativeTo === 'bgColor') {
        baseL = bgConfig.l
        baseS = bgConfig.s
      } else if (headerTextConfig.relativeTo === 'headerFillColor') {
        baseL = headerConfig.l
        baseS = headerConfig.s
      } else { // cellFillColor
        baseL = cellConfig.l
        baseS = cellConfig.s
      }
      
      // 根据色阶亮度决定是增加还是减少亮度
      const offset = headerTextConfig.lightnessOffset || 15
      if (lightness < 50) {
        // 暗色阶：文字色比基准色亮
        headerTextL = Math.min(100, baseL + offset)
      } else {
        // 亮色阶：文字色比基准色暗
        headerTextL = Math.max(0, baseL - offset)
      }
      headerTextS = baseS
    } else {
      // 默认基于表头填充色，根据色阶亮度调整
      const offset = headerTextConfig?.lightnessOffset || 15
      if (lightness < 50) {
        headerTextL = Math.min(100, headerConfig.l + offset)
      } else {
        headerTextL = Math.max(0, headerConfig.l - offset)
      }
      headerTextS = headerConfig.s
    }
    
    // 单色模式处理
    if (colorMode === 'monochrome') {
      if (hasRetroOffset) {
        // 有RGB偏移的样式，给一点点饱和度（10以内）
        headerTextS = Math.min(10, headerTextS)
      } else {
        // 没有RGB偏移的样式，强制饱和度为0
        headerTextS = 0
      }
    }
    
    const headerTextRgb = hslToRgb(actualHue, headerTextS, headerTextL)
    headerTextColor = applyRgbOffset(headerTextRgb.r, headerTextRgb.g, headerTextRgb.b, mappingConfig.rgbOffset, headerTextConfig?.rgbOffset)
  } else {
    // 默认：根据亮度自动判断使用黑白
    const headerThreshold = headerTextConfig?.contrastThreshold || 50
    headerTextColor = headerConfig.l >= headerThreshold ? '#000000' : '#FFFFFF'
  }
  
  let cellTextColor: string
  const cellTextConfig = mappingConfig.cellTextColor
  if (cellTextConfig?.color === 'black') {
    cellTextColor = '#000000'
  } else if (cellTextConfig?.color === 'white') {
    cellTextColor = '#FFFFFF'
  } else if (cellTextConfig?.color === 'theme') {
    // 使用主题色
    const themeRgb = hslToRgb(actualHue, primaryS, primaryL)
    cellTextColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, cellTextConfig?.rgbOffset)
  } else if (cellTextConfig?.relativeTo || cellTextConfig?.lightnessOffset !== undefined) {
    // 支持主题色延伸：根据 relativeTo 和 lightnessOffset 计算
    let cellTextL: number
    let cellTextS: number
    
    if (cellTextConfig.relativeTo) {
      // 相对于某个颜色计算
      let baseL: number
      let baseS: number
      if (cellTextConfig.relativeTo === 'bgColor') {
        baseL = bgConfig.l
        baseS = bgConfig.s
      } else if (cellTextConfig.relativeTo === 'headerFillColor') {
        baseL = headerConfig.l
        baseS = headerConfig.s
      } else { // cellFillColor
        baseL = cellConfig.l
        baseS = cellConfig.s
      }
      
      // 根据色阶亮度决定是增加还是减少亮度
      const offset = cellTextConfig.lightnessOffset || 15
      if (lightness < 50) {
        // 暗色阶：文字色比基准色亮
        cellTextL = Math.min(100, baseL + offset)
      } else {
        // 亮色阶：文字色比基准色暗
        cellTextL = Math.max(0, baseL - offset)
      }
      cellTextS = baseS
    } else {
      // 默认基于单元格填充色，根据色阶亮度调整
      const offset = cellTextConfig?.lightnessOffset || 15
      if (lightness < 50) {
        cellTextL = Math.min(100, cellConfig.l + offset)
      } else {
        cellTextL = Math.max(0, cellConfig.l - offset)
      }
      cellTextS = cellConfig.s
    }
    
    // 单色模式处理
    if (colorMode === 'monochrome') {
      if (hasRetroOffset) {
        // 有RGB偏移的样式，给一点点饱和度（10以内）
        cellTextS = Math.min(10, cellTextS)
      } else {
        // 没有RGB偏移的样式，强制饱和度为0
        cellTextS = 0
      }
    }
    
    const cellTextRgb = hslToRgb(actualHue, cellTextS, cellTextL)
    cellTextColor = applyRgbOffset(cellTextRgb.r, cellTextRgb.g, cellTextRgb.b, mappingConfig.rgbOffset, cellTextConfig?.rgbOffset)
  } else {
    // 默认：根据亮度自动判断使用黑白
    const cellThreshold = cellTextConfig?.contrastThreshold || 50
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
  
  // 计算行列数格子的颜色（辅助函数）
  const calculateIndexColor = (
    config: { 
      lightnessOffset?: number,
      relativeTo?: 'headerFillColor' | 'cellFillColor' | 'bgColor',
      color?: 'black' | 'white' | 'theme',
      rgbOffset?: { r?: number, g?: number, b?: number }
    } | undefined,
    defaultColor: string
  ): string => {
    if (!config) {
      return defaultColor
    }
    
    // 如果直接指定了颜色，使用固定颜色或主题色
    if (config.color === 'black') {
      return '#000000'
    } else if (config.color === 'white') {
      return '#FFFFFF'
    } else if (config.color === 'theme') {
      // 使用主题色
      const themeRgb = hslToRgb(actualHue, primaryS, primaryL)
      return applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, config.rgbOffset)
    } else {
      // 否则根据配置计算
      let indexL: number
      let indexS: number
      
      if (config.relativeTo) {
        // 相对于某个颜色计算
        let baseL: number
        let baseS: number
        if (config.relativeTo === 'bgColor') {
          baseL = bgConfig.l
          baseS = bgConfig.s
        } else if (config.relativeTo === 'headerFillColor') {
          baseL = headerConfig.l
          baseS = headerConfig.s
        } else { // cellFillColor
          baseL = cellConfig.l
          baseS = cellConfig.s
        }
        
        // 根据色阶亮度决定是增加还是减少亮度
        const offset = config.lightnessOffset || 15
        if (lightness < 50) {
          // 暗色阶：比基准色亮
          indexL = Math.min(100, baseL + offset)
        } else {
          // 亮色阶：比基准色暗
          indexL = Math.max(0, baseL - offset)
        }
        indexS = baseS
      } else {
        // 默认基于表头填充色，根据色阶亮度调整
        const offset = config.lightnessOffset || 15
        if (lightness < 50) {
          indexL = Math.min(100, headerConfig.l + offset)
        } else {
          indexL = Math.max(0, headerConfig.l - offset)
        }
        indexS = headerConfig.s
      }
      
      // 单色模式处理
      if (colorMode === 'monochrome') {
        if (hasRetroOffset) {
          // 有RGB偏移的样式，给一点点饱和度（10以内）
          indexS = Math.min(10, indexS)
        } else {
          // 没有RGB偏移的样式，强制饱和度为0
          indexS = 0
        }
      }
      
      const indexRgb = hslToRgb(actualHue, indexS, indexL)
      return applyRgbOffset(indexRgb.r, indexRgb.g, indexRgb.b, mappingConfig.rgbOffset, config.rgbOffset)
    }
  }
  
  // 计算 indexBgColor
  const indexBgConfig = mappingConfig.indexBgColor
  let indexBgColor: { normal: string, pick: string }
  if (indexBgConfig && indexBgConfig.colors) {
    // 使用直接指定的颜色
    indexBgColor = {
      normal: indexBgConfig.colors[0] || 'transparent',
      pick: indexBgConfig.colors[1] || 'transparent'
    }
  } else {
    // 使用基于主题色计算的配置
    indexBgColor = {
      normal: calculateIndexColor(indexBgConfig?.normal, 'transparent'),
      pick: calculateIndexColor(indexBgConfig?.pick, cellTextColor)
    }
  }
  
  // 计算 indexStrokeColor
  const indexStrokeConfig = mappingConfig.indexStrokeColor
  let indexStrokeColor: { normal: string, pick: string }
  if (indexStrokeConfig && indexStrokeConfig.colors) {
    // 使用直接指定的颜色
    indexStrokeColor = {
      normal: indexStrokeConfig.colors[0] || strokeColor,
      pick: indexStrokeConfig.colors[1] || strokeColor
    }
  } else {
    // normal 使用基于主题色计算的配置
    const normalStrokeColor = calculateIndexColor(indexStrokeConfig?.normal, strokeColor)
    
    // pick 状态时，默认与 bg 同色，但如果配置了则使用配置的颜色
    const pickConfig = indexStrokeConfig?.pick
    let pickStrokeColor: string
    if (pickConfig && (pickConfig.color || pickConfig.lightnessOffset !== undefined || pickConfig.relativeTo)) {
      // 如果配置了 pick，使用配置的颜色
      pickStrokeColor = calculateIndexColor(pickConfig, strokeColor)
    } else {
      // 如果没有配置 pick，默认使用 indexBgColor.pick 的颜色（同色高亮）
      pickStrokeColor = indexBgColor.pick
    }
    
    indexStrokeColor = {
      normal: normalStrokeColor,
      pick: pickStrokeColor
    }
  }
  
  // 计算 indexTextColor（支持 contrastThreshold）
  const indexTextConfig = mappingConfig.indexTextColor
  let indexTextColor: { normal: string, pick: string }
  if (indexTextConfig && indexTextConfig.colors) {
    // 使用直接指定的颜色
    indexTextColor = {
      normal: indexTextConfig.colors[0] || strokeColor,
      pick: indexTextConfig.colors[1] || bgColor
    }
  } else {
    // 使用基于主题色计算的配置
    // 计算 normal 颜色
    let normalColor: string
    const normalConfig = indexTextConfig?.normal
    if (normalConfig?.color === 'black') {
      normalColor = '#000000'
    } else if (normalConfig?.color === 'white') {
      normalColor = '#FFFFFF'
    } else if (normalConfig?.color === 'theme') {
      const themeRgb = hslToRgb(actualHue, primaryS, primaryL)
      normalColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, normalConfig?.rgbOffset)
    } else if (normalConfig?.contrastThreshold !== undefined) {
      // 根据亮度自动判断使用黑白（相对于 indexBgColor.normal 的亮度）
      const normalBgColor = indexBgColor.normal
      let normalBgL: number
      if (normalBgColor === 'transparent' || !normalBgColor) {
        // 如果背景是透明的，使用表格背景色的亮度
        normalBgL = bgConfig.l
      } else {
        const normalBgRgb = hexToRgb(normalBgColor)
        if (normalBgRgb) {
          const r = Math.round(normalBgRgb.r * 255)
          const g = Math.round(normalBgRgb.g * 255)
          const b = Math.round(normalBgRgb.b * 255)
          const normalBgHsl = rgbToHsl(r, g, b)
          normalBgL = normalBgHsl.l
        } else {
          normalBgL = bgConfig.l
        }
      }
      const threshold = normalConfig.contrastThreshold
      normalColor = normalBgL >= threshold ? '#000000' : '#FFFFFF'
    } else {
      normalColor = calculateIndexColor(normalConfig, strokeColor)
    }
    
    // 计算 pick 颜色
    let pickColor: string
    const pickConfig = indexTextConfig?.pick
    if (pickConfig?.color === 'black') {
      pickColor = '#000000'
    } else if (pickConfig?.color === 'white') {
      pickColor = '#FFFFFF'
    } else if (pickConfig?.color === 'theme') {
      const themeRgb = hslToRgb(actualHue, primaryS, primaryL)
      pickColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, pickConfig?.rgbOffset)
    } else if (pickConfig?.contrastThreshold !== undefined) {
      // 根据亮度自动判断使用黑白（相对于 indexBgColor.pick 的亮度）
      const pickBgColor = indexBgColor.pick
      let pickBgL: number
      if (pickBgColor === 'transparent' || !pickBgColor) {
        // 如果背景是透明的，使用表格背景色的亮度
        pickBgL = bgConfig.l
      } else {
        const pickBgRgb = hexToRgb(pickBgColor)
        if (pickBgRgb) {
          const r = Math.round(pickBgRgb.r * 255)
          const g = Math.round(pickBgRgb.g * 255)
          const b = Math.round(pickBgRgb.b * 255)
          const pickBgHsl = rgbToHsl(r, g, b)
          pickBgL = pickBgHsl.l
        } else {
          pickBgL = bgConfig.l
        }
      }
      const threshold = pickConfig.contrastThreshold
      pickColor = pickBgL >= threshold ? '#000000' : '#FFFFFF'
    } else {
      pickColor = calculateIndexColor(pickConfig, bgColor)
    }
    
    indexTextColor = {
      normal: normalColor,
      pick: pickColor
    }
  }
  
  return {
    bgColor,
    headerFillColor,
    headerTextColor,
    cellFillColor,
    cellTextColor,
    strokeColor,
    indexBgColor,
    indexStrokeColor,
    indexTextColor
  }
}

// ============================================================================
// TableRenderer 类
// ============================================================================

class TableRenderer {
  private config: TableConfig
  private themeColors: ReturnType<typeof calculateThemeColors> | null = null
  private onPickRow?: (rowIndex: number) => void
  private onPickCol?: (colIndex: number) => void
  private onSetRowHeight?: (rowIndex: number, height: number) => void
  private onSetColWidth?: (colIndex: number, width: number | 'fill') => void
  
  constructor(config: TableConfig, callbacks?: { 
    onPickRow?: (rowIndex: number) => void, 
    onPickCol?: (colIndex: number) => void,
    onSetRowHeight?: (rowIndex: number, height: number) => void,
    onSetColWidth?: (colIndex: number, width: number | 'fill') => void
  }) {
    this.config = config
    this.onPickRow = callbacks?.onPickRow
    this.onPickCol = callbacks?.onPickCol
    this.onSetRowHeight = callbacks?.onSetRowHeight
    this.onSetColWidth = callbacks?.onSetColWidth
    this.calculateThemeColors()
  }
  
  // 获取当前配置
  getConfig(): TableConfig {
    return { ...this.config }
  }
  
  // 更新配置（部分更新）
  updateConfig(partial: Partial<TableConfig>): void {
    this.config = { ...this.config, ...partial }
    // 如果主题相关配置改变，重新计算颜色
    if (partial.theme) {
      this.calculateThemeColors()
    }
  }
  
  // 切换单色模式（只改颜色）
  toggleColorMode(): void {
    const newMode = this.config.theme.colorMode === 'color' ? 'monochrome' : 'color'
    this.updateConfig({
      theme: { ...this.config.theme, colorMode: newMode }
    })
  }
  
  // 切换行列（只改数据数组）
  swapRowColumn(): void {
    const newData = this.transposeData(this.config.data)
    this.updateConfig({
      data: newData,
      isRowColumnSwapped: !this.config.isRowColumnSwapped
    })
  }
  
  // 显隐行列数（只改布尔）
  toggleRowColHeaders(): void {
    this.updateConfig({
      showRowColHeaders: !this.config.showRowColHeaders
    })
  }
  
  // 切换表头（只改布尔）
  toggleTableHeader(): void {
    this.updateConfig({
      theme: { ...this.config.theme, hasHeader: !this.config.theme.hasHeader }
    })
  }
  
  // 设置填充样式
  setFillStyle(style: 1 | 2 | 3 | 4): void {
    this.updateConfig({
      theme: { ...this.config.theme, fillStyle: style }
    })
  }
  
  // 设置描边样式
  setStrokeStyle(style: 1 | 2 | 3 | 4): void {
    this.updateConfig({
      theme: { ...this.config.theme, strokeStyle: style }
    })
  }
  
  // 选择行
  pickRow(rowIndex: number): void {
    const newPickedRowIndex = this.config.pickedRowIndex === rowIndex ? -1 : rowIndex
    this.updateConfig({
      pickedRowIndex: newPickedRowIndex,
      pickedColIndex: -1  // 选中行时，取消列选中
    })
  }
  
  // 选择列
  pickCol(colIndex: number): void {
    const newPickedColIndex = this.config.pickedColIndex === colIndex ? -1 : colIndex
    this.updateConfig({
      pickedColIndex: newPickedColIndex,
      pickedRowIndex: -1  // 选中列时，取消行选中
    })
  }
  
  // 计算主题色（内部方法）
  private calculateThemeColors(): void {
    // TODO: 调用 calculateThemeColors 函数
    const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets['Fashion']
    this.themeColors = calculateThemeColors(
      this.config.theme.hue,
      this.config.theme.level,
      currentMappingConfig,
      this.config.theme.colorMode
    )
  }
  
  // 获取主题色（公开方法）
  getThemeColors(): ReturnType<typeof calculateThemeColors> {
    if (!this.themeColors) {
      this.calculateThemeColors()
    }
    return this.themeColors!
  }
  
  // 转置数据（辅助方法）
  private transposeData(data: string[][]): string[][] {
    if (data.length === 0) return []
    
    const maxCols = Math.max(...data.map(col => col.length))
    const transposed: string[][] = []
    
    for (let i = 0; i < maxCols; i++) {
      transposed.push(data.map(col => col[i] || ''))
    }
    
    return transposed
  }
  
  // ============================================================================
  // 渲染辅助方法
  // ============================================================================
  
  // 获取最小行高（根据字号和 padding 计算）
  private getMinRowHeight(): number {
    // 最小行高 = 字号 + 上下 padding (8*2) = fontSize + 16
    return this.config.fontSize + 16
  }
  
  // 获取最小列宽（根据字号和 padding 计算）
  private getMinColWidth(): number {
    // 最小列宽 = 字号 + 左右 padding (8*2) = fontSize + 16
    return this.config.fontSize + 16
  }
  
  // 获取默认行高（根据字号计算，包含 padding）
  private getDefaultRowHeight(): number {
    return this.getMinRowHeight() // 默认行高等于最小行高
  }
  
  // 获取列宽配置（如果配置中没有，返回默认值 'fill'）
  private getColWidth(colIndex: number): number | 'fill' {
    const width = this.config.colWidths[colIndex]
    if (width === undefined) return 'fill'
    if (typeof width === 'number') {
      // 确保列宽不小于最小值
      return Math.max(width, this.getMinColWidth())
    }
    return width
  }
  
  // 获取行高配置（如果配置中没有，返回默认值）
  private getRowHeight(rowIndex: number): number | undefined {
    const height = this.config.rowHeights[rowIndex]
    if (height === undefined) {
      return this.getDefaultRowHeight()
    }
    // 确保行高不小于最小值
    return Math.max(height, this.getMinRowHeight())
  }
  
  // 将数字转换为 Excel 列号格式（A-Z, AA-ZZ, ...）
  private numberToColumnLetter(num: number): string {
    let result = ''
    while (num > 0) {
      num--
      result = String.fromCharCode(65 + (num % 26)) + result
      num = Math.floor(num / 26)
    }
    return result
  }
  
  // 计算首列宽度：根据字号和最大行数的位数
  private calculateRowHeaderWidth(actualRowCount: number): number {
    const maxRowNumber = actualRowCount
    const maxRowNumberDigits = maxRowNumber.toString().length
    // 宽度 = 字号 * 数字位数 + 左右padding (4*2) + 描边 (1*2)
    return this.config.fontSize * maxRowNumberDigits + 8 + 2 + (this.config.fontSize)
  }
  
  // 计算行号单元格的填充色（选中时使用区分色）
  private getRowHeaderFillColor(rowIndex: number): { r: number; g: number; b: number; a: number } | undefined {
    const themeColors = this.getThemeColors()
    const isPicked = this.config.pickedRowIndex === rowIndex && this.config.pickedRowIndex !== -1
    const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets['Fashion']
    const indexConfig = currentMappingConfig.indexBgColor
    
    // 使用计算出的颜色
    const color = isPicked ? themeColors.indexBgColor.pick : themeColors.indexBgColor.normal
    const opacity = indexConfig?.opacity?.[isPicked ? 1 : 0] ?? 1
    
    if (color === 'transparent' || !color) {
      return undefined
    }
    
    const rgb = hexToRgb(color)
    if (!rgb) return undefined
    
    return { ...rgb, a: opacity }
  }
  
  // 计算列号单元格的填充色（选中时使用区分色）
  private getColHeaderFillColor(colIndex: number): { r: number; g: number; b: number; a: number } | undefined {
    const themeColors = this.getThemeColors()
    const isPicked = this.config.pickedColIndex === colIndex && this.config.pickedColIndex !== -1
    const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets['Fashion']
    const indexConfig = currentMappingConfig.indexBgColor
    
    // 使用计算出的颜色
    const color = isPicked ? themeColors.indexBgColor.pick : themeColors.indexBgColor.normal
    const opacity = indexConfig?.opacity?.[isPicked ? 1 : 0] ?? 1
    
    if (color === 'transparent' || !color) {
      return undefined
    }
    
    const rgb = hexToRgb(color)
    if (!rgb) return undefined
    
    return { ...rgb, a: opacity }
  }
  
  // 计算行号/列号单元格的描边色
  private getIndexStrokeColor(isPicked: boolean): { r: number; g: number; b: number; a: number } {
    const themeColors = this.getThemeColors()
    const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets['Fashion']
    const indexConfig = currentMappingConfig.indexStrokeColor
    
    // 使用计算出的颜色
    const color = isPicked ? themeColors.indexStrokeColor.pick : themeColors.indexStrokeColor.normal
    const opacity = indexConfig?.opacity?.[isPicked ? 1 : 0] ?? 1
    
    const strokeColorRgb = hexToRgb(themeColors.strokeColor) || { r: 0.4, g: 0.4, b: 0.4, a: 1 }
    const rgb = hexToRgb(color) || strokeColorRgb
    return { ...rgb, a: opacity }
  }
  
  // 计算行号/列号单元格的文字颜色
  private getIndexTextColor(isPicked: boolean): { r: number; g: number; b: number; a: number } {
    const themeColors = this.getThemeColors()
    const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets['Fashion']
    const indexConfig = currentMappingConfig.indexTextColor
    
    // 使用计算出的颜色
    const color = isPicked ? themeColors.indexTextColor.pick : themeColors.indexTextColor.normal
    const opacity = indexConfig?.opacity?.[isPicked ? 1 : 0] ?? 1
    
    const rgb = hexToRgb(color) || { r: 0.83, g: 0.83, b: 0.83, a: 1 }
    return { ...rgb, a: opacity }
  }
  
  // 判断是否显示填充
  private shouldFillByIndex(rowIndex: number, colIndex: number, isHeader: boolean = false): boolean {
    // 表头始终有填充
    if (isHeader) return true
    
    const fillStyle = this.config.theme.fillStyle
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
  
  // 计算各边的描边宽度
  private getStrokeWeights(): { top: number; right: number; bottom: number; left: number } {
    const strokeStyle = this.config.theme.strokeStyle
    const strokeWidth = 1
    
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
  
  // 渲染行列号单元格的辅助函数（@tn，不填充，固定描边）
  private renderRowColHeaderCell(
    cellValue: string,
    rowIndex: number,
    colIndex: number,
    isRowHeader: boolean, // true=行号单元格, false=列号单元格
    key: string,
    cellHeight?: number, // 可选：指定高度（用于首行）
    cellWidth?: number // 可选：指定宽度（用于首列）
  ): ReturnType<typeof AutoLayout> {
    // 获取行高配置（如果是行号单元格，使用对应行的配置）
    const rowHeight = isRowHeader && rowIndex >= 0 ? this.getRowHeight(rowIndex) : undefined
    // 获取列宽配置（如果是列号单元格，使用对应列的配置）
    const colWidth = !isRowHeader && colIndex >= 0 ? this.getColWidth(colIndex) : undefined
    
    // 确定最终的高度和宽度
    // 行号单元格：使用对应行的统一行高（cellHeight 用于首行，其他使用 rowHeight）
    const finalHeight = cellHeight || (isRowHeader && rowIndex >= 0 ? rowHeight : undefined)
    let finalWidth: number | "fill-parent" | undefined
    if (cellWidth) {
      finalWidth = cellWidth
    } else if (colWidth === 'fill') {
      finalWidth = "fill-parent"
    } else if (colWidth !== undefined && typeof colWidth === 'number') {
      finalWidth = colWidth
    } else {
      finalWidth = isRowHeader ? undefined : "fill-parent"
    }
    
    // 确定是否被选中
    const isPicked = (isRowHeader && rowIndex >= 0 && this.config.pickedRowIndex === rowIndex && this.config.pickedRowIndex !== -1) ||
                     (!isRowHeader && colIndex >= 0 && this.config.pickedColIndex === colIndex && this.config.pickedColIndex !== -1)
    
    // 确定填充色：如果是行号单元格且被选中，使用区分色；如果是列号单元格且被选中，也使用区分色
    const fillColor = isRowHeader && rowIndex >= 0 
      ? this.getRowHeaderFillColor(rowIndex) 
      : (!isRowHeader && colIndex >= 0 ? this.getColHeaderFillColor(colIndex) : undefined)
    
    // 确定描边色：使用配置的描边色
    const strokeColor = this.getIndexStrokeColor(isPicked)
    
    // 确定文字颜色：使用配置的文字颜色
    const textColorWithOpacity = this.getIndexTextColor(isPicked)
    
    // 获取当前的行高或列宽值（用于 input 显示）
    let currentValue: string = ''
    if (isRowHeader && rowIndex >= 0) {
      // 行号单元格：显示行高
      const currentHeight = this.getRowHeight(rowIndex)
      currentValue = currentHeight ? currentHeight.toString() : ''
    } else if (!isRowHeader && colIndex >= 0) {
      // 列号单元格：显示列宽
      const currentWidth = this.getColWidth(colIndex)
      if (currentWidth === 'fill') {
        currentValue = 'fill'
      } else if (typeof currentWidth === 'number') {
        currentValue = currentWidth.toString()
      } else {
        currentValue = ''
      }
    }
    
    return (
      <AutoLayout
        key={key}
        name="@tn"
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="center"
        width={finalWidth}
        height={finalHeight}
        padding={4}
        // 选中时填充区分色，否则不填充
        fill={fillColor}
        // 使用配置的描边色
        stroke={strokeColor}
        strokeWidth={1}
        strokeAlign="center"
        onClick={(isRowHeader && rowIndex >= 0) || (!isRowHeader && colIndex >= 0) ? (e) => {
          // 使用 WidgetClickEvent 的 offsetY 判断点击区域
          // 当 Input 显示时（isPicked），如果点击在下部区域（可能是 Input），则不触发选择
          if (isPicked) {
            // 获取 AutoLayout 的实际高度
            // finalHeight 可能是 number 或 undefined
            if (typeof finalHeight === "number") {
              const clickRatio = e.offsetY / finalHeight
              // 如果点击在下部区域（超过 50%，考虑到 Text 占据上部），可能是 Input，不触发选择
              // 估算 Text 占据上部约 40-50%，Input 在下部 50-60%
              if (clickRatio > 0.5) {
                return
              }
            }
            // 对于 undefined，使用 offsetY 的绝对值判断
            // 假设 Text 高度约为 fontSize * 0.8 * 1.2（包含行高），约 11-15px
            // 如果 offsetY 超过 20px，可能是 Input 区域
            else if (e.offsetY > 20) {
              return
            }
          }
          // 点击行号或列号单元格时，调用回调函数更新状态
          if (isRowHeader && rowIndex >= 0) {
            if (this.onPickRow) {
              // 如果已选中则取消选中（设置为 -1），否则选中该行
              const newPickedRowIndex = this.config.pickedRowIndex === rowIndex ? -1 : rowIndex
              this.onPickRow(newPickedRowIndex)
            }
          } else if (!isRowHeader && colIndex >= 0) {
            if (this.onPickCol) {
              // 如果已选中则取消选中（设置为 -1），否则选中该列
              const newPickedColIndex = this.config.pickedColIndex === colIndex ? -1 : colIndex
              this.onPickCol(newPickedColIndex)
            }
          }
        } : undefined}
      >
        <Text
          fontSize={this.config.fontSize * 0.8}
          fill={textColorWithOpacity}
          width="fill-parent"
          horizontalAlignText="center"
          verticalAlignText="center"
          fontWeight="normal"
        >
          {cellValue|| ''}
        </Text>
        {/* Input 元素：用于修改行高或列宽，只在选中时显示 */}
        {((isRowHeader && rowIndex >= 0) || (!isRowHeader && colIndex >= 0)) ? (
          <Input
            value={currentValue}
            placeholder={isRowHeader ? "H" : "W"}
            inputFrameProps={{
              hidden: !isPicked,
              horizontalAlignItems: "center",
              fill: this.themeColors?.strokeColor,
              cornerRadius: 2,
              padding: 1,
            }}
            onTextEditEnd={(e) => {
              const newValue = e.characters.trim()
              if (isRowHeader && rowIndex >= 0) {
                // 行号单元格：更新行高
                if (this.onSetRowHeight) {
                  const height = parseFloat(newValue)
                  if (!isNaN(height) && height > 0) {
                    // 确保行高不小于最小值
                    const minHeight = this.getMinRowHeight()
                    this.onSetRowHeight(rowIndex, Math.max(height, minHeight))
                  }
                }
              } else if (!isRowHeader && colIndex >= 0) {
                // 列号单元格：更新列宽
                if (this.onSetColWidth) {
                  if (newValue.toLowerCase() === 'fill') {
                    this.onSetColWidth(colIndex, 'fill')
                  } else {
                    const width = parseFloat(newValue)
                    if (!isNaN(width) && width > 0) {
                      // 确保列宽不小于最小值
                      const minWidth = this.getMinColWidth()
                      this.onSetColWidth(colIndex, Math.max(width, minWidth))
                    }
                  }
                }
              }
            }}
            width="fill-parent"
            horizontalAlignText="center"
            fontSize={this.config.fontSize * 0.6}
            fill={this.themeColors?.headerTextColor}
          />
        ) : null}
      </AutoLayout>
    )
  }
  
  // 渲染表格
  render(): ReturnType<typeof AutoLayout> {
    // TODO: 迁移完整的渲染逻辑（约 1577-2430 行）
    // 需要复制 code.tsx 中的完整渲染逻辑到此处
    // 包括：空表格检查、颜色计算、单元格渲染、行列号渲染、选择指示器等
    
    const { data } = this.config
    const actualColCount = data.length
    const actualRowCount = data.length > 0 ? data[0]?.length || 0 : 0
    
    // 临时：返回空表格提示
    if (actualColCount === 0 || actualRowCount === 0) {
      const themeColors = this.getThemeColors()
      const strokeColorRgb = hexToRgb(themeColors.strokeColor) || { r: 0.4, g: 0.4, b: 0.4, a: 1 }
      
      return (
        <AutoLayout
          name="@table"
          direction="vertical"
          stroke={this.config.theme.strokeStyle !== 4 ? strokeColorRgb : undefined}
          strokeWidth={this.config.theme.strokeStyle !== 4 ? 1 : 0}
          strokeAlign="center"
          spacing={0}
          padding={12}
          fill={hexToRgb(themeColors.bgColor) || { r: 0.18, g: 0.18, b: 0.18, a: 1 }}
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
    
    // 计算主题色和颜色相关变量
    const themeColors = this.getThemeColors()
    const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets['Fashion']
    const strokeColorRgb = hexToRgb(themeColors.strokeColor) || { r: 0.4, g: 0.4, b: 0.4, a: 1 }
    const bgRgb = hexToRgb(themeColors.bgColor) || { r: 0.18, g: 0.18, b: 0.18, a: 1 }
    const headerFillRgb = hexToRgb(themeColors.headerFillColor) || { r: 0.24, g: 0.24, b: 0.24, a: 1 }
    const cellFillRgbBase = hexToRgb(themeColors.cellFillColor) || { r: 0.24, g: 0.24, b: 0.24, a: 1 }
    const cellFillOpacity = currentMappingConfig.cellFillColor?.opacity !== undefined 
      ? currentMappingConfig.cellFillColor.opacity 
      : 0.4
    const cellFillRgb = { ...cellFillRgbBase, a: cellFillOpacity }
    const headerTextRgb = hexToRgb(themeColors.headerTextColor) || { r: 1, g: 1, b: 1, a: 1 }
    const cellTextRgb = hexToRgb(themeColors.cellTextColor) || { r: 0.83, g: 0.83, b: 0.83, a: 1 }
    
    // 计算描边相关
    const strokeWeights = this.getStrokeWeights()
    const strokeWidth = 1
    const hasAnyStroke = this.config.theme.strokeStyle !== 4
    const colHeaderHeight = this.config.fontSize * 2
    
    // 计算列宽相关
    const allColWidths = actualColCount > 0 ? Array.from({ length: actualColCount }, (_, i) => this.getColWidth(i)) : []
    const allAreNumbers = allColWidths.length > 0 && allColWidths.every(w => w !== 'fill')
    const allAreFill = allColWidths.length > 0 && allColWidths.every(w => w === 'fill')
    const fillCount = allColWidths.filter(w => w === 'fill').length // 统计 fill 列的数量
    
    // 计算所有列的实际渲染宽度（处理 fill 的情况）
    const calculateActualColWidths = (): number[] => {
      if (actualColCount === 0) return []
      
      const actualWidths: number[] = []
      let fixedWidthSum = 0
      let fillCount = 0
      
      // 先统计固定宽度和 fill 的数量
      allColWidths.forEach(width => {
        if (typeof width === 'number') {
          fixedWidthSum += width
          actualWidths.push(width)
        } else {
          fillCount++
          actualWidths.push(0) // 占位，稍后计算
        }
      })
      
      // 计算 fill 列的实际宽度
      if (fillCount > 0) {
        // 获取行号列的宽度（如果显示行列号）
        const rowHeaderWidth = this.config.showRowColHeaders ? this.calculateRowHeaderWidth(actualRowCount) : 0
        
        let fillWidth: number
        if (allAreFill) {
          // 全部是 fill 时，tableWidth 是 UI 侧设置的数据列宽度（不包括行号列）
          // 所以直接使用 tableWidth 除以 fill 列数即可
          fillWidth = this.config.tableWidth / fillCount
        } else if (allAreNumbers) {
          // 全部是数值时，fill 不应该存在（因为默认是 fill），但为了安全，使用默认值
          fillWidth = this.config.fontSize * 8 // 默认列宽
        } else {
          // 混合情况：根据表格宽度模式计算
          // tableWidth 是 UI 侧设置的数据列宽度（不包括行号列）
          // 所以使用 tableWidth 减去固定列宽后平均分配
          const baseWidth = allAreFill ? this.config.tableWidth : (this.config.fontSize * 25)
          const minColWidth = this.getMinColWidth() // 使用统一的最小列宽
          fillWidth = Math.max(minColWidth, (baseWidth - fixedWidthSum) / fillCount)
        }
        
        // 填充 fill 列的实际宽度
        allColWidths.forEach((width, index) => {
          if (width === 'fill') {
            actualWidths[index] = fillWidth
          }
        })
      }
      
      return actualWidths
    }
    
    const actualColWidths = calculateActualColWidths()
    
    // 确定表格宽度
    const rowHeaderWidth = this.config.showRowColHeaders ? this.calculateRowHeaderWidth(actualRowCount) : 0
    let tableFinalWidth: number
    if (fillCount > 0) {
      // 当存在 fill 列时，使用 UI 侧设置的 tableWidth（数据列宽度）+ 行号列宽度
      tableFinalWidth = this.config.tableWidth + rowHeaderWidth
    } else {
      // 当全是数值列时，使用实际列宽之和（包括行号列）
      const dataColsWidthSum = actualColWidths.reduce((acc: number, width: number) => acc + width, 0)
      tableFinalWidth = rowHeaderWidth + dataColsWidthSum
    }
    
    // 开启行列数时，强制 @table 描边
    const tableHasStroke = hasAnyStroke || this.config.showRowColHeaders
    
    return (
      <AutoLayout
      name="@table"
      direction="horizontal"
      stroke={tableHasStroke ? strokeColorRgb : undefined}
      strokeWidth={tableHasStroke ? strokeWidth : 0}
      strokeAlign="center"
      spacing={0}
      padding={0}
      fill={bgRgb}
      cornerRadius={4}
      width={tableFinalWidth}
    >
      
      {/* 行号列：始终渲染，使用 hidden 控制显隐 */}
      {(() => {
        const rowHeaderWidth = this.calculateRowHeaderWidth(actualRowCount)
        return (
          <AutoLayout
            key="row-header-column"
            name="@row-header-column"
            hidden={!this.config.showRowColHeaders}
            overflow="visible"
            direction="vertical"
            spacing={0}
            padding={0}
            width={rowHeaderWidth}
          >
            {/* 左上角单元格（如果显示列号，则为空或显示特殊标记） */}
            {this.renderRowColHeaderCell('', -1, -1, false, 'row-col-corner', colHeaderHeight, rowHeaderWidth)}
            
            {/* 行号：1, 2, 3, ... */}
            {Array.from({ length: actualRowCount }).map((_, rowIndex) => {
              const rowNumber = rowIndex + 1
              return this.renderRowColHeaderCell(
                rowNumber.toString(), 
                rowIndex, 
                -1, 
                true, 
                `row-header-${rowIndex}`,
                undefined,
                rowHeaderWidth
              )
            })}
          </AutoLayout>
        )
      })()}
      
      {/* 列结构：@table > @column > @th/td */}
      {data.map((column, colIndex) => {
        // 判断当前列是否应该显示为表头列
        // 正常模式（isRowColumnSwapped = false）：第一行是表头，即 column[0] 是表头
        // 反行列模式（isRowColumnSwapped = true）：第一列是表头，即 colIndex === 0 的所有元素是表头
        // 如果isTableHeader为false，则不使用表头
        const isHeaderColumn = this.config.theme.hasHeader && this.config.isRowColumnSwapped ? (colIndex === 0) : false
        const actualRowCount = column.length
        
        // 获取列宽配置（使用统一的对象控制，带默认值）
        const colWidth = this.getColWidth(colIndex)
        // 处理列宽：如果是 'fill' 则使用 fill-parent，否则使用数值
        const columnWidth = colWidth === 'fill' ? "fill-parent" : colWidth
        
        return (
        <AutoLayout
          key={`column-${colIndex}`}
          name="@column"
          overflow="visible"
          direction="vertical"
          spacing={0}
          padding={0}
          width={columnWidth}
        >
          {/* 列号单元格：始终渲染，使用 hidden 控制显隐 */}
          <AutoLayout
            name="@col-header-wrapper"
            hidden={!this.config.showRowColHeaders}
            direction="vertical"
            width="fill-parent"
            spacing={0}
            padding={0}
          >
            {this.renderRowColHeaderCell(
              this.numberToColumnLetter(colIndex + 1), 
              -1, 
              colIndex, 
              false, 
              `col-header-${colIndex}`,
              colHeaderHeight
            )}
          </AutoLayout>
          
          {isHeaderColumn ? (
            // 反行列模式：第一列的所有元素都是表头
            column.map((cellValue, rowIndex) => {
              // 获取对应行的统一行高（和行数格一样）
              const finalHeight = this.getRowHeight(rowIndex)
              return (
              <AutoLayout
                key={`th-${rowIndex}`}
                name="@th"
                direction="vertical"
                spacing={0}
                padding={0}
                width="fill-parent"
                height={finalHeight}
                fill={this.shouldFillByIndex(rowIndex, colIndex, true) ? headerFillRgb : undefined}
              >
                {/* 上描边：始终渲染，使用 hidden 控制显隐 */}
                <Rectangle
                  name="@stroke-top"
                  hidden={strokeWeights.top === 0}
                  width="fill-parent"
                  height={0}
                  stroke={strokeColorRgb}
                  strokeWidth={strokeWeights.top}
                  strokeAlign="center"
                />
                {/* 内容区域：水平布局包含左描边、文本、右描边 */}
                <AutoLayout
                  name="@th-content"
                  direction="horizontal"
                  spacing={0}
                  padding={0}
                  width="fill-parent"
                  height="fill-parent"
                >
                  {/* 左描边：始终渲染，使用 hidden 控制显隐 */}
                  <Rectangle
                    name="@stroke-left"
                    hidden={strokeWeights.left === 0}
                    width={0}
                    height="fill-parent"
                    stroke={strokeColorRgb}
                    strokeWidth={strokeWeights.left}
                    strokeAlign="center"
                  />
                  {/* 文本 */}
                  <AutoLayout
                    name="@th-text"
                    direction="vertical"
                    spacing={0}
                    width="fill-parent"
                    height="fill-parent"
                    verticalAlignItems="center"
                  >
                    <Text
                      fontSize={this.config.fontSize}
                      fill={headerTextRgb}
                      width="fill-parent"
                      horizontalAlignText="center"
                      fontWeight="bold"
                    >
                      {cellValue || ''}
                    </Text>
                  </AutoLayout>
                  {/* 右描边：始终渲染，使用 hidden 控制显隐 */}
                  <Rectangle
                    name="@stroke-right"
                    hidden={strokeWeights.right === 0}
                    width={0}
                    height="fill-parent"
                    stroke={strokeColorRgb}
                    strokeWidth={strokeWeights.right}
                    strokeAlign="center"
                  />
                </AutoLayout>
                {/* 下描边：始终渲染，使用 hidden 控制显隐 */}
                <Rectangle
                  name="@stroke-bottom"
                  hidden={strokeWeights.bottom === 0}
                  width="fill-parent"
                  height={0}
                  stroke={strokeColorRgb}
                  strokeWidth={strokeWeights.bottom}
                  strokeAlign="center"
                />
              </AutoLayout>
              )
            })
          ) : (
            <>
              {/* 正常模式：第一行是表头（如果isTableHeader为true） */}
              {!this.config.isRowColumnSwapped && this.config.theme.hasHeader && (() => {
                // 获取第一行的统一行高（和行数格一样）
                const finalHeight = this.getRowHeight(0)
                return (
                <AutoLayout
                  name="@th"
                  direction="vertical"
                  spacing={0}
                  padding={0}
                  width="fill-parent"
                  height={finalHeight}
                  fill={this.shouldFillByIndex(0, colIndex, true) ? headerFillRgb : undefined}
                >
                  {/* 上描边：始终渲染，使用 hidden 控制显隐 */}
                  <Rectangle
                    name="@stroke-top"
                    hidden={strokeWeights.top === 0}
                    width="fill-parent"
                    height={0}
                    stroke={strokeColorRgb}
                    strokeWidth={strokeWeights.top}
                    strokeAlign="center"
                  />
                  {/* 内容区域：水平布局包含左描边、文本、右描边 */}
                  <AutoLayout
                    name="@th-content"
                    direction="horizontal"
                    spacing={0}
                    padding={0}
                    width="fill-parent"
                    height="fill-parent"
                  >
                    {/* 左描边：始终渲染，使用 hidden 控制显隐 */}
                    <Rectangle
                      name="@stroke-left"
                      hidden={strokeWeights.left === 0}
                      width={0}
                      height="fill-parent"
                      stroke={strokeColorRgb}
                      strokeWidth={strokeWeights.left}
                      strokeAlign="center"
                    />
                    {/* 文本 */}
                    <AutoLayout
                      name="@th-text"
                      direction="vertical"
                      spacing={0}
                      padding={8}
                      width="fill-parent"
                      height="fill-parent"
                      verticalAlignItems="center"
                    >
                      <Text
                        fontSize={this.config.fontSize}
                        fill={headerTextRgb}
                        width="fill-parent"
                        horizontalAlignText="center"
                        fontWeight="bold"
                      >
                        {column[0] || ''}
                      </Text>
                    </AutoLayout>
                    {/* 右描边：始终渲染，使用 hidden 控制显隐 */}
                    <Rectangle
                      name="@stroke-right"
                      hidden={strokeWeights.right === 0}
                      width={0}
                      height="fill-parent"
                      stroke={strokeColorRgb}
                      strokeWidth={strokeWeights.right}
                      strokeAlign="center"
                    />
                  </AutoLayout>
                  {/* 下描边：始终渲染，使用 hidden 控制显隐 */}
                  <Rectangle
                    name="@stroke-bottom"
                    hidden={strokeWeights.bottom === 0}
                    width="fill-parent"
                    height={0}
                    stroke={strokeColorRgb}
                    strokeWidth={strokeWeights.bottom}
                    strokeAlign="center"
                  />
                </AutoLayout>
                )
              })()}

              {/* 数据单元格 @td */}
              {Array.from({ length: Math.max(0, actualRowCount - (this.config.isRowColumnSwapped ? 0 : (this.config.theme.hasHeader ? 1 : 0))) }).map((_, rowIndex) => {
                const cellValue = column[this.config.isRowColumnSwapped ? rowIndex : (this.config.theme.hasHeader ? rowIndex + 1 : rowIndex)] || ''
                const shouldFillThisCell = this.shouldFillByIndex(rowIndex, colIndex, false)
                // 获取对应行的统一行高（和行数格一样）
                // 计算实际的行索引（考虑表头）
                const actualRowIndex = this.config.isRowColumnSwapped ? rowIndex : (this.config.theme.hasHeader ? rowIndex + 1 : rowIndex)
                const finalHeight = this.getRowHeight(actualRowIndex)
                return (
                  <AutoLayout
                    key={`td-${rowIndex}`}
                    name="@td"
                    direction="vertical"
                    spacing={0}
                    padding={0}
                    width="fill-parent"
                    height={finalHeight}
                    fill={shouldFillThisCell ? cellFillRgb : undefined}
                  >
                    {/* 上描边：始终渲染，使用 hidden 控制显隐 */}
                    <Rectangle
                      name="@stroke-top"
                      hidden={strokeWeights.top === 0}
                      width="fill-parent"
                      height={0}
                      stroke={strokeColorRgb}
                      strokeWidth={strokeWeights.top}
                      strokeAlign="center"
                    />
                    {/* 内容区域：水平布局包含左描边、文本、右描边 */}
                    <AutoLayout
                      name="@td-content"
                      direction="horizontal"
                      spacing={0}
                      padding={0}
                      width="fill-parent"
                      height="fill-parent"
                    >
                      {/* 左描边：始终渲染，使用 hidden 控制显隐 */}
                      <Rectangle
                        name="@stroke-left"
                        hidden={strokeWeights.left === 0}
                        width={0}
                        height="fill-parent"
                        stroke={strokeColorRgb}
                        strokeWidth={strokeWeights.left}
                        strokeAlign="center"
                      />
                      {/* 文本 */}
                      <AutoLayout
                        name="@td-text"
                        direction="vertical"
                        spacing={0}
                        padding={8}
                        width="fill-parent"
                        height="fill-parent"
                        verticalAlignItems="center"
                      >
                        <Text
                          fontSize={this.config.fontSize}
                          fill={cellTextRgb}
                          width="fill-parent"
                          horizontalAlignText="center"
                          fontWeight="normal"
                        >
                          {cellValue}
                        </Text>
                      </AutoLayout>
                      {/* 右描边：始终渲染，使用 hidden 控制显隐 */}
                      <Rectangle
                        name="@stroke-right"
                        hidden={strokeWeights.right === 0}
                        width={0}
                        height="fill-parent"
                        stroke={strokeColorRgb}
                        strokeWidth={strokeWeights.right}
                        strokeAlign="center"
                      />
                    </AutoLayout>
                    {/* 下描边：始终渲染，使用 hidden 控制显隐 */}
                    <Rectangle
                      name="@stroke-bottom"
                      hidden={strokeWeights.bottom === 0}
                      width="fill-parent"
                      height={0}
                      stroke={strokeColorRgb}
                      strokeWidth={strokeWeights.bottom}
                      strokeAlign="center"
                    />
                  </AutoLayout>
                )
              })}
            </>
          )}
        </AutoLayout>
        )
      })}
      {/* 行选中指示器 */}
      {this.config.showRowColHeaders && (() => {
        // 使用 hidden 控制显示/隐藏，pickedRowIndex === -1 时隐藏
        const isHidden = this.config.pickedRowIndex === -1
        
        // 如果隐藏，仍然渲染但使用 hidden 属性，位置和大小使用默认值
        if (isHidden) {
          return (
            <Rectangle
              name="@ROW_PICK"
              hidden={true}
              positioning="absolute"
              x={0}
              y={0}
              width={1}
              height={1}
              stroke={this.getIndexStrokeColor(true)}
              strokeWidth={strokeWidth}
              strokeAlign="center"
            />
          )
        }

        // 计算 y 位置：累计前面行的行高（包括列号行的高度）
        let pickY = colHeaderHeight // 列号行的高度
        for (let i = 0; i < this.config.pickedRowIndex; i++) {
          const rowH = this.getRowHeight(i)
          if (rowH !== undefined) {
            pickY += rowH
          }
        }
        
        // 计算宽度：使用实际列宽数组，这样可以正确处理 fill 列的情况
        // 使用 calculateActualColWidths() 计算的实际宽度数组
        // 需要加上行号列的宽度（如果显示行号列）
        const rowHeaderWidth = this.config.showRowColHeaders ? this.calculateRowHeaderWidth(actualRowCount) : 0
        const pickWidth = rowHeaderWidth + actualColWidths.reduce((acc: number, width: number) => {
          return acc + width
        }, 0)
        
        // 计算高度：使用选中行的行高
        const pickHeight = this.getRowHeight(this.config.pickedRowIndex) || this.getDefaultRowHeight()
        
        return (
          <Rectangle
            name="@ROW_PICK"
            hidden={false}
            positioning="absolute"
            x={0}
            y={pickY}
            width={pickWidth}
            height={pickHeight}
            stroke={this.getIndexStrokeColor(true)}
            strokeWidth={strokeWidth}
            strokeAlign="center"
          />
        )
      })()}
      
      {/* 列选中指示器 */}
      {this.config.showRowColHeaders && (() => {
        // 使用 hidden 控制显示/隐藏，pickedColIndex === -1 时隐藏
        const isColHidden = this.config.pickedColIndex === -1
        
        // 如果隐藏，仍然渲染但使用 hidden 属性，位置和大小使用默认值
        if (isColHidden) {
          return (
            <Rectangle
              name="@COL_PICK"
              hidden={true}
              positioning="absolute"
              x={0}
              y={0}
              width={1}
              height={1}
              stroke={this.getIndexStrokeColor(true)}
              strokeWidth={strokeWidth}
              strokeAlign="center"
            />
          )
        }
        
        // 计算 x 位置：累计前面列的宽度（包括行号列的宽度）
        const rowHeaderWidth = this.calculateRowHeaderWidth(actualRowCount)
        let pickX = rowHeaderWidth // 从行号列之后开始
        for (let i = 0; i < this.config.pickedColIndex; i++) {
          pickX += actualColWidths[i] || 0
        }
        
        // 计算宽度：使用选中列的实际渲染宽度
        // 确保使用 actualColWidths 中的值，如果无效则使用默认列宽
        const pickedColWidth = actualColWidths[this.config.pickedColIndex]
        const defaultColWidth = this.config.fontSize * 8 // 默认列宽
        const pickWidth = (pickedColWidth !== undefined && pickedColWidth > 0) ? pickedColWidth : defaultColWidth
        
        // 计算高度：整个表格的高度（列号行 + 所有数据行）
        let pickHeight = colHeaderHeight // 列号行的高度
        for (let i = 0; i < actualRowCount; i++) {
          const rowH = this.getRowHeight(i)
          if (rowH !== undefined) {
            pickHeight += rowH
          }
        }
        
        return (
          <Rectangle
            name="@COL_PICK"
            hidden={false}
            positioning="absolute"
            x={pickX}
            y={0}
            width={pickWidth}
            height={pickHeight}
            stroke={this.getIndexStrokeColor(true)}
            strokeWidth={strokeWidth}
            strokeAlign="center"
          />
        )
      })()}
    </AutoLayout>
    )
  }
}

// ============================================================================
// Widget 函数
// ============================================================================

function Widget() {
  // 示例数据
  const exampleTableText = 'A1\tB1\tC1\na2\tb2\tc2\na3\tb3\tc3\na4\tb4\tc4'
  
  // 从 useSyncedState 读取配置（保持向后兼容）
  const [processedTableData, setProcessedTableData] = useSyncedState<string[][]>('processedTableData', [])
  const [tableText, setTableText] = useSyncedState('tableText', exampleTableText)
  const [fillStyle, setFillStyle] = useSyncedState('fillStyle', 2)
  const [strokeStyle, setStrokeStyle] = useSyncedState('strokeStyle', 4)
  const [isTableHeader, setIsTableHeader] = useSyncedState<boolean>('isTableHeader', true)
  const [showRowColHeaders, setShowRowColHeaders] = useSyncedState<boolean>('showRowColHeaders', false)
  const [pickedRowIndex, setPickedRowIndex] = useSyncedState<number>('pickedRowIndex', -1)
  const [pickedColIndex, setPickedColIndex] = useSyncedState<number>('pickedColIndex', -1)
  const [rowHeights, setRowHeights] = useSyncedState<Record<number, number>>('rowHeights', {})
  const [colWidths, setColWidths] = useSyncedState<Record<number, number | 'fill'>>('colWidths', {})
  const [tableWidth, setTableWidth] = useSyncedState<number>('tableWidth', 300)
  // 默认主题 'Fashion' 的 defaultLevel 是 10，对应的颜色是 #999999
  // themeHue 使用 hueOptions 中的值 '#F19101' (Orange)
  // themeLevel 使用 Fashion 主题的 defaultLevel 10 对应的颜色 '#999999'
  const [themeHue, setThemeHue] = useSyncedState('themeHue', '#F19101') // 对应 hueOptions 中的 'Orange'
  const [themeLevel, setThemeLevel] = useSyncedState('themeLevel', '#999999') // 对应 Fashion 主题的 defaultLevel 10
  const [themeStyle, setThemeStyle] = useSyncedState('themeStyle', 'Fashion')
  const [colorMode, setColorMode] = useSyncedState<'color' | 'monochrome'>('colorMode', 'color')
  const [fontSize, setFontSize] = useSyncedState('fontSize', 12)
  const [isRowColumnSwapped, setIsRowColumnSwapped] = useSyncedState('isRowColumnSwapped', false)

  // 创建配置对象（整合所有状态）
  const config: TableConfig = {
    data: processedTableData.length === 0 && tableText
      ? parseTableTextToColumns(tableText)
      : processedTableData,
    isRowColumnSwapped,
    fontSize,
    rowHeights,
    colWidths,
    tableWidth,
    theme: {
      hue: themeHue,
      level: themeLevel,
      style: themeStyle,
      colorMode,
      hasHeader: isTableHeader,
      fillStyle: fillStyle as 1 | 2 | 3 | 4,
      strokeStyle: strokeStyle as 1 | 2 | 3 | 4
    },
    showRowColHeaders,
    pickedRowIndex,
    pickedColIndex
  }
  
  // 创建渲染器实例，传入回调函数用于更新状态
  const renderer = new TableRenderer(config, {
    onPickRow: (rowIndex: number) => {
      setPickedRowIndex(rowIndex)
      // 选中行时，取消列选中
      if (rowIndex !== -1) {
        setPickedColIndex(-1)
      }
    },
    onPickCol: (colIndex: number) => {
      setPickedColIndex(colIndex)
      // 选中列时，取消行选中
      if (colIndex !== -1) {
        setPickedRowIndex(-1)
      }
    },
    onSetRowHeight: (rowIndex: number, height: number) => {
      setRowHeights({ ...rowHeights, [rowIndex]: height })
    },
    onSetColWidth: (colIndex: number, width: number | 'fill') => {
      const newColWidths = { ...colWidths, [colIndex]: width }
      setColWidths(newColWidths)
      // 当列宽改变时，如果所有列都变成数值，表格宽度会自动变成 hug（在渲染时计算）
      // 这里确保状态更新，让表格重新渲染
    }
  })
  
  // 获取当前使用的颜色映射配置（用于菜单选项）
  const currentMappingConfig = colorMappingPresets[themeStyle] || colorMappingPresets['Fashion']
  
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
  
  // 根据当前主题的 lightnessRange 过滤色阶选项
  const levelOptions = (() => {
    let filtered: Array<{ option: string, tooltip: string }>
    
    if (!currentMappingConfig.lightnessRange) {
      // 如果没有配置 lightnessRange，显示所有选项
      filtered = allLevelOptions.map(({ level, ...rest }) => rest)
    } else {
      const { level: validLevels, defaultLevel } = currentMappingConfig.lightnessRange
      
      if (validLevels === undefined || validLevels.length === 0) {
        // 如果没有指定有效色阶数组，显示所有选项
        filtered = allLevelOptions.map(({ level, ...rest }) => rest)
      } else {
        // 只显示有效色阶数组中的选项
        filtered = allLevelOptions
          .filter(item => validLevels.includes(item.level))
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
        itemType: 'action',
        propertyName: 'showRowColHeaders',
        tooltip: 'Index Headers(to set Row-height/Column-width)',
        icon: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect stroke="${showRowColHeaders ? iconColorPick : iconColor}" x="9" y="9" width="14" height="3" rx="0.81684" stroke-width="1.22526"/>
        <rect stroke="${showRowColHeaders ? iconColorPick : iconColor}" x="12" y="9" width="14" height="3" rx="0.81684" transform="rotate(90 12 9)" stroke-width="1.22526"/>
        <rect stroke="${iconColor}" x="23" y="12" width="11" height="11" rx="0.81684" transform="rotate(90 23 12)" stroke-width="1.22526"/>
        </svg>
        `
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'action',
        propertyName: 'isTableHeader',
        tooltip: 'Is Table Header',
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
        // 使用 renderer 的方法切换行列
        renderer.swapRowColumn()
        const newConfig = renderer.getConfig()
        // 更新状态
        setProcessedTableData(newConfig.data)
        setIsRowColumnSwapped(newConfig.isRowColumnSwapped)
          // 同时切换 row/column space 和 stroke
          if (fillStyle === 2) {
            setFillStyle(3)
          } else if (fillStyle === 3) {
            setFillStyle(2)
          }
          if (strokeStyle === 2) {
            setStrokeStyle(3)
          } else if (strokeStyle === 3) {
            setStrokeStyle(2)
        }
      } else if (propertyName === 'openConfig') {
        const themeColors = renderer.getThemeColors()
        waitForTask(
          new Promise<void>((resolve) => {
            figma.showUI(__html__, { width: 300, height: 340, themeColors: true })
            
            // 初始化 processedTableData：如果为空，用示例数据填充
            let actualProcessedTableData = processedTableData
            if (actualProcessedTableData.length === 0 && tableText) {
              actualProcessedTableData = parseTableTextToColumns(tableText)
              if (actualProcessedTableData.length > 0) {
                setProcessedTableData(actualProcessedTableData)
              }
            }
            
            // 计算当前的行列数（从 processedTableData 计算）
            const currentColCount = actualProcessedTableData.length
            const currentRowCount = actualProcessedTableData.length > 0 ? actualProcessedTableData[0]?.length || 0 : 0
            
            figma.ui.postMessage({
              type: 'init',
              data: {
                tableText,
                exampleTableText: exampleTableText,
                rowCount: currentRowCount,
                colCount: currentColCount,
                fontSize,
                tableWidth,
                themeColors: themeColors,
                isRowColumnSwapped: isRowColumnSwapped,
              }
            })

            figma.ui.onmessage = (msg) => {
              if (msg.type === 'update') {
                const { 
                  tableText: newText, 
                  processedTableData: newProcessedTableData,
                  fontSize: newFontSize,
                  tableWidth: newTableWidth,
                } = msg.data
                setTableText(newText || '')
                if (newProcessedTableData !== undefined) {
                  setProcessedTableData(newProcessedTableData)
                }
                if (newFontSize !== undefined) setFontSize(newFontSize)
                if (newTableWidth !== undefined) setTableWidth(newTableWidth)
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
        const newHue = propertyValue as string
        setThemeHue(newHue)
      } else if (propertyName === 'themeLevel') {
        const newLevel = propertyValue as string
        setThemeLevel(newLevel)
      } else if (propertyName === 'themeStyle') {
        const newStyle = propertyValue as string
        setThemeStyle(newStyle)
        
        // 切换主题时应用预设配置
        const newMappingConfig = colorMappingPresets[newStyle] || colorMappingPresets['Fashion']
        
        // 应用色阶建议值
        if (newMappingConfig.lightnessRange?.defaultLevel !== undefined) {
          const defaultLevel = newMappingConfig.lightnessRange.defaultLevel
          const defaultOption = allLevelOptions.find(item => item.level === defaultLevel)
          if (defaultOption) {
            setThemeLevel(defaultOption.option)
          }
        }
        
        // 应用样式配置（如果预设中定义了）
        if (newMappingConfig.hasHeader !== undefined) {
          setIsTableHeader(newMappingConfig.hasHeader)
        }
        if (newMappingConfig.fillStyle !== undefined) {
          setFillStyle(newMappingConfig.fillStyle)
        }
        if (newMappingConfig.strokeStyle !== undefined) {
          setStrokeStyle(newMappingConfig.strokeStyle)
        }
      } else if (propertyName === 'colorMode') {
        const newMode = propertyValue as 'color' | 'monochrome'
        if (newMode === 'color' || newMode === 'monochrome') {
          setColorMode(newMode)
        }
      } else if (propertyName === 'isTableHeader') {
        setIsTableHeader(!isTableHeader)
      } else if (propertyName === 'showRowColHeaders') {
        setShowRowColHeaders(!showRowColHeaders)
      }
    },
  )

  // 渲染表格
  return renderer.render()
}

// 解析 tableText 为按列存储数组的辅助函数
function parseTableTextToColumns(text: string): string[][] {
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

widget.register(Widget)