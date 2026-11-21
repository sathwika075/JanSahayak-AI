const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.resolve(__dirname, '../frontend/index.html');
let html = fs.readFileSync(targetFile, 'utf8');

// =========================================================================
// 1. ADD SELECTOR TO PAGE-GUIDANCE SO IT CAN ADAPT TO ANY SERVICE/SCHEME
// =========================================================================
const oldGuidanceHeader = `<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <span class="text-xs font-mono text-electric-blue">STEP-BY-STEP ROADMAP</span>
            <h3 class="text-2xl font-bold text-white mt-1">Telangana Post-Matric Scholarships (RTF & MTF)</h3>
            <p class="text-xs text-muted-grey mt-1">Application guidance assistant – Not an official submission portal
            </p>
          </div>
          <div class="flex items-center gap-3">
            <a href="https://telanganaepass.cgg.gov.in/" target="_blank"
              class="btn-gradient px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 shadow-lg">
              <i data-lucide="external-link" class="w-4 h-4"></i> Open Telangana ePASS
            </a>
          </div>
        </div>`;

const newGuidanceHeader = `<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <span class="text-xs font-mono text-electric-blue flex items-center gap-1.5">
              <i data-lucide="map-pin" class="w-3.5 h-3.5"></i> SERVICE-SPECIFIC APPLICATION ROADMAP
            </span>
            <h3 class="text-2xl font-bold text-white mt-1" id="guidance-service-title">Telangana Post-Matric Scholarships (ePASS)</h3>
            <p class="text-xs text-muted-grey mt-1" id="guidance-service-desc">
              Authoritative step-by-step guidance, required documents & verified official portal links.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <select id="guidance-service-selector" onchange="changeGuidanceService(this.value)" class="bg-[#10131B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-blue">
              <option value="ts-epass" selected>🎓 Telangana ePASS Scholarship</option>
              <option value="nsp-csss">🏛️ Central Sector Scholarship (NSP)</option>
              <option value="pan-card">💳 PAN Card (Form 49A / e-PAN)</option>
              <option value="aadhaar-card">🆔 Aadhaar Enrolment & Update</option>
              <option value="passport">✈️ Passport Seva (Fresh / Renewal)</option>
              <option value="voter-id">🗳️ Voter ID (Form 6 / ECI)</option>
              <option value="driving-licence">🚗 Driving Licence (Sarathi Parivahan)</option>
              <option value="income-cert">📜 MeeSeva Income Certificate</option>
              <option value="caste-cert">📜 MeeSeva Caste Certificate</option>
              <option value="bank-account">🏦 Bank Account Opening (PMJDY / Zero-Bal)</option>
              <option value="ration-card">🍚 Food Security Card (Ration Card)</option>
            </select>
            <a id="guidance-official-portal-btn" href="https://telanganaepass.cgg.gov.in/" target="_blank" rel="noopener noreferrer"
              class="btn-gradient px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 shadow-lg">
              <i data-lucide="external-link" class="w-4 h-4"></i> <span id="guidance-portal-btn-label">Open Official Portal</span>
            </a>
          </div>
        </div>`;

if (html.includes(oldGuidanceHeader)) {
  html = html.replace(oldGuidanceHeader, newGuidanceHeader);
  console.log('✅ Replaced guidance header with dynamic service switcher!');
}

fs.writeFileSync(targetFile, html, 'utf8');
console.log('Saved preliminary template updates.');

