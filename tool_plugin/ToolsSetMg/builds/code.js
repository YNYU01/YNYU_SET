/// <reference types="@mastergo/plugin-typings" />
/*
- [ToolsSet 工具集1.0]
- ©版权所有：2024-2026 YNYU @lvynyu2.gmail.com
- 禁止未授权的商用及二次编辑
- 禁止用于违法行为，如有，与作者无关
- 二次编辑需将引用部分开源
- 引用开源库的部分应遵循对应许可
- 使用当前代码时禁止删除或修改本声明
*/
let UI_MINI = [208,460];
let UI = [300,660];
let UI_BIG = [620,660];

mg.showUI(__html__);


let rulerH = 0;
if (mg.viewport.rulerVisible == true){
    rulerH = 17;
}else{
    rulerH = 0;
}
mg.ui.resize(UI[0], UI[1],true);
mg.ui.moveTo(mg.viewport.positionOnDom.x + rulerH,48 + rulerH);
//插件自动吸附
mg.on('layoutchange',function(){
    if (mg.viewport.rulerVisible == true){
        rulerH = 17;
    }else{
        rulerH = 0;
    }
    mg.ui.resize(UI[0], UI[1],true);
    mg.ui.moveTo(mg.viewport.positionOnDom.x + rulerH,48 + rulerH);
})

//直接主线程发起初始化插件界面偏好
mg.clientStorage.getAsync('userTheme')
.then (data => {
    postmessage([data,'userTheme']);
})
.catch (error => {
    postmessage(['dark','userTheme']);
});

mg.clientStorage.getAsync('userLanguage')
.then (data => {
    postmessage([data,'userLanguage']);
})
.catch (error => {
    postmessage(['En','userLanguage']);
});

