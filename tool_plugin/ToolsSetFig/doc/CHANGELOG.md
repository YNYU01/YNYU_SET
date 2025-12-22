# 更新日志 / Changelog

本文档记录 YN+ ToolsSet Figma 插件的所有版本更新。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2024-XX-XX

### 🎉 首次发布 / Initial Release

#### ✨ 新增功能 / Added

- **创建模块 (Create)**
  - 支持图片拖拽/上传，自动切片
  - 支持表格文件导入（`.csv`, `.xls`, `.xlsx`）
  - 支持多种格式文件（`.zy`, `.sketch`, `.svg`, `.json`, `.zip`）
  - 支持 TSV 数据粘贴
  - 自定义生效列和画板命名模板
  - 标签树预览和编辑

- **导出模块 (Export)**
  - 支持 PNG/JPG 图片导出
  - 支持 ZY 兼容格式导出
  - 支持富文本描述导出
  - 导出队列管理
  - 尺寸和缩放设置

- **编辑模块 (Editor)**
  - 可编辑模式（Up Editable）
  - 像素模式（Up Pixel）
  - 滤镜栈功能（亮度、对比度、色相等）
  - JSON 预设导入/导出
  - 画布预览和控制

- **变量模块 (Variable)**
  - 样式和变量检测
  - 样式/变量创建和管理
  - 本地表格双向同步
  - 断链样式整理
  - 组件变量匹配

- **表单模块 (Sheet)**
  - 内置表格模板（10+ 种）
  - 自定义组件模板
  - 数据驱动组件属性
  - 批量文本/属性/标签映射
  - 实例自动管理

- **更多工具 (More Tools)**
  - 收藏功能
  - 像素处理工具
  - 图层管理工具
  - 矢量工具
  - 样式工具

#### 🎨 UI/UX 改进 / UI/UX Improvements

- 支持亮色/暗色主题自动切换
- 支持中文/英文双语界面
- 窗口大小记忆功能
- 最近使用标签页记忆
- 现代化 UI 设计

#### 🔧 技术特性 / Technical Features

- 使用 Figma Plugin API 1.0.0
- 本地存储（clientStorage）用户偏好
- 外部 CDN 资源加载
- 响应式界面设计

#### 📝 文档 / Documentation

- 完整的 README.md 文档
- 发布准备说明（README_RELEASE.md）
- 更新日志（CHANGELOG.md）

---

## [未发布] - 未来计划 / Future Plans

### 🔮 计划功能 / Planned Features

- [ ] 批处理滤镜功能
- [ ] 更多表格模板
- [ ] 插件内教程和帮助
- [ ] 快捷键支持
- [ ] 批量操作优化
- [ ] 性能优化

### 🐛 待修复 / Bug Fixes

- [ ] 首次打开时的默认窗口尺寸优化
- [ ] `.zy` 格式嵌套组件支持
- [ ] 离线模式支持（本地资源）

---

**注意**：版本号格式为 `主版本号.次版本号.修订号`（如 1.0.0）
- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

