/*
- [ToolsSet 工具集1.0]
- ©版权所有：2024-2025 YNYU @lvynyu2.gmail.com
- 禁止未授权的商用及二次编辑
- 禁止用于违法行为，如有，与作者无关
- 二次编辑需将引用部分开源
- 引用开源库的部分应遵循对应许可
- 使用当前代码时禁止删除或修改本声明
*/
var UI = [300,660];
var vX = figma.viewport.bounds.x,vY = figma.viewport.bounds.y;
figma.skipInvisibleInstanceChildren = true;//忽略不可见元素及其子集

if ( figma.command == 'open' ){
    figma.showUI(__html__,{position:{x:vX,y:vY},themeColors:true});
} else if ( figma.command == 'pixel' ){ 
    //覆盖栅格化
    var info = 1;
    var a = figma.currentPage;
    var b = a.selection;
    console.log("原地栅格化：",info,"倍")

    var loading =  figma.notify("生成中，请稍后",{
        timeout: 6000,
    });
    setTimeout(() =>{
        for (var i = 0; i < b.length; i++){
            intXY(b[i]);
            cutNode(a,b[i],info);
            b[i].remove();  
        }
        loading.cancel();
        pickBefore(a.selection);
    },100)
} else if ( figma.command == 'yuhua' ){
    var a = figma.currentPage;
    var b = a.selection;
    for (var i = 0; i < b.length; i++){
        var group = figma.group([b[i]]);
        group.name = b[i].name;
        var min = Math.min(b[i].absoluteRenderBounds.width,b[i].absoluteRenderBounds.height);
        var yuhua = Math.ceil(0.044 * min + 6);//蒙版向内缩进值，模糊值则为yuhua*0.8
        //console.log(min,yuhua);
        var mask = figma.createRectangle();
        mask.x = b[i].absoluteRenderBounds.x + yuhua;
        mask.y = b[i].absoluteRenderBounds.y + yuhua;
        mask.width = b[i].absoluteRenderBounds.width - yuhua * 2;
        mask.height = b[i].absoluteRenderBounds.height - yuhua * 2;
        mask.effects = [{
            "type": "LAYER_BLUR",
            "isVisible": true,
            "radius": yuhua * 0.8,
            "blendMode": "PASS_THROUGH"
        }]
        group.insertChild(0,mask);
        var maskG = figma.group([b[i].parent.children[0]]);
        maskG.name = '羽化蒙版';
        maskG.isMask = true;
        maskG.isMaskOutline = false;
        b[i].parent.insertChild(0,b[i].clone());
        b[i].parent.children[0].effects = [{
            "type": "LAYER_BLUR",
            "isVisible": true,
            "radius": yuhua * 0.8,
            "blendMode": "PASS_THROUGH"
        }]
        b[i].parent.children[0].isVisible = false
    }
} else if ( figma.command == 'lineTable' ){
    var a = figma.currentPage;
    var b = a.selection;
    var info = 'line'
    easePickTable(info,a,b)  
} else if ( figma.command == 'areaTable' ){
    var a = figma.currentPage;
    var b = a.selection;
    var info = 'area'
    easePickTable(info,a,b)  
} else if ( figma.command == 'help' ){
    figma.showUI(__html__);
    figma.ui.hide();
    figma.ui.postMessage(['help','tolink'])//https://ynyu01.github.io/Tools-Help

} else if ( figma.command == 'getnew' ){
    figma.showUI(__html__);
    figma.ui.hide();
    figma.ui.postMessage(['new','tolink'])

} else if ( figma.command == 'tableToArea'){
    var a = figma.currentPage;
    var b = a.selection;
    var X = b.map(item => item.absoluteBoundingBox.x)
    var W = b.map(item => item.absoluteBoundingBox.width)
    var XX = [...new Set(X)]
    var WW = [...new Set(W)]
    var Y = b.map(item => item.absoluteBoundingBox.y)
    var H = b.map(item => item.absoluteBoundingBox.height)
    var YY = [...new Set(Y)]
    var HH = [...new Set(H)]
    if ( b.some( node => node.componentProperties[1].value == false || node.componentProperties[2].value == false || node.componentProperties[3].value == false || node.componentProperties[4].value == false)){
        figma.notify("含已合并的表格 / 非全描边表格",{
            timeout: 3000,
        });
    } else {
        if ( (XX.length == 1 && WW.length == 1 && Math.max(...Y.map((value,index) => value + H[index])) - Math.min(...Y) == H.reduce((acc,item)=> acc + item,0)) ) {
            console.log('竖向合并表格')
            tableToArea(b,'l')        
        } else if ( (YY.length == 1 && HH.length == 1 && Math.max(...X.map((value,index) => value + W[index])) - Math.min(...X) == W.reduce((acc,item)=> acc + item,0))) {
            console.log('横向合并表格')
            tableToArea(b,'h')
        } else if ( XX.length * YY.length == b.length){
            console.log([YY.length,XX.length])
            tableToArea(b,'hl',[YY.length,XX.length])    
        } else {
            console.log('无法合并表格')
        }
    }
}
 
figma.ui.resize(UI[0], UI[1]);

