// C:\Nxtwave-Sathwika\jansahayak-ai\frontend\serve.js
// Production-Ready Unified Server for JanSahayak AI
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FRONTEND_INDEX = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Serve Single Page Application
  fs.readFile(FRONTEND_INDEX, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Error loading JanSahayak AI frontend UI');
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`JanSahayak AI Web Client running live at http://127.0.0.1:${PORT}`);
});

