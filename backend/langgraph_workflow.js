// C:\Nxtwave-Sathwika\jansahayak-ai\backend\langgraph_workflow.js
// JanSahayak AI - LangGraph StateGraph Architecture
// Multi-Agent Orchestrator with Contextual Memory, Intent Classification,
// Domain Specialists, RAG Grounding & Deterministic Verification

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const conversationStore = require('./conversationStore');
const {
  GeneralConversationAgent,
  PanCardAgent,
  AadhaarAgent,
  PassportAgent,
  BankingAgent,
  CertificateAgent,
  OtherGovtAgent
} = require('./serviceAgents');
const { runAgentOrchestration } = require('./ragWorkflow');
const { evaluateEligibility } = require('./eligibilityEngine');

// Government API Adapters
const epass = require('./apis/epass');
const nsp = require('./apis/nsp');
const opendata = require('./apis/opendata');

// Initialize Gemini Client
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_KEY') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.warn('[LangGraph] Gemini initialization notice:', err.message);
  }
}

/**
 * Node 1: Conversation Manager
 * Reads past context, session state, and user profile.
 */
async function conversationManagerNode(state) {
  const { userId, message } = state;
  const history = conversationStore.getHistory(userId);
  const context = conversationStore.getContext(userId);

  return {
    ...state,
    history,
    context: context || {}
  };
}

/**
 * Intelligent Semantic NLU Classifier (Typo-Tolerant & Multi-Lingual)
 */
