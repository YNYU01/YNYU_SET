// plugins/InlineJsCssPlugin.js
const fs = require('fs');
const path = require('path');

class InlineJsCssPlugin {
  constructor(options = {}) {
    this.templatePath = options.template;
    this.hash = options.hash;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('InlineJsCssPlugin', (compilation, callback) => {
      // 获取输出路径和文件名
      const outputDir = this.templatePath.replace('/index.html','');//compilation.options.output.path;
      const mainBundlePath = path.join(outputDir, 'main.js');
      const mainCssPath = path.join(outputDir, 'style.css');

      // 读取 JS 和 CSS 内容
      let jsContent = '';
      let cssContent = '';

      try {
        jsContent = fs.readFileSync(mainBundlePath, 'utf-8');
      } catch (e) {
        console.warn('找不到 main.js');
      }

      try {
        cssContent = fs.readFileSync(mainCssPath, 'utf-8');
      } catch (e) {
        console.warn('找不到 style.css');
      }

      // 读取 HTML 模板
      let html = fs.readFileSync(this.templatePath, 'utf-8');

      // 替换占位符
      html = html
        .replace('<link rel="stylesheet" href="style.css">', `<style>${cssContent}</style>`)
        .replace('<script src="main.js"></script>', `<script>${jsContent}</script>`)

      // 写入新文件
      const outputPath = path.join(compilation.options.output.path, 'ui.html');
      fs.writeFileSync(outputPath, html);

      callback();
    });
  }
}

module.exports = InlineJsCssPlugin;