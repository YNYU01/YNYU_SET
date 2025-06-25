//全局变量
const root = document.documentElement;

//创建页控件绑定
const fileName = document.getElementById('file-name');
//导出页控件绑定
const exportInfo = document.getElementById('export-info');
//编辑页控件绑定
const editorInfo = document.getElementById('editor-info');
const tagsContainer1 = document.getElementById('tags-area-import');
const tagsContainer2 = document.getElementById('tags-area-export');
const tagsContainer3 = document.getElementById('tags-container-3');
const upfileArea = document.getElementById('upfile-area');
const dataText = document.getElementById('data-text');
const dataTextTips = document.getElementById('data-text-tips');
const autoUp = document.getElementById('auto-upfile');
const inputExcel = document.getElementById('user-excel');
const inputImg = document.getElementById('user-img');
const inputFiles = document.getElementById('user-files');
const btnUp = document.getElementById('btn-up');
const anotherBtns = document.getElementById('another-btns');
const anotherBtns2 = document.getElementById('another-btns-2');
const anotherBtns3 = document.getElementById('another-btns-3');
const anotherBtns4 = document.getElementById('another-btns-4');
const editTag = document.getElementById('editor-tags');
const editSets = document.getElementById('editor-set');
const typeAllow = ["jpg","jpeg","png","webp"];
const exportTagsEdit = document.getElementById('export-edit');
const exportTop = document.getElementById('export-top');

//通用控件绑定
const btnKeep = document.getElementById('btn-keep');//绑定"按钮-窗口固定/收起"
const btnSetTheme = document.getElementById('theme')

const dragSources = document.getElementsByClassName('edits');
const dropZones = document.getElementById('editor-tags');
var dropStartY,dropEndY;

var allFrame = [], finalFrame = [];
var imgExportData = [];
var imgExportInfo = [];
var importImg = [];//已弃用
var importNum;//导入文件数量
var imgsName = [], imgsNameNew = [];//已弃用
var createrType = "frame";//已弃用
var colorWmb = "#000000", sizeWmb = 1, numWmb = 4;//伪描边相关
var inView = {//声明视图大小和背景颜色信息，从主线程获取后更新
  w: 0,
  h: 0,
  x: 0,
  y: 0,
  view: '',
  bg: '',
  s: 1,
};
var tabPage = 1;//切换tab时动态发送给主线程，以根据tab来判断执不执行，减少性能损耗
var tab = ['tab-1', 'tab-2', 'tab-3', 'tab-4', 'tab-5'];//tab序号
var main = ['top', 'page', 'btn'];//核心区划分类型
var lightTheme = JSON.parse(`{
"mainColor":"#2b2b2b",
"mainColor2":"#378360",
"mainColor3":"#000",
"boxBod":"#aeaeae",
"boxBak":"#eeeeee",
"boxGry":"#dddddd",
"liColor1":"#d03b3b",
"tabBR":"0 8px 8px 8px",
"keepTrue":"#d03b3b",
"keepFalse":"#a8a8a8",
"keep":"var(--keepTrue)",
"link":"#4e7075",
"map-line-x":"50%",
"map-line-y":"50%,",
"map-bg":"#c5c5c5"
}`)
var darkTheme = JSON.parse(`{
"mainColor":"#acacac",
"mainColor2":"#378360",
"mainColor3":"#fff",
"boxBod":"#5d5d5d",
"boxBak":"#202020",
"boxGry":"#393939",
"liColor1":"#d03b3b",
"tabBR":"0 8px 8px 8px",
"keepTrue":"#d03b3b",
"keepFalse":"#5d5d5d",
"keep":"var(--keepTrue)",
"link":"#4e7075",
"map-line-x":"50%",
"map-line-y":"50%,",
"map-bg":"#202020"
}`)
var styleKey = Object.keys(lightTheme);//主题色键值
var styleValue = Object.values(lightTheme);//主题色色值
var styleKey2 = Object.keys(darkTheme);//主题色键值
var styleValue2 = Object.values(darkTheme);//主题色色值
var scaleCenter = "CC", scaleType = "WH";//等比缩放默认从中心且按原宽高缩放
var searchType = "Text", searchPick = 1, searchArea = "Page", searchInfo = '', searchReInfo = '',searchKey = 'isV',searchSameType = [];
var sidePageMove;//侧边栏悬停底部自动滚动的计时器
var tableData;//行列数据
var userTableData;//填充表格或数据流用的数据
var tool1 = 0, tool2 = 0, tool3 = 0, tool4 = 0, tool5 = 0, tool6 = 0;//记录侧边栏工具类型标题点击次数，实现checkbox效果
var editorNum = 1, editorPick = 1,editorCopy = false;
var mixType = [],mixAdd = 1,mixClone = 1;
var docInfo;
var exportNum = 0;//导出序号

