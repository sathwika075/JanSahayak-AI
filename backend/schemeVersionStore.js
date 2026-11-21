// C:\Nxtwave-Sathwika\jansahayak-ai\backend\schemeVersionStore.js
// Persistent Storage Engine for Verified Schemes, Version History, Discontinued Schemes,
// and Pending Queue awaiting Administrative Approval.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../data');
const SCHEMES_FILE = path.join(DATA_DIR, 'schemes.json');
const VERSIONS_FILE = path.join(DATA_DIR, 'versions.json');
const PENDING_FILE = path.join(DATA_DIR, 'pending_schemes.json');
const DISCONTINUED_FILE = path.join(DATA_DIR, 'discontinued.json');
const SYNC_LOGS_FILE = path.join(DATA_DIR, 'sync_logs.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function safeReadJson(filePath, defaultValue) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`[SchemeStore] Error reading ${filePath}:`, err.message);
  }
  return defaultValue;
}

function safeWriteJson(filePath, data) {
  try {
    const tmp = `${filePath}.tmp-${Date.now()}`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmp, filePath);
    return true;
  } catch (err) {
    console.error(`[SchemeStore] Error writing ${filePath}:`, err.message);
    return false;
  }
}

// In-Memory cache with persistent disk backing
let activeSchemes = [];
let versionHistory = {};
let pendingQueue = [];
let discontinuedSchemes = [];
let syncLogs = [];

/**
 * Initialize Store: Seed from nationalSchemesDatabase if disk is empty
 */
function initStore(seedSchemes = []) {
  activeSchemes = safeReadJson(SCHEMES_FILE, []);
  versionHistory = safeReadJson(VERSIONS_FILE, {});
  pendingQueue = safeReadJson(PENDING_FILE, []);
  discontinuedSchemes = safeReadJson(DISCONTINUED_FILE, []);
  syncLogs = safeReadJson(SYNC_LOGS_FILE, []);

  if (activeSchemes.length === 0 && seedSchemes.length > 0) {
    console.log(`[SchemeStore] Seeding persistent repository with ${seedSchemes.length} verified schemes...`);
    activeSchemes = [...seedSchemes];
    safeWriteJson(SCHEMES_FILE, activeSchemes);

    // Initial version baseline
    activeSchemes.forEach(s => {
      versionHistory[s.id] = [{
        version: 1,
        updated_at: s.last_verified || new Date().toISOString(),
        change_reason: 'Initial Baseline Verification',
        data: { ...s }
      }];
    });
    safeWriteJson(VERSIONS_FILE, versionHistory);
  }

  return {
    activeCount: activeSchemes.length,
    pendingCount: pendingQueue.length,
    discontinuedCount: discontinuedSchemes.length
  };
}

/**
 * Get all active verified schemes
 */
function getActiveSchemes() {
  return activeSchemes;
}

/**
 * Find scheme by ID
 */
function getSchemeById(id) {
  return activeSchemes.find(s => s.id === id) || null;
}

/**
 * Get pending verification queue
 */
function getPendingQueue() {
  return pendingQueue;
}

/**
 * Get version history for a scheme
 */
function getSchemeVersions(id) {
  return versionHistory[id] || [];
}

/**
 * Get discontinued schemes
 */
function getDiscontinuedSchemes() {
  return discontinuedSchemes;
}

/**
 * Get recent sync logs
 */
function getSyncLogs(limit = 20) {
  return syncLogs.slice(-limit).reverse();
}

/**
 * Append a sync log
 */
function appendSyncLog(logEntry) {
  syncLogs.push({
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    ...logEntry
  });
  if (syncLogs.length > 200) syncLogs = syncLogs.slice(-200);
  safeWriteJson(SYNC_LOGS_FILE, syncLogs);
}

/**
 * Insert a newly verified scheme directly into active store
 */
function insertScheme(schemeData, reason = 'Automated Verification') {
  const existing = activeSchemes.find(s => s.id === schemeData.id);
  if (existing) {
    return updateScheme(schemeData.id, schemeData, reason);
  }

  const newRecord = {
    ...schemeData,
    status: schemeData.status || 'Active',
    last_verified: schemeData.last_verified || new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  };

  activeSchemes.unshift(newRecord);
  safeWriteJson(SCHEMES_FILE, activeSchemes);

  // Version 1
  versionHistory[newRecord.id] = [{
    version: 1,
    updated_at: new Date().toISOString(),
    change_reason: reason,
    data: { ...newRecord }
  }];
  safeWriteJson(VERSIONS_FILE, versionHistory);

  return { action: 'INSERTED', scheme: newRecord };
}

/**
 * Update an existing scheme with audit trail and version history
 */
