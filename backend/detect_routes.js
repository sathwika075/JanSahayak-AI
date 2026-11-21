const fs = require('fs');
const path = require('path');

const server = fs.readFileSync(path.resolve(__dirname, 'server.js'), 'utf8');

const regex = /if\s*\((?:req\.url|pathname)\s*===?\s*['"]([^'"]+)['"]\s*&&\s*req\.method\s*===?\s*['"]([A-Z]+)['"]\)/g;
let m;
const routes = [];
while ((m = regex.exec(server)) !== null) {
  routes.push(`${m[2]} ${m[1]}`);
}

// Also check startsWith or pathname checks
const regex2 = /if\s*\(req\.method\s*===?\s*['"]([A-Z]+)['"]\s*&&\s*(?:req\.url|pathname)\.startsWith\(['"]([^'"]+)['"]\)/g;
while ((m = regex2.exec(server)) !== null) {
  routes.push(`${m[1]} ${m[2]}*`);
}

// Or pathname checks
const regex3 = /if\s*\(pathname\s*===?\s*['"]([^'"]+)['"]\)/g;
while ((m = regex3.exec(server)) !== null) {
  routes.push(`ANY ${m[1]}`);
}

console.log('--- DETECTED ROUTES IN HTTP DISPATCHER ---');
routes.forEach(r => console.log(' ', r));

