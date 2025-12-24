# CodeView Widget – 发布准备说明 / Release Brief

> **📌 发布前必读**：请确保已阅读本说明，了解 CodeView Widget 的完整功能和使用方式。

## 1. 插件概述 / Overview

- **名称**：`CodeView`
- **类型**：Figma Widget（小部件）
- **定位**：在 Figma 画布上展示代码块，支持语法高亮、行号、缩进线等功能，适用于代码展示、文档说明等场景
- **核心特性**：
  - 支持 16+ 种编程语言的语法高亮
  - 自动语言检测
  - 可配置的行号、缩进线、自动换行
  - 点击选择行功能
  - 颜色代码自动识别并显示颜色方块

## 2. 核心功能 / Core Features

### 2.1 代码高亮 / Syntax Highlighting

- **支持的语言**：JavaScript、HTML、CSS、JSON、SQL、Bash、PHP、Python、Go、Rust、Java、C、C#、Ruby、TypeScript
- **自动检测**：支持自动检测代码类型，也可手动选择
- **高亮引擎**：基于 Prism.js 实现语法高亮
- **主题配色**：使用 VS Code 风格的配色方案，支持暗色主题

### 2.2 显示选项 / Display Options

- **行号显示**：可切换显示/隐藏行号，选中行高亮显示
- **缩进线**：可显示缩进辅助线，帮助理解代码结构
- **自动换行**：支持开启/关闭自动换行，固定宽度模式
- **行选择**：点击代码行可选中，再次点击取消选中

### 2.3 配置选项 / Configuration

- **宽度设置**：可设置代码块宽度（100-2000px）
- **字号设置**：可设置字体大小（8-72px）
- **缩进规则**：自动识别 2 空格或 4 空格缩进规则
- **颜色代码识别**：自动识别 HEX、RGB、HSL 格式的颜色代码，并显示颜色方块

### 2.4 编辑界面 / Edit Interface

- **代码输入**：提供多行文本编辑器
- **实时预览**：输入代码后自动检测语言类型
- **快速清空**：一键清空代码输入框

## 3. 使用方式 / How to Use

### 3.1 安装 / Installation

1. **开发模式**：
   - 在 Figma Desktop 中选择 `Plugins → Development → Import plugin from manifest…`
   - 指向 `tool_plugin/CodeView/manifest.json`
   - 插件将出现在插件列表中

2. **添加 Widget**：
   - 在 Figma 画布上，点击 `+` → `Widgets`
   - 选择 `CodeView`
   - Widget 将添加到画布上

### 3.2 配置代码 / Configure Code

1. **打开配置界面**：
   - 选中 CodeView Widget
   - 在右侧属性面板中，点击 `⚙️` 图标（Open Config）

2. **输入代码**：
   - 在代码输入框中粘贴或输入代码
   - 代码类型默认为 "Auto"，会自动检测语言类型
   - 也可以手动选择代码类型

3. **设置参数**：
   - **宽度**：设置代码块的显示宽度（开启自动换行时生效）
   - **字号**：设置代码的字体大小

4. **应用设置**：
   - 点击 "Apply" 按钮应用设置
   - Widget 将更新显示效果

### 3.3 属性菜单 / Property Menu

Widget 提供以下快捷开关：

- **Word Wrap**（自动换行）：切换是否启用自动换行
- **Line Number**（行号）：切换是否显示行号
- **Indent Line**（缩进线）：切换是否显示缩进辅助线

### 3.4 交互操作 / Interaction

- **选择行**：点击代码行可选中该行，再次点击取消选中
- **行号高亮**：选中的行号区域会高亮显示
- **悬停提示**：配置界面中的部分控件提供悬停提示说明

## 4. 技术实现 / Technical Implementation

### 4.1 技术栈 / Tech Stack

- **Widget 代码**：TypeScript + React-like JSX (使用 Figma Widget API)
- **UI 界面**：HTML + JavaScript
- **语法高亮**：Prism.js 1.23.0
- **构建工具**：TypeScript Compiler

### 4.2 数据结构 / Data Structure

Widget 使用以下数据结构存储代码：

- **textContent**：存储纯文本代码（用于编辑）
- **spanContentArray**：存储按行组织的高亮数据数组
  ```typescript
  type LineData = {
    line: number          // 行号
    indent: number        // 缩进级别
    spans: Array<{        // 代码片段数组
      tagname: string | null
      color: string | null
      text: string
    }>
  }
  ```

### 4.3 网络访问 / Network Access

Widget 需要访问以下域名（仅用于加载静态资源）：

- `https://cdn.jsdelivr.net` / `https://cdn.jsdelivr.net.cn`：加载 UI 样式和脚本资源
- `https://cdnjs.cloudflare.com`：备用 CDN
- `https://unpkg.com`：加载 Prism.js 语言组件
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
CodeView 是一个 Figma Widget，用于在画布上展示代码块，支持语法高亮、行号、缩进线等功能。

【核心功能】

1. 代码高亮：支持 16+ 种编程语言的语法高亮（JavaScript、HTML、CSS、JSON、SQL、Bash、PHP、Python、Go、Rust、Java、C、C#、Ruby、TypeScript）
2. 自动检测：智能检测代码类型，也可手动选择
3. 显示选项：支持行号、缩进线、自动换行等显示选项
4. 交互功能：点击选择行，行号高亮显示
5. 灵活配置：可设置宽度、字号等参数
6. 颜色识别：自动识别颜色代码并显示颜色方块

