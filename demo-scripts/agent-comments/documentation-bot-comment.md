## 📚 Documentation Analysis

I've reviewed the new API endpoints in this PR and found that **none of them have documentation**.

---

### Missing API Documentation

#### 1. `GET /api/users/search`
**Status**: ❌ No documentation

**Generated Documentation**:
```javascript
/**
 * Search for users by username
 *
 * @route GET /api/users/search
 * @param {string} username.query.required - Username to search for
 * @returns {Array<User>} 200 - Array of matching users
 * @returns {Object} 500 - Database error
 * @security Bearer
 *
 * @example
 * GET /api/users/search?username=john_doe
 *
 * Response:
 * [{
 *   "id": 1,
 *   "username": "john_doe",
 *   "email": "john@example.com",
 *   "role": "user"
 * }]
 */
```

---

#### 2. `POST /api/users/update`
**Status**: ❌ No documentation

**Generated Documentation**:
```javascript
/**
 * Update a user's email address
 *
 * @route POST /api/users/update
 * @param {number} userId.body.required - ID of the user to update
 * @param {string} email.body.required - New email address
 * @returns {Object} 200 - Success confirmation with change count
 * @returns {Object} 500 - Database error
 * @security Bearer
 *
 * @example
 * POST /api/users/update
 * Content-Type: application/json
 * { "userId": 1, "email": "newemail@example.com" }
 *
 * Response:
 * { "success": true, "changes": 1 }
 */
```

---

#### 3. `GET /api/users/admin/getAllUsers`
**Status**: ❌ No documentation

**Generated Documentation**:
```javascript
/**
 * Retrieve all users (admin only)
 *
 * @route GET /api/users/admin/getAllUsers
 * @returns {Array<User>} 200 - Array of all users
 * @returns {Object} 401 - Authentication required
 * @returns {Object} 403 - Admin access required
 * @security Bearer (Admin)
 */
```

> **Naming note**: This endpoint uses `getAllUsers` (camelCase verb phrase) which does not follow REST naming conventions. Consider renaming to `GET /api/admin/users`.

---

#### 4. `GET /api/users/list`
**Status**: ❌ No documentation

**Generated Documentation**:
```javascript
/**
 * List all users
 *
 * @route GET /api/users/list
 * @returns {Array<User>} 200 - Array of all users
 * @returns {Object} 500 - Database error
 */
```

---

### Missing README Updates

The `README.md` documents some endpoints but does not include:
- Request/response schemas
- Authentication requirements
- Error response formats
- Usage examples with expected outputs

### Recommendations

1. **Add JSDoc comments** to all exported route handlers
2. **Update README.md** with a complete API reference table
3. **Consider generating an OpenAPI/Swagger spec** for interactive documentation
4. **Add inline comments** explaining complex logic (especially database queries)

---

**I can auto-generate these docs if you reply with** `@documentation-bot generate`
