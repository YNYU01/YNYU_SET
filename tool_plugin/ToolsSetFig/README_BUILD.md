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

