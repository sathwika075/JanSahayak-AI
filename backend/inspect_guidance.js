const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../frontend/index.html'), 'utf8');

const gStart = html.indexOf('id="page-guidance"');
const gEnd = html.indexOf('id="page-saved"');
console.log('Guidance length:', gEnd - gStart);
console.log(html.substring(gStart, gStart + 2000));

