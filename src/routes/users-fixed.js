const express = require('express');
const db = require('../db/database');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * Search for users by username
 * @route GET /api/users/search
 * @param {string} username.query.required - Username to search for
 * @returns {Array<User>} 200 - Array of matching users (without sensitive data)
 * @returns {Object} 400 - Missing or invalid username parameter
 * @returns {Object} 401 - Authentication required
 * @returns {Object} 500 - Database error
 * @security Bearer
 */
router.get('/search', authenticateUser, (req, res) => {
  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username parameter required' });
  }

  // FIXED: Use parameterized query instead of string concatenation
  const query = 'SELECT id, username, email, role, created_at FROM users WHERE username = ?';

  db.all(query, [username], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.json(rows);
  });
});

/**
 * Update user email
 * @route POST /api/users/update
 * @param {number} userId.body.required - User ID to update
 * @param {string} email.body.required - New email address
 * @returns {Object} 200 - Success confirmation
 * @returns {Object} 400 - Invalid email format
 * @returns {Object} 401 - Authentication required
 * @returns {Object} 403 - Forbidden (can only update own profile or admin)
 * @returns {Object} 500 - Database error
 * @security Bearer
 */
router.post('/update', authenticateUser, (req, res) => {
  const { userId, email } = req.body;

  // FIXED: Authorization check - users can only update themselves
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: can only update own profile' });
  }

  // FIXED: Input validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // FIXED: Parameterized query
  const updateQuery = 'UPDATE users SET email = ? WHERE id = ?';

  db.run(updateQuery, [email, userId], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Update failed' });
    }

    res.json({ success: true, changes: this.changes });
  });
});

/**
 * List all users (admin only)
 * @route GET /api/users/admin/list
 * @returns {Array<User>} 200 - Array of all users (without sensitive data)
 * @returns {Object} 401 - Authentication required
 * @returns {Object} 403 - Admin access required
 * @returns {Object} 500 - Database error
 * @security Bearer (Admin)
 */
router.get('/admin/list', authenticateUser, requireAdmin, (req, res) => {
  // FIXED: Exclude sensitive fields from response
  const query = 'SELECT id, username, email, role, created_at FROM users';

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Query failed' });
    }

    res.json(rows);
  });
});

/**
 * List all users (public, limited fields)
 * @route GET /api/users/list
 * @returns {Array<User>} 200 - Array of users with public fields only
 * @returns {Object} 500 - Database error
 */
router.get('/list', (req, res) => {
  // FIXED: Only return non-sensitive fields
  const query = 'SELECT id, username, role, created_at FROM users';

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Query failed' });
    }

    res.json(rows);
  });
});

module.exports = router;
