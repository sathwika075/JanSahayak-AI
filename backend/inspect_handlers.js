const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../frontend/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

function showFunc(fnName) {
  const idx = html.indexOf('function ' + fnName);
  if (idx !== -1) {
    console.log(`\n=== FUNCTION ${fnName} ===`);
    console.log(html.substring(idx, idx + 800));
  } else {
    console.log(`Function ${fnName} NOT FOUND`);
  }
}

showFunc('saveStudentProfile');
showFunc('runEligibilityEvaluation');
showFunc('saveExtractedToProfile');
showFunc('handleChatSubmit');

