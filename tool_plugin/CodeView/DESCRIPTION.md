# CodeView Widget – 功能描述 / Description

Code Display Widget with Syntax Highlighting | 代码展示小部件，支持语法高亮

---

## 概述 / Overview

CodeView 是一个 Figma Widget，用于在 Figma 画布上展示代码块，支持语法高亮、行号、缩进线等功能。适用于设计文档、技术文档、代码片段分享等场景。

CodeView is a Figma Widget for displaying code blocks on the Figma canvas with syntax highlighting, line numbers, and indent guides. Perfect for design documentation, technical documentation, and code snippet sharing.

---

## 核心特性 / Core Features

### 🎨 语法高亮 / Syntax Highlighting

- **支持 16+ 种编程语言**：JavaScript、HTML、CSS、JSON、SQL、Bash、PHP、Python、Go、Rust、Java、C、C#、Ruby、TypeScript
- **自动检测**：智能检测代码类型，也可手动选择
- **专业引擎**：基于 Prism.js 实现语法高亮
- **VS Code 风格**：使用 VS Code 风格的配色方案，支持暗色主题

**Supports 16+ programming languages**: JavaScript, HTML, CSS, JSON, SQL, Bash, PHP, Python, Go, Rust, Java, C, C#, Ruby, TypeScript  
**Auto-detection**: Intelligently detects code type, or manually select  
**Professional engine**: Syntax highlighting powered by Prism.js  
**VS Code style**: Uses VS Code color scheme with dark theme support

### 📊 显示选项 / Display Options

- **行号显示**：可切换显示/隐藏行号，选中行高亮显示
- **缩进线**：可显示缩进辅助线，帮助理解代码结构
- **自动换行**：支持开启/关闭自动换行，固定宽度模式
- **行选择**：点击代码行可选中，再次点击取消选中

**Line numbers**: Toggle line numbers on/off, highlight selected lines  
**Indent guides**: Show indent guides to help understand code structure  
**Word wrap**: Enable/disable word wrap with fixed width mode  
**Line selection**: Click to select lines, click again to deselect

### ⚙️ 配置选项 / Configuration

- **宽度设置**：可设置代码块宽度（100-2000px）
- **字号设置**：可设置字体大小（8-72px）
- **缩进规则**：自动识别 2 空格或 4 空格缩进规则
- **颜色识别**：自动识别 HEX、RGB、HSL 格式的颜色代码，并显示颜色方块

**Width settings**: Set code block width (100-2000px)  
**Font size**: Set font size (8-72px)  
**Indent rules**: Auto-detect 2-space or 4-space indent rules  
**Color recognition**: Auto-detect HEX, RGB, HSL color codes and display color squares

### ✏️ 编辑界面 / Edit Interface

- **代码输入**：提供多行文本编辑器
- **实时预览**：输入代码后自动检测语言类型
- **快速清空**：一键清空代码输入框

**Code input**: Multi-line text editor  
**Live preview**: Auto-detect language type after input  
**Quick clear**: One-click clear code input

---

## 使用场景 / Use Cases

### 📝 设计文档

在设计文档中展示代码片段，说明技术实现细节。

Display code snippets in design documentation to explain technical implementation details.

### 📚 技术文档

在技术文档中展示 API 调用示例、配置代码等。

Display API call examples, configuration code, etc. in technical documentation.

### 🔗 代码分享

在设计稿中直接展示代码，方便团队成员查看和使用。

Display code directly in design files for easy viewing and use by team members.

### 📋 UI 说明

在 UI 设计稿中添加代码说明，说明交互逻辑或实现方式。

Add code descriptions to UI design files to explain interaction logic or implementation methods.

### 📖 开发规范

展示编码规范、代码示例等，帮助团队统一开发标准。

Display coding standards, code examples, etc. to help teams unify development standards.

---

## 功能详解 / Detailed Features

### 1. 代码输入与编辑 / Code Input & Editing

- 在配置界面中，提供多行文本编辑器
- 支持粘贴代码，自动保持格式
- 提供快速清空按钮，方便重新输入
- 代码类型可选择 "Auto" 自动检测，或手动选择特定语言

**Multi-line text editor** in the configuration interface  
**Support pasting code** with automatic format preservation  
**Quick clear button** for easy re-input  
**Code type** can be set to "Auto" for auto-detection or manually select a specific language

### 2. 语法高亮 / Syntax Highlighting

- 基于 Prism.js 1.23.0 实现语法高亮
- 支持 16+ 种编程语言的语法识别
- 使用 VS Code 风格的配色方案
- 自动识别关键字、字符串、注释、函数等语法元素

