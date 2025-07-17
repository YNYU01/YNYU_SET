/*
- [ToolsSet 工具集1.0]
- ©版权所有：2024-2025 YNYU @lvynyu2.gmail.com
- 禁止未授权的商用及二次编辑
- 禁止用于违法行为，如有，与作者无关
- 二次编辑需将引用部分开源
- 引用开源库的部分应遵循对应许可
- 使用当前代码时禁止删除或修改本声明
*/
let UI_MINI = [200,460];
let UI = [300,660];
let UI_BIG = [620,660];
let vX = figma.viewport.bounds.x,vY = figma.viewport.bounds.y;
figma.skipInvisibleInstanceChildren = true;//忽略不可见元素及其子集
 
figma.showUI(__html__,{position:{x:vX,y:vY},themeColors:true});
figma.ui.resize(UI[0], UI[1]);

//核心功能
figma.ui.onmessage = (message) => { 
    const info = message[0]
    const type = message[1]
    //console.log(message)
    //获取用户偏好
    if ( type == "getlocal"){
        figma.clientStorage.getAsync(info)
        .then (data => {
            postmessage([data,info]);
        })
        .catch (error => {
        })
    };
    //设置用户偏好
    if ( type == "setlocal"){
        //console.log(info)
        figma.clientStorage.setAsync(info[0],info[1]);
    };
    //按需发送选中内容信息
    if ( type == "selectInfo"){
        sendInfo();
    };
    //插件自由缩放
    if ( type == "resize"){
        figma.ui.resize(info[0], info[1]);
    };
    //插件最大化
    if ( type == "big"){
        if (info){
            figma.ui.resize(UI_BIG[0], UI_BIG[1]);  
        } else {
            figma.ui.resize(UI[0], UI[1]);
        };
    };
    //双击底部获取当前节点信息(开发用)
    if ( type == "getnode"){
        if (figma.currentPage.selection.length > 0){
            console.log("当前节点信息：");
            console.log(figma.currentPage.selection[0]);
        } else {
            //console.log(figma.currentPage.parent)
            console.log("未选中对象");
        };
    };
    //批量导入大图
    if ( type == "createImage"){
        //console.log(info)
        let viewX = Math.floor( figma.viewport.center.x - ((figma.viewport.bounds.width/2  - 300)* figma.viewport.zoom));
        let viewY = Math.floor( figma.viewport.center.y - ((figma.viewport.bounds.height/2  - 300)* figma.viewport.zoom));
        let gap = 20;
        for ( let i = 0; i < info.length; i++){
            if (info[i].cuts.length > 1){
                let node = addFrame([info[i].w,info[i].h,viewX,viewY,info[i].n,[]]);
                info[i].cuts.forEach((item,index) => {
                addImg(node,{w:item.w,h:item.h,x:item.x,y:item.y,n:'cut ' + (index + 1),img:item.img});
                });
            } else {
                addImg(a,{w:info[i].w,h:info[i].h,x:viewX,y:viewY,n:info[i].n,img:info[i].cuts[0].img});
            }
            viewX += info[i].w + gap;
        }
    };
    //批量创建画板
    if ( type == "createFrame"){
        //console.log(info)
        let viewX = Math.floor( figma.viewport.center.x - ((figma.viewport.bounds.width/2  - 300)* figma.viewport.zoom));
        let viewY = Math.floor( figma.viewport.center.y - ((figma.viewport.bounds.height/2  - 300)* figma.viewport.zoom));
        let selects = []
        for ( let i = 0; i < info.length; i++){
            let node = addFrame([info[i].w,info[i].h,null,null,info[i].name],[]);
            selects.push(node);
        };
        figma.currentPage.selection = selects;
        layoutByRatio(selects);
    };
    //反传画板数据
    if ( type == "getTableBySelects"){
        let data = getMain(figma.currentPage.selection);
        postmessage([data,'selectInfoMain']);
    }
    //栅格化-副本
    if ( type == 'pixelCopy'){
        toPixel(info);
    };
    //栅格化-覆盖
    if ( type == 'overWrite'){
        toPixel(info,true);
    };
    //自动排列
    if ( type == 'Arrange By Ratio'){
        layoutByRatio(figma.currentPage.selection);
    };
    
}


