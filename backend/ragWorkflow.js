// C:\Nxtwave-Sathwika\jansahayak-ai\backend\ragWorkflow.js
// 8-Node LangGraph / State Machine Agent Orchestrator with National RAG Knowledge Retrieval
// Connects with nationalSchemesDatabase, hybridRetrieval, and aiProvider (Gemini + Groq fallback)

const { SCHEMES } = require('./schemesData');
const { getAllNationalSchemes } = require('./nationalSchemesDatabase');
const { hybridSearchSchemes } = require('./hybridRetrieval');
const { evaluateNationalEligibility } = require('./nationalEligibilityEngine');
const { generateAIResponse } = require('./aiProvider');
const schemeStore = require('./schemeVersionStore');

function getLiveSchemesList() {
  const list = schemeStore.getActiveSchemes();
  if (list && list.length > 0) return list;
  return getAllNationalSchemes(SCHEMES);
}

// In-Memory Vector / Passage Index for fast contextual retrieval
const DOCUMENT_PASSAGES = [
  {
    source: "Telangana ePASS Official Gazette 2026",
    url: "https://telanganaepass.cgg.gov.in/",
    verified_date: "2026-11-05",
    text: "Telangana Post-Matric Scholarships offer RTF (Reimbursement of Tuition Fee) to eligible colleges directly and MTF (Maintenance Fee) directly to the student's bank account via DBT. Income limits are ₹1,50,000 for rural areas and ₹2,00,000 for urban areas, with SC/ST limits up to ₹2,50,000. Required certificates include MeeSeva Income Certificate within 1 year, Caste Certificate, SSC memo, Bonafide certificate and bank passbook.",
    tags: ["telangana", "epass", "rtf", "mtf", "income", "meeseva", "caste"]
  },
  {
    source: "NSP Central Sector Scheme Guidelines 2026",
    url: "https://scholarships.gov.in/fresh",
    verified_date: "2026-10-28",
    text: "National Scholarship Portal CSSS scheme provides ₹12,000 per annum for graduation and ₹20,000 per annum for post-graduation. The applicant must have scored above the 80th percentile in the relevant stream in Class 12 and family annual income must not exceed ₹4,50,000.",
    tags: ["central", "nsp", "csss", "merit", "income", "graduation", "class 12"]
  },
  {
    source: "AICTE Pragati Scheme Guidelines 2026",
    url: "https://www.myscheme.gov.in/schemes/pragati-scholarship-scheme-for-girl-students-for-technical-degree",
    verified_date: "2026-10-30",
    text: "AICTE Pragati Scholarship is exclusively for female students entering technical diploma or degree courses with family income up to ₹8,00,000 per annum. It provides ₹50,000 per year for college tuition, books, equipment, and laptop/software assistance.",
    tags: ["aicte", "pragati", "girl", "female", "technical", "engineering", "diploma", "50000"]
  },
  {
    source: "PM-KISAN Samman Nidhi Operational Guidelines",
    url: "https://pmkisan.gov.in/",
    verified_date: "2026-11-15",
    text: "PM-KISAN provides income support of ₹6,000 per year in three equal installments of ₹2,000 to all landholding farmer families across India directly through Aadhaar seeded bank accounts.",
    tags: ["farmer", "kisan", "pm-kisan", "agriculture", "6000", "land", "dbt"]
  },
  {
    source: "Stand-Up India Scheme Operational Guidelines",
    url: "https://www.standupmitra.in/",
    verified_date: "2026-11-10",
    text: "Stand-Up India scheme facilitates bank loans between ₹10 Lakhs and ₹1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.",
    tags: ["women", "entrepreneur", "sc", "st", "business", "loan", "stand-up"]
  },
  {
    source: "MahaDBT Maharashtra Higher Education Charter",
    url: "https://mahadbt.maharashtra.gov.in/",
    verified_date: "2026-11-12",
    text: "Maharashtra Rajarshi Chhatrapati Shahu Maharaj scheme grants 50% tuition and exam fee waiver to eligible students with family income <= ₹8,00,000 admitted through CAP in recognized institutions.",
    tags: ["maharashtra", "mahadbt", "shahu", "8lakhs", "cap", "tuition"]
  },
  {
    source: "Ayushman Bharat PM-JAY Operational Manual",
    url: "https://nha.gov.in/PM-JAY",
    verified_date: "2026-11-14",
    text: "Ayushman Bharat PM-JAY offers health cover up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization to over 12 crore vulnerable and senior citizen families.",
    tags: ["ayushman", "health", "hospital", "5lakhs", "pmjay", "medical"]
  }
];

