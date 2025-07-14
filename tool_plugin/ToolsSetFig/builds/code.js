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
    }
    //设置用户偏好
    if ( type == "setlocal"){
        //console.log(info)
        figma.clientStorage.setAsync(info[0],info[1])
    }
    //插件自由缩放
    if ( type == "resize"){
        figma.ui.resize(info[0], info[1]);
    }
    //插件最大化
    if ( type == "big"){
        if (info){
            figma.ui.resize(UI_BIG[0], UI_BIG[1]);  
        } else {
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
    if ( type == "createFrame"){
        console.log("创建画板：",info.length,"个");
        let a = figma.currentPage;
        let b = a.selection;

        //反传对象尺寸信息
        if ( info == 0 && b.length > 0){
            let frameInfo = [];
            b.forEach(item => {
                frameInfo.push(item.name.split(item.width)[0].trim() + '\t' + item.width + '\t' + item.height + '\n')
            })
            postmessage([frameInfo,'getFrame'])
        }


        let gap = 30;
        let maxW ,maxH ;
        let viewX = Math.floor( figma.viewport.center.x - ((figma.viewport.bounds.width/2  - 300)* figma.viewport.zoom))/// figma.viewport.bound.width/2 + 300;
        let viewY = Math.floor(figma.viewport.center.y);
        let x = viewX;
        let y = viewY;
        let allH = [];
        let allW = [];
        let ws = [0];
        let hs = [0];

        function easeframe(info,x,y,gap,isCreater){
            let starX = x, starY = y;
            let kvAll = info.filter(item => item.name.toLowerCase().split("kv").length > 1);
            let HH = info.filter(item => item.w > item.h && item.name.toLowerCase().split("kv").length == 1).sort((a, b) => b.w * b.h - a.w * a.h);//横板
            let maxW = Math.max(...HH.map(item => item.w));//找出最宽的图，作为横板换行标准
            let LL = info.filter(item => item.w < item.h && item.name.toLowerCase().split("kv").length == 1).sort((a, b) => b.w * b.h - a.w * a.h);//竖版
            let maxH = Math.max(...LL.map(item => item.h));//找出最高的图，作为竖版换行标准
            let FF = info.filter(item => item.w == item.h).sort((a, b) => b.w - a.w);//方形
            maxW = Math.max(1920,maxW);
            maxH = Math.max(1920,maxH);//1920是常见KV尺寸
            console.log("最宽",maxW,";最高：",maxH);

            let kvH = [0]
            for(let i = 0; i < kvAll.length; i++){
                let frame = kvAll[i]
                let s = frame.s ? frame.s : '';
                let type = frame.type ? frame.type : '';
                let isPng = type == 'png' ? true : false;
                createFrame({name:frame.name,w:frame.w,h:frame.h,x:x,y:y,s:s,type:type},isPng)
                x += frame.w + gap
                kvH.push(frame.h)
            }

            x = starX;
            y = starY + Math.max(...kvH) + gap;
            console.log("横版起点：",x,y)

            let lineH = [];
            let lineAllW;
            for(let i = 0; i < HH.length; i++){  
                let frame = HH[i];
                let s = frame.s ? frame.s : '';
                let type = frame.type ? frame.type : '';
                let isPng = type.toLowerCase() == 'png' ? true : false;
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

            let lineW = [];
            let lineAllH;
            for(let i = 0; i < LL.length; i++){      
                let frame = LL[i];
                let s = frame.s ? frame.s : '';
                let type = frame.type ? frame.type : '';
                let isPng = type.toLowerCase() == 'png' ? true : false;
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
            for(let i = 0; i < FF.length; i++){  
                let frame = FF[i];
                let s = frame.s ? frame.s : '';
                let type = frame.type ? frame.type : '';
                let isPng = type.toLowerCase() == 'png' ? true : false;
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
                let node = figma.createFrame()
                node.x = framedata.x;
                node.y = framedata.y;
                /*
                node.width = framedata.w;
                node.height = framedata.h;
                */
                node.resize(framedata.w,framedata.h)
                let minName = framedata.name + ' ' + framedata.w + '×' + framedata.h;
                let maxName = framedata.name + ' ' + framedata.s.replace(/[KkBbMm]/g,'') + 'k ' + framedata.w + '×' + framedata.h;
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
    //批量导入大图
    if( type == "createImage"){
        //console.log(info)
        let viewX = Math.floor( figma.viewport.center.x - ((figma.viewport.bounds.width/2  - 300)* figma.viewport.zoom));
        let viewY = Math.floor( figma.viewport.center.y - ((figma.viewport.bounds.height/2  - 300)* figma.viewport.zoom));
        let gap = 20;
        for ( let i = 0; i < info.length; i++){
            if (info[i].cuts > 1){

            } else {
                let node = figma.createImage(info[i].cuts[0].img);
                node.resize(info[i].w,info[i].h);
                node.x = viewX;
                node.y = viewY;
            }
            viewX += info[i].w + gap;
        }
    }
    //自动排列
    if ( info == 'autoLayout'){
        let a = figma.currentPage;
        let b = a.selection;
        let x = Math.min(...b.map(item => item.x)),XX = Math.min(...b.map(item => item.x));
        let y = Math.min(...b.map(item => item.y)),YY = Math.min(...b.map(item => item.y));
        let nodes = []
        for ( let i = 0; i < b.length; i++){
            nodes.push({x:b[i].x,y:b[i].y,w:b[i].width,h:b[i].height,i:i,})
            
            if( i == b.length - 1){
                //console.log(nodes)
                let HH = nodes.filter(item => item.w > item.h).sort((a, b) => b.w*b.h - a.w*a.h);//横板
                let maxW = Math.max(Math.max(...HH.map(item => item.w)),1920)
                let LL = nodes.filter(item => item.w < item.h).sort((a, b) => b.w*b.h - a.w*a.h);//竖版
                let maxH = Math.max(...LL.map(item => item.h))
                let FF = nodes.filter(item => item.w == item.h).sort((a, b) => b.w*b.h - a.w*a.h);//方形
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
                        x = x + HH[e].w; 
                    }
                }
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
                        y = y + LL[e].h; 
                    }
                }

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
        let a = figma.currentPage;
        let b = a.findOne(item => item.id == info[1]);
        b.setPluginData('s',info[0])
    }
    //记录导出格式设置
    if ( type == 'exportTypeSet'){
        //console.log(info)
        let a = figma.currentPage;
        let b = a.findOne(item => item.id == info[1]);
        b.setPluginData('type',info[0])
    }
    //处理要导出的图片
    if (type == 'exportImg'){  
        let a = figma.currentPage;
        let b = a.selection;     
        let frameData = [];
        let imgtype = "jpg";
        let typeAllow = ["jpg","jpeg","png","webp"];
        for (let i = 0; i < b.length; i++){
            if ( b[i].visible == true && b[i].width * b[i].height < 4096*4096){
                let name = b[i].name;
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
                    let nameS = name.match(/(\d+)(?=[kK])/);
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
                    let loading = figma.notify("加载中，请耐心等待~",{
                        timeout: 30000,
                    });
                    postmessage([[frameData,info],"frameExport"]) 
                    //console.log([frameData,info])
                    setTimeout(async function(){
                        let imgData = [];
                         for (let i = 0; i < b.length; i++){
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
        let a = figma.currentPage;
        let b = a.selection;
      
        let id = b.find(item => item.type == 'COMPONENT' || item.type == 'INSTANCE').id
        //console.log(id)
        let key = a.findOne(item => item.id == id)
        console.log(key.name)
        if (key){
            for ( let i = 0; i < b.length; i++){
                if(b[i].type == 'FRAME'){
                    
                    if ( b[i].height > b[i].width){
                        let scale = b[i].height/key.height;  
                    } else {
                        let scale = b[i].width/key.width;  
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
        let a = figma.currentPage;
        let b = a.selection;
        for ( let i = 0; i < b.length; i++){
            if(b[i].type == 'COMPONENT'){
                let index = b[i].parent.children.findIndex(item => item.id == b[i].id);
                let newnode = b[i].clone()
                b[i].parent.insertChild((index + 1),newnode)
                newnode.x += b[i].width + 20;
                newnode.name += " 拷贝";
            }
        }
    }
    //建立表格
    if ( type == 'creTable'){
        let a = figma.currentPage;
        let b = a.selection;
        let viewX = figma.viewport.center.x - ((figma.viewport.bounds.width/2  - 300)* figma.viewport.zoom)/// figma.viewport.bound.width/2 + 300;
        let viewY = figma.viewport.center.y;
        let x = viewX;
        let y = viewY;
        let H = Number(info[0]);
        let L = Number(info[1]);
        if ( b.length < 2){
            if ( b.length == 1){
                let data = tableToData(b[0].characters,true)
                H = data[0].length;
                L = data.length;
                //console.log(H,L)
                x = b[0].x + b[0].width + 60;
                y = b[0].y;
            }
            let node1 = figma.createComponent();
            node1.x = x;
            node1.y = y;
            creTableSet(node1, "table-表头",true,true,"表头文案")//需添加表格属性的节点，命名，是否显示区分色，是否需要填充文案，需要填充的文案/克隆的节点
            let node2 = figma.createComponent();
            node2.x = node1.x;
            node2.y = node1.y + 60;
            creTableSet(node2, "table-数据",false,true,"数据文案")

            let list = figma.createFrame()
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
                for ( let e = 1; e < H; e++){
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
            
            let table = figma.createFrame()
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
                for ( let e = 1; e < L; e++){
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

                let list = figma.createFrame();
                list.name = "#列";
                list.fills = [];
                for ( let i = 0; i < b.length; i++){
                    if(b[i].type == "COMPONENT" || b[i].type == "INSTANCE"){
                        x = b[0].x;
                        y = b[0].y + 80;
                        if (b[i].name.split("表头").length !== 1){
                            list.insertChild(0,b[i].createInstance());
                        }
                        if (b[i].name.split("数据").length !== 1){
                            if( H > 0){
                                for ( let e = 0; e < H; e++){
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
                            let node1 = figma.createComponent();
                            node1.x = b[i].absoluteRenderBounds.x + 200;
                            node1.y = b[i].absoluteRenderBounds.y;
                            creTableSet(node1, "table-表头",true,false,b[i])
                            list.insertChild(0,node1.createInstance());
                        }
                        if (b[i].name.split("数据").length !== 1){
                            let node2 = figma.createComponent();
                            node2.x = b[i].absoluteRenderBounds.x + 200;
                            node2.y = b[i].absoluteRenderBounds.y;
                            creTableSet(node2, "table-数据",false,false,b[i])
                            //console.log(H)
                            if( H > 0){  
                                for ( let e = 0; e < H; e++){
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
                let table = figma.createFrame()
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
                    for ( let e = 1; e < L; e++){
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
                for ( let i = 0; i < b.length; i++){
                    if (b[i].type == "TEXT"){
                        let data = tableToData(b[i].characters)
                        console.log(data)
                    }
                }
            }
            */
            
        }
        if ( b.length == 3){
            let keyType = ['INSTANCE', 'INSTANCE', 'TEXT']
            let keyType2 = ['COMPONENT', 'COMPONENT', 'TEXT']
            let keyType3 = ['INSTANCE', 'COMPONENT', 'TEXT']
            let T = b.map(obj => obj.type);
            if ( T.every(element => keyType.includes(element)) || T.every(element => keyType2.includes(element)) || T.every(element => keyType3.includes(element)) ){
                //console.log(T)
            }
            
        }
    }
    //表格填充数据
    if ( type == 'reTable'){
        let a = figma.currentPage;
        let b = a.selection;
        if (b.length == 1 && b[0].name.split("#table").length !== 1 && b[0].children[0].name.split('数据流').length == 1){
            
            if ( b[0].name.split("-横").length > 1){
                let datas = tableToData(info.trim(),true);
                let data = datas[0].map((col, i) => datas.map(row => row[i]))
            } else {
                let data = tableToData(info.trim(),true) 
            }
            let H = data[0].length - b[0].children[0].children.length;
            let L = data.length - b[0].children.length;

            addTable(b,H,L)
            for(let i = 0; i < b[0].children.length; i++){
                
                if (b[0].children[i].name.split('#列').length !== 1){
                    let c = b[0].children[i].children;
                    for (let ii = 0; ii < c.length; ii++){
                        //console.log(c[ii].name + ':' + data[i][ii])
                        //console.log(Object.keys(c[ii].componentProperties).length)
                        if ( Object.keys(c[ii].componentProperties).length >= 6){
                            let properties = [];
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
            let table = b[0].findAll((node) => node.name.split("#table").length > 1)[0]
            a.selection = [table]

            if ( table.name.split("-横").length > 1){
                let datas = tableToData(info.trim(),true);
                let data = datas[0].map((col, i) => datas.map(row => row[i]))         
            } else {
                let data = tableToData(info.trim(),true) 
            }
            let H = data[0].length -table.children[0].children.length;
                let L = data.length - table.children.length;

            addTable([table],H,L)
            for(let i = 0; i < table.children.length; i++){
                
                if (table.children[i].name.split('#列').length !== 1){
                    let c = table.children[i].children;
                    for (let ii = 0; ii < c.length; ii++){
                        //console.log(c[ii].name + ':' + data[i][ii])
                        if ( Object.keys(c[ii].componentProperties).length >= 6){
                            let properties = [];
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
            let data = tableToData(info.trim(),false)
            let H = 0;
            let L = data.length - b[0].children.length;
            //console.log(data)
            addTable(b,H,L)
            for(let i = 0; i < b[0].children.length; i++){
                let keys = Object.keys(b[0].children[i].componentProperties)
                for (let e = 0; e < keys.length; e++){      
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
        let a = figma.currentPage;
        let b = a.selection;

        if (b.length == 1 && b[0].name.split("#table").length !== 1 ){
            let data = tableToData(info.trim(),true)
                let H = data[0].length - b[0].children[0].children.length;
                let L = data.length - b[0].children.length;
                console.log(data)
                addTable(b,H,L)
                for(let i = 0; i < b[0].children.length; i++){
                    for(let ii = 0; ii < b[0].children[i].children.length; ii++){
                        b[0].children[i].children[ii].name = data[i][ii]
                    }   
                }         
        }
        if (b.length == 1 &&  b[0].name.split('数据流').length !== 1){
            let data = tableToData(info.trim(),false)
                let H = 0;
                let L = data.length - b[0].children.length;
                addTable(b,H,L)
                for(let i = 0; i < b[0].children.length; i++){
                    b[0].children[i].name = data[i][0]
                }         
        }
    }
    //添加表格属性
    if ( type == 'asTable'){
        let a = figma.currentPage;
        let b = a.selection;
        for (let i = 0; i < b.length; i++){
            //let text = []

            if ( b[i].type == "COMPONENT"){
                if (  b[i].componentPropertyValues.length !== 6){
                    if (b[i].children.length == 1){
                        b[i].itemReverseZIndex = true;
                        let colorLayer = figma.createRectangle();
                        cloneMain(colorLayer,b[i]);
                        if (b[i].children[0].characters == "表头文案" || b[i].characters == "表头"){
                            colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4}}];
                        } else {
                            colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4}}];
                        }

                        let strokeTop = figma.createRectangle();
                        cloneMain(strokeTop,b[i]);
                        setStroke(strokeTop,"CENTER",[1,0,0,0]);
                        let strokeRight = figma.createRectangle();
                        cloneMain(strokeRight,b[i]);
                        setStroke(strokeRight,"CENTER",[0,1,0,0]);
                        let strokeBottom = figma.createRectangle();
                        cloneMain(strokeBottom,b[i]);
                        setStroke(strokeBottom,"CENTER",[0,0,1,0]);
                        let strokeLeft = figma.createRectangle();
                        cloneMain(strokeLeft,b[i]);
                        setStroke(strokeLeft,"CENTER",[0,0,0,1]);

                        let diffC = figma.group([colorLayer]);
                        let strokeT = figma.group([strokeTop]);
                        let strokeR = figma.group([strokeRight]);
                        let strokeB = figma.group([strokeBottom]);
                        let strokeL = figma.group([strokeLeft]);

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
                
                for ( let ii = b[i].children.length - 1; ii >= 0 ; ii--){  
                    if ( b[i].children[ii].layoutPositioning == "ABSOLUTE"){
                        b[i].children[ii].children[0].constraints = {
                            horizontal: "STRETCH",
                            vertical: "STRETCH"
                        }
                        //console.log(Object.keys(b[i].children[ii].componentPropertyReferences).length )
                        if (Object.keys(b[i].children[ii].componentPropertyReferences).length === 0){
                            let addLayerSet = b[i].addComponentProperty(b[i].children[ii].name,"BOOLEAN",false);
                            //console.log(addLayerSet)
                            b[i].children[ii].componentPropertyReferences = {isVisible:addLayerSet};
                        }
                    }
                }
                for ( let ii = b[i].children.length - 1; ii >= 0 ; ii--){          
                    if ( b[i].children[ii].type == "TEXT"){
                        b[i].children[ii].textAutoResize = "HEIGHT"
                        //console.log(Object.keys(b[i].children[ii].componentPropertyReferences).length )
                        if (Object.keys(b[i].children[ii].componentPropertyReferences).length === 0){
                            //text.push([b[i].children[ii].characters,])
                            let addTextSet = b[i].addComponentProperty("字段1", "TEXT", b[i].children[ii].characters);
                            //console.log(addTextSet)
                            b[i].children[ii].componentPropertyReferences = {characters:addTextSet};
                            
                        }
                    }
                }
            }
            if ( b[i].type == "TEXT"){
                let data = tableToData(b[i].characters,true)
                if ( data.length == 1 ){
                    //console.log(data[0])
                    let node = figma.createComponent();//b[i].clone()
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
                    let colorLayer = figma.createRectangle();
                    cloneMain(colorLayer,node)
                    if (b[i].children[0].characters == "表头文案" || b[i].characters == "表头"){
                        colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4}}];
                    } else {
                        colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4}}];
                    }
                    let strokeTop = figma.createRectangle();
                    cloneMain(strokeTop,node);
                    setStroke(strokeTop,"CENTER",[1,0,0,0]);
                    let strokeRight = figma.createRectangle();
                    cloneMain(strokeRight,node);
                    setStroke(strokeRight,"CENTER",[0,1,0,0]);
                    let strokeBottom = figma.createRectangle();
                    cloneMain(strokeBottom,node);
                    setStroke(strokeBottom,"CENTER",[0,0,1,0]);
                    let strokeLeft = figma.createRectangle();
                    cloneMain(strokeLeft,node);
                    setStroke(strokeLeft,"CENTER",[0,0,0,1]);

                    let diffC = figma.group([colorLayer]);
                    let strokeT = figma.group([strokeTop]);
                    let strokeR = figma.group([strokeRight]);
                    let strokeB = figma.group([strokeBottom]);
                    let strokeL = figma.group([strokeLeft]);

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

                    let text = node.appendChild(b[i].clone())

                    for ( let ii = 0; ii < node.children.length; ii++){
                        if ( node.children[ii].type == "TEXT"){
                            
                            if (Object.keys(node.children[ii].componentPropertyReferences).length === 0){
                                let addTextSet = node.addComponentProperty("字段1", "TEXT", node.children[ii].characters);
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
        let a = figma.currentPage;
        let b = a.selection;
        let H = Number(info[0]);
        let L = Number(info[1]);
        addTable(b,H,L) 
    }
    //表格区分色
    if ( type == "diffColorTable"){      
        let a = figma.currentPage;
        let b = a.selection;
        if ( info == 'diffLine'){
            for (let i = 0; i < b.length; i++){
                if ( b[i].name.split("#table").length !== 1){
                    let c = b[i].children;
                    if ( b[i].name.split("-横").length !== 1){
                        console.log('横向表格')
                        for ( let ii = 0; ii < c.length; ii++){
                            if (c[ii].name.split('#列').length !== 1){
                                let d = c[ii].children;
                                if ( (ii + 1) % 2 == 0){
                                    for ( let iii = 0; iii < d.length; iii++){
                                        let properties = [];
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
                                    for ( let iii = 0; iii < d.length; iii++){
                                        let properties = [];
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
                        for ( let ii = 0; ii < c.length; ii++){
                            if (c[ii].name.split('#列').length !== 1){
                                let d = c[ii].children;
                                for ( let iii = 1; iii < d.length; iii++){
                                    let properties = [];
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
                    let properties = [];
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
                    let properties = [];
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
        let a = figma.currentPage;
        let b = a.selection;
        easePickTable(info,a,b)  
    }
    //反转表格行列
    if ( type == "translateTable"){
        let a = figma.currentPage;
        let b = a.selection;
        let loading =  figma.notify("生成中，请稍后",{
            timeout: 6000,
            });

        setTimeout(() => {   
        for ( let i = 0; i < b.length; i++){
            
            if ( b[i].name.split("#table").length !== 1){
                let H = 0,L = 0;

                for ( let ii = 0; ii < b[i].children.length; ii++){

                    if ( b[i].children[ii].name.split("#列").length !== 1){
                        H++
                    }
                }

                if ( b[i].children[0].name.split("#列").length !== 1){
                    

                    for ( let ii = 0; ii < b[i].children[0].children.length; ii++){
                        L++
                    }
                }
                
                let table = b[i].parent.insertChild(0,b[i].clone());
                
                let c =  b[i].parent.children[0];
                if ( b[i].children[0].children[1].name.split("表头").length == 1){
                    c.name += "-横";
                } else {
                    c.name = b[i].name.split("-横")[0];
                }
                addTable([c],H - L,L - H);
                for ( let ii = 0; ii < L; ii++){
                    for ( let iii = 0; iii < H; iii++){
                        c.children[ii].children[0].remove();//删一个少一个
                    }
                }
                for ( let ii = 0; ii < H; ii++){
                    for ( let iii = 0; iii < L; iii++){
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
        let a = figma.currentPage;
        let b = a.selection;
        if ( info == 'diff'){
            let X = b.map(item => item.absoluteBoundingBox.x)
            let W = b.map(item => item.absoluteBoundingBox.width)
            let XX = [...new Set(X)]
            let WW = [...new Set(W)]
            let Y = b.map(item => item.absoluteBoundingBox.y)
            let H = b.map(item => item.absoluteBoundingBox.height)
            let YY = [...new Set(Y)]
            let HH = [...new Set(H)]
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
            let stroke;
            
            for ( let i = 0; i < b.length; i++){
                if ( b[i].mainComponent.componentPropertyValues[1].defaultValue == true ){
                    stroke = true;
                } else {
                    stroke = false;
                }
                for ( let ii = 1; ii < 5; ii++){
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
            let n = node.name;
            let w = node.width;
            let h = node.height;
            let lengthE = n.replace(/[\u4e00-\u9fa5]/g,'').length*1;
            let lengthZ = n.replace(/[^\u4e00-\u9fa5]/g,'').length*2;
            if(lengthZ > lengthE){
                if((lengthE + lengthZ) > 10){
                    n = n.substring(0,6) + '..';
                }
            } else {
                if((lengthE + lengthZ) > 10){
                    n = n.substring(0,11) + '..';
                }
            }
            //console.log(lengthE,lengthZ,n)
            data.push([n,w,h])
        });
        figma.clientStorage.getAsync('tabPick')
        .then(tab => {
            if(tab == 'more tools' || data.length == 0){
                postmessage([JSON.stringify(data),'selectInfo']);
            }
        }); 
    };
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
        let h = text.split("\n");//[[文案\t文案\t文案],[文案\t文案\t文案]]
        let hs = [];//[[文案,文案,文案],[文案,文案,文案,]]
        let e = 0;
        for (let i = 0; i < h.length; i++){
            hs[e] = h[i].split("\t");
            e++
        }
        return hs[0].map((col, i) => hs.map(row => row[i]))
    } else {
        let h = text.split("\n");//[[文案\t文案\t文案],[文案\t文案\t文案]]
        let hs = [];//[[文案,文案,文案],[文案,文案,文案,]]
        let e = 0;
        for (let i = 0; i < h.length; i++){
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
    let addLayerSet = parent.addComponentProperty(names,"BOOLEAN",view);
    absoluteNode.componentPropertyReferences = {visible:addLayerSet};
}

function reTableStroke(table,H,L){
    for ( let i = 0; i < L; i++){
        for ( let ii = 0; ii < H; ii++){
            let c = table.children[i].children[ii];
            let keys = Object.keys(c.componentProperties)
            
            /*
            if ( c.componentProperties[1].name == '上描边' && c.componentProperties[4].name == '左描边'){
                let l = c.componentProperties[4].value;
                let r = c.componentProperties[2].value;
                let t = c.componentProperties[1].value;
                let b = c.componentProperties[3].value;
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
    let colorLayer = figma.createRectangle();
    cloneMain(colorLayer,node)
    if (view){
        colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4}}];
    } else {
        colorLayer.fills = [{type:"SOLID",color:{r:0.4,g:0.4,b:0.4},opacity:0.5}];
    }

    let strokeTop = figma.createRectangle();
    cloneMain(strokeTop,node);
    setStroke(strokeTop,"CENTER",[1,0,0,0]);
    let strokeRight = figma.createRectangle();
    cloneMain(strokeRight,node);
    setStroke(strokeRight,"CENTER",[0,1,0,0]);
    let strokeBottom = figma.createRectangle();
    cloneMain(strokeBottom,node);
    setStroke(strokeBottom,"CENTER",[0,0,1,0]);
    let strokeLeft = figma.createRectangle();
    cloneMain(strokeLeft,node);
    setStroke(strokeLeft,"CENTER",[0,0,0,1]);

    let diffC = figma.group([colorLayer],node);
    let strokeT = figma.group([strokeTop],node);
    let strokeR = figma.group([strokeRight],node);
    let strokeB = figma.group([strokeBottom],node);
    let strokeL = figma.group([strokeLeft],node);


    let absolutes = [
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

        for ( let ii = 0; ii < node.children.length; ii++){
            if ( node.children[ii].type == "TEXT"){
                
                if (Object.keys(node.children[ii].componentPropertyReferences).length === 0){
                    let addTextSet = node.addComponentProperty("字段1", "TEXT", node.children[ii].characters);
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
    for (let i = 0; i < b.length; i++){
            
        if (b[i].name.split('#table').length !== 1 || b[i].name.split('数据流').length !== 1){
            if (b[i].children.length >= 1 ){
                if ( L > 0){
                    for( let e = 0; e < L; e++){
                        //console.log()
                        if (b[i].name.split('数据流').length !== 1){
                            let lists = b[i].children[0] 
                        } else {
                            let lists = b[i].children[Math.floor(b[i].children.length/2)]
                        }
                        
                        b[i].appendChild(lists.clone());
                    }
                } else if ( L < 0 ){
                    if (b[i].children.length > 1 ){
                        for( let e = 0; e < L * -1; e++){
                            //console.log()
                            let length = b[i].children.length - 1 ;
                            b[i].children[length].remove()
                        }
                    }
                }
            }
            for(let ii = 0; ii < b[i].children.length; ii++){ 
                if (b[i].children[ii].name.split('#列').length !== 1){
                    if (b[i].children[ii].children.length >= 2 ){
                        let data = b[i].children[ii].children[b[i].children[ii].children.length - 1]
                        if ( H > 0){
                            for( let e = 0; e < H; e++){
                                //console.log()
                                let list = b[i].children[ii];
                                let length = list.children.length - 1 ;
                                list.appendChild(data.clone());
                            }  
                        } else if ( H < 0 ){
                            if( b[i].children[ii].children.length > 2 ){
                                for( let e = 0; e < H * -1; e++){
                                    //console.log()
                                    let list = b[i].children[ii];
                                    let length = list.children.length - 1 ;
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
    let W = info.w,H = info.h;//图片宽高
    let Ws = info.w,Hs = info.h;//非尾部部分的裁剪宽高
    let lastWs = info.w,lastHs = info.h;//尾部的裁剪宽高
    let X = info.x,Y = info.y;//裁切区坐标
    let cutW = 1,cutH = 1;//纵横裁剪数量
    let cuts = [];//从左到右，从上到小的裁切区域集
    let tips;
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
        for (let i = 0; i < (cutW * cutH); i++) {

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
    
    let c = creCutArea({w:node.absoluteRenderBounds.width,h:node.absoluteRenderBounds.height,x:node.absoluteRenderBounds.x,y:node.absoluteRenderBounds.y,s:scale,});
    let index = node.parent.children.findIndex(item => item === node);
    //console.log(c[c.length - 1].t)
    
    for ( let ii = 0; ii < c.length; ii++){
        let cutArea = mg.createSlice()
        cutArea.width = c[ii].w;
        cutArea.height = c[ii].h;
        cutArea.x = c[ii].x;
        cutArea.y = c[ii].y;
        let group = mg.group([node]);
            group.appendChild(cutArea);
        let cutImg = mg.createRectangle()
        let img = new Uint8Array(cutArea.export({ format: 'PNG',constraint:{type:'SCALE',value:scale}}))
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
                let imgGroup = mg.group([a.selection[0].children[index + 1]]);
                imgGroup.name = node.name + " @" + scale + "x"
                for (let e = 1; e < c.length; e++){
                    imgGroup.appendChild(a.selection[0].children[index + 2])
                }
            }
        } else {
            console.log("无容器包裹")
            a.insertChild((index + 1),a.children[index].children[0])
            a.insertChild((index + 2),a.children[index].children[0])
            if ( c.length > 1 && ii == (c.length - 1)){
                let imgGroup = mg.group([a.children[index + 1]]);
                imgGroup.name = node.name + " @" + scale + "x"
                for (let e = 1; e < c.length; e++){
                    imgGroup.appendChild(a.children[index + 2])
                }
            }
            
        }
    }
        
}

function pickBefore(nodes){
    let a = figma.currentPage;
    let newNode = [];
    nodes.forEach(item => {
        //console.log(item.name)
        let parentnode = item.parent;
        let index = parentnode.children.findIndex(node => node === item);
        newNode.push(parentnode.children[index + 1]);
    })
    a.selection = newNode;
}

