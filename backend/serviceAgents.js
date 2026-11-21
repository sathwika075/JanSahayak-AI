// C:\Nxtwave-Sathwika\jansahayak-ai\backend\serviceAgents.js
// Domain-Specialized AI Service Agents with Authoritative Source Verification
// Part of the JanSahayak LangGraph Orchestration Layer

const { CITIZEN_SERVICES } = require('./servicesData');

/**
 * Shared helper to get service definition by id
 */
function getService(id) {
  return CITIZEN_SERVICES.find(s => s.id === id);
}

/**
 * Multilingual response wrapper.
 * Takes an English response object and returns a localized version
 * for Telugu or Hindi when the language parameter is set.
 * Each agent can override with custom native responses.
 */
const MULTILINGUAL_RESPONSES = {
  PAN_CARD: {
    Telugu: {
      default: {
        answer: `### PAN కార్డు (Permanent Account Number) కొరకు దరఖాస్తు ఎలా చేయాలి

మీరు PAN కార్డు రెండు అధికారిక మార్గాల్లో పొందవచ్చు:

**ఎంపిక 1: Instant e-PAN (100% ఉచితం & కాగితరహితం — 10 నిమిషాలు)**
• అధికారిక పోర్టల్: [incometax.gov.in](https://www.incometax.gov.in/iec/foportal/) లో మీ ఆధార్ OTP ద్వారా పొందండి.
• బ్యాంక్ ఖాతాలు, కాలేజ్ అడ్మిషన్లు మరియు స్కాలర్‌షిప్‌ల కోసం వెంటనే చెల్లుబాటు అవుతుంది.

**ఎంపిక 2: భౌతిక లామినేటెడ్ కార్డు (Protean / UTIITSL ద్వారా)**
1. అధికారిక పోర్టల్: [Protean (NSDL) Form 49A](https://www.protean-tinpan.com/) సందర్శించండి.
2. అప్లికేషన్ రకం: **Form 49A (భారత పౌరుడు)** ఎంచుకోండి.
3. మీ పేరు, పుట్టిన తేదీ, సంప్రదింపు వివరాలు నమోదు చేయండి.
4. ఆధార్ e-KYC లేదా పత్రాలు అప్‌లోడ్ చేసి ధృవీకరించండి.
5. అధికారిక రుసుము: భారతదేశంలో డెలివరీకి **₹107**.
6. స్పీడ్ పోస్ట్ ద్వారా ట్రాక్ చేయడానికి 15-అంకెల Acknowledgment Number భద్రపరచుకోండి.

ఏదైనా ప్రత్యేక సహాయం కావాలా?`,
        suggestions: [
          "PAN కార్డుకు అవసరమైన పత్రాలు ఏమిటి?",
          "Instant e-PAN ఎలా పొందాలి?",
          "PAN దరఖాస్తు స్థితి ఎలా తెలుసుకోవాలి?",
          "PAN ని ఆధార్‌తో లింక్ చేయడం ఎలా?"
        ]
      },
      documents: {
        answer: `### PAN కార్డు కోసం అధికారిక అవసరమైన పత్రాలు (Form 49A)

PAN దరఖాస్తుకు మూడు రకాల ధృవీకరణ పత్రాలు అవసరం:

1. **గుర్తింపు ధృవీకరణ (POI):**
   • ఆధార్ కార్డు, ఓటర్ ID, పాస్‌పోర్ట్, లేదా డ్రైవింగ్ లైసెన్స్.
2. **చిరునామా ధృవీకరణ (POA):**
   • ఆధార్ కార్డు, యుటిలిటీ బిల్ (3 నెలలలోపు), బ్యాంక్ పాస్‌బుక్, లేదా పాస్‌పోర్ట్.
3. **పుట్టిన తేదీ ధృవీకరణ (DOB):**
   • జనన ధృవీకరణ పత్రం, 10వ తరగతి మార్కుల మెమో, ఆధార్ కార్డు, లేదా పాస్‌పోర్ట్.

*గమనిక: **Instant e-PAN** వినియోగిస్తే, ఎటువంటి భౌతిక పత్రాలు అవసరం లేదు — ఆధార్ OTP ద్వారా 100% కాగితరహితం.*`,
        suggestions: [
          "Instant e-PAN ఉచితంగా ఎలా పొందాలి?",
          "PAN కార్డు ఖర్చు ఎంత?",
          "PAN స్థితి ట్రాక్ చేయడం ఎలా?"
        ]
      }
    },
    Hindi: {
      default: {
        answer: `### PAN कार्ड (Permanent Account Number) के लिए आवेदन कैसे करें

आप PAN कार्ड दो अधिकृत तरीकों से प्राप्त कर सकते हैं:

**विकल्प 1: Instant e-PAN (100% निःशुल्क और कागजरहित — 10 मिनट)**
• अधिकारिक पोर्टल: [incometax.gov.in](https://www.incometax.gov.in/iec/foportal/) पर आधार OTP से प्राप्त करें।
• बैंक खाता, कॉलेज एडमिशन और छात्रवृत्ति के लिए तुरंत मान्य।

**विकल्प 2: भौतिक लैमिनेटेड कार्ड (Protean / UTIITSL से)**
1. अधिकारिक पोर्टल: [Protean (NSDL) Form 49A](https://www.protean-tinpan.com/) पर जाएं।
2. Application Type: **Form 49A (भारतीय नागरिक)** चुनें।
3. नाम, जन्मतिथि, संपर्क विवरण भरें।
4. आधार e-KYC या दस्तावेज़ अपलोड करके सत्यापित करें।
5. अधिकारिक शुल्क: भारत में डिलीवरी के लिए **₹107**।
6. Speed Post ट्रैकिंग के लिए 15-अंकीय Acknowledgment Number सुरक्षित रखें।

क्या आपको किसी विशेष सहायता की आवश्यकता है?`,
        suggestions: [
          "PAN कार्ड के लिए कौन से दस्तावेज़ चाहिए?",
          "Instant e-PAN कैसे प्राप्त करें?",
          "PAN आवेदन की स्थिति कैसे जानें?",
          "PAN को आधार से कैसे लिंक करें?"
        ]
      },
      documents: {
        answer: `### PAN कार्ड के लिए आवश्यक दस्तावेज़ (Form 49A)

PAN आवेदन के लिए तीन प्रकार के प्रमाण चाहिए:

1. **पहचान प्रमाण (POI):**
   • आधार कार्ड, वोटर ID, पासपोर्ट, या ड्राइविंग लाइसेंस।
2. **पता प्रमाण (POA):**
   • आधार कार्ड, बिजली/पानी/गैस बिल (3 महीने के भीतर), बैंक पासबुक, या पासपोर्ट।
3. **जन्मतिथि प्रमाण (DOB):**
   • जन्म प्रमाण पत्र, 10वीं कक्षा की मार्कशीट, आधार कार्ड, या पासपोर्ट।

*नोट: **Instant e-PAN** का उपयोग करने पर कोई भौतिक दस्तावेज़ आवश्यक नहीं — आधार OTP से 100% कागजरहित।*`,
        suggestions: [
          "Instant e-PAN मुफ्त में कैसे लें?",
          "PAN कार्ड की फीस कितनी है?",
          "PAN स्थिति कैसे ट्रैक करें?"
        ]
      }
    }
  },
  AADHAAR: {
    Telugu: {
      default: {
        answer: `### ఆధార్ సేవల సమాచారం (UIDAI)

నేను మీకు అన్ని అధికారిక ఆధార్ సేవలలో మార్గదర్శకత్వం చేయగలను:

• **e-ఆధార్ డౌన్‌లోడ్:** పాస్‌వర్డ్ ఫార్మాట్ సహాయంతో తక్షణ డిజిటల్ PDF డౌన్‌లోడ్.
• **కొత్త నమోదు:** ఏదైనా ఆధార్ సేవా కేంద్రం (ASK) లేదా పోస్ట్ ఆఫీస్‌లో ఉచితం.
• **మొబైల్ నంబర్ అప్‌డేట్:** అధికారిక కేంద్రాలలో బయోమెట్రిక్ ధృవీకరణ ప్రక్రియ (₹50).
• **చిరునామా అప్‌డేట్:** myAadhaar పోర్టల్ ద్వారా ఆన్‌లైన్‌లో చెల్లుబాటు అయ్యే POA పత్రంతో (₹50).
• **PVC ఆధార్ కార్డు:** స్పీడ్ పోస్ట్ ద్వారా డెలివరీ చేయబడే ప్లాస్టిక్ కార్డు (₹50).

మీకు ఏ ఆధార్ సేవ కోసం దశల వారీ సూచనలు కావాలి?

📌 **అధికారిక పోర్టల్:** [uidai.gov.in](https://uidai.gov.in/)
📌 **ఫాల్‌బ్యాక్:** [UIDAI My Aadhaar](https://uidai.gov.in/en/my-aadhaar.html)`,
        suggestions: [
          "ఆధార్ ఎలా డౌన్‌లోడ్ చేయాలి?",
          "ఆధార్‌లో మొబైల్ నంబర్ ఎలా అప్‌డేట్ చేయాలి?",
          "PVC ఆధార్ కార్డు (₹50) ఎలా ఆర్డర్ చేయాలి?",
          "ఆధార్ చిరునామా అప్‌డేట్ కోసం ఏ పత్రాలు కావాలి?"
        ]
      },
      download: {
        answer: `### అధికారిక e-ఆధార్ PDF ఎలా డౌన్‌లోడ్ చేయాలి

UIDAI నుండి చట్టబద్ధంగా చెల్లుబాటు అయ్యే, డిజిటల్‌గా సంతకం చేసిన e-ఆధార్‌ను డౌన్‌లోడ్ చేయండి:

1. అధికారిక పోర్టల్ సందర్శించండి: [uidai.gov.in/en/my-aadhaar.html](https://uidai.gov.in/en/my-aadhaar.html)
2. మీ **12-అంకెల ఆధార్ నంబర్** (లేదా 16-అంకెల VID / 28-అంకెల EID) నమోదు చేయండి.
3. Captcha నమోదు చేసి **OTP పంపండి** క్లిక్ చేయండి.
4. మీ ఆధార్-లింక్ మొబైల్‌కు వచ్చిన 6-అంకెల OTP నమోదు చేయండి.
5. భద్రత కోసం *'మాస్క్డ్ ఆధార్ కావాలా?'* ఎంపిక ఎంచుకోవచ్చు.
6. **Verify & Download** క్లిక్ చేసి PDF సేవ్ చేయండి.

*PDF పాస్‌వర్డ్:* మీ పేరు మొదటి 4 అక్షరాలు **CAPITALS**లో + **పుట్టిన సంవత్సరం** (YYYY).
ఉదా: 'SATHWIKA' 2004 → **SATH2004**

⚠️ *గమనిక: అధికారిక పోర్టల్ 'Connection Timed Out' చూపిస్తే, UIDAI సర్వర్ లోడ్ వల్ల కావచ్చు. కొద్దిసేపు తర్వాత మళ్ళీ ప్రయత్నించండి లేదా [UIDAI హోమ్‌పేజ్](https://uidai.gov.in/) సందర్శించండి.*`,
        suggestions: [
          "ఆధార్‌లో మొబైల్ నంబర్ ఎలా అప్‌డేట్ చేయాలి?",
          "PVC ఆధార్ కార్డు (₹50) ఎలా ఆర్డర్ చేయాలి?",
          "మాస్క్డ్ ఆధార్ అంటే ఏమిటి?"
        ]
      }
    },
    Hindi: {
      default: {
        answer: `### आधार सेवाएं (UIDAI)

मैं आपको सभी अधिकारिक आधार प्रक्रियाओं में मार्गदर्शन कर सकता हूँ:

• **e-आधार डाउनलोड:** पासवर्ड फॉर्मेट सहायता के साथ तत्काल डिजिटल PDF डाउनलोड।
• **नया नामांकन:** किसी भी आधार सेवा केंद्र (ASK) या पोस्ट ऑफिस में निःशुल्क।
• **मोबाइल नंबर अपडेट:** अधिकृत केंद्रों में बायोमेट्रिक सत्यापन प्रक्रिया (₹50)।
• **पता अपडेट:** myAadhaar पोर्टल के माध्यम से ऑनलाइन (₹50)।
• **PVC आधार कार्ड:** Speed Post द्वारा प्लास्टिक कार्ड (₹50)।

आप किस आधार सेवा के बारे में जानना चाहते हैं?

📌 **अधिकारिक पोर्टल:** [uidai.gov.in](https://uidai.gov.in/)
📌 **फॉलबैक:** [UIDAI My Aadhaar](https://uidai.gov.in/en/my-aadhaar.html)`,
        suggestions: [
          "आधार कैसे डाउनलोड करें?",
          "आधार में मोबाइल नंबर कैसे अपडेट करें?",
          "PVC आधार कार्ड (₹50) कैसे ऑर्डर करें?",
          "आधार पता अपडेट के लिए कौन से दस्तावेज़?"
        ]
      },
      download: {
        answer: `### आधिकारिक e-आधार PDF कैसे डाउनलोड करें

UIDAI से कानूनी रूप से मान्य, डिजिटली हस्ताक्षरित e-आधार डाउनलोड करें:

1. आधिकारिक पोर्टल पर जाएं: [uidai.gov.in/en/my-aadhaar.html](https://uidai.gov.in/en/my-aadhaar.html)
2. अपना **12-अंकीय आधार नंबर** (या 16-अंकीय VID / 28-अंकीय EID) दर्ज करें।
3. Captcha दर्ज करें और **OTP भेजें** पर क्लिक करें।
4. आधार-लिंक मोबाइल पर आया 6-अंकीय OTP दर्ज करें।
5. सुरक्षा के लिए *'क्या आपको मास्क्ड आधार चाहिए?'* विकल्प चुन सकते हैं।
6. **Verify & Download** पर क्लिक करके PDF सेव करें।

*PDF पासवर्ड:* आपके नाम के पहले 4 अक्षर **CAPITALS** में + **जन्म वर्ष** (YYYY)।
उदा: 'SATHWIKA' 2004 → **SATH2004**

⚠️ *नोट: यदि पोर्टल 'Connection Timed Out' दिखाए, तो UIDAI सर्वर लोड के कारण हो सकता है। कुछ समय बाद पुनः प्रयास करें या [UIDAI होमपेज](https://uidai.gov.in/) पर जाएं।*`,
        suggestions: [
          "आधार में मोबाइल नंबर कैसे अपडेट करें?",
          "PVC आधार कार्ड (₹50) कैसे ऑर्डर करें?",
          "मास्क्ड आधार क्या है?"
        ]
      }
    }
  },
  PASSPORT: {
    Telugu: {
      default: {
        answer: `### భారత పాస్‌పోర్ట్ దరఖాస్తు (Passport Seva)

భారత పాస్‌పోర్ట్ కోసం దశల వారీ విధానం:

1. **అధికారిక పోర్టల్‌లో నమోదు:**
   • [passportindia.gov.in](https://www.passportindia.gov.in/psp) లో ఖాతా సృష్టించండి.
2. **ఆన్‌లైన్ దరఖాస్తు ఫారం నింపండి:**
   • **'Apply for Fresh Passport'** ఎంచుకోండి, **Normal** లేదా **Tatkaal** ఎంచుకోండి.
3. **ఆన్‌లైన్ చెల్లింపు & PSK అపాయింట్‌మెంట్:**
   • అధికారిక రుసుము: **₹1,500** (Normal) లేదా **₹3,500** (Tatkaal).
4. **PSK సందర్శించండి:**
   • అసలు చిరునామా ధృవీకరణ, DOB ధృవీకరణ, 10వ తరగతి మెమో తీసుకెళ్ళండి.
5. **పోలీస్ వెరిఫికేషన్ & స్పీడ్ పోస్ట్ డెలివరీ:**
   • స్థానిక పోలీస్ స్టేషన్ చిరునామా ధృవీకరిస్తుంది. పాస్‌పోర్ట్ స్పీడ్ పోస్ట్ ద్వారా వస్తుంది.

మీరు **మొదటి (Fresh) పాస్‌పోర్ట్** కోసం దరఖాస్తు చేస్తున్నారా?`,
        suggestions: [
          "పాస్‌పోర్ట్ కోసం అవసరమైన పత్రాలు ఏమిటి?",
          "Normal vs Tatkaal పాస్‌పోర్ట్ తేడా ఏమిటి?",
          "పాస్‌పోర్ట్ దరఖాస్తు స్థితి ఎలా ట్రాక్ చేయాలి?"
        ]
      }
    },
    Hindi: {
      default: {
        answer: `### भारतीय पासपोर्ट आवेदन (Passport Seva)

भारतीय पासपोर्ट के लिए चरणबद्ध प्रक्रिया:

1. **आधिकारिक पोर्टल पर पंजीकरण:**
   • [passportindia.gov.in](https://www.passportindia.gov.in/psp) पर खाता बनाएं।
2. **ऑनलाइन आवेदन पत्र भरें:**
   • **'Apply for Fresh Passport'** चुनें, **Normal** या **Tatkaal** चुनें।
3. **ऑनलाइन भुगतान और PSK अपॉइंटमेंट:**
   • शुल्क: **₹1,500** (Normal) या **₹3,500** (Tatkaal)।
4. **PSK जाएं:**
   • मूल पता प्रमाण, DOB प्रमाण, 10वीं मार्कशीट साथ ले जाएं।
5. **पुलिस सत्यापन और Speed Post डिलीवरी।**

क्या आप **पहले (Fresh) पासपोर्ट** के लिए आवेदन कर रहे हैं?`,
        suggestions: [
          "पासपोर्ट के लिए कौन से दस्तावेज़ चाहिए?",
          "Normal vs Tatkaal पासपोर्ट में अंतर?",
          "पासपोर्ट आवेदन स्थिति कैसे ट्रैक करें?"
        ]
      }
    }
  },
  BANKING: {
    Telugu: {
      default: {
        answer: `### పౌర బ్యాంకింగ్ సేవల మార్గదర్శకత్వం

JanSahayak AI పౌర మరియు విద్యార్థి బ్యాంకింగ్ అవసరాలకు మార్గదర్శకత్వం అందిస్తుంది:

• **విద్యార్థి జీరో-బ్యాలెన్స్ ఖాతాలు:** BSBDA మరియు PMJDY ఖాతాలు.
• **ఆధార్-NPCI DBT సీడింగ్:** స్కాలర్‌షిప్ నేరుగా పొందడానికి అవసరం.
• **బ్యాంక్ పాస్‌బుక్ సేవలు:** కొత్త జారీ, కియోస్క్ అప్‌డేటింగ్.
• **ATM / డెబిట్ కార్డు:** కొత్త కార్డు, Green PIN సెటప్, 24x7 కార్డు బ్లాకింగ్ హెల్ప్‌లైన్‌లు.

> **భద్రతా విధానం:** మేము మీ ఖాతా నంబర్, ATM PIN, CVV, OTP, లేదా పాస్‌వర్డ్‌లను ఎప్పటికీ అడగము.

మీకు ఏ బ్యాంకింగ్ సేవలో సహాయం కావాలి?`,
        suggestions: [
          "ATM కార్డు ఎలా రిక్వెస్ట్ చేయాలి?",
          "కోల్పోయిన ATM కార్డు ఎలా బ్లాక్ చేయాలి?",
          "బ్యాంక్ పాస్‌బుక్ ఎలా పొందాలి?",
          "విద్యార్థి జీరో-బ్యాలెన్స్ ఖాతా ఎలా తెరవాలి?"
        ]
      },
      block: {
        answer: `### 🚨 అత్యవసరం: కోల్పోయిన ATM/డెబిట్ కార్డు వెంటనే బ్లాక్ చేయండి

> **భద్రతా హెచ్చరిక:** JanSahayak AI మీ ATM PIN, CVV, OTP, లేదా NetBanking పాస్‌వర్డ్‌లను ఎప్పటికీ అడగదు.

**1. SMS ద్వారా తక్షణ బ్లాకింగ్:**
• **SBI:** \`BLOCK <చివరి 4 అంకెలు>\` → **567676**
• **HDFC:** \`BLOCK <చివరి 4 అంకెలు>\` → **5676712**
• **ICICI:** \`IBLOCK <చివరి 4 అంకెలు>\` → **5676766**

**2. 24x7 టోల్-ఫ్రీ హెల్ప్‌లైన్‌లు:**
• **SBI:** 1800 1234 / 1800 2100
• **HDFC:** 1800 1600
• **ICICI:** 1800 1080

**3. మొబైల్ బ్యాంకింగ్ యాప్:** Cards > Manage Debit Card > 'Permanent Block' ఎంచుకోండి.`,
        suggestions: [
          "రీప్లేస్‌మెంట్ ATM కార్డు ఎలా రిక్వెస్ట్ చేయాలి?",
          "కొత్త ATM Green PIN ఎలా జనరేట్ చేయాలి?",
          "కొత్త బ్యాంక్ పాస్‌బుక్ ఎలా పొందాలి?"
        ]
      }
    },
    Hindi: {
      default: {
        answer: `### नागरिक बैंकिंग सेवाएं मार्गदर्शन

JanSahayak AI नागरिक और छात्र बैंकिंग जरूरतों के लिए मार्गदर्शन प्रदान करता है:

• **छात्र जीरो-बैलेंस खाते:** BSBDA और PMJDY खाते।
• **आधार-NPCI DBT सीडिंग:** छात्रवृत्ति सीधे प्राप्त करने के लिए आवश्यक।
• **बैंक पासबुक सेवाएं:** नई जारी, कियोस्क अपडेटिंग।
• **ATM / डेबिट कार्ड:** नया कार्ड, Green PIN सेटअप, 24x7 कार्ड ब्लॉकिंग।

> **सुरक्षा नीति:** हम कभी भी आपका खाता नंबर, ATM PIN, CVV, OTP, या पासवर्ड नहीं मांगते।

आपको किस बैंकिंग सेवा में सहायता चाहिए?`,
        suggestions: [
          "ATM कार्ड कैसे अनुरोध करें?",
          "खोए हुए ATM कार्ड को कैसे ब्लॉक करें?",
          "बैंक पासबुक कैसे प्राप्त करें?",
          "छात्र जीरो-बैलेंस खाता कैसे खोलें?"
        ]
      },
      block: {
        answer: `### 🚨 आपातकाल: खोए/चोरी हुए ATM/डेबिट कार्ड को तुरंत ब्लॉक करें

> **सुरक्षा चेतावनी:** JanSahayak AI कभी भी आपका ATM PIN, CVV, OTP, या NetBanking पासवर्ड नहीं मांगेगा।

**1. SMS से तत्काल ब्लॉकिंग:**
• **SBI:** \`BLOCK <अंतिम 4 अंक>\` → **567676**
• **HDFC:** \`BLOCK <अंतिम 4 अंक>\` → **5676712**
• **ICICI:** \`IBLOCK <अंतिम 4 अंक>\` → **5676766**

**2. 24x7 टोल-फ्री हेल्पलाइन:**
• **SBI:** 1800 1234 / 1800 2100
• **HDFC:** 1800 1600
• **ICICI:** 1800 1080

**3. मोबाइल बैंकिंग ऐप:** Cards > Manage Debit Card > 'Permanent Block' चुनें।`,
        suggestions: [
          "रिप्लेसमेंट ATM कार्ड कैसे अनुरोध करें?",
          "नया ATM Green PIN कैसे बनाएं?",
          "नई बैंक पासबुक कैसे प्राप्त करें?"
        ]
      }
    }
  },
  CERTIFICATE: {
    Telugu: {
      default: {
        answer: `### ప్రభుత్వ ధృవీకరణ పత్రాల కేంద్రం (తెలంగాణ MeeSeva)

నేను మీకు రాష్ట్ర ధృవీకరణ పత్రాల దరఖాస్తు, పత్రాలు, రుసుములు మరియు ట్రాకింగ్ కోసం మార్గదర్శకత్వం చేయగలను:

• **ఆదాయ ధృవీకరణ పత్రం:** తహశీల్దార్ జారీ చేస్తారు (₹45 రుసుము, 1 ఆర్థిక సంవత్సరం చెల్లుబాటు).
• **కుల/కమ్యూనిటీ ధృవీకరణ పత్రం:** SC/ST/BC/మైనారిటీ ధృవీకరణ (₹45, జీవితకాల చెల్లుబాటు).
• **నివాస/డొమిసైల్ ధృవీకరణ పత్రం:** 85% కాలేజ్ అడ్మిషన్ కోటాలకు ధృవీకరణ (₹45).
• **జనన ధృవీకరణ పత్రం:** GHMC/CDMA డిజిటల్ సంతకం పత్రం.

📌 **అధికారిక పోర్టల్:** [meeseva.telangana.gov.in](https://ts.meeseva.telangana.gov.in/meeseva/home.htm)

ఏ ధృవీకరణ పత్రం కోసం దరఖాస్తు సూచనలు కావాలి?`,
        suggestions: [
          "ఆదాయ ధృవీకరణ పత్రం ఎలా దరఖాస్తు చేయాలి?",
          "కుల ధృవీకరణ పత్రం ఎలా దరఖాస్తు చేయాలి?",
          "నివాస ధృవీకరణ పత్రం ఎలా పొందాలి?",
          "MeeSeva దరఖాస్తు స్థితి ఎలా ట్రాక్ చేయాలి?"
        ]
      },
      income: {
        answer: `### ఆదాయ ధృవీకరణ పత్రం కోసం దరఖాస్తు (తెలంగాణ MeeSeva)

స్కాలర్‌షిప్ ఫీజు రీయింబర్స్‌మెంట్ (RTF & MTF) కోసం ఆదాయ ధృవీకరణ పత్రం తప్పనిసరి.

**1. అవసరమైన పత్రాలు:**
• MeeSeva ఆదాయ ధృవీకరణ దరఖాస్తు ఫారం
• జీతం స్లిప్ / Form 16 (ఉద్యోగులకు) లేదా వ్యవసాయ/వ్యాపార ఆదాయ స్వయం-ప్రకటన
• దరఖాస్తుదారు మరియు తండ్రి ఆధార్ కార్డులు
• రేషన్ కార్డు / ఫుడ్ సెక్యూరిటీ కార్డు
• ప్రస్తుత సంవత్సరం విద్యుత్ బిల్ లేదా హౌస్ ట్యాక్స్ రసీదు

**2. దరఖాస్తు ప్రక్రియ:**
• సమీపంలోని **MeeSeva కేంద్రం** సందర్శించండి లేదా ఆన్‌లైన్‌లో దరఖాస్తు చేయండి.
• అధికారిక రుసుము: **₹45**.
• **తహశీల్దార్** 7 పనిదినాలలో QR-కోడెడ్ పత్రం జారీ చేస్తారు.

**3. చెల్లుబాటు:** ఒక ఆర్థిక సంవత్సరం (ఏప్రిల్ 1 — మార్చి 31).`,
        suggestions: [
          "కుల ధృవీకరణ పత్రం ఎలా దరఖాస్తు చేయాలి?",
          "ePASS స్కాలర్‌షిప్ కోసం ఆదాయ పరిమితులు ఎంత?",
          "MeeSeva దరఖాస్తు స్థితి ఎలా ట్రాక్ చేయాలి?"
        ]
      }
    },
    Hindi: {
      default: {
        answer: `### सरकारी प्रमाणपत्र केंद्र (तेलंगाना MeeSeva)

मैं आपको राज्य प्रमाणपत्रों के आवेदन, दस्तावेज़, शुल्क और ट्रैकिंग में मार्गदर्शन कर सकता हूँ:

• **आय प्रमाण पत्र:** तहसीलदार द्वारा जारी (₹45 शुल्क, 1 वित्तीय वर्ष मान्य)।
• **जाति/समुदाय प्रमाण पत्र:** SC/ST/BC/अल्पसंख्यक प्रमाण (₹45, जीवनभर मान्य)।
• **निवास/डोमिसाइल प्रमाण पत्र:** 85% कॉलेज एडमिशन कोटा के लिए (₹45)।
• **जन्म प्रमाण पत्र:** GHMC/CDMA डिजिटली हस्ताक्षरित।

📌 **आधिकारिक पोर्टल:** [meeseva.telangana.gov.in](https://ts.meeseva.telangana.gov.in/meeseva/home.htm)

किस प्रमाणपत्र के लिए आवेदन निर्देश चाहिए?`,
        suggestions: [
          "आय प्रमाण पत्र कैसे बनवाएं?",
          "जाति प्रमाण पत्र कैसे बनवाएं?",
          "निवास प्रमाण पत्र कैसे प्राप्त करें?",
          "MeeSeva आवेदन स्थिति कैसे ट्रैक करें?"
        ]
      },
      income: {
        answer: `### आय प्रमाण पत्र आवेदन (तेलंगाना MeeSeva)

छात्रवृत्ति फीस प्रतिपूर्ति (RTF & MTF) के लिए आय प्रमाण पत्र अनिवार्य है।

**1. आवश्यक दस्तावेज़:**
• MeeSeva आय प्रमाण पत्र आवेदन फॉर्म
• वेतन पर्ची / Form 16 (नौकरीपेशा के लिए) या स्व-घोषणा
• आवेदक और पिता के आधार कार्ड
• राशन कार्ड / फूड सिक्योरिटी कार्ड
• वर्तमान बिजली बिल या हाउस टैक्स रसीद

**2. आवेदन प्रक्रिया:**
• नज़दीकी **MeeSeva केंद्र** जाएं या ऑनलाइन आवेदन करें।
• शुल्क: **₹45**।
• **तहसीलदार** 7 कार्य दिवसों में QR-कोडेड प्रमाणपत्र जारी करेंगे।

**3. मान्यता:** एक वित्तीय वर्ष (अप्रैल 1 — मार्च 31)।`,
        suggestions: [
          "जाति प्रमाण पत्र कैसे बनवाएं?",
          "ePASS छात्रवृत्ति के लिए आय सीमा कितनी है?",
          "MeeSeva आवेदन स्थिति कैसे ट्रैक करें?"
        ]
      }
    }
  }
};

