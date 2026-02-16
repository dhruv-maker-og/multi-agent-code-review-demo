# Pre-Demo Verification Checklist

## Repository Setup
- [ ] Repository created and initialized
- [ ] All files committed to `master` branch
- [ ] Feature branch `feature/user-search-endpoint` created
- [ ] Vulnerable code committed to feature branch
- [ ] GitHub repository created and pushed

## Agent Configuration
- [ ] `.github/agents/code-reviewer.agent.md` created
- [ ] `.github/agents/security-scanner.agent.md` created
- [ ] `.github/agents/documentation-bot.agent.md` created
- [ ] All agent definitions follow correct format
- [ ] Agent expertise sections are comprehensive

## Application Code
- [ ] `src/app.js` with basic Express setup
- [ ] `src/routes/users.js` with vulnerable endpoints
- [ ] SQL injection vulnerability in `/search` endpoint
- [ ] Missing authentication on all endpoints
- [ ] Sensitive data exposure in responses
- [ ] `src/db/database.js` with sample data
- [ ] `src/middleware/auth.js` with authentication logic
- [ ] `package.json` with required dependencies

## Vulnerabilities Verification
Test each vulnerability manually:

### SQL Injection
- [ ] Test (Windows PowerShell): `curl.exe "http://localhost:3000/api/users/search?username=%27%20OR%20%271%27=%271"`
- [ ] Test (Linux/Mac): `curl "http://localhost:3000/api/users/search?username=' OR '1'='1"`
- [ ] Should return all users (vulnerability confirmed)
- [ ] Take screenshot for demo backup

### Missing Authentication
- [ ] Test: `curl.exe "http://localhost:3000/api/users/admin/getAllUsers"`
- [ ] Should succeed without auth header (vulnerability confirmed)
- [ ] Take screenshot for demo backup

### Data Exposure
- [ ] Test: `curl.exe "http://localhost:3000/api/users/list"`
- [ ] Response includes `password_hash` field (vulnerability confirmed)
- [ ] Take screenshot for demo backup

### Authorization Issues
- [ ] Test (Windows PowerShell): Store JSON in variable then POST: `$body = '{"userId": 2, "email": "hacked@example.com"}'; curl.exe -X POST "http://localhost:3000/api/users/update" -H "Content-Type: application/json" -d $body`
- [ ] Test (Linux/Mac): `curl -X POST "http://localhost:3000/api/users/update" -H "Content-Type: application/json" -d '{"userId": 2, "email": "hacked@example.com"}'`
- [ ] Should succeed without authentication (vulnerability confirmed)

## Pull Request
- [ ] PR created from `feature/user-search-endpoint` to `master`
- [ ] PR title: "feat: Add user search and management endpoints"
- [ ] PR description includes changes list
- [ ] PR is in "Draft" state initially
- [ ] PR is visible on GitHub

## Demo Scripts
- [ ] `demo-scripts/RECORDING_SCRIPT.md` created
- [ ] `demo-scripts/SETUP_INSTRUCTIONS.md` created
- [ ] `demo-scripts/VERIFICATION_CHECKLIST.md` created (this file)
- [ ] Agent response comments prepared (optional for manual trigger)

## Agent Responses (If Using Manual Trigger)
Prepare agent responses in advance:

- [ ] Code Reviewer comment drafted
  - [ ] Includes line-specific issues
  - [ ] Has severity classifications
  - [ ] Provides code examples for fixes
  - [ ] Overall assessment included
  - [ ] Saved in `demo-scripts/agent-comments/code-reviewer-comment.md`

- [ ] Security Scanner comment drafted
  - [ ] Lists all vulnerabilities with CVSS scores
  - [ ] Includes exploitation examples
  - [ ] Provides secure code alternatives
  - [ ] Has clear recommendation (BLOCK MERGE)
  - [ ] Saved in `demo-scripts/agent-comments/security-scanner-comment.md`

- [ ] Documentation Bot comment drafted
  - [ ] Identifies all undocumented endpoints
  - [ ] Generates sample JSDoc comments
  - [ ] Suggests README updates
  - [ ] Offers auto-generation option
  - [ ] Saved in `demo-scripts/agent-comments/documentation-bot-comment.md`

## Fixed Code Preparation
- [ ] Fixed version of `src/routes/users.js` prepared
- [ ] Uses parameterized queries (SQL injection fix)
- [ ] Adds authentication middleware to all routes
- [ ] Adds authorization checks for sensitive operations
- [ ] Sanitizes sensitive data from responses
- [ ] Includes JSDoc documentation comments
- [ ] Ready to apply during demo (Act 4)

