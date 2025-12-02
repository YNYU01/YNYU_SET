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
let UI_MINI = [208,460];
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


//let isSendComp = true;
let TRUES = ['true',true,'1',1,'show','是','有'];
let FALSES = ['false',false,'0',0,'hide','否','无'];
let TAGS_KEY = ['.fill','.stroke','.fillStyle','.strokeStyle','.visible','.opacity','.fontSize','.xywh'];
let FRAME_TYPE = ['FRAME','COMPONENT']
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
let localStyles = {paint:null,text:null,effect:null,grid:null};
let localVariable;
function getTablesByNodes(nodes = [], deep = true){
    let tables = [];
    if(!Array.isArray(nodes)){
        return tables;
    };
    tables = nodes.filter(node => node && node.name.includes('@table'));
    if(deep){
        const nested = nodes
        .filter(node => node && typeof node.findAll === 'function')
        .map(node => node.findAll(item => item.name.includes('@table')))
        .flat();
        tables = tables.concat(nested);
    };
    const ids = new Set();
    return tables.filter(table => {
        if(!table || !table.id){
            return false;
        };
        if(ids.has(table.id)){
            return false;
        };
        ids.add(table.id);
        return true;
    });
};
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
        if(info[1] === null || info[1] === undefined){
            // 如果值为 null，则删除该键
            figma.clientStorage.deleteAsync(info[0]);
        } else {
            figma.clientStorage.setAsync(info[0],info[1]);
        }
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
            let b = figma.currentPage.selection[0];
            console.log(b);
            if(b.type == 'TEXT'){
                //console.log(b.getRangeListOptions(0,b.characters.length));
            };
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
                addImg(null,{w:info[i].w,h:info[i].h,x:viewX,y:viewY,n:info[i].n,img:info[i].cuts[0].img});
            }
            viewX += info[i].w + gap;
        };
    };
    //批量创建画板
    if ( type == "createFrame"){
        //console.log(info)
        let selects = []
        for ( let i = 0; i < info.length; i++){
            let fills = [toRGB('#ffffff',true)];
            if(info[i].type){
                if(info[i].type.toLowerCase() == 'png'){
                    fills = [];
                };
            };
            let node = addFrame([info[i].w,info[i].h,null,null,info[i].name,fills]);
            if(info[i].type  && info[i].type !== ''){
                node.setPluginData('exportType',info[i].type.toUpperCase());
                if(info[i].type.toLowerCase() == 'png'){
                    node.layoutGrids = [{
                        pattern: "COLUMNS",
                        visible: true,
                        color: {
                            r: 1,
                            g: 0,
                            b: 0,
                            a: 0.1
                        },
                        gutterSize: 1,
                        alignment: "STRETCH",
                        count: 1,
                        offset: 0,
                    }];
                };
            };
            if(info[i].node && info[i].node !== ''){
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
            if(info[i].s  && info[i].s !== ''){
                //console.log(info[i].s)
                node.setPluginData('exportSize',info[i].s.toString());
            };
            selects.push(node);
        };
        figma.currentPage.selection = selects;
        //console.log(selects)
        layoutByRatio(selects,false,true);
    };
    //批量创建节点
    if ( type == "createZy"){
        //console.log(info)
        for (const zy of info) {
            let bg1 = [toRGB('#EEEEEE',true)];
            let color1 = [toRGB('#272727',true)];  
            let color2 = [toRGB('#333333',true)];
            let color3 = [toRGB('#808080',true)];
            let color4 = [toRGB('#AEAEAE',true)];
            let thComp,tdComp,preComp,allComp = [];
            let box = addFrame([900,100,null,null,zy.zyName,[]]);
            figma.currentPage.appendChild(box);
            switch (zy.zyType){
                case 'md':
                    addAutoLayout(box,['V','TL',0,[40,48,40,28]]);
                    box.fills = bg1;
                    //box.layoutSizingHorizontal = 'HUG';
                    //box.layoutSizingVertical = 'HUG';
                break
                case 'svg':
                break
            };
            for (const cres of zy.nodes) {
                let CreateZyNode = {
                    h: async function(cre,level){
                        let characters = typeof cre.content == 'string' ? cre.content : cre.content.map(item => item.content).join('');
                        let text = await addText([{family:'Inter',style:'Bold'},characters,(48 - level * 4),color1]);
                        let line = addFrame([100,100,null,null,'@h' + level,[]]);
                        addAutoLayout(line,['V','TL',0,[12,0,12,28]]);
                        line.appendChild(text);
                        text.layoutSizingHorizontal = 'FILL';
                        box.appendChild(line);
                        line.layoutSizingHorizontal = 'FILL';
                    },
                    h1: function(cre){
                        return CreateZyNode.h(cre,1);
                    },
                    h2: function(cre){
                        return CreateZyNode.h(cre,2);
                    },
                    h3: function(cre){
                        return CreateZyNode.h(cre,3);
                    },
                    h4: function(cre){
                        return CreateZyNode.h(cre,4);
                    },
                    h5: function(cre){
                        return CreateZyNode.h(cre,5);
                    },
                    h6: function(cre){
                        return CreateZyNode.h(cre,6);
                    },
                    p: async function(cre){
                        let characters = typeof cre.content == 'string' ? cre.content : cre.content.map(item => item.content).join('');
                        let text = await addText([{family:'Inter',style:'Regular'},characters,28,color2]);
                        let line = addFrame([100,100,null,null,'@p',[]]);
                        addAutoLayout(line,['V','TL',0,[6,0,6,28]]);
                        line.appendChild(text);
                        text.layoutSizingHorizontal = 'FILL';
                        box.appendChild(line);
                        line.layoutSizingHorizontal = 'FILL';
                    },
                    br: function(cre){
                        let line = addFrame([100,24,null,null,'@br',[]]);
                        box.appendChild(line);
                        line.layoutSizingHorizontal = 'FILL';
                    },
                    hr: function(cre){
                        let line = addFrame([100,24,null,null,'@hr',[]]);
                        addAutoLayout(line,['V','CC',0,[20,10,20,10]]);
                        let path = figma.createVector();
                        path.vectorPaths = [{
                            windingRule: "NONE",
                            data: "M 0 0 L 100 0",
                          }]
                        path.dashPattern = [4,4];
                        path.strokeWeight = 1;
                        path.strokes = color1;
                        line.appendChild(path);
                        path.layoutSizingHorizontal = 'FILL';
                        box.appendChild(line);
                        line.layoutSizingHorizontal = 'FILL';
                    },
                    code: async function(cre){
                        let characters = cre.content.join('\n');
                        //text.textAutoResize = 'HEIGHT';
                        //text.layoutSizingVertical = 'HUG';
                        let line = addFrame([100,100,null,null,'@code:' + cre.language,[]]);
                        addAutoLayout(line,['V','TL',0,[12,0,12,28]]);
                        if(!preComp){
                            let pre = addFrame([626,100,null,null,'@pre',[]]);
                            addAutoLayout(pre,['H','TL',0,[10,20,10,0]]);
                            pre.itemReverseZIndex = true;//前面堆叠在上
                            pre.fills = [toRGB('#272727',true)];
                            [pre.bottomLeftRadius,pre.bottomRightRadius,pre.topLeftRadius,pre.topRightRadius] = [10,10,10,10];

                            let mask = addFrame([100,100,null,null,'mask',[]]);
                            addAutoLayout(mask,['V','TL',0,[0,10,0,20]]);
                            mask.strokes = [toRGB('#272727',true)];
                            mask.fills = [toRGB('#27272799',true)];
                            [mask.strokeTopWeight,mask.strokeRightWeight,mask.strokeBottomWeight,mask.strokeLeftWeight] = [0,14,0,0];
                            let num = await addText([{family:'Roboto Mono',style:'Regular'},'4',20,color4]);
                            num.autoRename = false;
                            num.name = '#last-line-num.text';
                            num.fills = [];
                            mask.appendChild(num);
                            pre.appendChild(mask);

                            let eg = `function any(){\n\t/*somthing there*/\n}\n//Remember to change the value of 'last-line-num', it must be 4 here`;
                            let code = await addText([{family:'Roboto Mono',style:'Regular'},eg,20,color4]);    
                            code.setRangeListOptions(0,eg.length,{type: 'ORDERED'});//"ORDERED" | "UNORDERED" | "NONE"
                            code.hangingList = true;
                            pre.appendChild(code);
                            code.layoutSizingHorizontal = 'FILL';

                            mask.layoutSizingHorizontal = 'HUG';
                            mask.layoutSizingVertical = 'FILL';
                            preComp = figma.createComponentFromNode(pre);
                            addCompPro(preComp,num,'--last-line-num','TEXT','4');

                            preComp.x = box.x - 450;
                            preComp.y = box.y + 120;
                            preComp.resize(426,100);
                            preComp.layoutSizingVertical = 'HUG';
                            allComp.push(preComp);
                        };
                        let newPre = preComp.createInstance();
                        line.appendChild(newPre);
                        newPre.layoutSizingHorizontal = 'FILL';
                        newPre.layoutSizingVertical = 'HUG';
                        newPre.children[1].characters = characters;
                        let proId = Object.keys(newPre.componentProperties).filter(item => item.split('#')[0] == '--last-line-num')[0];
                        newPre.setProperties({[proId]: (cre.content.length).toString()});
                        box.appendChild(line);
                        line.layoutSizingHorizontal = 'FILL';
                    },
                    ul: async function(cre){
                        let characters = cre.items.map(item => {return typeof item.content == 'string' ? item.content : item.content.map(item => item.content).join('')}).join('\n');
                        let text = await addText([{family:'Inter',style:'Regular'},characters,24,color3]);
                        text.setRangeListOptions(0,characters.length,{type: 'UNORDERED'});//"ORDERED" | "UNORDERED" | "NONE"
                        text.listSpacing = 6;
                        let line = addFrame([100,100,null,null,'@ul',[]]);
                        addAutoLayout(line,['V','TL',0,[0,0,6,0]]);
                        line.appendChild(text);
                        text.layoutSizingHorizontal = 'FILL';
                        box.appendChild(line);
                        line.layoutSizingHorizontal = 'FILL';
                    },
                    ol: async function(cre){
                        let characters = cre.items.map(item => {return typeof item.content == 'string' ? item.content : item.content.map(item => item.content).join('')}).join('\n');
                        let text = await addText([{family:'Inter',style:'Regular'},characters,24,color3]);
                        text.setRangeListOptions(0,characters.length,{type: 'ORDERED'});//"ORDERED" | "UNORDERED" | "NONE"
                        text.listSpacing = 6;
                        let line = addFrame([100,100,null,null,'@ol',[]]);
                        addAutoLayout(line,['V','TL',0,[0,0,6,28]]);
                        line.appendChild(text);
                        text.layoutSizingHorizontal = 'FILL';
                        box.appendChild(line);
                        line.layoutSizingHorizontal = 'FILL';
                    },
                    blockquote: async function(cre){
                        let characters = typeof cre.content == 'string' ? cre.content : cre.content.map(item => item.content).join('');
                        //console.log(cre,characters)
                        let text = await addText([{family:'Inter',style:'Light'},characters,22 ,color3]);
                        //text.relativeTransform = [[1,-0.2126,0],[0,0.9771,0]];
                        let line = addFrame([100,100,null,null,'@blockquote',[]]);
                        addAutoLayout(line,['V','TL',0,[12,0,12,28]]);
                        let pre = addFrame([100,100,null,null,'@pre',[]]);
                        addAutoLayout(pre,['V','TL',0,[10,10,10,10]]);
                        pre.strokes = [toRGB('#272727',true)];
                        [pre.strokeTopWeight,pre.strokeRightWeight,pre.strokeBottomWeight,pre.strokeLeftWeight] = [1,1,4,1];
                        [pre.bottomLeftRadius,pre.bottomRightRadius,pre.topLeftRadius,pre.topRightRadius] = [10,10,10,10];
                        pre.appendChild(text);
                        text.layoutSizingHorizontal = 'FILL';
                        line.appendChild(pre);
                        pre.layoutSizingHorizontal = 'FILL';
                        box.appendChild(line);
                        line.layoutSizingHorizontal = 'FILL';
                    },
                    table:async function(cre){
                        await figma.clientStorage.getAsync('userLanguage')
                        .then (async (language) => {
                            if(!thComp){
                                thComp = await addTableCompMust('th',language,null,true);
                                allComp.push(thComp);
                            };
                            if(!tdComp){
                                tdComp = await addTableCompMust('td',language,null,true);
                                allComp.push(tdComp);
                            };
                            let all = await createTable(thComp,tdComp,language,true);  
                            let newth = all[0];
                            let newtd = all[1];
                            let table = all[2];
                            
                            let data = cre.rows;
                            //反转行列
                            data = data[0].map((_, i) => data.map(row => row[i]));
                            data = data.map(item => {
                                item = item.map(items => {
                                    if(typeof items == 'object'){
                                        return items.map(item => item.content).join('');
                                    }else{
                                        return items;
                                    }
                                });
                                return item;
                            });
                            let H = data[0].length;
                            let L = data.length - 3;
                            reCompNum(table,H,L)
                            reTableByArray(table,data,'[enter]','--');
                            reTableStyle(table,{th:[1,1,1,1,1],td:[1,1,1,1,'rowSpace']});
                            reAnyByTags([newth],[{'#table.fill':'#B8B8B8','#table.stroke':'#272727'}]);
                            reAnyByTags([newtd],[{'#table.fill':'#DADADA','#table.stroke':'#272727'}]);
                            let line = addFrame([100,100,null,null,'@sheet',[]]);
                            addAutoLayout(line,['V','TL',0,[12,0,12,28]]);
                            line.appendChild(table);
                            table.layoutSizingHorizontal = 'FILL';
                            table.clipsContent = true;
                            table.fills = [];
                            table.strokes = [toRGB('#272727',true)];
                            [table.bottomLeftRadius,table.bottomRightRadius,table.topLeftRadius,table.topRightRadius] = [20,20,20,20];
                            box.appendChild(line);
                            newth.x = box.x - 200;
                            newtd.x = box.x - 200;
                            newth.y = box.y;
                            newtd.y = box.y + 60;
                            
                            line.layoutSizingHorizontal = 'FILL';
                        })
                        .catch (error => {
                            console.log(error);
                        })
                    },
                    image:async function(cre){
                        let line = addFrame([100,100,null,null,'@image',[]]);
                        addAutoLayout(line,['V','TL',0,[12,0,12,28]]);
                        let img = figma.createRectangle();
                        line.appendChild(img);
                        box.appendChild(line);
                        let image = await figma.createImageAsync(cre.src);
                        let { width, height } = await image.getSizeAsync();
                        img.resize(width, height);
                        img.fills = [
                            {
                                type: 'IMAGE',
                                imageHash: image.hash,
                                scaleMode: 'FILL'
                            }
                        ];
                        img.name = cre.alt || 'image';
                        img.lockAspectRatio();
                        img.layoutSizingHorizontal = 'FILL';
                        line.layoutSizingHorizontal = 'FILL';
                    },
                };
                try {
                    await CreateZyNode[cres.type](cres);
                } catch (error) {
                    console.log(error);
                };
                if(zy.nodes.findIndex(item => item == cres) == zy.nodes.length - 1){
                    setTimeout(() => {
                        figma.currentPage.selection = [box];
                        if(!thComp && !tdComp && preComp){
                            preComp.y = box.y;
                        }else{
                            layoutByRatio(allComp,true);
                        };
                        figma.viewport.scrollAndZoomIntoView([box]);
                        figma.viewport.zoom = figma.viewport.zoom * 0.6;
                    }, 100);
                };
            };
        };
    };
    //反传画板数据
    if ( type == "getTableBySelects"){
        let data = getMain(figma.currentPage.selection);
        postmessage([data,'selectInfoMain']);
    };
    //反传组件信息
    if ( type == "selectComp"){
        //isSendComp = info;
        sendSendComp();
    };
    //上传所选对象以导出为图片/兼容格式/富文本
    if ( type == "upSelect"){
        //console.log(info)
        let [exporttype,exportset] = info;
        switch (exporttype){
            case 'image':
                exportImgInfo(exportset);
            break
            case 'zy':
                exportZyInfo(exportset);
            break
            case 'rich':
                exportRichInfo(exportset);
            break
        };
    };
    //修改目标大小
    if ( type == "setFinalSize"){
        figma.getNodeByIdAsync(info[0])
        .then(node => {
            node.setPluginData('exportSize',info[1].toString());
        })
        .catch(e => {
            console.log(e);
        })
    };
    //上传可编辑内容
    if( type == 'Up Editable'){

    };
    //上传栅格化内容
    if( type == 'Up Pixel'){
        let b = getSelectionMix();
        if(b.length == 1){
            let c = b[0];
            let [w,h,x,y] = getSafeMain(c);
            let maxWH = Math.max(w,h);
            let scale = maxWH >= 1024 ? 1024/maxWH : 1;
            let info = {
                id: c.id,
                name: c.name,
                x:x,
                y:y,
                width:w,
                height:h,
                u8a: await c.exportAsync({
                    format: 'PNG',
                    constraint: { type: 'SCALE', value: scale },
                    }),
            };
            postmessage([info,'editorView'])
        };
    };
    //上传样式信息
    if( type == "getStyleInfo"){
        getStyle('paint',true);
        getStyleSheet();
    };
    //上传变量信息
    if( type == "getVariableInfo"){
        getVariable();
        getVariableSheet();
    };
    //创建示例样式
    if( type == "addStyle"){
        let styles = [
            {name:'eg/xxx@set:theme1/color1',paint:[toRGB('#D54040',true)]},
            {name:'eg/xxx@set:theme1/color2',paint:[toRGB('#37B537',true)]},
            {name:'eg/xxx@set:theme1/color3',paint:[toRGB('#1B36A3',true)]},
            {name:'eg/xxx@set:theme2/color1',paint:[toRGB('#FFFF93',true)]},
            {name:'eg/xxx@set:theme2/color2',paint:[toRGB('#A9FFFF',true)]},
            {name:'eg/xxx@set:theme2/color3',paint:[toRGB('#CA9EE6',true)]},
            {name:'eg/color4',paint:[toRGB('#aaaaaa',true)]},
            {name:'eg/color5',paint:[toRGB('#444444',true)]},
        ];
        styles.forEach(item => {
           let style = figma.createPaintStyle();
           style.name = item.name;
           style.paints = item.paint;
        });
        postmessage([true,'styleInfo']);
        getStyle('paint');
    };
    //创建样式表
    if( type == "addStyleSheet"){
        reLocalSheet('style',true);
    };
    //从样式更新样式表
    if( type == 'Style To Sheet'){
        reLocalSheet('style');
    };
    //创建示例变量
    if( type == "addVariable"){
        let variables = [
            {
                name:'xxx@set:mode1',
                items:[//"BOOLEAN" | "COLOR" | "FLOAT" | "STRING"}
                    {name:'color1',value: toRGB('#ffffff'),type:"COLOR"},
                    {name:'number1',value: 123,type:"FLOAT",},
                ],
            },
            {
                name:'xxx@set:mode2',
                items:[
                    {name:'color1',value: toRGB('#000000'),type:"COLOR",},
                    {name:'number1',value: 456,type:"FLOAT",},
                ],
            },
        ];
        variables.forEach(mode => {
            let collection = figma.variables.createVariableCollection(mode.name);
            let modeid = collection.defaultModeId;
            collection.renameMode(modeid,mode.name.split('@set:')[1])
            mode.items.forEach(data => {
                let variable = figma.variables.createVariable(data.name,collection,data.type);
                variable.setValueForMode(modeid,data.value);
            });
        });
        postmessage([true,'variableInfo']);
        getVariable();
    };
    //创建变量表
    if( type == "addVariableSheet"){
        reLocalSheet('variable',true);      
    };
    //从变量更新变量表
    if( type == 'Variable To Sheet'){
        reLocalSheet('variable');  
    };
    //整理样式/变量相关组件和表格
    if( type == "reVariableLayout"){
        let a = figma.currentPage;
        const variablePages = figma.root.findChildren(item => item.name.includes('@localsheet'));
        variablePages.forEach(page => {
            figma.setCurrentPageAsync(page)
            .then(()=>{
                let variableNode = page.findChildren(item => item.name.includes(':variable'));
                let styleNode = page.findChildren(item => item.name.includes(':style'));
                let variableNodeGroup = {};
                let styleNodeGroup = {};
                let allGroup = [];
                //console.log(variableNode,styleNode)
                for(let node of variableNode){
                    let key = node.name.split('@')[0];
                    if(!variableNodeGroup[key]) variableNodeGroup[key] = [];
                    variableNodeGroup[key].push(node);
                };
                for(let node of styleNode){
                    let key = node.name.split('@')[0];
                    if(!styleNodeGroup[key]) styleNodeGroup[key] = [];
                    styleNodeGroup[key].push(node);
                };
                [...Object.values(variableNodeGroup),...Object.values(styleNodeGroup)].forEach(item => {
                    layoutByRatio(item,true);
                    let group = figma.group(item,a);
                    allGroup.push(group);
                });
                layoutByRatio(allGroup,true);
                figma.currentPage.selection = allGroup;
                figma.viewport.scrollAndZoomIntoView(allGroup);
                figma.viewport.zoom = figma.viewport.zoom * 0.6;
                allGroup.forEach(item => {
                    figma.ungroup(item);
                });
            })
            .catch(error => {
                console.log(error);
            });
                
        });
    };
    //管理断链样式
    if( type == "manageLinkStyle"){
        let b = getSelectionMix();
        let final = [];
        b.forEach(item => {
            if(item.fillStyleId || item.strokeStyleId){
                final.push(item);
            };
            final = [...final,...item.findAll(items => items.fillStyleId || items.strokeStyleId)];
        });
        //收集所有样式id
        let allStyleId = [];
        final.forEach(item => {
            if(item.fillStyleId){
                allStyleId.push(item.fillStyleId);
            };
            if(item.strokeStyleId){
                allStyleId.push(item.strokeStyleId);
            };
        });
        allStyleId = [...new Set(allStyleId)];
        //获取样式,以找到可能存在远程情况的样式
        let promises = allStyleId.map(item => figma.getStyleByIdAsync(item));
        let allStyle = await Promise.all(promises);
        allStyle = allStyle.map(item => {return {id:item.id,name:item.name,paint:item.paints};});
        //console.log(allStyle)
        //比对本地样式和远程样式，同名不同id或完全不同名且paints不同,就是未链接的样式
        //paints相同，就不能reset(覆盖)或create(新建)
        let unLinkStyle = [];//{id:id,name:name,islink:true,iscreate:true,isreset:true};
        let localStyleList = localStyles.paint.list;
        //先排除id相同的,筛选需要link的样式
        allStyle.forEach(item => {
            if(localStyleList.every(items => items.id != item.id)){
                unLinkStyle.push({id:item.id,name:item.name,paint:item.paint,islink:false,iscreate:false,isreset:false});
            }
        });
        //进一步确认能否reset或create
        unLinkStyle.forEach(item => {
            //同名则对比paints，相同就不能reset或create，不同名只能create
            let sameName = localStyleList.find(items => items.name == item.name);
            if(sameName){
                item.islink = true;
                if(JSON.stringify(sameName.paints) !== JSON.stringify(item.paint)){
                    item.isreset = true;
                }
            }else{
                let name2 = item.name.split('/');
                //路径长度小于3，可直接认为是不同样式（难以判断是否同一路径）
                if(name2.length < 3) return;
                let sameLastName = localStyleList.find(items => items.name.split('/').reverse()[0] == item.name.split('/').reverse()[0] && items.name.split('/').reverse()[1] == item.name.split('/').reverse()[1])
                if(sameLastName){
                    //如果lastName相同，就判断是不是路径类似
                    let name1 = sameLastName.name.split('/');
                    //按最短长度保留路径，相同则直接认为是同一路径
                    let minLength = Math.min(name1.length,name2.length,Math.round(name1.length/2),Math.round(name2.length/2));
                    //console.log(minLength)
                    let name1path = name1.splice(name1.length - minLength,minLength).join('/');
                    let name2path = name2.splice(name2.length - minLength,minLength).join('/');
                    //console.log(name1path,name2path)
                    if(name1path == name2path){
                        item.islink = true;
                        item.isname = sameLastName.name;
                    } else {
                        item.islink = false;
                        item.iscreate = true;
                    };
                }else{
                    item.islink = false;
                    item.iscreate = true;
                }
            }
        });
        unLinkStyle.forEach(item => {
            delete item.paint;
        });
        //console.log(unLinkStyle)
        postmessage([unLinkStyle,'linkStyleInfo']);
    };
    //管理样式组
    if( type == "manageStyleGroup"){
        let b = getSelectionMix();
        let final = [];
        b.forEach(item => {
            if(item.fillStyleId || item.strokeStyleId){
                final.push(item);
            };
            final = [...final,...item.findAll(items => items.fillStyleId || items.strokeStyleId)];
        });
        //收集所有样式id
        let allStyleId = [];
        final.forEach(item => {
            if(item.fillStyleId){
                allStyleId.push(item.fillStyleId);
            };
            if(item.strokeStyleId){
                allStyleId.push(item.strokeStyleId);
            };
        });
        allStyleId = [...new Set(allStyleId)];
        //获取样式,以找到可能存在远程情况的样式
        let promises = allStyleId.map(item => figma.getStyleByIdAsync(item));
        let allStyle = await Promise.all(promises);
        allStyle = allStyle.map(item => {return {id:item.id,name:item.name};});
        //console.log(allStyle)
        let themeStyle = [];
        let localThemeStyle = localStyles.paint.list.filter(item => item.name.includes('@set:'));
        allStyle.forEach(item => {
            if(localThemeStyle.some(items => items.id == item.id)){
                themeStyle.push(item);
            };
        });
        //console.log(themeStyle)
        postmessage([themeStyle,'styleGroupInfo']);
    };
    //管理变量组
    if( type == "manageVariableGroup"){
        
    };
    //从预设或组件创建表格
    if ( type == "creTable"){
        //console.log(info)
        let a = figma.currentPage;
        let b = getSelectionMix();
        let th,td;
        if(info[1]){
            th = b.find(item => item.name == info[1]);
        };
        if(info[2]){
            td = b.find(item => item.name == info[2]);
        };
        if(b.length == 3 && th && td && b.some(item => item.name.includes('@tn'))){
            let tn = b.find(item => item.name.includes('@tn'));
            let all = createLocalSheet('style',[th,td,tn]);
            a.selection = all;
            figma.viewport.scrollAndZoomIntoView(all);
            figma.viewport.zoom = figma.viewport.zoom * 0.6;
            return;
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
            figma.viewport.scrollAndZoomIntoView(all);
            figma.viewport.zoom = figma.viewport.zoom * 0.6;
        })
        .catch (error => {
        }); 
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
        let b = getSelectionMix();
        let final = b.filter(item => item.type == 'COMPONENT' && item.name.includes('@t'));
        final.forEach(comp => {
            let type = comp.name.split('@')[1];
            //没命名则默认为表格，而不是表头
            if(!['th','td','tn'].includes(type)){
                if(comp.findOne(item => item.type == 'TEXT')){
                    type = 'td';
                    comp.name += ' @td';
                }else{
                    type = 'tn';
                    comp.name += ' @tn';
                };
            };
            comp.children.forEach(item => {
                if( !item.name.includes('#') && item.name.includes('--')){
                    item.remove();
                };
            });
            Object.keys(comp.componentPropertyDefinitions).forEach(item => {
                comp.deleteComponentProperty(item);
            });
            
            let [w,h] = [comp.width,comp.height]
            if(comp.layoutMode == 'NONE'){
                addAutoLayout(comp,['H','CC',0,[0,0]],true)
            };
            comp.resize(w,h);
            comp.itemReverseZIndex = true;//前面堆叠在上
            makeCompliant(type,comp);
            
            let texts = comp.findAll(item => item.type == 'TEXT');
            if(texts.length > 0){
                let proid = addCompPro(comp,texts[0],'--data','TEXT',texts[0].characters);
                for(let i = 1; i < texts.length; i++){
                    texts[i].componentPropertyReferences = {[characters]:proid};
                };
            };
        });
    };
    //便捷选中表格
    if ( type == 'pickTable'){
        let b = getSelectionMix();
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
            };
        };
    };
    //批量填充文本数据
    if( type == 'mapText'){
        let b = getSelectionMix();
        /**/
        let tables = getTablesByNodes(b);
        //没有table就说明是普通的文本数据填充
        if(!tables  || tables.length == 0){
            let Array = info.data[0];
            let comps = b.filter(item => item.type == 'INSTANCE');
            //没有实例可能要自动填充
            if(!comps || comps.length == 0){
                if(b.length == 1 && Array.length > 1){
                    comps = b[0].findChildren(item => item.type == 'INSTANCE');
                    //仅自动布局时生效
                    if(b[0].layoutMode && b[0].layoutMode !== 'NONE'){
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
        let b = getSelectionMix();
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
        let b = getSelectionMix();
        let nodes = b;
        if(info.data[0]){
            if(b.length == 1){
                if(b[0].layoutMode && b[0].layoutMode !== 'NONE' && b[0].children.length == 1 && b[0].children[0].type == 'INSTANCE'){
                    let c = b[0].children[0];
                    for(let i = 1; i < info.data.length; i++){
                        b[0].appendChild(c.clone());
                    };
                };
                nodes = b[0].children;
            };
            nodes = nodes.filter(node => node.type == 'INSTANCE');
            //console.log(info)
            reAnyByObj(nodes,info.data,info.enters,info.nulls);
        };
    };
    //批量设置标签属性
    if( type == 'mapTag'){
        let b = getSelectionMix();
        let nodes = b;
        if(info.data[0] && info.data[0].length > 0){
            if(b.length == 1){
                if(b[0].layoutMode && b[0].layoutMode !== 'NONE' && b[0].children.length == 1 && b[0].children[0].type == 'INSTANCE'){
                    let c = b[0].children[0];
                    for(let i = 1; i < info.data.length; i++){
                        b[0].appendChild(c.clone());
                    };
                };
                nodes = b[0].children;
            };
            //nodes = nodes.filter(node => node.type == 'INSTANCE');
            reAnyByTags(nodes,info.data);
        };
    };
    //批量获取文本数据
    if( type == 'getText'){
        let b = getSelectionMix();
        let tables = getTablesByNodes(b);
        //没有table就说明是普通的文本数据填充
        if(!tables  || tables.length == 0){
            
            let comps = b.filter(item => item.type == 'INSTANCE');
            if(b.length == 1 && b[0].children){
                comps = b[0].children.filter(item => item.type == 'INSTANCE');
            };

            if(comps && comps.length > 0){
                sortLRTB(comps);
                let data = [getProArray(comps,false,info.enters,info.nulls)];
                data = data[0].map((_, i) => data.map(row => row[i]));
                //console.log(data,typeof data);
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
        let b = getSelectionMix();
        let names = [];
        if(b.length == 1){
            b[0].children.forEach((node) => {
                names.push([node.name]);
            });
        }else{
            b.forEach((node) => {
                names.push([node.name]);
            });
        }
        postmessage([names,'selectDatas'])
    };
    //批量获取组件属性
    if( type == 'getPro'){
        let b = getSelectionMix();
        let comps = b.filter(node => node.type == 'INSTANCE');
        if(!comps  || comps.length == 0){
            if(b.length == 1){
                comps = b[0].findChildren(node => node.type == 'INSTANCE');
            };
        };
        if(comps  && comps.length > 0){
            let proKeys = comps.map(item => Object.keys(item.componentProperties).map(key => key.split('#')[0]).sort());
            let proNames = [...new Set(proKeys.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
            //console.log(proKeys,proNames)
            //必须有相同的组件属性才能提取
            if(proNames.length == 1){
                let datas = getProObj(comps,info.enters,info.nulls);
                //console.log(datas)
                //console.log(typeof datas[0])
                postmessage([datas,'selectDatas'])
            };
        };
    };
    //批量获取标签属性
    if( type == 'getTag'){

    };
    //更新表格样式、行列
    if( type == 'reTable'){
        let b = getSelectionMix();
        let tables = getTablesByNodes(b);
        let setdata = info[0],retype = info[1]
        //console.log(setdata)
        tables.forEach(table => {
            let HH = table.children.length;
            let VV = table.children[0].children.length;
            let _H = 0,V = 0;
            if(typeof setdata == 'object'){
                _H = setdata[0];
                V = setdata[1];
                //行数不能少于2，列数不能少于1
                _H = _H + HH < 1 ? 1 - HH : _H;
                V = V + VV < 2 ? 2 - VV : V;
            };
            switch (retype){
                case 'style':
                    reTableStyle(table,setdata);
                ;break
                case 'add':
                    reCompNum(table,_H,V);
                ;break
                case 'reduce':
                    reCompNum(table,_H,V);
                ;break
                case 'theme':
                    //reTableStyle(table,setdata);
                    //一个饱和度、明度适中的颜色
                    let [H,S,L] = [Math.random()*360,(Math.random()*50) + 10,(Math.random()*80) + 10];
                    S = S <= 30 && L <= 50 ? S*1.2 : S;
                    L = S >= 50 && L >= 40 ? L*0.8 : L;
                    let [S2,L2] = [S >= 50 ? S*0.95 : S*1, L >= 50 ? L*0.8 : L*1.2,];
                    let [S3,L3] = [S >= 50 ? S*0.9 : S*1, L >= 50 ? L*0.7 : L*1.3,];
                    let textColor = L2 >= 50 ? '#000000' : '#ffffff';
                    [H,S,L] = [Math.floor(H),Math.floor(S) + '%',Math.floor(L) + '%'];
                    [S2,L2] = [Math.floor(S2) + '%',Math.floor(L2) + '%'];
                    [S3,L3] = [Math.floor(S3) + '%',Math.floor(L3) + '%'];  
                    let [tableBg,tableFill,tableStroke] = [`hsl(${[H,S,L].join(',')})`,`hsl(${[H,S2,L2].join(',')})`,`hsl(${[H,S3,L3].join(',')})`]                
                    //console.log([toRGB(tableBg,true),toRGB(tableFill,true),toRGB(tableStroke,true)])
                    reTableTheme(table,[tableBg,tableFill,tableStroke],textColor)
                ;break
            };
        });
    };
    //全描边
    if( type == 'All Border'){
        let b = getSelectionMix();
        b.forEach(item => {
            if(item.type == 'INSTANCE'){
                if(item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn')){
                    reTableStyle(null,null,[[item],[1,1,1,1]]);
                }
                return;
            };
            let comps = item.findAll(items => items.type == 'INSTANCE' );
            comps = comps.filter(item => item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn'));
            reTableStyle(null,null,[comps,[1,1,1,1]]);
        });
    };
    //全不描边
    if( type == 'None Border'){
        let b = getSelectionMix();
        b.forEach(item => {
            if(item.type == 'INSTANCE'){
                if(item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn')){
                    reTableStyle(null,null,[[item],[0,0,0,0]]);
                }
                return;
            };
            let comps = item.findAll(items => items.type == 'INSTANCE' );
            comps = comps.filter(item => item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn'));
            reTableStyle(null,null,[comps,[0,0,0,0]]);
        });
    };
    //全填充
    if( type == 'All Fill'){
        let b = getSelectionMix();
        b.forEach(item => {
            if(item.type == 'INSTANCE'){
                if(item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn')){
                    reTableStyle(null,null,[[item],[null,null,null,null,1]]);
                }
                return;
            };
            let comps = item.findAll(items => items.type == 'INSTANCE' );
            comps = comps.filter(item => item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn'));
            reTableStyle(null,null,[comps,[null,null,null,null,1]]);
        });
    };
    //全不填充
    if( type == 'None Fill'){
        let b = getSelectionMix();
        b.forEach(item => {
            if(item.type == 'INSTANCE'){
                if(item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn')){
                    reTableStyle(null,null,[[item],[null,null,null,null,0]]);
                }
                return;
            };
            let comps = item.findAll(items => items.type == 'INSTANCE' );
            comps = comps.filter(item => item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn'));
            reTableStyle(null,null,[comps,[null,null,null,null,0]]);
        });
    };
    //反转行列
    if( type == 'Row Column Swap'){
        let b = getSelectionMix();
        let tables = getTablesByNodes(b);
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
        //console.log(info)
        let b = getSelectionMix();
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
                    let numH = info[1]/item.height;
                    rescaleMix(item,numH,info[2]);
                ;break
            };
        });
    };
    //斜切拉伸
    if( type == 'transformMix'){
        let b = getSelectionMix();
        console.log(info)
        b.forEach(item => {
            let oldWH;
            if(!item.getPluginData('oldWH')){
                item.setPluginData('oldWH',JSON.stringify([item.width,item.height]));
            }else{
                oldWH = JSON.parse(item.getPluginData('oldWH'));
            };
            let skewX = Math.tan(info.x*(Math.PI/180));
            let scaleX = item.relativeTransform[0][0];
            let x = item.relativeTransform[0][2];
            let skewY = Math.tan(info.y*(Math.PI/180));
            let scaleY = item.relativeTransform[1][1];
            let y = item.relativeTransform[1][2];
            item.resize(oldWH[0] * info.w/100,oldWH[1] * info.h/100);
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
        let b = getSelectionMix();
        if(b.length == 1){
            //console.log(info)
            let final = b[0];
            let main = getSafeMain(b[0]);
            let oldRC = getClipGrids(b[0],true);
            let safeGridsNum = oldRC ? oldRC[0].length + oldRC[1].length : 0;
            //console.log(oldRC)
            if(!oldRC || (oldRC && safeGridsNum !== b[0].layoutGrids.length)){
                b[0].name = b[0].name.replace(' @clip','').replace('@clip','').trim();
                if(b[0].layoutGrids){
                    let newgrids = JSON.parse(JSON.stringify(b[0].layoutGrids));
                    //console.log(newgrids)
                    newgrids.forEach(item => item.visible = false);
                    //console.log(newgrids)
                    b[0].layoutGrids = newgrids;
                };
                let gridset = addFrame([...main,b[0].name + ' @clip',[]])
                fullInFrameSafa(b[0],gridset);
                final = gridset;
                a.selection = [gridset];
            } else {
                if(!b[0].name.includes('@clip')){
                    b[0].name += ' @clip';
                };
            };

            let RC = getClipGrids(final,true);

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
        let b = getSelectionMix();
        if(b.length == 1 && b[0].layoutGrids && b[0].layoutGrids.length > 0 && b[0].name.split(' ').includes('@clip')){
            let RC = getClipGrids(b[0]);
            let safaMain = getSafeMain(b[0]);
            let cuts = clipGridsToCut(RC,[safaMain[0],safaMain[1]]);
            toPixel(cuts,false,true);
        };
    };
    if( type == 'Component Clip'){
        let b = getSelectionMix();
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
    //清除调整
    if( type == 'Clear Filter'){
        let b = getSelectionMix();
        let final = b.filter(item => item.type == 'RECTANGLE');
        final.forEach(item => {
            findImage(item,(image,fills) => {
                image.blendMode = 'NORMAL';
                image.opacity = 1;
                Object.keys(image.filters).forEach(key => {
                    image.filters[key] = 0;
                });
                item.fills = fills;
            });
        });
    };
    //还原尺寸
    if( type == 'Raw Size'){
        let b = getSelectionMix();
        let final = b.filter(item => item.type == 'RECTANGLE');
        final.forEach(item => {
            findImage(item,(image,fills) => {
                let imageData = figma.getImageByHash(image.imageHash);
                imageData.getSizeAsync().then(data => {
                    item.resize(data.width,data.height);
                });
                image.imageTransform = [[1,0,0],[0,1,0]];
                image.scaleMode = 'FILL';
                item.fills = fills;
            });
        });
    };
    //高反差保留
    if( type == 'High Pass'){
        let b = getSelectionMix();
        let final = b.filter(item =>item.type == 'RECTANGLE');
        if(info){ 
            //console.log(info)
        }else{
            final.forEach(item=> {
                findImage(item,(image,fills) => {
                    let imageData = figma.getImageByHash(image.imageHash);
                    imageData.getBytesAsync().then(data => {
                        postmessage([[type,item.id,data],'editImage']);
                    });
                });
            });
        };
    };
    //反转通道
    if( type == 'Invert Alpha'){
        let b = getSelectionMix();
        let final = b.filter(item =>item.type == 'RECTANGLE');
        if(info){ 
            //console.log(info)
        }else{
            final.forEach(item=> {
                findImage(item,(image,fills) => {
                    let imageData = figma.getImageByHash(image.imageHash);
                    imageData.getBytesAsync().then(data => {
                        postmessage([[type,item.id,data],'editImage']);
                    });
                });
            });
        };
    };
    //多余空白裁剪
    if( type == 'Crop Blank'){
        let b = getSelectionMix();
        let final = b.filter(item =>item.type == 'RECTANGLE');
        if(info){ 
            //console.log(info)
        }else{
            final.forEach(item=> {
                findImage(item,(image,fills) => {
                    let imageData = figma.getImageByHash(image.imageHash);
                    imageData.getBytesAsync().then(data => {
                        postmessage([[type,item.id,data],'editImage']);
                    });
                });
            });
        };
    };
    //当前比例裁剪
    if( type == 'Crop Current Scale'){
        let b = getSelectionMix();
        let final = b.filter(item =>item.type == 'RECTANGLE');
        final.forEach(item => {
            findImage(item,(image,fills) => {

            });
        });
    };
    //统一调整参数
    if( type == 'Same Filter'){
        let b = getSelectionMix();
        let final = b.filter(item => item.type == 'RECTANGLE');
        if(final.length < 2) return;
        //console.log(final.map(item => item.name)); //return;
        let oneNode,oneImage;
        for(let i = 0; i < final.length; i++){
            let image = findImage(final[i]);
            if(image){
                oneNode = final[i];
                oneImage = image;
                break
            };
        };
        if(!oneNode || !oneImage) return;
        final.forEach(item => {
            if(item == oneNode) return;
            //console.log(oneNode,oneImage.filters);
            findImage(item,(image,fills) => {
                image.filters = oneImage.filters;
                item.fills = fills;
            });
        });
    };
    //统一填充模式
    if( type == 'Same Full'){
        let b = getSelectionMix();
        let final = b.filter(item => item.type == 'RECTANGLE');
        if(final.length < 2) return;
        let oneNode,oneImage;
        for(let i = 0; i < final.length; i++){
            let image = findImage(final[i]);
            if(image){
                oneNode = final[i];
                oneImage = image;
                break
            };
        };
        if(!oneNode || !oneImage) return;
        final.forEach(item => {
            if(item == oneNode) return;
            findImage(item,(image,fills) => {
                image.scaleMode = oneImage.scaleMode;
                item.fills = fills;
            });
        });
    };
    //统一裁剪位置
    if( type == 'Same Clip Position'){
        let b = getSelectionMix();
        let final = b.filter(item => item.type == 'RECTANGLE');
        if(final.length < 2) return;
        let oneNode, oneImage;
        for (let i = 0; i < final.length; i++) {
            let image = findImage(final[i]);
            if (image) {
                oneNode = final[i];
                oneImage = image;
                break;
            };
        };
        if (!oneNode || !oneImage) return;
        figma.getImageByHash(oneImage.imageHash).getSizeAsync().then(srcSize => {
            let srcW = srcSize.width, srcH = srcSize.height;
            let [skewX,skewY] = [oneImage.imageTransform[0][1],oneImage.imageTransform[1][0]];
            let [transX,transY] = [oneImage.imageTransform[0][2],oneImage.imageTransform[1][2]];
            final.forEach(item => {
                if (item == oneNode) return;
                let [w,h] = [oneNode.width, oneNode.height];
                //imageTransform直接赋值会和scaleMode冲突，只能在同大小情况下直接赋值
                findImage(item, (image, fills) => {
                    figma.getImageByHash(image.imageHash).getSizeAsync()
                    .then(async (dstSize) => {
                        let dstW = dstSize.width, dstH = dstSize.height;
                        if(JSON.stringify([srcW,srcH]) == JSON.stringify([dstW,dstH])){
                            item.resize(w, h);
                            image.scaleMode = oneImage.scaleMode;
                            image.imageTransform = oneImage.imageTransform;
                            item.fills = fills;
                        } else {
                            //先还原尺寸
                            findImage(item,async(image,fills) => {
                                let imageData = figma.getImageByHash(image.imageHash);
                                let originSize = await imageData.getSizeAsync();
                                item.resize(originSize.width, originSize.height);
                                image.imageTransform = [[1,0,0],[0,1,0]];
                                image.scaleMode = 'FILL';
                                item.fills = fills;

                                item.resize(w, h);
                                //确保重置了transform再进行统一裁剪位置
                                let scaleX = w / dstW;
                                let scaleY = h / dstH;
                                image.scaleMode = oneImage.scaleMode;
                                // 在赋值fills之前，先调整transform使之等效于源图层的缩放和偏移
                                let srcTransform = image.imageTransform;
                                let newTransform = [
                                    [srcTransform[0][0] * scaleX, srcTransform[0][1] * scaleX, 0],
                                    [srcTransform[1][0] * scaleY, srcTransform[1][1] * scaleY, 0]
                                ];
                                image.imageTransform = newTransform;
                                item.fills = fills;
                                //return;
                                findImage(item, (image, fills) => {
                                    let newTransX = transX * srcW / dstW;
                                    let newTransY = transY * srcH / dstH;
                                    // 只调整锚点，“微调”transform
                                    image.imageTransform =  [
                                        [srcTransform[0][0] * scaleX, skewX * scaleX , newTransX],
                                        [skewY * scaleY, srcTransform[1][1] * scaleY, newTransY]
                                    ];
                                    item.fills = fills;
                                });
                            });  
                        };
                    });
                });
            });
        });
    };
    //拆分文案
    if ( type == "splitText"){
        
        let b = getSelectionMix();
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
                                console.log(splitTag)
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
    //借助svg对文本的处理裁切文案
    if ( type == 'Split By SVG'){
        let b = getSelectionMix();
        let texts = b.filter(item => item.type == 'TEXT');
        let selects = [];
        texts.forEach(async (item) => {
            let safeMain = getSafeMain(item);
            let svgcode = await item.exportAsync({
                format: 'SVG_STRING',
                svgOutlineText: false,
                svgIdAttribute: true,
            })
            let newNode = figma.createNodeFromSvg(svgcode);
            //newNode.x = safeMain[2];
            //newNode.y = safeMain[3];

            let group = figma.group(newNode.children,item.parent,(item.parent.children.findIndex(items => items.id == item.id) + 1));
            group.name = item.name.length > 14 ? item.name.slice(0,14) + '...' : item.name;
            group.name += ' @split:svg';
            group.children.forEach(items => {
                if(items.type == 'GROUP'){
                    figma.ungroup(items);
                };
            });
            group.x = item.x;
            group.y = item.y;

            newNode.remove();
            selects.push(group);
            item.visible = false;
        });
        figma.currentPage.selection = selects;
        return;
    }
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
        let b = getSelectionMix();
        let final = b.filter(item => item.type !== 'INSTANCE' && item.children)
        //console.log(final)
        
        if(final.length > 0){
            final.forEach(item => {
                let c = item.children
                for ( let e = 0; e < c.length; e++){
                    autoConstraints(item,c[e])
                };
            });
        };
    };
    //反转顺序
    if( type == 'Reversing Index'){
        let b = getSelectionMix();
        if(b.length == 1 && b[0].children && b[0].type !== 'INSTANCE'){
            let olds = b[0].children;
            for(let i = 0; i < olds.length; i++){
                b[0].insertChild(0,olds[i]);
            };
        }else{
            if([...new Set(b.map(item => item.parent.id))].length == 1){
                let indexs = b.map(item => [b[0].parent.children.findIndex(items => items == item),item]).sort();
                if(indexs.length - 1 == indexs[indexs.length - 1][0] - indexs[0][0]){
                    for(let i = 0; i < indexs.length; i++){
                        //console.log(indexs[i][1].name)
                        b[0].parent.insertChild(indexs[0][0],indexs[i][1]);
                    };
                };
            };
        };
    };
    //调换位置
    if( type == 'Exchange Position'){
        let b = getSelectionMix();
        let final = b.filter(item => !getParentAll(item,'INSTANCE'));
        final = final.filter(item => !(item.parent.type == 'GROUP' && item.parent.children.length == 1))
        if(final.length == 2){
            //console.log(666)
            let [x1,y1,w1,h1,p1,i1] = [
                final[0].x,
                final[0].y,
                final[0].width,
                final[0].height,
                final[0].parent,
                final[0].parent.children.findIndex(item => item.id == final[0].id)
            ];
            let [x2,y2,w2,h2,p2,i2] = [
                final[1].x,
                final[1].y,
                final[1].width,
                final[1].height,
                final[1].parent,
                final[1].parent.children.findIndex(item => item.id == final[1].id)
            ];
            p1.insertChild(i1,final[1]);
            final[1].x = x1;
            final[1].y = y1;
            p2.insertChild(i2,final[0]);
            final[0].x = x2;
            final[0].y = y2;

            if(info){
                final[0].x -= (w1 - w2)/2;
                final[0].y -= (h1 - h2)/2;
                final[1].x -= (w2 - w1)/2;
                final[1].y -= (h2 - h1)/2;
            };
        };
    };
    //拆分到容器
    if( type == 'Divide To Frame'){
        let a = figma.currentPage;
        let b = getSelectionMix();
        let final = b.filter(item => item.children && item.children.length > 0 );
        let selects = [];
        final.forEach(node => {
            let layerIndex = node.parent.children.findIndex(item => item.id == node.id)
            let safenode;
            switch (node.type){
                case 'FRAME':
                    safenode = node.clone();
                break
                case 'GROUP':
                    let comp = figma.createComponentFromNode(node.clone());
                    safenode = comp.createInstance().detachInstance();
                    comp.remove();
                break
                case 'COMPONENT':
                    safenode = node.createInstance().detachInstance();
                break
                case 'INSTANCE':
                    safenode = node.clone().detachInstance();
                break
                default: return
            };
            setMain([...getSafeMain(node), null,'old'],safenode);
            let groupnode = []
            for(let i = 0; i < node.children.length; i++){
                let newnode = safenode.clone();
                newnode.children.forEach((child,index) => {
                    if(index !== i){
                        child.remove();
                    };
                });
                if(i !== 0 && !info){
                    newnode.fills = [];
                };
                groupnode.push(newnode);
            };
            safenode.remove();
            let group = figma.group(groupnode,node.parent,(layerIndex + 1))
            group.name = node.name + ' @divide';
            selects.push(group);
            node.visible = false;
        });
        a.selection = selects;
    };
    //包裹到容器
    if( type == 'Put In Frame'){
        let a = figma.currentPage;
        let b = getSelectionMix();
        let selects = [];
        b.forEach(node => {
            if((!info && !FRAME_TYPE.includes(node.type)) || info){
                let frame = addFrame([],node);
                fullInFrameSafa(node,frame);
                selects.push(frame);
            };
        });
        a.selection = selects;
    };
    //填充组件到容器
    if( type == 'Clone to Fill'){
        let a = figma.currentPage;
        let b = getSelectionMix();
        let comp = b.find(item => item.type == 'COMPONENT' || item.type == 'INSTANCE');
        let frames = b.filter(item => item.type == 'FRAME' && item.layoutMode == 'NONE');
        let selects = []
        frames.forEach(item => {
            let clone = comp.type == 'COMPONENT' ? comp.createInstance() : comp.clone();
            clone.unlockAspectRatio();
            let scale = Math.min(item.width,item.height)/Math.max(clone.width,clone.height)
            clone.rescale(scale);
            item.appendChild(clone);
            asFillChild(clone,true)
            selects.push(clone)
        });
        a.selection = selects;
    };
    //作为自适应底框
    if( type == 'Absolute & Fill'){
        let b = getSelectionMix();
        b.forEach(node => {
            if(node.type == 'INSTANCE' && node.parent.layoutMode !== 'NONE'){
                addAsAbsolute(null,node,[0,0]);
                asFillChild(node,true);
                if(!node.name.includes('@autoBod')){
                    node.name += ' @autoBod'
                };
            };
        });
    };
    //母组件复制
    if ( type == 'Clone Comp.'){
        let b = getSelectionMix();
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
        let b = getSelectionMix();
        let selects = [];
        b.forEach(item => {
            if(item.type == 'COMPONENT'){
                let layerIndex = item.parent.children.findIndex(items => items.id == item.id);
                let newComp = item.createInstance();
                let newNode = newComp.detachInstance();
                setMain([],newNode,item);
                item.parent.insertChild((layerIndex + 1),newNode);
                if(info){
                    //item.remove();
                } else {
                    if(item.height >= item.width){
                        newNode.x += item.width + 20;
                    } else {
                        newNode.y -= item.height + 20;
                    };
                    newNode.name = item.name + ' copy';
                };
                
                selects.push(newNode);
            };
        });
        a.selection = selects;
    };
    //拆分路径
    if ( type == 'Split Path'){
        let a = figma.currentPage;
        let b = getSelectionMix();
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
    if ( type == 'Get SVG'){
        let b = getSelectionMix();
        let final = b[0];
        let groups = null;
        if(b.length > 1){
            groups = figma.group(b[0].clone());
            for(let i = 0; i < b.length; i++){
                groups.appendChild(b[i].clone());
            }
            final = groups;
        }
        let svgcode = await final.exportAsync({
            format: 'SVG_STRING',
            svgOutlineText: false,
            svgIdAttribute: true,
        })
        if(groups){
            groups.remove()
        }
        svgcode = svgcode.replace(/\s*xlink:href\s*=\s*["'][^"']*["']/gi,'').replace(/\s*href\s*=\s*["'][^"']*["']/gi,'')
        console.log(svgcode)
    };
    //转为svg代码再导入
    if ( type == 'Clone As SVG'){
        let b = getSelectionMix();
        for(let i = 0; i < b.length; i++){
            let svgcode = await b[i].exportAsync({
                format: 'SVG_STRING',
                svgOutlineText: false,
                svgIdAttribute: true,
            });
            svgcode = svgcode.replace(/\s*xlink:href\s*=\s*["'][^"']*["']/gi,'').replace(/\s*href\s*=\s*["'][^"']*["']/gi,'')
            console.log(svgcode)
            let safeMain = getSafeMain(b[i]);
            let box = addFrame([...safeMain,b[i].name,[]]);
            fullInFrameSafa(b[i],box);
            let newnode = figma.createNodeFromSvg(svgcode);
            box.appendChild(newnode);
            [newnode.x,newnode.y] = [0,0]
            b[i].visible = false
        };
    };
    
};

//==========初始化==========//


figma.on('selectionchange',()=>{
    sendInfo();
    sendSendComp();
});

figma.on('stylechange',()=>{
    getStyle('paint');
});

setTimeout(()=>{
    console.clear();
    console.log(`- [YNYU_SET] OPEN DESIGN & SOURCE
- © 2024-2025 YNYU lvynyu2@gmail.com;`);
    //console.log(localStyles)
},50)

sendInfo();
function sendInfo(){
    let a = figma.currentPage;
    let b = a.selection;
    if(b && b.length > 0){
        let data = [];
        b.forEach(node => {
            let n = TextMaxLength(node.name,20,'...');
            let nodeType = node.type;
            let w = node.absoluteRenderBounds ? node.absoluteRenderBounds.width : node.absoluteBoundingBox.width;
            let h = node.absoluteRenderBounds ? node.absoluteRenderBounds.height : node.absoluteBoundingBox.height;
            let transform = node.absoluteTransform;
            let scaleX = node.getPluginData('oldWH') ? Math.round(node.width/JSON.parse(node.getPluginData('oldWH'))[0]*100) : 100;// Math.floor(transform[0][0] * 100);
            let scaleY = node.getPluginData('oldWH') ? Math.round(node.height/JSON.parse(node.getPluginData('oldWH'))[1]*100) : 100;//Math.floor(transform[1][1] * 100);
            let skewX = Math.round(Math.atan(transform[0][1])/(Math.PI/180));
            let skewY = Math.round(Math.atan(transform[1][0])/(Math.PI/180));
            //console.log([skewX,skewY])
            let column = 0;
            let row = 0;
            if(node.layoutGrids){
                let [R,C] = getClipGrids(node)
                column = C.length
                row = R.length
            };
            column = column <= 2 ? column : 0;
            row = row <= 2 ? row : 0;
            data.push([n,w,h,[skewX,skewY,scaleX,scaleY],[column,row],nodeType]);
        });
        postmessage([data,'selectInfo']);
    } else {
        postmessage([[[null,null,null,[0,0,100,100],[0,0]]],'selectInfo']);
    };
};

sendSendComp();
function sendSendComp(){
    let a = figma.currentPage;
    let b = a.selection;
    if(b.length == 0){
        postmessage([[null,null,null],'selectComp']);
        return;
    } ;
    let info = [];
    let th,td,tn;
    let comps = b.filter(item => item.type == 'COMPONENT' || item.type == 'INSTANCE');
    if(comps.length > 0){
        th = comps.find(item => item.name.split('@th').length > 1);
        td = comps.find(item => item.name.split('@td').length > 1);  
        tn = comps.find(item => item.name.split('@tn').length > 1);   
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
    };
    if(tn){
        info.push(tn.name);
    } else {
        info.push(null);
    }
    postmessage([info,'selectComp']);
};

//==========工具函数==========//

//封装postMessage
function postmessage(data){
    //console.log(data)
    /*figma*/
    figma.ui.postMessage({pluginMessage:data})
    /*mastergo*/
    //figma.ui.postMessage(data)
};

/**
 * @param {[object] | null} info -新建页面的设置项，命名、背景色、页码
 */
function addPageMix(info = [{name: null,fill: null,index: null}]){
    let safaPage = figma.currentPage.clone();
    safaPage.children.forEach(item => {
        item.remove();
    });
    let finals = [];
    info.forEach( (item)=> {
        let newpage;
        try{
            newpage = figma.createPage();
        } catch(e){
            newpage = safaPage.clone();
        }
        newpage.name = item.name ? item.name : 'New Page';
        if(item.fill) newpage.fills = [toRGB(item.fill,true)];
        if(item.index) {
            let num = item.index;
            num >= 0 ? num : 0;
            let max = figma.root.children.length - 1;
            num >= max ? max : num;
            figma.root.insertChild(num,newpage);
        }else{
            let num = figma.root.children.findIndex(item => item == figma.currentPage);
            figma.root.insertChild(num + 1,newpage);
            //figma.setCurrentPageAsync(newpage);
            finals.push(newpage)
        };
    });
    safaPage.remove();
    return finals;
};

/**
 * @param {Array} info - [w,h,x,y,name,[fills],[align,trbl,strokes]] 宽高、坐标、命名、填充、描边
 * @param {node} node - 需要设置的对象
 * @param {node?} cloneNode - 直接参考的对象
 */
function setMain(info,node,cloneNode){
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

    node.x = x;
    node.y = y;
    if(n) node.name = n;
    if(fills !== 'old') node.fills = fills;

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

//找到实际生效的图片填充
/**
 * @param {node} node - 需要查找的节点
 * @param {function} callback - 回调函数
 * @returns {object} - 图片填充对象
 */
function findImage(node,callback){
    let fills = JSON.parse(JSON.stringify(node.fills));
    //找到实际生效的图片填充
    let image;
    for(let i = fills.length - 1; i >= 0; i--){
        let fill = fills[i];
        if(fill.type == 'IMAGE' && fill.visible == true && fill.blendMode == "NORMAL"){
            image = fill;
            break;
        };
    };
    if(image){
        if(callback) callback(image,fills);
        return image;
    } else {
        return null;
    };
};
//添加图片
function addImg(node,info){
    node = node ? node : figma.currentPage;
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
    let b = getSelectionMix();
    let final = b.filter(item => item.type !== 'SECTION')
    for(let i = 0; i < final.length; i++){
        let safeMain = getSafeMain(final[i]);
        let box = addFrame([...safeMain,final[i].name,[]]);
        fullInFrameSafa(final[i],box);
        setTimeout(()=>{
            if(isClip){
                addCutArea(box,[{x: 0, y: 0, w: safeMain[0], h: safeMain[1], s: 2}]);
            }else{
                addCutArea(box,info[i]);
            }
            let isfinal = i == final.length - 1 ? true : false;
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
    //console.log([w,h,x,y])
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
function layoutByRatio(nodes,isMinToMax,isAutoZoom){
    let b = nodes;
    let x = Math.min(...b.map(item => item.x)),XX = Math.min(...b.map(item => item.x));
    let y = Math.min(...b.map(item => item.y)),YY = Math.min(...b.map(item => item.y));
    let infos = [];
    for ( let i = 0; i < b.length; i++){
        infos.push({x:b[i].x,y:b[i].y,w:b[i].width,h:b[i].height,i:i,});
    };
    //console.log(infos)
    let HH = infos.filter(item => item.w > item.h).sort((a, b) => b.w*b.h - a.w*a.h);//横板
    let maxW = Math.max(...HH.map(item => item.w)) | 0;
    let LL = infos.filter(item => item.w < item.h).sort((a, b) => b.w*b.h - a.w*a.h);//竖版
    let maxH = Math.max(...LL.map(item => item.h)) | 0;
    let FF = infos.filter(item => item.w == item.h).sort((a, b) => b.w*b.h - a.w*a.h);//方形
    //console.log(HH,maxW,LL,maxH,FF)
    if(isMinToMax){
        HH = HH.reverse();
        LL = LL.reverse();
        FF = FF.reverse();
    };
    let gap = 30;
    let lineMaxH = [],lineMaxW = [];
    let lineW = 0,lineH = 0;
    for(let e = 0; e < HH.length; e++){
        if ( e !== HH.length - 1){
            lineW += HH[e].w + HH[e + 1].w ;
        };
        lineMaxH.push([HH[e].h]);
        b[HH[e].i].x = x
        b[HH[e].i].y = y
        if ( lineW > maxW){
            lineW = 0;
            x = XX;
            y = y + Math.max(...lineMaxH) + gap;
            lineMaxH = [];
        } else {
            x = x + HH[e].w + gap; 
        };
    };
    x = XX + maxW + gap;
    y = YY;
    //console.log(x,y)
    for(let e = 0; e < LL.length; e++){
        if ( e !== LL.length - 1){
            lineH += LL[e].h + LL[e + 1].h ;
        };
        lineMaxW.push([LL[e].w]);
        b[LL[e].i].x = x
        b[LL[e].i].y = y
        
        if ( lineH > maxH){
            lineH = 0;
            y = YY;
            x = x + Math.max(...lineMaxW) + gap;
            lineMaxW = []
        } else {
            y = y + LL[e].h + gap; 
        };
    };
    x = XX + maxW + gap;
    y = YY + maxH + gap;
    //console.log(x,y)
    for(let e = 0; e < FF.length; e++){
        if ( e !== FF.length - 1){
            lineW += FF[e].w + FF[e + 1].w ;
        };
        lineMaxH.push([FF[e].h]);
        b[FF[e].i].x = x
        b[FF[e].i].y = y
        
        if ( lineW > maxW){
            lineW = 0;
            x = XX + maxW + gap;
            y = y + Math.max(...lineMaxH) + gap;
            lineMaxW = [];
        } else {
            x = x + FF[e].w + gap; 
        };
    };
    if(isAutoZoom){
        figma.viewport.scrollAndZoomIntoView(nodes);
        figma.viewport.zoom = figma.viewport.zoom * 0.6;
    }
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

//上传导出为图片所需的信息
function exportImgInfo(set){
    let a = figma.currentPage;
    let b = getSelectionMix();
    let load = figma.notify('Uploading ( ' + b.length + ' layer)',{
        timeout: 6000,
    });
    //console.log(b[0].exportSettings)
    setTimeout(async ()=>{
        for(let i = 0; i < b.length; i++){
            let c = b[i];
            let format = c.getPluginData('exportType');
            if(!format){
                format = 'PNG';
            };
            let size = c.getPluginData('exportSize');
            if(!size){
                size = null;
            };
            let zipName = '';//a.parent.name.replace(/\//g,'_');
            if(c.parent.type == 'SECTION'){
                zipName += c.parent.name + ' ';
            }else{
                zipName += a.name + ' ';
            };
            let info = [] ;
            let wh = getSafeMain(c);
            let [w,h] = [wh[0],wh[1]];
            if(set == 'exportset' && c.exportSettings.length > 0){
                let settings = c.exportSettings;
                for(let ii = 0; ii < settings.length; ii++){
                    let setting = settings[ii];
                    let exportsizeset = setting.constraint;
                    switch (exportsizeset.type){
                        case 'SCALE':
                            [w,h] = [w*exportsizeset.value,h*exportsizeset.value];
                        break
                        case 'WIDTH':
                            [w,h] = [exportsizeset.value,h*(exportsizeset.value/w)];
                        break
                        case 'HEIGHT':
                            [w,h] = [w*(exportsizeset.value/h),exportsizeset.value];
                        break
                    };
                    info.push(
                        {
                            zipName: zipName,
                            fileName:c.name + setting.suffix,
                            id:c.id,
                            format:setting.format,
                            u8a: await c.exportAsync(setting),
                            finalSize:size,
                            width: Math.round(w),
                            height: Math.round(h),
                            compressed:null,
                            realSize:size,
                            quality:10,
                        }
                    );
                };
                //console.log(info)
    
            }else{
                info.push(
                    {
                        zipName: zipName,
                        fileName:c.name,
                        id:c.id,
                        format:format,
                        u8a: await c.exportAsync({
                            format: 'PNG',
                            constraint: { type: 'SCALE', value: 1 },
                          }),
                        finalSize:size,
                        width: Math.round(w),
                        height: Math.round(h),
                        compressed:null,
                        realSize:size,
                        quality:10,
                    }
                );
                //console.log(info)
            };
            postmessage([info,'exportImgInfo']);
        };
        load.cancel();
    },200);
};

//创建表格
/**
 * @param {Object | null} thComp - 表头组件
 * @param {Object | null} tdComp - 数据组件
 * @param {string} language - 语言，可选值：'Zh'、'En'
 * @returns {Array} - [表头组件,数据组件,表格组件]
 */
async function createTable(thComp,tdComp,language,isFill = false){
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

    if(isFill){
        addAutoLayout(table,['H','TL'],[true,false]);
        column.layoutSizingHorizontal = 'FILL';
    }else{
        addAutoLayout(table,['H','TL']);
    };
    table.layoutSizingVertical = 'HUG';
    table.x += 200;
    return [th,td,table];
};
//创建表格组件
async function addTableCompMust(type,language,nodes,isFill = false){
    let comp = addFrame([176,52,null,null,'xxx@' + type,[]]);
    if(type == 'td' || type == 'tn'){
        comp.y += 72;
    };
    addAutoLayout(comp,['H','CC'],[1,1]);
    comp.resize(176,52);
    comp.itemReverseZIndex = true;//前面堆叠在上
    comp = figma.createComponentFromNode(comp);

    if(!nodes || typeof nodes == 'string'){
        let egtext = {th:['Bold','Header'],td:['Regular','Data']};
        if(language == 'Zh'){
            egtext = {th:['Bold','表头文案'],td:['Regular','数据文案']};
        };
        if(nodes && nodes == 'style'){
            egtext = {th:['Bold','Group'],td:['Regular','Style']};
        };
        if(nodes && nodes == 'variable'){
            egtext = {th:['Bold','Mode'],td:['Regular','Variable']};
        };
        let text = await addText([{family:'Inter',style:egtext[type][0]},egtext[type][1],16]);
        comp.appendChild(text);
        if(isFill){
            text.layoutSizingHorizontal = 'FILL';
            if(type == 'th') text.textAlignHorizontal = 'CENTER';
            //text.textAlignHorizontal = 'CENTER';
            comp.paddingLeft = 16;
            comp.paddingRight = 16;
        };
        makeCompliant(type,comp);
        //绑定数据的组件属性
        addCompPro(comp,text,'--data','TEXT',egtext[type][1]);
    }else{
        try{
            nodes.forEach(item =>{
                comp.appendChild(item);
            });
        } catch (e){
            console.log(e);
        };
        makeCompliant(type,comp);
    };
    
    return comp;
};
//表格初始化
function makeCompliant(type,comp){
    let adds = [
        [`#table.stroke`,[],[null,[1,0,0,0]],'--bod-t'],
        [`#table.stroke`,[],[null,[0,1,0,0]],'--bod-r'],
        [`#table.stroke`,[],[null,[0,0,1,0]],'--bod-b'],
        [`#table.stroke`,[],[null,[0,0,0,1]],'--bod-l'],
        [`#table.fill`,[toRGB('#666666',true)],null,'--fills'],
    ];
    for(let i = 0; i < adds.length; i++){
        //添加描边、填充并绑定组件属性
        addBodFill(comp,adds[i],type);
    };
};
//添加描边/区分色
function addBodFill(node,Array,type){
    let bodfill = figma.createRectangle();
    if((type == 'td' || type == 'tn') && Array[3].includes('fill')){
        bodfill.opacity = 0.66;
    }
    setMain([176,52,null,null,Array[0],Array[1],Array[2]],bodfill);
    let bodfills = addFrame([176,52,null,null,Array[3],[]]);
    bodfills.appendChild(bodfill);
    addAsAbsolute(node,bodfills);
    asFillChild(bodfills,true);
    asFillChild(bodfill,true);
    addCompPro(node,bodfills,Array[3],'BOOLEAN',true);
};

//创建本地表格
async function createLocalSheet(type,comps){
    let [th,td,tn] = await addLocalSheetMust(type,comps);
    let column1 = addFrame([176,52,null,null,'@column',[]]);
    addAutoLayout(column1,['V','TC']);
    column1.appendChild(th.createInstance());
    column1.appendChild(td.createInstance());
    column1.children.forEach(item => {
        item.layoutSizingHorizontal = 'FILL';
    });
    let column2;
    switch (type){
        case 'style':
            column2 = addFrame([176,52,null,null,'@column',[]]);
            addAutoLayout(column2,['V','TC']);
            column2.appendChild(th.createInstance());
            column2.appendChild(tn.createInstance());
            column2.children.forEach(item => {
                item.layoutSizingHorizontal = 'FILL';
            });
        break
        case 'variable':
            column2 = column1.clone();
        break
    };
    let table = addFrame([528,208,null,null,'xxx@table',[toRGB('2D2D2D',true)],[null,null,[toRGB('#666666',true)]]]);
    table.appendChild(column1);
    addAutoLayout(table,['H','TL'],[0,0]);
    table.appendChild(column2);
    table.x += 200;
    let all = [];
    if(comps){
        if(!comps[0]) all.push(th);
        if(!comps[1]) all.push(td);
        if(!comps[2] && tn) all.push(tn);
    }else{
        all = [th,td];
        if(tn) all.push(tn);
    };
    all.push(table);
    figma.currentPage.selection = all;
    //console.log(comps,all)
    return [th,td,tn,table]; 
};
//创建本地表格组件
async function addLocalSheetMust(type,comps = [null,null,null]){
    let th,td
    if(!comps[0]){
        th = await addTableCompMust('th','En',type);
        th.name += ':' + type;
    }else{
        th = comps[0];
    };
    if(!comps[1]){
        td = await addTableCompMust('td','En',type);
        td.name += ':' + type;
    }else{
        td = comps[1];
    };
    
    if(type == 'variable') return [th,td,null];
    if(comps[2]) return [th,td,comps[2]];

    let box1 = figma.createRectangle();
    box1.resize(30,30);
    box1.name = '#sheet.fillStyle';
    box1.fills = [toRGB('#ffffff',true)];
    let box2 = figma.createRectangle();
    box2.resize(30,30);
    box2.name = '#sheet.strokeStyle';
    box2.fills = [];
    box2.strokes = [toRGB('#ffffff',true)];
    box2.strokeWeight = 7;
    box2.strokeAlign = "INSIDE";
    let tn = await addTableCompMust('tn','En',[box1,box2]);
    tn.name += ':' + type;
    tn.itemSpacing = 8;
    tn.y += 72;
    return [th,td,tn];
};
//更新本地表格数据
async function reLocalSheet(type, isNew) {
    if (isNew) postmessage([true, type + 'SheetInfo']);
    
    const variablePages = figma.root.findChildren(item => item.name.includes('@localsheet'));
    const datas = type === 'style' ? localStyleToArray() : localVariableToArray();

    for (let [index, data] of datas.entries()) {
        let finaltable, finalpage;
        if (isNew) {
            finalpage = variablePages.length === 0 
                ? (() => { 
                    const page = addPageMix()[0];
                    page.name = 'xxx@localsheet';
                    return page;
                })()
                : variablePages[0];
        } else {
            for (const page of variablePages) {
                const table = page.findOne(item => item.name === data[0][0] + '@table:' + type);
                if (table) {
                    finaltable = table;
                    finalpage = page;
                    break;
                };
            };
            if (!finalpage) finalpage = variablePages[0];
        };
        
        await figma.setCurrentPageAsync(finalpage);
        
        if (!finaltable) {
            const oldth = finalpage.findOne(item => item.name.includes('@th:' + type));
            const oldtd = finalpage.findOne(item => item.name.includes('@td:' + type));
            const oldtn = finalpage.findOne(item => item.name.includes('@tn:' + type));
            const [th, td, tn, newtable] = await createLocalSheet(type, [oldth, oldtd, oldtn]);
            newtable.name = data[0][0] + '@table:' + type;
            reSheetByArray(newtable, data);
            finaltable = newtable;
        } else {
            reSheetByArray(finaltable, data);
        };
        
        if (isNew && index > 0) {
            const table2 = finaltable.clone();
            table2.x += finaltable.width + 60;
            table2.name = data[0][0] + '@table:' + type;
            reSheetByArray(table2, data);
        };
    };
};
function reSheetByArray(table,datas){
    //console.log(datas)
    let HH = table.children.length;
    let VV = table.children[0].children.length;
    //console.log(datas.length - HH,datas[0].length - VV)
    reCompNum(table,datas.length - HH,datas[0].length - VV);
    datas.forEach((data,num) => {
        try{
            table.children[num].children.forEach((comp,index) => {
                if(comp.type == 'INSTANCE'){
                    let value = data[index];
                    //console.log(value)
                    if(typeof value == 'string' || table.name.includes('variable')){
                        let key = Object.keys(comp.componentProperties).filter(item => item.split('#')[0] == '--data')[0];
                        if(!key) return;
                        comp.setProperties({[key]:value});
                    }else{
                        let boxFill = comp.findChild(item => item.name == '#sheet.fillStyle');
                        let boxBod = comp.findChild(item => item.name == '#sheet.strokeStyle');
                        try{
                            boxFill.fillStyleId = value.id;
                            boxBod.strokeStyleId = value.id;
                        }catch(e){
                            boxFill.setFillStyleIdAsync(value.id);
                            boxBod.setStrokeStyleIdAsync(value.id);
                        };
                    };
                };
            });
        } catch (e) {
            console.log(e)
        };
    });
};

getStyle('paint',true);
async function getStyle(type,isSend){
    let info = {list:[],nodes:[]}
    switch (type){
        case "paint":
            figma.getLocalPaintStylesAsync()
            .then((styles)=>{
                //有哪些样式
                //console.log(styles)
                info.list = styles.map(item =>{
                    return {
                        id: item.id,
                        name: item.name,
                        paints: item.paints,
                    }
                });
                if(isSend){
                    let hasStyle = info.list.some(item => item.name.includes('@set:')) ? true : false;
                    postmessage([hasStyle,'styleInfo']);
                };
                let promises = styles.map(item => item.getStyleConsumersAsync());
                Promise.all(promises)
                .then((consumers)=>{
                    //应用在什么节点
                    //console.log(consumers)
                    info.nodes = consumers.flat();
                    localStyles.paint = info;
                })
                .catch(error => {
                    console.error(error);
                });
            });
        break
        case "text":

        break
        case "effect":

        break
        case "grid":

        break
    }
}
getStyleSheet();
async function getStyleSheet(){
    let pages = figma.root.findChildren(item => item.name.includes('@localsheet'));
    for(let page of pages){
        await page.loadAsync();
        let sheet = page.findOne(item => item.name.includes('@table:style'));
        if(sheet) {
            postmessage([true,'styleSheetInfo']);
            getSheetData(sheet)
            return;
        };
    };
    postmessage([false,'styleSheetInfo']);
};
getVariableSheet();
async function getVariableSheet(){
    let pages = figma.root.findChildren(item => item.name.includes('@localsheet'));
    for(let page of pages){
        await page.loadAsync();
        let sheet = page.findOne(item => item.name.includes('@table:variable'));
        if(sheet) {
            postmessage([true,'variableSheetInfo']);
            return;
        };
    };
    postmessage([false,'variableSheetInfo']);
};
getVariable();
async function getVariable(){
    let collections = await figma.variables.getLocalVariableCollectionsAsync()
    //console.log(collections);
    localVariable = collections.map(item =>{
        let name = item.name;
        if(item.modes[0].name !== 'Mode 1'){
            //默认名忽略
            name += '/' + item.modes[0].name;
        };
        return {
            name:name,
            id:item.id,
            variableIds:item.variableIds,
        }
    });
    let hasvar = localVariable.some(item => item.name.includes('@set:')) ? true : false;
    postmessage([hasvar,'variableInfo']);
    //console.log(localVariable);
    localVariable.forEach(async item => {
        let promises = item.variableIds.map(id => figma.variables.getVariableByIdAsync(id))
        await Promise.all(promises)
        .then((result)=>{
            let variables = result.map(vars =>{
                let value = Object.entries(vars.valuesByMode)[0][1];
                if(typeof value == "object"){
                    //value = `rgba(${value.r*255},${value.g*255},${value.b*255},${Math.floor(value.a * 100)/100 || 1})`
                    let color = "#" + ((1 << 24) + (value.r*255 << 16) + (value.g*255 << 8) + value.b*255).toString(16).slice(1);
                    if(value.a && value.a !== 1)color += ` ${Math.floor(value.a * 100)}%`;
                    value = color;
                };

                return {
                    name: vars.name,
                    type: vars.resolvedType,
                    id:vars.id,
                    value: value.toString(),
                }
            });
            item['variables'] = variables
            //console.log(variables)
        })
        .catch(error => {
            console.error(error);
        });
    });
};

function getSheetData(table){
    if(table.children.length < 2) return null;
    let data = [];
    let colors = [];
    table.children.forEach((column,num)=> {
        let row = column.children;
        let columnData = [];
        let themeName;
        row.forEach((node,index) => {
            let comps = Object.entries(node.componentProperties);
            if(num == 0 || index == 0 || table.name.includes('variable')){
                themeName = comps.filter(item => item[0].includes('--data'))[0][1].value;
                columnData.push(themeName);
            }else{
                let fills = node.findOne(item => item.name.includes('#sheet.fillStyle')).fills;
                columnData.push(fills);
                colors.push({
                    name: `${data[0][0]}@set:${themeName}/${data[0][index]}` ,
                    paints: fills,
                });
            };
        });
        data.push(columnData);
    });
    //console.log(data,colors)
};

//样式数据转列数据
function localStyleToArray(){
    let list = localStyles.paint.list.filter(item => item.name.includes('@set:'));
    let styleObj = {};
    list.forEach(item => {
        let { id, name, paints } = item;
        let keys = name.split('/').filter(str => str.includes('@set:'))[0];
        let [setname, themename] = keys.split('@set:');
        let colorname = name.split(keys + '/')[1];
        
        if (!styleObj[setname]) styleObj[setname] = {};
        if(!styleObj[setname][themename]) styleObj[setname][themename] = [];
        styleObj[setname][themename].push({ id, name: colorname, paints });
    });
    let styleSheets = Object.entries(styleObj).map(([key, themes]) => {
        let themeEntries = Object.entries(themes);
        let column1 = [key, ...themeEntries[0][1].map(item => item.name)];
        let column2 = themeEntries.map(item => item.flat());
        return [column1, ...column2];
    });
    //console.log(styleSheets)
    return styleSheets;
};
//变量数据转列数据
function localVariableToArray(){
    let list = localVariable.filter(item => item.name.includes('@set:'))
    let varObj = {};
    list.forEach(item => {
        let {name,variables } = item;
        let [setname, modename] = name.split('@set:');
        
        if (!varObj[setname]) varObj[setname] = {};
        if(!varObj[setname][modename]) varObj[setname][modename] = [];
        varObj[setname][modename].push(...variables);
    });
    //console.log(varObj)
    let varSheets = Object.entries(varObj).map(([key, modes]) => {
        let modeEntries = Object.entries(modes);
        let column1 = [key, ...modeEntries[0][1].map(item => item.name)];
        let column2 = modeEntries.map(item => item.flat());
        column2.forEach((column,index) => {
            column2[index] = column.map(item => {
                if(typeof item == 'object'){
                    return item.value || '';
                }
                return item.split('/')[1];
            });
        });
        return [column1, ...column2];
    });
    //console.log(varSheets)
    return varSheets;
};

//绑定图层和组件属性
/**
 * @param {node} node - 组件节点
 * @param {node} layer - 要绑定属性的图层
 * @param {string} name - 属性名
 * @param {string} type - 属性类型 'BOOLEAN''TEXT''VARIANT'
 * @param {string} value - 属性值
 * @returns {string} - 属性ID
 */
function addCompPro(node,layer,name,type,value){
    let typekey = {
        BOOLEAN: 'visible',
        TEXT: 'characters',
        VARIANT: 'mainComponent'
    }
    let proid = node.addComponentProperty(name,type,value);
    layer.componentPropertyReferences = {[typekey[type]]:proid};
    return proid;
};
//修改表格样式
function reTableStyle(table,style,comps){
    if(comps){
        comps[0].forEach(item => {
            //console.log(comps[1])
            findSetPro(item,comps[1]);
        });
        return;
    };
    let columns = table.findChildren(item => item.name.includes('@column'));
    for(let i = 0; i < columns.length; i++){
        let headers = columns[i].findChildren(item => item.name.includes('@th'));
        let datas  = columns[i].findChildren(item => item.name.includes('@td') || item.name.includes('@tn'));
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
        //console.log(proKeys,Array)
        proKeys.forEach(key => {
            //console.log(key.split('#')[0])
            /**/
            switch (key.split('#')[0]){
                case '--bod-t': comp.setProperties({[key]:(Array[0] !== undefined && Array[0] == 0) ? false : true});break
                case '--bod-r': comp.setProperties({[key]:(Array[1] !== undefined && Array[1] == 0) ? false : true});break
                case '--bod-b': comp.setProperties({[key]:(Array[2] !== undefined && Array[2] == 0) ? false : true});break
                case '--bod-l': comp.setProperties({[key]:(Array[3] !== undefined && Array[3] == 0) ? false : true});break
                case '--fills':
                    //是否为间格区分色
                    if(Array[4] && Array[4] == 'rowSpace' && row){
                        //console.log('rowSpace')
                        if(row%2 == 0){
                            comp.setProperties({[key]: true});
                        } else {
                            comp.setProperties({[key]: false});
                        };
                    } else if(Array[4] && Array[4] == 'columnSpace' && column){
                        if(column%2 == 0){
                            comp.setProperties({[key]: false});
                        } else {
                            comp.setProperties({[key]: true});
                        };
                    } else {
                        comp.setProperties({[key]:(Array[4] !== undefined && Array[4] == 0) ? false : true});
                    }
                ;break
            }
            /**/
        });
    };
};
//修改表格主题色
/**
 * @param {Object} table - 表格
 * @param {[string,string]} hsl - 主题色
 * @param {string} textcolor - 文本颜色
 */
function reTableTheme(table,hsl,textcolor){
    table.fills = [toRGB(hsl[0],true)];
    table.strokes = [toRGB(hsl[2],true)];
    let columns = table.findAll(item => item.name.includes('@column'));
    columns.forEach(column => {
        column.children.forEach(node => {
            reAnyByTags([node],[{'#table.fill':hsl[1],'#table.stroke':hsl[2],}])
            let texts = node.children.filter(item => item.type == 'TEXT')
            texts.forEach(text => {
                text.fills = [toRGB(textcolor,true)];
            })
        });
    });
};
//调整实例数量以匹配数据长度
function reCompNum(nodes,H,V){
    //console.log(nodes.name,H,V)
    if(H > 0){
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
                    let reg = enters.replace(/[-[${}()*+?.,\\^$|#\s]/g, '\\$&');
                    comp.setProperties({[item]: Array[i].toString().replace(new RegExp(reg,'g'),'\n')});
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
    let errornode = []
    for(let i = 0; i < comps.length; i++){
        let comp = comps[i];
        let rePros = Object.keys(comp.componentProperties).filter(pro => keyPros.includes(pro.split('#')[0]));
        setPro(comp,rePros,obj[i])

        //内嵌组件时，也要替换
        let compChilds = comp.findAll(items => items.type == 'INSTANCE');// && items.componentProperties.length > 0
        //console.log(compChilds)
        for(let ii = 0; ii < compChilds.length; ii++){
            let compChild = compChilds[ii];
            //console.log(compChild)
            let childRePros = Object.keys(compChild.componentProperties).filter(pro => keyPros.includes(pro.split('#')[0]));
            //console.log(childRePros)
            setPro(compChild,childRePros,obj[i]);
        };
    };

    //选中错误处
    //console.log(errornode)
    if(errornode.length > 0){
        let errordata = errornode.map(item => item[1]).join(',')
        figma.clientStorage.getAsync('userLanguage')
        .then (async (language) => {
            let text = language == 'Zh' ? '无效数据: ' + errordata : 'Erroneous data:' +  errordata;
            figma.notify(text,{
                error:true,
                timeout: 6000,
            });
        });
        figma.currentPage.selection = errornode.map(item => item[0]);
    };

    function setPro(node,pros,data){
        pros.forEach(pro => {
            //console.log(pro,data[pro.split('#')[0]]);
            if(data){
                //console.log(pro,obj)
                let value = data[pro.split('#')[0]];
                //console.log(pro,value)
                if(node.componentProperties[pro].type !== 'BOOLEAN'){
                    if(typeof value == 'number' && node.componentProperties[pro].type == "VARIANT"){
                        node.getMainComponentAsync()
                        .then(compset => {
                            //console.log(compset.parent.componentPropertyDefinitions[pro].variantOptions);
                            let findByNum = compset.parent.componentPropertyDefinitions[pro].variantOptions[value - 1];
                            //console.log(findByNum)
                            value = findByNum ? findByNum : value;
                            value = value.toString();
                            if(value == ''){
                                value = nulls;
                            } else {
                                if(enters){
                                    let reg = enters.replace(/[-[${}()*+?.,\\^$|#\s]/g, '\\$&')
                                    value = value.replace(new RegExp(reg,'g'),'\n');
                                };
                            };
                            try {
                                node.setProperties({[pro]: value});
                            } catch (error) {
                                console.log(error);
                                errornode.push([node,value]);
                            };
                        });
                    }else{
                        value = value.toString();
                        if(value == ''){
                            value = nulls;
                        } else {
                            if(enters){
                                let reg = enters.replace(/[-[${}()*+?.,\\^$|#\s]/g, '\\$&')
                                value = value.replace(new RegExp(reg,'g'),'\n');
                            };
                        };
                        try {
                            node.setProperties({[pro]: value});
                        } catch (error) {
                            console.log(error);
                            errornode.push([node,value]);
                        };
                    };
                }else{
                    if(typeof value == 'string'){
                        value = value.toLocaleLowerCase();
                    };
                    value = TRUES.includes(value) ? true : FALSES.includes(value) ? false : true; 
                    try {
                        node.setProperties({[pro]: value});
                    } catch (error) {
                        console.log(error);
                        errornode.push([node,value]);
                    };
                };
                
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
                //console.log(tag,obj[i][tag])
                if(obj[i][tag]){
                    
                    try {
                        setByTags(layer,tag.split('.')[1],obj[i][tag]);
                    } catch (error) {
                        console.log(error);
                        figma.clientStorage.getAsync('userLanguage')
                        .then (async (language) => {
                            let text = language == 'Zh' ? '含无效数据' : 'Erroneous data'
                            figma.notify(text,{
                                error:true,
                                timeout: 4000,
                            });
                        });
                    }
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
                if(typeof value == 'string'){
                    value = value.toLocaleLowerCase();
                };
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
    let datas = [];
    for(let i = 0; i < comps.length; i++){
        let comp = comps[i];
        let pros = {};
        Object.entries(comp.componentProperties).sort().forEach(item => {
            pros[item[0].split('#')[0]] = item[1].value
        });
        datas.push(pros)
    };
    return datas
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
        datas.push(columns[i].findChildren(item => item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn')));    
    };
    let H = datas[0].length - columns.length;
    //console.log(H)
    let newTable = table.clone();
    setMain([],newTable,table);
    if(newTable.name.includes(':swap')){
        newTable.name = newTable.name.replace(':swap','');
    } else {
        newTable.name += ':swap';
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
            //console.log(Hs,LL)
            for ( let i = 0; i < LL ; i++ ){
                for ( let ii = 0; ii < Hs.length; ii++){
                    picks.push(table.children[i].children[Hs[ii]]);
                };
            };
            //console.log(picks)
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
 * @param {[HV,TBLR,gap,padding:[H,V] | [T,R,B,L]]} layout  - 横竖、定位，间距，边距
 * @param {[boolean,boolean]} isFixed - 是否固定尺寸
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
                case 'B':
                    node.counterAxisAlignItems = 'BASELINE';
                ;break
            };
        ;break
        case 'V':
            node.layoutMode = 'VERTICAL';
            switch (layout[1][0]){
                case 'T':
                    node.primaryAxisAlignItems = 'MIN';
                ;break
                case 'C':
                    node.primaryAxisAlignItems = 'CENTER';
                ;break
                case 'B':
                    node.primaryAxisAlignItems = 'MAX';
                ;break
            };
            switch (layout[1][1]){
                case 'L':
                    node.counterAxisAlignItems = 'MIN';
                ;break
                case 'C':
                    node.counterAxisAlignItems = 'CENTER';
                ;break
                case 'R':
                    node.counterAxisAlignItems = 'MAX';
                ;break
            };
        ;break
    };
    
    
    node.itemSpacing = layout[2] ? layout[2]  : 0;
    if(layout[3] && layout[3].length > 0){
        if(layout[3].length == 2){
            node.horizontalPadding = layout[3][0];
            node.verticalPadding = layout[3][1];
        } else if(layout[3].length == 4) {
            node.paddingTop = layout[3][0];
            node.paddingRight = layout[3][1];
            node.paddingBottom = layout[3][2];
            node.paddingLeft = layout[3][3];
        } else {
            node.horizontalPadding = 0;
            node.verticalPadding = 0;
        };
    } else {
        node.horizontalPadding = 0;
        node.verticalPadding = 0;
    };
};

//添加绝对定位元素并放置合适位置
/**
 * @param {node} parent - 自动布局对象
 * @param {node} absoluteNode - 绝对定位对象
 * @param {Array | string} position - [x,y] | TBLR , 如果不撑满，则指定坐标或相对位置（会同时修改约束
 */
function addAsAbsolute(parent,absoluteNode,position){
    let a = parent,b = absoluteNode;
    if(a){
        a.appendChild(b);
    }else{
        a = b.parent;
    };
    if(a.layoutMode !== 'NONE'){
        b.layoutPositioning = "ABSOLUTE";
    }else{
        b.layoutPositioning = "AUTO";
    };
    b.x = 0;
    b.y = 0;
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
    };
};
//添加到画板并设置约束
/**
 * @param {node} parent - 画板类对象
 * @param {node} constraintNode - 可添加约束的对象
 * @param {string} TBLR - TBLR,各轴约束简写
 * @param {boolean} isFill - 是则撑满，否则居中
 */
function addConstraints(parent,constraintNode,TBLR){
    if(parent){
        parent.appendChild(constraintNode);
    };
    let H = 'MIN';
    let V = 'MIN';
    if(TBLR && typeof(TBLR) == 'string'){
        switch (TBLR[0]){
            case 'T':
                V = 'MIN';
            ;break
            case 'C':
                V = 'CENTER';
            ;break
            case 'B':
                V = 'MAX';
            ;break
        };
        switch (TBLR[1]){
            case 'L':
                H = 'MIN';
            ;break
            case 'C':
                H = 'CENTER';
            ;break
            case 'R':
                H = 'MAX';
            ;break
        };
    }
    constraintNode.constraints = {
        horizontal: H,
        vertical: V,
    };
};
//重置相对坐标并把约束设为撑满
function asFillChild(node,isResize){
    node.x = 0;
    node.y = 0;
    if(isResize){
        node.resize(node.parent.width,node.parent.height);
    };
    node.constraints = {
        horizontal: "STRETCH",
        vertical: "STRETCH"
    };
};
//自动按位置、大小设置约束
function autoConstraints(parent,child){
    let [w1,h1,x1,y1] = getSafeMain(parent);
    let axisX,axisY;
    let [w2,h2,x2,y2] = getSafeMain(child);
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
    child.constraints = {
        horizontal:axisX,
        vertical:axisY,
    };
};
//添加文字内容
/**
 * @param {Array} info - [{family:xxx,style:xxx},text,size,fills?]字体、文案、字号、颜色
 */
async function addText(info){
    let text = figma.createText();
    let fontName = info[0];
    try {
        await figma.loadFontAsync(fontName);
    } catch (error) {
        fontName = {family:'Inter',style:'Regular'};
        await figma.loadFontAsync(fontName);
    }
    text.fontName = fontName;
    //console.log(info);
    text.characters = info[1];
    text.fontSize = info[2];
    let fills = info[3] ? info[3] : [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    text.fills = fills;
    return text;
};
//颜色转fill对象
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
    //console.log(lines,splitTag,splitKeys)
    let splitnodes = [node];
    //如勾选了按分段拆分,或按关键词拆分（默认分行,不然内容会乱）
    if((splitKeys.includes('Wrap')||!splitTag) && lineslength.length > 1){
        splitnodes = [];
        let group = addFrame([],oldnode);
        oldnode.parent.insertChild((layerIndex + 1),group);
        group.x = oldnode.x;
        group.y = oldnode.y;
        group.name = '@split-p';
        addAutoLayout(group,['V','TL',0,[0,0]],[true,false]);
        for(let i = 0; i < lines.length; i++){
            let splitnode = node.clone();
            removeText(splitnode,lines[i][0],lines[i][1],true);
            group.appendChild(splitnode);
            splitnodes.push(splitnode);
            //if(splitnode.getStyledTextSegments(['listOptions'])[0].listOptions.type == 'ORDERED'){
                //splitnode.insertCharacters(0,(i + 1) + '. ');
            //}
        };
        figma.currentPage.selection = [group];
    };
    
    if(splitTag){   
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
                let group2 = addFrame([],splitnodes[i]);
                if(!splitKeys.includes('Wrap') || splitnodes.length == 1){
                    oldnode.parent.insertChild((layerIndex + 1),group2);
                    group2.x = oldnode.x;
                    group2.y = oldnode.y;
                }else{
                    let layerIndex2 = splitnodes[i].parent.children.findIndex(items => items.id == splitnodes[i].id);
                    splitnodes[i].parent.insertChild((layerIndex2 + 1),group2);
                };
                group2.name = '@split-l';
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
                splitnodes[i].remove();
                
                //figma.currentPage.selection = [group2];
            };
        };
    }else{
        //console.log(splitKeys);
        for(let i = 0; i < splitnodes.length; i++){
            let group2 = addFrame([],splitnodes[i]);
            if(splitnodes.length == 1){
                oldnode.parent.insertChild((layerIndex + 1),group2);
            }else{
                let layerIndex2 = splitnodes[i].parent.children.findIndex(items => items.id == splitnodes[i].id);
                splitnodes[i].parent.insertChild((layerIndex2 + 1),group2);
            }
            group2.name = '@split-l';
            addAutoLayout(group2,['H','BB',0,[0,0]],[false,true]);
            let lines2length = splitnodes[i].characters.split(splitKeys[0]).map(item => item.length);
            let lines2 = []
            let start2 = 0;
            for (let ii = 0; ii < lines2length.length; ii++) {
                let length = lines2length[ii];
                let end2;
                let keyMove = 0;
                switch(splitKeys[1]){
                    case 'Suf':
                        end2 = start2 + length + 1;
                        if(ii == lines2length.length - 1){
                            end2 = start2 + length;
                        };
                    break
                    case 'Pre':
                        end2 = start2 + length + 1;
                        if(ii == 0){
                            end2 = start2 + length;
                        };
                    break
                    case 'Null':
                        end2 = start2 + length;
                        keyMove = 1;
                    break
                }
                lines2.push([start2, end2]);
                start2 = end2 + keyMove;
            };

            //console.log(lines2length,lines2)
            try {
                for(let ii = 0; ii < lines2.length; ii++){
                    let splitnode2 = splitnodes[i].clone();
                    removeText(splitnode2,lines2[ii][0],lines2[ii][1],true,true);
                    group2.appendChild(splitnode2);
                    if(splitnode2.characters == ''){
                        splitnode2.remove();
                    };
                };
            } catch(error) {
                console.log(error)
            }
            splitnodes[i].remove();
        };
    };
    if(!safenode.removed){
        safenode.remove();
    };
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
/**
 * @param {Array} nodes - 节点数组
 */
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
 * @param {Object} node - 当前节点
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
/**
 * @param {Object} node - 当前节点
 * @param {Boolean} isNoSort - 是否不排序
 * @returns {Array | null} - [R,C] R:[[top,h]] C:[[left,w]]，没有网格数据则返回null
 */
function getClipGrids(node,isNoSort){
    if(node.layoutGrids){
        let safeGrids = node.layoutGrids.filter(item => item.alignment == 'MIN' && item.count == 1)
        let grids = safeGrids.map(item => [item.pattern,item.offset,item.sectionSize])
        let R = grids.filter(item => item[0] == 'ROWS');
        let C = grids.filter(item => item[0] == 'COLUMNS');
        if(isNoSort){
            return [R,C]
        };
        R = R.map(item => [item[1],item[2]]).sort((a,b) => a[0] - b[0]);
        C = C.map(item => [item[1],item[2]]).sort((a,b) => a[0] - b[0]);
        //R = R.filter(item => item.every(items => items !== undefined));
        //C = C.filter(item => item.every(items => items !== undefined));
        return [R,C];
    }else{
        return null;
    };
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
/**
 * 从网格数据创建拉伸区域
 * @param {Array} clips - 网格数据
 * @param {Object} clipsbox - 拉伸区域容器
 * @param {Object} image - 图片数据
 * @param {Object} comp - 组件数据
 */
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
/**
 * 模拟缩放中心
 * @param {Object} node - 当前节点
 * @param {Number} num - 缩放比例
 * @param {Array} center - 缩放中心
 */
function rescaleMix(node,num,center){
    let oldW = node.width,oldH = node.height;
    node.rescale(num);
    switch (center[0]){
        case 'T':

        ;break
        case 'C':
            node.y -= (oldH * (num - 1))/2
        ;break
        case 'B':
            node.y -= oldH * (num - 1)
        ;break
    };
    switch (center[1]){
        case 'L':

        ;break
        case 'C':
            node.x -= (oldW * (num - 1))/2
        ;break
        case 'R':
            node.x -= oldW * (num - 1)
        ;break
    };
};
//向上递归检查父级
/**
 * @param {Object} node - 当前节点
 * @param {String | null} keytype - 指定截至的父级类型，为空则返回所有父级或图层顺序
 * @param {Boolean} isLayer - 是否返回图层顺序
 * @returns {Array | Boolean} 父级节点或图层顺序，是否在指定父级类型内
 */
function getParentAll(node,keytype,isLayer){
    let parents = [];
    let layers = [];
    let key = keytype ? keytype : 'PAGE';
    getParentOne(node);
    function getParentOne(node){
        if(node.parent && node.parent.type !== key && node.parent !== figma.currentPage){
            parents.push(node.parent);
            layers.push(node.parent.children.indexOf(node).toString().padStart(3,'0'));
            return getParentOne(node.parent);
        } else {
            //console.log(parents)
            if(keytype){
                if(node.parent.type == key){
                    parents = true
                } else {
                    parents = false;
                }
            };
            layers.push(node.parent.children.indexOf(node).toString().padStart(3,'0'));
            if(isLayer) return layers;
            return parents;
        };
    };
    //console.log(layers.reverse().join('/'))
    if(isLayer) return layers.reverse().join('/');
    return parents;
};
//按图层顺序整理selection
/**
 * @returns {Array} 整理后的selection
 */
function getSelectionMix(){
    let page = figma.currentPage;
    let selects = page.selection;
    selects = selects.map(item => [item,getParentAll(item,null,true)]);
    selects.sort((a,b) => a[1].localeCompare(b[1]));
    //console.log(selects.map(item=> item[0].name))
    return selects.map(item=> item[0]);
};