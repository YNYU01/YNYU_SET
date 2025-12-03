![logo](VI/banner_top_zh_dark.jpg)

# 『云即·系列工具』YNYUSET

> **从依赖软件到定义格式** | **兼容且最大可编辑性**

[English](README.en.md) | [项目大纲](PROJECT_OUTLINE.md) | [开源计划](OPEN_SOURCE_PLAN.md)

---

## 🌟 项目简介

YNYUSET 是一个创新的设计文件格式和工具链项目，旨在解决设计文件的兼容性和可编辑性问题。

我们围绕设计性文件的三个难以兼容的特性（**排版、图片、组件**），引入**动态、链式触发渲染、最大可编辑性**的概念，建立一种新的综合体格式 **`.zy`**。

### 核心理念

- ✅ **兼容且最大可编辑性**：设计文件可在不同软件间无缝流转，保持完整可编辑性
- 🎯 **从依赖软件到定义格式**：定义开放标准，工具围绕格式构建

---

## 🚀 快速开始

### 使用工具

- **节点编辑器**：[ListEase](tool_web/ListEase/) - 可视化节点编辑器，动态生成设计变体
- **效果编辑器**：[VFontX](tool_web/VFontX/) - 字体效果编辑器
- **Figma插件**：[ToolsSetFig](tool_plugin/ToolsSetFig/) - 支持.zy格式的导入导出

### 开发环境

```bash
# 安装依赖
npm install

# 构建Figma插件
cd tool_plugin/ToolsSetFig
npx webpack
```

---

## 📁 项目结构

```
YNYU_SET/
├── tool_web/              # Web工具
│   ├── ListEase/         # 节点编辑器
│   └── VFontX/           # 效果编辑器
├── tool_plugin/           # 设计软件插件
│   ├── ToolsSetFig/      # Figma插件
│   ├── ToolsSetPs/       # Photoshop插件（规划中）
│   └── ToolsSetMg/       # 其他插件（规划中）
├── builds/                # 构建产物
├── publics/               # 公共资源
└── VI/                    # 视觉资源
```

> 每个模块都有独立的 README，查看详细文档请进入对应文件夹

---

## 📚 文档导航

### 核心文档
- 📖 [项目大纲与技术分析](PROJECT_OUTLINE.md) - 详细的技术架构和进度分析
- 🤝 [开源计划与贡献指南](OPEN_SOURCE_PLAN.md) - 如何参与贡献和项目愿景

### 模块文档
- 🎨 [节点编辑器 (ListEase)](tool_web/ListEase/) - 节点编辑器使用和开发文档
- ✨ [效果编辑器 (VFontX)](tool_web/VFontX/) - 字体效果编辑器文档
- 🔌 [Figma插件 (ToolsSetFig)](tool_plugin/ToolsSetFig/) - 插件使用和开发文档
  - [构建说明](tool_plugin/ToolsSetFig/README_BUILD.md)
  - [发布说明](tool_plugin/ToolsSetFig/README_RELEASE.md)

---

## 🎯 当前状态

### 进行中
- 🔄 Figma插件 MVP 开发
- 🔄 节点编辑器链式渲染引擎
- 🔄 .zy格式完整实现

### 规划中
- 📋 Adobe插件开发
- 📋 SVG实时布尔运算标准
- 📋 格式标准化进程

> 查看 [项目大纲](PROJECT_OUTLINE.md) 了解详细进度和技术难点

---

## 🤝 参与贡献

我们欢迎所有形式的贡献！

- 💻 **代码贡献**：修复Bug、实现新功能
- 🎨 **设计贡献**：UI设计、模板创作
- 📝 **文档贡献**：编写文档、翻译
- 🐛 **测试反馈**：报告Bug、提供建议

👉 [查看贡献指南](OPEN_SOURCE_PLAN.md) 了解如何开始

---

## 📄 许可证

本项目遵循 **GPL 3.0** 协议

### 重要说明
- ✅ 商用及二次编辑需保留本项目的版权声明，且必须开源
- ✅ 代码中引用其他库的部分应遵循对应许可
- ❌ 禁止用于违法行为

---

## 🔗 相关链接

- 🌐 [在线演示](https://www.ynyuset.cn)
- 📧 问题反馈：[GitHub Issues](https://github.com/YNYU01/YNYU_SET/issues)
- 💬 讨论交流：[GitHub Discussions](https://github.com/YNYU01/YNYU_SET/discussions)
- ⚙️ [GitHub设置指南](docs/GITHUB_SETUP.md) - 如何设置Issues和Discussions

---

## 🙏 致谢

感谢所有为这个项目做出贡献的人！

**让我们一起，从依赖软件到定义格式！**

---

*最后更新：2025.12.3*
