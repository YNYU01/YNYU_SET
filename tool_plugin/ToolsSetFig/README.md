# YN+ ToolsSet - Figma Plugin

> 批量创建、数据替换，整合落地提效工具 | Batch Creation & Data Replacement, All-in-One Productivity Suite

[![Figma Plugin](https://img.shields.io/badge/Figma-Plugin-orange)](https://www.figma.com/community)
[![License](https://img.shields.io/badge/License-CC%20BY%204.0-blue)](LICENSE)

## 📋 概述 / Overview

**YN+ ToolsSet** 是一个主打功能集合的 Figma 插件，旨在提高设计工作流的效率。插件提供六个核心功能模块，支持批量创建、导出、编辑、样式/变量管理、表格（参数）驱动和更多实用工具。

### 核心特性

- 🎨 **批量创建**：支持图片、表格、多种格式文件导入，快速生成画板和组件；
- 📤 **批量导出**：支持图片、.zy 格式、富文本等多种导出方式；
- ✏️ **图像编辑**：内置滤镜栈，支持亮度、对比度、色相等调整；
- 🎯 **变量管理**：样式和变量双向同步，支持本地表格管理；
- 📊 **表格（参数）驱动**：通过表格数据批量驱动组件属性；
- 🛠️ **更多工具**：像素/矢量处理、图层管理等实用功能，支持收藏置顶；

### 界面体验

- 🌓 支持亮色/暗色主题自动切换；
- 🌍 支持中文/英文双语界面；
- 💾 记忆窗口大小和最近使用的标签页；
- 🎨 接近原生的UI风格，操作流畅；


## 🚀 快速开始 / Quick Start

### 安装方式

1. **从 Figma 社区安装**（推荐）
   - 在 Figma 中搜索 "YN+ ToolsSet"
   - 点击 "Install" 安装插件

2. **本地开发安装**
   ```bash
   # 安装依赖
   npm install
   
   # 构建插件
   cd tool_plugin/ToolsSetFig
   npx webpack
   
   # 在 Figma Desktop 中
   # Plugins → Development → Import plugin from manifest…
   # 选择 builds/manifest.json
   ```

### 使用方法

1. 在 Figma 中打开任意文件
2. 通过菜单栏 `Plugins → YN+ ToolsSet` 启动插件
3. 使用顶部标签页切换不同功能模块
4. 根据界面提示操作即可

## 📖 功能详解 / Features

### > 创建页

- 拖拽/上传图片（超出4096px自动切片）；
- 上传表格文件（`.csv`, `.xls`, `.xlsx`）| 输入 TSV 数据生成画板；
- 上传兼容格式（`.zy`, `.sketch`, `.svg`, `.json`, `.zip`）| 输入代码生成图层；
- 指定画板命名模板；
- 预览标签二次确认；

### > 导出页

- 按默认设置/导出设置上传图层；
- 渲染列表二次确认，指定目标压缩大小和导出格式；
- 与其他 YN 系列工具互通的兼容格式；

### > 编辑页

- 以图片/最大可支持的编辑性添加滤镜和调整；
- 透明/指定颜色预览背景；
- 支持叠加多个滤镜（亮度、对比度、色相等）；
- 导入/导出 JSON 预设；
- 代码框直接编写滤镜参数；

### > 变量页

- 创建样式/变量集示例，实现本地化管理；
- 查找断链样式以重链为同名样式、创建新样式、覆盖当前样式；
- 切换本地化管理的样式/变量组；

### > 表单页

- 创建定制化表格组件`@table`、`@th`、`@td`；
- 与表格工具类似的样式设置功能、行列选中功能；
- 批量替换/获取表格组件数据；
- 批量替换/获取指定组件属性/标签属性；

### > 更多功能页

- 收藏置顶功能，无限期拓展；
- 原地栅格化、批量等比缩放、快速处理图片、文本拆分/合并、图层交换/打散/自适应、拆分路径、识别/创建二维码、投影伪描边；

### > 顶栏/侧边栏

- 搜索并定位功能；
- 默认放大/缩小界面，也可自由拖动调整插件大小；
- 切换主题/语言；

## 🔒 隐私与权限 / Privacy & Permissions

### 数据存储

- ✅ **本地存储**：仅使用 Figma `clientStorage` 保存用户偏好设置（主题、语言、窗口大小等）
- ❌ **云端存储**：不收集、不上传任何用户数据
- ❌ **用户追踪**：无任何用户行为追踪

### 网络访问

插件需要访问以下域名，**仅用于加载 UI 资源**：

- `cdn.jsdelivr.net` / `cdn.jsdelivr.net.cn` - CDN 资源
- `cdnjs.cloudflare.com` - 字体和图标库
- `unpkg.com` - JavaScript 库
- `ipapi.co` - 地理位置检测（用于语言自动切换）
- `*.ynyuset.cn` - 自有资源
- `*.supabase.co` / `*.supabase.in` - 备用资源（如需要）

**重要说明**：所有网络请求仅用于加载静态资源，不涉及任何用户数据的上传或处理。

### 权限说明

- `payments`：为后续内购功能预留，**当前版本未启用**
- `currentuser`：用于获取当前用户信息（仅用于界面显示）

## 📸 截图说明 / Screenshots

### 推荐截图内容

1. **主界面**：展示六个功能模块标签页
2. **创建功能**：展示表格导入和批量创建过程
3. **导出功能**：展示导出队列和多种格式选择
4. **变量管理**：展示样式/变量同步界面
5. **表格驱动**：展示数据映射和批量更新效果

### 视频演示建议

录制 30-60 秒演示视频，包含以下流程：
1. 导入表格数据
2. 批量创建画板
3. 使用表单批量修改文案
4. 导出图片

## ⚙️ 系统要求 / Requirements

- **Figma Desktop App** 或 **Figma Web**（推荐 Desktop）
- **网络连接**：首次加载需要网络访问 CDN 资源
- **浏览器**：Chrome、Firefox、Safari、Edge（最新版本）

## 🐛 已知限制 / Known Limitations

- 首次打开若无 `clientStorage` 记录，会回退到默认 UI 尺寸 300×660
- `.zy` 兼容格式暂不支持嵌套组件的局部状态，需要手动整理
- 在线字体/图标来自外部 CDN，需保持网络可访问
- 编辑页一次仅处理单个节点；批处理滤镜暂未开放

## 🔄 更新日志 / Changelog

详见 [CHANGELOG.md](./CHANGELOG.md)

## 📝 许可证 / License

本插件采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可证。

根据 Figma 社区指南，Figma 社区中的插件默认采用 Attribution 4.0 International (CC BY 4.0) 许可。这意味着：

- ✅ 其他用户可以分享和改编您的插件
- ✅ 需注明原作者出处
- ✅ 可用于商业用途

## 🤝 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式 / Contact

- **作者**：YNYU
- **邮箱**：lvynyu2.gmail.com
- **项目主页**：[GitHub Repository](https://github.com/your-repo)

## 🙏 致谢 / Acknowledgments

感谢所有使用和反馈的用户！

---

**注意**：使用本插件时，请确保遵守 Figma 社区指南和相关法律法规。

