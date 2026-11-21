const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../frontend/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const dashStart = html.indexOf('id="page-dashboard"');
const dashEnd = html.indexOf('id="page-assistant"');

console.log(html.substring(dashStart, dashEnd));

