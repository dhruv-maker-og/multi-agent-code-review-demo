/**
 * Authentication middleware
 */
function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.substring(7);

  // Simple token validation (in production, use JWT)
  // For demo: check against api_key in database
  const db = require('../db/database');
  db.get('SELECT id, username, role FROM users WHERE api_key = ?', [token], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
}

/**
 * Admin authorization middleware
 */
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { authenticateUser, requireAdmin };
