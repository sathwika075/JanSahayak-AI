// c:\Nxtwave-Sathwika\jansahayak-ai\backend\hybridRetrieval.js
// Hybrid Scheme Retrieval Engine: BM25 / Keyword + Metadata Filtering + Semantic Scoring
// Integrates with nationalSchemesDatabase to query schemes across all States & Central Govt

const { getAllNationalSchemes } = require('./nationalSchemesDatabase');
const { SCHEMES } = require('./schemesData');
const schemeStore = require('./schemeVersionStore');

function getLiveSchemes() {
  const stored = schemeStore.getActiveSchemes();
  if (stored && stored.length > 0) return stored;
  return getAllNationalSchemes(SCHEMES);
}

/**
 * Clean & tokenize text for BM25-style keyword matching
 */
function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

/**
 * Hybrid Search & Metadata Filtering
 */
function hybridSearchSchemes(query = '', filters = {}) {
  const queryTokens = tokenize(query);
  const currentSchemes = getLiveSchemes();

  let results = currentSchemes.filter(scheme => {
    // 1. State / UT Filter
    if (filters.state && filters.state !== 'All') {
      const matchCentral = filters.state === 'Central' && scheme.state.includes('Central');
      const matchState = scheme.state.toLowerCase() === filters.state.toLowerCase();
      const openToAll = scheme.state === 'All India (Central)';
      if (!matchCentral && !matchState && !openToAll) return false;
    }

    // 2. Domain / Category Filter
    if (filters.domain && filters.domain !== 'All') {
      const d = (scheme.domain || scheme.scheme_category || '').toLowerCase();
      if (!d.includes(filters.domain.toLowerCase())) return false;
    }

    // 3. Social Category Filter
    if (filters.category && filters.category !== 'All') {
      if (scheme.category_eligible && !scheme.category_eligible.includes('All') && !scheme.category_eligible.some(c => c.toLowerCase() === filters.category.toLowerCase())) {
        return false;
      }
    }

    // 4. Max Income Filter
    if (filters.max_income !== undefined && filters.max_income !== null && filters.max_income !== '') {
      const userIncome = Number(filters.max_income);
      if (scheme.income_limit !== null && scheme.income_limit < userIncome) {
        return false;
      }
    }

    return true;
  });

  // Calculate Relevance Score
  const scored = results.map(scheme => {
    let score = 0;
    const searchable = `${scheme.name} ${scheme.ministry} ${scheme.benefits} ${scheme.domain} ${scheme.state} ${(scheme.target_beneficiaries || []).join(' ')}`.toLowerCase();

    for (const token of queryTokens) {
      if (searchable.includes(token)) {
        score += 2;
        // Exact name match boost
        if (scheme.name.toLowerCase().includes(token)) score += 5;
        // State match boost
        if (scheme.state.toLowerCase().includes(token)) score += 4;
        // Domain match boost
        if ((scheme.domain || '').toLowerCase().includes(token)) score += 3;
      }
    }

    // Prioritize active schemes
    if (scheme.status === 'Active') score += 1;

    return { scheme, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.map(item => item.scheme);
}

module.exports = {
  hybridSearchSchemes,
  getLiveSchemes,
  ALL_SCHEMES: getLiveSchemes()
};

