### v0.1.9 2026/5/1
- 🐞 Fix: Sheet page > Fixed issue where component properties of nested instances could not be retrieved correctly; 🐞 修复：表单页>修复获取组件属性时无法正确获取嵌套实例的属性的问题
- 🐞 Fix: Sheet page > Fixed misalignment when mapping properties of repeated nested instance components; 🐞 修复：表单页>修复映射内嵌重复实例组件属性时错位问题
- ⚡ Optimize: Sheet page > Mapping data for component properties and tag attributes can now be used together; ⚡ 优化：表单页>组件属性和标签属性的映射数据可以混合使用
- ⚡ Optimize: Sheet page > When applying table themes, the plugin now records color values and styles for easier modification upon reselection (note: manually modified color values are not cached); ⚡ 优化：表单页>应用表格主题时，插件会记录色值和风格，便于再次选中修改，但需注意，手动修改的色值不会缓存

### v0.1.8 2026/4/10
- 🐞 Fix: Sheet page > Tag attributes, fixed mismatch between reading order and mapping order; 🐞 修复：表单页>标签属性读取/映射, 修复读取顺序和映射顺序不匹配的问题
- ⚡ Optimize: Top > Function search, optimized matching logic, can also match the page name; ⚡ 优化：顶部栏>功能搜索, 优化了匹配逻辑, 还可以匹配页面名称
- ⚡ Optimize: Create page > Create frame > When filling selected elements into frame, no longer forcibly modifies dimensions, but scales proportionally to fit; ⚡ 优化：创建页>创建画板>填充选中元素到画板时, 不再强制修改尺寸, 会等比缩放以充满画板
- ✨ New: More Tools page > Layers & Layout, cloning elements to multiple frames now has "Fill" and "Fit" modes, similar to image fill modes; ✨ 新增：更多功能页>图层&布局, 克隆元素到多个画板分为“填充”和“适应”两种模式, 与图片的填充模式类似
- ✨ New: Variables page > Styles sheet Management is now open for testing, allows style grouping via @set tag for quick theme switching; ✨ 新增：变量页>样式（表）管理现已开放测试, 可基于@set标签实现类似变量组的样式分组功能, 快速切换样式主题
- ✨ New: Variables page > Styles sheet Management > Sheet to Styles, based on selected @table:style for batch adding style groups; ✨ 新增：变量页>样式（表）管理>从表更新样式, 可根据选中的@table:style样式表, 更新样式, 方便批量添加样式组
- ✨ New: Variables page > Styles sheet Management > Identify and switch style groups, identifies @set style groups and checks for colors not included in all themes to ensure smooth switching; ✨ 新增：变量页>样式（表）管理>识别并切换样式组, 可识别带@set样式组的样式, 并排查是否存在未包含在所有主题的颜色进行修复, 以保证顺利切换样式组

