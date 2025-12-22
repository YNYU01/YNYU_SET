# User Credentials Security Description
# 用户凭证安全说明

## English Version

**How we keep user credentials secure:**

Our plugin uses Supabase (a trusted third-party authentication service) for user authentication. We do not handle or store user credentials directly in our code.

**Credential Storage:**
- User credentials (email, password) are stored securely on Supabase's servers, which comply with industry-standard security practices (SOC 2 Type II, ISO 27001).
- Authentication tokens are stored locally in the browser's secure storage (not in Figma's clientStorage) and are automatically encrypted.
- No credentials are stored in Figma files or plugin code.

**Password Constraints:**
- Supabase enforces strong password requirements by default (minimum length, complexity requirements).
- Passwords are hashed using bcrypt before storage.
- We do not have access to plain-text passwords.

**Verification Systems:**
- Email verification is required for new user registration.
- Authentication uses secure token-based sessions (JWT tokens).
- Tokens expire automatically and require re-authentication.
- All authentication requests use HTTPS encryption.

**Additional Security Measures:**
- We only transmit authentication tokens (not credentials) between the plugin and Supabase.
- No design data, file content, or personal information is transmitted during authentication.
- All network communication uses encrypted HTTPS connections.
- We follow Supabase's recommended security practices and do not implement custom authentication logic.

---

## 中文版本

**我们如何保护用户凭证安全：**

我们的插件使用 Supabase（可信的第三方身份验证服务）进行用户身份验证。我们不在代码中直接处理或存储用户凭证。

**凭证存储：**
- 用户凭证（邮箱、密码）安全存储在 Supabase 服务器上，符合行业标准安全实践（SOC 2 Type II、ISO 27001）。
- 身份验证令牌存储在浏览器的安全存储中（不在 Figma 的 clientStorage 中），并自动加密。
- 不在 Figma 文件或插件代码中存储凭证。

**密码约束：**
- Supabase 默认强制执行强密码要求（最小长度、复杂度要求）。
- 密码在存储前使用 bcrypt 进行哈希处理。
- 我们无法访问明文密码。

**验证系统：**
- 新用户注册需要邮箱验证。
- 身份验证使用基于令牌的安全会话（JWT 令牌）。
- 令牌自动过期，需要重新验证。
- 所有身份验证请求使用 HTTPS 加密。

**其他安全措施：**
- 我们仅在插件和 Supabase 之间传输身份验证令牌（而非凭证）。
- 身份验证过程中不传输任何设计数据、文件内容或个人隐私信息。
- 所有网络通信使用加密的 HTTPS 连接。
- 我们遵循 Supabase 推荐的安全实践，不实现自定义身份验证逻辑。

