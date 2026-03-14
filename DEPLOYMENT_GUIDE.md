# 🚀 Media Buyer Portfolio - 部署与操作手册

## 📋 目录

1. [项目概述](#项目概述)
2. [文件结构](#文件结构)
3. [GitHub 仓库设置](#github-仓库设置)
4. [Netlify 部署步骤](#netlify-部署步骤)
5. [Netlify Identity 配置](#netlify-identity-配置)
6. [Admin 角色设置](#admin-角色设置)
7. [环境变量配置](#环境变量配置)
8. [管理面板使用指南](#管理面板使用指南)
9. [常见问题解决](#常见问题解决)

---

## 项目概述

本项目是一个完整的 Media Buyer 作品集网站，包含：
- **主站点** (`index.html`) - 展示作品集和 KPI 仪表板
- **管理面板** (`admin.html`) - 内容管理系统
- **Netlify Identity** - 用户认证
- **Netlify Functions** - 后端 API

---

## 文件结构

```
portfolio-site/
├── index.html              # 主网站页面
├── admin.html              # 管理面板
├── netlify.toml            # Netlify 配置文件
├── css/
│   ├── style.css           # 主样式表
│   └── admin.css           # 管理面板样式
├── js/
│   ├── script.js           # 主脚本
│   └── admin.js            # 管理面板脚本
├── data/
│   ├── content.json        # 内容数据
│   └── samples/            # 示例数据
│       ├── sample_campaign.csv
│       └── sample_campaign.json
└── netlify/
    └── functions/          # Netlify Functions
        ├── content.js      # 内容 API
        └── git-commit.js   # Git 提交 API
```

---

## GitHub 仓库设置

### 步骤 1: 创建 GitHub 仓库

1. 登录 GitHub (https://github.com)
2. 点击右上角 **+** 按钮，选择 **New repository**
3. 填写仓库信息：
   - Repository name: `portfolio-site` (或任意名称)
   - Description: Media Buyer Portfolio
   - 选择 **Public** 或 **Private**
   - **不要**勾选 "Add a README file"
4. 点击 **Create repository**

### 步骤 2: 上传项目文件

**方法 A: 使用 GitHub Desktop**
1. 下载并安装 GitHub Desktop
2. 将项目文件夹拖入 GitHub Desktop
3. 点击 **Publish repository**

**方法 B: 使用 Git 命令行**
```bash
cd portfolio-site
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio-site.git
git push -u origin main
```

**方法 C: 直接上传**
1. 在 GitHub 仓库页面点击 **uploading an existing file**
2. 将所有项目文件拖入上传区域
3. 添加提交信息，点击 **Commit changes**

---

## Netlify 部署步骤

### 步骤 1: 创建 Netlify 账户

1. 访问 https://app.netlify.com
2. 点击 **Sign up** 使用 GitHub 账户注册
3. 授权 Netlify 访问您的 GitHub 仓库

### 步骤 2: 创建新站点

1. 登录 Netlify Dashboard
2. 点击 **Add new site** → **Import an existing project**
3. 选择 **GitHub** 作为部署来源
4. 授权并选择您的 `portfolio-site` 仓库
5. 配置构建设置：
   - Build command: (留空)
   - Publish directory: `.` 或 `.` (根目录)
6. 点击 **Deploy site**

### 步骤 3: 等待部署完成

- 首次部署通常需要 1-3 分钟
- 部署完成后，您将获得一个随机域名如：`random-name.netlify.app`

### 步骤 4: 设置自定义域名 (可选)

1. 进入站点 **Site settings** → **Domain management**
2. 点击 **Add custom domain**
3. 输入您的域名并按照提示配置 DNS

---

## Netlify Identity 配置

### 步骤 1: 启用 Identity

1. 进入 Netlify Dashboard
2. 选择您的站点
3. 点击顶部导航 **Integrations**
4. 找到 **Identity** 部分，点击 **Enable Identity**

### 步骤 2: 配置 Registration

1. 在 Identity 设置页面
2. 找到 **Registration** 部分
3. 选择 **Open** 或 **Invite only**
   - **Open**: 允许任何人注册
   - **Invite only**: 只有受邀用户才能注册 (推荐)
4. 点击 **Save**

### 步骤 3: 启用 Git Gateway

1. 在 Identity 设置页面
2. 找到 **Services** 部分
3. 点击 **Enable Git Gateway**
4. 这允许管理员通过 API 提交内容更改到 GitHub

### 步骤 4: 配置 External Providers (可选)

如果您希望用户可以使用 Google、GitHub 等登录：
1. 在 Identity 设置中找到 **External providers**
2. 点击 **Add provider**
3. 选择提供商并配置

---

## Admin 角色设置

### 步骤 1: 创建管理员账户

**方法 A: 通过 Netlify Dashboard**

1. 进入 Netlify Dashboard → **Integrations** → **Identity**
2. 点击 **Invite users**
3. 输入您的邮箱地址
4. 选择角色：**Admin**
5. 点击 **Send invitation**
6. 检查邮箱并点击邀请链接完成注册

**方法 B: 首次访问管理面板**

1. 访问 `https://your-site.netlify.app/admin.html`
2. 点击 **Create Admin Account**
3. 输入邮箱和密码
4. 您将收到确认邮件，点击链接确认
5. 返回 Netlify Dashboard → **Integrations** → **Identity**
6. 找到新创建的用户，点击编辑
7. 添加角色：**admin**
8. 点击 **Save**

### 步骤 2: 验证 Admin 权限

1. 访问 `https://your-site.netlify.app/admin.html`
2. 使用管理员账户登录
3. 如果配置正确，您将看到管理面板
4. 如果看到 "Access Denied" 页面，说明：
   - 用户角色未正确设置
   - 请返回 Netlify Dashboard 确认角色为 **admin**

### 角色权限说明

| 角色 | 权限 |
|------|------|
| **admin** | 完全访问管理面板，可以编辑所有内容 |
| **editor** | 可以编辑内容，但不能管理用户或设置 |
| **viewer** | 只读访问 |

---

## 环境变量配置

### 必需的环境变量 (用于 Git 集成)

如果您希望内容更改自动提交到 GitHub：

1. 进入 Netlify Dashboard → **Site settings** → **Environment variables**
2. 点击 **Add a variable**
3. 添加以下变量：

| 变量名 | 描述 | 获取方式 |
|--------|------|----------|
| `GITHUB_TOKEN` | GitHub 个人访问令牌 | 见下方说明 |
| `GITHUB_REPO` | GitHub 仓库 | 格式: `username/repo` |
| `GITHUB_BRANCH` | 分支名称 | 默认: `main` |

### 获取 GitHub Token

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 填写：
   - Note: `Netlify Portfolio`
   - Expiration: 选择有效期 (推荐 90 天)
   - Select scopes: 勾选 **repo** (完整仓库访问)
4. 点击 **Generate token**
5. **立即复制** Token (只显示一次！)
6. 将 Token 添加到 Netlify 环境变量

### 不使用 Git 集成

如果不需要自动提交到 GitHub：
- 可以不配置环境变量
- 内容将存储在浏览器的 localStorage 中
- 功能仍然正常工作，但数据不会持久化到 Git

---

## 管理面板使用指南

### 访问管理面板

1. 访问 `https://your-site.netlify.app/admin.html`
2. 使用 Netlify Identity 账户登录

### Dashboard (仪表板)

显示网站内容统计：
- 项目数量
- 技能数量
- 经历条目
- 服务项目

### Hero Section 编辑

编辑首页顶部区域：
- Badge 文字
- 主标题
- 副标题
- 统计数据 (3个)

### Projects (项目管理)

添加、编辑、删除项目：
1. 点击 **Add Project**
2. 填写项目信息：
   - 标题
   - 分类
   - 描述
   - 广告支出
   - ROAS
   - 图片 URL
   - 项目链接
3. 点击 **Save**

### Skills (技能管理)

管理技能列表：
- 技能名称
- 分类 (Advertising, Analytics, Creative, Technical, Strategy)
- 熟练度 (0-100%)

### Experience (工作经历)

管理工作经历：
- 职位名称
- 公司名称
- 工作时间
- 地点
- 描述

### Services (服务项目)

管理提供的服务：
- 服务名称
- 描述
- 图标

### Contact (联系方式)

管理联系信息：
- 邮箱
- 电话
- LinkedIn
- Twitter
- WhatsApp 号码
- WhatsApp 按钮开关
- WhatsApp 默认消息

### Settings (设置)

站点全局设置：
- 网站标题
- Meta 描述
- Meta 关键词
- Google Analytics ID
- 主题颜色
- 审计阈值

---

## 常见问题解决

### 问题 1: 管理面板无限加载

**原因**: Netlify Identity 未正确配置或未启用

**解决方案**:
1. 确认已在 Netlify Dashboard 启用 Identity
2. 检查浏览器控制台是否有错误
3. 清除浏览器缓存并刷新

### 问题 2: 登录后显示 "Access Denied"

**原因**: 用户角色未设置为 admin

**解决方案**:
1. 进入 Netlify Dashboard → Integrations → Identity
2. 找到您的用户
3. 点击用户名进入编辑页面
4. 确认角色包含 **admin**
5. 点击 **Save**

### 问题 3: 登录后重定向到首页而不是管理面板

**原因**: Identity widget 回调配置问题

**解决方案**:
检查 index.html 中是否包含以下代码：
```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin.html";
        });
      }
    });
  }
</script>
```

### 问题 4: 内容更改未保存到 GitHub

**原因**: Git Gateway 或环境变量未配置

**解决方案**:
1. 确认 Git Gateway 已启用
2. 检查环境变量是否正确配置：
   - GITHUB_TOKEN
   - GITHUB_REPO
   - GITHUB_BRANCH

### 问题 5: WhatsApp 按钮不显示

**原因**: content.json 中未配置 WhatsApp 或未启用

**解决方案**:
1. 进入管理面板 → Contact
2. 填写 WhatsApp 号码
3. 勾选 "Show WhatsApp Floating Button"
4. 保存更改

### 问题 6: 样式或脚本未加载

**原因**: 文件路径错误或缓存问题

**解决方案**:
1. 检查文件路径是否正确 (相对路径)
2. 在 Netlify Dashboard 触发重新部署
3. 清除浏览器缓存

---

## 支持与反馈

如有问题，请检查：
1. Netlify Dashboard 的 **Deploys** 日志
2. 浏览器开发者工具的 **Console** 面板
3. Netlify Functions 日志 (**Functions** 标签页)

---

## 快速参考

| 项目 | URL |
|------|-----|
| 网站首页 | `https://your-site.netlify.app/` |
| 管理面板 | `https://your-site.netlify.app/admin.html` |
| Netlify Dashboard | `https://app.netlify.com/` |
| GitHub Token 设置 | `https://github.com/settings/tokens` |

---

**祝您使用愉快！** 🎉
