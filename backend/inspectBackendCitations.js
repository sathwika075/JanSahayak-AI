const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');

// Check how the backend returns citations in serviceAgents.js
const sa = fs.readFileSync('backend/serviceAgents.js', 'utf8');
// Find citations shape returned by agents
const citIdx = sa.indexOf('citations');
console.log('=== serviceAgents.js citations area ===');
let pos = 0;
let count = 0;
while ((pos = sa.indexOf('citations', pos)) !== -1 && count < 5) {
  console.log(`\n--- pos ${pos} ---`);
  console.log(sa.substring(pos - 20, pos + 400));
  pos += 10;
  count++;
}

// Check aiOrchestrator.js
const ao = fs.readFileSync('backend/aiOrchestrator.js', 'utf8');
console.log('\n=== aiOrchestrator.js citations area ===');
pos = 0;
count = 0;
while ((pos = ao.indexOf('citations', pos)) !== -1 && count < 5) {
  console.log(`\n--- pos ${pos} ---`);
  console.log(ao.substring(pos - 20, pos + 400));
  pos += 10;
  count++;
}

