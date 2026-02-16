# Multi-Agent Code Review Demo - Recording Script

## Setup Checklist
- [ ] Fresh repository initialized
- [ ] All code committed to main branch
- [ ] Feature branch created with vulnerable code
- [ ] PR draft created but not opened
- [ ] Browser windows arranged
- [ ] Timer ready (7-minute target)
- [ ] Screen recording software ready

## Act 1: Setup (30 seconds)

### Scene: Repository Overview
**Narration**:
"Today I'll show you how three specialized AI agents collaborate to review code for a REST API. We have Code Reviewer for quality, Security Scanner for vulnerabilities, and Documentation Bot for API docs."

**Screen Actions**:
1. Show repository structure in VS Code (5s)
   - Highlight `.github/agents/` folder with 3 agent files
   - Show `src/routes/users.js` briefly

2. Navigate to Pull Requests tab (3s)

3. Open draft PR #1 "feat: Add user search and management endpoints" (5s)

**Camera Focus**:
- Repository file tree (left)
- PR description (right)

---

## Act 2: Trigger (30 seconds)

### Scene: Activate Agents
**Narration**:
"Let's activate our agents. I'll open this PR, which automatically triggers our agent workflow."

**Screen Actions**:
1. Click "Ready for review" → Convert draft to open PR (3s)
2. Show GitHub Actions starting (5s)
   - Navigate to Actions tab
   - Show workflow "Multi-Agent Code Review" running

3. Return to PR Conversation tab (2s)

**Narration**:
"Watch as each agent analyzes the code independently. First up: the Code Reviewer."

---

## Act 3: Agent Coordination (3-4 minutes)

### Scene 3A: Code Reviewer Agent (60-75 seconds)

**Narration**:
"The Code Reviewer Agent focuses on code quality and best practices."

**Screen Actions**:
1. Wait 3-5 seconds (simulate processing)

2. Comment appears from @code-reviewer-bot (show typing animation if possible)

3. Scroll through Code Reviewer's comment:
   ```
   ## 🔍 Code Review Summary

   I've identified several issues with this PR:

   ### CRITICAL Issues
   - **Line 12**: No input validation on `username` parameter
   - **Line 15**: No error handling in database callback
   - **Line 23**: Missing authorization check

   ### HIGH Issues
   - **Line 8**: Function lacks JSDoc documentation
   - **Line 35**: Exposing internal error details to client
   - **Line 42**: Poor function naming (`getAllUsers` should be `listUsers`)

   ### MEDIUM Issues
   - **Line 51**: Missing pagination for large datasets
   - No test coverage for new endpoints

   ### Recommended Fixes
   [Show 2-3 specific code examples]

   **Overall Assessment**: ⚠️ Requires significant changes before approval
   ```

4. Show inline comments on specific lines (10s)
   - Navigate to Files Changed tab
   - Hover over line 12 showing SQL injection vulnerability
   - Show Code Reviewer's inline comment with fix suggestion

---

### Scene 3B: Security Scanner Agent (75-90 seconds)

**Narration**:
"Now the Security Scanner identifies vulnerabilities. This is where things get serious."

**Screen Actions**:
1. Back to Conversation tab (2s)

2. Security Scanner comment appears (show typing)

3. Scroll through Security Scanner's comment:
   ```
   ## 🔒 Security Analysis Report

   ### CRITICAL VULNERABILITIES ⛔

   #### 1. SQL Injection - CVE-2023-XXXXX Pattern
   **Location**: `src/routes/users.js:15`
   **Severity**: CRITICAL (CVSS 9.8)

   **Vulnerable Code**:
   ```javascript
   const query = `SELECT * FROM users WHERE username = '${username}'`;
   ```

   **Exploitation Example**:
   ```bash
   GET /api/users/search?username=' OR '1'='1
   # Returns all users bypassing authentication

   GET /api/users/search?username='; DROP TABLE users;--
   # Could destroy the database
   ```

   **Fix**:
   ```javascript
   const query = 'SELECT * FROM users WHERE username = ?';
   db.all(query, [username], (err, rows) => { ... });
   ```

   #### 2. Missing Authentication
   **Location**: `src/routes/users.js:8, 23, 42`
   **Severity**: CRITICAL (CVSS 9.1)

   All endpoints lack authentication checks. Anyone can:
   - Access user data
   - Modify user records
   - Access admin endpoints

   #### 3. Sensitive Data Exposure
   **Location**: `src/routes/users.js:20, 50`
   **Severity**: HIGH (CVSS 7.5)

   Endpoints return password_hash and api_key fields.

   ### Summary
   - 3 CRITICAL vulnerabilities
   - 2 HIGH vulnerabilities
   - 1 MEDIUM vulnerability

   **Recommendation**: ❌ BLOCK MERGE - Critical vulnerabilities must be fixed
   ```

4. Show inline security comments (10s)
   - Navigate to Files Changed
   - Show Security Scanner's inline comment on SQL injection line
   - Show comment on admin endpoint

---

### Scene 3C: Documentation Bot Agent (60 seconds)

**Narration**:
"Finally, the Documentation Bot ensures our API is well-documented."

**Screen Actions**:
1. Return to Conversation tab (2s)

2. Documentation Bot comment appears

