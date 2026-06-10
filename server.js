const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 初始化數據庫
const db = new sqlite3.Database('./library.db', (err) => {
  if (err) {
    console.error('數據庫連接失敗:', err);
  } else {
    console.log('✓ 數據庫連接成功');
    initDatabase();
  }
});

// 初始化數據庫表
function initDatabase() {
  // 圖書表
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT UNIQUE,
      category TEXT,
      quantity INTEGER DEFAULT 1,
      available INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 借閱記錄表
  db.run(`
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      loan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      due_date DATETIME,
      return_date DATETIME,
      status TEXT DEFAULT 'borrowed',
      FOREIGN KEY (book_id) REFERENCES books(id)
    )
  `);

  // 每日報告表
  db.run(`
    CREATE TABLE IF NOT EXISTS daily_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_date DATE DEFAULT CURRENT_DATE,
      total_books INTEGER,
      available_books INTEGER,
      borrowed_books INTEGER,
      overdue_books INTEGER,
      report_content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✓ 數據庫表初始化完成');
}

// ===== 圖書管理 API =====

// 1. 獲取所有圖書
app.get('/api/books', (req, res) => {
  db.all('SELECT * FROM books', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 2. 添加圖書
app.post('/api/books', (req, res) => {
  const { title, author, isbn, category, quantity } = req.body;
  
  db.run(
    'INSERT INTO books (title, author, isbn, category, quantity, available) VALUES (?, ?, ?, ?, ?, ?)',
    [title, author, isbn, category, quantity || 1, quantity || 1],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        success: true, 
        id: this.lastID,
        message: '圖書添加成功'
      });
    }
  );
});

// 3. 更新圖書
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, category, quantity } = req.body;
  
  db.run(
    'UPDATE books SET title = ?, author = ?, category = ?, quantity = ? WHERE id = ?',
    [title, author, category, quantity, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, message: '圖書更新成功' });
    }
  );
});

// 4. 刪除圖書
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM books WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: '圖書刪除成功' });
  });
});

// ===== 借閱管理 API =====

// 5. 獲取所有借閱記錄
app.get('/api/loans', (req, res) => {
  db.all(`
    SELECT loans.*, books.title 
    FROM loans 
    JOIN books ON loans.book_id = books.id
    ORDER BY loans.loan_date DESC
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 6. 創建借閱記錄
app.post('/api/loans', (req, res) => {
  const { book_id, user_name, due_date } = req.body;
  
  // 更新圖書可用數量
  db.run(
    'UPDATE books SET available = available - 1 WHERE id = ?',
    [book_id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // 創建借閱記錄
      db.run(
        'INSERT INTO loans (book_id, user_name, due_date) VALUES (?, ?, ?)',
        [book_id, user_name, due_date],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ 
            success: true, 
            id: this.lastID,
            message: '借閱成功'
          });
        }
      );
    }
  );
});

// 7. 歸還圖書
app.post('/api/loans/:id/return', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT book_id FROM loans WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // 更新圖書可用數量
    db.run(
      'UPDATE books SET available = available + 1 WHERE id = ?',
      [row.book_id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        // 更新借閱記錄
        db.run(
          'UPDATE loans SET status = ?, return_date = CURRENT_TIMESTAMP WHERE id = ?',
          ['returned', id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, message: '歸還成功' });
          }
        );
      }
    );
  });
});

// ===== 統計和報告 API =====

// 8. 獲取圖書館統計信息
app.get('/api/statistics', (req, res) => {
  db.all(`
    SELECT 
      (SELECT COUNT(*) FROM books) as total_books,
      (SELECT SUM(available) FROM books) as available_books,
      (SELECT SUM(quantity - available) FROM books) as borrowed_books,
      (SELECT COUNT(*) FROM loans WHERE status = 'borrowed' AND due_date < CURRENT_TIMESTAMP) as overdue_books
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows[0]);
  });
});

// 9. 生成每日報告
app.post('/api/reports/generate', (req, res) => {
  db.all(`
    SELECT 
      (SELECT COUNT(*) FROM books) as total_books,
      (SELECT SUM(available) FROM books) as available_books,
      (SELECT SUM(quantity - available) FROM books) as borrowed_books,
      (SELECT COUNT(*) FROM loans WHERE status = 'borrowed' AND due_date < CURRENT_TIMESTAMP) as overdue_books
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const stats = rows[0];
    const report_content = `
    【每日圖書館報告】
    日期: ${new Date().toLocaleDateString('zh-TW')}
    
    📚 圖書統計:
    - 總圖書數: ${stats.total_books}
    - 可借圖書: ${stats.available_books}
    - 已借出: ${stats.borrowed_books}
    - 逾期未還: ${stats.overdue_books}
    
    ⏰ 生成時間: ${new Date().toLocaleString('zh-TW')}
    `;
    
    db.run(
      'INSERT INTO daily_reports (total_books, available_books, borrowed_books, overdue_books, report_content) VALUES (?, ?, ?, ?, ?)',
      [stats.total_books, stats.available_books, stats.borrowed_books, stats.overdue_books, report_content],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ 
          success: true, 
          message: '報告生成成功',
          report: report_content
        });
      }
    );
  });
});

// 10. 獲取所有報告
app.get('/api/reports', (req, res) => {
  db.all('SELECT * FROM daily_reports ORDER BY report_date DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`✓ 服務器運行在 http://localhost:${PORT}`);
  console.log('📚 圖書管理系統已啟動');
});
