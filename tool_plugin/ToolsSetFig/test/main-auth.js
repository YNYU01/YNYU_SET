
// ==================== 用户登录/注册模块 ====================
// 用户认证配置和国际化文本已移至 data.js，直接使用全局变量 AUTH_CONFIG 和 AUTH_I18N

// 获取认证模块的多语言文本
function getAuthText(key, ...args) {
  const lang = getLanguageIntime() || 'zh';
  const langMap = AUTH_I18N[lang] || AUTH_I18N.zh;
  let text = langMap[key] || key;
  
  // 支持参数替换 {0}, {1}, ...
  if (args && args.length > 0) {
    args.forEach((arg, index) => {
      text = text.replace(`{${index}}`, arg);
    });
  }
  
  return text;
}

// 存储辅助函数 - 支持 Figma 插件和普通环境
const AuthStorage = {
  // 获取数据（同步版本，仅用于非插件环境）
  get(key) {
    if (!ISPLUGIN || !PLUGINAPP) {
      // 普通环境：使用 localStorage
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    }
    // 插件环境下，数据通过消息回调异步获取，这里返回 null
    // 实际数据会在 run.js 的消息回调中设置到 AuthManager
    return null;
  },

  // 设置数据
  set(key, value) {
    if (ISPLUGIN && PLUGINAPP) {
      // Figma 插件环境：通过 toolMessage 存储
      toolMessage([[key, value], 'setlocal'], PLUGINAPP);
    } else {
      // 普通环境：使用 localStorage
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }
  },

  // 删除数据
  remove(key) {
    if (ISPLUGIN && PLUGINAPP) {
      // Figma 插件环境：设置为 null 来删除
      toolMessage([[key, null], 'setlocal'], PLUGINAPP);
    } else {
      // 普通环境：使用 localStorage
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Failed to remove from localStorage:', e);
      }
    }
  }
};

// 初始化 Supabase 客户端（如果使用）
let supabaseClient = null;
function initSupabaseClient() {
  if (AUTH_CONFIG.USE_SUPABASE) {
    // 检查 Supabase SDK 是否已加载
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      try {
        supabaseClient = supabase.createClient(
          AUTH_CONFIG.SUPABASE_URL,
          AUTH_CONFIG.SUPABASE_ANON_KEY
        );
        console.log('Supabase client initialized successfully');
        return true;
      } catch (e) {
        console.error('Failed to initialize Supabase:', e);
        return false;
      }
    } else {
      console.warn('Supabase SDK not loaded. Check if the script tag is present and loaded correctly.');
      console.log('typeof supabase:', typeof supabase);
      return false;
    }
  }
  return false;
}

// 尝试初始化 Supabase（支持延迟加载）
function tryInitSupabase() {
  if (AUTH_CONFIG.USE_SUPABASE && !supabaseClient) {
    // 如果 SDK 已加载，立即初始化
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      return initSupabaseClient();
    } else {
      // 如果 SDK 未加载，等待一段时间后重试（最多重试 5 次）
      let retries = 0;
      const maxRetries = 5;
      const checkInterval = setInterval(() => {
        retries++;
        if (typeof supabase !== 'undefined' && supabase.createClient) {
          clearInterval(checkInterval);
          initSupabaseClient();
        } else if (retries >= maxRetries) {
          clearInterval(checkInterval);
          console.error('Supabase SDK failed to load after multiple retries');
        }
      }, 200);
    }
  }
}

