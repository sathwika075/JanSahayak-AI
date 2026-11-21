const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../frontend/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

function checkPattern(name, pat) {
  const matches = html.match(pat);
  console.log(name + ':', matches ? matches.length + ' matches' : 'NONE');
}

checkPattern('startVoiceRecognition', /startVoiceRecognition/g);
checkPattern('SpeechRecognition', /SpeechRecognition/g);
checkPattern('speechSynthesis', /speechSynthesis/g);
checkPattern('Forms', /<form/gi);
checkPattern('Language selector', /setLanguage/g);
checkPattern('Dashboard section', /id=["']page-dashboard["']/g);
checkPattern('Profile stats', /95%/g);

