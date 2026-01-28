/*初始数据*/
let SKILL_SEC_INFO = [
  {
    id: 'InSituRasterize',
    name: ["原地栅格化","in-situ rasterize"],
  },
  {
    id: 'EaseTransform',
    name: ["斜切拉伸","ease transform"],
  },
  {
    id: 'UniformScale',
    name: ["等比缩放","uniform scale"],
  },
  {
    id: 'AlterImageFill',
    name: ["图片填充修改","alter image fill"],
  },
  {
    id: 'ClipByGrid',
    name: ["宫格裁切","clip by grid"],
  },
  {
    id: 'SplitText',
    name: ["拆分文本","split text"],
  },
  {
    id: 'MergeText',
    name: ["合并文本","merge text"],
  },
  {
    id: 'LayersLayout',
    name: ["图层&布局","layers layout"],
  },
  {
    id: 'GetPath',
    name: ["提取路径","get path"],
  },
  {
    id: 'GetEditableSVG',
    name: ["获取可编辑SVG","get editable SVG"],
  },
  {
    id: 'ShadowAsStroke',
    name: ["阴影伪描边","shadow as stroke"],
  },
  {
    id: 'QRcodeToSVG',
    name: ["二维码矢量化","qrcode to svg"],
  },
  {
    id: 'AutoFillBorder',
    name: ["自适应底框","auto fill border"],
  },
  {
    id: 'PaintStyle',
    name: ["颜色样式","paint style"],
  },
]

let TO_USER_TIPS_TV = {
  worktime: ["🔒下班时间不建议工作~","🔒You shouldn't work after work!"],
  random: [
    ["椅子说：你该起来走走了~","Your chair says: time to walk~"],
    ["累了就歇歇, 效率会更高~","Take a break, boost efficiency~"],
    ["开源让设计更美好~","Open source makes design better~"],
    ["提效是为了更好地生活~","Efficiency for a better life~"],
    ["坐久了, 起来扭一扭~","Sitting too long? Time to move~"],
    ["工作虽重要, 休息也必要~","Work matters, but so does rest~"],
    ["支持开源, 让创意自由~","Support open source, free creativity~"],
    ["效率提升, 拒绝内卷~","Boost efficiency, not burnout~"],
  ],
};

let richDoc = new RICH_DOC();

let HELP_DATA = {
  create: richDoc.doc.toolsset.create.help,
  export: richDoc.doc.toolsset.export.help,
  editor: richDoc.doc.toolsset.editor.help,
  variable: richDoc.doc.toolsset.variable.help,
  sheet: richDoc.doc.toolsset.sheet.help,
};

// ========== 常量定义 ==========
const UI_SIZES = {
  MINI: [208, 460],
  NORMAL: [300, 660],
  BIG: [620, 660]
};
const UI_MINI = UI_SIZES.MINI;
const UI = UI_SIZES.NORMAL;
const UI_BIG = UI_SIZES.BIG;

// 延迟时间常量
const DELAY = {
  DEBOUNCE: 500,
  SEARCH: 500,
  RESIZE_SAVE: 500,
  SKILL_CLICK: 500,
  INIT: 100,
  FONT_LOAD: 100,
  TIPS_INTERVAL: 12000,
  SIDEBAR_CLOSE: 280,  // 侧边栏关闭动画延迟
  FIND_BOX_REMOVE: 2000,  // 查找框移除延迟
  CONVERT_TAGS: 100  // 转换标签延迟
};

// 提示消息常量
const MESSAGES = {
  FILE_TYPE_ERROR: ['只能上传同类型文件', 'The file type must meet the requirements'],
  READING: ['读取中, 请耐心等待', 'Reading, please wait a moment'],
  WORKTIME: ['工作时间限制', 'Work time restriction'],
  TABLE_TITLE_WORDS_ERROR: ['请用指定单词, 并用逗号隔开', 'Must use example words and separated by commas'],
  TABLE_TITLE_REQUIRED_ERROR: ['必须包含name、w、h', 'Must include name, w, h'],
  TABLE_TITLE_REPEAT_ERROR: ['单词重复', 'The word is repeated'],
  TABLE_DATA_ERROR: ['表格数据格式错误, 请检查文件内容', 'Table data format error, please check file content'],
  ZY_DATA_ERROR: ['资源目录数据格式错误, 请检查文件内容', 'Catalogue data format error, please check file content']
};

// ========== 表格样式数据 ==========
const TABLE_STYLE = [
  {th:[0,0,0,0,1],td:[0,0,0,0,'rowSpace']},//横间格区分色
  {th:[0,0,0,0,'columnSpace'],td:[0,0,0,0,'columnSpace']},//竖间格区分色
  {th:[0,0,0,0,1],td:[0,0,0,0,0]},//无描边
  {th:[0,0,0,0,1],td:[1,0,1,0,0]},//仅横线
  {th:[0,0,0,0,1],td:[0,1,0,1,0]},//仅竖线
  {th:[0,0,0,0,1],td:[1,1,1,1,0]},//全描边
  {th:[0,0,0,0,0],td:[0,0,0,0,0]},//无描边（表头无区分色
  {th:[1,0,1,0,0],td:[1,0,1,0,0]},//仅横线（表头无区分色
  {th:[0,1,0,1,0],td:[0,1,0,1,0]},//仅竖线（表头无区分色
  {th:[1,1,1,1,0],td:[1,1,1,1,0]},//全描边（表头无区分色
];

