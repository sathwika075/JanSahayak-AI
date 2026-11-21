// C:\Nxtwave-Sathwika\jansahayak-ai\backend\conversationStore.js
// In-Memory Multi-User Conversation Context & History Store

// Map of userId/sessionId -> Array of { role: 'user' | 'assistant', content: string, intent: string, timestamp: string }
const conversationHistories = new Map();

// Map of userId/sessionId -> { activeIntent, activeService, subTopic, lastUpdated }
const conversationContexts = new Map();

/**
 * Get or create history array for a user/session.
 */
function getHistory(userId = 'guest-session') {
  if (!conversationHistories.has(userId)) {
    conversationHistories.set(userId, []);
  }
  return conversationHistories.get(userId);
}

/**
 * Add a message to user's conversation history.
 */
function appendMessage(userId = 'guest-session', role, content, metadata = {}) {
  const history = getHistory(userId);
  const entry = {
    role,
    content,
    intent: metadata.intent || null,
    serviceId: metadata.serviceId || null,
    timestamp: new Date().toISOString()
  };
  history.push(entry);

  // Keep last 30 messages to manage memory
  if (history.length > 30) {
    history.shift();
  }

  // Update conversation context if assistant message or classified user message
  if (metadata.intent && metadata.intent !== 'GREETING' && metadata.intent !== 'GENERAL_CONVERSATION') {
    const currentContext = conversationContexts.get(userId) || {};
    conversationContexts.set(userId, {
      ...currentContext,
      activeIntent: metadata.intent,
      activeService: metadata.serviceId || currentContext.activeService,
      subTopic: metadata.subTopic || currentContext.subTopic,
      lastUpdated: Date.now()
    });
  }

  return entry;
}

/**
 * Get the current context for a user.
 */
function getContext(userId = 'guest-session') {
  return conversationContexts.get(userId) || {
    activeIntent: null,
    activeService: null,
    subTopic: null,
    lastUpdated: null
  };
}

/**
 * Update the user's active context directly.
 */
function updateContext(userId = 'guest-session', updates = {}) {
  const current = getContext(userId);
  const next = { ...current, ...updates, lastUpdated: Date.now() };
  conversationContexts.set(userId, next);
  return next;
}

/**
 * Clear history and context for a user.
 */
function clearHistory(userId = 'guest-session') {
  conversationHistories.set(userId, []);
  conversationContexts.delete(userId);
  return { message: 'Conversation history cleared successfully' };
}

module.exports = {
  getHistory,
  appendMessage,
  getContext,
  updateContext,
  clearHistory
};

