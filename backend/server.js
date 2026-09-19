const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Lưu database vào volume /app/data/wishes.db
const dbPath = path.resolve('/app/data', 'wishes.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Lỗi kết nối SQLite:', err);
  else console.log('Đã kết nối SQLite tại:', dbPath);
});

// Khởi tạo bảng
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    attending TEXT NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Gửi lời chúc & xác nhận tham dự
app.post('/api/wishes', (req, res) => {
  const { name, attending, message } = req.body;
  if (!name || !attending) {
    return res.status(400).json({ error: 'Vui lòng nhập tên và trạng thái tham dự' });
  }

  const stmt = db.prepare('INSERT INTO wishes (name, attending, message) VALUES (?, ?, ?)');
  stmt.run(name, attending, message, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
  stmt.finalize();
});

// Lấy danh sách lời chúc
app.get('/api/wishes', (req, res) => {
  db.all('SELECT name, attending, message, created_at FROM wishes ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});