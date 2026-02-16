# Copilot Instructions for Multi-Agent Code Review Demo

## Project Purpose
This is an **educational demo repository** showcasing multi-agent workflows for automated code review. The vulnerabilities in `src/routes/users.js` are **intentional features**, not bugs to fix. This codebase demonstrates how AI agents detect security issues, code quality problems, and missing documentation.

## Critical Understanding
- **DO NOT** fix vulnerabilities in `src/routes/users.js` - they are the demo's core value
- **DO NOT** add authentication/authorization to vulnerable endpoints - they're meant to be exploitable
- The correct implementations exist in `src/middleware/auth.js` as reference, not for active use
- Comments like `// VULNERABILITY:` and `// ISSUE:` are intentional markers for agents to find

## Architecture

### Core Components
```
src/
├── app.js                   # Express app with intentional security flaws
├── routes/users.js          # Vulnerable endpoints (SQL injection, missing auth)
├── db/database.js           # SQLite with sample users (includes password_hash, api_key)
└── middleware/auth.js       # Correct auth implementation (reference only)
```

### Agent Definitions
`.github/agents/` contains three specialized agents:
- **code-reviewer.agent.md**: Detects code quality issues, anti-patterns
- **security-scanner.agent.md**: Finds OWASP vulnerabilities (SQL injection, auth bypass)
- **documentation-bot.agent.md**: Identifies missing API docs

## Development Workflows

### Running Locally
```bash
npm install          # Install express, sqlite3
npm start            # Start server on port 3000
npm run dev          # Development mode with nodemon
```

### Testing Vulnerabilities (Essential for Demos)
```powershell
# Windows PowerShell - use curl.exe with URL-encoded parameters
# SQL Injection - Returns all users (single quotes encoded as %27)
curl.exe "http://localhost:3000/api/users/search?username=%27%20OR%20%271%27=%271"

# Missing Auth - Admin endpoint accessible to anyone
curl.exe "http://localhost:3000/api/users/admin/getAllUsers"

# Data Exposure - Shows password_hash and api_key fields
curl.exe "http://localhost:3000/api/users/list"

# SQL Injection in UPDATE
$body = '{"userId": "1 OR 1=1", "email": "evil@hack.com"}'
curl.exe -X POST "http://localhost:3000/api/users/update" `
  -H "Content-Type: application/json" `
  -d $body
```

```bash
# Linux/Mac bash - standard curl syntax
curl "http://localhost:3000/api/users/search?username=' OR '1'='1"
curl "http://localhost:3000/api/users/admin/getAllUsers"
curl "http://localhost:3000/api/users/list"
curl -X POST "http://localhost:3000/api/users/update" \
  -H "Content-Type: application/json" \
  -d '{"userId": "1 OR 1=1", "email": "evil@hack.com"}'
```

## Demo Presentation Workflow
1. Follow `demo-scripts/RECORDING_SCRIPT.md` for 5-7 minute structured demo
2. Use `demo-scripts/VERIFICATION_CHECKLIST.md` before recording
3. Create PR to trigger agent workflow (see `demo-scripts/SETUP_INSTRUCTIONS.md`)

## Project-Specific Conventions

### Vulnerability Markers
Every vulnerability is documented with inline comments:
```javascript
// VULNERABILITY: SQL Injection via string concatenation
// CRITICAL: No input validation
// ISSUE: Exposing sensitive data
```
These markers help presenters and agents identify the 7+ intentional security flaws.

### Database Schema
`data/users.db` contains sample users with:
- `password_hash`: Intentionally exposed (demonstrates data leakage)
- `api_key`: Used in `auth.js` for Bearer token validation
- `role`: 'admin' or 'user' for authorization demos

### Endpoint Naming Convention (Intentionally Poor)
- `/api/users/admin/getAllUsers` - Poor naming is intentional (should be `/api/admin/users`)
- No versioning (`/v1/`) - Intentional omission for agents to catch

## When Adding New Demo Content

### To Add New Vulnerabilities
1. Add to `src/routes/users.js` with clear `// VULNERABILITY:` comment
2. Update README.md "Vulnerabilities Included" section
3. Add curl test command to README.md and `SETUP_INSTRUCTIONS.md`
4. Test that agents can detect it

### To Add/Modify Agents
1. Edit `.github/agents/*.agent.md` definitions
2. Agents expect markdown format with expertise and review instructions
3. Test against existing vulnerabilities in `src/routes/users.js`

### To Update Demo Scripts
1. `RECORDING_SCRIPT.md`: 5-act structure with specific timings
2. `SETUP_INSTRUCTIONS.md`: Step-by-step setup for fresh environments
3. `VERIFICATION_CHECKLIST.md`: Pre-demo validation steps

## What NOT to Do
- ❌ Add input validation or parameterized queries to `src/routes/users.js`
- ❌ Implement authentication on vulnerable endpoints
- ❌ Remove password_hash/api_key from API responses
- ❌ Add try-catch blocks or proper error handling to vulnerable code
- ❌ Add test coverage (intentionally absent to demonstrate missing tests)
- ❌ Fix "poor naming" like `getAllUsers` (agents should flag these)

## Integration Points
- **GitHub Agent HQ**: Agents defined in `.github/agents/` are consumed by GitHub's multi-agent orchestration
- **GitHub Actions**: Optional workflows in `.github/workflows/` can trigger agent reviews
- **SQLite**: Self-contained database in `data/` (no external dependencies)

## Educational Value
This demo teaches:
1. How multi-agent workflows coordinate specialized reviewers
2. Real-world vulnerability patterns (SQL injection, auth bypass, data exposure)
3. The difference between agent detection and human fixes
4. Best practices through counter-examples (what NOT to do)
