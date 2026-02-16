const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Basic health/list endpoint (placeholder for future work)
router.get('/list', (req, res) => {
  db.all('SELECT id, username, email, role, created_at FROM users', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(rows);
  });
});

module.exports = router;
