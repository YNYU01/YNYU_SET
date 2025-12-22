# YN+ ToolsSet - Figma Plugin

> Batch Creation & Data Replacement | Comprehensive Productivity Tools Integration

[![Figma Plugin](https://img.shields.io/badge/Figma-Plugin-orange)](https://www.figma.com/community)
[![License](https://img.shields.io/badge/License-CC%20BY%204.0-blue)](LICENSE)

## 📋 Overview

**YN+ ToolsSet** is a feature-focused Figma plugin designed to enhance design workflow efficiency. The plugin provides six core functional modules, supporting batch creation, export, editing, style/variable management, table (parameter)-driven content, and more practical tools.

### Core Features

- 🎨 **Batch Creation**: Import images, tables, and various file formats to quickly generate frames and components;
- 📤 **Batch Export**: Support multiple export formats including images, .zy format, and rich text;
- ✏️ **Image Editing**: Built-in filter stack supporting brightness, contrast, hue adjustments, and more;
- 🎯 **Variable Management**: Bidirectional synchronization of styles and variables with local table management;
- 📊 **Table (Parameter)-Driven**: Batch drive component properties through table data;
- 🛠️ **More Tools**: Pixel/vector processing, layer management, and other practical features with favorites pinning;

### Interface Experience

- 🌓 Automatic light/dark theme switching;
- 🌍 Bilingual interface (Chinese/English);
- 💾 Remembers window size and recently used tabs;
- 🎨 Native-like UI style with smooth operations;

## 🚀 Quick Start

### Installation

1. **Install from Figma Community** (Recommended)
   - Search for "YN+ ToolsSet" in Figma
   - Click "Install" to install the plugin

2. **Local Development Installation**
   ```bash
   # Install dependencies
   npm install
   
   # Build the plugin
   cd tool_plugin/ToolsSetFig
   npx webpack
   
   # In Figma Desktop
   # Plugins → Development → Import plugin from manifest…
   # Select builds/manifest.json
   ```

### How to Use

1. Open any file in Figma
2. Launch the plugin via menu: `Plugins → YN+ ToolsSet`
3. Switch between different functional modules using the top tabs
4. Follow the on-screen instructions

## 📖 Features

### > Create Page

- Drag & drop/upload images (auto-slice if exceeds 4096px);
- Upload table files (`.csv`, `.xls`, `.xlsx`) | Input TSV data to generate frames;
- Upload compatible formats (`.zy`, `.sketch`, `.svg`, `.json`, `.zip`) | Input code to generate layers;
- Specify frame naming templates;
- Preview tags for secondary confirmation;

### > Export Page

- Upload layers with default/export settings;
- Render list for secondary confirmation, specify target compression size and export format;
- Compatible format for interoperability with other YN series tools;

### > Editor Page

- Add filters and adjustments as image/maximum supported editability;
- Transparent/specified color preview background;
- Support stacking multiple filters (brightness, contrast, hue, etc.);
- Import/export JSON presets;
- Directly write filter parameters in code box;

### > Variable Page

- Create style/variable collection examples for local management;
- Find broken link styles to relink as same-name styles, create new styles, or override current styles;
- Switch locally managed style/variable groups;

### > Sheet Page

- Create customized table components `@table`, `@th`, `@td`;
- Similar style settings and row/column selection functions as table tools;
- Batch replace/get table component data;
- Batch replace/get specified component properties/tag properties;

### > More Tools Page

- Favorites pinning feature with unlimited expansion;
- In-place rasterization, batch proportional scaling, quick image processing, text split/merge, layer swap/scatter/adaptive, path splitting, QR code recognition/creation, shadow pseudo-stroke;

### > Top Bar/Sidebar

- Search and locate functions;
- Default zoom in/out interface, also freely drag to adjust plugin size;
- Switch theme/language;

## 🔒 Privacy & Permissions

### Data Storage

- ✅ **Local Storage**: Only uses Figma `clientStorage` to save user preferences (theme, language, window size, etc.)
- ❌ **Cloud Storage**: Does not collect or upload any user data
- ❌ **User Tracking**: No user behavior tracking

### Network Access

The plugin needs to access the following domains, **only for loading UI resources**:

- `cdn.jsdelivr.net` / `cdn.jsdelivr.net.cn` - CDN resources
- `cdnjs.cloudflare.com` - Font and icon libraries
- `unpkg.com` - JavaScript libraries
- `ipapi.co` - Geolocation detection (for automatic language switching)
- `*.ynyuset.cn` - Own resources
- `*.supabase.co` / `*.supabase.in` - Backup resources (if needed)

**Important Note**: All network requests are only used to load static resources and do not involve any user data upload or processing.

### Permission Description

- `payments`: Reserved for future in-app purchase features, **currently not enabled**
- `currentuser`: Used to get current user information (only for interface display)

## 📸 Screenshots

### Recommended Screenshot Content

1. **Main Interface**: Display six functional module tabs
2. **Create Feature**: Display table import and batch creation process
3. **Export Feature**: Display export queue and multiple format options
4. **Variable Management**: Display style/variable synchronization interface
5. **Table-Driven**: Display data mapping and batch update effects

### Video Demo Suggestions

Record a 30-60 second demo video including the following workflow:
1. Import table data
2. Batch create frames
3. Use form to batch modify text
4. Export images

## ⚙️ Requirements

- **Figma Desktop App** or **Figma Web** (Desktop recommended)
- **Network Connection**: Initial load requires network access to CDN resources
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)

## 🐛 Known Limitations

- If no `clientStorage` record exists on first open, will fall back to default UI size 300×660
- `.zy` compatible format does not support nested component local states, requires manual organization
- Online fonts/icons come from external CDN, network access required
- Editor page processes only a single node at a time; batch filter processing not yet available

## 🔄 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details.

## 📝 License

This plugin is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

According to Figma Community Guidelines, plugins in the Figma Community default to Attribution 4.0 International (CC BY 4.0) license. This means:

- ✅ Other users can share and adapt your plugin
- ✅ Original author attribution required
- ✅ Commercial use permitted

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📧 Contact

- **Author**: YNYU
- **Email**: lvynyu2.gmail.com
- **Project Homepage**: [GitHub Repository](https://github.com/your-repo)

## 🙏 Acknowledgments

Thanks to all users who use and provide feedback!

---

**Note**: When using this plugin, please ensure compliance with Figma Community Guidelines and relevant laws and regulations.