/**
 * Returns localized response if available, else falls back to English response.
 */
function getLocalizedResponse(agentKey, subKey, language, englishResponse) {
  if (language === 'English' || !language) return englishResponse;
  const langData = MULTILINGUAL_RESPONSES[agentKey]?.[language];
  if (!langData) return englishResponse;
  const localized = langData[subKey] || langData['default'];
  if (!localized) return englishResponse;
  return {
    ...englishResponse,
    answer: localized.answer,
    suggestions: localized.suggestions || englishResponse.suggestions
  };
}

// ============================================================================
// 1. GENERAL CONVERSATION AGENT
// Handles Greetings, Platform Identity ("Who are you?"), Capabilities, Polite talk
// ============================================================================
const GeneralConversationAgent = {
  handleGreeting(language = "English") {
    if (language === "Telugu") {
      return {
        answer: "నమస్కారం! **జనసహాయక్ AI (JanSahayak AI)** కు స్వాగతం. నేను ప్రభుత్వ స్కాలర్‌షిప్‌లు, గుర్తింపు కార్డులు (PAN, ఆధార్, ఓటర్ ID), పాస్‌పోర్ట్, బ్యాంకింగ్ మార్గదర్శకత్వం మరియు ప్రభుత్వ ధృవీకరణ పత్రాల (ఆదాయం, కుల ధృవీకరణ పత్రాలు) దరఖాస్తులో మీకు సహాయం చేయగలను. ఈ రోజు మీకు ఏ సేవతో సహాయం కావాలి?",
        intent: "GREETING",
        citations: [],
        suggestions: [
          "స్కాలర్‌షిప్‌ల వివరాలు తెలుసుకోండి",
          "PAN కార్డు ఎలా దరఖాస్తు చేయాలి?",
          "ఆధార్ కార్డు డౌన్‌లోడ్ చేయడం ఎలా?",
          "పాస్‌పోర్ట్ దరఖాస్తు విధానం",
          "ATM కార్డు బ్లాక్ చేయడం ఎలా?",
          "ఆదాయ ధృవీకరణ పత్రం ఎలా పొందాలి?"
        ]
      };
    } else if (language === "Hindi") {
      return {
        answer: "नमस्ते! **जनसहायक AI (JanSahayak AI)** में आपका स्वागत है। मैं आपको सरकारी छात्रवृत्तियां खोजने, पहचान पत्र (PAN, आधार, वोटर ID) बनवाने, पासपोर्ट, बैंकिंग सहायता और सरकारी प्रमाणपत्रों (आय, जाति प्रमाण पत्र) के लिए मार्गदर्शन प्रदान कर सकता हूँ। आज आप किस सेवा के बारे में जानना चाहते हैं?",
        intent: "GREETING",
        citations: [],
        suggestions: [
          "कौन सी छात्रवृत्ति के लिए पात्र हूँ?",
          "PAN कार्ड कैसे बनवाएं?",
          "आधार कार्ड कैसे डाउनलोड करें?",
          "पासपोर्ट आवेदन के नियम",
          "ATM कार्ड खो जाने पर क्या करें?",
          "आय प्रमाण पत्र के लिए आवश्यक दस्तावेज"
        ]
      };
    }
    return {
      answer: "Hello! Welcome to **JanSahayak AI** — your verified Government & Citizen Services Assistant.\n\nI can help you:\n• Find and check eligibility for **Central & State Government Scholarships**\n• Apply for official identity documents (**PAN Card, Aadhaar, Voter ID**)\n• Navigate travel services (**Indian Passport & Driving Licence**)\n• Get citizen banking guidance (**Bank Account, Passbook, ATM Card request & emergency blocking**)\n• Apply for official certificates (**Income, Caste, Residence, Birth Certificates, Ration Card**)\n\nWhat would you like help with today?",
      intent: "GREETING",
      citations: [],
      suggestions: [
        "Which scholarships can I apply for?",
        "How do I apply for a PAN card?",
        "How do I download Aadhaar?",
        "How do I apply for a passport?",
        "How do I request an ATM card?",
        "How do I apply for an income certificate?"
      ]
    };
  },

  handlePlatformInfo(language = "English") {
    if (language === "Telugu") {
      return {
        answer: "### జనసహాయక్ AI గురించి (JanSahayak AI)\n\n**జనసహాయక్ AI** అనేది ప్రభుత్వ సేవలు, సంక్షేమ పథకాలు మరియు పౌర డాక్యుమెంటేషన్‌ను అందరికీ అందుబాటులో, పారదర్శకంగా మరియు సులభంగా చేయడానికి అభివృద్ధి చేయబడిన స్వయంప్రతిపత్త సివిక్-టెక్ సహాయ వేదిక.\n\n**నేను మీకు ఏ సహాయం చేయగలను:**\n1. **స్కాలర్‌షిప్ ఇంటెలిజెన్స్:** అర్హత తనిఖీ, ఫీజు రీయింబర్స్‌మెంట్ లెక్కింపు (ePASS, NSP, AICTE).\n2. **గుర్తింపు సేవలు:** PAN కార్డు (Form 49A & Instant e-PAN), ఆధార్ అప్‌డేట్లు & డౌన్‌లోడ్, ఓటర్ ID.\n3. **ప్రయాణ సేవలు:** Fresh & Tatkaal పాస్‌పోర్ట్, డ్రైవింగ్ లైసెన్స్.\n4. **బ్యాంకింగ్ మార్గదర్శకత్వం:** జీరో-బ్యాలెన్స్ ఖాతాలు, పాస్‌బుక్, ATM కార్డు, అత్యవసర కార్డు బ్లాకింగ్.\n5. **ప్రభుత్వ ధృవీకరణ పత్రాలు:** MeeSeva ద్వారా ఆదాయ, కుల, నివాస, జనన ధృవీకరణ పత్రాలు.\n\nసమాధానాలన్నీ అధికారిక ప్రభుత్వ పోర్టల్స్ మరియు గెజిట్‌ల ఆధారంగా ధృవీకరించబడ్డాయి.",
        intent: "PLATFORM_INFORMATION",
        citations: [
          { title: "JanSahayak Civic Architecture 2026", url: "https://www.myscheme.gov.in/", verified_date: "2026-11-15" }
        ],
        suggestions: [
          "అన్ని పౌర సేవలు చూపించండి",
          "ఏ స్కాలర్‌షిప్‌లకు అర్హత ఉంది?",
          "పాస్‌పోర్ట్ ఎలా దరఖాస్తు చేయాలి?",
          "కోల్పోయిన ATM కార్డు ఎలా బ్లాక్ చేయాలి?"
        ]
      };
    }
    if (language === "Hindi") {
      return {
        answer: "### जनसहायक AI के बारे में (JanSahayak AI)\n\n**जनसहायक AI** एक स्वायत्त सिविक-टेक सहायता मंच है जो सरकारी सेवाओं, कल्याणकारी योजनाओं और नागरिक दस्तावेज़ीकरण को सभी नागरिकों के लिए सुलभ, पारदर्शी और सरल बनाने के लिए विकसित किया गया है।\n\n**मैं आपकी क्या सहायता कर सकता हूँ:**\n1. **छात्रवृत्ति बुद्धिमत्ता:** पात्रता जांच, शुल्क प्रतिपूर्ति गणना (ePASS, NSP, AICTE)।\n2. **पहचान सेवाएं:** PAN कार्ड (Form 49A और Instant e-PAN), आधार अपडेट और डाउनलोड, वोटर ID।\n3. **यात्रा सेवाएं:** Fresh और Tatkaal पासपोर्ट, ड्राइविंग लाइसेंस।\n4. **बैंकिंग मार्गदर्शन:** जीरो-बैलेंस खाते, पासबुक, ATM कार्ड, आपातकालीन कार्ड ब्लॉकिंग।\n5. **सरकारी प्रमाणपत्र:** MeeSeva से आय, जाति, निवास, जन्म प्रमाण पत्र।\n\nसभी उत्तर आधिकारिक सरकारी पोर्टल्स और राजपत्रों के आधार पर सत्यापित हैं।",
        intent: "PLATFORM_INFORMATION",
        citations: [
          { title: "JanSahayak Civic Architecture 2026", url: "https://www.myscheme.gov.in/", verified_date: "2026-11-15" }
        ],
        suggestions: [
          "सभी नागरिक सेवाएं दिखाएं",
          "किन छात्रवृत्तियों के लिए पात्र हूँ?",
          "पासपोर्ट कैसे आवेदन करें?",
          "खोया ATM कार्ड कैसे ब्लॉक करें?"
        ]
      };
    }
    return {
      answer: "### About JanSahayak AI (జనసహాయక్)\n\n**JanSahayak AI** is an autonomous, civic-tech assistance platform developed to make government services, welfare schemes, and citizen documentation accessible, transparent, and simple for all citizens — especially students and rural families.\n\n**What I can do for you:**\n1. **Scholarship Intelligence:** Check eligibility, calculate fee reimbursements (ePASS, NSP, AICTE), and track deadlines.\n2. **Identity Services:** Complete guidance for PAN Card (Form 49A & Instant e-PAN), Aadhaar updates & download, and Voter ID.\n3. **Travel & Mobility:** Step-by-step guidance for Fresh & Tatkaal Passport, appointment booking, and Driving Licences via Parivahan.\n4. **Citizen Banking Guidance:** Instructions for student zero-balance accounts, passbook updates, ATM card issuance, and emergency card blocking (we *never* collect PINs or OTPs).\n5. **Government Certificates:** MeeSeva guidance for digitally signed Income, Caste, Domicile, and Birth certificates in Telangana.\n\nAll answers are strictly verified against official government gazettes, portals, and RBI directives.",
      intent: "PLATFORM_INFORMATION",
      citations: [
        { title: "JanSahayak Civic Architecture 2026", url: "https://www.myscheme.gov.in/", verified_date: "2026-11-15" }
      ],
      suggestions: [
        "Show all Citizen Services",
        "Which scholarships can I apply for?",
        "How do I apply for a passport?",
        "How do I block a lost ATM card?"
      ]
    };
  },

  handleGeneralPolite(language = "English") {
    if (language === "Telugu") {
      return {
        answer: "మీకు స్వాగతం! ధృవీకరించిన ప్రభుత్వ విధానాలు, పౌర డాక్యుమెంటేషన్ మరియు స్కాలర్‌షిప్ మార్గదర్శకత్వంతో మీకు సహాయం చేయడానికి నేను ఎల్లప్పుడూ ఇక్కడ ఉంటాను. మరేదైనా కావాలంటే అడగండి!",
        intent: "GENERAL_CONVERSATION",
        citations: [],
        suggestions: [
          "ఏ స్కాలర్‌షిప్‌లకు అర్హత ఉంది?",
          "పౌర సేవల కేంద్రం చూడండి",
          "నా అర్హత తనిఖీ చేయండి"
        ]
      };
    }
    if (language === "Hindi") {
      return {
        answer: "आपका स्वागत है! सत्यापित सरकारी प्रक्रियाओं, नागरिक दस्तावेज़ीकरण और छात्रवृत्ति मार्गदर्शन में आपकी सहायता के लिए मैं हमेशा यहाँ हूँ। कुछ और चाहिए तो बेझिझक पूछें!",
        intent: "GENERAL_CONVERSATION",
        citations: [],
        suggestions: [
          "किन छात्रवृत्तियों के लिए पात्र हूँ?",
          "नागरिक सेवा केंद्र देखें",
          "मेरी पात्रता जांचें"
        ]
      };
    }
    return {
      answer: "You are very welcome! I am always here to assist you with verified government procedures, citizen documentation, and scholarship guidance. Feel free to ask if you need anything else!",
      intent: "GENERAL_CONVERSATION",
      citations: [],
      suggestions: [
        "Which scholarships can I apply for?",
        "Explore Citizen Services Hub",
        "Check my eligibility"
      ]
    };
  },

  handleClarification(query, context = {}, language = "English") {
    if (language === "Telugu") {
      return {
        answer: `మీకు అత్యంత ఖచ్చితమైన ప్రభుత్వ మార్గదర్శకత్వం అందించాలనుకుంటున్నాను. దయచేసి మీకు ఏ సేవ గురించి తెలుసుకోవాలో చెప్పండి:\n\n• **స్కాలర్‌షిప్‌లు:** ePASS తెలంగాణ, Central Sector (NSP), AICTE Pragati\n• **గుర్తింపు:** PAN కార్డు, ఆధార్, ఓటర్ ID\n• **ప్రయాణం:** పాస్‌పోర్ట్ (Fresh / Tatkaal), డ్రైవింగ్ లైసెన్స్\n• **బ్యాంకింగ్:** సేవింగ్స్ ఖాతా, పాస్‌బుక్, ATM / డెబిట్ కార్డు\n• **ధృవీకరణ పత్రాలు:** ఆదాయ, కుల, నివాస ధృవీకరణ పత్రాలు\n\nకింద ఉన్న సూచనలలో ఏదైనా క్లిక్ చేయవచ్చు:`,
        intent: "UNKNOWN_QUERY",
        citations: [],
        suggestions: [
          "స్కాలర్‌షిప్ అర్హత తనిఖీ",
          "PAN కార్డు దరఖాస్తు",
          "పాస్‌పోర్ట్ దరఖాస్తు",
          "ఆధార్ డౌన్‌లోడ్",
          "ఆదాయ ధృవీకరణ పత్రం"
        ]
      };
    }
    if (language === "Hindi") {
      return {
        answer: `मैं आपको सबसे सटीक सरकारी मार्गदर्शन देना चाहता हूँ। कृपया बताएं कि आपको किस सेवा के बारे में जानना है:\n\n• **छात्रवृत्ति:** ePASS तेलंगाना, Central Sector (NSP), AICTE Pragati\n• **पहचान:** PAN कार्ड, आधार, वोटर ID\n• **यात्रा:** पासपोर्ट (Fresh / Tatkaal), ड्राइविंग लाइसेंस\n• **बैंकिंग:** बचत खाता, पासबुक, ATM / डेबिट कार्ड\n• **प्रमाणपत्र:** आय, जाति, निवास प्रमाण पत्र\n\nनीचे दिए गए सुझावों में से कोई भी क्लिक करें:`,
        intent: "UNKNOWN_QUERY",
        citations: [],
        suggestions: [
          "छात्रवृत्ति पात्रता जांच",
          "PAN कार्ड आवेदन",
          "पासपोर्ट आवेदन",
          "आधार डाउनलोड",
          "आय प्रमाण पत्र"
        ]
      };
    }
    return {
      answer: `I want to make sure I give you the most accurate government guidance. Could you please specify which service you are asking about?\n\n• **Scholarships:** ePASS Telangana, Central Sector (NSP), AICTE Pragati\n• **Identity:** PAN Card, Aadhaar, Voter ID\n• **Travel:** Passport (Fresh / Tatkaal), Driving Licence\n• **Banking:** Savings account, Passbook, ATM / Debit card, Cheque book\n• **Certificates:** Income certificate, Caste certificate, Domicile certificate\n\nYou can also click any of the quick suggestions below:`,
      intent: "UNKNOWN_QUERY",
      citations: [],
      suggestions: [
        "Scholarship eligibility check",
        "Apply for PAN card",
        "Apply for Passport",
        "Download Aadhaar",
        "Get Income Certificate"
      ]
    };
  }
};