【使用场景】

- 设计文档中的代码展示
- 技术文档编写
- 代码片段分享
- UI 设计稿中的代码说明
- 开发规范文档

【特色亮点】

- 基于 Prism.js 实现专业级语法高亮
- VS Code 风格配色，暗色主题
- 支持多种编程语言
- 简洁直观的配置界面
- 实时预览和编辑

【隐私说明】

本 Widget 仅使用本地存储保存代码内容，不收集、不上传任何用户数据。
网络访问仅用于加载 UI 资源和语法高亮库，不涉及任何用户数据处理。
```

### 5.3 截图/视频建议

**推荐截图内容**：

1. **主界面**：展示配置界面，包含代码输入框、语言选择、参数设置
2. **代码展示**：展示不同语言的代码高亮效果（JavaScript、Python、HTML 等）
3. **显示选项**：展示行号、缩进线、自动换行的效果
4. **交互功能**：展示行选择和高亮效果
5. **颜色识别**：展示颜色代码识别和颜色方块显示

**视频演示流程**（30-60 秒）：

1. 添加 Widget 到画布
2. 打开配置界面，输入代码
3. 切换不同语言类型，展示高亮效果
4. 开启/关闭行号、缩进线等选项
5. 演示行选择功能

### 5.4 权限说明

在 Figma 提交流程中，需要明确说明：

- **网络访问权限**：使用外部 CDN（jsDelivr、cdnjs、unpkg 等）仅用于加载 UI 资源和语法高亮库（Prism.js），**无用户数据上报**
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
2. 找到 "CodeView" Widget
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
  - [ ] 代码输入和显示正常

- [ ] **代码高亮**：
  - [ ] 自动检测语言类型功能正常
  - [ ] 手动选择语言类型功能正常
  - [ ] 各种语言的语法高亮显示正确（至少测试 JavaScript、Python、HTML、CSS、JSON）

- [ ] **显示选项**：
  - [ ] 行号显示/隐藏切换正常
  - [ ] 缩进线显示/隐藏切换正常
  - [ ] 自动换行功能正常
  - [ ] 选中行高亮显示正常

- [ ] **配置选项**：
  - [ ] 宽度设置功能正常（100-2000px）
  - [ ] 字号设置功能正常（8-72px）
  - [ ] 应用设置后 Widget 更新正常

- [ ] **交互功能**：
  - [ ] 点击选择行功能正常
  - [ ] 再次点击取消选择功能正常
  - [ ] 行号区域高亮显示正常

- [ ] **特殊功能**：
  - [ ] 颜色代码识别和显示正常
  - [ ] 缩进规则自动识别正常（2 空格/4 空格）
  - [ ] 清空代码输入框功能正常

- [ ] **边界情况**：
  - [ ] 空代码处理正常
  - [ ] 超长代码行处理正常
  - [ ] 特殊字符处理正常
  - [ ] 代码类型不支持时的降级处理正常

## 7. 已知限制 / Known Limitations

1. **代码长度限制**：由于 Figma Widget 的性能限制，建议代码行数不超过 1000 行，代码总长度不超过 100KB
2. **语言支持**：目前支持 16 种编程语言，其他语言可能会降级到 JavaScript 高亮
3. **网络依赖**：需要网络连接以加载语法高亮库，离线环境可能无法正常使用
4. **颜色代码**：颜色代码识别支持 HEX、RGB、HSL 格式，其他格式可能无法识别
5. **字体**：代码使用 Roboto Mono 字体，如果系统未安装该字体，会使用系统默认等宽字体
6. **编辑限制**：Widget 显示的是只读代码，无法直接在画布上编辑，需要通过配置界面编辑

## 8. 版本信息 / Version Information

- **API 版本**：1.0.0
- **Widget API 版本**：1.0.0
- **Prism.js 版本**：1.23.0

## 9. 开发信息 / Development

### 9.1 文件结构

```
CodeView/
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
   cd tool_plugin/CodeView/widget-src
   npx tsc
   ```

3. 编译后的代码将生成在 `dist/code.js`

### 9.3 开发注意事项

- Widget 代码使用 Figma Widget API，不支持所有浏览器 API
- UI 界面运行在 iframe 中，可以通过 `parent.postMessage` 与 Widget 通信
- 语法高亮在 UI 界面中处理，结果通过消息传递给 Widget
- 代码使用 `useSyncedState` 保存状态，会在 Widget 实例间同步

## 10. 联系方式 / Contact

- **作者**：YNYU
- **邮箱**：lvynyu2@gmail.com | lvynyu@163.com
- **网站**：www.ynyuset.cn
- **GitHub**：YNYU01/YNYU_SET

## 11. 许可证 / License

请参考项目根目录的 LICENSE 文件。

---

**最后更新**：2025-01-XX

如需在文档中引用此说明，可直接链接 `tool_plugin/CodeView/README_RELEASE.md`。如有额外模块需要纳入，请在本文件对应章节追加说明即可。