### v0.1.7 2026/4/3
- ⚡ Optimize: Export page > Upload by export settings, fallback to default settings when no supported format exists; ⚡ 优化：导出页>按导出设置上传, 当不存在支持格式时回退默认设置
- ⚡ Optimize: Export page > Upload, attempt to get target file format and size from naming (e.g. jpg/1234k), priority higher than cache; ⚡ 优化：导出页>上传, 尝试从命名中获取目标文件格式和目标文件大小, 如jpg/1234k, 且优先级高于缓存
- ✨ New: Export page > Manage render queue, clicking "Override Settings" syncs modified export settings and naming to local settings (won't trigger cache if format/size is from naming), use with caution; ✨ 新增：导出页>管理渲染队列, 当目标文件格式和目标文件大小是从命名中获取时不会触发缓存, 或者想将修改过的导出设置和命名同步到本地设置, 此时可以点击覆盖设置, 需谨慎使用
- ✨ New: Variables page > Unlink styles management (Beta), now open for testing, allows migrating styles across files by comparing unlinked styles with current file style names and re-establishing associations; ✨ 新增：变量页>断链样式管理, 现已开放测试, 可用于跨文件迁移样式, 将断开链接的样式与当前文件样式名比对并重新建立关联
- 🐞 Fix: More Tools page > Split text, fixed segmentation misalignment when splitting by keywords; 🐞 修复：更多功能页>拆分文本, 修复按关键词拆分时分段错位的问题
- 🐞 Fix: Sheet page > Data get > Tag attributes, fixed failure to get when remote styles exist, now supported; modifying remote styles to local via tag attributes is roughly equivalent to unlink styles management in Variables page; 🐞 修复：表单页>数据获取>标签属性, 当存在远程样式时会导致获取失败, 现已支持获取, 通过标签属性修改远程样式为本地样式约等于变量页的断链样式管理

### v0.1.6 2026/3/27
- 🐞 Fix: Sheet page > Data mapping > Settings - fixed incorrect placeholder behavior for empty values when mapping text properties; 🐞 修复：表单页>数据映射>高级设置, 修复文本属性映射时空值占位符异常问题
- ⚡ Optimize: Sheet page > Data mapping > Settings - non-auto-layout instances now also clone/reduce based on data length; ⚡ 优化：表单页>数据映射>高级设置, 非自动布局也支持根据数据长短增减实例
- ⚡ Optimize: Variables page > Added tabs to switch and manage styles set vs unlink styles; ⚡ 优化：变量页>新增标签以切换管理样式组和断链样式
- ✨ New: Create page > When creating frame with one selected layer, the layer will be auto-filled into the frame 新增：创建页>创建画布时如选中一个元素, 会填充到画布中

### v0.1.5 2026/3/3
- 🐞 Fix: More Tools page > Skew/Stretch caused rotation value to reset; 🐞 修复：更多功能页>斜切拉伸会导致旋转值重置的问题
- ⚡ Optimize: Sheet page > Get/Map component properties now supports nested repeated instances and index-based suffixes (e.g. xxx[1] for the first occurrence); ⚡ 优化：表单页>获取/映射组件属性支持内嵌重复实例, 并按图层顺序标识, 如xxx表示所有xxx属性, 而xxx[1]表示第一个出现的xxx属性
- ✨ New: Sheet page > Get/Map tag properties now supports variant properties using header #xxx.instance; ✨ 新增：表单页>获取/映射标签属性支持变体属性,表头使用#xxx.instance
- ⚡ Optimize: Create page > .xls format is no longer supported, related description removed; ⚡ 优化：创建页>不支持.xls格式, 已删除相关说明

### v0.1.4 2026/2/5
- 🐞 Fix: More Tools page > Selected layer info not displayed; 🐞 修复：更多功能页>选中图层时未显示对应信息的问题
- 🐞 Fix: More Tools page > In-place rasterize not working; 🐞 修复：更多功能页>原地栅格化失效问题
- 🐞 Fix: More Tools page > Skew/stretch had no effect on text, and clicking the All Reset button caused crash; 🐞 修复：更多功能页>斜切拉伸对文字无效以及点击重置全部会导致错误崩溃的问题
- 🐞 Fix: Create page > MD to layer - width incorrectly falling back to 100px; 🐞 修复：创建页>md格式转图层, 宽度异常回退为100px的问题
- ✨ New: Sheet page > Apply theme - can enable live mode; color/theme changes apply immediately (may be laggy, use only for preview when needed); ✨ 新增：表单页>应用主题, 可以开启实时模式, 切换色值和主题风格时会直接应用, 但相对卡顿, 仅适用于必要的效果预览对比, 慎用
- ✨ New: Sidebar > Click version number to jump to changelog; ✨ 新增：侧边栏>点击版本号可直达版本日志
- ⚡ Optimize: Create page > Get artboard info from layer - width/height rounded to 2 decimals to avoid float precision; ⚡ 优化：创建页>从图层获取画板信息, 宽高仅保留两个小数点, 避免浮点数精度问题
- ⚡ Optimize: Sheet page > Theme settings - gray theme colors no longer generate saturated palette; ⚡ 优化：表单页>主题设置, 主题色为灰色系时不会再生成带饱和度的配色

### v0.1.3 2026/1/23
- ✨ New: Sidebar - Can view current version and last update time; ✨ 新增: 侧边栏可查看当前版本及最后更新时间
- 🐞 Fix: Sheet page > Data Get/Map - Fixed issue where data get/map functionality was not working properly; 🐞 修复: 表单页>数据获取/映射失灵问题
- ⚡ Optimize: Sheet page > Apply Preset Styles - Removed apply button, when table is selected, can directly click style options to control fill/stroke; ⚡ 优化: 表单页>应用预设样式, 去掉应用按钮, 当选中表格时, 可以直接点击样式选项来控制填充/描边
- ⚡ Optimize: Sheet page > Cell selection operations, row/column reversal, etc. - Changed to more intuitive icon buttons with text hints; ⚡ 优化: 表单页>单元格选中操作, 反转行列等, 转为更方便理解的, 带文字提示的图标按钮
- ⚡ Optimize: Sheet page > Cell Component - Can not only supplement necessary elements based on existing elements and bind component properties, but also correct table components generated by old version plugins to new version components without affecting instances, to support new version plugin's data mapping logic; ⚡ 优化: 表单页>单元格化组件, 不但可以基于已有元素补足必要元素并绑定组件属性, 还能将旧版本插件生成的表格组件, 在不影响实例的情况下矫正为新版本的组件, 以支持新版本插件的数据映射逻辑
- ✨ New: Sheet page > Random Theme - Changed to richer table theme settings, placed next to table style settings; ✨ 新增: 表单页>随机主题改为更丰富的表格主题设置, 并紧挨着表格样式设置
- 🐞 Fix: Export page > Render Queue Management - Fixed issue where checkboxes were not displayed, can now normally select labels via checkboxes for delete and re-upload operations; 🐞 修复: 导出页>渲染队列管理, 修复了为显示复选框的问题, 目前可以正常地通过复选框选择标签进行删除和重新上传的操作

### v0.1.2 2026/1/12
- ⚡ Optimize: Sheet page > Data Get/Map - Changed from 8 buttons for 4 data types to switching data type tabs, then clicking Get/Map; ⚡ 优化: 表单页>数据获取/映射, 原4种数据类型要8个按钮, 现在改为切换数据类型标签, 再点击获取/映射
- ⚡ Optimize: Sheet page > Double-click to fill sample data - Fill samples based on selected data type; ⚡ 优化: 表单页>双击填充示例数据, 按所选数据类型填充示例
- ⚡ Optimize: Sheet page > Data validation and generation settings - Merged into advanced settings and hidden by default; ⚡ 优化: 表单页>数据校验, 生成设置, 合并到高级设置并默认隐藏
- ✨ New: Sheet page > Table component source - Can toggle header option to generate tables without headers; ✨ 新增: 表单页>表格组件来源, 可以开/关表头选项, 生成不带表头的表格
- 🔄 Change: Sheet page > Row/Column count - Changed from input value add/subtract rows + input value add/subtract columns to input row/column values to set rows/columns + add/subtract rows; 🔄 修改: 表单页>行列数量, 原输入数值加减行+输入数值加减列, 改为输入行列数值设置行列+加减行

### v0.1.1 2026/1/2
- 🐞 Fix: Sheet page > Apply Preset - Fixed issue where applying table styles on the sheet page was not working properly; 🐞 修复: 表单页>应用表格样式时, 不能正常运行的问题
- 🐞 Fix: Sheet page > Expand More > All Stroke/All Fill - Fixed issue where functions like "All Stroke" and "All Fill" were overriding each other; 🐞 修复: 表单页>展开更多>全描边/全填充等功能互相覆盖的问题
- ✨ New: Create page > JSON format (by YN+ Html2zy) - Import and create elements from JSON format extracted by browser extension; ✨ 新增: 创建页>json格式（浏览器插件提取）导入创建元素
```javascript
{
    "tagName": "div",
    "id": null,
    "classes": [/*...*/],
    "position": {
      "x": 0,
      "y": 0,
      "width": 100,
      "height": 100,
      "top": 0,
      "left": 0,
      "right": 0,
      "bottom": 0,
      "scrollX": 0,
      "scrollY": 0
    },
    "styles": {/*...*/},
    "textContent": null,
    "children": [/*...*/]
}
```
- ✨ New: More Tools page > Create Style from Table Data - Create styles from tabular data; ✨ 新增: 更多功能页>从制表数据创建样式

### v0.1.0 2025/12/22
- 🎉 First release version - 70% of features available; 🎉 首发版本, 已开放70%的功能
- 🎨 Create page > Basically meets the needs of batch importing large images and creating artboards. Compatible formats are not fully available yet and will be updated gradually; 🎨 创建页>基本满足批量导入大图和创建画板需要, 兼容格式未完整开放, 会陆续更新
- 📤 Export page > Basically meets batch image export needs, and supports compressing images by specifying the target size. For a lightweight workflow, it is recommended to manage dimensions and file formats with native features. When uploading, choose upload-by-export-settings; by default it uploads only 1x PNG. Other compatible export formats are not yet available and are expected in v0.2.0; 📤 导出页>基本满足批量导出图片需求, 并指定预期大小来压缩图片, 为追求轻量化, 尺寸和后缀等建议使用原生功能管理, 并在上传时选择按导出设置上传, 按默认则只上传一倍图及PNG格式, 其他兼容格式的导出功能暂未开放, 预计0.2.0版本发布
- ✏️ Editor page > Only basic UI layout is available. Full features are expected in v0.2.0; ✏️ 编辑页>仅开放了基本UI布局, 完整功能预计0.2.0版本发布
- 🎯 Variables page > Only basic UI layout is available. Full features are expected in v0.2.0; 🎯 变量页>仅开放了基本UI布局, 完整功能预计0.2.0版本发布
- 📊 Sheet page > Create dedicated components for customized tables, and batch-manage copy and styles based on component properties and tags recorded in table data. Also provides essential Excel-like table operations. Table styles will be continuously optimized, and we will further explore scenarios where 2D data can drive batch operations; 📊 表单页>创建特定组件以实现定制化表格, 并基于表格数据记录的组件属性和标签等批量管理文案和样式, 同时提供必要的类似excel表格操作的功能, 会陆续优化表格样式和深入探索可通过二维数据批量操作的情景
- 🛠️ More Tools page > Includes many commonly used tools, such as fixed-size rasterize | batch scale/skew | split/merge text | recognize/vectorize/generate QR codes | batch convert to auto layout | batch split children into containers | swap layer order/position | auto set constraints | ... ; 🛠️ 更多功能页>集齐大量常用功能, 如指定大小栅格化 | 批量缩放/斜切 | 拆分/合并文本 | 识别/矢量化/生成二维码 | 批量转自动布局 | 批量将子元素拆分到容器 | 调换图层顺序/位置 | 自动设置约束 | 。。。