## Demo Environment
- [ ] VS Code configured with correct settings
  - [ ] Font size: 16px
  - [ ] Dark theme enabled
  - [ ] Minimap disabled
- [ ] Browser configured
  - [ ] Zoom level: 125%
  - [ ] Dark theme enabled
  - [ ] Only necessary tabs open
- [ ] GitHub logged in
- [ ] Repository bookmarked
- [ ] PR tab ready
- [ ] Actions tab ready (if using workflow)

## Recording Setup
- [ ] Screen recorder tested and working
  - [ ] Resolution: 1080p minimum
  - [ ] Frame rate: 60 FPS
  - [ ] Output format configured
- [ ] Microphone audio clear
  - [ ] Test recording reviewed
  - [ ] Volume levels appropriate
  - [ ] No background noise
- [ ] Background music prepared (optional)
- [ ] Window size optimized for recording
  - [ ] Browser fills screen appropriately
  - [ ] VS Code window sized correctly
- [ ] Desktop cleaned
  - [ ] No sensitive info visible
  - [ ] Desktop icons hidden
  - [ ] Taskbar cleaned up
- [ ] Notifications disabled
  - [ ] Windows notifications off
  - [ ] Slack/Teams closed
  - [ ] Email client closed
  - [ ] Phone on silent

## Timing Verification
- [ ] Run through demo once (dry run)
- [ ] Time each act individually
  - [ ] Act 1: ~30 seconds
  - [ ] Act 2: ~30 seconds
  - [ ] Act 3: 3-4 minutes
  - [ ] Act 4: 60-90 seconds
  - [ ] Act 5: ~30 seconds
- [ ] Ensure total time is 5-7 minutes
- [ ] Identify sections that can be sped up if needed
- [ ] Practice transitions between acts
- [ ] Rehearse narration (smooth, no filler words)

## Backup Plan
- [ ] Screenshots of each agent comment saved
- [ ] Screen recording of successful dry run saved
- [ ] Alternative manual trigger method tested
- [ ] Offline demo script prepared (if live demo fails)
- [ ] Pre-recorded clips ready as backup
  - [ ] Agent comment reveals
  - [ ] Code fix application
  - [ ] Final approval summary

## Day-of-Demo Checklist (Final)

**30 minutes before**:
- [ ] Restart computer
- [ ] Close all non-essential applications
- [ ] Disable notifications
- [ ] Open browser to GitHub
- [ ] Open VS Code to repository
- [ ] Start recording software (but don't record yet)
- [ ] Test microphone one more time
- [ ] Review RECORDING_SCRIPT.md

**5 minutes before**:
- [ ] Set browser zoom to 125%
- [ ] Position windows correctly
- [ ] Start timer app
- [ ] Take a deep breath
- [ ] Review Act 1 narration

**During Recording**:
- [ ] Follow RECORDING_SCRIPT.md exactly
- [ ] Check timer between acts
- [ ] Speak clearly and at moderate pace
- [ ] Keep mouse movements smooth
- [ ] Pause briefly between major transitions

**After Recording**:
- [ ] Save recording immediately
- [ ] Review recording for errors
- [ ] Check audio quality
- [ ] Check video quality
- [ ] Verify all content visible
- [ ] Re-record if necessary

## Post-Recording Tasks
- [ ] Video edited and trimmed
  - [ ] Remove dead air
  - [ ] Add transitions
  - [ ] Sync audio if needed
- [ ] Captions/subtitles added
- [ ] Visual annotations added
  - [ ] Highlight key code lines
  - [ ] Add agent icons/avatars
  - [ ] Emphasize vulnerabilities found
- [ ] Intro/outro slides added
  - [ ] Title card with demo name
  - [ ] Closing card with summary stats
- [ ] Music and sound effects balanced
- [ ] Final video reviewed for errors
- [ ] Export in multiple formats (MP4, WebM)
- [ ] Test playback on different devices

## Success Criteria

After setup, you should be able to answer YES to all:

- [ ] Can I start the server successfully with `npm start`?
- [ ] Can I trigger the SQL injection vulnerability?
- [ ] Can I access admin endpoints without authentication?
- [ ] Is the PR visible on GitHub?
- [ ] Are all three agent definition files present?
- [ ] Is the fixed code prepared and ready to apply?
- [ ] Is recording software configured and tested?
- [ ] Have I done a complete dry run under 7 minutes?
- [ ] Do I have backup recordings/screenshots?
- [ ] Am I confident in the demo flow?

If all answers are YES, you're ready to record! 🎬
