// backend/apis/opendata.js
// OpenData (generic government open data portal) wrapper
// Expected .env variables:
//   OPENDATA_BASE_URL – base URL of the open data service
//   OPENDATA_API_KEY (optional) – API key if the portal requires authentication

const { get, post } = require('../apiClient');
require('dotenv').config();

function _missingCreds() {
  const missing = [];
  if (!process.env.OPENDATA_BASE_URL) missing.push('OPENDATA_BASE_URL');
  // API key is optional – some portals are public
  return missing;
}

function _authHeaders() {
  if (process.env.OPENDATA_API_KEY) {
    return { 'Authorization': `Bearer ${process.env.OPENDATA_API_KEY}` };
  }
  return {};
}

/** Generic search endpoint – accepts query parameters object */
async function search(params = {}) {
  const missing = _missingCreds();
  if (missing.length) throw new Error(`Missing OpenData credentials: ${missing.join(', ')}`);
  const query = new URLSearchParams(params).toString();
  const url = `${process.env.OPENDATA_BASE_URL.replace(/\/*$/, '')}/search?${query}`;
  return get(url, { headers: _authHeaders() });
}

/** Retrieve a specific dataset by its identifier */
async function getDataset(datasetId) {
  const missing = _missingCreds();
  if (missing.length) throw new Error(`Missing OpenData credentials: ${missing.join(', ')}`);
  const url = `${process.env.OPENDATA_BASE_URL.replace(/\/*$/, '')}/datasets/${encodeURIComponent(datasetId)}`;
  return get(url, { headers: _authHeaders() });
}

module.exports = {
  search,
  getDataset,
};

