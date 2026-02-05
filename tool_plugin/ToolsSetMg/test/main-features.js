//============= 功能快速通信（策略模式） ==============
// 带数据通信的单击功能映射
const SKILL_STRATEGIES = {
  'Pixel As Copy': () => sendPixel('Pixel As Copy'),
  'Pixel Overwrite': () => sendPixel('Pixel Overwrite'),
  'Split By Conditions': () => sendSplit('tags'),
  'Split By Symbol': () => sendSplit('inputs'),
  'Apply Preset': () => sendTableSet('style'),
  'Set R/C': () => sendTableSet('set'),
  'Add Row': () => sendTableSet('add'),
  'Reduce Row': () => sendTableSet('reduce'),
  'Rows of Cells': () => sendTablePick('row'),
  'Rows of Block': () => sendTablePick('allrow'),
  'Cells Block': () => sendTablePick('block'),
  'Cells Inline': () => sendTablePick('inline'),
  'Up Export-set': () => upSelect('exportset'),
  'Up Default': () => upSelect('default'),
  'Create New QRcode': () => createNewQRcode(true),
  'Shadow-stroke Css': () => createShadowStroke('css'),
  'Add Shadow-stroke': () => createShadowStroke('reset'),
  'Merge Character': () => mergeText('character'),
  'Merge Keep Style': () => mergeText('all'),
  'Create Paint Style': () => createPaintStyle(),
};

// 带数据通信的双击功能映射
const SKILL_DBLCLICK_STRATEGIES = {
  // 示例：如果有特定双击处理，可以在这里添加
  // 'Pixel As Copy': () => sendPixelDoubleClick('Pixel As Copy'),
  // 'Mapping Names': () => sendTableDoubleClick('mapName'),
  'Create New QRcode': () => createNewQRcode(),
  'Add Shadow-stroke': () => createShadowStroke('add')
};
/**
 * 通过data-skill-click/dblclick属性（收集进DOM.skillBtnMain）,为按钮添加点击即执行的功能，单击和双击事件分开处理
 * 功能通信机制
 * 1. 单击功能映射：默认直接发送功能名称，由主线程执行，如果需携带数据，添加映射到单击功能映射表
 * 2. 双击功能映射：默认直接发送功能名称+是否是双击，由主线程执行，如果需携带数据，添加映射到双击功能映射表
 * 
 */
DOM.skillBtnMain.forEach(btn => {
  let clickTimer = null;
  
  // 双击事件处理
  btn.addEventListener('dblclick',()=>{
    // 清除单击事件的定时器
    if(clickTimer){
      clearTimeout(clickTimer);
      clickTimer = null;
    };
    
    const skillname = btn.getAttribute('data-en-text');
    if(btn.getAttribute('data-btn-dblclick') !== null && skillname){
      const strategy = SKILL_DBLCLICK_STRATEGIES[skillname];
      if (strategy) {
        strategy();
      } else {
        toolMessage(['',skillname],PLUGINAPP);
      }
      
    };
  });
  
  // 单击事件处理（带防抖）
  btn.addEventListener('click',()=>{
    const skillname = btn.getAttribute('data-en-text') || btn.getAttribute('data-tips-text-en');
    if (!skillname) return;
    
    // 清除之前的定时器
    if(clickTimer){
      clearTimeout(clickTimer);
    };
    
    // 设置新的定时器
    clickTimer = setTimeout(()=>{
      const strategy = SKILL_STRATEGIES[skillname];
      if (strategy) {
        strategy();
      } else {
        toolMessage([true,skillname],PLUGINAPP);
      }
      clickTimer = null;
    }, DELAY.SKILL_CLICK);
    
    if(btn.getAttribute('data-btn-dblclick') !== null){
      tipsAll(['带两点的按钮，单/双击时功能有差异',"For btn with 2 dot, the logic of dbl-click is different"],4000,4);
    }
  });
});


// 更多功能 > 返回裁切方案以栅格化
function sendPixel(name){
  let mix = DOM.skillAllBox.querySelector('[data-pixel-mix]').getAttribute('data-select-value').split('≤ ')[1].split('px')[0]*1;
  let s = DOM.pixelScale.value;
  let cuts = [];
  tipsAll(MESSAGES.READING, State.get('selectNodeInfo').length * 800);
  setTimeout(()=>{
    State.get('selectNodeInfo').forEach((item) => {
    let cut = tool.CUT_AREA({w:item.w,h:item.h,x:0,y:0,s:s},mix);
    cuts.push(cut);
  });

  toolMessage([cuts,name],PLUGINAPP);
  },100);
};