var tabInfo;
var importNum = 1,xx = 0,yy = 0,time = 0,ww = 0,hh = 0;
var find = [],searchTime = 0,seaechOldNodes = [];
var cutMax = 4096;
var stylePage = '附录/变量&样式表';
var mixType = {
    "Pd":mixPd,
    "R":mixR,
    "WH":mixWH,
    "S":mixS,
    "isV":mixisV,
}
var searchType = "Text",searchArea = "Page";
var diffStyleNode = []
var diffColorTime = 0;
var pickTableArea = false;
//核心功能
figma.ui.onmessage = (message) => { 
    const info = message[0]
    const type = message[1]
    //console.log(message)
    //获取用户偏好
    if (type == "getlocal"){
        figma.clientStorage.getAsync(info)
        .then (data => {
            postmessage([data,info])
        })
        .catch (error => {
        })
    }
    //设置用户偏好
    if (type == "setlocal"){
        figma.clientStorage.setAsync(info[0],info[1])
        //console.log(info[0],info[1])
        figma.clientStorage.getAsync(info[0])
        .then (data => {
            //console.log(data)
        })
    }
    //插件自动休眠
    if ( type == "sleep"){
        if (info == true){
            //console.log(type + ":" + info)
            figma.ui.resize(160, 60);
            //figma.ui.moveTo(figma.viewport.positionOnDom.x + figma.viewport.positionOnDom.width - 100,48 + rulerH)
            
        }else{
            figma.ui.resize(UI[0], UI[1]);
        }
    }
    //插件最大化
    if ( type == "big"){
        if (info){
            UI = [UI[0] * 2,UI[1] * 1.3]
            figma.ui.resize(UI[0], UI[1]);  
        } else {
            UI = [300,660]
            figma.ui.resize(UI[0], UI[1]);
        }
    }
    //双击底部获取当前节点信息(开发用)
    if ( type == "getnode"){
        if (figma.currentPage.selection.length > 0){
            console.log("当前节点信息：")
            console.log(figma.currentPage.selection[0])
        } else {
            //console.log(figma.currentPage.parent)
            console.log("未选中对象")
        }
    }
    //批量创建画板
    if (type == "createrframe") {
        console.log("创建画板：",info.length,"个");
        var a = figma.currentPage;
        var b = a.selection;

        //反传对象尺寸信息
        if ( info == 0 && b.length > 0){
            var frameInfo = [];
            b.forEach(item => {
                frameInfo.push(item.name.split(item.width)[0].trim() + '\t' + item.width + '\t' + item.height + '\n')
            })
            postmessage([frameInfo,'getFrame'])
        }


        var gap = 30;
        var maxW ,maxH ;
        var viewX = Math.floor( figma.viewport.center.x - ((figma.viewport.bounds.width/2  - 300)* figma.viewport.zoom))/// figma.viewport.bound.width/2 + 300;
        var viewY = Math.floor(figma.viewport.center.y);
        var x = viewX;
        var y = viewY;
        var allH = [];
        var allW = [];
        var ws = [0];
        var hs = [0];

        function easeframe(info,x,y,gap,isCreater){
            var starX = x, starY = y;
            var kvAll = info.filter(item => item.name.toLowerCase().split("kv").length > 1);
            var HH = info.filter(item => item.w > item.h && item.name.toLowerCase().split("kv").length == 1).sort((a, b) => b.w * b.h - a.w * a.h);//横板
            var maxW = Math.max(...HH.map(item => item.w));//找出最宽的图，作为横板换行标准
            var LL = info.filter(item => item.w < item.h && item.name.toLowerCase().split("kv").length == 1).sort((a, b) => b.w * b.h - a.w * a.h);//竖版
            var maxH = Math.max(...LL.map(item => item.h));//找出最高的图，作为竖版换行标准
            var FF = info.filter(item => item.w == item.h).sort((a, b) => b.w - a.w);//方形
            maxW = Math.max(1920,maxW);
            maxH = Math.max(1920,maxH);//1920是常见KV尺寸
            console.log("最宽",maxW,";最高：",maxH);

            var kvH = [0]
            for(var i = 0; i < kvAll.length; i++){
                var frame = kvAll[i]
                var s = frame.s ? frame.s : '';
                var type = frame.type ? frame.type : '';
                var isPng = type == 'png' ? true : false;
                createFrame({name:frame.name,w:frame.w,h:frame.h,x:x,y:y,s:s,type:type},isPng)
                x += frame.w + gap
                kvH.push(frame.h)
            }

            x = starX;
            y = starY + Math.max(...kvH) + gap;
            console.log("横版起点：",x,y)

            var lineH = [];
            var lineAllW;
            for(var i = 0; i < HH.length; i++){  
                var frame = HH[i];
                var s = frame.s ? frame.s : '';
                var type = frame.type ? frame.type : '';
                var isPng = type.toLowerCase() == 'png' ? true : false;
                createFrame({name:frame.name,w:frame.w,h:frame.h,x:x,y:y,s:s,type:type},isPng);
                lineAllW += frame.w + gap;
                lineH.push(frame.h)
                if (HH[i + 1] && (lineAllW + HH[i + 1].w) <= maxW){
                    x += frame.w + gap;
                } else {
                    //console.log(lineH)
                    x = starX;
                    y += Math.max(...lineH) + gap;
                    lineH = [];
                    lineAllW = 0;
                }
                
            }

            x = starX + maxW + gap;
            y = starY + Math.max(...kvH) + gap;
            console.log("竖版起点：",x,y)

            var lineW = [];
            var lineAllH;
            for(var i = 0; i < LL.length; i++){      
                var frame = LL[i];
                var s = frame.s ? frame.s : '';
                var type = frame.type ? frame.type : '';
                var isPng = type.toLowerCase() == 'png' ? true : false;
                if(frame.name.split('弹窗').length > 1 ){
                    isPng = true
                }
                createFrame({name:frame.name,w:frame.w,h:frame.h,x:x,y:y,s:s,type:type},isPng);
                lineAllH += frame.h + gap;
                lineW.push(frame.w);
                if (LL[i + 1] && (lineAllH + LL[i + 1].h) <= maxH){
                    y += frame.h + gap;
                } else {
                    y = starY + Math.max(...kvH) + gap;
                    x += Math.max(...lineW)+ gap;
                    lineW = [];
                    lineAllH = 0;
                }
                
            }

            x = starX + maxW + gap;
            y = starY + Math.max(...kvH) + gap + maxH;
            console.log("方版起点：",x,y)

            lineH = [];
            lineAllW = 0;
            for(var i = 0; i < FF.length; i++){  
                var frame = FF[i];
                var s = frame.s ? frame.s : '';
                var type = frame.type ? frame.type : '';
                var isPng = type.toLowerCase() == 'png' ? true : false;
                createFrame({name:frame.name,w:frame.w,h:frame.h,x:x,y:y,s:s,type:type},isPng);
                lineAllW += frame.w + gap;
                lineH.push(frame.h)
                if (FF[i + 1] && (lineAllW + FF[i + 1].w) <= maxW){
                    x += frame.w + gap;
                } else {
                    //console.log(lineH)
                    x = starX;
                    y += Math.max(...lineH) + gap;
                    lineH = [];
                    lineAllW = 0;
                }
                
            }

            function createFrame(framedata,isPng){
                var node = figma.createFrame()
                node.x = framedata.x;
                node.y = framedata.y;
                /*
                node.width = framedata.w;
                node.height = framedata.h;
                */
                node.resize(framedata.w,framedata.h)
                var minName = framedata.name + ' ' + framedata.w + '×' + framedata.h;
                var maxName = framedata.name + ' ' + framedata.s.replace(/[KkBbMm]/g,'') + 'k ' + framedata.w + '×' + framedata.h;
                node.name = framedata.s ? maxName : minName
                node.setPluginData('s',String(framedata.s).replace(/[KkBbMm]/g,''));
                node.setPluginData('type',framedata.type);
                if (isPng) {
                    node.fills = []
                }

            }
        }

        easeframe(info,x,y,gap,true)
    }
    //自动排列
    if ( info == 'autoLayout'){
        var a = figma.currentPage;
        var b = a.selection;
        var x = Math.min(...b.map(item => item.x)),XX = Math.min(...b.map(item => item.x));
        var y = Math.min(...b.map(item => item.y)),YY = Math.min(...b.map(item => item.y));
        var nodes = []
        for ( var i = 0; i < b.length; i++){
            nodes.push({x:b[i].x,y:b[i].y,w:b[i].width,h:b[i].height,i:i,})
            
            if( i == b.length - 1){
                //console.log(nodes)
                var HH = nodes.filter(item => item.w > item.h).sort((a, b) => b.w*b.h - a.w*a.h);//横板
                var maxW = Math.max(Math.max(...HH.map(item => item.w)),1920)
                var LL = nodes.filter(item => item.w < item.h).sort((a, b) => b.w*b.h - a.w*a.h);//竖版
                var maxH = Math.max(...LL.map(item => item.h))
                var FF = nodes.filter(item => item.w == item.h).sort((a, b) => b.w*b.h - a.w*a.h);//方形
                var gap = 30;
                var lineMaxH = [],lineMaxW = [];
                var lineW = 0,lineH = 0;
                for(var e = 0; e < HH.length; e++){
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
                        x = x + HH[e].w; 
                    }
                }
                x = XX + maxW + gap;
                y = YY;
                for(var e = 0; e < LL.length; e++){
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
                        y = y + LL[e].h; 
                    }
                }

                x = XX + maxW + gap;
                y = YY + maxH + gap;
                for(var e = 0; e < FF.length; e++){
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
                }
            }
        }
    }
    //监听tab切换
    if ( type == 'tabSet'){
        tabInfo = "tab-" + info 
        //console.log("tab-" + info)
    }
    //记录导出尺寸设置
    if ( type == 'exportSizeSet'){
        //console.log(info)
        var a = figma.currentPage;
        var b = a.findOne(item => item.id == info[1]);
        b.setPluginData('s',info[0])
    }
    //记录导出格式设置
    if ( type == 'exportTypeSet'){
        //console.log(info)
        var a = figma.currentPage;
        var b = a.findOne(item => item.id == info[1]);
        b.setPluginData('type',info[0])
    }
    //处理要导出的图片
    if (type == 'exportImg'){  
        var a = figma.currentPage;
        var b = a.selection;     
        var frameData = [];
        var imgtype = "jpg";
        var typeAllow = ["jpg","jpeg","png","webp"];
        for (var i = 0; i < b.length; i++){
            if ( b[i].visible == true && b[i].width * b[i].height < 4096*4096){
                var name = b[i].name;
                if(name.split('=').length > 1 && b[i].type == 'COMPONENT'){
                    name = name.split('=')[1]
                }
                
                if( b[i].getPluginData('type') && b[i].getPluginData('type') !== '' && typeAllow.includes(b[i].getPluginData('type')) ){
                    imgtype = b[i].getPluginData('type')
                    //console.log(name.split(' ')[0] + " 格式已预设为：" + b[i].getPluginData('type'))
                } else {
                    if (b[i].fills == '' || b[i].bottomLeftRadius * b[i].bottomRightRadius * b[i].topLeftRadius * b[i].topRightRadius !== 0 || b[i].name.split("png").length > 1) {
                        imgtype = "png"
                        //console.log(name.split(' ')[0] + " 格式识别为：png")
                    }else{
                        imgtype = "jpg"
                        //console.log(name.split(' ')[0] + " 格式识别为：jpg")
                    }
                }
                if (b[i].getPluginData('s') !== ''){
                    frameData.push({name:name,s:b[i].getPluginData('s'),type:imgtype,id:b[i].id});
                    //console.log(name.split(' ')[0] + " 大小已预设为：" + b[i].getPluginData('s') + 'k');
                } else {
                    var nameS = name.match(/(\d+)(?=[kK])/);
                    if(nameS){
                        //console.log(name.split(' ')[0] + " 大小识别为：" + nameS[1] + 'k(首次识别成功将进行预设)');
                        b[i].setPluginData('s',nameS[1])
                        frameData.push({name:name,s:nameS[1],type:imgtype,id:b[i].id});
                    } else {
                        //console.log(name.split(' ')[0] + " 未识别到大小设置");
                        frameData.push({name:name,s:'',type:imgtype,id:b[i].id});
                    } 
                }  
                if ( i == b.length - 1){
                    var loading = figma.notify("加载中，请耐心等待~",{
                        timeout: 30000,
                    });
                    postmessage([[frameData,info],"frameExport"]) 
                    //console.log([frameData,info])
                    setTimeout(async function(){
                        var imgData = [];
                         for (var i = 0; i < b.length; i++){
                            if ( b[i].visible == true && b[i].width * b[i].height < 4096*4096){
                                imgData.push( await b[i].exportAsync({ format: 'PNG',constraint:{type:'SCALE',value:1} }) );
                            }  
                        };
                        postmessage([[imgData,info],"imgExport"]);
                        loading.cancel()
                    },100)
                }
            }  
        }    
    }
    //将组件填充到画板
    if ( info =='autoAddComponent'){
        var a = figma.currentPage;
        var b = a.selection;
      
        var id = b.find(item => item.type == 'COMPONENT' || item.type == 'INSTANCE').id
        //console.log(id)
        var key = a.findOne(item => item.id == id)
        console.log(key.name)
        if (key){
            for ( var i = 0; i < b.length; i++){
                if(b[i].type == 'FRAME'){
                    
                    if ( b[i].height > b[i].width){
                        var scale = b[i].height/key.height;  
                    } else {
                        var scale = b[i].width/key.width;  
                    }
                    
                    b[i].appendChild(key.createInstance())
                    b[i].children[b[i].children.length - 1].rescale(scale);
                    b[i].children[b[i].children.length - 1].unlockAspectRatio();//关闭等比例
                    b[i].children[b[i].children.length - 1].resize(b[i].width, b[i].height);
                    b[i].children[b[i].children.length - 1].x = 0;
                    b[i].children[b[i].children.length - 1].y = 0;  
                }
            }
        }
    }
    //复制母组件
    if ( info == 'newComponent'){
        var a = figma.currentPage;
        var b = a.selection;
        for ( var i = 0; i < b.length; i++){
            if(b[i].type == 'COMPONENT'){
                var index = b[i].parent.children.findIndex(item => item.id == b[i].id);
                var newnode = b[i].clone()
                b[i].parent.insertChild((index + 1),newnode)
                newnode.x += b[i].width + 20;
                newnode.name += " 拷贝";
            }
        }
    }
    //建立表格
    if ( type == 'creTable'){
        var a = figma.currentPage;
        var b = a.selection;
        var viewX = figma.viewport.center.x - ((figma.viewport.bounds.width/2  - 300)* figma.viewport.zoom)/// figma.viewport.bound.width/2 + 300;
        var viewY = figma.viewport.center.y;
        var x = viewX;
        var y = viewY;
        var H = Number(info[0]);
        var L = Number(info[1]);
        if ( b.length < 2){
            if ( b.length == 1){
                var data = tableToData(b[0].characters,true)
                H = data[0].length;
                L = data.length;
                //console.log(H,L)
                x = b[0].x + b[0].width + 60;
                y = b[0].y;
            }
            var node1 = figma.createComponent();
            node1.x = x;
            node1.y = y;
            creTableSet(node1, "table-表头",true,true,"表头文案")//需添加表格属性的节点，命名，是否显示区分色，是否需要填充文案，需要填充的文案/克隆的节点
            var node2 = figma.createComponent();
            node2.x = node1.x;
            node2.y = node1.y + 60;
            creTableSet(node2, "table-数据",false,true,"数据文案")

            var list = figma.createFrame()
            list.name = "#列";
            list.layoutPositioning = "AUTO";
            list.clipsContent = false;
            list.layoutMode = "VERTICAL";
            list.layoutWrap = "NO_WRAP";
            list.itemSpacing = 0;
            list.counterAxisSpacing= 0;
            list.paddingTop = 0;
            list.paddingBottom = 0;
            list.paddingLeft = 0;
            list.paddingRight= 0;
            list.fills = [];
            list.itemReverseZIndex = true;//正向堆叠，方便伪合并表格
            if ( H > 2){
                list.appendChild(node1.createInstance());
                for ( var e = 1; e < H; e++){
                    list.appendChild(node2.createInstance());
                }
            } else {
                list.appendChild(node1.createInstance());
                list.appendChild(node2.createInstance());
                list.appendChild(node2.createInstance());
                list.appendChild(node2.createInstance());
            }

            list.layoutMode = "VERTICAL";
            list.primaryAxisAlignItems = "MIN";
            list.primaryAxisSizingMode = "AUTO";
            list.counterAxisAlignContent = "AUTO";
            list.counterAxisAlignItems = "CENTER"; 
            list.counterAxisSizingMode = "AUTO";
            
            var table = figma.createFrame()
            table.x = x + 200;
            table.y = y;
            table.name = "#table";
            table.layoutPositioning = "AUTO";
            table.layoutMode = "HORIZONTAL";
            table.layoutWrap = "NO_WRAP";
            table.itemSpacing = 0;
            table.primaryAxisAlignItems = "MIN";
            table.primaryAxisSizingMode = "AUTO";
            table.counterAxisAlignItems = "MIN"; 
            table.counterAxisSizingMode = "AUTO";
            table.counterAxisSpacing= 0;
            table.paddingTop = 0;
            table.paddingBottom = 0;
            table.paddingLeft = 0;
            table.paddingRight= 0;
            table.fills = [];
            table.itemReverseZIndex = true;//正向堆叠，方便伪合并表格
            if ( L > 0 ){
                table.appendChild(list);
                for ( var e = 1; e < L; e++){
                    table.appendChild(list.clone());
                }
            }else{
                table.appendChild(list);
                table.appendChild(list.clone());
                table.appendChild(list.clone());
            }
            setStroke(table,'CENTER',[1,1,1,1])
            //setRadius(table,[16,16,16,16])
            table.fills = [{type:"SOLID",color:{r:0.175,g:0.175,b:0.175}}]

        }
        if ( b.length == 2){
            if ( b[0].name.split("表头").length !== 1 && b[1].name.split("数据").length !== 1 || b[1].name.split("表头").length !== 1 && b[0].name.split("数据").length !== 1){

                var list = figma.createFrame();
                list.name = "#列";
                list.fills = [];
                for ( var i = 0; i < b.length; i++){
                    if(b[i].type == "COMPONENT" || b[i].type == "INSTANCE"){
                        x = b[0].x;
                        y = b[0].y + 80;
                        if (b[i].name.split("表头").length !== 1){
                            list.insertChild(0,b[i].createInstance());
                        }
                        if (b[i].name.split("数据").length !== 1){
                            if( H > 0){
                                for ( var e = 0; e < H; e++){
                                    list.insertChild(e + 1,b[i].createInstance());
                                }
                            } else {
                                list.insertChild(1,b[i].createInstance());
                                list.insertChild(2,b[i].createInstance());
                                list.insertChild(3,b[i].createInstance());
                            }                
                        }    
                    } else{
                        x = b[0].x + 200;
                        y = b[0].y + 80;
                        if (b[i].name.split("表头").length !== 1){
                            var node1 = figma.createComponent();
                            node1.x = b[i].absoluteRenderBounds.x + 200;
                            node1.y = b[i].absoluteRenderBounds.y;
                            creTableSet(node1, "table-表头",true,false,b[i])
                            list.insertChild(0,node1.createInstance());
                        }
                        if (b[i].name.split("数据").length !== 1){
                            var node2 = figma.createComponent();
                            node2.x = b[i].absoluteRenderBounds.x + 200;
                            node2.y = b[i].absoluteRenderBounds.y;
                            creTableSet(node2, "table-数据",false,false,b[i])
                            //console.log(H)
                            if( H > 0){  
                                for ( var e = 0; e < H; e++){
                                    list.insertChild(e + 1,node2.createInstance());
                                }
                            } else {
                                list.insertChild(1,node2.createInstance());
                                list.insertChild(2,node2.createInstance());
                                list.insertChild(3,node2.createInstance());
                            }   
                        }
                    }
                }
                list.layoutPositioning = "AUTO";
                list.layoutMode = "VERTICAL";
                list.layoutWrap = "NO_WRAP";
                list.itemSpacing = 0;
                list.counterAxisSpacing= 0;
                list.paddingTop = 0;
                list.paddingBottom = 0;
                list.paddingLeft = 0;
                list.paddingRight= 0;
                var table = figma.createFrame()
                table.x = x;
                table.y = y;
                table.name = "#table";
                table.layoutPositioning = "AUTO";
                table.layoutMode = "HORIZONTAL";
                table.layoutWrap = "NO_WRAP";
                table.itemSpacing = 0;
                table.primaryAxisAlignItems = "MIN";
                table.primaryAxisSizingMode = "AUTO";
                table.counterAxisAlignItems = "MIN"; 
                table.counterAxisSizingMode = "AUTO";
                table.counterAxisSpacing= 0;
                table.paddingTop = 0;
                table.paddingBottom = 0;
                table.paddingLeft = 0;
                table.paddingRight= 0;
                table.fills = [];
                if ( L > 0){
                    table.appendChild(list);
                    for ( var e = 1; e < L; e++){
                        table.appendChild(list.clone());
                    }
                }else{
                    table.appendChild(list);
                    table.appendChild(list.clone());
                    table.appendChild(list.clone());
                }
                setStroke(table,'CENTER',[1,1,1,1])
                //setRadius(table,[16,16,16,16])
                table.fills = [{type:"SOLID",color:{r:0.175,g:0.175,b:0.175}}]
            }
            /*
            if( b[0].name.split("#table").length !== 1 && b[1].type == "TEXT" || b[1].name.split("#table").length !== 1 && b[0].type == "TEXT" ){
                for ( var i = 0; i < b.length; i++){
                    if (b[i].type == "TEXT"){
                        var data = tableToData(b[i].characters)
                        console.log(data)
                    }
                }
            }
            */
            
        }
        if ( b.length == 3){
            var keyType = ['INSTANCE', 'INSTANCE', 'TEXT']
            var keyType2 = ['COMPONENT', 'COMPONENT', 'TEXT']
            var keyType3 = ['INSTANCE', 'COMPONENT', 'TEXT']
            var T = b.map(obj => obj.type);
            if ( T.every(element => keyType.includes(element)) || T.every(element => keyType2.includes(element)) || T.every(element => keyType3.includes(element)) ){
                //console.log(T)
            }
            
        }
    }
    //表格填充数据
    if ( type == 'reTable'){
        var a = figma.currentPage;
        var b = a.selection;
        if (b.length == 1 && b[0].name.split("#table").length !== 1 && b[0].children[0].name.split('数据流').length == 1){
            
            if ( b[0].name.split("-横").length > 1){
                var datas = tableToData(info.trim(),true);
                var data = datas[0].map((col, i) => datas.map(row => row[i]))
            } else {
                var data = tableToData(info.trim(),true) 
            }
            var H = data[0].length - b[0].children[0].children.length;
            var L = data.length - b[0].children.length;

            addTable(b,H,L)
            for(var i = 0; i < b[0].children.length; i++){
                
                if (b[0].children[i].name.split('#列').length !== 1){
                    var c = b[0].children[i].children;
                    for (var ii = 0; ii < c.length; ii++){
                        //console.log(c[ii].name + ':' + data[i][ii])
                        //console.log(Object.keys(c[ii].componentProperties).length)
                        if ( Object.keys(c[ii].componentProperties).length >= 6){
                            var properties = [];
                            Object.keys(c[ii].componentProperties).forEach(item => {
                                properties.push({name:item.split("#")[0],id:item.split("#")[1]})
                            })

                            properties.forEach(item => {
                                console.log(item.name + '#' + item.id)
                                if(item.name.split('字').length !== 1 || item.name.split('文').length !== 1){
                                    c[ii].setProperties({[item.name + '#' + item.id]:data[i][ii]})
                                }
                            })
                            
                        }
                    }  
                }  
            } 
        }
        if (b.length == 1 && b[0].findAll((node) => node.name.split("#table").length > 1).length == 1){
            var table = b[0].findAll((node) => node.name.split("#table").length > 1)[0]
            a.selection = [table]

            if ( table.name.split("-横").length > 1){
                var datas = tableToData(info.trim(),true);
                var data = datas[0].map((col, i) => datas.map(row => row[i]))         
            } else {
                var data = tableToData(info.trim(),true) 
            }
            var H = data[0].length -table.children[0].children.length;
                var L = data.length - table.children.length;

            addTable([table],H,L)
            for(var i = 0; i < table.children.length; i++){
                
                if (table.children[i].name.split('#列').length !== 1){
                    var c = table.children[i].children;
                    for (var ii = 0; ii < c.length; ii++){
                        //console.log(c[ii].name + ':' + data[i][ii])
                        if ( Object.keys(c[ii].componentProperties).length >= 6){
                            var properties = [];
                            Object.keys(c[ii].componentProperties).forEach(item => {
                                properties.push({name:item.split("#")[0],id:item.split("#")[1]})
                            })

                            properties.forEach(item => {
                                console.log(item.name + '#' + item.id)
                                if(item.name.split('字').length !== 1 || item.name.split('文').length !== 1){
                                    c[ii].setProperties({[item.name + '#' + item.id]:data[i][ii]})
                                }
                            })
                            
                        }
                    }  
                }  
            } 
        }
        if (b.length == 1 && b[0].name.split("数据流").length !== 1 || b[0].children[0].name.split('数据流').length !== 1){
            var data = tableToData(info.trim(),false)
            var H = 0;
            var L = data.length - b[0].children.length;
            //console.log(data)
            addTable(b,H,L)
            for(var i = 0; i < b[0].children.length; i++){
                var keys = Object.keys(b[0].children[i].componentProperties)
                for (var e = 0; e < keys.length; e++){      
                    if ( keys[e].split('字').length !== 1 || keys[e].split('文').length !== 1 ){
                        //console.log(data[i],e)
                        b[0].children[i].setProperties({[keys[e]]:data[i][0]})
                    }
                }
            }
                   
        }

    }
    //从表格文本命名
    if ( type == 'reTableName'){
        var a = figma.currentPage;
        var b = a.selection;

        if (b.length == 1 && b[0].name.split("#table").length !== 1 ){
            var data = tableToData(info.trim(),true)
                var H = data[0].length - b[0].children[0].children.length;
                var L = data.length - b[0].children.length;
                console.log(data)
                addTable(b,H,L)
                for(var i = 0; i < b[0].children.length; i++){
                    for(var ii = 0; ii < b[0].children[i].children.length; ii++){
                        b[0].children[i].children[ii].name = data[i][ii]
                    }   
                }         
        }
        if (b.length == 1 &&  b[0].name.split('数据流').length !== 1){
            var data = tableToData(info.trim(),false)
                var H = 0;
                var L = data.length - b[0].children.length;
                addTable(b,H,L)
                for(var i = 0; i < b[0].children.length; i++){
                    b[0].children[i].name = data[i][0]
                }         
        }
    }
    //添加表格属性
    if ( type == 'asTable'){
        var a = figma.currentPage;
        var b = a.selection;
        for (var i = 0; i < b.length; i++){
            //var text = []

            if ( b[i].type == "COMPONENT"){
                if (  b[i].componentPropertyValues.length !== 6){
                    if (b[i].children.length == 1){
                        b[i].itemReverseZIndex = true;
                        var colorLayer = figma.createRectangle();
                        cloneMain(colorLayer,b[i]);
                        if (b[i].children[0].characters == "表头文案" || b[i].characters == "表头"){
                            colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4}}];
                        } else {
                            colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4}}];
                        }

                        var strokeTop = figma.createRectangle();
                        cloneMain(strokeTop,b[i]);
                        setStroke(strokeTop,"CENTER",[1,0,0,0]);
                        var strokeRight = figma.createRectangle();
                        cloneMain(strokeRight,b[i]);
                        setStroke(strokeRight,"CENTER",[0,1,0,0]);
                        var strokeBottom = figma.createRectangle();
                        cloneMain(strokeBottom,b[i]);
                        setStroke(strokeBottom,"CENTER",[0,0,1,0]);
                        var strokeLeft = figma.createRectangle();
                        cloneMain(strokeLeft,b[i]);
                        setStroke(strokeLeft,"CENTER",[0,0,0,1]);

                        var diffC = figma.group([colorLayer]);
                        var strokeT = figma.group([strokeTop]);
                        var strokeR = figma.group([strokeRight]);
                        var strokeB = figma.group([strokeBottom]);
                        var strokeL = figma.group([strokeLeft]);

                        if (b[i].children[0].characters == "表头文案" || b[i].characters == "表头"){
                            addAbsolute(b[i],diffC,"区分色",true)
                        } else {
                            addAbsolute(b[i],diffC,"区分色",false)
                        }
                        
                        addAbsolute(b[i],strokeT,"上描边",false)
                        addAbsolute(b[i],strokeR,"右描边",false)
                        addAbsolute(b[i],strokeB,"下描边",false)
                        addAbsolute(b[i],strokeL,"左描边",false)
                        b[i].itemReverseZIndex = false;
                    }
                }
                
                for ( var ii = b[i].children.length - 1; ii >= 0 ; ii--){  
                    if ( b[i].children[ii].layoutPositioning == "ABSOLUTE"){
                        b[i].children[ii].children[0].constraints = {
                            horizontal: "STRETCH",
                            vertical: "STRETCH"
                        }
                        //console.log(Object.keys(b[i].children[ii].componentPropertyReferences).length )
                        if (Object.keys(b[i].children[ii].componentPropertyReferences).length === 0){
                            var addLayerSet = b[i].addComponentProperty(b[i].children[ii].name,"BOOLEAN",false);
                            //console.log(addLayerSet)
                            b[i].children[ii].componentPropertyReferences = {isVisible:addLayerSet};
                        }
                    }
                }
                for ( var ii = b[i].children.length - 1; ii >= 0 ; ii--){          
                    if ( b[i].children[ii].type == "TEXT"){
                        b[i].children[ii].textAutoResize = "HEIGHT"
                        //console.log(Object.keys(b[i].children[ii].componentPropertyReferences).length )
                        if (Object.keys(b[i].children[ii].componentPropertyReferences).length === 0){
                            //text.push([b[i].children[ii].characters,])
                            var addTextSet = b[i].addComponentProperty("字段1", "TEXT", b[i].children[ii].characters);
                            //console.log(addTextSet)
                            b[i].children[ii].componentPropertyReferences = {characters:addTextSet};
                            
                        }
                    }
                }
            }
            if ( b[i].type == "TEXT"){
                var data = tableToData(b[i].characters,true)
                if ( data.length == 1 ){
                    //console.log(data[0])
                    var node = figma.createComponent();//b[i].clone()
                    node.x = b[i].absoluteRenderBounds.x + b[i].width * 1.5;
                    node.y = b[i].absoluteRenderBounds.y;
                    
                    node.layoutPositioning = "AUTO";
                    node.layoutMode = "HORIZONTAL";
                    node.layoutWrap = "NO_WRAP";
                    node.itemSpacing = 0;
                    node.primaryAxisAlignItems = "CENTER";
                    node.primaryAxisSizingMode = "FIXED";
                    node.counterAxisAlignItems = "CENTER"; 
                    node.counterAxisSizingMode = "FIXED";
                    node.counterAxisSpacing= 0;
                    node.paddingTop = 10;
                    node.paddingBottom = 10;
                    node.width = b[i].width * 2;
                    node.height = b[i].height + 20;
                    node.fills = [];
                    var colorLayer = figma.createRectangle();
                    cloneMain(colorLayer,node)
                    if (b[i].children[0].characters == "表头文案" || b[i].characters == "表头"){
                        colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4}}];
                    } else {
                        colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4}}];
                    }
                    var strokeTop = figma.createRectangle();
                    cloneMain(strokeTop,node);
                    setStroke(strokeTop,"CENTER",[1,0,0,0]);
                    var strokeRight = figma.createRectangle();
                    cloneMain(strokeRight,node);
                    setStroke(strokeRight,"CENTER",[0,1,0,0]);
                    var strokeBottom = figma.createRectangle();
                    cloneMain(strokeBottom,node);
                    setStroke(strokeBottom,"CENTER",[0,0,1,0]);
                    var strokeLeft = figma.createRectangle();
                    cloneMain(strokeLeft,node);
                    setStroke(strokeLeft,"CENTER",[0,0,0,1]);

                    var diffC = figma.group([colorLayer]);
                    var strokeT = figma.group([strokeTop]);
                    var strokeR = figma.group([strokeRight]);
                    var strokeB = figma.group([strokeBottom]);
                    var strokeL = figma.group([strokeLeft]);

                    if (b[i].characters == "表头文案" | b[i].characters == "表头"){
                        node.name = "table-表头";
                        addAbsolute(node,diffC,"区分色",true)
                    } else {
                        node.name = "table-数据";
                        addAbsolute(node,diffC,"区分色",false)
                    }
                    
                    addAbsolute(node,strokeT,"上描边",false)
                    addAbsolute(node,strokeR,"右描边",false)
                    addAbsolute(node,strokeB,"下描边",false)
                    addAbsolute(node,strokeL,"左描边",false)

                    var text = node.appendChild(b[i].clone())

                    for ( var ii = 0; ii < node.children.length; ii++){
                        if ( node.children[ii].type == "TEXT"){
                            
                            if (Object.keys(node.children[ii].componentPropertyReferences).length === 0){
                                var addTextSet = node.addComponentProperty("字段1", "TEXT", node.children[ii].characters);
                                node.children[ii].componentPropertyReferences = {characters:addTextSet};
                            }
                        }
                        if (node.children[ii].layoutPositioning == "ABSOLUTE"){
                            node.children[ii].children[0].constraints = {
                                horizontal: "STRETCH",
                                vertical: "STRETCH"
                            }
                        }
                    }
                    
                }
            }
            if ( b[i].children && b[i].children[b[i].children.length - 1].type == 'TEXT'){

            }
            
            
        }
    }
    //表格增减行列数
    if ( type == 'addTable'){
        //console.log(info)
        var a = figma.currentPage;
        var b = a.selection;
        var H = Number(info[0]);
        var L = Number(info[1]);
        addTable(b,H,L) 
    }
    //表格区分色
    if ( type == "diffColorTable"){      
        var a = figma.currentPage;
        var b = a.selection;
        if ( info == 'diffLine'){
            for (var i = 0; i < b.length; i++){
                if ( b[i].name.split("#table").length !== 1){
                    var c = b[i].children;
                    if ( b[i].name.split("-横").length !== 1){
                        console.log('横向表格')
                        for ( var ii = 0; ii < c.length; ii++){
                            if (c[ii].name.split('#列').length !== 1){
                                var d = c[ii].children;
                                if ( (ii + 1) % 2 == 0){
                                    for ( var iii = 0; iii < d.length; iii++){
                                        var properties = [];
                                        Object.keys(d[iii].componentProperties).forEach(item => {
                                            properties.push({name:item.split("#")[0],id:item.split("#")[1]})
                                        })

                                        properties.forEach(item => {
                                            if(item.name == '区分色'){
                                                d[iii].setProperties({[item.name + '#' + item.id]:false})
                                            }
                                        })
                                    }
                                } else {
                                    for ( var iii = 0; iii < d.length; iii++){
                                        var properties = [];
                                        Object.keys(d[iii].componentProperties).forEach(item => {
                                            properties.push({name:item.split("#")[0],id:item.split("#")[1]})
                                        })

                                        properties.forEach(item => {
                                            if(item.name == '区分色'){
                                                d[iii].setProperties({[item.name + '#' + item.id]:true})
                                            }
                                        })
                                    
                                    }
                                }
                                
                            
                            }
                        }

                    }else{
                        console.log('竖向表格');
                        for ( var ii = 0; ii < c.length; ii++){
                            if (c[ii].name.split('#列').length !== 1){
                                var d = c[ii].children;
                                for ( var iii = 1; iii < d.length; iii++){
                                    var properties = [];
                                    Object.keys(d[iii].componentProperties).forEach(item => {
                                        properties.push({name:item.split("#")[0],id:item.split("#")[1]})
                                    })

                                    if ( (iii + 1) % 2 !== 0){
                                        properties.forEach(item => {
                                            if(item.name == '区分色'){
                                                d[iii].setProperties({[item.name + '#' + item.id]:true})
                                            }
                                        })
                                    } else {
                                        properties.forEach(item => {
                                            if(item.name == '区分色'){
                                                d[iii].setProperties({[item.name + '#' + item.id]:false})
                                            }
                                        })
                                    }
                                }
                            
                            }
                        }
                    }
                }
                
            }
        }
        if ( info == 'all'){
 
            if ( diffColorTime%2 == 0){
                b.forEach(node =>{
                    var properties = [];
                    Object.keys(node.componentProperties).forEach(item => {
                        properties.push({name:item.split("#")[0],id:item.split("#")[1]})
                    })

                    properties.forEach(item => {
                        if(item.name == '区分色'){
                            node.setProperties({[item.name + '#' + item.id]:false})
                        }
                    })
                })
                diffColorTime++
            } else {
                b.forEach(node =>{
                    var properties = [];
                    Object.keys(node.componentProperties).forEach(item => {
                        properties.push({name:item.split("#")[0],id:item.split("#")[1]})
                    })

                    properties.forEach(item => {
                        if(item.name == '区分色'){
                            node.setProperties({[item.name + '#' + item.id]:true})
                        }
                    })
                })
                diffColorTime++
            }
            
        }
    }
    //连选中间格
    if ( type == "easePickTable"){
        var a = figma.currentPage;
        var b = a.selection;
        easePickTable(info,a,b)  
    }
    //反转表格行列
    if ( type == "translateTable"){
        var a = figma.currentPage;
        var b = a.selection;
        var loading =  figma.notify("生成中，请稍后",{
            timeout: 6000,
            });

        setTimeout(() => {   
        for ( var i = 0; i < b.length; i++){
            
            if ( b[i].name.split("#table").length !== 1){
                var H = 0,L = 0;

                for ( var ii = 0; ii < b[i].children.length; ii++){

                    if ( b[i].children[ii].name.split("#列").length !== 1){
                        H++
                    }
                }

                if ( b[i].children[0].name.split("#列").length !== 1){
                    

                    for ( var ii = 0; ii < b[i].children[0].children.length; ii++){
                        L++
                    }
                }
                
                var table = b[i].parent.insertChild(0,b[i].clone());
                
                var c =  b[i].parent.children[0];
                if ( b[i].children[0].children[1].name.split("表头").length == 1){
                    c.name += "-横";
                } else {
                    c.name = b[i].name.split("-横")[0];
                }
                addTable([c],H - L,L - H);
                for ( var ii = 0; ii < L; ii++){
                    for ( var iii = 0; iii < H; iii++){
                        c.children[ii].children[0].remove();//删一个少一个
                    }
                }
                for ( var ii = 0; ii < H; ii++){
                    for ( var iii = 0; iii < L; iii++){
                        c.children[iii].appendChild(b[i].children[ii].children[iii].clone());
                    }
                    
                }
                reTableStroke(c,H,L)
                b[i].remove();
                loading.cancel();
                a.selection = [c];
                
                

            }
        }
        },100);
        
    }
    //表格描边
    if ( type == "strokeTable"){
        var a = figma.currentPage;
        var b = a.selection;
        if ( info == 'diff'){
            var X = b.map(item => item.absoluteBoundingBox.x)
            var W = b.map(item => item.absoluteBoundingBox.width)
            var XX = [...new Set(X)]
            var WW = [...new Set(W)]
            var Y = b.map(item => item.absoluteBoundingBox.y)
            var H = b.map(item => item.absoluteBoundingBox.height)
            var YY = [...new Set(Y)]
            var HH = [...new Set(H)]
            if ( b.some( node => node.componentProperties[1].value == false || node.componentProperties[2].value == false || node.componentProperties[3].value == false || node.componentProperties[4].value == false)){
                figma.notify("含已合并的表格 / 非全描边表格",{
                    timeout: 3000,
                });
            } else {
                if ( (XX.length == 1 && WW.length == 1 && Math.max(...Y.map((value,index) => value + H[index])) - Math.min(...Y) == H.reduce((acc,item)=> acc + item,0)) ) {
                    console.log('竖向合并表格')
                    tableToArea(b,'l')
                    
                } else if ( (YY.length == 1 && HH.length == 1 && Math.max(...X.map((value,index) => value + W[index])) - Math.min(...X) == W.reduce((acc,item)=> acc + item,0))) {
                    console.log('横向合并表格')
                    tableToArea(b,'h')
                } else if ( XX.length * YY.length == b.length){
                    console.log([YY.length,XX.length])
                    tableToArea(b,'hl',[YY.length,XX.length])
                    
                    //console.log(b.map( node => node.componentProperties[5]))
                    
                } else {
                    console.log('无法合并表格')
                }
            }
        }
        if ( info == 'all'){
            var stroke;
            
            for ( var i = 0; i < b.length; i++){
                if ( b[i].mainComponent.componentPropertyValues[1].defaultValue == true ){
                    stroke = true;
                } else {
                    stroke = false;
                }
                for ( var ii = 1; ii < 5; ii++){
                    console.log(stroke)
                    b[i].setProperties({[b[i].componentProperties[ii].id]:stroke})
                }
            }
        }
       
        

    }
}


