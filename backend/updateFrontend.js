// backend/updateFrontend.js
const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../frontend/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Remove any previous duplicated service blocks
const blockRegex = /\s*<!-- ======================================================== -->\r?\n\s*<!-- PAGE 2B: CITIZEN SERVICES HUB[\s\S]*?<\/div>\s*<\/div>/g;
html = html.replace(blockRegex, '');

// 2. Insert Page 2B: Citizen Services Hub markup right after page-assistant
const serviceMarkup = `

    <!-- ======================================================== -->
    <!-- PAGE 2B: CITIZEN SERVICES HUB (IDENTITY, TRAVEL, BANKING, CERTIFICATES) -->
    <!-- ======================================================== -->
    <section id="page-services" class="hidden space-y-8">
      <!-- Banner & Introduction -->
      <div class="glass-card p-6 md:p-8 bg-gradient-to-r from-[#151B27] via-[#10131B] to-[#151B27] relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-electric-blue/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-4">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 text-xs font-semibold rounded-full badge-primary">JanSahayak Citizen Services Hub</span>
            <span class="px-3 py-1 text-xs font-semibold rounded-full bg-success-green/10 text-success-green border border-success-green/20">100% Verified Portals</span>
          </div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 class="text-2xl md:text-3xl font-extrabold text-white">Government Identity, Travel, Banking & Certificates</h3>
              <p class="text-sm text-muted-grey max-w-2xl mt-1">
                Authoritative procedures, required documents, official fees, and direct application links for essential citizen services across India and Telangana.
              </p>
            </div>
            <button onclick="switchTab('assistant')" class="btn-gradient px-4 py-2.5 rounded-xl text-white font-semibold text-xs flex items-center gap-2 shadow-lg shrink-0">
              <i data-lucide="bot" class="w-4 h-4"></i> Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

      <!-- Search & Category Filters Bar -->
      <div class="glass-card p-6 space-y-4">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex-1 w-full relative">
            <i data-lucide="search" class="w-4 h-4 absolute left-4 top-3.5 text-muted-grey"></i>
            <input type="text" id="services-search" oninput="renderCitizenServices()" placeholder="Search PAN, Aadhaar, Passport, ATM Card, Passbook, Income Certificate, Driving Licence..." class="w-full bg-[#10131B] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue transition placeholder:text-muted-grey/60">
          </div>
          <span class="text-xs text-muted-grey shrink-0 font-mono" id="services-count-indicator">Showing 15 Services</span>
        </div>

        <!-- Category Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs" id="services-category-pills">
          <button onclick="filterServicesCategory('all')" id="svc-cat-all" class="px-4 py-2 rounded-xl font-semibold bg-white/10 text-white border border-white/20 transition flex items-center gap-2 shrink-0">
            <i data-lucide="layout-grid" class="w-4 h-4 text-electric-blue"></i>
            <span>All Services (15)</span>
          </button>
          <button onclick="filterServicesCategory('identity')" id="svc-cat-identity" class="px-4 py-2 rounded-xl font-medium text-muted-grey hover:text-white bg-white/5 hover:bg-white/10 transition flex items-center gap-2 shrink-0">
            <i data-lucide="shield-check" class="w-4 h-4 text-electric-blue"></i>
            <span>Identity & Cards (3)</span>
          </button>
          <button onclick="filterServicesCategory('travel')" id="svc-cat-travel" class="px-4 py-2 rounded-xl font-medium text-muted-grey hover:text-white bg-white/5 hover:bg-white/10 transition flex items-center gap-2 shrink-0">
            <i data-lucide="plane" class="w-4 h-4 text-[#FF2D87]"></i>
            <span>Travel & Transport (2)</span>
          </button>
          <button onclick="filterServicesCategory('banking')" id="svc-cat-banking" class="px-4 py-2 rounded-xl font-medium text-muted-grey hover:text-white bg-white/5 hover:bg-white/10 transition flex items-center gap-2 shrink-0">
            <i data-lucide="landmark" class="w-4 h-4 text-[#22C55E]"></i>
            <span>Banking Guidance (5)</span>
          </button>
          <button onclick="filterServicesCategory('certificate')" id="svc-cat-certificate" class="px-4 py-2 rounded-xl font-medium text-muted-grey hover:text-white bg-white/5 hover:bg-white/10 transition flex items-center gap-2 shrink-0">
            <i data-lucide="file-text" class="w-4 h-4 text-[#F59E0B]"></i>
            <span>Government Certificates (5)</span>
          </button>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="citizen-services-grid">
        <!-- Rendered dynamically by JavaScript -->
      </div>
    </section>

    <!-- DEDICATED CITIZEN SERVICE DETAIL MODAL -->
    <div id="service-detail-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="glass-card max-w-4xl w-full max-h-[90vh] flex flex-col bg-[#10131B] border border-white/10 shadow-2xl overflow-hidden rounded-2xl">
        <!-- Modal Header -->
        <div class="p-6 border-b border-white/10 flex items-start justify-between bg-gradient-to-r from-[#151B27] to-[#10131B]">
          <div class="flex items-center space-x-4">
            <div id="modal-service-icon" class="w-12 h-12 rounded-xl bg-gradient-to-tr from-cerulean via-electric-blue to-neon-rose flex items-center justify-center shadow-lg">
              <i data-lucide="file-text" class="w-6 h-6 text-white"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span id="modal-service-badge" class="px-2.5 py-0.5 text-[11px] rounded-full badge-primary font-mono">Central Govt</span>
                <span id="modal-service-category" class="text-xs text-muted-grey font-medium">Identity Services</span>
              </div>
              <h3 id="modal-service-name" class="text-xl md:text-2xl font-bold text-white mt-1">Permanent Account Number (PAN)</h3>
            </div>
          </div>
          <button onclick="closeServiceDetail()" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-grey hover:text-white transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Modal Content Tabs -->
        <div class="flex border-b border-white/5 px-6 bg-[#08090D]/50 overflow-x-auto text-xs">
          <button onclick="switchServiceModalTab('overview')" id="modal-tab-btn-overview" class="px-4 py-3 font-semibold text-electric-blue border-b-2 border-electric-blue transition shrink-0">Overview & Eligibility</button>
          <button onclick="switchServiceModalTab('documents')" id="modal-tab-btn-documents" class="px-4 py-3 font-medium text-muted-grey hover:text-white transition shrink-0">Required Documents</button>
          <button onclick="switchServiceModalTab('steps')" id="modal-tab-btn-steps" class="px-4 py-3 font-medium text-muted-grey hover:text-white transition shrink-0">Application Steps</button>
          <button onclick="switchServiceModalTab('fees')" id="modal-tab-btn-fees" class="px-4 py-3 font-medium text-muted-grey hover:text-white transition shrink-0">Verified Fees</button>
          <button onclick="switchServiceModalTab('faqs')" id="modal-tab-btn-faqs" class="px-4 py-3 font-medium text-muted-grey hover:text-white transition shrink-0">FAQs</button>
        </div>

        <!-- Modal Body Container -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6 text-sm" id="modal-service-body">
          <!-- Dynamic Content rendered via JS -->
        </div>

        <!-- Modal Action Footer -->
        <div class="p-4 border-t border-white/10 bg-[#08090D] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs text-muted-grey">
            <i data-lucide="shield-check" class="w-4 h-4 text-success-green"></i>
            <span>Verified against official government portal circulars</span>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button onclick="closeServiceDetail()" class="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-muted-grey hover:text-white transition">Close</button>
            <button id="modal-ask-ai-btn" class="w-full sm:w-auto btn-gradient px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-lg">
              <i data-lucide="bot" class="w-4 h-4"></i> Ask AI Assistant About This
            </button>
          </div>
        </div>
      </div>
    </div>`;

// Insert after </section> of page-assistant
const finderMarker = '<!-- ======================================================== -->\r?\n\\s*<!-- PAGE 3: SCHOLARSHIP FINDER -->';
html = html.replace(new RegExp(finderMarker), serviceMarkup + '\n\n    <!-- ======================================================== -->\n    <!-- PAGE 3: SCHOLARSHIP FINDER -->');

// Write to index.html
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated index.html with single Citizen Services section!');

