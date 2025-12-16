/**
  * 『云即』系列开源计划
  * © 2024-2025 云雨 lvynyu@163.com；
  * 本项目遵循GPL3.0协议；
  * 本项目禁止用于违法行为，如有，与作者无关；
  * 商用及二次编辑需保留本项目的版权声明，且必须开源；
  * 代码中引用其他库的部分应遵循对应许可；
  * 使用当前代码时禁止删除或修改本声明；
  * 
  * [YNYU_SET] OPEN DESIGN & SOURCE
  * © 2024-2025 YNYU lvynyu2@gmail.com;
  * Must comply with GNU GENERAL PUBLIC LICENSE Version 3;
  * Prohibit the use of this project for illegal activities. If such behavior occurs, it is not related to this project;
  * For commercial use or secondary editing, it is necessary to retain the copyright statement of this project and must continue to open source it;
  * For external libraries referenced in the project, it is necessary to comply with the corresponding open source protocols;
  * When using the code of this project, it is prohibited to delete this statement;
*/
function TOOL_JS() {}

Object.assign(TOOL_JS.prototype, {
  /**
   * Base64转Uint8Array
   * @param {string} b64 - Base64字符串
   * @returns {Uint8Array} Uint8Array
   */
  B64ToU8A(b64) {
    let padding = '='.repeat((4 - b64.length % 4) % 4);
    let base64 = (b64 + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    let rawData = atob(base64);
    let rawDataLength = rawData.length;
    let array = new Uint8Array(new ArrayBuffer(rawDataLength));

    for (let i = 0; i < rawDataLength; i += 1) {
      array[i] = rawData.charCodeAt(i);
    }

    return array;
  },

  /**
   * Uint8Array转Base64
   * @param {Uint8Array} u8 - Uint8Array
   * @param {string} type - 文件类型
   * @returns {string} Base64字符串
   */
  U8AToB64(u8, type) {
    let filetype = {
      doc: "data:application/msword;base64,",
      docx: "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
      xls: "data:application/vnd.ms-excel;base64,",
      xlsx: "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
      pdf: "data:application/pdf;base64,",
      ppt: "data:application/vnd.ms-powerpoint;base64,",
      pptx: "data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,",
      txt: "data:text/plain;base64,",
      png: "data:image/png;base64,",
      jpg: "data:image/jpeg;base64,",
      jpeg: "data:image/jpeg;base64,",
      gif: "data:image/gif;base64,",
      svg: "data:image/svg+xml;base64,",
      ico: "data:image/x-icon;base64,",
      bmp: "data:image/bmp;base64,",
    }
    let binaryString = '';
    for (let i = 0; i < u8.length; i++) {
      binaryString += String.fromCharCode(u8[i]);
    }
    // 对二进制字符串进行base64编码
    let base64 = btoa(binaryString);
    base64 = type && filetype[type.toLowerCase()] ? filetype[type.toLowerCase()] + base64 : base64;
    return base64;
  },

  /**
   * Canvas转Uint8Array
   * @param {HTMLCanvasElement} canvas - Canvas元素
   * @returns {Uint8Array} Uint8Array
   */
  CanvasToU8A(canvas) {
    let dataUrl = canvas.toDataURL('image/png');
    return new Uint8Array(this.B64ToU8A(dataUrl.split(',')[1]));
  },

  /**
   * 中英文字数限制兼容
   * @param {string} text - 文本
   * @param {number} max - 最大长度
   * @param {string} add - 添加的字符
   * @returns {string} 处理后的文本
   */
  TextMaxLength(text, max, add) {
    let newtext = text.toString();
    add = add ? add : '';
    let lengthE = newtext.replace(/[\u4e00-\u9fa5]/g, '').length * 1;
    let lengthZ = newtext.replace(/[^\u4e00-\u9fa5]/g, '').length * 2;
    if (lengthZ > lengthE) {
      if ((lengthE + lengthZ) > max) {
        newtext = newtext.substring(0, (max / 2 + 1)) + add;
      }
    } else {
      if ((lengthE + lengthZ) > max) {
        newtext = newtext.substring(0, (max + 1)) + add;
      }
    }
    return newtext;
  },

  /**
   * 裁切图片
   * @param {HTMLImageElement} image - 图片元素
   * @param {number} mix - 裁切倍率
   * @returns {Promise<Array>} 裁切后的图片信息
   */
  CUT_IMAGE(image, mix) {
    return new Promise((resolve, reject) => {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      requestAnimationFrame(() => {
        // 绘制图片
        ctx.drawImage(image, 0, 0);
        let cutAreas = this.CUT_AREA({ w: canvas.width, h: canvas.height, x: 0, y: 0, s: 1 }, mix | 4096);
        // 检查图片是否完全绘制
        if (image.complete) {
          let cuts = [];
          for (let i = 0; i < cutAreas.length; i++) {
            let canvas2 = document.createElement("canvas");
            let w = cutAreas[i].w;
            let h = cutAreas[i].h;
            let x = cutAreas[i].x;
            let y = cutAreas[i].y;
            canvas2.width = w;
            canvas2.height = h;
            let ctx2 = canvas2.getContext("2d");
            ctx2.drawImage(canvas, x, y, w, h, 0, 0, w, h);
            let imgData = this.CanvasToU8A(canvas2);
            cuts.push({ img: imgData, w: w, h: h, x: x, y: y });
            if (i == cutAreas.length - 1) {
              resolve(cuts);
            }
          }
        }
      });
    });
  },

  /**
   * 均匀裁切方案，可用于瓦片切图和长图分割
   * @param { object } info - {w:,h:,x:,y:,s:}原始宽高、坐标(如有)、栅格化倍率(如有)
   * @param { number } mix - 4096 | 2048 | 1024
   * @returns {Array} 裁切区域
   */
  CUT_AREA(info, mix) {
    let W = info.w, H = info.h;//图片宽高
    let Ws = info.w, Hs = info.h;//非尾部的裁剪宽高
    let lastWs = info.w, lastHs = info.h;//尾部的裁剪宽高
    let X = info.x || 0, Y = info.y || 0;//裁切区坐标
    let cutW = 1, cutH = 1;//纵横裁剪数量
    let cutAreas = [];//从左到右，从上到下记录的裁切区域集
    let s = info.s || 1;
    mix = mix || 4096
    let isCut = (W * info.s > mix || H * info.s > mix);//不超过最大尺寸的不裁切
    if (!isCut) {
      return [{ w: W, h: H, x: X, y: Y, s: s }];
    } else {
      cutW = Math.ceil((W * info.s) / mix);
      cutH = Math.ceil((H * info.s) / mix);
      Ws = Math.ceil(W / cutW);
      Hs = Math.ceil(H / cutH);
      lastWs = W - (Ws * (cutW - 1));//有小数点则向上取整，最后一截短一些
      lastHs = H - (Hs * (cutH - 1));

      for (let i = 0; i < (cutW * cutH); i++) {
        if ((i + 1) % cutW == 0 && i !== (cutW * cutH) - 1 && i !== 0) {
          cutAreas.push({ w: lastWs, h: Hs, x: X, y: Y, s: s });
          Y = Y + Hs;
          X = info.x;
        } else if (i == (cutW * cutH) - 1) {
          cutAreas.push({ w: lastWs, h: lastHs, x: X, y: Y, s: s });
        } else {
          if (i > (cutW * (cutH - 1)) - 1) {
            cutAreas.push({ w: Ws, h: lastHs, x: X, y: Y, s: s });
          } else {
            cutAreas.push({ w: Ws, h: Hs, x: X, y: Y, s: s });
          }
          if (cutW == 1) {
            X = info.x;
            Y = Y + Hs;
          } else {
            X = X + Ws;
          }
        }
      }

      return cutAreas;
    }
  },

  /**
   * 检查图片格式（支持更多如webp, jfif等）
   * @param {File} file - 文件
   * @returns {Promise<string>} 图片格式
   */
  TrueImageFormat(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function (e) {
        let arrayBuf = new Uint8Array(e.target.result);
        // 检查各种常见图片格式魔数
        // JPEG
        if (arrayBuf[0] === 0xFF && arrayBuf[1] === 0xD8 && arrayBuf[2] === 0xFF) {
          // 进一步判断JFIF或EXIF (JFIF标注在APP0段，EXIF标注在APP1)
          if (arrayBuf[6] === 0x4A && arrayBuf[7] === 0x46 && arrayBuf[8] === 0x49 && arrayBuf[9] === 0x46) {
            // 'JFIF'
            resolve('jfif');
          } else if (arrayBuf[6] === 0x45 && arrayBuf[7] === 0x78 && arrayBuf[8] === 0x69 && arrayBuf[9] === 0x66) {
            // 'Exif'
            resolve('jpeg');
          } else {
            resolve('jpeg');
          }
        }
        // PNG
        else if (arrayBuf[0] === 0x89 && arrayBuf[1] === 0x50 && arrayBuf[2] === 0x4E && arrayBuf[3] === 0x47) {
          resolve('png');
        }
        // GIF
        else if (arrayBuf[0] === 0x47 && arrayBuf[1] === 0x49 && arrayBuf[2] === 0x46 && arrayBuf[3] === 0x38) {
          resolve('gif');
        }
        // BMP
        else if (arrayBuf[0] === 0x42 && arrayBuf[1] === 0x4D) {
          resolve('bmp');
        }
        // WEBP
        else if (
          arrayBuf[0] === 0x52 && arrayBuf[1] === 0x49 && arrayBuf[2] === 0x46 && arrayBuf[3] === 0x46 &&
          arrayBuf[8] === 0x57 && arrayBuf[9] === 0x45 && arrayBuf[10] === 0x42 && arrayBuf[11] === 0x50
        ) {
          resolve('webp');
        }
        // TIFF
        else if (
          (arrayBuf[0] === 0x49 && arrayBuf[1] === 0x49 && arrayBuf[2] === 0x2A && arrayBuf[3] === 0x00) ||
          (arrayBuf[0] === 0x4D && arrayBuf[1] === 0x4D && arrayBuf[2] === 0x00 && arrayBuf[3] === 0x2A)
        ) {
          resolve('tiff');
        }
        // ICO (icon)
        else if (
          arrayBuf[0] === 0x00 && arrayBuf[1] === 0x00 &&
          arrayBuf[2] === 0x01 && arrayBuf[3] === 0x00
        ) {
          resolve('ico');
        }
        // SVG (前面部分是ASCII) 粗略判断
        else if (
          (String.fromCharCode(...arrayBuf.slice(0, 100)).toLowerCase().includes('<svg'))
        ) {
          resolve('svg');
        }
        // APNG (特殊PNG)
        else if (
          arrayBuf[0] === 0x89 && arrayBuf[1] === 0x50 &&
          arrayBuf[2] === 0x4E && arrayBuf[3] === 0x47 &&
          String.fromCharCode(...arrayBuf.slice(12, 16)) === 'acTL'
        ) {
          resolve('apng');
        }
        // HEIC/HEIF
        else if (
          arrayBuf[4] === 0x66 && arrayBuf[5] === 0x74 && arrayBuf[6] === 0x79 && arrayBuf[7] === 0x70 &&
          // 支持ftyp: heic, heix, hevc, mif1, msf1, etc
          (
            String.fromCharCode(arrayBuf[8], arrayBuf[9], arrayBuf[10], arrayBuf[11]).includes("heic") ||
            String.fromCharCode(arrayBuf[8], arrayBuf[9], arrayBuf[10], arrayBuf[11]).includes("heix") ||
            String.fromCharCode(arrayBuf[8], arrayBuf[9], arrayBuf[10], arrayBuf[11]).includes("hevc") ||
            String.fromCharCode(arrayBuf[8], arrayBuf[9], arrayBuf[10], arrayBuf[11]).includes("mif1") ||
            String.fromCharCode(arrayBuf[8], arrayBuf[9], arrayBuf[10], arrayBuf[11]).includes("msf1")
          )
        ) {
          resolve('heic');
        }
        // CUR (cursor)
        else if (
          arrayBuf[0] === 0x00 && arrayBuf[1] === 0x00 &&
          arrayBuf[2] === 0x02 && arrayBuf[3] === 0x00
        ) {
          resolve('cur');
        }
        // PSD
        else if (
          arrayBuf[0] === 0x38 && arrayBuf[1] === 0x42 && arrayBuf[2] === 0x50 && arrayBuf[3] === 0x53
        ) {
          resolve('psd');
        }
        // EMF
        else if (
          arrayBuf[0] === 0x01 && arrayBuf[1] === 0x00 &&
          arrayBuf[2] === 0x00 && arrayBuf[3] === 0x00 &&
          arrayBuf[40] === 0x20 && arrayBuf[41] === 0x45 && arrayBuf[42] === 0x4D && arrayBuf[43] === 0x46
        ) {
          resolve('emf');
        }
        // TGA
        else if (
          arrayBuf.length > 18 && arrayBuf[1] <= 1 && [1, 2, 3, 9, 10, 11].includes(arrayBuf[2])
        ) {
          resolve('tga');
        }
        else {
          reject(new Error('Unknown or unsupported image format'));
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  },

  /**
   * 将md格式文案转为节点式对象，以便转为图层
   * @param {string} mdText - md格式文案
   * @param {string} createname - 创建名称
   * @returns {Array}[{zytype:'md',nodes:[
   * {
   * type: h | p | code | ul | ol | table | hr | blockquote | br | image ...,
   * content: string | [{style:'normal' | 'bold' | 'italic' | 'strike', content: ...}]
   * items?:[{content:...}]
   * }
   * ]}]
   */
  MdToObj(mdText, createname) {
  let ast = [];
  let listStack = [];
  let inlineElements = {
    bold: { pattern: /\*\*(.*?)\*\*/g, style: 'bold' },
    italic: { pattern: /\*(.*?)\*/g, style: 'italic' },
    code: { pattern: /```(.*?)```/g, style: 'code' },
    strike: { pattern: /~~(.*?)~~/g, style: 'strike' },
    link: { pattern: /\[([^\]]*)\]\(([^)]*)\s*("([^"]*)")?\)/g, style: 'link' },
    link2: { pattern: /\[([^\]]*)\]\(([^)]*)\s*("([^"]*)")?\)\s*\{([^}]*)?\}/g, style: 'link' },
  };
  let alignment = null;
  let srcregex = /\[([^\]]*)\]\(([^)]*)\s*("([^"]*)")?\)/;
  let imageregex = /!\[([^\]]*)\]\(([^)]*)\s*("([^"]*)")?\)/;
  let lines = mdText.split('\n').map(item => item.trimEnd());
  let inCodeBlock = false;
  let currentCodeBlock = null;
  let currentTable = null;
  let currentQuote = null;
  createname = createname ? createname : '@MD_NODE';

  lines.forEach((line,index) => {

    if (line.trim() === "") {
      if (currentCodeBlock) {
        currentCodeBlock.content.push(""); // 空行也保留在代码块内容中
        return;
      } else {
        ast.push({type: "br"});
        return;
      };
    };

    //缩进量
    let indent = line.match(/^(\s*)/)[0].length / 2;

    // 代码块处理
    if (line.trim().startsWith('```') && line.trim().split('```').length > 1) {
      inCodeBlock = true;
      if (!currentCodeBlock) {
        currentCodeBlock = {
          type: 'code',
          indent: indent,
          language: line.slice(3).trim().replace(/\`/g,''),
          content: [],
        };
        ast.push(currentCodeBlock);
      } else {
        currentCodeBlock = null;
      }
      return;
    } else if(currentCodeBlock){
      // 保留每行的缩进，去掉末尾空格
      let codeLine = line.replace(/\s+$/,"");
      currentCodeBlock.content.push(codeLine);
      if(line.trim() == '```'){
        currentCodeBlock = null;
        inCodeBlock = false;
      };
      return;
    };

    // 表格处理
    if (line.includes('|') && line.split('|').length > 2) {
      if (!currentTable) {
        currentTable = {
          type: 'table',
          indent: indent,
          alignment: null,
          rows: [],
        };
        ast.push(currentTable);
      };
      let cells = line.split('|').map(cell => {
        if(cell.includes('<br>')){
          //let ul = cell.trim().match(/^[-*]\s+(.*)/);
          let ol = cell.trim().match(/^(\d+)\.\s+(.*)/);
          let items = cell.trim().split('<br>');
          items = items.map(item => {
            let content = parseInline(item);
            if(typeof content == 'string'){
              content = content.replace('- ','');
            } else {
              content.forEach(item => {
                item.content = item.content.replace('- ','');
              })
            }
            return {
              content: content,
              linum: ol ? item.trim().split('.')[0] : null,
              }
          })
          return {
            type: ol ? 'ol' : 'ul',
            items: items,
          }
        }else if(cell.match(imageregex)){
          let imageMatch = cell.match(imageregex);
          return {
            type: 'image',
            alt: imageMatch[1],
            src: imageMatch[2],
          }
        }else{
          return parseInline(cell.trim());
        }
      });
      cells = cells.slice(1,-1);
      if(line.trim().replace(/[-:|]/g,'') == ''){
        alignment = line.split('|').map(ali => {
          if((ali.includes(':-') && ali.includes('-:')) || (ali.includes('-') && ali.replace(/-/g,'') == '')) return 'center';
          if(ali.includes(':-')) return 'left';
          if(ali.includes('-:')) return 'right';
          return null;
        });
        alignment = alignment.slice(1,-1);
        currentTable.alignment = alignment;
        return;
      }
      currentTable.rows.push(cells);
      return;
    } else if (currentTable) {
      currentTable = null;
      alignment = null;
    }

    // 分割线处理（horizontal rule）
    let hrMatch = line.trim().match(/^(-{3,}|\*{3,}|_{3,})$/);
    if (hrMatch) {
      ast.push({ type: 'hr' });
      return;
    }

    // 引用处理
    let quoteMatch = line.match(/^>\s*(.*)/);
    if (quoteMatch) {
      if (!currentQuote) {
        currentQuote = { type: 'blockquote', content: [] };
        ast.push(currentQuote);
      }
      // 解析引用内容中的内联元素（加粗、斜体等）
      let processedContent = parseInline(quoteMatch[1]);
      currentQuote.content = processedContent;
      return;
    } else if (currentQuote) {
      currentQuote = null;
    }

    // 列表处理
    let ulMatch = line.trim().match(/^[-*]\s+(.*)/);
    let olMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    
    if (ulMatch || olMatch) {
      let linum = olMatch ? line.trim().split('.')[0] : null;

      let listType = ulMatch ? 'ul' : 'ol';
      let content = ulMatch ? parseInline(ulMatch[1]) : parseInline(olMatch[2]);
      
      if(listStack[listStack.length-1] && indent !== listStack[listStack.length-1].indent){
        listStack.pop();
      }

      if (listStack.length === 0 || listStack[listStack.length-1].type !== listType) {
        
        let newList = { 
          type: listType, 
          indent: indent,
          items: [{ content, linum: linum }],
          depth: listStack.length
        };
        if (listStack.length === 0) {
          ast.push(newList);
        } else {
          let parent = listStack[listStack.length-1];
          if (!parent.items) parent.items = [];
          parent.items.push(newList);
        }
        listStack.push(newList);
      } else {
        let currentList = listStack[listStack.length-1];
        currentList.items.push({ content, linum: linum });
      }
      return;
    } else if (listStack.length > 0) {
      listStack = [];
    }

    // 标题处理
    let headingMatch = line.match(/^(#+)\s*(.*)/);
    if (headingMatch) {
      let processedContent = parseInline(headingMatch[2]);
      ast.push({
        type: `h${headingMatch[1].length}`,
        content: processedContent
      });
      return;
    }

    // 图片处理
    let imageMatch = line.match(imageregex);
    if (imageMatch) {
      ast.push({
        type: 'image',
        alt: imageMatch[1],
        src: imageMatch[2],
      });
      return;
    }

    srcregex
    

    // 段落处理
    if (line.trim() && !inCodeBlock) {
      let processedContent = parseInline(line);
      ast.push({
        type: 'p',
        content: processedContent
      });
    }
  });

  // 解析内联元素（递归处理嵌套）
  function parseInline(text) {
    if (!text) return '';
    if (text.match(/`(.*?)`/) && !text.match(/```(.*?)```/))  return text.replace(/\`/g,'\'').substring(0,text.length - 2);
    
    let segments = [];
    let remainingText = text;
    
    // 按优先级处理内联元素
    let processPattern = (element) => {
      let matches = [...remainingText.matchAll(element.pattern)];
      if (matches.length === 0) return false;

      let match = matches[0];
      let beforeText = remainingText.slice(0, match.index);
      
      if (beforeText) {
        segments.push({ style: 'normal', content: beforeText });
      }
      if(element.style == 'link'){
        segments.push({ 
          style: element.style, 
          content: [match[1],match[2]]
        });
      }else{
        if (match[1] == `{target="_blank"}`) return;
        segments.push({ 
          style: element.style, 
          content: parseInline(match[1]) // 递归处理嵌套
        });
      }
      
      remainingText = remainingText.slice(match.index + match[0].length);
      return true;
    };

    while (true) {
      let found = false;
      
      // 处理顺序： 代码 > 加粗 > 斜体 > 删除线 > 超链接
      found = found || processPattern(inlineElements.code);
      found = found || processPattern(inlineElements.bold);
      found = found || processPattern(inlineElements.italic);
      found = found || processPattern(inlineElements.strike);
      found = found || processPattern(inlineElements.link2);
      found = found || processPattern(inlineElements.link);
      
      if (!found) break;
    }
    
    if (remainingText) {
      segments.push({ style: 'normal', content: remainingText });
    }
    
    return segments.length === 1 && segments[0].style === 'normal' 
      ? segments[0].content 
      : segments;
  };
//log(ast)
  return { zyType: 'md', zyName: createname, nodes: ast };
  },

  /**
   * 将svg文本转为节点式对象，以便转为图层
   * @param {string} svgText - svg文本
   * @param {string} createname - 创建名称
   * @returns {Object} {zytype:'svg',nodes:[
   * {
   * type: 'image',
   * alt: string,
   * src: string,
   * }
   * ]}
   */
  async SvgToObj(svgText, createname) {
    const self = this;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgRoot = svgDoc.documentElement;
    const allUses = Array.from(svgRoot.querySelectorAll('use'));
    const allRects = Array.from(svgRoot.querySelectorAll('rect'));
    const allClips = Array.from(svgRoot.querySelectorAll('clipPath'));
    const allMasks = Array.from(svgRoot.querySelectorAll('mask'));
    createname = createname ? createname : '@SVG_NODE'
    try {
      const images = await traverse(svgRoot);
      //console.log('Found images:', images);
      //log({zyType: 'svg', zyName: createname, nodes: images})
      return {zyType: 'svg', zyName: createname, nodes: images};
    } catch (error) {
      console.error('Error processing SVG:', error);
      return { zyType: null, zyName: null, nodes: null };
    };

    function GetAttributes(node) {
    if(!node.attributes) return null;
    return Array.from(node.attributes).reduce((obj, attr) => {
      obj[attr.name] = attr.value;
      return obj;
    }, {})
  };

  async function traverse(node) {
    return new Promise(async (resolve) => {
      let results = [];
      // 检查当前节点
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName.toLowerCase() === 'image') {
          let attributes = GetAttributes(node);

          let uses = allUses.filter(item =>
             item.getAttribute('href') == '#' + attributes.id || item.getAttribute('xlink:href') == '#' + attributes.id
             )
          let rects = []
          uses.forEach(use => {
            let p = use.parentNode
            let rect = allRects.find(item => item.getAttribute('fill') == `url(#${p.id})`);
            let g = rect.parentNode;
            let clipid = g ? g.getAttribute('clip-path') ? g.getAttribute('clip-path').split('#')[1].replace(')','') : null : null;
            let clip = clipid ? allClips.find(item => item.getAttribute('id') == clipid) : null;
            let maskid = g ? g.getAttribute('mask') ? g.getAttribute('mask').split('#')[1].replace(')','') : null : null;
            let mask = maskid ? allMasks.find(item => item.getAttribute('id') == maskid) : null;
            let att =  GetAttributes(rect);
            let transform = null;
            if(use && use.getAttribute('transform')){
              transform = use.getAttribute('transform')
            }
            rects.push({
              ...att,
              transform:transform,
              clip:clip ? Array.from(clip.children).map(item => { return {type:item.tagName,...GetAttributes(item)}}) : null,
              mask:mask ? Array.from(mask.children).map(item => { return {type:item.tagName,...GetAttributes(item)}}) : null,
            });
          });
          attributes['rects'] = rects.length > 0 ? rects : null;
          [attributes.width,attributes.height] = [attributes.width.replace('px','') * 1, attributes.height.replace('px','') * 1]
          if(attributes.x && typeof attributes.x == 'string'){
            attributes.x = attributes.x.replace('px','') * 1
          }
          if(attributes.y && typeof attributes.y == 'string'){
            attributes.y = attributes.y.replace('px','') * 1
          }
          let imgPromise = (attributes)=>{
            if(attributes.width <= 4096 && attributes.height <= 4096) {
              let b64data;
              if(attributes['xlink:href']){
                b64data = attributes['xlink:href'].split(',')[1]
              }
              if(attributes['href']){
                b64data = attributes['href'].split(',')[1]
              }
              return {
                attributes,
                cuts: {
                  img: self.B64ToU8A(b64data),
                  w: attributes.width,
                  h: attributes.height,
                  x: 0,
                  y: 0,
                }
              };
            }
            return new Promise((resolveImg) => {
              let img = new Image();
              img.src = attributes["xlink:href"] || attributes.href;;
              img.onload = async () => {
                try {
                  let cuts = await self.CUT_IMAGE(img)
                  resolveImg({ attributes, cuts: cuts })
                } catch {
                  resolveImg({ attributes, cuts: null });
                }
              };
              img.onerror = () => resolveImg(null);
            }
          )};
          results.push(await imgPromise(attributes));
        };
      };
      // 处理子节点
      const childPromises = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        childPromises.push(traverse(node.childNodes[i]));
      }
  
      Promise.all(childPromises).then(childResults => {
        resolve(results.concat(...childResults));
      });
    });
  }
  },

