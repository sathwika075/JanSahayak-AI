// C:\Nxtwave-Sathwika\jansahayak-ai\frontend\serve.cjs
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FRONTEND_INDEX = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

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
  console.log(`JanSahayak AI Frontend running at http://localhost:${PORT}`);
});

