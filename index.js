http = require('http');

const express = require('express');

const app = express();

// Main API routes.
app.use(require('./routes'));

http.createServer(app).listen(3000, () => {
  console.log('Express server listening on port 3000');
});

module.exports = app;
