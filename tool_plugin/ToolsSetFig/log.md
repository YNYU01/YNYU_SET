### v0.1.1 2026/1/12
- Optimize: Sheet page > Data Get/Map - Changed from 8 buttons for 4 data types to switching data type tabs, then clicking Get/Map；优化：表单页>数据获取/映射，原4种数据类型要8个按钮，现在改为切换数据类型标签，再点击获取/映射
- Optimize: Sheet page > Double-click to fill sample data - Fill samples based on selected data type；优化：表单页>双击填充示例数据，按所选数据类型填充示例
- Optimize: Sheet page > Data validation and generation settings - Merged into advanced settings and hidden by default；优化：表单页>数据校验、生成设置，合并到高级设置并默认隐藏
- New: Sheet page > Table component source - Can toggle header option to generate tables without headers；新增：表单页>表格组件来源，可以开/关表头选项，生成不带表头的表格
- Change: Sheet page > Row/Column count - Changed from input value add/subtract rows + input value add/subtract columns to input row/column values to set rows/columns + add/subtract rows；修改：表单页>行列数量，原输入数值加减行+输入数值加减列，改为输入行列数值设置行列+加减行

### v0.1.1 2026/1/2
- Fix: Sheet page > Apply Preset - Fixed issue where applying table styles on the sheet page was not working properly；修复：表单页>应用表格样式时，不能正常运行的问题
- Fix: Sheet page > Expand More > All Stroke/All Fill - Fixed issue where functions like "All Stroke" and "All Fill" were overriding each other；修复：表单页>展开更多>全描边/全填充等功能互相覆盖的问题
- New: Create page > JSON format (by YN+ Html2zy) - Import and create elements from JSON format extracted by browser extension；新增：创建页>json格式（浏览器插件提取）导入创建元素
```json
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
- New: More Features page > Create Style from Table Data - Create styles from tabular data；新增：更多功能页>从制表数据创建样式