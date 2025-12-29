# Chrome 扩展发布清单

## ✅ 必需文件检查

### 1. 核心配置文件
- [x] `manifest.json` - 扩展配置文件（Manifest V3）
- [x] `background.js` - 后台服务工作者
- [x] `content.js` - 内容脚本
- [x] `popup.html` - 弹窗页面
- [x] `popup.js` - 弹窗脚本

### 2. 图标文件
- [x] `icons/Html2zy.png` (16x16)
- [x] `icons/Html2zy-1.png` (48x48)
- [x] `icons/Html2zy-2.png` (128x128)

### 3. 样式文件
- [x] `styles/popup.css` - 弹窗样式
- [x] `styles/content.css` - 内容脚本样式

### 4. 依赖文件
- [x] `publics/fonts.css`
- [x] `publics/style.css`
- [x] `publics/run.js`
- [x] `publics/graph.js`
- [x] `publics/other/FileSaver.min.js`
- [x] `publics/other/jszip.js` (已修复引用问题)

### 5. 构建文件
- [x] `builds/yn_tool.js`
- [x] `builds/yn_comp.js`
- [x] `builds/yn_icon.js`
- [x] `builds/yn_style.css`

## 📋 发布前检查项

### Manifest.json 配置检查
- [x] manifest_version: 3
- [x] name: 扩展名称
- [x] version: 版本号（当前：1.0.0）
- [x] description: 扩展描述
- [x] permissions: 权限声明
- [x] host_permissions: 主机权限
- [x] action: 扩展图标和弹窗配置
- [x] content_scripts: 内容脚本配置
- [x] background: 后台服务工作者配置
- [x] icons: 图标配置

### 代码质量检查
- [ ] 测试所有功能是否正常工作
- [ ] 检查控制台是否有错误
- [ ] 验证权限使用是否合理
- [ ] 检查是否有硬编码的敏感信息

### 文件完整性检查
- [ ] 确认所有引用的文件都存在
- [ ] 确认文件路径正确（相对路径）
- [ ] 确认没有外部资源依赖（CDN等）

## 📝 发布到 Chrome Web Store 需要准备

### 1. 商店信息
- [ ] **扩展名称**：Html2zy - 页面快照工具
- [ ] **简短描述**（132字符以内）
- [ ] **详细描述**（说明功能、使用方法等）
- [ ] **分类**：选择合适分类（如：开发者工具）
- [ ] **语言**：中文（简体）

### 2. 视觉资源
- [ ] **商店图标**：128x128 PNG（已有）
- [ ] **小型宣传图**：440x280 PNG（可选）
- [ ] **大型宣传图**：920x680 PNG（可选）
- [ ] **至少一张截图**：1280x800 或 640x400 PNG
  - 展示扩展的主要功能
  - 建议准备 3-5 张截图

### 3. 隐私和安全
- [ ] **隐私政策 URL**（如果使用敏感权限）
  - 当前权限：`activeTab`, `storage`, `scripting`, `tabs`, `<all_urls>`
  - 建议创建隐私政策页面说明数据使用情况
- [ ] **单一用途说明**：说明扩展的单一用途
- [ ] **用户数据使用说明**：说明如何处理用户数据

### 4. 其他信息
- [ ] **支持网站**（可选）
- [ ] **支持邮箱**（用于用户反馈）
- [ ] **定价**：免费 或 付费
- [ ] **分发区域**：选择可用的国家/地区

## 🔧 打包扩展

### 方法一：本地测试（开发者模式）
用于开发和测试，不需要打包：
1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `tool_web/Html2zy` 目录

### 方法二：打包为 .crx 文件（仅用于本地分发）
**注意**：Chrome Web Store 不接受 crx 文件，此方法仅用于本地安装或内部分发。

1. 在 `chrome://extensions/` 页面
2. 点击"打包扩展程序"
3. 选择扩展根目录：`tool_web/Html2zy`
4. 选择私钥文件（首次打包会创建，保存好 .pem 文件用于后续更新）
5. 生成 `.crx` 和 `.pem` 文件
   - `.crx` 文件：可以分发给用户本地安装
   - `.pem` 文件：**重要！** 保存好用于后续版本更新，不要丢失

### 方法三：打包为 zip 文件（用于 Chrome Web Store 发布）⭐
**这是发布到 Chrome Web Store 的正确方法**

Chrome Web Store 要求上传 **zip 文件**，不是 crx 文件。详见上方"准备发布包"部分的详细说明和命令示例。

## 📦 发布步骤

### 1. 准备发布包

**重要说明**：
- Chrome Web Store **只需要 zip 文件**，不需要 crx 文件
- crx 文件是用于本地安装的，**不要包含在发布包中**
- .pem 私钥文件是敏感文件，**绝对不要包含在发布包中**

#### 需要包含的文件（必需）：
- ✅ `manifest.json` - 扩展配置
- ✅ `background.js` - 后台脚本
- ✅ `content.js` - 内容脚本
- ✅ `popup.html` - 弹窗页面
- ✅ `popup.js` - 弹窗脚本
- ✅ `icons/` - 所有图标文件（16, 48, 128 像素）
- ✅ `styles/` - 所有样式文件
- ✅ `publics/` - 所有公共资源（CSS, JS, 字体等）
- ✅ `builds/` - 所有构建后的文件（已同步的文件）
- ✅ `VI/` - 所有视觉资源文件