//封装postMessage
function postmessage(data){
    //console.log(data)
    /*figma*/
    figma.ui.postMessage({pluginMessage:data})
    /*mastergo*/
    //mg.ui.postMessage(data)
}

function cloneMain(newnode,oldnode,boundingBox){
    newnode.resize(oldnode.width,oldnode.height);
    if ( boundingBox ){
        newnode.x = oldnode.absoluteBoundingBox.x;
        newnode.y = oldnode.absoluteBoundingBox.y;
    } else {
        newnode.x = oldnode.absoluteRenderBounds.x;
        newnode.y = oldnode.absoluteRenderBounds.y;
    }
    
}

function tableToData(text,dataToList){
    if ( dataToList ){
        var h = text.split("\n");//[[文案\t文案\t文案],[文案\t文案\t文案]]
        var hs = [];//[[文案,文案,文案],[文案,文案,文案,]]
        var e = 0;
        for (var i = 0; i < h.length; i++){
            hs[e] = h[i].split("\t");
            e++
        }
        return hs[0].map((col, i) => hs.map(row => row[i]))
    } else {
        var h = text.split("\n");//[[文案\t文案\t文案],[文案\t文案\t文案]]
        var hs = [];//[[文案,文案,文案],[文案,文案,文案,]]
        var e = 0;
        for (var i = 0; i < h.length; i++){
            hs[e] = h[i].split("\t");
            e++
        }
        return hs
    }
    
}

