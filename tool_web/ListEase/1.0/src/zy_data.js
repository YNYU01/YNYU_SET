/*
- [云即·资源助手]
- ©版权所有：2024-2025 YNYU @lvynyu2.gmail.com
- 禁止未授权的商用及二次编辑
- 禁止用于违法行为，如有，与作者无关
- 二次编辑需将引用部分开源
- 引用开源库的部分应遵循对应许可
- 使用当前代码时禁止删除或修改本声明
*/
// 自动获取当前页面的基础路径，用于 dom_to_img 读取图片（需要绝对路径）
var haxi = (function() {
    var baseUrl = window.location.href;
    var lastSlash = baseUrl.lastIndexOf('/');
    return baseUrl.substring(0, lastSlash + 1);
})();
/* 
纯数字的键名要带下划线，避免被识别成数字序号；
name的结构为>位置-名称<，生成option时会自动分组，如无则归为通用组；
info的值分别对应[主标题，副标题，奖励图，LOGO，按钮]，1表示允许，0表示不允许；
s的值要带k,作为string传入；
safa记录安全区数据，每组数据对应[x,y,w,h,islogo],如有多个安全区，请将文字所在安全区放首位，其中islogo表示是否影响logo的位置，是则用1表示；
每个渠道配备一个用户预设，用渠道加_user区分，首次生成需用户保存预设，也支持手动导入预设；
允许添加用户自定义尺寸集，首次生成需用户保存设置，也支持手动导入；
 */
