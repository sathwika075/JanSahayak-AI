const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const { runAgentOrchestration } = require('./ragWorkflow');

async function testRAG() {
  console.log('Testing National RAG Pipeline...');
  const res = await runAgentOrchestration('farmer schemes in India', {}, 'English');
  console.log('Success! Found schemes:', res.related_schemes.length);
  console.log('Answer excerpt:', res.answer.substring(0, 150));
}

testRAG().catch(e => console.error(e));

