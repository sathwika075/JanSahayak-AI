// C:\Nxtwave-Sathwika\jansahayak-ai\backend\aiOrchestrator.js
// JanSahayak AI - AI Orchestrator Module
// Routes chat requests through the LangGraph StateGraph engine

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const { orchestrate, classifySemanticFallback } = require('./langgraph_workflow');
const conversationStore = require('./conversationStore');

async function classifyIntent(query, history = [], context = {}) {
  return classifySemanticFallback(query, context);
}

async function processChatRequest({ message, profile = {}, language = 'English', userId = 'usr-student-1' }) {
  return await orchestrate(message, profile, language, userId);
}

module.exports = {
  classifyIntent,
  processChatRequest
};
