const express = require('express');
const sqlite3 = require('sqlite3');
const userRoutes = require('./routes/users');

const app = express();
app.use(express.json());

// VULNERABILITY: Missing security headers
// ISSUE: No helmet middleware
// ISSUE: No rate limiting

app.use('/api/users', userRoutes);

// ISSUE: Generic error handler exposes stack traces
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    stack: err.stack // VULNERABILITY: Exposing stack trace in production
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // VULNERABILITY: Exposing internal information in logs
  console.log(`Database connection string: ${process.env.DB_CONNECTION}`);
});

module.exports = app;
