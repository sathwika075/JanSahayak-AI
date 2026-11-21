const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../frontend/index.html');
const content = fs.readFileSync(htmlPath, 'utf8');

// Find all buttons, inputs, links, onclick handlers
const buttonRegex = /<button[^>]*>([\s\S]*?)<\/button>/gi;
const onclickRegex = /onclick=["']([^"']+)["']/gi;

let match;
const buttons = [];
while ((match = buttonRegex.exec(content)) !== null) {
  const fullTag = match[0];
  const inner = match[1].replace(/<[^>]+>/g, '').trim();
  const clickMatch = /onclick=["']([^"']+)["']/i.exec(fullTag);
  const clickHandler = clickMatch ? clickMatch[1] : 'NONE';
  const idMatch = /id=["']([^"']+)["']/i.exec(fullTag);
  const id = idMatch ? idMatch[1] : 'NO_ID';
  const typeMatch = /type=["']([^"']+)["']/i.exec(fullTag);
  const type = typeMatch ? typeMatch[1] : 'button';
  buttons.push({ id, type, clickHandler, inner: inner.slice(0, 40) });
}

console.log(`TOTAL BUTTONS FOUND IN HTML: ${buttons.length}`);
const noHandler = buttons.filter(b => b.clickHandler === 'NONE' && b.type !== 'submit');
console.log(`BUTTONS WITHOUT ONCLICK OR HANDLER: ${noHandler.length}`);
noHandler.forEach((b, i) => {
  console.log(`  [${i+1}] ID: ${b.id} | Text: "${b.inner}"`);
});

// Check functions implemented in <script>
const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi;
let allJs = '';
while ((match = scriptRegex.exec(content)) !== null) {
  allJs += match[1] + '\n';
}

const calledFunctions = new Set();
buttons.forEach(b => {
  if (b.clickHandler !== 'NONE') {
    const fnName = b.clickHandler.split('(')[0].trim();
    if (fnName && !fnName.includes('=')) {
      calledFunctions.add(fnName);
    }
  }
});

console.log('\n--- CHECKING BUTTON HANDLER FUNCTIONS IN JS ---');
for (const fn of calledFunctions) {
  const exists = allJs.includes(`function ${fn}`) || allJs.includes(`${fn} =`) || allJs.includes(`${fn}=`);
  console.log(`  Function [${fn}]: ${exists ? 'EXISTS' : 'MISSING / UNDEFINED ❌'}`);
}