/**==========压缩图片模块==========
!!! 需引入依赖：UPNG.js + jszip.js
!!! 传入的必须是可编辑的图片信息数组，压缩会返回一个数据缓存，避免重复执行压缩
*/

/**
 * 批量压缩图片并导出为zip
 * @param {function} callback - 压缩回调
 * @param {boolean} isFinal - 是否最后一条数据，方便判断压缩并导出的时机
 * @param {string} zipName - 压缩包名称
 * @param {[object]} imgExportData - 图片导出数据
 * [{
 *    fileName:string,
 *    id:string,
 *    format:string,
 *    u8a: Uitt8Array,
 *    finalSize:number,
 *    width: number,
 *    height: number,
 *    compressed:null | string,
 *    realSize: number,
 *    quality: 0-10,
 *  }]
 * @param {[boolean]} isFinal - 补充信息，是否压缩并导出，需对齐imgExportData的下标
 */
  async ExportImgByData(callback, imgExportData, isFinal, zipName) {
    if (imgExportData.length > 0) {
      try {
        // 统一调用压缩方法
        const compressedImages = await this.CompressImages(callback, imgExportData, isFinal);
        
        // 如果只有1个文件，直接下载，不打包为 zip
        if (imgExportData.length === 1) {
          const imgData = imgExportData[0];
          const blob = compressedImages[0];
          if (blob) {
            const fileName = (imgData.fileName && imgData.fileName.trim()) || 'image';
            const format = imgData.format.toLowerCase();
            const timeName = getDate('YYYYMMDD')[0].slice(2) + '_' + getTime('HHMMSS')[0];
            saveAs(blob, fileName + '_' + timeName + '.' + format);
          }
        } else {
          // 多个文件时，打包为 zip
          this.CreateZipAndDownload(compressedImages, imgExportData, zipName);
        }
      } catch (error) {
        console.error('处理过程中发生错误:', error);
      }
    }
  },

  /**
   * 单个图片的压缩
   * @param {Blob} blob - 传入一个png文件的blob，
   * @param {number} quality - 压缩质量 1~10
   * @param {string} type -输出的格式 png | jpg | jpeg | webp
   */
  CompressImage(blob, quality, type) {
    if (type == 'jpg' || type == 'jpeg'){
      return new Promise((resolve, reject) => {
        let url = URL.createObjectURL(blob);
        let img = new Image();
        img.src = url;
        img.onload = function(){
          let canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          let ctx = canvas.getContext('2d')
          ctx.drawImage(img,0,0)
          canvas.toBlob(function(blob){
            let file = new File([blob],'image.jpg',{type:'image/jpeg'});
            new Compressor(file, {
              quality:quality/10,
              success(result) {
                resolve(result);
              },
              error(err) {
                reject(err);
              },
            });
          },'image/jpeg',(quality/10));
        };
        
      });
    } else if ( type == 'png') {
      return new Promise((resolve, reject) => {
        if(quality == 10){
          resolve(blob)
        } else {
          let url = URL.createObjectURL(blob);
          let img = new Image()
          img.src = url;

          img.onload = function(){
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img,0,0)
            let imageData = ctx.getImageData(0,0,img.width,img.height);
            let data = imageData.data;
            
            let depth = 256
            if(quality <= 4){
              depth = 128;
            };
            let diff = ditherColor(data, img.width, img.height).pixels
            let diffimg = new Blob([UPNG.encode([diff.buffer], img.width, img.height,quality*depth)],{type: 'image/png'})

            // dither with stucki dithering algorithm 
            // https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html#stucki-dithering
            //单色
            function calculateLightness(r, g, b){
              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              return (max + min) / 2;
            };
            function dither(pixels, imageWidth, imageHeight){
              const ditheredPixels = pixels//.slice().fill(255);
              // add 2 to beginning and end so we don't need to do bounds checks
              const errorDiffusionWidth = imageWidth + 4;
              const errorBuffer = new ArrayBuffer(errorDiffusionWidth * 3 * 4);
              let errorRow1 = new Float32Array(errorBuffer, 0, errorDiffusionWidth);
              let errorRow2 = new Float32Array(errorBuffer, errorDiffusionWidth * 4, errorDiffusionWidth);
              let errorRow3 = new Float32Array(errorBuffer, errorDiffusionWidth * 8, errorDiffusionWidth);
          
              const startTime = performance.now();
              for(let y=0,pixelIndex=0; y<imageHeight; y++){
                  for(let x=0,errorIndex=2;x<imageWidth;x++,pixelIndex+=4,errorIndex++){
                      const storedError = errorRow1[errorIndex];
                      const lightness = calculateLightness(pixels[pixelIndex], pixels[pixelIndex+1], pixels[pixelIndex+2]);
                      const adjustedLightness = storedError + lightness;
                      const outputValue = adjustedLightness > 127 ? 255 : 0;
          
                      ditheredPixels[pixelIndex] = outputValue;
                      ditheredPixels[pixelIndex+1] = outputValue;
                      ditheredPixels[pixelIndex+2] = outputValue;
          
                      let errorFraction = (adjustedLightness - outputValue) / 42;
                      const errorFraction2 =  errorFraction * 2;
                      const errorFraction4 =  errorFraction * 4;
                      const errorFraction8 =  errorFraction * 8;
          
                      errorRow1[errorIndex+1] += errorFraction8;
                      errorRow1[errorIndex+2] += errorFraction4;
          
                      errorRow2[errorIndex-2] += errorFraction2;
                      errorRow2[errorIndex-1] += errorFraction4;
                      errorRow2[errorIndex] += errorFraction8;
                      errorRow2[errorIndex+1] += errorFraction4;
                      errorRow2[errorIndex+2] += errorFraction2;
          
                      errorRow3[errorIndex-2] += errorFraction;
                      errorRow3[errorIndex-1] += errorFraction2;
                      errorRow3[errorIndex] += errorFraction4;
                      errorRow3[errorIndex+1] += errorFraction2;
                      errorRow3[errorIndex+2] += errorFraction;
                  }
                  errorRow1.fill(0);
                  const temp = errorRow1;
                  errorRow1 = errorRow2;
                  errorRow2 = errorRow3;
                  errorRow3 = temp;
              };
              const timeElapsed = (performance.now() - startTime) / 1000;
              return {
                  pixels: ditheredPixels,
                  timeElapsed,
              };
            };
            //彩色
            function ditherColor(pixels, imageWidth, imageHeight) {
              let ditheredPixels = new Uint8ClampedArray(pixels); // 复制像素
              let levels = quality * 25; // 每通道量化级别，例如 4 表示 0, 85, 170, 255
              let step = 255 / levels;
          
              // 误差缓冲区（每行 +4 避免边界检查）
              let errorDiffusionWidth = imageWidth + 4;
              let bufferLength = errorDiffusionWidth * 3; // R, G, B 各一行
              let errorBuffer = new ArrayBuffer(bufferLength * 4 * 3); // 3 行 × 3 通道 × Float32
          
              // 每个通道的三行误差（当前行 + 下两行）
              let er1R = new Float32Array(errorBuffer, 0, errorDiffusionWidth);
              let er1G = new Float32Array(errorBuffer, errorDiffusionWidth * 4, errorDiffusionWidth);
              let er1B = new Float32Array(errorBuffer, errorDiffusionWidth * 8, errorDiffusionWidth);
          
              let er2R = new Float32Array(errorBuffer, errorDiffusionWidth * 12, errorDiffusionWidth);
              let er2G = new Float32Array(errorBuffer, errorDiffusionWidth * 16, errorDiffusionWidth);
              let er2B = new Float32Array(errorBuffer, errorDiffusionWidth * 20, errorDiffusionWidth);
          
              let er3R = new Float32Array(errorBuffer, errorDiffusionWidth * 24, errorDiffusionWidth);
              let er3G = new Float32Array(errorBuffer, errorDiffusionWidth * 28, errorDiffusionWidth);
              let er3B = new Float32Array(errorBuffer, errorDiffusionWidth * 32, errorDiffusionWidth);
          
              let startTime = performance.now();
          
              for (let y = 0, pixelIndex = 0; y < imageHeight; y++) {
                  // 清除上上行误差（复用为下下行）
                  er3R.fill(0);
                  er3G.fill(0);
                  er3B.fill(0);
          
                  for (let x = 0, errorIndex = 2; x < imageWidth; x++, pixelIndex += 4, errorIndex++) {
                    let r = pixels[pixelIndex];
                    let g = pixels[pixelIndex + 1];
                    let b = pixels[pixelIndex + 2];
          
                    // 获取累积误差
                    let errR = er1R[errorIndex];
                    let errG = er1G[errorIndex];
                    let errB = er1B[errorIndex];
        
                    // 加上误差后的值
                    let rAdj = r + errR;
                    let gAdj = g + errG;
                    let bAdj = b + errB;
        
                    // 限制范围
                    rAdj = Math.max(0, Math.min(255, rAdj));
                    gAdj = Math.max(0, Math.min(255, gAdj));
                    bAdj = Math.max(0, Math.min(255, bAdj));
        
                    // 量化：映射到有限颜色级别
                    let rOut = Math.round(rAdj / step) * step;
                    let gOut = Math.round(gAdj / step) * step;
                    let bOut = Math.round(bAdj / step) * step;
        
                    // 保存结果
                    ditheredPixels[pixelIndex] = rOut;
                    ditheredPixels[pixelIndex + 1] = gOut;
                    ditheredPixels[pixelIndex + 2] = bOut;
        
                    // 计算误差
                    let rErr = rAdj - rOut;
                    let gErr = gAdj - gOut;
                    let bErr = bAdj - bOut;
        
                    // Floyd-Steinberg 矩阵扩散 (1/16)
                    let rErr7 = rErr * 7/16, gErr7 = gErr * 7/16, bErr7 = bErr * 7/16;
                    let rErr3 = rErr * 3/16, gErr3 = gErr * 3/16, bErr3 = bErr * 3/16;
                    let rErr5 = rErr * 5/16, gErr5 = gErr * 5/16, bErr5 = bErr * 5/16;
                    let rErr1 = rErr * 1/16, gErr1 = gErr * 1/16, bErr1 = bErr * 1/16;
        
                    // 右
                    er1R[errorIndex + 1] += rErr7;
                    er1G[errorIndex + 1] += gErr7;
                    er1B[errorIndex + 1] += bErr7;
        
                    // 左下
                    er2R[errorIndex - 1] += rErr3;
                    er2G[errorIndex - 1] += gErr3;
                    er2B[errorIndex - 1] += bErr3;
        
                    // 正下
                    er2R[errorIndex] += rErr5;
                    er2G[errorIndex] += gErr5;
                    er2B[errorIndex] += bErr5;
        
                    // 右下
                    er2R[errorIndex + 1] += rErr1;
                    er2G[errorIndex + 1] += gErr1;
                    er2B[errorIndex + 1] += bErr1;
                  }
          
                  // 移动误差行：上移一行
                  [er1R, er1G, er1B] = [er2R, er2G, er2B];
                  [er2R, er2G, er2B] = [er3R, er3G, er3B];
                  [er3R, er3G, er3B] = [er1R, er1G, er1B]; // 重用（实际会被 fill(0)）
              }
          
              let timeElapsed = (performance.now() - startTime) / 1000;
              return {
                  pixels: ditheredPixels,
                  timeElapsed,
              };
            }
            
            resolve(diffimg)
          };
        };
        
      });
    } else if ( type == 'webp') {
      return new Promise((resolve, reject) => {
        let url = URL.createObjectURL(blob);
        let img = new Image()
        img.src = url;

        img.onload = function(){
          let canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          let ctx = canvas.getContext('2d')
          ctx.drawImage(img,0,0)
          canvas.toBlob(function(blob){
            resolve(blob)
          },'image/webp',(quality/10))
        };
      });
    }
  },

  /**
   * 批量压缩
   * @param {[object]} imgExportData
   * [{
        fileName:string,
        id:string,
        format:string,
        u8a: Uitt8Array,
        finalSize:number,
        width: number,
        height: number,
        compressed:null | string,
        realSize: number,
        quality: 0-10,
      }]
   */
  async CompressImages(callback, imgExportData, isFinal) {
  let imageDataArray = imgExportData.map(item => item.u8a);
  let targetSize = imgExportData.map(item =>item.finalSize ? item.finalSize*1000 : null);
  let type = imgExportData.map(item => item.format.toLowerCase());
  const compressedImages = [];
  for (let i = 0; i < imageDataArray.length; i++) {
    let isExport = isFinal ? isFinal[i] : true
    if(isExport){
      if(imgExportData[i].compressed){
        compressedImages.push(imgExportData[i].compressed);
      }else{
        let quality = 10; // 初始压缩质量
        let result = new Blob([imageDataArray[i]], {type: 'image/png'});//初始化
        let newBlob = new Blob([imageDataArray[i]], {type: 'image/png'});
        if (!targetSize[i]) {
          result = await this.CompressImage(newBlob, 10, type[i]);
          let finalSize = Math.floor(result.size / 10.24) / 100;
          callback(i, finalSize, quality, true);
        } else {
          do {
            try {
              result = await this.CompressImage(newBlob, quality, type[i]);
              if (targetSize[i] && result.size > targetSize[i] && quality > 1) {
                if (quality - 1 >= 0) {
                  console.log("压缩质量:" + quality)
                  quality -= 1; // 如果超过目标大小，减少质量再次尝试
                } else {
                  quality = 0;
                }
              } else {
                let finalSize = Math.floor(result.size / 10.24) / 100;
                if (result.size <= targetSize[i]) {
                  callback(i, finalSize, quality, true);
                } else {
                  callback(i, finalSize, quality, false);
                }
                break;
              }
            } catch (error) {
              console.error('压缩过程中发生错误:', error);
              break;
            }
          } while (result.size > targetSize[i]);
        }
        compressedImages.push(result);
        imgExportData[i].compressed = result;
      }
    } else {
      compressedImages.push(null);
    }
  }
  return compressedImages;
  },

  /**
   * 创建ZIP文件并提供下载
   * @param {[blob]} fileBlobs 
   * @param {[object]} fileInfos [{fileName: ../xx/name,format: string}]
   * @param {string | null} zipName
   */
  CreateZipAndDownload(fileBlobs, fileInfos, zipName) {
  let timeName = getDate('YYYYMMDD')[0].slice(2) + '_' + getTime('HHMMSS')[0]
  let zip = new JSZip();

  // 确保 fileBlobs 和 fileInfos 长度一致，通过 id 或索引关联
  // 如果长度不一致，使用 id 进行匹配
  var fileMap = new Map();
  if (fileBlobs.length !== fileInfos.length) {
    // 通过 id 匹配
    fileInfos.forEach(function(info, index) {
      if (info.id) {
        fileMap.set(info.id, { info: info, index: index });
      }
    });
    
    // 重新排序 fileBlobs 以匹配 fileInfos
    var sortedBlobs = [];
    fileInfos.forEach(function(info) {
      var mapped = fileMap.get(info.id);
      if (mapped && fileBlobs[mapped.index]) {
        sortedBlobs.push(fileBlobs[mapped.index]);
      } else {
        sortedBlobs.push(null);
      }
    });
    fileBlobs = sortedBlobs;
  }

  //处理同文件夹下同名问题
  let names = fileInfos.map(function(item, index) {
    // 确保使用正确的文件名和格式
    var fileName = (item.fileName && item.fileName.trim()) || 'image_' + index;
    var format = (item.format && item.format.toLowerCase()) || 'png';
    return fileName + '.' + format;
  });
  
  let groupSames = names.reduce((acc, name, index) => {
    if (!acc[name]) acc[name] = [];
      acc[name].push({ name: name, index: index });
      return acc;
  }, {});

  let finalfileNames = new Array(names.length);
  Object.values(groupSames).forEach(group => {
    if (group.length == 1) {
      finalfileNames[group[0].index] = group[0].name;
    } else {
        group.forEach((item, idx) => {
          let oldname = item.name.split('/').pop();
          let format = '.' + oldname.split('.').pop();
          let newname = item.name.replace(format, `(${(idx + 1)})` + format);
          finalfileNames[item.index] = newname;
        });
    };
  });

    if (!fileBlobs.every(item => item == null)) {
      fileBlobs.forEach((blob, index) => {
        if (blob && finalfileNames[index]) {
          zip.file(finalfileNames[index], blob);
        }
      });

      zip.generateAsync({ type: "blob" }).then(function (content) {
        zipName = zipName ? zipName : ''
        saveAs(content, zipName + timeName + '.zip');
      });
    }
  },

