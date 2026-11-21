const fs = require('fs');
const path = require('path');

const server = fs.readFileSync(path.resolve(__dirname, 'server.js'), 'utf8');

const regex = /if\s*\(pathname\s*===?\s*['"]([^'"]+)['"]\s*&&\s*method\s*===?\s*['"]([A-Z]+)['"]\)/g;
let m;
const routes = [];
while ((m = regex.exec(server)) !== null) {
  routes.push(`${m[2]} ${m[1]}`);
}

const regex2 = /if\s*\(pathname\.startsWith\(['"]([^'"]+)['"]\)\s*&&\s*method\s*===?\s*['"]([A-Z]+)['"]\)/g;
while ((m = regex2.exec(server)) !== null) {
  routes.push(`${m[2]} ${m[1]}*`);
}

console.log('--- ALL BACKEND ROUTES DEFINED IN SERVER.JS (' + routes.length + ') ---');
routes.forEach(r => console.log(' ', r));

