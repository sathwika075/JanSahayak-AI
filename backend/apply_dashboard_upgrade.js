const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../frontend/index.html');
let html = fs.readFileSync(targetFile, 'utf8');

// Find current page-dashboard section
const startPattern = '<section id="page-dashboard" class="space-y-8">';
const endPattern = '<!-- ======================================================== -->\n    <!-- PAGE 2: AI GOVERNMENT ASSISTANT -->';

const startIndex = html.indexOf(startPattern);
const endIndex = html.indexOf(endPattern);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not locate dashboard boundaries!');
  process.exit(1);
}

const newDashboardSection = `<section id="page-dashboard" class="space-y-8">
      <!-- Profile Completion & Dynamic Greeting Banner -->
      <div
        class="glass-card p-6 md:p-8 bg-gradient-to-r from-[#151B27] via-[#10131B] to-[#151B27] relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-cerulean/10 rounded-full blur-3xl pointer-events-none">
        </div>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div class="space-y-2">
            <span class="text-sm font-mono text-electric-blue flex items-center gap-1.5" id="dash-greeting-text">
              <i data-lucide="sparkles" class="w-4 h-4 text-neon-rose"></i> Namaste, Sathwika! Welcome to JanSahayak.
            </span>
            <h3 class="text-2xl font-bold text-white">
              Your Profile is <span class="text-success-green" id="dash-profile-pct">Calculating...</span>
            </h3>
            <p class="text-sm text-muted-grey max-w-xl" id="dash-profile-summary">
              Analyzing verified government schemes and missing eligibility documents for your profile...
            </p>
          </div>
          <div class="flex flex-col sm:flex-row items-center gap-3">
            <button onclick="switchTab('assistant')"
              class="w-full sm:w-auto btn-gradient px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg">
              <i data-lucide="mic" class="w-4 h-4"></i> Voice AI Assistant
            </button>
            <button onclick="switchTab('checker')"
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition flex items-center justify-center gap-2 border border-white/10">
              <i data-lucide="check-check" class="w-4 h-4 text-success-green"></i> Run Full Check
            </button>
            <button onclick="switchTab('finder')"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-grey hover:text-white font-semibold text-sm transition flex items-center justify-center gap-2 border border-white/5">
              <i data-lucide="compass" class="w-4 h-4"></i> Explore Schemes
            </button>
          </div>
        </div>

        <!-- Dynamic Progress Bar (Computed from real saved profile fields) -->
        <div class="mt-6 w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
          <div id="dash-progress-fill" class="bg-gradient-to-r from-cerulean via-electric-blue to-neon-rose h-2.5 rounded-full transition-all duration-700 w-[0%]"></div>
        </div>
      </div>

      <!-- Real Dynamic Quick Stats Grid (Calculated from DB/Catalog, No Fake Numbers) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-5 cursor-pointer hover:border-electric-blue/40 transition" onclick="switchTab('finder')">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-grey uppercase font-mono">Available Verified Schemes</span>
            <div class="p-2 rounded-lg bg-cerulean/20 text-electric-blue"><i data-lucide="layers" class="w-4 h-4"></i></div>
          </div>
          <p class="text-2xl font-bold text-white mt-2" id="dash-stat-total-schemes">Loading...</p>
          <span class="text-xs text-electric-blue flex items-center gap-1 mt-1">
            <i data-lucide="external-link" class="w-3 h-3"></i> Click to Browse All
          </span>
        </div>

        <div class="glass-card p-5 cursor-pointer hover:border-success-green/40 transition" onclick="switchTab('checker')">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-grey uppercase font-mono">Matched Eligible Schemes</span>
            <div class="p-2 rounded-lg bg-success-green/20 text-success-green"><i data-lucide="sparkles" class="w-4 h-4"></i></div>
          </div>
          <p class="text-2xl font-bold text-white mt-2" id="dash-stat-matched-schemes">Evaluating...</p>
          <span class="text-xs text-success-green flex items-center gap-1 mt-1" id="dash-stat-matched-desc">
            <i data-lucide="check" class="w-3 h-3"></i> Criteria Match
          </span>
        </div>

        <div class="glass-card p-5 cursor-pointer hover:border-warning-amber/40 transition" onclick="switchTab('guidance')">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-grey uppercase font-mono">Upcoming Verified Deadline</span>
            <div class="p-2 rounded-lg bg-warning-amber/20 text-warning-amber"><i data-lucide="clock" class="w-4 h-4"></i></div>
          </div>
          <p class="text-2xl font-bold text-white mt-2" id="dash-stat-next-deadline">Loading...</p>
          <span class="text-xs text-warning-amber mt-1 flex items-center gap-1" id="dash-stat-deadline-scheme">Official Calendar</span>
        </div>

        <div class="glass-card p-5 cursor-pointer hover:border-neon-rose/40 transition" onclick="switchTab('services')">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-grey uppercase font-mono">Citizen Services Hub</span>
            <div class="p-2 rounded-lg bg-neon-rose/20 text-neon-rose"><i data-lucide="landmark" class="w-4 h-4"></i></div>
          </div>
          <p class="text-2xl font-bold text-white mt-2" id="dash-stat-services-count">15 Services</p>
          <span class="text-xs text-neon-rose mt-1 flex items-center gap-1">Identity, Travel, Banking</span>
        </div>
      </div>

      <!-- Quick Action Alert: Missing Documents & Profile Reminders -->
      <div id="dash-missing-docs-alert" class="p-4 rounded-xl bg-warning-amber/10 border border-warning-amber/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-warning-amber/20 flex items-center justify-center shrink-0">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-warning-amber"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">Missing Eligibility Document Notice</h4>
            <p class="text-[11px] text-white/80" id="dash-missing-docs-text">Checking required documents against active scholarship deadlines...</p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button onclick="switchTab('docs')" class="px-3 py-1.5 rounded-lg bg-warning-amber text-black font-semibold text-xs transition hover:opacity-90">
            Upload via OCR &rarr;
          </button>
        </div>
      </div>

      <!-- Two-Column Interactive Row: Recent AI Inquiries & Saved Portals -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent AI Inquiries / Voice Quick Launcher -->
        <div class="glass-card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
              <i data-lucide="message-square" class="w-4 h-4 text-electric-blue"></i>
              Recent Assistant Inquiries
            </h4>
            <button onclick="switchTab('assistant')" class="text-xs text-electric-blue hover:underline">Open Chat &rarr;</button>
          </div>
          <div class="space-y-2 text-xs" id="dash-recent-chats-list">
            <div class="p-3 rounded-xl bg-[#10131B] border border-white/5 flex items-center justify-between cursor-pointer hover:border-electric-blue/30 transition" onclick="quickAskFromDashboard('How do I apply for a PAN card?')">
              <span class="text-white">How do I apply for a PAN card?</span>
              <span class="text-muted-grey text-[10px] font-mono">Ask AI &rarr;</span>
            </div>
            <div class="p-3 rounded-xl bg-[#10131B] border border-white/5 flex items-center justify-between cursor-pointer hover:border-electric-blue/30 transition" onclick="quickAskFromDashboard('Which scholarships can I apply for?')">
              <span class="text-white">Which scholarships can I apply for?</span>
              <span class="text-muted-grey text-[10px] font-mono">Ask AI &rarr;</span>
            </div>
            <div class="p-3 rounded-xl bg-[#10131B] border border-white/5 flex items-center justify-between cursor-pointer hover:border-electric-blue/30 transition" onclick="quickAskFromDashboard('How do I download Aadhaar card?')">
              <span class="text-white">How do I download Aadhaar card?</span>
              <span class="text-muted-grey text-[10px] font-mono">Ask AI &rarr;</span>
            </div>
          </div>
        </div>

        <!-- Saved Portals & Quick Citizen Access -->
        <div class="glass-card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
              <i data-lucide="bookmark" class="w-4 h-4 text-neon-rose"></i>
              Saved Government Services & Portals
            </h4>
            <button onclick="switchTab('services')" class="text-xs text-neon-rose hover:underline">All Services &rarr;</button>
          </div>
          <div class="space-y-2 text-xs" id="dash-saved-portals-list">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>

      <!-- Recommended Verified Schemes Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <i data-lucide="award" class="w-5 h-5 text-electric-blue"></i>
            Recommended Verified Schemes (Dynamic Evaluation)
          </h3>
          <button onclick="switchTab('finder')" class="text-xs text-electric-blue hover:underline">View All &rarr;</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="dashboard-recommended-grid">
          <!-- Populated dynamically via JS -->
        </div>
      </div>
    </section>

    `;

html = html.substring(0, startIndex) + newDashboardSection + html.substring(endIndex);
fs.writeFileSync(targetFile, html, 'utf8');
console.log('✅ Dashboard section successfully upgraded with real statistics, missing doc reminders, and recent inquiries!');

