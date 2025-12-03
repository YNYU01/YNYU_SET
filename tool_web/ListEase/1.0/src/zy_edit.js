/*
- [云即·资源助手]
- ©版权所有：2024-2025 YNYU @lvynyu2.gmail.com
- 禁止未授权的商用及二次编辑
- 禁止用于违法行为，如有，与作者无关
- 二次编辑需将引用部分开源
- 引用开源库的部分应遵循对应许可
- 使用当前代码时禁止删除或修改本声明
*/

var allKey = [];//记录所选择的key，一般就一个，除非是多渠道
var allImg = [];//记录添加的资源位
var exportAllInfo = '';//汇总信息

function addList(e){

    var select = '<option value="选择渠道" disabled selected>选择渠道</option>'; 
    Object.keys(sheet).forEach(item => {
        if ( item == '用户' /*item == '大神' || item == 'CC' || item == 'DD'*/){
            select += '<option style="color:var(--keysLiColor)" value="' + item + '">' + item + '</option>'
        } else {
            if( item.split("_").length > 1){
                select += '<option value="' + item.replace("_","") + '">' + item.replace("_","") + '</option>'
            } else {
                select += '<option value="' + item + '">' + item + '</option>'
            }
        }
        
    })

    var selectImg = '<option value="选择资源位" disabled selected>选择资源位</option>'; 

    allKey[e] = '';
    allImg[e] = '';
    
    var node = document.createElement('div');
    node.id = "exports-" + e;
    node.className = "tags-exports";
    node.innerHTML = `
        <div class="list">
            <div class="set" style="width: 60ch;">
                <div style="display: flex; gap:4px">
                    <div id="add-`+ e +`" class="btn-text" style="width: 17px; height: 17px;" onclick="addList(`+ (e + 1) +`);this.parentNode.style.opacity = 0.222; this.parentNode.style.pointerEvents = 'none';"><btn-add></btn-add></div>
                    <div id="close-`+ e +`" class="btn-text" style="width: 17px; height: 17px;" onclick="closeList(`+ e +`);reImgInfo(`+ e +`,0,null);reClick('key',`+ (e - 1) +`);"><btn-close></btn-close></div>
                </div>
                <select id="select-area-`+ e +`" class="input-btn-skill" name="渠道" style=" width: 26ch; min-width: 20ch; color: var(--mainColor); font-size: 12px;" 
                onchange="reSelectImg(`+ e +`,this.value);reImgInfo(`+ e +`,0,null);reKeysInfo(`+ e +`,this.value);">
                ` + select +`
                </select>
            </div>
            <div class="group" id="imgs-`+ e +`" style="max-width: 500px;">
                <div class="set" id="img-`+ e +`-0" >
                    <div style="display: flex; gap:4px">
                        <div id="add-`+ e +`-0" class="btn-text" style="width: 17px; height: 17px;" onclick="addImg(`+ e +`,1,allKey[`+ e +`]);this.parentNode.style.opacity = 0.222; this.parentNode.style.pointerEvents = 'none'; reImgInfo(`+ e +`,1,document.getElementById('select-img-`+ e +`-1').value)"><btn-add></btn-add></div>
                        <div id="close-`+ e +`-0" class="btn-text" style="width: 17px; height: 17px; opacity:0.222; pointer-events: none;"><btn-close></btn-close></div>
                    </div>
                    <select id="select-img-`+ e +`-0" class="input-btn-skill" name="资源位" style=" width: calc(100% - 8ch); color: var(--mainColor); font-size: 12px;" 
                    onchange="reImgInfo(`+ e +`,0,this.value)">
                    ` + selectImg +`
                    </select>
                </div>
            </div>
        </div>
        </div>
    `

    document.getElementById("page-main-1").appendChild(node);
    toView("exports-" + e ,"page-main-1")
}


function closeList(e){
    document.getElementById("exports-" + e).remove()
}

function addOption(type,list,key){
    if (!Array.isArray(list)){
        var option = document.createElement('option');
        option.disabled = true;
        option.selected = true;
        option.value = '选择渠道';
        option.innerHTML = '选择渠道';
        document.getElementById(type + key).appendChild(option)
        Object.keys(list).forEach(item => {
            var option = document.createElement('option');
            if ( item == '用户' /*item == '大神'  || item == 'CC' || item == 'DD'*/){
                option.value = item;
                option.innerHTML = item;
                option.style.color = "var(--keysLiColor)";
                //option.style.color = "#ffffff88";
                //option.style.backgroundColor = "var(--keysLiColor)";
            } else {
                if( item.split("_").length > 1){
                    option.value = item.replace("_","");
                    option.innerHTML = item.replace("_","");
                } else {
                    option.value = item;
                    option.innerHTML = item;
                }
            }
            document.getElementById(type + key).appendChild(option)
        })
    } else {
        var option = document.createElement('option');
        option.disabled = true;
        option.selected = true;
        option.value = '选择资源位';
        option.innerHTML = '选择资源位';
        document.getElementById(type + key).appendChild(option);
        list.forEach(item => {
            var option = document.createElement('option');
            option.value = item.name;
            option.innerHTML = item.name;
            document.getElementById(type + key).appendChild(option)
        })
    
    }
    
}

