// backend/apis/nsp.js
// NSP (National Scholarship Portal) API wrapper
// Expected .env variables:
//   NSP_BASE_URL – base URL of the NSP service
//   NSP_CLIENT_ID – OAuth client ID (optional if using API key)
//   NSP_CLIENT_SECRET – OAuth client secret (optional)
//   NSP_API_KEY – API key (fallback if OAuth not used)

const { get, post } = require('../apiClient');
require('dotenv').config();

function _missingCreds() {
  const missing = [];
  if (!process.env.NSP_BASE_URL) missing.push('NSP_BASE_URL');
  // At least one auth method must be present
  if (!process.env.NSP_API_KEY && !(process.env.NSP_CLIENT_ID && process.env.NSP_CLIENT_SECRET)) {
    missing.push('NSP_API_KEY or (NSP_CLIENT_ID & NSP_CLIENT_SECRET)');
  }
  return missing;
}

function _authHeaders() {
  if (process.env.NSP_API_KEY) {
    return { 'Authorization': `Bearer ${process.env.NSP_API_KEY}` };
  }
  // Placeholder for OAuth – in real implementation you would obtain a token first.
  // Here we just return empty headers; the user can replace with proper logic.
  return {};
}

/** List all scholarship schemes */
async function listSchemes() {
  const missing = _missingCreds();
  if (missing.length) throw new Error(`Missing NSP credentials: ${missing.join(', ')}`);
  const url = `${process.env.NSP_BASE_URL.replace(/\/*$/, '')}/schemes`;
  return get(url, { headers: _authHeaders() });
}

/** Get details of a scheme */
async function getScheme(schemeId) {
  const missing = _missingCreds();
  if (missing.length) throw new Error(`Missing NSP credentials: ${missing.join(', ')}`);
  const url = `${process.env.NSP_BASE_URL.replace(/\/*$/, '')}/schemes/${encodeURIComponent(schemeId)}`;
  return get(url, { headers: _authHeaders() });
}

/** Check eligibility for a profile */
async function checkEligibility(profile, schemeId) {
  const missing = _missingCreds();
  if (missing.length) throw new Error(`Missing NSP credentials: ${missing.join(', ')}`);
  const url = `${process.env.NSP_BASE_URL.replace(/\/*$/, '')}/schemes/${encodeURIComponent(schemeId)}/eligibility`;
  return post(url, { profile }, { headers: _authHeaders() });
}

module.exports = {
  listSchemes,
  getScheme,
  checkEligibility,
};