// 用户认证管理
var AuthManager = {
  currentUser: null,
  usersList: [], // 存储所有用户列表（用于验证）

  // 设置当前用户
  setCurrentUser(user) {
    this.currentUser = user;
  },

  // 设置用户列表
  setUsersList(users) {
    this.usersList = users || [];
  },

  // 初始化：从存储加载用户信息
  async init() {
    try {
      // 如果使用 Supabase，先检查是否有已登录的会话
      if (AUTH_CONFIG.USE_SUPABASE && supabaseClient) {
        try {
          const { data: { session }, error } = await supabaseClient.auth.getSession();
          if (!error && session?.user) {
            // 获取用户配置信息
            let profile = null;
            try {
              const { data: profileData, error: profileError } = await supabaseClient
                .from('user_profiles')
                .select('username,is_premium')  // 移除空格，避免格式问题
                .eq('id', session.user.id)
                .maybeSingle();  // 使用 maybeSingle() 而不是 single()
              
              if (profileError) {
                console.warn('Failed to fetch user profile in init:', {
                  error: profileError,
                  message: profileError.message,
                  code: profileError.code
                });
                // 如果查询失败，使用默认值
              } else if (profileData) {
                profile = profileData;
                console.log('User profile fetched in init:', profile);
              } else {
                console.log('User profile not found in init, using defaults');
              }
            } catch (e) {
              console.warn('Failed to fetch user profile in init:', e);
              // 表可能不存在或 RLS 策略限制，忽略错误
            }

            this.currentUser = {
              id: session.user.id,
              email: session.user.email,
              username: profile?.username || session.user.email.split('@')[0],
              isPremium: profile?.is_premium || false
            };
            AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USER, this.currentUser);
            this.updateUI();
            return; // Supabase 登录成功，不需要继续
          }
        } catch (e) {
          console.warn('Supabase session check failed:', e);
        }
      }

      // 在插件环境下，数据会通过 run.js 的消息回调异步设置
      // 在非插件环境下，直接从 localStorage 读取
      if (!ISPLUGIN || !PLUGINAPP) {
        const user = AuthStorage.get(AUTH_CONFIG.STORAGE_KEY_USER);
        if (user) {
          this.currentUser = user;
          this.updateUI();
        }
        const users = AuthStorage.get(AUTH_CONFIG.STORAGE_KEY_USERS);
        if (users) {
          this.usersList = users;
        }
      }
      // 插件环境下，数据已在 run.js 初始化时通过 getlocal 请求
      // 会在消息回调中调用 setCurrentUser 和 setUsersList
    } catch (e) {
      console.error('Failed to load user data:', e);
    }
  },

  // 验证用户名格式
  validateUsername(username) {
    if (!username) {
      return { 
        valid: false, 
        error: AUTH_I18N.zh.usernameTooShort,
        errorEn: AUTH_I18N.en.usernameTooShort
      };
    }
    // 用户名只能包含字母、数字、下划线和连字符，长度2-20
    //不能是纯数字或纯符号
    if (/^\d+$/.test(username) || /^-+$/.test(username)) {
      return { 
        valid: false, 
        error: AUTH_I18N.zh.usernameInvalidChars,
        errorEn: AUTH_I18N.en.usernameInvalidChars
      };
    }
    const usernameRegex = /^[a-zA-Z0-9_-]{2,20}$/;
    if (!usernameRegex.test(username)) {
      if (username.length < 2 || username.length > 20) {
        return { 
          valid: false, 
          error: AUTH_I18N.zh.usernameInvalidLength,
          errorEn: AUTH_I18N.en.usernameInvalidLength
        };
      }
      return { 
        valid: false, 
        error: AUTH_I18N.zh.usernameInvalidChars,
        errorEn: AUTH_I18N.en.usernameInvalidChars
      };
    }
    return { valid: true };
  },

  // 验证密码格式
  validatePassword(password) {
    if (!password) {
      return { 
        valid: false, 
        error: AUTH_I18N.zh.passwordTooShort,
        errorEn: AUTH_I18N.en.passwordTooShort
      };
    }
    // 密码只能包含字母、数字和常见符号，长度6-50
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,50}$/;
    if (!passwordRegex.test(password)) {
      if (password.length < 6 || password.length > 50) {
        return { 
          valid: false, 
          error: AUTH_I18N.zh.passwordInvalidLength,
          errorEn: AUTH_I18N.en.passwordInvalidLength
        };
      }
      return { 
        valid: false, 
        error: AUTH_I18N.zh.passwordInvalidChars,
        errorEn: AUTH_I18N.en.passwordInvalidChars
      };
    }
    return { valid: true };
  },

  // 注册
  async register(email, username, password) {
    // 简单验证
    if (!email || !email.includes('@')) {
      return { success: false, error: getAuthText('invalidEmail') };
    }
    // 验证用户名
    const usernameValidation = this.validateUsername(username);
    if (!usernameValidation.valid) {
      return { success: false, error: usernameValidation.error };
    }
    // 验证密码
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    // 如果使用 Supabase
    if (AUTH_CONFIG.USE_SUPABASE) {
      // 如果客户端未初始化，尝试初始化
      if (!supabaseClient) {
        console.log('Supabase client not initialized, attempting to initialize...');
        const initResult = tryInitSupabase();
        // 等待一小段时间让初始化完成
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!supabaseClient) {
          console.error('Supabase client initialization failed. Check:', {
            'SDK loaded': typeof supabase !== 'undefined',
            'createClient exists': typeof supabase !== 'undefined' && typeof supabase.createClient !== 'undefined',
            'URL configured': !!AUTH_CONFIG.SUPABASE_URL,
            'Key configured': !!AUTH_CONFIG.SUPABASE_ANON_KEY
          });
          return { success: false, error: getAuthText('supabaseNotInitialized') };
        }
      }
      
      try {
        // 使用 Supabase 注册
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: username
            },
          }
        });

        if (error) {
          // 详细记录错误信息，便于调试
          console.error('Supabase registration error:', {
            message: error.message,
            status: error.status,
            code: error.code,
            fullError: error
          });
          
          // 处理错误信息
          let errorMsg = error.message;
          // 检查是否是邮箱已注册的错误
          const isAlreadyRegistered = 
            error.message?.toLowerCase().includes('already registered') ||
            error.message?.toLowerCase().includes('user already registered') ||
            error.message?.toLowerCase().includes('email already registered') ||
            error.status === 422 && error.message?.toLowerCase().includes('exists') ||
            error.code === '23505' || // PostgreSQL unique violation
            error.message?.toLowerCase().includes('duplicate') ||
            error.message?.toLowerCase().includes('already exists');
          
          if (isAlreadyRegistered) {
            errorMsg = getAuthText('emailAlreadyRegistered');
          } else if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
            // 速率限制错误
            const waitTime = error.message.match(/(\d+)\s*seconds?/i)?.[1] || '7';
            errorMsg = getAuthText('rateLimitError', waitTime);
          } else if (error.message?.toLowerCase().includes('invalid')) {
            errorMsg = getAuthText('invalidEmailFormat');
          } else {
            // 显示原始错误信息，便于调试
            errorMsg = getAuthText('registrationFailed', error.message || getAuthText('unknownError'));
          }
          return { success: false, error: errorMsg };
        }

        if (!data.user) {
          return { success: false, error: getAuthText('registrationFailedRetry') };
        }
        
        // 验证用户是否真的是新创建的（Supabase 可能返回已存在的用户对象而不报错）
        const now = new Date();
        const createdAt = data.user.created_at ? new Date(data.user.created_at) : null;
        const timeDiff = createdAt ? (now - createdAt) / 1000 : null; // 秒
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        // 检查用户配置是否已存在（最可靠的检查方法）
        try {
          const { data: existingProfile } = await supabaseClient
            .from('user_profiles')
            .select('id')
            .eq('id', data.user.id)
            .maybeSingle();
          
          if (existingProfile) {
            if (session) await supabaseClient.auth.signOut();
            return { success: false, error: getAuthText('emailAlreadyRegistered') };
          }
        } catch (e) {
          // 查询失败，继续其他检查
        }
        
        // 检查用户是否真的是新创建的
        // 新注册的用户创建时间应该在几秒内，如果超过10秒很可能是已存在的用户
        if (timeDiff !== null && timeDiff > 10) {
          if (session) await supabaseClient.auth.signOut();
          return { success: false, error: getAuthText('emailAlreadyRegistered') };
        }
        
        // 如果用户已确认邮箱且创建时间超过3秒，肯定是已存在的用户
        if (data.user.email_confirmed_at && timeDiff !== null && timeDiff > 3) {
          if (session) await supabaseClient.auth.signOut();
          return { success: false, error: getAuthText('emailAlreadyRegistered') };
        }
        
        // 如果用户有登录历史，说明是已存在的用户
        if (data.user.last_sign_in_at && timeDiff !== null && timeDiff > 5) {
          const lastSignIn = new Date(data.user.last_sign_in_at);
          if ((now - lastSignIn) / 1000 > 5) {
            if (session) await supabaseClient.auth.signOut();
            return { success: false, error: getAuthText('emailAlreadyRegistered') };
          }
        }
        
        // 创建用户配置记录（只有在有 session 时才尝试）
        if (session) {
          try {
            const { data: profileData, error: profileError } = await supabaseClient
              .from('user_profiles')
              .insert({
                id: data.user.id,
                username: username,
                is_premium: false
              })
              .select()
              .single();

            if (profileError) {
              console.error('Failed to create user profile:', profileError);
              
              // 检查是否是唯一约束冲突（用户已存在）
              const isDuplicateError = 
                profileError.code === '23505' || // PostgreSQL unique violation
                profileError.message?.toLowerCase().includes('duplicate') ||
                profileError.message?.toLowerCase().includes('already exists') ||
                profileError.message?.toLowerCase().includes('unique constraint');
              
              if (isDuplicateError) {
                // 用户配置已存在，说明用户之前已注册
                await supabaseClient.auth.signOut();
                return { success: false, error: getAuthText('emailAlreadyRegistered') };
              }
              
              // 如果插入失败，可能是 RLS 策略问题，但继续执行
              // 用户配置可能由数据库触发器自动创建
            } else {
              console.log('User profile created successfully:', profileData);
            }
          } catch (e) {
            console.error('User profile creation failed:', e);
            // 继续执行，因为用户已经注册成功
          }
        } else {
          // 没有 session，说明需要邮箱确认
          console.log('User registered but needs email confirmation. Profile will be created after confirmation.');
          // 用户配置应该由数据库触发器自动创建
        }

        // 设置当前用户（即使没有 session，也保存基本信息）
        this.currentUser = {
          id: data.user.id,
          email: data.user.email,
          username: username,
          isPremium: false
        };

        // 如果有 session，保存用户信息
        if (session) {
          AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USER, this.currentUser);
          this.updateUI();
          return { success: true, user: this.currentUser };
        } else {
          // 没有 session，提示用户需要确认邮箱
          return { 
            success: true, 
            user: this.currentUser,
            needsConfirmation: true,
            message: getAuthText('registrationSuccess')
          };
        }
      } catch (e) {
        console.error('Supabase registration failed:', e);
        return { success: false, error: getAuthText('registrationFailedRetry') };
      }
    }

    // 降级到本地存储（仅在未使用 Supabase 时）
    if (AUTH_CONFIG.USE_SUPABASE) {
      // 如果使用 Supabase 但注册失败，不应该降级到本地存储
      return { success: false, error: getAuthText('registrationFailedConfig') };
    }
    
    // 清除可能存在的旧数据，确保检查的是最新数据
    const existingUsers = this.getUsersList();
    console.log('Checking local users list:', existingUsers);
    if (existingUsers && existingUsers.length > 0 && existingUsers.find(u => u.email === email)) {
      return { success: false, error: getAuthText('emailAlreadyRegisteredLocal') };
    }

    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const user = {
      id: userId,
      email: email,
      username: username,
      password: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      isPremium: false
    };

    existingUsers.push(user);
    this.usersList = existingUsers;
    AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USERS, existingUsers);
    
    this.currentUser = { ...user };
    delete this.currentUser.password;
    AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USER, this.currentUser);

    this.updateUI();
    return { success: true, user: this.currentUser };
  },

  // 登录
  async login(email, password) {
    if (!email || !password) {
      return { success: false, error: getAuthText('enterEmailPassword') };
    }

    // 如果使用 Supabase
    if (AUTH_CONFIG.USE_SUPABASE && supabaseClient) {
      try {
        // 使用 Supabase 登录
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          return { success: false, error: getAuthText('emailPasswordIncorrect') };
        }

        if (!data.user) {
          return { success: false, error: getAuthText('loginFailedRetry') };
        }

        // 获取用户配置信息
        let profile = null;
        try {
          // 使用更安全的查询方式，只选择需要的列
          const { data: profileData, error: profileError } = await supabaseClient
            .from('user_profiles')
            .select('username,is_premium')  // 移除空格，避免格式问题
            .eq('id', data.user.id)
            .maybeSingle();  // 使用 maybeSingle() 而不是 single()，如果不存在返回 null 而不是错误

          if (profileError) {
            console.warn('Failed to fetch user profile:', {
              error: profileError,
              message: profileError.message,
              code: profileError.code,
              details: profileError.details
            });
            // 如果查询失败，使用默认值
          } else if (profileData) {
            profile = profileData;
            console.log('User profile fetched successfully:', profile);
          } else {
            // 如果 profile 不存在，尝试创建它
            console.log('User profile not found, attempting to create...');
            try {
              const { data: newProfileData, error: createError } = await supabaseClient
                .from('user_profiles')
                .insert({
                  id: data.user.id,
                  username: data.user.email.split('@')[0], // 使用邮箱前缀作为默认用户名
                  is_premium: false
                })
                .select()
                .maybeSingle();
              
              if (!createError && newProfileData) {
                profile = newProfileData;
                console.log('User profile created successfully during login:', profile);
              } else if (createError) {
                console.warn('Failed to create user profile during login:', createError);
              }
            } catch (e) {
              console.warn('Exception while creating user profile during login:', e);
            }
          }
        } catch (e) {
          console.warn('Failed to fetch user profile:', e);
        }

        // 设置当前用户
        this.currentUser = {
          id: data.user.id,
          email: data.user.email,
          username: profile?.username || data.user.email.split('@')[0],
          isPremium: profile?.is_premium || false
        };

        AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USER, this.currentUser);
        this.updateUI();

        return { success: true, user: this.currentUser };
      } catch (e) {
        console.error('Supabase login failed:', e);
        return { success: false, error: getAuthText('loginFailedRetry') };
      }
    }

    // 降级到本地存储
    const existingUsers = this.getUsersList();
    const user = existingUsers.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: getAuthText('emailPasswordIncorrect') };
    }

    if (!this.verifyPassword(password, user.password)) {
      return { success: false, error: getAuthText('emailPasswordIncorrect') };
    }

    this.currentUser = { ...user };
    delete this.currentUser.password;
    AuthStorage.set(AUTH_CONFIG.STORAGE_KEY_USER, this.currentUser);

    this.updateUI();
    return { success: true, user: this.currentUser };
  },

  // 退出登录
  async logout() {
    // 如果使用 Supabase，先退出 Supabase 会话
    if (AUTH_CONFIG.USE_SUPABASE && supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out failed:', e);
      }
    }
    
    this.currentUser = null;
    AuthStorage.remove(AUTH_CONFIG.STORAGE_KEY_USER);
    this.updateUI();
    this.showLoginForm();
  },

  // 清除所有本地缓存（包括用户数据和用户列表）
  clearLocalCache() {
    this.currentUser = null;
    this.usersList = [];
    // 清除存储中的数据
    AuthStorage.remove(AUTH_CONFIG.STORAGE_KEY_USER);
    AuthStorage.remove(AUTH_CONFIG.STORAGE_KEY_USERS);
    // 确保内存中的数据也被清除
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_USER);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_USERS);
      } catch (e) {
        console.warn('Failed to clear localStorage:', e);
      }
    }
    this.updateUI();
    console.log(getAuthText('localCacheCleared'));
  },

  // 获取用户列表
  getUsersList() {
    if (this.usersList.length > 0 || (ISPLUGIN && PLUGINAPP)) {
      return this.usersList;
    }
    // 非插件环境下，从 localStorage 读取
    const users = AuthStorage.get(AUTH_CONFIG.STORAGE_KEY_USERS);
    this.usersList = users || [];
    return this.usersList;
  },

  // 密码哈希（使用盐值和多重哈希，安全性要求不高）
  hashPassword(password, salt = null) {
    // 使用固定盐值（可以改为从配置读取）
    const defaultSalt = 'ynyuset_toolsetfig_2024';
    const usedSalt = salt || defaultSalt;
    
    // 组合密码和盐值
    const saltedPassword = password + usedSalt + password.length;
    
    // 使用改进的哈希算法（djb2 变种）
    let hash = 5381; // djb2 初始值
    for (let i = 0; i < saltedPassword.length; i++) {
      const char = saltedPassword.charCodeAt(i);
      hash = ((hash << 5) + hash) + char; // hash * 33 + char
    }
    
    // 二次哈希以增加安全性
    const hashStr = Math.abs(hash).toString(36);
    let secondHash = 0;
    for (let i = 0; i < hashStr.length; i++) {
      secondHash = ((secondHash << 5) - secondHash) + hashStr.charCodeAt(i);
      secondHash = secondHash & secondHash; // 转换为 32 位整数
    }
    
    // 返回组合的哈希值（包含盐值标识）
    return `h_${Math.abs(secondHash).toString(36)}_${hashStr}`;
  },

  // 验证密码（支持新旧哈希格式，向后兼容）
  verifyPassword(password, storedHash) {
    if (!password || !storedHash) {
      return false;
    }
    
    // 新格式：以 h_ 开头
    if (storedHash.startsWith('h_')) {
      return storedHash === this.hashPassword(password);
    }
    
    // 旧格式：兼容旧的简单哈希算法
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return storedHash === hash.toString();
  },

  // 更新 UI
  updateUI() {
    const loginBtn = document.querySelector('[data-user-login-btn]');
    const userName = document.querySelector('[data-user-name]');
    const loginText = document.querySelector('[data-user-login-text]');
    
    if (this.currentUser) {
      // 已登录状态
      if (userName) userName.style.display = 'flex';
      if (loginText) loginText.style.display = 'none';

      let [username,emailname] = [this.currentUser.username,this.currentUser.email.split('@')[0]];

      if (userName) {
        let displayName = username || emailname;
        displayName = displayName.length > 8 ? displayName.substring(0, 8) + '...' : displayName;
        userName.setAttribute('data-en-text',displayName);
        userName.setAttribute('data-zh-text',displayName);
        userName.textContent = displayName;
      }
    } else {
      // 未登录状态
      if (userName) userName.style.display = 'none';
      if (loginText) loginText.style.display = 'block';
    }
  },

  // 显示登录表单
  showLoginForm() {
    const loginForm = document.querySelector('[data-login-form]');
    const registerForm = document.querySelector('[data-register-form]');
    const userInfo = document.querySelector('[data-user-info]');
    
    if (loginForm) loginForm.style.display = 'flex';
    if (registerForm) registerForm.style.display = 'none';
    if (userInfo) userInfo.style.display = 'none';
    
    // 清空表单
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    if (loginEmail) loginEmail.value = '';
    if (loginPassword) loginPassword.value = '';
    this.hideError('login');
  },

  // 显示注册表单
  showRegisterForm() {
    const loginForm = document.querySelector('[data-login-form]');
    const registerForm = document.querySelector('[data-register-form]');
    const userInfo = document.querySelector('[data-user-info]');
    
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'flex';
    if (userInfo) userInfo.style.display = 'none';
    
    // 清空表单
    const registerEmail = document.getElementById('register-email');
    const registerUsername = document.getElementById('register-username');
    const registerPassword = document.getElementById('register-password');
    const registerPasswordConfirm = document.getElementById('register-password-confirm');
    if (registerEmail) registerEmail.value = '';
    if (registerUsername) registerUsername.value = '';
    if (registerPassword) registerPassword.value = '';
    if (registerPasswordConfirm) registerPasswordConfirm.value = '';
    this.hideError('register');
    
    // 隐藏验证提示
    const registerUsernameError = document.getElementById('register-username-error');
    const registerPasswordError = document.getElementById('register-password-error');
    if (registerUsernameError) registerUsernameError.style.display = 'none';
    if (registerPasswordError) registerPasswordError.style.display = 'none';
  },

  // 显示用户信息
  showUserInfo() {
    const loginForm = document.querySelector('[data-login-form]');
    const registerForm = document.querySelector('[data-register-form]');
    const userInfo = document.querySelector('[data-user-info]');
    
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    
    if (this.currentUser && userInfo) {
      const displayName = document.querySelector('[data-user-display-name]');
      const displayEmail = document.querySelector('[data-user-display-email]');
      const userAvatar = document.querySelector('[data-user-avatar]');
      const userId = document.querySelector('[data-user-id]');
      const userPremium = document.querySelector('[data-user-premium]');
      let [username,emailname,useremail] = [this.currentUser.username,this.currentUser.email.split('@')[0],this.currentUser.email];
      //先取后两位
      let iconname = username.slice(-2) || emailname.slice(-2);
      //中文昵称只保留一个字
      if(iconname.replace(/[^\u4e00-\u9fa5]/g,'').length > 0){
        iconname = iconname[1];
      }
      if (displayName) displayName.textContent = username || emailname;
      if (displayEmail) displayEmail.textContent = useremail;
      if (userAvatar) userAvatar.textContent = iconname.toUpperCase();
      if (userId) userId.textContent = this.currentUser.id;
      if (userPremium) userPremium.style.display = this.currentUser.isPremium ? 'block' : 'none';
    }
  },

  // 显示错误信息
  showError(type, message) {
    const errorEl = document.querySelector(`[data-${type}-error]`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  },

  // 隐藏错误信息
  hideError(type) {
    const errorEl = document.querySelector(`[data-${type}-error]`);
    if (errorEl) {
      errorEl.style.display = 'none';
    }
  },

  // 检查是否为付费用户
  isPremium() {
    return this.currentUser && this.currentUser.isPremium === true;
  }
};

