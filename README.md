# Cloud Storage 图床

基于 Vue 3 + Cloudflare Workers + D1 + R2 的轻量级图床系统。

## 部署步骤

### 1. 准备 Cloudflare 资源
- 创建 D1 数据库：`storage-db`
- 创建 R2 存储桶：`default-bucket`（或自定义名称）
- 获取 R2 访问密钥 ID 和访问密钥

### 2. 配置项目
- 修改 `wrangler.toml` 中的 `database_id` 为你的 D1 数据库 ID
- 修改 `wrangler.toml` 中的 `ADMIN_USER` 和 `ADMIN_PASS` 设置管理员账号密码

### 3. 部署后端
```bash
npm install
npx wrangler deploy
```

### 4. 部署前端
```bash
npm run build
```
将 `dist` 文件夹上传到 Cloudflare Pages。

### 5. 配置环境变量
在 Cloudflare Pages 中设置：
- `API_URL`: 你的 Workers 域名（如 `https://cloud-storage-api.yourname.workers.dev`）

### 6. 首次登录
- 用户名：`admin`
- 密码：`admin123`
- 登录后在"存储策略"中配置 R2 存储桶信息

## 功能列表
- 登录/注册
- 数据分析
- 图片上传
- 图片管理
- 存储策略配置
- 系统设置

## 默认配置
- 管理员账号：admin
- 管理员密码：admin123
