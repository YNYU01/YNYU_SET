const root = document.documentElement;
const load = document.getElementById("load");
const TVMove = document.getElementById("TV-move");
const TVInfo = document.getElementById("TV-info");
const btnChange = document.getElementById('tool-change');
const toolTitle = document.getElementById('tool-title');
const toolList = document.getElementById('tool-list');
const btnMain = document.getElementById('btn-main');
const more = document.getElementById('more');
const theme = document.getElementById('theme');
const user = document.getElementById('user')
const btnTheme = document.getElementById('btn-theme');
const btnUser = document.getElementById('btn-user');
const toolList1 = document.getElementById('tool-list-1');
const toolList2 = document.getElementById('tool-list-2');
const toolList3 = document.getElementById('tool-list-3');

var lightTheme = {
"mainColor":"#2b2b2b",
"mainColor2":"#4deba3",
"mainColor3":"#000",
"mainColor4":"#d1abff",
"boxBod":"#aeaeae",
"boxBak":"#eeeeee",
"boxGry":"#dddddd",
"liColor1":"#d03b3b",
"link":"#4e7075",
"bg-mask":"200,200,200",
"hl-op":"1",
"mod-table":"rgba(250,250,250,0.8)",
"mod-filter":"brightness(80%) contrast(180%)"
}
var darkTheme = {
"mainColor":"#acacac",
"mainColor2":"#2f9f6c",
"mainColor3":"#fff",
"mainColor4":"#9c69db",
"boxBod":"#5d5d5d",
"boxBak":"#202020",
"boxGry":"#393939",
"liColor1":"#d03b3b",
"link":"#4e7075",
"bg-mask":"20,20,20",
"hl-op":"0.4",
"mod-table":"rgba(25,25,25,0.9)",
"mod-filter":"brightness(120%) contrast(180%)"
}
var styleKey = Object.keys(lightTheme);//主题色键值
var styleValue = Object.values(lightTheme);//主题色色值
var styleKey2 = Object.keys(darkTheme);//主题色键值
var styleValue2 = Object.values(darkTheme);//主题色色值
var AItoKeysArea;
var modelPick = null;
var tipsTime = [];//记录有限次数提示


window.onload = ()=>{
    if(localStorage.getItem('userTheme') == 'light'){
        document.getElementById('theme').checked = false;
        setTheme(document.getElementById('theme'));
    }
    if(!localStorage.getItem('userTheme')){
        document.getElementById('theme').checked = false;
        setTheme(document.getElementById('theme'));
        localStorage.setItem('userTheme','light');
    }
    
    var tousertips = toUser[Math.floor(Math.random()*10)];
    //console.log(tousertips)
    document.getElementById('load-tips').textContent = tousertips;
    document.getElementById('bottom-tips').innerHTML = `
    <div style="animation: boxUp 0.5s;">
    ` + toUser[tipsIndex] + `
    ~</div>
    `;

    
    addOption("select-area-",sheet,0);
    addOption("select-area-",sheet,'ai');
    addOption("select-img-",[],0);
    allKey.push('');//默认值
    allImg[0] = '';//默认值
    var MN = new Date()
    var M = String(MN.getMonth() + 1).padStart(2, '0');
    var N = String(MN.getDate()).padStart(2, '0');
    var HHMMSS = MN.getHours() * 60 * 60 + MN.getMinutes() * 60 + MN.getSeconds();
    
    if(localStorage.getItem('userTime')){
        var getUserTime = localStorage.getItem('userTime').split(','); 
        if(getUserTime[0] != M || getUserTime[1] != N || HHMMSS - getUserTime[2] > 30){
            load.style.display = 'block';
            setTimeout(() => {
                viewPage(2);
            },2000);
        } else {
            load.style.display = 'none';
            viewPage(2);
        }
    } else {
        load.style.display = 'block';
        setTimeout(() => {
            viewPage(2);
        },2000);
    }
    localStorage.setItem('userTime',M + ',' + N + ',' + HHMMSS); 
    
    addModelList();
    addFlowEditor();
    isMobile(true);
    moDautoZoom();
    addGame();
    addFontStyle();
    bottomTips();
    addStylePick(0);
}

window.onresize = ()=>{
    moDautoZoom();
    isMobile();
    var reClone;
    if(reClone){
        clearTimeout(reClone)
    };
    reClone = setTimeout(()=>{
        reimgClone();
    },500)
}

window.onbeforeunload = ()=>{
    window.event.preventDefault();
    window.event.returnValue = '系统可能不会保存您所做的更改,如有需要，请先保存数据' ;
}


