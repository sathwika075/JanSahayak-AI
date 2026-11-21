const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../frontend/index.html'), 'utf8');

console.log('language-select:', html.includes('id="language-select"'));
console.log('lang-en:', html.includes('id="lang-en"'));
console.log('lang-te:', html.includes('id="lang-te"'));
console.log('lang-hi:', html.includes('id="lang-hi"'));
console.log('currentLanguage decl:', html.match(/let currentLanguage[^\n]+/));

