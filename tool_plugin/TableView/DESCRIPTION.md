# TableView Widget – 功能描述 / Description

Data Table Widget with Color Themes | 数据表格小部件，支持主题配色

---

## 概述 / Overview

TableView 是一个 Figma Widget，用于在 Figma 画布上展示数据表格，支持丰富的样式配置、主题配色系统、行列互换等功能。适用于设计文档、数据展示、报表设计等场景。

TableView is a Figma Widget for displaying data tables on the Figma canvas with rich style configuration, theme color system, and row/column swapping. Perfect for design documentation, data presentation, and report design.

---

## 核心特性 / Core Features

### 🎨 主题配色系统 / Theme Color System

- **7 种预设风格**：Normal（普通）、Soft（柔和）、Fashion（时尚）、Vivid（鲜艳）、Pastel（粉嫩）、Retro（复古）、Neon（霓虹）
- **主题色相选择**：支持多种预设颜色选择，或自定义颜色
- **主题色阶控制**：通过灰度色控制整体亮度级别（1-15 级）
- **颜色模式**：支持彩色模式和单色模式切换
- **智能配色算法**：基于 HSL 颜色空间的智能配色，自动计算背景、表头、单元格、文字、描边等颜色

**7 preset styles**: Normal, Soft, Fashion, Vivid, Pastel, Retro, Neon  
**Theme hue selection**: Supports multiple preset colors or custom colors  
**Theme level control**: Controls overall brightness level (1-15 levels) via grayscale  
**Color modes**: Supports colored and monochrome mode switching  
**Smart color algorithm**: Intelligent color matching based on HSL color space, automatically calculates background, header, cell, text, stroke colors

### 📊 表格样式配置 / Table Style Configuration

- **填充样式**：全填充、横间隔、竖间隔、无填充（4 种模式）
- **描边样式**：全描边、仅横线、仅竖线、无描边（4 种模式）
- **表头开关**：可切换显示/隐藏表头样式（表头与数据行的视觉区分）
- **行列互换**：一键切换表格的行列方向
- **行列数**：可打开行列数显示，选中可调整行高/列宽
- **字体大小**：可设置字体大小（8-72px）

**Fill styles**: All fill, Row spacing, Column spacing, No fill (4 modes)  
**Stroke styles**: All strokes, Row strokes only, Column strokes only, No strokes (4 modes)  
**Header toggle**: Toggle header style on/off (visual distinction between header and data rows)  
**Row/column swap**: One-click swap table row and column directions  
**Row/column index**: Show index of row/column and set row-height/column-width
**Font size**: Set font size (8-72px)

### ✏️ 数据输入与编辑 / Data Input & Editing

- **制表符分隔格式**：支持标准的制表符（Tab）分隔文本格式
- **多行文本编辑器**：提供多行文本输入框，支持粘贴和直接输入
- **行列数设置**：可手动设置行列数，或使用自动检测功能
- **表格宽度设置**：可设置表格宽度，列宽默认为均分
- **快速清空**：一键清空数据输入框
- **实时预览**：配置后立即在画布上显示效果

**Tab-separated format**: Supports standard tab-separated text format  
**Multi-line text editor**: Multi-line text input box, supports paste and direct input  
**Row/column count settings**: Manually set row/column count, or use auto-detection  
**Table width**: Set table width, column widths default to equal distribution
**Quick clear**: One-click clear data input box  
**Real-time preview**: Immediately displays effects on canvas after configuration

---

## 使用场景 / Use Cases

### 📝 设计文档

在设计文档中展示数据表格，用于说明数据结构和内容。

Display data tables in design documentation to explain data structures and content.

### 📊 数据展示

在设计稿中展示数据报表、统计表格等。

Display data reports and statistical tables in design files.

### 📋 规范文档

在 UI 规范文档中展示组件的数据结构、属性表格等。

Display component data structures and property tables in UI specification documents.

### 🎨 设计系统

在设计系统中展示颜色系统、间距系统等数据表格。

Display color systems and spacing systems in design systems.

### 📖 产品文档

在产品文档中展示功能对比表、参数说明表等。

Display feature comparison tables and parameter specification tables in product documentation.

---

