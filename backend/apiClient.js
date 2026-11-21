// backend/apiClient.js
// Generic HTTP client wrapper used by government API modules.
// It relies on `node-fetch` (or the native fetch in newer Node versions) and `dotenv` for env vars.
// The code is written to be functional after the user runs `npm install` in an internet‑enabled environment.

require('dotenv').config(); // Load .env variables into process.env

const fetch = require('node-fetch'); // npm package declared in package.json

/**
 * Helper to delay execution (used for exponential back‑off).
 * @param {number} ms Milliseconds to wait.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Core request function.
 * @param {Object} options
 * @param {string} options.url Full URL (including query string).
 * @param {string} [options.method='GET'] HTTP method.
 * @param {Object} [options.headers={}] Additional headers.
 * @param {any} [options.body] Body payload – will be JSON‑stringified if an object.
 * @param {number} [options.timeout=10000] Timeout in ms.
 * @param {number} [options.retries=2] Number of retry attempts on network errors / 5xx.
 * @returns {Promise<any>} Parsed JSON response (or raw text for non‑JSON).
 */
async function request({
  url,
  method = 'GET',
  headers = {},
  body = undefined,
  timeout = 10000,
  retries = 2,
}) {
  const finalHeaders = {
    'Accept': 'application/json',
    ...headers,
  };

  let payload;
  if (body !== undefined) {
    if (typeof body === 'object' && !(body instanceof Buffer)) {
      finalHeaders['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    } else {
      payload = body;
    }
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        method,
        headers: finalHeaders,
        body: payload,
        signal: controller.signal,
      });
      clearTimeout(id);

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const err = new Error(`HTTP ${response.status}: ${response.statusText}`);
        err.status = response.status;
        err.data = data;
        throw err;
      }
      return data;
    } catch (err) {
      clearTimeout(id);
      // AbortError when timeout occurs
      const isTimeout = err.name === 'AbortError';
      const shouldRetry = attempt < retries && (isTimeout || (err.status && err.status >= 500));
      if (shouldRetry) {
        const backoff = 500 * Math.pow(2, attempt); // 0.5s, 1s, 2s ...
        await sleep(backoff);
        continue; // retry loop
      }
      // No more retries – rethrow
      throw err;
    }
  }
}

/** Shortcut for GET requests */
async function get(url, opts = {}) {
  return request({ url, method: 'GET', ...opts });
}
/** Shortcut for POST requests */
async function post(url, body, opts = {}) {
  return request({ url, method: 'POST', body, ...opts });
}

module.exports = {
  request,
  get,
  post,
};