class userexcel extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="var(--mainColor)" fill-rule="evenodd" clip-rule="evenodd" d="M26.0549 10H9C6.79086 10 5 11.7909 5 14V32C5 34.2091 6.79086 36 9 36H31C33.2091 36 35 34.2091 35 32V20C32.8567 20 30.8884 19.2508 29.3427 18H17V12H26.0549C26.0186 11.6717 26 11.338 26 11C26 10.662 26.0186 10.3283 26.0549 10ZM9 12H15V18H7V14C7 12.8954 7.89543 12 9 12ZM7 20H15L15 26H7V20ZM7 28H15V34H9C7.89543 34 7 33.1046 7 32V28ZM17 28V34H31C32.1046 34 33 33.1046 33 32V28H17ZM17 20L17 26H33V20H17Z" />
        <path fill="var(--mainColor)" fill-rule="evenodd" clip-rule="evenodd" d="M35 18C38.866 18 42 14.866 42 11C42 7.13401 38.866 4 35 4C31.134 4 28 7.13401 28 11C28 14.866 31.134 18 35 18ZM35 6C35.5523 6 36 6.44772 36 7V10H39C39.5523 10 40 10.4477 40 11C40 11.5523 39.5523 12 39 12H36V15C36 15.5523 35.5523 16 35 16C34.4477 16 34 15.5523 34 15V12H31C30.4477 12 30 11.5523 30 11C30 10.4477 30.4477 10 31 10L34 10V7C34 6.44772 34.4477 6 35 6Z" "/>
      </svg>
    `;
  }
}
class userimg extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="var(--mainColor)" d="M35,18C38.866,18,42,14.866,42,11C42,7.13401,38.866,4,35,4C31.134,4,28,7.13401,28,11C28,14.866,31.134,18,35,18ZM35,6C35.5523,6,36,6.44772,36,7L36,10L39,10C39.5523,10,40,10.447700000000001,40,11C40,11.552299999999999,39.5523,12,39,12L36,12L36,15C36,15.5523,35.5523,16,35,16C34.4477,16,34,15.5523,34,15L34,12L31,12C30.4477,12,30,11.552299999999999,30,11C30,10.447700000000001,30.4477,10,31,10L34,10L34,7C34,6.44772,34.4477,6,35,6Z" fill-rule="evenodd" fill-opacity="1"/>
        <path fill="var(--mainColor)" d="M5,14L5,32C5,34.2091,6.79086,36,9,36L31,36C33.2091,36,35,34.2091,35,32L35,20L33,20L33,29.5L31.4848,29.5Q30.9924,29.5,30.6922,29.1097L27.5916,25.0789Q26.7999,24.0497,25.5076,23.9225Q24.2154,23.795299999999997,23.2382,24.6503L21.7345,25.966L18.7349,21.0576Q17.8134,19.54967,16.047800000000002,19.624670000000002Q14.28213,19.69966,13.4918,21.2803L9.15836,29.9472Q8.881969999999999,30.5,8.26393,30.5L7,30.5L7,14Q7,13.17159,7.585789999999999,12.585799999999999Q8.17158,12,9,12L26.0549,12L26.0549,10L9,10C6.79086,10,5,11.7909,5,14ZM7.0359,32.5Q7.26795,34,9,34L31,34Q33,34,33,32L33,31.5L31.4848,31.5Q30.0076,31.5,29.1069,30.3291L26.0063,26.2983Q25.7424,25.9553,25.3117,25.9129Q24.8809,25.8705,24.5552,26.1555L21.2655,29.034L17.028399999999998,22.1005Q16.7212,21.5979,16.1326,21.6229Q15.5441,21.6479,15.2807,22.174799999999998L10.94721,30.8416Q10.11804,32.5,8.26393,32.5L7.0359,32.5ZM27,17.5C27,19.433,25.433,21,23.5,21C21.567,21,20,19.433,20,17.5C20,15.567,21.567,14,23.5,14C25.433,14,27,15.567,27,17.5Z" fill-rule="evenodd" fill-opacity="1"/>
      </svg>
      `;
  }
}
class userfiles extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="var(--mainColor)" d="M35,18C38.866,18,42,14.866,42,11C42,7.13401,38.866,4,35,4C31.134,4,28,7.13401,28,11C28,14.866,31.134,18,35,18ZM35,6C35.5523,6,36,6.44772,36,7L36,10L39,10C39.5523,10,40,10.447700000000001,40,11C40,11.552299999999999,39.5523,12,39,12L36,12L36,15C36,15.5523,35.5523,16,35,16C34.4477,16,34,15.5523,34,15L34,12L31,12C30.4477,12,30,11.552299999999999,30,11C30,10.447700000000001,30.4477,10,31,10L34,10L34,7C34,6.44772,34.4477,6,35,6Z" fill-rule="evenodd" fill-opacity="1"/>
        <path fill="var(--mainColor)" d="M5,14L5,32C5,34.2091,6.79086,36,9,36L31,36C33.2091,36,35,34.2091,35,32L35,20L33,20L33,32Q33,34,31,34L9,34Q7,34,7,32L7,14Q7,13.17159,7.585789999999999,12.585799999999999Q8.17158,12,9,12L24.0549,12L26.0549,12L26.0549,10L9,10C6.79086,10,5,11.7909,5,14Z" fill-opacity="1"/>
        <path fill="var(--mainColor)" d="M8,19.47754L8,21.15603L9.64144,21.15603L9.64144,19.47754L8,19.47754ZM10.75148,13L10.75148,14.17021L12.2394,14.17021L12.2394,13L10.75148,13ZM9.70048,21.735219999999998L9.70048,23L10.3854,23C10.97585,23,11.42458,22.846330000000002,11.755230000000001,22.51537C12.074069999999999,22.19622,12.2394,21.735219999999998,12.2394,21.13239L12.2394,15.00946L10.7869,15.00946L10.7869,21.03782C10.7869,21.28605,10.73967,21.46336,10.645199999999999,21.56974C10.55072,21.687939999999998,10.39721,21.735219999999998,10.19646,21.735219999999998L9.70048,21.735219999999998ZM13.939879999999999,20.71868C14.365,21.06147,14.920020000000001,21.226950000000002,15.62856,21.226950000000002C16.360709999999997,21.226950000000002,16.95115,21.06147,17.4117,20.71868C17.86044,20.37589,18.096600000000002,19.89125,18.096600000000002,19.25295C18.096600000000002,18.74468,17.9431,18.34279,17.63607,18.04728C17.32904,17.76359,16.86849,17.574469999999998,16.25443,17.47991L15.53408,17.37352C15.25067,17.33806,15.04992,17.26714,14.93183,17.16076C14.81374,17.06619,14.7547,16.92435,14.7547,16.735219999999998C14.7547,16.5461,14.82555,16.38061,14.99088,16.26241C15.14439,16.14421,15.36876,16.08511,15.67579,16.08511C15.97102,16.08511,16.20719,16.14421,16.37252,16.26241C16.53784,16.38061,16.63231,16.5461,16.63231,16.75886L16.63231,16.79433L17.99034,16.79433L17.99034,16.723399999999998C17.99034,16.39244,17.884059999999998,16.08511,17.69512,15.81324C17.506169999999997,15.54137,17.234569999999998,15.3286,16.8803,15.17494C16.52603,15.02128,16.12453,14.93853,15.67579,14.93853C15.00268,14.93853,14.447669999999999,15.11584,14.02254,15.45863C13.59742,15.80142,13.38486,16.26241,13.38486,16.84161C13.38486,17.3617,13.52657,17.75177,13.82179,18.02364C14.10521,18.30733,14.565750000000001,18.49645,15.17982,18.59102L15.82931,18.697400000000002C16.13634,18.74468,16.360709999999997,18.82742,16.50242,18.92199C16.63231,19.02837,16.70317,19.17021,16.70317,19.35934C16.70317,19.59574,16.6087,19.76123,16.431559999999998,19.87943C16.242620000000002,19.99764,15.99463,20.04492,15.67579,20.04492C15.36876,20.04492,15.13258,19.98582,14.94364,19.85579C14.7547,19.72577,14.67203,19.54846,14.67203,19.31206L14.67203,19.288420000000002L13.3022,19.288420000000002L13.3022,19.3357C13.3022,19.91489,13.514759999999999,20.37589,13.939879999999999,20.71868ZM19.6672,20.60047C20.1159,21.026,20.7182,21.226950000000002,21.4976,21.226950000000002C22.2534,21.226950000000002,22.855600000000003,21.026,23.304299999999998,20.60047C23.741300000000003,20.18676,23.965600000000002,19.53664,23.965600000000002,18.65012L23.965600000000002,17.50355C23.965600000000002,16.62884,23.741300000000003,15.99054,23.304299999999998,15.565010000000001C22.855600000000003,15.151299999999999,22.2534,14.93853,21.4976,14.93853C20.7182,14.93853,20.1159,15.151299999999999,19.6672,15.565010000000001C19.2185,15.99054,19.0059,16.62884,19.0059,17.50355L19.0059,18.65012C19.0059,19.53664,19.2185,20.18676,19.6672,20.60047ZM22.513199999999998,18.6383C22.513199999999998,19.501179999999998,22.1707,19.92671,21.4976,19.92671C20.8009,19.92671,20.458399999999997,19.501179999999998,20.458399999999997,18.6383L20.458399999999997,17.52719C20.458399999999997,16.67612,20.8009,16.23877,21.4976,16.23877C22.1707,16.23877,22.513199999999998,16.67612,22.513199999999998,17.52719L22.513199999999998,18.6383ZM25,15.00946L25,21.156010000000002L26.4642,21.156010000000002L26.4642,17.32623C26.4642,16.98344,26.5469,16.71159,26.7358,16.52246C26.9248,16.33334,27.161,16.23877,27.4445,16.23877C27.7279,16.23877,27.964,16.33334,28.1411,16.52246C28.3064,16.71159,28.4009,16.98344,28.4009,17.32623L28.4009,21.156010000000002L29.8652,21.156010000000002L29.8652,17.14893C29.8652,16.46335,29.6882,15.93143,29.3457,15.52954C28.9914,15.13947,28.5072,14.93854,27.8813,14.93854C27.5979,14.93854,27.3382,14.99762,27.0784,15.104C26.8186,15.21039,26.606,15.36406,26.4288,15.565L26.4288,15.00946L25,15.00946Z"  fill-opacity="1"/>
        <path fill="var(--mainColor)" d="M8,30.14783L8,32L9.70403,32L9.70403,30.14783L8,30.14783ZM14.105080000000001,32L15.68652,32L13.749559999999999,28.45217L15.57618,25.21739L13.98249,25.21739L13.03853,27.14783L11.98424,25.21739L10.39054,25.21739L12.19264,28.50435L10.28021,32L11.87391,32L12.9282,29.86087L14.105080000000001,32ZM16.458849999999998,25.21739L16.458849999999998,32L17.97899,32L17.97899,27.77391C17.97899,27.39565,18.064799999999998,27.09565,18.2609,26.886960000000002C18.4448,26.67826,18.689999999999998,26.57391,18.996499999999997,26.57391C19.2907,26.57391,19.523600000000002,26.67826,19.7075,26.886960000000002C19.8914,27.09565,19.9895,27.38261,19.9895,27.77391L19.9895,32L21.5096,32L21.5096,27.73478C21.5096,27.39565,21.595399999999998,27.1087,21.7793,26.9C21.9632,26.6913,22.208399999999997,26.57391,22.5271,26.57391C22.8214,26.57391,23.054299999999998,26.67826,23.2382,26.886960000000002C23.4221,27.09565,23.5201,27.38261,23.5201,27.77391L23.5201,32L25.0403,32L25.0403,27.57826C25.0403,26.82174,24.8441,26.23478,24.4641,25.7913C24.0841,25.36087,23.5569,25.13913,22.8827,25.13913C22.171599999999998,25.13913,21.5709,25.42609,21.0806,25.98696C20.700499999999998,25.42609,20.161099999999998,25.13913,19.4501,25.13913C19.155900000000003,25.13913,18.886200000000002,25.204349999999998,18.616500000000002,25.32174C18.3468,25.45217,18.1261,25.62174,17.94221,25.83043L17.94221,25.21739L16.458849999999998,25.21739ZM26.8669,31.465220000000002C27.2102,31.83043,27.6883,32,28.3012,32L29,32L29,30.60435L28.4851,30.60435C28.2645,30.60435,28.1173,30.55217,28.0193,30.43478C27.9212,30.31739,27.8844,30.12174,27.8844,29.834780000000002L27.8844,23L26.3643,23L26.3643,29.93913C26.3643,30.60435,26.5236,31.113039999999998,26.8669,31.465220000000002Z" fill-opacity="1"/>
      </svg>
    `;
  }
}
class tagsclose extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 10 10">
            <g>
                <rect x="0" y="0" width="10" height="10" rx="5" fill="#000000" fill-opacity="0.5"/>
                <g transform="matrix(0.7071067690849304,0.7071067690849304,-0.7071067690849304,0.7071067690849304,2.575643857138118,-3.075268943922481)">
                    <g>
                        <rect x="7.020312309265137" y="1.5714426040649414" width="0.8081187009811401" height="4.848711967468262" rx="0.40405935049057007" fill="#D8D8D8" fill-opacity="1"/>
                    </g>
                    <g transform="matrix(0,1,-1,0,13.4404296875,-6.256994247436523)">
                        <rect x="9.848711967468262" y="3.5917177200317383" width="0.8081187009811401" height="4.848711967468262" rx="0.40405935049057007" fill="#D8D8D8" fill-opacity="1"/>
                    </g>
                </g>
            </g>
        </svg>
    `;
  }
}
class tagssearch extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 24 24">
            <defs>
                <clipPath id="master_svg0_24_01708"><rect x="0" y="0" width="24" height="24" rx="0"/></clipPath>
            </defs>
            <g clip-path="url(#master_svg0_24_01708)">
                <g>
                    <ellipse cx="12" cy="11" rx="8.5" ry="8.5" fill-opacity="0" stroke-opacity="1" stroke="var(--mainColor)" fill="none" stroke-width="3"/>
                </g>
                <g>
                    <path d="M19.06097,16.93965L19.06066,16.93934Q18.956194,16.83487,18.833355,16.7528Q18.710516,16.67072,18.574025,16.61418Q18.437534,16.55764,18.292635,16.52882Q18.147737,16.5,18,16.5Q17.852263,16.5,17.707364,16.52882Q17.562466,16.55764,17.425975,16.61418Q17.289484,16.67072,17.166645,16.7528Q17.043806,16.83487,16.93934,16.93934Q16.83487,17.043806,16.7528,17.166645Q16.67072,17.289484,16.61418,17.425975Q16.55764,17.562466,16.52882,17.707364Q16.5,17.852263,16.5,18Q16.5,18.147737,16.52882,18.292635Q16.55764,18.437534,16.61418,18.574025Q16.67072,18.710516,16.7528,18.833355Q16.83487,18.956194,16.93934,19.06066L16.93965,19.06097L20.43934,22.56066Q20.54381,22.66513,20.66664,22.7472Q20.78948,22.82928,20.92597,22.88582Q21.06247,22.94236,21.20736,22.97118Q21.35226,23,21.5,23Q21.64774,23,21.79264,22.97118Q21.93753,22.94236,22.07403,22.88582Q22.21052,22.82928,22.33336,22.7472Q22.45619,22.66513,22.56066,22.56066Q22.66513,22.45619,22.7472,22.33336Q22.82928,22.21052,22.88582,22.07403Q22.94236,21.93753,22.97118,21.79263Q23,21.64774,23,21.5Q23,21.35226,22.97118,21.20736Q22.94236,21.06247,22.88582,20.92597Q22.82928,20.78948,22.7472,20.66664Q22.66513,20.54381,22.56066,20.43934L19.06097,16.93965Z" fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1"/>
                </g>
            </g>
        </svg>
    `;
  }
}
class tagssearchclose extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 10 10">
            <g>
                <rect x="1" y="1" width="8" height="8" rx="4" fill="var(--boxBod)" fill-opacity="0.5"/>
                <g transform="matrix(0.7071067690849304,0.7071067690849304,-0.7071067690849304,0.7071067690849304,2.575643857138118,-3.075268943922481)">
                    <g>
                        <rect x="7.020312309265137" y="1.5714426040649414" width="0.8081187009811401" height="4.848711967468262" rx="0.40405935049057007" fill="var(--boxBak)" fill-opacity="1"/>
                    </g>
                    <g transform="matrix(0,1,-1,0,13.4404296875,-6.256994247436523)">
                        <rect x="9.848711967468262" y="3.5917177200317383" width="0.8081187009811401" height="4.848711967468262" rx="0.40405935049057007" fill="var(--boxBak)" fill-opacity="1"/>
                    </g>
                </g>
            </g>
        </svg>
    `;
  }
}
class btnadd extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 17 17">
        <g>
            <g>
                <rect x="7.5" y="3.5" width="2" height="10" rx="0" fill="var(--mainColor)" fill-opacity="1"/>
            </g>
            <g>
                <rect x="3.5" y="7.5" width="10" height="2" rx="0" fill="var(--mainColor)" fill-opacity="1"/>
            </g>
            <g>
                <ellipse cx="8.5" cy="8.5" rx="8" ry="8" fill-opacity="0" stroke-opacity="1" stroke="var(--mainColor)" fill="none" stroke-width="1"/>
            </g>
        </g>
    </svg>
    `;
  }
}  
class btnclose extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 17 17">
        <g>
            <g>
                <rect x="3.5" y="7.5" width="10" height="2" rx="0" fill="var(--mainColor)" fill-opacity="1"/>
            </g>
            <g>
                <ellipse cx="8.5" cy="8.5" rx="8" ry="8" fill-opacity="0" stroke-opacity="1" stroke="var(--mainColor)" fill="none" stroke-width="1"/>
            </g>
        </g>
    </svg>
    `;
  }
} 
class btncopy extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 11 11">
        <g>
            <g>
                <path d="M5,2L4,2L4,4L2,4L2,5L4,5L4,7L5,7L5,5L7,5L7,4L5,4L5,2Z" fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1"/>
            </g>
            <g>
                <path d="M0,2.5L0,6.5Q0,7.53553,0.732233,8.26777Q1.29574,8.83127,2.03888,8.96112Q2.16872,9.70426,2.73223,10.2678Q3.46447,11,4.5,11L8.5,11Q9.53553,11,10.2678,10.2678Q11,9.53553,11,8.5L11,4.5Q11,3.46447,10.2678,2.73223Q9.70426,2.16872,8.96112,2.03888Q8.83127,1.29574,8.26777,0.732233Q7.53553,0,6.5,0L2.5,0Q1.46447,0,0.732233,0.732233Q0,1.46447,0,2.5ZM9,3.08099L9,6.5Q9,7.53553,8.26777,8.26777Q7.53553,9,6.5,9L3.08099,9Q3.18864,9.30996,3.43934,9.56066Q3.87868,10,4.5,10L8.5,10Q9.12132,10,9.56066,9.56066Q10,9.12132,10,8.5L10,4.5Q10,3.87868,9.56066,3.43934Q9.30996,3.18864,9,3.08099ZM1.43934,7.56066Q1,7.12132,1,6.5L1,2.5Q1,1.87868,1.43934,1.43934Q1.87868,1,2.5,1L6.5,1Q7.12132,1,7.56066,1.43934Q8,1.87868,8,2.5L8,6.5Q8,7.12132,7.56066,7.56066Q7.12132,8,6.5,8L2.5,8Q1.87868,8,1.43934,7.56066Z" fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1"/>
            </g>
        </g>
    </svg>
    `;
  }
}

customElements.define('user-excel', userexcel);
customElements.define('user-img', userimg);
customElements.define('user-files', userfiles);
customElements.define('tags-close', tagsclose);
customElements.define('tags-search', tagssearch);
customElements.define('tags-search-close', tagssearchclose);
customElements.define('btn-add', btnadd);
customElements.define('btn-close', btnclose);
customElements.define('btn-copy', btncopy);

window.onload = function () {
  viewPage(1)
  /*/打开侧边栏
  document.getElementById("btn-side-0").checked = true;
  document.getElementById('btn-side-text-0').style.pointerEvents = 'none';
  sidePage()
  /**/
}


window.onmessage = (message) => {
  
  if(message.data && message.data.pluginMessage && message.data.pluginMessage.pluginMessage){
    //console.log(message.data)
    //console.log(message.data.pluginMessage.pluginMessage)
    /*figma*/
    var pluginDatas = message.data.pluginMessage.pluginMessage;
    /*mastergo*/
    //var pluginDatas = message.data;

    var info = pluginDatas[0];
    var type = pluginDatas[1];

    if (info == 'light') {
      btnSetTheme.checked = false;
      setTheme(btnSetTheme)
    }

    if (info == 'sidePage') {
      if (document.getElementById("page-main-1").style.display == 'flex' && document.getElementById("zzz").style.display !== 'block'  ) {
        document.getElementById("btn-side-0").checked = true
        sidePage()
      }
    }

    if (info == 'noSidePage') {
      //document.getElementById("btn-side-0").checked = false
      //sidePage()
    }

    if (type == 'imgURLtoWH') {
      imgURLtoWH(info)
      //console.log(imgURLtoWH(info))
        //message([imgURLtoWH(info), 'imgWH'])
    }

    if (type == 'noiseWH') {
      var noiseURL = noise()
      setTimeout(() => {
        message([noiseURL, 'noiseURL'])
      }, 100)
      //console.log(noiseURL)
    }

    if (type == 'skewData') {
      //console.log(info)
      document.getElementById('slider-skewW').value = info.x;
      document.getElementById('slider-skewH').value = info.y;
      document.getElementById('input-num-skewW').value = info.x;
      document.getElementById('input-num-skewH').value = info.y;
      document.getElementById('slider-scaleW').value = info.w;
      document.getElementById('slider-scaleH').value = info.h;
      document.getElementById('input-num-scaleW').value = info.w;
      document.getElementById('input-num-scaleH').value = info.h;
    }

    if (type == 'frameExport') {
      if (document.getElementById("select-export").value == "toIMG") {
        
        //console.log(imgExportInfo)
        addExport(imgExportInfo,info[0],info[1]);
        imgExportInfo.push(...info[0]);
        if (info == '') {
          exportInfo.innerHTML = "[-- 未选中容器 --]"
        } else {
          exportInfo.innerHTML = '<span style="color:#ff2222; font-weight:700;">[-- 加载中，请稍后 --]</span>'
        }
      }
    }

    if (type == 'imgExport') {
      //console.log(info)
      if (document.getElementById("select-export").value == "toIMG") {
        //imgExportData.length = 0
        imgDataSet(imgExportData,info[0],info[1])
        //console.log(imgExportData)
        exportInfo.innerHTML = '[-- 加载完成 --]'


      }

    }

    if (type == 'createrMap') {
      inView.w = info.w
      inView.h = info.h
      inView.x = info.x
      inView.y = info.y
      inView.view = info.view
      inView.bg = info.bg
      createrMap(info, 6)
      setTimeout(() => {
        message(["", "hasMap"])
      }, 100)
    }

    if (type == 'hasView') {
      message(['', 'hasView'])
      console.log('getHasView')
    }

    if (type == 'reMap') {
      setTimeout(() => {
        message(['', 'reMap'])
        console.log('reMap')
      }, 200)

    }

    if (type == 'toTool') {
      //console.log(info)
      setTimeout(() => {
        if (info == 'PEN' || info == 'BOOLEAN_OPERATION') {
          document.getElementById("矢量工具").scrollIntoView({ behavior: "smooth" })
        }
        if (info == 'table') {
          document.getElementById("表格工具").scrollIntoView({ behavior: "smooth" })
        }
        if (info == 'image' || info == 'skew') {
          document.getElementById("topView").scrollIntoView({ behavior: "smooth" })
        }
        if (info == 'text') {
          //document.getElementById("容器工具").scrollIntoView({behavior:"smooth"})
        }
      }, 500)


    }

    if (type == 'wmbEffects') {
      var rehex = document.getElementById("input-hex-wmb");
      var recolor = document.getElementById("input-color-wmb");
      var renum = document.getElementById("wmbNum");
      var resize = document.getElementById("input-size-wmb");
      if (info.some((arr, index) => arr[0] !== info[0][0])) {
        //存在多颜色
        rehex.value = "多值"
        //recolor.value = "#000000"
      } else {
        rehex.value = info[0][0]
        recolor.value = info[0][0]
        colorWmb = info[0][0]
      }
      if (info.some((arr, index) => arr[1] !== info[0][1])) {
        //存在多数量
        renum.value = "?"
      } else {
        renum.value = info[0][1]
        numWmb = info[0][1]
      }
      if (info.some((arr, index) => arr[2] !== info[0][2])) {
        //存在多大小
        resize.value = "多值"
      } else {
        resize.value = info[0][2]
        sizeWmb = info[0][2]
      }
    }

    if (type == 'getFind') {
      document.getElementById('input-search-all').value = info;
      document.getElementById('input-search-pick').value = 1;
    }
  
    if (type == 'hasStyle') {
      if(info){
        document.getElementById('noStyle').checked = true;
      } else {
        document.getElementById('noStyle').checked = false;
      }
      
    }

    if (type == 'hasStyleTable') {
      if(info == true){
        document.getElementById('noStyleTable').checked = true;
      } else if ( info == false) {
        document.getElementById('noStyleTable').checked = false;
      } else {
        message([info,'moveStyleTable'])
        //console.log(info)
      }
      
    }
  
    if (type == 'toTab'){
      viewPage(info)
    }

    if (type == 'searchInfo') {
      if(info){
        if(info.length > 10){
          infos = info.substring(0, 10) + '...';
          document.getElementById('search-same-node').innerHTML = '已选图层：<span style="color: var(--boxBod);">' + infos + '</span>'
        } else {
          document.getElementById('search-same-node').innerHTML = '已选图层：<span style="color: var(--boxBod);">' + info + '</span>'
        }
        
      } else {
        document.getElementById('search-same-node').innerHTML = `<span style="color: var(--boxBod);">*请选中一个对象</span>`
      }
      if(info == 'noOnly'){
        document.getElementById('search-same-node').innerHTML = `<span style="color: var(--liColor1);">*选中多个对象无效</span>`
      }
      
    }

    if ( type == 'getNodeStyle') {
      
      if(info.length > 0){
        document.getElementById('reStyleSet').checked = false;
        document.getElementById('getstyle-node-1').innerHTML = '';
        document.getElementById('getstyle-node-2').innerHTML = '';
        //console.log(info)
        var btn1 = '',btn2 = '',btn3 = '',btn4 = '';
        for ( var i = 0; i < info.length; i++){
          if(info[i][2] == 'NEW'){
            btn1 = `<div class="btn-style-set" style="--color-btn1:#00BA7944;--color-btn2:#00BA7988;" onclick="message(['`+ info[i][1] +`','newStyle'])">新建</div>`
          } else {
            btn1 = '';
          }
          if( info[i][2] == 'DIFF'){
            btn2 = `<div class="btn-style-set" style="--color-btn1:#77777744;--color-btn2:#77777788; opacity:0.5" onclick="message(['`+ info[i][1] +`','setDiffStyle'])">覆盖</div>`
            btn3 = `<div class="btn-style-set" style="--color-btn1:#FF840044;--color-btn2:#FF840088;" onclick="message(['`+ info[i][1] +`','linkStyle'])">重链</div>`
          } else {
            btn2 = '';
            btn3 = '';
          }
          
          if( info[i][2] == 'OLD'){
            document.getElementById('getstyle-node-2').innerHTML += '<div class="tag-style-info" style=" width:100%; height:30px; display:flex; align-items: center; justify-content: space-between;">' + info[i][0] + '<div style="display:flex;gap:4px"> ' + btn4 + '</div> </div>';
          } else {
            document.getElementById('getstyle-node-1').innerHTML += `<div class="tag-style-info" style=" width:100%; height:30px; display:flex; align-items: center; justify-content: space-between;" ondblclick="message(['`+ info[i][1] +`','diffStylePick'])">` + info[i][0] + '<div style="display:flex;gap:4px"> ' + btn1 + btn2 + btn3 + '</div> </div>';
          }
          
          if ( i == info.length - 1){
            if(document.getElementById('getstyle-node-2').innerHTML == ''){
              document.getElementById('getstyle-node-2').innerHTML = '----'
            }
            if(document.getElementById('getstyle-node-1').innerHTML == ''){
              document.getElementById('getstyle-node-1').innerHTML = '----'
            }
          }
        }
      } else {
        document.getElementById('reStyleSet').checked = true;
      }
    }

    if ( type == 'hasLinkStyle') {
      message(['reSend','reSend'])
    }

    if ( type == 'hasNewStyle') {
      message([info,'reNewStyle'])
    }

    if ( type == 'hasSetLinkStyle') {
        message([info,'linkStyle'])
    }

    if( type == 'getStyleGroup') {
      if(info.length > 1){
        var group = document.getElementById('stylegroup');
        group.innerHTML = '';
        var star = `<select id="select-stylegroup" class="input-btn-skill" name="样式组切换" style=" width: 18ch; color: var(--mainColor); font-size: 12;"onchange="message([this.value,'reStyleGroup']);">`
        var option = ''
        for (var i = info.length - 1; i >= 0; i--){
          option += '<option value="' + info[i] + '">' + info[i] + '</option>'
        }
        var end = '</select>'
        group.innerHTML += star + option + end
      } else {
        var group = document.getElementById('stylegroup');
        group.innerHTML = '';
      }
    }

    if( type == 'styleLinkAndNew' ) {
      if(info){

        document.getElementById('styleLinkAndNew').style.display = "flex";
      } else {

        document.getElementById('styleLinkAndNew').style.display = "none";
      }
      
    }

    if ( type == 'tolink') {
      document.getElementById('tab-' + info).click()
    }

    if ( type == 'getFrame'){
      //console.log(111,dataText.value)
      dataText.value = 'name\tw\th\n'
      info.forEach( item => {
        dataText.value += item
      })
      
      dataText.focus()
      inputDataText()
      //console.log(222,dataText.innerHTML)
    }
    
    if ( type == 'hasreComponent') {
      message([info,'reComponentText'])
    }

    if ( type == 'docInfo'){
      if (info.length == 4 && info[1] !== info[2]){
        docInfo = info[1] + '-' + info[2]  
      } else {
        docInfo = info[1]
      }
      if (info.length == 4 && info[3]*1 > 0 ){
        exportInfo.innerHTML = "[-- 已选中 " + '<span style="color:#2AE02D; font-weight: 700;">' + info[3] + " </span>个对象 --]"
      } else if(info.length == 3 && info[2]*1 > 0){
        exportInfo.innerHTML = "[-- 已选中 " + '<span style="color:#2AE02D; font-weight: 700;">' + info[3] + " </span>个对象 --]"
      } else {
        exportInfo.innerHTML = "[-- 未选中容器 --]"
      }
    }
  }
}





//封装postmessage
function message(data){
  /*figma*/
  parent.postMessage({pluginMessage:data},"*")
  /*mastergo*/
  //parent.postMessage(data,"*")
}

//设置主题
function setTheme(e){
  if(!e.checked){
      console.log('浅色主题')
      for (var i = 0; i < styleKey.length; i++) {
        root.style.setProperty('--' + styleKey[i], styleValue[i])
      }
      document.body.style.filter = 'contrast(130%)';
    } else {
      console.log('深色主题')
      for (var i = 0; i < styleKey2.length; i++) {
        root.style.setProperty('--' + styleKey2[i], styleValue2[i])
      }
      document.body.style.filter = '';
    }
}

//粘贴上传
upFileByInput()
function upFileByInput() {
  dataText.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
      dataTextTips.style.display = "none";
      event.preventDefault(); // 阻止默认Tab行为
      const start = this.selectionStart;
      const end = this.selectionEnd;
      const selectedText = this.value.substring(start, end);
      const before = this.value.substring(0, start);
      const after = this.value.substring(end, this.value.length);
      this.value = before + '\t' + selectedText + after; // 用4个空格替换Tab
      this.selectionStart = this.selectionEnd = start + 4; // 设置光标位置
    }
  });

  dataText.addEventListener('input', function () {
    if (dataText.value == '') {
      fileName.innerHTML = '[-- 暂无数据 --]';
      anotherBtns2.style.display = "none";
      anotherBtns3.style.display = "none";
      dataTextTips.style.display = "block";
    } else if (dataText.value.includes('name\tw\th') == true) {
      inputDataText()
    } else if (dataText.value.substring(0, 4) == "<svg") {
      //console.log(dataText.value)
      //var importSvg = []
      processSVG(dataText.value)
      //importSvg.push({svg:dataText.value})
      //message([importSvg,'svgIm'])
      notag()
    } else {
      fileName.innerHTML = '[-- 正在输入 --]';
      //console.log('数据错误')
      anotherBtns2.style.display = "none";
      anotherBtns3.style.display = "flex";
      dataTextTips.style.display = "none";
      //console.log(dataText.value.substring(0, 3))
    }
  });
}

function inputDataText() {
  fileName.innerHTML = '[-- 正在输入 --]';
  anotherBtns2.style.display = "flex";
  anotherBtns3.style.display = "none";
  dataTextTips.style.display = "none";
}

function addDataText() {
  fileName.innerHTML = '';
  var newData = textToList(dataText.value.trim());//.replace(/\s*([\t\n])\s*/g,'$1')
  autoUp.style.display = "none";
  allFrame = newData;
  addtag(newData);
  anotherBtns4.style.display = "flex";
  anotherBtns.style.display = "flex";
  anotherBtns2.style.display = "none";
  badData()
}

//将粘贴的内容处理成新数组
function textToList(text) {
  var lines = text.split('\n');
  var headers = lines[0].split('\t');
  var data = lines.slice(1).map(line => line.split('\t').map(value => /^\d+\.?\d*$/.test(value) ? parseFloat(value) : value));

  return data.map(row => headers.reduce((acc, header, index) => {
    acc[header] = row[index];
    return acc;
  }, {}));
}

//拖拽上传列表
upFileByDrop()
function upFileByDrop() {
  upfileArea.addEventListener('dragover', function (e) {
    notag()
    fileName.innerHTML = '[-- 松手即可上传 --]';
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    tagsContainer1.style.boxShadow = '0px 0px 4px  rgb(128,128,128)';
    autoUp.style.display = "none";
  });

  upfileArea.addEventListener('dragleave', function (e) {
    createrType = "frame"
    fileName.innerHTML = '[-- 暂无数据 --]';
    if (autoUp.style.display == "none") {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      tagsContainer1.style.boxShadow = '';
      autoUp.style.display = "block";
    }
  });

  upfileArea.addEventListener('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    tagsContainer1.style.boxShadow = '';
    imgsName = []
    imgsNameNew = []
    importImg = []
    importNum = 0;

    var files = Array.from(e.dataTransfer.files).sort((a, b) => b.size - a.size);
    var imgType = ["png", "jpg", "jpeg", "webp","jfif"]
    var excelType = ["xlsx", "csv"]
    importNum = files.length;
    message([importNum, "importNum"])
    for (var i = 0; i < files.length; i++) {
      var names = files[i].name.split(".")
      if (imgType.some(type => type.includes(names[names.length - 1].toLowerCase()))) {
        if (e.dataTransfer.files.length > 1) {
          fileName.innerHTML = files[0].name.substring(0, 20) + '...等<span style="color:var(--liColor1)">' + e.dataTransfer.files.length + '</span>个文件';
        } else {
          fileName.innerHTML = files[0].name;
        }
        imgsName.push({ name: names[names.length - 2] })
        imgsNameNew.push({ name: names[names.length - 2] })
        cutImg(files[i], names[names.length - 2])
        if (i == files.length - 1) {
          message([importImg, "createrImage"])
        }
        notag()


      } else if (excelType.some(type => type.includes(names[names.length - 1].toLowerCase()))) {
        fileName.innerHTML = files[0].name;
        var reader = new FileReader();
        reader.readAsArrayBuffer(files[0]);
        reader.onload = function (e) {
          var data = new Uint8Array(e.target.result);
          //console.log(data)
          var workbook = XLSX.read(data, { type: 'array' });

          // 假设我们只读取第一个工作表
          var wsname = workbook.SheetNames[0];
          var ws = workbook.Sheets[wsname];

          // 将工作表转换为JSON
          var userData = XLSX.utils.sheet_to_json(ws);
          allFrame = userData;
          addtag(userData);
          anotherBtns.style.display = "flex";
          anotherBtns4.style.display = "flex";
          badData()
        };
      } else {
        fileName.innerHTML = '<span style=-"color:var(--liColor1)">含错误格式/来源';
        //console.log(files[i].name)
        addImg([files[i].name])
        anotherBtns.style.display = "none";
        anotherBtns2.style.display = "none";
        anotherBtns3.style.display = "flex";
    }
    }


    //console.log(imgsName)
  });

}

//选择文件上传列表
function upFileByExcel() {
  var file = inputExcel.files[0];
  var reader = new FileReader();

  fileName.innerHTML = file.name;
  autoUp.style.display = "none";

  reader.onload = function (e) {

    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: 'array' });

    // 只读取第一个工作表
    var wsname = workbook.SheetNames[0];
    var ws = workbook.Sheets[wsname];

    // 将工作表转换为JSON
    var userData = XLSX.utils.sheet_to_json(ws);
    allFrame = userData;

    addtag(userData)
    anotherBtns.style.display = "flex";

    badData()

  };

  reader.readAsArrayBuffer(file);
}

function upFileByImg() {
  //autoUp.style.display = "none";
  var reader = new FileReader();
  imgsName = []
  imgsNameNew = []
  importImg = []
  importNum = 0;

  var files = inputImg.files;
  var imgType = ["png", "jpg", "jpeg", "webp"]
  importNum = files.length;
  message([importNum, "importNum"])
  for (var i = 0; i < files.length; i++) {
    var names = files[i].name.split(".")
    if (imgType.some(type => type.includes(names[names.length - 1].toLowerCase()))) {
      
      if (files.length > 1) {
        fileName.innerHTML = files[0].name.substring(0, 20) + '...等<span style="color:var(--liColor1)">' + inputImg.files[0].length + '</span>个文件';
      } else {
        fileName.innerHTML = files[0].name.substring(0, 20);
      }
      imgsName.push({ name: names[names.length - 2] })
      imgsNameNew.push({ name: names[names.length - 2] })
      cutImg(files[i], names[names.length - 2])
      if (i == files.length - 1) {
        message([importImg, "createrImage"])
      }
      notag()
    } else {
      fileName.innerHTML = '<span style="color:var(--liColor1)">含错误格式/来源</span>';
      addImg([files[i].name])
      autoUp.style.display = "none";
      anotherBtns.style.display = "none";
      anotherBtns2.style.display = "none";
      anotherBtns3.style.display = "flex";
    }
    }
}

//判断错误数据
function badData() {
  if (tagsContainer1.innerHTML == "") {
    anotherBtns.style.display = "none";
    anotherBtns2.style.display = "none";
    anotherBtns3.style.display = "flex";
    anotherBtns4.style.display = "flex";
    allFrame = [];
    finalFrame = [];
  }
  for (var i = 0; i < allFrame.length; i++) {
    if (document.getElementById('tag-' + i).innerHTML.includes('undefined')) {
      fileName.innerHTML = '';
      anotherBtns.style.display = "none";
      anotherBtns2.style.display = "none";
      anotherBtns3.style.display = "flex";
      allFrame = [];
      finalFrame = [];
    }
  }
}

//生成创建标签
function addtag(userData) {

  tagsContainer1.innerHTML = "";
  for (var i = 0; i < userData.length; i++) {
    var e = i + 1;
    tagsContainer1.innerHTML += '<div class="tags" id="tag-' + i + '" style="display:block;"><div class="tags-picks">' + e + '. ' + userData[i].name + ' ' + userData[i].w + '×' + userData[i].h + '</div><tags-close onclick="this.parentNode.style.display = `none`"; class="tags-close"></tags-close></div>';
  }

}

//生成导出标签
function addExport(frameDataOld,frameDataNew,isNew) {
  //console.log(frameData)
  var index = 0;
  if(isNew == 'new'){
    exportNum = 0;
    tagsContainer2.innerHTML = "";
    frameData = frameDataNew;
  }else{
    frameData = frameDataNew;
    index = exportNum//避免序号错乱
  }

  for (var i = 0; i < frameData.length; i++) {
    var option = `<option value="` + frameData[i].type + `">` + frameData[i].type + `</option>`
    var options = "";
    typeAllow.forEach(item => {
      if( item != frameData[i].type){
        options += `<option value="` + item + `">` + item + `</option>`
      }
    })
    var filetype = `<select id="imgtype-` + (i + index) + `" class="input-btn-skill" 
    name="文件格式"
    style="width: 60px; min-width: 60px; height:22px; width: 14ch; color: var(--mainColor); font-size: 12;" 
    onchange="
    var name = document.getElementById('fileName-' +` + (i + index) + `);
    var text = name.value.split('.')[0] + '.' + this.value; 
    name.value = text;
    message([[this.value,'` + frameData[i].id + `'],'exportTypeSet']);
    imgExportData[`+ (i + index) +`].fileName = text ">
      `+ option + options +`
    </select>`
    var info = `<div class="info">
      <span style="opacity: 0.5;">` + ((i + index) + 1) + `.</span>
      <input type="text" class="input-nobg" id="fileName-` + (i + index) + `"value="` + frameData[i].name + `.` + frameData[i].type + `" 
      onKeyPress="if(window.event.keyCode==13) this.blur()" 
      onchange="imgExportData[`+ (i + index) +`].fileName = this.value; 
      var type = this.value.split('.')[1] ? this.value.split('.')[1].toLowerCase() : '';
      if (type && typeAllow.includes(type)){
      document.getElementById('imgtype-' +` + (i + index) + `).value = type;
      } else {
       this.value = this.value.split('.')[0] + '.' + document.getElementById('imgtype-' +` + (i + index) + `).value;
      }
      
      //console.log(imgExportData.map(item => item.fileName))"/>
    </div>`;
    var size = '<span id="imgsize-'+ (i + index) +'" style="color:var(--mainColor2);opacity: 0.8;"></span>';
    var setsize = `<div class="input-btn-skill" style="width: 60px; min-width: 60px; height:20px" >
      <input  id="exportSize-` + (i + index) + `" type="text" class="input-btn-skill" 
      style="border:0px; height: 18px;" value="` + frameData[i].s + `" 
      onKeyPress="if(window.event.keyCode==13) this.blur()" 
      onchange="message([[this.value,'` + frameData[i].id + `'],'exportSizeSet']);
      imgExportData[`+ (i + index) +`].s = this.value;
      console.log(imgExportData.map(item => item.s))"/>
      <div class="input-btn-skill" style="border:0px; width:30px; border-radius: 0px ;background-color: var(--boxGry); opacity: 0.8;  color:var(--mainColor)">k</div>
      </div>`
    var chk = `
    <input id="chk-export-` + (i + index) + `" type="checkbox" style="display: none;" />
    <label for="chk-export-` + (i + index) + `" class="chk-export-key set" style="width:100%; display: flex;align-items: center;gap: 4px;">
      `+ info +`
      <svg style="display:var(--export-edit);" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="14" height="14" viewBox="0 0 10 10">
          <g transform="matrix(0.8660253882408142,0.5,-0.5,0.8660253882408142,1.3172291698792833,-2.3877065935394057)">
            <path fill="var(--has)" d="M8.4255957421875,1.264617919671875L8.4255957421875,6.264129638671875Q8.4255957421875,6.313379638671875,8.4159857421875,6.361679638671875Q8.4063857421875,6.409969638671875,8.3875357421875,6.455469638671875Q8.3686957421875,6.500969638671875,8.3413357421875,6.541909638671875Q8.3139757421875,6.582859638671875,8.2791557421875,6.617679638671875Q8.244325742187499,6.652499638671875,8.2033857421875,6.679859638671875Q8.1624357421875,6.707219638671875,8.1169357421875,6.726069638671875Q8.0714457421875,6.744909638671875,8.0231457421875,6.754519638671875Q7.9748457421875,6.764129638671875,7.9255957421875,6.764129638671875Q7.8640457421875,6.764129638671875,7.8043357421875,6.749199638671875L4.9928757421875,6.046379638671875Q4.9117407421875,6.026099638671875,4.8416217421875,5.980519638671875Q4.7715037421875,5.934939638671875,4.7200357421875,5.869019638671875Q4.6685667421875,5.803099638671875,4.6413517421875,5.724019638671875Q4.6141357421875,5.644939638671875,4.6141357421875,5.561309638671875Q4.6141357421875,5.512059638671875,4.6237427421875,5.463759638671875Q4.6333507421875,5.415469638671875,4.6521957421875,5.369969638671875Q4.6710417421875,5.324469638671875,4.6984007421875,5.283519638671875Q4.7257607421875,5.2425796386718755,4.7605827421875,5.207759638671876Q4.7954047421875,5.172929638671874,4.8363507421875,5.145579638671875Q4.8772967421875,5.118219638671874,4.9227937421875,5.099369638671876Q4.9682907421875,5.080519638671875,5.0165906421875,5.0709196386718745Q5.0648900421875,5.061309638671875,5.1141357421875,5.061309638671875Q5.1756846421875,5.061309638671875,5.2353957421875,5.0762396386718756L5.2358847421875,5.076359638671875L7.4255957421875,5.623749638671875L7.4255957421875,1.264129638671875Q7.4255957421875,1.214883938671875,7.435205742187501,1.166584538671875Q7.4448157421875,1.118284638671875,7.4636557421875,1.0727876386718749Q7.4825057421875005,1.027290638671875,7.5098657421875,0.986344638671875Q7.5372257421875,0.945398638671875,7.5720457421875,0.910576638671875Q7.6068657421875,0.875754638671875,7.6478157421875,0.848394638671875Q7.6887557421874995,0.821035638671875,7.7342557421875,0.802189638671875Q7.7797557421875005,0.783344638671875,7.8280557421875,0.7737366386718749Q7.8763557421875,0.764129638671875,7.9255957421875,0.764129638671875Q7.9748457421875,0.764129638671875,8.0231457421875,0.7737366386718749Q8.0714457421875,0.783344638671875,8.1169357421875,0.802189638671875Q8.1624357421875,0.821035638671875,8.2033857421875,0.848394638671875Q8.244325742187499,0.875754638671875,8.2791557421875,0.910576638671875Q8.3139757421875,0.945398638671875,8.3413357421875,0.986344638671875Q8.3686957421875,1.027290638671875,8.3875357421875,1.0727876386718749Q8.4063857421875,1.118284638671875,8.4159857421875,1.166584538671875Q8.4255957421875,1.214883938671875,8.4255957421875,1.264129638671875L8.4255957421875,1.264617919671875Z" fill-rule="evenodd" fill-opacity="1"/>
          </g>
          <rect stroke="var(--boxBod)" x="0.5" y="0.5" width="9" height="9" rx="1.5" fill-opacity="0" stroke-opacity="1"  fill="none" stroke-width="1"/>
      </svg>
    </label>`
    var node = document.createElement('div');
    node.className = "tags-exports";
    node.id = "tags-exports-" + (i + index);
    node.innerHTML = '<div style="display:flex;gap:4px; align-items: center; width:100%;"><div class="btn-text" style="width:14px; height:14px; z-index:1;"onclick="this.parentNode.parentNode.remove();imgExportData['+ (i + index) +`].fileName = ''"><btn-close style=" opacity: 0.6;"></btn-close></div>` + chk + '</div><div class="set">' + size + '<div style="display:flex; gap:4px">'  + setsize + filetype + '</div></div>';
    tagsContainer2.appendChild(node);
    console.log("创建导出：第" + (i + index))
    exportNum++
  }

}
//删除导出标签
function noExport(e){
  if(e == 'all'){
    tagsContainer2.innerHTML = "";
    imgExportData = [];
    imgExportInfo = [];
    exportNum = 0;
    exportInfo.innerHTML = "[-- 未选中容器 --]"
  }
}

