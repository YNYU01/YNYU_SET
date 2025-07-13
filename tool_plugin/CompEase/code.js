/*
- ©版权所有：2024-2025 YNYU @lvynyu2.gmail.com
- 禁止未授权的商用及二次编辑
- 禁止用于违法行为，如有，与作者无关
- 二次编辑需将引用部分开源
- 引用开源库的部分应遵循对应许可
- 使用当前代码时禁止删除或修改本声明
*/
let UI = [300,660];
let vX = figma.viewport.bounds.x,vY = figma.viewport.bounds.y;
figma.skipInvisibleInstanceChildren = true;//忽略不可见元素及其子集
figma.showUI(__html__,{position:{x:vX,y:vY},themeColors:true});
figma.ui.resize(UI[0], UI[1]);
figma.loadAllPagesAsync()

let NullText = "";
let EnterText = "[enter]";
let diffColorTime = 0;
let usePluginTime = "0";
let setTags = ["fillcolor","strokecolor","fontsize","view","fillstyle","strokestyle"]
let tagsMust = new RegExp(`\\#[^#\\s]+\\.(${setTags.join('|')})`,'g')

if(figma.currentPage.parent.getPluginData("usePluginTime")){
    usePluginTime = figma.currentPage.parent.getPluginData("usePluginTime")* 1 + 1 ;
    figma.currentPage.parent.setPluginData("usePluginTime",usePluginTime.toString())
    console.log("当前文件已使用该插件" + usePluginTime + "次")
}else{
    figma.currentPage.parent.setPluginData("usePluginTime",usePluginTime)
}

