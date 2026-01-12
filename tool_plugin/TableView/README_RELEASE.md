# TableView Widget – 发布准备说明 / Release Brief

> **📌 发布前必读**：请确保已阅读本说明，了解 TableView Widget 的完整功能和使用方式。

## 1. 插件概述 / Overview

- **名称**：`TableView`
- **类型**：Figma Widget（小部件）
- **定位**：在 Figma 画布上展示数据表格，支持丰富的样式配置、主题配色系统、行列互换等功能，适用于数据展示、设计文档、报表设计等场景
- **核心特性**：
  - 支持制表符分隔的数据输入
  - 7 种主题配色风格（Normal、Soft、Fashion、Vivid、Pastel、Retro、Neon）
  - 主题色相和色阶配置
  - 彩色/单色模式切换
  - 4 种填充样式和 4 种描边样式
  - 表头开关和行列互换功能
  - 可配置字体大小

## 2. 核心功能 / Core Features

### 2.1 数据输入 / Data Input

- **数据格式**：支持制表符（Tab）分隔的文本格式
- **输入方式**：提供多行文本编辑器，支持粘贴和直接输入
- **自动检测**：支持自动检测表格的行列数
- **快速操作**：提供快速清空按钮

### 2.2 表格样式 / Table Styles

- **填充样式**：全填充、横间隔、竖间隔、无填充（4 种模式）
- **描边样式**：全描边、仅横线、仅竖线、无描边（4 种模式）
- **表头开关**：可切换显示/隐藏表头样式
- **行列互换**：一键切换表格的行列方向

### 2.3 主题配色系统 / Theme Color System

- **7 种预设风格**：Normal（普通）、Soft（柔和）、Fashion（时尚）、Vivid（鲜艳）、Pastel（粉嫩）、Retro（复古）、Neon（霓虹）
- **主题色相**：支持多种预设颜色选择，或自定义颜色
- **主题色阶**：通过灰度色控制整体亮度级别（1-15 级）
- **颜色模式**：支持彩色模式和单色模式切换
- **智能配色**：基于 HSL 颜色空间的智能配色算法，自动计算背景、表头、单元格、文字、描边等颜色

### 2.4 配置选项 / Configuration

- **字体大小**：可设置字体大小（8-72px）
- **行列数设置**：可手动设置行列数，或使用自动检测功能
- **实时预览**：配置后立即在画布上显示效果

## 3. 使用方式 / How to Use

### 3.1 安装 / Installation

1. **开发模式**：
   - 在 Figma Desktop 中选择 `Plugins → Development → Import plugin from manifest…`
   - 指向 `tool_plugin/TableView/manifest.json`
   - 插件将出现在插件列表中

2. **添加 Widget**：
   - 在 Figma 画布上，点击 `+` → `Widgets`
   - 选择 `TableView`
   - Widget 将添加到画布上

### 3.2 配置表格 / Configure Table

1. **打开配置界面**：
   - 选中 TableView Widget
   - 在右侧属性面板中，点击 `⚙️` 图标（Open Config）

2. **输入数据**：
   - 在数据输入框中粘贴或输入表格数据
   - 数据格式：每行代表表格的一行，单元格用 Tab 分隔
   - 可以从 Excel、Google Sheets 等表格软件复制数据后直接粘贴

3. **设置参数**：
   - **行列数**：可手动设置，或点击 "AUTO" 按钮自动检测
   - **字体大小**：设置表格文字的字体大小

4. **应用设置**：
   - 点击 "Apply" 按钮应用设置
   - Widget 将更新显示效果

### 3.3 属性菜单 / Property Menu

Widget 提供以下快捷操作：

- **Open Config**（打开配置）：打开配置界面
- **Row Column Swap**（行列互换）：切换表格的行列方向
- **Table Header**（表头开关）：切换表头样式
- **填充样式按钮**（4 个）：
  - All Fill（全填充）
  - Row Space（横间隔）
  - Column Space（竖间隔）
  - No Fill（无填充）
- **描边样式按钮**（4 个）：
  - All Strokes（全描边）
  - Row Strokes（仅横线）
  - Column Strokes（仅竖线）
  - No Strokes（无描边）
- **Theme Hue**（主题色相）：选择主题颜色
- **Theme Level**（主题色阶）：选择主题亮度级别
- **Theme Style**（主题风格）：选择配色风格（下拉菜单）
- **Color Mode**（颜色模式）：选择彩色/单色模式（下拉菜单）

### 3.4 交互操作 / Interaction

- **配置表格**：通过属性菜单中的 "Open Config" 按钮打开配置界面
- **切换样式**：通过属性菜单中的按钮快速切换填充和描边样式
- **调整主题**：通过属性菜单中的颜色选择器和下拉菜单调整主题配色
- **行列互换**：点击 "Row Column Swap" 按钮一键切换表格的行列方向

## 4. 技术实现 / Technical Implementation

### 4.1 技术栈 / Tech Stack

- **Widget 代码**：TypeScript + React-like JSX (使用 Figma Widget API)
- **UI 界面**：HTML + JavaScript
- **构建工具**：TypeScript Compiler