//生成图片标签
function addImg(imgsName) {
  tagsContainer1.innerHTML = "";
  var icon = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="20" height="16" viewBox="0 0 16 13.75732421875">
    <rect x="0" y="11.75732421875" width="16" height="2" rx="0" fill="#6E6E6E" fill-opacity="1"/>
    <g transform="matrix(0.7071067690849304,-0.7071067690849304,0.7071067690849304,0.7071067690849304,-2.3430887013528263,2.8286348765686853)">
      <rect x="2.242919921875" y="4.24267578125" width="6" height="9" rx="0" fill="#6E6E6E" fill-opacity="1"/>
      <path d="M5.242919921875,10.24267578125L6.727839921875,11.75775578125L8.242919921875,13.24267578125L6.727839921875,14.727595781249999L5.242919921875,16.24267578125L3.757999921875,14.727595781249999L2.242919921875001,13.24267578125L3.757999921875,11.75775578125L5.242919921875,10.24267578125Z" fill="#6E6E6E" fill-opacity="1"/>
    </g>
  </svg>
  `
  for (var i = 0; i < imgsName.length; i++) {
    //tagsContainer1.innerHTML += '<div class="tags-imports">' + icon + '<div style="width:4px"></div><input id="imgName-' + i + '" class="input-btn-skill" style="border: 0;text-align: left;" type="text" value="' + imgsName[i].name + '" onchange="imgsNameNew[' + i + '].name = this.value; if (!this.value){this.value = imgsName[' + i + '].name;console.log(`恢复原命名`,imgsName[' + i + ']) }"/></div>';
    tagsContainer1.innerHTML += '<div class="tags-imports"><div style="width:4px">' + (i + 1) + '.' + imgsName[i] + '</div>';

  }
}

//生成编辑标签
function addEdit(type,copynode) {
  if(copynode){
    copyEdit = copynode.parentNode
  } else {
    editTag.scrollTop = 0;
  }
  if ( editTag.children.length !== 0){
    document.getElementById('chk-editor-' + editorPick).checked = false
  }
  var chk = '<input id="chk-editor-' + editorNum + '" type="checkbox" checked=" true" style="display:none" onchange="editorChk(this,' + editorNum + ')"/>'
  var main = type;
  var close = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 17 17"><g><g><rect x="3.5" y="7.5" width="10" height="2" rx="0" fill="var(--mainColor)" fill-opacity="1"/></g><g><ellipse cx="8.5" cy="8.5" rx="8" ry="8" fill-opacity="0" stroke-opacity="1" stroke="var(--mainColor)" fill="none" stroke-width="1"/></g></g></svg>';
  var set = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 18 18"><g><path d="M3.59452,1.67756L6.80722,3.70617L7.6445,0L10.3555,0L11.1928,3.70617L14.4055,1.67756L16.3224,3.59452L14.2938,6.80722L18,7.64451L18,10.3555L14.2938,11.1928L16.3224,14.4055L14.4055,16.3224L11.1928,14.2938L10.3555,18L7.64451,18L6.80722,14.2938L3.59452,16.3224L1.67756,14.4055L3.70617,11.1928L0,10.3555L0,7.64451L3.70617,6.80722L1.67756,3.59452L3.59452,1.67756ZM13.5,9C13.5,11.4853,11.4853,13.5,9,13.5C6.51472,13.5,4.5,11.4853,4.5,9C4.5,6.51472,6.51472,4.5,9,4.5C11.4853,4.5,13.5,6.51472,13.5,9ZM9.00006,11.9999C10.6569,11.9999,12.0001,10.6568,12.0001,8.99994C12.0001,7.34308,10.6569,5.99994,9.00006,5.99994C7.34321,5.99994,6.00006,7.34308,6.00006,8.99994C6.00006,10.6568,7.34321,11.9999,9.00006,11.9999Z" fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1"/></g></svg>';
  var copy = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="100%" height="100%" viewBox="0 0 11 11"><g><g><path d="M5,2L4,2L4,4L2,4L2,5L4,5L4,7L5,7L5,5L7,5L7,4L5,4L5,2Z" fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1"/></g><g><path d="M0,2.5L0,6.5Q0,7.53553,0.732233,8.26777Q1.29574,8.83127,2.03888,8.96112Q2.16872,9.70426,2.73223,10.2678Q3.46447,11,4.5,11L8.5,11Q9.53553,11,10.2678,10.2678Q11,9.53553,11,8.5L11,4.5Q11,3.46447,10.2678,2.73223Q9.70426,2.16872,8.96112,2.03888Q8.83127,1.29574,8.26777,0.732233Q7.53553,0,6.5,0L2.5,0Q1.46447,0,0.732233,0.732233Q0,1.46447,0,2.5ZM9,3.08099L9,6.5Q9,7.53553,8.26777,8.26777Q7.53553,9,6.5,9L3.08099,9Q3.18864,9.30996,3.43934,9.56066Q3.87868,10,4.5,10L8.5,10Q9.12132,10,9.56066,9.56066Q10,9.12132,10,8.5L10,4.5Q10,3.87868,9.56066,3.43934Q9.30996,3.18864,9,3.08099ZM1.43934,7.56066Q1,7.12132,1,6.5L1,2.5Q1,1.87868,1.43934,1.43934Q1.87868,1,2.5,1L6.5,1Q7.12132,1,7.56066,1.43934Q8,1.87868,8,2.5L8,6.5Q8,7.12132,7.56066,7.56066Q7.12132,8,6.5,8L2.5,8Q1.87868,8,1.43934,7.56066Z" fill-rule="evenodd" fill="var(--mainColor)" fill-opacity="1"/></g></g></svg>';
  if (type == 'HSL') {

  }
  if (type == '透视') {

  }
  if (type == '渐变映射') {

  }
  if (type == '滤镜') {

  }
  if (type == '变形') {

  }
  var newEdit = document.createElement('div')
  newEdit.id = 'edits-'+ editorNum;
  newEdit.className = 'edits';
  newEdit.draggable = true;
  newEdit.innerHTML = chk + '<label for="chk-editor-' + editorNum + '" class="tags-editor"><div class="btn-text" style="width:10px;height:10px" onclick="if(this.parentNode.parentNode.firstChild.checked !== true) { this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)};">' + close + '</div>' + type + '<div class="btn-text" style="width:10px;height:10px"></div></label>' +  '<div class="btn-text" style="width:10px;height:10px;position: absolute;top:7px;right:-8px;" onclick="addEdit(this.parentNode.innerText,this);">' + copy + '</div>'
  if ( editTag.children.length == 0 ){
    editTag.appendChild(newEdit)
  } else {
    if (copynode){
      editTag.insertBefore(newEdit,copyEdit)
    } else {
      editTag.insertBefore(newEdit,editTag.children[0])
    }
  }
  
  editorPick = editorNum;
  editorNum++;
  editsID()
}
function editorChk(node,e) {
    if (e !== editorPick) {
      document.getElementById('chk-editor-' + editorPick).checked = false;
      node.checked = true;
      editorPick = e;
      //console.log("new", editorPick, e)
    } else {
        //node.checked = false;
        //console.log("copy", editorPick, e)
        node.checked = true;
        //console.log("old", editorPick, e)

  }
}

//拖拽编辑标签
function editsID(){  
  for (var i = 0; i < dragSources.length; i++) {
    dragSources[i].addEventListener('dragstart', function(event) {
      event.dataTransfer.setData("text/plain", event.target.id); 
      dropStartY = event.clientY;
    });
  
    dragSources[i].addEventListener('dragend', function(event) {
      event.dataTransfer.clearData("text/plain");
      dropEndY = event.clientY;
    });
  }
}
  
dropZones.addEventListener('dragover', function(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
});

dropZones.addEventListener('drop', function(event) {
  event.preventDefault();
  var id = event.dataTransfer.getData("text/plain");
  var draggedElement = document.getElementById(id);
  var dropZone = event.target;
  if ( dropZone.tagName == 'LABEL' && dropZone.parentNode.id.split('-')[0] == 'edits' ){
    //var index = dropZone.parentNode.id.split('-')[1]
    //console.log(index)
    if ( dropEndY < dropStartY){
      dropZone.parentNode.parentNode.insertBefore(draggedElement,dropZone.parentNode);
    } else {
      dropZone.parentNode.parentNode.insertBefore(draggedElement,dropZone.parentNode.nextElementSibling);
    }
    
  }
  
  //dropZones.appendChild(draggedElement);
});

//初始化
function notag() {
  createrType = "frame"
  inputExcel.value = ''
  fileName.innerHTML = '[-- 暂无数据 --]';
  tagsContainer1.innerHTML = '<!--根据列表生成标签-->'
  autoUp.style.display = "block";

  allFrame = [];
  finalFrame = [];

  dataText.value = '';
  anotherBtns.style.display = "none";
  anotherBtns2.style.display = "none";
  anotherBtns3.style.display = "none";
  anotherBtns4.style.display = "none";
  dataTextTips.style.display = "block";
}

//返回编辑
function backedit(){
  inputExcel.value = ''
  fileName.innerHTML = '[-- 正在输入 --]';
  tagsContainer1.innerHTML = '<!--根据列表生成标签-->'
  dataTextTips.style.display = "none";
  dataText.value = dataToText(allFrame);
  if(allFrame.length > 10){
    dataText.style.height = "300px"
  }
  autoUp.style.display = "block";
  anotherBtns2.style.display = "flex";
  anotherBtns.style.display = "none";
  anotherBtns3.style.display = "none";
  anotherBtns4.style.display = "none";

}

function dataToText(data){
  let table = '';

  data.forEach((row, index) => {
    let keys = Object.keys(row).filter(item => item == 'name' || item == 'w' || item == 'h');
    if (index === 0) {
      table += keys.join('\t') + '\n';
    }
    table += keys.map(key => row[key]).join('\t');
    table += '\n';
  });

  return table;
}

function noEdit() {
  document.getElementById("editor-tags").innerHTML = "";
  editorNum = 1;
  editorPick = 1
}
//保留全部条目
function alltag() {
  for (var i = 0; i < allFrame.length; i++) {
    document.getElementById('tag-' + i).style.display = 'flex';
  }
}

//侧边栏(带动画）
function sidePage(e) {
  var btnSide;
  if(e){
    btnSide = e;
    if(e.checked){
      //console.log(111)
      document.getElementById('btn-side-text-0').style.pointerEvents = 'none';
    };
  } else {
    btnSide = document.getElementById("btn-side-0")
  }
  
  if (btnSide.checked) {
    //console.log(222)
    document.getElementById("side-main").style.display = "block";
    document.getElementById("mask").style.display = "block";
    document.getElementById("side-mask").style.display = "block";
    document.getElementById("side-mask").style.animation = "side-up 0.5s";
    document.getElementById("side-page").style.zIndex = "20";
    document.getElementById("side-main").style.animation = "side-up 0.5s";
    
  } else {
    document.getElementById("side-main").style.animation = "side-close 0.5s";
    document.getElementById("mask").style.display = "none";
    document.getElementById("side-mask").style.animation = "side-close 0.5s";
    setTimeout(() => {
      document.getElementById("side-mask").style.display = "none";
      document.getElementById("side-main").style.display = "none";
      document.getElementById("side-page").style.zIndex = "";
    }, 480);
  }
}

//梯度变化类型
function chkMix(type,checked){
  if (checked){
    mixType.push(type)
    //console.log(mixType)
  } else {

    if(mixType.includes(type)){
      mixType = mixType.filter(item => item !== type)
      //console.log(mixType)
    }
  }
}

//查找相似类型
function chkSame(type,checked){
  if (checked){
    searchSameType.push(type)
  } else {

    if(searchSameType.includes(type)){
      searchSameType = searchSameType.filter(item => item !== type)
    }
  }
}


//查找并选中
function searchToRe(info) {
  message([{ area: searchArea, type: searchType, info: info }, 'searchToRe'])
}
//查找类型
function chkSearchType(e) {
  if (e.id.split("-")[2] !== searchType) {
    message([{ area: searchArea, type: e.id.split("-")[2], info: searchInfo }, 'searchToRe'])
  }
  //var type = ["Text", "Component", "ComponentSet", "Font"]
  var type = ["Text", "Name"]

  for (var i = 0; i < type.length; i++) {
    document.getElementById("chk-for-" + type[i]).checked = false
  }

  e.checked = true
  searchType = e.id.split("-")[2]

}

//输入倍数
function chkNum(e) {
  for (var i = 0; i < 4; i++) {
    document.getElementById('chk-num-list').style.opacity = '1';
    document.getElementById('chk-num-' + i).checked = false;
    document.getElementById('chk-num-' + e).checked = true;
  }
  document.getElementById('input-num-2').value = e + 1;
  document.getElementById('input-num-2').style.color = 'var(--boxBod)';
}

//选择倍数
function numSize() {
  for (var i = 0; i < 4; i++) {
    document.getElementById('chk-num-' + i).checked = false;

  }
  document.getElementById('input-num-2').style.color = 'var(--mainColor)';
  if (document.getElementById('input-num-2').value != "") {
    document.getElementById('chk-num-list').style.opacity = '0.5';
  } else {
    document.getElementById('chk-num-list').style.opacity = '1';
  }
}

//重置输入色值
function reColorText(e) {

  if (e.value == '') {
    e.value = "#000000"
  }
  if (e.value.length < 7) {
    if (e.value[0] == '#') {
      var a = e.value.split("#")[1]
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
      var c = e.value
      if (e.value.length == 3) {
        e.value = "#" + c + c
      }
      if (e.value.length == 2) {
        e.value = "#" + c + c + c
      }
      if (e.value.length == 1) {
        e.value = "#" + c + c + c + c + c + c
      }
      if (e.value.length == 4) {
        e.value = "#" + c + "00"
      }
      if (e.value.length == 5) {
        e.value = "#" + c + "0"
      }
      if (e.value.length == 6) {
        e.value = "#" + c
      }
    }
  } else if (e.value.length > 7) {
    if (e.value[0] == '#' && e.value[1] == '#') {
      //e.value = "#000000"
      //console.log(e.value.split("#")[1])
      e.value = e.value.substring(1, 8)
    } else {
      e.value = "#000000"
    }
  } else if (e.value.length = 7) {
    e.value = e.value
  } else {
    e.value = "#000000"
  }

}

//缩放中心
function chkScaleCenter(e) {
  var center = ["TL", "TC", "TR", "CL", "CC", "CR", "BL", "BC", "BR"]
  for (var i = 0; i < center.length; i++) {
    document.getElementById("chk-scale-" + center[i]).checked = false
  }
  e.checked = true
  scaleCenter = e.id.split("-")[2]
}
//缩放类型
function chkScaleType(e) {
  var type = ["W", "H", "WH"]
  if (scaleType != e.id.split("-")[2]) {
    if (e.id.split("-")[2] == "WH") {
      document.getElementById("input-num-scale").value = 100;
    } else {
      document.getElementById("input-num-scale").value = 0;
    }
  }
  for (var i = 0; i < type.length; i++) {
    document.getElementById("chk-scale-" + type[i]).checked = false
  }

  e.checked = true
  scaleType = e.id.split("-")[2]

}
//等比缩放
function chkScale(s) {
  //message([{center:scaleCenter,type:scaleType,value:s},'scaleSelf'])
}

//遍历剩余标签，读取对应数组的宽高，并发往主线程，以创建画板
function createrObj() {
  if (createrType == "frame") {
    console.log('已上传数量：' + allFrame.length);

    for (var i = 0; i < allFrame.length; i++) {
      if (document.getElementById('tag-' + i).style.display !== 'none') {
        finalFrame.push(allFrame[i])
      }
    }
    console.log('已选择：' + finalFrame.length);
    message([finalFrame, "createrframe"])
    finalFrame = [];
  }

}

//选择转矢量类型
function chkVector(e) {
  for (var i = 0; i < 4; i++) {
    document.getElementById('chk-vector-' + i).checked = false;
    document.getElementById('chk-vector-' + e).checked = true;
  }
}

//返回图片宽高信息和分段，恢复图片原尺寸
function imgURLtoWH(e) {
  var img = new Image();
  img.src = e.imgURL;
  img.onload = function () {
    message([{ w:img.width, h:img.height,index:e.index}, 'imgWH'])
  }
}

//添加噪点
function noise() {
  var noiseV = document.getElementById('input-num-tjzs').value
  var dom = document.createElement('canvas');
  dom.width = 512;
  dom.height = 512;
  var ctx = dom.getContext('2d');
  /*
  for (let y = 0; y < e[0]; y++) {
    for (let x = 0; x < e[1]; x++) {
      var color = Math.floor(Math.random() * 12 + (255 - 16)).toString(16);
      ctx.fillStyle = `#${color}${color}${color}`;
      ctx.fillRect(x, y, 1, 1);
    };
  };
  */
  for (var i = 0; i < noiseV * 65536; i++) {
    var x = Math.random() * dom.width;
    var y = Math.random() * dom.height;
    var color = Math.floor(Math.random() * 6 + (255 - 16)).toString(16);
    //ctx.fillStyle = `#${color}${color}${color}`;
    ctx.fillStyle = 'rgba(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + (Math.random() * 0.5 + 0.5) + ')';
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 0.5, 0, 6);
    ctx.fill();
  }
  var url = dom.toDataURL(`image/png`, 0.6);
  return B64ToU8A(url.split(',')[1]);

}