// 更多功能 > 斜切拉伸
function sendTransform(){
  let data = {
    x: DOM.skewSetX.value * 1,
    y: DOM.skewSetY.value * 1,
    w: DOM.scaleSetX.value * 1,
    h: DOM.scaleSetY.value * 1,
  }
  toolMessage([data,'transformMix'],PLUGINAPP);
};

// 更多功能 > 拆分文本-按条件标签选中/按符号选中
function sendSplit(type){
  if(type == 'tags'){
    let tagsBox = getElementMix('data-split-tags').querySelectorAll('[data-check-checked="true"]');
    let tags = [];
    tagsBox.forEach(item => {
      let tag = item.querySelector('[data-split-info="name"]').getAttribute('data-en-text');
      tags.push(tag);
    });
    //console.log(tags)
    toolMessage([[tags,'tags'],'splitText'],PLUGINAPP);
  };
  if(type == 'inputs'){
    let inputs = document.getElementById('split-word').value;
    let type = document.querySelector('[data-splitword-set]').getAttribute('data-radio-value');
    toolMessage([[[inputs,type],'inputs'],'splitText'],PLUGINAPP);
  };
};

DOM.mapGetGet.addEventListener('click',()=>{
  sendTable('get');
});
DOM.mapGetMap.addEventListener('click',()=>{
  sendTable('map');
});

// 表单页 > 表格设置-按名称/文本/属性/标签来映射及获取数据
function sendTable(mapOrGet){
  let dataText = getElementMix('upload-tablearea').value.trim();
  if(mapOrGet == 'map' && dataText === '') return;
  
  let data = '';
  let clone = true;
  let reduce = false;
  let enters = getElementMix('input-linefeed').value;
  let nulls = getElementMix('input-nulldata').value;
  let datatype = getElementMix('data-mapget-type').getAttribute('data-radio-value');
  let type = mapOrGet + datatype;
  
  if(type == 'mapName' || type == 'mapText' ){
    data = tableTextToArray(dataText,true);
  };
  if(type == 'mapPro' || type == 'mapTag' ){
    data = tableArrayToObj(tableTextToArray(dataText))
    data = tool.convertColorsInJsonData(data);
  };
  if(type.includes('map')){
    clone = getElementMix('switch-autoclone').checked;
    reduce = getElementMix('switch-autoreduce').checked;
  };
  //console.log(data);
  toolMessage([{data:data,clone:clone,reduce:reduce,enters:enters,nulls:nulls},type],PLUGINAPP);
};


// 表单页 > 应用预设样式
function applyTableStyleStrategy(data){
  let styleFillId = null;
  let styleBodId = null;
  if(data && data[0]){
    styleFillId = data[0];
  }else{
    styleFillId = DOM.tableStyleSetFill.getAttribute('data-radio-value');
  }
  if(data && data[1]){
    styleBodId = data[1];
  }else{
    styleBodId = DOM.tableStyleSetBod.getAttribute('data-radio-value');
  }
  let fill = 1;
  let bod = [1,1,1,1];
  switch(styleFillId){
    case '2':
      fill = 'rowSpace';
    break;
    case '3':
      fill = 'columnSpace';
    break;
    case '4':
      fill = '0';
    break;
    case null:
      fill = null;
    break;
  };
  switch(styleBodId){
    case '2':
      bod = [1,0,1,0];
      break;
    case '3':
      bod = [0,1,0,1];
      break;
    case '4':
      bod = [0,0,0,0];
      break;
    case null:
      bod = [null,null,null,null];
    break;
  }
  let styleAll = {
    td:[...bod,fill],
    th:[...bod,1]
  };

  toolMessage([[styleAll,'style'],'reTable'],PLUGINAPP);

};
//表单页 > 表格样式预设，单击直接应用
DOM.tableStyleSetFill.querySelectorAll('[data-radio-data]').forEach(item => {
  let selects = ROOT.getAttribute('data-selects');
  if(selects == 'true'){
    item.addEventListener('click',()=>{
      applyTableStyleStrategy([item.getAttribute('data-radio-data'),null]);
    });
  }
});
DOM.tableStyleSetBod.querySelectorAll('[data-radio-data]').forEach(item => {
  let selects = ROOT.getAttribute('data-selects');
  if(selects == 'true'){
    item.addEventListener('click',()=>{
      applyTableStyleStrategy([null,item.getAttribute('data-radio-data')]);
    });
  }
});

