const fs = require('fs');
const content = fs.readFileSync('c:/Nxtwave-Sathwika/jansahayak-ai/frontend/index.html', 'utf8');
const p1 = content.indexOf('id="page-dashboard"');
const l1 = content.substring(0, p1).split('\n').length;
const p2 = content.indexOf('id="page-assistant"');
const l2 = content.substring(0, p2).split('\n').length;
console.log('page-dashboard starts around line:', l1);
console.log('page-assistant starts around line:', l2);

