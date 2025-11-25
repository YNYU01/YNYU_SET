const flowBoxs = document.querySelector('[data-flow-viewbox]');
const flowBoxRightbtn = document.querySelector('[data-rightbtn-flewbox]');
const modList = document.querySelector('[data-flow-modlist]');
const modelAll = document.querySelector('[data-flow-model-all]');
const rightBtn = document.querySelectorAll('[data-rightbtn]');
const rightBtnList = document.querySelectorAll('[data-rightbtn-list]');


/*监听组件的自定义属性值，变化时触发函数，用于已经绑定事件用于自身的组件，如颜色选择器、滑块输入框组合、为空自动填充文案的输入框、导航tab、下拉选项等*/
// 使用 yn_comp.js 提供的统一 getUserMix API
// 注册各种类型的回调函数（支持7种标准类型）
getUserMix.register('color', getUserColor);
getUserMix.register('number', getUserNumber);
getUserMix.register('text', getUserText);
getUserMix.register('int', getUserInt);
getUserMix.register('float', getUserFloat);
getUserMix.register('select', getUserSelect);
getUserMix.register('radio', getUserRadio);

// 自定义监听：监听 flow 相关的属性
let flowObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if(mutation.type === 'attributes'){
      switch(mutation.attributeName){
        case 'data-flow-viewwidth':
          FLOW_RENDER.reViewBoxSize(mutation.target.getAttribute('data-flow-viewwidth')); 
        break;
        case 'data-flow-viewzoom':
          let zoom = mutation.target.getAttribute('data-flow-viewzoom');
          let e = mutation.target.getAttribute('data-flow-viewMouse');
          // 从监听器调用时，跳过更新属性，防止循环触发
          FLOW_RENDER.reViewBoxZoom(zoom, e ? JSON.parse(e) : null, true); 
        break;
      }
    }
  })
});

let resizeObserver = new ResizeObserver(debounce((entries) => {
  entries.forEach((entry) => {
    const type = entry.target.getAttribute('data-resize-type')
    switch(type){
      case 'node':FLOW_RENDER.reNodeSize(entry.target); break;
    }
  }) 
},500));

//节点生成与更新
class ZY_NODE {
  // ========== 初始化相关 ==========
  