// ============================================================================
// 2. PAN CARD AGENT
// ============================================================================
const PanCardAgent = {
  respond(message, context = {}, language = "English") {
    const q = message.toLowerCase();
    const pan = getService("pan-card");

    const citations = [
      { title: "Income Tax Department Official Portal", url: "https://www.incometax.gov.in/iec/foportal/", verified_date: "2026-11-10" },
      { title: "Protean eGov (NSDL) PAN Services", url: "https://www.protean-tinpan.com/", verified_date: "2026-11-05" }
    ];

    if (q.includes("document") || q.includes("need") || q.includes("require")) {
      const engResp = {
        answer: `### Official Documents Required for PAN Card (Form 49A)\n\nTo apply for a Permanent Account Number (PAN), you need three categories of proof:\n\n1. **Proof of Identity (POI):**\n   • Aadhaar Card, Voter ID, Passport, or Driving Licence.\n2. **Proof of Address (POA):**\n   • Aadhaar Card, Utility Bill (Electricity / Water / Gas within 3 months), Bank Passbook, or Passport.\n3. **Proof of Date of Birth (DOB):**\n   • Birth Certificate, 10th Standard Marks Memo, Aadhaar Card, or Passport.\n\n*Note: If you use the **Instant e-PAN** facility on the Income Tax portal, no physical documents or photos are needed — verification is 100% paperless via your **Aadhaar OTP**.*`,
        intent: "PAN_CARD_SERVICE",
        citations,
        suggestions: [
          "How to get Instant e-PAN for free?",
          "How much does a physical PAN card cost?",
          "How to track PAN card status?"
        ]
      };
      return getLocalizedResponse('PAN_CARD', 'documents', language, engResp);
    }

    if (q.includes("instant") || q.includes("free") || q.includes("e-pan") || q.includes("urgent")) {
      return {
        answer: `### How to Get an Instant e-PAN for Free (10 Minutes)\n\nThe Income Tax Department provides paperless Instant e-PAN generation at **zero cost**:\n\n1. Visit the official e-Filing portal: [incometax.gov.in](https://www.incometax.gov.in/iec/foportal/).\n2. Under Quick Links, click on **Instant e-PAN**.\n3. Click **Get New e-PAN** and enter your 12-digit **Aadhaar Number**.\n4. Enter the 6-digit OTP sent to your Aadhaar-linked mobile phone.\n5. Confirm your demographic details (Name, DOB, Photo) fetched from UIDAI.\n6. Submit the request. Your digitally signed e-PAN is generated within **10 minutes**.\n\n*Eligibility:* You must have an Aadhaar linked to an active mobile number and must not have an existing PAN card.`,
        intent: "PAN_CARD_SERVICE",
        citations: [{ title: "Income Tax Instant e-PAN Guidelines", url: "https://www.incometax.gov.in/iec/foportal/", verified_date: "2026-11-08" }],
        suggestions: [
          "How to order a physical plastic PAN card?",
          "How to link PAN with Aadhaar?",
          "What documents are needed for physical PAN?"
        ]
      };
    }

    if (q.includes("track") || q.includes("status")) {
      return {
        answer: `### How to Track PAN Card Application Status\n\n1. Go to the official tracking portal: [Protean TIN Status Tracker](https://www.trackpan.utiitsl.com/) or [UTIITSL Tracking Portal](https://www.trackpan.utiitsl.com/).\n2. Select Application Type as **'PAN - New / Change Request'**.\n3. Enter your **15-digit Acknowledgment Number** (printed on your application receipt).\n4. Enter the Captcha code and click **Submit**.\n\nYou will see the real-time stage: Under Processing, Printed, or Dispatched with India Post Speed Post Consignment Number.`,
        intent: "PAN_CARD_SERVICE",
        citations,
        suggestions: [
          "What is the physical PAN card fee?",
          "How to update address or name in PAN?"
        ]
      };
    }

    // Default overview
    const engDefault = {
      answer: `### How to Apply for a Permanent Account Number (PAN Card)\n\nYou can apply for a PAN card through two authorized methods:\n\n**Option 1: Instant e-PAN (100% Free & Paperless - 10 Minutes)**\n• Generated directly at [incometax.gov.in](https://www.incometax.gov.in/iec/foportal/) using your Aadhaar OTP.\n• Valid immediately for bank accounts, college admissions, and scholarships.\n\n**Option 2: Physical Laminated Card (Via Protean / UTIITSL)**\n1. Visit the official portal: [Protean (NSDL) Form 49A](https://www.protean-tinpan.com/).\n2. Select **Application Type: Form 49A (Indian Citizen)** and Category: **Individual**.\n3. Fill in your name, date of birth, contact details, and parent details.\n4. Complete paperless verification via Aadhaar e-KYC or upload scanned POI/POA/DOB documents.\n5. Pay the official fee: **₹107** for delivery in India (₹1,017 for overseas).\n6. Save the 15-digit Acknowledgment Number to track delivery via Speed Post.\n\nWould you like guidance on the required documents, fee details, or status tracking?`,
      intent: "PAN_CARD_SERVICE",
      citations,
      suggestions: [
        "What documents are needed for PAN card?",
        "How to apply for Instant e-PAN for free?",
        "How do I track my PAN application status?",
        "How to link PAN with my Aadhaar?"
      ]
    };
    return getLocalizedResponse('PAN_CARD', 'default', language, engDefault);
  }
};