imgViewBox.onmousewheel = ()=>{
    var step = Math.abs(event.wheelDelta)/12 ;
    if(event.wheelDelta > 0){
        imgViewSlider.value = imgViewSlider.value*1 + step;
    } else {
        imgViewSlider.value = imgViewSlider.value*1 - step;
    }
    reZoom();
    imgViewBox.style.transform = 'scale( '+ imgViewSlider.value/100 + ')';
    //console.log(window.event.clientX - imgViewBox.getBoundingClientRect().left, imgViewBox.offsetWidth*imgViewSlider.value/100)
    //只测试了理想缩放中心的偏移值，还没算上前一次偏移值
    //imgViewBox.parentNode.style.transform = 'translate(' + (window.event.clientX - imgViewBox.getBoundingClientRect().left) +'px,' + (window.event.clientY - imgViewBox.getBoundingClientRect().top) + 'px)';  
}

imgViewBox.onmousedown = ()=> {
    if(window.event.button == 0){
    isDragging = true;
    clickX = window.event.clientX;
    clickY = window.event.clientY;  
    imgViewBox.style.cursor = 'move';
    }
}

imgViewBox.onmousemove = ()=>{
    if(isDragging){
        moveX = moveXX + window.event.clientX - clickX;
        moveY = moveYY + window.event.clientY - clickY;
        imgViewBox.parentNode.style.transform = 'translate(' + moveX +'px,' + moveY + 'px)';
        
    }
}

imgViewBox.onmouseup= ()=>{
    isDragging = false;
    moveXX = moveX;
    moveYY = moveY;
    imgViewBox.style.cursor = 'default';
}

imgViewBox.ontouchstart = ()=> {
    isDragging = true;
    clickX = window.event.touches[0].clientX;
    clickY = window.event.touches[0].clientY;
}

imgViewBox.ontouchmove = ()=>{
    if(isDragging){
        moveX = moveXX + window.event.touches[0].clientX - clickX;
        moveY = moveYY + window.event.touches[0].clientY - clickY;
        imgViewBox.parentNode.style.transform = 'translate(' + moveX +'px,' + moveY + 'px)';  
    }
}

imgViewBox.ontouchend= ()=>{
    isDragging = false;
    moveXX = moveX;
    moveYY = moveY;
}

modelFlow.ontouchstart = ()=> {

    isDragging = true;
    if(window.event.touches.length >= 2){
        var dx = window.event.touches[1].clientX - window.event.touches[0].clientX;
        var dy = window.event.touches[1].clientY - window.event.touches[0].clientY;
        touchXY = Math.sqrt(dx * dx + dy * dy);
        touchScale = touchSS;
    } else {
        clickX = window.event.touches[0].clientX;
        clickY = window.event.touches[0].clientY;
    }

}

modelFlow.ontouchmove = ()=>{
    if(isDragging){
        window.event.preventDefault(); 
        if(window.event.touches.length >= 2){
            var dxs = window.event.touches[1].clientX - window.event.touches[0].clientX;
            var dys = window.event.touches[1].clientY - window.event.touches[0].clientY;
            var touchXYs = Math.sqrt(dxs * dxs + dys * dys);
            touchSS = touchScale * (touchXYs/touchXY);
            modelFlow.style.transformOrigin = modelFlow.parentNode.offsetWidth/2 + 'px ' + modelFlow.parentNode.offsetHeight/2 + 'px'
            modelFlow.style.transform = 'scale(' + touchSS + ')';
        } else {
            moveX = moveXX + window.event.touches[0].clientX - clickX;
            moveY = moveYY + window.event.touches[0].clientY - clickY;
            modelFlow.style.transform = 'translate(' + moveX +'px,' + moveY + 'px)';  
        }
        
    }
}

modelFlow.ontouchend = ()=>{
    isDragging = false;
    touchScale = touchSS;
    moveXX = moveX;
    moveYY = moveY;
}

toolList1.onclick = ()=>{viewPage(1)};
toolList2.onclick = ()=>{viewPage(2)};
toolList3.onclick = ()=>{viewPage(3)};

more.onchange = ()=>{
    if(more.checked){
        changeDisplay([[btnTheme,'block'],[btnUser,'block']]);
    } else {
        changeDisplay([[btnTheme,'none'],[btnUser,'none']]);
    }
}
theme.onchange = ()=>{setTheme(theme)};
user.onchange = ()=>{}