// ========== 用户认证配置 ==========
const AUTH_CONFIG = {
  // Supabase 配置（如果使用 Supabase，请填写下面的信息）
  USE_SUPABASE: true, // 改为 true 启用 Supabase
  SUPABASE_URL: 'https://darbnumfpfrscqgyeiqe.supabase.co', // 替换为你的 Project URL
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcmJudW1mcGZyc2NxZ3llaXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0OTU1NjksImV4cCI6MjA4MDA3MTU2OX0.UDvrmk8lnumZAu9nugTtEl7WGzxDNhUSfllrCFF4Ws4', // 替换为你的 anon public key
  
  // 自定义 API 配置（如果使用自定义 API）
  API_BASE_URL: null, // 'https://api.ynyuset.cn/auth'
  
  // 本地存储键名（保持不变）
  STORAGE_KEY_USER: 'toolsSetFig_user',
  STORAGE_KEY_USERS: 'toolsSetFig_users'
};

// 认证模块多语言文本
const AUTH_I18N = {
  zh: {
    invalidEmail: '请输入有效的邮箱地址',
    usernameTooShort: '用户名至少需要2个字符',
    passwordTooShort: '密码至少需要6个字符',
    supabaseNotInitialized: 'Supabase 未初始化，请检查配置和网络连接',
    emailAlreadyRegistered: '该邮箱已注册，请直接登录',
    rateLimitError: '请求过于频繁，请等待 {0} 秒后再试',
    invalidEmailFormat: '邮箱格式不正确',
    registrationFailed: '注册失败: {0}',
    unknownError: '未知错误',
    registrationFailedRetry: '注册失败，请重试',
    registrationSuccess: '注册成功！请检查邮箱并点击确认链接以完成注册。如未收到邮件，请耐心等待或联系管理员处理。',
    registrationSuccessShort: '注册成功！请检查邮箱并点击确认链接。如未收到邮件，请耐心等待或联系管理员处理。',
    registrationFailedConfig: '注册失败，请检查 Supabase 配置或网络连接',
    emailAlreadyRegisteredLocal: '该邮箱已在本地注册，请先清除缓存',
    enterEmailPassword: '请输入邮箱和密码',
    emailPasswordIncorrect: '邮箱或密码错误',
    emailNotConfirmed: '邮箱未确认，请检查邮箱并点击确认链接',
    resendConfirmationEmail: '重新发送确认邮件',
    resendConfirmationEmailSuccess: '确认邮件已发送，请检查邮箱',
    resendConfirmationEmailFailed: '发送失败，请稍后重试',
    loginFailedRetry: '登录失败，请重试',
    fillAllRequired: '请填写所有必填项',
    passwordsNotMatch: '两次输入的密码不一致',
    registering: '注册中...',
    localCacheCleared: '本地缓存已清除',
    usernameInvalidChars: '用户名只能包含字母、数字、下划线和连字符，且不能纯数字或符号',
    usernameInvalidLength: '用户名长度必须在2-20个字符之间',
    passwordInvalidChars: '密码只能包含字母、数字和常见符号',
    passwordInvalidLength: '密码长度必须在6-50个字符之间'
  },
  en: {
    invalidEmail: 'Please enter a valid email address',
    usernameTooShort: 'Username must be at least 2 characters',
    passwordTooShort: 'Password must be at least 6 characters',
    supabaseNotInitialized: 'Supabase not initialized, please check configuration and network connection',
    emailAlreadyRegistered: 'This email is already registered, please log in directly',
    rateLimitError: 'Too many requests, please wait {0} seconds and try again',
    invalidEmailFormat: 'Invalid email format',
    registrationFailed: 'Registration failed: {0}',
    unknownError: 'Unknown error',
    registrationFailedRetry: 'Registration failed, please try again',
    registrationSuccess: 'Registration successful! Please check your email and click the confirmation link to complete registration. If you don\'t receive the email, please wait patiently or contact the administrator.',
    registrationSuccessShort: 'Registration successful! Please check your email and click the confirmation link. If you don\'t receive the email, please wait patiently or contact the administrator.',
    registrationFailedConfig: 'Registration failed, please check Supabase configuration or network connection',
    emailAlreadyRegisteredLocal: 'This email is already registered locally, please clear cache first',
    enterEmailPassword: 'Please enter email and password',
    emailPasswordIncorrect: 'Email or password incorrect',
    emailNotConfirmed: 'Email not confirmed, please check your email and click the confirmation link',
    resendConfirmationEmail: 'Resend confirmation email',
    resendConfirmationEmailSuccess: 'Confirmation email sent, please check your inbox',
    resendConfirmationEmailFailed: 'Failed to send, please try again later',
    loginFailedRetry: 'Login failed, please try again',
    fillAllRequired: 'Please fill in all required fields',
    passwordsNotMatch: 'Passwords do not match',
    registering: 'Registering...',
    localCacheCleared: 'Local cache cleared',
    usernameInvalidChars: 'Username can only contain letters, numbers, underscores and hyphens, and cannot be pure numbers or symbols',
    usernameInvalidLength: 'Username must be between 2-20 characters',
    passwordInvalidChars: 'Password can only contain letters, numbers and common symbols',
    passwordInvalidLength: 'Password must be between 6-50 characters'
  }
};