# Multi-Agent Code Review Demo

This repository demonstrates a multi-agent workflow for automated code review, security scanning, and documentation generation using GitHub Agent HQ.

## Overview

Watch three specialized AI agents collaborate to review a pull request:

- **🔍 Code Reviewer Agent**: Analyzes code quality, identifies anti-patterns, and suggests improvements
- **🔒 Security Scanner Agent**: Finds security vulnerabilities (SQL injection, missing auth, data exposure)
- **📚 Documentation Bot Agent**: Ensures comprehensive API documentation

## Demo Scenario

This demo showcases a pull request with intentional vulnerabilities in a REST API:

### Vulnerabilities Included
- ❌ SQL injection in user search endpoint
- ❌ Missing authentication on sensitive endpoints
- ❌ Missing authorization checks
- ❌ Sensitive data exposure (password hashes, API keys)
- ❌ Poor error handling
- ❌ Undocumented API endpoints
- ❌ No test coverage

### What the Agents Catch
- **2** SQL injection vulnerabilities
- **3** missing authentication/authorization issues
- **2** sensitive data exposure risks
- **4** undocumented endpoints
- **5+** code quality issues

## Repository Structure

```
multi-agent-code-review-demo/
├── .github/
│   └── agents/                 # AI agent definitions
│       ├── code-reviewer.agent.md
│       ├── security-scanner.agent.md
│       └── documentation-bot.agent.md
├── src/
│   ├── app.js                  # Express application
│   ├── routes/
│   │   └── users.js            # VULNERABLE: User management endpoints
│   ├── db/
│   │   └── database.js         # SQLite database setup
│   └── middleware/
│       └── auth.js             # Authentication middleware (for fixes)
├── demo-scripts/
│   ├── RECORDING_SCRIPT.md     # Complete demo storyboard
│   ├── SETUP_INSTRUCTIONS.md   # Setup guide
│   └── VERIFICATION_CHECKLIST.md   # Pre-demo checks
├── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- Git
- GitHub account

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/multi-agent-code-review-demo.git
cd multi-agent-code-review-demo

# Install dependencies
npm install

# Start the server
npm start
```

Server runs on `http://localhost:3000`

### Test the Vulnerabilities

**SQL Injection**:
```bash
curl "http://localhost:3000/api/users/search?username=' OR '1'='1"
```
Returns all users (bypasses intended query logic).

**Missing Authentication**:
```bash
curl "http://localhost:3000/api/users/admin/getAllUsers"
```
Succeeds without any authentication.

**Data Exposure**:
```bash
curl "http://localhost:3000/api/users/list"
```
Returns password hashes and API keys.

## API Endpoints

### GET /api/users/search
Search for users by username.

**Query Parameters:**
- `username` (string, required): Username to search

**Example**:
```bash
curl "http://localhost:3000/api/users/search?username=john_doe"
```

### POST /api/users/update
Update user email address.

**Body**:
```json
{
  "userId": 1,
  "email": "new@example.com"
}
```

**Example**:
```bash
curl -X POST "http://localhost:3000/api/users/update" \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "email": "new@example.com"}'
```

### GET /api/users/admin/getAllUsers
List all users (intended for admins only, but unprotected).

**Example**:
```bash
curl "http://localhost:3000/api/users/admin/getAllUsers"
```

### GET /api/users/list
List all users.

**Example**:
```bash
curl "http://localhost:3000/api/users/list"
```

## Recording the Demo

This repository includes comprehensive demo materials:

1. **RECORDING_SCRIPT.md**: Complete 5-act storyboard with timing (5-7 minutes)
2. **SETUP_INSTRUCTIONS.md**: Step-by-step setup guide
3. **VERIFICATION_CHECKLIST.md**: Pre-recording verification

See `demo-scripts/` directory for full details.

## Agent Definitions

### Code Reviewer Agent
- Reviews code quality and best practices
- Identifies anti-patterns and technical debt
- Provides specific fix suggestions with code examples
- Classifies issues by severity (CRITICAL, HIGH, MEDIUM, LOW)

### Security Scanner Agent
- Scans for OWASP Top 10 vulnerabilities
- Provides CVSS severity scores
- Includes exploitation examples
- Suggests secure code alternatives

### Documentation Bot Agent
- Identifies missing API documentation
- Generates JSDoc comments
- Creates OpenAPI/Swagger specifications
- Updates README with new endpoints

## How It Works

1. Developer creates PR with new API endpoints
2. Three agents automatically analyze the code:
   - Code Reviewer checks quality
   - Security Scanner finds vulnerabilities
   - Documentation Bot identifies missing docs
3. Each agent posts detailed findings
4. Developer applies fixes
5. Agents re-review and approve

## Demo Flow (5-7 minutes)

**Act 1** (30s): Show repository and open PR
**Act 2** (30s): Activate agents
**Act 3** (3-4min): Watch agents identify issues
**Act 4** (75s): Apply fixes
**Act 5** (30s): Show final approval

## Educational Value

This demo shows:
- ✅ Multi-agent collaboration and orchestration
- ✅ Real security vulnerabilities and how to fix them
- ✅ Best practices for API development
- ✅ Automated code review workflows
- ✅ Documentation generation

## Technologies

- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **AI Agents**: GitHub Agent HQ
- **Demo Tools**: GitHub Actions (optional), GitHub CLI

## Notes for Demo Presenters

### What Makes This Demo Effective
1. **Real vulnerabilities**: Not toy examples, but actual exploitable security issues
2. **Clear narrative**: Problem → Detection → Resolution
3. **Collaborative agents**: Shows true multi-agent orchestration
4. **Practical value**: Addresses real developer pain points

### Common Questions

**Q: Are these real vulnerabilities?**
A: Yes! The SQL injection can dump the entire database, and lack of auth means anyone can modify data.

**Q: How do the agents know what to look for?**
A: Each agent has a specialized definition file in `.github/agents/` that defines its expertise and behavior.

**Q: Can I use this in production?**
A: This is a demo of vulnerable code. See `src/middleware/auth.js` for proper authentication implementation.

## License

MIT

## Contributing

This is a demo repository. Contributions welcome for improving demo materials and agent definitions.

## Acknowledgments

Built to demonstrate the power of multi-agent workflows for automated code review and security scanning.