  constructor(flowBox,flowNodesBox,isInit,allNodeDatas,zoomRange) {
    /*节点容器*/
    this.flowBox = flowBox && getElementMix(flowBox) ? getElementMix(flowBox) : document.querySelector('[data-flow-viewbox]') || this.Error('noFlowBox');
    this.flowNodesBox = flowNodesBox && getElementMix(flowNodesBox) ? getElementMix(flowNodesBox) : document.querySelector('[data-flow-allnodes]') || this.Error('noflowNodesBox');
    /*基础参数*/
    // 缩放范围配置，默认 min: 0.5, max: 1.5
    this.zoomRange = zoomRange && typeof zoomRange === 'object' ? {
      min: zoomRange.min !== undefined ? zoomRange.min : 0.5,
      max: zoomRange.max !== undefined ? zoomRange.max : 1.5
    } : { min: 0.5, max: 1.5 };
    this.flowNodes = [
      {
        modsec: ['基础','base'],
        nodes:[
          {
            type:["合成预览","compositing"],
            layout:[
              {className: 'df-cc wh100 tex-pixelbg',items:['VIEW']},
              {className: 'df-rc',items:['OUT:01']},
              {className: 'df-sc',items:['IN:01']},
              {className: 'df-sc',items:['IN:02']},
              {className: 'df-sc',items:['IN:03']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[
              {id:'01',name:['标题组','titles'],inType:['STRING','CODE']},
              {id:'02',name:['元素组','elements'],inType:['STRING','CODE']},
              {id:'03',name:['背景组','backgrounds'],inType:['STRING','CODE']},
            ],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[
              {
                id:'01',
                value:'',
                max:20,
                must:['标题标题标题','Title Title Title'],
                disabled: false,
              },
              {
                id:'02',
                value:'',
                max:20,
                must:['标题标题标题','Title Title Title'],
                disabled: false,
              }
            ],
          },
          {
            type:["主标题","main title"],
            layout:[
              {className: 'df-rc',items:['OUT:01']},
              {className: 'df',items:['IN:01',{className: 'df-ffc gap4',items:['INPUT:01','INPUT:02']},]},
              {className: 'df-lc',items:['IN:02']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[
              {id:'01',name:['文案','text'],link:['INPUT:01',false],inType:['CODE']},
              {id:'02',name:['样式','style'],inType:['CODE']},
            ],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[
              {
                id:'01',
                value:['主标题第一行','Main Title First Line'],
                max:20,
                must:true,
                disabled: false,
              },
              {
                id:'02',
                value:['主标题第二行（可选）','Main Title Second Line (Optional)'],
                max:20,
                must:false,
                disabled: false,
              }
            ],
          },
          {
            type:["副标题","sub title"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["背景图","background"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["主体元素","individual"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["图层集","tags"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["延展","extend"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
        ],
      },
      {
        modsec: ['常用','common'],
        nodes:[
          {
            type:["图片","image"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["单LOGO","logo"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["组合LOGO","logo mix"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["普通文本","text"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["富文本","text rich"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["图标组合","icon mix"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["定制图标组合","icon mix pro"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
        ],
      },
      {
        modsec: ['特殊','special'],
        nodes:[
          {
            type:["角标","tags"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["定制角标","tags pro"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["浮动元素","floats"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["循环纹理","ST-texture"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["矢量元素","vector"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["地点","location"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
        ],
      },
      {
        modsec: ['运算','arithmetic'],
        nodes:[
          {
            type:["变体集","variant set"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["变量","variable"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["数值","number"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["分流","switch"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
        ],
      },
      {
        modsec: ['调整','trim'],
        nodes:[
          {
            type:["变换","transform"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["滤镜","filter"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["效果","effect"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            top: 0,
            left: 0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
        ],
      },
    ];
    this.allNodeDatas = allNodeDatas ? this.addNodes(allNodeDatas) : [];
    this.allNodes = [];
    this.pickNodes = [];
    this.copyNodes = [];
    this.zoom = 1;
    this.oldZoom = 1;
    // 视窗大小配置：默认4096，最大8192（2倍）
    this.viewBoxSize = {
      default: 4090,
      max: 25600,
      current: 4090
    };
    /*初始化控制*/
    this.selectArea = document.querySelector('[data-selectarea]') || this.creArea('selectarea');
    this.connectArea = document.querySelector('[data-connectarea]') || this.creArea('connectarea');
    this.isInit = isInit ? this.init() : null;
    this.editorBox = document.querySelector('[data-flow-editorbox]') || this.isInit[0];
    this.lineBox = document.querySelector('[data-flow-linebox]') || this.isInit[1];
  };

  //创建模拟框选区域的容器: 用于框选节点、模拟连接线
  //name: 区域类型: selectarea, connectarea
  //返回值: 区域元素
  creArea(name){
    let area = document.createElement('div');
    area.setAttribute('data-' + name);
    area.className = 'pos-a';
    area.setAttribute('style','display: none;');
    document.querySelector('body').appendChild(area);
    return area;
  };

  //初始化
  //返回值: 初始化好的编辑层、连线层
  init(){
    //生成编辑层
    if(!this.editorBox){
      let editorBox = document.createElement('div');
      editorBox.setAttribute('data-flow-editorbox','');
      editorBox.className = 'pos-r';
      this.flowBox.appendChild(editorBox);
      this.editorBox = editorBox;
    };
    //生成连线层
    if(!this.lineBox){
      let lineBox = document.createElement('div');
      lineBox.setAttribute('data-flow-linebox','');
      lineBox.className = 'pos-a';
      this.flowBox.appendChild(lineBox);
      this.lineBox = lineBox;
    };
    //监听自定义属性值，修改画布大小
    let config_flowBox = {attributes:true,attributeFilter:['data-flow-viewwidth','data-flow-viewzoom']};
    flowObserver.observe(this.flowBox,config_flowBox);
    //默认4096，保持正方形
    this.viewBoxSize.current = this.viewBoxSize.default;
    this.flowBox.setAttribute('data-flow-viewwidth',this.viewBoxSize.current);
    
    //生成合成预览节点（在设置视窗大小之后）
    let newView = JSON.parse(JSON.stringify({modsec:this.flowNodes[0].modsec,...this.flowNodes[0].nodes[0]}));
    this.reCreateData(newView, true);
    // 使用动态计算的中心坐标，并应用像素吸附步长10px
    let centerPos = this.viewBoxSize.current / 2;
    // 先计算实际位置（浮点数），再应用像素吸附
    const snap = v => Math.round(v / 10) * 10;
    [newView.top, newView.left, newView.x, newView.y] = [
      snap(centerPos - 356/2), 
      snap(centerPos - 346/2), 
      snap(356/-2), 
      snap(346/2)
    ];
    this.addNodes([newView],true);
    //移动视图到中心点
    requestAnimationFrame(()=>{
      this.flowBox.scrollTop = (this.viewBoxSize.current - this.flowBox.offsetHeight)/2;
      this.flowBox.scrollLeft = (this.viewBoxSize.current - this.flowBox.offsetWidth)/2; 
    });
    
    // 监听窗口大小改变，自动检查是否需要扩大视窗
    let windowResizeHandler = debounce(() => {
      if(this.zoom){
        this.checkAndExpandViewBox(this.zoom);
      }
    }, 200);
    window.addEventListener('resize', windowResizeHandler);

    //生成节点栏,带拖拽事件
    let listfrag = document.createDocumentFragment();
    this.flowNodes.forEach((list,index) => {
      let input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = true;
      input.id = 'show_modsec_' + index;
      //this.flowNodesBox.appendChild(input);
      listfrag.appendChild(input);

      let label = document.createElement('label');
      label.setAttribute('for',input.id);
      label.className = 'show-next';
      this.addDiffLanguage(label,list.modsec,null,true);
      //this.flowNodesBox.appendChild(label);
      listfrag.appendChild(label);

      let modsec = document.createElement('div');
      modsec.className = 'df-ffc';
      modsec.setAttribute('data-flow-modsec',index);
      list.nodes.forEach(item => {
        let nodetag = this.addDiffLanguage(modsec,item.type,null,true);
        nodetag.className = 'df-lc'
        nodetag.setAttribute('data-flow-node','');
        nodetag.setAttribute('draggable','true');
        nodetag.addEventListener('dragstart',(e)=>{
          e.dataTransfer.setData('text/plain',JSON.stringify({modsec:list.modsec,...item}))
        })
      });
      input.addEventListener('change',()=>{
          if(input.checked){
              modsec.style.display = 'flex';
          }else{
              modsec.style.display = 'none';
          }
      })
      //this.flowNodesBox.appendChild(modsec);
      listfrag.appendChild(modsec);
    });
    this.flowNodesBox.appendChild(listfrag);

    const {flowBox,editorBox,lineBox} = this;

    //移动视图、通过选区选中节点
    let selectStartX = 0;
    let selectStartY = 0;
    let moveStartX = 0;
    let moveStartY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;
    let isSelecting = false;
    let isConnecting = false;
    let isMoving = false;
    let renderXY;
    let connectStartInfo = null; // 存储连接起始点信息 {type: 'in'|'out', x: number, y: number}

    flowBox.addEventListener('mousedown', (e) => {
      let isFocus = (document.hasFocus() && document.activeElement !== document.body);
      let isSafeNode = (e.target === this.flowBox || e.target === this.editorBox || e.target === this.lineBox);
      let isButtonLeft = (e.button === 0 && !isFocus && isSafeNode);
      if (isButtonLeft){
        [selectStartX, selectStartY] = [e.clientX, e.clientY];
        renderXY = this.toRenderXY(e);
        isSelecting = true;
        e.preventDefault();
      };
      if(e.button === 0 && e.target.tagName.toLowerCase() == 'circle'){
        [selectStartX, selectStartY] = [e.clientX, e.clientY];
        renderXY = this.toRenderXY(e);
        // 判断连接点是输入还是输出
        let connectPoint = e.target;
        let parentElement = connectPoint.parentElement;
        let connectType = null;
        
        // 查找父元素中的 data-node-in 或 data-node-out 属性
        while(parentElement && parentElement !== this.flowBox){
          if(parentElement.hasAttribute('data-node-in')){
            connectType = 'in';
            break;
          } else if(parentElement.hasAttribute('data-node-out')){
            connectType = 'out';
            break;
          }
          parentElement = parentElement.parentElement;
        }
        
        // 存储连接点类型
        if(connectType){
          connectStartInfo = {
            type: connectType
          };
        }
        
        isConnecting = true;
        e.preventDefault();
      }
      if (e.button === 1) {
        [moveStartX, moveStartY] = [e.clientX, e.clientY];
        [scrollLeft,scrollTop] = [this.flowBox.scrollLeft, this.flowBox.scrollTop];
        isMoving = true;
        e.preventDefault();
      };
      if((e.button === 0 || e.button === 2) && e.target == this.editorBox){
        this.pickNodes.forEach(pick => {
          pick.setAttribute('data-node-pick','false');
        });
        this.pickNodes = [];
      };
    });

    flowBox.addEventListener('mousemove',(e)=>{
      if(isSelecting){
        let areaWH = this.reAreaSize(e,this.selectArea,selectStartX,selectStartY);
        if(!areaWH) return;
        let [areaX,areaY] = [renderXY.x,renderXY.y];
        this.pickByArea([areaX/this.zoom,areaY/this.zoom,areaWH[0]/this.zoom,areaWH[1]/this.zoom]);
      };
      if(isConnecting){
        let areaWH = this.reAreaSize(e,this.connectArea,selectStartX,selectStartY);
        if(!areaWH) return;
        // 创建SVG容器
        let start = {x:0,y:0};
        let end = {x:0,y:0};
        let bodW = 2;
        let dotR = bodW*2;
        let [w,h] = areaWH;
        let [svgX,svgY] = [0,0];
        let [svgW,svgH] = [Math.abs(areaWH[0] + bodW*2),Math.abs(areaWH[1]) + bodW*4]
        this.connectArea.innerHTML = '';
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", svgW);
        svg.setAttribute("height", svgH);
        svg.setAttribute('viewBox',`0 0 ${svgW} ${svgH}`);
        this.connectArea.appendChild(svg);
        
        if(w > 0){
          start.x = dotR;
          end.x = w;
          svgX = dotR*-1;
        }else{
          start.x = w*-1 - dotR*2;
          end.x = dotR;
          svgX = dotR*2;
        }
        if(h > 0){
          start.y = dotR;
          end.y = h + dotR;
          svgY = dotR/-2;
        }else{
          start.y = h*-1 + dotR;
          end.y = dotR;
          svgY = -dotR/2;
        }
        // 先计算控制点，用于确定 viewBox 边界
        let controlPoints = this.calculateControlPoints(start,end,connectStartInfo);
        
        // 计算所有关键点的边界（包括起点、终点、控制点和圆圈的边界）
        let minX = Math.min(start.x - dotR, end.x - dotR, controlPoints.control1.x, controlPoints.control2.x);
        let maxX = Math.max(start.x + dotR, end.x + dotR, controlPoints.control1.x, controlPoints.control2.x);
        let minY = Math.min(start.y - dotR, end.y - dotR, controlPoints.control1.y, controlPoints.control2.y);
        let maxY = Math.max(start.y + dotR, end.y + dotR, controlPoints.control1.y, controlPoints.control2.y);
        
        // 添加边距
        const padding = dotR * 2;
        minX -= padding;
        maxX += padding;
        minY -= padding;
        maxY += padding;
        
        // 计算新的 viewBox 尺寸
        let newSvgW = maxX - minX;
        let newSvgH = maxY - minY;
        
        // 计算坐标偏移量，使所有点相对于新的 viewBox（从 0,0 开始）
        let offsetX = -minX;
        let offsetY = -minY;
        
        // 更新 viewBox 和 SVG 尺寸
        svg.setAttribute("width", newSvgW);
        svg.setAttribute("height", newSvgH);
        svg.setAttribute('viewBox',`0 0 ${newSvgW} ${newSvgH}`);
        
        // 调整 transform：原来的 svgX/svgY 是为了让起点在正确位置
        // 现在起点坐标从 start.x 变成了 start.x + offsetX
        // 所以需要调整 transform 来补偿这个变化，使得端点实际位置不变
        // 新的 transform = 原来的 svgX - offsetX（因为起点坐标增加了 offsetX，所以需要向左移动 offsetX 来补偿）
        svg.setAttribute('style',`transform: translate(${svgX - offsetX}px,${svgY - offsetY}px)`);
        
        // 创建路径，使用调整后的坐标（相对于新的 viewBox）
        let adjustedStart = {x: start.x + offsetX, y: start.y + offsetY};
        let adjustedEnd = {x: end.x + offsetX, y: end.y + offsetY};
        let adjustedControl1 = {x: controlPoints.control1.x + offsetX, y: controlPoints.control1.y + offsetY};
        let adjustedControl2 = {x: controlPoints.control2.x + offsetX, y: controlPoints.control2.y + offsetY};
        
        let path = this.createSmoothPathFromControls(adjustedStart, adjustedEnd, adjustedControl1, adjustedControl2, bodW);
        svg.appendChild(path);
        let circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle1.setAttribute('cx',adjustedStart.x);
        circle1.setAttribute('cy',adjustedStart.y);
        circle1.setAttribute('r',dotR);
        circle1.setAttribute("fill", "var(--line-col)");
        let circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle2.setAttribute('cx',adjustedEnd.x);
        circle2.setAttribute('cy',adjustedEnd.y);
        circle2.setAttribute('r',dotR);
        circle2.setAttribute("fill", "var(--line-col)");
        svg.appendChild(circle1);
        svg.appendChild(circle2);
      };
      if(isMoving){
        let moveW = e.clientX - moveStartX;
        let moveH = e.clientY - moveStartY;

        this.flowBox.scrollLeft = scrollLeft - moveW;
        this.flowBox.scrollTop = scrollTop - moveH;
      };
    });

    flowBox.addEventListener('mouseup',()=>{
      this.selectArea.setAttribute('style','display: none;');
      this.connectArea.setAttribute('style','display: none;');
      [selectStartX,selectStartY] = [0,0];
      [moveStartX,moveStartY] = [0,0];
      isSelecting = false;
      isConnecting = false;
      isMoving = false;
      connectStartInfo = null;
    });

    //控制画布缩放级别
    flowBox.addEventListener('wheel',(e)=>{
      e.preventDefault();
      let oldZoom = this.zoom;
      let step = e.deltaY > 0 ? -0.1 : 0.1
      let zoom = oldZoom*1 + (Math.round(Math.abs(e.deltaY)/100) * step);
      this.setZoom(zoom,e);
    });
    
    let isTouchScale = false;
    let touchStartZoom = 1;
    let touchScaleStart;
    flowBox.addEventListener('touchstart',(e)=>{
        if(e.touches.length === 2){
            e.preventDefault();
            let t = e.touches;
            let dx = t[0].clientX - t[1].clientX;
            let dy = t[0].clientY - t[1].clientY;
            isTouchScale = true;
            touchScaleStart = Math.hypot(dx,dy);       
            touchStartZoom = this.zoom;    
        };
    });
    flowBox.addEventListener('touchmove',(e)=>{
      if(isTouchScale){
          let t = e.touches
          let dx = t[0].clientX - t[1].clientX;
          let dy = t[0].clientY - t[1].clientY;
          let newMove = Math.hypot(dx,dy);
          let moves = touchScaleStart - newMove;     
          let zoom = touchStartZoom*1 + moves/-100;
          this.setZoom(zoom,e);
      };
    });
    
    flowBox.addEventListener('touchend',(e)=>{
        isTouchScale = false;
    });

    
    //拖拽生成节点元素
    let isDraging = false;
    editorBox.addEventListener('dragenter',(e)=>{
      e.preventDefault();
      isDraging = e.target == this.editorBox ? true :false;
    });
    editorBox.addEventListener('dragleave',(e)=>{
      e.preventDefault();
      //isDraging = false;
    });
    editorBox.addEventListener('dragover',(e)=>{
      e.preventDefault();
    });
    editorBox.addEventListener('drop',(e)=>{
      e.preventDefault();
      if(isDraging){
        try{
          //log(e.dataTransfer.types)
          if(this.copyNodes.length > 0){
            this.duplicateNodes(this.copyNodes,e);
            isDraging = false;
            this.copyNodes = [];
            return;
          }
          let data = JSON.parse(e.dataTransfer.getData('text/plain'));
          this.reCreateData(data)
          //更新坐标值，应用像素吸附
          let newXY = Object.values(this.toRenderXY(e)).map(item => this.snapToGrid(item/this.zoom));
          [data.top,data.left,data.x,data.y] = newXY;
          this.addNodes([data]);
        isDraging = false;
        this.copyNodes = [];
        }catch(e){console.log(e)};
      };

    });

    return [editorBox,lineBox]
  };

  // ========== 创建相关 ==========

  //按当前创建情况来更新模板数据里的关键值，如ID、创建次数，保证ID的唯一性
  reCreateData(data){
    let mod = this.flowNodes.find(m => m.modsec[1] == data.modsec[1]);
    let nod = mod.nodes.find(n => n.type[1] == data.type[1]);
    data.id = data.type[1].replace(/\s+/g,'') + (nod.create + 1).toString().padStart(3, '0');;
    //记录当前类型节点的创建操作次数
    nod.create++;
    //隐去实际节点数据中的记录值
    if(data.hasOwnProperty('create')) delete data.create;
    if(data.hasOwnProperty('reduce')) delete data.reduce;
  }

  /**
   * 通用元素创建工具函数
   * @param {string} tagName - 标签名，如 'div', 'input' 等
   * @param {HTMLElement} parent - 父容器元素（必须）
   * @param {Object} options - 配置对象
   * @param {Array<string>} options.texts - 双语文本数组 [中文, 英文]
   * @param {Object} options.attrs - 自定义属性对象，如 { 'data-node-in': 'xxx', 'data-input': '' }
   * @param {string} options.className - 类名
   * @param {Array<HTMLElement>} options.children - 子元素数组，会自动添加到元素
   * @param {boolean} options.textsBeforeChildren - 是否先添加文本再添加子元素（默认 false，即先添加子元素）
   * @param {boolean} options.isDiffLanguage - 是否使用 addDiffLanguage 处理文本（默认 true，如果有 texts）
   * @param {boolean} options.isRun - 传给 addDiffLanguage 的 isRun 参数（默认 false）
   * @param {Object} options.props - 元素属性，如 { type: 'text', value: 'xxx' }
   * @param {string} options.innerHTML - 元素 innerHTML（优先级低于 texts）
   * @param {boolean} options.appendToParent - 是否自动添加到父容器（默认 true）
   * @returns {HTMLElement} 创建的元素
   */
  createElement(tagName, parent, options = {}){
    let {
      texts,
      attrs = {},
      className,
      children,
      textsBeforeChildren = false,
      isDiffLanguage = true,
      isRun = false,
      props = {},
      innerHTML,
      appendToParent = true
    } = options;

    let element;

    // 如果有 children，需要先创建容器元素，然后根据顺序添加 children 和 texts
    // 否则如果有双语文本且需要特殊处理，使用 addDiffLanguage 直接添加到 parent
    if(children && Array.isArray(children) && children.length > 0){
      // 先创建容器元素
      element = document.createElement(tagName);
      
      // 设置类名
      if(className){
        element.className = className;
      }

      // 设置自定义属性
      Object.keys(attrs).forEach(key => {
        if(attrs[key] !== null && attrs[key] !== undefined){
          if(attrs[key] === ''){
            element.setAttribute(key, '');
          } else {
            element.setAttribute(key, attrs[key]);
          }
        }
      });

      // 设置元素属性
      Object.keys(props).forEach(key => {
        element[key] = props[key];
      });

      // 根据顺序添加文本和子元素
      if(textsBeforeChildren){
        // 先添加文本
        if(texts && isDiffLanguage){
          this.addDiffLanguage(element, texts, null, isRun);
        } else if(texts && !isDiffLanguage){
          let textEl = document.createElement('div');
          textEl.textContent = texts[0] || texts;
          element.appendChild(textEl);
        } else if(innerHTML){
          element.innerHTML = innerHTML;
        }
        
        // 然后添加子元素
        children.forEach(child => {
          if(child){
            element.appendChild(child);
          }
        });
      } else {
        // 先添加子元素
        children.forEach(child => {
          if(child){
            element.appendChild(child);
          }
        });

        // 然后添加文本
        if(texts && isDiffLanguage){
          this.addDiffLanguage(element, texts, null, isRun);
        } else if(texts && !isDiffLanguage){
          let textEl = document.createElement('div');
          textEl.textContent = texts[0] || texts;
          element.appendChild(textEl);
        } else if(innerHTML){
          element.innerHTML = innerHTML;
        }
      }

      // 最后添加到父容器
      if(appendToParent && parent){
        parent.appendChild(element);
      }
    } else if(texts && isDiffLanguage){
      // 没有 children 时，使用 addDiffLanguage 直接添加到 parent
      // addDiffLanguage 会自动创建元素并添加到 parent，返回元素
      // 签名: addDiffLanguage(parent, texts, tagname, isRun)
      element = this.addDiffLanguage(parent, texts, tagName || 'div', isRun);
      
      // 设置类名
      if(className){
        element.className = className;
      }

      // 设置自定义属性
      Object.keys(attrs).forEach(key => {
        if(attrs[key] !== null && attrs[key] !== undefined){
          if(attrs[key] === ''){
            element.setAttribute(key, '');
          } else {
            element.setAttribute(key, attrs[key]);
          }
        }
      });

      // 设置元素属性
      Object.keys(props).forEach(key => {
        element[key] = props[key];
      });
    } else {
      // 否则直接创建元素
      element = document.createElement(tagName);
      
      // 设置文本内容
      if(texts && !isDiffLanguage){
        // 如果不需要双语处理，只使用第一个文本
        element.textContent = texts[0] || texts;
      } else if(innerHTML){
        element.innerHTML = innerHTML;
      }

      // 设置类名
      if(className){
        element.className = className;
      }

      // 设置自定义属性
      Object.keys(attrs).forEach(key => {
        if(attrs[key] !== null && attrs[key] !== undefined){
          if(attrs[key] === ''){
            element.setAttribute(key, '');
          } else {
            element.setAttribute(key, attrs[key]);
          }
        }
      });

      // 设置元素属性
      Object.keys(props).forEach(key => {
        element[key] = props[key];
      });

      // 添加到父容器
      if(appendToParent && parent){
        parent.appendChild(element);
      }
    }

    return element;
  };

  //生成节点并绑定事件
  addNodes(nodeDatas,isRun){
    nodeDatas.forEach((data,index) => {
      let nodeBox = document.createElement('div');
      nodeBox.setAttribute('data-node-modsec',data.modsec[1]);
      nodeBox.setAttribute('data-node-type',data.type[0]);
      nodeBox.setAttribute('data-node-type-en',data.type[1]);
      nodeBox.setAttribute('data-resize-type','node');
      nodeBox.setAttribute('data-node-pick','false');
      nodeBox.className = 'df-ffc pos-a';
      nodeBox.id = data.id;
      nodeBox.setAttribute('style',`top: ${data.top}px; left: ${data.left}px;`)

      let nodeMix = document.createElement('div');
      nodeMix.setAttribute('data-node-mix','');
      nodeMix.className = 'pos-r h100 df-ffc';

      let nodeTop = this.addDiffLanguage(nodeMix,data.type,null,isRun);
      nodeTop.setAttribute('data-node-top','');
      nodeTop.className = 'pos-r';

      // 递归处理layout items的函数
      const processLayoutItems = (items, parentElement) => {
        items.forEach(item => {
          // 如果item是对象（嵌套结构），递归处理
          if(typeof item === 'object' && item !== null && item.className && Array.isArray(item.items)){
            let container = document.createElement('div');
            container.className = item.className;
            // 递归处理嵌套的items
            processLayoutItems(item.items, container);
            parentElement.appendChild(container);
            return;
          }
          
          // 如果item是字符串，使用原有逻辑处理
          if(typeof item === 'string'){
            let [type,id] = item.split(':');
            switch (type){
              case 'IN': {
                let inInfo = data.ins.find(ins => ins.id == id);
                let indot = inInfo.link ? addCheck('in', id, inInfo.link) : addCheck('in', id);
                let name = inInfo.name ? inInfo.name : ['输入','in'];
                
                let nodein = this.createElement('div', parentElement, {
                  className: 'df-lc',
                  attrs: {
                    'data-node-in': data.id + '_in_' + id
                  },
                  children: indot,
                  texts: name,
                  isRun: isRun
                });
              }
              break
              case 'OUT': {
                let outInfo = data.outs.find(outs => outs.id == id);
                let outdot = addCheck('out', id);
                let name = outInfo.name ? outInfo.name : ['输出','out'];
                
                let nodeout = this.createElement('div', parentElement, {
                  className: 'df-lc',
                  attrs: {
                    'data-node-out': data.id + '_out_' + id
                  },
                  children: outdot,
                  texts: name,
                  textsBeforeChildren: true,
                  isRun: isRun
                });
              }
              break
              case 'INPUT': {
                let inputInfo = data.inputs.find(input => input.id == id);
                let nodeInput;
                let inputOptions = {
                  props: {
                    type: 'text'
                  },
                  className: 'nobod',
                  attrs: {
                    'data-input': '',
                    'data-input-type': 'text',
                    'data-node-input': data.id + '_input_' + id
                  }
                };
                
                // 创建 input 元素
                nodeInput = this.createElement('input', parentElement, inputOptions);
                
                // 根据 must 的值设置 value 或 placeholder
                if(Array.isArray(inputInfo.value)){
                  let language = ROOT.getAttribute('data-language');
                  let textValue = isRun ? inputInfo.value[0] : (language == 'Zh' ? inputInfo.value[0] : inputInfo.value[1]);
                  
                  if(inputInfo.must === true){
                    // must 为 true 时，设置 value 和 data-input-must 属性
                    nodeInput.value = textValue || '';
                    nodeInput.setAttribute('data-input-must', inputInfo.value[0]);
                    nodeInput.setAttribute('data-input-must-en', inputInfo.value[1]);
                  } else {
                    // must 为 false 时，设置为 placeholder（提示文本），不设置 value
                    nodeInput.placeholder = textValue || '';
                    // 设置双语 placeholder 属性（如果需要）
                    nodeInput.setAttribute('data-placeholder-zh', inputInfo.value[0]);
                    nodeInput.setAttribute('data-placeholder-en', inputInfo.value[1]);
                  }
                }
                
                // 实现字数统计和限制功能
                if(inputInfo.max){
                  // 计算字数的函数：中文=1，字母=0.5，符号忽略
                  const calculateLength = (str) => {
                    if(!str) return 0;
                    let length = 0;
                    for(let i = 0; i < str.length; i++){
                      let char = str[i];
                      // 判断是否为中文字符（包括中文标点）
                      if(/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(char)){
                        length += 1;
                      } 
                      // 判断是否为字母（包括大小写）
                      else if(/[a-zA-Z]/.test(char)){
                        length += 0.5;
                      }
                      // 符号忽略，不计数
                    }
                    return length;
                  };
                  
                  // 限制输入长度
                  const limitInput = (e) => {
                    let currentValue = e.target.value;
                    let currentLength = calculateLength(currentValue);
                    
                    if(currentLength > inputInfo.max){
                      // 如果超过最大长度，需要截断
                      let truncated = '';
                      let truncatedLength = 0;
                      for(let i = 0; i < currentValue.length; i++){
                        let char = currentValue[i];
                        let charLength = /[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(char) ? 1 : 
                                        /[a-zA-Z]/.test(char) ? 0.5 : 0;
                        
                        if(truncatedLength + charLength > inputInfo.max){
                          break;
                        }
                        truncated += char;
                        truncatedLength += charLength;
                      }
                      e.target.value = truncated;
                    }
                  };
                  
                  // 监听输入事件
                  nodeInput.addEventListener('input', limitInput);
                  nodeInput.addEventListener('paste', (e) => {
                    // 粘贴时也需要限制
                    setTimeout(() => limitInput(e), 0);
                  });
                  
                  // 设置最大长度属性（用于显示提示）
                  nodeInput.setAttribute('data-input-max', inputInfo.max);
                }
              }
              break
              case 'TEXT': {
                let textInfo = data.texts.find(text => text.id == id);
                this.createElement('div', parentElement, {
                  texts: textInfo.value,
                  isRun: isRun
                });
              }
              break
              case 'VIEW': {
                this.createElement('div', parentElement, {
                  attrs: {
                    'data-node-view': ''
                  }
                });
              }
              break
            };
          }
        });
      };

      // 辅助函数：创建连接点checkbox
      const addCheck = (type, id, link) => {
        let check = document.createElement('input');
        check.type = 'checkbox';
        check.id = data.id + '_' + type + '_' + id + '_dot';
        let checkbtn = document.createElement('label');
        checkbtn.setAttribute('for',check.id)
        checkbtn.setAttribute('data-node-dot','');
        checkbtn.className = 'check';
        checkbtn.innerHTML = '<btn-check></btn-check>'

        if(link){
          let [linkType, linkId] = link[0].split(':');
          switch (linkType){
            case 'INPUT':
              check.addEventListener('change',()=>{
                let linkInput = nodeMix.querySelector(`[data-node-input="${data.id + '_input_' + linkId}"]`);
                if(check.checked){
                  linkInput.disabled = !link[1];
                }else{
                  linkInput.disabled = link[1];
                };
              });
            break
          };
        };

        return [check,checkbtn];
      };

      data.layout.forEach(row => {
        let line = document.createElement('div');
        line.setAttribute('data-node-line','');
        line.className = row.className;
        // 使用递归函数处理items
        processLayoutItems(row.items, line);
        nodeMix.appendChild(line)
      });
      nodeBox.appendChild(nodeMix);

      this.allNodeDatas.push(data);
      this.allNodes.push(nodeBox);
      this.editorBox.appendChild(nodeBox);
      //监听样式（大小）变化，以便修改参数；
      resizeObserver.observe(nodeBox);
      let isDuplicate = false;
      let isMove = false;
      let isMoveGroup = false;
      let startInfo = [];
      nodeMix.addEventListener('mousedown',(e)=>{
        //log(e.target)
        let isSafeArea =  (e.target !== nodeMix && e.target !== nodeTop);
        let isSafeTagname = e.target.tagName.toLowerCase() == 'input' || e.target.tagName.toLowerCase() == 'circle';
        if(e.button === 1 || isSafeTagname) return;
        if(this.pickNodes.length > 1){
          startInfo = [];
          this.pickNodes.forEach(pick => {
            let pickdata = this.allNodeDatas.find(item => item.id == pick.id)
            startInfo.push(
              {
                id:pick.id,
                x:e.clientX,
                y:e.clientY,
                top:pick.offsetTop,
                left:pick.offsetLeft,
                nodeX:pickdata.x,
                nodeY:pickdata.y
              })
          });
          if(e.altKey){
            isDuplicate = true;
            // 多选复制：将所有选中的节点添加到 copyNodes
            this.pickNodes.forEach(pickNode => {
              if(!this.copyNodes.includes(pickNode)){
                this.copyNodes.push(pickNode);
              }
            });
          }else{
            isMoveGroup = true;
          }
          return;
        };
        if(!e.ctrlKey){
          this.pickNodes.forEach(pick => {
            pick.setAttribute('data-node-pick','false')
          });
          this.pickNodes = [];
          startInfo = [];
          startInfo.push(
            {
              id:nodeBox.id,
              x:e.clientX,
              y:e.clientY,
              top:nodeBox.offsetTop,
              left:nodeBox.offsetLeft,
              nodeX:data.x,
              nodeY:data.y
            })
        };
        this.pickNodes.push(nodeBox);
        nodeBox.setAttribute('data-node-pick','true');
        this.editorBox.appendChild(nodeBox);
        if(e.altKey){
          isDuplicate = true;
          // 在 mousedown 时设置 copyNodes，避免在 mousemove 中重复添加
          // 支持多选复制：将所有选中的节点添加到 copyNodes
          this.pickNodes.forEach(pickNode => {
            if(!this.copyNodes.includes(pickNode)){
              this.copyNodes.push(pickNode);
            }
          });
        }else{
          isMove = true;
        };
      });
      nodeMix.addEventListener('mousemove',(e)=>{
        if(isDuplicate){
          // 如果是多选复制，设置所有选中节点的 draggable
          if(this.pickNodes.length > 1){
            this.pickNodes.forEach(node => {
              node.setAttribute('draggable','true');
            });
          }else{
            nodeBox.setAttribute('draggable','true');
          }
          return;
        };
        if(isMoveGroup){
          this.pickNodes.forEach((node,index)=> {
            let nodedata = this.allNodeDatas.find(item => item.id == node.id);
            let startinfo = startInfo.find(item => item.id == node.id);
            this.moveNode(e,node,nodedata,startinfo);
          });
          return;
        }
        if(isMove){
          this.moveNode(e,nodeBox,data,startInfo[0]);
        }
      });
      
      nodeMix.addEventListener('mouseup',(e)=>{
        // 拖拽结束时应用像素吸附
        if(isMove || isMoveGroup){
          this.pickNodes.forEach(node => {
            let nodedata = this.allNodeDatas.find(item => item.id == node.id);
            if(nodedata){
              this.snapNodeToGrid(node, nodedata);
            }
          });
        }
        // 如果是多选，清理所有选中节点的 draggable
        if(this.pickNodes.length > 1){
          this.pickNodes.forEach(node => {
            node.setAttribute('draggable','false');
          });
        }else{
          nodeBox.setAttribute('draggable','false');
        }
        isDuplicate = false;
        isMove = false;
        isMoveGroup = false;
      });
      nodeMix.addEventListener('mouseleave',(e)=>{
        // 拖拽结束时应用像素吸附
        if(isMove || isMoveGroup){
          this.pickNodes.forEach(node => {
            let nodedata = this.allNodeDatas.find(item => item.id == node.id);
            if(nodedata){
              this.snapNodeToGrid(node, nodedata);
            }
          });
        }
        // 如果是多选，清理所有选中节点的 draggable
        if(this.pickNodes.length > 1){
          this.pickNodes.forEach(node => {
            node.setAttribute('draggable','false');
          });
        }else{
          nodeBox.setAttribute('draggable','false');
        }
        isDuplicate = false;
        isMove = false;
        isMoveGroup = false;
      });
      nodeBox.addEventListener('contextmenu',(e)=>{
        e.preventDefault();
      });
      
      // 为多选复制添加 dragstart 事件，创建自定义预览图
      nodeBox.addEventListener('dragstart',(e)=>{
        // 如果是多选复制模式，创建包含所有选中节点的预览图
        if(this.pickNodes.length > 1 && this.copyNodes.length > 0){
          // 计算所有节点的边界框（使用逻辑坐标）
          let minLeft = Infinity, minTop = Infinity;
          this.pickNodes.forEach(node => {
            let nodeData = this.allNodeDatas.find(item => item.id == node.id);
            if(nodeData){
              minLeft = Math.min(minLeft, nodeData.left);
              minTop = Math.min(minTop, nodeData.top);
            }
          });
          
          // 计算鼠标相对于边界框左上角的位置（转换为逻辑坐标）
          let editorRect = this.editorBox.getBoundingClientRect();
          let currentZoom = this.zoom || 1;
          // 将鼠标像素坐标转换为逻辑坐标
          let mouseX = (e.clientX - editorRect.left + this.editorBox.scrollLeft) / currentZoom;
          let mouseY = (e.clientY - editorRect.top + this.editorBox.scrollTop) / currentZoom;
          // 计算偏移量并应用预览缩放因子
          let offsetX = (mouseX - minLeft) * 0.6;
          let offsetY = (mouseY - minTop) * 0.6;
          
          let preview = this.createMultiSelectDragPreview(this.pickNodes, e);
          if(preview){
            e.dataTransfer.setDragImage(preview, offsetX, offsetY);
          }
        }
      });
      
    });
    //重置绑定
    // 注意：yn_comp.js 已优化为事件委托，动态生成的组件会自动响应，无需再调用 COMP_MAIN()
  };

  // 创建多选拖拽预览图
  createMultiSelectDragPreview(nodes, dragEvent){
    if(!nodes || nodes.length === 0) return null;
    
    // 创建一个临时容器来显示所有选中的节点
    let previewContainer = document.createElement('div');
    previewContainer.style.position = 'absolute';
    previewContainer.style.top = '-9999px';
    previewContainer.style.left = '-9999px';
    previewContainer.style.opacity = '0.8';
    previewContainer.style.transform = 'scale(0.6)';
    previewContainer.style.transformOrigin = 'top left';
    previewContainer.style.pointerEvents = 'none';
    previewContainer.style.zIndex = '10000';
    previewContainer.style.background = 'transparent';
    // 设置相同的 zoom，使预览图大小对应容器的 zoom
    previewContainer.style.zoom = this.zoom || 1;
    
    // 计算所有节点的边界框（使用逻辑坐标，从数据中获取）
    let minLeft = Infinity, minTop = Infinity, maxRight = -Infinity, maxBottom = -Infinity;
    let nodeRects = [];
    
    nodes.forEach(node => {
      // 从节点数据中获取逻辑坐标（不受 zoom 影响）
      let nodeData = this.allNodeDatas.find(item => item.id == node.id);
      if(!nodeData) return;
      
      let left = nodeData.left;
      let top = nodeData.top;
      let width = nodeData.width || node.offsetWidth;
      let height = nodeData.height || node.offsetHeight;
      
      nodeRects.push({
        node: node,
        left: left,
        top: top,
        width: width,
        height: height
      });
      
      minLeft = Math.min(minLeft, left);
      minTop = Math.min(minTop, top);
      maxRight = Math.max(maxRight, left + width);
      maxBottom = Math.max(maxBottom, top + height);
    });
    
    // 设置容器大小（逻辑尺寸）
    let containerWidth = maxRight - minLeft;
    let containerHeight = maxBottom - minTop;
    previewContainer.style.width = containerWidth + 'px';
    previewContainer.style.height = containerHeight + 'px';
    
    // 克隆所有节点并添加到容器中（使用逻辑坐标）
    nodeRects.forEach(({node, left, top}) => {
      let clone = node.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = (left - minLeft) + 'px';
      clone.style.top = (top - minTop) + 'px';
      clone.style.margin = '0';
      clone.style.transform = '';
      clone.style.opacity = '0.9';
      clone.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      // 移除一些可能影响预览的属性
      clone.removeAttribute('draggable');
      // 清理可能的事件监听器
      let allElements = clone.querySelectorAll('*');
      allElements.forEach(el => {
        // 移除可能影响拖拽的属性
        el.removeAttribute('draggable');
      });
      previewContainer.appendChild(clone);
    });
    
    // 将容器添加到文档中（临时，会在拖拽结束后清理）
    document.body.appendChild(previewContainer);
    
    // 延迟清理临时元素
    setTimeout(() => {
      if(previewContainer.parentNode){
        previewContainer.parentNode.removeChild(previewContainer);
      }
    }, 100);
    
    return previewContainer;
  };

  //复制节点
  duplicateNodes(nodes,e){
    if(nodes.length === 0) return;
    
    // 如果是多选复制，需要保持节点之间的相对位置
    if(nodes.length > 1 && e){
      // 记录所有节点的原始位置
      let originalPositions = nodes.map(node => {
        let oldData = this.allNodeDatas.find(item => item.id == node.id);
        return {
          node: node,
          data: oldData,
          left: oldData.left,
          top: oldData.top,
          x: oldData.x,
          y: oldData.y
        };
      });
      
      // 计算第一个节点的新位置（基于 drop 事件），应用像素吸附
      let firstNode = originalPositions[0];
      let newXY = Object.values(this.toRenderXY(e)).map(item => this.snapToGrid(item/this.zoom));
      let offsetX = newXY[1] - firstNode.left; // left 的偏移量
      let offsetY = newXY[0] - firstNode.top;  // top 的偏移量
      let offsetX4 = newXY[2] - firstNode.x;   // x 的偏移量
      let offsetY4 = newXY[3] - firstNode.y;   // y 的偏移量
      
      // 为每个节点创建副本并应用偏移量，保持相对位置
      originalPositions.forEach((item, index) => {
        let data = JSON.parse(JSON.stringify(item.data));
        this.reCreateData(data);
        // 应用偏移量并吸附到网格
        data.left = this.snapToGrid(item.left + offsetX);
        data.top = this.snapToGrid(item.top + offsetY);
        data.x = this.snapToGrid(item.x + offsetX4);
        data.y = this.snapToGrid(item.y + offsetY4);
        this.addNodes([data]);
      });
    } else {
      // 单选复制，使用原有逻辑
      nodes.forEach(node=>{
        let oldData = this.allNodeDatas.find(item => item.id == node.id);
        let data = JSON.parse(JSON.stringify(oldData));
        this.reCreateData(data);
        if(e){
          //更新坐标值，应用像素吸附
          let newXY = Object.values(this.toRenderXY(e)).map(item => this.snapToGrid(item/this.zoom));
          [data.top,data.left,data.x,data.y] = newXY;
        } else {
          // 应用像素吸附
          let newLeft = this.snapToGrid(data.left + (data.w || data.width || 0) + 20);
          let newX = this.snapToGrid(data.x + (data.w || data.width || 0) + 20);
          [data.left,data.x] = [newLeft, newX];
        };
        this.addNodes([data]);
      });
    }
  };

  //添加连接线
  addConnect(outDot,inDot){

  };

  //删除节点
  removeNode(node){
    let index = this.allNodeDatas.findIndex(item => item.id == node.id);
    this.allNodeDatas.splice(index,1);
    this.allNodes = this.allNodes.filter(item => item !== node)
    node.remove();
    resizeObserver.unobserve(node);
  };

  // ========== 连接线相关 ==========
  
  // 计算控制点（不创建路径）
  calculateControlPoints(start, end, connectStartInfo = null) {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    
    // 计算连线长度（使用对角线距离）
    const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // 根据连线长度计算系数（连线越长，系数越大）
    // 短连线（0-100px）对应较小系数，长连线（400px+）对应较大系数
    const minLength = 0;
    const maxLength = 400; // 超过这个长度，系数达到最大值
    const normalizedLength = Math.min(1, Math.max(0, lineLength / maxLength));
    
    // 系数从 0.375 到 2.5（对应 horizontalOffset 从 30 到 200，当 baseOffset = 80 时）
    const coefficient = 0.375 + normalizedLength * 2.125;
    
    // 计算 horizontalOffset：基础值乘以系数，然后限制在 30-200 之间
    const baseOffset = 80 ;// * this.zoom;
    let horizontalOffset = baseOffset * coefficient;
    horizontalOffset = Math.min(300, Math.max(10, horizontalOffset));
    
    let control1, control2;
    
    if(connectStartInfo){
      // 根据连接点类型和位置关系调整控制点
      const isStartOut = connectStartInfo.type === 'out';
      const isEndLeftOfStart = end.x < start.x;
      
      if(isStartOut){
        // 从输出点（右侧）开始
        if(isEndLeftOfStart){
          // 目标在左侧，先向右延伸，然后明显拐弯
          control1 = { x: start.x + horizontalOffset, y: start.y };
          control2 = { x: end.x - horizontalOffset, y: end.y };
        } else {
          // 目标在右侧，先向右延伸
          control1 = { x: start.x + Math.max(horizontalOffset, deltaX * 0.3), y: start.y };
          control2 = { x: end.x - Math.max(horizontalOffset, deltaX * 0.3), y: end.y };
        }
      } else {
        // 从输入点（左侧）开始
        if(isEndLeftOfStart){
          // 目标在左侧，先向左延伸
          control1 = { x: start.x - Math.max(horizontalOffset, Math.abs(deltaX) * 0.3), y: start.y };
          control2 = { x: end.x + Math.max(horizontalOffset, Math.abs(deltaX) * 0.3), y: end.y };
        } else {
          // 目标在右侧，先向左延伸，然后明显拐弯
          control1 = { x: start.x - horizontalOffset, y: start.y };
          control2 = { x: end.x + horizontalOffset, y: end.y };
        }
      }
    } else {
      // 兼容旧代码，如果没有连接信息则使用原来的逻辑
      control1 = { x: start.x + deltaX * 0.5, y: start.y };
      control2 = { x: end.x - deltaX * 0.5, y: end.y };
    }
    
    return { control1, control2 };
  };

  // 从控制点创建路径
  createSmoothPathFromControls(start, end, control1, control2, bodW) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${start.x},${start.y} C${control1.x},${control1.y} ${control2.x},${control2.y} ${end.x},${end.y}`);
    path.setAttribute("stroke", "var(--line-col)");
    path.setAttribute("stroke-dasharray","4 4");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", bodW);
    return path;
  };

  // 保留旧方法以兼容（如果需要）
  createSmoothPath(start, end, bodW, connectStartInfo = null) {
    let controlPoints = this.calculateControlPoints(start, end, connectStartInfo);
    return this.createSmoothPathFromControls(start, end, controlPoints.control1, controlPoints.control2, bodW);
  };

  // ========== 交互相关 ==========

  //框选节点
  //[x,y,w,h] 框选区域的左上角坐标、宽度、高度
  pickByArea([x,y,w,h]){
    x = w > 0 ? x : x + w;
    y = h > 0 ? y : y - h;
    w = w > 0 ? w : -w;
    h = h > 0 ? h : -h;
    this.pickNodes = [];
    this.allNodes.forEach(node => {
      if(this.isInArea([x,y,w,h],node)){
        node.setAttribute('data-node-pick','true');
        this.pickNodes.push(node);
      }else{
        node.setAttribute('data-node-pick','false');
        this.pickNodes = this.pickNodes.filter(item => item !== node);
      };
    });
  };

  //移动节点
  moveNode(e,node,nodedata,startinfo){
    let moveX = (startinfo.x - e.clientX)/this.zoom;
    let moveY = (startinfo.y - e.clientY)/this.zoom;
    
    // 拖拽过程中不应用吸附，保持平滑移动
    let newTop = startinfo.top - moveY;
    let newLeft = startinfo.left - moveX;
    let newX = startinfo.nodeX - moveX;
    let newY = startinfo.nodeY + moveY;
    
    // 限制节点在视窗范围内
    let nodeWidth = node.offsetWidth || nodedata.width || 140;
    let nodeHeight = node.offsetHeight || nodedata.height || 140;
    let viewBoxSize = this.viewBoxSize.current;
    
    // 限制left和top在[0, viewBoxSize - nodeSize]范围内
    newLeft = Math.max(0, Math.min(newLeft, viewBoxSize - nodeWidth));
    newTop = Math.max(0, Math.min(newTop, viewBoxSize - nodeHeight));
    
    // 根据限制后的left和top重新计算x和y（相对于中心的坐标）
    // 从 toRenderXY 逻辑：x = left - center, y = center - top (因为反转)
    let centerX = viewBoxSize / 2;
    newX = newLeft - centerX;
    newY = centerX - newTop;

    nodedata.x = newX;
    nodedata.y = newY;
    nodedata.top = newTop;
    nodedata.left = newLeft;
    node.style.top = newTop + 'px';
    node.style.left = newLeft + 'px';
  };

  // 在拖拽结束后应用像素吸附
  snapNodeToGrid(node, nodedata){
    let newTop = this.snapToGrid(nodedata.top);
    let newLeft = this.snapToGrid(nodedata.left);
    
    // 限制节点在视窗范围内（在吸附前）
    let nodeWidth = node.offsetWidth || nodedata.width || 140;
    let nodeHeight = node.offsetHeight || nodedata.height || 140;
    let viewBoxSize = this.viewBoxSize.current;
    
    newLeft = Math.max(0, Math.min(newLeft, viewBoxSize - nodeWidth));
    newTop = Math.max(0, Math.min(newTop, viewBoxSize - nodeHeight));
    
    // 根据限制后的left和top重新计算x和y
    let centerX = viewBoxSize / 2;
    let newX = newLeft - centerX;
    let newY = centerX - newTop;

    nodedata.x = newX;
    nodedata.y = newY;
    nodedata.top = newTop;
    nodedata.left = newLeft;
    node.style.top = newTop + 'px';
    node.style.left = newLeft + 'px';
  };

  // ========== 画布视图相关 ==========

  //修改画布大小
  reViewBoxSize(wh){
    let oldSize = this.viewBoxSize.current;
    let newSize = parseInt(wh);
    
    // 限制在最大范围内
    newSize = Math.min(newSize, this.viewBoxSize.max);
    newSize = Math.max(newSize, this.viewBoxSize.default);
    
    // 保持正方形
    this.viewBoxSize.current = newSize;
    
    // 更新所有相关层的大小
    this.editorBox.style.width = newSize + 'px';
    this.editorBox.style.height = newSize + 'px';
    this.lineBox.style.width = newSize + 'px';
    this.lineBox.style.height = newSize + 'px';
    
    // 如果视窗大小改变，需要更新所有节点的top和left坐标
    // 因为坐标系统以中心为原点，所以需要重新计算
    if(oldSize !== newSize){
      this.updateNodesPositionOnViewBoxResize(oldSize, newSize);
    }
  };
  
  // 在视窗大小改变时更新所有节点的坐标
  updateNodesPositionOnViewBoxResize(oldSize, newSize){
    let centerOffset = (newSize - oldSize) / 2;
    let oldCenter = oldSize / 2;
    let newCenter = newSize / 2;
    
    this.allNodeDatas.forEach(data => {
      // 更新top和left，保持节点相对于中心的相对位置不变
      // 由于画布扩大，所有坐标需要加上中心偏移量
      data.left += centerOffset;
      data.top += centerOffset;
      
      // 更新x和y坐标（相对于中心的坐标）
      // x = left - center, y = center - top
      data.x = data.left - newCenter;
      data.y = newCenter - data.top;
      
      // 更新对应的DOM节点位置
      let node = this.allNodes.find(n => n.id === data.id);
      if(node){
        node.style.left = data.left + 'px';
        node.style.top = data.top + 'px';
      }
    });
  };

  //修改画布缩放级别
  // zoom: 缩放值
  // e: 鼠标事件对象（可选）
  // skipAttributeUpdate: 是否跳过更新 data-flow-viewzoom 属性（用于防止循环触发，默认false）
  reViewBoxZoom(zoom,e,skipAttributeUpdate = false){
    let oldZoom = this.oldZoom;
    
    // 在应用缩放之前立即获取滚动值，避免延迟导致的值不准确
    let flowOldTop = this.flowBox.scrollTop;
    let flowOldLeft = this.flowBox.scrollLeft;
    
    //鼠标相当于画布的坐标值
    let mouseRenderXY = e ? this.toRenderXY(e) : null;
    let mouseOldTop = mouseRenderXY ? mouseRenderXY.top : 0;
    let mouseOldLeft = mouseRenderXY ? mouseRenderXY.left : 0;
    
    // 应用缩放范围限制
    zoom = parseFloat(zoom);
    zoom = zoom > this.zoomRange.max ? this.zoomRange.max : zoom;
    zoom = zoom < this.zoomRange.min ? this.zoomRange.min : zoom;
    zoom = Math.round(zoom * 10)/10;
    
    this.editorBox.style.zoom = zoom;
    this.lineBox.style.zoom = zoom;
    this.zoom = zoom;
    getElementMix('setzoom').value = Math.floor(zoom * 100);

    // 如果不是跳过属性更新（即手动调用），则更新 data-flow-viewzoom 属性
    if(!skipAttributeUpdate){
      this.flowBox.setAttribute('data-flow-viewzoom', zoom);
      // 设置鼠标事件数据（如果有）
      if(e){
        this.flowBox.setAttribute('data-flow-viewMouse', JSON.stringify({
          clientX: e?.clientX,
          clientY: e?.clientY,
          pageX: e?.pageX,
          pageY: e?.pageY,
          screenX: e?.screenX,
          screenY: e?.screenY
        }));
      }
    }

    // 检查是否需要扩大视窗
    this.checkAndExpandViewBox(zoom);

    // 如果没有鼠标事件（如视窗大小变化时），直接将滚动条居中即可
    if (!e) {
      let flowBox = this.flowBox;
      // 使用已知的 viewBoxSize.current 计算居中位置，而不是依赖 scrollWidth/scrollHeight
      // 使用 requestAnimationFrame 确保布局已经更新后再设置滚动位置
      requestAnimationFrame(() => {
        flowBox.scrollLeft = (this.viewBoxSize.current - flowBox.clientWidth) / 2;
        flowBox.scrollTop = (this.viewBoxSize.current - flowBox.clientHeight) / 2;
      });
      return;
    }

    // 计算缩放后的偏移量，保持鼠标指向的点位置不变
    let scaleRatio = zoom / oldZoom;
    // 修正：newLeft 应该使用 mouseOldLeft，newTop 应该使用 mouseOldTop
    let newLeft = flowOldLeft + mouseOldLeft * (scaleRatio - 1);
    let newTop = flowOldTop + mouseOldTop * (scaleRatio - 1);
    this.flowBox.scrollLeft = newLeft;
    this.flowBox.scrollTop = newTop;
  };
  
  // 检查并自动扩大视窗
  checkAndExpandViewBox(zoom){
    let currentViewBoxPixelSize = this.viewBoxSize.current * zoom;
    let windowWidth = this.flowBox.offsetWidth;
    let windowHeight = this.flowBox.offsetHeight;
    
    // 如果缩放后的视窗小于窗口，需要扩大视窗
    if(currentViewBoxPixelSize < windowWidth || currentViewBoxPixelSize < windowHeight){
      // 计算需要的视窗大小（逻辑尺寸）
      let requiredSize = Math.max(
        Math.ceil(windowWidth / zoom),
        Math.ceil(windowHeight / zoom)
      );
      
      // 保持正方形，取较大值，并限制在最大值内
      requiredSize = Math.min(requiredSize, this.viewBoxSize.max);
      requiredSize = Math.max(requiredSize, this.viewBoxSize.default);
      
      // 如果需要的尺寸大于当前尺寸，则扩大
      if(requiredSize > this.viewBoxSize.current){
        this.flowBox.setAttribute('data-flow-viewwidth', requiredSize);
        // reViewBoxSize 会自动被 MutationObserver 调用
      }
    }
  };

  //修改节点尺寸
  reNodeSize(node){
    let data = this.allNodeDatas.find(item => item.id == node.id);
    // 应用像素吸附到尺寸
    data.width = this.snapToGrid(node.offsetWidth);
    data.height = this.snapToGrid(node.offsetHeight);
  };

  //设置画布缩放级别
  setZoom(zoom,e){
    this.oldZoom = this.zoom;
    // 使用 zoomRange 属性限制缩放范围
    zoom = zoom > this.zoomRange.max ? this.zoomRange.max : zoom;
    zoom = zoom < this.zoomRange.min ? this.zoomRange.min : zoom;
    zoom = Math.round(zoom * 10)/10;
    this.flowBox.setAttribute('data-flow-viewzoom',zoom);
 
    this.flowBox.setAttribute('data-flow-viewMouse', JSON.stringify({
      clientX: e?.clientX,
      clientY: e?.clientY,
      pageX: e?.pageX,
      pageY: e?.pageY,
      screenX: e?.screenX,
      screenY: e?.screenY
    }));
    this.zoom = zoom;
  };

  // ========== 工具函数 ==========

  // 像素吸附函数，以10px为步长
  snapToGrid(value, step = 10){
    return Math.round(value / step) * step;
  };

  //计算鼠标相对于画布的坐标值
  toRenderXY(e){
    //计算视口的top/left
    let rect = this.editorBox.getBoundingClientRect();
    //计算鼠标相对视口的top/left
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    //计算以左上角为原点的
    let x = (mouseX - rect.left) + this.editorBox.scrollLeft;
    let y = (mouseY - rect.top) + this.editorBox.scrollTop;
    //以画布中心为原点记录
    let zoom = this.zoom;
    let x4 = x - this.editorBox.offsetWidth*zoom/2;
    let y4 = (y - this.editorBox.offsetWidth*zoom/2)*-1;
    return {top:y, left:x, x:x4, y:y4};
  };

  //动态修改模拟框选区域的容器尺寸
  reAreaSize(e,area,selectStartX,selectStartY){
    let areaW = e.clientX - selectStartX;
    let areaH = e.clientY - selectStartY;
    if(areaW == 0 || areaH == 0 || (Math.abs(areaW) < 10 && Math.abs(areaH) < 10)) return;

    let x,y,w,h;
    if(areaW > 0){
      x = 'left: ' + selectStartX + 'px; ';
      w = 'width: ' + areaW  + 'px; ';
    } else {
      x = 'right: ' + (this.flowBox.offsetWidth - selectStartX) + 'px; ';
      w = 'width: ' + areaW * -1 + 'px; ';
    };

    if(areaH > 0){
      y = 'top: ' + selectStartY + 'px; ';
      h = 'height: ' + areaH  + 'px; ';
    } else {
      y = 'bottom: ' + (this.flowBox.offsetHeight + 100 - selectStartY) + 'px; ';
      h = 'height: ' + areaH * -1 + 'px; ';
    };

    area.setAttribute('style', 'display: block; ' + x + y + w + h);
    return [areaW,areaH];
  };

  //判断节点是否在框选区域内
  isInArea([x,y,w,h],node){
    let data = this.allNodeDatas.find(item => item.id == node.id);
    let [nodeX,nodeY,nodeW,nodeH] = [data.x,data.y,node.offsetWidth,node.offsetHeight];
    return (nodeX >= x && nodeX + nodeW <= x + w && nodeY <= y && nodeY - nodeH >= y - h);
  };

  //添加多语言内容
  //parent: 父元素
  //texts: 多语言内容
  //tagname: 标签名
  //isRun: 是否是在初始化时添加的
  //返回值: 多语言元素
  addDiffLanguage(parent,texts,tagname,isRun){
    let language = ROOT.getAttribute('data-language');
    tagname = tagname ? tagname : 'div';
    let diff = document.createElement(tagname);
    let type = 'text';
    //初始化时不需要考虑语言
    let text = isRun ? texts[0] : language == 'Zh' ? texts[0] : texts[1] ;
    switch (tagname){
      case 'div': 
      diff.textContent = text;
      diff.setAttribute('data-zh-' + type,texts[0]);
      diff.setAttribute('data-en-' + type,texts[1]);
      break
      case 'input': 
      diff.value = text;
      diff.setAttribute('data-input-must',texts[0]);
      diff.setAttribute('data-input-must-en',texts[1]);
      break
      default :
      diff.textContent = text;
      diff.setAttribute('data-zh-' + type,texts[0]);
      diff.setAttribute('data-en-' + type,texts[1]);
    };
    parent.appendChild(diff);
    return diff;
  };

  //错误提示
  //type: 错误类型
  //返回值: 错误提示
  Error(type){
    switch (type){
      case 'noFlowBox':

      break
      case 'voidConnect':

      break
      default :
      tipsAll(['未知错误：' + type,'Unknown Error: ' + type],2000) 
      console.log(type);
    };
  };
};



window.addEventListener('load',()=>{
  if(ISMOBILE || window.innerWidth <= 750){

  } else {

  };

});

window.addEventListener('resize',/*防抖*/debounce(()=>{
  FLOW_RENDER.reViewBoxZoom(1);
},500));


window.addEventListener('blur',()=>{
  rightBtn.forEach(item => {
    item.style.display = 'none';
  });
});


let FLOW_RENDER = new ZY_NODE(null,null,true,null,{min: 0.1, max: 2});

getElementMix('data-zoom-auto').addEventListener('click',()=>{
  FLOW_RENDER.reViewBoxZoom(1)
});

let allImgUrl = [
  ["img/icon_mod_gufeng_en.png","img/icon_mod_gufeng.png"],
  ["img/icon_mod_jianghu_en.png","img/icon_mod_jianghu.png"],
  ["img/icon_mod_shufa_en.png","img/icon_mod_shufa.png"],
  ["img/icon_mod_jingdian_en.png","img/icon_mod_jingdian.png"],
  ["img/icon_mod_anhei_en.png","img/icon_mod_anhei.png"],
  ["img/icon_mod_yinghe_en.png","img/icon_mod_yinghe.png"],
  ["img/icon_mod_youqu_en.png","img/icon_mod_youqu.png"],
  ["img/icon_mod_weimei_en.png","img/icon_mod_weimei.png"],
  ["img/icon_mod_huali_en.png","img/icon_mod_huali.png"]
];
setTimeout(()=>{
  getElementMix('data-model-pick').querySelectorAll('[data-radio]').forEach(radio => {
    if(radio.getAttribute('data-radio-data')*1 > 1){
      let num = radio.getAttribute('data-radio-data') * 1 - 2;
      let imgs = radio.querySelectorAll('img');
      imgs.forEach((item,index) => {
        item.setAttribute('src',allImgUrl[num][index]);
      });
    };
  });
},500)


//全局监听，修改右键事件
document.addEventListener('contextmenu',(e)=>{
  if(e.target == FLOW_RENDER.editorBox || e.target == flowBoxRightbtn){
    e.preventDefault();
    flowBoxRightbtn.style.display = 'flex';
    let xys = reSafeTopLeft(e,flowBoxs,flowBoxRightbtn).xys;
    let lists = flowBoxRightbtn.querySelectorAll('[data-rightbtn-list]');
  
    lists.forEach(item => {
      let x = '',y = '';
      switch (xys[0]){
        case 'L':
          x = 'left: calc(100% + 4px); ';
        break
        case 'C':
          x = 'left: calc(100% + 4px); ';
        break
        case 'R':
          x = 'right: calc(100% + 4px); ';
        break
      };
      switch (xys[1]){
        case 'T':
          y = 'top: 0; ';
        break
        case 'C':
          y = 'top: 0; ';
        break
        case 'B':
          y = 'bottom: 0; ';
        break
      };
      item.setAttribute('style',x + y);
    });
  } else {
    flowBoxRightbtn.style.display = 'none';
  };
  if(e.target == modList || modList.contains(e.target)){
    e.preventDefault();
  };
  
});
//全局监听，关闭浮层
document.addEventListener('click',(e) => {
  let closeNodes = [];
  let closeNexts = [];
  
  let rightBtnListCloses = Array.from(rightBtnList).map(item =>  [item.parentNode,item]);

  closeNodes.push(...Array.from(rightBtn));
  closeNexts.push(...rightBtnListCloses);

  closeNodes.forEach(item => {
    if(!item.contains(e.target)){
      item.style.display = 'none';
    };
  });
  closeNexts.forEach(item => {
    if(!item[0].contains(e.target)){
      item[1].style.display = 'none';
    };
  });
  //closeShowNexts(e,modList,'show-modsec-all');
});
//全局监听，修改光标
document.addEventListener('mousedown',(e)=>{
  if(e.button == 1){
    ROOT.setAttribute('data-draging','true');
    e.preventDefault()
  };
});
document.addEventListener('mouseup',(e)=>{
  if(e.button == 1){
    ROOT.setAttribute('data-draging','false');
  };
});
document.addEventListener('mouseleave',(e)=>{
  if(e.button == 1){
    ROOT.setAttribute('data-draging','false');
  };
});

//快捷键
document.addEventListener('keydown',(e) => {
  if(document.hasFocus() && document.activeElement !== document.body){
    if(e.ctrlKey && (e.key === 'o' || e.key === 'O')){
      e.preventDefault();
      //导入本地文件
    };
    if(e.ctrlKey && (e.key === 's' || e.key === 'S')){
      e.preventDefault();
      //导出为本地文件
    };
    if(e.ctrlKey && e.shiftKey && (e.key === 's' || e.key === 'S')){
      e.preventDefault();
      //仅导出数据
    };
    if(e.ctrlKey && e.key === '\\'){
      e.preventDefault();
      //隐藏/显示所有菜单
    };
    if(e.ctrlKey && (e.key === 'a' || e.key === 'A')){
      e.preventDefault();
      //全选
    };
    if(e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A')){
      e.preventDefault();
      //反选
    };
    if(e.ctrlKey && (e.key === 'r' || e.key === 'R')){
      e.preventDefault();
      //刷新数据
    };
  }else{
    if(e.key === 'Delete' || e.key === 'Backspace'){
      e.preventDefault();
      FLOW_RENDER.pickNodes.forEach((node,index) => {
        FLOW_RENDER.removeNode(node);
        delete FLOW_RENDER.pickNodes[index];
      });
    };
  }
  
});

//生成安全的坐标
function reSafeTopLeft(event,area,node){
  let popW = node.offsetWidth;
  let maxX = area.offsetWidth - popW;
  let popH = node.offsetHeight;
  let maxY = area.offsetHeight - popH;
  let X = Math.min(event.clientX,maxX);
  let Y = Math.min(event.clientY,maxY);
  X = X == maxX ? event.clientX - popW : X;
  Y = Y == maxY ? event.clientY - popH : Y;
  node.style.left = X;
  node.style.top = Y;
  //返回九宫象限
  let xys = ['L','T']
  if(X >= (maxX + popW)/3){
    xys[0] = 'C'
  };
  if(X >= (maxX + popW)/1.5){
    xys[0] = 'R'
  };
  if(Y >= (maxY + popH)/3){
    xys[1] = 'C'
  };
  if(Y >= (maxY + popH)/1.5){
    xys[1] = 'B'
  };
  return {x: X, y: Y, w: popW, h: popH, xys: xys}
};


function getUserColor(node){
  let color = {
    HEX:node.getAttribute('data-color-hex'),
    RGB:node.getAttribute('data-color-rgb'),
    HSL:node.getAttribute('data-color-hsl'),
    HSV:node.getAttribute('data-color-hsv'),
  }
  //console.log(color)
}

function getUserNumber(node){
  let number = node.getAttribute('data-number-value');
  //console.log(number)
}

function getUserText(node){
  let text = node.getAttribute('data-text-value');
  //console.log(text)
}

function getUserInt(node){
  let int = node.getAttribute('data-int-value');
  if(node.getAttribute('data-zoom-box') !== null){
    FLOW_RENDER.reViewBoxZoom(int/100);
  };
  //console.log(int)
};

function getUserFloat(node){
  let float = node.getAttribute('data-float-value');
  //console.log(float)
};

function getUserSelect(node){
  let userSelect = node.getAttribute('data-select-value');
};

function getUserRadio(node){
  let userRadio= node.getAttribute('data-radio-value');
  if(userRadio){
    
  }
};