//生成小地图
async function createrMap(info, size) {
  var mapCanvas = document.getElementById("map-canvas");
  var mapCanvasKey = document.getElementById("map-canvas-key");
  var viewW = document.getElementById("map-view").getBoundingClientRect().width;
  var viewH = document.getElementById("map-view").getBoundingClientRect().height;
  var viewBox = document.getElementById("map-viewbox");
  var viewBg = document.getElementById("map-bg");
  var viewBig = document.getElementById("map-view-big")
  //console.log(viewW,viewH)
  //console.log(info.w,info.h)
  if (info.w <= 4096 && info.h <= 4096) {
    mapCanvas.width = info.w;
    mapCanvas.height = info.h;
    //console.log(mapCanvas.width,mapCanvas.height)
  } else {
    if (info.w / info.h > 1) {//横版
      mapCanvas.width = 4096;
      mapCanvas.height = (4096 / info.w * info.h);
      //console.log(mapCanvas.width,mapCanvas.height)
    } else if (info.w / info.h < 1) {//竖版
      mapCanvas.height = 4096;
      mapCanvas.width = (4096 / info.h * info.w);
    } else {//方形
      mapCanvas.width = 4096;
      mapCanvas.height = 4096;
    }
  };
  var scaleW = viewW / mapCanvas.width;
  var scaleH = viewH / mapCanvas.height;
  var scale = Math.min(scaleW, scaleH);

  //console.log(scale)
  mapCanvas.style.transform = 'scale(' + scale + ')';
  mapCanvas.style.transformOrigin = '0 0';
  mapCanvas.style.top = (viewH - mapCanvas.height * scale) / 2 - 1 + "px";
  mapCanvas.style.left = (viewW - mapCanvas.width * scale) / 2 - 1 + "px";
  mapCanvasKey.width = mapCanvas.width * scale * size;
  mapCanvasKey.height = mapCanvas.height * scale * size;
  viewBox.style.width = mapCanvas.width * scale + 4 + "px";
  viewBox.style.height = mapCanvas.height * scale + 4 + "px";
  viewBox.style.top = (viewH - mapCanvas.height * scale) / 2 - 4 + "px";
  viewBox.style.left = (viewW - mapCanvas.width * scale) / 2 - 4 + "px";
  viewBg.style.width = mapCanvas.width * scale + 4 + "px";
  viewBg.style.height = mapCanvas.height * scale + 4 + "px";
  viewBg.style.top = (viewH - mapCanvas.height * scale) / 2 - 4 + "px";
  viewBg.style.left = (viewW - mapCanvas.width * scale) / 2 - 4 + "px";
  viewBg.style.backgroundColor = info.bg;
  viewBig.style.backgroundColor = info.bg;
  inView.s = info.w / (mapCanvas.width * scale + 4)


  var ctx = mapCanvas.getContext("2d")
  var ctx2 = mapCanvasKey.getContext("2d")
  var url = URL.createObjectURL(new Blob([info.view]));
  var image = new Image();
  image.src = url;
  image.onload = await function () {
    ctx.drawImage(image, 0, 0, mapCanvas.width, mapCanvas.height);
    ctx2.drawImage(image, 0, 0, mapCanvas.width * scale * size, mapCanvas.height * scale * size);
    URL.revokeObjectURL(url)
  }
}
//生成十字线
function mapLine(event, node) {
  var XY = [event.pageX - node.x, event.pageY - node.y];
  root.style.setProperty('--map-line-x', XY[0]);
  root.style.setProperty('--map-line-y', XY[1]);
  var mapCanvasKey = document.getElementById("map-canvas-key");
  var viewBig = document.getElementById("map-view-big");
  if (XY[0] > node.width - 60 && XY[1] < 60) {
    var trans = node.height - 60;
    viewBig.style.transform = "translateY(" + trans + "px)";
    viewBig.style.transition = "transform ease-out 0.2s";
  } else {
    viewBig.style.transform = "translateY(0)";
    viewBig.style.transition = "transform ease-out 0.2s";
  }
  mapCanvasKey.style.top = XY[1] * -1 * mapCanvasKey.width / node.width + 30;
  mapCanvasKey.style.left = XY[0] * -1 * mapCanvasKey.width / node.width + 30;
}

