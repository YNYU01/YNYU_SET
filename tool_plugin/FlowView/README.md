Below are the steps to get your widget running. You can also find instructions at:

https://www.figma.com/widget-docs/setup-guide/

This widget template uses TypeScript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

https://nodejs.org/en/download/

Next, install TypeScript, esbuild and the latest type definitions by running:

npm install

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (widget-src/code.tsx) into JavaScript (dist/code.js)
for the browser to run. We use esbuild to do this for us.

We recommend writing TypeScript code using Visual Studio code:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
   then select "npm: watch". You will have to do this again every time
   you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.

## FlowView Widget - 流程图组件

### 功能特性

1. **节点管理**
   - 每个节点是一个可设置宽高的自动布局容器
   - 节点四个边的中间有连接点（小矩形），用于创建连接
   - 点击输出连接点可以朝指定方向创建新节点（自动克隆）

2. **连接管理**
   - 每个节点记录输入连接（in，只有一条）和输出连接（out，可以多条）
   - 连接线使用折线绘制，带有箭头指示方向
   - 连接线自动计算路径，避免重叠

3. **UI连接管理器**
   - 通过属性菜单打开连接管理器
   - 可以查看所有节点和连接
   - 支持手动连接节点（选择源节点、方向、目标节点、方向）
   - 支持断开连接

### 使用方法

1. **创建节点**：点击节点四个边的连接点（蓝色小圆点），会自动在对应方向创建新节点并建立连接

2. **查看/管理连接**：
   - 右键点击widget，选择"Open Connection Manager"
   - 在UI中选择源节点和目标节点，选择连接方向
   - 点击"Connect"按钮建立连接
   - 在连接列表中点击"Disconnect"断开连接

3. **节点属性**：
   - 每个节点可以设置宽高（通过状态管理）
   - 节点显示标签（默认为"Node X"或"Start"）

### 技术实现

- 使用 `useSyncedState` 管理节点和连接数据
- 使用 `Frame` 和 `AutoLayout` 构建节点UI
- 使用 `Line` 组件绘制连接线（三段折线）
- 使用 `Rectangle` 绘制连接点和箭头
- 通过 `figma.ui` API 实现widget和UI之间的通信
