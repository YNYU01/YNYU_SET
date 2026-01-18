# TableView 重构分析

## 当前代码结构分析

### 1. 状态变量（18个 useSyncedState）
- **数据相关**：`processedTableData`, `tableText`, `isRowColumnSwapped`
- **样式相关**：`fillStyle`, `strokeStyle`, `isTableHeader`, `showRowColHeaders`
- **选择相关**：`pickedRowIndex`, `pickedColIndex`
- **尺寸相关**：`rowHeights`, `colWidths`, `tableWidth`, `fontSize`
- **主题相关**：`themeHue`, `themeLevel`, `themeStyle`, `colorMode`

### 2. 主要逻辑模块
- **calculateThemeColors**：约 400 行，计算主题色
- **Widget 函数**：约 1300 行，包含所有渲染逻辑
- **渲染函数**：`renderCell`, `renderRowColHeaderCell` 等

### 3. 代码复杂度
- Widget 函数过长（1300+ 行）
- 状态管理分散（18 个独立状态）
- 渲染逻辑与业务逻辑耦合
- 主题配置与样式配置分离

## 重构方案

### 方案一：配置对象 + 渲染类（推荐）

#### 1.1 创建 TableConfig 类型
```typescript
type TableConfig = {
  // 数据
  data: string[][]
  isRowColumnSwapped: boolean
  
  // 尺寸
  fontSize: number
  rowHeights: Record<number, number>
  colWidths: Record<number, number | 'fill'>
  tableWidth: number
  
  // 主题（整合样式配置）
  theme: {
    hue: string
    level: string
    style: string
    colorMode: 'color' | 'monochrome'
    // 样式配置整合到主题中
    hasHeader: boolean
    fillStyle: 1 | 2 | 3 | 4  // 1:全填充, 2:横间隔, 3:竖间隔, 4:无填充
    strokeStyle: 1 | 2 | 3 | 4  // 1:全描边, 2:仅横线, 3:仅竖线, 4:无描边
  }
  
  // UI 状态
  showRowColHeaders: boolean
  pickedRowIndex: number
  pickedColIndex: number
}
```

#### 1.2 创建 TableRenderer 类
```typescript
class TableRenderer {
  private config: TableConfig
  private themeColors: ThemeColors
  
  constructor(config: TableConfig) {
    this.config = config
    this.themeColors = this.calculateThemeColors()
  }
  
  // 更新配置（部分更新）
  updateConfig(partial: Partial<TableConfig>) {
    this.config = { ...this.config, ...partial }
    // 如果主题相关配置改变，重新计算颜色
    if (partial.theme) {
      this.themeColors = this.calculateThemeColors()
    }
  }
  
  // 切换单色模式（只改颜色）
  toggleColorMode() {
    const newMode = this.config.theme.colorMode === 'color' ? 'monochrome' : 'color'
    this.updateConfig({
      theme: { ...this.config.theme, colorMode: newMode }
    })
  }
  
  // 切换行列（只改数据）
  swapRowColumn() {
    this.updateConfig({
      data: this.transposeData(this.config.data),
      isRowColumnSwapped: !this.config.isRowColumnSwapped
    })
  }
  
  // 显隐行列数（只改布尔）
  toggleRowColHeaders() {
    this.updateConfig({
      showRowColHeaders: !this.config.showRowColHeaders
    })
  }
  
  // 渲染表格
  render(): JSX.Element {
    // 所有渲染逻辑
  }
  
  private calculateThemeColors(): ThemeColors {
    // 颜色计算逻辑
  }
  
  private transposeData(data: string[][]): string[][] {
    // 转置逻辑
  }
}
```

#### 1.3 Widget 函数简化
```typescript
function Widget() {
  // 从 useSyncedState 读取配置（保持向后兼容）
  const [config, setConfig] = useSyncedState<TableConfig>('tableConfig', defaultConfig)
  
  // 创建渲染器实例
  const renderer = new TableRenderer(config)
  
  // 处理配置更新
  const updateConfig = (partial: Partial<TableConfig>) => {
    const newConfig = { ...config, ...partial }
    setConfig(newConfig)
  }
  
  // Property menu 处理
  usePropertyMenu([...], (propertyName, propertyValue) => {
    if (propertyName === 'colorMode') {
      renderer.toggleColorMode()
      setConfig(renderer.getConfig())
    } else if (propertyName === 'swapRowColumn') {
      renderer.swapRowColumn()
      setConfig(renderer.getConfig())
    }
    // ...
  })
  
  return renderer.render()
}
```

### 方案二：函数式配置管理（轻量级）

#### 2.1 配置管理函数
```typescript
// 配置管理
function createTableConfig(initial: Partial<TableConfig>): TableConfig {
  return {
    data: [],
    fontSize: 12,
    theme: {
      hue: '#ff8800',
      level: '#333333',
      style: 'Fashion',
      colorMode: 'color',
      hasHeader: true,
      fillStyle: 2,
      strokeStyle: 4
    },
    ...initial
  }
}

// 配置更新函数
function updateTableConfig(
  config: TableConfig,
  updates: Partial<TableConfig>
): TableConfig {
  const newConfig = { ...config, ...updates }
  
  // 如果主题改变，重新计算颜色
  if (updates.theme) {
    // 触发颜色重新计算
  }
  
  return newConfig
}
```

#### 2.2 渲染函数分离
```typescript
// 渲染函数模块化
function renderTable(config: TableConfig): JSX.Element {
  const themeColors = calculateThemeColors(config.theme)
  // 渲染逻辑
}

function renderCell(config: TableConfig, rowIndex: number, colIndex: number): JSX.Element {
  // 单元格渲染
}

function renderRowColHeader(config: TableConfig): JSX.Element {
  // 行列号渲染
}
```

## 工作量评估

### 方案一（类方式）
- **工作量**：中等（2-3 天）
- **优点**：
  - 封装性好，逻辑清晰
  - 易于扩展和维护
  - 配置集中管理
- **缺点**：
  - 需要创建类结构
  - 需要处理状态同步（useSyncedState）

### 方案二（函数式）
- **工作量**：较小（1-2 天）
- **优点**：
  - 实现简单，改动小
  - 保持函数式风格
  - 易于测试
- **缺点**：
  - 配置管理相对分散
  - 需要手动处理依赖更新

## 推荐方案

**推荐方案一（配置对象 + 渲染类）**，原因：
1. 配置集中管理，易于维护
2. 操作清晰（切换单色模式只改颜色、切换行列改数据数组）
3. 易于扩展新功能
4. 代码结构更清晰

## 实施步骤

### 阶段一：创建配置类型和基础结构（1 天）
1. 定义 `TableConfig` 类型
2. 创建 `TableRenderer` 类骨架
3. 迁移配置读取逻辑

### 阶段二：迁移渲染逻辑（1 天）
1. 将渲染逻辑移到 `TableRenderer.render()`
2. 将颜色计算逻辑移到 `TableRenderer.calculateThemeColors()`
3. 保持现有功能不变

### 阶段三：优化操作函数（0.5 天）
1. 实现 `toggleColorMode()`、`swapRowColumn()` 等
2. 优化配置更新逻辑
3. 测试所有功能

### 阶段四：清理和优化（0.5 天）
1. 移除冗余代码
2. 优化性能
3. 添加注释和文档

## 注意事项

1. **向后兼容**：保持 `useSyncedState` 的使用，确保现有数据不丢失
2. **状态同步**：确保配置更新能正确同步到 Figma
3. **性能优化**：避免不必要的颜色重新计算