//移动画布中心
var singleClick = false
function reCenterAuto(event, node) {
  var XY = [event.pageX - node.x, event.pageY - node.y]
  var x = Math.round(inView.x + XY[0] * inView.s)
  var y = Math.round(inView.y + XY[1] * inView.s)
  singleClick = true
  setTimeout(() => {
    if (singleClick) {
      //console.log(node)
      //console.log(x,y,node.width,node.height,XY,inView.s)
      message([{ x: x, y: y }, "reCenterAuto"])
    }
  }, 250);

}

function reCenter(event, node) {
  var XY = [event.pageX - node.x, event.pageY - node.y]
  var x = Math.round(inView.x + XY[0] * inView.s)
  var y = Math.round(inView.y + XY[1] * inView.s)
  singleClick = false;
  //console.log(node)
  //console.log(x,y,node.width,node.height,XY,inView.s)
  message([{ x: x, y: y }, "reCenter"])


}

//斜切
function skew(e) {
  if (e) {
    var skewInfo = {
      x: parseInt(document.getElementById('input-num-skewW').value),
      y: parseInt(document.getElementById('input-num-skewH').value),
      w: parseInt(document.getElementById('input-num-scaleW').value),
      h: parseInt(document.getElementById('input-num-scaleH').value),
    }
    //console.log(skewInfo)
    message([skewInfo, 'skewSet'])
  } else {
    document.getElementById('slider-skewW').value = 0;
    document.getElementById('slider-skewH').value = 0;
    document.getElementById('input-num-skewW').value = 0;
    document.getElementById('input-num-skewH').value = 0;
    document.getElementById('slider-scaleW').value = 100;
    document.getElementById('slider-scaleH').value = 100;
    document.getElementById('input-num-scaleW').value = 100;
    document.getElementById('input-num-scaleH').value = 100;
    message([{ x: 0, y: 0, w: 100, h: 100 }, 'skewSet'])
  }

}

