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
TOOL_JS()
function TOOL_JS() {
/**
 * Base64转Uint8Array
 */
function B64ToU8A(b64) {
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
};
TOOL_JS.prototype.B64ToU8A = B64ToU8A;

/**
 * Uint8Array转Base64
 */
function U8AToB64(u8,type) {
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
};
TOOL_JS.prototype.U8AToB64 = U8AToB64;

/**
 * Canvas转Uint8Array
 */
function CanvasToU8A(canvas){
  let dataUrl = canvas.toDataURL('image/png');
  return new Uint8Array(B64ToU8A(dataUrl.split(',')[1]));
};
TOOL_JS.prototype.CanvasToU8A = CanvasToU8A;

/**
 * 中英文字数限制兼容
 */
function TextMaxLength(text,max,add){
  let newtext = text.toString();
  add = add ? add : '';
  let lengthE = newtext.replace(/[\u4e00-\u9fa5]/g,'').length*1;
  let lengthZ = newtext.replace(/[^\u4e00-\u9fa5]/g,'').length*2;
  if(lengthZ > lengthE){
      if((lengthE + lengthZ) > max){
        newtext = newtext.substring(0,(max/2 + 1)) + add;
      }
  } else {
      if((lengthE + lengthZ) > max){
        newtext = newtext.substring(0,(max + 1)) + add;
      }
  }
  return newtext;
};
TOOL_JS.prototype.TextMaxLength = TextMaxLength;

function CUT_IMAGE(image,mix){
  return new Promise((resolve,reject) => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    requestAnimationFrame(function draw() {
      // 绘制图片
      ctx.drawImage(image, 0, 0);
      let cutAreas = CUT_AREA({ w: canvas.width, h: canvas.height, x: 0, y: 0, s: 1 },mix | 4096);
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
          let imgData = CanvasToU8A(canvas2);//new Uint8Array(ctx2.getImageData(0, 0, w, h).data);
          cuts.push({ img: imgData, w: w, h: h, x: x, y: y });
          if (i == cutAreas.length - 1) {
            resolve(cuts);
          };
        };
      };
    });
  });
};
TOOL_JS.prototype.CUT_IMAGE = CUT_IMAGE;

/**
 * 均匀裁切方案，可用于瓦片切图和长图分割
 * @param { object } info - {w:,h:,x:,y:,s:}原始宽高、坐标(如有)、栅格化倍率(如有)
 * @param { number } mix - 4096 | 2048 | 1024
 */
