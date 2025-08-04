/// <reference types="@figma/plugin-typings" />
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
let TRUES = ['true',true,'1',1,'show','是','有'];
let FALSES = ['false',false,'0',0,'hide','否','无'];
let TAGS_KEY = ['.fill','.stroke','.fillStyle','.strokeStyle','.visible','.opacity','.fontSize','.xywh'];
let CLIP_NAME = [
    ['@T?','@C?','@B?'],
    ['@?L','@?C','@?R'],
    ['@TC','@CT-C','@CC-C','@CB-C','@BC'],
    ['@CL','@CC-L','@CC-C','@CC-R','@CR'],
    [
        '@TL','@TC','@TR',
        '@CL','@CC','@CR',
        '@BL','@BC','@BR',
    ],
    [
        '@TL',  '@TC',  '@TR',
        '@CL-T','@CT-C','@CR-T',
        '@CL',  '@CC',  '@CR',
        '@CL-B','@CB-C','@CR-B',
        '@BL',  '@BC',  '@BR',
    ],
    [
        '@TL',  '@TC-L','@TC',  '@TC-R','@TR',
        '@CL',  '@CC-L','@CC-C','@CC-R','@CR',
        '@BL',  '@BC-L','@BC',  '@BC-R','@BR',
    ],
    [
        '@TL',  '@TC-L','@TC',  '@TC-R','@TR',
        '@CL-T','@CT-L','@CT-C','@CT-R','@CR-T',
        '@CL',  '@CC-L','@CC-C','@CC-R','@CR',
        '@CL-B','@CB-L','@CB-C','@CB-R','@CR-B',
        '@BL',  '@BC-L','@BC',  '@BC-R','@BR',
    ]
];
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
            let fills = [toRGB('#ffffff',true)];
            if(info[i].type){
                if(info[i].type.toLowerCase() == 'png'){
                    fills = []
                };
            };
            let node = addFrame([info[i].w,info[i].h,null,null,info[i].name,fills]);
            if(info[i].node){
                let setobj = eval('(' + info[i].node + ')')//JSON.parse(info[i].node)
                let keys = Object.keys(setobj);
                //console.log(info[i].node,setobj,keys)
                keys.forEach(item => {
                    switch (item){
                        case 'guid'://["X" | "Y",123]
                            let guides = setobj.guid.map(guid => ({axis:guid[0],offset: guid[1]}))
                            //console.log(guides)
                            if(guides){
                                node.guides = guides;
                            };
                        ;break
                    };
                });
            };
            if(info[i].s){
                console.log(info[i].s)
                node.setPluginData('exportSize',info[i].s.toString())
            };
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
            let table = all[2];
            //模拟输入的数据，注意是按列记录而不是按行
            let test = [
                ["A1","a2","a3","a4"],
                ["B1","b2","b3","b4"],
                ["C1","c2","c3","c4"]
            ];
            reCompNum(table,2,2);
            reTableByArray(table,test,'[enter]','--');
            reTableStyle(table,info[0]);
            //如果用了自定义组件，则重新排列，避免太分散
            if(newth == th || newtd == td){
                let layerIndex = th.parent.children.findIndex(item => item.id == th.id);
                layoutByRatio(all,true);
                all.forEach(item => {
                    th.parent.insertChild((layerIndex - 1),item)
                });
            };
            a.selection = all;
        })
        .catch (error => {
        })
        

    };
    //仅创建表头、表格组件
    if ( type == 'Only Create @th/td'){
        figma.clientStorage.getAsync('userLanguage')
        .then (async (language) => {
            let th = await addTableCompMust('th',language);
            let td = await addTableCompMust('td',language);
            figma.currentPage.selection = [th,td]
        });
    };
    //使所选元素符合表格组件
    if ( type == 'Make Compliant'){
        let a = figma.currentPage;
        let b = a.selection;
    };
    //便捷选中表格
    if ( type == 'pickTable'){
        let a = figma.currentPage;
        let b = a.selection;
        if(b.every(item => item.type == 'INSTANCE') && [...new Set(b.map(item => item.parent.parent))].length == 1){
            switch (info){
                case 'row':
                    if(b.length == 1){
                        easePickTable(info,[...b,...b]);
                    };
                ;break
                case 'allrow':
                    if(b.length >= 2){
                        easePickTable(info,b);
                    };
                ;break
                case 'block':
                    if(b.length == 2){
                        easePickTable(info,b);
                    };
                ;break
                case 'inline':
                    if(b.length == 2){
                        easePickTable(info,b);
                    };
                ;break
            }
        };
    };
    //批量填充文本数据
    if( type == 'mapText'){
        let a = figma.currentPage;
        let b = a.selection;
        /**/
        let tables = b.filter(item => item.name.includes('@table'));
        if(!tables || tables.length == 0){
            tables = b.map(node => node.findAll(item => item.name.includes('@table'))).flat();
        };
        //没有table就说明是普通的文本数据填充
        if(!tables  || tables.length == 0){
            let Array = info.data[0];
            let comps = b.filter(item => item.type == 'INSTANCE');
            //没有实例可能要自动填充
            if(!comps || comps.length == 0){
                if(b.length == 1 && Array.length > 1){
                    comps = b[0].findChildren(item => item.type == 'INSTANCE');
                    //仅自动布局时生效
                    if(b[0].layoutMode && b[0].layoutMode == 'AUTO'){
                        let HH = comps.length;
                        let H = Array.length - HH;
                        if(info.clone == false){
                            H = H > 0 ? 0 : H;
                        }
                        if(info.reduce == false){
                            H = H < 0 ? 0 : H;
                        };
                        reCompNum(b[0],H);
                        reAnyByArray(b[0].children,Array,false,info.enters,info.nulls);
                    } else {
                        sortLRTB(comps);
                        reAnyByArray(comps,Array,false,info.enters,info.nulls);
                    };
                };
            } else {
                if(Array.length > 1){
                    //console.log(111,comps.map(item => item.componentProperties))
                    //按从左到右从上到下排序
                    sortLRTB(comps);
                    if(Array.length < comps.length){
                        comps.splice(Array.length,comps.length - Array.length);
                    };
                    if(Array.length > comps.length){
                        Array.splice(comps.length,Array.length - comps.length);
                    };
                    reAnyByArray(comps,Array,false,info.enters,info.nulls);
                };
            };
        } else {
            tables.forEach(table => {
                let Array = info.data;
                //数据太少会导致删光表格
                if(Array.length > 0 && Array[0].length > 1){
                    if(table.name.includes('swap')){
                        Array = Array[0].map((_, i) => Array.map(row => row[i]));
                    };
                    let HH = table.children.length;
                    let VV = table.children[0].children.length;
                    let H = Array.length - HH;
                    let V = Array[0].length - VV;
                    if(info.clone == false){
                        H = H > 0 ? 0 : H;
                        V = V > 0 ? 0 : V;
                    }
                    if(info.reduce == false){
                        H = H < 0 ? 0 : H;
                        V = V < 0 ? 0 : V;
                    };
                    //console.log(H,V)
                    reCompNum(table,H,V);
                    reTableByArray(table,Array,info.enters,info.nulls);
                };
            });
        };
    };
    //批量设置命名
    if( type == 'mapName'){
        let a = figma.currentPage;
        let b = a.selection;
        let nodes = b;
        if(info.data[0] && info.data[0].length > 0){
            if(b.length == 1){
                nodes = b[0].children
            };
            nodes.forEach((node,index) => {
                node.name = info.data[0][index];
            });
        };
    };
    //批量设置组件属性
    if( type == 'mapPro'){
        let a = figma.currentPage;
        let b = a.selection;
        let nodes = b;
        if(info.data[0] && info.data[0].length > 0){
            if(b.length == 1){
                nodes = b[0].children;
            };
            nodes = nodes.filter(node => node.type == 'INSTANCE');
            //console.log(info.data)
            reAnyByObj(nodes,info.data);
        };
    };
    //批量设置标签属性
    if( type == 'mapTag'){
        let a = figma.currentPage;
        let b = a.selection;
        let nodes = b;
        if(info.data[0] && info.data[0].length > 0){
            if(b.length == 1){
                nodes = b[0].children;
            };
            nodes = nodes.filter(node => node.type == 'INSTANCE');
            reAnyByTags(nodes,info.data);
        };
    };
    //批量获取文本数据
    if( type == 'getText'){
        let a = figma.currentPage;
        let b = a.selection;
        //console.log(666);
        let tables = b.filter(item => item.name.includes('@table'));
        if(!tables || tables.length == 0){
            tables = b.map(node => node.findAll(item => item.name.includes('@table'))).flat();
        };
        //没有table就说明是普通的文本数据填充
        if(!tables  || tables.length == 0){
            
            let comps = b.filter(item => item.type == 'INSTANCE');
            if(b.length == 1){
                comps = b[0].children.filter(item => item.type == 'INSTANCE');
            };

            if(comps && comps.length > 0){
                sortLRTB(comps);
                let data = [getProArray(comps,false,info.enters,info.nulls)];
                data = data[0].map((_, i) => data.map(row => row[i]));
                //console.log(data);
                postmessage([data,'selectDatas'])
            };
        } else {
            let table = tables[0];
            let data = getTableText(table,info.enters,info.nulls);
            if(!table.name.includes('swap')){
                data = data[0].map((_, i) => data.map(row => row[i]));
            };
            //console.log(data);
            postmessage([data,'selectDatas'])
        };
    };
    //批量获取命名
    if( type == 'getName'){
        let a = figma.currentPage;
        let b = a.selection;
        let names = [];
        b.forEach((node) => {
            names.push(node.name);
        });
        //console.log(names);
    };
    //批量获取组件属性
    if( type == 'getPro'){
        let a = figma.currentPage;
        let b = a.selection;
        let comps = b.filter(node => node.type == 'INSTANCE');
        if(!comps  || comps.length == 0){
            if(b.length == 1){
                comps = b[0].findChildren(node => node.type == 'INSTANCE');
            };
        };
        if(comps  && comps.length > 0){
            let proKeys = comps.map(item => Object.keys(item.componentProperties).map(key => key.split('#')[0]).sort());
            let proNames = [...new Set(proKeys.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
            //console.log(proNames.length)
            //必须有相同的组件属性才能提取
            if(proNames.length == 1){
                let datas = getProObj(comps,info.enters,info.nulls);
                console.log(datas)
            };
        };
    };
    //批量获取标签属性
    if( type == 'getTag'){

    };
    //更新表格样式、行列
    if( type == 'reTable'){
        let a = figma.currentPage;
        let b = a.selection;

        let tables = b.filter(item => item.name.includes('@table'));
        if(!tables || tables.length == 0){
            tables = b.map(node => node.findAll(item => item.name.includes('@table'))).flat();
        };
        let setdata = info[0],retype = info[1]
        
        tables.forEach(table => {
            let HH = table.children.length;
            let VV = table.children[0].children.length;
            let H = setdata[0];
            let V = setdata[1];
            //行数不能少于2，列数不能少于1
            H = H + HH < 1 ? 1 - HH : H;
            V = V + VV < 2 ? 2 - VV : V;
            switch (retype){
                case 'style':
                    reTableStyle(table,setdata);
                ;break
                case 'add':
                    reCompNum(table,H,V);
                ;break
                case 'reduce':
                    reCompNum(table,H,V);
                ;break
            };
        });
    };
    //反转行列
    if( type == 'Row Column Swap'){
        let a = figma.currentPage;
            let b = a.selection;
    
            let tables = b.filter(item => item.name.includes('@table'));
            if(!tables || tables.length == 0){
                tables = b.map(node => node.findAll(item => item.name.includes('@table'))).flat();
            };
            
            tables.forEach(table => {
                //console.log(666)
                swapTable(table);
            });
    };
    //栅格化-副本
    if ( type == 'Pixel As Copy'){
        toPixel(info);
    };
    //栅格化-覆盖
    if ( type == 'Pixel Overwrite'){
        toPixel(info,true);
    };
    //批量等比缩放
    if ( type == 'rescaleMix'){
        let a = figma.currentPage;
        let b = a.selection;
        b.forEach(item => {
            switch (info[0]){
                case 'S' :
                    rescaleMix(item,info[1],info[2]);
                ;break
                case 'W':
                    let numW = info[1]/item.width;
                    rescaleMix(item,numW,info[2]);
                ;break
                case 'H':
                    let numH = info[1]/item.width;
                    rescaleMix(item,numH,info[2]);
                ;break
            };
        });
    };
    //斜切拉伸
    if( type == 'transformMix'){
        let a = figma.currentPage;
        let b = a.selection;
        //console.log(info)
        b.forEach(item => {
            let skewX = Math.tan(info.x*(Math.PI/180));
            let scaleX = item.relativeTransform[0][0];
            let x = item.relativeTransform[0][2];
            let skewY = Math.tan(info.y*(Math.PI/180));
            let scaleY = item.relativeTransform[1][1];
            let y = item.relativeTransform[1][2];
            //console.log(scaleX,scaleY)
            if(skewX !== item.relativeTransform[0][1] || skewY !== item.relativeTransform[1][0]){
                //console.log(666)
                item.relativeTransform = [[scaleX,skewX,x],[skewY,scaleY,y]];
            };
        });
    };
    //网格裁切
    if( type == 'addClipGrid'){
        let a = figma.currentPage;
        let b = a.selection;
        if(b.length == 1){
            //console.log(info)
            let final = b[0];
            let main = getSafeMain(b[0]);

            if(!b[0].layoutGrids || (b[0].layoutGrids && !b[0].name.split(' ').includes('@clip'))){
                //console.log(666)
                let gridset = addFrame([...main,b[0].name + ' @clip',[]])
                fullInFrameSafa(b[0],gridset);
                final = gridset;
                a.selection = [gridset];
            } else {
                if(!b[0].name.includes('@clip')){
                    b[0].name += ' @clip';
                };
            };

            let RC = getClipGrids(b[0],true);

            if(final.layoutGrids.length !== (info[0] + info[1])){
                let gridstyle = {
                    w:[
                        [['COLUMNS',main[0]/3,main[0]/3]],
                        [
                            ['COLUMNS',main[0]/9,main[0]/3],
                            ['COLUMNS',main[0]/9 + main[0]/3 + main[0]/9,main[0]/3]
                        ]
                    ],
                    h:[
                        [['ROWS',main[1]/3,main[1]/3]],
                        [
                            ['ROWS',main[1]/9,main[1]/3],
                            ['ROWS',main[1]/9 + main[1]/3 + main[1]/9,main[1]/3]
                        ]
                    ],
                };
                let row = info[0] == 0 ? null : gridstyle.w[info[0] - 1];
                if(RC[1].length == info[0]){
                    row = RC[1];
                };
                let column = info[1] == 0 ? null : gridstyle.h[info[1] - 1];
                if(RC[0].length == info[1]){
                    column = RC[0];
                };
                let grids = []
                if(row)grids.push(...row);
                if(column)grids.push(...column);
                if(grids.length == 0){
                    b[0].name = b[0].name.replace(' @clip','');
                } else {
                    grids.forEach(grid =>{ 
                        grid.forEach((item,index) => {
                            if(typeof(item) == 'number'){
                                //console.log(item.toFixed(2))
                                grid[index] = Math.round(item)
                            };
                        });
                    });
                }
                //console.log(grids)
                addClipGrids(grids,final);
            };
            
        };
    };
    if( type == 'Image@2x Clip'){
        let a = figma.currentPage;
        let b = a.selection;
        if(b.length == 1 && b[0].layoutGrids && b[0].layoutGrids.length > 0 && b[0].name.split(' ').includes('@clip')){
            let RC = getClipGrids(b[0]);
            let safaMain = getSafeMain(b[0]);
            let cuts = clipGridsToCut(RC,[safaMain[0],safaMain[1]]);
            toPixel(cuts,false,true);
        };
    };
    if( type == 'Component Clip'){
        let a = figma.currentPage;
        let b = a.selection;
        if(b.length == 1 && b[0].layoutGrids && b[0].layoutGrids.length > 0 && b[0].name.split(' ').includes('@clip')){
            let RC = getClipGrids(b[0]);
            let safaMain = getSafeMain(b[0]);
            let cuts = clipGridsToCut(RC,[safaMain[0],safaMain[1]]);
            let layerIndex = b[0].parent.children.findIndex(item => item.id == b[0].id)
            let clipsframe = addFrame([...safaMain,b[0].name,[]]);
            b[0].parent.insertChild((layerIndex + 1),clipsframe);
            
            clipsframe.x = safaMain[0] + safaMain[2] + 30;
            clipsframe.y = safaMain[1] + safaMain[3] + 30;
            let comp;
            if(b[0].type == 'COMPONENT'){
                comp = b[0].clone();;
            } else {
                comp = figma.createComponentFromNode(b[0].clone());
                b[0].parent.insertChild((layerIndex + 1),comp);
                comp.x = safaMain[0] + safaMain[2] + 30;
                comp.y = safaMain[3];
            };
            //必须全部为可缩放约束
            comp.children.forEach(item => {
                item.unlockAspectRatio();
                if(item.type == 'BOOLEAN_OPERATION'){
                    item.findAll(child => child.type !== 'BOOLEAN_OPERATION').forEach(child => {
                        child.constraints = {
                            horizontal: 'SCALE',
                            vertical: 'SCALE'
                        };
                    });
                } else {
                    item.constraints = {
                        horizontal: 'SCALE',
                        vertical: 'SCALE'
                    };
                };
                
                if(item.fills && item.fills.some(fill => fill.type == 'IMAGE')){
                    let newFills = JSON.parse(JSON.stringify(item.fills))
                    newFills.forEach(fill => {
                        if(fill.type == 'IMAGE'){
                            fill.scaleMode = 'CROP';
                        };
                    });
                    item.fills  = newFills;
                };
            });
            figma.clientStorage.getAsync('userLanguage')
            .then (async (language) => {
                let text = language == 'Zh' ? '已修改子元素约束，以实现自适应' : 'The constraint of the child has been changed'
                figma.notify(text,{
                    timeout: 3000,
                });
            });
            creAutoClip(cuts,clipsframe,null,comp);
            clipsframe.name = clipsframe.name.replace('@clip','@clip-final');
        };
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
    };
    //自动排列
    if ( type == 'Arrange By Ratio'){
        if(info){
            layoutByRatio(figma.currentPage.selection,true);
        }else{
            layoutByRatio(figma.currentPage.selection);
        }
    };
    //简单约束
    if ( type == 'Auto Constraints'){
        let a = figma.currentPage;
        let b = a.selection;
        let final = b.filter(item => item.type !== 'INSTANCE' && item.children)
        //console.log(final)
        if(final.length > 0){
            final.forEach(item => {
                let c = item.children
                let [w1,h1,x1,y1] = getSafeMain(item);
                let axisX,axisY;
                
                for ( let e = 0; e < c.length; e++){
                    let [w2,h2,x2,y2] = getSafeMain(c[e]);
                    let xc2 = x2 + w2/2,yc2 = y2 + h2/2;
                    //console.log([w1,h1,x1,y1],[w2,h2,x2,y2])
                    if ( h2 <= h1 * 6/8){
                        if ( yc2 < y1 + h1/2){
                            axisY = 'MIN';
                        } else if (yc2 > y1 + h1/2) {
                            axisY = 'MAX';
                        } else {
                            axisY = 'CENTER';
                        };
                    } else {
                        //console.log('超高')
                        if (y2 <= y1 && y2 + h2 >= y1 + h1){
                            //console.log('高超出')
                            axisY = 'STRETCH'
                        } else {
                            if ( yc2 <= y1 + h1 * 3/8){
                                axisY = 'MIN'
                            } else if (yc2 >= y1 + h1 * 5/8) {
                                axisY = 'MAX'
                            } else {
                                axisY = 'CENTER'
                            };
                        };
                    };
                    if ( w2 <= w1 * 4/8){
                        if ( xc2 < x1 + w1/2){
                            axisX = 'MIN';
                        } else if (xc2 > x1 + w1/2) {
                            axisX = 'MAX';
                        } else {
                            axisX = 'CENTER';
                        };
                    } else {
                        //console.log('超宽')
                        if (x2 <= x1 && x2 + w2 >= x1 + w1){
                            //console.log('宽超出')
                            axisX = 'STRETCH'
                        } else {
                            if ( xc2 <= x1 + w1 * 3/8){
                                axisX = 'MIN'
                            } else if (xc2 >= x1 + w1 * 5/8) {
                                axisX = 'MAX'
                            } else {
                                axisX = 'CENTER'
                            };
                        };
                    }
                    //console.log(axisX,axisY)
                    c[e].constraints = {
                        horizontal:axisX,
                        vertical:axisY,
                    };
                };
            });
        };
    };
    //反转顺序
    if( type == 'Reversing Index'){

    };
    //调换位置
    if( type == 'Exchange Position'){
        let a = figma.currentPage;
        let b = a.selection;
        let final = '';
    };
    //母组件复制
    if ( type == 'Clone Comp.'){
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
    //母组件解除
    if ( type == 'Release Comp.'){
        let a = figma.currentPage;
        let b = a.selection;
        let selects = [];
        b.forEach(item => {
            if(item.type == 'COMPONENT'){
                let layerIndex = item.parent.children.findIndex(items => items.id == item.id);
                let newComp = item.createInstance();
                let newNode = newComp.detachInstance();
                setMain([],newNode,item);
                item.parent.insertChild((layerIndex + 1),newNode);
                if(info){
                    item.remove();
                } else {
                    if(item.height >= item.width){
                        newNode.x += item.width + 30;
                    } else {
                        newNode.y -= item.height + 30;
                    };
                    newNode.name = item.name + ' copy';
                };
                
                selects.push(newNode);
                newComp.remove();
            };
        });
        a.selection = selects;
    };
    //拆分路径
    if ( type == 'Split Path'){
        let a = figma.currentPage;
        let b = a.selection;
        let vectors = b.filter(item => item.type == 'VECTOR');
        let selects = [];
        vectors.forEach(vector => {
            let paths = vector.vectorPaths;
            let styles = vector.vectorNetwork.vertices
            let layerIndex = vector.parent.children.findIndex(items => items.id == vector.id);
            let newVectors = [];
            for(let i = 0; i < paths.length; i++){
                let path = paths[i];
                if(path.data.split('M').length > 2 && !info){
                    let cutPaths = path.data.split('M').map(data => 'M ' + data.trim());
                    cutPaths = cutPaths.filter(item => item !== 'M ');
                    //console.log(cutPaths)
                    let cuts = [];
                    cutPaths.forEach((item,index) => {
                        let newVector = vector.clone();
                        let name = newVector.name + ' ' + (i + 1)  + '-' + (index + 1);
                        newVector.name = name;
                        let newpath = JSON.parse(JSON.stringify(path));
                        newpath.data = item;
                        //console.log(newpath)
                        newVector.vectorPaths = [newpath];
                        let keystyle = styles.find(items => items.x == item.split(' ')[1] * 1 && items.y ==  item.split(' ')[2] * 1);
                        let strokeCap = keystyle.strokeCap;
                        let strokeJoin = keystyle.strokeJoin;
                        newVector.strokeCap = strokeCap;
                        newVector.strokeJoin = strokeJoin;
                        cuts.push(newVector);
                    });
                    /**/
                    if(vector.strokes.length == 0 && paths.length > 1){
                        let subtract = figma.subtract(cuts,vector.parent);
                        newVectors.push(subtract);
                    } else {
                        let newVectorCut = figma.group(cuts,vector.parent);
                        newVectorCut.name = vector.name + ' ' + (i + 1);
                        newVectors.push(newVectorCut);
                    };
                    /**/
                    /**
                    let newVectorCut = figma.group(cuts,vector.parent);
                    newVectorCut.name = vector.name + ' ' + (i + 1);
                    newVectors.push(newVectorCut);
                    /**/
                } else {
                    let newVector = vector.clone();
                    newVector.name += ' ' + (i + 1 );
                    newVector.vectorPaths = [path];
                    let keystyle = styles.find(item => item.x == path.data.split(' ')[1] * 1 && item.y ==  path.data.split(' ')[2] * 1);
                    let strokeCap = keystyle.strokeCap;
                    let strokeJoin = keystyle.strokeJoin;
                    newVector.strokeCap = strokeCap;
                    newVector.strokeJoin = strokeJoin;
                    newVectors.push(newVector);
                };
            };
            let group;
            if(vector.strokes.length == 0){
                group = figma.union(newVectors,vector.parent,(layerIndex + 1));
                group.fills = vector.fills;
                group.x = vector.x;
                group.y = vector.y;
            } else {
                group = figma.group(newVectors,vector.parent,(layerIndex + 1));
            }
            group.name = vector.name;
            if(group.children.length == 1 && group.children[0].type == 'GROUP'){
                figma.ungroup(group.children[0]);
            };

            selects.push(group);
            vector.visible = false;
        });
        a.selection = selects;
    };
    //获取为svg代码
    if ( type == 'getSvg'){
        let a = figma.currentPage;
        let b = a.selection;
        let vectors = b.filter(item => item.typa == 'VECTOR');
        let info = {floors: 1};
        vectors.forEach(vector => {
            let paths = vector.vectorPaths;
            paths.map(item => item.data);
            if(info.floors){
                let num = info.floors;
                paths.map(item => 
                    item.split(' ').map(data => {
                        if(data.includes('.')){
                            return data.split('.')[0] + '.' + data.split('.')[1].substring(0,num)
                        }
                    }
                ).join(' '))
            };
            console.log(paths)
        });
    };
    
};


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

setTimeout(()=>{
    console.clear()
    console.log(`- [YNYU_SET] OPEN DESIGN & SOURCE
- © 2024-2025 YNYU lvynyu2@gmail.com;`)
},500)

sendInfo()
function sendInfo(){
    let a = figma.currentPage;
    let b = a.selection;
    if(b && b.length > 0){
        let data = [];
        b.forEach(node => {
            let n = TextMaxLength(node.name,20,'...');
            let w = node.absoluteRenderBounds ? node.absoluteRenderBounds.width : node.absoluteBoundingBox.width;
            let h = node.absoluteRenderBounds ? node.absoluteRenderBounds.height : node.absoluteBoundingBox.height;
            let transform = node.absoluteTransform;
            //let scaleX = 100// Math.floor(transform[0][0] * 100);
            //let scaleY = 100//Math.floor(transform[1][1] * 100);
            let skewX = Math.floor(Math.atan(transform[0][1])/(Math.PI/180));
            let skewY = Math.floor(Math.atan(transform[1][0])/(Math.PI/180));
            //console.log([skewX,skewY])
            let column = 0;
            let row = 0;
            if(node.layoutGrids){
                column = node.layoutGrids.filter(item => item.pattern == 'COLUMNS').length
                row = node.layoutGrids.filter(item => item.pattern == 'ROWS').length
            };
            column = column <= 2 ? column : 0;
            row = row <= 2 ? row : 0;
            let exportSize = node.getPluginData('exportSize');
            if(!exportSize){
                exportSize = null
            };
            //console.log(exportSize)
            data.push([n,w,h,[skewX,skewY],[column,row]]);
        });
        postmessage([data,'selectInfo']);
    } else {
        postmessage([[[null,null,null,[0,0],[0,0]]],'selectInfo']);
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
 * @param {Array} info - [w,h,x,y,name,[fills],[align,trbl,strokes]] 宽高、坐标、命名、填充、描边
 * @param {node} node - 需要设置的对象
 * @param {node?} cloneNode - 直接参考的对象
 */
function setMain(info,node,cloneNode,isBound){
    let viewX = Math.floor( figma.viewport.center.x - ((figma.viewport.bounds.width/2  - 300)* figma.viewport.zoom));
    let viewY = Math.floor( figma.viewport.center.y - ((figma.viewport.bounds.height/2  - 300)* figma.viewport.zoom));
    let w = info[0],h = info[1],x = info[2],y = info[3],n = info[4],fills = info[5];
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
    /*
    if(isBound){
        node.absoluteBoundingBox.x = x;
        node.absoluteBoundingBox.y = y;
    } else {
        node.x = x;
        node.y = y;
    }
    */
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
    info.forEach((item,index) => {
        //console.log(info)
        let w = item.w;
        let h = item.h;
        let x = item.x;
        let y = item.y;
        let s = item.s;
        let cut = figma.createSlice();
        cut.x = x;
        cut.y = y;
        cut.resize(w,h);
        cut.name = 'cut ' + (index + 1) + '@' + s + 'x';//命名记录栅格化倍率
        group.appendChild(cut);
    });
};
//切片转图片
/**
 * @param {group} group - 由addCutArea生成的包含切片和源对象的组
 */
function addCutImg(group,isOverWrite,isfinal,isClip,clips){
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
        
        if(isClip){
            //console.log(clips)
            /**/
            let clipimg = addFrame([w,h,x,y,group.name.replace('@clip','@clip-final'),[]]);
            creAutoClip(clips,clipimg,image);
            group.appendChild(clipimg);
            clipimg.x = 0;
            clipimg.y = h + 30;
            /**/
        }else{
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
        }
        item.remove();
        if(group.children.length == 2){
            pixelSelects.push(group.children[1])
            figma.ungroup(group);
        } else {
            pixelSelects.push(group)
        };
        if(isOverWrite){
            if(old && index == cuts.length - 1){
                old.remove();
            };
        };
        
        if(isfinal){
            figma.currentPage.selection = pixelSelects;
            pixelSelects = [];
        };
    });
};
let pixelSelects = []
//通过切片实现原地栅格化
/**
 * @param {[{w:num,h:num,x:num,y:num,s:num}]} info - 切片大小位置信息栅格化倍率集
 * @param {boolean} isOverWrite - 是否覆盖
 */
function toPixel(info,isOverWrite,isClip){
    //console.log(info)
    pixelSelects = [];
    let a = figma.currentPage;
    let b = a.selection;
    for(let i = 0; i < b.length; i++){
        let safeMain = getSafeMain(b[i]);
        let box = addFrame([...safeMain,b[i].name,[]]);
        fullInFrameSafa(b[i],box);
        setTimeout(()=>{
            if(isClip){
                addCutArea(box,[{x: 0, y: 0, w: safeMain[0], h: safeMain[1], s: 2}]);
            }else{
                addCutArea(box,info[i]);
            }
            let isfinal = i == b.length - 1 ? true : false;
            addCutImg(box,isOverWrite,isfinal,isClip,info);
        },100);
    };
};
//添加画板
/**
 * @param {Array} info - [w,h,x,y,name,[fills],[align,trbl,strokes]] 宽高、坐标、命名、填充、描边
 * @returns {node}
 */
function addFrame(info,cloneNode){
    let node = figma.createFrame();
    node.clipsContent = false;
    setMain(info,node,cloneNode,true);
    return node;
};
//获取有效的whxy
/**
 * @returns {Array} - [w,h,x,y]
 */
function getSafeMain(node){
    let w = node.absoluteRenderBounds ? node.absoluteRenderBounds.width : node.absoluteBoundingBox.width;
    let h = node.absoluteRenderBounds ? node.absoluteRenderBounds.height : node.absoluteBoundingBox.height;
    let x = node.absoluteRenderBounds ? node.absoluteRenderBounds.x : node.absoluteBoundingBox.x;
    let y = node.absoluteRenderBounds ? node.absoluteRenderBounds.y : node.absoluteBoundingBox.y;
    if(node.parent !== figma.currentPage){
        let transform = node.parent.absoluteTransform;
        let key1 = transform[0][0] == 1 ? true : false;
        let key2 = transform[0][1] == 0 ? true : false;
        let key3 = transform[1][0] == 0 ? true : false;
        let key4 = transform[1][1] == 1 ? true : false;
        if([key1,key2,key3,key4].includes(false)){
            x -= node.x;
            y += node.y;
        };
    };
    return [w,h,x,y]
};
//将目标安全地放进一个画板里
function fullInFrameSafa(keynode,frame){
    let layerIndex = keynode.parent.children.findIndex(item => item.id == keynode.id);
    keynode.parent.insertChild((layerIndex + 1),frame);
    if(frame.parent !== figma.currentPage){
        frame.x -= frame.parent.absoluteBoundingBox.x;
        frame.y -= frame.parent.absoluteBoundingBox.y;
    };
    frame.appendChild(keynode);
    
    if(frame.parent !== figma.currentPage){
        keynode.x -= keynode.parent.x;
        keynode.y -= keynode.parent.y;
    }else{
        keynode.x -= keynode.parent.absoluteBoundingBox.x;
        keynode.y -= keynode.parent.absoluteBoundingBox.y;
    };
};

//将文字限定在合理范围，并指定省略符
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
    let maxW = Math.max(...HH.map(item => item.w));
    let LL = infos.filter(item => item.w < item.h).sort((a, b) => b.w*b.h - a.w*a.h);//竖版
    let maxH = Math.max(...LL.map(item => item.h));
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
        ['#top.stroke',[],[null,[1,0,0,0]],'--bod-t'],
        ['#right.stroke',[],[null,[0,1,0,0]],'--bod-r'],
        ['#bottom.stroke',[],[null,[0,0,1,0]],'--bod-b'],
        ['#left.stroke',[],[null,[0,0,0,1]],'--bod-l'],
        ['#bg.fill',fills[type],null,'--fills'],
    ];

    for(let i = 0; i < adds.length; i++){
        //添加描边、填充并绑定组件属性
        addBodFill(comp,adds[i]);
    };
    //绑定数据的组件属性
    addCompPro(comp,text,'--data','TEXT',egtext[type][1]);
    
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
    addCompPro(node,bodfills,Array[3],'BOOLEAN',true);
};
//绑定图层和组件属性
/**
 * @param {*} type - 'BOOLEAN''TEXT''letIANT'
 */
