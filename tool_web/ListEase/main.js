const flowBoxs = document.querySelector('[data-flow-viewbox]');
const flowBoxRightbtn = document.querySelector('[data-rightbtn-flewbox]');
const modList = document.querySelector('[data-flow-modlist]');
const modelAll = document.querySelector('[data-flow-model-all]');
const rightBtn = document.querySelectorAll('[data-rightbtn]');
const rightBtnList = document.querySelectorAll('[data-rightbtn-list]');


/*监听组件的自定义属性值，变化时触发函数，用于已经绑定事件用于自身的组件，如颜色选择器、滑块输入框组合、为空自动填充文案的输入框、导航tab、下拉选项等*/
let mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if(mutation.type === 'attributes'){
      switch(mutation.attributeName){
        case 'data-color-hex':getUserColor(mutation.target); break;
        case 'data-number-value':getUserNumber(mutation.target); break;
        case 'data-text-value':getUserText(mutation.target); break;
        case 'data-select-value':getUserSelect(mutation.target); break;
        case 'data-flow-viewwidth':
          FLOW_RENDER.reViewBoxSize(mutation.target.getAttribute('data-flow-viewwidth')); 
        break;
        case 'data-flow-viewzoom':
          FLOW_RENDER.reViewBoxZoom(mutation.target.getAttribute('data-flow-viewzoom')); 
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
  constructor(flowBox,flowNodesBox,isInit,allNodeDatas) {
    /*节点容器*/
    this.flowBox = flowBox && getElementMix(flowBox) ? getElementMix(flowBox) : document.querySelector('[data-flow-viewbox]') || this.Error('noFlowBox');
    this.flowNodesBox = flowNodesBox && getElementMix(flowNodesBox) ? getElementMix(flowNodesBox) : document.querySelector('[data-flow-allnodes]') || this.Error('noflowNodesBox');
    /*基础参数*/
    this.flowNodes = [
      {
        modsec: ['基础','base'],
        nodes:[
          {
            type:["主标题","main title"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
              {className: 'df-sc',items:['INPUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            width:140,
            height:140,
            ins:[{id:'01',link:['INPUT:01',false],inType:['STRING','CODE']}],
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
            type:["定制主标题","main title pro"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
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
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["定制副标题","sub title pro"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
          {
            type:["主背景图","background"],
            layout:[
              {className: 'df-sc',items:['IN:01','OUT:01']},
            ],
            create:0,
            reduce:0,
            id:'',
            x:0,
            y:0,
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
            width:140,
            height:140,
            ins:[{id:'01',inType:['FILE','CODE']}],
            outs:[{id:'01',to:'',outType:'NODE'}],
            inputs:[],
          },
        ],
      },
    ];
    this.allNodeDatas = allNodeDatas ? this.addNode(allNodeDatas) : [];
    this.allNodes = [];
    this.pickNodes = [];
    /*初始化控制*/
    this.selectArea = document.querySelector('[data-selectarea]') || this.creSelectarea();
    this.isInit = isInit ? this.init() : null;
    this.editorBox = document.querySelector('[data-flow-editorbox]') || this.isInit[0];
    this.lineBox = document.querySelector('[data-flow-linebox]') || this.isInit[1];
  }

  creSelectarea(){
    let selectArea = document.createElement('div');
    selectArea.setAttribute('data-selectArea');
    selectArea.className = 'pos-a';
    selectArea.setAttribute('style','display: none;');
    document.querySelector('body').appendChild(selectArea);
    return selectArea;
  }

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
    mutationObserver.observe(this.flowBox,config_flowBox);
    //最小4096，默认为窗口最大边的3倍
    let maxWH = Math.max(Math.ceil(this.flowBox.offsetWidth/1024)*2048,Math.ceil(this.flowBox.offsetHeight/1024)*1024,4096);
    this.flowBox.setAttribute('data-flow-viewwidth',maxWH);
    //移动视图到中心点
    requestAnimationFrame(()=>{
      this.flowBox.scrollTop = (maxWH - this.flowBox.offsetHeight)/2;
      this.flowBox.scrollLeft = (maxWH - this.flowBox.offsetWidth)/2; 
    });

    //生成节点栏,带拖拽事件
    this.flowNodes.forEach((list,index) => {
      let input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = true;
      input.id = 'show_modsec_' + index;
      this.flowNodesBox.appendChild(input);

      let label = document.createElement('label');
      label.setAttribute('for',input.id);
      label.className = 'show-next';
      this.addDiffLanguage(label,list.modsec,true);
      this.flowNodesBox.appendChild(label);

      let modsec = document.createElement('div');
      modsec.className = 'df-ffc';
      modsec.setAttribute('data-flow-modsec',index);
      list.nodes.forEach(item => {
        let nodetag = this.addDiffLanguage(modsec,item.type,true);
        nodetag.className = 'df-lc'
        nodetag.setAttribute('data-flow-node','');
        nodetag.setAttribute('draggable','true');
        nodetag.addEventListener('dragstart',(e)=>{
          e.dataTransfer.setData('text/plain',JSON.stringify({modsec:list.modsec,...item}))
        })
      });
      this.flowNodesBox.appendChild(modsec);
    });

    const {flowBox,editorBox,lineBox} = this

    //移动视图、通过选区选中节点
    let selectStartX = 0;
    let selectStartY = 0;
    let moveStartX = 0;
    let moveStartY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;
    let isSelecting = false;
    let isMoving = false;

    flowBox.addEventListener('mousedown', (e) => {
      if (e.button === 0 && (e.target === this.flowBox || e.target === this.editorBox || e.target === this.lineBox)) {
        [selectStartX, selectStartY] = [e.clientX, e.clientY];
        isSelecting = true;
        e.preventDefault();
      };
      if (e.button === 1) {
        [moveStartX, moveStartY] = [e.clientX, e.clientY];
        [scrollLeft,scrollTop] = [this.flowBox.scrollLeft, this.flowBox.scrollTop];
        isMoving = true;
        e.preventDefault();
      };
      if((e.button === 0 || e.button === 2) && e.target == this.editorBox){
        this.pickNodes.forEach(pick => {
          pick.setAttribute('data-node-pick','false')
        });
      };
    });

    flowBox.addEventListener('mousemove',(e)=>{
      if(isSelecting){
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

        this.selectArea.setAttribute('style', 'display: block; ' + x + y + w + h);
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
      [selectStartX,selectStartY] = [0,0];
      [moveStartX,moveStartY] = [0,0];
      isSelecting = false;
      isMoving = false;
    });

    //控制画布缩放级别
    flowBox.addEventListener('wheel',(e)=>{
      e.preventDefault();
      let oldZoom = flowBox.getAttribute('data-flow-viewzoom');
      let step = e.deltaY > 0 ? -0.1 : 0.1
      let zoom = oldZoom*1 + (Math.round(Math.abs(e.deltaY)/100) * step);
      zoom = zoom > 2 ? 2 : zoom;
      zoom = zoom < 0.5 ? 0.5 : zoom;
      zoom = Math.round(zoom * 10)/10;
      flowBox.setAttribute('data-flow-viewzoom',zoom)
    });
    
    //拖拽生成节点元素
    let isDraging = false;
    editorBox.addEventListener('dragenter',(e)=>{
      e.preventDefault();
      isDraging = e.target == this.editorBox ? true :false;
    });
    editorBox.addEventListener('dragleave',(e)=>{
      e.preventDefault();
      isDraging = false;
    });
    editorBox.addEventListener('dragover',(e)=>{
      e.preventDefault();
    });
    editorBox.addEventListener('drop',(e)=>{
      e.preventDefault();
      if(isDraging){
        let data = JSON.parse(e.dataTransfer.getData('text/plain'));
        let mod = this.flowNodes.find(m => m.modsec[1] == data.modsec[1]);
        let nod = mod.nodes.find(n => n.type[1] == data.type[1]);
        data.id = data.type[1].replace(/\s+/g,'') + (nod.create + 1).toString().padStart(3, '0');;
        //记录当前类型节点的创建操作次数
        nod.create++;
        //隐去实际节点数据中的记录值
        delete data.create;
        delete data.reduce;
        this.addNode([data]);
        this.toRenderXY(e)
      };
      isDraging = false;
    });

    return [editorBox,lineBox]
  };

  addNode(nodeDatas){
    nodeDatas.forEach((data,index) => {
      let nodeBox = document.createElement('div');
      nodeBox.setAttribute('data-node-modsec',data.modsec[1]);
      nodeBox.setAttribute('data-node-type',data.type[1]);
      nodeBox.setAttribute('data-resize-type','node');
      nodeBox.setAttribute('data-node-pick','false');
      nodeBox.className = 'df-ffc pos-a';
      nodeBox.id = data.id;

      let nodeMix = document.createElement('div');
      nodeMix.setAttribute('data-node-mix','');
      nodeMix.className = 'pos-r h100 df-ffc';

      let nodeTop = this.addDiffLanguage(nodeMix,data.type);
      nodeTop.setAttribute('data-node-top','');
      nodeTop.className = 'pos-r';

      data.layout.forEach(row => {
        let line = document.createElement('div');
        line.setAttribute('data-node-line','');
        line.className = row.className;
        row.items.forEach(item => {
          let [type,id] = item.split(':');
          switch (type){
            case 'IN':
              let inInfo = data.ins.find(ins => ins.id == id);
              let nodein = document.createElement('div');
              nodein.className = 'df-lc';
              nodein.setAttribute('data-node-in',data.id + '_in_' + id);
              let indot = inInfo.link ? addCheck('in',inInfo.link) : addCheck('in');
              nodein.appendChild(indot[0]);
              nodein.appendChild(indot[1]);
              this.addDiffLanguage(nodein,['输入','in']);
              line.appendChild(nodein);
            break
            case 'OUT':
              let nodeout = document.createElement('div');
              nodeout.className = 'df-lc';
              nodeout.setAttribute('data-node-out',data.id + '_out_' + id);
              let outdot = addCheck('out');
              this.addDiffLanguage(nodeout,['输出','out']);
              nodeout.appendChild(outdot[0]);
              nodeout.appendChild(outdot[1]);
              line.appendChild(nodeout);
            break
            case 'INPUT':
              let inputInfo = data.inputs.find(input => input.id == id);
              let nodeInput;
              if(inputInfo.must){
                nodeInput = this.addDiffLanguage(line,inputInfo.must,'input');
              }else{
                nodeInput = document.createElement('input');
                line.appendChild(nodeInput);
              };
              nodeInput.type = 'text';
              nodeInput.className = 'nobod'
              nodeInput.setAttribute('data-input','');
              nodeInput.setAttribute('data-input-type','text');
              nodeInput.setAttribute('data-node-input',data.id + '_input_' + id);
            break
            case 'TEXT':
              this.addDiffLanguage(line,data.texts.find(text => text.id == id).value);
            break
          };

          function addCheck(type,link){
            let check = document.createElement('input');
            check.type = 'checkbox';
            check.id = data.id + '_' + type + '_' + id + '_dot';
            let checkbtn = document.createElement('label');
            checkbtn.setAttribute('for',check.id)
            checkbtn.setAttribute('data-node-dot','');
            checkbtn.className = 'check';
            checkbtn.innerHTML = '<btn-check></btn-check>'

            if(link){
              let [type,id] = link[0].split(':');
              switch (type){
                case 'INPUT':
                  check.addEventListener('change',()=>{
                    let linkInput = nodeMix.querySelector(`[data-node-input="${data.id + '_input_' + id}"]`);
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
        });

        nodeMix.appendChild(line)
      });
      nodeBox.appendChild(nodeMix);

      this.allNodeDatas.push(data);
      this.allNodes.push(nodeBox);
      this.editorBox.appendChild(nodeBox);
      //监听样式（大小）变化，以便修改参数；
      resizeObserver.observe(nodeBox);
      let isDuplicate = false;
      nodeBox.addEventListener('mousedown',(e)=>{
        if(e.button === 1) return;
        if(!e.ctrlKey){
          this.pickNodes.forEach(pick => {
            pick.setAttribute('data-node-pick','false')
          });
          this.pickNodes = [];
        };
        this.pickNodes.push(nodeBox);
        nodeBox.setAttribute('data-node-pick','true');
        if(e.altKey){
          isDuplicate = true;
        };
      });
      nodeBox.addEventListener('mousemove',(e)=>{
        if(isDuplicate){
          debounce(()=>{
            nodeBox.setAttribute('draggable','true');
          },500,true);
        };
      });
      nodeBox.addEventListener('mouseup',(e)=>{
        nodeBox.setAttribute('draggable','false');
        isDuplicate = false;
      });
      nodeBox.addEventListener('mouseleave',(e)=>{
        nodeBox.setAttribute('draggable','false');
        isDuplicate = false;
      });
      nodeBox.addEventListener('contextmenu',(e)=>{
        e.preventDefault();
      });
    });
    //重置绑定
    COMP_MAIN();
  };

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
    let zoom = this.flowBox.getAttribute('data-flow-viewzoom')//window.getComputedStyle(this.editorBox).zoom
    let x4 = x - this.editorBox.offsetWidth*zoom/2;
    let y4 = (y - this.editorBox.offsetWidth*zoom/2)*-1;
    //console.log([x,y,x4,y4,this.editorBox.offsetWidth])
    return {top:y, left:y, x:x4, y:y4};
  }

  pickByArea([x,y,w,h]){

  }

  reViewBoxSize(wh){
    this.editorBox.style.width = wh;
    this.editorBox.style.height = wh;
    this.lineBox.style.width = wh;
    this.lineBox.style.height = wh;
  }

  reViewBoxZoom(zoom){
    this.editorBox.style.zoom = zoom;
    this.lineBox.style.zoom = zoom;
    //移动视图到中心点
    requestAnimationFrame(()=>{
      this.flowBox.scrollTop = (this.editorBox.offsetWidth * zoom - this.flowBox.offsetHeight)/2;
      this.flowBox.scrollLeft = (this.editorBox.offsetWidth * zoom - this.flowBox.offsetWidth)/2; 
    });
  }

  reNodeSize(node){
    let data = this.allNodeDatas.find(item => item.id == node.id);
    data.width = node.offsetWidth;
    data.height = node.offsetHeight;
    //console.log(this.allNodeDatas)
  }

  //====工具函数===//

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

  Error(type){
    switch (type){
      case 'noFlowBox':

      break
      case 'voidConnect':

      break
      default :
      tipsAll(['未知错误：' + type,'Unknown Error: ' + type],2000) 
      console.log(type);
    }
  };
};


window.addEventListener('load',()=>{
  document.getElementById('noise').className = 'tex-noise';
  if(ISMOBILE || window.innerWidth <= 750){

  } else {

  }

});

window.addEventListener('resize',/*防抖*/debounce(()=>{

},500));


window.addEventListener('blur',()=>{
  rightBtn.forEach(item => {
    item.style.display = 'none';
  });
});


let FLOW_RENDER = new ZY_NODE(null,null,true);

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


let userEvent_color = document.querySelectorAll('[data-color]');
userEvent_color.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-color-hex']};
  mutationObserver.observe(item,config);
});
let userEvent_number = document.querySelectorAll('[data-number]');
userEvent_number.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-number-value']};
  mutationObserver.observe(item,config);
});
let userEvent_text = document.querySelectorAll('[data-text]');
userEvent_text.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-text-value']};
  mutationObserver.observe(item,config);
});
let userEvent_select = document.querySelectorAll('[data-select]');
userEvent_select.forEach(item => {
  let config = {attributes:true,attributeFilter:['data-select-value']};
  mutationObserver.observe(item,config);
});


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
  if(node.getAttribute('data-egfont-size') !== null){
    ROOT.style.setProperty('--egfont-size',number + 'px');
    //console.log(number + 'px')
  }
  //console.log(number)
}

function getUserText(node){
  let text = node.getAttribute('data-text-value');
  if(node.getAttribute('data-egfont-text') !== null){
    let egfont = document.querySelectorAll('[data-egfont]');
    egfont.forEach(item => {
      item.textContent = text;
    })
  }
  //console.log(text)
}

function getUserSelect(node){
  let select = node.getAttribute('data-select-value');
  //console.log(text)
}