//切换tab
function viewPage(e) {
  
  for (var i = 0; i < tab.length; i++) {
    if (i + 1 == e) {
      for (var ii = 0; ii < main.length; ii++) {
        //console.log('tab-'+ i + '开启')
        document.getElementById(main[ii] + "-main-" + (i + 1)).style.display = 'flex';
        document.getElementById(tab[i]).style.opacity = 1;
      }
    } else {
      for (var ii = 0; ii < main.length; ii++) {
        //console.log(i + '关闭')
        document.getElementById(main[ii] + "-main-" + (i + 1)).style.display = 'none';
        document.getElementById(tab[i]).style.opacity = 0.5;
      }
    }
  }
  message([e, "tabSet"])
  tabPage = e;
  if( e == 5 ){
    console.log('getStyle')
    message(["getStyle", "getStyle"])
  }
}

//////使用八叉树提取色表//////
//定义八叉树
class OctreeNode {
  constructor(level, parent) {
      this.level = level; // 当前节点所在的层次
      this.pixelCount = 0; // 当前节点包含的像素数量
      this.redSum = 0;     // 红色分量的总和
      this.greenSum = 0;   // 绿色分量的总和
      this.blueSum = 0;    // 蓝色分量的总和
      this.paletteIndex = -1; // 如果该节点是一个叶子节点，记录其在调色板中的索引
      this.children = new Array(8); // 子节点数组
      this.parent = parent; // 父节点引用
  }