// 初始化登录模块和事件绑定
async function initAuthModule() {
  // 初始化 Supabase 客户端（如果使用）
  if (AUTH_CONFIG.USE_SUPABASE) {
    tryInitSupabase();
  }
  
  // 初始化用户状态（包括检查 Supabase 会话）
  await AuthManager.init();
  
  // 登录按钮点击事件
  const userLoginBtn = document.querySelector('[data-user-login-btn]');
  if (userLoginBtn) {
    userLoginBtn.addEventListener('click', () => {
      if (AuthManager.currentUser) {
        // 已登录，显示用户信息
        AuthManager.showUserInfo();
        if (DOM.dailogLogin) DOM.dailogLogin.style.display = 'flex';
      } else {
        // 未登录，显示登录表单
        AuthManager.showLoginForm();
        if (DOM.dailogLogin) DOM.dailogLogin.style.display = 'flex';
      }
    });
  }
}

// 登录表单切换
const btnShowRegister = document.querySelector('[data-btn-show-register]');
if (btnShowRegister) {
  btnShowRegister.addEventListener('click', () => {
    AuthManager.showRegisterForm();
  });
}

const btnShowLogin = document.querySelector('[data-btn-show-login]');
if (btnShowLogin) {
  btnShowLogin.addEventListener('click', () => {
    AuthManager.showLoginForm();
  });
}

