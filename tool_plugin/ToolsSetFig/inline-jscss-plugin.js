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
      // templatePath 现在是相对于 webpack 配置所在目录的路径，需要解析为绝对路径
      // webpack 配置在 tool_plugin/ToolsSetFig 目录下，所以使用 __dirname
      const templateAbsolutePath = path.resolve(__dirname, this.templatePath);
      const outputDir = path.dirname(templateAbsolutePath); // 获取 test 目录的绝对路径
      const mainJsPath = path.join(outputDir, 'main.js');
      const mainCssPath = path.join(outputDir, 'style.css');
      const mainRunPath = path.join(outputDir, 'run.js');
      const mainDataPath = path.join(outputDir, 'data.js');

      // 读取 JS 和 CSS 内容
      let jsContent = '';
      let dataContent = '';
      let cssContent = '';
      let runContent = '';

      try {
        jsContent = fs.readFileSync(mainJsPath, 'utf-8');
        dataContent = fs.readFileSync(mainDataPath, 'utf-8');
        jsContent = jsContent.replace(/clear\*\//g,'')//注释掉非生产内容
      } catch (e) {
        console.warn('找不到 main.js 或 data.js');
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
      let html = fs.readFileSync(templateAbsolutePath, 'utf-8');

      // 替换占位符
      html = html
        .replace(/\.\.\/\.\.\/\.\./g,'https://cdn.jsdelivr.net.cn/gh/YNYU01/YNYU_SET@' + this.hash)
        .replace('<link rel="stylesheet" href="style.css">', `<style>\n${cssContent}\n</style>`)
        .replace('<script src="data.js"></script>', `<script>\n${dataContent}\n</script>`)
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

