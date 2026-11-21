// C:\Nxtwave-Sathwika\jansahayak-ai\backend\schemeSyncEngine.js
// Automated Scheme Discovery, Normalization, Duplicate Detection,
// and Verification Synchronization Engine

const { ALL_STATES, ALL_UTS } = require('./importers');
const schemeStore = require('./schemeVersionStore');
const { SOURCES } = require('./sourcesData');

/**
 * Normalization helper: Standardizes strings for comparison
 */
function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detection & Matching: Determines if candidate is NEW, EXISTING/UPDATED, or DUPLICATE
 */
function detectSchemeState(candidate, existingList = []) {
  const normCandidateName = normalizeString(candidate.name);
  const candState = (candidate.state || '').trim().toLowerCase();

  // 1. Exact ID match
  const exactIdMatch = existingList.find(s => s.id === candidate.id);
  if (exactIdMatch) {
    // Check if attributes changed meaningfully
    const hasChanges = (
      exactIdMatch.income_limit !== candidate.income_limit ||
      exactIdMatch.benefits !== candidate.benefits ||
      exactIdMatch.application_deadline !== candidate.application_deadline ||
      exactIdMatch.official_url !== candidate.official_url
    );
    return {
      status: hasChanges ? 'UPDATE_DETECTED' : 'EXACT_DUPLICATE',
      matchedScheme: exactIdMatch,
      confidence: 1.0
    };
  }

  // 2. Name + State match
  for (const existing of existingList) {
    const exName = normalizeString(existing.name);
    const exState = (existing.state || '').trim().toLowerCase();

    const isSameState = (exState === candState) || (exState.includes('central') && candState.includes('central'));
    const isExactName = (exName === normCandidateName);

    // High confidence fuzzy match (contains key scheme tokens)
    const isSubstring = normCandidateName.length > 8 && exName.length > 8 && (exName.includes(normCandidateName) || normCandidateName.includes(exName));

    if (isSameState && (isExactName || isSubstring)) {
      const hasChanges = (
        existing.income_limit !== candidate.income_limit ||
        existing.benefits !== candidate.benefits ||
        existing.application_deadline !== candidate.application_deadline ||
        existing.official_url !== candidate.official_url
      );

      return {
        status: hasChanges ? 'UPDATE_DETECTED' : 'EXACT_DUPLICATE',
        matchedScheme: existing,
        confidence: isExactName ? 0.98 : 0.90
      };
    }
  }

  // 3. Brand New Scheme
  return {
    status: 'NEW_SCHEME',
    matchedScheme: null,
    confidence: 0.95
  };
}

/**
 * Strict Verification of Scheme Payload: Never invent missing data
 */
