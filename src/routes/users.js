const express = require('express');
const db = require('../db/database');

const router = express.Router();

// VULNERABILITY: No authentication/authorization
// VULNERABILITY: SQL Injection via string concatenation
// ISSUE: No input validation
// ISSUE: No error handling
// ISSUE: No documentation
router.get('/search', (req, res) => {
  const username = req.query.username;

  // CRITICAL: SQL Injection vulnerability
  const query = `SELECT * FROM users WHERE username = '${username}'`;

  db.all(query, (err, rows) => {
    // ISSUE: Exposing database errors to client
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // VULNERABILITY: Exposing sensitive data (password hashes)
    res.json(rows);
  });
});

// VULNERABILITY: No authentication required for sensitive operation
// VULNERABILITY: SQL Injection in UPDATE statement
// ISSUE: No authorization check (any user can update any user)
router.post('/update', async (req, res) => {
  const userId = req.body.userId;
  const email = req.body.email;

  // CRITICAL: SQL Injection via string concatenation
  const updateQuery = `UPDATE users SET email = '${email}' WHERE id = ${userId}`;

  db.run(updateQuery, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    res.json({ success: true, changes: this.changes });
  });
});

// VULNERABILITY: Admin endpoint with no authentication
// ISSUE: Poor naming convention
router.get('/admin/getAllUsers', (req, res) => {
  // VULNERABILITY: No admin authorization check
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // VULNERABILITY: Exposing password hashes and sensitive info
    res.json(rows);
  });
});

// ISSUE: Missing pagination
// ISSUE: No rate limiting on expensive query
router.get('/list', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

module.exports = router;