// 登录按钮
const btnLogin = document.querySelector('[data-btn-login]');
if (btnLogin) {
  btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;
    
    AuthManager.hideError('login');
    
    const result = await AuthManager.login(email, password);
    if (result.success) {
      AuthManager.showUserInfo();
    } else {
      AuthManager.showError('login', result.error || getAuthText('loginFailedRetry'));
    }
  });
}

// 注册按钮
const btnRegister = document.querySelector('[data-btn-register]');
let isRegistering = false; // 防止重复提交
if (btnRegister) {
  btnRegister.addEventListener('click', async () => {
    // 防止重复提交
    if (isRegistering) {
      return;
    }
    
    const email = document.getElementById('register-email')?.value.trim();
    const username = document.getElementById('register-username')?.value.trim();
    const password = document.getElementById('register-password')?.value;
    const passwordConfirm = document.getElementById('register-password-confirm')?.value;
    
    AuthManager.hideError('register');
    
    // 基本验证
    if (!email || !username || !password) {
      AuthManager.showError('register', getAuthText('fillAllRequired'));
      return;
    }
    
    if (password !== passwordConfirm) {
      AuthManager.showError('register', getAuthText('passwordsNotMatch'));
      return;
    }
    
    // 禁用按钮并显示加载状态
    isRegistering = true;
    const originalText = btnRegister.textContent;
    btnRegister.disabled = true;
    btnRegister.style.opacity = '0.6';
    btnRegister.style.pointerEvents = 'none';
    btnRegister.textContent = getAuthText('registering');
    
    let result = null;
    let shouldKeepDisabled = false;
    
    try {
      result = await AuthManager.register(email, username, password);
      if (result.success) {
        if (result.needsConfirmation) {
          // 需要邮箱确认
          AuthManager.showError('register', result.message || getAuthText('registrationSuccessShort'));
          // 3秒后切换到登录表单
          setTimeout(() => {
            AuthManager.showLoginForm();
            AuthManager.hideError('register');
            //自动填充好账号邮箱
            document.getElementById('login-email').value = email;
          }, 3000);
        } else {
          // 注册成功且已登录
          AuthManager.showUserInfo();
        }
      } else {
        AuthManager.showError('register', result.error || getAuthText('registrationFailedRetry'));
        
        // 如果是速率限制错误，保持按钮禁用一段时间
        const lang = getLanguageIntime() || 'zh';
        const waitPattern = lang === 'zh' ? /(\d+)\s*秒/ : /(\d+)\s*seconds?/i;
        const rateLimitKeywords = lang === 'zh' ? ['等待', '秒'] : ['wait', 'seconds'];
        const isRateLimitError = rateLimitKeywords.some(keyword => 
          result.error?.toLowerCase().includes(keyword.toLowerCase())
        );
        if (isRateLimitError) {
          shouldKeepDisabled = true;
          const waitTime = parseInt(result.error.match(waitPattern)?.[1] || '7') * 1000;
          setTimeout(() => {
            isRegistering = false;
            btnRegister.disabled = false;
            btnRegister.style.opacity = '1';
            btnRegister.style.pointerEvents = 'auto';
            btnRegister.textContent = originalText;
          }, waitTime);
          return;
        }
      }
    } catch (e) {
      console.error('Registration error:', e);
      AuthManager.showError('register', getAuthText('registrationFailedRetry'));
    } finally {
      // 恢复按钮状态（除非是速率限制）
      if (!shouldKeepDisabled) {
        isRegistering = false;
        btnRegister.disabled = false;
        btnRegister.style.opacity = '1';
        btnRegister.style.pointerEvents = 'auto';
        btnRegister.textContent = originalText;
      }
    }
  });
}

