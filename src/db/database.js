const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ISSUE: Database file location not configurable
const dbPath = path.join(__dirname, '../../data/users.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  }
});

// Initialize database with sample data
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    api_key TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert sample data for demo
  const sampleUsers = [
    ['john_doe', 'john@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'user', 'sk_test_abc123'],
    ['admin', 'admin@example.com', '$2b$10$xyzxyzxyzxyzxyzxyzxyzx', 'admin', 'sk_admin_xyz789'],
    ['jane_smith', 'jane@example.com', '$2b$10$123456789012345678901', 'user', 'sk_test_def456']
  ];

  const stmt = db.prepare('INSERT OR IGNORE INTO users (username, email, password_hash, role, api_key) VALUES (?, ?, ?, ?, ?)');
  sampleUsers.forEach(user => stmt.run(user));
  stmt.finalize();
});

module.exports = db;
