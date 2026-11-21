const fs = require('fs');
const html = fs.readFileSync('C:/Nxtwave-Sathwika/jansahayak-ai/backend/original_clean_index.html', 'utf8');

const regex = /id=["'](page-[a-z0-9-]+)["']/g;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log('Found:', match[1]);
}

