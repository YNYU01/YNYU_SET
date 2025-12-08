// plugins/InlineJsCssPlugin.js
const fs = require('fs');
const path = require('path');

class InlineJsCssPlugin {
  constructor(options = {}) {
    this.templatePath = options.template;
    this.hash = options.hash;
    this.removeComments = options.removeComments !== false; // 默认启用清理注释
  }

  // 清理 JavaScript 注释（逐行处理，更可靠）
  removeJsComments(code) {
    if (!code) return code;
    
    // 先处理多行注释 /* */
    code = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
      // 保留多行注释中的换行符数量（至少保留一个）
      const newlines = (match.match(/\n/g) || []).length;
      return newlines > 0 ? '\n'.repeat(Math.min(newlines, 2)) : '';
    });
    
    // 按行分割处理
    const lines = code.split(/\r?\n/);
    const processedLines = [];
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      let line = lines[lineIndex];
      let result = '';
      let inString = false;
      let stringChar = '';
      let inRegex = false;
      let i = 0;
      
      // 检查是否是整行注释（行首或只有空白后是 //）
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('//')) {
        // 整行注释，跳过这一行，但保留换行符
        processedLines.push('');
        continue;
      }
      
      // 逐字符处理当前行，识别字符串、正则表达式和行末注释
      while (i < line.length) {
        const char = line[i];
        const nextChar = line[i + 1] || '';
        const prevChar = i > 0 ? line[i - 1] : '';
        
        // 处理字符串
        if (!inString && !inRegex && (char === '"' || char === "'" || char === '`')) {
          inString = true;
          stringChar = char;
          result += char;
          i++;
          continue;
        }
        
        if (inString) {
          // 处理转义字符
          if (char === '\\') {
            result += char + nextChar;
            i += 2;
            continue;
          }
          // 字符串结束
          if (char === stringChar) {
            inString = false;
            stringChar = '';
          }
          result += char;
          i++;
          continue;
        }
        
        // 处理正则表达式字面量
        if (!inString && !inRegex && char === '/') {
          // 检查是否是注释（// 或 /*）
          if (nextChar === '/' || nextChar === '*') {
            // 这是注释，处理注释
            if (nextChar === '/') {
              // 单行注释，删除从 // 到行尾的内容
              break;
            }
          } else {
            // 可能是正则表达式
            // 检查前面是否是可能开始正则表达式的字符
            const notRegexStarters = /[a-zA-Z0-9_$]/;
            if (nextChar === '\\' || !notRegexStarters.test(prevChar)) {
              inRegex = true;
              result += char;
              i++;
              continue;
            }
          }
        }
        
        if (inRegex) {
          // 处理正则表达式中的转义字符
          if (char === '\\') {
            result += char + nextChar;
            i += 2;
            continue;
          }
          // 正则表达式结束（找到未转义的 /）
          if (char === '/') {
            inRegex = false;
            result += char;
            i++;
            continue;
          }
          result += char;
          i++;
          continue;
        }
        
        // 处理单行注释 //
        if (char === '/' && nextChar === '/') {
          // 删除从 // 到行尾的内容
          break;
        }
        
        result += char;
        i++;
      }
      
      // 移除行末空白
      result = result.replace(/\s+$/, '');
      processedLines.push(result);
    }
    
    // 合并处理后的行
    let result = processedLines.join('\n');
    
    // 清理多余的空行（连续3个以上换行符替换为2个）
    result = result.replace(/\n{3,}/g, '\n\n');
    
    return result;
  }

  // 清理 CSS 注释
  removeCssComments(code) {
    if (!code) return code;
    
    // CSS 注释格式为 /* ... */
    return code.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('InlineJsCssPlugin', (compilation, callback) => {
      // 获取输出路径和文件名
      // templatePath 现在是相对于 webpack 配置所在目录的路径，需要解析为绝对路径
      // webpack 配置在 tool_plugin/ToolsSetFig 目录下，所以使用 __dirname
      const templateAbsolutePath = path.resolve(__dirname, this.templatePath);
      const outputDir = path.dirname(templateAbsolutePath); // 获取 test 目录的绝对路径
      const mainJsPath = path.join(outputDir, 'main.js');
      const mainUtilsJsPath = path.join(outputDir, 'main-utils.js');
      const mainFeaturesJsPath = path.join(outputDir, 'main-features.js');
      const mainAuthJsPath = path.join(outputDir, 'main-auth.js');
      const mainCssPath = path.join(outputDir, 'style.css');
      const mainRunPath = path.join(outputDir, 'run.js');
      const mainDataPath = path.join(outputDir, 'data.js');

      // 读取 JS 和 CSS 内容
      let jsContent = '';
      let jsUtilsContent = '';
      let jsFeaturesContent = '';
      let jsAuthContent = '';
      let dataContent = '';
      let cssContent = '';
      let runContent = '';

      try {
        jsContent = fs.readFileSync(mainJsPath, 'utf-8');
        dataContent = fs.readFileSync(mainDataPath, 'utf-8');
        jsContent = jsContent.replace(/clear\*\//g,'');
        // 清理注释
        if (this.removeComments) {
          jsContent = this.removeJsComments(jsContent);
          dataContent = this.removeJsComments(dataContent);
        }
      } catch (e) {
        console.warn('找不到 main.js 或 data.js');
      }

      try {
        jsUtilsContent = fs.readFileSync(mainUtilsJsPath, 'utf-8');
        // 清理注释
        if (this.removeComments) {
          jsUtilsContent = this.removeJsComments(jsUtilsContent);
        }
      } catch (e) {
        console.warn('找不到 main-utils.js（可选文件）');
      }

      try {
        jsFeaturesContent = fs.readFileSync(mainFeaturesJsPath, 'utf-8');
        // 清理注释
        if (this.removeComments) {
          jsFeaturesContent = this.removeJsComments(jsFeaturesContent);
        }
      } catch (e) {
        console.warn('找不到 main-features.js（可选文件）');
      }

      try {
        jsAuthContent = fs.readFileSync(mainAuthJsPath, 'utf-8');
        // 清理注释
        if (this.removeComments) {
          jsAuthContent = this.removeJsComments(jsAuthContent);
        }
      } catch (e) {
        console.warn('找不到 main-auth.js（可选文件）');
      }

      try {
        cssContent = fs.readFileSync(mainCssPath, 'utf-8');
        // 清理注释
        if (this.removeComments) {
          cssContent = this.removeCssComments(cssContent);
        }
      } catch (e) {
        console.warn('找不到 style.css');
      }

      try {
        runContent = fs.readFileSync(mainRunPath, 'utf-8');
        // 清理注释
        if (this.removeComments) {
          runContent = this.removeJsComments(runContent);
        }
      } catch (e) {
        console.warn('找不到 run.js');
      }

      // 读取 HTML 模板
      let html = fs.readFileSync(templateAbsolutePath, 'utf-8');

      // 替换占位符（注释已经在读取文件后清理过了）
      html = html
        .replace(/\.\.\/\.\.\/\.\./g,'https://cdn.jsdelivr.net.cn/gh/YNYU01/YNYU_SET@' + this.hash)
        .replace('<link rel="stylesheet" href="style.css">', `<style>\n${cssContent}\n</style>`)
        .replace('<script src="data.js"></script>', `<script>\n${dataContent}\n</script>`)
        .replace('<script src="main-utils.js"></script>', jsUtilsContent ? `<script>\n${jsUtilsContent}\n</script>` : '')
        .replace('<script src="main.js"></script>', `<script>\n${jsContent}\n</script>`)
        .replace('<script src="main-features.js"></script>', jsFeaturesContent ? `<script>\n${jsFeaturesContent}\n</script>` : '')
        .replace('<script src="main-auth.js"></script>', jsAuthContent ? `<script>\n${jsAuthContent}\n</script>` : '')
        .replace('<script src="run.js"></script>', `<script>\n${runContent}\n</script>`)
      
      // 写入新文件
      const outputPath = path.join(compilation.options.output.path, 'ui.html');
      fs.writeFileSync(outputPath, html);

      callback();
    });
  }
}

module.exports = InlineJsCssPlugin;