function updateScheme(id, updatedFields, reason = 'Official Gazette/Portal Modification') {
  const idx = activeSchemes.findIndex(s => s.id === id);
  if (idx === -1) return null;

  const previous = { ...activeSchemes[idx] };
  const history = versionHistory[id] || [];
  const nextVer = history.length + 1;

  const merged = {
    ...previous,
    ...updatedFields,
    id: previous.id, // Immutable ID
    last_verified: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString()
  };

  activeSchemes[idx] = merged;
  safeWriteJson(SCHEMES_FILE, activeSchemes);

  history.push({
    version: nextVer,
    updated_at: new Date().toISOString(),
    change_reason: reason,
    previous_snapshot: previous,
    data: { ...merged }
  });
  versionHistory[id] = history;
  safeWriteJson(VERSIONS_FILE, versionHistory);

  return { action: 'UPDATED', previous, current: merged, version: nextVer };
}

/**
 * Mark a scheme as Discontinued / Inactive with evidence
 */
function markDiscontinued(id, evidenceReason, evidenceUrl) {
  const idx = activeSchemes.findIndex(s => s.id === id);
  if (idx === -1) return null;

  const scheme = activeSchemes[idx];
  scheme.status = 'Discontinued';
  scheme.discontinued_at = new Date().toISOString();
  scheme.discontinuation_evidence = evidenceReason || 'Superseded by newer statutory initiative';
  scheme.discontinuation_url = evidenceUrl || scheme.official_url;

  // Move from active to discontinued list
  activeSchemes.splice(idx, 1);
  discontinuedSchemes.unshift(scheme);

  safeWriteJson(SCHEMES_FILE, activeSchemes);
  safeWriteJson(DISCONTINUED_FILE, discontinuedSchemes);

  const history = versionHistory[id] || [];
  history.push({
    version: history.length + 1,
    updated_at: new Date().toISOString(),
    change_reason: `Discontinued: ${evidenceReason}`,
    data: { ...scheme }
  });
  versionHistory[id] = history;
  safeWriteJson(VERSIONS_FILE, versionHistory);

  return scheme;
}

/**
 * Add incoming candidate scheme to Pending Queue (Awaiting Admin Scrutiny)
 */
function queuePendingScheme(candidate, detectionMetadata = {}) {
  // Check if identical candidate already in pending
  const exists = pendingQueue.find(p => p.id === candidate.id || (p.name.toLowerCase() === candidate.name.toLowerCase() && p.state === candidate.state));
  if (exists) return { queued: false, reason: 'Already in review queue' };

  const pendingItem = {
    ...candidate,
    queued_at: new Date().toISOString(),
    detection_type: detectionMetadata.type || 'NEW_DISCOVERY',
    match_confidence: detectionMetadata.confidence || 0.85,
    source_adapter: detectionMetadata.source || 'Authorized Feed',
    review_status: 'PENDING'
  };

  pendingQueue.unshift(pendingItem);
  safeWriteJson(PENDING_FILE, pendingQueue);
  return { queued: true, item: pendingItem };
}

/**
 * Admin action: Approve pending scheme
 */
function approvePendingScheme(pendingId, correctedFields = {}) {
  const idx = pendingQueue.findIndex(p => p.id === pendingId);
  if (idx === -1) return { success: false, error: 'Pending scheme not found' };

  const pendingItem = pendingQueue[idx];
  const finalRecord = {
    ...pendingItem,
    ...correctedFields,
    status: 'Active',
    last_verified: new Date().toISOString().split('T')[0]
  };

  // Remove administrative pending metadata
  delete finalRecord.queued_at;
  delete finalRecord.detection_type;
  delete finalRecord.match_confidence;
  delete finalRecord.source_adapter;
  delete finalRecord.review_status;

  // Insert or update in active store
  insertScheme(finalRecord, 'Approved via Admin Governance Panel');

  // Remove from pending queue
  pendingQueue.splice(idx, 1);
  safeWriteJson(PENDING_FILE, pendingQueue);

  return { success: true, scheme: finalRecord };
}

/**
 * Admin action: Reject pending scheme
 */
function rejectPendingScheme(pendingId, rejectionReason = 'Does not meet official gazette standards') {
  const idx = pendingQueue.findIndex(p => p.id === pendingId);
  if (idx === -1) return { success: false, error: 'Pending scheme not found' };

  const rejected = pendingQueue.splice(idx, 1)[0];
  safeWriteJson(PENDING_FILE, pendingQueue);

  appendSyncLog({
    type: 'ADMIN_REJECTION',
    scheme_id: pendingId,
    scheme_name: rejected.name,
    reason: rejectionReason
  });

  return { success: true, rejectedId: pendingId };
}

module.exports = {
  initStore,
  getActiveSchemes,
  getSchemeById,
  getPendingQueue,
  getSchemeVersions,
  getDiscontinuedSchemes,
  getSyncLogs,
  appendSyncLog,
  insertScheme,
  updateScheme,
  markDiscontinued,
  queuePendingScheme,
  approvePendingScheme,
  rejectPendingScheme
};