function reSelectImg(e,key){
    document.getElementById("imgs-" + e).innerHTML = ''
    addImg(e,0,key)
}

function addImg(e,ee,key){
    //console.log("addimg",e,ee)
    var selectImg = '<option value="选择资源位" disabled selected>选择资源位</option>'; 

    if ( isNaN(key*1) ){
        var keys = key
    } else {
        var keys = '_' + key;
    }
    var names = sheet[keys].map(item => item.name);
    var garoups = [];
    names.forEach(item => {
        var optionKey = '<optgroup label="' + item.split('-')[0] + '">';
        var optionNor = '<optgroup label="通用">'
        if(item.split('-').length > 1){
            if( !garoups.includes(optionKey)){
                garoups.push(optionKey)
            }
        }else{
            if(!garoups.includes(optionNor)){
                garoups = [optionNor,...garoups]
            }
        }
    })

    //console.log('分组：',garoups)
    garoups.forEach(optG => {
        sheet[keys].forEach(item => {
            var names = item.name  + '&nbsp;&nbsp;' + item.w + '×' + item.h ;
            if(item.name.split('-').length > 1){
                if(optG.split('"')[1] == item.name.split('-')[0]){
                    optG += '<option value="' + item.name + '">' + names + '</option>'
                } 
            } else {
                if (optG.split('"')[1] == '通用') {
                    optG += '<option value="' + item.name + '">' + names + '</option>'
                }
            }
        }) 
        optG += '</optgroup>' ;
        selectImg += optG
        //console.log(optG)
    })

    /*
    sheet[keys].forEach(item => {
        selectImg += '<option value="' + item.name + '">' + item.name + '</option>'
    })
    */

    allImg[e][ee] = ''

    var node = document.createElement('div');
    node.id = "img-" + e + "-" + ee;
    node.className = "set";
    if (ee == 0){
        node.innerHTML = `
        <div style="display: flex; gap:4px">
            <div id="add-`+ e +`-`+ ee +`" class="btn-text" style="width: 17px; height: 17px;" onclick="addImg(`+ e +`,`+ (ee + 1) +`,allKey[`+ e +`]);this.parentNode.style.opacity = 0.222; this.parentNode.style.pointerEvents = 'none';reImgInfo(`+ e +`,`+ ee +`,document.getElementById('select-img-`+ e +`-`+ (ee + 1) +`').value)"><btn-add></btn-add></div>
            <div id="close-`+ e +`-`+ ee +`" class="btn-text" style="width: 17px; height: 17px; opacity:0.222; pointer-events: none; "><btn-close></btn-close></div>
        </div>
        <select id="select-img-`+ e +`-`+ ee +`" class="input-btn-skill" name="资源位" style=" width: calc(100% - 8ch); color: var(--mainColor); font-size: 12px; text-align: left;" 
        onchange="reImgInfo(`+ e +`,`+ ee +`,this.value)">
        ` + selectImg +`
        </select>
    `
    } else {
        node.innerHTML = `
        <div style="display: flex; gap:4px">
            <div id="add-`+ e +`-`+ ee +`" class="btn-text" style="width: 17px; height: 17px;" onclick="addImg(`+ e +`,`+ (ee + 1) +`,allKey[`+ e +`]);this.parentNode.style.opacity = 0.222; this.parentNode.style.pointerEvents = 'none';reImgInfo(`+ e +`,`+ ee +`,document.getElementById('select-img-`+ e +`-`+ (ee + 1) +`').value)"><btn-add></btn-add></div>
            <div id="close-`+ e +`-`+ ee +`" class="btn-text" style="width: 17px; height: 17px;" onclick=" if((this.id.split('-')[2]) !== '0'){closeImg(`+ e +`,`+ ee +`)};reImgInfo(`+ e +`,`+ ee +`,null);reClick('img',`+ e +`,`+ (ee - 1) +`);"><btn-close></btn-close></div>
        </div>
        <select id="select-img-`+ e +`-`+ ee +`" class="input-btn-skill" name="资源位" style=" width: calc(100% - 8ch); color: var(--mainColor); font-size: 12px; text-align: left;" 
        onchange="reImgInfo(`+ e +`,`+ ee +`,this.value)">
        ` + selectImg +`
        </select>
    `
    }
    

    document.getElementById("imgs-" + e).appendChild(node);
    toView("img-" + e + "-" + ee,"page-main-1")
}