function addCompPro(node,layer,name,type,value){
    let typekey = {
        BOOLEAN: 'visible',
        TEXT: 'characters',
        letIANT: 'mainComponent'
    }
    let proid = node.addComponentProperty(name,type,value);
    layer.componentPropertyReferences = {[typekey[type]]:proid};
};
//修改表格样式
function reTableStyle(table,style){
    let columns = table.findChildren(item => item.name.includes('@column'));
    for(let i = 0; i < columns.length; i++){
        let headers = columns[i].findChildren(item => item.name.includes('@th'));
        let datas  = columns[i].findChildren(item => item.name.includes('@td'));
        //console.log(headers,datas)
        headers.forEach((item,index) => {
            //console.log(style.th)
            if(style.th){
                findSetPro(item,style.th,(index + 1),(i + 1));
            };
        });
        datas.forEach((item,index)=> {
            if(style.td){
                findSetPro(item,style.td,(index + 1),(i + 1));
            };
        });
    };
    //找到相关组件属性并修改
    function findSetPro(comp,Array,row,column){
        let proKeys = Object.keys(comp.componentProperties);
        //console.log(Array[4],num)
        proKeys.forEach(key => {
            //console.log(key.split('#')[0])
            /**/
            switch (key.split('#')[0]){
                case '--bod-t': comp.setProperties({[key]: Array[0] == 0 ? false : true});break
                case '--bod-r': comp.setProperties({[key]: Array[1] == 0 ? false : true});break
                case '--bod-b': comp.setProperties({[key]: Array[2] == 0 ? false : true});break
                case '--bod-l': comp.setProperties({[key]: Array[3] == 0 ? false : true});break
                case '--fills':
                    //是否为间格区分色
                    if(Array[4] == 'rowSpace' && row){
                        if(row%2 == 0){
                            comp.setProperties({[key]: true});
                        } else {
                            comp.setProperties({[key]: false});
                        };
                    } else if(Array[4] == 'columnSpace' && column){
                        if(column%2 == 0){
                            comp.setProperties({[key]: false});
                        } else {
                            comp.setProperties({[key]: true});
                        };
                    } else {
                        comp.setProperties({[key]: Array[4] == 0 ? false : true});
                    }
                ;break
            }
            /**/
        });
    };
};
//重置相对坐标并把约束设为撑满
function asFillChild(node){
    node.x = 0;
    node.y = 0;
    node.constraints = {
        horizontal: "STRETCH",
        vertical: "STRETCH"
    };
};