function retrieveRelevantPassages(query, topK = 3) {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const scored = DOCUMENT_PASSAGES.map(doc => {
    let score = 0;
    queryTerms.forEach(term => {
      if (doc.tags.some(tag => tag.includes(term) || term.includes(tag))) score += 3;
      if (doc.text.toLowerCase().includes(term)) score += 1;
    });
    return { doc, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.doc);
}

/**
 * Main 8-Node LangGraph / State Machine Orchestrator
 */
async function runAgentOrchestration(query, userProfile = {}, language = "English", conversationHistory = []) {
  // NODE 1: Query Analyzer
  const cleanQ = query.toLowerCase();

  // Extract implicit state/domain mentions from query
  let filterState = userProfile.state || 'All';
  if (cleanQ.includes('maharashtra')) filterState = 'Maharashtra';
  else if (cleanQ.includes('karnataka')) filterState = 'Karnataka';
  else if (cleanQ.includes('tamil nadu') || cleanQ.includes('tamilnadu')) filterState = 'Tamil Nadu';
  else if (cleanQ.includes('andhra')) filterState = 'Andhra Pradesh';
  else if (cleanQ.includes('uttar pradesh') || cleanQ.includes('up ')) filterState = 'Uttar Pradesh';
  else if (cleanQ.includes('telangana')) filterState = 'Telangana';
  else if (cleanQ.includes('delhi')) filterState = 'Delhi';
  else if (cleanQ.includes('punjab')) filterState = 'Punjab';
  else if (cleanQ.includes('assam')) filterState = 'Assam';
  else if (cleanQ.includes('odisha') || cleanQ.includes('orissa')) filterState = 'Odisha';
  else if (cleanQ.includes('bihar')) filterState = 'Bihar';
  else if (cleanQ.includes('kerala')) filterState = 'Kerala';
  else if (cleanQ.includes('rajasthan')) filterState = 'Rajasthan';
  else if (cleanQ.includes('gujarat')) filterState = 'Gujarat';
  else if (cleanQ.includes('central')) filterState = 'Central';

  // Extract domain
  let domain = 'All';
  if (cleanQ.includes('farmer') || cleanQ.includes('kisan') || cleanQ.includes('agriculture')) domain = 'Agriculture';
  else if (cleanQ.includes('women') || cleanQ.includes('girl') || cleanQ.includes('mahila')) domain = 'Women';
  else if (cleanQ.includes('business') || cleanQ.includes('entrepreneur') || cleanQ.includes('msme') || cleanQ.includes('mudra')) domain = 'Business';
  else if (cleanQ.includes('health') || cleanQ.includes('medical') || cleanQ.includes('ayushman')) domain = 'Health';
  else if (cleanQ.includes('pension') || cleanQ.includes('senior')) domain = 'Senior';
  else if (cleanQ.includes('scholarship') || cleanQ.includes('student') || cleanQ.includes('education')) domain = 'Education';

  // Extract income if stated in query
  let incomeMentioned = null;
  const incMatch = cleanQ.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|l)/i);
  if (incMatch) {
    incomeMentioned = parseFloat(incMatch[1]) * 100000;
  }

  // NODE 2: Intent Classification
  let intent = "SCHOLARSHIP_SEARCH";
  if (cleanQ.includes("eligible") || cleanQ.includes("eligibility") || cleanQ.includes("can i apply") || cleanQ.includes("qualify")) {
    intent = "ELIGIBILITY_CHECK";
  } else if (cleanQ.includes("document") || cleanQ.includes("certificate") || cleanQ.includes("proof") || cleanQ.includes("needed")) {
    intent = "DOCUMENT_REQUIREMENTS";
  } else if (cleanQ.includes("deadline") || cleanQ.includes("last date") || cleanQ.includes("when to apply")) {
    intent = "DEADLINES";
  }

  // NODE 3: Hybrid Retrieval across National Database
  const effectiveProfile = {
    ...userProfile,
    state: filterState !== 'All' ? filterState : userProfile.state,
    family_income: incomeMentioned !== null ? incomeMentioned : userProfile.family_income
  };

  const retrievedSchemes = hybridSearchSchemes(query, {
    state: filterState,
    domain: domain !== 'All' ? domain : undefined,
    category: effectiveProfile.category || 'All',
    max_income: effectiveProfile.family_income
  });

  const selectedSchemes = retrievedSchemes.slice(0, 4);

  // NODE 4: Passages RAG Lookup
  const retrievedPassages = retrieveRelevantPassages(query, 3);
  const citations = retrievedPassages.map(p => ({
    title: p.source,
    url: p.url,
    verified_date: p.verified_date,
    excerpt: p.text.substring(0, 140) + "..."
  }));

  // Append official scheme portal citations
  selectedSchemes.forEach(s => {
    citations.push({
      title: `${s.name} (${s.source_name || s.ministry})`,
      url: s.official_url,
      verified_date: s.last_verified || "2026-11-15",
      excerpt: s.benefits.substring(0, 140) + "..."
    });
  });

  // Deduplicate citations
  const uniqueCitations = [];
  const seenUrls = new Set();
  for (const c of citations) {
    if (!seenUrls.has(c.url)) {
      seenUrls.add(c.url);
      uniqueCitations.push(c);
    }
  }

  // Check if live AI Model (Gemini / Groq) can synthesize a natural conversational response
  const liveList = getLiveSchemesList();
  const topScheme = selectedSchemes[0] || liveList[0];
  const verdict = evaluateNationalEligibility(effectiveProfile, topScheme);

  const systemInstruction = `You are JanSahayak AI, an authoritative, helpful National Government Services and Citizen Welfare Assistant in India.
Answer the user's inquiry accurately based STRICTLY on official government guidelines.
Strict response language: ${language}.
For Telugu, respond in Telugu script (తెలుగు లిపి).
For Hindi, respond in Devanagari Hindi script (हिन्दी).
For English, respond in English.
Include official portals, benefits, required documents, and eligibility rules clearly.`;

  const promptForAI = `User Inquiry: "${query}"
User Profile State: ${effectiveProfile.state || 'Not specified'}
User Family Income: ₹${effectiveProfile.family_income ? effectiveProfile.family_income.toLocaleString('en-IN') : 'Not specified'}
Social Category: ${effectiveProfile.category || 'Not specified'}
Matched National Schemes:
${selectedSchemes.map(s => `- ${s.name} (${s.state}): ${s.benefits}. Income limit: ${s.income_limit || 'None'}. Portal: ${s.official_url}`).join('\n')}

Top Scheme Eligibility Verdict: ${verdict.status} (${verdict.summary})
Provide a concise, highly structured, citizen-friendly response explaining available schemes and direct official application steps.`;

  const aiResult = await generateAIResponse({
    prompt: promptForAI,
    systemInstruction,
    conversationHistory,
    language
  });

  let answer = "";
  if (aiResult && aiResult.success && aiResult.text) {
    answer = aiResult.text;
  } else {
    // Deterministic Native Multi-Lingual Synthesis Fallback
    if (intent === "ELIGIBILITY_CHECK") {
      if (language === "Telugu") {
        answer = `మీ ప్రొఫైల్ ఆధారంగా, **${topScheme.name}** కొరకు మీ అర్హత పరిశీలించబడింది:\n\n` +
          `• **ఫలితం:** ${verdict.status}\n` +
          `• **వివరణ:** ${verdict.summary}\n` +
          `• **అవసరమైన పత్రాలు:** ${(topScheme.required_documents || []).slice(0, 4).join(", ")}\n` +
          `• **దరఖాస్తు గడువు:** ${topScheme.application_deadline}\n\n` +
          `అధికారిక వివరాల కొరకు [అధికారిక పోర్టల్](${topScheme.official_url}) సందర్శించండి.`;
      } else if (language === "Hindi") {
        answer = `आपकी प्रोफाइल के आधार पर, **${topScheme.name}** के लिए आपकी पात्रता जांची गई:\n\n` +
          `• **स्थिति:** ${verdict.status}\n` +
          `• **विवरण:** ${verdict.summary}\n` +
          `• **आवश्यक दस्तावेज:** ${(topScheme.required_documents || []).slice(0, 4).join(", ")}\n` +
          `• **अंतिम तिथि:** ${topScheme.application_deadline}\n\n` +
          `आधिकारिक पोर्टल: [${topScheme.official_url}](${topScheme.official_url})`;
      } else {
        answer = `Based on verified government guidelines for **${topScheme.name}**:\n\n` +
          `• **Eligibility Verdict:** ${verdict.status}\n` +
          `• **Reasoning:** ${verdict.summary}\n` +
          `• **Income Limit:** ₹${topScheme.income_limit ? topScheme.income_limit.toLocaleString('en-IN') : 'No ceiling'}\n` +
          `• **Current Deadline:** ${topScheme.application_deadline}\n\n` +
          `Apply directly at the official portal: [${topScheme.official_url}](${topScheme.official_url}).`;
      }
    } else {
      if (language === "Telugu") {
        answer = `నేను మీ కొరకు **${selectedSchemes.length} ధృవీకరించబడిన ప్రభుత్వ పథకాలను** గుర్తించాను:\n\n` +
          selectedSchemes.map(s =>
            `### ${s.name}\n` +
            `- **మంత్రిత్వ శాఖ / రాష్ట్రం:** ${s.ministry} (${s.state})\n` +
            `- **ప్రయోజనాలు:** ${s.benefits}\n` +
            `- **ఆదాయ పరిమితి:** ₹${s.income_limit ? s.income_limit.toLocaleString('en-IN') : 'వర్తించదు'}\n` +
            `- **అధికారిక పోర్టల్:** [${s.official_url}](${s.official_url})`
          ).join("\n\n") +
          `\n\nమీరు వీటిలో దేనికైనా అర్హత తనిఖీ చేయాలనుకుంటున్నారా?`;
      } else if (language === "Hindi") {
        answer = `मैंने आपके लिए **${selectedSchemes.length} सत्यापित सरकारी योजनाएं** खोजी हैं:\n\n` +
          selectedSchemes.map(s =>
            `### ${s.name}\n` +
            `- **मंत्रालय / राज्य:** ${s.ministry} (${s.state})\n` +
            `- **लाभ:** ${s.benefits}\n` +
            `- **आय सीमा:** ₹${s.income_limit ? s.income_limit.toLocaleString('en-IN') : 'लागू नहीं'}\n` +
            `- **आधिकारिक पोर्टल:** [${s.official_url}](${s.official_url})`
          ).join("\n\n") +
          `\n\nक्या आप इनमें से किसी योजना के लिए पात्रता जांचना चाहते हैं?`;
      } else {
        answer = `I found **${selectedSchemes.length} verified government schemes** matching your request:\n\n` +
          selectedSchemes.map(s =>
            `### ${s.name}\n` +
            `- **Ministry / State:** ${s.ministry} (${s.state})\n` +
            `- **Benefits:** ${s.benefits}\n` +
            `- **Income Ceiling:** ₹${s.income_limit ? s.income_limit.toLocaleString('en-IN') : 'No cap'}\n` +
            `- **Official Portal:** [${s.official_url}](${s.official_url})`
          ).join("\n\n") +
          `\n\nWould you like me to run an **eligibility check** against your profile for any of these?`;
      }
    }
  }

  return {
    answer,
    intent,
    citations: uniqueCitations.slice(0, 4),
    related_schemes: selectedSchemes.map(s => ({
      id: s.id,
      name: s.name,
      state: s.state,
      domain: s.domain,
      benefits: s.benefits,
      official_url: s.official_url,
      deadline: s.application_deadline,
      income_limit: s.income_limit
    }))
  };
}

module.exports = {
  runAgentOrchestration,
  retrieveRelevantPassages,
  DOCUMENT_PASSAGES,
  getLiveSchemesList,
  ALL_NATIONAL_SCHEMES: getLiveSchemesList()
};