mg.clientStorage.getAsync('userResize')
.then (data => {
    mg.ui.resize(data[0], data[1],true);
})
.catch (error => {
    mg.ui.resize(UI[0], UI[1],true);
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
let autoLayoutKeys = ['flexMode','flexWrap',
    'itemSpacing','itemReverseZIndex','crossAxisSpacing',
    'mainAxisAlignItems','mainAxisSizingMode',
    'crossAxisAlignItems','crossAxisSizingMode','crossAxisAlignContent',
    'paddingBottom','paddingLeft','paddingRight','paddingTop',
]

//==========核心功能==========

mg.ui.onmessage = async (message) => { 
    const info = message[0]
    const type = message[1]
    //console.log(message)
    //获取用户偏好
    if ( type == "getlocal"){
        //console.log("getlocal:"+info)
        mg.clientStorage.getAsync(info)
        .then (data => {
            postmessage([data,info]);
            //console.log('getlocal:',data,info);
        })
        .catch (error => {
        })
    };
    //设置用户偏好
    if ( type == "setlocal"){
        //console.log("setlocal:"+info)
        if(info[1] === null || info[1] === undefined){
            // 如果值为 null，则删除该键
            mg.clientStorage.deleteAsync(info[0]);
        } else {
            mg.clientStorage.setAsync(info[0],info[1]);
        }
    };
    //按需发送选中内容信息
    if ( type == "selectInfo"){
        sendInfo();
    };
    //插件自由缩放
    if ( type == "resize"){
        mg.ui.resize(info[0], info[1],true);
    };
    //插件最大化
    if ( type == "big"){
         if (info){
            mg.ui.resize(UI_BIG[0], UI_BIG[1],true);  
            mg.clientStorage.setAsync('userResize',[UI_BIG[0], UI_BIG[1]]);
        } else {
            mg.ui.resize(UI[0], UI[1],true);
            mg.clientStorage.setAsync('userResize',[UI[0], UI[1]]);
        };
    };
    //双击底部获取当前节点信息(开发用)
    if ( type == "getnode"){
        if (mg.document.currentPage.selection.length > 0){
            console.log("当前节点信息：");
            let b = mg.document.currentPage.selection[0];
            console.log(b);
            //使用深层拷贝函数获取可序列化的JSON数据
            //let nodeData = nodeToJSON(b);
            //console.log(nodeData)//JSON.stringify(nodeData, null, 2));
            if(b.type == 'TEXT'){
                //console.log(b.getRangeListOptions(0,b.characters.length));
            };
        } else {
            //console.log(mg.document.currentPage.parent)
            console.log("未选中对象");
        };
    };
    //批量导入大图
    if ( type == "createImage"){
        //console.log(info)
        let viewX = Math.floor( mg.viewport.center.x - ((mg.viewport.bound.width/2  - 300)* mg.viewport.zoom));
        let viewY = Math.floor( mg.viewport.center.y - ((mg.viewport.bound.height/2  - 300)* mg.viewport.zoom));
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
        mg.document.currentPage.selection = selects;
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
            mg.document.currentPage.appendChild(box);
            switch (zy.zyType){
                case 'md':
                    addAutoLayout(box,['V','TL',0,[40,48,40,28]]);
                    box.fills = bg1;
                    box.layoutSizingHorizontal = 'HUG';
                    box.layoutSizingVertical = 'HUG';
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
                            let text = await addText([{family:'Source Han Sans',style:'Bold'},characters,(48 - level * 4),color1]);
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
                            let text = await addText([{family:'Source Han Sans',style:'Regular'},characters,28,color2]);
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
                            let path = mg.createVector();
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
                                //pre.itemReverseZIndex = true;//前面堆叠在上
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
                                //"ORDERED" | "BULLETED" | "NONE"
                                code.listStyles = [{type: 'ORDERED',start: 0,end: eg.length}];
                                code.hangingList = true;
                                pre.appendChild(code);
                                code.layoutSizingHorizontal = 'FILL';

                                mask.layoutSizingHorizontal = 'HUG';
                                mask.layoutSizingVertical = 'FILL';
                                preComp = createCompByNode(pre);
                                
                                addCompPro(preComp,num,'--last-line-num','TEXT','4');

                                preComp.x = box.x - 450;
                                preComp.y = box.y + 120;
                                preComp.width = 426;
                                preComp.height = 100;
                                preComp.layoutSizingVertical = 'HUG';
                                allComp.push(preComp);
                            };
                            let newPre = preComp.createInstance();
                            line.appendChild(newPre);
                            newPre.layoutSizingHorizontal = 'FILL';
                            newPre.layoutSizingVertical = 'HUG';
                            newPre.children[1].characters = characters;
                            let proId = newPre.componentProperties.find(item => item.name == '--last-line-num').id;
                            newPre.setProperties({[proId]: (cre.content.length).toString()});
                            box.appendChild(line);
                            line.layoutSizingHorizontal = 'FILL';
                        },
                        ul: async function(cre){
                            let characters = cre.items.map(item => {return typeof item.content == 'string' ? item.content : item.content.map(item => item.content).join('')}).join('\n');
                            let text = await addText([{family:'Source Han Sans',style:'Regular'},characters,24,color3]);
                            //"ORDERED" | "BULLETED" | "NONE"                            
                            text.listStyles = [{type: 'BULLETED',start: 0,end: characters.length}];
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
                            let text = await addText([{family:'Source Han Sans',style:'Regular'},characters,24,color3]);
                            //"ORDERED" | "BULLETED" | "NONE"
                            text.listStyles = [{type: 'ORDERED',start: 0,end: characters.length}];
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
                            let text = await addText([{family:'Source Han Sans',style:'Light'},characters,22 ,color3]);
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
                            await mg.clientStorage.getAsync('userLanguage')
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
                                let C = data[0].length;
                                let R = data.length - 3;
                                reCompNum(table,C,R)
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
                            let img = mg.createRectangle();
                            line.appendChild(img);
                            box.appendChild(line);
                            let image = await mg.createImageAsync(cre.src);
                            let { width, height } = await image.getSizeAsync();
                            img.width = width;
                            img.height = height;
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
                            mg.document.currentPage.selection = [box];
                            if(!thComp && !tdComp && preComp){
                                preComp.y = box.y;
                            }else{
                                layoutByRatio(allComp,true);
                            };
                            mg.viewport.scrollAndZoomIntoView([box]);
                            mg.viewport.zoom = mg.viewport.zoom * 0.6;
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
        let data = getMain(mg.document.currentPage.selection,true);
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
    //刷新导出图片所需的信息
    if( type == "refreshExportImgInfo"){
        refreshExportImgInfo(info);
    };
    //修改目标大小
    if ( type == "setFinalSize"){
        mg.getNodeById(info[0])
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
            let box = mg.createRectangle();
            box.fills = item.paint;
            mg.createFillStyle({id:box.id,name:item.name,description:''});
            box.remove();
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
            let collection = mg.variables.createVariableCollection(mode.name);
            let modeid = collection.defaultModeId;
            collection.renameMode(modeid,mode.name.split('@set:')[1])
            mode.items.forEach(data => {
                let variable = mg.variables.createVariable(data.name,collection,data.type);
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
        const variablePages = mg.document.children.filter(item => item.name.includes('@localsheet'));
        console.log(variablePages)
        variablePages.forEach(page => {
            mg.document.currentPage = page
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
                let group = mg.group(item,a);
                allGroup.push(group);
            });
            layoutByRatio(allGroup,true);
            mg.document.currentPage.selection = allGroup;
            mg.viewport.scrollAndZoomIntoView(allGroup);
            mg.viewport.zoom = mg.viewport.zoom * 0.6;
            allGroup.forEach(item => {
                mg.ungroup(item);
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
        let promises = allStyleId.map(item => mg.getStyleByIdAsync(item));
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
        let promises = allStyleId.map(item => mg.getStyleByIdAsync(item));
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
        let a = mg.document.currentPage;
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
            mg.viewport.scrollAndZoomIntoView(all);
            mg.viewport.zoom = mg.viewport.zoom * 0.6;
            return;
        };
        let lang = await mg.clientStorage.getAsync('userLanguage')
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
        let C = 2, R = 2;
        if(info[4]){
            test = info[4];
            C = test.length - 1;
            R = test[0].length - 2;
        };
        
        reCompNum(table,C,R);
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
        mg.viewport.scrollAndZoomIntoView(all);
        mg.viewport.zoom = mg.viewport.zoom * 0.6;
    };
    //使所选元素符合表格组件
    if ( type == 'Make Cell-Comp'){
        let b = getSelectionMix();  
        let selects = [];
        b.forEach(node => {
            let comp,type = '',isComp = false,isAutoLayout = false;
            let oldPropsKeys = [];
            let oldPropsText = [];
            let oldPropsBoolean = [];
            let absoluteChild = [];
            let keyWord = ['--bod','描边','--fill','--fills','区分']

            //先转为组件，这样即使是单文字也会套上容器，方便处理
            if(node.type == 'COMPONENT'){
                comp = node;
                isComp = true;
            }else if(node.type == 'INSTANCE'){
                comp = createCompByNode(node.detachInstance());

            }else {
                comp = createCompByNode(node);
            }
            let [w,h] = [comp.width,comp.height]
            
            //尝试获取类型
            if(!type){
                const nameParts = comp.name.split('@');
                if(nameParts.length > 1){
                    type = nameParts[1].split(' ')[0].split(':')[0];
                } else {
                    type = '';
                }
                if(['th','td','tn'].every(item => type !== item)){
                    type = '';
                };
            }
            
            //继续尝试获取类型,并最终确定类型+矫正命名
            if(!type){
                if(comp.findOne(item => item.type == 'TEXT')){
                    if(['表头','header'].some(item => comp.name.toLowerCase().includes(item))){
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
            if(comp.flexMode == 'NONE'){
                addAutoLayout(comp,['H','CC',0,[0,0]],true);
                comp.width = w;
                comp.height = h;
                //comp.itemReverseZIndex = true;//前面堆叠在上
            }else{
                isAutoLayout = true;
            }
            
            //旧版母组件需要特殊处理，只能修改属性名和修正必要元素
            if(isComp){
                //记录原有的组件属性
                oldPropsKeys = Object.keys(comp.componentPropertyDefinitions || {});
                // componentPropertyDefinitions 是对象，需要转换为数组再过滤
                let allProps = Object.values(comp.componentPropertyDefinitions || {});
                oldPropsText = allProps.filter(item => item.type == 'TEXT');
                oldPropsBoolean = allProps.filter(item => item.type == 'BOOLEAN');
                
                //使用工具函数找出所有关键元素
                absoluteChild = comp.children.filter(item => isKeyElement(item, keyWord));
            
                //如果原组件没有相关属性，直接添加必要元素和属性
                let hasKeyProps = oldPropsKeys.some(key => keyWord.some(keyword => key.includes(keyword)));
                
                if(!hasKeyProps){
                    //没有关键属性，直接添加所有必要元素
                    let bodfills = makeCompliant(type,comp);
                    //重新放到底部
                    bodfills.reverse().forEach(item => {
                        comp.insertChild(0,item);
                    });
                }else{
                    //有组件属性的情况：从找特定元素开始，修正属性名称和元素命名，不新增属性
                    //逻辑：找特定元素 -> 检查绑定 -> 检查属性名是否最新版 -> 修改属性名和绑定
                    
                    //获取所有已有的组件属性
                    //componentPropertyDefinitions 的结构是 {name#id: {type:, defaultValue:,}}
                    let allProps = comp.componentPropertyDefinitions || {};
                    
                    //辅助函数：根据属性ID找到属性键（name#id格式）
                    function getPropKeyById(propId){
                        let prop = comp.componentProperties.find(item => item.id == propId);
                        if(prop){
                            return prop.name;
                        }
                        return null;
                    }
                    
                    //辅助函数：判断属性名是否是最新版标准命名
                    function isLatestPropName(propName){
                        return ['--bod-t', '--bod-r', '--bod-b', '--bod-l', '--fills'].includes(propName);
                    }
                    
                    //辅助函数：根据旧属性名判断应该使用的正确属性名
                    function getCorrectPropName(oldPropName){
                        let oldPropNameLower = oldPropName.toLowerCase();
                        if(oldPropNameLower.includes('-t') || oldPropNameLower.includes('顶') || oldPropNameLower.includes('上') || oldPropNameLower.includes('top')){
                            return '--bod-t';
                        } else if(oldPropNameLower.includes('-b') || oldPropNameLower.includes('底') || oldPropNameLower.includes('下') || oldPropNameLower.includes('bottom')){
                            return '--bod-b';
                        } else if(oldPropNameLower.includes('-l') || oldPropNameLower.includes('左') || oldPropNameLower.includes('left')){
                            return '--bod-l';
                        } else if(oldPropNameLower.includes('-r') || oldPropNameLower.includes('右') || oldPropNameLower.includes('right')){
                            return '--bod-r';
                        } else if(oldPropNameLower.includes('fill') || oldPropNameLower.includes('区分') || oldPropNameLower.includes('区分色')){
                            return '--fills';
                        }
                        return null;
                    }
                    
                    //从找特定元素开始
                    absoluteChild.forEach(item => {
                        let correctPropName = getKeyElementPropName(item, keyWord);
                        if(correctPropName){
                            //检查是否有绑定属性
                            if(item.componentPropertyReferences && item.componentPropertyReferences.visible){
                                //有绑定属性，获取绑定的属性引用（可能是ID或name#id格式）
                                let boundPropRef = item.componentPropertyReferences.visible;//id
                                let boundPropKey = getPropKeyById(boundPropRef);//name
                                
                                if(boundPropKey){
                                    //检查属性名是否是最新版
                                    if(!isLatestPropName(boundPropKey)){
                                        //不是最新版，需要修改属性名
                                        let newPropName = getCorrectPropName(boundPropKey);
                                        if(newPropName && newPropName !== boundPropKey){
                                            //检查新属性名是否已存在（查找是否有以 newPropName# 开头的键）
                                            let existingPropKey = allProps.find(item => item.name == newPropName);
                                            
                                            if(!existingPropKey){
                                                try {
                                                    //使用 editComponentProperty 修改属性名
                                                    //传入的是属性键（name#id格式）
                                                    let updatedPropKey = comp.editComponentProperty(boundPropRef, {
                                                        name: newPropName
                                                    });
                                                    //editComponentProperty 返回新的 name#id 格式，直接用于绑定
                                                    item.componentPropertyReferences = {
                                                        'visible': updatedPropKey
                                                    };
                                                    //更新 allProps 以反映重命名后的属性
                                                    allProps = comp.componentPropertyDefinitions || {};
                                                     
                                                } catch(e) {
                                                    console.log('重命名属性失败:', boundPropKey, '->', newPropName, e);
                                                }
                                            } else {
                                                //新属性名已存在，直接绑定到已存在的属性
                                                item.componentPropertyReferences = {'visible': existingPropKey};
                                            }
                                        }
                                    } else {
                                        //已经是最新版，确保绑定正确（使用 name#id 格式）
                                        if(item.componentPropertyReferences.visible !== boundPropRef){
                                            item.componentPropertyReferences = {'visible': boundPropRef};
                                        }
                                    }
                                }
                            }
                            
                            //修正元素命名（如果名称不正确）
                            if(!item.name.includes(correctPropName)){
                                let baseName = item.name.split('@')[0].trim();
                                if(!item.name.includes('--')){
                                    item.name = baseName + ' ' + correctPropName;
                                }
                            }
                        }
                    });
                    
                    //对于已有关键元素但还没有正确绑定的，尝试绑定到已有属性
                    comp.children.forEach(item => {
                        if(!absoluteChild.some(existing => existing.id === item.id) && isKeyElement(item, keyWord)){
                            let propName = getKeyElementPropName(item, keyWord);
                            if(propName){
                                //查找是否有以该属性名开头的属性键（name#id格式）
                                let existingPropKey = Object.keys(allProps).find(key => {
                                    let name = getPropNameFromKey(key);
                                    return name === propName;
                                });
                                
                                if(existingPropKey){
                                    //只绑定到已存在的属性，不创建新属性
                                    if(!item.componentPropertyReferences || !item.componentPropertyReferences.visible){
                                        item.componentPropertyReferences = {'visible': existingPropKey};
                                    }
                                    absoluteChild.push(item);
                                }
                            }
                        }
                    });
                    
                    //检查必要元素是否不足，如果不足则添加缺失的必要元素
                    //所有必要的属性：--bod-t, --bod-r, --bod-b, --bod-l, --fills
                    let allRequiredProps = ['--bod-t', '--bod-r', '--bod-b', '--bod-l', '--fills'];
                    
                    //辅助函数：检查属性是否存在（支持name#id格式）
                    function hasPropertyByName(propName){
                        //检查组件属性定义中是否存在（查找name部分匹配的）
                        let propKey = Object.keys(allProps).find(key => {
                            let name = getPropNameFromKey(key);
                            return name === propName;
                        });
                        if(propKey){
                            return true;
                        }
                        //检查子元素中是否有使用该属性名的
                        if(comp.children && comp.children.some(child => child.name.includes(propName))){
                            return true;
                        }
                        //对于 --fills，同时检查 --fill（兼容旧版本）
                        if(propName === '--fills'){
                            let fillKey = Object.keys(allProps).find(key => {
                                let name = getPropNameFromKey(key);
                                return name === '--fill';
                            });
                            if(fillKey || (comp.children && comp.children.some(child => child.name.includes('--fill')))){
                                return true;
                            }
                        }
                        return false;
                    }
                    
                    //找出缺失的必要属性
                    let missingProps = allRequiredProps.filter(prop => !hasPropertyByName(prop));
                    
                    if(missingProps.length > 0){
                        //使用 makeCompliant 添加缺失的必要元素并绑定属性
                        let bodfills = makeCompliant(type, comp, missingProps);
                        bodfills.reverse().forEach(item => {
                            comp.insertChild(0,item);
                        });
                    }
                    
                    //处理文字元素和文字类组件属性
                    //1. 收集绑定了同一文字类组件属性的文字元素
                    let allTexts = comp.findAll(item => item.type === 'TEXT');
                    let textPropsMap = {}; // {propKey: [textNodes]}
                    
                    //按属性分组文字元素
                    allTexts.forEach(textNode => {
                        if(textNode.componentPropertyReferences && textNode.componentPropertyReferences.characters){
                            let propRef = textNode.componentPropertyReferences.characters;
                            //propRef 可能是ID或name#id格式
                            let propKey = null;
                            if(typeof propRef === 'string' && propRef.includes('#')){
                                propKey = propRef;
                            } else {
                                propKey = getPropKeyById(propRef);
                            }
                            
                            if(propKey){
                                if(!textPropsMap[propKey]){
                                    textPropsMap[propKey] = [];
                                }
                                textPropsMap[propKey].push(textNode);
                            }
                        }
                    });
                    
                    //检查每个文字属性是否需要重命名为--data
                    Object.keys(textPropsMap).forEach(propKey => {
                        let textNodes = textPropsMap[propKey];
                        let propName = getPropNameFromKey(propKey);
                        let shouldRename = false;
                        
                        //检查属性名是否含有'字段''数据''text'等
                        if(propName){
                            let propNameLower = propName.toLowerCase();
                            if(propNameLower.includes('字段') || propNameLower.includes('数据') || 
                               propNameLower.includes('text') || propNameLower.includes('data')){
                                shouldRename = true;
                            }
                        }
                        
                        //检查文本内容是否带'表头''数据''文案''123'等
                        if(!shouldRename){
                            for(let textNode of textNodes){
                                let textContent = textNode.characters.toLowerCase();
                                if(textContent.includes('表头') || textContent.includes('数据') || 
                                   textContent.includes('文案') || /123/.test(textContent)){
                                    shouldRename = true;
                                    break;
                                }
                            }
                        }
                        
                        //如果需要重命名且不是--data，则重命名
                        if(shouldRename && propName !== '--data'){
                            try {
                                //使用 editComponentProperty 修改属性名为--data
                                let updatedPropKey = comp.editComponentProperty(propKey, {
                                    name: '--data'
                                });
                                
                                //更新所有绑定到该属性的文字元素
                                textNodes.forEach(textNode => {
                                    textNode.componentPropertyReferences = {'characters': updatedPropKey};
                                });
                                
                                //更新 allProps
                                allProps = comp.componentPropertyDefinitions || {};
                            } catch(e) {
                                console.log('重命名文字属性失败:', propKey, '->', '--data', e);
                            }
                        }
                    });
                    
                    //2. 如果有文字元素但是没有文字类组件属性，直接新建--data属性并给文字元素绑定
                    //重新获取 allProps，因为可能已经重命名了属性
                    allProps = comp.componentPropertyDefinitions || {};
                    
                    let unboundTexts = allTexts.filter(textNode => {
                        return !textNode.componentPropertyReferences || !textNode.componentPropertyReferences.characters;
                    });
                    
                    if(unboundTexts.length > 0){
                        //检查是否已有--data属性
                        let dataPropKey = Object.keys(allProps).find(key => {
                            let name = getPropNameFromKey(key);
                            return name === '--data';
                        });
                        
                        if(!dataPropKey){
                            //没有--data属性，创建新属性并绑定
                            let firstText = unboundTexts[0];
                            let proid = addCompPro(comp, firstText, '--data', 'TEXT', firstText.characters);
                            
                            //绑定其他文字元素到同一个属性
                            for(let i = 1; i < unboundTexts.length; i++){
                                unboundTexts[i].componentPropertyReferences = {'characters': proid};
                            }
                        } else {
                            //已有--data属性，直接绑定所有未绑定的文字元素
                            unboundTexts.forEach(textNode => {
                                textNode.componentPropertyReferences = {'characters': dataPropKey};
                            });
                        }
                    }
                }
            
            }else{
                //非母组件不需要考虑对实例造成影响，可以删除无效的必要元素（实例解除但必要元素还在）
                comp.children.forEach(item => {
                    if( keyWord.some(key => item.name.includes(key))){
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
                    let bodfills = makeCompliant(type,comp);
                    bodfills.reverse().forEach(item => {
                        comp.insertChild(0,item);
                    });
                }else{//原元素不是自动布局，无需要特殊处理，可以直接添加必要元素和属性
                    let bodfills = makeCompliant(type,comp);
                    bodfills.reverse().forEach(item => {
                        comp.insertChild(0,item);
                    });
                    let texts = comp.findAll(item => item.type == 'TEXT');
                    if(texts.length > 0){
                        let proid = addCompPro(comp,texts[0],'--data','TEXT',texts[0].characters);
                        for(let i = 1; i < texts.length; i++){
                            texts[i].componentPropertyReferences = {'characters':proid};
                        };
                    };
                }
                let texts = comp.findAll(item => item.type == 'TEXT');
                if(texts.length > 0){
                    let proid = addCompPro(comp,texts[0],'--data','TEXT',texts[0].characters);
                    for(let i = 1; i < texts.length; i++){
                        texts[i].componentPropertyReferences = {'characters':proid};
                    };
                };
            }

            selects.push(comp);
        });
        mg.document.currentPage.selection = selects;
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
                    if(b[0].flexMode && b[0].flexMode !== 'NONE'){
                        let CC = comps.length;
                        let C = Array.length - CC;
                        if(info.clone == false){
                            C = C > 0 ? 0 : C;
                        }
                        if(info.reduce == false){
                            C = C < 0 ? 0 : C;
                        };
                        reCompNum(b[0],C);
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
                    let CC = table.children.length;
                    let RR = table.children[0].children.length;
                    let C = Array.length - CC;
                    let R = Array[0].length - RR;
                    if(info.clone == false){
                        C = C > 0 ? 0 : C;
                        R = R > 0 ? 0 : R;
                    }
                    if(info.reduce == false){
                        C = C < 0 ? 0 : C;
                        R = R < 0 ? 0 : R;
                    };
                    //console.log(C,R)
                    reCompNum(table,C,R);
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
                if(b[0].flexMode && b[0].flexMode !== 'NONE' && b[0].children.length == 1 && b[0].children[0].type == 'INSTANCE'){
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
                if(b[0].flexMode && b[0].flexMode !== 'NONE' && b[0].children.length == 1 && b[0].children[0].type == 'INSTANCE'){
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
        //console.log(111)
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
            if(b[0].children){
                b[0].children.forEach((node) => {
                    names.push([node.name]);
                });
            };
            if(b[0].type == 'TEXT'){
                names.push([b[0].characters]);
            }
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
                if(b[0].name.includes('@table')){
                    comps = b[0].findAll(item => item.name.includes('@t') && item.type == 'INSTANCE');
                }else{
                    comps = b[0].findChildren(node => node.type == 'INSTANCE');
                }
            };
        };
        if(comps  && comps.length > 0){
            let proKeys = comps.map(item => item.componentProperties.map(item => item.name).sort());
            let proNames = [...new Set(proKeys.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
            //console.log(proKeys,proNames)
            //必须有相同的组件属性才能提取
            if(proNames.length == 1){
                let datas = getProObj(comps,info.enters,info.nulls);
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
                    //console.log('setdata:',setdata)
                    reTableThemeByPreset(table,setdata);
                    return;
                };

                if(retype == 'style'){
                    reTableStyle(table,setdata);
                    return;
                };

                let CC = table.children.length;
                let RR = table.children[0].children.length;
                let C = 0,R = 0;
                if(typeof setdata == 'object'){
                    C = setdata[0];
                    R = setdata[1];
                    //行数不能少于2，列数不能少于1
                    C = C + CC < 1 ? 1 - CC : C;
                    R = R + RR < 2 ? 2 - RR : R;
                };
                if(retype == 'set'){
                    //插件端已限制最小数值，这里只计算差值
                    C = setdata[0] - CC;
                    R = setdata[1] - RR;
                };
                reCompNum(table,C,R);
            });
        } catch (error) {
            console.log(error)
        }
    };
    //反转行列
    if( type == 'Row Column Swap'){
        let b = getSelectionMix();
        let tables = getTablesByNodes(b);
        tables.forEach(table => {
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
    //斜切拉伸（用 relativeTransform 实现目标绝对变换，避免直接设 absoluteTransform 导致叠加）
    if( type == 'transformMix'){
        function inv23(m){
            let a = m[0][0], b = m[0][1], tx = m[0][2], c = m[1][0], d = m[1][1], ty = m[1][2];
            let det = a*d - b*c;
            if(Math.abs(det) < 1e-10) return null;
            return [[d/det,-b/det,(b*ty-d*tx)/det],[-c/det,a/det,(c*tx-a*ty)/det]];
        }
        function mul23(a,b){
            return [
                [a[0][0]*b[0][0]+a[0][1]*b[1][0], a[0][0]*b[0][1]+a[0][1]*b[1][1], a[0][0]*b[0][2]+a[0][1]*b[1][2]+a[0][2]],
                [a[1][0]*b[0][0]+a[1][1]*b[1][0], a[1][0]*b[0][1]+a[1][1]*b[1][1], a[1][0]*b[0][2]+a[1][1]*b[1][2]+a[1][2]]
            ];
        }
        let b = getSelectionMix();
        b.forEach(item => {
            if(!item.getPluginData('oldWH')){
                item.setPluginData('oldWH',JSON.stringify([item.width,item.height]));
            }
            let skewX = Math.tan(info.x*(Math.PI/180));
            let scaleX = info.w/100;
            let skewY = Math.tan(info.y*(Math.PI/180));
            let scaleY = info.h/100;
            let abs = item.absoluteTransform;
            let tx = abs[0][2], ty = abs[1][2];
            // 先记录当前旋转角，再按「无旋转时斜切缩放 → 再旋回去」处理，便于理解
            let theta = Math.atan2(abs[1][0], abs[0][0]);
            let cos = Math.cos(theta), sin = Math.sin(theta);
            let noRot00 = scaleX, noRot01 = skewX, noRot10 = skewY, noRot11 = scaleY;
            let rotBack00 = cos*noRot00 - sin*noRot10, rotBack01 = cos*noRot01 - sin*noRot11;
            let rotBack10 = sin*noRot00 + cos*noRot10, rotBack11 = sin*noRot01 + cos*noRot11;
            let desiredAbs = [[rotBack00,rotBack01,tx],[rotBack10,rotBack11,ty]];
            let parent = item.parent;
            if(!parent || parent.type === 'PAGE'){
                item.relativeTransform = desiredAbs;
            } else {
                let parentInv = inv23(parent.absoluteTransform);
                if(!parentInv){ item.relativeTransform = desiredAbs; return; }
                item.relativeTransform = mul23(parentInv, desiredAbs);
            }
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
        let a = mg.document.currentPage;
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
                comp = createCompByNode(b[0].clone());
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
            mg.clientStorage.getAsync('userLanguage')
            .then (async (language) => {
                let text = language == 'Zh' ? '已修改子元素约束，以实现自适应' : 'The constraint of the child has been changed'
                mg.notify(text,{
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
                let imageData = mg.getImageByHash(image.imageHash);
                imageData.getSizeAsync().then(data => {
                    item.width = data.width;
                    item.height = data.height;
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
                    let imageData = mg.getImageByHash(image.imageHash);
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
                    let imageData = mg.getImageByHash(image.imageHash);
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
                    let imageData = mg.getImageByHash(image.imageHash);
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
        mg.getImageByHash(oneImage.imageHash).getSizeAsync().then(srcSize => {
            let srcW = srcSize.width, srcH = srcSize.height;
            let [skewX,skewY] = [oneImage.imageTransform[0][1],oneImage.imageTransform[1][0]];
            let [transX,transY] = [oneImage.imageTransform[0][2],oneImage.imageTransform[1][2]];
            final.forEach(item => {
                if (item == oneNode) return;
                let [w,h] = [oneNode.width, oneNode.height];
                //imageTransform直接赋值会和scaleMode冲突，只能在同大小情况下直接赋值
                findImage(item, (image, fills) => {
                    mg.getImageByHash(image.imageHash).getSizeAsync()
                    .then(async (dstSize) => {
                        let dstW = dstSize.width, dstH = dstSize.height;
                        if(JSON.stringify([srcW,srcH]) == JSON.stringify([dstW,dstH])){
                            item.width = w;
                            item.height = h;
                            image.scaleMode = oneImage.scaleMode;
                            image.imageTransform = oneImage.imageTransform;
                            item.fills = fills;
                        } else {
                            //先还原尺寸
                            findImage(item,async(image,fills) => {
                                let imageData = mg.getImageByHash(image.imageHash);
                                let originSize = await imageData.getSizeAsync();
                                item.width = originSize.width;
                                item.height = originSize.height;
                                image.imageTransform = [[1,0,0],[0,1,0]];
                                image.scaleMode = 'FILL';
                                item.fills = fills;

                                item.width = w;
                                item.height = h;
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
            mg.clientStorage.getAsync('userLanguage')
            .then (async (language) => {
                let text = language == 'Zh' ? '已忽略缺失字体的对象' : 'Nodes with missing fonts have been ignored'
                mg.notify(text,{
                    error:true,
                    timeout: 3000,
                });
            });
        } else {
            for(let i = 0; i < safeTexts.length; i++){
                let oldnode = safeTexts[i];
                //要加载的字体
                let fonts = [...new Set(oldnode.textStyles.map(item => JSON.stringify(item.textStyle.fontName)))];
                fonts = fonts.map(item => JSON.parse(item));
                let promises = fonts.map(item => mg.loadFontAsync(item));
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
            let newNode = mg.createNodeFromSvg(svgcode);
            //newNode.x = safeMain[2];
            //newNode.y = safeMain[3];

            let group = mg.group(newNode.children,item.parent,(item.parent.children.findIndex(items => items.id == item.id) + 1));
            group.name = item.name.length > 14 ? item.name.slice(0,14) + '...' : item.name;
            group.name += ' @split:svg';
            group.children.forEach(items => {
                if(items.type == 'GROUP'){
                    mg.ungroup(items);
                };
            });
            group.x = item.x;
            group.y = item.y;

            newNode.remove();
            selects.push(group);
            item.visible = false;
        });
        mg.document.currentPage.selection = selects;
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
            let allTextNodes = mg.group(cloneTexts,texts[0].parent,texts[0].parent.children.findIndex(item => item.id == texts[0].id))
            let svgcode = await allTextNodes.exportAsync({
                format: 'SVG_STRING',
                svgOutlineText: false,
                svgIdAttribute: false,
            })
            newNode = mg.createNodeFromSvg(svgcode);
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
        await mg.loadFontAsync({family:'Source Han Sans',style:'Regular'});
        let newText = await addText([{family:'Source Han Sans',style:'Regular'},characters.join('\n'),16,[toRGB('#d6d6d6',true)]]);

        if (mergeType == 'all') {
            try{
                //需加载全部涉及的字体
                let fonts = texts.map(item => item.textStyles.map(items => items.textStyle.fontName));
                fonts = [...new Set(fonts.map(item => JSON.stringify(item)))];
                fonts = fonts.map(item => JSON.parse(item)).flat();
                //console.log(fonts)
                let promises = fonts.map(item => mg.loadFontAsync(item));
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
                        let segs = textNode.textStyles;
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
                //console.log(stylesByLine, styles);
                stylesByLine.forEach(item => {
                    if(item.textStyle.fontName) newText.setRangeFontName(item.start,item.end,item.fontName);
                    if(item.textStyle.fontSize) newText.setRangeFontSize(item.start,item.end,item.fontSize);
                    if(item.fills) newText.setRangeFills(item.start,item.end,item.fills);
                    if(item.fillStyleId) newText.setRangeFillStyleId(item.start,item.end,item.fillStyleId);
                    if(item.textStyleId) newText.setRangeTextStyleId(item.start,item.end,item.textStyleId);
                });
            } catch(error){
                console.error(error);
            }

        }
        if(newText){
            let group = mg.group(texts,texts[0].parent,texts[0].parent.children.findIndex(item => item.id == texts[0].id))
            group.name = '@merge:' + mergeType;
            let group2 = mg.group(texts,group)
            group2.visible = false;
            newText.x = group.x;
            newText.y = group.y;
            group.appendChild(newText);       
            mg.document.currentPage.selection = [group]; 
        }
        if(newNode){
            newNode.remove();
        }
    };
    //自动排列
    if ( type == 'Arrange By Ratio'){
        if(info){
            layoutByRatio(mg.document.currentPage.selection,true);
        }else{
            layoutByRatio(mg.document.currentPage.selection);
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
        let a = mg.document.currentPage;
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
                    let comp = createCompByNode(node.clone());
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
            let group = mg.group(groupnode,node.parent,(layerIndex + 1))
            group.name = node.name + ' @divide';
            selects.push(group);
            node.visible = false;
        });
        a.selection = selects;
    };
    //包裹到容器
    if( type == 'Put In Frame'){
        let a = mg.document.currentPage;
        let b = getSelectionMix();
        let selects = [];
        b.forEach(node => {
            if(node.type == 'SECTION' || FRAME_TYPE.includes(node.type)) return;
            let frame;
            if(info){
                frame = addFrame([],node);
                frame.fills = [];
            }else{
                let safeMain = getSafeMain(node);
                frame = addFrame([...safeMain,node.name,[]]);
            }
            if(frame){
                fullInFrameSafa(node,frame);
                selects.push(frame);
            }
        });
        if(selects.length > 0){
            a.selection = selects;
        }
    };
    //转为自动布局
    if( type == 'To Auto Layout'){
        let b = getSelectionMix();
        b.forEach(item => {
            if(item.flexMode && item.flexMode !== 'NONE') return;
            let layoutNode = item;
            //分析子元素排布，以确定自动布局方式
            let flexMode = 'H';
            let layoutAlign = 'TL';
            let layoutSpacing = 0;
            let layoutPadding = [0,0,0,0];
            let flexWrap = true;
            let layoutFix = [true,true];
            let fills = [],strokes = [],bottomLeftRadius = 0,bottomRightRadius = 0,topLeftRadius = 0,topRightRadius = 0;
            //模仿原生逻辑，最下方是形状且大小铺满时，转为容器的样式
            if(item.children.length > 0 && item.children[item.children.length - 1].type == 'RECTANGLE'){
                let shape = item.children[item.children.length - 1];
                if(shape.width == item.width && shape.height == item.height){
                    fills = shape.fills;
                    strokes = shape.strokes;
                    bottomLeftRadius = shape.bottomLeftRadius;
                    bottomRightRadius = shape.bottomRightRadius;
                    topLeftRadius = shape.topLeftRadius;
                    topRightRadius = shape.topRightRadius;
                    //只隐藏处理，方便后续恢复
                    shape.visible = false;
                }
            };

            //确保是容器元素
            if(!item.flexMode){
                if(item.type == 'GROUP' || item.type == 'SECTION'){
                    let isGroup = item.type == 'GROUP' ? true : false;
                    let itemX = item.x;
                    let itemY = item.y;
                    try{
                        layoutNode = addFrame([],item);
                        let childs = sortLRTB(item.children);
                        childs.forEach(child => {
                            let x = isGroup ? child.x - itemX : child.x;
                            let y = isGroup ? child.y - itemY : child.y;
                            //console.log(x,y)
                            layoutNode.appendChild(child);
                            child.x = x;
                            child.y = y;
                        });
                        if(!item.removed) item.remove();
                    }catch(error){
                        console.error(error);
                    }
                }else{
                    layoutNode = fullInFrameSafa(item,addFrame([],item));
                };
            };

            //分析其他子元素与形状的相对位置
            let final = [...layoutNode.children];
            if(final.length > 0){
                let minX = Math.min(...final.map(items => items.x));
                let minY = Math.min(...final.map(items => items.y));
                let maxX = Math.max(...final.map(items => items.x + items.width));
                let maxY = Math.max(...final.map(items => items.y + items.height));
                //console.log([minY,layoutNode.width - maxX,layoutNode.height - maxY,minX])
                layoutPadding = [minY,layoutNode.width - maxX,layoutNode.height - maxY,minX];
            }

            if([...new Set(layoutPadding.map(item => Math.round(item)))].length == 1){
                if(layoutPadding[0] !== 0){
                    layoutPadding = [0,0,0,0];
                    layoutAlign = 'CC';
                }
            }

            addAutoLayout(layoutNode,[flexMode,layoutAlign,layoutSpacing,layoutPadding],layoutFix,flexWrap);
            layoutNode.fills = fills;
            layoutNode.strokes = strokes;
            layoutNode.bottomLeftRadius = bottomLeftRadius;
            layoutNode.bottomRightRadius = bottomRightRadius;
            layoutNode.topLeftRadius = topLeftRadius;
            layoutNode.topRightRadius = topRightRadius;
        
            });
    };
    //填充组件到容器
    if( type == 'Clone to Fill'){
        let a = mg.document.currentPage;
        let b = getSelectionMix();
        let comp = b.find(item => item.type == 'COMPONENT' || item.type == 'INSTANCE');
        let frames = b.filter(item => item.type == 'FRAME' && item.flexMode == 'NONE');
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
            if(node.type == 'INSTANCE' && node.parent.flexMode !== 'NONE'){
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
        let a = mg.document.currentPage;
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
        let a = mg.document.currentPage;
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
                        let subtract = mg.subtract(cuts,vector.parent);
                        newVectors.push(subtract);
                    } else {
                        let newVectorCut = mg.group(cuts,vector.parent);
                        newVectorCut.name = vector.name + ' ' + (i + 1);
                        newVectors.push(newVectorCut);
                    };
                    /**/
                    /**
                    let newVectorCut = mg.group(cuts,vector.parent);
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
                group = mg.union(newVectors,vector.parent,(layerIndex + 1));
                group.fills = vector.fills;
                group.x = vector.x;
                group.y = vector.y;
            } else {
                group = mg.group(newVectors,vector.parent,(layerIndex + 1));
            }
            group.name = vector.name;
            if(group.children.length == 1 && group.children[0].type == 'GROUP'){
                mg.ungroup(group.children[0]);
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
            groups = mg.group(b[0].clone());
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
            let newnode = mg.createNodeFromSvg(svgcode);
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
        info.forEach(async (item) => {
            let qrcode = await mg.createNodeFromSvgAsync(item.svg);
            qrcode.name = item.type == 'data' ? '@pixel:Qrcode' : '@pixel';
            qrcode.x = mg.viewport.center.x - qrcode.width/2;
            qrcode.y = mg.viewport.center.y - qrcode.height/2;
            selects.push(qrcode);
        });
        mg.document.currentPage.selection = selects;
        mg.viewport.scrollAndZoomIntoView(selects);
        mg.viewport.zoom = mg.viewport.zoom * 0.6;
    };
    //生成新二维码组件
    if( type == "createNewQRcodeComp"){
        //console.log(info)
        let selects = [];
        let fill = toRGB('#000000',true);
        let bg = toRGB('#ffffff',true);
        let [x,y] = [mg.viewport.center.x - 100,mg.viewport.center.y - 100];
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
            let cellFill = mg.createRectangle();
            cellFill.width = 10;
            cellFill.height = 10;
            cellFill.fills = [fill];
            cellFillBox.appendChild(cellFill);
            addAutoLayout(cellFillBox,['H','CC',0,[0,0]]);
            cellFillComp = createCompByNode(cellFillBox);
            selects.push(cellFillComp);
            let cellBgBox = addFrame([10,10,x + 20,y,'@cell:bg',[]]);
            let cellBg = mg.createRectangle();
            cellBg.width = 10;
            cellBg.height = 10;
            cellBg.fills = [bg];
            cellBgBox.appendChild(cellBg);
            addAutoLayout(cellBgBox,['H','CC',0,[0,0]]);
            cellBgComp = createCompByNode(cellBgBox);
            selects.push(cellBgComp);
        };
        
        //只有含二维码的数据时，生成二维码组件,同时调整二值化数据组件（如有）和自动布局容器（如有）的位置
        if(info.map(item => item.isQr).some(item => item == true)){
            if(cellFillComp) cellFillComp.x += 80;
            if(cellBgComp) cellBgComp.x += 80;
            if(allPixels) allPixels.x -= 80;
            let qrFinderBox = addFrame([70,70,x,y,'@finder:mix',[]]);
            let qrFinder = mg.createRectangle();
            qrFinder.name = '#finder.radius';
            qrFinder.x = x - 80;
            qrFinder.y = y;
            qrFinder.width = 70;
            qrFinder.height = 70;
            qrFinder.fills = [fill];
            let finderComp = createCompByNode(qrFinder);
            //console.log(finderComp)
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
            qrFinderComp = createCompByNode(qrFinderBox);
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
                            let pixel = mg.createRectangle();
                            pixel.width = 10;
                            pixel.height = 10;
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
        mg.document.currentPage.selection = selects;
        mg.viewport.scrollAndZoomIntoView(selects);
        //mg.viewport.zoom = mg.viewport.zoom * 0.6;
        
    };
    //生成伪描边
    if( type == "createShadowStroke"){
        let b = getSelectionMix();
        let [x,y] = [mg.viewport.center.x - 100,mg.viewport.center.y - 100];
        //console.log(info)
        let [shadowType,color,num,width] = [info.type,info.color,info.num || 8,info.width];
        let originalNum = parseInt(num) || 8;
        let lan = await mg.clientStorage.getAsync('userLanguage');
        // 如果数量大于8且不是css模式，提示并强制使用css模式
        if(originalNum > 8 && shadowType !== 'css'){
            if(lan == 'Zh'){
                mg.notify(`Figma限制同类效果数量，大于8时无法生效，已自动生成CSS示例`, {timeout: 3000});
            } else {
                mg.notify(`Figma limits the number of effects, if same type of effects is greater than 8, it will not take effect, and the CSS example has been automatically generated`, {timeout: 3000});
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
                let fontNameTipsZh = {family:'Source Han Sans',style:'Regular'};
                let isLoadFontTipsZh = false;
                try {
                    await mg.loadFontAsync(fontNameTipsZh);
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
                //pre.itemReverseZIndex = true;//前面堆叠在上
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
                //"ORDERED" | "BULLETED" | "NONE"
                code.listStyles = [
                    {type: 'ORDERED',start: 0,end: 1 },
                    {type: 'ORDERED',start: 1,end: tips.length + 1 },
                    {type: 'ORDERED',start: tips.length + 2,end: css.length}
                ];
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
                mg.document.currentPage.selection = [pre];
                mg.viewport.scrollAndZoomIntoView(pre);
                mg.viewport.zoom = mg.viewport.zoom * 0.6;
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
        getStyle('paint');
        let localPaintStyles = localStyles.paint.list;
        let names = localPaintStyles.map(item => item.name);
        info.forEach(item => {
            let name = item[0];
            if(names.includes(name)){
                name = name + ' ?';
            }
            let style = mg.createPaintStyle();
            style.name = name;
            style.paints = [toRGB(item[1],true)];
        });
    }
};

//==========初始化==========

mg.on('selectionchange',()=>{
    sendInfo();
    sendSendComp();
});

setTimeout(()=>{
    console.clear();
    console.log(`- [YNYU_SET] OPEN DESIGN & SOURCE
- © 2024-6 YNYU lvynyu2@gmail.com;`);
    //console.log(localStyles)
    //console.log(mg.getLocalPaintStyles())
},50)

//sendInfo();
function sendInfo(){
    let a = mg.document.currentPage;
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
            // 除去旋转后再取斜切，发到 UI 的才是真实斜切值（否则旋转会混进 atan(transform[0][1]) 等）
            let transformA = transform[0][0], transformB = transform[0][1], transformC = transform[1][0], transformD = transform[1][1];
            let theta = Math.atan2(transformC, transformA);
            let cos = Math.cos(theta), sin = Math.sin(theta);
            let s01 = transformB*cos + transformD*sin, s10 = -transformA*sin + transformC*cos;
            let skewX = Math.round(Math.atan(s01)/(Math.PI/180));
            let skewY = Math.round(Math.atan(s10)/(Math.PI/180));
            let clipColumn = 0;
            let clipRow = 0;
            if(node.layoutGrids){
                let [R,C] = getClipGrids(node)
                clipColumn = C.length
                clipRow = R.length
            };
            clipColumn = clipColumn <= 2 ? clipColumn : 0;
            clipRow = clipRow <= 2 ? clipRow : 0;
            let tableRow = 2;
            let tableColumn = 2;
            if(node.name.includes('@table') && node.children){
                let columns = node.children.filter(item => item.name.includes('@column'));
                let rows = columns.length > 0 ? columns[0].children.filter(item => ['@th','@td','@tn'].some(key => item.name.includes(key))) : [];
                tableColumn = columns.length > 0 ? columns.length : 2;
                tableRow = rows.length > 0 ? rows.length : 2;
            }
            data.push({n:n,w:w,h:h,transform:[skewX,skewY,scaleX,scaleY],clipRC:[clipRow,clipColumn],tableRC:[tableRow,tableColumn],nodeType:nodeType,});
        });
        //console.log(data)
        postmessage([data,'selectInfo']);
    } else {
        postmessage([[{n:null,w:null,h:null,transform:[0,0,100,100],clipRC:[0,0],tableRC:[2,2],nodeType:null}],'selectInfo']);
    };
};

sendSendComp();
function sendSendComp(){
    let a = mg.document.currentPage;
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
    mg.ui.postMessage({pluginMessage:data})
};

/**
 * @param {[object] | null} info -新建页面的设置项，命名、背景色、页码
 */
function addPageMix(info = [{name: null,fill: null}]){
    let finals = [];
    info.forEach( (item)=> {
        let newpage;
        try{
            newpage = mg.createPage();
        } catch(e){
            console.error(e);
        }
        if(item.name) newpage.name = item.name;
        if(item.fill) newpage.bgColor = toRGB(item.fill);
        finals.push(newpage)
    });
    return finals;
};

/**
 * @param {node} node - 要作为主组件的节点
 * @returns {node} - 创建的组件
 */
function createCompByNode(node){
    let main = [
        node.width,node.height,node.x,node.y,node.name,node.fills,
        [
            node.strokeAlign,
            [
                node.strokeTopWeight,
                node.strokeRightWeight,
                node.strokeBottomWeight,
                node.strokeLeftWeight
            ]
            ,node.strokes]
        ];
    let comp = mg.createComponent([node]);
    if(node.children){
        if(node.flexMode && node.flexMode !== 'NONE'){
            autoLayoutKeys.forEach(item => {
                if(node[item]){
                    comp[item] = node[item];
                }
            });
        };

        node.children.forEach(item => {
            comp.appendChild(item);
        });

        if(!node.removed){
            node.remove();
        }
    }
    
    setMain(main,comp);
    return comp;
}

/**
 * @param {Array} info - [w,h,x,y,name,[fills],[align,trbl,strokes]] 宽高、坐标、命名、填充、描边
 * @param {node} node - 需要设置的对象
 * @param {node?} cloneNode - 直接参考的对象
 */
function setMain(info,node,cloneNode){
    let viewX = Math.floor( mg.viewport.center.x - ((mg.viewport.bound.width/2  - 300)* mg.viewport.zoom));
    let viewY = Math.floor( mg.viewport.center.y - ((mg.viewport.bound.height/2  - 300)* mg.viewport.zoom));
    let w = info[0],h = info[1],x = info[2],y = info[3],n = info[4],fills = info[5];
    let hasnoFills = [
        'TEXT','GROUP',
    ]
    if(cloneNode){
        let  layerIndex = cloneNode.parent.children.findIndex(item => item.id == cloneNode.id);
        cloneNode.parent.insertChild((layerIndex + 1),node);
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
    node.width = w;
    node.height = h;

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
    strokes = strokes ? strokes : [{type:"SOLID",color:{r:0.5,g:0.5,b:0.5,a:1}}];
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
async function addImg(node,info){
    node = node ? node : mg.document.currentPage;
    let image = await mg.createImage(info.img)
    let img = mg.createRectangle();
    img.width = info.w;
    img.height = info.h;
    img.name = info.n;
    img.x = info.x;
    img.y = info.y;
    img.fills = [
        {
            type: 'IMAGE',
            imageRef: image.href,
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
        let cut = mg.createSlice();
        cut.x = x;
        cut.y = y;
        cut.width = w;
        cut.height = h;
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
        let image = mg.createImage(code);
        
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
            let cutimg = mg.createRectangle();
            cutimg.x = x;
            cutimg.y = y;
            cutimg.width = w;
            cutimg.height = h;
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
            mg.ungroup(group);
        } else {
            pixelSelects.push(group)
        };
        if(isOverWrite){
            if(old && index == cuts.length - 1){
                old.remove();
            };
        };
        
        if(isfinal){
            mg.document.currentPage.selection = pixelSelects;
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
    let node = mg.createFrame();
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
    if(node.parent !== mg.document.currentPage){
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
    
    /*frame需自行处理好父级偏移，以免重复计算
    if(frame.parent !== mg.document.currentPage){
        frame.x -= frame.parent.absoluteBoundingBox.x;
        frame.y -= frame.parent.absoluteBoundingBox.y;
    };
    */
    frame.appendChild(keynode);
    //大小相同直接归零
    if(keynode.width == frame.width && keynode.height == frame.height){
        frame.x = keynode.x;
        frame.y = keynode.y;
        keynode.x = 0;
        keynode.y = 0;
    } else {
        //大小不同则可能是包裹容器是用的渲染大小，要计算偏移值
        if(frame.parent !== mg.document.currentPage){
            keynode.x -= keynode.parent.x;
            keynode.y -= keynode.parent.y;
        }else{
            keynode.x -= keynode.parent.absoluteBoundingBox.x;
            keynode.y -= keynode.parent.absoluteBoundingBox.y;
        };
    };
    return frame;
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
        mg.viewport.scrollAndZoomIntoView(nodes);
        mg.viewport.zoom = mg.viewport.zoom * 0.6;
    }
};

//获取画板可用于创建画板的信息
/**
 * @param {Array} nodes - 节点数组
 * @param {boolean} isFloat - 是否浮点数
 * @param {number} floatNum - 浮点数精度，默认100
 * @returns {[{name:string,w:number,h:number}]} - 节点信息数组[{name:string,w:number,h:number}]
 */
function getMain(nodes,isFloat = false,floatNum = 100){
    if(nodes){
        let data = [];
        nodes.forEach(node => {
            let n = node.name;
            let w = isFloat ? Math.round(node.width * floatNum)/floatNum : node.width;
            let h = isFloat ? Math.round(node.height * floatNum)/floatNum : node.height;
            data.push({name:n,w:w,h:h})
        });
        return data;
    };
};

//上传导出为图片所需的信息
function exportImgInfo(set){
    let a = mg.document.currentPage;
    let b = getSelectionMix();
    let load = mg.notify('Uploading ( ' + b.length + ' layer)',{
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

//刷新导出图片所需的信息
function refreshExportImgInfo(info){
    let load = mg.notify('Refreshing ( ' + info.length + ' layer)',{
        timeout: 6000,
    });
    setTimeout(async ()=>{
        let infos = [];
        for(let i = 0; i < info.length; i++){
            let c = await mg.getNodeById([info[i].id]);
            if(c){
                let u8a = await c.exportAsync({
                    format: 'PNG',
                    constraint: { type: 'WIDTH', value: info[i].width },
                });
                infos.push({
                    id: info[i].id,
                    index: info[i].index,
                    u8a: u8a,
                });
            }
        };
        postmessage([infos,'refreshExportImgInfo']);
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
    
    let table = addFrame([528,208,null,null,'xxx@table',[toRGB('#2D2D2D',true)],[null,null,[toRGB('#666666',true)]]]);
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
    comp.width = 176;
    comp.height = 52;
    //comp.itemReverseZIndex = true;//前面堆叠在上
    comp = createCompByNode(comp);

    if(!nodes || typeof nodes == 'string'){
        makeCompliant(type,comp);
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
        let text = await addText([{family:'Source Han Sans',style:egtext[type][0]},egtext[type][1],16]);
        comp.appendChild(text);
        if(isFill){
            text.layoutSizingHorizontal = 'FILL';
            if(type == 'th') text.textAlignHorizontal = 'CENTER';
            //text.textAlignHorizontal = 'CENTER';
            comp.paddingLeft = 16;
            comp.paddingRight = 16;
        };
        
        //绑定数据的组件属性
        addCompPro(comp,text,'--data','TEXT',egtext[type][1]);
    }else{
        makeCompliant(type,comp);
        try{
            nodes.forEach(item =>{
                comp.appendChild(item);
            });
        } catch (e){
            console.log(e);
        };
        
    };
    
    return comp;
};
//判断是否是关键元素（用于描边/填充的容器）
//优先级：组件属性绑定 > 绝对定位元素 > 单侧描边矩形
function isKeyElement(item, keyWord){
    // 1. 检查是否有组件属性绑定（控制显隐）
    if(item.componentPropertyReferences && item.componentPropertyReferences.length > 0){
        // 如果绑定了visible属性，说明是用来控制显隐的关键元素
        if(item.componentPropertyReferences.visible){
            let comp = getParentAll(item,'COMPONENT');
            let pro = comp.componentProperties.find(item => item.id == item.componentPropertyReferences.visible);
            if(pro && keyWord.some(key => pro.name.includes(key))){
                return true;
            }
        }
    }
    
    // 2. 检查是否是绝对定位元素且名称包含关键词
    if(item.layoutPositioning === 'ABSOLUTE' && keyWord.some(key => item.name.includes(key))){
        return true;
    }
    
    // 3. 检查是否是单侧描边的矩形容器
    if(item.children && item.children.length === 1 && item.children[0].type === 'RECTANGLE'){
        let rect = item.children[0];
        // 有描边且无填充，且描边只有一侧
        if(rect.strokes && rect.strokes.length > 0 && (!rect.fills || rect.fills.length === 0)){
            // 检查描边是否只有一侧（通过strokeAlign或其他方式判断）
            let [bodT,bodR,bodB,bodL] = [rect.strokeTopWeight,rect.strokeRightWeight,rect.strokeBottomWeight,rect.strokeLeftWeight];
            let max = Math.max(bodT,bodR,bodB,bodL);
            let all = bodT + bodR + bodB + bodL;
            //简单判断为单侧描边，既最大值等于所有值之和
            if(max == all){
                return true;
            }
        }
    }
    
    return false;
}

//获取关键元素应该使用的属性名
function getKeyElementPropName(item, keyWord){
    let keyTop = ['-t','顶','上','top'];
    let keyBottom = ['-b','底','下','bottom'];
    let keyLeft = ['-l','左','left'];
    let keyRight = ['-r','右','right'];
    let keyFill = ['-fill','区分','区分色','fill'];
    
    let name = item.name.toLowerCase();
    
    if(keyTop.some(key => name.includes(key))){
        return '--bod-t';
    }
    if(keyBottom.some(key => name.includes(key))){
        return '--bod-b';
    }
    if(keyLeft.some(key => name.includes(key))){
        return '--bod-l';
    }
    if(keyRight.some(key => name.includes(key))){
        return '--bod-r';
    }
    if(keyFill.some(key => name.includes(key))){
        return '--fills';
    }
    
    return null;
}

//检查某个属性是否已经存在（通过属性定义或子元素名称）
//支持 componentPropertyDefinitions 的 name#id 格式
function hasProperty(comp, propName){
    let allProps = comp.componentPropertyDefinitions || {};
    
    //检查组件属性定义中是否存在（查找name部分匹配的）
    let propKey = Object.keys(allProps).find(key => {
        //从 name#id 格式中提取 name 部分
        let parts = key.split('#');
        let name = parts[0];
        return name === propName;
    });
    if(propKey){
        return true;
    }
    
    //对于 --fills，同时检查 --fill（兼容旧版本）
    if(propName === '--fills'){
        let fillKey = Object.keys(allProps).find(key => {
            let parts = key.split('#');
            let name = parts[0];
            return name === '--fill';
        });
        if(fillKey){
            return true;
        }
    }
    
    //检查子元素中是否有使用该属性名的
    if(comp.children && comp.children.some(child => child.name.includes(propName))){
        return true;
    }
    
    //对于 --fills，同时检查子元素中的 --fill
    if(propName === '--fills'){
        if(comp.children && comp.children.some(child => child.name.includes('--fill'))){
            return true;
        }
    }
    
    return false;
}

//表格初始化
//可以传入需要添加的属性数组，如果不传则添加所有必要属性
function makeCompliant(type, comp, specificProps = null){
    let allBodFills = [];
    let allAdds = [
        [`#table.fill`,[toRGB('#666666',true)],null,'--fills'],
        [`#table.stroke`,[],[null,[0,0,0,1]],'--bod-l'],
        [`#table.stroke`,[],[null,[0,0,1,0]],'--bod-b'],
        [`#table.stroke`,[],[null,[0,1,0,0]],'--bod-r'],
        [`#table.stroke`,[],[null,[1,0,0,0]],'--bod-t'],
    ];
    
    //如果指定了特定属性，只添加这些属性
    let addsToAdd = [];
    if(specificProps && Array.isArray(specificProps)){
        //只添加指定的属性
        addsToAdd = allAdds.filter(add => specificProps.includes(add[3]));
    } else {
        //如果没有指定，检查缺失的属性并只添加缺失的
        addsToAdd = allAdds.filter(add => !hasProperty(comp, add[3]));
    }
    
    for(let i = 0; i < addsToAdd.length; i++){
        //添加描边、填充并绑定组件属性
        let bodfill = addBodFill(comp, addsToAdd[i], type);
        allBodFills.push(bodfill);
    };
    return allBodFills;
};
//添加描边/区分色
function addBodFill(node,Array,type){
    let bodfill = mg.createRectangle();
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
    return bodfills;
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
    mg.document.currentPage.selection = all;
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

    let box1 = mg.createRectangle();
    box1.width = 30;
    box1.height = 30;
    box1.name = '#sheet.fillStyle';
    box1.fills = [toRGB('#ffffff',true)];
    let box2 = mg.createRectangle();
    box2.width = 30;
    box2.height = 30;
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
    
    const variablePages = mg.document.children.filter(item => item.name.includes('@localsheet'));
    
    const datas = type === 'style' ? localStyleToArray() : localVariableToArray();

    for (let [index, data] of datas.entries()) {
        let finaltable, finalpage;
        if (isNew) {
            finalpage = variablePages.length === 0 
                ? (() => { 
                    const page = addPageMix()[0];
                    console.log(page)
                    page.name = 'xxx@localsheet/颜色样式表';
                    page.label = 'PURPLE';
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
        
        mg.document.currentPage = finalpage;
        
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
    let CC = table.children.length;
    let RR = table.children[0].children.length;
    //console.log(datas.length - CC,datas[0].length - RR)
    reCompNum(table,datas.length - CC,datas[0].length - RR);
    datas.forEach((data,num) => {
        try{
            table.children[num].children.forEach((comp,index) => {
                if(comp.type == 'INSTANCE'){
                    let value = data[index];
                    //console.log(value)
                    if(typeof value == 'string' || table.name.includes('variable')){
                        let key = comp.componentProperties.find(item => item.name == '--data').id;
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
                            boxBod.strokeStyleId = value.id;
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
function getStyle(type,isSend){
    let info = {list:[],nodes:[]}
    switch (type){
        case "paint":
            let styles = mg.getLocalPaintStyles()
            //有哪些样式
            info.list = styles.map(item =>{
                return {
                    id: item.id,
                    name: item.name,
                    paints: item.paints,
                }
            });
            if(isSend){
                let hasStyle = info.list.some(node => node.name.includes('@set:')) ? true : false;
                postmessage([hasStyle,'styleInfo']);
            };
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
function getStyleSheet(){
    let pages = mg.document.children.filter(item => item.name.includes('@localsheet'));
    for(let page of pages){
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
function getVariableSheet(){
    let pages = mg.document.children.filter(item => item.name.includes('@localsheet'));
    for(let page of pages){
        page.loadAsync();
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
    let collections = await mg.variables.getLocalVariableCollectionsAsync()
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
        let promises = item.variableIds.map(id => mg.variables.getVariableByIdAsync(id))
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
                themeName = comps.find(item => item[0].includes('--data'))[1].value;
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
        BOOLEAN: 'isVisible',
        TEXT: 'characters',
        INSTANCE_SWAP: 'mainComponent'
    }
    let proid = node.addComponentProperty(name,type,value);
    layer.componentPropertyReferences = {[typekey[type]]:proid};
    return proid;
};
//修改表格样式
function reTableStyle(table,style,comps){
    //console.log(style)
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

        comp.componentProperties.forEach(property => {
            //console.log(property)
            let key = property.id;
            /**/
            switch (property.name){
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
// ============================================================================
// 主题系统：颜色转换函数
// ============================================================================
/**
 * HSL转RGB
 * @param {number} h - 色相 (0-360)
 * @param {number} s - 饱和度 (0-100)
 * @param {number} l - 亮度 (0-100)
 * @returns {{r: number, g: number, b: number}}
 */
function hslToRgb(h, s, l) {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/**
 * RGB转Hex
 * @param {number} r - 红色 (0-255)
 * @param {number} g - 绿色 (0-255)
 * @param {number} b - 蓝色 (0-255)
 * @returns {string}
 */
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Hex转RGB（用于处理hex输出转RGB，如设置透明度时）
 * @param {string} hex - 十六进制颜色字符串（如 '#FF0000'）
 * @returns {{r: number, g: number, b: number, a: number}|null}
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
        a: 1
    } : null;
}

/**
 * 解析HSL颜色（支持HSL对象或HSL字符串）
 * @param {Object|string} colorInput - HSL颜色对象 {h, s, l} 或HSL字符串 "hsl(360, 100%, 50%)"
 * @returns {{h: number, s: number, l: number}|null}
 */
function parseColorToHsl(colorInput) {
    if (!colorInput) return null;
    
    // 如果已经是HSL对象
    if (typeof colorInput === 'object' && colorInput.h !== undefined && colorInput.s !== undefined && colorInput.l !== undefined) {
        return {
            h: colorInput.h,
            s: colorInput.s,
            l: colorInput.l
        };
    }
    
    // 如果是HSL字符串: hsl(360, 100%, 50%) 或 hsl(360 100% 50%)
    if (typeof colorInput === 'string') {
        const hslMatch = colorInput.match(/hsl\(?\s*(\d+)\s*[,\s]\s*(\d+)%\s*[,\s]\s*(\d+)%\s*\)?/i);
        if (hslMatch) {
            return {
                h: parseInt(hslMatch[1]),
                s: parseInt(hslMatch[2]),
                l: parseInt(hslMatch[3])
            };
        }
    }
    
    return null;
}

// ============================================================================
// 主题系统：颜色映射预设配置
// ============================================================================
const colorMappingPresets = {
    'Normal': {
        primaryTarget: 'bgColor',
        rgbOffset: { r: 0, g: 0, b: 0 },
        saturationRange: { min: 10, max: 90 },
        lightnessRange: { level: [1,2,3,4,11,12,13,14,15] },
        bgColor: {},
        headerFillColor: { lightnessOffset: 13, saturationMultiplier: 0.8 },
        cellFillColor: { lightnessOffset: 13, saturationMultiplier: 0.8 },
        headerTextColor: { contrastThreshold: 50 },
        cellTextColor: { contrastThreshold: 50 },
        strokeColor: { lightnessOffset: 20, relativeTo: 'headerFillColor' },
        hasHeader: true,
        fillStyle: 2,
        strokeStyle: 1
    },
    'Soft': {
        primaryTarget: 'bgColor',
        rgbOffset: { r: 0, g: 0, b: 0 },
        saturationRange: { min: 10, max: 80 },
        lightnessRange: { level: [1,2,3,4,5,11,12,13,14,15] },
        bgColor: {},
        headerFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
        cellFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
        headerTextColor: { lightnessOffset: 30, relativeTo: 'headerFillColor' },
        cellTextColor: { lightnessOffset: 30, relativeTo: 'headerFillColor' },
        strokeColor: { lightnessOffset: 10, relativeTo: 'headerFillColor' },
        hasHeader: true,
        fillStyle: 2,
        strokeStyle: 1
    },
    'Fashion': {
        primaryTarget: 'headerFillColor',
        rgbOffset: { r: 0, g: 0, b: 0 },
        saturationRange: { min: 50, max: 90 },
        lightnessRange: { level: [9,10,11] },
        bgColor: { lightnessOffset: 405, saturationMultiplier: 0.95 },
        headerFillColor: {},
        cellFillColor: { lightnessOffset: 10, saturationMultiplier: 1, opacity: 0.3 },
        headerTextColor: { contrastThreshold: 50 },
        cellTextColor: { contrastThreshold: 50 },
        strokeColor: { lightnessOffset: 0.1, relativeTo: 'headerFillColor' },
        hasHeader: true,
        fillStyle: 2,
        strokeStyle: 4
    },
    'Contrast': {
        primaryTarget: null,
        rgbOffset: { r: 0, g: 0, b: 0 },
        saturationRange: { min: 50, max: 90 },
        lightnessRange: { level: [9,10,11,12,13,14,15] },
        bgColor: { color: 'white' },
        headerFillColor: { color: 'black' },
        cellFillColor: { lightnessOffset: 0, saturationMultiplier: 1, opacity: 0.8 },
        headerTextColor: { color: 'white' },
        cellTextColor: { color: 'black' },
        strokeColor: { color: 'black' },
        hasHeader: true,
        fillStyle: 2,
        strokeStyle: 1
    },
    'Vivid': {
        primaryTarget: 'bgColor',
        rgbOffset: { r: 0, g: 0, b: 0 },
        saturationRange: { min: 80, max: 100 },
        lightnessRange: { level: [1,2,3,4,5,6,7,8,9,10,11,12,13] },
        bgColor: {},
        headerFillColor: { lightnessOffset: 25, saturationMultiplier: 0.9 },
        cellFillColor: { lightnessOffset: 25, saturationMultiplier: 0.9 },
        headerTextColor: { contrastThreshold: 50 },
        cellTextColor: { contrastThreshold: 50 },
        strokeColor: { lightnessOffset: 10, relativeTo: 'bgColor' },
        hasHeader: true,
        fillStyle: 2,
        strokeStyle: 1
    },
    'Pastel': {
        primaryTarget: 'bgColor',
        rgbOffset: { r: -10, g: -40, b: 20 },
        saturationRange: { min: 40, max: 100 },
        lightnessRange: { level: [12,13,14,15] },
        bgColor: {},
        headerFillColor: { lightnessOffset: 15, saturationMultiplier: 0.9 },
        cellFillColor: { lightnessOffset: 15, saturationMultiplier: 0.9 },
        headerTextColor: { contrastThreshold: 50 },
        cellTextColor: { contrastThreshold: 50 },
        strokeColor: { lightnessOffset: 10, relativeTo: 'bgColor' },
        hasHeader: true,
        fillStyle: 2,
        strokeStyle: 1
    },
    'Retro': {
        primaryTarget: 'bgColor',
        rgbOffset: { r: 40, g: 30, b: -20 },
        saturationRange: { min: 10, max: 70 },
        lightnessRange: { level: [1,2,3,4,5,6,7,8,9,10,11,12,13,14] },
        bgColor: {},
        headerFillColor: { lightnessOffset: 30, saturationMultiplier: 0.5 },
        cellFillColor: { lightnessOffset: 30, saturationMultiplier: 0.5 },
        headerTextColor: { contrastThreshold: 50 },
        cellTextColor: { contrastThreshold: 50 },
        strokeColor: { lightnessOffset: 0, relativeTo: 'bgColor' },
        hasHeader: true,
        fillStyle: 2,
        strokeStyle: 4
    },
    'Neon': {
        primaryTarget: null,
        rgbOffset: { r: 0, g: 0, b: 0 },
        saturationRange: { min: 80, max: 100 },
        lightnessRange: { level: [5,6,7,8,9,10,11,12] },
        bgColor: { color: 'black' },
        headerFillColor: { lightnessOffset: 5, saturationMultiplier: 1 },
        cellFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
        headerTextColor: { color: 'black' },
        cellTextColor: { color: 'theme' },
        strokeColor: { color: 'theme' },
        hasHeader: true,
        fillStyle: 2,
        strokeStyle: 2
    }
};

// ============================================================================
// 主题系统：主题色计算函数
// ============================================================================
/**
 * 计算主题颜色（优化版：支持1%单位的色阶区间和安全范围）
 * @param {Object|string} themeColor - 主题色（HSL对象 {h, s, l} 或HSL字符串 "hsl(360, 100%, 50%)"）
 * @param {string} themeName - 主题名称（Normal/Soft/Fashion等）
 * @param {number} lightnessValue - 可选：亮度值（0-100），如果不提供则从主题色提取
 * @returns {Object} 各部位颜色值（hex格式）
 */
function calculateThemeColors(themeColor, themeName, lightnessValue) {
    // 获取主题预设配置
    const mappingConfig = colorMappingPresets[themeName] || colorMappingPresets['Fashion'];
    
    // 解析主题色为HSL
    const themeHsl = parseColorToHsl(themeColor);
 
    if (!themeHsl) {
        // 如果解析失败，使用默认值
        return {
            bgColor: '#2D2D2D',
            headerFillColor: '#3D3D3D',
            headerTextColor: '#FFFFFF',
            cellFillColor: '#2D2D2D',
            cellTextColor: '#D4D4D4',
            strokeColor: '#666666'
        };
    }
    
    // 获取亮度值（如果提供了lightnessValue则使用，否则从主题色提取）
    let lightness = lightnessValue !== undefined ? parseFloat(lightnessValue) : themeHsl.l;
    
    // 应用lightnessRange限制（基于level范围）
    const lightnessRange = mappingConfig.lightnessRange;
    if (lightnessRange && lightnessRange.level && lightnessRange.level.length > 0) {
        // level=1 代表范围 0 到 100/15（约 0-6.67）
        // level=2 代表范围 100/15 到 100*2/15（约 6.67-13.33）
        // level=n 代表范围 100*(n-1)/15 到 100*n/15
        const validLevels = lightnessRange.level.sort((a, b) => a - b);
        
        // 计算当前lightness属于哪个level
        // level=1 代表范围 [0, 100/15)，level=2 代表范围 [100/15, 100*2/15)，...
        // level=15 代表范围 [100*14/15, 100]
        const getLevelFromLightness = (l) => {
            if (l <= 0) return 1;
            if (l >= 100) return 15;
            // 计算level：level = floor(l * 15 / 100) + 1
            // 但需要处理边界：l = 100/15 时应该属于 level=2
            const level = Math.floor(l * 15 / 100) + 1;
            return Math.min(15, Math.max(1, level));
        };
        
        const currentLevel = getLevelFromLightness(lightness);
        
        // 如果当前level不在有效范围内，找到最近的有效level并限制到该范围
        if (!validLevels.includes(currentLevel)) {
            // 找到最近的有效level（优先选择较小的level，如果距离相等）
            let nearestLevel = validLevels[0];
            let minDiff = Math.abs(currentLevel - nearestLevel);
            for (let i = 1; i < validLevels.length; i++) {
                const diff = Math.abs(currentLevel - validLevels[i]);
                if (diff < minDiff || (diff === minDiff && validLevels[i] < nearestLevel)) {
                    minDiff = diff;
                    nearestLevel = validLevels[i];
                }
            }
            
            // 限制到最近有效level的范围
            // level=n 的范围是 [100*(n-1)/15, 100*n/15)
            const levelMin = (nearestLevel - 1) * 100 / 15;
            const levelMax = nearestLevel * 100 / 15;
            
            // 如果lightness小于level的最小值，限制到最小值
            // 如果lightness大于等于level的最大值，限制到最大值（但不包含，所以用levelMax-0.01）
            if (lightness < levelMin) {
                lightness = levelMin;
            } else if (lightness >= levelMax) {
                // 限制到levelMax，但不包含（因为levelMax是下一个level的起点）
                // 对于最后一个level（15），levelMax=100，应该包含
                if (nearestLevel === 15) {
                    lightness = levelMax;
                } else {
                    lightness = levelMax - 0.01;
                }
            }
        } else {
            // 如果当前level在有效范围内，确保lightness在该level的范围内
            const levelMin = (currentLevel - 1) * 100 / 15;
            const levelMax = currentLevel * 100 / 15;
            // 确保lightness在[levelMin, levelMax)范围内
            if (lightness < levelMin) {
                lightness = levelMin;
            } else if (lightness >= levelMax && currentLevel < 15) {
                // 如果不是最后一个level，限制到levelMax（但不包含）
                lightness = levelMax - 0.01;
            }
        }
    }
    
    // 判断是否为灰色（饱和度很低）
    const isGray = themeHsl.s <= 5;
    const actualHue = themeHsl.h;
    
    // 检查是否有RGB偏移（复古样式等）
    const hasRetroOffset = mappingConfig.rgbOffset && (
        (mappingConfig.rgbOffset.r !== undefined && mappingConfig.rgbOffset.r !== 0) ||
        (mappingConfig.rgbOffset.g !== undefined && mappingConfig.rgbOffset.g !== 0) ||
        (mappingConfig.rgbOffset.b !== undefined && mappingConfig.rgbOffset.b !== 0)
    );
    
    // 应用饱和度阈值范围
    // 注意：灰度主题（isGray）下必须保持 s=0；否则会被 saturationRange.min 夹成非0，
    // 从而导致 primaryTarget 直接使用 primaryS 时出现“带饱和度的灰色”。
    let baseSaturation = isGray ? 0 : themeHsl.s;
    if (!isGray) {
        if (mappingConfig.saturationRange) {
            const { min, max } = mappingConfig.saturationRange;
            baseSaturation = Math.max(min, Math.min(max, baseSaturation));
        } else {
            baseSaturation = Math.max(10, Math.min(90, baseSaturation));
        }
    }
    
    // 确定主题色作用在哪个部位
    let primaryL = lightness;
    let primaryS = baseSaturation;
    
    // 计算各个部位的颜色
    const calculateColor = (target, config) => {
        // 如果直接指定了颜色，返回固定颜色
        if (config && config.color === 'black') {
            return { l: 0, s: 0, isFixed: true, fixedColor: '#000000' };
        }
        if (config && config.color === 'white') {
            return { l: 100, s: 0, isFixed: true, fixedColor: '#FFFFFF' };
        }
        
        if (mappingConfig.primaryTarget === target) {
            // 如果这个部位是主题色目标，直接使用主题色
            return { l: primaryL, s: primaryS };
        }
        
        // 否则根据配置计算（基于主题色计算衍生值）
        const configL = (config && config.lightnessOffset) || 0;
        const configS = (config && config.saturationOffset) || 0;
        const configSMul = (config && config.saturationMultiplier) || 1;
        
        let targetL = primaryL + configL;
        let targetS = (primaryS + configS) * configSMul;
        
        // 限制范围（1%单位精度）
        targetL = Math.max(0, Math.min(100, targetL));
        targetS = Math.max(0, Math.min(100, targetS));
        
        // 如果是灰色，饱和度为0
        if (isGray) targetS = 0;
        
        return { l: targetL, s: targetS };
    };
    
    // 应用RGB偏移的辅助函数
    const applyRgbOffset = (r, g, b, globalOffset, localOffset) => {
        let finalR = r;
        let finalG = g;
        let finalB = b;
        
        // 如果是灰色且不是复古样式，不应用RGB偏移
        if (isGray && !hasRetroOffset) {
            return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
        }
        
        // 先应用全局偏移
        if (globalOffset) {
            finalR += globalOffset.r || 0;
            finalG += globalOffset.g || 0;
            finalB += globalOffset.b || 0;
        }
        
        // 再应用局部偏移（叠加）
        if (localOffset) {
            finalR += localOffset.r || 0;
            finalG += localOffset.g || 0;
            finalB += localOffset.b || 0;
        }
        
        // 限制在0-255范围内
        finalR = Math.max(0, Math.min(255, Math.round(finalR)));
        finalG = Math.max(0, Math.min(255, Math.round(finalG)));
        finalB = Math.max(0, Math.min(255, Math.round(finalB)));
        
        return rgbToHex(finalR, finalG, finalB);
    };
    
    // 计算背景色
    const bgConfig = calculateColor('bgColor', mappingConfig.bgColor);
    const bgColor = bgConfig.isFixed ? bgConfig.fixedColor : (() => {
        const rgb = hslToRgb(actualHue, bgConfig.s, bgConfig.l);
        return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, mappingConfig.bgColor && mappingConfig.bgColor.rgbOffset);
    })();
    
    // 计算表头填充色
    const headerConfig = calculateColor('headerFillColor', mappingConfig.headerFillColor);
    const headerFillColor = headerConfig.isFixed ? headerConfig.fixedColor : (() => {
        const rgb = hslToRgb(actualHue, headerConfig.s, headerConfig.l);
        return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, mappingConfig.headerFillColor && mappingConfig.headerFillColor.rgbOffset);
    })();
    
    // 计算单元格填充色
    const cellConfig = calculateColor('cellFillColor', mappingConfig.cellFillColor);
    const cellFillColor = cellConfig.isFixed ? cellConfig.fixedColor : (() => {
        const rgb = hslToRgb(actualHue, cellConfig.s, cellConfig.l);
        return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, mappingConfig.cellFillColor && mappingConfig.cellFillColor.rgbOffset);
    })();
    
    // 计算文字颜色
    let headerTextColor;
    const headerTextConfig = mappingConfig.headerTextColor;
    if (headerTextConfig && headerTextConfig.color === 'black') {
        headerTextColor = '#000000';
    } else if (headerTextConfig && headerTextConfig.color === 'white') {
        //console.log('headerTextConfig:',headerTextConfig)
        headerTextColor = '#FFFFFF';
    } else if (headerTextConfig && headerTextConfig.color === 'theme') {
        const themeRgb = hslToRgb(actualHue, primaryS, primaryL);
        headerTextColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, headerTextConfig && headerTextConfig.rgbOffset);
    } else if ((headerTextConfig && headerTextConfig.relativeTo) || (headerTextConfig && headerTextConfig.lightnessOffset !== undefined)) {
        let headerTextL, headerTextS;
        
        if (headerTextConfig.relativeTo) {
            let baseL, baseS;
            if (headerTextConfig.relativeTo === 'bgColor') {
                baseL = bgConfig.l;
                baseS = bgConfig.s;
            } else if (headerTextConfig.relativeTo === 'headerFillColor') {
                baseL = headerConfig.l;
                baseS = headerConfig.s;
            } else {
                baseL = cellConfig.l;
                baseS = cellConfig.s;
            }
            
            const offset = headerTextConfig.lightnessOffset || 15;
            if (lightness < 50) {
                headerTextL = Math.min(100, baseL + offset);
            } else {
                headerTextL = Math.max(0, baseL - offset);
            }
            headerTextS = baseS;
        } else {
            const offset = (headerTextConfig && headerTextConfig.lightnessOffset) || 15;
            if (lightness < 50) {
                headerTextL = Math.min(100, headerConfig.l + offset);
            } else {
                headerTextL = Math.max(0, headerConfig.l - offset);
            }
            headerTextS = headerConfig.s;
        }
        
        const headerTextRgb = hslToRgb(actualHue, headerTextS, headerTextL);
        headerTextColor = applyRgbOffset(headerTextRgb.r, headerTextRgb.g, headerTextRgb.b, mappingConfig.rgbOffset, headerTextConfig && headerTextConfig.rgbOffset);
    } else {
        const headerThreshold = (headerTextConfig && headerTextConfig.contrastThreshold) || 50;
        headerTextColor = headerConfig.l >= headerThreshold ? '#000000' : '#FFFFFF';
    }
    
    let cellTextColor;
    const cellTextConfig = mappingConfig.cellTextColor;
    if (cellTextConfig && cellTextConfig.color === 'black') {
        cellTextColor = '#000000';
    } else if (cellTextConfig && cellTextConfig.color === 'white') {
        cellTextColor = '#FFFFFF';
    } else if (cellTextConfig && cellTextConfig.color === 'theme') {
        const themeRgb = hslToRgb(actualHue, primaryS, primaryL);
        cellTextColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, cellTextConfig && cellTextConfig.rgbOffset);
    } else if ((cellTextConfig && cellTextConfig.relativeTo) || (cellTextConfig && cellTextConfig.lightnessOffset !== undefined)) {
        let cellTextL, cellTextS;
        
        if (cellTextConfig.relativeTo) {
            let baseL, baseS;
            if (cellTextConfig.relativeTo === 'bgColor') {
                baseL = bgConfig.l;
                baseS = bgConfig.s;
            } else if (cellTextConfig.relativeTo === 'headerFillColor') {
                baseL = headerConfig.l;
                baseS = headerConfig.s;
            } else {
                baseL = cellConfig.l;
                baseS = cellConfig.s;
            }
            
            const offset = cellTextConfig.lightnessOffset || 15;
            if (lightness < 50) {
                cellTextL = Math.min(100, baseL + offset);
            } else {
                cellTextL = Math.max(0, baseL - offset);
            }
            cellTextS = baseS;
        } else {
            const offset = (cellTextConfig && cellTextConfig.lightnessOffset) || 15;
            if (lightness < 50) {
                cellTextL = Math.min(100, cellConfig.l + offset);
            } else {
                cellTextL = Math.max(0, cellConfig.l - offset);
            }
            cellTextS = cellConfig.s;
        }
        
        const cellTextRgb = hslToRgb(actualHue, cellTextS, cellTextL);
        cellTextColor = applyRgbOffset(cellTextRgb.r, cellTextRgb.g, cellTextRgb.b, mappingConfig.rgbOffset, cellTextConfig && cellTextConfig.rgbOffset);
    } else {
        const cellThreshold = (cellTextConfig && cellTextConfig.contrastThreshold) || 50;
        cellTextColor = cellConfig.l >= cellThreshold ? '#000000' : '#FFFFFF';
    }
    
    // 计算描边色
    const strokeConfig = mappingConfig.strokeColor;
    let strokeColor;
    
    if (strokeConfig && strokeConfig.color === 'black') {
        strokeColor = '#000000';
    } else if (strokeConfig && strokeConfig.color === 'white') {
        strokeColor = '#FFFFFF';
    } else if (strokeConfig && strokeConfig.color === 'theme') {
        const themeRgb = hslToRgb(actualHue, primaryS, primaryL);
        strokeColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, strokeConfig && strokeConfig.rgbOffset);
    } else {
        let strokeL, strokeS;
        
        if (strokeConfig && strokeConfig.relativeTo) {
            let baseL, baseS;
            if (strokeConfig.relativeTo === 'bgColor') {
                baseL = bgConfig.l;
                baseS = bgConfig.s;
            } else if (strokeConfig.relativeTo === 'headerFillColor') {
                baseL = headerConfig.l;
                baseS = headerConfig.s;
            } else {
                baseL = cellConfig.l;
                baseS = cellConfig.s;
            }
            
            const offset = strokeConfig.lightnessOffset || 15;
            if (lightness < 50) {
                strokeL = Math.min(100, baseL + offset);
            } else {
                strokeL = Math.max(0, baseL - offset);
            }
            strokeS = baseS;
        } else {
            const offset = (strokeConfig && strokeConfig.lightnessOffset) || 15;
            if (lightness < 50) {
                strokeL = Math.min(100, headerConfig.l + offset);
            } else {
                strokeL = Math.max(0, headerConfig.l - offset);
            }
            strokeS = headerConfig.s;
        }
        
        const strokeRgb = hslToRgb(actualHue, strokeS, strokeL);
        strokeColor = applyRgbOffset(strokeRgb.r, strokeRgb.g, strokeRgb.b, mappingConfig.rgbOffset, strokeConfig && strokeConfig.rgbOffset);
    }
    //console.log('headerTextColor-final:',headerTextColor)
    return {
        bgColor,
        headerFillColor,
        headerTextColor,
        cellFillColor,
        cellTextColor,
        strokeColor
    };
}

//按预设应用表格主题
/**
 * 按预设应用表格主题
 * @param {Object} table - 表格节点
 * @param {Object} setdata - 设置数据 {themeColor: Object|string, themeName: string, lightnessValue?: number}
 *   themeColor: HSL对象 {h, s, l} 或HSL字符串 "hsl(360, 100%, 50%)"
 */
function reTableThemeByPreset(table, setdata) {
    if (!table || !setdata) return;

    const [themeName,themeColor] = setdata;
    if (!themeColor || !themeName) return;

    // 计算主题颜色
    const themeColors = calculateThemeColors(themeColor, themeName);
    
    // 应用背景色和描边色
    if(table.fills.length > 0) table.fills = [toRGB(themeColors.bgColor, true)];
    if(table.strokes.length > 0) table.strokes = [toRGB(themeColors.strokeColor, true)];
     

    //利用标签应用主题色
    let ths = table.findAll(item => item.name.includes('@th'));
    let tds = table.findAll(item => item.name.includes('@td') || item.name.includes('@tn'));

    ths.forEach(item => {
        reAnyByTags([item],[{
            '#table.fill': themeColors.headerFillColor,
            '#table.stroke': themeColors.strokeColor,
        }]);
        let datas = item.findAll(items => items.componentPropertyReferences && 
            items.componentPropertyReferences.characters && 
            item.componentProperties.find(item => item.id == items.componentPropertyReferences.characters).name == '--data');
        datas.forEach(item => {
            item.fills = [toRGB(themeColors.headerTextColor, true)];
        });
    });
    tds.forEach(item => {
        reAnyByTags([item], [{
            '#table.fill': themeColors.cellFillColor,
            '#table.stroke': themeColors.strokeColor,
        }]);
        let datas = item.findAll(items => items.componentPropertyReferences && 
            items.componentPropertyReferences.characters && 
            item.componentProperties.find(item => item.id == items.componentPropertyReferences.characters).name == '--data');
        datas.forEach(item => {
            item.fills = [toRGB(themeColors.cellTextColor, true)];
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
        let textPros = comp.componentProperties.filter(item => item.type == 'TEXT');
        //console.log(textPros)
        let dataPros = textPros.filter(item => item.name == '--data');
        //console.log(dataPros)
        //表格优先，其次任意文本类型组件属性
        if(istable && dataPros && dataPros.length > 0){
            textPros = dataPros;
        };
        textPros.forEach((item,index)=> {
            if(Array[i] !== undefined){
                if(Array[i] == ''){
                    comp.setProperties({[item.id]: nulls});
                } else {
                    let reg = enters.replace(/[-[${}()*+?.,\\^$|#\s]/g, '\\$&');
                    comp.setProperties({[item.id]: Array[i].toString().replace(new RegExp(reg,'g'),'\n')});
                };
            } else if (i == comps.length - 1 && comps.length == Array.length){
                comp.setProperties({[item.id]: nulls});
            };
        });
    };
};
//按对象修改组件属性
function reAnyByObj(comps,obj,enters,nulls){
    //console.log(comps,obj)
    let keyPros = Object.keys(obj[0]);
    let errornode = []
    for(let i = 0; i < comps.length; i++){
        let comp = comps[i];
        let rePros = comp.componentProperties.filter(item => keyPros.includes(item.name));
        setPro(comp,rePros,obj[i])

        //内嵌组件时，也要替换
        let compChilds = comp.findAll(items => items.type == 'INSTANCE');// && items.componentProperties.length > 0
        //console.log(compChilds)
        for(let ii = 0; ii < compChilds.length; ii++){
            let compChild = compChilds[ii];
            //console.log(compChild)
            let childRePros = (compChild.componentProperties.filter(pro => keyPros.includes(pro.name)));
            //console.log(childRePros)
            setPro(compChild,childRePros,obj[i]);
        };
    };

    //选中错误处
    //console.log(errornode)
    if(errornode.length > 0){
        let errordata = errornode.map(item => item[1]).join(',')
        mg.clientStorage.getAsync('userLanguage')
        .then (async (language) => {
            let text = language == 'Zh' ? '无效数据: ' + errordata : 'Erroneous data:' +  errordata;
            mg.notify(text,{
                error:true,
                timeout: 6000,
            });
        });
        mg.document.currentPage.selection = errornode.map(item => item[0]);
    };

    function setPro(node,pros,data){
        pros.forEach(pro => {
            //console.log(pro,data[pro.split('#')[0]]);
            if(data){
                //console.log(pro,obj)
                let value = data[pro.name];
                //console.log(pro,value)
                if(pro.type !== 'BOOLEAN'){
                    if(typeof value == 'number' && pro.type == "VARIANT"){

                        let compset = node.mainComponent;
                        //console.log(compset.parent.componentPropertyDefinitions[pro].variantOptions);
                        let findByNum = compset.parent.componentPropertyDefinitions[0].values[value - 1];
                        //console.log(findByNum)
                        value = findByNum ? findByNum : value;
                        value = value.toString();
                        try {
                            node.setProperties({[pro.id]: value});
                        } catch (error) {
                            console.log(error);
                            errornode.push([node,value]);
                        };

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
                            node.setProperties({[pro.id]: value});
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
                        node.setProperties({[pro.id]: value});
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
/**
 * @param {Array} nodes - 节点数组
 * @param {Array} objs - 对象数组 [{tag: value}]
 * @returns {void} 
 */
function reAnyByTags(nodes,objs){
    if(!nodes || !objs) return;
    if(nodes.length != objs.length) return;
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
                if(objs[i][tag]){
                    
                    try {
                        setByTags(layer,tag.split('.')[1],objs[i][tag]);
                    } catch (error) {
                        console.log(error);
                        mg.clientStorage.getAsync('userLanguage')
                        .then (async (language) => {
                            let text = language == 'Zh' ? '含无效数据' : 'Erroneous data'
                            mg.notify(text,{
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
                mg.getLocalPaintStyles()
                .then(list => {
                    let id = list.find(item => item.name == value).id
                    if(id){
                        layer.fillStyleId = id;
                    };
                });
            ;break
            case 'strokeStyle':
                mg.getLocalPaintStyles()
                .then(list => {
                    let id = list.find(item => item.name == value).id
                    if(id){
                        layer.strokeStyleId = id;
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
                    layer.setRangeFontSize(0,layer.characters.length,value);
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
        let textPros = comp.componentProperties.filter( item => item.type == 'TEXT');
        let dataPros = textPros.filter(item => item.name == '--data');
        if(istable && dataPros && dataPros.length > 0){
            textPros = dataPros;
        };
        let value = textPros[0].value;
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
        comp.componentProperties.forEach(item => {
            pros[item.name] = item.value
        });
        datas.push(pros)
    };
    //console.log(datas)
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
    let C = datas[0].length - columns.length;
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
    
    reCompNum(newTable,C);
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
    mg.document.currentPage.selection = [newTable]
};
//选中表格行/区域
function easePickTable(type,nodes){
    let a = mg.document.currentPage;
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
 * - T = Top (上) = 垂直方向的FLEX_START
 * - B = Bottom (下) = 垂直方向的FLEX_END
 * - L = Left (左) = 水平方向的FLEX_START
 * - R = Right (右) = 水平方向的FLEX_END
 * - C = Center (居中)
 * - S = Space Between (仅在主轴方向有效)
 * - A = Baseline (仅在H模式的次轴方向有效，即垂直方向)
 * 
 * 示例：'TL' = 左上对齐
 * - H模式：主轴(水平)=L(左/FLEX_START)，副轴(垂直)=T(上/FLEX_START)
 *   → HTML: flex-direction: row; justify-content: flex-start; align-items: flex-start;
 * - V模式：主轴(垂直)=T(上/FLEX_START)，副轴(水平)=L(左/FLEX_START)
 *   → HTML: flex-direction: column; justify-content: flex-start; align-items: flex-start;
 */
function addAutoLayout(node,layout,isFixed,isWrap){
    node.layoutPositioning = 'AUTO';
    if(isFixed){
        node.mainAxisSizingMode = isFixed[0] ? "FIXED" : "AUTO";
        node.crossAxisSizingMode = isFixed[1] ? "FIXED" : "AUTO";
    };
    node.clipsContent = false;//默认超出不裁剪
    
    const align = layout[1] || 'TL'; // 默认左上对齐
    const verticalAlign = align[0]; // 第一个字符：垂直方向 (T/B/C)
    const horizontalAlign = align[1]; // 第二个字符：水平方向 (L/R/C/S/A)
    
    switch (layout[0]){
        case 'H':
            // H模式（横向布局）：主轴=水平，副轴=垂直
            // HTML对应: flex-direction: row;
            node.flexMode = 'HORIZONTAL';
            if(isWrap) node.flexWrap = 'WRAP';
            // 主轴对齐（水平方向）：L=左, R=右, C=中, S=间距
            // HTML对应: justify-content（L/C/R/S）
            // 注意：基线对齐(A)仅在H模式的次轴可用，不在主轴
            switch (horizontalAlign){
                case 'L':
                    node.mainAxisAlignItems = 'FLEX_START'; // HTML: justify-content: flex-start;
                    break;
                case 'C':
                    node.mainAxisAlignItems = 'CENTER'; // HTML: justify-content: center;
                    break;
                case 'R':
                    node.mainAxisAlignItems = 'FLEX_END';// HTML: justify-content: flex-end;
                    break;
                case 'S': 
                    node.mainAxisAlignItems = 'SPACING_BETWEEN'; // HTML: justify-content: space-between;
                    break;
                // 注意：case 'A' (baseline) 仅在次轴可用，不在主轴
            };
            
            // 副轴对齐（垂直方向）：T=上, B=下, C=中, A=基线
            // HTML对应: align-items
            // 注意：基线对齐(A)仅在H模式的次轴（垂直方向）可用
            switch (verticalAlign){
                case 'T':
                    node.crossAxisAlignItems = 'FLEX_START'; // HTML: align-items: flex-start;
                    break;
                case 'C':
                    node.crossAxisAlignItems = 'CENTER'; // HTML: align-items: center;
                    break;
                case 'B':
                    node.crossAxisAlignItems = 'FLEX_END'; // HTML: align-items: flex-end;
                    break;
                case 'A':
                    node.crossAxisAlignItems = 'BASELINE'; // HTML: align-items: baseline (仅在H模式可用)
                    break;
                case 'S':
                    node.crossAxisAlignItems = 'FLEX_START';
                    node.crossAxisAlignContent = 'SPACING_BETWEEN'; // HTML: align-items: space-between;
                    break;
            };
            break;
            
        case 'V':
            // V模式（纵向布局）：主轴=垂直，副轴=水平
            // HTML对应: flex-direction: column;
            node.flexMode = 'VERTICAL';
            
            // 主轴对齐（垂直方向）：T=上, B=下, C=中, S=间距
            // 注意：基线对齐(A)仅在H模式可用，V模式不支持
            // HTML对应: justify-content
            switch (verticalAlign){
                case 'T':
                    node.mainAxisAlignItems = 'FLEX_START'; // HTML: justify-content: flex-start;
                    break;
                case 'C':
                    node.mainAxisAlignItems = 'CENTER'; // HTML: justify-content: center;
                    break;
                case 'B':
                    node.mainAxisAlignItems = 'FLEX_END'; // HTML: justify-content: flex-end;
                    break;
                case 'S': 
                    node.mainAxisAlignItems = 'SPACING_BETWEEN'; // HTML: justify-content: space-between;
                    break;
                // 注意：case 'A' (baseline) 仅在H模式可用，V模式不支持
            };
            
            // 副轴对齐（水平方向）：L=左, R=右, C=中
            // HTML对应: align-items
            switch (horizontalAlign){
                case 'L':
                    node.crossAxisAlignItems = 'FLEX_START'; // HTML: align-items: flex-start;
                    break;
                case 'C':
                    node.crossAxisAlignItems = 'CENTER'; // HTML: align-items: center;
                    break;
                case 'R':
                    node.crossAxisAlignItems = 'FLEX_END'; // HTML: align-items: flex-end;
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
            node.paddingTop = 0;
            node.paddingRight = 0;
            node.paddingBottom = 0;
            node.paddingLeft = 0;
        };
    } else {
        node.horizontalPadding = 0;
        node.verticalPadding = 0;
        node.paddingTop = 0;
        node.paddingRight = 0;
        node.paddingBottom = 0;
        node.paddingLeft = 0;
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
    if(a.flexMode !== 'NONE'){
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
    let H = 'START';
    let V = 'START';
    if(TBLR && typeof(TBLR) == 'string'){
        switch (TBLR[0]){
            case 'T':
                V = 'START';
            ;break
            case 'C':
                V = isFill ? 'STARTANDEND' : 'CENTER' ;//保留，兼容旧逻辑
            ;break
            case 'S':
                V = 'STARTANDEND';
            ;break
            case 'B':
                V = 'END';
            ;break
        };
        switch (TBLR[1]){
            case 'L':
                H = 'START';
            ;break
            case 'C':
                H = isFill ? 'STARTANDEND' : 'CENTER' ;//保留，兼容旧逻辑
            ;break
            case 'S':
                H = 'STARTANDEND';
            ;break
            case 'R':
                H = 'END';
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
        node.width = node.parent.width;
        node.height = node.parent.height;
    };
    node.constraints = {
        horizontal: "STARTANDEND",
        vertical: "STARTANDEND"
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
            axisY = 'START';
        } else if (yc2 > y1 + h1/2) {
            axisY = 'END';
        } else {
            axisY = 'CENTER';
        };
    } else {
        //console.log('超高')
        if (y2 <= y1 && y2 + h2 >= y1 + h1){
            //console.log('高超出')
            axisY = 'STARTANDEND'
        } else {
            if ( yc2 <= y1 + h1 * 3/8){
                axisY = 'START'
            } else if (yc2 >= y1 + h1 * 5/8) {
                axisY = 'END'
            } else {
                axisY = 'CENTER'
            };
        };
    };
    if ( w2 <= w1 * 4/8){
        if ( xc2 < x1 + w1/2){
            axisX = 'START';
        } else if (xc2 > x1 + w1/2) {
            axisX = 'END';
        } else {
            axisX = 'CENTER';
        };
    } else {
        //console.log('超宽')
        if (x2 <= x1 && x2 + w2 >= x1 + w1){
            //console.log('宽超出')
            axisX = 'STARTANDEND'
        } else {
            if ( xc2 <= x1 + w1 * 3/8){
                axisX = 'START'
            } else if (xc2 >= x1 + w1 * 5/8) {
                axisX = 'END'
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
    let text = mg.createText();
    let fontName = info[0];
    try {
        await mg.loadFontAsync(fontName);
    } catch (error) {
        fontName = {family:'Source Han Sans',style:'Regular'};
        await mg.loadFontAsync(fontName);
    }
    text.setRangeFontName(0,info[1].length,fontName);
    //console.log(info);
    text.characters = info[1];
    text.setRangeFontSize(0,info[1].length,info[2]);
    let fills = info[3] ? info[3] : [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 ,a:1} }];
    text.fills = fills;
    return text;
};
//颜色转fill对象
/**
 * @param {Array} color - css颜色 [#ffffff | rgb(255,255,255) | hsl(0% 0% 100%)]
 * @param {boolean} isPaint - 带透明度或需要作为fills对象传入时用
 */
function toRGB(color,isPaint){
    let r = 0, g = 0, b = 0, a = 1;
    if(color.includes('rgb')){
        COLOR_TYPE = 'RGB';
    }else if(color.includes('hsl')){
        COLOR_TYPE = 'HSL';
    }else if(color.includes('#')){
        COLOR_TYPE = 'HEX';
    }else{
        return null;
    }
    switch(COLOR_TYPE){
        case 'HEX':
            const hexResult = hexToRgb(color);
            if(hexResult){
                r = hexResult.r;
                g = hexResult.g;
                b = hexResult.b;
                a = hexResult.a !== undefined ? hexResult.a : 1;
            }
        break;
        case 'HSL':
            let hsl = parseColorToHsl(color);
            let hslResult = hsl ? hslToRgb(hsl.h, hsl.s, hsl.l) : null;
            if(hslResult){
                r = hslResult.r / 255;
                g = hslResult.g / 255;
                b = hslResult.b / 255;
            }
        break;
    }
    if(isPaint){
        return {
            type: 'SOLID',
            color: { r:r,g:g,b:b,a:a },
        };
    } else {
        return { r:r,g:g,b:b,a:a };
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
        };
        mg.document.currentPage.selection = [group];
    };
    
    if(splitTag){   
        if(splitKeys == ['Wrap'] ){
            mg.clientStorage.getAsync('userLanguage')
            .then (async (language) => {
                let text = language == 'Zh' ? '成功拆分文本（原始文本已隐藏）' : 'Split text successfully!(original has been hidden)'
                mg.notify(text,{
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
                    mg.clientStorage.getAsync('userLanguage')
                    .then (async (language) => {
                        let text = language == 'Zh' ? '存在不同的行高，会导致拆分后与原排版不符' : 'Mixed line-height will make splitting layout errors'
                        mg.notify(text,{
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
                
                //mg.document.currentPage.selection = [group2];
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
    // 创建副本以避免修改只读数组
    let sorted = [...nodes];
    sorted.sort((a,b) => {
        // 支持两种坐标系统：x/y（相对坐标）和 absoluteBoundingBox（绝对坐标）
        let x1, x2, y1, y2, h1, h2;
        if (a.absoluteBoundingBox && b.absoluteBoundingBox) {
            x1 = a.absoluteBoundingBox.x;
            x2 = b.absoluteBoundingBox.x;
            y1 = a.absoluteBoundingBox.y;
            y2 = b.absoluteBoundingBox.y;
            h1 = a.absoluteBoundingBox.height;
            h2 = b.absoluteBoundingBox.height;
        } else {
            x1 = a.x || 0;
            x2 = b.x || 0;
            y1 = a.y || 0;
            y2 = b.y || 0;
            h1 = a.height || 0;
            h2 = b.height || 0;
        }
        //节点上下边延长线有重叠的视为同一行
        // 如果 a 的顶部在 b 的底部下方，则 a 在下一行
        if(y1 - (y2 + h2) >= 0){
            return y1 - y2; // 按 Y 坐标排序（从上到下）
        } else if(y2 - (y1 + h1) >= 0){
            return y1 - y2; // b 在下一行，a 在上
        } else {
            // 同一行，按 X 坐标排序（从左到右）
            return x1 - x2;
        };
    });
    // 如果原数组可写，也更新原数组以保持向后兼容
    try {
        nodes.length = 0;
        nodes.push(...sorted);
    } catch(e) {
        // 如果数组是只读的，忽略错误
    }
    return sorted;
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
        let grids = safeGrids.map(item => [item.gridType,item.offset,item.sectionSize])
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
            clipnode = mg.createRectangle();
            clipnode.width = clip.w;
            clipnode.height = clip.h;
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
            clipnode = mg.createFrame();
            clipnode.width = clip.w;
            clipnode.height = clip.h;
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
                        clipsbox.width = w;
                        clipsbox.height = h;
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
        if(node.parent && node.parent.type !== key && node.parent !== mg.document.currentPage){
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
    let page = mg.document.currentPage;
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
