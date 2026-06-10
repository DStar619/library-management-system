# 📚 圖書管理系統 - 部署指南

## 本地開發環境設置

### 1. 安裝 Node.js
- 訪問 https://nodejs.org/
- 下載 LTS 版本並安裝

### 2. 克隆或下載本項目

```bash
git clone https://github.com/DStar619/library-management-system.git
cd library-management-system
```

### 3. 安裝依賴

```bash
npm install
```

### 4. 配置環境變量

```bash
# 複製環境配置文件
cp .env.example .env

# 編輯 .env 文件（根據需要修改）
```

### 5. 啟動應用

**開發模式**（支持自動重載）：
```bash
npm run dev
```

**生產模式**：
```bash
npm start
```

### 6. 訪問應用

打開瀏覽器訪問：
```
http://localhost:3000
```

---

## 使用 Vercel 部署（前端）

### 1. 準備 GitHub 倉庫
- 確保代碼已推送到 GitHub

### 2. 連接到 Vercel
- 訪問 https://vercel.com
- 點擊 "New Project"
- 選擇 GitHub 倉庫
- 導入設置

### 3. 環境變量
- 在 Vercel 中設置 `API_URL` 指向後端

---

## 使用 Railway 部署（後端）

### 1. 連接 GitHub
- 訪問 https://railway.app
- 點擊 "New Project"
- 選擇 "Deploy from GitHub"

### 2. 配置
- 選擇倉庫
- 設置環境變量
- 設置啟動命令：`npm start`

### 3. 數據庫
- Railway 將自動生成 SQLite 數據庫

---

## 使用 Render 部署

### 1. 連接 GitHub
- 訪問 https://render.com
- 新建 "Web Service"
- 連接 GitHub 倉庫

### 2. 設置
- 構建命令：`npm install`
- 啟動命令：`npm start`
- 設置環境變量

### 3. 部署
- Render 將自動部署

---

## 使用 Docker 部署

### 1. 創建 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. 構建 Docker 鏡像

```bash
docker build -t library-management-system .
```

### 3. 運行容器

```bash
docker run -p 3000:3000 library-management-system
```

---

## 使用 GitHub Pages 部署（靜態資源）

### 1. 配置 GitHub Pages
- 進入倉庫設置
- 選擇 "Pages"
- 選擇 "main" 分支下的 `/public` 目錄
- 等待部署完成

### 2. 訪問
- 網址：`https://DStar619.github.io/library-management-system`

---

## SEO 優化（使被搜索引擎找到）

### 1. 添加 SEO 元標籤

在 `public/index.html` 的 `<head>` 中添加：

```html
<!-- SEO Meta Tags -->
<meta name="description" content="多AI協作的圖書館管理系統，支持圖書管理、借閱追蹤和自動報告生成">
<meta name="keywords" content="圖書館管理,書籍管理,借閱系統,AI,自動報告">
<meta name="author" content="DStar619">
<meta property="og:title" content="圖書管理系統 - Library Management System">
<meta property="og:description" content="智能圖書館管理平台">
<meta property="og:type" content="website">
```

### 2. 提交 Sitemap

創建 `public/sitemap.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com</loc>
    <lastmod>2026-06-10</lastmod>
    <changefreq>weekly</changefreq>
  </url>
</urlset>
```

### 3. 提交到搜索引擎

- **Google Search Console**：https://search.google.com/search-console
- **Bing Webmaster Tools**：https://www.bing.com/webmasters

---

## 自動每日報告設置

### 使用服務器定時任務

1. 安裝依賴：
```bash
npm install node-cron
```

2. 更新 `server.js`：

```javascript
const { setupDailyTask } = require('./daily-report.js');

// 在服務器啟動時
setupDailyTask();
```

3. 報告將在每天 08:00 自動生成

### 使用云定時任務

**AWS CloudWatch**：
- 設置定時規則調用 API 端點 `/api/reports/generate`

**Google Cloud Scheduler**：
- 創建定時任務 POST 到報告生成端點

---

## 數據庫備份

### SQLite 備份

```bash
# 備份數據庫
cp library.db library.db.backup

# 或使用 SQL 備份
sqlite3 library.db ".backup library.db.backup"
```

### 自動備份腳本

創建 `backup.js`：

```javascript
const fs = require('fs');
const path = require('path');

function backupDatabase() {
  const source = './library.db';
  const backup = `./backups/library.db.${Date.now()}.backup`;
  
  fs.copyFileSync(source, backup);
  console.log(`✓ 數據庫備份成功: ${backup}`);
}

// 每天備份
require('node-cron').schedule('0 3 * * *', backupDatabase);
```

---

## 安全建議

1. **環境變量**：不要在代碼中硬編碼敏感信息
2. **HTTPS**：使用 HTTPS 協議傳輸數據
3. **驗證**：添加用戶認證和授權機制
4. **備份**：定期備份數據庫
5. **日誌**：記錄所有操作日誌用於審計

---

## 常見問題

### Q: 如何連接遠程數據庫？
A: 在 `server.js` 中修改數據庫連接字符串，使用 PostgreSQL：

```javascript
const db = new (require('pg')).Client({
  connectionString: process.env.DATABASE_URL
});
```

### Q: 如何添加用戶認證？
A: 安裝 `passport.js` 並配置身份驗證策略

### Q: 如何增加多 AI 功能？
A: 在 API 中集成 OpenAI、Claude 等服務

---

## 後續功能擴展

- [ ] 用戶認證系統
- [ ] 多 AI 聊天機制
- [ ] 高級搜索和過濾
- [ ] 統計圖表可視化
- [ ] 移動應用版本
- [ ] 實時通知系統

---

## 支持

如有任何問題，請提交 Issue 或聯繫開發者。

**祝您使用愉快！** 📚✨