// 表单页 > 设置行列
function setTableRowColStrategy(){
  let H = getElementMix('table-column-num').value * 1;
  let V = getElementMix('table-row-num').value * 1;
  toolMessage([[[H,V],'set'],'reTable'],PLUGINAPP);
};

const TABLE_SET_FUNCTIONS = {
  'style': applyTableStyleStrategy,
  'set': setTableRowColStrategy,
  'add': () => toolMessage([[[0,1],'add'],'reTable'],PLUGINAPP),
  'reduce': () => toolMessage([[[0,-1],'reduce'],'reTable'],PLUGINAPP),
};

// 表单页 > 执行表格设置功能
function sendTableSet(type){
  const strategy = TABLE_SET_FUNCTIONS[type];
  if (!strategy) {
    console.warn(`Unknown table set type: ${type}`);
    return;
  }
  strategy();
};

// 表单页 > 按单元格所在行/多单元格所在行/单元格形成框选区域/单元格形成连续区域 选中单元格
function sendTablePick(type){
  toolMessage([type,'pickTable'],PLUGINAPP);
};

// 导出页 > 按导出设置/默认设置、导出类型上传所选图层
function upSelect(type){
  let exporttype = getElementMix('data-exporttype-set').getAttribute('data-radio-value');
  let types = ['image','zy','rich']
  toolMessage([[types[exporttype - 1],type],'upSelect'],PLUGINAPP);
};

// 更多功能 > 生成新二维码
function createNewQRcode(isComp){
  let data = [];
  let chk1 = DOM.checkQrcodeImage.checked;
  let chk2 = DOM.checkQrcodeData.checked;
  //是否是组件化生成
  if(isComp){
    // PixelGridFromImageData / QR 识别 / 文本生成 返回的像素栅格数据（固定两个槽位）
    // data[0]：图片生成的像素栅格
    // data[1]：初始化二维码示例 / 后续 qrcode 文本生成 / 识别得到的像素栅格
    let gridData = null;
    try{
      if(typeof State !== 'undefined'){
        gridData = State.get('qrcodePixelGrid');
      }
    }catch(e){
      console.warn('createNewQRcode: 访问 State 失败', e);
    }
    if(gridData[0] && chk1){
      data.push(gridData[0]);
    }
    if(gridData[1] && chk2){
      data.push(gridData[1]);
    }
    if(data.length === 0){
      return;
    }
    //console.log(data)
    toolMessage([data,'createNewQRcodeComp'],PLUGINAPP);

  }else{
    let svg1 = DOM.qrcodeImageResult.innerHTML;
    let svg2 = DOM.qrcodeDataResult.innerHTML;
    if(svg1 !== '' && svg1.includes('svg') && chk1){
      if(svg1.includes('finder-pattern')){
        data.push({type:'image',svg:svg1});
      } else {
        data.push({type:'data',svg:svg1});
      }
    }
    if(svg2 !== '' && svg2.includes('svg') && chk2){
      data.push({type:'data',svg:svg2});
    }
    if(data.length === 0){
      return;
    }
    toolMessage([data,'createNewQRcode'],PLUGINAPP);
  }
  
};

// 更多功能 > 生成伪描边
function createShadowStroke(type){
  let color = DOM.shadowStrokeColor.getAttribute('data-color-hex');
  let num = DOM.shadowStrokeNum.value*1;//.getAttribute('data-select-value').split('x')[1]*1;
  let width = DOM.shadowStrokeWidth.value*1;
  toolMessage([{type:type,color:color,num:num,width:width},'createShadowStroke'],PLUGINAPP);
};

// 更多功能 > 合并文本
function mergeText(type){
  let order =  DOM.mergeOrder.getAttribute('data-radio-value');
  toolMessage([[type,order],'mergeText'],PLUGINAPP);
};

// 更多功能 > 创建样式
function createPaintStyle(){
  let data = getElementMix('input-styledata').value.trim();
  if(data === '' || !data.includes('name\tcolor')) return;
  let dataArray = data.split('\n').map(item => item.split('\t'));
  let styleAll = [];
  let names = dataArray.map(item => item[0]);
  if(names.length !== new Set(names).size) {
    tipsAll(['名称重复,请检查','Name duplicate, please check'],1000);
    return;
  }
  dataArray.forEach((item) => {
    if(!item[0] || !item[1]) {
      tipsAll(['数据格式错误','Error format data'],1000);
      return;
    }
    let color = getcolorTypeOrHex(item[1]);
    log(color)
    if(color) styleAll.push([item[0],color]);
  });
  if(styleAll.length === 0) return;
  toolMessage([styleAll,'createPaintStyle'],PLUGINAPP);
};