//封装postMessage
function postmessage(data){
    //console.log(data)
    /*figma*/
    figma.ui.postMessage({pluginMessage:data})
    /*mastergo*/
    //mg.ui.postMessage(data)
}

figma.on('selectionchange',()=>{
    sendInfo()
})

sendInfo()
function sendInfo(){
    let a = figma.currentPage;
    let b = a.selection;
    if(b){
        let data = [];
        b.forEach(node => {
            let n = TextMaxLength(node.name,20,'...');
            let w = node.width;
            let h = node.height;
            //console.log(lengthE,lengthZ,n)
            data.push([n,w,h])
        });
        postmessage([data,'selectInfo']);
    };
}

/**
 * @param {Array} info - 宽高、坐标、命名、填充
 * @param {node} node - 需要设置的对象
 * @param {node?} cloneNode - 直接参考的对象
 */
function setMain(info,node,cloneNode){
    let viewX = Math.floor( figma.viewport.center.x - ((figma.viewport.bounds.width/2  - 300)* figma.viewport.zoom));
    let viewY = Math.floor( figma.viewport.center.y - ((figma.viewport.bounds.height/2  - 300)* figma.viewport.zoom));

    let w = info[0],h = info[1],x = info[2],y = info[3],n = info[4],fills = info[5];
    if(cloneNode){
        w = cloneNode.width;
        h = cloneNode.height;
        x = cloneNode.x;
        y = cloneNode.y;
        n = cloneNode.name;
        fills = cloneNode.fill;
    }
    x = x ? x : viewX;
    y = y ? y : viewY;
    fills = fills ? fills : [];
    node.resize(w,h);
    node.x = x;
    node.y = y;
    node.name = n;
    node.fills = fills;
}
//添加图片
function addImg(node,info){
    let image = figma.createImage(info.img)
    let img = figma.createRectangle();
    img.resize(info.w,info.h);
    img.name = info.n;
    img.x = info.x;
    img.y = info.y;
    img.fills = [
        {
            type: 'IMAGE',
            imageHash: image.hash,
            scaleMode: 'FILL'
        }
    ]; 
    node.appendChild(img)
}
//添加切片
/**
 * @param {group} group - 通过克隆需要被栅格化的对象，初步得到的组
 * @param {[{w:num,h:num,x:num,y:num,s:num}]} info - 切片大小位置栅格化倍率信息集
 */
function addCutArea(group,info){
    info.forEach(async (item,index) => {
        let w = item.w;
        let h = item.h;
        let x = item.x;
        let y = item.y;
        let s = item.s;
        let cut = figma.createSlice();
        cut.x = group.x + x;
        cut.y = group.y + y;
        cut.resize(w,h);
        cut.name = 'cut ' + (index + 1) + '@' + s + 'x';//命名记录栅格化倍率
        group.appendChild(cut);
    });
};
//切片转图片
/**
 * @param {group} group - 由addCutArea生成的包含切片和源对象的组
 */
function addCutImg(group){
    let cuts = group.findChildren(item => item.type == 'SLICE');
    let old = group.findOne(item => item.name == group.name);
    cuts.forEach(async (item,index) => {
        let w = item.width;
        let h = item.height;
        let x = item.x;
        let y = item.y;
        let s = item.name.split('@')[1].split('x')[0]*1;
        let code = await item.exportAsync({
            format: 'PNG',
            constraint: { type: 'SCALE', value: s},
        });
        let image = figma.createImage(code);
        let cutimg = figma.createRectangle();
        cutimg.x = x;
        cutimg.y = y;
        cutimg.resize(w,h);
        cutimg.name = group.name + '_' + (index + 1);
        cutimg.fills = [
            {
            type: 'IMAGE',
            imageHash: image.hash,
            scaleMode: 'FILL'
            }
        ];
        group.appendChild(cutimg);
        item.remove();
        if(old && index == cuts.length - 1){
            old.remove();
        }
    });
}
//通过切片实现原地栅格化
/**
 * @param {[{w:num,h:num,x:num,y:num,s:num}]} info - 切片大小位置信息栅格化倍率集
 * @param {boolean} isOverWrite - 是否覆盖
 */