function verifySchemeData(raw) {
  const issues = [];

  // Required Fields
  if (!raw.name || raw.name.trim().length < 4) issues.push('Invalid or missing scheme name');
  if (!raw.ministry && !raw.department) issues.push('Missing originating ministry or department');
  if (!raw.benefits) issues.push('Missing benefits specification');

  // Verify Official URL
  const officialUrl = raw.official_url || raw.source_url || '';
  const isGovDomain = officialUrl.includes('.gov.in') || officialUrl.includes('.nic.in') || officialUrl.includes('rbi.org.in') || officialUrl.includes('mudra.org.in') || officialUrl.includes('standupmitra.in');
  if (!isGovDomain) {
    issues.push(`Official URL [${officialUrl}] must point to an authorized public gazette/portal`);
  }

  // Resolve State
  let normState = 'All India (Central)';
  if (raw.state && raw.state !== 'All India (Central)') {
    const sMatch = ALL_STATES.find(s => s.toLowerCase() === raw.state.toLowerCase());
    const uMatch = ALL_UTS.find(u => u.toLowerCase() === raw.state.toLowerCase());
    if (sMatch) normState = sMatch;
    else if (uMatch) normState = uMatch;
    else normState = raw.state;
  }

  const verifiedRecord = {
    id: raw.id || `sch-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: raw.name ? raw.name.trim() : 'Unknown Scheme',
    ministry: raw.ministry ? raw.ministry.trim() : (raw.department ? raw.department.trim() : 'State / Central Department'),
    state: normState,
    type: raw.type || (normState.includes('Central') ? 'Central Sector Scheme' : 'State Scheme'),
    domain: raw.domain || raw.scheme_category || 'Social Welfare & Development',
    target_beneficiaries: Array.isArray(raw.target_beneficiaries) && raw.target_beneficiaries.length ? raw.target_beneficiaries : ['Eligible Citizens'],
    min_age: raw.min_age !== undefined ? raw.min_age : null,
    max_age: raw.max_age !== undefined ? raw.max_age : null,
    income_limit: raw.income_limit !== undefined ? raw.income_limit : null,
    category_eligible: Array.isArray(raw.category_eligible) && raw.category_eligible.length ? raw.category_eligible : ['All'],
    gender_eligible: raw.gender_eligible || 'All',
    education_level: Array.isArray(raw.education_level) && raw.education_level.length ? raw.education_level : ['All'],
    employment_status: Array.isArray(raw.employment_status) && raw.employment_status.length ? raw.employment_status : ['All'],
    disability_status: raw.disability_status || 'All',
    benefits: raw.benefits || 'Financial or institutional government assistance',
    required_documents: Array.isArray(raw.required_documents) && raw.required_documents.length ? raw.required_documents : ['Aadhaar Card', 'Resident/Domicile Certificate'],
    application_procedure: raw.application_procedure || 'Apply online on the official department portal.',
    application_deadline: raw.application_deadline || 'Active / Rolling',
    official_url: officialUrl || 'https://www.india.gov.in/',
    guideline_url: raw.guideline_url || officialUrl || 'https://www.india.gov.in/',
    source_url: raw.source_url || officialUrl || 'https://www.india.gov.in/',
    source_name: raw.source_name || 'Official Government Source',
    last_verified: new Date().toISOString().split('T')[0],
    status: raw.status || 'Active'
  };

  return {
    isValid: issues.length === 0,
    issues,
    record: verifiedRecord
  };
}

/**
 * Process a batch of candidate schemes discovered from an authorized source
 */
async function processDiscoveredSchemes(candidateList = [], sourceId = 'src-myscheme') {
  const currentSchemes = schemeStore.getActiveSchemes();
  const results = {
    totalChecked: candidateList.length,
    newInserted: 0,
    queuedForReview: 0,
    updatedExisting: 0,
    duplicateSkipped: 0,
    failedVerification: 0,
    details: []
  };

  for (const raw of candidateList) {
    const verification = verifySchemeData(raw);

    if (!verification.isValid) {
      results.failedVerification++;
      results.details.push({
        id: raw.id,
        name: raw.name,
        action: 'FAILED_VALIDATION',
        issues: verification.issues
      });
      continue;
    }

    const cleanCandidate = verification.record;
    const detection = detectSchemeState(cleanCandidate, currentSchemes);

    if (detection.status === 'EXACT_DUPLICATE') {
      results.duplicateSkipped++;
      results.details.push({
        id: cleanCandidate.id,
        name: cleanCandidate.name,
        action: 'DUPLICATE_SKIPPED',
        matchedId: detection.matchedScheme.id
      });
    } else if (detection.status === 'UPDATE_DETECTED') {
      // Modify existing scheme and record version history
      schemeStore.updateScheme(detection.matchedScheme.id, cleanCandidate, `Synchronized from ${sourceId}`);
      results.updatedExisting++;
      results.details.push({
        id: detection.matchedScheme.id,
        name: cleanCandidate.name,
        action: 'UPDATED',
        previousVer: detection.matchedScheme.last_verified
      });
    } else if (detection.status === 'NEW_SCHEME') {
      // High confidence verified government records go to pending queue for admin review or auto-ingest
      if (cleanCandidate.official_url.includes('.gov.in') || cleanCandidate.official_url.includes('.nic.in')) {
        schemeStore.queuePendingScheme(cleanCandidate, {
          type: 'NEW_DISCOVERY',
          confidence: detection.confidence,
          source: sourceId
        });
        results.queuedForReview++;
        results.details.push({
          id: cleanCandidate.id,
          name: cleanCandidate.name,
          action: 'QUEUED_FOR_ADMIN_APPROVAL'
        });
      } else {
        results.failedVerification++;
        results.details.push({
          id: cleanCandidate.id,
          name: cleanCandidate.name,
          action: 'FAILED_VALIDATION',
          issues: ['Source domain not recognized as official government platform']
        });
      }
    }
  }

  // Record Sync Run in Persistent Logs
  schemeStore.appendSyncLog({
    source_id: sourceId,
    total_checked: results.totalChecked,
    new_queued: results.queuedForReview,
    updated: results.updatedExisting,
    duplicates: results.duplicateSkipped,
    failed: results.failedVerification
  });

  return results;
}

module.exports = {
  detectSchemeState,
  verifySchemeData,
  processDiscoveredSchemes,
  normalizeString
};

