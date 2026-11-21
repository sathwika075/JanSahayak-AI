// C:\\Nxtwave-Sathwika\\jansahayak-ai\\backend\\api_chat_handler.js
// Handles POST /api/ai/chat – delegates to the LangGraph orchestrator.

const { orchestrate } = require('./langgraph_workflow');

/**
 * Express‑style handler (but server.js uses a custom http server).
 * It receives the request body already parsed via parseBody and returns JSON.
 */
async function handleChat(req, res, body) {
  const { message, language = 'English' } = body;
  if (!message) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Message is required' }));
  }

  // Determine profile – try auth token, fallback to guest profile.
  const authHeader = req.headers['authorization'];
  let profile = {};
  // Simple token decode (same logic as server.js verifyToken).
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const raw = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf8');
      const token = JSON.parse(raw);
      // The token payload includes id; fetch profile from server's in‑memory store via require.
      const { studentProfiles } = require('./server'); // circular? We'll require via path.
      profile = studentProfiles[token.id] || {};
    } catch (e) { /* ignore – use empty profile */ }
  }

  try {
    const result = await orchestrate(message, profile, language);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (err) {
    console.error('Chat orchestration error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
  }
}

module.exports = { handleChat };