//调整实例数量以匹配数据长度
function reCompNum(nodes,H,V){
    //console.log(nodes.name,H,V)
    //console.log(111)
    if(H > 0){
        //console.log(222)
        let end = nodes.children[nodes.children.length - 1]
        for(let i = 0; i < H; i++){
            nodes.appendChild(end.clone());
        };
    }
    if (H < 0) {
        //console.log(333)
        for(let i = H; i < 0; i++){
            nodes.children[nodes.children.length - 1].remove();
        };
    };
    if(nodes.name.includes('@table') && V && V !== 0){
        //console.log(444)
        let columns = nodes.findChildren(item => item.name.includes('@column'));
        //console.log(columns.length)
        for(let i = 0; i < columns.length; i++){
            if(V > 0){
                let end = columns[i].children[columns[i].children.length - 1]
                for(let ii = 0; ii < V; ii++){
                    columns[i].appendChild(end.clone());
                };
            } else {
                for(let ii = V; ii < 0; ii++){
                    columns[i].children[columns[i].children.length - 1].remove();
                };
            };
        };
    };
};
//填充表格数据
function reTableByArray(table,Array,enters,nulls){
    let columns = table.findChildren(item => item.name.includes('@column'));
    for(let i = 0; i < columns.length; i++){
        let datas  = columns[i].findChildren(item => item.name.includes('@th') || item.name.includes('@td'));
        if(Array[i]){
            reAnyByArray(datas,Array[i],true,enters,nulls);
        };
    };
};
//按数组修改组件属性
function reAnyByArray(comps,Array,istable,enters,nulls){
    for(let i = 0; i < comps.length; i++){
        //console.log(222)
        let comp = comps[i];
        let textPros = Object.keys(comp.componentProperties).filter(pro => comp.componentProperties[pro].type == 'TEXT');
        let dataPros = textPros.filter(key => key.split('#')[0] == '--data');
        //console.log(dataPros)
        //表格优先，其次任意文本类型组件属性
        if(istable && dataPros && dataPros.length > 0){
            textPros = dataPros;
        };
        textPros.forEach((item,index)=> {
            if(Array[i] !== undefined){
                if(Array[i] == ''){
                    comp.setProperties({[item]: nulls});
                } else {
                    comp.setProperties({[item]: Array[i].toString().replace(new RegExp(enters,'g'),'\n')});
                };
            } else if (i == comps.length - 1 && comps.length == Array.length){
                comp.setProperties({[item]: nulls});
            };
        });
    };
};
//按对象修改组件属性
function reAnyByObj(comps,obj,enters,nulls){
    let keyPros = Object.keys(obj[0]);
    for(let i = 0; i < comps.length; i++){
        let comp = comps[i];
        let rePros = Object.keys(comp.componentProperties).filter(pro => keyPros.includes(pro.split('#')[0]));
        //console.log(rePros,comp)
        rePros.forEach(item => {
            //console.log(item,obj[i][item.split('#')[0]])
            if(obj[i]){
                let value = obj[i][item.split('#')[0]];
                if(comp.componentProperties[item].type !== 'BOOLEAN'){
                    value = value.toString();
                    if(value == ''){
                        value = nulls;
                    } else {
                        value = value.replace(new RegExp(enters,'g'),'\n')
                    }
                }else{
                    value = TRUES.includes(value) ? true : FALSES.includes(value) ? false : true; 
                }
                comp.setProperties({[item]: value});
            };
        });
    };
};
//按标签修改对象属性
function reAnyByTags(nodes,obj){
    for(let i = 0; i < nodes.length; i++){
        let node = nodes[i]
        let hasTags = node.findAll(item => TAGS_KEY.some(key => item.name.includes(key)));
        
        if(TAGS_KEY.some(key => node.name.includes(key))){
            hasTags = [node,...hasTags]
        };
        
        hasTags.forEach(layer => {
            let tags = layer.name.split(' ').filter(item => TAGS_KEY.some(key => item.includes(key)));
            
            tags.forEach(tag => {
                console.log(tag,obj[i][tag])
                if(obj[i][tag]){
                    setByTags(layer,tag.split('.')[1],obj[i][tag])
                };
            });
        });
    };
    
    function setByTags(layer,tagkey,value){
        switch (tagkey){
            case 'fill':
                layer.fills = [toRGB(value,true)];
            ;break
            case 'stroke':
                layer.strokes = [toRGB(value,true)];
            ;break
            case 'fillStyle':
                figma.getLocalPaintStylesAsync()
                .then(list => {
                    let id = list.find(item => item.name == value).id
                    if(id){
                        layer.setFillStyleIdAsync(id);
                    };
                });
            ;break
            case 'strokeStyle':
                figma.getLocalPaintStylesAsync()
                .then(list => {
                    let id = list.find(item => item.name == value).id
                    if(id){
                        layer.setStrokeStyleIdAsync(id);
                    };
                });
            ;break
            case 'visible':
                value = TRUES.includes(value) ? true : FALSES.includes(value) ? false : true; 
                layer.visible = value;
            ;break
            case 'opacity':
                value = value.replace(/[^0-9]/g,'').trim();
                value = value ? value * 1 : 1;
                value = value > 1 ? value/100 : value;
                layer.opacity = value;
            ;break
            case 'fontSize':
                value = value.replace(/[^0-9]/g,'').trim();
                value = value ? value * 1 : 12;
                if(layer.type == 'TEXT'){
                    layer.fontSize = value;
                };
            ;break
            case 'xywh':
                let main = value.replace('[','').replace(']','').split(',');
                main[0] = main[0] == 'null' ? layer.x : main[0];
                main[1] = main[1] == 'null' ? layer.y : main[1];
                main[2] = main[2] == 'null' ? layer.width : main[2];
                main[3] = main[3] == 'null' ? layer.height : main[3];
                setMain(main,layer);
            ;break
        }
    };
    
};
//获取表格数据
function getTableText(table,enters,nulls){
    let Array = [];
    let columns = table.findChildren(item => item.name.includes('@column'));
    for(let i = 0; i < columns.length; i++){
        let datas  = columns[i].findChildren(item => item.name.includes('@th') || item.name.includes('@td'));
        Array.push(getProArray(datas,true,enters,nulls));
    };
    return Array;
};
//获取文本类组件属性值
function getProArray(comps,istable,enters,nulls){
    let Array = [];
    for(let i = 0; i < comps.length; i++){
        let comp = comps[i];
        let textPros = Object.keys(comp.componentProperties).filter(pro => comp.componentProperties[pro].type == 'TEXT');
        let dataPros = textPros.filter(key => key.split('#')[0] == '--data');
        if(istable && dataPros && dataPros.length > 0){
            textPros = dataPros
        };
        let value = comp.componentProperties[textPros[0]].value;
        if(value == nulls){
            Array.push('');
        } else {
            Array.push(value.replace(/[\r\n]/g,enters));
        };
    };
    return Array;
};
//获取所有组件属性值
function getProObj(comps,enters,nulls){
    let proKeys = comps.map(item => Object.keys(item.componentProperties).map(key => key.split('#')[0]).sort());
    let datas = [];
    for(let i = 0; i < comps.length; i++){
        let comp = comps[i];
        let pros = {};
        Object.entries(comp.componentProperties).forEach(item => {
            pros[item[0].split('#')[0]]
        });
    };
};
//获取所有标签属性值
function getTagObj(comps,enters,nulls){
    
};
//反转表格行列
function swapTable(table){
    let layerIndex = table.parent.children.findIndex(item => item.id == table.id);
    let columns = table.findChildren(item => item.name.includes('@column'));
    let datas = []
    for(let i = 0; i < columns.length; i++){
        datas.push(columns[i].findChildren(item => item.name.includes('@th') || item.name.includes('@td')));    
    };
    let H = datas[0].length - columns.length;
    console.log(H)
    let newTable = table.clone();
    setMain([],newTable,table);
    if(newTable.name.includes('-swap')){
        newTable.name = newTable.name.replace('-swap','');
    } else {
        newTable.name += '-swap';
    };
    table.parent.insertChild((layerIndex + 1),newTable);
    
    for(let i = 0; i < columns.length; i++){
        let numColum = newTable.children[i];
        numColum.children.map(node => node.remove())
    };
    
    reCompNum(newTable,H);
    let newColumns = newTable.children;
    for(let i = 0; i < newColumns.length; i++){
        //console.log(datas[0][i].name)
        /**/
        datas.forEach(oldDatas =>{
            newColumns[i].appendChild(oldDatas[i]);
        });
        /**/
    };   
    table.remove();
    figma.currentPage.selection = [newTable]
};
//选中表格行/区域
function easePickTable(type,nodes){
    let a = figma.currentPage;
    let b = nodes;
    let table = b[0].parent.parent;
    let Hs = [];
    for ( let i = 0; i < b.length ; i++ ){
        Hs.push(b[i].parent.children.findIndex(item => item == b[i]));
    };
    let Ls = [];
    for ( let i = 0; i < b.length ; i++ ){
        Ls.push(table.children.findIndex(item => item == b[i].parent));
    };
    //记录对象所在行列和总行列
    let H1 = Hs[0];
    let L1 = Ls[0];
    let H2 = Hs[1];
    let L2 = Ls[1];
    let LL = table.children.length;
    //console.log(H1,L1,H2,L2,LL)

    let picks = [];
    let starH = Math.min(H1,H2);
    let endH = Math.max(H1,H2);
    let starL = Math.min(L1,L2);
    let endL = Math.max(L1,L2);

    switch (type){
        case 'row':
            for ( let i = 0; i < LL ; i++ ){
                picks.push(table.children[i].children[H1]);
            };
            a.selection = picks;
        ;break
        case 'allrow':
            console.log(Hs,LL)
            for ( let i = 0; i < LL ; i++ ){
                for ( let ii = 0; ii < Hs.length; ii++){
                    picks.push(table.children[i].children[Hs[ii]]);
                };
            };
            console.log(picks)
            a.selection = picks;
        ;break
        case 'block':
            for ( let i = starL; i <= endL ; i++ ){
                for ( let ii = starH; ii <= endH; ii++){
                    picks.push(table.children[i].children[ii]);
                };
            };
            a.selection = picks
        ;break
        case 'inline':
            if ( starH == H2 ){
                starL = L2;
                endL = L1;
            } else {
                starL = L1;
                endL = L2;
            };
            for ( let i = starL; i < LL; i++){
                picks.push(table.children[i].children[starH]);
            };
            for ( let i = 0; i < LL; i++){
                for ( let ii = starH + 1; ii < endH; ii++){
                    picks.push(table.children[i].children[ii]);
                };
            };
            for ( let i = 0; i <= endL; i++){
                picks.push(table.children[i].children[endH]);
            };
            a.selection = picks
        ;break
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
//添加到画板并设置约束
function addConstraints(parent,absoluteNode,position,isFill){
    parent.appendChild(absoluteNode);
    let H = 'MIN';
    let V = 'MIN';
    switch (position[0]){
        case 'T':
            V = 'MIN';
        ;break
        case 'C':
            V = isFill ? 'STRETCH' : 'CENTER';
        ;break
        case 'B':
            V = 'MAX';
        ;break
    };
    switch (position[1]){
        case 'L':
            H = 'MIN';
        ;break
        case 'C':
            H = isFill ? 'STRETCH' : 'CENTER';
        ;break
        case 'R':
            H = 'MAX';
        ;break
    };
    absoluteNode.constraints = {
        horizontal: H,
        vertical: V,
    };
};
//自动按位置、大小设置约束
function autoConstraints(parent,child){

}
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
    };
};
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
            let group = addFrame([],oldnode);
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
                let group2 = addFrame([],splitnodes[i]);
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
//将节点数组重新排序，按坐标从左到右从上到下Z字型
function sortLRTB(nodes){
    nodes.sort((a,b) => {
        let x1 = a.absoluteBoundingBox.x;
        let x2 = b.absoluteBoundingBox.x;
        let y1 = a.absoluteBoundingBox.y;
        let y2 = b.absoluteBoundingBox.y;
        //节点上下边延长线有重叠的视为同一行
        if(y1 - (y2 + b.height) >= 0){
            return y1 - y2;
        } else {
            return x1 - x2;
        };
    });
};
//添加网格参考线用于设置裁切拉伸范围
/**
 * @param {Array} info -[type,xy,wh]
 */