function classifySemanticFallback(message, context = {}) {
  const lower = message.trim().toLowerCase();
  
  // Clean punctuation
  const clean = lower.replace(/[?!.,]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. GREETINGS (with common typos & multilingual)
  const greetingWords = ['hi', 'hello', 'hey', 'helo', 'hellow', 'hiii', 'namaste', 'namaskaram', 'vanakkam', 'good morning', 'good afternoon', 'good evening', 'whatsup', "what's up", 'hola'];
  if (greetingWords.some(w => clean === w || clean.startsWith(w + ' '))) {
    return { intent: 'GREETING', confidence: 0.98, serviceId: null };
  }

  // 2. PLATFORM INFORMATION
  if (
    clean.includes('who are you') ||
    clean.includes('what are you') ||
    clean.includes('what can you do') ||
    clean.includes('tell me about yourself') ||
    clean.includes('about jansahayak') ||
    clean.includes('what is jansahayak') ||
    clean.includes('explain features') ||
    clean === 'help'
  ) {
    return { intent: 'PLATFORM_INFORMATION', confidence: 0.97, serviceId: null };
  }

  // 3. GENERAL CONVERSATION & POLITE
  const politeWords = ['thank you', 'thanks', 'thx', 'thank u', 'bye', 'goodbye', 'cool', 'awesome', 'great', 'ok', 'okay'];
  if (politeWords.some(w => clean === w || clean.startsWith(w + ' '))) {
    return { intent: 'GENERAL_CONVERSATION', confidence: 0.95, serviceId: null };
  }

  // 4. MULTI-TURN CONTEXT RESOLUTION
  const isGenericFollowUp = 
    clean.includes('what document') ||
    clean.includes('what documents') ||
    clean.includes('which documents') ||
    clean.includes('documents needed') ||
    clean.includes('documents required') ||
    clean.includes('first time') ||
    clean.includes('it is my first') ||
    clean.includes('fresh') ||
    clean.includes('how much fee') ||
    clean.includes('fee details') ||
    clean.includes('how to apply') ||
    clean.includes('where to apply') ||
    clean.includes('status check');

  if (isGenericFollowUp && context.activeService) {
    if (context.activeService === 'passport-service') {
      return {
        intent: 'PASSPORT_SERVICE',
        confidence: 0.96,
        serviceId: 'passport-service',
        subTopic: (clean.includes('first') || clean.includes('fresh')) ? 'fresh_passport' : context.subTopic
      };
    }
    if (context.activeService === 'pan-card') {
      return { intent: 'PAN_CARD_SERVICE', confidence: 0.96, serviceId: 'pan-card' };
    }
    if (context.activeService === 'aadhaar-card') {
      return { intent: 'AADHAAR_SERVICE', confidence: 0.96, serviceId: 'aadhaar-card' };
    }
    if (context.activeService.startsWith('bank-') || context.activeService === 'atm-debit-card') {
      return { intent: 'BANKING_SERVICE', confidence: 0.96, serviceId: context.activeService };
    }
    if (context.activeService.includes('certificate')) {
      return { intent: 'CERTIFICATE_SERVICE', confidence: 0.96, serviceId: context.activeService };
    }
  }

  // ---- ROMAN TELUGU INTENT DETECTION (before English patterns) ----
  // Telugu words: kavali=want, ela=how, cheyali=must do, cheydam=doing, poyindi=lost, kosam=for
  // kavali/kaavali, chudali=see, telusukovali=know, ivvandi=give, kattali=pay, raadu=not coming

  // PAN — Roman Telugu & Hindi
  if (
    /pan\s*(card|karud)?\s*(kavali|kaavali|cheyali|cheydam|ela|apply|kosam)/i.test(clean) ||
    /naku\s.*pan/i.test(clean) ||
    /pan\s*(card)?\s*(chahiye|banwana|banvana|kaise|banana)/i.test(clean) ||
    /mujhe\s.*pan/i.test(clean)
  ) {
    return { intent: 'PAN_CARD_SERVICE', confidence: 0.96, serviceId: 'pan-card' };
  }

  // AADHAAR — Roman Telugu & Hindi
  if (
    /aadh?aa?r\s*(card)?\s*(kavali|kaavali|download\s*cheyali|ela|cheyali|update|kosam)/i.test(clean) ||
    /naku\s.*aadh?aa?r/i.test(clean) ||
    /aadh?aa?r\s*(card)?\s*(chahiye|download\s*karna|kaise|banwana|update\s*karna)/i.test(clean) ||
    /mujhe\s.*aadh?aa?r/i.test(clean)
  ) {
    return { intent: 'AADHAAR_SERVICE', confidence: 0.96, serviceId: 'aadhaar-card' };
  }

  // PASSPORT — Roman Telugu & Hindi
  if (
    /passport\s*(kavali|kaavali|ela|cheyali|apply\s*cheyali|kosam)/i.test(clean) ||
    /naku\s.*passport/i.test(clean) ||
    /passport\s*(chahiye|banwana|kaise|banana|apply\s*karna)/i.test(clean) ||
    /mujhe\s.*passport/i.test(clean)
  ) {
    const isFresh = clean.includes('first') || clean.includes('fresh') || clean.includes('kotta') || clean.includes('naya');
    return { intent: 'PASSPORT_SERVICE', confidence: 0.96, serviceId: 'passport-service', subTopic: isFresh ? 'fresh_passport' : null };
  }

  // BANKING — Roman Telugu & Hindi
  if (
    /atm\s*(card)?\s*(kavali|poyindi|block\s*cheyali|ela|kosam)/i.test(clean) ||
    /atm\s*(card)?\s*(kho\s*gaya|block\s*karna|chahiye|kaise)/i.test(clean) ||
    /passbook\s*(kavali|kaavali|update|ela|chahiye|kaise)/i.test(clean) ||
    /bank\s*account\s*(kavali|open\s*cheyali|kholna|kaise)/i.test(clean) ||
    /naku\s.*(atm|passbook|bank\s*account)/i.test(clean) ||
    /mujhe\s.*(atm|passbook|bank\s*account)/i.test(clean)
  ) {
    let sId = 'bank-account';
    if (/atm|debit\s*card/i.test(clean)) sId = 'atm-debit-card';
    else if (/passbook/i.test(clean)) sId = 'bank-passbook';
    return { intent: 'BANKING_SERVICE', confidence: 0.96, serviceId: sId };
  }

  // CERTIFICATES — Roman Telugu & Hindi
  if (
    /income\s*(certificate)?\s*(kavali|ela|cheyali|kosam|chahiye|kaise|banwana)/i.test(clean) ||
    /(aadayam|aadaayam)\s*(certificate|dakhla|dharuveekarana)/i.test(clean) ||
    /caste\s*(certificate)?\s*(kavali|ela|cheyali|kosam|chahiye|kaise|banwana)/i.test(clean) ||
    /(kulam|jaathi)\s*(certificate|dakhla|dharuveekarana)/i.test(clean) ||
    /meeseva\s*(kavali|ela|cheyali|kaise)/i.test(clean) ||
    /naku\s.*(income|caste|birth|domicile|residence)\s*(certificate)?/i.test(clean) ||
    /mujhe\s.*(income|caste|birth|domicile|residence|aay|jaati)\s*(certificate|praman\s*patra)?/i.test(clean)
  ) {
    let sId = 'income-certificate';
    if (/caste|community|kulam|jaathi|jaati/i.test(clean)) sId = 'caste-certificate';
    else if (/domicile|residence|nivaas/i.test(clean)) sId = 'domicile-certificate';
    else if (/birth|janm/i.test(clean)) sId = 'birth-certificate';
    else if (/ration/i.test(clean)) sId = 'ration-card';
    return { intent: 'CERTIFICATE_SERVICE', confidence: 0.96, serviceId: sId };
  }

  // SCHOLARSHIPS — Roman Telugu & Hindi
  if (
    /scholarship\s*(kavali|ela|cheyali|eppudu|kosam|chahiye|kaise|milegi)/i.test(clean) ||
    /epass\s*(ela|kavali|apply|cheyali|status|kaise|chahiye)/i.test(clean) ||
    /naku\s.*scholarship/i.test(clean) ||
    /mujhe\s.*(scholarship|chhaatravritti)/i.test(clean) ||
    /(vidyarthi|chhaatravritti|chatravruti)/i.test(clean)
  ) {
    if (/eligible|arhat|yogyata|arah/i.test(clean)) {
      return { intent: 'SCHOLARSHIP_ELIGIBILITY', confidence: 0.94, serviceId: 'scholarships' };
    }
    return { intent: 'SCHOLARSHIP_SEARCH', confidence: 0.94, serviceId: 'scholarships' };
  }

  // VOTER ID / DRIVING LICENCE — Roman Telugu & Hindi
  if (
    /voter\s*(id)?\s*(kavali|ela|cheyali|chahiye|kaise|banwana)/i.test(clean) ||
    /driving\s*(licence|license)\s*(kavali|ela|cheyali|chahiye|kaise)/i.test(clean) ||
    /naku\s.*(voter|driving|license|licence)/i.test(clean) ||
    /mujhe\s.*(voter|driving|license|licence)/i.test(clean)
  ) {
    return { intent: 'OTHER_GOVERNMENT_SERVICE', confidence: 0.96, serviceId: /voter/i.test(clean) ? 'voter-id' : 'driving-licence' };
  }

  // ---- STANDARD ENGLISH INTENT DETECTION ----

  // 5. PAN CARD
  if (clean.includes('pan card') || clean.includes('pan ') || clean.includes('e-pan') || clean.includes('form 49a') || clean.includes('utiitsl') || clean.includes('nsdl pan')) {
    return { intent: 'PAN_CARD_SERVICE', confidence: 0.95, serviceId: 'pan-card' };
  }

  // 6. AADHAAR
  if (clean.includes('aadhaar') || clean.includes('aadhar') || clean.includes('uidai') || clean.includes('pvc card') || clean.includes('e-aadhaar') || clean.includes('myaadhaar')) {
    return { intent: 'AADHAAR_SERVICE', confidence: 0.95, serviceId: 'aadhaar-card' };
  }

  // 7. PASSPORT
  if (clean.includes('passport') || clean.includes('tatkaal') || clean.includes('psk') || clean.includes('popsk') || clean.includes('passport seva')) {
    const isFresh = clean.includes('first') || clean.includes('fresh');
    return {
      intent: 'PASSPORT_SERVICE',
      confidence: 0.95,
      serviceId: 'passport-service',
      subTopic: isFresh ? 'fresh_passport' : null
    };
  }

  // 8. BANKING SERVICES (ATM, Passbook, Account, Cheque, Zero Balance)
  if (
    clean.includes('atm') ||
    clean.includes('debit card') ||
    clean.includes('passbook') ||
    clean.includes('bank account') ||
    clean.includes('cheque') ||
    clean.includes('zero balance') ||
    clean.includes('block card') ||
    clean.includes('green pin')
  ) {
    let sId = 'bank-account';
    if (clean.includes('atm') || clean.includes('debit card')) sId = 'atm-debit-card';
    else if (clean.includes('passbook')) sId = 'bank-passbook';
    else if (clean.includes('cheque')) sId = 'cheque-book';
    return { intent: 'BANKING_SERVICE', confidence: 0.95, serviceId: sId };
  }

  // 9. CERTIFICATES
  if (
    clean.includes('income certificate') ||
    clean.includes('caste certificate') ||
    clean.includes('community certificate') ||
    clean.includes('domicile certificate') ||
    clean.includes('residence certificate') ||
    clean.includes('birth certificate') ||
    clean.includes('ration card') ||
    clean.includes('meeseva certificate')
  ) {
    let sId = 'income-certificate';
    if (clean.includes('caste') || clean.includes('community')) sId = 'caste-certificate';
    else if (clean.includes('domicile') || clean.includes('residence')) sId = 'domicile-certificate';
    else if (clean.includes('birth')) sId = 'birth-certificate';
    else if (clean.includes('ration')) sId = 'ration-card';
    return { intent: 'CERTIFICATE_SERVICE', confidence: 0.95, serviceId: sId };
  }

  // 10. VOTER ID & DRIVING LICENCE
  if (clean.includes('voter') || clean.includes('driving licence') || clean.includes('driving license') || clean.includes('learner') || clean.includes('parivahan') || clean.includes('rto')) {
    return { intent: 'OTHER_GOVERNMENT_SERVICE', confidence: 0.95, serviceId: clean.includes('voter') ? 'voter-id' : 'driving-licence' };
  }

  // 11. NATIONAL SCHEMES & SCHOLARSHIP SPECIFIC (Multi-script: English, Hindi, Telugu)
  const schemeKeywords = [
    'scholarship', 'epass', 'nsp', 'rtf', 'mtf', 'pragati', 'saksham',
    'scheme', 'yojana', 'pm kisan', 'kisan', 'mudra', 'stand up', 'vishwakarma',
    'ayushman', 'pmjay', 'pm-jay', 'pmay', 'housing', 'atal pension', 'pension',
    'fasal bima', 'svanidhi', 'fasal', 'sukanya', 'kanya', 'ladli', 'asara', 'rythu',
    'ySR', 'cheyutha', 'arundhati', 'mukhyamantri', 'medhabi', 'swasthya', 'yuva',
    'amrit', 'bima', 'fellowship', 'stipend', 'subsidy', 'grant', 'allowance',
    // Hindi Devanagari
    'योजना', 'किसान', 'छात्रवृत्ति', 'मुद्रा', 'पेंशन', 'आयुष्मान', 'विश्वकर्मा', 'आवास', 'बीमा', 'सुकन्या', 'लाडली', 'सब्सिडी',
    // Telugu Script
    'పథకం', 'పథకాలు', 'కిసాన్', 'స్కాలర్‌షిప్', 'పెన్షన్', 'ఆయుష్మాన్', 'ముద్రా', 'రైతు', 'ఆసరా', 'చేయూత'
  ];
  if (schemeKeywords.some(kw => clean.includes(kw.toLowerCase()))) {
    if (clean.includes('eligible') || clean.includes('can i apply') || clean.includes('arhat') || clean.includes('yogyata') || clean.includes('पात्र') || clean.includes('అర్హత')) {
      return { intent: 'SCHOLARSHIP_ELIGIBILITY', confidence: 0.95, serviceId: 'schemes' };
    }
    if (clean.includes('deadline') || clean.includes('last date') || clean.includes('aakhri tareekh') || clean.includes('अंतिम तिथि') || clean.includes('చివరి తేదీ')) {
      return { intent: 'DEADLINE_SEARCH', confidence: 0.95, serviceId: 'schemes' };
    }
    if (clean.includes('document') || clean.includes('certificate') || clean.includes('dastavez') || clean.includes('दस्तावेज') || clean.includes('పత్రాలు')) {
      return { intent: 'DOCUMENT_REQUIREMENTS', confidence: 0.95, serviceId: 'schemes' };
    }
    return { intent: 'SCHOLARSHIP_SEARCH', confidence: 0.95, serviceId: 'schemes' };
  }

  // 12. UNKNOWN / CLARIFICATION
  return {
    intent: 'UNKNOWN_QUERY',
    confidence: 0.5,
    serviceId: null
  };
}

/**
 * Node 2: Intent Classification Node
 * Uses Gemini API with fallback to Semantic NLU.
 */
async function intentClassifierNode(state) {
  const { message, context, history } = state;

  // Attempt Gemini classification if configured
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Classify user query into exactly ONE category:
[GREETING, GENERAL_CONVERSATION, PLATFORM_INFORMATION, SCHOLARSHIP_SEARCH, SCHOLARSHIP_ELIGIBILITY, DOCUMENT_REQUIREMENTS, APPLICATION_GUIDANCE, DEADLINE_SEARCH, PAN_CARD_SERVICE, AADHAAR_SERVICE, PASSPORT_SERVICE, BANKING_SERVICE, CERTIFICATE_SERVICE, OTHER_GOVERNMENT_SERVICE, UNKNOWN_QUERY]

Active Context Topic: ${context.activeIntent || 'None'}
Active Service: ${context.activeService || 'None'}
User Query: "${message}"

Respond strictly with valid JSON: {"intent": "...", "serviceId": "...", "subTopic": "..."}`;

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000));
      const res = await Promise.race([model.generateContent(prompt), timeoutPromise]);
      const txt = res.response.text();
      const match = txt.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.intent) {
          return {
            ...state,
            classification: {
              intent: parsed.intent,
              serviceId: parsed.serviceId || null,
              subTopic: parsed.subTopic || null,
              confidence: 0.95
            }
          };
        }
      }
    } catch (e) {
      // Graceful fallback to semantic classifier
    }
  }

  const classification = classifySemanticFallback(message, context);
  return {
    ...state,
    classification
  };
}

/**
 * Node 3: Specialized Agent Router & Execution Node
 */
async function agentExecutionNode(state) {
  const { message, context, profile, language, classification } = state;
  const intent = classification.intent;
  let responsePayload = null;

  switch (intent) {
    case 'GREETING':
      responsePayload = GeneralConversationAgent.handleGreeting(language);
      break;

    case 'PLATFORM_INFORMATION':
      responsePayload = GeneralConversationAgent.handlePlatformInfo(language);
      break;

    case 'GENERAL_CONVERSATION':
      responsePayload = GeneralConversationAgent.handleGeneralPolite(language);
      break;

    case 'PAN_CARD_SERVICE':
      responsePayload = PanCardAgent.respond(message, context, language);
      break;

    case 'AADHAAR_SERVICE':
      responsePayload = AadhaarAgent.respond(message, context, language);
      break;

    case 'PASSPORT_SERVICE':
      responsePayload = PassportAgent.respond(message, { ...context, subTopic: classification.subTopic }, language);
      break;

    case 'BANKING_SERVICE':
      responsePayload = BankingAgent.respond(message, context, language);
      break;

    case 'CERTIFICATE_SERVICE':
      responsePayload = CertificateAgent.respond(message, context, language);
      break;

    case 'OTHER_GOVERNMENT_SERVICE':
      responsePayload = OtherGovtAgent.respond(message, context, language);
      break;

    case 'SCHOLARSHIP_SEARCH':
    case 'SCHOLARSHIP_ELIGIBILITY':
    case 'DOCUMENT_REQUIREMENTS':
    case 'APPLICATION_GUIDANCE':
    case 'DEADLINE_SEARCH':
      // Route through scholarship RAG & eligibility engine
      const ragResult = await runAgentOrchestration(message, profile, language);
      responsePayload = {
        answer: ragResult.answer,
        intent,
        citations: ragResult.citations || [],
        related_schemes: ragResult.related_schemes || [],
        suggestions: [
          "Am I eligible for Telangana ePASS?",
          "What documents are needed for scholarship?",
          "When is the application deadline?",
          "How to get Income Certificate on MeeSeva?"
        ]
      };
      break;

    case 'UNKNOWN_QUERY':
    default:
      responsePayload = GeneralConversationAgent.handleClarification(message, context, language);
      break;
  }

  return {
    ...state,
    responsePayload
  };
}

/**
 * Node 4: Government API Enrichment & Grounding
 */
async function apiEnrichmentNode(state) {
  const { responsePayload, profile } = state;
  let enrichedSchemes = [];

  if (responsePayload.related_schemes && responsePayload.related_schemes.length) {
    for (const scheme of responsePayload.related_schemes) {
      let apiData = null;
      try {
        if (scheme.id && scheme.id.startsWith('ts-')) {
          apiData = await epass.getScheme(scheme.id);
        } else if (scheme.id && scheme.id.startsWith('nsp-')) {
          apiData = await nsp.getScheme(scheme.id);
        } else {
          apiData = await opendata.search({ q: scheme.name });
        }
      } catch (e) {
        apiData = { error: e.message };
      }
      enrichedSchemes.push({ ...scheme, apiData });
    }
  }

  let eligibility = null;
  if (enrichedSchemes.length) {
    const topScheme = enrichedSchemes[0];
    eligibility = evaluateEligibility(profile, topScheme);
  }

  return {
    ...state,
    enrichedSchemes,
    eligibility
  };
}

/**
 * Node 5: Response Synthesis & Memory Commit
 */
async function responseSynthesisNode(state) {
  const { userId, message, responsePayload, enrichedSchemes, eligibility, language, classification } = state;

  // Append user message & assistant response to conversation history
  conversationStore.appendMessage(userId, 'user', message, {
    intent: classification.intent,
    serviceId: classification.serviceId,
    subTopic: classification.subTopic
  });

  conversationStore.appendMessage(userId, 'assistant', responsePayload.answer, {
    intent: responsePayload.intent,
    serviceId: classification.serviceId
  });

  return {
    answer: responsePayload.answer,
    intent: responsePayload.intent,
    citations: responsePayload.citations || [],
    related_schemes: enrichedSchemes,
    eligibility,
    suggestions: responsePayload.suggestions || [],
    language,
    userId
  };
}

/**
 * Main StateGraph Orchestration Entrypoint
 */
async function orchestrate(message, profile = {}, language = 'English', userId = 'usr-student-1') {
  let state = {
    userId,
    message,
    profile,
    language
  };

  // Node 1: Manage conversation state
  state = await conversationManagerNode(state);

  // Node 2: Classify intent
  state = await intentClassifierNode(state);

  // Node 3: Execute specialized domain agent
  state = await agentExecutionNode(state);

  // Node 4: Government API enrichment (for scholarships)
  state = await apiEnrichmentNode(state);

  // Node 5: Synthesize and commit to memory
  return await responseSynthesisNode(state);
}

module.exports = {
  orchestrate,
  classifySemanticFallback
};
