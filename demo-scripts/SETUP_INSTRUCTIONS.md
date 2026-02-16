# Demo Setup Instructions

## Prerequisites
- GitHub account
- Node.js 18+ installed
- Git installed
- VS Code installed
- Screen recording software (OBS, Camtasia, ScreenFlow, etc.)

## Step-by-Step Setup

### 1. Initialize Repository (5 minutes)

```bash
# Navigate to repository
cd C:\Users\dhpaliwa\github\multi-agent-code-review-demo

# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Multi-agent demo setup"
```

### 2. Create GitHub Repository (3 minutes)

```bash
# Create repository on GitHub
gh repo create multi-agent-code-review-demo --public --source=. --remote=origin

# Push to remote
git push -u origin master
```

### 3. Test the Application (5 minutes)

```bash
# Install dependencies
npm install

# Create data directory
mkdir -p data

# Start the server
npm start

# In another terminal, test endpoints
curl "http://localhost:3000/api/users/list"
# Should return all users including password_hash
```

### 4. Test Vulnerabilities (5 minutes)

**SQL Injection Test**:
```bash
curl "http://localhost:3000/api/users/search?username=' OR '1'='1"
```
Should return all users (confirms SQL injection vulnerability).

**Missing Authentication Test**:
```bash
curl "http://localhost:3000/api/users/admin/getAllUsers"
```
Should succeed without auth header (confirms missing authentication).

**Data Exposure Test**:
```bash
curl "http://localhost:3000/api/users/list"
```
Response should include `password_hash` and `api_key` fields (confirms data exposure).

### 5. Create Feature Branch with Vulnerable Code (5 minutes)

```bash
# Stop the server (Ctrl+C)

# Ensure we're on master branch
git checkout master

# Create feature branch
git checkout -b feature/user-search-endpoint

# The vulnerable code is already in place
# Push feature branch
git push -u origin feature/user-search-endpoint
```

### 6. Create Pull Request (2 minutes)

```bash
# Create PR using GitHub CLI
gh pr create \
  --title "feat: Add user search and management endpoints" \
  --body "## Changes
- Added GET /api/users/search endpoint for searching users by username
- Added POST /api/users/update endpoint for updating user email
- Added GET /api/users/admin/getAllUsers for admin dashboard
- Added GET /api/users/list for listing all users

## Testing
- Manually tested all endpoints with curl
- Verified database queries return correct results

## Notes
Quick implementation to unblock frontend team. Will add tests in follow-up PR." \
  --draft
```

### 7. Prepare Fixed Code Branch (10 minutes)

Create a new file `src/routes/users-fixed.js` with secure implementation:

```javascript
const express = require('express');
const db = require('../db/database');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * Search for users by username
 * @route GET /api/users/search
 * @param {string} username.query.required - Username to search for
 * @returns {Array<User>} 200 - Array of matching users (without sensitive data)
 * @security Bearer
 */
router.get('/search', authenticateUser, (req, res) => {
  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username parameter required' });
  }

  // FIXED: Use parameterized query
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
 * @security Bearer
 */
router.post('/update', authenticateUser, (req, res) => {
  const { userId, email } = req.body;

  // FIXED: Authorization check
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: can only update own profile' });
  }

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
 * @security Bearer
 */
router.get('/admin/list', authenticateUser, requireAdmin, (req, res) => {
  const query = 'SELECT id, username, email, role, created_at FROM users';

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Query failed' });
    }

    res.json(rows);
  });
});

module.exports = router;
```

Save this for use during the demo - you'll swap `users.js` with this content during Act 4.

### 8. Prepare Agent Response Comments (20 minutes)

Create three files in `demo-scripts/agent-comments/`:

**code-reviewer-comment.md**:
```markdown
## 🔍 Code Review Summary

I've identified several issues with this PR:

### CRITICAL Issues
- **src/routes/users.js:12** - No input validation on `username` parameter
- **src/routes/users.js:15** - SQL query uses string concatenation (security risk)
- **src/routes/users.js:31** - No authorization check before updating user data

### HIGH Issues
- **src/routes/users.js:8** - Missing JSDoc documentation
- **src/routes/users.js:20** - Exposing database error details to client
- **src/routes/users.js:45** - Poor function naming convention
- **src/app.js:14** - Stack trace exposed in error response

### MEDIUM Issues
- **src/routes/users.js:54** - Missing pagination for potentially large dataset
- **tests/** - No test coverage for new endpoints

### Recommended Fixes

#### Fix Input Validation
\```javascript
router.get('/search', (req, res) => {
  const { username } = req.query;

  // Add validation
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Valid username required' });
  }
  // ...
});
\```

**Overall Assessment**: ⚠️ Requires significant changes before approval
```

**security-scanner-comment.md** and **documentation-bot-comment.md** should be created similarly based on the RECORDING_SCRIPT.md content.

### 9. Configure VS Code (2 minutes)

Ensure VS Code has these settings:

```json
{
  "editor.fontSize": 16,
  "editor.lineHeight": 24,
  "terminal.integrated.fontSize": 14,
  "workbench.colorTheme": "GitHub Dark Default",
  "editor.minimap.enabled": false
}
```

### 10. Configure Recording Software (5 minutes)

**OBS Studio Settings**:
- Canvas: 1920x1080
- Output: 60 FPS
- Bitrate: 10000 Kbps
- Audio: 192 Kbps

**Browser**: Set zoom to 125%

**System**:
- Disable notifications
- Close unnecessary applications
- Hide desktop icons

---

## Demo Day Checklist

**Morning of recording**:
- [ ] Restart computer (fresh state)
- [ ] Close all unnecessary applications
- [ ] Disable notifications
- [ ] Turn off Slack, email, etc.
- [ ] Test microphone
- [ ] Test screen recorder
- [ ] Open only required browser tabs
- [ ] Set browser to full screen
- [ ] Practice run-through once
- [ ] Have water nearby

---

## Troubleshooting

### Issue: npm install fails
**Solution**: Check Node.js version (must be 18+):
```bash
node --version
```

### Issue: Database file not created
**Solution**: Manually create data directory and restart:
```bash
mkdir -p data
npm start
```

### Issue: SQL injection test doesn't work
**Solution**: Ensure quotes are properly escaped in your shell. Try:
```bash
curl "http://localhost:3000/api/users/search?username='%20OR%20'1'='1"
```

### Issue: GitHub CLI not found
**Solution**: Install GitHub CLI:
```bash
winget install --id GitHub.cli
```

---

## Alternative: Manual PR Creation

If `gh` CLI isn't working, create PR manually:

1. Go to https://github.com/YOUR_USERNAME/multi-agent-code-review-demo
2. Click "Pull requests" → "New pull request"
3. Base: `master`, Compare: `feature/user-search-endpoint`
4. Click "Create pull request"
5. Set as draft
6. Add title and description as specified above
