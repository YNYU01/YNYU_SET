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
figma.clientStorage.getAsync('userResize')
.then (data => {
    figma.ui.resize(data[0], data[1]);
})
.catch (error => {
    figma.ui.resize(UI[0], UI[1]);
    postmessage([[UI[0], UI[1]],'userResize']);
});


let isSendComp = false;
//核心功能
figma.ui.onmessage = async (message) => { 
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
            figma.clientStorage.setAsync('userResize',[UI_BIG[0], UI_BIG[1]]);
        } else {
            figma.ui.resize(UI[0], UI[1]);
            figma.clientStorage.setAsync('userResize',[UI[0], UI[1]]);
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
    };
    //反传组件信息
    if ( type == "selectComp"){
        isSendComp = info;
        sendSendComp();
    };
    //从预设或组件创建表格
    if ( type == "creTable"){
        //console.log(info)
        let a = figma.currentPage;
        let b = a.selection;
        let th,td;
        if(info[1]){
            th = b.find(item => item.name == info[1]);
        };
        if(info[2]){
            td = b.find(item => item.name == info[2]);
        };
        figma.clientStorage.getAsync('userLanguage')
        .then (async (language) => {
            let all = await createTable(th,td,language);
            let newth = all[0];
            let newtd = all[1];
            let table = all[2]
            //如果用了自定义组件，则重新排列，避免太分散
            if(newth == th || newtd == td){
                let layerIndex = th.parent.children.findIndex(item => item.id == th.id);
                layoutByRatio(all,true);
                all.forEach(item => {
                    th.parent.insertChild((layerIndex - 1),item)
                });
            };
            a.selection = all
        })
        .catch (error => {
        })
        

    };
    //栅格化-副本
    if ( type == 'Pixel As Copy'){
        toPixel(info);
    };
    //栅格化-覆盖
    if ( type == 'Pixel Overwrite'){
        toPixel(info,true);
    };
    //拆分文案
    if ( type == "splitText"){
        let a = figma.currentPage;
        let b = a.selection;
        let texts = b.filter(item => item.type == 'TEXT');
        let safeTexts = texts.filter(item => item.hasMissingFont == false)
        let splitTags = {
            FontSize: 'fontSize',
            FontName: 'fontName',
            Fills: 'fills',
            FillStyle: 'fillStyleId',
            TextStyle: 'textStyle',
        };
        let splitKeys = info[0], splitType = info[1];
        //console.log(safeTexts.length,splitKeys,splitType)
        /**/
        //不处理缺失字体的对象，并提示用户
        if(safeTexts.length < texts){
            figma.clientStorage.getAsync('userLanguage')
            .then (async (language) => {
                let text = language == 'Zh' ? '已忽略缺失字体的对象' : 'Nodes with missing fonts have been ignored'
                figma.notify(text,{
                    error:true,
                    timeout: 3000,
                });
            });
        } else {
            for(let i = 0; i < safeTexts.length; i++){
                let oldnode = safeTexts[i];
                //要加载的字体
                let fonts = [...new Set(oldnode.getStyledTextSegments(['fontName']).map(item => JSON.stringify(item.fontName)))];
                fonts = fonts.map(item => JSON.parse(item));
                let promises = fonts.map(item => figma.loadFontAsync(item));
                await Promise.all(promises)
                .then(()=>{
                    let textSafe = oldnode.clone();
                        switch (splitType){
                            case 'tags':
                                let splitTag = splitKeys.filter(item => splitTags[item]).map(item => splitTags[item]);
                                splitText(textSafe,oldnode,splitTag,splitKeys);
                            ;break
                            case 'inputs':
                                splitText(textSafe,oldnode,null,splitKeys);
                            ;break
                        };
                })
                .catch(error => {
                    console.error(error);
                });
            }; 
        }
    };
    if( type == 'Split By Symbol'){
        let a = figma.currentPage;
        let b = a.selection;
        let texts = b.filter(item => item.type == 'TEXT');
    }
    //自动排列
    if ( type == 'Arrange By Ratio'){
        if(info){
            layoutByRatio(figma.currentPage.selection,true);
        }else{
            layoutByRatio(figma.currentPage.selection);
        }
    };
    //母组件复制
    if ( type == 'Clone New'){
        let a = figma.currentPage;
        let b = a.selection;
        b.forEach(item => {
            if(item.type == 'COMPONENT'){
                let layerIndex = item.parent.children.findIndex(items => items.id == item.id);
                let newComp = item.clone();
                setMain([],newComp,item);
                item.parent.insertChild((layerIndex + 1),newComp);
                if(item.height >= item.width){
                    newComp.x += item.width + 30;
                } else {
                    newComp.y -= item.height + 30;
                };
                newComp.name = item.name + ' copy';
            };
        });
    };
    
}