### 4.2 数据结构 / Data Structure

Widget 使用以下数据结构存储表格数据：

- **tableText**：存储原始文本数据（制表符分隔格式）
- **processedTableData**：存储处理后的表格数据数组（按列存储）
  ```typescript
  type ProcessedTableData = string[][]  // [[col0_row0, col0_row1, ...], [col1_row0, col1_row1, ...], ...]
  ```
- **themeHue**：主题色相（HEX 颜色字符串）
- **themeLevel**：主题色阶（HEX 灰度色字符串）
- **themeStyle**：主题风格（字符串：'Normal' | 'Soft' | 'Fashion' | 'Vivid' | 'Pastel' | 'Retro' | 'Neon'）
- **colorMode**：颜色模式（'color' | 'monochrome'）
- **fillStyle**：填充样式（1-4：全填充、横间隔、竖间隔、无填充）
- **strokeStyle**：描边样式（1-4：全描边、仅横线、仅竖线、无描边）
- **isTableHeader**：表头开关（boolean）
- **fontSize**：字体大小（数字）
- **isRowColumnSwapped**：行列互换状态（boolean）

### 4.3 颜色系统 / Color System

Widget 使用基于 HSL 颜色空间的智能配色算法：

- **颜色转换**：支持 HEX、RGB、HSL 之间的转换
- **配色计算**：根据主题色相、色阶、风格配置，自动计算背景、表头、单元格、文字、描边等颜色
- **配色预设**：7 种预设风格，每种风格有不同的配色规则和参数

### 4.4 网络访问 / Network Access

Widget 需要访问以下域名（仅用于加载静态资源）：

- `https://cdn.jsdelivr.net` / `https://cdn.jsdelivr.net.cn`：加载 UI 样式和脚本资源
- `https://cdnjs.cloudflare.com`：备用 CDN
- `https://*.ynyuset.cn`：加载自有资源

**注意**：所有网络请求仅用于加载静态资源，不涉及任何用户数据的上传或处理。

## 5. Figma 社区提交流程 / Figma Community Submission

### 5.1 准备材料清单

- [ ] **插件图标**：128×128 像素，PNG 格式，透明背景
- [ ] **封面图**：1920×960 像素，安全区域 1600×960 像素
- [ ] **插件描述**：清晰简洁的功能说明（支持富文本）
- [ ] **截图**：至少 3-5 张功能演示截图
- [ ] **演示视频**（可选）：30-60 秒功能演示

### 5.2 插件描述建议

建议按以下结构撰写插件描述：

```
TableView 是一个 Figma Widget，用于在画布上展示数据表格，支持丰富的样式配置和主题配色系统。

【核心功能】

1. 数据输入：支持制表符分隔的数据格式，可从 Excel、Google Sheets 等表格软件复制粘贴
2. 表格样式：4 种填充样式（全填充、横间隔、竖间隔、无填充）和 4 种描边样式（全描边、仅横线、仅竖线、无描边）
3. 主题配色：7 种预设风格（Normal、Soft、Fashion、Vivid、Pastel、Retro、Neon），支持主题色相和色阶配置
4. 颜色模式：支持彩色模式和单色模式切换
5. 交互功能：表头开关、行列互换、可配置字体大小
6. 智能配色：基于 HSL 颜色空间的智能配色算法，自动计算表格各部分的颜色

【使用场景】

- 设计文档中的数据表格展示
- 数据报表和统计表格
- UI 规范文档中的数据结构展示
- 设计系统中的数据表格
- 产品文档中的对比表和参数说明表

【特色亮点】

- 7 种主题配色风格，轻松创建不同风格的表格
- 智能配色算法，自动计算协调的颜色方案
- 丰富的样式配置选项，满足各种设计需求
- 支持行列互换，灵活调整表格布局
- 简洁直观的配置界面
- 实时预览和编辑

【隐私说明】

本 Widget 仅使用本地存储保存表格数据，不收集、不上传任何用户数据。
网络访问仅用于加载 UI 资源，不涉及任何用户数据处理。
```

### 5.3 截图/视频建议

**推荐截图内容**：

1. **主界面**：展示配置界面，包含数据输入框、行列数设置、字体大小设置
2. **表格展示**：展示不同主题风格的表格效果（Normal、Fashion、Vivid、Retro 等）
3. **样式选项**：展示不同的填充和描边样式效果
4. **交互功能**：展示表头开关、行列互换的效果
5. **颜色配置**：展示主题色相、色阶、颜色模式的配置效果

**视频演示流程**（30-60 秒）：

1. 添加 Widget 到画布
2. 打开配置界面，输入表格数据
3. 应用设置，展示表格效果
4. 切换不同的填充和描边样式
5. 切换不同的主题风格
6. 演示行列互换功能

### 5.4 权限说明

在 Figma 提交流程中，需要明确说明：

- **网络访问权限**：使用外部 CDN（jsDelivr、cdnjs 等）仅用于加载 UI 资源，**无用户数据上报**
- **文档访问权限**：`documentAccess: "dynamic-page"` 用于读取和写入 Widget 数据，仅在用户主动添加 Widget 时使用

