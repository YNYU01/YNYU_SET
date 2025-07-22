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
      const mainJsPath = path.join(outputDir, 'main.js');
      const mainCssPath = path.join(outputDir, 'style.css');
      const mainRunPath = path.join(outputDir, 'run.js');

      // 读取 JS 和 CSS 内容
      let jsContent = '';
      let cssContent = '';
      let runContent = '';

      try {
        jsContent = fs.readFileSync(mainJsPath, 'utf-8');
        jsContent = jsContent.replace(/clear\*\//g,'')//注释掉非生产内容
      } catch (e) {
        console.warn('找不到 main.js');
      }

      try {
        cssContent = fs.readFileSync(mainCssPath, 'utf-8');
      } catch (e) {
        console.warn('找不到 style.css');
      }

      try {
        runContent = fs.readFileSync(mainRunPath, 'utf-8');
      } catch (e) {
        console.warn('找不到 run.js');
      }

      // 读取 HTML 模板
      let html = fs.readFileSync(this.templatePath, 'utf-8');

      // 替换占位符
      html = html
        .replace(/\.\.\/\.\.\/\.\./g,'https://cdn.jsdelivr.net.cn/gh/YNYU01/YNYU_SET@' + this.hash)
        .replace('<link rel="stylesheet" href="style.css">', `<style>\n${cssContent}\n</style>`)
        .replace('<script src="main.js"></script>', `<script>\n${jsContent}\n</script>`)
        .replace('<script src="run.js"></script>', `<script>\n${runContent}\n</script>`)
      // 写入新文件
      const outputPath = path.join(compilation.options.output.path, 'ui.html');
      fs.writeFileSync(outputPath, html);

      callback();
    });
  }
}

module.exports = InlineJsCssPlugin;