function addAbsolute(parent,absoluteNode,names,view){
    parent.appendChild(absoluteNode);
    absoluteNode.name = names;
    absoluteNode.layoutPositioning = "ABSOLUTE";
    absoluteNode.x = 0;
    absoluteNode.y = 0;
    var addLayerSet = parent.addComponentProperty(names,"BOOLEAN",view);
    absoluteNode.componentPropertyReferences = {visible:addLayerSet};
}

function reTableStroke(table,H,L){
    for ( var i = 0; i < L; i++){
        for ( var ii = 0; ii < H; ii++){
            var c = table.children[i].children[ii];
            var keys = Object.keys(c.componentProperties)
            
            /*
            if ( c.componentProperties[1].name == '上描边' && c.componentProperties[4].name == '左描边'){
                var l = c.componentProperties[4].value;
                var r = c.componentProperties[2].value;
                var t = c.componentProperties[1].value;
                var b = c.componentProperties[3].value;
                c.setProperties({[c.componentProperties[4].id]:t});
                c.setProperties({[c.componentProperties[2].id]:b});
                c.setProperties({[c.componentProperties[1].id]:l});
                c.setProperties({[c.componentProperties[3].id]:r});
            }
            */
        }
    }
}

function creTableSet(node,name,view,needText,textOrClone,){
    node.name = name;
    node.layoutPositioning = "AUTO";
    node.clipsContent = false;
    node.layoutMode = "HORIZONTAL";
    node.layoutWrap = "NO_WRAP";
    node.itemSpacing = 0;
    node.counterAxisSpacing= 0;
    node.primaryAxisAlignItems = "CENTER";
    node.primaryAxisSizingMode = "FIXED";
    node.counterAxisAlignItems = "CENTER"; 
    node.counterAxisSizingMode = "FIXED";
    node.paddingTop = 10;
    node.paddingBottom = 10;
    node.resize(176,52);
    node.fills = [];
    var colorLayer = figma.createRectangle();
    cloneMain(colorLayer,node)
    if (view){
        colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4}}];
    } else {
        colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4},opacity:0.5}];
    }

    var strokeTop = figma.createRectangle();
    cloneMain(strokeTop,node);
    setStroke(strokeTop,"CENTER",[1,0,0,0]);
    var strokeRight = figma.createRectangle();
    cloneMain(strokeRight,node);
    setStroke(strokeRight,"CENTER",[0,1,0,0]);
    var strokeBottom = figma.createRectangle();
    cloneMain(strokeBottom,node);
    setStroke(strokeBottom,"CENTER",[0,0,1,0]);
    var strokeLeft = figma.createRectangle();
    cloneMain(strokeLeft,node);
    setStroke(strokeLeft,"CENTER",[0,0,0,1]);

    var diffC = figma.group([colorLayer],node);
    var strokeT = figma.group([strokeTop],node);
    var strokeR = figma.group([strokeRight],node);
    var strokeB = figma.group([strokeBottom],node);
    var strokeL = figma.group([strokeLeft],node);


    var absolutes = [
        [node,diffC,"区分色",view],
        [node,strokeT,"上描边",false],
        [node,strokeR,"右描边",false],
        [node,strokeB,"下描边",false],
        [node,strokeL,"左描边",false],
    ]
    absolutes.forEach(item => {
        addAbsolute(item[0],item[1],item[2],item[3],)
    })
    /*
    addAbsolute(node,diffC,"区分色",view)
    addAbsolute(node,strokeT,"上描边",false)
    addAbsolute(node,strokeR,"右描边",false)
    addAbsolute(node,strokeB,"下描边",false)
    addAbsolute(node,strokeL,"左描边",false)
    */

    if (needText == true){
        node.appendChild(figma.createText())

        for ( var ii = 0; ii < node.children.length; ii++){
            if ( node.children[ii].type == "TEXT"){
                
                if (Object.keys(node.children[ii].componentPropertyReferences).length === 0){
                    var addTextSet = node.addComponentProperty("字段1", "TEXT", node.children[ii].characters);
                    setTextMain(node.children[ii],22,textOrClone);
                    node.children[ii].componentPropertyReferences = {characters:addTextSet};
                    
                    
                }
            }
            if (node.children[ii].layoutPositioning == "ABSOLUTE"){
                node.children[ii].children[0].constraints = {
                    horizontal: "STRETCH",
                    vertical: "STRETCH"
                }
            }
        }
        node.counterAxisAlignItems = "CENTER"; 
    }else{
        node.appendChild(textOrClone.createInstance())
    }

    node.resize(176,52);
    
            
}

