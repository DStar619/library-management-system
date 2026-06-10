/**
 * 自動每日報告任務
 * 使用 node-cron 每天定時生成報告
 */

const cron = require('node-cron');
const sqlite3 = require('sqlite3').verbose();

// 初始化數據庫連接
const db = new sqlite3.Database('./library.db');

/**
 * 生成每日報告
 */
function generateDailyReport() {
  console.log('🔄 開始生成每日報告...');
  
  db.all(`
    SELECT 
      (SELECT COUNT(*) FROM books) as total_books,
      (SELECT SUM(available) FROM books) as available_books,
      (SELECT SUM(quantity - available) FROM books) as borrowed_books,
      (SELECT COUNT(*) FROM loans WHERE status = 'borrowed' AND due_date < CURRENT_TIMESTAMP) as overdue_books
  `, (err, rows) => {
    if (err) {
      console.error('❌ 數據庫查詢錯誤:', err);
      return;
    }
    
    const stats = rows[0];
    const reportDate = new Date();
    const reportContent = `
╔════════════════════════════════════════╗
║     【每日圖書館管理報告】              ║
╚════════════════════════════════════════╝

📅 報告日期: ${reportDate.toLocaleDateString('zh-TW')} 
⏰ 生成時間: ${reportDate.toLocaleTimeString('zh-TW')}

┌────── 📚 圖書統計 ──────┐
│ 📖 總圖書數:     ${String(stats.total_books).padEnd(5)} 冊
│ ✅ 可借圖書:     ${String(stats.available_books).padEnd(5)} 冊
│ 📤 已借出數:     ${String(stats.borrowed_books).padEnd(5)} 冊
│ ⏰ 逾期未還:     ${String(stats.overdue_books).padEnd(5)} 冊
└─────────────────────────┘

📊 統計分析:
  • 圖書流通率: ${stats.total_books > 0 ? ((stats.borrowed_books / stats.total_books) * 100).toFixed(2) : 0}%
  • 可用圖書佔比: ${stats.total_books > 0 ? ((stats.available_books / stats.total_books) * 100).toFixed(2) : 0}%
  ${stats.overdue_books > 0 ? `⚠️  警告: 有 ${stats.overdue_books} 冊圖書逾期未還，請及時跟進！` : '✅ 所有圖書借閱情況良好'}

💡 建議:
  ${stats.borrowed_books / stats.total_books > 0.8 ? '   • 圖書流通較高，建議增加採購' : '   • 圖書流通正常'}
  ${stats.overdue_books > 5 ? '   • 逾期圖書過多，建議加強催還工作' : ''}

════════════════════════════════════════

系統: 圖書館管理系統 v1.0
生成機制: 自動化每日報告
    `;
    
    // 保存到數據庫
    db.run(
      `INSERT INTO daily_reports 
       (total_books, available_books, borrowed_books, overdue_books, report_content) 
       VALUES (?, ?, ?, ?, ?)`,
      [stats.total_books, stats.available_books, stats.borrowed_books, stats.overdue_books, reportContent],
      (err) => {
        if (err) {
          console.error('❌ 保存報告失敗:', err);
          return;
        }
        console.log('✅ 每日報告已生成並保存到數據庫');
        console.log(reportContent);
      }
    );
  });
}

/**
 * 設置定時任務
 * 每天 08:00 生成報告
 */
function setupDailyTask() {
  // 每天早上 8:00 執行
  cron.schedule('0 8 * * *', () => {
    console.log('\n─────────────────────────────────���───');
    generateDailyReport();
    console.log('─────────────────────────────────────\n');
  });
  
  console.log('✅ 自動報告任務已設置：每天 08:00 生成');
}

// 導出函數供 server.js 調用
module.exports = {
  setupDailyTask,
  generateDailyReport
};

// 如果直接運行此文件
if (require.main === module) {
  console.log('🚀 啟動定時報告服務...');
  setupDailyTask();
  console.log('任務已運行中，按 Ctrl+C 停止');
}