function addClipGrids(info,node){
    let grids = [];
    info.forEach(item => {
      let grid = {
        alignment: "MIN",//左上角为起点，依次计算好拉伸区域，标上色值
        color: {r: 1, g: 0, b: 0, a :0.1},
        pattern: item[0],
        count: 1,
        gutterSize: 1,
        offset: item[1],//拉伸区域起点
        sectionSize: item[2],//拉伸区域大小
      };
      grids.push(grid);
    });
    node.layoutGrids = grids;
};
//获取网格参考线数据并简化
function getClipGrids(node,isNoSort){
    let grids = node.layoutGrids.map(item => [item.pattern,item.offset,item.sectionSize])
    let R = grids.filter(item => item[0] == 'ROWS');
    let C = grids.filter(item => item[0] == 'COLUMNS');
    if(isNoSort){
        return [R,C]
    };
    R = R.map(item => [item[1],item[2]]).sort((a,b) => a[0] - b[0]);
    C = C.map(item => [item[1],item[2]]).sort((a,b) => a[0] - b[0]);
    return [R,C]
};
//网格参考线转xywh分割数据
function clipGridsToCut(RC,WH){
    let [rows, columns] = RC;
    let [canvasWidth, canvasHeight] = WH;
    
    // 计算行分割点和行区域
    let rowSegments = [0];
    rows.forEach(([y, height]) => {
      rowSegments.push(y);
      rowSegments.push(y + height);
    });
    rowSegments.push(canvasHeight); // 添加底部边界
  
    // 计算列分割点和列区域
    let colSegments = [0];
    columns.forEach(([x, width]) => {
      colSegments.push(x);
      colSegments.push(x + width);
    });
    colSegments.push(canvasWidth); // 添加右侧边界
  
    // 生成所有区域
    let regions = [];
    for (let i = 0; i < rowSegments.length - 1; i++) {
        let yStart = rowSegments[i];
        let h = rowSegments[i + 1] - yStart;
      for (let ii = 0; ii < colSegments.length - 1; ii++) {
        let xStart = colSegments[ii];
        let w = colSegments[ii + 1] - xStart;
        regions.push({ w, h, x: xStart, y: yStart, s: 2});
      };
    };
  
    return regions;
};
//从网格数据创建拉伸区域
function creAutoClip(clips,clipsbox,image,comp){
    let clipsnode = [];
    let w = clipsbox.width;
    let h = clipsbox.height;
    let name = clipsbox.name;
    //console.log(w,h,name,clips,comp)
    clips.forEach((clip,num) => {
        let namekey = '';
        let isFill = true;
        let Layout = false;
        let LayoutRC = [0,0]
        //标识后缀，方便其他操作
        switch (clips.length){
            case 3 :
                if(clip.w < w - 1){//保险起见减个1
                    namekey = CLIP_NAME[1][num];
                } else {
                    namekey = CLIP_NAME[0][num];
                };
            ;break
            case 5 :
                if(clip.w < w - 1){//保险起见减个1
                    namekey = CLIP_NAME[3][num];
                    Layout = 'H';
                } else {
                    namekey = CLIP_NAME[2][num];
                    Layout = 'V';
                };
                isFill = false;
            ;break
            case 9 :
                namekey = CLIP_NAME[4][num];
            ;break
            case 15 :
                if(clips[0].y == clips[4].y){
                    namekey = CLIP_NAME[6][num];
                    LayoutRC = [5,3]
                } else {
                    namekey = CLIP_NAME[5][num];
                    LayoutRC = [3,5]
                };
                Layout = 'HV';
                isFill = false;
            ;break
            case 25 :
                namekey = CLIP_NAME[7][num];
                isFill = false;
                Layout = 'HV';
                LayoutRC = [5,5]
            ;break
        }
        let clipnode = null;
        //如果作为图片
        if(image){
            clipnode = figma.createRectangle();
            clipnode.resize(clip.w,clip.h);
            clipnode.fills = [
                {
                    type: 'IMAGE',
                    imageHash: image.hash,
                    scaleMode: 'CROP',
                    imageTransform: [
                        [clip.w/w,0,clip.x/w],
                        [0,clip.h/h,clip.y/h]
                    ],
                }
            ];
        };
        if(comp){
            clipnode = figma.createFrame();
            clipnode.resize(clip.w,clip.h);
            clipnode.fills = [];
            let instance = comp.createInstance();
            instance.layoutGrids = [];
            clipnode.appendChild(instance)
            instance.x = clip.x * -1;
            instance.y = clip.y * -1;
            instance.constraints = {
                horizontal: 'SCALE',
                vertical: 'SCALE'
            }
            clipnode.clipsContent = true;
        };

        if(clipnode){
            clipnode.name = name + ' ' + namekey;
            addConstraints(clipsbox,clipnode,namekey.replace('@',''),isFill);
            clipnode.x = clip.x;
            clipnode.y = clip.y;
            if(num == clips.length - 1 && Layout){
                switch (Layout){
                    case 'H':
                        addAutoLayout(clipsbox,['H','CC']);
                        clipsbox.children[1].layoutSizingHorizontal = 'FILL';
                        clipsbox.children[3].layoutSizingHorizontal = 'FILL';
                    ;break
                    case 'V':
                        addAutoLayout(clipsbox,['V','CC']);
                        clipsbox.children[1].layoutSizingVertical = 'FILL';
                        clipsbox.children[3].layoutSizingVertical = 'FILL';
                    ;break
                    case 'HV':
                        let clipnodes = clipsbox.children;
                        let clipRows = [];
                        for(let i = 0; i < clipnodes.length; i += LayoutRC[0]){
                            if(LayoutRC[0] == 5){
                                clipRows.push([clipnodes[i],clipnodes[i + 1],clipnodes[i + 2],clipnodes[i + 3],clipnodes[i + 4]])
                            }else{
                                clipRows.push([clipnodes[i],clipnodes[i + 1],clipnodes[i + 2]])
                            };
                        };
                        //console.log(clipRows)
                        clipRows.forEach((row,RNum) => {
                            let rownode = addFrame([clipsbox.width,row[0].height,null,null,clipsbox.name + ' @row',[]]);
                            clipsbox.appendChild(rownode);
                            rownode.x = row[0].x;
                            rownode.y = row[0].y;
                            addAutoLayout(rownode,['H','CC']);
                            row.forEach((items,CNum)=> {
                                rownode.appendChild(items);
                                if(RNum%2 == 1){
                                    items.layoutSizingVertical = 'FILL';
                                    if(CNum%2 == 1){
                                        items.layoutSizingHorizontal = 'FILL';
                                    };
                                }else{
                                    if(CNum%2 == 1){
                                        items.layoutSizingHorizontal = 'FILL';
                                    };
                                };
                            });
                        });
                        addAutoLayout(clipsbox,['V','CC'],true);
                        clipsbox.layoutSizingHorizontal = 'FIXED';
                        clipsbox.layoutSizingVertical = 'FIXED';
                        clipsbox.children.forEach((row,RNum) => {
                            row.layoutSizingHorizontal = 'FILL';
                            if(RNum%2 == 1){
                                row.layoutSizingVertical = 'FILL';
                            };
                        });
                        clipsbox.resize(w,h);
                    ;break
                }
            };
            clipsnode.push(clipnode);
        };
    });
};

//模拟缩放中心
function rescaleMix(node,num,center){
    node.rescale(num);
    switch (center[0]){
        case 'T':

        ;break
        case 'C':
            node.y -= node.height/2;
        ;break
        case 'B':
            node.y -= node.height;
        ;break
    };
    switch (center[1]){
        case 'L':

        ;break
        case 'C':
            node.x -= node.width/2;
        ;break
        case 'R':
            node.x -= node.width;
        ;break
    };
};