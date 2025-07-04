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