postmessage([{filename:figma.currentPage.parent.name,usetime:usePluginTime,userinfo:figma.currentUser},"sendDoc"])
//核心功能
figma.ui.onmessage = (message) => { 
    const info = message[0];
    const type = message[1];
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
            if ( b.length == 1 && b[0].type == "TEXT"){
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
                    if(b[i].type == "COMPONENT"){
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
                    }
                    if(b[i].type == "INSTANCE"){
                        x = b[0].x;
                        y = b[0].y + 80;
                        if (b[i].name.split("表头").length !== 1){
                            list.insertChild(0,b[i].clone());
                        }
                        if (b[i].name.split("数据").length !== 1){
                            if( H > 0){
                                for ( let e = 0; e < H; e++){
                                    list.insertChild(e + 1,b[i].clone());
                                }
                            } else {
                                list.insertChild(1,b[i].clone());
                                list.insertChild(2,b[i].clone());
                                list.insertChild(3,b[i].clone());
                            }                
                        }    
                    }
                }
                list.layoutPositioning = "AUTO";
                list.layoutMode = "VERTICAL";
                list.layoutSizingHorizontal = "HUG";
                list.layoutSizingVertical = "HUG";
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
        }
    }
    //表格填充数据
    if ( type == 'reTable'){
        let a = figma.currentPage;
        let b = a.selection;
        if (b.length == 1 && hasKeyName(b[0],"table")){
            
            if (hasKeyName(b[0],"横")){
                let datas = tableToData(info.trim(),true);
                let data = datas[0].map((col, i) => datas.map(row => row[i]))
            } else {
                let data = tableToData(info.trim(),true) 
            }
            let H = data[0].length - b[0].children[0].children.length;
            let L = data.length - b[0].children.length;

            addTable(b,H,L)
            for(let i = 0; i < b[0].children.length; i++){             
                if (hasKeyName(b[0].children[i],"列")){
                    let c = b[0].children[i].children;
                    for (let ii = 0; ii < c.length; ii++){
                        let comps = Object.keys(c[ii].componentProperties)
                        let properties = [];
                        comps.forEach(item => {
                            properties.push({name:item.split("#")[0],id:item.split("#")[1],type:c[ii].componentProperties[item].type})
                        })

                        properties.forEach(item => {
                            if(item.type == "TEXT"){
                                if(data[i][ii]){
                                    c[ii].setProperties({[item.name + '#' + item.id]:data[i][ii]})
                                }else{
                                    c[ii].setProperties({[item.name + '#' + item.id]:NullText})
                                }
                            }
                        })
                    }  
                }  
            } 
        }

        if (b.length == 1 && (hasKeyName(b[0],"数据流")) ){
            let data = tableToData(info.trim(),false)
            let H = 0;
            let L = data.length - b[0].children.length;

            addTable(b,H,L)
            let c = b[0].children
            for (let ii = 0; ii < c.length; ii++){
                let comps = Object.keys(c[ii].componentProperties)
                let properties = [];
                comps.forEach(item => {
                    properties.push({name:item.split("#")[0],id:item.split("#")[1],type:c[ii].componentProperties[item].type})
                })

                properties.forEach(item => {
                    if(item.type == "TEXT"){
                        if(data[ii][0]){
                            c[ii].setProperties({[item.name + '#' + item.id]:data[ii][0]})
                        }else{
                            c[ii].setProperties({[item.name + '#' + item.id]:NullText})
                        }
                    }
                })
            }  
                   
        }

        if (b.length == 1 && (hasKeyName(b[0],"列")) ){
            let data = tableToData(info.trim(),false)
            let c = b[0].children
            for (let ii = 0; ii < c.length; ii++){
                let comps = Object.keys(c[ii].componentProperties)
                let properties = [];
                comps.forEach(item => {
                    properties.push({name:item.split("#")[0],id:item.split("#")[1],type:c[ii].componentProperties[item].type})
                })

                properties.forEach(item => {
                    if(item.type == "TEXT"){
                        if(data[ii][0]){
                            c[ii].setProperties({[item.name + '#' + item.id]:data[ii][0]})
                        }else{
                            c[ii].setProperties({[item.name + '#' + item.id]:NullText})
                        }
                    }
                })
            }  
                   
        }

        if (b.length > 1 ){
            let data = tableToData(info.trim(),false)
            let c = [];
            b.forEach(item => {
                if(item.type == "INSTANCE" ){
                    c.push(item)
                }
                let instances = item.findAll((node) => node.type == "INSTANCE" )
                c.push(...instances)
            })
            for (let ii = 0; ii < c.length; ii++){
                let comps = Object.keys(c[ii].componentProperties)
                let properties = [];
                comps.forEach(item => {
                    properties.push({name:item.split("#")[0],id:item.split("#")[1],type:c[ii].componentProperties[item].type})
                })

                properties.forEach(item => {
                    if(item.type == "TEXT"){
                        if(data[ii][0]){
                            c[ii].setProperties({[item.name + '#' + item.id]:data[ii][0]})
                        }else{
                            c[ii].setProperties({[item.name + '#' + item.id]:NullText})
                        }
                    }
                })
            }  
                   
        }

    }
    if ( type == 'setNullText'){
        NullText = info;
    }
    if ( type == 'setEnterText'){
        EnterText = info;
    }
    //读取表格数据
    if ( type == 'getTableData'){
        let a = figma.currentPage;
        let b = a.selection;
        if(b.length == 1 && b[0].type !==  "INSTANCE"){
            if(b[0].type ==  "COMPONENT"){
                findCompData(b)
            } else if(b[0].name.split("table").length > 1 ) {
                let H = b[0].children[0].children.length;
                let L = b[0].children.length;
                let docData = Array(H).fill().map(() => Array(L).fill(NullText))
                
                //console.log(docData)
                for(let i = 0; i < b[0].children.length; i++){
                    let c = b[0].children[i].children;
                    for (let ii = 0; ii < c.length; ii++){
                        docData[ii][i] = Object.values(c[ii].componentProperties).filter(item => item.type == "TEXT")[0].value
                        if(i == b[0].children.length - 1 && ii == c.length - 1){
                            //console.log(docData)
                            postmessage([docData,'tableForDoc'])
                        }
                    }
                } 
            } else {
                figma.notify("请选择由插件生成的表格，或选择多个母组件相同的实例",{
                timeout: 3000,
                });
            }              
        }else{
          if(!b.some(item => item.type !== "INSTANCE")){
            let names = [];
            b.forEach((item,index) => {
            item.getMainComponentAsync()
            .then(maincomp =>{
                if(maincomp.parent && maincomp.parent.type == "COMPONENT_SET"){
                    names.push(maincomp.parent.name);
                }else{
                    names.push(maincomp.name);
                }
                if(index == b.length - 1){//先遍历所选对象的母组件
                    names = [...new Set(names)];
                    //console.log(names);
                    if(names.length == 1){//通过去重解决判断是否为同一母组件或同一变体
                        findCompData(b)
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
            })
          }else{
            figma.notify("请选择母组件相同的实例",{
              timeout: 3000,
            });
          }
        }

        function findCompData(nodes){
            let values = [];
            let keys;
            if(nodes[0].type == "COMPONENT"){
                keys = Object.keys(nodes[0].componentPropertyDefinitions);
                let compChild = nodes[0].findAll((item) => item.isExposedInstance == true);
                compChild.forEach(item => {
                    let keyss = Object.keys(item.componentProperties);
                    keys.push(...keyss);
                })
                values.push(keys.map(key => key.split("#")[0]));
                let datas = [];
                datas.push(...Object.values(nodes[0].componentPropertyDefinitions).map(item => item.defaultValue));
                compChild.forEach(item => {
                    datas.push(...Object.values(item.componentProperties).map(item => item.value))
                })
                datas.forEach((item,index) => {
                    if(hasKeyName({name:item.toString()},"\n")){
                        let texts = item.split('\n')
                        let value = ''
                        for(let e = 0; e < texts.length; e++){
                            if(e == texts.length - 1){
                            value += texts[e]
                            } else {
                            value += texts[e] + EnterText
                            }
                        }
                        datas[index] = value
                    }
                    if(item === true){
                        datas[index] = "是"
                    }
                    if(item === false){
                        datas[index] = "否"
                    }
                })
                values.push(datas);
                postmessage([values,"tableForDoc"])
            }else{
                keys = Object.keys(nodes[0].componentProperties);
                if(nodes[0].exposedInstances){
                    nodes[0].exposedInstances.forEach(item => {
                        let keyss = Object.keys(item.componentProperties);
                        keys.push(...keyss);
                    })
                }
                values.push(keys.map(key => key.split("#")[0]))
                nodes.forEach((node,index) => {                
                    let datas = []
                    for(let i = 0; i < keys.length; i++){
                        let value = node.componentProperties[keys[i]]
                        if(value){
                            value = value.value;
                            if(hasKeyName({name:value},"\n")){
                            let texts = value.split('\n')
                            value = ''
                            for(let e = 0; e < texts.length; e++){
                                if(e == texts.length - 1){
                                value += texts[e]
                                } else {
                                value += texts[e] + EnterText
                                }
                            }
                            }
                            if(value === true){
                            value = "是";
                            }
                            if(value === false){
                            value = "否";
                            }
                            datas.push(value);
                        }
                    }
                    if(node.exposedInstances){
                    node.exposedInstances.forEach(items => {
                        for(let i = 0; i < keys.length; i++){
                        let value = items.componentProperties[keys[i]]
                        if(value){
                            value = value.value;
                            if(hasKeyName({name:value},"\n")){
                            let texts = value.split('\n')
                            value = ''
                            for(let e = 0; e < texts.length; e++){
                                if(e == texts.length - 1){
                                value += texts[e]
                                } else {
                                value += texts[e] + EnterText
                                }
                            }
                            }
                            if(value === true){
                            value = "是";
                            }
                            if(value === false){
                            value = "否";
                            }
                            datas.push(value);
                        }
                        }
                    })
                    }
                    values.push(datas);
                    if(index == nodes.length - 1){
                    //console.log(values)
                    postmessage([values,"tableForDoc"])
                    }
                })
            }
            
            
        }
    }
    if ( type == 'getTagsData'){
        let a = figma.currentPage;
        let b = a.selection;
        if(b.length == 1 && b[0].type !==  "INSTANCE"){
            if(b[0].type ==  "COMPONENT"){
                findTagsData(b)
            } else {
                figma.notify("请选择一个母组件或多个母组件相同的实例",{
                timeout: 3000,
                });
            }              
        }else{
          if(!b.some(item => item.type !== "INSTANCE")){
            let names = [];
            b.forEach((item,index) => {
            item.getMainComponentAsync()
            .then(maincomp =>{
                if(maincomp.parent && maincomp.parent.type == "COMPONENT_SET"){
                    names.push(maincomp.parent.name);
                }else{
                    names.push(maincomp.name);
                }
                if(index == b.length - 1){//先遍历所选对象的母组件
                    names = [...new Set(names)];
                    //console.log(names);
                    if(names.length == 1){//通过去重解决判断是否为同一母组件或同一变体
                        findTagsData(b)
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
            })
          }else{
            figma.notify("请选择母组件相同的实例",{
              timeout: 3000,
            });
          }
        }

        function findTagsData(nodes){
            let values = [];
            let keys = [];

            let keynodes = [];
            if(hasKeyName(nodes[0],"#") && hasKeyName(nodes[0],".")){
                keynodes.push(nodes[0])
            }
            let childs = nodes[0].findAll((item) => hasKeyName(item,"#") && hasKeyName(item,"."));
            keynodes.push(...childs)
            
            keynodes.forEach(node => {
                //console.log(node.name.match(tagsMust))
                keys.push(...node.name.match(tagsMust))
            })
            keys = [...new Set(keys)]
            values.push(keys)

            nodes.forEach(item => {
                let keynodess = [];
                if(hasKeyName(item,"#") && hasKeyName(item,".")){
                    keynodess.push(item)
                }
                let childss = item.findAll((items) => hasKeyName(items,"#") && hasKeyName(items,"."));
                keynodess.push(...childss);

                let value = Array(keys.length).fill().map(() => '')
                keynodess.forEach(node => {
                    keys.forEach((items,indexs) => {
                        if(hasKeyName(node,items)){
                            let keyname = items.split('.')[1]
                            if(keyname == "fillcolor"){
                                value[indexs] = rgbToHex(node.fills[0].color)
                            }
                            if(keyname == "strokecolor"){
                                value[indexs] = rgbToHex(node.strokes[0].color)
                            }
                            if(keyname == "fontsize"){
                                value[indexs] = node.getRangeFontSize(0,node.characters.length)
                            }
                            if(keyname == "view"){
                                value[indexs] = node.visible
                            }
                            if(keyname == "fillstyle"){
                                figma.getLocalPaintStylesAsync()
                                .then(list => {
                                    let name = list.find(item => item.id == node.fillStyleId).name
                                    if(name){
                                        value[indexs] = name
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                            }
                            if(keyname == "strokestyle"){
                                figma.getLocalPaintStylesAsync()
                                .then(list => {
                                    let name = list.find(item => item.id == node.fillStyleId).name
                                    if(name){
                                        value[indexs] = name
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                            }
                        }
                    })
                    value.forEach((items,indexs) => {
                        if(items === true){
                            value[indexs] = "是"
                        }
                        if(items === false){
                            value[indexs] = "否"
                        }
                    })
                    //console.log(value)
                })
                values.push(value)

            })
            
            postmessage([values,"tableForDoc"])

        }
    }
    //从表格文本命名
    if ( type == 'reTableName'){
        let a = figma.currentPage;
        let b = a.selection;

        if (b.length == 1 && b[0].name.split('数据流').length !== 1){
            let data = tableToData(info.trim(),false)
            let H = 0;
            let L = data.length - b[0].children.length;
            addTable(b,H,L)
            for(let i = 0; i < b[0].children.length; i++){
                b[0].children[i].name = data[i][0]
            }         
        } else {
            let data = tableToData(info.trim(),false)
            for(let i = 0; i < b.length; i++){
                if(data[i]){
                    b[i].name = data[i][0]
                }
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
                if ( b[i].name.split("table").length !== 1){
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
    //反转表格行列
    if ( type == "translateTable"){
        let a = figma.currentPage;
        let b = a.selection;
        let loading =  figma.notify("生成中，请稍后",{
            timeout: 6000,
            });

        setTimeout(() => {   
        for ( let i = 0; i < b.length; i++){
            
            if ( b[i].name.split("table").length !== 1){
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
    //批量组件属性
    if( type == "reComponentValue"){
        let a = figma.currentPage;
        let b = a.selection;
        let data = tableToData(info.trim(),true);//每列数据
        console.log(data)
        let keys = data.map(item => item[0]);//表头
        let nodes = [];
        if(b.length == 1){
            if(hasKeyName(b[0],"数据流")){
                nodes.push(...b[0].children);
                let length = (data[0].length - 1 - b[0].children.length)
                for(let i = 0; i < length; i++){
                    let node = b[0].children[0].clone();
                    b[0].appendChild(node);
                    nodes.push(node);
                }
            } else {
                if( b[0].type == "INSTANCE"){
                    nodes.push(b[0])
                    if(hasKeyName(b[0].parent,"数据流")){
                        let length = (data[0].length - 1 - b[0].parent.children.length)
                        for(let i = 0; i < length; i++){
                            let node = b[0].clone();
                            b[0].parent.appendChild(node);
                            nodes.push(node);
                        }
                    }
                } else if(hasKeyName(b[0],"列")){
                    nodes.push(...b[0].children.filter(item => item.type == "INSTANCE"))
                }
            }
        } else {
            b.forEach(node => {
                if(node.type == "INSTANCE"){
                    nodes.push(node);
                }
            })
        }

        nodes.forEach((item,index) => {
            let comps = item.componentProperties;
            if(comps && Object.keys(comps).length > 0){
                Object.keys(comps).forEach(comp => {
                    if(keys.includes(comp.split('#')[0])){//属性名要匹配表头
                        if(comps[comp].type == 'BOOLEAN'){
                            let bool = data[keys.findIndex(value => value == comp.split('#')[0])][(index + 1)]
                            dataToBool(bool) ? item.setProperties({[comp]:true}) : item.setProperties({[comp]:false}) 
                        } else {
                            item.setProperties({[comp]:data[keys.findIndex(value => value === comp.split('#')[0])][(index + 1)]}) 
                        }
                    }
                })
            }
            let child = item.findAll((items) => items.componentProperties && Object.keys(items.componentProperties).length > 0 && (keys.includes(Object.keys(items.componentProperties)[0].split('#')[0]) || keys.includes(Object.keys(items.componentProperties)[(Object.keys(items.componentProperties).length - 1)].split('#')[0])) );

            child.forEach((items) => {
                let compss = items.componentProperties;
                if(compss && Object.keys(compss).length > 0){
                    Object.keys(compss).forEach(comp => {
                        if(keys.includes(comp.split('#')[0])){
                            if(compss[comp].type == 'BOOLEAN'){
                                let bool = data[keys.findIndex(value => value == comp.split('#')[0])][(index + 1)]
                                dataToBool(bool)  ? items.setProperties({[comp]:true}) : items.setProperties({[comp]:false}) 
                            } else {
                                items.setProperties({[comp]:data[keys.findIndex(value => value === comp.split('#')[0])][(index + 1)]}) 
                            }
                        }
                    })
                }
            })
        });
    }
    //批量标签属性
    if( type == "setByTags"){  
        let a = figma.currentPage;
        let b = a.selection;
        let data = tableToData(info.trim(),true);//每列数据
        let keys = data.map(item => item[0]);//表头
        let nodes = [];
        if(b.length == 1){
            if(hasKeyName(b[0],"数据流")){
                nodes.push(...b[0].children);
                let length = (data[0].length - 1 - b[0].children.length)
                for(let i = 0; i < length; i++){
                    let node = b[0].children[0].clone();
                    b[0].appendChild(node);
                    nodes.push(node);
                }
            } else {
                if( b[0].type == "INSTANCE"){
                    nodes.push(b[0])
                    if(hasKeyName(b[0].parent,"数据流")){
                        let length = (data[0].length - 1 - b[0].parent.children.length)
                        for(let i = 0; i < length; i++){
                            let node = b[0].clone();
                            b[0].parent.appendChild(node);
                            nodes.push(node);
                        }
                    }
                } else if(hasKeyName(b[0],"列")){
                    nodes.push(...b[0].children.filter(item => item.type == "INSTANCE"))
                }
            }
        } else {
            b.forEach(node => {
                if(node.type == "INSTANCE"){
                    nodes.push(node);
                }
            })
        }

        nodes.forEach((item,index) => {
            
            keys.forEach((sets,indexs) => {
                if(hasKeyName(item,sets)){
                    setByTags(item,sets,data[indexs][(index + 1)])
                }
                let child = item.findAll((childs) => hasKeyName(childs,sets));
                child.forEach((items) => {
                    setByTags(items,sets,data[indexs][(index + 1)])
                })
            })
        })

        function setByTags(node,sets,value){//sets的格式应该为：#XXX.type
            let type = sets.split('.')[1]
            if(type == "fillcolor"){
                //console.log(hexToRgb({value:value}))
                let color = {r:0,g:0,b:0};
                if(hasKeyName({name:value},"rgb(")){
                     let RGB = value.replace("rgb(","").replace(")","").split(",")
                    if(RGB.length == 3){
                        color = {r:(RGB[0]/255) * 1,g:(RGB[0]/255) * 1,b:(RGB[0]/255) * 1}
                    }
                } else {
                    color = hexToRgb({value:value})
                }
                node.fills = [{type:"SOLID",color:color}];//color:{r:0.4,g:0.4,b:0.4}
            }
            if(type == "strokecolor"){
                let color = {r:0,g:0,b:0};
                if(hasKeyName({name:value},"rgb(")){
                     let RGB = value.replace("rgb(","").replace(")","").split(",")
                    if(RGB.length == 3){
                        color = {r:(RGB[0]/255) * 1,g:(RGB[0]/255) * 1,b:(RGB[0]/255) * 1}
                    }
                } else {
                    color = hexToRgb({value:value})
                }
                node.strokes = [{type:"SOLID",color:color}];//color:{r:0.4,g:0.4,b:0.4}
            }
            if(type == "view"){
                let bool = dataToBool(value);
                node.visible = bool;
            }
            if(type == "fontsize"){
                //console.log(node.getRangeFontName(0,node.characters.length))
                //node.setRangeFontSize(0,node.characters.length,value * 1);
                reFontSize(node,value * 1)
            }
            if(type == "fillstyle"){
                figma.getLocalPaintStylesAsync()
                .then(list => {
                    //console.log(list)
                    let id = list.find(item => item.name == value).id
                    if(id){
                        node.setFillStyleIdAsync(id)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(type == "strokestyle"){
                figma.getLocalPaintStylesAsync()
                .then(list => {
                    //console.log(list)
                    let id = list.find(item => item.name == value).id
                    if(id){
                        node.setStrokeStyleIdAsync(id)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            }
        }
    }

    if( type == "getDoc"){
        postmessage([{filename:figma.currentPage.parent.name,usetime:usePluginTime,userinfo:figma.currentUser},"sendDoc"])
    }
}

//封装postMessage
function postmessage(data){
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
    //console.log(text)
    if ( dataToList ){
        let h = text.split("\n");//[[文案\t文案\t文案],[文案\t文案\t文案]]
        let hs = [];//[[文案,文案,文案],[文案,文案,文案,]]
        let e = 0;
        for (let i = 0; i < h.length; i++){
            hs[e] = h[i].split("\t");
            hs[e].forEach((item,index) => {
              if(item.split(EnterText).length > 1){
                hs[e][index] = item.replace(EnterText,"\n")
                console.log(hs)
              }
            })
            e++
        }
        return hs[0].map((col, i) => hs.map(row => row[i]))
    } else {
        let h = text.split("\n");//[[文案\t文案\t文案],[文案\t文案\t文案]]
        let hs = [];//[[文案,文案,文案],[文案,文案,文案,]]
        let e = 0;
        for (let i = 0; i < h.length; i++){
            hs[e] = h[i].split("\t");
            hs[e].forEach((item,index) => {
              if(item.split(EnterText).length > 1){
                hs[e][index] = item.replace(EnterText,"\n")
                console.log(hs)
              }
            })
            
            e++
        }
        return hs
    }
    
}

function addAbsolute(parent,absoluteNode,names,view){
    parent.appendChild(absoluteNode);
    absoluteNode.resize(parent.width,parent.height);
    absoluteNode.fills = [];
    absoluteNode.name = names;
    absoluteNode.layoutPositioning = "ABSOLUTE";
    absoluteNode.x = 0;
    absoluteNode.y = 0;

    absoluteNode.children[0].x = 0;
    absoluteNode.children[0].y = 0;
    let addLayerSet = parent.addComponentProperty(names,"BOOLEAN",view);
    absoluteNode.componentPropertyReferences = {visible:addLayerSet};
}

function reTableStroke(table,H,L){
    for ( let i = 0; i < L; i++){
        for ( let ii = 0; ii < H; ii++){
            let c = table.children[i].children[ii];
            let keys = Object.keys(c.componentProperties)
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

    /* figma的组不受自动布局影响，只能用画板来包裹，否则不能跟随自动布局来拉伸
    let diffC = figma.group([colorLayer]);
    let strokeT = figma.group([strokeTop]);
    let strokeR = figma.group([strokeRight]);
    let strokeB = figma.group([strokeBottom]);
    let strokeL = figma.group([strokeLeft]);
    */

    let diffC = figma.createFrame();
    diffC.appendChild(colorLayer)
    let strokeT = figma.createFrame();
    strokeT.appendChild(strokeTop)
    let strokeR = figma.createFrame();
    strokeR.appendChild(strokeRight)
    let strokeB = figma.createFrame();
    strokeB.appendChild(strokeBottom)
    let strokeL = figma.createFrame();
    strokeL.appendChild(strokeLeft)


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
                node.children[ii].constraints = {
                    horizontal: "STRETCH",
                    vertical: "STRETCH"
                }
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

async function reFontSize(node,fontSize){
    await figma.listAvailableFontsAsync()
    let fontInfo = node.getRangeFontName(0,node.characters.length)
    await figma.loadFontAsync(fontInfo)
    node.setRangeFontSize(0,node.characters.length,fontSize);
}

function addTable(b,H,L){
    for (let i = 0; i < b.length; i++){
            
        if (b[i].name.split('table').length !== 1 || b[i].name.split('数据流').length !== 1){
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

function hasKeyName(node,key){
    let bool = false;
    if(node.name){
        node.name.split(key).length > 1 ? bool = true : bool = false;
    } else {
        node.split(key).length > 1 ? bool = true : bool = false;
    }
    return bool;
}

function hexToRgb(hex){
    let colors = reColorText(hex,true)
    let R = colors[0] + colors[1], G = colors[2] + colors[3], B = colors[4] + colors[5];
    return {r:(parseInt(R,16)/255) * 1,g:(parseInt(G,16)/255) * 1,b:(parseInt(B,16)/255) * 1};
}

function rgbToHex(rgb){
    let R = rgb.r * 255,G = rgb.g * 255,B = rgb.b * 255;
    return  Math.floor(R).toString(16) + Math.floor(G).toString(16) + Math.floor(B).toString(16);
}

//重置输入色值
function reColorText(e,isReturn) {
    let values = '#' +  e.value.replace(/[#]/g,'');
    if (values == '#' || values.replace(/[0-9a-fA-F]/g,'').trim().length > 1) {
    e.value = "#000000";
    } else {
        if (e.value.length < 7) {
        if (e.value[0] == '#') {
            let a = e.value.replace(/[#]/g,'');
            if (a.length == 3) {
            e.value = "#" + a + a
            }
            if (a.length == 2) {
            e.value = "#" + a + a + a
            }
            if (a.length == 1) {
            e.value = "#" + a + a + a + a + a + a
            }
            if (a.length == 4) {
            e.value = "#" + a + "00"
            }
            if (a.length == 5) {
            e.value = "#" + a + "0"
            }
        } else {
            let c = e.value.replace(/[#]/g,'')
            if (c.length == 3) {
            e.value = "#" + c + c
            }
            if (c.length == 2) {
            e.value = "#" + c + c + c
            }
            if (c.length == 1) {
            e.value = "#" + c + c + c + c + c + c
            }
            if (c.length == 4) {
            e.value = "#" + c + "00"
            }
            if (c.length == 5) {
            e.value = "#" + c + "0"
            }
            if (c.length == 6) {
            e.value = "#" + c
            }
        }
        } else {
            if (e.value.replace(/[#]/g,'').replace(/[^0-9a-fA-F]/g,'').trim().length >= 6) {
                e.value = '#' + e.value.replace(/[#]/g,'').replace(/[^0-9a-fA-F]/g,'').trim().substring(0, 6);
            } else {
                e.value = "#000000"
            }
        }
    }

    if(isReturn){
        return e.value.replace("#","")
    }

}

//判断是否
function dataToBool(data){
    let bool =  data == 'true' || data == '1' || data == '是' || data == '有'  ?  true : false;
    return bool;
}