function closeImg(e,ee){
    document.getElementById("img-" + e + "-" + ee).remove()
}


function reImgInfo(e,ee,name){
    if (name !== '选择资源位'){
        if (name){
            allImg[e][ee] = name;
            reExportInfo();
        } else {
            allImg[e][ee] = ''
            reExportInfo();
        }
    }   
}

function reKeysInfo(e,key){
    if ( key !== '选择渠道'){
        allKey[e] = key;
        allImg[e] = [];
        if ( isNaN(key*1) ){
            var keys = key
        } else {
            var keys = '_' + key;
        }
        allImg[e][0] = '';
        reExportInfo()
    }
    

}

function reExportInfo(){
    //console.log('reExportInfo')
    var start = "name\tw\th\ts\ttype\n";
    var exports = '';
    exportAllname = 'KV+\n';
    var exportAllchannel = [];
    var numD = 0,numImg = 0,numView = 0;
    var nameStep = [];
    var nameIndex = 0,namess = '';
    userImgData.zy = [];
    for(var i = 0; i < allKey.length; i ++){
        
        for(var ii = 0; ii < allImg[i].length; ii++){
            
            if(allImg[i][ii] && allImg[i][ii].length > 0){
                var img = sheet[allKey[i]].find(item => item.name == allImg[i][ii]);
                namess = img.name;
                if(nameStep.includes(allKey[i] + "/" + img.name)){
                    nameIndex++;
                    namess = img.name + nameIndex;
                }
                if(!exportAllchannel.includes(allKey[i])){
                    exportAllchannel.push(allKey[i])
                    exportAllname += allKey[i] + '-资源位：' + '\n';
                }
                exports += allKey[i] + "/" + namess + '\t' + img.w + '\t' + img.h + '\t' + img.s + '\t' + img.type + '\n';  
                exportAllname += namess + ' ' + img.w + '×' + img.h + '\n';
                nameStep.push(allKey[i] + "/" + img.name);
                numD += img.d * 100;
                numImg++;
                if(img.view){
                    numView++
                } 
                userImgData.zy.push({
                    img:img,
                    channel:[allKey[i],0],/*渠道，作为logo,按序号指定库中LOGO版本，如彩-暗/彩-亮/黑/白*/
                    set:{
                        titleNum:[0,0],/*主标题文案序号,副标题文案序号*/
                        gift:0,/*奖励数量，0则隐藏*/
                        fontsize:[]
                    },
                })
            }
            
            
        }
    }
    document.getElementById("export-info").value = start + exports;
    if (exports){
        document.getElementById('btn-copy').style.display = 'flex';
        document.getElementById('btn-copy-info').style.display = 'flex';
        document.getElementById('to-model').style.display = 'flex';
    }
    document.getElementById("num-img").innerHTML = numImg;
    document.getElementById("num-view").innerHTML = numView;
    document.getElementById("num-all").innerHTML = (numView*1 + numImg*1);
    document.getElementById("num-d").innerHTML = numD/100 + "d";
    exportAllInfo = exportAllname + "延展合计：" + (numView*1 + numImg*1) + "\n预估人天：" + (numD + 60)/100 + "d";
    
}

function reClick(type,e,ee){
    if (type == 'img'){
        document.getElementById("add-" + e + "-" + ee).parentNode.style.opacity = 1;
        document.getElementById("add-" + e + "-" + ee).parentNode.style.pointerEvents = 'auto'
    }
    if (type == 'key'){
        document.getElementById("add-" + e).parentNode.style.opacity = 1;
        document.getElementById("add-" + e).parentNode.style.pointerEvents = 'auto'
    }
}

function addUserList(name){
    document.getElementById("page-main-1").innerHTML = '';
    var pickUserZy = userZy.filter(item => item.name == name);
    pickUserZy[0].group.forEach((item,i) => {
        addList(i);
        document.getElementById("select-area-" + i).value = item.channel;
        document.getElementById("imgs-" + i).innerHTML = '';
        reKeysInfo(i,item.channel)
        item.zy.forEach((items,e) => {  
            addImg(i,e,item.channel)
            document.getElementById("select-img-" + i + '-' + e).value = items.name;
            reImgInfo(i,e,items.name)
        })
        
    })
}
