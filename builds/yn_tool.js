/**
 * Base64转Uint8Array
 */
function B64ToU8A(b64) {
  const padding = '='.repeat((4 - b64.length % 4) % 4);
  const base64 = (b64 + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const rawDataLength = rawData.length;
  const array = new Uint8Array(new ArrayBuffer(rawDataLength));

  for (let i = 0; i < rawDataLength; i += 1) {
    array[i] = rawData.charCodeAt(i);
  }

  return array;
}

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
  const base64 = btoa(binaryString);
  base64 = type && filetype[type.toLowerCase()] ? filetype[type.toLowerCase()] + base64 : base64;
  return base64;
}

/**
 * Canvas转Uint8Array
 */
function CanvasToU8A(canvas){
  let dataUrl = canvas.toDataURL('image/png');
  return new Uint8Array(B64ToU8A(dataUrl.split(',')[1]));
};

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
}

/* ---核心功能--- */

function CUT_IMAGE(image,mix){
  return new Promise((resolve,reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
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