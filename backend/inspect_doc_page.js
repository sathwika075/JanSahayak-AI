const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../frontend/index.html'), 'utf8');

const docStart = html.indexOf('id="page-docs"');
const docEnd = html.indexOf('id="page-guidance"');
console.log('Doc page length:', docEnd - docStart);
console.log(html.substring(docStart, docStart + 2500));