3. Scroll through Documentation Bot's comment:
   ```
   ## 📚 Documentation Analysis

   ### Missing API Documentation

   I've identified 4 new API endpoints without documentation:

   #### 1. GET /api/users/search
   **Status**: ❌ No documentation

   **Generated Documentation**:
   /**
    * Search for users by username
    *
    * @route GET /api/users/search
    * @param {string} username.query.required - Username to search for
    * @returns {Array<User>} 200 - Array of matching users
    * @returns {Error} 500 - Database error
    * @security Bearer
    *
    * @example
    * GET /api/users/search?username=john_doe
    *
    * Response:
    * [{
    *   "id": 1,
    *   "username": "john_doe",
    *   "email": "john@example.com"
    * }]
    */

   #### Missing README Updates
   - New endpoints not listed in API reference
   - No usage examples provided

   ### Recommendations
   - Add JSDoc comments to all exported functions
   - Update README.md with new endpoints
   - Consider generating OpenAPI/Swagger spec

   **I can auto-generate these docs if you reply with** `@documentation-bot generate`
   ```

4. Show suggested file changes (8s)
   - Documentation Bot creates suggested commit
   - Shows diff with JSDoc comments added

---

## Act 4: Resolution (60-90 seconds)

### Scene: Applying Fixes
**Narration**:
"Let's address these findings. I'll push fixes for the critical security issues."

**Screen Actions**:
1. Switch to VS Code (3s)

2. Show fixed code - `src/routes/users.js` (20s)
   ```javascript
   // FIXED: Using parameterized queries
   const query = 'SELECT * FROM users WHERE username = ?';
   db.all(query, [username], (err, rows) => {
     // FIXED: Remove sensitive fields
     const sanitized = rows.map(({ password_hash, api_key, ...user }) => user);
     res.json(sanitized);
   });
   ```

3. Show added middleware - `src/middleware/auth.js` (15s)
   ```javascript
   const authenticateUser = (req, res, next) => {
     const token = req.headers.authorization;
     // Authentication logic
   };
   ```

4. Commit and push (10s)
   ```bash
   git add .
   git commit -m "fix: Address security vulnerabilities and add authentication"
   git push
   ```

5. Return to GitHub PR (5s)
   - Show new commit in timeline
   - Agents re-run automatically

6. Show updated comments (15s)
   - Security Scanner: ✅ "Critical vulnerabilities resolved"
   - Code Reviewer: ✅ "Improved, minor issues remain"
   - Documentation Bot: ⚠️ "Still missing documentation"

7. Apply documentation (12s)
   - Comment: `@documentation-bot generate`
   - Bot pushes commit with generated docs
   - Show diff with JSDoc comments

---

## Act 5: Wrap-up (30 seconds)

### Scene: Summary and Conclusion
**Narration**:
"In just a few minutes, three specialized agents identified SQL injection, missing authentication, data exposure risks, and missing documentation - issues that could take hours in traditional code review."

**Screen Actions**:
1. Show final summary comment (10s)
   ```
   ## ✅ Multi-Agent Review Complete

   ### Security Scanner
   ✅ All critical vulnerabilities resolved

   ### Code Reviewer
   ✅ Code quality acceptable

   ### Documentation Bot
   ✅ Documentation generated

   **Result**: Approved for merge ✅
   ```

2. Show merge button enabled (5s)

3. Quick recap slide (15s):
   - Title: "What We Caught"
   - SQL Injection vulnerabilities (2)
   - Missing authentication (3 endpoints)
   - Sensitive data exposure (2)
   - Missing documentation (4 endpoints)
   - Code quality issues (5)

**Narration**:
"This is the power of multi-agent workflows - specialized AI agents working together to ensure secure, high-quality code."

---

## Timing Breakdown
- Act 1 (Setup): 30s
- Act 2 (Trigger): 30s
- Act 3 (Agents): 3-4 min
  - Code Reviewer: 75s
  - Security Scanner: 85s
  - Documentation Bot: 60s
- Act 4 (Resolution): 75s
- Act 5 (Wrap-up): 30s

**Total**: 5:45 - 6:45 minutes ✅

---

## Recording Tips

### Camera Setup
- Record at 1080p minimum
- Use 60 FPS for smooth scrolling
- Hide desktop icons
- Clean browser tabs
- Use dark theme for better contrast

### Audio
- Clear, enthusiastic narration
- Background music (subtle, non-distracting)
- Sound effects for agent activations (optional)

### Visual Effects
- Highlight important lines with colored boxes
- Use zoom for code snippets
- Add agent avatars/icons
- Transition effects between acts
- Progress bar showing demo timeline

### Common Issues
- Agents running too fast: Add artificial delays
- Text too small: Zoom browser to 125%
- Too much scrolling: Cut to relevant sections
- Workflow too slow: Pre-record and speed up

## Pre-Recording Checklist
- [ ] All code committed and pushed
- [ ] PR created with proper description
- [ ] Agent comments pre-written (for manual trigger)
- [ ] Fixed code ready in separate branch
- [ ] Screen recorder configured
- [ ] Microphone tested
- [ ] Browser zoom set appropriately
- [ ] Notifications disabled
- [ ] Timer/stopwatch ready