  // 判断当前节点是否为叶子节点
  isLeaf() {
      return this.children.every(child => child === undefined);
  }

  // 获取当前节点的平均颜色
  getAverageColor() {
      if (this.pixelCount === 0) return [0, 0, 0];
      return [
          Math.round(this.redSum / this.pixelCount),
          Math.round(this.greenSum / this.pixelCount),
          Math.round(this.blueSum / this.pixelCount)
      ];
  }
}
//构建八叉树
class OctreeQuantizer {
  constructor(maxDepth) {
      this.maxDepth = maxDepth;
      this.root = new OctreeNode(0, null);
      this.palette = [];
      this.leafNodes = [];
  }

  // 插入一个像素到八叉树中
  insertPixel(pixel) {
      let node = this.root;
      for (let level = 0; level < this.maxDepth; level++) {
          const index = this.getOctantIndex(pixel, level);
          if (!node.children[index]) {
              node.children[index] = new OctreeNode(level + 1, node);
          }
          node = node.children[index];
      }
      node.pixelCount++;
      node.redSum += pixel[0];
      node.greenSum += pixel[1];
      node.blueSum += pixel[2];
  }

  // 根据当前层级获取八叉树索引
  getOctantIndex(pixel, level) {
      const bitShift = 8 - level - 1;
      const redBit = (pixel[0] >> bitShift) & 0x1;
      const greenBit = (pixel[1] >> bitShift) & 0x1;
      const blueBit = (pixel[2] >> bitShift) & 0x1;
      return (redBit << 2) | (greenBit << 1) | blueBit;
  }

  // 合并叶子节点以减少颜色数量
  reduceColors(targetColors) {
      while (this.leafNodes.length > targetColors) {
          let deepestNode = null;
          for (const leaf of this.leafNodes) {
              if (!deepestNode || leaf.level > deepestNode.level) {
                  deepestNode = leaf;
              }
          }
          this.mergeNode(deepestNode);
      }
  }

  // 合并一个节点
  mergeNode(node) {
      if (!node.isLeaf()) return;

      node.parent.pixelCount += node.pixelCount;
      node.parent.redSum += node.redSum;
      node.parent.greenSum += node.greenSum;
      node.parent.blueSum += node.blueSum;
      node.parent.children[node.getIndex()] = undefined;

      const index = this.leafNodes.indexOf(node);
      if (index !== -1) {
          this.leafNodes.splice(index, 1);
      }
      if (node.parent.isLeaf()) {
          this.leafNodes.push(node.parent);
      }
  }

  // 生成调色板
  generatePalette() {
      this.leafNodes = [];
      this.collectLeaves(this.root);

      this.palette = this.leafNodes.map((leaf, index) => {
          leaf.paletteIndex = index;
          return leaf.getAverageColor();
      });
  }

  // 收集所有叶子节点
  collectLeaves(node) {
      if (node.isLeaf()) {
          this.leafNodes.push(node);
      } else {
          for (const child of node.children) {
              if (child) {
                  this.collectLeaves(child);
              }
          }
      }
  }

  // 获取调色板
  getPalette() {
      return this.palette;
  }
}

//载入图片数据
async function imgDataSet(imgDataOld,imgDataNew,isNew) {
  //console.log(imgExportInfo)
    if(isNew == "new"){
      imgExportData = [];
      var imgData = imgDataNew;
      for (var i = 0; i < imgData.length; i++) {
        var fileName = document.getElementById('fileName-' + i).value;
        var s = document.getElementById('exportSize-' + i).value;
        var colorBox = await getColorBox2(imgData[i]);//八叉树法
        imgExportData.push({u8a:imgData[i],src:U8AToB64(imgData[i]),fileName: fileName,s:s,col:colorBox})
        //console.log(imgExportData)
        if ( imgData[i].length/1000 <= s || s == ''){
          document.getElementById('imgsize-' + i).innerHTML =  Math.floor(imgData[i].length/1000)  + 'k /无需压缩' 
        } else {
          document.getElementById('imgsize-' + i).innerHTML =  Math.floor(imgData[i].length/1000) + 'k /<span style="color:var(--liColor1)">待压缩</span>' 
        }
    }
    }else{
      var imgData = imgDataNew;

      var index = exportNum - imgDataNew.length
      //console.log(exportNum,index)
      for (var i = 0; i < imgData.length; i++) {
        
        if ( document.getElementById('fileName-' + (i + index)) ){
          var fileName = document.getElementById('fileName-' + (i + index)).value
          var s = document.getElementById('exportSize-' + (i + index)).value
        } else {
          var fileName = ''
          var s = ''
        }
        var colorBox = await getColorBox2(imgData[i]);//八叉树法 
        imgExportData.push({u8a:imgData[i],src:U8AToB64(imgData[i]),fileName: fileName,s:s,col:colorBox})
      }

      //console.log(imgExportData)
      for (var i = 0; i < imgData.length; i++) {
        //console.log((i + index - 1))
        if ( imgExportData[(i + index)].u8a.length/1000 <= imgExportData[(i + index)].s || imgExportData[(i + index)].s == ''){
          document.getElementById('imgsize-' + (i + index)).innerHTML =  Math.floor(imgExportData[(i + index)].u8a.length/1000)  + 'k /无需压缩' 
        } else {
          document.getElementById('imgsize-' + (i + index)).innerHTML =  Math.floor(imgExportData[(i + index)].u8a.length/1000) + 'k /<span style="color:var(--liColor1)">待压缩</span>' 
        }
      }

    }

}
function getColorBox2(imgDatas){
  return new Promise((resolve, reject) => {
    var blob = new Blob([imgDatas], { type: 'image/png' }); 
    var url = URL.createObjectURL(blob);
    var img = new Image()
    img.src = url;

    img.onload = function(){
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img,0,0)
      var imageData = ctx.getImageData(0,0,img.width,img.height)
      var data = imageData.data;

      function quantizeImage(datas) {
        const octree = new OctreeQuantizer(3); // 设置最大深度

        // 插入每个像素到八叉树中
        for (let i = 0; i <  datas.length; i += 4) {
            const r =  datas[i];
            const g =  datas[i + 1];
            const b =  datas[i + 2];
            octree.insertPixel([r, g, b]);
        }

        // 减少颜色数量
        octree.reduceColors(128);

        // 生成调色板
        octree.generatePalette();

        return octree.getPalette();
      }

      resolve(quantizeImage(imageData.data))

    }
  })
}

//导出图片为zip
async function exportImg(){
  //console.log(666)
  if(imgExportData.length > 0){
    //console.log(777)
    try {
      //console.log(888)
      const compressedImages = await compressImages(imgExportData);
      createZipAndDownload(compressedImages);
    } catch (error) {
      console.error('处理过程中发生错误:', error);
    }
  }
  
}

//单个图片的压缩
function compressImage(blob,quality,type,colorBox) {
   //console.log(u8a,quality,type)
    if (type == 'jpg' || type == 'jpeg'){
      //console.log(type)
      return new Promise((resolve, reject) => {
        //var blob = new Blob([u8a], { type: 'image/jpeg' });
        var file = new File([blob],'image.jpg',{type:'image/jpeg'})
        //console.log(file)
        new Compressor(file, {
          quality:quality/10,
          success(result) {
            resolve(result);
          },
          error(err) {
            reject(err);
          },
        });
      });
    } else if ( type == 'png') {
      var colorThief = new ColorThief();
      return new Promise((resolve, reject) => {
        //var blob = new Blob([u8a], { type: 'image/png' });    
        if(quality == 10){
          resolve(blob)
        } else {
          var url = URL.createObjectURL(blob);
          var img = new Image()
          img.src = url;

          img.onload = function(){
            var palette = colorThief.getPalette(img,20,1)//提取关键颜色
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d')
            ctx.drawImage(img,0,0)
            var imageData = ctx.getImageData(0,0,img.width,img.height)
            var data = imageData.data;
            var colorcut = new Promise((resolve, reject) => {
              var deep = [0,2,6,8,12,14,16,18,20,22]
              var newStep = deep[Math.floor(10 - quality)];  

              function toStep(value,step){//通过步长限定色值（失真）
                return Math.round(value/step)*step
              }

              function findColor(r,g,b){//通过色板简化颜色（保真）
                var palette2 = [...palette,...colorBox];
                //console.log(palette2)
                var minDist = Infinity;
                var keyColor = null;
                
                if ( !palette2.includes([r,g,b])){
                  for ( var i = 0; i < palette2.length; i++){
                    //var dist = Math.abs(palette2[i][0] - r) + Math.abs(palette2[i][1] - g) + Math.abs(palette2[i][2] - b);
                    var dist = Math.sqrt(
                      Math.pow(palette2[i][0] - r,2) + Math.pow(palette2[i][1] - g,2) + Math.pow(palette2[i][2] - b,2)
                    )
                    if ( dist < minDist){
                      minDist = dist;
                      keyColor = [palette2[i][0],palette2[i][1],palette2[i][2]]
                    }
                  }
                } else {
                  keyColor = [r,g,b]
                }
                
                return keyColor
              }

              //*
              for (var i = 0; i < data.length; i += 4){
                var [r,g,b,a] = [data[i],data[i + 1],data[i + 2],data[i + 3]];
                var x = (i / 4) % img.width,y = Math.floor((i / 4) / img.width);//获取像素坐标
                if(r !== g && r !== b && g !== b ){
                  data[i] = toStep(r,newStep);
                  data[i + 1] = toStep(g,newStep);
                  data[i + 2] = toStep(b,newStep);
                }
                if ( quality < 5){
                  if ( a < 10 || a > 245){
                    data[i + 3] = a;
                  } else {
                    var stepA = Math.ceil(2.5 * ((10 - quality)/10 + 1));
                    newA = Math.floor((a - 1) / stepA) * stepA + 1;
                    ea = newA - data[i + 3];
                    data[i + 3] = newA;

                    function floyd(dx,dy,factor){//误差扩散
                      if (x + dx >= 0 && x + dx < img.width && y + dy < img.height){
                        var newIndex = ((y + dy) * img.width + (x + dx)) * 4;//当前像素的周围像素
                        data[newIndex + 3] += ea * factor;//抖动
                      }
                    }
                    //*
                    floyd(1,0,7/32)
                    floyd(-1,1,3/32)
                    floyd(0,1,4/32)
                    floyd(1,1,2/32)
                    floyd(2,0,6/32)
                    floyd(-2,2,2/32)
                    floyd(0,2,5/32)
                    floyd(2,2,3/32)//矩阵
                    //*/
                  }
                } else {
                  data[i + 3] = a;
                }
              }
              //*/

              if ( quality == 9){
                for (var i = 0; i < data.length; i += 4){
                  var [r,g,b,a] = [data[i],data[i + 1],data[i + 2],data[i + 3]];
                  var x = (i / 4) % img.width,y = Math.floor((i / 4) / img.width);//获取像素坐标
                  if(r !== g && r !== b && g !== b ){
                    var cl = findColor(r,g,b);
                    var er = r - cl[0], eg = g - cl[1], eb = b - cl[2];
                    data[i] = cl[0];
                    data[i + 1] = cl[1];
                    data[i + 2] = cl[2];
                    function floyd(dx,dy,factor){//误差扩散
                      if (x + dx >= 0 && x + dx < img.width && y + dy < img.height){
                        var newIndex = ((y + dy) * img.width + (x + dx)) * 4;//当前像素的周围像素
                        data[newIndex] += er * factor;
                        data[newIndex + 1] += eg * factor;
                        data[newIndex + 2] += eb * factor;//抖动
                      }
                    }
                    //*
                    floyd(1,0,7/32)
                    floyd(-1,1,3/32)
                    floyd(0,1,4/32)
                    floyd(1,1,2/32)
                    floyd(2,0,6/32)
                    floyd(-2,2,2/32)
                    floyd(0,2,5/32)
                    floyd(2,2,3/32)//矩阵
                    //*/
                    
                  }
                }

              }
              ctx.putImageData(imageData,0,0);
              canvas.toBlob(function(blob){
                resolve(blob)
              },'image/png')
            })

            resolve(colorcut)
          }
        }
        
      })
      //return new Blob([u8a], { type: 'image/png' });
    } else if ( type == 'webp') {
      return new Promise((resolve, reject) => {
        //var blob = new Blob([u8a], { type: 'image/png' });
        var url = URL.createObjectURL(blob);
        var img = new Image()
        img.src = url;

        img.onload = function(){
          var palette = colorThief.getPalette(img,20,1)
          //console.log(Math.pow(2,quality*10))
          var canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext('2d')
          ctx.drawImage(img,0,0)
          canvas.toBlob(function(blob){
            resolve(blob)
          },'image/webp',(quality/10))
        }
      })
    }
  
}