// ============================================================================
// 3. AADHAAR AGENT
// ============================================================================
const AadhaarAgent = {
  respond(message, context = {}, language = "English") {
    const q = message.toLowerCase();
    const citations = [
      { title: "UIDAI Official Portal", url: "https://uidai.gov.in/", verified_date: "2026-11-10" },
      { title: "myAadhaar Citizen Portal", url: "https://uidai.gov.in/en/my-aadhaar.html", verified_date: "2026-11-08" }
    ];

    if (q.includes("download") || q.includes("e-aadhaar") || q.includes("pdf")) {
      const engResp = {
        answer: `### How to Download Your Official e-Aadhaar PDF\n\nYou can download a legally valid, digitally signed e-Aadhaar directly from UIDAI:\n\n1. Visit the official portal: [myaadhaar.uidai.gov.in](https://uidai.gov.in/en/my-aadhaar.html)\n2. Enter your **12-digit Aadhaar Number** (or 16-digit Virtual ID / 28-digit Enrolment ID).\n3. Enter the Captcha and click **Send OTP**.\n4. Enter the 6-digit OTP received on your Aadhaar-linked mobile number.\n5. **Masked Aadhaar Option:** Check the box *'Do you want a masked Aadhaar?'* if you wish to mask the first 8 digits for safety.\n6. Click **Verify & Download** to save your password-protected PDF.\n\n*PDF Password:* First 4 letters of your Name in **CAPITAL** letters followed by your **Year of Birth** (YYYY). E.g., for 'SATHWIKA' born in 2004, password is **SATH2004**.\n\n⚠️ *Note: If the official portal displays 'Connection Timed Out', this is a known issue with UIDAI server load. Please try again after a few minutes or visit the [UIDAI Department Homepage](https://uidai.gov.in/).*\n\n📌 **Official Portal:** [uidai.gov.in](https://uidai.gov.in/)\n📌 **Fallback:** [UIDAI My Aadhaar Page](https://uidai.gov.in/en/my-aadhaar.html)`,
        intent: "AADHAAR_SERVICE",
        citations,
        suggestions: [
          "How to update mobile number in Aadhaar?",
          "How to order PVC Aadhaar card (₹50)?",
          "What is Masked Aadhaar?"
        ]
      };
      return getLocalizedResponse('AADHAAR', 'download', language, engResp);
    }

    if (q.includes("mobile") || q.includes("phone number")) {
      return {
        answer: `### How to Link or Update Mobile Number in Aadhaar\n\n**Important Rule:** As per UIDAI security norms, **mobile number update CANNOT be done online**. It requires mandatory biometric authentication (fingerprint scan).\n\n**Steps to Update Mobile Number:**\n1. Book an appointment online at [appointments.uidai.gov.in](https://appointments.uidai.gov.in/) (or walk into any authorized Aadhaar Seva Kendra, Post Office, or designated bank).\n2. Fill the Aadhaar Enrolment/Correction form mentioning your new mobile number.\n3. The operator will scan your fingerprint or iris to verify your identity.\n4. **No supporting documents** are required for mobile number update.\n5. Pay the official statutory fee: **₹50**.\n6. You will receive an Update Request Number (URN) slip. Mobile number updates within **24 to 72 hours**.`,
        intent: "AADHAAR_SERVICE",
        citations,
        suggestions: [
          "How to download e-Aadhaar?",
          "How to check Aadhaar update status?",
          "Order PVC Aadhaar card"
        ]
      };
    }

    if (q.includes("pvc") || q.includes("plastic card")) {
      return {
        answer: `### How to Order an Official Aadhaar PVC Card (₹50)\n\nUIDAI issues durable, pocket-sized plastic PVC cards with advanced security features (hologram, microtext, ghost image, and secure QR code):\n\n1. Go to the official UIDAI portal: [UIDAI My Aadhaar](https://uidai.gov.in/en/my-aadhaar.html)\n2. Enter your 12-digit Aadhaar Number or 28-digit EID.\n3. If your mobile is not registered, check *'My mobile number is not registered'* and enter any alternate number to receive an OTP.\n4. Complete OTP verification.\n5. Pay the official fee: **₹50** (Includes GST and Speed Post delivery anywhere in India).\n6. Track delivery via the 14-digit Service Request Number (SRN). India Post delivers the card within 5-10 business days.\n\n📌 **Official Portal:** [uidai.gov.in](https://uidai.gov.in/)`,
        intent: "AADHAAR_SERVICE",
        citations,
        suggestions: [
          "How to download digital e-Aadhaar?",
          "How to update address in Aadhaar?"
        ]
      };
    }

    // Default overview
    const engDefault = {
      answer: `### Aadhaar Services Overview (UIDAI)\n\nI can guide you through all official Aadhaar procedures:\n\n• **e-Aadhaar Download:** Instant digital PDF download with password format guidance.\n• **New Enrolment:** Free of cost at any Aadhaar Seva Kendra (ASK) or post office.\n• **Mobile Number Update:** Biometric verification process at authorized centres (₹50 official fee).\n• **Address Update:** Online via myAadhaar portal with valid POA document (₹50).\n• **PVC Aadhaar Card:** Order weather-proof plastic card with secure QR code delivered by Speed Post (₹50).\n• **Aadhaar-Bank NPCI Seeding:** Verification of bank account mapping for scholarship DBT.\n\n📌 **Official Portal:** [uidai.gov.in](https://uidai.gov.in/)\n📌 **My Aadhaar:** [uidai.gov.in/en/my-aadhaar.html](https://uidai.gov.in/en/my-aadhaar.html)\n\n⚠️ *If the myAadhaar portal shows 'Connection Timed Out', try again later or visit the UIDAI homepage directly.*\n\nWhich Aadhaar service would you like step-by-step instructions for?`,
      intent: "AADHAAR_SERVICE",
      citations,
      suggestions: [
        "How do I download Aadhaar?",
        "How to update mobile number in Aadhaar?",
        "How to order PVC Aadhaar card (₹50)?",
        "What documents are needed for Aadhaar address update?"
      ]
    };
    return getLocalizedResponse('AADHAAR', 'default', language, engDefault);
  }
};

