const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.resolve(__dirname, '../frontend/index.html');
let content = fs.readFileSync(targetFile, 'utf8');

// Missing closing parenthesis in if statement
const badLine = `if (q && !s.name.toLowerCase().includes(q) && !s.ministry.toLowerCase().includes(q) && !s.benefits.toLowerCase().includes(q) return false;`;
const goodLine = `if (q && !s.name.toLowerCase().includes(q) && !s.ministry.toLowerCase().includes(q) && !s.benefits.toLowerCase().includes(q)) return false;`;

if (content.includes(badLine)) {
  content = content.replace(badLine, goodLine);
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Fixed missing parenthesis in filter query!');
} else {
  console.log('Target missing parenthesis line not found directly, searching substring...');
  const idx = content.indexOf('s.benefits.toLowerCase().includes(q) return false;');
  if (idx !== -1) {
    content = content.replace('s.benefits.toLowerCase().includes(q) return false;', 's.benefits.toLowerCase().includes(q)) return false;');
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('Replaced via substring search!');
  }
}

// Re-verify block 2 syntax
const scriptMatches = [...content.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
try {
  new vm.Script(scriptMatches[1][1], { filename: 'block_2.js' });
  console.log('Block 2 is now 100% SYNTACTICALLY VALID! ✅');
} catch (e) {
  console.error('Next error in Block 2 at line', e.stack.split('\n')[1]);
}

