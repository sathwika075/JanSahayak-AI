const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('c:/Nxtwave-Sathwika/jansahayak-ai/frontend/index.html', 'utf8');
const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
let match;
let blockIdx = 0;
let errors = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  const code = match[1];
  if (!code.trim()) continue;
  blockIdx++;
  try {
    new vm.Script(code);
    console.log(`[PASS] Script block ${blockIdx} compiled cleanly (${code.length} chars)`);
  } catch (err) {
    errors++;
    console.error(`[FAIL] Script block ${blockIdx} syntax error:`, err.message);
  }
}

if (errors === 0) {
  console.log('ALL FRONTEND SCRIPT BLOCKS HAVE ZERO SYNTAX ERRORS!');
} else {
  process.exit(1);
}