/**==========DOM转图片模块==========
 * 将 DOM 节点转换为 Canvas，然后可通过 CompressImage 压缩为不同格式
 * 基于 dom-to-image 实现，修改为返回 imgExportData 格式
*/

  // DOM转图片内部实现
  _domToImgUtil: (function() {
    function mimes() {
      var WOFF = 'application/font-woff';
      var JPEG = 'image/jpeg';
      return {
        'woff': WOFF,
        'woff2': WOFF,
        'ttf': 'application/font-truetype',
        'eot': 'application/vnd.ms-fontobject',
        'otf': 'application/font-opentype',
        'png': 'image/png',
        'jpg': JPEG,
        'jpeg': JPEG,
        'gif': 'image/gif',
        'tiff': 'image/tiff',
        'svg': 'image/svg+xml'
      };
    }

    // 全局资源缓存（字体、图片等）- 在批量处理时共享，避免重复加载
    var globalResourceCache = {
      fonts: {
        success: {}, // { url: base64Data }
        failed: {}   // { url: true } - 快速失败标记
      },
      images: {
        success: {}, // { url: base64Data }
        failed: {}   // { url: true } - 快速失败标记
      }
    };
    
    // 向后兼容：保留旧的 fontCache 引用
    var fontCache = globalResourceCache.fonts;
    
    // 将缓存暴露到 util 对象，以便外部访问
    this._globalResourceCache = globalResourceCache;

    // 判断是否为字体文件
    function isFontFile(url) {
      var ext = url.split('.').pop().toLowerCase().split('?')[0];
      return ['woff', 'woff2', 'ttf', 'otf', 'eot'].indexOf(ext) !== -1;
    }

    return {
      escape: function(string) {
        return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
      },
      parseExtension: function(url) {
        var match = /\.([^\.\/]*?)$/g.exec(url);
        if (match) return match[1];
        else return '';
      },
      mimeType: function(url) {
        var extension = this.parseExtension(url).toLowerCase();
        return mimes()[extension] || '';
      },
      isDataUrl: function(url) {
        return url.search(/^(data:)/) !== -1;
      },
      canvasToBlob: function(canvas) {
        if (canvas.toBlob)
          return new Promise(function (resolve) {
            canvas.toBlob(resolve);
          });
        return new Promise(function (resolve) {
          var binaryString = window.atob(canvas.toDataURL().split(',')[1]);
          var length = binaryString.length;
          var binaryArray = new Uint8Array(length);
          for (var i = 0; i < length; i++)
            binaryArray[i] = binaryString.charCodeAt(i);
          resolve(new Blob([binaryArray], { type: 'image/png' }));
        });
      },
      resolveUrl: function(url, baseUrl) {
        // 如果 URL 已经是绝对路径，直接返回
        if (url.match(/^https?:\/\//) || url.match(/^data:/) || url.match(/^\/\//)) {
          return url;
        }
        
        // 如果没有 baseUrl，使用当前页面的 location
        if (!baseUrl) {
          baseUrl = window.location.href;
        }
        
        // 确保 baseUrl 是完整的 URL
        try {
          // 如果 baseUrl 是相对路径，先解析它
          if (!baseUrl.match(/^https?:\/\//)) {
            var base = document.createElement('base');
            base.href = window.location.href;
            var tempA = document.createElement('a');
            tempA.href = baseUrl;
            baseUrl = tempA.href;
          }
        } catch(e) {
          // 如果解析失败，使用当前页面 URL
          baseUrl = window.location.href;
        }
        
        var doc = document.implementation.createHTMLDocument();
        var base = doc.createElement('base');
        doc.head.appendChild(base);
        var a = doc.createElement('a');
        doc.body.appendChild(a);
        base.href = baseUrl;
        a.href = url;
        return a.href;
      },
      uid: (function() {
        var index = 0;
        return function () {
          return 'u' + fourRandomChars() + index++;
          function fourRandomChars() {
            return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
          }
        };
      })(),
      makeImage: function(uri) {
        return new Promise(function (resolve, reject) {
          var image = new Image();
          var timeoutId = setTimeout(function() {
            image.onload = null;
            image.onerror = null;
            reject(new Error('Image load timeout after 30s'));
          }, 30000);
          image.onload = function () {
            clearTimeout(timeoutId);
            resolve(image);
          };
          image.onerror = function(error) {
            clearTimeout(timeoutId);
            var uriPreview = uri.length > 200 ? uri.substring(0, 200) + '...' : uri;
            console.error('Image load error, URI preview:', uriPreview);
            reject(error || new Error('Image load failed'));
          };
          image.src = uri;
        });
      },
      getAndEncode: function(url, cacheBust, imagePlaceholder) {
        // 对于字体文件，使用更短的超时时间；对于其他资源，使用标准超时
        var isFont = isFontFile(url);
        var TIMEOUT = isFont ? 2000 : 30000; // 字体2秒超时，其他30秒
        
        // 提取基础URL作为缓存键（去除查询参数和hash）
        var getCacheKey = function(url) {
          try {
            var urlObj = new URL(url, window.location.href);
            return urlObj.origin + urlObj.pathname;
          } catch(e) {
            // 如果URL解析失败，尝试手动去除查询参数
            return url.split('?')[0].split('#')[0];
          }
        };
        var cacheKey = getCacheKey(url);
        var originalUrl = url; // 保存原始URL用于日志
        
        if(cacheBust) {
          url += ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
        }

        // 检查资源缓存（字体和图片都使用全局缓存）
        var resourceCache = isFont ? globalResourceCache.fonts : globalResourceCache.images;
        
        if (isFont) {
          // 如果之前成功加载过，直接返回缓存的数据
          if (resourceCache.success[cacheKey]) {
            return Promise.resolve(resourceCache.success[cacheKey]);
          }
          // 如果之前加载失败过，快速失败
          if (resourceCache.failed[cacheKey]) {
            // 静默处理，不输出警告
            return Promise.resolve('');
          }
        } else {
          // 图片也使用缓存
          if (resourceCache.success[cacheKey]) {
            return Promise.resolve(resourceCache.success[cacheKey]);
          }
          if (resourceCache.failed[cacheKey]) {
            return Promise.resolve('');
          }
        }

        var placeholder;
        if(imagePlaceholder) {
          var split = imagePlaceholder.split(/,/);
          if(split && split[1]) {
            placeholder = split[1];
          }
        }

        function fail(message) {
          // 使用全局资源缓存
          var resourceCache = isFont ? globalResourceCache.fonts : globalResourceCache.images;
          resourceCache.failed[cacheKey] = true;
          
          // 对于字体和图片文件，静默处理失败
          if (isFont) {
            // 不输出警告，因为字体可能通过其他路径成功加载
            return '';
          }
          // 图片失败时也不输出警告（批量处理时避免过多日志）
          return '';
        }

        function success(data) {
          // 使用全局资源缓存，缓存成功的数据（字体和图片）
          var resourceCache = isFont ? globalResourceCache.fonts : globalResourceCache.images;
          if (data) {
            resourceCache.success[cacheKey] = data;
          }
          return data;
        }

        return new Promise(function (resolve) {
          var request = new XMLHttpRequest();
          request.onreadystatechange = done;
          request.ontimeout = timeout;
          request.onerror = function() {
            if(placeholder) {
              resolve(placeholder);
            } else {
              // 对于字体文件，静默处理错误（可能通过其他路径成功加载）
              if (isFont) {
                resolve(fail(''));
              } else {
                resolve(fail('Failed to fetch resource: ' + originalUrl));
              }
            }
          };
          request.responseType = 'blob';
          request.timeout = TIMEOUT;
          request.open('GET', url, true);
          request.send();

          function done() {
            if (request.readyState !== 4) return;
            if (request.status !== 200) {
              if(placeholder) {
                resolve(placeholder);
              } else {
                // 对于字体文件，静默处理404错误（可能通过其他路径成功加载）
                if (isFont) {
                  resolve(fail(''));
                } else {
                  resolve(fail('cannot fetch resource: ' + originalUrl + ', status: ' + request.status));
                }
              }
              return;
            }
            var encoder = new FileReader();
            encoder.onloadend = function () {
              var content = encoder.result.split(/,/)[1];
              resolve(success(content));
            };
            encoder.onerror = function() {
              // 对于字体文件，静默处理错误
              if (isFont) {
                resolve(fail(''));
              } else {
                resolve(fail('FileReader error for: ' + originalUrl));
              }
            };
            encoder.readAsDataURL(request.response);
          }

          function timeout() {
            if(placeholder) {
              resolve(placeholder);
            } else {
              // 对于字体文件，静默处理超时（可能通过其他路径成功加载）
              if (isFont) {
                resolve(fail(''));
              } else {
                resolve(fail('timeout of ' + TIMEOUT + 'ms occured while fetching resource: ' + originalUrl));
              }
            }
          }
        });
      },
      dataAsUrl: function(content, type) {
        return 'data:' + type + ';base64,' + content;
      },
      delay: function(ms) {
        return function (arg) {
          return new Promise(function (resolve) {
            setTimeout(function () {
              resolve(arg);
            }, ms);
          });
        };
      },
      asArray: function(arrayLike) {
        var array = [];
        var length = arrayLike.length;
        for (var i = 0; i < length; i++) array.push(arrayLike[i]);
        return array;
      },
      escapeXhtml: function(string) {
        return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
      },
      width: function(node) {
        // 如果已经设置了 style.width，优先使用它
        var styleWidth = node.style.width;
        if (styleWidth && styleWidth !== 'auto' && styleWidth !== '') {
          var widthValue = parseFloat(styleWidth);
          if (!isNaN(widthValue)) {
            var leftBorder = px(node, 'border-left-width');
            var rightBorder = px(node, 'border-right-width');
            return widthValue + leftBorder + rightBorder;
          }
        }
        
        // 否则使用 scrollWidth
        var leftBorder = px(node, 'border-left-width');
        var rightBorder = px(node, 'border-right-width');
        var tagName = node.tagName ? node.tagName.toLowerCase() : '';
        
        return node.scrollWidth + leftBorder + rightBorder;
      },
      height: function(node) {
        // 如果已经设置了 style.height，优先使用它
        var styleHeight = node.style.height;
        if (styleHeight && styleHeight !== 'auto' && styleHeight !== '') {
          var heightValue = parseFloat(styleHeight);
          if (!isNaN(heightValue)) {
            var topBorder = px(node, 'border-top-width');
            var bottomBorder = px(node, 'border-bottom-width');
            return heightValue + topBorder + bottomBorder;
          }
        }
        
        // 否则使用 scrollHeight
        var topBorder = px(node, 'border-top-width');
        var bottomBorder = px(node, 'border-bottom-width');
        var tagName = node.tagName ? node.tagName.toLowerCase() : '';
        
        return node.scrollHeight + topBorder + bottomBorder;
      }
    };

    function px(node, styleProperty) {
      var value = window.getComputedStyle(node).getPropertyValue(styleProperty);
      return parseFloat(value.replace('px', ''));
    }
  })(),

  _domToImgInliner: (function() {
    var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;

    return {
      shouldProcess: function(string) {
        return string.search(URL_REGEX) !== -1;
      },
      readUrls: function(string, util) {
        var result = [];
        var match;
        while ((match = URL_REGEX.exec(string)) !== null) {
          result.push(match[1]);
        }
        return result.filter(function (url) {
          return !util.isDataUrl(url);
        });
      },
      inline: function(string, url, baseUrl, get, util) {
        // 判断是否为字体文件
        var isFont = (function() {
          var ext = url.split('.').pop().toLowerCase().split('?')[0];
          return ['woff', 'woff2', 'ttf', 'otf', 'eot'].indexOf(ext) !== -1;
        })();
        
        return Promise.resolve(url)
          .then(function (url) {
            return baseUrl ? util.resolveUrl(url, baseUrl) : url;
          })
          .then(get || function(url) { return util.getAndEncode(url, false, null); })
          .then(function (data) {
            if (!data) {
              // 对于字体文件，静默处理失败（可能通过其他路径成功加载）
              if (!isFont) {
                console.warn('Failed to load resource, skipping:', url);
              }
              return string;
            }
            return util.dataAsUrl(data, util.mimeType(url));
          })
          .then(function (dataUrl) {
            if (!dataUrl || dataUrl.indexOf('data:') !== 0) {
              // 如果 dataUrl 无效，返回原字符串（跳过）
              return string;
            }
            return string.replace(urlAsRegex(url, util), '$1' + dataUrl + '$3');
          })
          .catch(function(err) {
            // 对于字体文件，静默处理错误
            if (!isFont) {
              console.warn('Resource inline failed, skipping:', url, err.message);
            }
            return string;
          });

        function urlAsRegex(url, util) {
          return new RegExp('(url\\([\'"]?)(' + util.escape(url) + ')([\'"]?\\))', 'g');
        }
      },
      inlineAll: function(string, baseUrl, get, util) {
        if (!this.shouldProcess(string)) return Promise.resolve(string);
        var self = this;
        return Promise.resolve(string)
          .then(function(str) { return self.readUrls(str, util); })
          .then(function (urls) {
            var done = Promise.resolve(string);
            urls.forEach(function (url) {
              done = done.then(function (string) {
                return self.inline(string, url, baseUrl, get, util).catch(function(err) {
                  // 单个 URL 处理失败，继续处理其他 URL
                  console.warn('URL inline failed, continuing:', url, err.message);
                  return string;
                });
              });
            });
            return done;
          })
          .catch(function(err) {
            // 整个 inlineAll 失败，返回原字符串
            console.warn('inlineAll failed, returning original string:', err.message);
            return string;
          });
      }
    };
  })(),

  _domToImgFontFaces: (function() {
    return {
      resolveAll: function(util, inliner, usedFonts) {
        return this.readAll(util, inliner, usedFonts)
          .then(function (webFonts) {
            return Promise.all(
              webFonts.map(function (webFont) {
                return webFont.resolve();
              })
            );
          })
          .then(function (cssStrings) {
            return cssStrings.join('\n');
          });
      },
      readAll: function(util, inliner, usedFonts) {
        return Promise.resolve(util.asArray(document.styleSheets))
          .then(function(sheets) { return getCssRules(sheets, util); })
          .then(function(rules) { return selectWebFontRules(rules, inliner, usedFonts); })
          .then(function (rules) {
            return rules.map(function(rule) { return newWebFont(rule, inliner); });
          });

        function selectWebFontRules(cssRules, inliner, usedFonts) {
          var allRules = cssRules
            .filter(function (rule) {
              return rule.type === CSSRule.FONT_FACE_RULE;
            })
            .filter(function (rule) {
              return inliner.shouldProcess(rule.style.getPropertyValue('src'));
            });
          
          // 如果提供了使用的字体列表，只返回那些被使用的字体
          if (usedFonts && usedFonts.size > 0) {
            return allRules.filter(function (rule) {
              var fontFamily = rule.style.getPropertyValue('font-family');
              if (!fontFamily) return false;
              // 去除引号和空格
              var cleanFamily = fontFamily.replace(/^['"]|['"]$/g, '').trim();
              // 检查是否在使用的字体列表中（支持精确匹配）
              var found = false;
              usedFonts.forEach(function(usedFont) {
                if (cleanFamily === usedFont || cleanFamily.indexOf(usedFont) !== -1) {
                  found = true;
                }
              });
              return found;
            });
          }
          
          // 如果没有提供使用的字体列表，返回所有规则（向后兼容）
          return allRules;
        }

        function getCssRules(styleSheets, util) {
          var cssRules = [];
          styleSheets.forEach(function (sheet) {
            try {
              util.asArray(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules));
            } catch (e) {
              // 忽略跨域样式表错误
            }
          });
          return cssRules;
        }

        function newWebFont(webFontRule, inliner) {
          return {
            resolve: function resolve() {
              var baseUrl = (webFontRule.parentStyleSheet || {}).href;
              // 如果 baseUrl 为空，使用当前页面的 URL
              if (!baseUrl) {
                baseUrl = window.location.href;
              }
              return inliner.inlineAll(webFontRule.cssText, baseUrl, null, inliner._util || {
                resolveUrl: function(url, base) { return url; },
                getAndEncode: function(url) { return Promise.resolve(''); },
                dataAsUrl: function(data, type) { return 'data:' + type + ';base64,' + data; },
                mimeType: function(url) { return 'application/font-woff'; },
                escape: function(str) { return str.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1'); },
                isDataUrl: function(url) { return url.search(/^(data:)/) !== -1; }
              });
            },
            src: function () {
              return webFontRule.style.getPropertyValue('src');
            }
          };
        }
      }
    };
  })(),

  _domToImgImages: (function() {
    function inlineBackground(node, util, inliner) {
      var background = node.style.getPropertyValue('background');
      if (!background) return Promise.resolve(node);
      return inliner.inlineAll(background, null, null, util)
        .then(function (inlined) {
          node.style.setProperty(
            'background',
            inlined,
            node.style.getPropertyPriority('background')
          );
        })
        .then(function () {
          return node;
        })
        .catch(function(err) {
          // 背景图片处理失败，跳过但不中断流程
          console.warn('Background image processing failed, skipping:', err.message);
          return node;
        });
    }

    function newImage(element, util) {
      return {
        inline: function inline(get) {
          if (util.isDataUrl(element.src)) return Promise.resolve();
          return Promise.resolve(element.src)
            .then(get || function(url) { return util.getAndEncode(url, false, null); })
            .then(function (data) {
              if (!data) {
                // 加载失败，跳过这个图片
                console.warn('Image load failed, skipping:', element.src);
                return Promise.resolve();
              }
              return util.dataAsUrl(data, util.mimeType(element.src));
            })
            .then(function (dataUrl) {
              if (!dataUrl) {
                // 如果 dataUrl 为空，说明加载失败，跳过
                return Promise.resolve();
              }
              return new Promise(function (resolve) {
                element.onload = resolve;
                element.onerror = resolve; // 即使失败也 resolve，不中断流程
                element.src = dataUrl;
              });
            })
            .catch(function(err) {
              // 任何错误都捕获，不中断流程
              console.warn('Image processing failed, skipping:', element.src, err.message);
              return Promise.resolve();
            });
        }
      };
    }

    var imagesObj = {
      inlineAll: function(node, util, inliner) {
        if (!(node instanceof Element)) return Promise.resolve(node);
        return inlineBackground(node, util, inliner)
          .then(function () {
            if (node instanceof HTMLImageElement)
              return newImage(node, util).inline();
            else
              return Promise.all(
                util.asArray(node.childNodes).map(function (child) {
                  return imagesObj.inlineAll(child, util, inliner).catch(function(err) {
                    // 子节点处理失败，跳过但不中断流程
                    console.warn('Child node processing failed, skipping:', err.message);
                    return Promise.resolve(child);
                  });
                })
              );
          })
          .then(function() {
            return node;
          })
          .catch(function(err) {
            // 任何错误都捕获，返回节点继续处理
            console.warn('Node processing failed, continuing:', err.message);
            return node;
          });
      }
    };
    return imagesObj;
  })(),

  /**
   * 将 DOM 节点转换为 SVG 数据 URI
   * @param {Node} node - DOM 节点
   * @param {Object} options - 选项
   * @returns {Promise<string>} SVG 数据 URI
   */
  async toSvg(node, options) {
    options = options || {};
    var util = this._domToImgUtil;
    var inliner = this._domToImgInliner;
    var fontFaces = this._domToImgFontFaces;
    var images = this._domToImgImages;
    var defaultOptions = {
      imagePlaceholder: undefined,
      cacheBust: false
    };

    // 复制选项
    var imagePlaceholder = typeof(options.imagePlaceholder) === 'undefined' 
      ? defaultOptions.imagePlaceholder 
      : options.imagePlaceholder;
    var cacheBust = typeof(options.cacheBust) === 'undefined' 
      ? defaultOptions.cacheBust 
      : options.cacheBust;

    // 在克隆之前收集实际使用的字体（从原始节点）
    // 如果 options 中提供了共享字体集合，优先使用（批量处理时）
    var usedFonts = options._sharedFonts || this._collectUsedFonts(node);
    
    return Promise.resolve(node)
      .then(function (node) {
        return this._cloneNode(node, options.filter, true, util, inliner, fontFaces, images, cacheBust, imagePlaceholder);
      }.bind(this))
      .then(function (clone) {
        return this._embedFonts(clone, util, inliner, fontFaces, cacheBust, imagePlaceholder, usedFonts);
      }.bind(this))
      .then(function (clone) {
        return this._inlineImages(clone, util, inliner, images, cacheBust, imagePlaceholder);
      }.bind(this))
      .then(function (clone) {
        return this._applyOptions(clone, options);
      }.bind(this))
      .then(function (clone) {
        return this._makeSvgDataUri(clone,
          options.width || util.width(node),
          options.height || util.height(node),
          options.bgcolor,
          util
        );
      }.bind(this));
  },

  _applyOptions: function(clone, options) {
    if (options.bgcolor) {
      clone.style.setProperty('background-color', options.bgcolor, 'important');
    }
    if (options.width) clone.style.width = options.width + 'px';
    if (options.height) clone.style.height = options.height + 'px';
    if (options.style) {
      Object.keys(options.style).forEach(function (property) {
        clone.style[property] = options.style[property];
      });
    }
    return Promise.resolve(clone);
  },

  _cloneNode: function(node, filter, root, util, inliner, fontFaces, images, cacheBust, imagePlaceholder) {
    if (!root && filter && !filter(node)) return Promise.resolve();

    return Promise.resolve(node)
      .then(function (node) {
        if (node instanceof HTMLCanvasElement) return util.makeImage(node.toDataURL());
        return node.cloneNode(false);
      })
      .then(function (clone) {
        return this._cloneChildren(node, clone, filter, util, inliner, fontFaces, images, cacheBust, imagePlaceholder);
      }.bind(this))
      .then(function (clone) {
        return this._processClone(node, clone, util, inliner);
      }.bind(this));
  },

  _cloneChildren: function(original, clone, filter, util, inliner, fontFaces, images, cacheBust, imagePlaceholder) {
    var children = original.childNodes;
    if (children.length === 0) return Promise.resolve(clone);

    return this._cloneChildrenInOrder(clone, util.asArray(children), filter, util, inliner, fontFaces, images, cacheBust, imagePlaceholder)
      .then(function () {
        return clone;
      });
  },

  _cloneChildrenInOrder: function(parent, children, filter, util, inliner, fontFaces, images, cacheBust, imagePlaceholder) {
    var done = Promise.resolve();
    var self = this;
    children.forEach(function (child) {
      done = done
        .then(function () {
          return self._cloneNode(child, filter, false, util, inliner, fontFaces, images, cacheBust, imagePlaceholder);
        })
        .then(function (childClone) {
          if (childClone) parent.appendChild(childClone);
        });
    });
    return done;
  },

  _processClone: function(original, clone, util, inliner) {
    if (!(clone instanceof Element)) return Promise.resolve(clone);

    return Promise.resolve()
      .then(function() { return this._cloneStyle(original, clone, util); }.bind(this))
      .then(function() { return this._clonePseudoElements(original, clone, util); }.bind(this))
      .then(function() { return this._copyUserInput(original, clone); }.bind(this))
      .then(function() { return this._hideScrollbars(clone); }.bind(this))
      .then(function() { return this._fixSvg(clone); }.bind(this))
      .then(function () {
        return clone;
      });
  },

  _cloneStyle: function(original, clone, util) {
    var source = window.getComputedStyle(original);
    var target = clone.style;
    if (source.cssText) target.cssText = source.cssText;
    else {
      util.asArray(source).forEach(function (name) {
        target.setProperty(
          name,
          source.getPropertyValue(name),
          source.getPropertyPriority(name)
        );
      });
    }
  },

  _clonePseudoElements: function(original, clone, util) {
    [':before', ':after'].forEach(function (element) {
      this._clonePseudoElement(original, clone, element, util);
    }.bind(this));
  },

  _clonePseudoElement: function(original, clone, element, util) {
    var style = window.getComputedStyle(original, element);
    var content = style.getPropertyValue('content');
    if (content === '' || content === 'none') return;

    var className = util.uid();
    clone.className = clone.className + ' ' + className;
    var styleElement = document.createElement('style');
    styleElement.appendChild(this._formatPseudoElementStyle(className, element, style, util));
    clone.appendChild(styleElement);
  },

  _formatPseudoElementStyle: function(className, element, style, util) {
    var selector = '.' + className + ':' + element;
    var cssText = style.cssText ? this._formatCssText(style) : this._formatCssProperties(style, util);
    return document.createTextNode(selector + '{' + cssText + '}');
  },

  _formatCssText: function(style) {
    var content = style.getPropertyValue('content');
    return style.cssText + ' content: ' + content + ';';
  },

  _formatCssProperties: function(style, util) {
    return util.asArray(style)
      .map(function(name) {
        return name + ': ' +
          style.getPropertyValue(name) +
          (style.getPropertyPriority(name) ? ' !important' : '');
      })
      .join('; ') + ';';
  },

  _copyUserInput: function(original, clone) {
    if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;
    if (original instanceof HTMLInputElement) clone.setAttribute("value", original.value);
  },

  _hideScrollbars: function(clone) {
    this._hideScrollbarsRecursive(clone);
  },

  _hideScrollbarsRecursive: function(node) {
    if (!(node instanceof Element)) return;
    var util = this._domToImgUtil;
    var computedStyle = window.getComputedStyle(node);
    var overflow = computedStyle.overflow;
    var overflowX = computedStyle.overflowX;
    var overflowY = computedStyle.overflowY;
    var resize = computedStyle.resize;
    var tagName = node.tagName ? node.tagName.toLowerCase() : '';
    
    var hasScroll = overflow === 'auto' || overflow === 'scroll' || 
                   overflowX === 'auto' || overflowX === 'scroll' ||
                   overflowY === 'auto' || overflowY === 'scroll' ||
                   tagName === 'pre' || tagName === 'textarea';
    
    var hasResize = resize === 'both' || resize === 'horizontal' || resize === 'vertical' ||
                   node.hasAttribute('data-resize') ||
                   tagName === 'pre' || tagName === 'textarea';
    
    if (hasScroll) {
      node.style.scrollbarWidth = 'none';
      node.style.setProperty('-ms-overflow-style', 'none', 'important');
      if (overflow === 'auto' || overflow === 'scroll' || tagName === 'pre' || tagName === 'textarea') {
        node.style.setProperty('overflow', 'hidden', 'important');
      }
      if (overflowX === 'auto' || overflowX === 'scroll') {
        node.style.setProperty('overflow-x', 'hidden', 'important');
      }
      if (overflowY === 'auto' || overflowY === 'scroll') {
        node.style.setProperty('overflow-y', 'hidden', 'important');
      }
    }
    
    if (hasResize) {
      node.style.setProperty('resize', 'none', 'important');
    }
    
    if (node.hasAttribute('data-resize')) {
      var styleId = 'hide-resize-' + Date.now();
      var existingStyle = document.getElementById(styleId);
      if (!existingStyle) {
        var styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = '[data-resize]::after { display: none !important; }';
        clone.appendChild(styleElement);
      }
    }
    
    util.asArray(node.children).forEach(function(child) {
      this._hideScrollbarsRecursive(child);
    }.bind(this));
  },

  _fixSvg: function(clone) {
    if (!(clone instanceof SVGElement)) return;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    if (!(clone instanceof SVGRectElement)) return;
    ['width', 'height'].forEach(function (attribute) {
      var value = clone.getAttribute(attribute);
      if (!value) return;
      clone.style.setProperty(attribute, value);
    });
  },

  _embedFonts: function(node, util, inliner, fontFaces, cacheBust, imagePlaceholder, usedFonts) {
    var self = this;
    inliner._util = {
      resolveUrl: function(url, base) { return util.resolveUrl(url, base); },
      getAndEncode: function(url) { return util.getAndEncode(url, cacheBust, imagePlaceholder); },
      dataAsUrl: function(data, type) { return util.dataAsUrl(data, type); },
      mimeType: function(url) { return util.mimeType(url); },
      escape: function(str) { return util.escape(str); },
      isDataUrl: function(url) { return util.isDataUrl(url); }
    };
    // 使用传入的已使用字体列表，如果没有则收集（向后兼容）
    if (!usedFonts) {
      usedFonts = this._collectUsedFonts(node);
    }
    return fontFaces.resolveAll(util, inliner, usedFonts)
      .then(function (cssText) {
        var styleNode = document.createElement('style');
        node.appendChild(styleNode);
        styleNode.appendChild(document.createTextNode(cssText));
        return node;
      });
  },
  
  _collectUsedFonts: function(node) {
    var usedFonts = new Set();
    
    function collectFromElement(el) {
      if (!el || !(el instanceof Element)) return;
      
      try {
        var computedStyle = window.getComputedStyle(el);
        var fontFamily = computedStyle.getPropertyValue('font-family');
        if (fontFamily) {
          // 解析 font-family，可能包含多个字体，用逗号分隔
          var fonts = fontFamily.split(',').map(function(f) {
            // 去除引号和空格
            return f.trim().replace(/^['"]|['"]$/g, '');
          });
          fonts.forEach(function(font) {
            // 只添加非系统字体和有效的字体名称
            if (font && 
                font !== 'inherit' && 
                font !== 'initial' && 
                font !== 'unset' &&
                font !== 'serif' &&
                font !== 'sans-serif' &&
                font !== 'monospace' &&
                font !== 'cursive' &&
                font !== 'fantasy') {
              usedFonts.add(font);
            }
          });
        }
      } catch(e) {
        // 忽略无法获取样式的元素（如跨域 iframe）
      }
      
      // 递归处理子元素
      var children = el.children || el.childNodes;
      if (children) {
        for (var i = 0; i < children.length; i++) {
          collectFromElement(children[i]);
        }
      }
    }
    
    collectFromElement(node);
    return usedFonts;
  },
  
  /**
   * 清除全局资源缓存（用于批量处理完成后释放内存）
   */
  clearResourceCache: function() {
    var util = this._domToImgUtil;
    if (util && util._globalResourceCache) {
      util._globalResourceCache.fonts.success = {};
      util._globalResourceCache.fonts.failed = {};
      util._globalResourceCache.images.success = {};
      util._globalResourceCache.images.failed = {};
    }
  },

  _inlineImages: function(node, util, inliner, images, cacheBust, imagePlaceholder) {
    var self = this;
    var getAndEncode = function(url) {
      return util.getAndEncode(url, cacheBust, imagePlaceholder);
    };
    return images.inlineAll(node, util, inliner)
      .then(function () {
        return node;
      });
  },

  _makeSvgDataUri: function(node, width, height, bgcolor, util) {
    return Promise.resolve(node)
      .then(function (node) {
        node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        return new XMLSerializer().serializeToString(node);
      })
      .then(function(xhtml) { return util.escapeXhtml(xhtml); })
      .then(function (xhtml) {
        return '<foreignObject x="0" y="0" width="100%" height="100%">' + xhtml + '</foreignObject>';
      })
      .then(function (foreignObject) {
        var bgRect = '';
        if (bgcolor) {
          var escapedBgcolor = String(bgcolor)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
          bgRect = '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="' + escapedBgcolor + '"/>';
        }
        var svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
          bgRect + foreignObject + '</svg>';
        return svgContent;
      })
      .then(function (svg) {
        return 'data:image/svg+xml;charset=utf-8,' + util.escapeXhtml(svg);
      });
  },

  _draw: function(domNode, options) {
    options = options || {};
    var util = this._domToImgUtil;
    var self = this;
    return this.toSvg(domNode, options)
      .then(function(svg) { return util.makeImage(svg); })
      .then(util.delay(100))
      .then(function (image) {
        var canvas = self._newCanvas(domNode, options, util);
        var ctx = canvas.getContext('2d');
        
        if (options.bgcolor) {
          ctx.fillStyle = options.bgcolor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.save();
        if (options.bgcolor) {
          ctx.globalCompositeOperation = 'source-over';
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        return canvas;
      });
  },

  _newCanvas: function(domNode, options, util) {
    var canvas = document.createElement('canvas');
    canvas.width = options.width || util.width(domNode);
    canvas.height = options.height || util.height(domNode);
    return canvas;
  },

  /**
   * 准备高清元素（用于缩放）
   * @param {Node} dom - 原始 DOM 节点
   * @param {number} scale - 缩放倍数
   * @param {Object} util - 工具对象
   * @returns {Object} {container: 容器元素, originalWidth: 原始宽度, originalHeight: 原始高度}
   */
  _prepareHighDpiElement: function(dom, scale, util) {
    // 获取原始尺寸和样式（使用实际计算后的尺寸，而不是样式值）
    var originalWidth = util.width(dom);
    var originalHeight = util.height(dom);
    var computedStyle = window.getComputedStyle(dom);
    
    // 保存原始样式值
    var originalStyles = {
      width: dom.style.width || '',
      height: dom.style.height || '',
      zoom: dom.style.zoom || '',
      boxSizing: dom.style.boxSizing || '',
      minWidth: dom.style.minWidth || '',
      maxWidth: dom.style.maxWidth || '',
      minHeight: dom.style.minHeight || '',
      maxHeight: dom.style.maxHeight || ''
    };
    
    // 同时修改宽高和 zoom，确保等比例放大且不重排
    var scaledWidth = originalWidth;
    var scaledHeight = originalHeight;
    
    // 先清除可能影响布局的样式
    dom.style.minWidth = '0';
    dom.style.maxWidth = 'none';
    dom.style.minHeight = '0';
    dom.style.maxHeight = 'none';
    
    // 修改宽高为固定像素值（基于实际计算后的尺寸）
    dom.style.width = scaledWidth + 'px';
    dom.style.height = scaledHeight + 'px';
    
    // 设置 zoom 来放大内容（配合宽高修改，确保等比例放大）
    dom.style.zoom = scale;
    dom.style.boxSizing = computedStyle.boxSizing || 'border-box';
    
    // 强制浏览器重新计算布局
    dom.offsetHeight;
    
    return {
      dom: dom,
      originalWidth: originalWidth,
      originalHeight: originalHeight,
      scaledWidth: scaledWidth * scale,
      scaledHeight: scaledHeight * scale,
      originalStyles: originalStyles
    };
  },
  
  _restoreHighDpiElement: function(highDpiData) {
    // 恢复原始样式
    var dom = highDpiData.dom;
    var originalStyles = highDpiData.originalStyles;
    
    dom.style.width = originalStyles.width;
    dom.style.height = originalStyles.height;
    dom.style.zoom = originalStyles.zoom;
    dom.style.boxSizing = originalStyles.boxSizing;
    dom.style.minWidth = originalStyles.minWidth;
    dom.style.maxWidth = originalStyles.maxWidth;
    dom.style.minHeight = originalStyles.minHeight;
    dom.style.maxHeight = originalStyles.maxHeight;
  },

  /**
   * 批量将 DOM 节点转换为 imgExportData 格式（优化资源加载，避免重复请求）
   * @param {Array} doms - DOM 节点数组，每个元素为 { dom: Node, options: Object }
   * @param {Object} batchOptions - 批量处理选项
   * @param {boolean} batchOptions.sharedResources - 是否共享资源缓存（默认 true）
   * @param {Function} batchOptions.onProgress - 进度回调 (index, total, currentData) => {}
   * @returns {Promise<Array>} imgExportData 格式的对象数组
   */
  async DomToImagedataBatch(doms, batchOptions) {
    batchOptions = batchOptions || {};
    var sharedResources = batchOptions.sharedResources !== false; // 默认共享资源
    
    // 如果共享资源，先收集所有节点使用的字体
    var allUsedFonts = new Set();
    if (sharedResources) {
      doms.forEach(function(item) {
        var usedFonts = this._collectUsedFonts(item.dom || item);
        usedFonts.forEach(function(font) {
          allUsedFonts.add(font);
        });
      }.bind(this));
    }
    
    // 批量处理
    var results = [];
    var self = this;
    
    for (var i = 0; i < doms.length; i++) {
      var item = doms[i];
      var dom = item.dom || item;
      var options = item.options || item;
      
      try {
        // 如果共享资源，传递已收集的字体列表
        if (sharedResources && allUsedFonts.size > 0) {
          options._sharedFonts = allUsedFonts;
        }
        
        var result = await this.DomToImagedata(dom, options);
        results.push(result);
        
        // 进度回调
        if (batchOptions.onProgress) {
          batchOptions.onProgress(i, doms.length, result);
        }
      } catch (error) {
        console.error('批量处理第 ' + (i + 1) + ' 个元素时出错:', error);
        // 即使出错也添加一个占位对象，保持数组长度一致
        results.push({
          fileName: (options.fileName || 'error') + '_' + i,
          id: options.id || '',
          format: options.format || 'png',
          u8a: null,
          error: error.message
        });
      }
    }
    
    return results;
  },

  /**
   * 将 DOM 节点转换为 imgExportData 格式
   * @param {Node} dom - DOM 节点
   * @param {Object} options - 选项
   * @param {string} options.format - 图片格式 'png' | 'jpeg' | 'jpg'（可选，默认 'png'）
   * @param {string} options.fileName - 文件名（可选）
   * @param {string} options.id - ID（可选）
   * @param {number} options.finalSize - 目标文件大小（KB，可选）
   * @param {number} options.quality - 质量 0-10（可选，默认10）
   * @param {string} options.bgcolor - 背景色（可选）
   * @param {number} options.width - 宽度（可选）
   * @param {number} options.height - 高度（可选）
   * @param {Object} options.style - 样式对象（可选）
   * @param {Function} options.filter - 节点过滤函数（可选）
   * @param {number} options.scale - 高清缩放倍数（可选，默认1，建议2-3倍）
   * @param {Set} options._sharedFonts - 内部使用：共享的字体集合（可选）
   * @returns {Promise<Object>} imgExportData 格式的对象
   */
  async DomToImagedata(dom, options) {
    options = options || {};
    var util = this._domToImgUtil;
    var format = (options.format || 'png').toLowerCase();
    var quality = options.quality !== undefined ? options.quality : 10;
    var scale = options.scale || 1;
    
    // 在函数最开始就检测并处理 transform 中的 scale
    var computedStyle = window.getComputedStyle(dom);
    var originalTransform = dom.style.transform || '';
    var computedTransform = computedStyle.transform || 'none';
    var hasScale = false;
    var transformScale = 1;
    
    // 检测 transform 中是否包含 scale
    if (computedTransform !== 'none' && computedTransform.indexOf('scale') !== -1) {
      hasScale = true;
      // 提取 scale 值
      var scaleMatch = computedTransform.match(/scale\(([^)]+)\)/i);
      if (scaleMatch) {
        transformScale = parseFloat(scaleMatch[1]) || 1;
      }
    } else if (originalTransform && originalTransform.indexOf('scale') !== -1) {
      hasScale = true;
      // 提取 scale 值
      var scaleMatch = originalTransform.match(/scale\(([^)]+)\)/i);
      if (scaleMatch) {
        transformScale = parseFloat(scaleMatch[1]) || 1;
      }
    }
    
    // 如果检测到 scale，将其归为 1，并使用强制重渲确保生效
    if (hasScale) {
      console.log('Transform scale detected:', transformScale);
      
      // 将 transform scale 归为 1
      var transformValue = originalTransform || computedTransform;
      if (transformValue && transformValue !== 'none') {
        // 使用正则表达式替换 scale 部分为 scale(1)
        transformValue = transformValue.replace(/scale\([^)]*\)/gi, 'scale(1)');
        dom.style.transform = transformValue;
        console.log('Transform reset to:', transformValue);
      } else {
        dom.style.transform = 'scale(1)';
        console.log('Transform reset to: scale(1)');
      }
      
      // 使用 appendChild/removeChild 强制浏览器重新渲染
      var parent = dom.parentNode;
      if (parent) {
        var nextSibling = dom.nextSibling;
        parent.removeChild(dom);
        if (nextSibling) {
          parent.insertBefore(dom, nextSibling);
        } else {
          parent.appendChild(dom);
        }
      }
      
      // 强制浏览器重新计算布局
      dom.offsetHeight;
      
      console.log('After transform reset - util.width():', util.width(dom));
      console.log('After transform reset - util.height():', util.height(dom));
    }
    
    // 确定 MIME 类型
    var mimeType = 'image/png';
    if (format === 'jpeg' || format === 'jpg') {
      mimeType = 'image/jpeg';
      format = 'jpeg';
    } else {
      format = 'png';
    }
    
    var self = this;
    var highDpiData = null;
    
    // 使用 Promise 确保 transform 处理后再执行后续操作
    return Promise.resolve()
      .then(function() {
        // 如果需要缩放，直接修改原元素的宽高和 zoom
        if (scale) {
          highDpiData = self._prepareHighDpiElement(dom, scale, util);
          
          // 更新选项中的宽高为缩放后的尺寸
          options = Object.assign({}, options);
          options.width = highDpiData.scaledWidth;
          options.height = highDpiData.scaledHeight;
          
          // 等待一帧确保渲染完成
          return util.delay(100)()
            .then(function() {
              return self._draw(dom, options);
            })
            .then(function (canvas) {
              // 恢复原元素样式
              if (highDpiData) {
                self._restoreHighDpiElement(highDpiData);
              }

            // 恢复原始 transform
            if (hasScale) {
              dom.style.transform = originalTransform;
              console.log('Transform restored to:', originalTransform || '(empty)');
            }
              
              // 直接使用 canvas 的尺寸（如果是缩放，就是缩放后的尺寸）
              var outputWidth = canvas.width;
              var outputHeight = canvas.height;
              
              var dataUrl = canvas.toDataURL(mimeType, format === 'jpeg' ? quality / 10 : undefined);
              var base64Data = dataUrl.split(',')[1];
              var u8a = self.B64ToU8A(base64Data);
              
              return {
                fileName: options.fileName || 'image',
                id: options.id || '',
                format: format,
                u8a: u8a,
                finalSize: options.finalSize || null,
                width: outputWidth,
                height: outputHeight,
                compressed: null,
                realSize: Math.floor(u8a.length / 1024 * 100) / 100,
                quality: quality
              };
            })
            .catch(function(error) {
              // 确保在出错时也恢复原元素样式
              if (highDpiData) {
                self._restoreHighDpiElement(highDpiData);
              }
            // 恢复原始 transform
            if (hasScale) {
              dom.style.transform = originalTransform;
              console.log('Transform restored to:', originalTransform || '(empty)');
            }
              throw error;
            });
        } else {
          // 不需要缩放，直接使用旧逻辑
          return self._draw(dom, options)
            .then(function (canvas) {
              var outputWidth = canvas.width;
              var outputHeight = canvas.height;
              
              var dataUrl = canvas.toDataURL(mimeType, format === 'jpeg' ? quality / 10 : undefined);
              var base64Data = dataUrl.split(',')[1];
              var u8a = self.B64ToU8A(base64Data);
              
            // 恢复原始 transform
            if (hasScale) {
              dom.style.transform = originalTransform;
              console.log('Transform restored to:', originalTransform || '(empty)');
            }
              
              return {
                fileName: options.fileName || 'image',
                id: options.id || '',
                format: format,
                u8a: u8a,
                finalSize: options.finalSize || null,
                width: outputWidth,
                height: outputHeight,
                compressed: null,
                realSize: Math.floor(u8a.length / 1024 * 100) / 100,
                quality: quality
              };
            })
            .catch(function(error) {
              // 确保在出错时也恢复 transform
              if (hasScale) {
                dom.style.transform = originalTransform;
                console.log('Transform restored to:', originalTransform || '(empty)');
              }
              throw error;
            });
        }
      })
  },

  /**
   * 像素格子生成&解析器
   * 支持从图片生成像素格子和从数据生成二维码
   * 
   * 数据结构：
   * {
   *   type: 'binary' | 'RGBA',
   *   row: number,
   *   column: number,
   *   matrix: [0/1 | {r, g, b, a}],
   *   isQr: boolean
   * }
   */

  /**
   * 从图片数据生成像素格子
   * @param {ImageData} imageData - 图片像素数据
   * @param {number|Object} gridNum - 网格数量（单位量）
   *   如果是数字：表示行列数相同（正方形网格，如25表示25x25）
   *   如果是对象：[row, column]表示行列数不同
   * @param {Object} options - 选项
   * @param {string} options.mode - 'binary' | 'RGBA'，默认 'binary'
   * @param {boolean} options.detectQR - 是否检测二维码，默认 true
   * @param {number} options.threshold - 二值化阈值（0-255），默认自动计算
   * @returns {Object} 像素格子数据对象
   */
  PixelGridFromImageData(imageData, gridNum, options = {}) {
    const {
      mode = 'binary',
      detectQR = true,
      threshold = null
    } = options;

    // 解析网格数量参数
    let row, column;
    if (typeof gridNum === 'number') {
      row = gridNum;
      column = gridNum; // 正方形网格
    } else if (gridNum && Array.isArray(gridNum)) {
      [row,column] = gridNum;
    } else {
      throw new Error('gridNum must be a number or an array with [row, column]');
    }

    // 计算每个模块的尺寸（使用不同的缩放比例处理非正方形）
    const moduleSizeX = imageData.width / column;
    const moduleSizeY = imageData.height / row;

    // 计算阈值（如果是binary模式且未提供阈值）
    let actualThreshold = threshold;
    if (mode === 'binary' && actualThreshold === null) {
      let totalGray = 0;
      let pixelCount = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const alpha = imageData.data[i + 3];
        if (alpha > 10) {
          const gray = 0.2126 * imageData.data[i] + 
                      0.7152 * imageData.data[i + 1] + 
                      0.0722 * imageData.data[i + 2];
          totalGray += gray;
          pixelCount++;
        }
      }
      actualThreshold = pixelCount > 0 ? totalGray / pixelCount : 128;
    }

    // 生成矩阵
    const matrix = [];
    let isQr = false;

    // 采样并转换
    for (let y = 0; y < row; y++) {
      for (let x = 0; x < column; x++) {
        const startX = Math.floor(x * moduleSizeX);
        const endX = Math.floor((x + 1) * moduleSizeX);
        const startY = Math.floor(y * moduleSizeY);
        const endY = Math.floor((y + 1) * moduleSizeY);

        if (mode === 'binary') {
          // 二值化模式
          let sumGray = 0;
          let count = 0;
          let sumAlpha = 0;

            for (let py = startY; py < endY && py < imageData.height; py++) {
            for (let px = startX; px < endX && px < imageData.width; px++) {
              const idx = (py * imageData.width + px) * 4;
              if (idx < imageData.data.length) {
                const alpha = imageData.data[idx + 3];
                sumAlpha += alpha;

                if (alpha > 10) {
                  const gray = 0.2126 * imageData.data[idx] + 
                              0.7152 * imageData.data[idx + 1] + 
                              0.0722 * imageData.data[idx + 2];
                  sumGray += gray;
                  count++;
                }
              }
            }
          }

          const moduleArea = (endX - startX) * (endY - startY);
          const avgAlpha = moduleArea > 0 ? sumAlpha / moduleArea : 0;
          if (avgAlpha < 128) {
            matrix.push(null); // 透明标记（可选，根据需求可以返回其他值）
          } else if (count > 0) {
            const avgGray = sumGray / count;
            matrix.push(avgGray < actualThreshold ? 1 : 0);
          } else {
            matrix.push(0);
          }
        } else {
          // RGBA模式
          let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
          let count = 0;

          for (let py = startY; py < endY && py < imageData.height; py++) {
            for (let px = startX; px < endX && px < imageData.width; px++) {
              const idx = (py * imageData.width + px) * 4;
              if (idx < imageData.data.length) {
                sumR += imageData.data[idx];
                sumG += imageData.data[idx + 1];
                sumB += imageData.data[idx + 2];
                sumA += imageData.data[idx + 3];
                count++;
              }
            }
          }

          if (count > 0) {
            matrix.push({
              r: Math.round(sumR / count),
              g: Math.round(sumG / count),
              b: Math.round(sumB / count),
              a: Math.round(sumA / count)
            });
          } else {
            matrix.push({ r: 0, g: 0, b: 0, a: 0 });
          }
        }
      }
    }

    // 检测是否为二维码（通过定位区模式）
    // 二维码必须是正方形，所以只有当 row === column 时才检测
    if (detectQR && mode === 'binary' && row === column) {
      isQr = this._detectQRCodePattern(matrix, row, column);
    }

    return {
      type: mode,
      row: row,
      column: column,
      matrix: matrix,
      isQr: isQr
    };
  },

  /**
   * 从数据生成二维码像素格子
   * 需要硬编码定位区
   * @param {string} data - 要编码的数据
   * @param {Object} options - 选项
   * @param {Function} options.qrCodeGenerator - 二维码生成函数，接收data和options，返回矩阵对象
   * @param {Object} options.qrCodeOptions - 传递给二维码生成器的选项
   * @returns {Object} 像素格子数据对象（type: 'binary'）
   * 
   * @example
   * // 使用QRCode库（需要先引入）
   * const gridData = tool.PixelGridFromQRCode('Hello', {
   *   qrCodeGenerator: (data, opts) => {
   *     const qr = new QRCode({ text: data, ...opts });
   *     return {
   *       moduleCount: qr._htOption.width,
   *       isDark: (x, y) => qr._oQRCode.isDark(y, x)
   *     };
   *   }
   * });
   */
  PixelGridFromQRCode(data, options = {}) {
    const {
      qrCodeGenerator = null,
      qrCodeOptions = {}
    } = options;

    // 如果没有提供生成器，尝试使用全局QRCode
    let qrMatrix = null;
    let moduleCount = 0;

    if (qrCodeGenerator && typeof qrCodeGenerator === 'function') {
      // 使用自定义生成器
      qrMatrix = qrCodeGenerator(data, qrCodeOptions);
      moduleCount = qrMatrix.moduleCount || qrMatrix.width || qrMatrix.dimension;
    } else if (typeof QRCode !== 'undefined') {
      // 尝试使用全局QRCode库（兼容不同的QRCode库）
      try {
        // 方式1：new QRCode() 构造函数
        if (typeof QRCode === 'function' && QRCode.prototype) {
          const tempDiv = document.createElement('div');
          const qr = new QRCode(tempDiv, {
            text: data,
            width: 256,
            height: 256,
            ...qrCodeOptions
          });
          
          // 尝试获取矩阵
          if (qr._oQRCode) {
            moduleCount = qr._oQRCode.getModuleCount();
            qrMatrix = {
              isDark: (x, y) => qr._oQRCode.isDark(y, x)
            };
          }
        }
      } catch (e) {
        throw new Error('QRCode library found but failed to generate matrix: ' + e.message);
      }

      if (!qrMatrix) {
        throw new Error('QRCode library found but cannot extract matrix. Please provide qrCodeGenerator function.');
      }
    } else {
      throw new Error('QRCode library not found and no qrCodeGenerator provided. Please include qrcode.js or provide a custom generator.');
    }

    // 提取模块数据
    const matrix = [];
    for (let y = 0; y < moduleCount; y++) {
      for (let x = 0; x < moduleCount; x++) {
        const isDark = qrMatrix.isDark(x, y);
        matrix.push(isDark ? 1 : 0);
      }
    }

    return {
      type: 'binary',
      row: moduleCount,
      column: moduleCount,
      matrix: matrix,
      isQr: true
    };
  },

  /**
   * 将像素格子数据转换为SVG
   * 支持use元素和硬编码定位区（二维码），定位区支持圆角联动
   * @param {Object} gridData - 像素格子数据对象
   * @param {Object} options - 选项
   * @param {string} options.fillColor - 填充色，默认 '#000000'
   * @param {string} options.bgColor - 背景色，默认 '#ffffff'
   * @param {boolean} options.useHardcodedFinder - 是否使用硬编码定位区（二维码），默认 true
   * @param {number} options.finderRadius - 定位区圆角值（单位量），默认 0。3x3中心块的圆角，外围会根据此值联动
   * @returns {string} SVG字符串
   */
  PixelGridToSVG(gridData, options = {}) {
    const {
      fillColor = '#000000',
      bgColor = '#ffffff',
      useHardcodedFinder = true,
      finderRadius = 0, // 定位区圆角值（单位量），0表示无圆角
    } = options;

    const { type, row, column, matrix, isQr } = gridData;
    // 二维码必须是正方形，但普通像素格子可以是非正方形
    const isSquare = row === column;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${column} ${row}" width="100%" height="100%">`;
    svg += `<defs>`;

    if (type === 'binary') {
      // rect模板：黑白
      svg += `<rect id="cell-fill" fill="${fillColor}" width="1" height="1"/>`;
      svg += `<rect id="cell-bg" fill="${bgColor}" width="1" height="1"/>`;
      
      // 二维码定位区模板（硬编码，只有正方形时才使用）
      // 定位区结构：7x7黑色底，5x5白色块，3x3黑色块，支持圆角联动
      // 圆角联动规则：以3x3中心块为基准，圆角按比例缩放
      // 例如：3x3圆角为10（单位量），则5x5圆角为10*(5/3)=16.67，7x7圆角为10*(7/3)=23.33
      // 注意：SVG的rx属性不支持calc()，所以圆角值需要在生成时计算
      if (isQr && useHardcodedFinder && isSquare) {
        const dimension = row; // 二维码必须是正方形
        
        // 圆角计算（按比例联动）
        // 3x3中心块：基准圆角
        // 5x5白色块：基准圆角 * (5/3)
        // 7x7黑色底：基准圆角 * (7/3)
        const rx3 = finderRadius; // 3x3中心块圆角（单位量）
        const rx5 = finderRadius * (5/3); // 5x5白色块圆角
        const rx7 = finderRadius * (7/3); // 7x7黑色底圆角
        
        // 通用定位区模板（所有定位区共用同一个模板）
        svg += `<g id="finder-pattern">`;
        // 7x7黑色底
        svg += `<rect data-qr-finderout x="0" y="0" width="7" height="7" fill="${fillColor}"${rx7 > 0 ? ` rx="${rx7}"` : ''}/>`;
        // 5x5白色块
        svg += `<rect data-qr-findermid x="1" y="1" width="5" height="5" fill="${bgColor}"${rx5 > 0 ? ` rx="${rx5}"` : ''}/>`;
        // 3x3黑色块（中心块，基准圆角）
        svg += `<rect data-qr-finderin x="2" y="2" width="3" height="3" fill="${fillColor}"${rx3 > 0 ? ` rx="${rx3}"` : ''}/>`;
        svg += `</g>`;
      }
      
      svg += `</defs>`;

      // 二维码定位区坐标（硬编码，只有正方形时才使用）
      if (isQr && useHardcodedFinder && isSquare) {
        const dimension = row; // 二维码必须是正方形
        const finderPatterns = [
          { x: 0, y: 0 },                    // 左上
          { x: dimension - 7, y: 0 },        // 右上
          { x: 0, y: dimension - 7 }         // 左下
        ];

        svg += `<rect data-qr-bg fill="${bgColor}" width="${column}" height=" ${row}"/>`;
        // 先绘制定位区（二维码），使用同一个模板
        finderPatterns.forEach(pattern => {
          svg += `<use xlink:href="#finder-pattern" x="${pattern.x}" y="${pattern.y}"/>`;
        });
      }
      svg += '<g data-qr-cells>';
      // 绘制数据区域（使用use元素）
      for (let y = 0; y < row; y++) {
        for (let x = 0; x < column; x++) {
          const index = y * column + x; // 使用 column
          const value = matrix[index];

          // 跳过定位区（二维码，只有正方形时才有定位区）
          if (isQr && useHardcodedFinder && isSquare) {
            const dimension = row;
            const inTopLeft = x < 7 && y < 7;
            const inTopRight = x >= dimension - 7 && y < 7;
            const inBottomLeft = x < 7 && y >= dimension - 7;
            if (inTopLeft || inTopRight || inBottomLeft) {
              continue; // 跳过定位区
            }
          }

          // 跳过透明区域（null值）
          if (value === null || value === undefined) {
            continue;
          }

          const templateId = value === 1 ? 'cell-fill' : 'cell-bg';
          
          // 如果是黑色填充块且需要缩放，应用以中心为缩放点的变换
          // SVG transform 从右到左执行：
          // 1. translate(-0.5, -0.5) - 将 rect 从 (0,0) 移动到 (-0.5, -0.5)，使 rect 中心在原点
          // 2. scale(s) - 以原点为中心缩放
          // 3. translate(0.5, 0.5) - 移回，使 rect 中心回到 (0.5, 0.5)
          // 最终 rect 中心仍在 (0.5, 0.5)，但尺寸按比例缩放
          if (value === 1) {
            svg += `<use data-qr-cell xlink:href="#${templateId}" x="${x}" y="${y}"/>`;
          } else {
            svg += `<use data-qr-cell xlink:href="#${templateId}" x="${x}" y="${y}"/>`;
          }
        }
      }
      svg += '</g>';
    } else {
      // RGBA模式：彩色块直接使用rect，不用use
      svg += `</defs>`;
      
      for (let y = 0; y < row; y++) {
        for (let x = 0; x < column; x++) {
          const index = y * column + x; // 使用 column
          const pixel = matrix[index];
          
          if (pixel && pixel.a > 0) {
            const color = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
            const opacity = pixel.a / 255;
            svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" opacity="${opacity}"/>`;
          }
        }
      }
    }

    svg += '</svg>';
    return svg;
  },

  /**
   * 检测是否为二维码模式（通过定位区）
   * @private
   * @param {Array} matrix - 矩阵数据
   * @param {number} row - 行数
   * @param {number} column - 列数（二维码必须是正方形，但为了通用性保留参数）
   * @returns {boolean} 是否为二维码
   */
  _detectQRCodePattern(matrix, row, column) {
    const dimension = row; // 二维码必须是正方形
    if (row !== column) return false; // 非正方形肯定不是二维码
    // 检查三个定位区是否存在
    // 定位区特征：7x7的固定模式
    // 外框7x7全黑，内框5x5全白，中心3x3全黑
    
    const finderPattern = [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ];

    // 检查定位区（允许一定的容错）
    const checkFinder = (startX, startY) => {
      if (startX + 7 > column || startY + 7 > row) return false;
      let matchCount = 0;
      let totalCount = 0;
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          const index = (startY + y) * column + (startX + x); // 使用 column
          if (index >= 0 && index < matrix.length) {
            const expected = finderPattern[y][x];
            const actual = matrix[index];
            totalCount++;
            // 匹配判断：值相等，或实际值为null且期望值为0（透明视为白色）
            if (actual === expected || (actual === null && expected === 0)) {
              matchCount++;
            }
          }
        }
      }
      // 允许一定的误差（75%匹配度，因为可能受到图像质量影响）
      return totalCount > 0 && matchCount >= totalCount * 0.75;
    };

    // 检查三个定位区（至少检测到两个就算成功，因为可能被裁剪）
    const hasTopLeft = checkFinder(0, 0);
    const hasTopRight = column >= 7 ? checkFinder(column - 7, 0) : false;
    const hasBottomLeft = row >= 7 ? checkFinder(0, row - 7) : false;

    // 至少需要检测到两个定位区（考虑到可能被裁剪的情况）
    const foundCount = [hasTopLeft, hasTopRight, hasBottomLeft].filter(Boolean).length;
    return foundCount >= 2;
  }

});