## 功能详解 / Detailed Features

### 1. 数据输入 / Data Input

- 在配置界面中，提供多行文本编辑器
- 支持制表符（Tab）分隔的数据格式
- 每行代表表格的一行，每行的单元格用 Tab 分隔
- 提供快速清空按钮，方便重新输入
- 支持从 Excel、Google Sheets 等表格软件复制粘贴数据

**Multi-line text editor** in the configuration interface  
**Tab-separated format** for data input  
**Each line** represents a table row, cells separated by Tab  
**Quick clear button** for easy re-input  
**Supports paste** from Excel, Google Sheets, and other spreadsheet software

### 2. 表格样式 / Table Styles

#### 填充样式 / Fill Styles

- **全填充（All Fill）**：所有单元格都有填充色
- **横间隔（Row Spacing）**：行与行之间交替填充，形成横条纹效果
- **竖间隔（Column Spacing）**：列与列之间交替填充，形成竖条纹效果
- **无填充（No Fill）**：所有单元格都无填充，仅显示边框和文字

**All Fill**: All cells have fill color  
**Row Spacing**: Alternating fill between rows, creating horizontal stripe effect  
**Column Spacing**: Alternating fill between columns, creating vertical stripe effect  
**No Fill**: No fill in all cells, only borders and text displayed

#### 描边样式 / Stroke Styles

- **全描边（All Strokes）**：所有单元格都有边框
- **仅横线（Row Strokes Only）**：只显示横向边框线
- **仅竖线（Column Strokes Only）**：只显示纵向边框线
- **无描边（No Strokes）**：所有单元格都无边框

**All Strokes**: All cells have borders  
**Row Strokes Only**: Only horizontal border lines  
**Column Strokes Only**: Only vertical border lines  
**No Strokes**: No borders in all cells

#### 表头样式 / Header Style

- 表头开关控制表格第一行是否使用表头样式
- 表头样式通常使用不同的背景色和文字颜色，与数据行形成视觉区分
- 表头的颜色由主题配色系统自动计算

Header toggle controls whether the first row uses header style  
Header style typically uses different background and text colors to distinguish from data rows  
Header colors are automatically calculated by the theme color system

### 3. 主题配色系统 / Theme Color System

#### 主题风格 / Theme Styles

- **Normal（普通）**：平衡的配色方案，适合通用场景
- **Soft（柔和）**：柔和的配色，低饱和度，适合优雅的设计
- **Fashion（时尚）**：时尚的配色，较高的饱和度，适合现代设计
- **Vivid（鲜艳）**：鲜艳的配色，高饱和度，适合强调数据
- **Pastel（粉嫩）**：粉嫩的配色，低饱和度，适合温馨的设计
- **Retro（复古）**：复古的配色，带有特殊的色彩偏移，适合复古风格
- **Neon（霓虹）**：霓虹的配色，高对比度，适合科技感设计

**Normal**: Balanced color scheme, suitable for general use  
**Soft**: Soft colors, low saturation, suitable for elegant designs  
**Fashion**: Fashionable colors, higher saturation, suitable for modern designs  
**Vivid**: Vivid colors, high saturation, suitable for emphasizing data  
**Pastel**: Pastel colors, low saturation, suitable for warm designs  
**Retro**: Retro colors with special color offset, suitable for retro style  
**Neon**: Neon colors, high contrast, suitable for tech designs

#### 主题色相 / Theme Hue

- 可选择预设的颜色（如红色、蓝色、绿色、橙色等）
- 颜色值使用 HEX 格式（如 #ff8800）
- 选择不同的色相会改变表格的整体色调

