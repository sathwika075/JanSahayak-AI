const fs = require('fs');
const path = require('path');

const wf = fs.readFileSync(path.resolve(__dirname, 'langgraph_workflow.js'), 'utf8');

console.log('langgraph_workflow length:', wf.length);
const langMatches = wf.match(/language/gi) || [];
console.log('Occurrences of "language":', langMatches.length);

// Check orchestrate function signature and where language is passed
const orchIdx = wf.indexOf('async function orchestrate');
console.log('--- orchestrate function ---');
console.log(wf.substring(orchIdx, orchIdx + 600));

// Check response synthesis node
const synIdx = wf.indexOf('responseSynthesisNode');
console.log('--- responseSynthesisNode ---');
console.log(wf.substring(synIdx, synIdx + 800));

