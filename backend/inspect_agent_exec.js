const fs = require('fs');
const path = require('path');

const wf = fs.readFileSync(path.resolve(__dirname, 'langgraph_workflow.js'), 'utf8');

const agentExecIdx = wf.indexOf('async function agentExecutionNode');
console.log('--- agentExecutionNode ---');
console.log(wf.substring(agentExecIdx, agentExecIdx + 1200));

