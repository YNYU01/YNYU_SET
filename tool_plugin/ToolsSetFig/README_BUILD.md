# ToolsSetFig 打包说明

## 迁移说明

打包相关文件已迁移到此目录，现在可以在此目录下直接运行打包命令。

## 使用方法

1. 确保项目根目录已安装依赖（`npm install`）
2. 进入此目录：
   ```bash
   cd tool_plugin/ToolsSetFig
   ```
3. 运行打包命令：
   ```bash
   npx webpack
   ```

## 文件说明

- `webpack.config.js` - Webpack 配置文件
- `inline-jscss-plugin.js` - 自定义 Webpack 插件，用于内联 JS/CSS 到 HTML

## 注意事项

- 打包输出目录：`./builds/`
- 入口文件：`./test/main.js`
- 模板文件：`./test/index.html`
- Git hash 会从项目根目录获取（用于 CDN 路径替换）

## 代码预览 Widget

为了在 Figma 画布里直接插入“代码窗口”小部件，新增了 `widget-src/CodePreviewWidget.tsx`。构建方式：

```bash
npm run build:toolssetfig:widget
```

该命令会使用 esbuild 将 TSX 编译到 `tool_plugin/ToolsSetFig/builds/code-preview.widget.js`，并由 `manifest.json` 的 `widgets` 字段引用。修改小部件样式/交互后记得重新执行构建。

## Git 自动构建

从根目录运行 `npm install` 后，会自动安装 Husky Git Hooks。当提交中包含 `tool_plugin/ToolsSetFig` 目录的改动时，`pre-commit` 钩子会触发 `npm run build:toolssetfig:all`，确保 Figma 插件的 UI 与 Widget 代码始终保持最新构建结果。

