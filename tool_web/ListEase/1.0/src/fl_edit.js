
/*---------------从数据生成节点----------------------*/

function addFlowEditor(userImgData){
    
    var graph = new LGraph();   
    var canvas = new LGraphCanvas("#model-flow", graph);
    canvas.show_info = false;
    graph.start()

    //示例数据
    var node_input1 = LiteGraph.createNode("imginfo/string","文案");
    node_input1.pos = [200,200];
    node_input1.setValue("示例文案") 
    graph.add(node_input1);


    var node_input3 = LiteGraph.createNode("imginfo/main");
    node_input3.pos = [500,200];
    graph.add(node_input3);

    var node_input2 = LiteGraph.createNode("imginfo/string");
    node_input2.pos = [200,300];
    node_input2.setValue("示例文案") 
    graph.add(node_input2);

    node_input1.connect(0, node_input3, 0 );
    node_input2.connect(0, node_input3, 1 );

}