async function setTextMain(node,fontSize,text){
    await figma.listAvailableFontsAsync()
    await figma.loadFontAsync({ family: "Inter", style: "Regular" })
    node.characters = text;
    node.setRangeFontName(0,text.length,{"family": "Source Han Sans CN","style": "Regular"});
    node.setRangeFontSize(0,text.length,fontSize);
    node.textAlignHorizontal = "CENTER";
    node.textAutoResize = "WIDTH_AND_HEIGHT";//适应宽度，方便伪合并表格
}

function addTable(b,H,L){
    for (var i = 0; i < b.length; i++){
            
        if (b[i].name.split('#table').length !== 1 || b[i].name.split('数据流').length !== 1){
            if (b[i].children.length >= 1 ){
                if ( L > 0){
                    for( var e = 0; e < L; e++){
                        //console.log()
                        if (b[i].name.split('数据流').length !== 1){
                            var lists = b[i].children[0] 
                        } else {
                            var lists = b[i].children[Math.floor(b[i].children.length/2)]
                        }
                        
                        b[i].appendChild(lists.clone());
                    }
                } else if ( L < 0 ){
                    if (b[i].children.length > 1 ){
                        for( var e = 0; e < L * -1; e++){
                            //console.log()
                            var length = b[i].children.length - 1 ;
                            b[i].children[length].remove()
                        }
                    }
                }
            }
            for(var ii = 0; ii < b[i].children.length; ii++){ 
                if (b[i].children[ii].name.split('#列').length !== 1){
                    if (b[i].children[ii].children.length >= 2 ){
                        var data = b[i].children[ii].children[b[i].children[ii].children.length - 1]
                        if ( H > 0){
                            for( var e = 0; e < H; e++){
                                //console.log()
                                var list = b[i].children[ii];
                                var length = list.children.length - 1 ;
                                list.appendChild(data.clone());
                            }  
                        } else if ( H < 0 ){
                            if( b[i].children[ii].children.length > 2 ){
                                for( var e = 0; e < H * -1; e++){
                                    //console.log()
                                    var list = b[i].children[ii];
                                    var length = list.children.length - 1 ;
                                    list.children[length].remove()
                                }
                            }
                            
                        }   
                    }                        
                }
                
            }
        }
        
    }
}