function setTheme(e){
    if(!e.checked){
        console.log('浅色主题')
        for (var i = 0; i < styleKey.length; i++) {
            root.style.setProperty('--' + styleKey[i], styleValue[i])
        }
        modelFlow.style.filter = 'brightness(86%) hue-rotate(180deg) invert(1) contrast(128%) saturate(400%)';
        localStorage.setItem('userTheme','light');
        if(document.getElementById('title-colorBox').value == darkTheme.mainColor ){
            document.getElementById('title-colorBox').value = lightTheme.mainColor;
            document.getElementById('title-color').value = lightTheme.mainColor;
        }
        if(document.getElementById('sectitle-colorBox').value == darkTheme.mainColor ){
            document.getElementById('sectitle-colorBox').value = lightTheme.mainColor;
            document.getElementById('sectitle-color').value = lightTheme.mainColor;
        }
        if(document.getElementById('gift-name-colorBox').value == darkTheme.mainColor ){
            document.getElementById('gift-name-colorBox').value = lightTheme.mainColor;
            document.getElementById('gift-name-color').value = lightTheme.mainColor;
        }
    } else {
        console.log('深色主题')
        for (var i = 0; i < styleKey2.length; i++) {
            root.style.setProperty('--' + styleKey2[i], styleValue2[i])
        }
        modelFlow.style.filter = '';
        localStorage.setItem('userTheme','dark');
        if(document.getElementById('title-colorBox').value == lightTheme.mainColor){
            document.getElementById('title-colorBox').value = darkTheme.mainColor;
            document.getElementById('title-color').value = darkTheme.mainColor;
        }
        if(document.getElementById('sectitle-colorBox').value == lightTheme.mainColor){
            document.getElementById('sectitle-colorBox').value = darkTheme.mainColor;
            document.getElementById('sectitle-color').value = darkTheme.mainColor;
        }
        if(document.getElementById('gift-name-colorBox').value == lightTheme.mainColor ){
            document.getElementById('gift-name-colorBox').value = darkTheme.mainColor;
            document.getElementById('gift-name-color').value = darkTheme.mainColor;
        }
    }
}

function isMobile(isNew){
    if(window.innerWidth <= 900){
        if(isNew){
            moDshowSetBtn.checked = false;
            moDshowSet();
        }else{
            moDshowSet();
        }
        TVInfo.style.width = TVInfo.textContent.length*12.5 + 'px';
        TVMove.style.setProperty('--tv-w',TVMove.offsetWidth*-1 + 'px')
        //要维持30px/s,将跑马灯宽度加上父容器宽度除以10即可
        var speed = Math.floor((TVMove.parentNode.offsetWidth + TVMove.offsetWidth)/30);
        TVMove.style.animation = "tvMove " + speed + "s linear infinite";
    } else {
        if(isNew){
            moDshowSetBtn.checked = true;
            moDshowSet();
        }else{
            moDshowSet();
        }
        TVMove.style.animation = "none"
    }
}
    
function toView(id,boxId){
    var node = document.getElementById(id);
    var box = document.getElementById(boxId);
    var nodeRect = node.getBoundingClientRect();
    var boxRect = box.getBoundingClientRect();
    //console.log(nodeRect.top,boxRect.top + box.offsetHeight)
    if(nodeRect.top + node.offsetHeight*2 > boxRect.top + box.offsetHeight){
        //console.log("超出")
        /*
        node.scrollIntoView({
            behavior:'smooth'
        })
        */
        box.scrollTo({
            top:box.scrollTop + box.offsetHeight/4,
            behavior:'smooth'
        })
    }
    
}

function AItoKeys(input){
    //console.log(input)
    var keywords = []
    Object.keys(sheet).forEach(item => {
        keywords.push(...sheet[item].map(imgs => imgs.name))
    })
    //console.log(keywords)
    if(input){
        var sentences = input.replace(/\s+/g,'-').split(/\/[\t\r\n\.\?\!]+/).map(s => s.trim());
        var options = {
            includeScore:true,
            threshold:0.7,
            keys:['sentence']
        };
        var fuse = new Fuse(sentences.map(sentence => ({sentence})),options);
        console.log(fuse)
        var toTags = [];
        keywords.forEach(item => {
            sentences.forEach(sentence => {
                var result = fuse.search(item);
                if ( result.length > 0){
                    toTags.push(...Array(result.length).fill(item))
                }
            })

        })

        console.log(toTags)
    }
    if(input == ''){
        setTimeout(()=>{
            document.getElementById('btn-ai').style.animation = 'none'
        },2000)
        tipsAll('未检测到数据','2000')
        
    } 
}