### 5.5 提交检查清单

- [ ] Widget 功能完整测试（参考第 6 节测试检查表）
- [ ] 插件描述清晰完整
- [ ] 截图/视频准备就绪
- [ ] 权限说明已填写
- [ ] 版本号已更新（如适用）
- [ ] 已知限制已说明
- [ ] 符合 Figma 社区指南

### 5.6 提交步骤

1. 在 Figma Desktop 中：`Plugins → Manage Plugins…`
2. 找到 "TableView" Widget
3. 点击 "Publish New Release"
4. 填写版本号、更新日志
5. 上传图标、封面图、截图
6. 填写插件描述
7. 选择发布对象（整个 Figma 社区或特定组织）
8. 确认权限说明
9. 点击发布

### 5.7 审核注意事项

- 确保所有网络请求都有明确用途说明
- 确保 Widget 符合 Figma 社区指南和许可要求
- 在描述中说明 Widget 的适用场景和限制
- 如有已知问题，在描述中明确说明

## 6. 测试检查表 / QA Checklist

- [ ] **基本功能**：
  - [ ] Widget 可以正常添加到画布
  - [ ] 配置界面可以正常打开
  - [ ] 数据输入和显示正常

- [ ] **数据输入**：
  - [ ] 制表符分隔的数据格式解析正常
  - [ ] 从 Excel 等表格软件复制粘贴功能正常
  - [ ] 自动检测行列数功能正常
  - [ ] 手动设置行列数功能正常
  - [ ] 快速清空功能正常

- [ ] **表格样式**：
  - [ ] 填充样式切换正常（全填充、横间隔、竖间隔、无填充）
  - [ ] 描边样式切换正常（全描边、仅横线、仅竖线、无描边）
  - [ ] 表头开关功能正常
  - [ ] 行列互换功能正常

- [ ] **主题配色**：
  - [ ] 主题风格切换正常（Normal、Soft、Fashion、Vivid、Pastel、Retro、Neon）
  - [ ] 主题色相选择功能正常
  - [ ] 主题色阶选择功能正常
  - [ ] 颜色模式切换正常（彩色/单色）
  - [ ] 配色算法计算正确，各部分的颜色协调

- [ ] **配置选项**：
  - [ ] 字体大小设置功能正常（8-72px）
  - [ ] 应用设置后 Widget 更新正常

- [ ] **边界情况**：
  - [ ] 空数据处理正常
  - [ ] 单行/单列表格处理正常
  - [ ] 超大表格处理正常（性能测试）
  - [ ] 特殊字符处理正常
  - [ ] 不同编码格式处理正常

## 7. 已知限制 / Known Limitations

1. **表格大小限制**：由于 Figma Widget 的性能限制，建议表格行数不超过 100 行，列数不超过 20 列
2. **数据格式**：仅支持制表符分隔的文本格式，不支持 CSV、Excel 等格式的直接导入
3. **编辑限制**：Widget 显示的是只读表格，无法直接在画布上编辑，需要通过配置界面编辑
4. **字体**：表格使用系统默认字体，不支持自定义字体
5. **对齐方式**：文字对齐方式固定，不支持自定义对齐
6. **网络依赖**：需要网络连接以加载 UI 资源，离线环境可能无法正常使用配置界面

## 8. 版本信息 / Version Information

- **API 版本**：1.0.0
- **Widget API 版本**：1.0.0

## 9. 开发信息 / Development

### 9.1 文件结构

```
TableView/
├── manifest.json          # Widget 配置文件
├── ui.html               # 配置界面 HTML
├── dist/
│   └── code.js          # 编译后的 Widget 代码
└── widget-src/
    ├── code.tsx         # Widget 源代码（TypeScript）
    └── tsconfig.json    # TypeScript 配置
```

### 9.2 构建说明

1. 确保已安装依赖：
   ```bash
   npm install
   ```

2. 编译 TypeScript 代码：
   ```bash
   cd tool_plugin/TableView/widget-src
   npx tsc
   ```

3. 编译后的代码将生成在 `dist/code.js`

### 9.3 开发注意事项

- Widget 代码使用 Figma Widget API，不支持所有浏览器 API
- UI 界面运行在 iframe 中，可以通过 `parent.postMessage` 与 Widget 通信
- 表格数据使用 `useSyncedState` 保存状态，会在 Widget 实例间同步
- 颜色计算使用 HSL 颜色空间，需要处理颜色转换
- 表格布局使用 AutoLayout，需要合理设置间距和对齐方式

## 10. 联系方式 / Contact

- **作者**：YNYU
- **邮箱**：lvynyu2@gmail.com | lvynyu@163.com
- **网站**：www.ynyuset.cn
- **GitHub**：YNYU01/YNYU_SET

## 11. 许可证 / License

请参考项目根目录的 LICENSE 文件。

---

**最后更新**：2025-01-XX

如需在文档中引用此说明，可直接链接 `tool_plugin/TableView/README_RELEASE.md`。如有额外模块需要纳入，请在本文件对应章节追加说明即可。

