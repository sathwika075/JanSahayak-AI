const { orchestrate } = require('./langgraph_workflow');

async function testMultilingual() {
  console.log('===============================================================');
  console.log('JANSAHAYAK AI - MULTILINGUAL TEST SUITE (ENGLISH, TELUGU, HINDI)');
  console.log('===============================================================');

  const profile = {
    name: 'Sathwika Reddy',
    state: 'Telangana',
    category: 'BC',
    family_income: 175000,
    education_level: 'Graduation'
  };

  let passed = 0;
  let total = 0;

  function assert(cond, desc) {
    total++;
    if (cond) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
    }
  }

  // 1. Telugu Greeting
  const r1 = await orchestrate('Hello', profile, 'Telugu', 'test-te-1');
  assert(r1.answer.includes('నమస్కారం') || r1.answer.includes('జనసహాయక్'), "Test 1: Telugu 'Hello' returns native Telugu script greeting");

  // 2. Telugu Roman Inquiry: "Naku PAN card apply cheyali"
  const r2 = await orchestrate('Naku PAN card apply cheyali', profile, 'Telugu', 'test-te-1');
  assert(r2.intent === 'PAN_CARD_SERVICE' && (r2.answer.includes('దరఖాస్తు') || r2.answer.includes('కార్డు')), "Test 2: Roman Telugu 'Naku PAN card apply cheyali' returns Telugu script instructions");

  // 3. Telugu Roman Inquiry: "Aadhaar card ela download cheyali?"
  const r3 = await orchestrate('Aadhaar card ela download cheyali?', profile, 'Telugu', 'test-te-1');
  assert(r3.intent === 'AADHAAR_SERVICE' && (r3.answer.includes('డౌన్‌లోడ్') || r3.answer.includes('ఆధార్')), "Test 3: Roman Telugu 'Aadhaar card ela download cheyali?' returns Telugu script e-Aadhaar guide");

  // 4. Hindi Inquiry: "Mujhe passport apply karna hai"
  const r4 = await orchestrate('Mujhe passport apply karna hai', profile, 'Hindi', 'test-hi-1');
  assert(r4.intent === 'PASSPORT_SERVICE' && (r4.answer.includes('पासपोर्ट') || r4.answer.includes('आवेदन')), "Test 4: Hindi 'Mujhe passport apply karna hai' returns Hindi Devanagari script instructions");

  // 5. Hindi Inquiry: "ATM card kho gaya, block karna hai"
  const r5 = await orchestrate('ATM card kho gaya, block karna hai', profile, 'Hindi', 'test-hi-1');
  assert(r5.intent === 'BANKING_SERVICE' && (r5.answer.includes('ब्लॉक') || r5.answer.includes('कार्ड')), "Test 5: Hindi ATM emergency returns Hindi guidance & helplines");

  // 6. English Inquiry: "How to apply for income certificate?"
  const r6 = await orchestrate('How to apply for income certificate?', profile, 'English', 'test-en-1');
  assert(r6.intent === 'CERTIFICATE_SERVICE' && r6.answer.includes('MeeSeva') && r6.answer.includes('₹45'), "Test 6: English income certificate inquiry returns official English MeeSeva guidance");

  // 7. Multi-Turn Language Consistency
  const r7 = await orchestrate('New one', profile, 'Telugu', 'test-te-1');
  assert(r7.answer && (r7.answer.includes('దరఖాస్తు') || r7.answer.includes('PAN') || r7.answer.includes('కార్డు')), "Test 7: Follow-up preserves active Telugu topic");

  console.log('===============================================================');
  console.log(`TEST SUMMARY: ${passed}/${total} MULTILINGUAL TESTS PASSED`);
  console.log('===============================================================');

  if (passed !== total) process.exit(1);
}

testMultilingual().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