//封装postMessage
function postmessage(data){
    //console.log(data)
    /*figma*/
    figma.ui.postMessage({pluginMessage:data})
    /*mastergo*/
    //figma.ui.postMessage(data)
}

figma.on('selectionchange',()=>{
    sendInfo();
    if(isSendComp){
        sendSendComp()
    };
});

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
};

function sendSendComp(){
    let a = figma.currentPage;
    let b = a.selection;
    let info = [];
    let th,td;
    let comps = b.filter(item => item.type == 'COMPONENT' || item.type == 'INSTANCE');
    if(comps.length > 0){
        th = comps.find(item => item.name.split('@th').length > 1);
        td = comps.find(item => item.name.split('@td').length > 1);    
    }
    if(th){
        info.push(th.name);
    } else {
        info.push(null);
    };
    if(td){
        info.push(td.name);
    } else {
        info.push(null);
    }
    postmessage([info,'selectComp']);
}

/**
 * @param {Array} info - [w,h,x,y,[fills],[align,trbl,strokes]] 宽高、坐标、命名、填充、描边
 * @param {node} node - 需要设置的对象
 * @param {node?} cloneNode - 直接参考的对象
 */
function setMain(info,node,cloneNode){
    let viewX = Math.floor( figma.viewport.center.x - ((figma.viewport.bounds.width/2  - 300)* figma.viewport.zoom));
    let viewY = Math.floor( figma.viewport.center.y - ((figma.viewport.bounds.height/2  - 300)* figma.viewport.zoom));
    let w = info[0],h = info[1],x = info[2],y = info[3],n = info[4],fills = info[5];
    //console.log(cloneNode)
    let hasnoFills = [
        'TEXT','GROUP',
    ]
    if(cloneNode){
        w = cloneNode.width;
        h = cloneNode.height;
        x = cloneNode.x;
        y = cloneNode.y;
        n = cloneNode.name;
        if(hasnoFills.includes(cloneNode.type)){
            fills = [];
        } else {
            fills = cloneNode.fills;
        }
    };
    x = x ? x : viewX;
    y = y ? y : viewY;
    fills = fills ? fills : [];
    node.resize(w,h);
    node.x = x;
    node.y = y;
    node.name = n;
    node.fills = fills;

    if(info[6]){
        setStroke(node,info[6][0],info[6][1],info[6][2])
    };
};
//设置描边
function setStroke(node,align,trbl,strokes){
    //console.log(trbl)
    align = align ? align : "CENTER";
    trbl = trbl ? trbl : [1,1,1,1];
    strokes = strokes ? strokes : [{type:"SOLID",color:{r:0.5,g:0.5,b:0.5}}];
    node.strokes = strokes;
    node.strokeTopWeight = trbl[0];
    node.strokeRightWeight = trbl[1];
    node.strokeBottomWeight = trbl[2];
    node.strokeLeftWeight = trbl[3];
    node.strokeAlign = align;
};

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
};
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
        if(cuts.length == 1){
            cutimg.name = group.name;
        }else{
            cutimg.name = group.name + '_' + (index + 1);
        };
        if(s !== 1){
            cutimg.name += ' @' + s + 'x';//命名记录栅格化倍率
        };
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
        };
        if(group.children.length == 1){
            figma.ungroup(group);
        }
    });
};
//通过切片实现原地栅格化
/**
 * @param {[{w:num,h:num,x:num,y:num,s:num}]} info - 切片大小位置信息栅格化倍率集
 * @param {boolean} isOverWrite - 是否覆盖
 */