var tipsIndex = 0;
function bottomTips(){
    setInterval(()=>{
        tipsIndex = (tipsIndex + 1)%10
        document.getElementById('bottom-tips').innerHTML = `
        <div style="animation: boxUp 0.5s;">
        ` + toUser[tipsIndex] + `
        ~</div>
        `;
    },5000)
}

//全局提示
function tipsAll(string,time,num){
    var tips = document.getElementById('tips-all');
    var text = document.getElementById('tips-box');
    if(num){
        if(tipsTime.some(item => item.split('#')[0] == string )){
        //console.log(tipsTime)
        tipsTime.forEach((item,index)=> {
            if(item.split('#')[0] == string){
                if( item.split('#')[1]*1 > 1){
                    tipsTime[index] = item.split('#')[0] + '#' + (item.split('#')[1]*1 - 1);
                    //console.log(item.split('#')[0] + '#' + (item.split('#')[1]*1 - 1))
                    tips.style.display = "flex";
                    text.innerHTML = string;
                    setTimeout(()=>{
                        tips.style.display = "none";
                        text.innerHTML = '';
                    },time)
                }
            }
        })
        } else {
            tipsTime.push(string + '#' + num);
            tips.style.display = "flex";
            text.innerHTML = string;
            setTimeout(()=>{
                tips.style.display = "none";
                text.innerHTML = '';
            },time)
        }
    } else {
        tips.style.display = "flex";
            text.innerHTML = string;
            setTimeout(()=>{
                tips.style.display = "none";
                text.innerHTML = '';
            },time)
    }
    

    
}
//获取输入字符的长度
function getTextNum(e){
    document.getElementById(e.id + '-num').textContent = e.value.trim().length;
}
//设置输入为空时的默认值
function setTextMust(e,text){
    e.value.trim() === ''? e.value = text : ()=>{};
    getTextNum(e);
}

//重置输入色值
function reColorText(e) {
    var values = '#' +  e.value.replace(/[#]/g,'');
    if (values == '#' || values.replace(/[0-9a-fA-F]/g,'').trim().length > 1) {
    e.value = "#000000";
    tipsAll('请输入正确的色值','1000');
    } else {
        if (e.value.length < 7) {
        if (e.value[0] == '#') {
            var a = e.value.replace(/[#]/g,'');
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
            var c = e.value.replace(/[#]/g,'')
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
                tipsAll('请输入正确的色值','1000');
            }
        }
    }
    

}

const pages = document.querySelectorAll('.page')
const toolN = document.getElementById('tool-name')
function viewPage(e){
    //console.log('页面-' + e)
    pages.forEach((item,index) => {
        if(index > 0){
            if(item.id.split('-')[1] == e){
            item.style.display = 'flex'
            toolN.innerHTML = document.getElementById('tool-list-' + item.id.split('-')[1]).innerHTML
            document.getElementById('tool-list-' + item.id.split('-')[1]).className = 'tool-option-pick'
            } else {
                item.style.display = 'none'
                document.getElementById('tool-list-' + item.id.split('-')[1]).className = 'tool-option'
            }
        } else {
            item.style.display = 'none'
        }
        
    })
    if(e == 2){
        addZYtable();
        moDautoZoom(); 
    }

}

//单选tab
function onlyTab(node,parent,isMustOne){
    var input = [];
    parent.querySelectorAll('input').forEach(item =>{ 
        if(item.type == 'checkbox'){
            input.push(item)
        } 
    })
    input.forEach(item => {
        if (item.checked == true && item.id != node.id){
            item.checked = false;
        }
    })
    if(isMustOne){
        node.checked = true;
    }
}

//批量修改display
function changeDisplay(array){
    array.forEach(item => {
        if(typeof item[0] == 'string'){
            document.getElementById(item[0]).style.display = item[1];
        } else {
            item[0].style.display = item[1];
        }
    })
}


// 监听整个文档的点击事件
document.addEventListener('mousedown', function (event) {
    var list = document.querySelectorAll('.tool-list')
    if(more.checked && !btnMain.contains(event.target) && document.activeElement){
        btnUser.style.display = 'none';
        btnTheme.style.display = 'none';
        more.checked = false;
    }
    list.forEach(item => {
        if(btnChange.checked  && !toolTitle.contains(event.target) && document.activeElement){
            item.style.display = 'none';
            btnChange.checked = false;
        }
    })
})