const 大神 = [
    {name:"启动页",w:1080,h:1620,s:"500k",type:"jpg",d:0.2,view:false,info:[1,1,1,1,0],safa:[[135,210,810,1120,1]],clip:null},
    {name:"弹窗",w:580,h:870,s:"700k",type:"png",d:0.1,view:false,info:[1,1,1,1,1],safa:[[0,60,580,662]],clip:[0,60,580,580,290,1]},
    {name:"系统信息推送图",w:642,h:280,s:"300k",type:"jpg",d:0.03,view:false,info:[1,0,1,1,0],safa:[],clip:null},
    {name:"我页活动icon图",w:54,h:54,s:"300k",type:"png",d:0.01,view:false,info:[0,0,0,0,0],safa:[],clip:null},
    {name:"游戏页活动icon图",w:160,h:64,s:"300k",type:"png",d:0.02,view:false,info:[1,0,0,0,0],safa:[],clip:[0,0,160,64,12,1]},
    {name:"聊天广告",w:84,h:84,s:"300k",type:"png",d:0.03,view:false,info:[0,0,0,0,0],safa:[],clip:[0,0,84,84,42]},
    {name:"圈子全局广告",w:120,h:120,s:"300k",type:"png",d:0.03,view:false,info:[0,0,0,0,0],safa:[],clip:[0,0,120,120,60]},
    {name:"负一屏-预约banner",w:969,h:228,s:"300k",type:"jpg",d:0.03,view:false,info:[1,0,0,0,0],safa:[],clip:null},
    {name:"负一屏-专题图",w:686,h:492,s:"300k",type:"jpg",d:0.03,view:false,info:[1,1,0,0,0],safa:[[0,0,686,256]],clip:null},
    {name:"负一屏-大横屏banner",w:686,h:320,s:"300k",type:"jpg",d:0.03,view:false,info:[1,0,0,1,0],safa:[],clip:null},
    {name:"负一屏-小横屏banner",w:1029,h:180,s:"300k",type:"jpg",d:0.03,view:false,info:[1,0,0,0,0],safa:[[46,24,937,132]],clip:null},
    {name:"搜索页-推广小图",w:320,h:122,s:"300k",type:"jpg",d:0.03,view:false,info:[1,0,0,1,0],safa:[],clip:null},
    {name:"搜索页-直达卡",w:686,h:240,s:"300k",type:"jpg",d:0.03,view:false,info:[1,1,0,1,0],safa:[],clip:null},
    {name:"内容流-双图",w:335,h:188,s:"300k",type:"jpg",d:0.03,view:false,info:[1,0,0,0,0],safa:[],clip:null},
    {name:"内容流-单图",w:690,h:188,s:"300k",type:"jpg",d:0.03,view:false,info:[1,0,0,0,0],safa:[],clip:null},
    {name:"内容流-四图",w:158,h:158,s:"300k",type:"jpg",d:0.03,view:false,info:[0,0,0,0,0],safa:[],clip:null},
    {name:"内容流-双排流广告图",w:543,h:720,s:"300k",type:"jpg",d:0.03,view:false,info:[1,1,0,1,0],safa:[[0,430,543,250]],clip:null},
    {name:"内容流-游戏分发入口",w:702,h:144,s:"300k",type:"png",d:0.03,view:false,info:[1,0,0,0,0],safa:[[168,23,358,121],[0,23,702,121]],clip:[0,23,702,121,30]},
    {name:"游戏发现页-大事记背景图",w:656,h:544,s:"300k",type:"jpg",d:0.03,view:false,info:[0,0,0,0,0],safa:[[18,80,620,210]],clip:null},
    {name:"游戏发现页-新游预约",w:640,h:336,s:"300k",type:"jpg",d:0.03,view:false,info:[0,0,0,0,0],safa:[],clip:null},
    {name:"游戏发现页-游戏分类推荐页",w:520,h:202,s:"300k",type:"jpg",d:0.03,view:false,info:[1,0,0,1,0],safa:[],clip:null},
];
var 大神_user = [];
const CC = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const DD = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const vivo = [
    {name:"游戏中心-悬浮窗",w:280,h:280,s:"200k",type:"png",d:0.01,view:false},
    {name:"游戏中心-精选页banner1",w:1080,h:380,s:"150k",type:"jpg",d:0.07,view:false},
    {name:"游戏中心-精选页banner1-破窗款",w:1080,h:380,s:"150k",type:"png",d:0.07,view:false},
    {name:"游戏中心-精选页banner2",w:1080,h:580,s:"150k",type:"jpg",d:0.07,view:false},
    {name:"游戏中心-闪屏-全屏",w:1080,h:2160,s:"300k",type:"jpg",d:0.1,view:false},
    {name:"游戏中心-闪屏-半屏",w:1080,h:1880,s:"300k",type:"jpg",d:0.1,view:false},
    {name:"游戏中心-闪屏-游戏专用",w:1080,h:1920,s:"300k",type:"jpg",d:0.1,view:false},
    {name:"四号位卡片",w:480,h:789,s:"150k",type:"jpg",d:0.05,view:false},
    {name:"游戏中心-胶囊banner",w:1080,h:240,s:"",type:"png",d:0.05,view:false},
    {name:"游戏中心-插屏模板-主图",w:810,h:810,s:"300k",type:"png",d:0.07,view:false},
    {name:"游戏中心-插屏模板-按钮",w:272,h:94,s:"300k",type:"png",d:0.01,view:false},
    {name:"游戏中心-金刚位",w:165,h:165,s:"",type:"png",d:0.05,view:false},
    {name:"游戏中心-底部bar-未选中",w:96,h:96,s:"50k",type:"png",d:0.1,view:false},
    {name:"游戏中心-底部bar-已选中",w:138,h:138,s:"50k",type:"png",d:0.05,view:false},
    {name:"游戏中心-底部bar-背景",w:1080,h:186,s:"100k",type:"png",d:0.1,view:false},
    {name:"游戏中心-氛围背景",w:1080,h:1400,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"游戏中心-活动大图",w:984,h:1092,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"游戏中心-吸顶图",w:1032,h:210,s:"500k",type:"jpg",d:0.07,view:false},
    {name:"游戏中心-右置图",w:210,h:210,s:"500k",type:"jpg",d:0.05,view:false},
    {name:"游戏中心-Tab氛围-未选中",w:60,h:360,s:"",type:"png",d:0.05,view:false},
    {name:"游戏中心-Tab氛围-选中",w:60,h:360,s:"",type:"png",d:0.05,view:false},
    {name:"游戏中心-动态icon",w:512,h:512,s:"1024k",type:"gif",d:0.1,view:false},
    {name:"游戏中心-每日一荐",w:1080,h:1164,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"游戏中心-新游推荐位",w:984,h:750,s:"150k",type:"jpg",d:0.05,view:false},
    {name:"游戏中心-新游预约详情页(原画）",w:1080,h:1400,s:"200k",type:"jpg",d:0.05,view:false},
    {name:"应用商店-闪屏-全屏",w:1080,h:2160,s:"300k",type:"jpg",d:0.1,view:false},
    {name:"应用商店-闪屏-半屏",w:1080,h:1880,s:"300k",type:"jpg",d:0.1,view:false},
    {name:"应用商店-闪屏-游戏专用",w:1080,h:1920,s:"300k",type:"jpg",d:0.1,view:false},
    {name:"应用商店-应用名称后标签",w:166,h:44,s:"",type:"png",d:0.01,view:false},
    {name:"应用商店-按钮",w:162,h:78,s:"",type:"png",d:0.01,view:false},
    {name:"应用商店-顶部栏目icon",w:104,h:104,s:"",type:"png",d:0.05,view:false},
    {name:"应用商店-新banner1",w:720,h:498,s:"150k",type:"jpg",d:0.05,view:false},
    {name:"应用商店-新banner2",w:630,h:336,s:"150k",type:"jpg",d:0.05,view:false},
    {name:"应用商店-底部tab配置icon",w:90,h:90,s:"30k",type:"jpg",d:0.05,view:false},
    {name:"五图1",w:1080,h:720,s:"500k",type:"jpg",d:0.05,view:false},
    {name:"五图2",w:1080,h:720,s:"500k",type:"jpg",d:0.05,view:false},
    {name:"五图3",w:1080,h:720,s:"500k",type:"jpg",d:0.05,view:false},
    {name:"五图4",w:1080,h:720,s:"500k",type:"jpg",d:0.05,view:false},
    {name:"五图5",w:1080,h:720,s:"500k",type:"jpg",d:0.05,view:false},
    {name:"宣传卡片",w:1280,h:720,s:"500k",type:"jpg",d:0.07,view:false},
    {name:"预约头图",w:1080,h:1400,s:"200k",type:"jpg",d:0.07,view:false},
    {name:"弹窗1",w:885,h:930,s:"500k",type:"png",d:0.1,view:false},
    {name:"弹窗2",w:1668,h:849,s:"500k",type:"png",d:0.1,view:false},
];
const 华为 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const 九游 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const 联想 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const _233 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const 荣耀 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const oppo = [
    {name:"信息流-横版视频",w:1280,h:720,s:"150k",type:"jpg",d:0.01,view:false},
    {name:"信息流-竖版视频",w:720,h:1280,s:"150k",type:"jpg",d:0.07,view:false},
    {name:"信息流-横版大图",w:1280,h:720,s:"150k",type:"jpg",d:0.07,view:false},
    {name:"信息流-竖版大图",w:1080,h:1920,s:"300k",type:"jpg",d:0.07,view:false},
    {name:"信息流-横版组图(3张)",w:320,h:210,s:"100k",type:"jpg",d:0.1,view:false},
    {name:"信息流-横版小图",w:320,h:210,s:"100k",type:"jpg",d:0.1,view:false},
    {name:"锁屏图组",w:1782,h:3168,s:"5120k",type:"jpg",d:0.1,view:false},
    {name:"锁屏-详情页底部banner",w:985,h:420,s:"500k",type:"jpg",d:0.05,view:true},
    {name:"锁屏-划屏",w:1782,h:3168,s:"5120k",type:"jpg",d:0.07,view:false},
    {name:"锁屏-IP图",w:198,h:255,s:"500k",type:"jpg",d:0.01,view:false},
    {name:"锁屏-IP图-效果",w:720,h:1280,s:"",type:"jpg",d:0.05,view:false},
    {name:"闪屏",w:1080,h:2400,s:"2048k",type:"jpg",d:0.1,view:true},
    {name:"游戏中心-节点推广",w:984,h:554,s:"1024k",type:"jpg",d:0.1,view:false},
    {name:"游戏中心-站内信",w:984,h:369,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"游戏中心-小卡轮播",w:984,h:369,s:"1024k",type:"jpg",d:0.1,view:false},
    {name:"游戏中心-首页banner大卡",w:1280,h:720,s:"4096k",type:"jpg",d:0.07,view:false},
    {name:"游戏中心-首页大卡",w:1080,h:1080,s:"2048k",type:"jpg",d:0.05,view:false},
    {name:"游戏中心-负一屏",w:231,h:174,s:"500k",type:"jpg",d:0.05,view:false},
    {name:"浮标",w:240,h:240,s:"200k",type:"png",d:0.05,view:true},
    {name:"游戏频道banner",w:984,h:369,s:"1024k",type:"jpg",d:0.1,view:false},
    {name:"视频-游戏横划组件",w:984,h:369,s:"500k",type:"jpg",d:0.05,view:false},
    {name:"视频-个人中心banner",w:980,h:270,s:"500k",type:"jpg",d:0.05,view:false},
    {name:"软件商店-动态icon",w:180,h:180,s:"500k",type:"gif",d:0.1,view:false},
    {name:"软件商店-节点氛围卡",w:1280,h:720,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"软件商店-应用落地页",w:1080,h:1920,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"软件商店-应用卡片",w:1280,h:720,s:"500k",type:"jpg",d:0.01,view:false},
    {name:"软件商店-视频每日一荐",w:1280,h:720,s:"1024k",type:"jpg",d:0.01,view:false},
    {name:"软件商店-聚量TAB-点击前",w:120,h:120,s:"200k",type:"png",d:0.05,view:false},
    {name:"软件商店-聚量TAB-点击后",w:180,h:180,s:"200k",type:"png",d:0.05,view:false},
    {name:"软件商店-搜索栏聚量(2张)",w:204,h:120,s:"200k",type:"png",d:0.05,view:false},
    {name:"软件商店-精选页弹幕卡片",w:984,h:738,s:"500k",type:"jpg",d:0.05,view:false},
    {name:"软件商店-专区预约大卡",w:1280,h:720,s:"1024k",type:"jpg",d:0.05,view:false},
    {name:"软件商店-浮层-普通",w:828,h:1284,s:"500k",type:"png",d:0.05,view:false},
    {name:"软件商店-浮层-异形",w:984,h:1440,s:"500k",type:"png",d:0.05,view:false},
    {name:"PUSH-大图",w:984,h:369,s:"1024k",type:"jpg",d:0.05,view:false},
    {name:"PUSH-小图",w:144,h:144,s:"200k",type:"jpg",d:0.05,view:false},
    {name:"软件商店-首页轮播1",w:1280,h:720,s:"1024k",type:"jpg",d:0.07,view:false},
    {name:"软件商店-首页轮播2",w:1080,h:594,s:"1024k",type:"jpg",d:0.07,view:false},
    {name:"浏览器-游戏专题轮播图",w:1280,h:720,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"浏览器-游戏专区大卡",w:1080,h:1080,s:"",type:"jpg",d:0.1,view:false},
    {name:"浏览器-信息流大图",w:640,h:360,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"浏览器-游戏频道小卡片",w:480,h:270,s:"200k",type:"jpg",d:0.1,view:false},
    {name:"浏览器-摇一摇闪屏",w:1080,h:2400,s:"300k",type:"jpg",d:0.1,view:false},
    {name:"浏览器-首页皮肤-新版",w:1088,h:602,s:"500k",type:"jpg",d:0.1,view:true},
    {name:"浏览器-首页皮肤-旧版",w:1088,h:602,s:"500k",type:"jpg",d:0.1,view:true},
    {name:"浏览器-热门活动",w:984,h:270,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"浏览器-活动入口",w:800,h:176,s:"200k",type:"jpg",d:0.1,view:false},
    {name:"负一屏-游戏预约卡片",w:480,h:480,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"负一屏-游戏品专banner",w:1280,h:720,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"负一屏-游戏服务卡",w:1280,h:720,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"负一屏-信息流大图",w:640,h:320,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"负一屏-精选卡片",w:1080,h:608,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"桌面推荐大卡",w:1080,h:608,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"桌面推荐小卡",w:608,h:608,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"opush-精彩推荐",w:984,h:465,s:"150k",type:"jpg",d:0.1,view:false},
    {name:"自动化短信图",w:936,h:526,s:"500k",type:"jpg",d:0.1,view:false},
    {name:"短信图",w:936,h:526,s:"200k",type:"jpg",d:0.1,view:false},
];
const _4399 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const 小米 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const 好游快爆 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const 手机QQ = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const 应用宝 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const QQ浏览器 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const 腾讯游戏 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const 微信 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];
const 手机管家 = [
    {name:"测试1",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
    {name:"测试2",w:100,h:100,s:"300k",type:"jpg",d:0.1,view:false,safa:[]},
];

    
const games = [
    {name:"永劫无间",src:[haxi + "../img/game/永劫无间_黑.png",haxi + "../img/game/永劫无间_白.png",]},
    {name:"永劫无间手游",src:[haxi + "../img/game/永劫无间手游_黑.png",haxi + "../img/game/永劫无间手游_白.png",]},
    {name:"梦幻西游端游",src:[haxi + "../img/game/梦幻西游端游.png",haxi + "../img/game/梦幻西游端游.png",]},
    {name:"梦幻西游手游",src:[haxi + "../img/game/梦幻西游手游.png",haxi + "../img/game/梦幻西游手游.png",]},
    {name:"炉石传说",src:[haxi + "../img/game/炉石传说.png",haxi + "../img/game/炉石传说.png",]},
    {name:"燕云十六声",src:[haxi + "../img/game/燕云十六声_白.png",haxi + "../img/game/燕云十六声_白.png",]},
    {name:"新倩女幽魂",src:[haxi + "../img/game/新倩女幽魂.png",haxi + "../img/game/新倩女幽魂.png",]},
    {name:"倩女幽魂手游",src:[haxi + "../img/game/倩女幽魂手游.png",haxi + "../img/game/倩女幽魂手游.png",]},
    {name:"天下3",src:[haxi + "../img/game/天下3.png",haxi + "../img/game/天下3.png",]},
    {name:"天下贰",src:[haxi + "../img/game/天下贰.png",haxi + "../img/game/天下贰.png",]},
    {name:"天谕手游",src:[haxi + "../img/game/天谕手游.png",haxi + "../img/game/天谕手游.png",]},
    {name:"一梦江湖",src:[haxi + "../img/game/一梦江湖_黑.png",haxi + "../img/game/一梦江湖_白.png",]},
    {name:"第五人格",src:[haxi + "../img/game/第五人格_黑.png",haxi + "../img/game/第五人格_白.png",]},
    {name:"蛋仔派对",src:[haxi + "../img/game/蛋仔派对.png",haxi + "../img/game/蛋仔派对.png",]},
    {name:"光遇",src:[haxi + "../img/game/光遇_蓝.png",haxi + "../img/game/光遇_白.png",]},
    {name:"界外狂潮",src:[haxi + "../img/game/界外狂潮.png",haxi + "../img/game/界外狂潮.png",]},
    {name:"七日世界",src:[haxi + "../img/game/七日世界.png",haxi + "../img/game/七日世界.png",]},
    {name:"荒野行动",src:[haxi + "../img/game/荒野行动.png",haxi + "../img/game/荒野行动.png",]},
    {name:"无烬星河",src:[haxi + "../img/game/无烬星河_白.png",haxi + "../img/game/无烬星河_白.png",]},
]

const channels = [
    {name:"大神",src:[haxi + "../img/channel/大神_深.png",haxi + "../img/channel/大神_白.png",]},
    {name:"CC直播",src:[haxi + "../img/channel/CC直播_黑.png",haxi + "../img/channel/CC直播_白.png",]},
    {name:"网易游戏",src:[haxi + "../img/channel/网易游戏_红.png",haxi + "../img/channel/网易游戏_白.png",]},
]

var sheet = {
    "大神":[...大神,...大神_user],
    "CC":[...CC],
    "DD":[...DD],
    "vivo":[...vivo],
    "华为":[...华为],
    "九游":[...九游],
    "联想":[...联想],
    "_233":[..._233],
    "荣耀":[...荣耀],
    "oppo":[...oppo],
    "_4399":[..._4399],
    "小米":[...小米],
    "好游快爆":[...好游快爆],
    "手机QQ":[...手机QQ],
    "应用宝":[...应用宝],
    "QQ浏览器":[...QQ浏览器],
    "腾讯游戏":[...腾讯游戏],
    "微信":[...微信],
    "手机管家":[...手机管家],
    }

//模拟数据
const userImgData = {
    main:{/*全局配置项*/
        title:["主标题文案","备用主标题文案"],/*标题文案，允许配置2个文案，为不同尺寸提供选项*/
        sectitle:["副标题文案文案文案文案","备用副标题文案文案文案文案"],/*副标题文案，允许配置2个文案，为不同尺寸提供选项*/
        game:["永劫无间",0],/*游戏，作为logo,按序号指定库中LOGO版本，如彩-暗/彩-亮/黑/白*/
        channel:["大神",0],/*渠道，作为logo,按序号指定库中LOGO版本，如彩-暗/彩-亮/黑/白*/
        logoview:[1,1],
        layout:{/*图层*/
            bg_main:{
                type:"IMAGE",/* IMAGE | COMPONENT */
                image:haxi + "../img/bg.png",
                w:100,/*记录素材的宽高以选择合适的缩放方式*/
                h:100,
                async:"",
            },
            bg_bg:{
                type:"IMAGE",/* IMAGE | COMPONENT */
                image:haxi + "../img/bg.png",
                w:100,
                h:100,
                async:"",
            },
            bg_secTitle:{
                type:"IMAGE",/* IMAGE | COMPONENT */
                image:haxi + "../img/bg.png",
                w:100,
                h:100,
                async:"",
            },
            bg_gift_icon:{
                type:"IMAGE",/* IMAGE | COMPONENT */
                image:haxi + "../img/bg_icon.png",
                async:"",
            },
            bg_gift_name:{
                type:"IMAGE",/* IMAGE | COMPONENT */
                image:haxi + "../img/bg.png",
                async:"",
            },

        },
        gift:{/*按资源位给定的数量按顺序显示*/
            icon:[
                haxi + "../img/bg.png",
                haxi + "../img/bg.png",
                haxi + "../img/bg.png",
                haxi + "../img/bg.png",
            ],/*用户上传，最多4个，自动转base64*/
            name:["奖励名称名称","奖励名称名称","奖励名称名称","奖励名称名称",],/*用户编辑*/
            num:["三，连","六，连","八，连","十，连"],
            tagview:[1,1,1,1],/*控制单个奖励标签显隐*/
            isview:[1,1,1,0],/*控制单个奖励显隐*/
        }
    },
    public:{/*全局规范*/
        fontsize:[//将最小字号(实际字高)、副标题字号(实际字高)、标题字号分6级(实际字高)
            [12,12,12],
            [12,20,26],
            [14,20,36],
            [16,26,46],
            [18,26,64],
            [22,36,82],
            [24,48,92],
            [24,48,110],
            [28,54,120],
            [28,54,130], 
            [36,68,180],
        ],
        framesize:{//将画布按竖版（含方版）和横板分6级，用于对应6级字号,中间值向上取值
            hh:[54,104,256,460,500,660,840,960,1080,1400,1920],//竖版以宽为极值
            ww:[50,70,120,150,220,280,320,380,440,520,1080],//横版以高为极值
        },
    },
    style:{
        title:{/*默认样式*/
            type:"COLOR",/* COLOR | COMPONENT */
            color:"var(--mainColor)",
            fontfamily:"Source Han Sans CN",
            async:"",
        },
        sectitle:{/*默认样式*/
            type:"COLOR",/* COLOR | COMPONENT */
            color:"var(--mainColor)",
            fontfamily:"Source Han Sans CN",
            async:"",
            stroke:"var(--mainColor)",
            background:"var(--boxGry)",
        },
        giftname:{/*默认样式*/
            color:"var(--mainColor)",
            fontfamily:"Source Han Sans CN",
            stroke:"var(--mainColor)",
            background:"var(--boxGry)",
        },
        tags:{/*默认样式*/
            color:"#ffffff",
            fontfamily:"Source Han Sans CN",
        },
    },
    zy:[/*有哪些资源位*/
        {
            img:{name:"KV-示例",w:1920,h:1080,s:"",type:"jpg",d:0.6,view:false,info:[1,1,1,1,0],safa:[]},
            game:["永劫无间",0],/*游戏，作为logo,按序号指定库中LOGO版本，如彩-暗/彩-亮/黑/白*/
            channel:["大神",0],/*渠道，作为logo,按序号指定库中LOGO版本，如彩-暗/彩-亮/黑/白*/
            set:{
                titleNum:[0,0],/*主标题文案序号,副标题文案序号*/
                fontsize:[],
            },
        },
    ],
}

const userZy = [
    {
        name:"预设1",
        group:[
                {
                channel:"大神",
                zy:[...大神]
            }
        ],
    }
    
]

const toUser = [
    '久坐伤身，快起来走两步吧',
    '身心要紧，不舒服及时休息',
    '工具提效，是为了多陪家人',
    '不忘初心，设计有值而无价',
    '尊重开源，要价值而非价格',
    '久坐伤身，快起来走两步吧',
    '身心要紧，不舒服及时休息',
    '工具提效，是为了多陪家人',
    '不忘初心，设计有值而无价',
    '尊重开源，要价值而非价格',
]