function toPixel(info,isOverWrite){
    //console.log(info)
    let a = figma.currentPage;
    let b = a.selection;
    let selects = [];
    for(let i = 0; i < b.length; i++){
        let layerIndex = b[i].parent.children.findIndex(item => item.id == b[i].id);
        //console.log(layerIndex)
        let group = figma.group([b[i].clone()],b[i].parent,(layerIndex + 1));
        group.x = b[i].x;
        group.y = b[i].y;
        group.name = b[i].name;
        addCutArea(group,info[i]);
        addCutImg(group,info[i]);
        selects.push(group);
        if(isOverWrite){
            b[i].remove()
        };
    };
    a.selection = selects;
};
//添加画板
/**
 * @param {Array} info - [w,h,x,y,[fills],[align,trbl,strokes]] 宽高、坐标、命名、填充、描边
 * @returns {node}
 */
function addFrame(info,cloneNode){
    let node = figma.createFrame();
    setMain(info,node,cloneNode);
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
function layoutByRatio(nodes,isMinToMax){
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
    if(isMinToMax){
        HH = HH.reverse();
        LL = LL.reverse();
        FF = FF.reverse();
    }
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
};

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
};

//创建表格
async function createTable(thComp,tdComp,language){
    let th,td;
    if(thComp){
        th = thComp;
    } else {
        th = await addTableCompMust('th',language);
    };
    if(tdComp){
        td = tdComp;
    } else {
        td = await addTableCompMust('td',language);
        //console.log(td)
    };
    let column = addFrame([176,52,null,null,'@column',[]]);
    addAutoLayout(column,['V','TC']);
    if(th.type == 'COMPONENT'){
        column.appendChild(th.createInstance());
    } else {
        column.appendChild(th.clone());
    };
    if(td.type == 'COMPONENT'){
        column.appendChild(td.createInstance());
    } else {
        column.appendChild(td.clone());
    };

    column.children.forEach(item => {
        item.layoutSizingHorizontal = 'FILL';
    });
    
    let table = addFrame([528,208,null,null,'xxx@table',[toRGB('2D2D2D',true)],[null,null,[toRGB('#666666',true)]]]);
    table.appendChild(column);
    addAutoLayout(table,['H','TL'],[0,0]);
    table.x += 200;

    return [th,td,table];
};
//创建表格组件
async function addTableCompMust(type,language){
    let comp = addFrame([176,52,null,null,'xxx@' + type,[]]);
    if(type == 'td'){
        comp.y += 72;
    };
    addAutoLayout(comp,['H','CC'],[1,1]);
    comp.resize(176,52);
    comp.itemReverseZIndex = true;//前面堆叠在上
    comp = await figma.createComponentFromNode(comp);

    let egtext = {th:['Bold','Header'],td:['Regular','Data']};
    if(language == 'Zh'){
        egtext = {th:['Bold','表头文案'],td:['Regular','数据文案']};
    };
    let text = await addText([{family:'Inter',style:egtext[type][0]},egtext[type][1],16]);
    comp.appendChild(text);
    let fills = {
        th:[toRGB('#666666',true)],
        td:[toRGB('#66666688',true)]
    }
    let adds = [
        ['top',[],[null,[1,0,0,0]],'--bod-t'],
        ['right',[],[null,[0,1,0,0]],'--bod-r'],
        ['bottom',[],[null,[0,0,1,0]],'--bod-b'],
        ['left',[],[null,[0,0,0,1]],'--bod-l'],
        ['fills',fills[type],null,'--fills'],
    ];

    for(let i = 0; i < adds.length; i++){
        addBodFill(comp,adds[i]);
    };
    
    return comp;
};
//添加描边/区分色
function addBodFill(node,Array){
    let bodfill = figma.createRectangle();
    setMain([176,52,null,null,Array[0],Array[1],Array[2]],bodfill);
    let bodfills = addFrame([176,52,null,null,Array[3],[]]);
    bodfills.appendChild(bodfill);
    asFillChild(bodfill);
    addAbsolute(node,bodfills,true);
};
//重置相对坐标并把约束设为撑满
function asFillChild(node){
    node.x = 0;
    node.y = 0;
    node.constraints = {
        horizontal: "STRETCH",
        vertical: "STRETCH"
    };
}

