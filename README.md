# 📚 圖書管理系統 - Library Management System

一個功能完整的**網頁版圖書館管理系統**，支持多AI協作、自動每日報告和實時數據庫連接。

![License](https://img.shields.io/badge/License-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-blue)
![Database](https://img.shields.io/badge/Database-SQLite-lightblue)

---

## ✨ 核心功能

### 📖 圖書管理
- ✅ 添加/編輯/刪除圖書
- ✅ 圖書分類管理
- ✅ ISBN 編碼支持
- ✅ 庫存數量追蹤

### 📤 借閱管理
- ✅ 實時借閱登記
- ✅ 歸還確認功能
- ✅ 逾期提醒
- ✅ 借閱歷史查詢

### 📊 報告系統
- ✅ 自動每日報告生成
- ✅ 統計數據匯總
- ✅ 流通率分析
- ✅ 報告歷史存檔

### 🌐 多平台支持
- ✅ Web 應用
- ✅ 移動設備適配
- ✅ SEO 優化
- ✅ 可被搜索引擎找到

---

## 🚀 快速開始

### 1️⃣ 系統要求
- Node.js 18+
- npm 或 yarn
- 現代網頁瀏覽器

### 2️⃣ 安裝步驟

```bash
# 克隆倉庫
git clone https://github.com/DStar619/library-management-system.git
cd library-management-system

# 安裝依賴
npm install

# 複製環境配置
cp .env.example .env

# 啟動應用
npm run dev
```

### 3️⃣ 訪問應用

打開瀏覽器訪問：
```
http://localhost:3000
```

---

## 📁 項目結構

```
library-management-system/
├── server.js              # Express 後端服務
├── daily-report.js        # 自動報告生成
├── package.json           # 項目依賴配置
├── .env.example           # 環境變量模板
├── library.db             # SQLite 數據庫
├── public/
│   └── index.html         # 前端主頁面
├── DEPLOYMENT.md          # 部署指南
└── README.md              # 此文件
```

---

## 🔌 API 文檔

### 圖書管理 API

#### 獲取所有圖書
```
GET /api/books
```

#### 添加新圖書
```
POST /api/books
Body: {
  "title": "書名",
  "author": "作者",
  "isbn": "ISBN碼",
  "category": "分類",
  "quantity": 1
}
```

#### 更新圖書
```
PUT /api/books/:id
Body: {
  "title": "新書名",
  "author": "新作者",
  "category": "新分類",
  "quantity": 2
}
```

#### 刪除圖書
```
DELETE /api/books/:id
```

### 借閱管理 API

#### 獲取所有借閱記錄
```
GET /api/loans
```

#### 創建借閱記錄
```
POST /api/loans
Body: {
  "book_id": 1,
  "user_name": "借閱者名字",
  "due_date": "2026-07-10"
}
```

#### 歸還圖書
```
POST /api/loans/:id/return
```

### 統計和報告 API

#### 獲取統計信息
```
GET /api/statistics
Response: {
  "total_books": 50,
  "available_books": 30,
  "borrowed_books": 20,
  "overdue_books": 2
}
```

#### 生成每日報告
```
POST /api/reports/generate
```

#### 獲取所有報告
```
GET /api/reports
```

---

## 💾 數據庫結構

### books 表
```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  category TEXT,
  quantity INTEGER,
  available INTEGER,
  created_at DATETIME
);
```

### loans 表
```sql
CREATE TABLE loans (
  id INTEGER PRIMARY KEY,
  book_id INTEGER,
  user_name TEXT,
  loan_date DATETIME,
  due_date DATETIME,
  return_date DATETIME,
  status TEXT
);
```

### daily_reports 表
```sql
CREATE TABLE daily_reports (
  id INTEGER PRIMARY KEY,
  report_date DATE,
  total_books INTEGER,
  available_books INTEGER,
  borrowed_books INTEGER,
  overdue_books INTEGER,
  report_content TEXT,
  created_at DATETIME
);
```

---

## 🌍 部署選項

### 本地部署
```bash
npm start
```

### Vercel 部署（前端）
1. 連接 GitHub 倉庫到 Vercel
2. 設置環境變量
3. 自動部署

### Railway 部署（完整應用）
1. 訪問 https://railway.app
2. 連接 GitHub
3. 設置啟動命令：`npm start`

### Render 部署
1. 訪問 https://render.com
2. 創建 Web Service
3. 設置環境變量和啟動命令

詳細部署指南見 [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📧 自動每日報告

系統會在每天 **08:00** 自動生成報告：

```
【每日圖書館管理報告】
報告日期: 2026-06-10
生成時間: 08:00:00

📚 圖書統計:
- 總圖書數: 100
- 可借圖書: 80
- 已借出: 20
- 逾期未還: 2
```

報告自動保存到數據庫並可在前端查看。

---

## 🔐 安全特性

- ✅ 環境變量隔離敏感信息
- ✅ CORS 跨域請求保護
- ✅ 數據驗證和清理
- ✅ SQLite 安全連接
- ✅ 數據庫自動備份支持

---

## 📱 SEO 優化

系統包含 SEO 優化，可被以下搜索引擎找到：
- 🔍 Google
- 🔍 Bing
- 🔍 Baidu
- 🔍 其他主流搜索引擎

### 提交索引
1. Google Search Console：https://search.google.com/search-console
2. Bing Webmaster：https://www.bing.com/webmasters

---

## 🎯 後續功能計劃

- [ ] 多 AI 聊天機制（GPT、Claude、Gemini）
- [ ] 用戶認證和授權
- [ ] 高級搜索過濾
- [ ] 數據可視化圖表
- [ ] 移動應用版本
- [ ] 實時通知系統
- [ ] 多語言支持
- [ ] PDF 報告生成

---

## 🛠️ 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| Node.js | 18+ | 後端運行環境 |
| Express.js | 4.18+ | Web 框架 |
| SQLite3 | 5.1+ | 數據庫 |
| node-cron | 3.0+ | 定時任務 |
| CORS | 2.8+ | 跨域支持 |

---

## 📝 使用示例

### 添加圖書示例

```javascript
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript 高級程序設計",
    "author": "Nicholas C. Zakas",
    "isbn": "978-7-5640-4572-7",
    "category": "編程",
    "quantity": 5
  }'
```

### 創建借閱示例

```javascript
curl -X POST http://localhost:3000/api/loans \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": 1,
    "user_name": "張三",
    "due_date": "2026-07-10"
  }'
```

---

## 🤝 貢獻指南

歡迎提交 Pull Requests 和 Issues！

1. Fork 本倉庫
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📄 許可證

本項目採用 MIT 許可證 - 詳見 [LICENSE](./LICENSE) 文件

---

## 📞 聯繫方式

- 🌐 GitHub: [@DStar619](https://github.com/DStar619)
- 📧 Email: 通過 GitHub Issues 聯繫

---

## ⭐ 致謝

感謝所有為此項目做出貢獻的人！

---

## 📊 狀態

| 項目 | 狀態 |
|------|------|
| 核心功能 | ✅ 完成 |
| 基礎測試 | ✅ 完成 |
| 文檔 | ✅ 完成 |
| AI 集成 | 🔄 開發中 |
| 用戶認證 | 📋 計劃中 |

---

**祝您使用愉快！** 📚✨

Made with ❤️ by DStar619