Select from preset colors (red, blue, green, orange, etc.)  
Color values use HEX format (e.g., #ff8800)  
Different hues change the overall color tone of the table

#### 主题色阶 / Theme Level

- 通过灰度色控制整体亮度级别
- 色阶范围：1-15 级（1 最暗，15 最亮）
- 不同主题风格会推荐不同的色阶范围
- 可通过颜色选择器选择不同的灰度色来调整色阶

Controls overall brightness level via grayscale  
Level range: 1-15 (1 darkest, 15 lightest)  
Different theme styles recommend different level ranges  
Adjust level by selecting different grayscale colors via color picker

#### 颜色模式 / Color Modes

- **彩色模式（Colored）**：使用选择的主题色相
- **单色模式（Monochrome）**：使用灰度配色，忽略色相

**Colored mode**: Uses selected theme hue  
**Monochrome mode**: Uses grayscale colors, ignores hue

### 4. 交互功能 / Interaction

#### 行列互换 / Row/Column Swap

- 一键切换表格的行列方向
- 原来的行变成列，原来的列变成行
- 表格数据会自动转换，保持内容完整性

One-click swap table row and column directions  
Original rows become columns, original columns become rows  
Table data automatically converts, maintaining content integrity

#### 配置界面 / Configuration Interface

- 通过属性菜单中的"Open Config"按钮打开配置界面
- 配置界面包含数据输入框、行列数设置、字体大小设置等
- 配置后点击"Apply"按钮应用设置

Open configuration interface via "Open Config" button in property menu  
Configuration interface includes data input box, row/column count settings, font size settings, etc.  
Click "Apply" button after configuration to apply settings

### 5. 配置参数 / Configuration Parameters

#### 字体大小 / Font Size

- 范围：8-72px
- 默认值：12px
- 影响表格中所有文字的字体大小

**Range**: 8-72px  
**Default**: 12px  
**Affects** font size of all text in the table

#### 行列数 / Row/Column Count

- 可手动设置表格的行数和列数
- 支持自动检测功能，根据输入的数据自动识别行列数
- 行列数范围：0-1000

Manually set table row and column count  
Supports auto-detection, automatically identifies row/column count from input data  
Range: 0-1000

---

## 界面说明 / Interface Description

### 配置界面 / Configuration Interface

配置界面包含以下区域：

The configuration interface includes the following areas:

1. **数据输入框** / **Data Input Box**
   - 多行文本编辑器
   - 支持制表符分隔的数据格式
   - 提供清空按钮（右上角）

2. **行列数设置区** / **Row/Column Count Settings Area**
   - 列数输入框（C）
   - 行数输入框（R）
   - 自动检测按钮（AUTO）

3. **字体大小设置区** / **Font Size Settings Area**
   - 字体大小输入框（带单位 px）
   - 输入框带提示图标和悬停提示

4. **应用按钮** / **Apply Button**
   - 点击后应用所有设置
   - 更新 Widget 显示效果

### 属性菜单 / Property Menu

Widget 提供以下快捷操作：

The widget provides the following quick operations:

1. **Open Config（打开配置）**：打开配置界面
2. **Row Column Swap（行列互换）**：切换表格的行列方向
3. **Table Header（表头开关）**：切换表头样式
4. **填充样式按钮**（4 个）：
   - All Fill（全填充）
   - Row Space（横间隔）
   - Column Space（竖间隔）
   - No Fill（无填充）
5. **描边样式按钮**（4 个）：
   - All Strokes（全描边）
   - Row Strokes（仅横线）
   - Column Strokes（仅竖线）
   - No Strokes（无描边）
6. **主题色相选择器**：选择主题颜色
7. **主题色阶选择器**：选择主题亮度级别
8. **主题风格下拉菜单**：选择配色风格
9. **颜色模式下拉菜单**：选择彩色/单色模式

### Widget 显示 / Widget Display

Widget 在画布上显示为：

The widget displays on the canvas as:

- 数据表格，使用 AutoLayout 自动布局
- 表头区域（如启用），使用表头样式
- 数据单元格，使用数据样式
- 填充色和描边，根据选择的样式显示
- 文字内容，使用配置的字体大小和颜色

---

## 技术规格 / Technical Specifications

### 数据格式支持 / Data Format Support

- **输入格式**：制表符（Tab）分隔的文本格式
- **编码支持**：UTF-8
- **行列限制**：建议行数不超过 100 行，列数不超过 20 列

**Input format**: Tab-separated text format  
**Encoding support**: UTF-8  
**Row/column limits**: Recommended ≤ 100 rows, ≤ 20 columns

### 颜色系统 / Color System

- **颜色空间**：HSL（色相、饱和度、亮度）
- **颜色格式**：HEX（十六进制）
- **色阶范围**：1-15 级
- **主题风格**：7 种预设风格

**Color space**: HSL (Hue, Saturation, Lightness)  
**Color format**: HEX (hexadecimal)  
**Level range**: 1-15 levels  
**Theme styles**: 7 preset styles

### 配置限制 / Configuration Limits

- **字体大小范围**：8-72px
- **行列数范围**：0-1000
- **表格大小建议**：建议行数不超过 100 行，列数不超过 20 列

**Font size range**: 8-72px  
**Row/column count range**: 0-1000  
**Table size recommendation**: Recommended ≤ 100 rows, ≤ 20 columns

### 性能考虑 / Performance Considerations

- 表格行数建议不超过 100 行
- 表格列数建议不超过 20 列
- 超大表格可能影响 Widget 渲染性能

Recommended table rows ≤ 100  
Recommended table columns ≤ 20  
Very large tables may affect widget rendering performance

---

## 隐私与权限 / Privacy & Permissions

### 数据存储 / Data Storage

- Widget 使用 Figma 的 `useSyncedState` 存储表格数据
- 数据仅存储在本地 Figma 文件中
- 不收集、不上传任何用户数据

**Data storage**: Widget uses Figma's `useSyncedState` to store table data  
**Local only**: Data is only stored locally in the Figma file  
**No data collection**: Does not collect or upload any user data

### 网络访问 / Network Access

- 网络请求仅用于加载静态资源（UI 样式、脚本）
- 使用 CDN 加载资源：jsDelivr、cdnjs
- 不涉及任何用户数据的上传或处理

**Network requests** are only used to load static resources (UI styles, scripts)  
**CDN resources**: jsDelivr, cdnjs  
**No user data** upload or processing

### 权限说明 / Permission Description

- **documentAccess**: `dynamic-page` - 用于读取和写入 Widget 数据
- **networkAccess**: 仅用于加载静态资源，不涉及用户数据

**documentAccess**: `dynamic-page` - Used to read and write widget data  
**networkAccess**: Only for loading static resources, no user data involved

---

## 已知限制 / Known Limitations

1. **表格大小限制**：建议行数不超过 100 行，列数不超过 20 列，超大型表格可能影响性能
2. **数据格式**：仅支持制表符分隔的文本格式，不支持 CSV、Excel 等格式的直接导入
3. **编辑限制**：Widget 显示为只读表格，无法直接在画布上编辑，需通过配置界面编辑
4. **字体**：表格使用系统默认字体，不支持自定义字体
5. **对齐方式**：文字对齐方式固定，不支持自定义对齐
6. **网络依赖**：需要网络连接以加载 UI 资源，离线环境可能无法正常使用配置界面

**Table size limit**: Recommended ≤ 100 rows, ≤ 20 columns, very large tables may affect performance  
**Data format**: Only supports tab-separated text format, does not support direct import of CSV, Excel, etc.  
**Editing limit**: Widget displays read-only table, cannot edit directly on canvas, must edit through configuration interface  
**Font**: Table uses system default font, does not support custom fonts  
**Alignment**: Text alignment is fixed, does not support custom alignment  
**Network dependency**: Requires network connection to load UI resources, configuration interface may not work offline

---

## 更新日志 / Changelog

### Version 1.0.0 (Initial Release)

- ✅ 支持制表符分隔的数据输入
- ✅ 7 种主题配色风格
- ✅ 主题色相和色阶配置
- ✅ 彩色/单色模式切换
- ✅ 4 种填充样式和 4 种描边样式
- ✅ 表头开关功能
- ✅ 行列互换功能
- ✅ 可配置字体大小
- ✅ 行列数自动检测
- ✅ 智能配色算法

---

## 联系方式 / Contact

- **作者 / Author**: YNYU
- **邮箱 / Email**: lvynyu2@gmail.com | lvynyu@163.com
- **网站 / Website**: www.ynyuset.cn
- **GitHub**: YNYU01/YNYU_SET

---

## 致谢 / Acknowledgments

- 感谢所有使用和反馈的用户

**Thanks to all users** who use and provide feedback

---

**最后更新 / Last Updated**: 2025-01-XX

