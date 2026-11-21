const fs = require('fs');
const path = require('path');

const server = fs.readFileSync(path.resolve(__dirname, 'server.js'), 'utf8');

const target = "pathname === '/api/ai/chat'";
const idx = server.indexOf(target);
console.log('Index of /api/ai/chat:', idx);
if (idx !== -1) {
  console.log(server.substring(idx - 50, idx + 1200));
}

