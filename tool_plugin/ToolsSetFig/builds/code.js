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

//直接主线程发起初始化插件界面偏好
figma.clientStorage.getAsync('userTheme')
.then (data => {
    postmessage([data,'userTheme']);
})
.catch (error => {
    postmessage(['dark','userTheme']);
});

figma.clientStorage.getAsync('userLanguage')
.then (data => {
    postmessage([data,'userLanguage']);
})
.catch (error => {
    postmessage(['En','userLanguage']);
});

figma.clientStorage.getAsync('userResize')
.then (data => {
    figma.ui.resize(data[0], data[1]);
})
.catch (error => {
    figma.ui.resize(UI[0], UI[1]);
    postmessage([[UI[0], UI[1]],'userResize']);
});

let userInfo = figma.currentUser;
if(userInfo){
    //console.log(userInfo)
    postmessage([userInfo,'userInfo']);
} else {
    postmessage([null,'userInfo']);
}


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

//==========核心功能==========

figma.ui.onmessage = async (message) => { 
    const info = message[0]
    const type = message[1]
    //console.log(message)
    //获取用户偏好
    if ( type == "getlocal"){
        figma.clientStorage.getAsync(info)
        .then (data => {
            postmessage([data,info]);
            //console.log('getlocal:',data,info);
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
            //使用深层拷贝函数获取可序列化的JSON数据
            //let nodeData = nodeToJSON(b);
            //console.log(nodeData)//JSON.stringify(nodeData, null, 2));
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
            let box = addFrame([100,100,null,null,zy.zyName,[]]);
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
                case 'json':
                    if(zy.jsonData){
                        try {
                            let rootNode = await jsonDataToNode(zy.jsonData);
                            if(rootNode){
                                box.appendChild(rootNode);
                                // 调整 box 尺寸以适应内容
                                addAutoLayout(box,['V','TL',0,[0,0,0,0]],[false,false,false,false]);
                                box.layoutSizingHorizontal = 'HUG';
                                box.layoutSizingVertical = 'HUG';
                            }
                        } catch(error) {
                            console.error('JSON to Node error:', error);
                        }
                    }
                break
            };
            if(zy.nodes){
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
            if(zy.jsonData){
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
                        if(JSON.stringify(sameLastName.paints) !== JSON.stringify(item.paint)){
                            item.isreset = true;
                        };
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
        let lang = await figma.clientStorage.getAsync('userLanguage')
        let all = await createTable(th,td,lang,null,info[3]);
        let newth = all[0];
        let newtd = all[1];
        let table = all[2];
        //模拟输入的数据，注意是按列记录而不是按行
        let test = [
            ["A1","a2","a3","a4"],
            ["B1","b2","b3","b4"],
            ["C1","c2","c3","c4"]
        ];
        let H = 2, V = 2;
        if(info[4]){
            test = info[4];
            H = test.length - 1;
            V = test[0].length - 2;
        };
        
        reCompNum(table,H,V);
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
    };
    //使所选元素符合表格组件
    if ( type == 'Make Cell-Comp'){
        let b = getSelectionMix();  

        b.forEach(node => {
            let comp,type = '',isComp = false,isAutoLayout = false;
            let oldPropsKeys = [];
            let oldPropsText = [];
            let oldPropsBoolean = [];
            let absoluteChild = [];
            let keyWord = ['--bod','描边','--fill','区分']

            //先转为组件，这样即使是单文字也会套上容器，方便处理
            if(node.type == 'COMPONENT'){
                comp = node;
                isComp = true;
            }else if(node.type == 'INSTANCE'){
                comp = figma.createComponentFromNode(node.detachInstance());
            }else {
                comp = figma.createComponentFromNode(node);
                type = comp.name.split('@')[1].split(' ')[0].split(':')[0];
            }
            let [w,h] = [comp.width,comp.height]

            //没命名则默认为数据表格,没文字则为节点表格
            if(!['th','td','tn'].includes(type)){
                if(comp.findOne(item => item.type == 'TEXT')){
                    if(isComp && comp.name.includes('表头')){
                        type = 'th';
                        comp.name += ' @th';
                    }else{
                        type = 'td';
                        comp.name += ' @td';
                    }
                }else{
                    type = 'tn';
                    comp.name += ' @tn';
                }
            };

            //确保是自动布局
            if(comp.layoutMode == 'NONE'){
                addAutoLayout(comp,['H','CC',0,[0,0]],true);
                comp.resize(w,h);
                comp.itemReverseZIndex = true;//前面堆叠在上
            }else{
                isAutoLayout = true;
            }
            

            //旧版母组件需要特殊处理，只能修改属性名和修正必要元素
            if(isComp){
                //记录原有的组件属性
                oldPropsKeys = Object.keys(comp.componentPropertyDefinitions);
                oldPropsText = comp.componentPropertyDefinitions.filter(item => item.type == 'TEXT');
                oldPropsBoolean = comp.componentPropertyDefinitions.filter(item => item.type == 'BOOLEAN');
                absoluteChild = comp.children.find(item => item.layoutPositioning && item.layoutPositioning == 'ABSOLUTE');
            }else{
                //非母组件不需要考虑对实例造成影响，可以删除无效的必要元素（实例解除但必要元素还在）
                comp.children.forEach(item => {
                    if( keyWord.some(key => item.includes(key))){
                        item.remove();
                    };
                });
                if(isAutoLayout){
                    comp.children.filter(item => item.layoutPositioning == 'ABSOLUTE').forEach(item => {
                        //如果只有一个矩形且有描边且无填充，也判定为必要元素
                        if( item.children && item.children.length == 1 && item.children[0].type == 'RECTANGLE' && item.children[0].strokes.length > 0 && item.children[0].fills.length == 0){
                            item.remove();
                        };
                    });
                    makeCompliant(type,comp);
                }else{//原元素不是自动布局，无需要特殊处理，可以直接添加必要元素和属性
                    
                    makeCompliant(type,comp);
            
                    let texts = comp.findAll(item => item.type == 'TEXT');
                    if(texts.length > 0){
                        let proid = addCompPro(comp,texts[0],'--data','TEXT',texts[0].characters);
                        for(let i = 1; i < texts.length; i++){
                            texts[i].componentPropertyReferences = {[characters]:proid};
                        };
                    };
                }
            }
        });
    };
    //便捷选中表格
    if ( type == 'pickTable'){
        let b = getSelectionMix();
        if(b.every(item => item.type == 'INSTANCE') && [...new Set(b.map(item => item.parent.parent))].length == 1){
            easePickTable(info,b);
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
        //console.log(setdata,retype)
        if(!tables || tables.length == 0) return;
        try{
            tables.forEach(table => {
                if(retype == 'theme') {
                        //一个饱和度、明度适中的颜色
                        let [H,S,L] = [Math.random()*360,(Math.random()*70) + 10,(Math.random()*80) + 10];
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
                    return
                };

                if(retype == 'style'){
                    reTableStyle(table,setdata);
                };

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
                reCompNum(table,_H,V);
            });
        } catch (error) {
            console.log(error)
        }
    };
    //全描边
    if( type == 'All Border'){
        let b = getSelectionMix();
        b.forEach(item => {
            if(item.type == 'INSTANCE'){
                if(item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn')){
                    reTableStyle(null,null,[[item],[1,1,1,1,null]]);
                }
                return;
            };
            let comps = item.findAll(items => items.type == 'INSTANCE' );
            comps = comps.filter(item => item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn'));
            reTableStyle(null,null,[comps,[1,1,1,1,null]]);
        });
    };
    //全不描边
    if( type == 'None Border'){
        let b = getSelectionMix();
        b.forEach(item => {
            if(item.type == 'INSTANCE'){
                if(item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn')){
                    reTableStyle(null,null,[[item],[0,0,0,0,null]]);
                }
                return;
            };
            let comps = item.findAll(items => items.type == 'INSTANCE' );
            comps = comps.filter(item => item.name.includes('@th') || item.name.includes('@td') || item.name.includes('@tn'));
            reTableStyle(null,null,[comps,[0,0,0,0,null]]);
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
        //console.log(info)
        b.forEach(item => {
            if(item.type == 'TEXT'){
                return;
            };
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
    //保留伸缩重置
    if( type == 'New Scale Mark'){
        let b = getSelectionMix();
        b.forEach(item => {
            if(item.type == 'TEXT'){
                return;
            };
            //console.log(item.width,item.height)
            item.setPluginData('oldWH',JSON.stringify([item.width,item.height]));

            let scaleX = item.relativeTransform[0][0];
            let x = item.relativeTransform[0][2];
            let scaleY = item.relativeTransform[1][1];
            let y = item.relativeTransform[1][2];
            item.relativeTransform = [[scaleX,0,x],[0,scaleY,y]];

            sendInfo();
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
                                //console.log(splitTag)
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
    };
    //合并文本
    if ( type == "mergeText"){
        //console.log(info)
        let b = getSelectionMix();
        let texts = b.filter(item => item.type == 'TEXT');
        if(texts.length == 0) return;
        let [mergeType,mergeOrder] = info;
        let characters,textsFinal,newNode;
        if(mergeOrder == '2'){
            let lines = toSameLine(texts);
            characters = lines.map(line => line.map(item => item.characters).join(''));
            //console.log(lines)
            textsFinal = lines;
        } else if(mergeOrder == '3'){
            let cloneTexts = texts.map(item => item.clone());
            let allTextNodes = figma.group(cloneTexts,texts[0].parent,texts[0].parent.children.findIndex(item => item.id == texts[0].id))
            let svgcode = await allTextNodes.exportAsync({
                format: 'SVG_STRING',
                svgOutlineText: false,
                svgIdAttribute: false,
            })
            newNode = figma.createNodeFromSvg(svgcode);
            texts[0].parent.insertChild(texts[0].parent.children.findIndex(item => item.id == texts[0].id),newNode);
            newNode.x = allTextNodes.x;
            newNode.y = allTextNodes.y;
            allTextNodes.remove();
            let newtexts = newNode.findAll(item => item.type == 'TEXT');
            let lines = toSameLine(newtexts);
            characters = lines.map(line => line.map(item => item.characters).join(''));
            textsFinal = lines;
        }
         else {
            characters = texts.map(item => item.characters);
            textsFinal = texts.map(item => [item]);
        };
        //先生成文本，再按需还原样式
        await figma.loadFontAsync({family:'Inter',style:'Regular'});
        let newText = await addText([{family:'Inter',style:'Regular'},characters.join('\n'),16,[toRGB('#d6d6d6',true)]]);

        if (mergeType == 'all') {
            try{
                //需加载全部涉及的字体
                let fonts = texts.map(item => item.getStyledTextSegments(['fontName']).map(item => item.fontName));
                fonts = [...new Set(fonts.map(item => JSON.stringify(item)))];
                fonts = fonts.map(item => JSON.parse(item)).flat();
                //console.log(fonts)
                let promises = fonts.map(item => figma.loadFontAsync(item));
                await Promise.all(promises);

                let lineOffsets = [];
                let accLen = 0;
                characters.forEach((lineStr, index) => {
                    lineOffsets.push(accLen);
                    // 除最后一行外，每一行后面都会多一个 '\n'
                    accLen += lineStr.length + (index < characters.length - 1 ? 1 : 0);
                });

                // stylesByLine: [ 行 ][ 行内 textNode ][ 段落样式 ]
                let stylesByLine = textsFinal.map((lineTexts, lineIndex) => {
                    let lineBase = lineOffsets[lineIndex] || 0;
                    let cursorInLine = 0;
                    return lineTexts.map(textNode => {
                        let segs = textNode.getStyledTextSegments(['fontName','fontSize','fills','fillStyleId','textStyleId']);
                        // 把每个 segment 的 start/end 转成在合并后整体字符串里的绝对位置
                        let adjusted = segs.map(seg => {
                            return Object.assign({}, seg, {
                                start: lineBase + cursorInLine + seg.start,
                                end: lineBase + cursorInLine + seg.end
                            });
                        });
                        cursorInLine += textNode.characters.length;
                        return adjusted;
                    });
                });

                // 应用样式到新文本时再拍平成一维数组
                let styles = stylesByLine.flat(2);
                //console.log(stylesByLine, styles);
                styles.forEach(item => {
                    if(item.fontName) newText.setRangeFontName(item.start,item.end,item.fontName);
                    if(item.fontSize) newText.setRangeFontSize(item.start,item.end,item.fontSize);
                    if(item.fills) newText.setRangeFills(item.start,item.end,item.fills);
                    if(item.fillStyleId) newText.setRangeFillStyleIdAsync(item.start,item.end,item.fillStyleId);
                    if(item.textStyleId) newText.setRangeTextStyleIdAsync(item.start,item.end,item.textStyleId);
                });
            } catch(error){
                console.error(error);
            }

        }
        if(newText){
            let group = figma.group(texts,texts[0].parent,texts[0].parent.children.findIndex(item => item.id == texts[0].id))
            group.name = '@merge:' + mergeType;
            let group2 = figma.group(texts,group)
            group2.visible = false;
            newText.x = group.x;
            newText.y = group.y;
            group.appendChild(newText);       
            figma.currentPage.selection = [group]; 
        }
        if(newNode){
            newNode.remove();
        }
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
    //转为自动布局
    if( type == 'To Auto Layout'){
        let b = getSelectionMix();
        b.forEach(item => {
            if(item.layoutMode && item.layoutMode == 'NONE'){
                addAutoLayout(item,['H','TL',0,[0,0]],[true,true]);
            }
        });
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
    if ( type == 'Break Apart Path'){
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
    //上传图片到二维码识别
    if( type == "Up QR Layer"){
        let b = getSelectionMix();
        if(b.length == 1){
            let c = b[0];
            let [w,h,x,y] = getSafeMain(c);
            let maxWH = Math.max(w,h);
            let scale = maxWH >= 1024 ? 1024/maxWH : 1;
            let info = await c.exportAsync({
                format: 'PNG',
                constraint: { type: 'SCALE', value: scale }
            });
            postmessage([info,'qrLayerView'])
        };
    };
    //生成新二维码
    if( type == "createNewQRcode"){
        let selects = [];
        info.forEach(item => {
            let qrcode = figma.createNodeFromSvg(item.svg);
            qrcode.name = item.type == 'data' ? '@pixel:Qrcode' : '@pixel';
            qrcode.x = figma.viewport.center.x - qrcode.width/2;
            qrcode.y = figma.viewport.center.y - qrcode.height/2;
            selects.push(qrcode);
        });
        figma.currentPage.selection = selects;
        figma.viewport.scrollAndZoomIntoView(selects);
        figma.viewport.zoom = figma.viewport.zoom * 0.6;
    };
    //生成新二维码组件
    if( type == "createNewQRcodeComp"){
        //console.log(info)
        let selects = [];
        let fill = toRGB('#000000',true);
        let bg = toRGB('#ffffff',true);
        let [x,y] = [figma.viewport.center.x - 100,figma.viewport.center.y - 100];
        let cellFillComp,cellBgComp,qrFinderComp,allPixels;

        //只有数据大于1时，生成自动布局容器
        if(info.length > 1){
            allPixels = addFrame([100,100,x,y + 80,'pixels',[]]);
            addAutoLayout(allPixels,['H','TL',0,[0,0]],[false,false]);
            allPixels.strokesIncludedInLayout = true;
            selects.push(allPixels);
        };

        //只有含二值化数据时，生成二值化数据组件
        if(info.map(item => item.type).some(item => item == 'binary')){
            let cellFillBox = addFrame([10,10,x,y,'@cell:fill',[]]);
            let cellFill = figma.createRectangle();
            cellFill.resize(10,10);
            cellFill.fills = [fill];
            cellFillBox.appendChild(cellFill);
            addAutoLayout(cellFillBox,['H','CC',0,[0,0]]);
            cellFillComp = figma.createComponentFromNode(cellFillBox);
            selects.push(cellFillComp);
            let cellBgBox = addFrame([10,10,x + 20,y,'@cell:bg',[]]);
            let cellBg = figma.createRectangle();
            cellBg.resize(10,10);
            cellBg.fills = [bg];
            cellBgBox.appendChild(cellBg);
            addAutoLayout(cellBgBox,['H','CC',0,[0,0]]);
            cellBgComp = figma.createComponentFromNode(cellBgBox);
            selects.push(cellBgComp);
        };
        
        //只有含二维码的数据时，生成二维码组件,同时调整二值化数据组件（如有）和自动布局容器（如有）的位置
        if(info.map(item => item.isQr).some(item => item == true)){
            if(cellFillComp) cellFillComp.x += 80;
            if(cellBgComp) cellBgComp.x += 80;
            if(allPixels) allPixels.x -= 80;
            let qrFinderBox = addFrame([70,70,x,y,'@finder:mix',[]]);
            let qrFinder = figma.createRectangle();
            qrFinder.name = '#finder.radius';
            qrFinder.x = x - 80;
            qrFinder.y = y;
            qrFinder.resize(70,70);
            qrFinder.fills = [fill];
            let finderComp = figma.createComponentFromNode(qrFinder);
            finderComp.name = '@finder';
            selects.push(finderComp);
            let finderCenter = finderComp.createInstance();
            finderCenter.children[0].name = '#finder-center.radius';
            finderCenter.rescale(3/7);
            let finderGap = finderComp.createInstance();
            finderGap.rescale(5/7);
            finderGap.children[0].name = '#finder-gap.radius';
            finderGap.children[0].fills = [bg];
            qrFinderBox.appendChild(finderComp.createInstance());
            addAutoLayout(qrFinderBox,['H','CC',0,[0,0]],[true,true,true,true]);
            addAsAbsolute(qrFinderBox,finderGap,'CC');
            addAsAbsolute(qrFinderBox,finderCenter,'CC');
            qrFinderComp = figma.createComponentFromNode(qrFinderBox);
            selects.push(qrFinderComp);
        }; 
        
        info.forEach(item => {
            if(item.isQr){
                let name = item.isQr ? '@pixel:Qrcode' : '@pixel';
                let qrcode = addFrame([item.column * 10,item.row * 10,x - 70,y + 90,name,[bg]]);    
                qrcode.strokes = [bg];
                qrcode.strokeTopWeight = 10;
                qrcode.strokeRightWeight = 10;
                qrcode.strokeBottomWeight = 10;
                qrcode.strokeLeftWeight = 10;
                qrcode.strokeAlign = 'OUTSIDE';
                if(info.length > 1){
                    allPixels.appendChild(qrcode);
                } else {
                    selects.push(qrcode);
                }
                //先往四个角落放定位区
                let finder1 = qrFinderComp.createInstance();
                qrcode.appendChild(finder1);
                let finder2 = qrFinderComp.createInstance();
                qrcode.appendChild(finder2);
                let finder3 = qrFinderComp.createInstance();
                qrcode.appendChild(finder3);
                finder1.x = 0;
                finder1.y = 0;
                finder2.x = qrcode.width - finder2.width;
                finder2.y = 0;
                finder3.x = 0;
                finder3.y = qrcode.height - finder3.height;
                //根据matrix生成数据区点阵，根据x,y排除与定位区重叠部分
                item.matrix.forEach((cell,index) => {
                    let cellX = index % item.column * 10;
                    let cellY = Math.floor(index / item.column) * 10;
                    if(isOverlap(cellX,cellY)){
                        return;
                    }
                    if(cell == 1){
                        let pixel = cellFillComp.createInstance();
                        qrcode.appendChild(pixel);
                        pixel.x = cellX;
                        pixel.y = cellY;
                    }else{
                        let pixel = cellBgComp.createInstance();
                        qrcode.appendChild(pixel);
                        pixel.x = cellX;
                        pixel.y = cellY;
                    }
                });
            }else{
                let pixelsNode = addFrame([item.column * 10,item.row * 10,x,y,'@pixel',[]]);
                if(item.type == 'binary'){
                    pixelsNode.y = y + 20;
                }
                if(info.length > 1){
                    allPixels.appendChild(pixelsNode);
                } else {
                    selects.push(pixelsNode);
                }
                try{
                    item.matrix.forEach((cell,index) => {
                        let cellX = index % item.column * 10;
                        let cellY = Math.floor(index / item.column) * 10;

                        if(item.type == 'binary'){
                            if(cell == 1){
                                let pixel = cellFillComp.createInstance();
                                pixelsNode.appendChild(pixel);
                                pixel.x = cellX;
                                pixel.y = cellY;
                            }else if(cell == 0){
                                let pixel = cellBgComp.createInstance();
                                pixelsNode.appendChild(pixel);
                                pixel.x = cellX;
                                pixel.y = cellY;
                            }
                        } else {
                            let pixel = figma.createRectangle();
                            pixel.resize(10,10);
                            pixel.fills = [{ color:{r:cell.r,g:cell.g,b:cell.b},type:'SOLID',opacity:cell.a }];
                            pixelsNode.appendChild(pixel);
                            pixel.x = cellX;
                            pixel.y = cellY;
                        }
                    });
                } catch(e){
                    console.log(e)
                }
            }
            
            
            //计算是否与定位区重叠
            function isOverlap(cellX,cellY){
                const finderSize = 70;
                if (cellX < finderSize && cellY < finderSize) return true;
                if (cellX >= (item.column - 7) * 10 && cellY < finderSize) return true;
                if (cellX < finderSize && cellY >= (item.row - 7) * 10) return true;
                return false;
            }
        });
        figma.currentPage.selection = selects;
        figma.viewport.scrollAndZoomIntoView(selects);
        //figma.viewport.zoom = figma.viewport.zoom * 0.6;
        
    };
    //生成伪描边
    if( type == "createShadowStroke"){
        let b = getSelectionMix();
        let [x,y] = [figma.viewport.center.x - 100,figma.viewport.center.y - 100];
        //console.log(info)
        let [shadowType,color,num,width] = [info.type,info.color,info.num || 8,info.width];
        let originalNum = parseInt(num) || 8;
        let lan = await figma.clientStorage.getAsync('userLanguage');
        // 如果数量大于8且不是css模式，提示并强制使用css模式
        if(originalNum > 8 && shadowType !== 'css'){
            if(lan == 'Zh'){
                figma.notify(`Figma限制同类效果数量，大于8时无法生效，已自动生成CSS示例`, {timeout: 3000});
            } else {
                figma.notify(`Figma limits the number of effects, if same type of effects is greater than 8, it will not take effect, and the CSS example has been automatically generated`, {timeout: 3000});
            }
            shadowType = 'css';
        }
        num = shadowType === 'css' ? Math.max(originalNum, 1) : Math.min(Math.max(originalNum, 1), 8); // css模式不限制，其他模式限制1-8
        //投影的x,y模拟描边粗细
        const genDropShadows = (n,createType = 'css') => {
            const arr = Array.from({length: n}, (_, i) => {
                const angle = (i * 2 * Math.PI) / n;
                const x = Math.sin(angle), y = Math.cos(angle);
                const fmt = (v) => Math.abs(v) < 1e-6 ? '0' : Math.abs(v - 1) < 1e-6 ? 'var(--bod-w)' : Math.abs(v + 1) < 1e-6 ? 'calc(-1 * var(--bod-w))' : `calc(${v.toFixed(4)} * var(--bod-w))`;
                if(createType == 'css'){
                    return `drop-shadow(${fmt(x)} ${fmt(y)} 0 var(--col))`;
                } else {
                    let colors = toRGB(color,true).color;
                    colors.a = 1;
                    return {
                        type: 'DROP_SHADOW',
                        color: colors,
                        offset: {x:x*width,y:y*width},
                        visible: true,
                        blendMode: 'NORMAL',
                        spread: 0,
                        radius: 0,
                        showShadowBehindNode: false,
                    };
                }
            });
            return createType == 'css' ? arr.join('\n    ') : arr;
        };

        switch (shadowType) {
            case 'css':
                let tipsEn = `/*alculate the [x,y] of drop-shadows according to the specified precision and width to simulate stroke effect*/`;
                let tipsZh = `/*按指定精度数和宽度计算投影的[x,y]，确保投影均匀分布以模拟描边效果*/`;
                let fontNameTipsZh = {family:'Inter',style:'Regular'};
                let isLoadFontTipsZh = false;
                try {
                    await figma.loadFontAsync(fontNameTipsZh);
                    isLoadFontTipsZh = true;
                } catch (error) {
                    isLoadFontTipsZh = false;
                }
                let tips = tipsEn;
                if(lan == 'Zh' && isLoadFontTipsZh){
                    tips = tipsZh;
                }
                let css = `\n${tips}\n\n[data-shadow-stroke="${num}"]{\n\t--col: ${color};\n\t--bod-w: ${width}px;\n\tfilter: ${genDropShadows(num)};\n}\n`;
                //console.log(css)
                
                let pre = addFrame([626,100,x,y,'@pre:css',[]]);
                addAutoLayout(pre,['H','TL',0,[10,20,10,0]]);
                pre.itemReverseZIndex = true;//前面堆叠在上
                pre.fills = [toRGB('#272727',true)];
                [pre.bottomLeftRadius,pre.bottomRightRadius,pre.topLeftRadius,pre.topRightRadius] = [10,10,10,10];

                let mask = addFrame([100,100,null,null,'mask',[]]);
                addAutoLayout(mask,['V','TL',0,[0,10,0,20]]);
                mask.strokes = [toRGB('#272727',true)];
                mask.fills = [toRGB('#27272799',true)];
                [mask.strokeTopWeight,mask.strokeRightWeight,mask.strokeBottomWeight,mask.strokeLeftWeight] = [0,14,0,0];
                let numText = await addText([{family:'Roboto Mono',style:'Regular'},css.split('\n').length.toString(),16,[toRGB('#aeaeae',true)]]);
                numText.autoRename = false;
                numText.name = '#last-line-num.text';
                numText.fills = [];
                mask.appendChild(numText);
                pre.appendChild(mask);

                let code = await addText([{family:'Roboto Mono',style:'Regular'},css,16,[toRGB('#aeaeae',true)]]);    
                code.setRangeListOptions(0,css.length,{type: 'ORDERED'});//"ORDERED" | "UNORDERED" | "NONE"
                code.setRangeFills(1,tips.length + 1,[toRGB('#565656',true)]);
                if(lan == 'Zh' && isLoadFontTipsZh){
                    code.setRangeFontName(1,tips.length + 1,fontNameTipsZh);
                }
                code.hangingList = true;
                pre.appendChild(code);
                code.layoutSizingHorizontal = 'FILL';

                mask.layoutSizingHorizontal = 'HUG';
                mask.layoutSizingVertical = 'FILL';
                pre.layoutSizingVertical = 'HUG';
                figma.currentPage.selection = [pre];
                figma.viewport.scrollAndZoomIntoView(pre);
                figma.viewport.zoom = figma.viewport.zoom * 0.6;
            break
            case 'add':
                b.forEach(item => {
                    let oldEffects = Array.from(item.effects);
                    let existingDropShadows = oldEffects.filter(e => e.type === 'DROP_SHADOW');
                    let availableSlots = 8 - existingDropShadows.length;
                    if(availableSlots > 0){
                        let newEffects = genDropShadows(Math.min(num, availableSlots),'node');
                        item.effects = [...oldEffects,...newEffects];
                    }
                });
            break
            case 'reset':
                b.forEach(item => {
                    //console.log(num,width)
                    let oldEffects = Array.from(item.effects).filter(items => items.type !== 'DROP_SHADOW');
                    let newEffects = genDropShadows(num,'node');
                    //console.log(newEffects)
                    item.effects = [...oldEffects,...newEffects];
                });
            break
        }
    };
    //创建样式
    if( type == "createPaintStyle"){
        //console.log(info)
        //更新样式列表
        await getStyle('paint');
        let localPaintStyles = localStyles.paint.list;
        let names = localPaintStyles.map(item => item.name);
        info.forEach(item => {
            let name = item[0];
            if(names.includes(name)){
                name = name + ' ?';
            }
            let style = figma.createPaintStyle();
            style.name = name;
            style.paints = [toRGB(item[1],true)];
        });
    }
};

//==========初始化==========

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
    //console.log(userInfo)
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

//==========工具函数==========

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
    // 确保 w 和 h 是有效数字且至少为 1（Figma 要求最小尺寸为 1）
    w = typeof w === 'number' && !isNaN(w) ? Math.max(1, w) : 1;
    h = typeof h === 'number' && !isNaN(h) ? Math.max(1, h) : 1;
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
async function createTable(thComp,tdComp,language,isFill = false,isHeader = true){
    let th,td;
    
    if(tdComp){
        td = tdComp;
    } else {
        td = await addTableCompMust('td',language,null,isFill,isHeader);
        //console.log(td)
    };
    if(isHeader){
        if(thComp){
            th = thComp;
        } else {
            th = await addTableCompMust('th',language);
        };
    } else {
        th = td;//没有表头则使用数据组件作为表头
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
async function addTableCompMust(type,language,nodes,isFill = false,isHeader = true){
    let comp = addFrame([176,52,null,null,'xxx@' + type,[]]);
    if((type == 'td' || type == 'tn') && isHeader){
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
            let styles = await figma.getLocalPaintStylesAsync()
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
            let consumers = await Promise.all(promises)
            //应用在什么节点
            //console.log(consumers)
            info.nodes = consumers.flat();
            localStyles.paint = info;
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
    if(!style || !table || table && (!table.children || table.children.length < 2)) return;
    let columns = table.findChildren(item => item.name.includes('@column'));
    //必须保证传入数值或null
    if(style && typeof style === 'object' && !Array.isArray(style)){
        if(Array.isArray(style.th)){
            style.th = style.th.map(item => {
                return (item === undefined || item === null) ? null : item;
            });
        }
        if(Array.isArray(style.td)){
            style.td = style.td.map(item => {
                return (item === undefined || item === null) ? null : item;
            });
        }
    }
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
                case '--bod-t': if(Array[0] !== null) comp.setProperties({[key]:(Array[0] == 0) ? false : true});break
                case '--bod-r': if(Array[1] !== null) comp.setProperties({[key]:(Array[1] == 0) ? false : true});break
                case '--bod-b': if(Array[2] !== null) comp.setProperties({[key]:(Array[2] == 0) ? false : true});break
                case '--bod-l': if(Array[3] !== null) comp.setProperties({[key]:(Array[3] == 0) ? false : true});break
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
                        if(Array[4] !== null) comp.setProperties({[key]:(Array[4] == 0) ? false : true});
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
                for ( let ii = 0; ii < Hs.length; ii++){
                    picks.push(table.children[i].children[Hs[ii]]);
                };
            };
            a.selection = picks;
        ;break
        case 'allrow':
            //console.log(Hs,LL)
            //要把Hs里最大和最小值之间所有行都选中
            let maxH = Math.max(...Hs);
            let minH = Math.min(...Hs);
            //console.log(maxH,minH)
            for ( let i = 0; i < LL ; i++ ){
                for ( let ii = minH; ii <= maxH; ii++){
                    picks.push(table.children[i].children[ii]);
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
 * 
 * 布局对齐说明（统一使用TBLR表示，不管横竖排版）：
 * - T = Top (上) = 垂直方向的MIN
 * - B = Bottom (下) = 垂直方向的MAX
 * - L = Left (左) = 水平方向的MIN
 * - R = Right (右) = 水平方向的MAX
 * - C = Center (居中)
 * - S = Space Between (仅在主轴方向有效)
 * - A = Baseline (仅在H模式的次轴方向有效，即垂直方向)
 * 
 * 示例：'TL' = 左上对齐
 * - H模式：主轴(水平)=L(左/MIN)，副轴(垂直)=T(上/MIN)
 *   → HTML: flex-direction: row; justify-content: flex-start; align-items: flex-start;
 * - V模式：主轴(垂直)=T(上/MIN)，副轴(水平)=L(左/MIN)
 *   → HTML: flex-direction: column; justify-content: flex-start; align-items: flex-start;
 */
function addAutoLayout(node,layout,isFixed){
    node.layoutPositioning = 'AUTO';
    if(isFixed){
        node.primaryAxisSizingMode = isFixed[0] ? "FIXED" : "AUTO";
        node.counterAxisSizingMode = isFixed[1] ? "FIXED" : "AUTO";
    };
    node.clipsContent = false;//默认超出不裁剪
    
    const align = layout[1] || 'TL'; // 默认左上对齐
    const verticalAlign = align[0]; // 第一个字符：垂直方向 (T/B/C)
    const horizontalAlign = align[1]; // 第二个字符：水平方向 (L/R/C/S/A)
    
    switch (layout[0]){
        case 'H':
            // H模式（横向布局）：主轴=水平，副轴=垂直
            // HTML对应: flex-direction: row;
            node.layoutMode = 'HORIZONTAL';
            
            // 主轴对齐（水平方向）：L=左, R=右, C=中, S=间距
            // HTML对应: justify-content（L/C/R/S）
            // 注意：基线对齐(A)仅在H模式的次轴可用，不在主轴
            switch (horizontalAlign){
                case 'L':
                    node.primaryAxisAlignItems = 'MIN'; // HTML: justify-content: flex-start;
                    break;
                case 'C':
                    node.primaryAxisAlignItems = 'CENTER'; // HTML: justify-content: center;
                    break;
                case 'R':
                    node.primaryAxisAlignItems = 'MAX'; // HTML: justify-content: flex-end;
                    break;
                case 'S': 
                    node.primaryAxisAlignItems = 'SPACE_BETWEEN'; // HTML: justify-content: space-between;
                    break;
                // 注意：case 'A' (baseline) 仅在次轴可用，不在主轴
            };
            
            // 副轴对齐（垂直方向）：T=上, B=下, C=中, A=基线
            // HTML对应: align-items
            // 注意：基线对齐(A)仅在H模式的次轴（垂直方向）可用
            switch (verticalAlign){
                case 'T':
                    node.counterAxisAlignItems = 'MIN'; // HTML: align-items: flex-start;
                    break;
                case 'C':
                    node.counterAxisAlignItems = 'CENTER'; // HTML: align-items: center;
                    break;
                case 'B':
                    node.counterAxisAlignItems = 'MAX'; // HTML: align-items: flex-end;
                    break;
                case 'A':
                    node.counterAxisAlignItems = 'BASELINE'; // HTML: align-items: baseline (仅在H模式可用)
                    break;
            };
            break;
            
        case 'V':
            // V模式（纵向布局）：主轴=垂直，副轴=水平
            // HTML对应: flex-direction: column;
            node.layoutMode = 'VERTICAL';
            
            // 主轴对齐（垂直方向）：T=上, B=下, C=中, S=间距
            // 注意：基线对齐(A)仅在H模式可用，V模式不支持
            // HTML对应: justify-content
            switch (verticalAlign){
                case 'T':
                    node.primaryAxisAlignItems = 'MIN'; // HTML: justify-content: flex-start;
                    break;
                case 'C':
                    node.primaryAxisAlignItems = 'CENTER'; // HTML: justify-content: center;
                    break;
                case 'B':
                    node.primaryAxisAlignItems = 'MAX'; // HTML: justify-content: flex-end;
                    break;
                case 'S': 
                    node.primaryAxisAlignItems = 'SPACE_BETWEEN'; // HTML: justify-content: space-between;
                    break;
                // 注意：case 'A' (baseline) 仅在H模式可用，V模式不支持
            };
            
            // 副轴对齐（水平方向）：L=左, R=右, C=中
            // HTML对应: align-items
            switch (horizontalAlign){
                case 'L':
                    node.counterAxisAlignItems = 'MIN'; // HTML: align-items: flex-start;
                    break;
                case 'C':
                    node.counterAxisAlignItems = 'CENTER'; // HTML: align-items: center;
                    break;
                case 'R':
                    node.counterAxisAlignItems = 'MAX'; // HTML: align-items: flex-end;
                    break;
            };
            break;
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
function addConstraints(parent,constraintNode,TBLR,isFill = false){
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
                V = isFill ? 'STRETCH' : 'CENTER' ;//保留，兼容旧逻辑
            ;break
            case 'S':
                V = 'STRETCH';
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
                H = isFill ? 'STRETCH' : 'CENTER' ;//保留，兼容旧逻辑
            ;break
            case 'S':
                H = 'STRETCH';
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
                addAutoLayout(group2,['H','BA',0,[0,0]],[false,true]);
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
            addAutoLayout(group2,['H','BA',0,[0,0]],[false,true]);
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
//分析文本是同一行的可能性，将同行的文本放进一个数组
function toSameLine(nodes){
    //先按上下左右排好序
    sortLRTB(nodes);
    let lines = []; 
    //y值相差平均高度的1/4可视为同一行
    const threshold = nodes.reduce((sum, node) => sum + node.height, 0) / nodes.length / 4;
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let added = false;
        let nodeY = node.absoluteBoundingBox.y;
        // 查找是否可以放入已有的某一行（与该行第一个元素y相近则视为同一行）
        for (let j = 0; j < lines.length; j++) {
            let refNode = lines[j][0];
            let refY = refNode.absoluteBoundingBox.y;
            if (Math.abs(nodeY - refY) < threshold) {
                lines[j].push(node);
                added = true;
                break;
            }
        }
        if (!added) {
            lines.push([node]);
        }
    }
    return lines;
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
        //如果作为组件
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

// ========== JSON 数据转 Figma 节点 - 重构后的模块化结构 ==========

// 工具函数：解析 JSON 数据格式
function parseJsonData(jsonData) {
    if (!jsonData) return null;
    
    // 支持多种 JSON 格式
    if (jsonData.element) {
        return jsonData.element;
    } else if (jsonData.position || jsonData.styles) {
        // 直接是 element 对象
        return jsonData;
    }
    
    return null;
}

// 工具函数：解析数值
function parseNumeric(value, defaultValue = 0) {
    if (!value) return defaultValue;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
}

// 工具函数：获取节点名称
function getNodeName(elementData, tagName) {
    return elementData.id || 
           (elementData.classes && elementData.classes.length > 0 ? elementData.classes[0] : null) || 
           tagName;
}

// 工具函数：应用基础样式（display, opacity）
function applyBasicStyles(node, styles) {
    if (styles.display === 'none') {
        node.visible = false;
    }
    
    if (styles.opacity && styles.opacity !== 1) {
        node.opacity = styles.opacity * 1;
    }
}

// 元素处理器：SVG 元素
class SvgElementProcessor {
    static async process(elementData, position, styles, parentNode) {
        if (!elementData.isSpecialElement || elementData.specialType !== 'svg' || !elementData.svgCode) {
            return null;
        }
        
        try {
            const svgNode = figma.createNodeFromSvg(elementData.svgCode);
            
            const x = position.x || 0;
            const y = position.y || 0;
            const width = position.width || svgNode.width || 100;
            const height = position.height || svgNode.height || 100;
            
            svgNode.x = x;
            svgNode.y = y;
            
            if (svgNode.width !== width || svgNode.height !== height) {
                //svgNode.resize(width, height);
            }
            
            svgNode.name = getNodeName(elementData, 'svg');
            
            if (parentNode) {
                parentNode.appendChild(svgNode);
            } else {
                figma.currentPage.appendChild(svgNode);
            }
            
            return svgNode;
        } catch (e) {
            console.warn('Failed to create SVG node:', e);
            return null;
        }
    }
}

// 元素处理器：文本元素（inline span）
class TextElementProcessor {
    /**
     * 统一处理文本元素：支持分段文本（span包裹）和直接文本（普通textContent）
     * @param {Object} elementData - 元素数据
     * @param {Object} styles - 样式对象
     * @param {string} textContent - 文本内容
     * @param {string} tagName - 标签名
     * @param {number} parentWidth - 父容器宽度
     * @param {Array} children - 子元素数组
     * @param {Object} options - 选项：{ isDirectText: false, parentNode: null, whiteSpace: null }
     * @returns {Promise<TextNode|null>} - 文本节点或 null
     */
    static async process(elementData, styles, textContent, tagName, parentWidth = null, children = null, options = {}) {
        const { isDirectText = false, parentNode = null, whiteSpace = null } = options;
        
        // 如果是直接文本处理（普通textContent），不需要检查 span 条件
        if (!isDirectText) {
            const isInlineSpan = tagName === 'span' && 
                                (!styles.display || styles.display === 'inline' || styles.display === '') &&
                                (!styles.position || styles.position === 'static' || styles.position === 'relative') &&
                                (!styles.backgroundColor || styles.backgroundColor === 'rgba(0, 0, 0, 0)' || styles.backgroundColor === 'transparent') &&
                                (!styles.borderWidth || parseFloat(styles.borderWidth) === 0) &&
                                (!styles.borderRadius || parseFloat(styles.borderRadius) === 0);
            
            // 如果不是内联 span，返回 null
            if (!isInlineSpan) {
                return null;
            }
        }
        
        // 检查是否有有效的文本内容（主文本或子 span 的文本）
        const hasTextContent = textContent && textContent.length > 0;
        const hasChildText = children && children.length > 0 && 
                            children.some(child => child.textContent && child.textContent.length > 0);
        
        // 如果是直接文本，必须有 textContent
        if (isDirectText && !hasTextContent) {
            return null;
        }
        
        // 如果是分段文本，必须有文本内容或子 span
        if (!isDirectText && !hasTextContent && !hasChildText) {
            return null;
        }
        
        try {
            // 处理 fontFamily：split(",") 并去掉引号，取第一个
            const parseFontFamily = (fontFamilyStr) => {
                if (!fontFamilyStr) return 'Inter';
                // 去掉引号
                let cleaned = fontFamilyStr.replace(/['"]/g, '');
                // split(",") 并取第一个
                const parts = cleaned.split(',').map(part => part.trim());
                return parts[0] || 'Inter';
            };
            
            // 处理 fontWeight：转换为 Figma 的 style
            const parseFontStyle = (fontWeight) => {
                if (!fontWeight) return 'Regular';
                const weight = parseFloat(fontWeight);
                if (!isNaN(weight) && weight >= 600) {
                    return 'Bold';
                }
                return 'Regular';
            };
            
            // 处理 textTransform 和 fontVariantCaps：转换为 Figma 的 TextCase
            // 参考: https://developers.figma.com/docs/plugins/api/TextCase/
            // TextCase 值: "ORIGINAL" | "UPPER" | "LOWER" | "TITLE" | "SMALL_CAPS" | "SMALL_CAPS_FORCED"
            const parseTextCase = (textTransform, fontVariantCaps = null) => {
                // 优先检查 font-variant-caps（用于 SMALL_CAPS）
                if (fontVariantCaps) {
                    const variant = String(fontVariantCaps).toLowerCase().trim();
                    if (variant === 'small-caps') {
                        // 如果同时有 textTransform: capitalize，使用 SMALL_CAPS_FORCED
                        if (textTransform && String(textTransform).toLowerCase().trim() === 'capitalize') {
                            return 'SMALL_CAPS_FORCED';
                        }
                        return 'SMALL_CAPS';
                    }
                }
                
                // 处理 textTransform
                if (!textTransform || textTransform === 'none') {
                    return 'ORIGINAL';
                }
                const transform = String(textTransform).toLowerCase().trim();
                switch (transform) {
                    case 'uppercase':
                        return 'UPPER';
                    case 'lowercase':
                        return 'LOWER';
                    case 'capitalize':
                        return 'TITLE';
                    default:
                        return 'ORIGINAL';
                }
            };
            
            // 收集所有文本片段和样式
            const textSegments = [];
            
            // 如果有子 span，收集所有子 span 的文本和样式
            if (children && children.length > 0 && children.every(child => child.tagName === 'span')) {
                let currentIndex = 0;
                
                for (const child of children) {
                    // 获取子元素的文本内容（可能是 null、空字符串或实际文本）
                    // 注意：即使 textContent 是 null，也要检查是否有子元素（嵌套的 span）
                    let childText = '';
                    if (child.textContent !== null && child.textContent !== undefined) {
                        childText = String(child.textContent);
                    } else if (child.children && child.children.length > 0) {
                        // 如果 textContent 是 null 但有子元素，递归收集子元素的文本
                        for (const grandChild of child.children) {
                            if (grandChild.textContent !== null && grandChild.textContent !== undefined) {
                                childText += String(grandChild.textContent);
                            }
                        }
                    }
                    
                    // 只要有文本内容（包括空字符串，因为可能是空格），就收集
                    // 注意：即使是空字符串也会被收集，因为可能是空格或其他不可见字符
                    if (childText !== null && childText !== undefined) {
                        const childStyles = child.styles || {};
                        const childFontSize = parseFloat(childStyles.fontSize) || parseFloat(styles.fontSize) || 16;
                        const childFontFamily = parseFontFamily(childStyles.fontFamily || styles.fontFamily);
                        const childFontStyle = parseFontStyle(childStyles.fontWeight || styles.fontWeight);
                        
                        let childFills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}];
                        if (childStyles.color) {
                            try {
                                childFills = [toRGB(childStyles.color, true)];
                            } catch (e) {
                                console.warn('Text color parse error:', e);
                            }
                        } else if (styles.color) {
                            try {
                                childFills = [toRGB(styles.color, true)];
                            } catch (e) {
                                console.warn('Text color parse error:', e);
                            }
                        }
                        
                        // 获取 font-variant-caps（可能从 fontVariantCaps 或 fontVariant 中获取）
                        const childFontVariantCaps = childStyles.fontVariantCaps || 
                                                     (childStyles.fontVariant && childStyles.fontVariant.includes('small-caps') ? 'small-caps' : null) ||
                                                     styles.fontVariantCaps ||
                                                     (styles.fontVariant && styles.fontVariant.includes('small-caps') ? 'small-caps' : null);
                        const childTextCase = parseTextCase(
                            childStyles.textTransform || styles.textTransform,
                            childFontVariantCaps
                        );
                        
                        textSegments.push({
                            text: childText,
                            start: currentIndex,
                            end: currentIndex + childText.length,
                            fontSize: childFontSize,
                            fontFamily: childFontFamily,
                            fontStyle: childFontStyle,
                            fills: childFills,
                            textCase: childTextCase
                        });
                        
                        currentIndex += childText.length;
                    }
                }
            }
            
            // 如果有主文本内容，添加到开头或末尾
            if (textContent) {
                const mainFontSize = parseFloat(styles.fontSize) || 16;
                const mainFontFamily = parseFontFamily(styles.fontFamily);
                const mainFontStyle = parseFontStyle(styles.fontWeight);
                
                let mainFills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}];
                if (styles.color) {
                    try {
                        mainFills = [toRGB(styles.color, true)];
                    } catch (e) {
                        console.warn('Text color parse error:', e);
                    }
                }
                
                // 获取 font-variant-caps（可能从 fontVariantCaps 或 fontVariant 中获取）
                const mainFontVariantCaps = styles.fontVariantCaps ||
                                           (styles.fontVariant && styles.fontVariant.includes('small-caps') ? 'small-caps' : null);
                const mainTextCase = parseTextCase(styles.textTransform, mainFontVariantCaps);
                
                // 如果已有子 span 的文本，主文本添加到末尾
                if (textSegments.length > 0) {
                    const lastEnd = textSegments[textSegments.length - 1].end;
                    textSegments.push({
                        text: textContent,
                        start: lastEnd,
                        end: lastEnd + textContent.length,
                        fontSize: mainFontSize,
                        fontFamily: mainFontFamily,
                        fontStyle: mainFontStyle,
                        fills: mainFills,
                        textCase: mainTextCase
                    });
                } else {
                    // 否则作为第一个片段
                    textSegments.push({
                        text: textContent,
                        start: 0,
                        end: textContent.length,
                        fontSize: mainFontSize,
                        fontFamily: mainFontFamily,
                        fontStyle: mainFontStyle,
                        fills: mainFills,
                        textCase: mainTextCase
                    });
                }
            }
            
            // 合并所有文本
            const fullText = textSegments.map(seg => seg.text).join('');
            
            // 如果没有文本片段，返回 null
            // 注意：即使 fullText 是空字符串，只要 textSegments 不为空，也应该创建文本节点（可能是空格）
            if (textSegments.length === 0) {
                return null;
            }
            
            // 如果 fullText 为空或只有空白字符，检查是否应该创建文本节点
            // 如果 textSegments 中有非空文本，应该创建节点
            const hasNonEmptyText = textSegments.some(seg => seg.text && seg.text.trim().length > 0);
            if (!hasNonEmptyText && (!fullText || fullText.trim().length === 0)) {
                return null;
            }
            
            // 使用第一个片段的样式作为默认样式创建文本节点
            const firstSegment = textSegments[0];
            const defaultFontSize = firstSegment.fontSize;
            const defaultFontFamily = firstSegment.fontFamily;
            const defaultFontStyle = firstSegment.fontStyle;
            const defaultFills = firstSegment.fills;
            const defaultTextCase = firstSegment.textCase || 'ORIGINAL';
            
            const node = await addText([{family: defaultFontFamily, style: defaultFontStyle}, fullText, defaultFontSize, defaultFills]);
            
            // 为每个片段设置不同的样式
            for (const segment of textSegments) {
                // 设置字体
                if (segment.fontFamily !== defaultFontFamily || segment.fontStyle !== defaultFontStyle) {
                    try {
                        await figma.loadFontAsync({family: segment.fontFamily, style: segment.fontStyle});
                        node.setRangeFontName(segment.start, segment.end, {family: segment.fontFamily, style: segment.fontStyle});
                    } catch (e) {
                        console.warn('Failed to load font:', segment.fontFamily, segment.fontStyle, e);
                    }
                }
                
                // 设置字体大小
                if (segment.fontSize !== defaultFontSize) {
                    node.setRangeFontSize(segment.start, segment.end, segment.fontSize);
                }
                
                // 设置颜色
                if (JSON.stringify(segment.fills) !== JSON.stringify(defaultFills)) {
                    node.setRangeFills(segment.start, segment.end, segment.fills);
                }
                
                // 设置文本大小写
                const segmentTextCase = segment.textCase || 'ORIGINAL';
                if (segmentTextCase !== defaultTextCase) {
                    try {
                        node.setRangeTextCase(segment.start, segment.end, segmentTextCase);
                    } catch (e) {
                        console.warn('Failed to set text case:', segmentTextCase, e);
                    }
                }
            }
            
            // 如果默认文本大小写不是 ORIGINAL，设置整个文本的大小写
            if (defaultTextCase !== 'ORIGINAL') {
                try {
                    node.textCase = defaultTextCase;
                } catch (e) {
                    console.warn('Failed to set default text case:', defaultTextCase, e);
                }
            }
            
            // 设置文本对齐方式
            const textAlign = styles.textAlign ? styles.textAlign.toLowerCase() : null;
            if (textAlign) {
                if (textAlign === 'left' || textAlign === 'start') {
                    node.textAlignHorizontal = 'LEFT';
                } else if (textAlign === 'center') {
                    node.textAlignHorizontal = 'CENTER';
                } else if (textAlign === 'right' || textAlign === 'end') {
                    node.textAlignHorizontal = 'RIGHT';
                } else if (textAlign === 'justify') {
                    node.textAlignHorizontal = 'JUSTIFIED';
                }
            }
            
            // 设置行高
            if (styles.lineHeight && styles.lineHeight !== 'normal') {
                const lineHeight = styles.lineHeight;
                if (lineHeight.includes('px')) {
                    const lineHeightValue = parseFloat(lineHeight);
                    if (!isNaN(lineHeightValue)) {
                        node.lineHeight = {value: lineHeightValue, unit: 'PIXELS'};
                    }
                } else if (lineHeight.includes('%')) {
                    const lineHeightValue = parseFloat(lineHeight);
                    if (!isNaN(lineHeightValue)) {
                        node.lineHeight = {value: lineHeightValue, unit: 'PERCENT'};
                    }
                } else {
                    const lineHeightValue = parseFloat(lineHeight);
                    if (!isNaN(lineHeightValue)) {
                        node.lineHeight = {value: lineHeightValue * defaultFontSize, unit: 'PIXELS'};
                    }
                }
            }
            
            return node;
        } catch (error) {
            console.error('Text creation error:', error);
            return null;
        }
    }
}

/**
 * 根据规则设置文本节点的宽度
 * 原则：最先判断父元素是否有自动布局
 * - 有自动布局：判断是否有文本换行，有换行则宽度设置为填充（FILL）
 * - 无自动布局：判断是否有文本居中/居右，有居中/居右且有换行则宽度设置为父元素的宽度
 * @param {TextNode} textNode - 文本节点
 * @param {SceneNode} parentNode - 父容器节点
 * @param {Object} styles - 样式对象
 * @param {number} parentWidth - 父容器宽度（备用）
 */
function applyTextWidthRules(textNode, parentNode, styles, parentWidth = null, isSpan = false) {
    if (!textNode || !parentNode) {
        return;
    }
    //console.log(textNode.characters)
    // 原则：最先判断父元素是否有自动布局
    const hasAutoLayout = parentNode.layoutMode && parentNode.layoutMode !== 'NONE';
    const hasTextWrap = styles.whiteSpace && styles.whiteSpace !== 'nowrap';
    const textAlign = styles.textAlign ? styles.textAlign.toLowerCase() : null;
    const hasTextCenterOrRight = textAlign === 'center' || textAlign === 'right' || textAlign === 'end';
    
    if (hasAutoLayout) {
        // 有自动布局：判断是否有文本换行
        if (hasTextWrap && textNode.width > parentNode.width) {
            //console.log('有自动布局,有换行',textNode.characters)
            // 有换行且超出长度：在填入文本对象后宽度设置为填充（FILL）
            textNode.layoutSizingHorizontal = 'FILL';
        }else{
            if(isSpan) {
                parentNode.layoutSizingHorizontal = 'HUG';
                //模拟html中span自带的间距，严格来说要实现0.5ch的效果，但这里先简单处理
                if(parentNode.paddingLeft < 1 ) parentNode.paddingLeft = 1;
                if(parentNode.paddingRight < 1 ) parentNode.paddingRight = 1;
            };//如果是span，则父元素宽度设置自适应
            textNode.layoutSizingHorizontal = 'HUG';
        }
    } else {
        // 无自动布局：判断是否有文本居中/居右
        //console.log('无自动布局，有居中/居右',textNode.characters)
        if (hasTextCenterOrRight) {
            const parentWidthValue = parentNode.width || parentWidth || 0;
            if (parentWidthValue > 0) {
                textNode.resize(parentWidthValue, textNode.height);
            }
        }
    }
}

/**
 * 处理渐变色填充：将 CSS 渐变字符串转换为 Figma 渐变填充格式
 * @param {string} backgroundImage - CSS 渐变字符串（如 'linear-gradient(to right, red, blue)'）
 * @returns {Array|null} - Figma 渐变填充数组，如果不是渐变则返回 null
 */
function parseGradientFill(backgroundImage) {
    if (!backgroundImage || backgroundImage === 'none') {
        return null;
    }
    
    // 检查是否是渐变色（不处理 repeating，因为 Figma 不支持）
    const gradientPattern = /(linear-gradient|radial-gradient|conic-gradient)\s*\(/i;
    if (!gradientPattern.test(backgroundImage)) {
        return null; // 不是渐变，返回 null
    }
    
    try {
        // 提取渐变类型
        const typeMatch = backgroundImage.match(/(linear-gradient|radial-gradient|conic-gradient)/i);
        if (!typeMatch) {
            return null;
        }
        
        const baseType = typeMatch[1].toLowerCase();
        
        // 提取渐变参数（去除函数名和括号）
        const paramsMatch = backgroundImage.match(/\(([^)]+)\)/);
        if (!paramsMatch) {
            return null;
        }
        
        const params = paramsMatch[1].trim();
        
        // 解析渐变方向和颜色停止点
        let angle = 0; // 默认角度（线性渐变）
        let gradientFigmaType = 'GRADIENT_LINEAR';
        
        if (baseType === 'linear-gradient') {
            // 线性渐变：解析方向
            // CSS 方向定义：
            // - to right: 从左到右 (0度)
            // - to bottom: 从上到下 (90度)
            // - to left: 从右到左 (180度)
            // - to top: 从下到上 (-90度)
            // - to right top / to top right: 从左下到右上 (45度)
            // - to right bottom / to bottom right: 从左上到右下 (-45度)
            // - to left top / to top left: 从右下到左上 (135度)
            // - to left bottom / to bottom left: 从右上到左下 (-135度)
            
            let hasTop = params.includes('to top') || params.includes('top');
            let hasBottom = params.includes('to bottom') || params.includes('bottom');
            let hasLeft = params.includes('to left') || params.includes('left');
            let hasRight = params.includes('to right') || params.includes('right');
            
            // 处理组合方向
            if (hasRight && hasTop) {
                // to right top: 从左下到右上 (45度)
                angle = Math.PI / 4;
            } else if (hasRight && hasBottom) {
                // to right bottom: 从左上到右下 (-45度)
                angle = -Math.PI / 4;
            } else if (hasLeft && hasTop) {
                // to left top: 从右下到左上 (135度)
                angle = 3 * Math.PI / 4;
            } else if (hasLeft && hasBottom) {
                // to left bottom: 从右上到左下 (-135度)
                angle = -3 * Math.PI / 4;
            } else if (hasRight) {
                angle = 0; // 从左到右
            } else if (hasBottom) {
                angle = Math.PI / 2; // 从上到下
            } else if (hasLeft) {
                angle = Math.PI; // 从右到左
            } else if (hasTop) {
                angle = -Math.PI / 2; // 从下到上
            } else {
                // 尝试解析角度（如 45deg 或 -45deg）
                const angleMatch = params.match(/(-?\d+(?:\.\d+)?)\s*deg/);
                if (angleMatch) {
                    const cssAngle = parseFloat(angleMatch[1]);
                    // CSS 角度：0deg = 从下到上，90deg = 从左到右
                    // 转换为标准角度：standardAngle = 90 - cssAngle
                    angle = ((90 - cssAngle) * Math.PI) / 180;
                }
            }
            gradientFigmaType = 'GRADIENT_LINEAR';
        } else if (baseType === 'radial-gradient') {
            gradientFigmaType = 'GRADIENT_RADIAL';
            // 径向渐变：默认从中心向外，不需要角度
        } else if (baseType === 'conic-gradient') {
            gradientFigmaType = 'GRADIENT_ANGULAR';
            // 圆锥渐变：解析起始角度
            const angleMatch = params.match(/(\d+(?:\.\d+)?)\s*deg/);
            if (angleMatch) {
                angle = (parseFloat(angleMatch[1]) * Math.PI) / 180;
            }
        }
        
        // 提取颜色停止点（颜色已经是 HEX 格式）
        const colorMatches = [];
        // 匹配 HEX 颜色、__TRANSPARENT__、以及可能的位置信息
        const colorPattern = /(#[0-9a-fA-F]{3,8}|__TRANSPARENT__)(?:\s+(\d+(?:\.\d+)?%?))?/gi;
        let match;
        
        while ((match = colorPattern.exec(params)) !== null) {
            const colorStr = match[1];
            const posStr = match[2];
            
            let position;
            if (posStr) {
                // 有位置信息
                if (posStr.includes('%')) {
                    position = parseFloat(posStr) / 100;
                } else {
                    position = parseFloat(posStr);
                }
            } else {
                // 没有位置信息，平均分配
                // 这里先收集所有颜色，后面再统一分配位置
                position = null;
            }
            
            colorMatches.push({
                color: colorStr,
                position: position
            });
        }
        
        // 如果没有提取到颜色，尝试更简单的方法：分割参数
        if (colorMatches.length === 0) {
            // 移除方向关键词，然后按逗号分割
            const cleanedParams = params
                .replace(/to\s+(right|left|top|bottom|top\s+right|top\s+left|bottom\s+right|bottom\s+left)/gi, '')
                .replace(/\d+(?:\.\d+)?\s*deg/gi, '')
                .trim();
            
            const parts = cleanedParams.split(',').map(p => p.trim()).filter(p => p);
            parts.forEach((part, index) => {
                // 尝试提取颜色和位置
                const colorPosMatch = part.match(/(#[0-9a-fA-F]{3,8}|__TRANSPARENT__)\s+(\d+(?:\.\d+)?%?)/);
                if (colorPosMatch) {
                    const colorStr = colorPosMatch[1];
                    const posStr = colorPosMatch[2];
                    const pos = posStr.includes('%') ? parseFloat(posStr) / 100 : parseFloat(posStr);
                    colorMatches.push({
                        color: colorStr,
                        position: Math.max(0, Math.min(1, pos))
                    });
                } else {
                    // 只有颜色，没有位置
                    const normalizedPos = parts.length > 1 ? index / (parts.length - 1) : 0;
                    colorMatches.push({
                        color: part,
                        position: Math.max(0, Math.min(1, normalizedPos))
                    });
                }
            });
        } else {
            // 统一处理位置：如果有 null 位置，平均分配
            const nullPositions = colorMatches.filter(cm => cm.position === null);
            if (nullPositions.length > 0) {
                const withPosition = colorMatches.filter(cm => cm.position !== null);
                const totalWithPosition = withPosition.length;
                const totalColors = colorMatches.length;
                
                // 重新分配位置
                colorMatches.forEach((cm, index) => {
                    if (cm.position === null) {
                        // 平均分配
                        cm.position = index / (totalColors - 1);
                    }
                });
            }
        }
        
        // 至少需要两个颜色停止点
        if (colorMatches.length < 2) {
            return null;
        }
        
        // 确保位置在 0-1 范围内，并排序
        colorMatches.forEach(cm => {
            cm.position = Math.max(0, Math.min(1, cm.position));
        });
        colorMatches.sort((a, b) => a.position - b.position);
        
        // 转换为 Figma 渐变停止点格式
        // 颜色已经是 HEX 格式，使用 toRGB 转换为 Figma 颜色格式
        const gradientStops = colorMatches.map(cm => {
            let color;
            if (cm.color === '__TRANSPARENT__') {
                // 透明色：使用 rgba(0,0,0,0)
                color = { r: 0, g: 0, b: 0, a: 0 };
            } else {
                // HEX 颜色转换为 RGB
                color = toRGB(cm.color, false);
                if(!color.a) color.a = 1;
            }
            return {
                color: color,
                position: cm.position
            };
        });
        
        // 构建 gradientTransform 矩阵
        // Transform 格式：[[a, b, tx], [c, d, ty]]
        // Figma 的线性渐变 transform 需要归一化的方向向量和偏移值
        // 对于对角线渐变，需要偏移值来确保渐变覆盖整个元素
        let gradientTransform = null;
        if (gradientFigmaType === 'GRADIENT_LINEAR') {
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);
            
            // Figma 使用 1/√2 作为归一化因子
            const normalizeFactor = 1 / Math.sqrt(2);
            
            // 计算归一化的方向向量
            const dx = cosAngle * normalizeFactor;
            const dy = sinAngle * normalizeFactor;
            
            // 对于对角线渐变，需要计算偏移值
            // 根据用户反馈，to left top (135度) 需要偏移 [1, 0.5]
            let tx = 0;
            let ty = 0;
            
            // 根据角度计算偏移值
            const absAngle = Math.abs(angle);
            const is135 = Math.abs(absAngle - 3 * Math.PI / 4) < 0.01;
            const is45 = Math.abs(absAngle - Math.PI / 4) < 0.01;
            
            if (is135) {
                // 135度 (to left top): 偏移 [1, 0.5]
                tx = 1;
                ty = 0.5;
            } else if (is45 && angle > 0) {
                // 45度 (to right top): 偏移 [0.5, 0]
                tx = 0.5;
                ty = 0;
            } else if (is45 && angle < 0) {
                // -45度 (to right bottom): 偏移 [0, 0.5]
                tx = 0;
                ty = 0.5;
            } else if (Math.abs(absAngle - 3 * Math.PI / 4) < 0.01 && angle < 0) {
                // -135度 (to left bottom): 偏移 [0.5, 1]
                tx = 0.5;
                ty = 1;
            }
            
            // 矩阵构造：第一行 [dx, -dy, tx]，第二行 [dy, dx, ty]
            // 根据用户数据，to left top 应该是 [-0.5, -0.5, 1] 和 [0.5, -0.5, 0.5]
            gradientTransform = [
                [dx, -dy, tx],
                [dy, dx, ty]
            ];
        } else if (gradientFigmaType === 'GRADIENT_ANGULAR') {
            // 圆锥渐变：类似线性渐变
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);
            const normalizeFactor = 1 / Math.sqrt(2);
            
            gradientTransform = [
                [cosAngle * normalizeFactor, sinAngle * normalizeFactor, 0],
                [-sinAngle * normalizeFactor, cosAngle * normalizeFactor, 0]
            ];
        } else if (gradientFigmaType === 'GRADIENT_RADIAL') {
            // 径向渐变：默认单位矩阵（从中心向外）
            gradientTransform = [
                [1, 0, 0],
                [0, 1, 0]
            ];
        }
        
        // 构建 Figma 渐变填充对象
        return {
            opacity: 1,
            blendMode: 'NORMAL',
            visible: true,
            type: gradientFigmaType,
            gradientStops: gradientStops,
            gradientTransform: gradientTransform
        };
        
    } catch (e) {
        console.warn('Failed to parse gradient:', backgroundImage, e);
        return null;
    }
}

// 主函数：JSON 数据转 Figma 节点
async function jsonDataToNode(jsonData, parentNode = null) {
    const element = parseJsonData(jsonData);
    if (!element) {
        console.log('No element')
        return null;
    }
    
    const rootNode = await elementToNode(element, parentNode);
    
    if (rootNode && !parentNode) {
        figma.currentPage.appendChild(rootNode);
    }
    
    return rootNode;
}

// 递归函数：将元素数据转换为 Figma 节点
async function elementToNode(elementData, parentNode) {
    if(!elementData){
        console.log('No elementData')
        return null;
    }
    
    const position = elementData.position || {};
    const styles = elementData.styles || {};
    const tagName = elementData.tagName || 'div';
    const inputType = elementData.inputType || null;
    const textContent = elementData.textContent;
    const children = elementData.children || [];
    //console.log(position,styles,tagName,inputType,textContent,children)
    // 尝试使用 SVG 处理器
    const svgNode = await SvgElementProcessor.process(elementData, position, styles, parentNode);
    if (svgNode) {
        // 递归处理子元素（SVG 通常没有子元素，但为了完整性保留）
        if (children && children.length > 0) {
            for (const child of children) {
                await elementToNode(child, svgNode);
            }
        }
        return svgNode;
    }
    
    // 解析 margin 值
    const parseMargin = (value) => {
        if (!value) return 0;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };
    
    const marginTop = parseMargin(styles.marginTop);
    const marginRight = parseMargin(styles.marginRight);
    const marginBottom = parseMargin(styles.marginBottom);
    const marginLeft = parseMargin(styles.marginLeft);
    
    // 检查是否有 margin（不都为0）
    const hasMargin = marginTop !== 0 || marginRight !== 0 || marginBottom !== 0 || marginLeft !== 0;
    
    // 获取位置和尺寸（容器的实际尺寸）
    let width = position.width || 0;
    let height = position.height || 0;
    
    // 确保 width 和 height 是有效数字
    width = typeof width === 'number' && !isNaN(width) ? Math.max(0, width) : 0;
    height = typeof height === 'number' && !isNaN(height) ? Math.max(0, height) : 0;
    
    // 判断是否需要使用自动尺寸（HUG 模式）
    const shouldUseHug = width <= 0 && height <= 0; // 宽高都为零时使用 HUG 模式
    
    // 确保传给 addFrame 的尺寸至少为 1（Figma 要求最小尺寸为 1）
    if (shouldUseHug) {
        width = 1; // 使用最小尺寸，让 HUG 模式自动调整
        height = 1;
    } else {
        if (width <= 0) {
            width = 1; // 使用最小宽度，而不是默认值 100
        }
        if (height <= 0) {
            height = 1; // 使用最小高度，而不是默认值 100
        }
    }
    
    // 处理位置：绝对定位的 TBLR 优先级高于 x/y
    const isAbsolute = styles.position === 'absolute' || styles.position === 'fixed';
    let absolutePosition = null; // 保存绝对定位的值，稍后处理
    
    // 解析定位值，支持百分比和数值
    const parseValue = (value) => {
        if (!value || value === 'auto') return null;
        
        // 如果是百分比，保存原始值，稍后根据父容器尺寸转换
        if (typeof value === 'string' && value.includes('%')) {
            const percent = parseFloat(value);
            if (!isNaN(percent)) {
                return { type: 'percent', value: percent };
            }
        }
        
        // 尝试解析为数值
        const num = parseFloat(value);
        if (!isNaN(num)) {
            return num;
        }
        
        // 无效值返回 null
        return null;
    };
    
    let x = position.x || 0;
    let y = position.y || 0;
    
    if (isAbsolute) {
        // 绝对定位：保存 top, right, bottom, left 值
        absolutePosition = {
            top: parseValue(styles.top),
            right: parseValue(styles.right),
            bottom: parseValue(styles.bottom),
            left: parseValue(styles.left)
        };
        
        // 如果有 TBLR 值，优先使用它们来计算 x/y（优先级高于 position.x/y）
        // 注意：这里先根据 TBLR 计算初始 x/y，后续在添加到父容器后还会根据父容器尺寸重新计算
        if (absolutePosition.left !== null && typeof absolutePosition.left === 'number') {
            x = absolutePosition.left;
        } else if (absolutePosition.right !== null && typeof absolutePosition.right === 'number') {
            // 如果只有 right，需要根据父容器宽度计算，这里先使用 position.x 作为占位
            // 后续在添加到父容器后会重新计算
            x = position.x || 0;
        }
        
        if (absolutePosition.top !== null && typeof absolutePosition.top === 'number') {
            y = absolutePosition.top;
        } else if (absolutePosition.bottom !== null && typeof absolutePosition.bottom === 'number') {
            // 如果只有 bottom，需要根据父容器高度计算，这里先使用 position.y 作为占位
            // 后续在添加到父容器后会重新计算
            y = position.y || 0;
        }
    }
    
    // 尝试使用文本处理器（inline span）
    // 检查是否是 span 元素，且子元素都是 span（用于合并多个 span 为一个文本节点）
    const isSpanWithSpanChildren = tagName === 'span' && 
                                   children && children.length > 0 &&
                                   children.every(child => child.tagName === 'span');
    
    // 尝试使用文本处理器（inline span）
    // 条件：没有子元素，或者子元素都是 span（用于合并多个 span 为一个文本节点）
    if (!children || children.length === 0 || isSpanWithSpanChildren) {
        // 获取父容器宽度（优先使用 parentNode.width，否则使用 position.width）
        const parentWidth = parentNode ? (parentNode.width || null) : (position.width || null);
        // 对于复合 span，whiteSpace 应该来自外层容器的 styles（elementData.styles），而不是 span 自身的 styles
        // 因为复合 span 只记录文本样式，whiteSpace 是布局相关的属性，应该从外层容器获取
        // 如果 elementData.styles 中有 whiteSpace，使用它；否则使用当前 styles.whiteSpace
        const whiteSpaceValue = (elementData && elementData.styles && elementData.styles.whiteSpace) 
            ? elementData.styles.whiteSpace 
            : styles.whiteSpace;
        
        const textNode = await TextElementProcessor.process(
            elementData, 
            styles, 
            textContent, 
            tagName, 
            parentWidth, 
            children,
            {
                isDirectText: false,
                parentNode: null, // 先不传入，等添加到父容器后再处理宽度
                whiteSpace: whiteSpaceValue
            }
        );
        if (textNode) {
            // 将文本节点添加到父容器中
            if (parentNode) {
                parentNode.appendChild(textNode);
                // 根据规则设置文本宽度（在添加到父容器后处理）
                // 对于复合 span，使用外层容器的 whiteSpace（已在 whiteSpaceValue 中获取）
                let stylesForWidth = JSON.parse(JSON.stringify(styles));
                if(isSpanWithSpanChildren && whiteSpaceValue){
                    stylesForWidth['whiteSpace'] = whiteSpaceValue;
                }
                applyTextWidthRules(textNode, parentNode, stylesForWidth, parentWidth);
            }

            return textNode;
        }
    }
    
    // 普通容器元素处理
    // 获取名称（优先使用 id，然后是 class，最后是 tagName）
    const nodeName = getNodeName(elementData, tagName);
    
    // 特殊处理：某些类型的 input 元素需要转换为普通元素
    const needsSpecialInputHandling = tagName === 'input' && inputType && ['checkbox', 'radio', 'file', 'range'].includes(inputType);
    
    let node = null;
    // 特殊处理：某些类型的 input 元素转换为普通 div 元素
    // 因为 checkbox, radio, file, range 等有默认样式，转换为普通元素更容易处理
    let actualTagName = needsSpecialInputHandling ? 'div' : tagName;
    
    // 处理背景颜色
    let fills = [];

    // 检查是否是透明色标记
    // 如果是透明色标记，fills 保持为空数组 []
    if(styles.backgroundColor && styles.backgroundColor !== '__TRANSPARENT__' && styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent'){
        try {
            fills = [toRGB(styles.backgroundColor, true)];
        } catch(e) {
            console.warn('Background color parse error:', e);
        }
    }
    //如果有渐变色，则设置渐变色
    if(styles.backgroundImage){
        try {
            let gradient = parseGradientFill(styles.backgroundImage);
            if(gradient){
                //console.log(gradient)
                // gradient 已经是一个完整的 Figma Paint 对象，可以直接使用
                fills.push(gradient);
            }
        } catch(e) {
            console.warn('Gradient parse error:', e);
        }
    }
    // 如果是特殊类型的 input，在名称中标注类型
    const frameName = needsSpecialInputHandling ? `${nodeName}_${inputType}` : nodeName;
    node = addFrame([width, height, x, y, frameName, fills]);
    
    
    // 设置圆角（优先使用四个角的单独属性）
    const parseRadius = (value) => {
        if (!value) return 0;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };
            
    const topLeft = parseRadius(styles.borderTopLeftRadius);
    const topRight = parseRadius(styles.borderTopRightRadius);
    const bottomRight = parseRadius(styles.borderBottomRightRadius);
    const bottomLeft = parseRadius(styles.borderBottomLeftRadius);
            
    // 如果四个角的单独属性都有值，使用它们
    if (topLeft > 0 || topRight > 0 || bottomRight > 0 || bottomLeft > 0) {
        node.topLeftRadius = topLeft;
        node.topRightRadius = topRight;
        node.bottomRightRadius = bottomRight;
        node.bottomLeftRadius = bottomLeft;
    } else if (styles.borderRadius) {
        // 如果没有单独属性，使用复合的 borderRadius
        const radius = parseRadius(styles.borderRadius);
        if (radius > 0) {
            [node.topLeftRadius, node.topRightRadius, node.bottomRightRadius, node.bottomLeftRadius] = [radius, radius, radius, radius];
        }
    }
            
    // 设置描边（使用四个边的单独属性）
    const parseBorderWidth = (value) => {
        if (!value) return 0;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };
            
    const parseBorderColor = (value) => {
        // 检查是否是透明色标记
        if (!value || value === '__TRANSPARENT__' || value === 'transparent' || value === 'rgba(0, 0, 0, 0)' || value === 'rgba(0,0,0,0)') {
            return null;
        }
        try {
            return toRGB(value, true);
        } catch(e) {
            console.warn('Border color parse error:', e);
            return null;
        }
    };
            
    const topWidth = parseBorderWidth(styles.borderTopWidth);
    const rightWidth = parseBorderWidth(styles.borderRightWidth);
    const bottomWidth = parseBorderWidth(styles.borderBottomWidth);
    const leftWidth = parseBorderWidth(styles.borderLeftWidth);
            
    // 如果四个边的单独属性都有值，使用它们
    if (topWidth > 0 || rightWidth > 0 || bottomWidth > 0 || leftWidth > 0) {
        // 获取各边的颜色（优先使用单独属性，否则使用通用属性）
        // 如果颜色是透明，不设置默认黑色
        const topColor = parseBorderColor(styles.borderTopColor) || parseBorderColor(styles.borderColor);
        const rightColor = parseBorderColor(styles.borderRightColor) || parseBorderColor(styles.borderColor);
        const bottomColor = parseBorderColor(styles.borderBottomColor) || parseBorderColor(styles.borderColor);
        const leftColor = parseBorderColor(styles.borderLeftColor) || parseBorderColor(styles.borderColor);
        
        // 设置各边的描边宽度
        node.strokeTopWeight = topWidth;
        node.strokeRightWeight = rightWidth;
        node.strokeBottomWeight = bottomWidth;
        node.strokeLeftWeight = leftWidth;
        
        /*
        // 根据 boxSizing 设置描边对齐方式
        // border-box: 宽度包含 padding 和 border，描边应该居外
        // border-box: 宽度不包含 padding 和 border，宽度包含padding和border，应该居内
        const boxSizing = styles.boxSizing || 'border-box';
        if(boxSizing === 'border-box'){
            node.strokeAlign = 'OUTSIDE';
        } else {
            // border-box 或其他情况，描边居内
            node.strokeAlign = 'INSIDE';
        }
            */
        //宽度全部计算了padding和border，描边统一居内
        node.strokeAlign = 'INSIDE';   
        
        // 设置描边颜色（如果各边颜色相同，使用单一颜色；否则需要分别设置）
        // 注意：Figma 的 setStroke 函数可能不支持各边不同颜色，这里先使用通用颜色
        const commonColor = topColor; // 使用顶部颜色作为通用颜色
        // 如果所有颜色都是 null（透明），设置 strokes 为空数组
        if (commonColor) {
            node.strokes = [commonColor];
        } else {
            node.strokes = [];
        }
        
        // 处理描边样式（dashed, dotted）
        // 获取各边的样式（优先使用单独属性，否则使用通用属性）
        const parseBorderStyle = (value) => {
            if (!value) return null;
            return value.toLowerCase().trim();
        };
        
        const topStyle = parseBorderStyle(styles.borderTopStyle) || parseBorderStyle(styles.borderStyle);
        const rightStyle = parseBorderStyle(styles.borderRightStyle) || parseBorderStyle(styles.borderStyle);
        const bottomStyle = parseBorderStyle(styles.borderBottomStyle) || parseBorderStyle(styles.borderStyle);
        const leftStyle = parseBorderStyle(styles.borderLeftStyle) || parseBorderStyle(styles.borderStyle);
        
        // 检查是否有 dashed 或 dotted 样式
        // 注意：Figma 的 dashPattern 是全局的，不能为各边单独设置
        // 如果各边样式不同，使用第一个非 solid 的样式
        // 注意：某些节点类型（如 TEXT）不支持 dashPattern，需要检查
        const allStyles = [topStyle, rightStyle, bottomStyle, leftStyle].filter(s => s && s !== 'solid' && s !== 'none');
        if (allStyles.length > 0) {
            const dashStyle = allStyles[0]; // 使用第一个非 solid 的样式
            
            // 检查节点是否支持 dashPattern（TEXT 节点不支持）
            if (node.type !== 'TEXT' && 'dashPattern' in node) {
                try {
                    if (dashStyle === 'dashed') {
                        // dashed: 使用 [5, 5] 模式（5px 实线，5px 空白）
                        // 根据描边宽度调整虚线长度
                        const avgWidth = (topWidth + rightWidth + bottomWidth + leftWidth) / 4 || 1;
                        const dashLength = Math.max(4, avgWidth * 2); // 至少 4px，或根据宽度调整
                        node.dashPattern = [dashLength, dashLength];
                    } else if (dashStyle === 'dotted') {
                        // dotted: 使用 [1, 2] 模式（1px 点，2px 空白）
                        const avgWidth = (topWidth + rightWidth + bottomWidth + leftWidth) / 4 || 1;
                        const dotLength = Math.max(1, avgWidth); // 点的大小
                        const gapLength = Math.max(2, avgWidth * 2); // 间距
                        node.dashPattern = [dotLength, gapLength];
                    }
                } catch (e) {
                    // 如果设置失败（节点不支持或属性只读），忽略错误
                    console.warn('Failed to set dashPattern:', e);
                }
            }
            // 如果是 'solid' 或 'none'，不设置 dashPattern（使用默认实线）
        }
    } else if (styles.borderWidth && parseBorderWidth(styles.borderWidth) > 0) {
        // 如果没有单独属性，使用复合的 borderWidth
        const borderWidth = parseBorderWidth(styles.borderWidth);
        const borderColor = parseBorderColor(styles.borderColor);
        // 如果边框颜色是透明，设置 strokes 为空数组
        if (borderColor) {
            setStroke(node, 'CENTER', [borderWidth, borderWidth, borderWidth, borderWidth], [borderColor]);
            
            // 处理描边样式（dashed, dotted）
            // 注意：某些节点类型（如 TEXT）不支持 dashPattern，需要检查
            const borderStyle = styles.borderStyle ? styles.borderStyle.toLowerCase().trim() : null;
            if (borderStyle === 'dashed' || borderStyle === 'dotted') {
                // 检查节点是否支持 dashPattern（TEXT 节点不支持）
                if (node.type !== 'TEXT' && 'dashPattern' in node) {
                    try {
                        if (borderStyle === 'dashed') {
                            // dashed: 使用 [5, 5] 模式
                            const dashLength = Math.max(4, borderWidth * 2);
                            node.dashPattern = [dashLength, dashLength];
                        } else if (borderStyle === 'dotted') {
                            // dotted: 使用 [1, 2] 模式
                            const dotLength = Math.max(1, borderWidth);
                            const gapLength = Math.max(2, borderWidth * 2);
                            node.dashPattern = [dotLength, gapLength];
                        }
                    } catch (e) {
                        // 如果设置失败（节点不支持或属性只读），忽略错误
                        console.warn('Failed to set dashPattern:', e);
                    }
                }
            }
        } else {
            // 透明边框，不设置描边
            node.strokes = [];
        }
    } else {
        // 没有边框宽度，确保 strokes 为空数组
        node.strokes = [];
    }
       
    // 设置自动布局（如果适用）
    // span 元素如果没有 flex 数据，默认按 H,LC（水平方向，左中对齐）
    // 宽高为零的元素也转为自动布局，自适应宽高
    // 有 padding 的元素也转为自动布局
    // 列表元素（ul, ol, li）也转为自动布局
    const isSpan = tagName === 'span';
    const isListElement = tagName === 'ul' || tagName === 'ol' || tagName === 'li';
    const hasFlexDisplay = styles.display === 'flex' || styles.display === 'inline-flex';
    // 只有当宽高都为 0 时，才认为是零尺寸（需要自动布局）
    // 如果只有其中一个为 0，应该使用实际的另一个值，不需要自动布局
    const hasZeroSize = (position.width || 0) <= 0 && (position.height || 0) <= 0;
            
    // 检查是否有 padding（不为零）
    const parsePadding = (value) => {
        if (!value) return 0;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };
    let paddingTop = parsePadding(styles.paddingTop);
    let paddingRight = parsePadding(styles.paddingRight);
    let paddingBottom = parsePadding(styles.paddingBottom);
    let paddingLeft = parsePadding(styles.paddingLeft);
    let hasPadding = paddingTop > 0 || paddingRight > 0 || paddingBottom > 0 || paddingLeft > 0;
    
    const shouldUseAutoLayout = hasFlexDisplay || (isSpan && !hasFlexDisplay) || hasZeroSize || hasPadding || isListElement;
    
    // 定义变量，用于在处理完子元素后检查 flexWrap
    let needsWrapCheck = false; // 标记是否需要检查换行
    let spacing = 0; // 间距
    // 注意：paddingLeft 和 paddingRight 已在上面声明（5931-5934行）
    
    // 对齐代码生成函数：第一个字母是T/B/C（垂直），第二个字母是L/R/C（水平）
    // 简化对齐判断逻辑
    function getAlign(dir, jc, ai) {
        let tb = 'T',lr = 'L'
        switch(ai){
            case 'center':
                if(dir === 'H'){
                     tb = 'C'  // H模式：alignItems控制副轴（垂直方向），应映射到tb
                }  else {
                    lr = 'C';  // V模式：alignItems控制副轴（水平方向），应映射到lr
                }
                break;
            case 'end':
                if(dir === 'H'){
                    tb = 'B';  // H模式：alignItems控制副轴（垂直方向），应映射到tb
                }  else {
                    lr = 'R';  // V模式：alignItems控制副轴（水平方向），应映射到lr
                }
                break;
            case 'space-between':
                // 注意：Figma的counterAxisAlignItems不支持SPACE_BETWEEN，但为了逻辑正确性，这里仍然正确映射
                if(dir === 'H'){
                    tb = 'S';  // H模式：alignItems控制副轴（垂直方向），应映射到tb
                }  else {
                    lr = 'S';  // V模式：alignItems控制副轴（水平方向），应映射到lr
                }
                break;
            case 'baseline':
                // 注意：Figma的基线对齐仅在H模式的次轴（垂直方向）可用
                // CSS中align-items: baseline是副轴对齐，Figma也限制baseline只能在H模式次轴使用
                if(dir === 'H'){
                    tb = 'A';  // H模式：baseline映射到次轴（垂直方向），即tb
                }  else {
                    // V模式不支持baseline，保持默认值或忽略
                }
                break;
        }
        switch(jc){
            case 'center':
                if(dir === 'H'){
                    lr = 'C';  // H模式：justifyContent控制主轴（水平方向），应映射到lr
                }  else {
                    tb = 'C';  // V模式：justifyContent控制主轴（垂直方向），应映射到tb
                }
                break;
            case 'end':
                if(dir === 'H'){
                    lr = 'R';  // H模式：justifyContent控制主轴（水平方向），应映射到lr
                }  else {
                    tb = 'B';  // V模式：justifyContent控制主轴（垂直方向），应映射到tb
                }
                break;
            case 'space-between':
                if(dir === 'H'){
                    lr = 'S';  // H模式：justifyContent控制主轴（水平方向），应映射到lr
                }  else {
                    tb = 'S';  // V模式：justifyContent控制主轴（垂直方向），应映射到tb
                }
                break;
            case 'baseline':
                // 注意：CSS的justify-content不支持baseline，如果出现baseline，应该忽略或报错
                // 但为了兼容性，如果出现，仅在H模式映射到次轴（因为Figma的baseline只能在H模式次轴使用）
                if(dir === 'H'){
                    tb = 'A';  // H模式：baseline映射到次轴（垂直方向），即tb
                }  else {
                    // V模式不支持baseline，保持默认值或忽略
                }
                break;
        }
        return tb + lr;
    };
    if(shouldUseAutoLayout){
        // 方向判断：根据 flexDirection 判断
        // flexWrap 是否触发换行取决于子容器宽度是否超出，需要在处理完子元素后判断
        let direction = 'V'; // 默认垂直方向（HTML是上下布局）
        
        if(isSpan || isListElement){
            direction = 'H';
        }
        if(hasFlexDisplay){
            if(styles.flexDirection === 'column'){
                direction = 'V';
            } else {
                // flexDirection === 'row' 或未设置
                // 如果 flexWrap 是 wrap，需要处理完子元素后判断是否换行
                if(styles.flexWrap && (styles.flexWrap === 'wrap' || styles.flexWrap === 'wrap-reverse')){
                    needsWrapCheck = true;
                    // 先假设会换行，使用 V（垂直布局），如果子元素不超出，后面会改为 H
                    direction = 'V';
                } else {
                    // flexWrap 是 nowrap 或未设置，使用水平方向
                    direction = 'H';
                }
            }
        }

        // 生成对齐代码
        let align = 'TL'; // 默认左上对齐
        if(hasFlexDisplay){
            align = getAlign(direction, styles.justifyContent, styles.alignItems);
        };
        if(tagName == 'input'){
            align = 'CL';
        };
        //根据padding和子元素大小进一步判断自动布局是否需要居中，提升还原体验，如不够精确可去掉
        if(!hasFlexDisplay && hasPadding && tagName !== 'input' && elementData.children && elementData.children.length > 0){
            //默认没flex但有padding时是V模式
            let trueNodes = elementData.children.filter(item => item.styles && item.styles.display !== 'none' && item.styles.visibility !== 'hidden' && item.styles.position !== 'absolute');
            if(trueNodes.length === 1){
                let tb,lr
                let childPos = trueNodes[0].position;
                let top = Number(childPos.top) || 0;
                let bottom = Number(childPos.bottom) || 0;
                let left = Number(childPos.left) || 0;
                let right = Number(childPos.right) || 0;
                if(top === -bottom && top !== 0){
                    tb = 'C'
                }else{
                    tb = 'T'
                }
                if(left === -right && left !== 0){
                    lr = 'C'
                }else{
                    lr = 'L'
                }
                align = tb + lr;
            }
        }
        
        spacing = parseFloat(styles.gap) || 0;
        
        // 保存 padding 值（用于后续计算可用宽度）
        paddingLeft = paddingLeft || 0;
        paddingRight = paddingRight || 0;
        
        // 使用上面已经解析好的 padding 值（paddingTop, paddingRight, paddingBottom, paddingLeft 已在函数开始处声明）
        let padding = [0, 0, 0, 0];
        
        // 如果四个边的单独属性都有值，使用它们
        if (paddingTop !== 0 || paddingRight !== 0 || paddingBottom !== 0 || paddingLeft !== 0) {
            padding = [paddingTop, paddingRight, paddingBottom, paddingLeft];
        } else if (styles.padding) {
            // 如果没有单独属性，使用复合的 padding
            const paddingValue = parsePadding(styles.padding);
            padding = [paddingValue, paddingValue, paddingValue, paddingValue];
        }
        //由于描边被宽度包括，padding需要加上描边宽度，四个边都要加
        padding[0] += topWidth;
        padding[1] += rightWidth;
        padding[2] += bottomWidth;
        padding[3] += leftWidth;
        // 根据是否需要 HUG 模式来决定使用 FIXED 还是 AUTO
        // 如果 shouldUseHug 为 true（尺寸为 0 且是 flex 容器），使用 AUTO（HUG）模式；否则使用 FIXED
        const useFixed = !shouldUseHug;
        
        addAutoLayout(node, [direction, align, spacing, padding], [useFixed, useFixed]);

        // 如果使用 FIXED 模式，确保节点尺寸正确设置
        if (useFixed && width > 0 && height > 0) {
            node.resize(width, height);
        } else if (shouldUseHug || hasZeroSize) {
            // 如果使用 HUG 模式（宽高为零），确保设置正确的尺寸模式
            node.layoutSizingHorizontal = 'HUG';
            node.layoutSizingVertical = 'HUG';
        }
        // 注意：flexWrap 的处理会在处理完子元素后进行，根据子元素宽度是否超出来判断
    }

    // 统一处理文本元素：使用 TextElementProcessor 处理直接文本（普通textContent）
    if(textContent){
        // 获取父容器宽度（优先使用 node.width，否则使用 position.width）
        const parentWidth = node ? (node.width || null) : (position.width || null);
        
        // 使用 TextElementProcessor 处理直接文本
        const textNode = await TextElementProcessor.process(
            elementData, 
            styles, 
            textContent, 
            tagName, 
            parentWidth, 
            null, // 直接文本没有子元素
            {
                isDirectText: true,
                parentNode: node,
                whiteSpace: styles.whiteSpace
            }
        );
        
        if(textNode){
            let isSpan = false;
            if(tagName == 'span'){
                isSpan = true;
            }
            textNode.name = '';
            // 注意：关于特殊tagname（input/textarea）不用再判断，是否自动布局是前置设置的
            node.appendChild(textNode);
            // 根据规则设置文本宽度（在添加到父容器后处理）
            applyTextWidthRules(textNode, node, styles, parentWidth, isSpan);
        }
    }
        
    // 检查 zIndex，如果是负数，需要将元素转移到父级的父级
    // 先计算 actualX 和 actualY，因为 marginFrame 的位置也需要考虑 zIndex
    const zIndex = styles.zIndex ? parseFloat(styles.zIndex) : null;
    const hasNegativeZIndex = zIndex !== null && !isNaN(zIndex) && zIndex < 0;
    
    // 确定实际的父节点和目标位置
    let actualParentNode = parentNode;
    let actualX = x;
    let actualY = y;
    
    if(hasNegativeZIndex && parentNode){
        // 如果 zIndex 是负数，将元素转移到父级的父级
        const grandParentNode = parentNode.parent;
        if(grandParentNode && grandParentNode !== figma.currentPage){
            // 计算相对于原父级的位置，转换为相对于祖父级的位置
            const parentX = parentNode.x || 0;
            const parentY = parentNode.y || 0;
            actualX = x + parentX;
            actualY = y + parentY;
            actualParentNode = grandParentNode;
        }
    }
    
    // 如果有 margin，且父容器是自动布局，才需要创建 marginFrame 容器
    // marginFrame 的目的是为了确保元素能有效从 position 设置 xy
    // 如果父元素不是自动布局，不会影响当前元素的 xy，所以不需要 marginFrame
    let marginFrame = null;
    const parentHasAutoLayout = actualParentNode && actualParentNode.layoutMode && actualParentNode.layoutMode !== 'NONE';
    if(hasMargin && parentHasAutoLayout){
        // 先创建一个临时的 marginFrame（尺寸会在递归完成后更新）
        const tempWidth = Math.max(1, width || 1);
        const tempHeight = Math.max(1, height || 1);
        const totalWidth = Math.max(1, tempWidth + marginLeft + marginRight);
        const totalHeight = Math.max(1, tempHeight + marginTop + marginBottom);
        
        // 使用 actualX 和 actualY 作为初始位置（会在递归完成后更新）
        const marginFrameName = (nodeName && typeof nodeName === 'string') ? (nodeName + '_margin') : '_margin';
        marginFrame = addFrame([totalWidth, totalHeight, actualX || x || 0, actualY || y || 0, marginFrameName, []]);
        marginFrame.fills = []; // 透明背景
        
        // 将 node 添加到 marginFrame 中，并设置位置（考虑 margin）
        marginFrame.appendChild(node);
        node.x = marginLeft;
        node.y = marginTop;
        
        // 注意：marginFrame 暂时不添加到父节点，等递归完成后再处理
    }
    
    // 设置 node 的位置
    // 注意：如果有 margin 且父容器是自动布局，node 已经在 marginFrame 中，位置已经设置为 marginLeft 和 marginTop
    // 如果没有 margin 或父容器不是自动布局，设置 node 的位置
    if(!hasMargin || !parentHasAutoLayout){
        node.x = actualX || x || 0;
        node.y = actualY || y || 0;
    }
    let finalNode = (hasMargin && parentHasAutoLayout && marginFrame) ? marginFrame : node;
        
    // 设置位置（相对于父节点）
    // 注意：如果有 margin 且父容器是自动布局，marginFrame 会在递归完成后添加到父节点
    if(actualParentNode){
        if(!hasMargin || !parentHasAutoLayout){
            finalNode.x = actualX || x || 0;
            finalNode.y = actualY || y || 0;
            
            // 确定插入位置
            let index = actualParentNode.children.length; // 默认添加到末尾（最上层）
            
            // 只有当元素被移出原容器时（如负zIndex），才需要特殊处理
            // 确保元素在原容器的下方（figma下标越小越底层）
            if(hasNegativeZIndex && parentNode && actualParentNode !== parentNode){
                // 找到原容器（parentNode）在 actualParentNode 中的位置
                const parentIndex = actualParentNode.children.findIndex(item => item.id === parentNode.id);
                if(parentIndex !== -1){
                    // 插入到原容器的位置（原容器会被推到上层）
                    index = parentIndex;
                }
            }
            
            actualParentNode.insertChild(index, finalNode);
        }
        // 如果有 margin 且父容器是自动布局，marginFrame 会在递归完成后添加到父节点
        // 如果有 margin 且父容器是自动布局，node 会在后面被添加到 actualParentNode，然后被移动到 marginFrame
        // 所以这里不需要添加到 actualParentNode
        
        // 如果父容器是自动布局，且当前元素是绝对定位，需要设置绝对定位
        // 注意：必须先添加到父容器，然后才能设置 layoutPositioning = 'ABSOLUTE'
        if(isAbsolute){
            // 如果有 margin 且父容器是自动布局，finalNode 是 marginFrame，但 marginFrame 还没有被添加到父节点
            // 所以应该对 node 设置 layoutPositioning（node 的父节点是 marginFrame）
            // 如果没有 margin 或父容器不是自动布局，finalNode 就是 node，直接设置即可
            const targetNode = (hasMargin && parentHasAutoLayout && marginFrame) ? node : finalNode;
            const targetParent = targetNode.parent;
            
            // 检查目标节点的父节点是否有自动布局
            if(targetParent && targetParent.layoutMode && targetParent.layoutMode !== 'NONE'){
                try {
                    // 直接设置，不需要判断 layoutPositioning 是否存在
                    // 如果节点不支持此属性，会抛出错误，我们捕获即可
                    targetNode.layoutPositioning = 'ABSOLUTE';
                } catch(e) {
                    // 某些节点类型可能不支持 layoutPositioning（如 TEXT 节点）
                    // 或者父节点实际上没有自动布局（Figma 内部验证）
                    console.warn('Failed to set layoutPositioning for absolute element:', {
                        targetNode: (targetNode && targetNode.name) || 'unknown',
                        targetNodeType: (targetNode && targetNode.type) || 'unknown',
                        targetParent: (targetParent && targetParent.name) || 'unknown',
                        targetParentLayoutMode: (targetParent && targetParent.layoutMode) || 'NONE',
                        hasMargin: hasMargin,
                        error: e
                    });
                }
            }
            
            // 计算描边宽度（用于 border-box 时的位置调整）
            const boxSizing = styles.boxSizing || 'border-box';
            const parseBorderWidth = (value) => {
                if (!value) return 0;
                const num = parseFloat(value);
                return isNaN(num) ? 0 : num;
            };
            const topWidth = parseBorderWidth(styles.borderTopWidth) || parseBorderWidth(styles.borderWidth) || 0;
            const rightWidth = parseBorderWidth(styles.borderRightWidth) || parseBorderWidth(styles.borderWidth) || 0;
            const bottomWidth = parseBorderWidth(styles.borderBottomWidth) || parseBorderWidth(styles.borderWidth) || 0;
            const leftWidth = parseBorderWidth(styles.borderLeftWidth) || parseBorderWidth(styles.borderWidth) || 0;
            
            // 辅助函数：将定位值转换为像素值（处理百分比和数值）
            const convertToPixels = (value, parentSize) => {
                if (value === null || value === undefined) return null;
                
                // 如果是百分比对象
                if (typeof value === 'object' && value.type === 'percent') {
                    if (parentSize && parentSize > 0) {
                        return (value.value / 100) * parentSize;
                    }
                    return null; // 无法转换百分比，返回 null
                }
                
                // 如果是数值，直接返回
                if (typeof value === 'number' && !isNaN(value)) {
                    return value;
                }
                
                // 无效值返回 null
                return null;
            };
            
            // 根据 top/left/right/bottom 计算位置
            let absX = actualX;
            let absY = actualY;
            
            // 获取父容器的实际尺寸（对于自动布局的容器，优先使用 absoluteRenderBounds 或 absoluteBoundingBox）
            const getParentSize = (node, dimension) => {
                if (!node) return 0;
                // 优先使用 absoluteRenderBounds（更准确）
                if (node.absoluteRenderBounds) {
                    return dimension === 'width' ? node.absoluteRenderBounds.width : node.absoluteRenderBounds.height;
                }
                // 其次使用 absoluteBoundingBox
                if (node.absoluteBoundingBox) {
                    return dimension === 'width' ? node.absoluteBoundingBox.width : node.absoluteBoundingBox.height;
                }
                // 最后使用 width/height 属性
                return dimension === 'width' ? (node.width || 0) : (node.height || 0);
            };
            
            const parentWidth = getParentSize(actualParentNode, 'width');
            const parentHeight = getParentSize(actualParentNode, 'height');
            
            // 如果 absolutePosition 存在，使用它来计算位置
            if (absolutePosition) {
                // 如果设置了 left，使用 left
                const leftValue = convertToPixels(absolutePosition.left, parentWidth);
                if (leftValue !== null) {
                    // 如果是 border-box 且描边居内，需要考虑描边宽度
                    if(boxSizing === 'border-box'){
                        absX = leftValue + leftWidth;
                    } else {
                        absX = leftValue;
                    }
                } else {
                    // 如果设置了 right，需要从父容器宽度计算
                    const rightValue = convertToPixels(absolutePosition.right, parentWidth);
                    if (rightValue !== null) {
                        // 如果是 border-box 且描边居内，需要考虑描边宽度
                        if(boxSizing === 'border-box'){
                            absX = parentWidth - width - rightWidth - rightValue;
                        } else {
                            absX = parentWidth - width - rightValue;
                        }
                    }
                }
                
                // 如果设置了 top，使用 top
                const topValue = convertToPixels(absolutePosition.top, parentHeight);
                if (topValue !== null) {
                    // 如果是 border-box 且描边居内，需要考虑描边宽度
                    if(boxSizing === 'border-box'){
                        absY = topValue + topWidth;
                    } else {
                        absY = topValue;
                    }
                } else {
                    // 如果设置了 bottom，需要从父容器高度计算
                    const bottomValue = convertToPixels(absolutePosition.bottom, parentHeight);
                    if (bottomValue !== null) {
                        // 如果是 border-box 且描边居内，需要考虑描边宽度
                        //console.log('DEBUG 222: bottom分支进入, boxSizing=', boxSizing, 'bottom=', bottomValue);
                        if(boxSizing === 'border-box'){
                            //console.log(222, parentHeight, height, bottomWidth, bottomValue)
                            absY = parentHeight - height - bottomWidth - bottomValue;
                        } else {
                            absY = parentHeight - height - bottomValue;
                            //console.log(333, parentHeight, height, bottomValue)
                        }
                    }
                }
            }
            
            // 设置绝对定位的位置（即使所有定位值都是 'auto'，也使用默认位置）
            finalNode.x = absX;
            finalNode.y = absY;
            
        } else if (isAbsolute && actualParentNode) {
            // 如果父容器不是自动布局，但元素是绝对定位，仍然需要根据定位值设置位置
            // 注意：在非自动布局的父容器中，layoutPositioning 可能不起作用，但应该尝试设置
            try {
                if(finalNode.layoutPositioning){
                    finalNode.layoutPositioning = 'ABSOLUTE';
                }
            } catch (e) {
                // 如果设置失败（可能因为父容器不支持），忽略错误
                //console.warn('Failed to set layoutPositioning for absolute element in non-auto-layout parent:', e);
            }
            
            // 即使父容器不是自动布局，如果元素是绝对定位，也应该根据定位值设置位置
            if (absolutePosition) {
                const boxSizing = styles.boxSizing || 'border-box';
                const parseBorderWidth = (value) => {
                    if (!value) return 0;
                    const num = parseFloat(value);
                    return isNaN(num) ? 0 : num;
                };
                const topWidth = parseBorderWidth(styles.borderTopWidth) || parseBorderWidth(styles.borderWidth) || 0;
                const rightWidth = parseBorderWidth(styles.borderRightWidth) || parseBorderWidth(styles.borderWidth) || 0;
                const bottomWidth = parseBorderWidth(styles.borderBottomWidth) || parseBorderWidth(styles.borderWidth) || 0;
                const leftWidth = parseBorderWidth(styles.borderLeftWidth) || parseBorderWidth(styles.borderWidth) || 0;
                
                // 辅助函数：将定位值转换为像素值（处理百分比和数值）
                const convertToPixels = (value, parentSize) => {
                    if (value === null || value === undefined) return null;
                    
                    // 如果是百分比对象
                    if (typeof value === 'object' && value.type === 'percent') {
                        if (parentSize && parentSize > 0) {
                            return (value.value / 100) * parentSize;
                        }
                        return null; // 无法转换百分比，返回 null
                    }
                    
                    // 如果是数值，直接返回
                    if (typeof value === 'number' && !isNaN(value)) {
                        return value;
                    }
                    
                    // 无效值返回 null
                    return null;
                };
                
                // 获取父容器的实际尺寸（对于自动布局的容器，优先使用 absoluteRenderBounds 或 absoluteBoundingBox）
                const getParentSize = (node, dimension) => {
                    if (!node) return 0;
                    // 优先使用 absoluteRenderBounds（更准确）
                    if (node.absoluteRenderBounds) {
                        return dimension === 'width' ? node.absoluteRenderBounds.width : node.absoluteRenderBounds.height;
                    }
                    // 其次使用 absoluteBoundingBox
                    if (node.absoluteBoundingBox) {
                        return dimension === 'width' ? node.absoluteBoundingBox.width : node.absoluteBoundingBox.height;
                    }
                    // 最后使用 width/height 属性
                    return dimension === 'width' ? (node.width || 0) : (node.height || 0);
                };
                
                const parentWidth = getParentSize(actualParentNode, 'width');
                const parentHeight = getParentSize(actualParentNode, 'height');
                
                // 根据 top/left/right/bottom 计算位置
                let absX = finalNode.x || 0;
                let absY = finalNode.y || 0;
                
                // 如果设置了 left，使用 left
                const leftValue = convertToPixels(absolutePosition.left, parentWidth);
                if (leftValue !== null) {
                    if(boxSizing === 'border-box'){
                        absX = leftValue + leftWidth;
                    } else {
                        absX = leftValue;
                    }
                } else {
                    // 如果设置了 right，需要从父容器宽度计算
                    const rightValue = convertToPixels(absolutePosition.right, parentWidth);
                    if (rightValue !== null) {
                        if(boxSizing === 'border-box'){
                            absX = parentWidth - width - rightWidth - rightValue;
                        } else {
                            absX = parentWidth - width - rightValue;
                        }
                    }
                }
                
                // 如果设置了 top，使用 top
                const topValue = convertToPixels(absolutePosition.top, parentHeight);
                if (topValue !== null) {
                    if(boxSizing === 'border-box'){
                        absY = topValue + topWidth;
                    } else {
                        absY = topValue;
                    }
                } else {
                    // 如果设置了 bottom，需要从父容器高度计算
                    const bottomValue = convertToPixels(absolutePosition.bottom, parentHeight);
                    if (bottomValue !== null) {
                        if(boxSizing === 'border-box'){
                            absY = parentHeight - height - bottomWidth - bottomValue;
                        } else {
                            absY = parentHeight - height - bottomValue;
                        }
                    }
                }
                
                // 设置绝对定位的位置
                finalNode.x = absX;
                finalNode.y = absY;
            }
        }
    }

    // 处理 transform
    if(styles.transform && styles.transform !== 'none'){
        try {
            // 解析 transform 字符串
            // 例如: "translate(10px, 20px) rotate(45deg) scale(1.5)" 或 "matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)"
            const transformStr = styles.transform.trim();
            
            // 优先处理 matrix 格式（浏览器计算后的 transform 通常是 matrix 格式）
            const matrixMatch = transformStr.match(/matrix\(([^)]+)\)/);
            if(matrixMatch){
                const matrixValues = matrixMatch[1].split(',').map(v => parseFloat(v.trim()));
                if(matrixValues.length === 6 && !matrixValues.some(v => isNaN(v))){
                    // matrix(a, b, c, d, e, f) 格式
                    // CSS transform matrix 格式：
                    // [a  c  e]
                    // [b  d  f]
                    // [0  0  1]
                    // Figma 的 relativeTransform 也是 3x3 矩阵，可以直接映射
                    const [a, b, c, d, e, f] = matrixValues;
                    
                    // 直接映射到 Figma 的 relativeTransform
                    // Figma 格式：[[a, c, e], [b, d, f], [0, 0, 1]]
                    finalNode.relativeTransform = [
                        [a, c, finalNode.x],
                        [b, d, finalNode.y]
                    ];
                }
            } else {
                // 如果不是 matrix 格式，使用原来的解析逻辑
                // 提取 translate 值
                const translateMatch = transformStr.match(/translate\(([^)]+)\)/);
                if(translateMatch){
                    const translateValues = translateMatch[1].split(',').map(v => parseFloat(v.trim()));
                    if(translateValues.length >= 2 && !isNaN(translateValues[0]) && !isNaN(translateValues[1])){
                        x += translateValues[0];
                        y += translateValues[1];
                    } else if(translateValues.length === 1 && !isNaN(translateValues[0])){
                        x += translateValues[0];
                    }
                }
                
                // 提取 translateX 值
                const translateXMatch = transformStr.match(/translateX\(([^)]+)\)/);
                if(translateXMatch){
                    const tx = parseFloat(translateXMatch[1]);
                    if(!isNaN(tx)) x += tx;
                }
                
                // 提取 translateY 值
                const translateYMatch = transformStr.match(/translateY\(([^)]+)\)/);
                if(translateYMatch){
                    const ty = parseFloat(translateYMatch[1]);
                    if(!isNaN(ty)) y += ty;
                }
                
                // 提取 rotate 值（转换为弧度）
                const rotateMatch = transformStr.match(/rotate\(([^)]+)\)/);
                if(rotateMatch){
                    const rotateValue = rotateMatch[1].trim();
                    // 支持 deg 和 rad 单位
                    let angle = 0;
                    if(rotateValue.includes('deg')){
                        angle = parseFloat(rotateValue) * Math.PI / 180;
                    } else if(rotateValue.includes('rad')){
                        angle = parseFloat(rotateValue);
                    } else {
                        // 默认当作度
                        angle = parseFloat(rotateValue) * Math.PI / 180;
                    }
                    if(!isNaN(angle)){
                        finalNode.rotation = angle;
                    }
                }
                
                // 提取 scale 值
                const scaleMatch = transformStr.match(/scale\(([^)]+)\)/);
                if(scaleMatch){
                    const scaleValues = scaleMatch[1].split(',').map(v => parseFloat(v.trim()));
                    if(scaleValues.length >= 2 && !isNaN(scaleValues[0]) && !isNaN(scaleValues[1])){
                        // Figma 使用 relativeTransform 来处理缩放
                        const scaleX = scaleValues[0];
                        const scaleY = scaleValues[1];
                        finalNode.relativeTransform = [
                            [scaleX, 0, 0],
                            [0, scaleY, 0]
                        ];
                    } else if(scaleValues.length === 1 && !isNaN(scaleValues[0])){
                        const scale = scaleValues[0];
                        finalNode.relativeTransform = [
                            [scale, 0, 0],
                            [0, scale, 0]
                        ];
                    }
                }
                
                // 提取 scaleX 值
                const scaleXMatch = transformStr.match(/scaleX\(([^)]+)\)/);
                if(scaleXMatch){
                    const sx = parseFloat(scaleXMatch[1]);
                    if(!isNaN(sx)){
                        const currentTransform = finalNode.relativeTransform || [[1, 0, 0], [0, 1, 0]];
                        finalNode.relativeTransform = [
                            [sx, currentTransform[0][1], currentTransform[0][2]],
                            [currentTransform[1][0], currentTransform[1][1], currentTransform[1][2]]
                        ];
                    }
                }
                
                // 提取 scaleY 值
                const scaleYMatch = transformStr.match(/scaleY\(([^)]+)\)/);
                if(scaleYMatch){
                    const sy = parseFloat(scaleYMatch[1]);
                    if(!isNaN(sy)){
                        const currentTransform = finalNode.relativeTransform || [[1, 0, 0], [0, 1, 0]];
                        finalNode.relativeTransform = [
                            [currentTransform[0][0], currentTransform[0][1], currentTransform[0][2]],
                            [currentTransform[1][0], sy, currentTransform[1][2]]
                        ];
                    }
                }
                
                // 提取 skew 值
                const skewMatch = transformStr.match(/skew\(([^)]+)\)/);
                if(skewMatch){
                    const skewValues = skewMatch[1].split(',').map(v => parseFloat(v.trim()) * Math.PI / 180);
                    if(skewValues.length >= 2 && !isNaN(skewValues[0]) && !isNaN(skewValues[1])){
                        const skewX = Math.tan(skewValues[0]);
                        const skewY = Math.tan(skewValues[1]);
                        finalNode.relativeTransform = [
                            [1, skewX, 0],
                            [skewY, 1, 0]
                        ];
                    }
                }
            }
        } catch(e) {
            console.warn('Transform parse error:', e);
        }
    }

    // 应用基础样式（display: none, opacity）
    applyBasicStyles(finalNode, styles);

    // 绝对定位节点也需要设置超出裁剪（在设置绝对定位之后）
    if (styles.overflow || styles.overflowX || styles.overflowY) {
        const overflow = styles.overflow || 'visible';
        const overflowX = styles.overflowX || overflow;
        const overflowY = styles.overflowY || overflow;
        if (overflowX === 'hidden' || overflowX === 'scroll' || 
            overflowY === 'hidden' || overflowY === 'scroll') {
            finalNode.clipsContent = true;
        } else {
            finalNode.clipsContent = false;
        }
    }

    // 递归处理子元素（添加到 node）
    if(children && children.length > 0){
        for(const child of children){
            await elementToNode(child, node);
        }
    }

    // 处理 flexWrap：根据子容器宽度是否超出来判断使用 H 还是 V
    // flexWrap 是否触发换行取决于子容器宽度是否超出父容器
    /*还是太粗暴了，后续再优化，先保留本身的flexWrap
    if(needsWrapCheck && hasFlexDisplay && node.children && node.children.length > 0 && node.layoutMode){
        // 计算子元素的总宽度（包括间距）
        let totalChildWidth = 0;
        const childSpacing = spacing || 0;
        for(let i = 0; i < node.children.length; i++){
            const child = node.children[i];
            if(child.width){
                totalChildWidth += child.width;
                if(i > 0){
                    totalChildWidth += childSpacing; // 添加间距
                }
            }
        }
        
        // 获取父容器宽度（考虑 padding）
        const containerWidth = node.width || width || 0;
        const containerPadding = (paddingLeft || 0) + (paddingRight || 0);
        const availableWidth = containerWidth - containerPadding;
        
        // 如果子元素总宽度超过父容器宽度，说明会换行，应该用 V（垂直布局）
        // 否则用 H（水平布局）
        if(totalChildWidth > availableWidth && availableWidth > 0){
            // 会换行，使用 V（垂直布局）
            if(node.layoutMode === 'HORIZONTAL'){
                // 需要改为垂直布局
                node.layoutMode = 'VERTICAL';
                // 重新生成对齐代码（因为方向改变了）
                let newAlign = getAlign('V', styles.justifyContent, styles.alignItems);
                // 更新对齐设置
                if(newAlign){
                    const v = newAlign[0];
                    const h = newAlign[1];
                    // 更新 primaryAxisAlignItems（垂直方向）
                    if(v === 'T') node.primaryAxisAlignItems = 'MIN';
                    else if(v === 'C') node.primaryAxisAlignItems = 'CENTER';
                    else if(v === 'B') node.primaryAxisAlignItems = 'MAX';
                    // 更新 counterAxisAlignItems（水平方向）
                    if(h === 'L') node.counterAxisAlignItems = 'MIN';
                    else if(h === 'C') node.counterAxisAlignItems = 'CENTER';
                    else if(h === 'R' || h === 'B') node.counterAxisAlignItems = 'MAX';
                }
            }
        } else {
            // 不会换行，使用 H（水平布局）
            if(node.layoutMode === 'VERTICAL'){
                // 需要改为水平布局
                node.layoutMode = 'HORIZONTAL';
                // 重新生成对齐代码（因为方向改变了）
                let newAlign = getAlign('H', styles.justifyContent, styles.alignItems);
                // 更新对齐设置
                if(newAlign){
                    const v = newAlign[0];
                    const h = newAlign[1];
                    // 更新 primaryAxisAlignItems（水平方向）
                    if(h === 'L') node.primaryAxisAlignItems = 'MIN';
                    else if(h === 'C') node.primaryAxisAlignItems = 'CENTER';
                    else if(h === 'R' || h === 'B') node.primaryAxisAlignItems = 'MAX';
                    // 更新 counterAxisAlignItems（垂直方向）
                    if(v === 'T') node.counterAxisAlignItems = 'MIN';
                    else if(v === 'C') node.counterAxisAlignItems = 'CENTER';
                    else if(v === 'B') node.counterAxisAlignItems = 'MAX';
                }
            }
        }
    }
    */
   if(needsWrapCheck && hasFlexDisplay && node.layoutMode){
        node.layoutMode = 'HORIZONTAL';
        node.layoutWrap = 'WRAP';
   }
    
    // 最后处理 margin：如果有 margin 且父容器是自动布局，更新 marginFrame 的尺寸和位置，然后添加到父节点
    // 注意：必须在所有子元素处理完成后，才能准确获取 node 的实际尺寸和位置
    // 这样可以避免子元素解析失败时影响 marginFrame 的坐标
    // 只有当父容器是自动布局时才需要 marginFrame
    if(hasMargin && marginFrame && parentHasAutoLayout){
        // 使用 node 的实际尺寸（自动布局换行后可能已经改变）
        const actualNodeWidth = node.width || width || 1;
        const actualNodeHeight = node.height || height || 1;
        
        // 计算包含 margin 的总尺寸
        const totalWidth = Math.max(1, actualNodeWidth + marginLeft + marginRight);
        const totalHeight = Math.max(1, actualNodeHeight + marginTop + marginBottom);
        
        // 更新 marginFrame 的尺寸
        marginFrame.resize(totalWidth, totalHeight);
        
        // 获取 node 的当前位置（相对于 marginFrame 的父节点，如果存在）
        // 注意：此时 node 已经在 marginFrame 中，node.x 和 node.y 是相对于 marginFrame 的
        // 需要获取 marginFrame 应该相对于其父节点的位置
        let marginFrameX, marginFrameY;
        
        // 如果原元素是绝对定位，需要使用绝对定位的坐标计算逻辑
        // 否则使用 actualX 和 actualY
        if(isAbsolute && absolutePosition && actualParentNode){
            // 使用绝对定位的坐标计算逻辑（与 6257-6391 行的逻辑一致）
            const boxSizing = styles.boxSizing || 'border-box';
            const parseBorderWidth = (value) => {
                if (!value) return 0;
                const num = parseFloat(value);
                return isNaN(num) ? 0 : num;
            };
            const topWidth = parseBorderWidth(styles.borderTopWidth) || parseBorderWidth(styles.borderWidth) || 0;
            const rightWidth = parseBorderWidth(styles.borderRightWidth) || parseBorderWidth(styles.borderWidth) || 0;
            const bottomWidth = parseBorderWidth(styles.borderBottomWidth) || parseBorderWidth(styles.borderWidth) || 0;
            const leftWidth = parseBorderWidth(styles.borderLeftWidth) || parseBorderWidth(styles.borderWidth) || 0;
            
            // 辅助函数：将定位值转换为像素值（处理百分比和数值）
            const convertToPixels = (value, parentSize) => {
                if (value === null || value === undefined) return null;
                if (typeof value === 'object' && value.type === 'percent') {
                    if (parentSize && parentSize > 0) {
                        return (value.value / 100) * parentSize;
                    }
                    return null;
                }
                if (typeof value === 'number' && !isNaN(value)) {
                    return value;
                }
                return null;
            };
            
            // 获取父容器的实际尺寸
            const getParentSize = (node, dimension) => {
                if (!node) return 0;
                if (node.absoluteRenderBounds) {
                    return dimension === 'width' ? node.absoluteRenderBounds.width : node.absoluteRenderBounds.height;
                }
                if (node.absoluteBoundingBox) {
                    return dimension === 'width' ? node.absoluteBoundingBox.width : node.absoluteBoundingBox.height;
                }
                return dimension === 'width' ? (node.width || 0) : (node.height || 0);
            };
            
            const parentWidth = getParentSize(actualParentNode, 'width');
            const parentHeight = getParentSize(actualParentNode, 'height');
            
            // 根据 top/left/right/bottom 计算位置
            let absX = actualX || x || 0;
            let absY = actualY || y || 0;
            
            // 如果设置了 left，使用 left
            const leftValue = convertToPixels(absolutePosition.left, parentWidth);
            if (leftValue !== null) {
                if(boxSizing === 'border-box'){
                    absX = leftValue + leftWidth;
                } else {
                    absX = leftValue;
                }
            } else {
                // 如果设置了 right，需要从父容器宽度计算
                const rightValue = convertToPixels(absolutePosition.right, parentWidth);
                if (rightValue !== null) {
                    if(boxSizing === 'border-box'){
                        absX = parentWidth - width - rightWidth - rightValue;
                    } else {
                        absX = parentWidth - width - rightValue;
                    }
                }
            }
            
            // 如果设置了 top，使用 top
            const topValue = convertToPixels(absolutePosition.top, parentHeight);
            if (topValue !== null) {
                if(boxSizing === 'border-box'){
                    absY = topValue + topWidth;
                } else {
                    absY = topValue;
                }
            } else {
                // 如果设置了 bottom，需要从父容器高度计算
                const bottomValue = convertToPixels(absolutePosition.bottom, parentHeight);
                if (bottomValue !== null) {
                    if(boxSizing === 'border-box'){
                        absY = parentHeight - height - bottomWidth - bottomValue;
                    } else {
                        absY = parentHeight - height - bottomValue;
                    }
                }
            }
            
            marginFrameX = absX;
            marginFrameY = absY;
        } else {
            // 如果不是绝对定位，使用 actualX 和 actualY（考虑了 zIndex 的情况）
            marginFrameX = actualX || x || 0;
            marginFrameY = actualY || y || 0;
        }
        
        // 设置 marginFrame 的位置
        marginFrame.x = marginFrameX;
        marginFrame.y = marginFrameY;
        
        // 将 marginFrame 添加到父节点（如果存在）
        if(actualParentNode){
            // 确定插入位置
            let index = actualParentNode.children.length; // 默认添加到末尾（最上层）
            
            // 只有当元素被移出原容器时（如负zIndex），才需要特殊处理
            if(hasNegativeZIndex && parentNode && actualParentNode !== parentNode){
                const parentIndex = actualParentNode.children.findIndex(item => item.id === parentNode.id);
                if(parentIndex !== -1){
                    index = parentIndex;
                }
            }
            
            actualParentNode.insertChild(index, marginFrame);
            // 确保位置正确（因为 insertChild 可能会影响位置）
            marginFrame.x = marginFrameX;
            marginFrame.y = marginFrameY;
        }
        
        // 如果原容器（node）是绝对定位，marginFrame 也要继承设置绝对定位
        // 检查 node 是否是绝对定位（通过 layoutPositioning 或 styles.position）
        const nodeIsAbsolute = node.layoutPositioning === 'ABSOLUTE' || isAbsolute;
        if(nodeIsAbsolute && actualParentNode && actualParentNode.layoutMode && actualParentNode.layoutMode !== 'NONE'){
            // 如果 marginFrame 的父节点是自动布局，设置 marginFrame 为绝对定位
            try {
                marginFrame.layoutPositioning = 'ABSOLUTE';
                // 重要：设置 ABSOLUTE 后，Figma 可能会重新排列元素，导致坐标被改变
                // 需要重新设置坐标，使用之前计算好的 marginFrameX 和 marginFrameY
                marginFrame.x = marginFrameX;
                marginFrame.y = marginFrameY;
            } catch (e) {
                // 如果设置失败（可能因为父容器不支持），忽略错误
                console.warn('Failed to set layoutPositioning for marginFrame:', e);
            }
        }
        
        finalNode = marginFrame;
    }
    
    return finalNode;
}

const BASIC_PROPS = [
    "a",//RGBA-A
    "absoluteBoundingBox",//定界框
    "absoluteRenderBounds",//渲染框
    "absoluteTransform",//绝对变换
    "b",//RGBA-B
    "blendMode",//混合模式
    "booleanOperation",//布尔运算
    "characters",//字符
    "children",//子元素
    "clipsContent",//是否裁剪边界
    "color",//颜色
    "componentProperties",//组件属性
    //"constrainProportions",约束比例（被阻止读取，要用"targetAspectRatio"方法，不作为属性存在）
    "componentPropertyDefinitions",//组件属性定义
    "componentPropertyReferences",//组件属性引用
    "constraints",//约束
    "contrast",//滤镜-对比度
    "cornerRadius",//圆角
    "cornerSmoothing",//圆角平滑
    "counterAxisAlignContent",//次轴对齐
    "counterAxisAlignItems",//子元素次轴对齐
    "counterAxisSizingMode",//次轴缩放模式
    "counterAxisSpacing",//次轴间距
    "dashPattern",//虚线模式
    "effectStyleId",//效果样式
    "effects",//效果
    "exportSettings",//导出设置
    "exposure",//滤镜-曝光
    "fillStyleId",//填充样式
    "fills",//填充
    "filters",//滤镜
    "fontName",//字体名称
    "family",//字体家族
    "style",//字重名
    "fontSize",//字体大小
    "fontWeight",//字重数值
    "g",//RGBA-G
    "gridStyleId",//网格样式
    "guides",//引导线
    "horizontal",//水平
    "vertical",//垂直
    "hangingPunctuation",//标点符号悬挂处理
    "hangingList",//列表符号悬挂处理
    "height",//高度
    "highlights",//滤镜-高光
    "hyperlink",//超链接
    "id",//ID
    "isMask",//是否遮罩
    "itemSpacing",//子元素间距
    "imageHash",//图片哈希
    "imageTransform",//图片变换
    "key",//关键字
    "layoutAlign",//布局对齐
    "layoutGrids",//网格布局
    "alignment",//网格布局-对齐
    "count",//网格布局-数量
    "gutterSize",//网格布局-间距
    "offset",//网格布局-偏移
    "pattern",//网格布局-模式
    "sectionSize",//网格布局-段落大小
    "layoutGrow",//布局增长
    "layoutMode",//布局模式
    "layoutPositioning",//布局位置
    "layoutSizingHorizontal",//布局水平缩放
    "layoutSizingVertical",//布局垂直缩放
    "letterSpacing",//字母间距
    "lineHeight",//行高
    "listOptions",//列表选项
    "listSpacing",//列表间距
    "locked",//锁定图层
    "maxHeight",//最大高度
    "maxWidth",//最大宽度
    "minHeight",//最小高度
    "minWidth",//最小宽度
    "mainComponent",//主组件
    "name",//名称
    "numberOfFixedChildren",//固定子元素数量
    "opacity",//透明度
    "offset",//偏移
    "paddingBottom",//下内边距
    "paddingLeft",//左内边距
    "paddingRight",//右内边距
    "paddingTop",//上内边距
    "paragraphIndent",//段落缩进
    "paragraphSpacing",//段落间距
    "parent",//父级
    "primaryAxisAlignItems",//子元素主轴对齐
    "primaryAxisSizingMode",//子元素主轴缩放模式
    "r",//RGBA-R
    "relativeTransform",//相对变换
    "rotation",//旋转
    "saturation",//滤镜-饱和度
    "shadows",//滤镜-阴影
    "strokeAlign",//描边对齐
    "strokeCap",//描边端点
    "strokeGeometry",//描边几何
    "strokeJoin",//描边连接
    "strokeMiterAngle",//描边斜接角度
    "strokeMiterLimit",//描边斜接限制
    "strokeStyleId",//描边样式
    "strokeWeight",//描边宽度
    "strokeLeftWeight",//描边宽度-左
    "strokeRightWeight",//描边宽度-右
    "strokeTopWeight",//描边宽度-上
    "strokeBottomWeight",//描边宽度-下
    "strokes",//描边填充
    "targetAspectRatio",//目标宽高比
    "topLeftRadius",//圆角-左上
    "topRightRadius",//圆角-右上
    "bottomLeftRadius",//圆角-左下
    "bottomRightRadius",//圆角-右下
    "temperature",//滤镜-温度
    "tint",//滤镜-色调
    "textAlignHorizontal",//文本水平对齐
    "textAlignVertical",//文本垂直对齐
    "textAutoResize",//文本自动调整
    "textCase",//文本大小写
    "textDecoration",//文本装饰
    "textStyleId",//文本样式
    "textSvgHash",//文本SVG哈希
    "type",//类型
    "variantProperties",//变体属性
    "vectorPaths",//矢量路径
    "visible",//可见
    "width",//宽度
    "x",//X
    "y",//Y
]
//将Figma节点转换为可序列化的JSON对象
function nodeToJSON(node, visited = new WeakSet(), depth = 0, maxDepth = 10, isChild = false){
    if(!node || depth > maxDepth){
        return null;
    };
    //避免循环引用（但允许children正常序列化）
    //isChild为true时表示这是children中的节点，允许继续处理
    if(typeof node === 'object' && visited.has(node) && !isChild){
        return '[Circular Reference]';
    };
    //只有不在visited中的节点才添加到visited，避免重复添加
    if(typeof node === 'object' && !visited.has(node)){
        visited.add(node);
    };
    let result = {};
    //获取节点的所有可枚举属性
    try {
        for(let prop of BASIC_PROPS){
            try {
                if(prop in node){
                    let value = node[prop];
                    //跳过函数
                    if(typeof value === 'function'){
                        continue;
                    };
                    //处理特殊类型
                    if(value === null || value === undefined){
                        result[prop] = value;
                    } else if(Array.isArray(value)){
                        //特殊处理：absoluteTransform和relativeTransform是数组的数组（数字矩阵），直接序列化
                        if(prop === 'absoluteTransform' || prop === 'relativeTransform' || prop === 'imageTransform'){
                            result[prop] = value.map(row => {
                                if(Array.isArray(row)){
                                    // 数字数组直接返回
                                    return [...row];
                                };
                                return row;
                            });
                        } else {
                            result[prop] = value.map(item => {
                                if(typeof item === 'object' && item !== null){
                                    return nodeToJSON(item, visited, depth + 1, maxDepth, false);
                                };
                                return item;
                            });
                        };
                    } else if(typeof value === 'object'){
                        //对于parent等引用，只保存id
                        if(prop === 'parent' && value && 'id' in value){
                            result[prop] = { id: value.id, type: value.type || null };
                        } else if(prop === 'mainComponent' && value && 'id' in value){
                            result[prop] = { id: value.id, type: value.type || null };
                        } else {
                            result[prop] = nodeToJSON(value, visited, depth + 1, maxDepth, false);
                        };
                    } else {
                        result[prop] = value;
                    };
                };
            } catch(e){
                //忽略无法访问的属性
                continue;
            };
        };
        //处理children（如果有）
        if('children' in node && Array.isArray(node.children)){
            result.children = node.children.map(child => {
                if(child && typeof child === 'object'){
                    //children中的节点使用isChild=true，允许正常序列化
                    return nodeToJSON(child, visited, depth + 1, maxDepth, true);
                };
                return child;
            });
        };
    } catch(e){
        result._error = e.message;
    };
    return result;
};

//==================== 重构中 ====================

//硬编码创建组件,缓存已创建的组件,避免在多次使用某功能时重复创建，注意调用缓存前判断remove
class createMix{
    constructor(){
        this.comps = {//硬编码数据
            table:{
                th:{},
                td:{},
                tn:{},
            },
            rich:{
                h1:{},
                h2:{},
                h3:{},
                h4:{},
                h5:{},
                h6:{},
                p:{},
                blockquote:{},
                ul:{},
                ol:{},
                pre:{},
            },
            pixel:{
                finder:{},
                finder_mix:{},
                cell_fill:{},
                cell_bg:{},
            }
        }
        this.hasCreated = []//缓存已创建的对象

    }

    creComp(name,type){
        let compInfo = this.comps[this.type][this.name.replace('@','').replace(':','_')]
        if(compInfo){

        }
    }

    //==================== 工具函数 ====================

    addFrame(info,cloneNode){
        let node = figma.createFrame();
        node.clipsContent = false;
        setMain(info,node,cloneNode,true);
        return node;
    }
}