function setStroke(node,align,trbl){
    node.fills = [];
    node.strokes = [{type:"SOLID",color:{r:0.5,g:0.5,b:0.5}}];
    node.strokeTopWeight = trbl[0];
    node.strokeRightWeight = trbl[1];
    node.strokeBottomWeight = trbl[2];
    node.strokeLeftWeight = trbl[3];
    node.strokeAlign = align
}

function setRadius(node,trbl){
    node.topLeftRadius = trbl[0];
    node.topRightRadius = trbl[1];
    node.bottomRightRadius= trbl[2];
    node.bottomLeftRadius = trbl[3];
}

function creCutArea(info){//{w:,h:,x:,y:,s:}
    var W = info.w,H = info.h;//图片宽高
    var Ws = info.w,Hs = info.h;//非尾部部分的裁剪宽高
    var lastWs = info.w,lastHs = info.h;//尾部的裁剪宽高
    var X = info.x,Y = info.y;//裁切区坐标
    var cutW = 1,cutH = 1;//纵横裁剪数量
    var cuts = [];//从左到右，从上到小的裁切区域集
    var tips;
    //切割方案
    if (W  * info.s <= cutMax && H  * info.s <= cutMax){//4K以内，正常生成
        cuts = [{w:W,h:H,x:info.x,y:info.y,s:1}]
        return cuts;
    } else {//多行列宫格
        cutW = Math.ceil((W  * info.s)/cutMax)
        cutH = Math.ceil((H  * info.s)/cutMax)
        if ( W%cutW == 0){ //宽度刚好等分
            Ws = W/cutW
            lastWs = Ws
            
        } else { //有小数点
            Ws = Math.ceil(W/cutW) //向上取整，最后一截短一些
            lastWs = W - (Ws*(cutW - 1))           
        }
        if ( H%cutH == 0){ //长度刚好等分
            Hs = H/cutH
            lastHs = Hs
            tips = "高被整除"
        } else { //有小数点
            Hs = Math.ceil(H/cutH) //向上取整，最后一截短一些
            lastHs = H - (Hs*(cutH - 1))
            tips = "高不能整除，剩余：" + lastHs
        }

        // 拆分图像数据
        for (var i = 0; i < (cutW * cutH); i++) {

            if ((i + 1)%cutW == 0 && i !== (cutW * cutH) - 1 && i !== 0){
                cuts.push({w:lastWs,h:Hs,x:X,y:Y,});
                Y = Y + Hs;
                X = info.x;
            } else if (i == (cutW * cutH) - 1){
                cuts.push({w:lastWs,h:lastHs,x:X,y:Y,t:tips});
            } else {
                if ( i > (cutW * (cutH - 1)) - 1){
                    cuts.push({w:Ws,h:lastHs,x:X,y:Y});
                } else {
                    cuts.push({w:Ws,h:Hs,x:X,y:Y});
                }
                
                if ( cutW == 1 ){
                    X = info.x;
                    Y = Y + Hs;
                } else {
                    X = X + Ws;
                }
                
            }
            
        }
        return cuts;
    }
    
}