function CUT_AREA(info,mix) {
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
    return [{w:W,h:H,x:X,y:Y,s:s}];
  } else {
    cutW = Math.ceil((W * info.s) / mix);
    cutH = Math.ceil((H * info.s) / mix);
    Ws = Math.ceil(W / cutW);
    Hs = Math.ceil(H / cutH);
    lastWs = W - (Ws * (cutW - 1));//有小数点则向上取整，最后一截短一些
    lastHs = H - (Hs * (cutH - 1));

    for (let i = 0; i < (cutW * cutH); i++) {
      if ((i + 1) % cutW == 0 && i !== (cutW * cutH) - 1 && i !== 0) {
        cutAreas.push({ w: lastWs, h: Hs, x: X, y: Y, s:s});
        Y = Y + Hs;
        X = info.x;
      } else if (i == (cutW * cutH) - 1) {
        cutAreas.push({ w: lastWs, h: lastHs, x: X, y: Y, s:s});
      } else {
        if (i > (cutW * (cutH - 1)) - 1) {
          cutAreas.push({ w: Ws, h: lastHs, x: X, y: Y, s:s});
        } else {
          cutAreas.push({ w: Ws, h: Hs, x: X, y: Y, s:s});
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
  };
};
TOOL_JS.prototype.CUT_AREA = CUT_AREA;

function TrueImageFormat(file) {
  return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function(e) {
          let arrayBuf = new Uint8Array(e.target.result);
          // 检查JPEG、PNG、GIF、BMP的魔数
          if (arrayBuf[0] === 0xFF && arrayBuf[1] === 0xD8 && arrayBuf[2] === 0xFF) {
              resolve('jpeg');
          } else if (arrayBuf[0] === 0x89 && arrayBuf[1] === 0x50 && arrayBuf[2] === 0x4E && arrayBuf[3] === 0x47) {
              resolve('png');
          } else if (arrayBuf[0] === 0x47 && arrayBuf[1] === 0x49 && arrayBuf[2] === 0x46 && arrayBuf[3] === 0x38) {
              resolve('gif');
          } else if (arrayBuf[0] === 0x42 && arrayBuf[1] === 0x4D) {
              resolve('bmp');
          } else {
              reject(new Error('Invalid image format'));
          }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
  });
};
TOOL_JS.prototype.TrueImageFormat = TrueImageFormat;

/**
 * 将md格式文案转为节点式对象，以便转为图层
 * @param {string} mdText - md格式文案
 * @returns {Array} {zytype:'md',nodes:[
 * {
 * type: h | p | code | ul | ol | table ...,
 * content: string | [{style:'normal' | 'bold' | 'italic' | 'strike', content: ...}]
 * items?:[{content:...}]
 * }
 * ]}
 */
function MdToObj(mdText) {
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

  lines.forEach((line,index) => {
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
      currentCodeBlock.content.push(line.trim());
      if(line.trim() == '```'){
        currentCodeBlock = null;
        inCodeBlock = false;
      }
    }

    
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
      }
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

    // 引用处理
    let quoteMatch = line.match(/^>\s*(.*)/);
    if (quoteMatch) {
      if (!currentQuote) {
        currentQuote = { type: 'blockquote', content: [] };
        ast.push(currentQuote);
      }
      currentQuote.content.push(quoteMatch[1]);
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
    if (text.match(/`(.*?)`/) && !text.match(/```(.*?)```/))  return text.replace('`','').substring(0,text.length - 2);
    

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
  }

  return {zytype:'md',nodes:ast};
};
TOOL_JS.prototype.MdToObj = MdToObj;

async function SvgToObj(svgText)  {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
  const svgRoot = svgDoc.documentElement;
  const allUses = Array.from(svgRoot.querySelectorAll('use'));
  const allRects = Array.from(svgRoot.querySelectorAll('rect'));
  const allClips = Array.from(svgRoot.querySelectorAll('clipPath'));
  const allMasks = Array.from(svgRoot.querySelectorAll('mask'));

  try {
    const images = await traverse(svgRoot);
    console.log('Found images:', images);
    return {zyType: 'svg', nodes: images};
  } catch (error) {
    console.error('Error processing SVG:', error);
    return {zyType: null, nodes: null};
  }

  function GetAttributes(node){
    if(!node.attributes) return null;
    return Array.from(node.attributes).reduce((obj, attr) => {
      obj[attr.name] = attr.value;
      return obj;
    }, {})
  }

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
                  img: B64ToU8A(b64data),
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
              img.onload = async ()=>{
                try {
                  let cuts = await CUT_IMAGE(img)
                  resolveImg({attributes,cuts:cuts})
                } catch {
                  resolveImg({ attributes, cuts: null });
                };
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
};
TOOL_JS.prototype.SvgToObj = SvgToObj;

/**==========压缩图片模块==========
!!! 需引入依赖：UPNG.js + jszip.js
!!! 传入的必须是可编辑的图片信息数组，压缩会返回一个数据缓存，避免重复执行压缩
*/

/**
 * 批量压缩图片并导出为zip
 * @param {[object]} imgExportData
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
async function ExportImgByData(callback,imgExportData,isFinal,zipName){
  if(imgExportData.length > 0){
    try {
      const compressedImages = await CompressImages(callback,imgExportData,isFinal);
      CreateZipAndDownload(compressedImages,imgExportData,zipName);
    } catch (error) {
      console.error('处理过程中发生错误:', error);
    };
  };
};
TOOL_JS.prototype.ExportImgByData = ExportImgByData;

/**
 * 单个图片的压缩
 * @param {Blob} blob - 传入一个png文件的blob，
 * @param {number} quality - 压缩质量 1~10
 * @param {string} type -输出的格式 png | jpg | jpeg | webp
 */
function CompressImage(blob,quality,type) {
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
    };
};
TOOL_JS.prototype.CompressImage = CompressImage;

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
async function CompressImages(callback,imgExportData,isFinal) {
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
        if(!targetSize[i]){
          result = await CompressImage(newBlob, 10,type[i]);
          let finalSize = Math.floor(result.size/10.24)/100;
          callback(i,finalSize,quality,true);
        } else {
          do {
            try {
              result = await CompressImage(newBlob, quality,type[i]);
              if (targetSize[i] && result.size > targetSize[i] && quality > 1) {
                if ( quality - 1 >= 0){
                  console.log("压缩质量:" + quality )
                  quality -= 1; // 如果超过目标大小，减少质量再次尝试
                } else {
                  quality = 0;
                };
                
              } else {
                let finalSize = Math.floor(result.size/10.24)/100;
                if ( result.size <= targetSize[i] ){
                  callback(i,finalSize,quality,true);
                } else {
                  callback(i,finalSize,quality,false);
                }
                break;
              };
            } catch (error) {
              console.error('压缩过程中发生错误:', error);
              break;
            }
          } while (result.size > targetSize[i]);
        };
        compressedImages.push(result);
        imgExportData[i].compressed = result;
      };
    }else{
      compressedImages.push(null);
    };
  };
  return compressedImages;
};
TOOL_JS.prototype.CompressImages = CompressImages;

/**
 * 创建ZIP文件并提供下载
 * @param {[blob]} fileBlobs 
 * @param {[object]} fileInfos [{fileName: ../xx/name,format: string}]
 * @param {string | null} zipName
 */
function CreateZipAndDownload(fileBlobs,fileInfos,zipName) {
  let timeName = getDate('YYYYMMDD')[0].slice(2) + '_' + getTime('HHMMSS')[0]
  let zip = new JSZip();

  if(!fileBlobs.every(item => item == null)){
    fileBlobs.forEach((blob, index) => {
      if(blob){
        let path = fileInfos[index].fileName.split('/');
        let name = path.pop() + '.' + fileInfos[index].format.toLowerCase();
        if (fileInfos[index].fileName.split('/').length == 2) {
          let folder = zip.folder(path[0]);
          folder.file(name,blob);
        } else if (fileInfos[index].fileName.split('/').length == 3) {
          let folder1 = zip.folder(path[0]);
          let folder2 = folder1.folder(path[1]);
          folder2.file(name,blob);
        } else if (fileInfos[index].fileName.split('/').length == 4) {
          let folder2 = zip.folder(path[0]);
          let folder3 = folder2.folder(path[2]);
          folder3.file(name,blob);
        } else {
          zip.file(name,blob);
        };
      };
    });
  
  
    zip.generateAsync({ type: "blob" }).then(function (content) {
      zipName = zipName ? zipName : ''
      saveAs(content,zipName + timeName + '.zip');
    });
  };
};
TOOL_JS.prototype.CreateZipAndDownload = CreateZipAndDownload;

}
