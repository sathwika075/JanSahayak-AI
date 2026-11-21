const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../frontend/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Find all forms
const formMatches = [...html.matchAll(/<form[\s\S]*?<\/form>/gi)];
console.log('Total forms found:', formMatches.length);
formMatches.forEach((f, idx) => {
  console.log(`\n--- FORM ${idx + 1} ---`);
  const onsubmit = (f[0].match(/onsubmit=["']([^"']+)["']/i) || [])[1] || 'NONE';
  const id = (f[0].match(/id=["']([^"']+)["']/i) || [])[1] || 'NO_ID';
  console.log(`ID: ${id} | onsubmit: ${onsubmit}`);
  console.log(f[0].slice(0, 300) + '...');
});

// Also search for buttons with "Save", "Submit", "Create", "Calculate"
const actionBtns = [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)].filter(b => {
  const text = b[1].replace(/<[^>]+>/g, '').trim();
  return /submit|save|check|eval|login|create|publish/i.test(text);
});
console.log('\n--- ACTION BUTTONS FOUND ---', actionBtns.length);
actionBtns.forEach((b, idx) => {
  const text = b[1].replace(/<[^>]+>/g, '').trim();
  const onclick = (b[0].match(/onclick=["']([^"']+)["']/i) || [])[1] || 'NONE';
  console.log(`[${idx + 1}] Text: "${text}" | onclick: ${onclick}`);
});

