// backend/testAllChatbotQueries.js
const { processChatRequest } = require('./aiOrchestrator');
const conversationStore = require('./conversationStore');
const { CITIZEN_SERVICES, SERVICE_CATEGORIES } = require('./servicesData');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message, details = "") {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    if (details) console.error(`       Detail: ${details}`);
  }
}

async function runVerification() {
  console.log("===============================================================");
  console.log("JANSAHAYAK AI - MAJOR FUNCTIONALITY & INTENT VERIFICATION SUITE");
  console.log("===============================================================\n");

  const testUser = "test-session-" + Date.now();
  conversationStore.clearHistory(testUser);

  // 1. Hi
  const r1 = await processChatRequest({ message: "Hi", userId: testUser });
  assert(r1.intent === "GREETING" && r1.answer.includes("JanSahayak AI"), "Query 1: 'Hi' responds naturally with greeting");

  // 2. Hello
  const r2 = await processChatRequest({ message: "Hello", userId: testUser });
  assert(r2.intent === "GREETING", "Query 2: 'Hello' classified as GREETING");

  // 3. Who are you?
  const r3 = await processChatRequest({ message: "Who are you?", userId: testUser });
  assert(r3.intent === "PLATFORM_INFORMATION" && r3.answer.includes("JanSahayak AI"), "Query 3: 'Who are you?' explains JanSahayak platform");

  // 4. What can you do?
  const r4 = await processChatRequest({ message: "What can you do?", userId: testUser });
  assert(r4.intent === "PLATFORM_INFORMATION" && r4.answer.includes("Scholarship") && r4.answer.includes("Identity"), "Query 4: 'What can you do?' lists citizen & scholarship capabilities");

  // 5. Which scholarships can I apply for?
  const r5 = await processChatRequest({ message: "Which scholarships can I apply for?", userId: testUser });
  assert(r5.intent.includes("SCHOLARSHIP") && r5.answer.includes("Telangana"), "Query 5: 'Which scholarships can I apply for?' routes to scholarship engine");

  // 6. What documents are needed for a scholarship?
  const r6 = await processChatRequest({ message: "What documents are needed for a scholarship?", userId: testUser });
  assert(r6.intent.includes("DOCUMENT") && (r6.answer.includes("Income") || r6.answer.includes("MeeSeva")), "Query 6: 'What documents are needed for a scholarship?' lists scholarship documents");

  // 7. How do I apply for a PAN card?
  const r7 = await processChatRequest({ message: "How do I apply for a PAN card?", userId: testUser });
  assert(r7.intent === "PAN_CARD_SERVICE" && r7.answer.includes("PAN") && r7.answer.includes("incometax.gov.in"), "Query 7: 'How do I apply for a PAN card?' routes to PAN agent with official links");

  // 8. How do I download Aadhaar?
  const r8 = await processChatRequest({ message: "How do I download Aadhaar?", userId: testUser });
  assert(r8.intent === "AADHAAR_SERVICE" && r8.answer.includes("e-Aadhaar") && r8.answer.includes("myaadhaar.uidai.gov.in"), "Query 8: 'How do I download Aadhaar?' routes to Aadhaar agent with download steps");

  // 9. How do I apply for a passport?
  const r9 = await processChatRequest({ message: "How do I apply for a passport?", userId: testUser });
  assert(r9.intent === "PASSPORT_SERVICE" && r9.answer.includes("Passport") && r9.answer.includes("passportindia.gov.in"), "Query 9: 'How do I apply for a passport?' routes to Passport agent with official portal");

  // 10. What documents are needed for a fresh passport?
  const r10 = await processChatRequest({ message: "What documents are needed for a fresh passport?", userId: testUser });
  assert(r10.intent === "PASSPORT_SERVICE" && r10.answer.includes("Non-ECR") && r10.answer.includes("Address"), "Query 10: 'What documents are needed for a fresh passport?' lists passport documents");

  // 11. How can I get a bank passbook?
  const r11 = await processChatRequest({ message: "How can I get a bank passbook?", userId: testUser });
  assert(r11.intent === "BANKING_SERVICE" && r11.answer.includes("passbook"), "Query 11: 'How can I get a bank passbook?' routes to Banking agent passbook guidance");

  // 12. How do I request an ATM card?
  const r12 = await processChatRequest({ message: "How do I request an ATM card?", userId: testUser });
  assert(r12.intent === "BANKING_SERVICE" && r12.answer.includes("ATM") && r12.answer.includes("PIN"), "Query 12: 'How do I request an ATM card?' routes to Banking agent with PIN instructions");

  // 13. How do I block my lost ATM card?
  const r13 = await processChatRequest({ message: "How do I block my lost ATM card?", userId: testUser });
  assert(r13.intent === "BANKING_SERVICE" && r13.answer.includes("EMERGENCY") && r13.answer.includes("BLOCK"), "Query 13: 'How do I block my lost ATM card?' provides emergency helplines & SMS commands");

  // 14. How do I apply for an income certificate?
  const r14 = await processChatRequest({ message: "How do I apply for an income certificate?", userId: testUser });
  assert(r14.intent === "CERTIFICATE_SERVICE" && r14.answer.includes("MeeSeva") && r14.answer.includes("₹45"), "Query 14: 'How do I apply for an income certificate?' routes to Certificate agent with ₹45 fee & MeeSeva");

  // 15. Thank you.
  const r15 = await processChatRequest({ message: "Thank you.", userId: testUser });
  assert(r15.intent === "GENERAL_CONVERSATION" && r15.answer.includes("welcome"), "Query 15: 'Thank you.' acknowledges politely without pushing scholarships");

  // ===============================================================
  // MULTI-TURN CONTEXT VERIFICATION (Queries 16, 17, 18)
  // ===============================================================
  console.log("\n--- Multi-Turn Conversation Context Test ---");
  const multiTurnUser = "multi-turn-user-" + Date.now();
  conversationStore.clearHistory(multiTurnUser);

  // Turn 16: I want to apply for a passport.
  const r16 = await processChatRequest({ message: "I want to apply for a passport.", userId: multiTurnUser });
  assert(r16.intent === "PASSPORT_SERVICE", "Turn 16: Establishes active topic as Passport");

  // Turn 17: It is my first passport.
  const r17 = await processChatRequest({ message: "It is my first passport.", userId: multiTurnUser });
  assert(r17.intent === "PASSPORT_SERVICE", "Turn 17: Preserves context as fresh passport");

  // Turn 18: What documents do I need? (Crucial: MUST NOT default to scholarships!)
  const r18 = await processChatRequest({ message: "What documents do I need?", userId: multiTurnUser });
  assert(r18.intent === "PASSPORT_SERVICE" && r18.answer.includes("Non-ECR") && !r18.answer.includes("MeeSeva Income Certificate"),
    "Turn 18: Context-aware follow-up correctly returns Passport documents, NOT scholarship documents!");

  // ===============================================================
  // CITIZEN SERVICES CATALOG INTEGRITY
  // ===============================================================
  console.log("\n--- Citizen Services Catalog Verification ---");
  assert(CITIZEN_SERVICES.length === 15, `Catalog contains all 15 services (Found ${CITIZEN_SERVICES.length})`);
  assert(SERVICE_CATEGORIES.length === 5, `All 5 service categories present (Found ${SERVICE_CATEGORIES.length})`);

  const panService = CITIZEN_SERVICES.find(s => s.id === "pan-card");
  assert(panService && panService.fees.physical_card_india.includes("₹107"), "PAN Card verified fee schedule present (₹107)");

  const passportService = CITIZEN_SERVICES.find(s => s.id === "passport-service");
  assert(passportService && passportService.officialUrl.includes("passportindia.gov.in"), "Passport official MEA portal link verified");

  const passbookService = CITIZEN_SERVICES.find(s => s.id === "bank-passbook");
  assert(passbookService && passbookService.badge.includes("Bank-Specific"), "Bank passbook clearly badged as Bank-Specific Citizen Service");

  console.log("\n===============================================================");
  console.log(`TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log("===============================================================");
}

runVerification().catch(err => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