#### 需要排除的文件（开发文件）：
- ❌ `*.md` - 所有 Markdown 文档（RELEASE_CHECKLIST.md, SYNC_BUILDS.md）
- ❌ `sync-builds.js` - 构建同步脚本
- ❌ `*.crx` - 打包后的扩展文件（不需要上传）
- ❌ `*.pem` - 私钥文件（敏感文件，绝对不能上传）
- ❌ `node_modules/` - Node.js 依赖（如果有）
- ❌ `.git/` - Git 版本控制文件
- ❌ `.gitignore` - Git 配置文件

#### 打包步骤：
1. 确保所有构建文件已同步（运行 `npm run sync:html2zy`）
2. 创建 zip 文件，包含所有必需文件，排除开发文件
3. 测试 zip 文件可以正常加载（在 Chrome 中加载解压后的文件夹）

#### 打包命令示例：

**Windows PowerShell:**
```powershell
# 进入扩展目录
cd tool_web\Html2zy

# 使用 PowerShell 压缩（排除开发文件）
Compress-Archive -Path manifest.json,background.js,content.js,popup.html,popup.js,icons,styles,publics,builds,VI -DestinationPath ..\Html2zy.zip -Force
```

**Windows CMD (使用 7-Zip 或其他工具):**
```cmd
cd tool_web\Html2zy
7z a ..\Html2zy.zip manifest.json background.js content.js popup.html popup.js icons styles publics builds VI -x!*.md -x!sync-builds.js -x!*.crx -x!*.pem
```

**Linux/Mac:**
```bash
cd tool_web/Html2zy
zip -r ../Html2zy.zip . \
  -x "*.md" \
  -x "sync-builds.js" \
  -x "*.crx" \
  -x "*.pem" \
  -x ".git/*" \
  -x "node_modules/*"
```

**验证打包结果：**
- 解压 zip 文件到临时目录
- 在 Chrome 中加载该目录作为扩展
- 确认扩展功能正常

### 2. Chrome Web Store 开发者控制台

#### 注册和支付
- [ ] 访问 [Chrome Web Store 开发者控制台](https://chrome.google.com/webstore/devconsole)
- [ ] 使用 Google 账号登录
- [ ] 支付一次性注册费用（$5 USD）

#### 💳 支付方式说明

**Chrome Web Store 接受的支付方式：**
- ✅ **信用卡**（Visa, MasterCard, American Express 等）
- ✅ **借记卡**（Debit Card，如果支持在线支付）
- ✅ **Google Play 余额**（如果账户有余额）
- ✅ **某些地区的 PayPal**（取决于地区）

**如果没有信用卡，可以尝试：**

1. **使用借记卡**
   - 如果您的银行借记卡支持在线支付（通常有 Visa 或 MasterCard 标识）
   - 确保已开通在线支付功能
   - 联系银行确认是否支持国际在线支付

2. **使用预付卡（Prepaid Card）**
   - 购买支持国际支付的预付卡
   - 确保卡内有足够余额（$5 + 可能的交易手续费）

3. **使用 PayPal**
   - 如果您的地区支持 PayPal 支付
   - 需要先绑定银行卡或银行账户到 PayPal
   - 通过 PayPal 进行支付

4. **请朋友代付**
   - 请有信用卡的朋友帮忙支付
   - 或使用朋友的 Google 账号注册（需注意账号归属）

5. **其他分发方式**（如果无法注册）
   - 见下方"替代分发方式"部分

#### 创建和上传
- [ ] 创建新项目
- [ ] 上传 zip 文件

### 3. 填写商店信息
- [ ] 上传所有必需的视觉资源
- [ ] 填写扩展描述
- [ ] 选择分类和语言
- [ ] 提供隐私政策链接（如需要）
- [ ] 填写单一用途说明

### 4. 提交审核
- [ ] 检查所有信息无误
- [ ] 提交审核
- [ ] 等待审核结果（通常 1-3 个工作日）

## ⚠️ 常见问题

### 权限说明
当前扩展使用的权限：
- `activeTab`: 访问当前活动标签页
- `storage`: 本地存储数据
- `scripting`: 注入脚本
- `tabs`: 访问标签页信息
- `<all_urls>`: 在所有网站上运行

**建议**：在隐私政策中说明这些权限的用途，特别是 `<all_urls>` 权限。

### 内容安全策略（CSP）
- ✅ 所有脚本都在扩展包内（无外部 CDN）
- ✅ 使用相对路径引用资源

### 版本号管理
- 当前版本：1.0.0
- 更新时遵循语义化版本：主版本.次版本.修订版本

## 📚 参考资源

- [Chrome 扩展开发文档](https://developer.chrome.com/docs/extensions/)
- [Chrome Web Store 发布指南](https://developer.chrome.com/docs/webstore/publish/)
- [Manifest V3 迁移指南](https://developer.chrome.com/docs/extensions/mv3/intro/)

## ✅ 发布前最终检查

- [ ] 所有文件路径正确
- [ ] 所有功能测试通过
- [ ] 无控制台错误
- [ ] 隐私政策已准备（如需要）
- [ ] 商店截图已准备
- [ ] 描述文案已完善
- [ ] zip 文件已创建并测试

---

**最后更新**：2024-12-19
**当前版本**：1.0.0

