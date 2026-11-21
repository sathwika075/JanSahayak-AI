// backend/apis/epass.js
// ePASS government scheme API wrapper
// Expected .env variables:
//   EPASS_BASE_URL – base URL of the ePASS service
//   EPASS_API_KEY  – API key / token for authentication

const { get, post } = require('../apiClient');
require('dotenv').config();

function _missingCreds() {
  const missing = [];
  if (!process.env.EPASS_BASE_URL) missing.push('EPASS_BASE_URL');
  if (!process.env.EPASS_API_KEY) missing.push('EPASS_API_KEY');
  return missing;
}

function _authHeaders() {
  return {
    'Authorization': `Bearer ${process.env.EPASS_API_KEY}`,
  };
}

/** List available schemes */
async function listSchemes() {
  const missing = _missingCreds();
  if (missing.length) {
    throw new Error(`Missing ePASS credentials: ${missing.join(', ')}`);
  }
  const url = `${process.env.EPASS_BASE_URL.replace(/\/*$/, '')}/schemes`;
  return get(url, { headers: _authHeaders() });
}

/** Get details of a specific scheme by its ID */
async function getScheme(schemeId) {
  const missing = _missingCreds();
  if (missing.length) {
    throw new Error(`Missing ePASS credentials: ${missing.join(', ')}`);
  }
  const url = `${process.env.EPASS_BASE_URL.replace(/\/*$/, '')}/schemes/${encodeURIComponent(schemeId)}`;
  return get(url, { headers: _authHeaders() });
}

/** Check eligibility for a student profile against a scheme */
async function checkEligibility(profile, schemeId) {
  const missing = _missingCreds();
  if (missing.length) {
    throw new Error(`Missing ePASS credentials: ${missing.join(', ')}`);
  }
  const url = `${process.env.EPASS_BASE_URL.replace(/\/*$/, '')}/schemes/${encodeURIComponent(schemeId)}/eligibility`;
  return post(url, { profile }, { headers: _authHeaders() });
}

module.exports = {
  listSchemes,
  getScheme,
  checkEligibility,
};