// 用户名实时验证
const registerUsername = document.getElementById('register-username');
const registerUsernameError = document.getElementById('register-username-error');
if (registerUsername && registerUsernameError) {
  const updateUsernameValidation = () => {
    const username = registerUsername.value.trim();
    if (username) {
      const validation = AuthManager.validateUsername(username);
      if (!validation.valid) {
        // 显示错误提示（支持中英文）
        registerUsernameError.style.display = 'block';
        registerUsernameError.textContent = getLanguageIntime() === 'zh' ? validation.error : validation.errorEn || validation.error;
        registerUsernameError.setAttribute('data-zh-text', validation.error);
        registerUsernameError.setAttribute('data-en-text', validation.errorEn || validation.error);
      } else {
        // 隐藏错误提示
        registerUsernameError.style.display = 'none';
      }
    } else {
      // 输入为空时隐藏错误提示
      registerUsernameError.style.display = 'none';
    }
  };
  
  registerUsername.addEventListener('input', updateUsernameValidation);
  registerUsername.addEventListener('blur', updateUsernameValidation);
}

// 密码实时验证
const registerPassword = document.getElementById('register-password');
const registerPasswordError = document.getElementById('register-password-error');
if (registerPassword && registerPasswordError) {
  const updatePasswordValidation = () => {
    const password = registerPassword.value;
    if (password) {
      const validation = AuthManager.validatePassword(password);
      if (!validation.valid) {
        // 显示错误提示（支持中英文）
        registerPasswordError.style.display = 'block';
        registerPasswordError.textContent = getLanguageIntime() === 'zh' ? validation.error : validation.errorEn || validation.error;
        registerPasswordError.setAttribute('data-zh-text', validation.error);
        registerPasswordError.setAttribute('data-en-text', validation.errorEn || validation.error);
      } else {
        // 隐藏错误提示
        registerPasswordError.style.display = 'none';
      }
    } else {
      // 输入为空时隐藏错误提示
      registerPasswordError.style.display = 'none';
    }
  };
  
  registerPassword.addEventListener('input', updatePasswordValidation);
  registerPassword.addEventListener('blur', updatePasswordValidation);
}

// 退出登录按钮
const btnLogout = document.querySelector('[data-btn-logout]');
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    AuthManager.logout();
  });
};

// 关闭登录弹窗
function setupLoginDialogClose() {
  if (DOM.dailogLogin) {
    // 点击弹窗外部关闭
    DOM.dailogLogin.addEventListener('click', (e) => {
      if (e.target === DOM.dailogLogin) {
        DOM.dailogLogin.style.display = 'none';
      }
    });
  };
};

// 确保在 DOM 加载后执行初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAuthModule();
    setupLoginDialogClose();
  });
} else {
  // DOM 已经加载完成
  initAuthModule();
  setupLoginDialogClose();
};

function getLanguageIntime(){
  return ROOT.getAttribute('data-language').toLowerCase();
};