//添加自动布局
/**
 * @param {node} node - 需自动布局的对象
 * @param {[HV,TBLR,gap,padding:[H,V]]} layout  - 横竖、定位，间距，边距
 */
function addAutoLayout(node,layout,isFixed){
    node.layoutPositioning = 'AUTO';
    if(isFixed){
        node.primaryAxisSizingMode = isFixed[0] ? "FIXED" : "AUTO";
        node.counterAxisSizingMode = isFixed[1] ? "FIXED" : "AUTO";
    };
    node.clipsContent = false;//默认超出不裁剪
    switch (layout[0]){
        case 'H':
            node.layoutMode = 'HORIZONTAL';
            switch (layout[1][0]){
                case 'T':
                    node.primaryAxisAlignItems = 'MAX'
                ;break
                case 'C':
                    node.primaryAxisAlignItems = 'CENTER'
                ;break
                case 'B':
                    node.primaryAxisAlignItems = 'MIN'
                ;break
            };
            switch (layout[1][1]){
                case 'L':
                    node.counterAxisAlignItems = 'MAX'
                ;break
                case 'C':
                    node.counterAxisAlignItems = 'CENTER'
                ;break
                case 'R':
                    node.counterAxisAlignItems = 'MIN';
                ;break
                case 'B':
                    node.counterAxisAlignItems = 'BASELINE'
                ;break
            };
        ;break
        case 'V':
            node.layoutMode = 'VERTICAL';
            switch (layout[1][0]){
                case 'T':
                    node.primaryAxisAlignItems = 'MIN'
                ;break
                case 'C':
                    node.primaryAxisAlignItems = 'CENTER'
                ;break
                case 'B':
                    node.primaryAxisAlignItems = 'MAX'
                ;break
            };
            switch (layout[1][1]){
                case 'L':
                    node.counterAxisAlignItems = 'MIN'
                ;break
                case 'C':
                    node.counterAxisAlignItems = 'CENTER'
                ;break
                case 'R':
                    node.counterAxisAlignItems = 'MAX';
                ;break
            };
        ;break
    };
    
    
    node.itemSpacing = layout[2] ? layout[2]  : 0;
    node.horizontalPadding = layout[3]  ? layout[3] [0] : 0;
    node.verticalPadding = layout[3]  ? layout[3] [1] : 0;
    
};

//添加绝对定位元素
/**
 * @param {node} parent - 自动布局对象
 * @param {node} absoluteNode - 绝对定位对象
 * @param {boolean} isFill - 是否撑满自动布局对象（会同时修改约束
 * @param {Array | string} position - [x,y] | TBLR , 指定坐标或相对位置（会同时修改约束
 */
function addAbsolute(parent,absoluteNode,isFill,position){
    let a = parent,b = absoluteNode;
    a.appendChild(b);
    b.layoutPositioning = "ABSOLUTE";
    b.x = 0;
    b.y = 0;
    if(isFill){
        b.resize(a.width,a.height);
        b.constraints = {
            horizontal: "STRETCH",
            vertical: "STRETCH"
        };
    } else {
        if(position){
            if(typeof(position) == 'string'){
                switch (position[0]){
                    case 'T':
                        b.y = 0;
                    ;break
                    case 'C':
                        b.y = (a.height - b.height)/2;
                    ;break
                    case 'B':
                        b.y = a.height - b.height;
                    ;break
                };
                switch (position[1]){
                    case 'L':
                        b.x = 0;
                    ;break
                    case 'C':
                        b.x = (a.width - b.width)/2;
                    ;break
                    case 'R':
                        b.x = a.width - b.width;
                    ;break
                };
            }else{
                b.x = position[0];
                b.y = position[1];
            };
        }else{
            b.x = 0;
            b.y = 0; 
        }
    };
};

//添加文字内容
/**
 * @param {Array} info - [{family:xxx,style:xxx},text,size,fills?]字体、文案、字号、颜色
 */
