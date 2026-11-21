const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../frontend/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// 1. Voice Recognition Function
const voiceIdx = html.indexOf('function startVoiceRecognition');
if (voiceIdx !== -1) {
  console.log('--- VOICE RECOGNITION CODE ---');
  console.log(html.substring(voiceIdx, voiceIdx + 1200));
}

// 2. Chat Form & Mic button in HTML
const chatFormIdx = html.indexOf('handleChatSubmit');
if (chatFormIdx !== -1) {
  console.log('--- CHAT FORM & CONTROLS ---');
  console.log(html.substring(chatFormIdx - 200, chatFormIdx + 800));
}

// 3. Language Selector
const langIdx = html.indexOf('setLanguage');
if (langIdx !== -1) {
  console.log('--- LANGUAGE CODE ---');
  console.log(html.substring(langIdx - 100, langIdx + 800));
}

