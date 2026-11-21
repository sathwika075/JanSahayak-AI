const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../frontend/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const dashStart = html.indexOf('id="page-dashboard"');
const dashEnd = html.indexOf('id="page-assistant"');

if (dashStart !== -1 && dashEnd !== -1) {
  console.log('--- DASHBOARD SECTION (Length: ' + (dashEnd - dashStart) + ') ---');
  console.log(html.substring(dashStart, dashStart + 3000));
}