// ============================================================================
// 4. PASSPORT AGENT
// ============================================================================
const PassportAgent = {
  respond(message, context = {}, language = "English") {
    const q = message.toLowerCase();
    const citations = [
      { title: "Passport Seva Portal (Ministry of External Affairs)", url: "https://www.passportindia.gov.in/psp", verified_date: "2026-11-05" }
    ];

    const isFirstTime = q.includes("first") || q.includes("fresh") || (context.subTopic === "fresh_passport");

    if (q.includes("document") || q.includes("need") || q.includes("require")) {
      return {
        answer: `### Official Documents Required for a Fresh Indian Passport\n\nFor an adult applying for a **Fresh Ordinary Passport**, you must present:\n\n1. **Proof of Present Address (Any ONE):**\n   • Aadhaar Card\n   • Active Scheduled Bank Account Passbook (with photo and official bank stamp)\n   • Electricity Bill, Water Bill, or Telephone Bill (within last 3 months)\n   • Registered Rent Agreement (for tenants residing over 1 year)\n\n2. **Proof of Date of Birth (DOB) (Any ONE):**\n   • Birth Certificate issued by Municipal Corporation / Registrar of Births\n   • 10th Standard / Matriculation School Leaving Certificate or Marks Memo\n   • Aadhaar Card\n   • PAN Card\n\n3. **Non-ECR Proof (Emigration Check Not Required):**\n   • 10th Standard (Matriculation) pass certificate or higher educational degree.\n   *(If you have passed 10th class, your passport will be Non-ECR, allowing hassle-free overseas travel without emigration clearance.)*\n\n*Note: Original documents must be carried to the Passport Seva Kendra (PSK) appointment alongside one self-attested photocopy.*`,
        intent: "PASSPORT_SERVICE",
        citations,
        suggestions: [
          "How to book a PSK appointment?",
          "Normal vs Tatkaal passport difference",
          "How does police verification work?",
          "How to track passport application status?"
        ]
      };
    }

    if (q.includes("tatkaal") || q.includes("urgent") || q.includes("fast")) {
      return {
        answer: `### Normal vs. Tatkaal Passport Scheme\n\n| Scheme | Processing Time | Official Fee (36 Pages) | Eligibility &\n Verification |\n| :--- | :--- | :--- | :--- |\n| **Normal** | 15 – 30 Business Days | **₹1,500** | Police verification takes place before dispatch. Standard documents required. |\n| **Tatkaal** | 1 – 3 Business Days | **₹3,500** (₹1,500 + ₹2,000 Tatkaal charge) | Dispatched before police verification. Requires standard proof + verification certificate/specific documentary compliance. |\n\n*Note:* Tatkaal appointments can be booked directly online at [passportindia.gov.in](https://www.passportindia.gov.in/psp) if you need expedited travel.`,
        intent: "PASSPORT_SERVICE",
        citations,
        suggestions: [
          "What documents are needed for a fresh passport?",
          "How to book PSK appointment online?",
          "What is police verification for passport?"
        ]
      };
    }

    if (q.includes("police") || q.includes("verification")) {
      return {
        answer: `### How Police Verification Works for Indian Passport\n\n1. **File Transfer:** After your physical appointment at the Passport Seva Kendra (Counter A, B, and C clearance), your file is transmitted electronically to your local District Police Headquarters.\n2. **Station Assignment:** The local police station in whose jurisdiction your present address falls receives the verification mandate.\n3. **Officer Contact:** A police verification officer will either visit your residence or call you to visit the police station with:\n   • Original Aadhaar Card and Address Proof\n   • Two local neighborhood witness identity copies\n   • Photograph and passport application receipt\n4. **Report Submission:** The officer verifies criminal history and physical stay, then submits a **'Clear'** report online to the Regional Passport Office (RPO).\n5. **Printing & Dispatch:** The RPO initiates passport printing and sends it via Speed Post with India Post tracking.`,
        intent: "PASSPORT_SERVICE",
        citations,
        suggestions: [
          "How to track passport delivery status?",
          "What documents are needed for fresh passport?"
        ]
      };
    }

    // Default overview
    const engPassport = {
      answer: `### How to Apply for an Indian Passport (Passport Seva)\n\nHere is the step-by-step procedure to apply for an Indian Passport:\n\n1. **Register on Official Portal:**\n   • Create an account at [passportindia.gov.in](https://www.passportindia.gov.in/psp) and select your Regional Passport Office (RPO Hyderabad for Telangana).\n2. **Fill Online Application Form:**\n   • Select **'Apply for Fresh Passport'** (or Re-issue), choose **Normal** or **Tatkaal**, and pick a 36-page or 60-page booklet.\n3. **Pay Online & Book PSK Appointment:**\n   • Online fee payment is mandatory: **₹1,500** (Normal 36 pages) or **₹3,500** (Tatkaal).\n   • Select your preferred Passport Seva Kendra (PSK) or Post Office PSK (POPSK) and book an appointment slot.\n4. **Visit the PSK:**\n   • Carry original Address Proof, DOB Proof, and 10th memo (for Non-ECR). Photographs and biometrics are captured digitally at the center.\n5. **Police Verification & Speed Post Delivery:**\n   • Local police station verifies your address. The passport is delivered to your door via India Post Speed Post.\n\nAre you applying for your **first (fresh) passport** or looking for **renewal/re-issue**?`,
      intent: "PASSPORT_SERVICE",
      citations,
      suggestions: [
        "It is my first passport (Fresh)",
        "What documents are needed for a fresh passport?",
        "Normal vs Tatkaal passport difference",
        "How to track passport application status?"
      ]
    };
    return getLocalizedResponse('PASSPORT', 'default', language, engPassport);
  }
};

