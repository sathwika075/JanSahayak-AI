const fs = require('fs');
const path = require('path');

const server = fs.readFileSync(path.resolve(__dirname, 'server.js'), 'utf8');

const routes = [];
const lines = server.split('\n');
lines.forEach(line => {
  const m = line.match(/app\.(get|post|put|delete)\(['"]([^'"]+)['"]/);
  if (m) routes.push(m[1].toUpperCase() + ' ' + m[2]);
});
console.log('--- ALL BACKEND ROUTES (' + routes.length + ') ---');
routes.forEach(r => console.log(' ', r));