**Powered by Prism.js 1.23.0** for syntax highlighting  
**Supports 16+ programming languages** for syntax recognition  
**VS Code style color scheme**  
**Auto-recognize** keywords, strings, comments, functions, and other syntax elements

### 3. 语言检测 / Language Detection

- 智能检测代码类型，基于代码特征自动识别
- 支持检测 HTML、CSS、JSON、SQL、Bash、PHP、Python、Go、Rust、Java、C、C#、Ruby、TypeScript、JavaScript
- 检测失败时自动降级到 JavaScript 高亮

**Intelligent code type detection** based on code features  
**Supports detection** of HTML, CSS, JSON, SQL, Bash, PHP, Python, Go, Rust, Java, C, C#, Ruby, TypeScript, JavaScript  
**Auto-fallback** to JavaScript highlighting if detection fails

### 4. 显示选项 / Display Options

#### 行号 / Line Numbers

- 可切换显示/隐藏行号
- 行号右对齐显示
- 选中行的行号区域高亮显示
- 行号宽度根据代码行数自动调整

**Toggle line numbers** on/off  
**Right-aligned** line numbers  
**Highlight** line number area of selected lines  
**Auto-adjust** line number width based on code line count

#### 缩进线 / Indent Guides

- 可切换显示/隐藏缩进辅助线
- 自动识别代码缩进级别
- 支持 2 空格和 4 空格缩进规则
- 辅助线颜色与代码区域背景区分

**Toggle indent guides** on/off  
**Auto-detect** code indent levels  
**Support 2-space and 4-space** indent rules  
**Guide colors** distinguish from code area background

#### 自动换行 / Word Wrap

- 可切换开启/关闭自动换行
- 开启时使用固定宽度模式
- 关闭时代码块宽度自适应内容
- 宽度可在 100-2000px 范围内设置

**Toggle word wrap** on/off  
**Fixed width mode** when enabled  
**Auto-fit width** when disabled  
**Width range**: 100-2000px

### 5. 交互功能 / Interaction

#### 行选择 / Line Selection

- 点击代码行可选中该行
- 再次点击同一行可取消选中
- 选中行显示高亮标记线
- 行号区域同步高亮显示

**Click to select** code lines  
**Click again** to deselect  
**Highlight marker line** for selected lines  
**Synchronized highlight** in line number area

### 6. 颜色代码识别 / Color Code Recognition

- 自动识别 HEX 格式（#rgb, #rrggbb, #rrggbbaa）
- 自动识别 RGB/RGBA 格式（rgb(r,g,b), rgba(r,g,b,a)）
- 自动识别 HSL/HSLA 格式（hsl(h,s%,l%), hsla(h,s%,l%,a)）
- 在颜色代码前显示对应的颜色方块
- 颜色方块使用代码中定义的颜色值