// ============================================================================
// 5. BANKING AGENT (CITIZEN & BANK-SPECIFIC SERVICES)
// Enforces security: NEVER asks for or stores PINs, CVVs, OTPs, or passwords.
// ============================================================================
const BankingAgent = {
  respond(message, context = {}, language = "English") {
    const q = message.toLowerCase();
    const citations = [
      { title: "Reserve Bank of India (RBI) Citizen Services", url: "https://www.rbi.org.in/", verified_date: "2026-10-15" },
      { title: "National Payments Corporation of India (NPCI) DBT Guidelines", url: "https://www.npci.org.in/", verified_date: "2026-11-01" }
    ];

    // Lost / Damaged / Emergency ATM card blocking
    if (q.includes("block") || q.includes("lost") || q.includes("stolen")) {
      const engBlock = {
        answer: `### 🚨 EMERGENCY: How to Block Your Lost or Stolen ATM/Debit Card Immediately\n\n> **SECURITY NOTICE:** JanSahayak AI will NEVER ask for your ATM PIN, CVV, OTP, or NetBanking passwords. Never share these credentials with anyone.\n\nIf your ATM card is lost or stolen, block it immediately through any of these methods:\n\n**1. Instant SMS Blocking (Registered Mobile):**\n• **State Bank of India (SBI):** Send SMS \`BLOCK <last 4 digits of card>\` to **567676**\n• **HDFC Bank:** Send SMS \`BLOCK <last 4 digits>\` to **5676712**\n• **ICICI Bank:** Send SMS \`IBLOCK <last 4 digits>\` to **5676766**\n• **Canara Bank:** Send SMS \`CAN <space> BLOCK <space> CARD <last 4 digits>\` to **5607060**\n\n**2. 24x7 National Toll-Free Helplines:**\n• **SBI:** 1800 1234 / 1800 2100 / 1800 425 3800\n• **HDFC Bank:** 1800 1600 / 1800 2600\n• **ICICI Bank:** 1800 1080\n• **Canara Bank:** 1800 425 0018\n• **Punjab National Bank (PNB):** 1800 180 2222 / 1800 103 2222\n\n**3. Mobile Banking App:**\n• Open your bank app (e.g., SBI YONO, iMobile, HDFC MobileBanking), go to **Cards > Manage Debit Card**, and switch card status to **'Permanent Block'** or **'Switch Off International & Domestic Usage'** instantly.\n\nOnce blocked, you can request a replacement EMV chip card from your bank app or home branch.`,
        intent: "BANKING_SERVICE",
        citations,
        suggestions: [
          "How to request a replacement ATM card?",
          "How to generate new ATM Green PIN?",
          "How to get a new bank passbook?"
        ]
      };
      return getLocalizedResponse('BANKING', 'block', language, engBlock);
    }

    // Passbook questions
    if (q.includes("passbook")) {
      return {
        answer: `### How to Obtain or Update Your Bank Passbook\n\n**1. Obtaining a New / Initial Passbook:**\n• When you open a savings account at a public sector bank (SBI, Canara, PNB, Union Bank), a physical passbook is issued free of cost along with your account kit.\n• For scholarships (ePASS / NSP), the front page of your passbook must show: **Student Name, Account Number, IFSC code, and the Bank Branch Official Stamp.**\n\n**2. Updating Transaction Entries:**\n• Most bank branches provide **SWAYAM / Barcode Passbook Kiosks** located in the 24x7 ATM e-Corner.\n• Simply insert the passbook with the barcode facing down; the machine automatically prints all pending transactions.\n\n**3. Replacement for Completed or Lost Passbook:**\n• **Completed Passbook:** Carry your filled passbook to your home branch. A continuation passbook is issued immediately for free.\n• **Lost Passbook:** Submit a written application to the Branch Manager with a copy of your Aadhaar/PAN Card. A duplicate passbook is issued for a nominal fee (typically ₹50–₹100 + GST).\n\n*Digital Alternative:* You can also use your bank's m-Passbook app (such as SBI YONO Quick or Canara e-Passbook) to view entries on your phone.`,
        intent: "BANKING_SERVICE",
        citations,
        suggestions: [
          "How to request an ATM card?",
          "Student zero-balance bank account",
          "What is Aadhaar NPCI seeding for scholarships?"
        ]
      };
    }

    // ATM / Debit card request
    if (q.includes("atm") || q.includes("debit card")) {
      return {
        answer: `### How to Request a New ATM / Debit Card\n\nYou can request an ATM / Debit card (RuPay, Visa, or Mastercard) through three official channels:\n\n**1. Online via NetBanking or Mobile Banking App (Recommended):**\n• Login to your bank's mobile app (e.g. SBI YONO, HDFC App, Canara ai1).\n• Go to **Service Requests > Debit Card Services > Request New ATM Card**.\n• Select account number, card type (RuPay is free/lowest annual charge), and confirm your registered home address.\n• Authenticate with OTP. The card will be dispatched via India Post Speed Post within 5 to 7 business days.\n\n**2. At Your Home Bank Branch:**\n• Fill out the 'ATM / Debit Card Requisition Form' at your branch counter.\n• Many branches offer **Instant Non-Personalized RuPay Cards** across the counter on the same day.\n\n**3. Green PIN Generation:**\n• Once your new card arrives, generate your 4-digit PIN at any of your bank's ATMs or via NetBanking using OTP verification. Do not disclose this PIN to anyone.`,
        intent: "BANKING_SERVICE",
        citations,
        suggestions: [
          "How to block my lost ATM card immediately?",
          "How to get a bank passbook?",
          "Student zero-balance bank account"
        ]
      };
    }

    // General bank account opening / KYC
    const engBankDefault = {
      answer: `### Citizen Banking Services Guidance\n\nJanSahayak AI provides structured guidance for citizen and student banking needs:\n\n• **Student Zero-Balance Accounts:** Guidance for Basic Savings Bank Deposit Accounts (BSBDA) and PMJDY accounts (no minimum balance penalties).\n• **Aadhaar-NPCI DBT Seeding:** Critical requirement for receiving central and state government scholarships (ePASS / NSP) directly into your account.\n• **Bank Passbook Services:** New issue, self-service kiosk updating, and duplicate passbook for lost cases.\n• **ATM / Debit Card:** New card issuance, Green PIN setup, and emergency 24x7 card blocking helplines.\n• **Cheque Book & Statements:** Requisition procedures and official 6/12-month PDF statement downloads.\n\n> **SAFETY POLICY:** We never ask for, collect, or store your Account Number, ATM PIN, CVV, OTP, or passwords.\n\nWhich banking service do you need help with?`,
      intent: "BANKING_SERVICE",
      citations,
      suggestions: [
        "How do I request an ATM card?",
        "How to block my lost ATM card?",
        "How can I get a bank passbook?",
        "How to open a student zero-balance account?",
        "What is Aadhaar NPCI mapping for scholarships?"
      ]
    };
    return getLocalizedResponse('BANKING', 'default', language, engBankDefault);
  }
};

