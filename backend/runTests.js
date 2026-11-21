// C:\Nxtwave-Sathwika\jansahayak-ai\backend\runTests.js
// Automated QA Test Suite for JanSahayak AI
const { SCHEMES } = require('./schemesData');
const { SOURCES } = require('./sourcesData');
const { evaluateEligibility } = require('./eligibilityEngine');
const { runAgentOrchestration, retrieveRelevantPassages } = require('./ragWorkflow');
const { processDocumentText } = require('./ocrProcessor');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
  }
}

async function runTestSuite() {
  console.log("==================================================");
  console.log("JANSAHAYAK AI - SYSTEM VERIFICATION & TEST RUNNER");
  console.log("==================================================");

  // Test 1: Schemes Catalog Integrity
  assert(SCHEMES.length >= 8, `Official schemes loaded (Found ${SCHEMES.length} schemes)`);
  const telanganaScheme = SCHEMES.find(s => s.id === 'ts-epass-rtf');
  assert(telanganaScheme && telanganaScheme.income_limit === 200000, "Telangana ePASS RTF scheme criteria valid");

  // Test 2: Source Adapters Configuration
  assert(SOURCES.length >= 5, `Government source adapters configured (Found ${SOURCES.length} adapters)`);
  const myscheme = SOURCES.find(s => s.id === 'src-myscheme');
  assert(myscheme && myscheme.connection_status.includes("Connected"), "myScheme adapter verified");

  // Test 3: Deterministic Eligibility Engine (Income pass)
  const eligibleStudent = {
    name: "Eligible Student",
    state: "Telangana",
    education_level: "Graduation",
    family_income: 150000,
    academic_marks: 85,
    category: "BC",
    gender: "Female"
  };
  const eval1 = evaluateEligibility(eligibleStudent, telanganaScheme);
  assert(eval1.unmetCriteria.length === 0, "Eligibility engine: Valid student passes criteria");

  // Test 4: Deterministic Eligibility Engine (Income breach)
  const highIncomeStudent = {
    name: "High Income Student",
    state: "Telangana",
    education_level: "Graduation",
    family_income: 450000,
    academic_marks: 85,
    category: "BC"
  };
  const eval2 = evaluateEligibility(highIncomeStudent, telanganaScheme);
  assert(eval2.unmetCriteria.some(u => u.criterion.includes("Income")), "Eligibility engine: High income correctly flagged");

  // Test 5: State Domicile Mismatch
  const otherStateStudent = {
    name: "Out of State",
    state: "Maharashtra",
    education_level: "Graduation",
    family_income: 120000,
    category: "SC"
  };
  const eval3 = evaluateEligibility(otherStateStudent, telanganaScheme);
  assert(eval3.unmetCriteria.some(u => u.criterion.includes("Domicile")), "Eligibility engine: State mismatch caught");

  // Test 6: RAG Retrieval Passages
  const ragDocs = retrieveRelevantPassages("Telangana MeeSeva RTF income certificate", 2);
  assert(ragDocs.length > 0 && ragDocs[0].source.includes("Telangana"), "RAG Retrieval returns grounded official passages");

  // Test 7: 8-Node LangGraph Orchestration with Telugu output
  const aiTeluguResult = await runAgentOrchestration("Am I eligible for Telangana scholarships?", eligibleStudent, "Telugu");
  assert(aiTeluguResult.answer.length > 50 && aiTeluguResult.intent === "ELIGIBILITY_CHECK", "LangGraph Agent: Multi-lingual Telugu answer generated");
  assert(aiTeluguResult.citations.length > 0, "AI Agent provides verified source citations");

  // Test 8: Document Intelligence OCR extraction
  const sampleCert = `
    GOVERNMENT OF TELANGANA REVENUE DEPARTMENT
    MeeSeva Online Citizen Portal - Tahsildar Office
    Certificate No: IC2026TS782910
    Name of Student: Sathwika Reddy
    Annual Income: Rs. 1,60,000/-
    Date of Issue: 18-08-2026
  `;
  const ocr = processDocumentText(sampleCert, "INCOME_CERTIFICATE");
  assert(ocr.extracted_fields.annual_income === 160000, "OCR Intelligence: Annual income accurately extracted");
  assert(ocr.extracted_fields.certificate_number === "IC2026TS782910", "OCR Intelligence: Certificate reference number extracted");
  assert(ocr.disclaimer.includes("official legal"), "OCR: Government compliance disclaimer verified");

  console.log("==================================================");
  console.log(`TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log("==================================================");
}

runTestSuite();