function toPixel(info,isOverWrite){
    //console.log(info)
    let a = figma.currentPage;
    let b = a.selection;
    for(let i = 0; i < b.length; i++){
        let layerIndex = b[i].parent.children.findIndex(item => item.id == b[i].id);
        //console.log(layerIndex)
        let group = figma.group([b[i].clone()],b[i].parent,(layerIndex + 1));
        group.x = b[i].x;
        group.y = b[i].y;
        group.name = b[i].name;
        addCutArea(group,info[i]);
        addCutImg(group,info[i]);
        a.selection = [group];
        if(isOverWrite){
            b[i].remove()
        };
    };
}
//添加画板
/**
 * @param {Array} info - [w,h,x,y,n,fill]
 * @returns {node}
 */
function addFrame(info){
    let node = figma.createFrame();
    setMain(info,node);
    return node;
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
  };

//按长、宽、方排列所选
function layoutByRatio(nodes){
    let b = nodes;
    let x = Math.min(...b.map(item => item.x)),XX = Math.min(...b.map(item => item.x));
    let y = Math.min(...b.map(item => item.y)),YY = Math.min(...b.map(item => item.y));
    let infos = [];
    for ( let i = 0; i < b.length; i++){
        infos.push({x:b[i].x,y:b[i].y,w:b[i].width,h:b[i].height,i:i,});
    };
    let HH = infos.filter(item => item.w > item.h).sort((a, b) => b.w*b.h - a.w*a.h);//横板
    let maxW = Math.max(Math.max(...HH.map(item => item.w)),1920)
    let LL = infos.filter(item => item.w < item.h).sort((a, b) => b.w*b.h - a.w*a.h);//竖版
    let maxH = Math.max(...LL.map(item => item.h))
    let FF = infos.filter(item => item.w == item.h).sort((a, b) => b.w*b.h - a.w*a.h);//方形
    let gap = 30;
    let lineMaxH = [],lineMaxW = [];
    let lineW = 0,lineH = 0;
    for(let e = 0; e < HH.length; e++){
        if ( e !== HH.length - 1){
            lineW += HH[e].w + HH[e + 1].w ;
        }
        lineMaxH.push([HH[e].h]);
        //console.log(lineMaxH)                   
        b[HH[e].i].x = x
        b[HH[e].i].y = y
        
        if ( lineW > maxW){
            //console.log(lineMaxH) 
            lineW = 0;
            x = XX;
            y = y + Math.max(...lineMaxH) + gap;
            lineMaxH = []
        } else {
            x = x + HH[e].w + gap; 
        }
    };
    x = XX + maxW + gap;
    y = YY;
    for(let e = 0; e < LL.length; e++){
        if ( e !== LL.length - 1){
            lineH += LL[e].h + LL[e + 1].h ;
        }
        lineMaxW.push([LL[e].w]);
        //console.log(lineMaxH)                   
        b[LL[e].i].x = x
        b[LL[e].i].y = y
        
        if ( lineH > maxH){

            lineH = 0;
            y = YY;
            x = x + Math.max(...lineMaxW) + gap;
            lineMaxW = []
        } else {
            y = y + LL[e].h + gap; 
        }
    };
    x = XX + maxW + gap;
    y = YY + maxH + gap;
    for(let e = 0; e < FF.length; e++){
        if ( e !== FF.length - 1){
            lineW += FF[e].w + FF[e + 1].w ;
        }
        lineMaxH.push([FF[e].h]);
        //console.log(lineMaxH)                   
        b[FF[e].i].x = x
        b[FF[e].i].y = y
        
        if ( lineW > maxW){

            lineW = 0;
            x = XX + maxW + gap;
            y = y + Math.max(...lineMaxH) + gap;
            lineMaxW = []
        } else {
            x = x + FF[e].w + gap; 
        }
    };
}

//获取画板可用于创建画板的信息
function getMain(nodes){
    if(nodes){
        let data = [];
        nodes.forEach(node => {
            let n = node.name;
            let w = node.width;
            let h = node.height;
            data.push({name:n,w:w,h:h})
        });
        return data;
    };
}