async function addText(info){
    let text = figma.createText();
    await figma.loadFontAsync(info[0]);
    text.fontName = info[0];
    text.characters = info[1];
    text.fontSize = info[2];
    let fills = info[3] ? info[3] : [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    text.fills = fills;
    return text;
};

/**
 * @param {Array} color - css颜色 [#ffffff | rgb(255,255,255) | hsl(0% 0% 100%)]
 * @param {boolean} isPaint - 带透明度或需要作为fills对象传入时用
 */
function toRGB(color,isPaint){
    if(isPaint){
        //console.log(figma.util.solidPaint(color))
        return figma.util.solidPaint(color);
    } else {
        //console.log(figma.util.rgb(color))
        return figma.util.rgb(color);
    }
}//

//拆分文案
function splitText(safenode,oldnode,splitTag,splitKeys){
    let node = safenode;
    let layerIndex = oldnode.parent.children.findIndex(items => items.id == oldnode.id);
    let lineslength = node.characters.split('\n').map(item => item.length);
    let lines = [];
    let start = 0;
    // 如有分段
    for (let length of lineslength) {
        let end = start + length + 1;
        lines.push([start, end]);
        start = end;
    };
    
    if(splitKeys.length == 1 || (splitKeys[1] && typeof(splitKeys[1]) !== 'number')){
        //console.log(lines,splitTag,splitKeys)
        let splitnodes = [node];
        //如勾选了按分段拆分
        if(splitKeys.includes('Wrap')){
            splitnodes = [];
            let group = addFrame([null,null,null,null],oldnode);
            oldnode.parent.insertChild((layerIndex + 1),group);
            group.name = TextMaxLength(oldnode.name,20,'...');
            addAutoLayout(group,['V','TL',0,[0,0]],[true,false]);
            for(let i = 0; i < lines.length; i++){
                let splitnode = node.clone();
                removeText(splitnode,lines[i][0],lines[i][1],true);
                group.appendChild(splitnode);
                splitnodes.push(splitnode);
            };
            figma.currentPage.selection = [group];
        };
        if(splitKeys == ['Wrap'] ){
            figma.clientStorage.getAsync('userLanguage')
            .then (async (language) => {
                let text = language == 'Zh' ? '成功拆分文本（原始文本已隐藏）' : 'Split text successfully!(original has been hidden)'
                figma.notify(text,{
                    timeout: 3000,
                });
            });
        } else {
            for(let i = 0; i < splitnodes.length; i++){
                let layerIndex2 = splitnodes[i].parent.children.findIndex(items => items.id == splitnodes[i].id);
                let group2 = addFrame([null,null,null,null],splitnodes[i]);
                splitnodes[i].parent.insertChild((layerIndex2 + 1),group2);
                group2.name = TextMaxLength(splitnodes[i].name,20,'...');
                addAutoLayout(group2,['H','BB',0,[0,0]],[false,true]);
                let lines2 = splitnodes[i].getStyledTextSegments(splitTag).map(item => [item.start,item.end]);
                let lineHights = splitnodes[i].getStyledTextSegments(['lineHeight']);
                if(lineHights.length > 1){
                    figma.clientStorage.getAsync('userLanguage')
                    .then (async (language) => {
                        let text = language == 'Zh' ? '存在不同的行高，会导致拆分后与原排版不符' : 'Mixed line-height will make splitting layout errors'
                        figma.notify(text,{
                            error:true,
                            timeout: 3000,
                        });
                    });
                };
                for(let ii = 0; ii < lines2.length; ii++){
                    let splitnode2 = splitnodes[i].clone();
                    removeText(splitnode2,lines2[ii][0],lines2[ii][1],true,true);
                    group2.appendChild(splitnode2);
                };
                splitnodes[i].remove()
            };
        };
        
    }else{
        console.log(splitKeys)
        console.log(666)
    }
    safenode.remove();
    oldnode.visible = false;
};

function removeText(node,start,end,isReverse,isInine){
    
    if(isReverse){
        //console.log(start,end)
        node.deleteCharacters(0,start);
        let newlength = node.characters.length;
        //如果是行内就不需要加多一个占位符的长度
        if(isInine){
            node.deleteCharacters(end - start,newlength);
        } else {
            node.deleteCharacters(end - start - 1,newlength);
        }
    } else {
        node.deleteCharacters(start,end)
    };
};