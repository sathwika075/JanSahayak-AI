// c:\Nxtwave-Sathwika\jansahayak-ai\backend\aiProvider.js
// Dual-Provider AI Gateway: Primary = Google Gemini, Fallback = Groq API, Tertiary = Deterministic NLU
// Strictly reads API keys from process.env with zero hardcoding and zero key leakage

const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Perform native HTTPS POST to Groq's OpenAI-compatible Chat Completions API
 * Eliminates external dependency issues while ensuring low-latency fallback
 */
function callGroqApi(messages, options = {}) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GROQ_KEY') {
      return reject(new Error('GROQ_API_KEY not configured in environment'));
    }

    const payload = JSON.stringify({
      model: options.model || 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: options.temperature !== undefined ? options.temperature : 0.2,
      max_tokens: options.max_tokens || 1024
    });

    const reqOptions = {
      hostname: 'api.groq.com',
      port: 443,
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 10000
    };

    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const content = parsed.choices?.[0]?.message?.content || '';
            resolve({ text: content, provider: 'Groq', model: reqOptions.model });
          } else {
            reject(new Error(`Groq API returned HTTP ${res.statusCode}: ${parsed.error?.message || body}`));
          }
        } catch (err) {
          reject(new Error(`Groq JSON parse error: ${err.message}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Groq API request timed out (10s)'));
    });

    req.on('error', (err) => {
      reject(new Error(`Groq network error: ${err.message}`));
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Call Gemini API using @google/generative-ai
 */
async function callGeminiApi(prompt, systemInstruction = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_KEY') {
    throw new Error('GEMINI_API_KEY not configured in environment');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemInstruction || undefined
  });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API call timed out (8s)')), 8000)
  );

  const res = await Promise.race([model.generateContent(prompt), timeoutPromise]);
  const text = res.response.text();
  return { text, provider: 'Gemini', model: 'gemini-1.5-flash' };
}

/**
 * Unified Multi-Provider Generator with Automatic Cascade
 * 1. Primary: Gemini API
 * 2. Secondary: Groq API
 * 3. Tertiary: Returns null, allowing the caller to use deterministic local NLU
 */
async function generateAIResponse({ prompt, systemInstruction = '', conversationHistory = [], language = 'English' }) {
  let geminiError = null;
  let groqError = null;

  // 1. Try Primary: Gemini
  try {
    const fullPrompt = systemInstruction ? `${systemInstruction}\n\nLanguage to respond in: ${language}\n\n${prompt}` : prompt;
    const geminiRes = await callGeminiApi(fullPrompt, systemInstruction);
    return {
      success: true,
      text: geminiRes.text,
      provider: 'Gemini',
      model: geminiRes.model
    };
  } catch (err) {
    geminiError = err.message;
    console.warn(`[AIGateway] Primary (Gemini) failed: ${err.message}. Switching to Fallback (Groq)...`);
  }

  // 2. Try Fallback: Groq
  try {
    const messages = [];
    if (systemInstruction) {
      messages.push({
        role: 'system',
        content: `${systemInstruction}\nStrict response language: ${language}. Ground your response strictly in factual government sources.`
      });
    }
    // Append conversation history
    for (const msg of conversationHistory.slice(-4)) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    }
    messages.push({ role: 'user', content: prompt });

    const groqRes = await callGroqApi(messages);
    return {
      success: true,
      text: groqRes.text,
      provider: 'Groq',
      model: 'llama-3.3-70b-versatile'
    };
  } catch (err) {
    groqError = err.message;
    console.warn(`[AIGateway] Secondary (Groq) failed: ${err.message}.`);
  }

  // 3. Fallback indication for deterministic agent execution
  return {
    success: false,
    text: null,
    provider: 'LocalDeterministicEngine',
    errors: { gemini: geminiError, groq: groqError }
  };
}

module.exports = {
  generateAIResponse,
  callGeminiApi,
  callGroqApi
};

