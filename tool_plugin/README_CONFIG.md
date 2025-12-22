# Figma 插件/小部件共享配置说明

## 概述

为了统一管理 `tool_plugin` 目录下所有 Figma 插件和小部件的 TypeScript 配置，我们创建了共享的基础配置。

## 文件结构

```
tool_plugin/
├── tsconfig.base.json          # 共享的基础 TypeScript 配置
├── CodeView/
│   └── widget-src/
│       └── tsconfig.json       # 继承基础配置的小部件配置
└── [其他插件/小部件]/
    └── tsconfig.json           # 继承基础配置
```

## 使用方法

### 对于 Figma Widget（小部件）

在您的 widget 目录下创建或更新 `tsconfig.json`：

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "figma.widget.h",
    "jsxFragmentFactory": "figma.widget.Fragment",
    "types": [
      "@figma/plugin-typings",
      "@figma/widget-typings"
    ]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx"
  ]
}
```

### 对于 Figma Plugin（插件）

在您的 plugin 目录下创建或更新 `tsconfig.json`：

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "types": [
      "@figma/plugin-typings"
    ]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx"
  ]
}
```

## 依赖要求

确保在项目根目录的 `package.json` 中安装了以下依赖：

```json
{
  "devDependencies": {
    "@figma/plugin-typings": "^1.116.0",
    "@figma/widget-typings": "^1.12.1",
    "typescript": "^5.3.2"
  }
}
```

运行 `npm install` 安装依赖。

## 代码文件中的类型引用

### Widget 文件

在 widget 的 `.tsx` 或 `.ts` 文件开头添加：

```typescript
/// <reference types="@figma/widget-typings" />
```

### Plugin 文件

在 plugin 的 `.ts` 文件开头添加：

```typescript
/// <reference types="@figma/plugin-typings" />
```

## 验证配置

运行 TypeScript 类型检查：

```bash
cd tool_plugin/YourPlugin
npm run tsc
```

如果没有错误输出，说明配置正确。

## 优势

1. **统一配置**：所有插件/小部件共享基础配置，便于维护
2. **类型提示**：自动获得 Figma API 的完整类型提示
3. **易于扩展**：新增插件/小部件只需继承基础配置即可
4. **减少重复**：避免在每个项目中重复配置相同的选项

