// C:\Nxtwave-Sathwika\jansahayak-ai\backend\autoSyncScheduler.js
// Autonomous 24-Hour Scheduled Synchronization Pipeline with Configurable Intervals,
// Manual Triggers, and Health Monitoring.

const { runAllSourceConnectors, SOURCE_AUTHORIZATION_REGISTRY } = require('./sourcesConnector');
const { processDiscoveredSchemes } = require('./schemeSyncEngine');
const schemeStore = require('./schemeVersionStore');

class AutoSyncScheduler {
  constructor() {
    this.intervalHours = 24; // Default 24 hours
    this.timer = null;
    this.isSyncing = false;
    this.lastSyncTime = null;
    this.nextSyncTime = null;
    this.lastSyncReport = null;
    this.syncHistory = [];
  }

  /**
   * Start the 24-hour background scheduler
   */
  start(intervalHours = 24) {
    this.intervalHours = intervalHours;
    const intervalMs = this.intervalHours * 60 * 60 * 1000;

    this.calculateNextSync();
    console.log(`[AutoSyncScheduler] Background synchronization daemon scheduled every ${this.intervalHours} hours.`);
    console.log(`[AutoSyncScheduler] Next scheduled synchronization: ${this.nextSyncTime.toISOString()}`);

    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(async () => {
      console.log(`[AutoSyncScheduler] Triggering 24-hour periodic government scheme sync at ${new Date().toISOString()}`);
      await this.runSyncJob('SCHEDULED_24H');
      this.calculateNextSync();
    }, intervalMs);

    // Run initial sync check in background 5 seconds after startup
    setTimeout(() => {
      this.runSyncJob('INITIAL_STARTUP_SYNC').catch(e => console.error('[AutoSyncScheduler] Initial sync error:', e.message));
    }, 5000);
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('[AutoSyncScheduler] Background sync scheduler stopped.');
    }
  }

  calculateNextSync() {
    this.nextSyncTime = new Date(Date.now() + this.intervalHours * 60 * 60 * 1000);
  }

  /**
   * Core Sync Job: Fetches from connectors, detects duplicates/updates, queues new schemes
   */
  async runSyncJob(triggerType = 'MANUAL_TRIGGER') {
    if (this.isSyncing) {
      console.warn('[AutoSyncScheduler] Sync is already currently in progress. Skipping overlapping run.');
      return { inProgress: true, message: 'Sync already running' };
    }

    this.isSyncing = true;
    const startTime = Date.now();
    console.log(`[AutoSyncScheduler] Starting scheme discovery and sync pipeline (${triggerType})...`);

    const report = {
      trigger: triggerType,
      started_at: new Date().toISOString(),
      sources_checked: [],
      new_schemes_discovered: 0,
      existing_schemes_updated: 0,
      duplicate_records_skipped: 0,
      failed_imports: 0,
      pending_verification_count: 0,
      errors: [],
      duration_ms: 0,
      status: 'SUCCESS'
    };

    try {
      // 1. Fetch from authorized connectors
      const connectorResult = await runAllSourceConnectors();
      report.sources_checked = connectorResult.sourceReports;

      // 2. Process discovered candidate schemes
      const syncResult = await processDiscoveredSchemes(connectorResult.candidates, 'Multi-Source Authorized Pipeline');

      report.new_schemes_discovered = syncResult.queuedForReview;
      report.existing_schemes_updated = syncResult.updatedExisting;
      report.duplicate_records_skipped = syncResult.duplicateSkipped;
      report.failed_imports = syncResult.failedVerification;
      report.pending_verification_count = schemeStore.getPendingQueue().length;

      // Check for connector warnings
      connectorResult.sourceReports.forEach(sr => {
        if (sr.status === 'ERROR') {
          report.errors.push(`Source ${sr.source}: ${sr.error}`);
        }
      });

    } catch (err) {
      console.error('[AutoSyncScheduler] Fatal error during sync:', err.message);
      report.status = 'PARTIAL_ERROR';
      report.errors.push(err.message);
    } finally {
      this.isSyncing = false;
      this.lastSyncTime = new Date();
      report.duration_ms = Date.now() - startTime;
      report.completed_at = this.lastSyncTime.toISOString();
      this.lastSyncReport = report;

      this.syncHistory.push(report);
      if (this.syncHistory.length > 50) this.syncHistory.shift();

      console.log(`[AutoSyncScheduler] Sync completed in ${report.duration_ms}ms. Discovered: ${report.new_schemes_discovered}, Updated: ${report.existing_schemes_updated}, Skipped: ${report.duplicate_records_skipped}`);
    }

    return report;
  }

  /**
   * Status metrics for Admin Dashboard
   */
  getStatus() {
    return {
      is_syncing: this.isSyncing,
      interval_hours: this.intervalHours,
      last_sync_time: this.lastSyncTime ? this.lastSyncTime.toISOString() : (schemeStore.getSyncLogs(1)[0]?.timestamp || null),
      next_sync_time: this.nextSyncTime ? this.nextSyncTime.toISOString() : null,
      last_report: this.lastSyncReport,
      total_schemes_active: schemeStore.getActiveSchemes().length,
      pending_verification_count: schemeStore.getPendingQueue().length,
      discontinued_count: schemeStore.getDiscontinuedSchemes().length,
      authorization_registry: SOURCE_AUTHORIZATION_REGISTRY
    };
  }
}

// Global Singleton Instance
const schedulerInstance = new AutoSyncScheduler();

module.exports = schedulerInstance;

