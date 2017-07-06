http = require('http');

const express = require('express');
const path = require('path');

const app = express();

app.use('/public', express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
});

// Main API routes.
app.use(require('./api/routes'));
app.use('/cb', require('./api/routescb'));
app.use('/gotcha', require('./api/gotcha'));

http.createServer(app).listen(3000, () => {
  console.log('Express server listening on port 3000');
});

module.exports = app;
