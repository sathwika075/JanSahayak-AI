const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../frontend/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const profStart = html.indexOf('id="page-profile"');
const profEnd = html.indexOf('id="page-knowledge"');

if (profStart !== -1) {
  console.log('=== PROFILE PAGE HTML ===');
  console.log(html.substring(profStart, profEnd !== -1 ? profEnd : profStart + 2500));
}