**Auto-detect HEX** format (#rgb, #rrggbb, #rrggbbaa)  
**Auto-detect RGB/RGBA** format (rgb(r,g,b), rgba(r,g,b,a))  
**Auto-detect HSL/HSLA** format (hsl(h,s%,l%), hsla(h,s%,l%,a))  
**Display color squares** before color codes  
**Color squares** use the color values defined in the code

### 7. 配置参数 / Configuration Parameters

#### 宽度 / Width

- 范围：100-2000px
- 默认值：400px
- 仅在启用自动换行时生效
- 可通过输入框直接输入数值

**Range**: 100-2000px  
**Default**: 400px  
**Only effective** when word wrap is enabled  
**Direct input** via input box

#### 字号 / Font Size

- 范围：8-72px
- 默认值：16px
- 影响代码、行号的字体大小
- 行高自动调整为字号的 1.5 倍

**Range**: 8-72px  
**Default**: 16px  
**Affects** code and line number font size  
**Line height** auto-adjusted to 1.5x font size

---

## 界面说明 / Interface Description

### 配置界面 / Configuration Interface

配置界面包含以下区域：

The configuration interface includes the following areas:

1. **代码类型选择器** / **Code Type Selector**
   - 下拉菜单，可选择代码类型
   - 默认选项为 "Auto"（自动检测）
   - 支持选择 16+ 种编程语言

2. **代码输入框** / **Code Input Box**
   - 多行文本编辑器
   - 支持粘贴和直接输入
   - 提供清空按钮（右上角）

3. **参数设置区** / **Parameter Settings Area**
   - 宽度输入框（带单位 px）
   - 字号输入框（带单位 px）
   - 输入框带提示图标和悬停提示

4. **应用按钮** / **Apply Button**
   - 点击后应用所有设置
   - 更新 Widget 显示效果

### Widget 显示 / Widget Display

Widget 在画布上显示为：

The widget displays on the canvas as:

- 代码块区域，使用暗色背景
- 行号区域（如启用），使用深灰色背景
- 代码内容，使用语法高亮显示
- 缩进辅助线（如启用），显示为竖线
- 选中行标记（如有选中），显示为横线

---

## 技术规格 / Technical Specifications

### 支持的语言 / Supported Languages

- JavaScript / TypeScript
- HTML / CSS
- JSON
- SQL
- Bash / Shell
- PHP
- Python
- Go
- Rust
- Java
- C / C#
- Ruby

### 颜色格式支持 / Color Format Support

- **HEX**: `#rgb`, `#rrggbb`, `#rrggbbaa`
- **RGB**: `rgb(r, g, b)`
- **RGBA**: `rgba(r, g, b, a)`
- **HSL**: `hsl(h, s%, l%)`
- **HSLA**: `hsla(h, s%, l%, a)`

### 配置限制 / Configuration Limits

- **宽度范围**：100-2000px
- **字号范围**：8-72px
- **代码长度建议**：不超过 1000 行，总长度不超过 100KB

### 性能考虑 / Performance Considerations

- 代码行数建议不超过 1000 行
- 代码总长度建议不超过 100KB
- 超长代码可能影响 Widget 渲染性能

---

## 隐私与权限 / Privacy & Permissions

### 数据存储 / Data Storage

- Widget 使用 Figma 的 `useSyncedState` 存储代码内容
- 数据仅存储在本地 Figma 文件中
- 不收集、不上传任何用户数据

**Data storage**: Widget uses Figma's `useSyncedState` to store code content  
**Local only**: Data is only stored locally in the Figma file  
**No data collection**: Does not collect or upload any user data

### 网络访问 / Network Access

- 网络请求仅用于加载静态资源（UI 样式、脚本、语法高亮库）
- 使用 CDN 加载资源：jsDelivr、cdnjs、unpkg
- 不涉及任何用户数据的上传或处理

**Network requests** are only used to load static resources (UI styles, scripts, syntax highlighting library)  
**CDN resources**: jsDelivr, cdnjs, unpkg  
**No user data** upload or processing

### 权限说明 / Permission Description

- **documentAccess**: `dynamic-page` - 用于读取和写入 Widget 数据
- **networkAccess**: 仅用于加载静态资源，不涉及用户数据

**documentAccess**: `dynamic-page` - Used to read and write widget data  
**networkAccess**: Only for loading static resources, no user data involved

---

## 已知限制 / Known Limitations

1. **代码长度限制**：建议代码行数不超过 1000 行，总长度不超过 100KB
2. **语言支持**：目前支持 16 种编程语言，其他语言可能降级到 JavaScript 高亮
3. **网络依赖**：需要网络连接以加载语法高亮库，离线环境可能无法正常使用
4. **颜色代码**：仅支持 HEX、RGB、HSL 格式，其他格式可能无法识别
5. **字体**：代码使用 Roboto Mono 字体，系统未安装时会使用默认等宽字体
6. **编辑限制**：Widget 显示为只读代码，需通过配置界面编辑

**Code length limit**: Recommended code lines ≤ 1000, total length ≤ 100KB  
**Language support**: Currently supports 16 programming languages, others may fallback to JavaScript highlighting  
**Network dependency**: Requires network connection to load syntax highlighting library, may not work offline  
**Color codes**: Only supports HEX, RGB, HSL formats, others may not be recognized  
**Font**: Code uses Roboto Mono font, falls back to default monospace if not installed  
**Editing limit**: Widget displays read-only code, must edit through configuration interface

---

## 更新日志 / Changelog

### Version 1.0.0 (Initial Release)

- ✅ 支持 16+ 种编程语言的语法高亮
- ✅ 自动语言检测功能
- ✅ 行号显示/隐藏
- ✅ 缩进线显示/隐藏
- ✅ 自动换行功能
- ✅ 行选择和高亮功能
- ✅ 颜色代码识别和显示
- ✅ 可配置宽度和字号
- ✅ VS Code 风格配色

---

## 联系方式 / Contact

- **作者 / Author**: YNYU
- **邮箱 / Email**: lvynyu2@gmail.com | lvynyu@163.com
- **网站 / Website**: www.ynyuset.cn
- **GitHub**: YNYU01/YNYU_SET

---

## 致谢 / Acknowledgments

- 感谢 Prism.js 提供语法高亮功能
- 感谢所有使用和反馈的用户

**Thanks to Prism.js** for providing syntax highlighting functionality  
**Thanks to all users** who use and provide feedback

---

**最后更新 / Last Updated**: 2025-01-XX

