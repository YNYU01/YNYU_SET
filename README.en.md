![logo](VI/banner_top_en_dark.jpg)

# YNYUSET - Design Tools Suite

> **From Software Dependency to Format Definition** | **Compatibility with Maximum Editability**

[简体中文](README.md) | [Project Outline](PROJECT_OUTLINE.md) | [Open Source Plan](OPEN_SOURCE_PLAN.md)

---

## 🌟 Overview

YNYUSET is an innovative design file format and toolchain project aimed at solving compatibility and editability issues in design files.

We address three incompatible characteristics of design files (**layout, images, components**) by introducing concepts of **dynamic generation, chained rendering, and maximum editability**, establishing a new composite format **`.zy`**.

### Core Philosophy

- ✅ **Compatibility with Maximum Editability**: Design files can seamlessly flow between different software while maintaining full editability
- 🎯 **From Software Dependency to Format Definition**: Define open standards, build tools around formats

---

## 🚀 Quick Start

### Using Tools

- **Node Editor**: [ListEase](tool_web/ListEase/) - Visual node editor for dynamic design variant generation
- **Effect Editor**: [VFontX](tool_web/VFontX/) - Font effect editor
- **Figma Plugin**: [ToolsSetFig](tool_plugin/ToolsSetFig/) - Import/export support for .zy format

### Development

```bash
# Install dependencies
npm install

# Build Figma plugin
cd tool_plugin/ToolsSetFig
npx webpack
```

---

## 📁 Project Structure

```
YNYU_SET/
├── tool_web/              # Web tools
│   ├── ListEase/         # Node editor
│   └── VFontX/           # Effect editor
├── tool_plugin/           # Design software plugins
│   ├── ToolsSetFig/      # Figma plugin
│   ├── ToolsSetPs/       # Photoshop plugin (planned)
│   └── ToolsSetMg/       # Other plugins (planned)
├── builds/                # Build artifacts
├── publics/               # Public resources
└── VI/                    # Visual assets
```

> Each module has its own README. Check the corresponding folder for detailed documentation.

---

## 📚 Documentation

### Core Documents
- 📖 [Project Outline & Technical Analysis](PROJECT_OUTLINE.md) - Detailed technical architecture and progress analysis
- 🤝 [Open Source Plan & Contribution Guide](OPEN_SOURCE_PLAN.md) - How to contribute and project vision

### Module Documents
- 🎨 [Node Editor (ListEase)](tool_web/ListEase/) - Node editor usage and development docs
- ✨ [Effect Editor (VFontX)](tool_web/VFontX/) - Font effect editor docs
- 🔌 [Figma Plugin (ToolsSetFig)](tool_plugin/ToolsSetFig/) - Plugin usage and development docs
  - [Build Guide](tool_plugin/ToolsSetFig/README_BUILD.md)
  - [Release Notes](tool_plugin/ToolsSetFig/README_RELEASE.md)

---

## 🎯 Current Status

### In Progress
- 🔄 Figma Plugin MVP development
- 🔄 Node editor chained rendering engine
- 🔄 Complete .zy format implementation

### Planned
- 📋 Adobe plugin development
- 📋 SVG real-time boolean operations standard
- 📋 Format standardization process

> See [Project Outline](PROJECT_OUTLINE.md) for detailed progress and technical challenges

---

## 🤝 Contributing

We welcome all forms of contributions!

- 💻 **Code**: Fix bugs, implement features
- 🎨 **Design**: UI design, template creation
- 📝 **Documentation**: Write docs, translations
- 🐛 **Testing**: Report bugs, provide feedback

👉 See [Contribution Guide](OPEN_SOURCE_PLAN.md) to get started

---

## 📄 License

This project is licensed under **GPL 3.0**

### Important Notes
- ✅ Commercial use and derivative works must retain copyright notice and remain open source
- ✅ External libraries must comply with their respective licenses
- ❌ Prohibited for illegal activities

---

## 🔗 Links

- 🌐 [Online Demo](https://www.ynyuset.cn)
- 📧 Issues: [GitHub Issues](https://github.com/YNYU01/YNYU_SET/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/YNYU01/YNYU_SET/discussions)
- ⚙️ [GitHub Setup Guide](docs/GITHUB_SETUP.md) - How to set up Issues and Discussions

---

## 🙏 Acknowledgments

Thanks to everyone who has contributed to this project!

**Let's move from software dependency to format definition together!**

---

*Last updated: 2025.12.3*