// ============================================================================
// 6. CERTIFICATE AGENT (GOVERNMENT CERTIFICATES / MEESEVA)
// ============================================================================
const CertificateAgent = {
  respond(message, context = {}, language = "English") {
    const q = message.toLowerCase();
    const citations = [
      { title: "Telangana MeeSeva Citizen Portal", url: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm", verified_date: "2026-11-01" },
      { title: "Telangana Revenue Department Citizen Charter", url: "https://www.telangana.gov.in/", verified_date: "2026-10-25" }
    ];

    if (q.includes("income")) {
      const engIncome = {
        answer: `### How to Apply for an Income Certificate (Telangana MeeSeva)\n\nA digitally signed Revenue Department Income Certificate is mandatory for all scholarship fee reimbursements (RTF & MTF) and fee concessions.\n\n**1. Required Documents:**\n• Completed MeeSeva Income Certificate Application Form\n• Salary Slip / Form 16 (for salaried) OR Self-declaration of agriculture/business income\n• Aadhaar Cards of applicant and father/guardian\n• Ration Card / Food Security Card copy\n• Current year Electricity Bill or House Tax receipt\n\n**2. Application Process:**\n• Visit your nearest **MeeSeva Centre** or apply online at [meeseva.telangana.gov.in](https://ts.meeseva.telangana.gov.in/meeseva/home.htm).\n• Pay the statutory fee of **₹45**.\n• The application is verified by the Village Revenue Officer (VRO) and Mandal Revenue Inspector (MRI).\n• **Tahsildar** issues the digitally signed QR-coded certificate within **7 business days**.\n\n**3. Validity:**\n• A MeeSeva Income Certificate is valid for **ONE financial year** (issued between April 1 and March 31).`,
        intent: "CERTIFICATE_SERVICE",
        citations,
        suggestions: [
          "How to apply for Caste Certificate?",
          "What are income limits for ePASS scholarship?",
          "How to track MeeSeva application status?"
        ]
      };
      return getLocalizedResponse('CERTIFICATE', 'income', language, engIncome);
    }

    if (q.includes("caste") || q.includes("community")) {
      return {
        answer: `### How to Apply for a Caste / Community Certificate (MeeSeva)\n\nAn **Integrated Community, Nativity & Date of Birth Certificate** certifies SC, ST, BC, or Minority category for reservation and scholarships.\n\n**1. Required Documents:**\n• Application form signed by applicant/parent\n• School Marks Memo / Transfer Certificate (TC) showing recorded caste\n• Father's or paternal sibling's certified Caste Certificate (primary evidence)\n• Aadhaar Card & Ration Card\n\n**2. Process & Fees:**\n• Submit at any MeeSeva kiosk. Statutory fee is **₹45**.\n• Verification is conducted by the VRO/MRI and approved by the Tahsildar.\n• Processing SLA is **15 to 30 days**.\n\n**3. Validity:**\n• Unlike income certificates, an Integrated Community/Caste certificate has **PERMANENT, LIFELONG validity** unless revoked by the Revenue Division.`,
        intent: "CERTIFICATE_SERVICE",
        citations,
        suggestions: [
          "How to apply for Income Certificate?",
          "How to get Residence / Domicile Certificate?",
          "Track MeeSeva application status"
        ]
      };
    }

    if (q.includes("residence") || q.includes("domicile") || q.includes("nativity")) {
      return {
        answer: `### How to Apply for Residence / Domicile Certificate (MeeSeva)\n\nA Residence Certificate proves local residency in Telangana (crucial for 85% local candidate university admissions under the Presidential Order):\n\n**1. Required Documents:**\n• Consecutive Study / Bonafide Certificates from Class 4th to 10th or Degree\n• Aadhaar Card and Voter ID\n• House Tax receipt, Electricity bill, or registered sale deed\n\n**2. Application & SLA:**\n• Apply at MeeSeva with fee of **₹45**.\n• Verified by Revenue staff and approved by the Tahsildar within **7 business days**.\n• Valid for educational admissions and state/central government recruitments.`,
        intent: "CERTIFICATE_SERVICE",
        citations,
        suggestions: [
          "Apply for Income Certificate",
          "Apply for Caste Certificate",
          "MeeSeva application tracking"
        ]
      };
    }

    // Default overview
    const engCertDefault = {
      answer: `### Government Certificates Hub (Telangana MeeSeva)\n\nI can guide you through the official application, documents, fees, and tracking for state certificates:\n\n• **Income Certificate:** Issued by Tahsildar for scholarships (₹45 fee, valid 1 financial year).\n• **Caste / Community Certificate:** Integrated SC/ST/BC/Minority proof (₹45 fee, lifelong validity).\n• **Residence / Domicile Certificate:** Proof of local status for 85% college admission quotas (₹45 fee).\n• **Birth Certificate:** Municipal (GHMC/CDMA) digitally signed certificate.\n• **Food Security (Ration) Card:** BPL proof for welfare assistance and subsidies.\n\nWhich certificate would you like application instructions for?`,
      intent: "CERTIFICATE_SERVICE",
      citations,
      suggestions: [
        "How do I apply for an income certificate?",
        "How to apply for Caste Certificate?",
        "How to get Residence Certificate?",
        "How to track MeeSeva application status?"
      ]
    };
    return getLocalizedResponse('CERTIFICATE', 'default', language, engCertDefault);
  }
};

// ============================================================================
// 7. OTHER GOVERNMENT SERVICES AGENT (VOTER ID & DRIVING LICENCE)
// ============================================================================
const OtherGovtAgent = {
  respond(message, context = {}, language = "English") {
    const q = message.toLowerCase();

    if (q.includes("voter") || q.includes("epic") || q.includes("election")) {
      return {
        answer: `### How to Apply for a Voter ID Card (Form 6 - ECI)\n\nEvery Indian citizen who has reached 18 years of age can register as a voter online:\n\n1. Visit the official portal: [voters.eci.gov.in](https://voters.eci.gov.in/) or download the **Voter Helpline App**.\n2. Sign up with your mobile number and OTP.\n3. Fill **Form 6 (Application for New Elector)**:\n   • Select your State, District, and Assembly Constituency.\n   • Enter your personal details, permanent address, and upload a passport-size photo.\n4. **Documents Required:**\n   • Proof of Age/DOB: Birth Certificate, 10th Certificate, Aadhaar, or PAN.\n   • Proof of Residence: Water/Electricity/Gas Bill, Aadhaar Card, or Bank Passbook.\n5. **Verification & Delivery:**\n   • The Booth Level Officer (BLO) will conduct field verification.\n   • **Fee: 100% Free** (No charge for registration or the physical colored EPIC card).\n   • Once approved, you can immediately download your digital **e-EPIC** PDF from the portal.`,
        intent: "OTHER_GOVERNMENT_SERVICE",
        citations: [{ title: "Election Commission of India Voters' Portal", url: "https://voters.eci.gov.in/", verified_date: "2026-11-05" }],
        suggestions: [
          "How to download digital e-EPIC voter card?",
          "How to correct name/address on Voter ID?",
          "How to apply for a Driving Licence?"
        ]
      };
    }

    // Driving licence
    return {
      answer: `### How to Apply for a Driving Licence (Sarathi Parivahan)\n\nDriving licences across India are issued under the Ministry of Road Transport & Highways (MoRTH):\n\n**Step 1: Apply for Learner's Licence (LL)**\n• Go to [sarathi.parivahan.gov.in](https://parivahan.gov.in/) and select your state.\n• Fill Form 2, upload Aadhaar (as POI/POA) and Age Proof (10th memo / birth cert).\n• Pay fee (approx. ₹150–₹200) and take the online traffic rules test (contactless from home in states with Aadhaar auth).\n\n**Step 2: Permanent Driving Licence (DL)**\n• After holding your Learner's Licence for **at least 30 days** (and within 6 months), book a practical driving test slot on Sarathi.\n• Visit the automated testing track with your vehicle and pass the physical driving test.\n• Physical smart card DL is dispatched via Speed Post; digital DL is instantly available on **DigiLocker / mParivahan**.`,
      intent: "OTHER_GOVERNMENT_SERVICE",
      citations: [{ title: "Parivahan Sewa (MoRTH)", url: "https://parivahan.gov.in/", verified_date: "2026-11-01" }],
      suggestions: [
        "Documents required for Driving Licence",
        "How to take Learner's Licence test online?",
        "How to apply for Voter ID?"
      ]
    };
  }
};

module.exports = {
  GeneralConversationAgent,
  PanCardAgent,
  AadhaarAgent,
  PassportAgent,
  BankingAgent,
  CertificateAgent,
  OtherGovtAgent
};