function cutNode(a,node,scale){
    
    var c = creCutArea({w:node.absoluteRenderBounds.width,h:node.absoluteRenderBounds.height,x:node.absoluteRenderBounds.x,y:node.absoluteRenderBounds.y,s:scale,});
    var index = node.parent.children.findIndex(item => item === node);
    //console.log(c[c.length - 1].t)
    
    for ( var ii = 0; ii < c.length; ii++){
        var cutArea = mg.createSlice()
        cutArea.width = c[ii].w;
        cutArea.height = c[ii].h;
        cutArea.x = c[ii].x;
        cutArea.y = c[ii].y;
        var group = mg.group([node]);
            group.appendChild(cutArea);
        var cutImg = mg.createRectangle()
        var img = new Uint8Array(cutArea.export({ format: 'PNG',constraint:{type:'SCALE',value:scale}}))
        if ( c.length > 1 ){
            cutImg.name = node.name + "-" + (ii + 1);
        } else {
            cutImg.name = node.name + " @" + scale + "x";
        }
        cloneMain(cutImg,cutArea);
        fillTheSelection(cutImg,img);
        group.appendChild(cutImg);
        cutArea.remove();
        if (group.parent !== a){
            a.selection = [group.parent]
            a.selection[0].insertChild((index + 1),a.selection[0].children[index].children[0])
            a.selection[0].insertChild((index + 2),a.selection[0].children[index].children[0])  
            if ( c.length > 1 && ii == (c.length - 1)){
                var imgGroup = mg.group([a.selection[0].children[index + 1]]);
                imgGroup.name = node.name + " @" + scale + "x"
                for (var e = 1; e < c.length; e++){
                    imgGroup.appendChild(a.selection[0].children[index + 2])
                }
            }
        } else {
            console.log("无容器包裹")
            a.insertChild((index + 1),a.children[index].children[0])
            a.insertChild((index + 2),a.children[index].children[0])
            if ( c.length > 1 && ii == (c.length - 1)){
                var imgGroup = mg.group([a.children[index + 1]]);
                imgGroup.name = node.name + " @" + scale + "x"
                for (var e = 1; e < c.length; e++){
                    imgGroup.appendChild(a.children[index + 2])
                }
            }
            
        }
    }
        
}

