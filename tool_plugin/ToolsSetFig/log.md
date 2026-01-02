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