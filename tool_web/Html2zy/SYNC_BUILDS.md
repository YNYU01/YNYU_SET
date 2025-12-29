# 构建文件同步说明

## 问题

Chrome 扩展的 Content Security Policy (CSP) 不允许从外部 CDN 加载脚本，所有资源必须在扩展包内。为了避免文件重复，我们使用自动同步脚本将项目根目录的构建文件同步到扩展目录。

## 使用方法

### 方法一：使用 npm 脚本（推荐）

```bash
npm run sync:html2zy
```

### 方法二：直接运行脚本

```bash
node tool_web/Html2zy/sync-builds.js
```

## 工作原理

1. 脚本会检查项目根目录的 `builds/` 和 `publics/` 目录中的文件
2. 比较源文件和目标文件的修改时间
3. 只有当源文件更新时才会同步
4. 同步的文件会被添加到 `.gitignore`，避免提交重复文件

## 同步的文件

- `builds/yn_tool.js`
- `builds/yn_comp.js`
- `builds/yn_icon.js`
- `builds/yn_style.css`
- `publics/run.js`

## 开发工作流

1. 修改项目根目录的构建文件
2. 运行同步脚本：`npm run sync:html2zy`
3. 重新加载扩展进行测试

## 注意事项

- 同步的文件已添加到 `.gitignore`，不会被提交到 Git
- 每次修改构建文件后记得运行同步脚本
- 如果源文件不存在，脚本会显示警告但不会中断