function pickBefore(nodes){
    var a = figma.currentPage;
    var newNode = [];
    nodes.forEach(item => {
        //console.log(item.name)
        var parentnode = item.parent;
        var index = parentnode.children.findIndex(node => node === item);
        newNode.push(parentnode.children[index + 1]);
    })
    a.selection = newNode;
}

function mixPd(star,node,end,num,index){
    for ( var i = 0; i < star.length; i++){
        node[i].paddingTop = star[i].paddingTop + ((end[i].paddingTop - star[i].paddingTop)/num)*index
        node[i].paddingRight = star[i].paddingRight + ((end[i].paddingRight - star[i].paddingRight)/num)*index
        node[i].paddingBottom = star[i].paddingBottom + ((end[i].paddingBottom - star[i].paddingBottom)/num)*index
        node[i].paddingLeft = star[i].paddingLeft + ((end[i].paddingLeft - star[i].paddingLeft)/num)*index
    } 
}

function mixR(star,node,end,num,index){
    for ( var i = 0; i < star.length; i++){
        node[i].rotation = star[i].rotation + ((end[i].rotation - star[i].rotation)/num)*index
    }  
}

function mixWH(star,node,end,num,index){
    for ( var i = 0; i < star.length; i++){
        node[i].width = star[i].width + ((end[i].width - star[i].width)/num)*index
        node[i].height = star[i].height + ((end[i].height - star[i].height)/num)*index
    }  
}

function mixS(star,node,end,num,index){
    for ( var i = 0; i < star.length; i++){
        //console.log(num)
        var scale = 1 + Math.sqrt( (end[i].width * end[i].height)/(star[i].width * star[i].height) )/(num * 2) * index
        //console.log(scale)
        node[i].rescale(scale,{scaleCenter:'CENTER'})
    }  
}

async function mixisV(star,node,end,num,index){
    for ( var i = 0; i < star.length; i++){
        var V = await star[i].findChildren((item) => item.isVisible == true).length + (( end[i].findChildren((item) => item.isVisible == true).length - star[i].findChildren((item) => item.isVisible == true).length)/num)*index

        for( var ii = 0; ii < V; ii++){
            console.log(V,ii, node[i].children[ii])
            node[i].children[ii].isVisible = true
        }
            
    }  
}