// 批量压缩
async function compressImages(imgExportData) {
  //console.log(999)
  var imageDataArray = imgExportData.map(item => item.u8a)
  var targetSize = imgExportData.map(item => item.s*1000)
  var type = imgExportData.map(item => item.fileName.split('.').pop())
  var colorBox = imgExportData.map(item => item.col)
  const compressedImages = [];
  for (let i = 0; i < imageDataArray.length; i++) {
    var quality = 10; // 初始压缩质量
    //console.log(111)
    var result = new Blob([imageDataArray[i]], { type: 'image/png' });//初始化
    //console.log(222,result.size,[i],imageDataArray[i].length,targetSize[i])
    //if (targetSize[i] && imageDataArray[i].length > targetSize[i] ){//已删除该判断，会导致非png格式编码错误
    var newBlob = new Blob([imageDataArray[i]], { type: 'image/jpeg' });
      do {
        try {
          result = await compressImage(newBlob, quality,type[i],colorBox[i]);
          if (quality == 9){//先上256色+扩散算法，后面靠减色压缩
            newBlob = result;
          }
          if (targetSize[i] && result.size > targetSize[i] && quality > 1) {
            if ( quality - 1 >= 0){
              console.log("压缩质量:" + quality )
              quality -= 1; // 如果超过目标大小，减少质量再次尝试
            } else {
              quality = 0;
            }
            
            //console.log(result.size/1000 + 'k')
          } else {
            if ( !targetSize[i] || result.size <= targetSize[i] ){
              //console.log(targetSize[i])
              document.getElementById('imgsize-' + i ).innerHTML =  Math.floor(result.size/1000) + "k /质量:" + Math.ceil(quality) 
            } else {
              if (result.size){
                document.getElementById('imgsize-' + i ).innerHTML = '<span style="color:var(--liColor1)">' +  Math.floor(result.size/1000) + "k /压缩失败</span>"
              } else {
                document.getElementById('imgsize-' + i ).innerHTML = '<span style="color:var(--liColor1)">' +  Math.floor(result.length/1000) + "k /压缩失败</span>"
              }
              
            }
            //console.log(result)
            break;
          }
        } catch (error) {
          console.error('压缩过程中发生错误:', error);
          break;
        }
      } while (result.size > targetSize[i]);
    //}//已删除该判断，会导致非png格式编码错误
    

    compressedImages.push(result);
  }
  return compressedImages;
}

// 创建ZIP文件并提供下载
function createZipAndDownload(compressedImages) {
  var MN = new Date()
  var M = String(MN.getMonth() + 1).padStart(2, '0');
  var N = String(MN.getDate()).padStart(2, '0');
  var HHMMSS = String(MN.getHours()).padStart(2, '0') + String(MN.getMinutes()).padStart(2, '0') + String(MN.getSeconds()).padStart(2, '0');
  var zip = new JSZip();

  var imgs = imgExportData;
  compressedImages.forEach((blob, index) => {
    var path = imgs[index].fileName.split('/');
    var name = path.pop();
    if (imgs[index].fileName.split('/').length == 2) {
      var folder = zip.folder(path[0]);
      folder.file(name,blob);
    } else if (imgs[index].fileName.split('/').length == 3) {
      var folder1 = zip.folder(path[0]);
      var folder2 = folder1.folder(path[1]);
      folder2.file(name,blob);
    } else {
      zip.file(name,blob);
    }
  });


  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, docInfo + '-' + M + N + '_' + HHMMSS + '.zip');
  });
}


//b64转u8
function B64ToU8A(b64) {
  const padding = '='.repeat((4 - b64.length % 4) % 4);
  const base64 = (b64 + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const rawDataLength = rawData.length;
  const array = new Uint8Array(new ArrayBuffer(rawDataLength));

  for (let i = 0; i < rawDataLength; i += 1) {
    array[i] = rawData.charCodeAt(i);
  }

  return array;
}

//u8转b64
function U8AToB64(u8) {
  let binaryString = '';
  for (let i = 0; i < u8.length; i++) {
    binaryString += String.fromCharCode(u8[i]);
  }
  // 对二进制字符串进行base64编码
  const base64 = btoa(binaryString);
  return base64; //"data:image/png;base64," + 
}
// RGB转HSL
function rgbToHsl(r,g,b) {
  var r = r / 255;
  var g = g / 255;
  var b = b / 255;
  
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

//HSL转RGB
function hslToRgb(H,S,L) {
  var h = parseInt(H) / 360; // 转换为0到1的数值
  var s = parseInt(S) / 100; // 保持在0到1之间
  var l = parseInt(L) / 100; // 保持在0到1之间
  var r, g, b;

  if (s === 0) {
    r = g = b = l; // 灰度色
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hueToRgb(p, q, h + 1/3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1/3);
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];

  function hueToRgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }
}

//大图导入裁剪
function cutImg(file, name) {
  if (file instanceof File) {
    // 处理文件
    //console.log('这是一个文件');
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var url = URL.createObjectURL(new Blob([data]));
      cutImgToCanvas(url)
    };
  } else if (typeof file === 'string') {
    // 处理字符串
    //console.log(file)
    cutImgToCanvas(file)
    //console.log('这是一个字符串');
  } else {
    // 其他类型的处理
    console.log('未知类型输入');
  }



  function cutImgToCanvas(url) {

    var canvas = document.createElement("canvas")
    var ctx = canvas.getContext("2d")

    var image = new Image();
    image.src = url;
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;

      requestAnimationFrame(function draw() {
        // 绘制图片
        ctx.drawImage(image, 0, 0);
        var cuts = creCutArea({ w: canvas.width, h: canvas.height, x: 0, y: 0, s: 1 },4096);
        // 检查图片是否完全绘制
        if (image.complete) {
          //console.log(cuts.length)
          var cutImgs = []
          for (var i = 0; i < cuts.length; i++) {
            var canvas2 = document.createElement("canvas");
            canvas2.width = cuts[i].w;
            canvas2.height = cuts[i].h;
            var ctx2 = canvas2.getContext("2d");
            //requestAnimationFrame(function draw() {
            ctx2.drawImage(canvas, cuts[i].x, cuts[i].y, cuts[i].w, cuts[i].h, 0, 0, cuts[i].w, cuts[i].h);
            var imgData = new Uint8Array(atob(canvas2.toDataURL('image/png').split(',')[1]).split('').map(function (c) { return c.charCodeAt(0); }));
            if (cuts.length > 1) {
              cutImgs.push({ img: imgData, w: canvas2.width, h: canvas2.height, name: name + "-" + (i + 1), x: cuts[i].x, y: cuts[i].y })
            } else {
              cutImgs.push({ img: imgData, w: canvas2.width, h: canvas2.height, name: name, x: cuts[i].x, y: cuts[i].y })
            }

            //});  
            if (i == cuts.length - 1) {
              //console.log(cutImgs)
              message([cutImgs, 'pixelIm'])
            }
          }

        }

      });
    }

  }

}

//svg拆解
function processSVG(svgCode) {

  // 创建一个新的DOM解析器
  var parser = new DOMParser();
  // 解析SVG代码
  var svgDoc = parser.parseFromString(svgCode, 'text/xml');
  var svgRoot = svgDoc.documentElement;
  //console.log(svgRoot)
  // 结果数组
  var result = [];
  // 开始遍历
  traverse(svgRoot);
  function traverse(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName.toLowerCase() === 'image') {
        // 处理image节点
        var imgs = cutImg(node.getAttribute('xlink:href'), "图片")
      }
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      traverse(node.childNodes[i]);
    }
  }
}

//裁切方案
function creCutArea(info,mix) {//{w:,h:,x:,y:,s:}
  var W = info.w, H = info.h;//图片宽高
  var Ws = info.w, Hs = info.h;//非尾部部分的裁剪宽高
  var lastWs = info.w, lastHs = info.h;//尾部的裁剪宽高
  var X = info.x, Y = info.y;//裁切区坐标
  var cutW = 1, cutH = 1;//纵横裁剪数量
  var cuts = [];//从左到右，从上到小的裁切区域集
  var tips;
  //切割方案
  if (W * info.s <= mix && H * info.s <= mix) {//4K以内，正常生成
    cuts = [{ w: W, h: H, x: info.x, y: info.y, s: 1 }]
    return cuts;
  } else {//多行列宫格
    cutW = Math.ceil((W * info.s) / mix)
    cutH = Math.ceil((H * info.s) / mix)
    if (W % cutW == 0) { //宽度刚好等分
      Ws = W / cutW
      lastWs = Ws

    } else { //有小数点
      Ws = Math.ceil(W / cutW) //向上取整，最后一截短一些
      lastWs = W - (Ws * (cutW - 1))
    }
    if (H % cutH == 0) { //长度刚好等分
      Hs = H / cutH
      lastHs = Hs
      tips = "高被整除"
    } else { //有小数点
      Hs = Math.ceil(H / cutH) //向上取整，最后一截短一些
      lastHs = H - (Hs * (cutH - 1))
      tips = "高不能整除，剩余：" + lastHs
    }

    // 拆分图像数据
    for (var i = 0; i < (cutW * cutH); i++) {

      if ((i + 1) % cutW == 0 && i !== (cutW * cutH) - 1 && i !== 0) {
        cuts.push({ w: lastWs, h: Hs, x: X, y: Y, });
        Y = Y + Hs;
        X = info.x;
      } else if (i == (cutW * cutH) - 1) {
        cuts.push({ w: lastWs, h: lastHs, x: X, y: Y, t: tips });
      } else {
        if (i > (cutW * (cutH - 1)) - 1) {
          cuts.push({ w: Ws, h: lastHs, x: X, y: Y });
        } else {
          cuts.push({ w: Ws, h: Hs, x: X, y: Y });
        }

        if (cutW == 1) {
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

/*---------------------------控制窗口状态-------------------------------*/
//最大化窗口
function bigWindow(e) {
  if (e.checked) {
    message([true, 'big']);
  } else {
    message([false, 'big']);
  }
}


var btnKeepTime = null;//给"按钮-窗口固定/收起"添加防抖定时器

// 定义用户活动的事件类型
const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'focus', 'focusin', 'click', 'mousewheel'];
//鼠标移入则唤醒，并保持原tab,关闭侧边栏
document.getElementById("zzz").addEventListener('mousemove', function () {
  console.log("唤醒~")
  viewPage(tabPage)
  document.getElementById("bottom").style.display = 'flex';
  document.getElementById("top").style.display = 'flex';
  document.getElementById("side-page").style.display = 'flex';
  document.getElementById("zzz").style.display = 'none';
  if(document.getElementById("btn-side-0").checked == true){
    sidePage();
  }
  message([false, "sleep"]);
})


// 定义用户无活动时的回调函数
function onIdle() {
  console.log('休息一下~');
  var main = ['top', 'page', 'btn']
  for (var i = 0; i < main.length; i++) {
    document.getElementById(main[i] + "-main-1").style.display = 'none'
    document.getElementById(main[i] + "-main-2").style.display = 'none'
    document.getElementById(main[i] + "-main-3").style.display = 'none'
    document.getElementById(main[i] + "-main-4").style.display = 'none'
  }
  document.getElementById("bottom").style.display = 'none';
  document.getElementById("top").style.display = 'none';
  document.getElementById("mask").style.display = 'none';
  document.getElementById("side-page").style.display = 'none';
  document.getElementById("zzz").style.display = 'block';
  message([true, "sleep"])
}

// 启动或停止监听用户活动
function runSleep(enable) {
  if (enable) {
    // 停止监听
    activityEvents.forEach(eventType => {
      window.removeEventListener(eventType, resetBtnKeepTime);
    });
    clearTimeout(btnKeepTime); // 清除定时器

  } else {
    // 启动监听
    activityEvents.forEach(eventType => {
      window.addEventListener(eventType, resetBtnKeepTime);
    });
    resetBtnKeepTime(); // 初始重置定时器
  }
}

// 重置定时器
function resetBtnKeepTime() {
  clearTimeout(btnKeepTime); // 清除现有的定时器
  btnKeepTime = setTimeout(onIdle, 5000); // 重新设置定时器
}

// 复选框状态改变时的处理
btnKeep.addEventListener('change', function () {
  runSleep(this.checked);
});

// 初始化时禁用监听
runSleep(true);

/*---------------------------监听整个文档的点击事件，控制侧边栏展开收起-------------------------------*/
var sideClose = null;
document.addEventListener('mousedown', function (event) {
  if (document.getElementById("btn-side-0").checked) {
    sideClose = setTimeout(() => {
      if (!document.getElementById('side-area').contains(event.target) && document.activeElement) {
        console.log('close sidepage')
        document.getElementById("btn-side-0").checked = false
        sidePage()
        document.getElementById('btn-side-text-0').style.pointerEvents = '';
      }
    }, 100)
    document.addEventListener('mousemove', function () {
      clearTimeout(sideClose);
      sideClose = null;
    });
  }
  /**/
  if (!document.getElementById('editor-btns').contains(event.target) && document.activeElement) {
    document.getElementById("editor-type").style.animation = 'edits2 0.2s ease-out'
    setTimeout(() => {
      document.getElementById('editor-type').style.display = 'none';
    }, 200)
  }
});
