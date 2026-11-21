const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../frontend/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const profStart = html.indexOf('id="page-profile"');
console.log('Profile start index:', profStart);
if (profStart !== -1) {
  console.log(html.substring(profStart, profStart + 2500));
}

