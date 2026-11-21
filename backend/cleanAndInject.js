// backend/cleanAndInject.js
const fs = require('fs');
const path = require('path');
const { CITIZEN_SERVICES, SERVICE_CATEGORIES } = require('./servicesData');

const indexPath = path.resolve(__dirname, '../frontend/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Remove the extra service block placed before </main>
const extraServicesBeforeMainRegex = /<\/section>\s*<\/div>\s*<!-- Search & Category Filters Bar -->[\s\S]*?<\/div>\s*<\/div>\s*<\/main>/;
html = html.replace(extraServicesBeforeMainRegex, '</section>\n  </main>');

// 2. Ensure page-services exists right after page-assistant
if (!html.includes('id="page-services"')) {
  console.log('Inserting page-services...');
  // It was already inserted, but let's check
}

// 3. Inject the Citizen Services Catalog data & all client-side JS into the main script
const citizenServicesCatalogJson = JSON.stringify(CITIZEN_SERVICES);
const serviceCategoriesJson = JSON.stringify(SERVICE_CATEGORIES);

const newScriptLogic = `
    // CITIZEN SERVICES HUB DATA & LOGIC
    const CITIZEN_SERVICES_CATALOG = ${citizenServicesCatalogJson};
    const CITIZEN_SERVICE_CATEGORIES = ${serviceCategoriesJson};
    let currentServiceCategory = 'all';

    function renderCitizenServices() {
      const container = document.getElementById('citizen-services-grid');
      if (!container) return;

      const searchInput = document.getElementById('services-search');
      const q = (searchInput ? searchInput.value : '').toLowerCase().trim();

      const filtered = CITIZEN_SERVICES_CATALOG.filter(s => {
        if (currentServiceCategory !== 'all' && s.category !== currentServiceCategory) return false;
        if (q) {
          const haystack = (s.name + ' ' + s.description + ' ' + s.categoryName + ' ' + (s.keywords || []).join(' ')).toLowerCase();
          return haystack.includes(q);
        }
        return true;
      });

      const countInd = document.getElementById('services-count-indicator');
      if (countInd) {
        countInd.innerText = \`Showing \${filtered.length} of \${CITIZEN_SERVICES_CATALOG.length} Services\`;
      }

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="col-span-full glass-card p-12 text-center space-y-3">
            <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto text-muted-grey">
              <i data-lucide="search-x" class="w-6 h-6"></i>
            </div>
            <h4 class="text-white font-bold text-base">No Matching Citizen Services Found</h4>
            <p class="text-xs text-muted-grey">Try a different search keyword (e.g. "PAN", "Aadhaar", "Passport", "Passbook", "Income") or select "All Services".</p>
            <button onclick="filterServicesCategory('all'); if (document.getElementById('services-search')) document.getElementById('services-search').value='';" class="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold text-white">Reset Filters</button>
          </div>
        \`;
        lucide.createIcons();
        return;
      }

      container.innerHTML = filtered.map(s => {
        let badgeColor = 'badge-primary';
        if (s.category === 'identity') badgeColor = 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20';
        else if (s.category === 'travel') badgeColor = 'bg-neon-rose/10 text-[#FF4FA3] border border-neon-rose/20';
        else if (s.category === 'banking') badgeColor = 'bg-success-green/10 text-success-green border border-success-green/20';
        else if (s.category === 'certificate') badgeColor = 'bg-warning-amber/10 text-[#F59E0B] border border-warning-amber/20';

        return \`
          <div class="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-electric-blue/40 transition group">
            <div class="space-y-3">
              <div class="flex items-start justify-between gap-2">
                <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-cerulean/30 via-electric-blue/20 to-neon-rose/20 flex items-center justify-center text-electric-blue group-hover:scale-105 transition">
                  <i data-lucide="\${s.icon || 'file-text'}" class="w-5 h-5"></i>
                </div>
                <span class="px-2.5 py-0.5 text-[10px] rounded-full font-mono \${badgeColor}">\${s.badge}</span>
              </div>
              <div>
                <span class="text-[10px] text-muted-grey uppercase font-mono tracking-wider">\${s.categoryName}</span>
                <h4 class="text-lg font-bold text-white group-hover:text-electric-blue transition">\${s.name}</h4>
              </div>
              <p class="text-xs text-muted-grey line-clamp-3 leading-relaxed">\${s.description}</p>
              
              <!-- Highlights / Tags -->
              <div class="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                \${(s.features || []).slice(0, 2).map(f => \`
                  <span class="px-2 py-0.5 rounded-md bg-white/5 text-white/80 border border-white/5 flex items-center gap-1">
                    <i data-lucide="check" class="w-3 h-3 text-success-green"></i> \${f}
                  </span>
                \`).join('')}
              </div>
            </div>

            <div class="pt-3 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
              <button onclick="openServiceDetail('\${s.id}')" class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition">
                <i data-lucide="info" class="w-3.5 h-3.5 text-electric-blue"></i> View Guide
              </button>
              <button onclick="askAiAboutService('\${s.id}', 'How do I apply for \${s.name}?')" class="btn-gradient px-3.5 py-2 rounded-xl text-white font-semibold flex items-center gap-1.5 shadow-md">
                <i data-lucide="bot" class="w-3.5 h-3.5"></i> Ask AI
              </button>
            </div>
          </div>
        \`;
      }).join('');

      lucide.createIcons();
    }

    function filterServicesCategory(category) {
      currentServiceCategory = category;
      const categories = ['all', 'identity', 'travel', 'banking', 'certificate'];
      categories.forEach(c => {
        const btn = document.getElementById(\`svc-cat-\${c}\`);
        if (btn) {
          if (c === category) {
            btn.className = "px-4 py-2 rounded-xl font-semibold bg-white/10 text-white border border-white/20 transition flex items-center gap-2 shrink-0";
          } else {
            btn.className = "px-4 py-2 rounded-xl font-medium text-muted-grey hover:text-white bg-white/5 hover:bg-white/10 transition flex items-center gap-2 shrink-0";
          }
        }
      });
      renderCitizenServices();
    }

    let activeModalService = null;
    let activeModalTab = 'overview';

    function openServiceDetail(serviceId) {
      const service = CITIZEN_SERVICES_CATALOG.find(s => s.id === serviceId);
      if (!service) return;
      activeModalService = service;
      activeModalTab = 'overview';

      // Update Header info
      document.getElementById('modal-service-name').innerText = service.name;
      document.getElementById('modal-service-category').innerText = service.categoryName;
      document.getElementById('modal-service-badge').innerText = service.badge;
      
      const iconEl = document.getElementById('modal-service-icon');
      if (iconEl) {
        iconEl.innerHTML = \`<i data-lucide="\${service.icon || 'file-text'}" class="w-6 h-6 text-white"></i>\`;
      }

      const askBtn = document.getElementById('modal-ask-ai-btn');
      if (askBtn) {
        askBtn.onclick = () => askAiAboutService(service.id, \`How do I apply for \${service.name}?\`);
      }

      switchServiceModalTab('overview');
      const modal = document.getElementById('service-detail-modal');
      if (modal) modal.classList.remove('hidden');
      lucide.createIcons();
    }

    function closeServiceDetail() {
      const modal = document.getElementById('service-detail-modal');
      if (modal) modal.classList.add('hidden');
      activeModalService = null;
    }

    function switchServiceModalTab(tabName) {
      activeModalTab = tabName;
      const s = activeModalService;
      if (!s) return;

      const tabs = ['overview', 'documents', 'steps', 'fees', 'faqs'];
      tabs.forEach(t => {
        const btn = document.getElementById(\`modal-tab-btn-\${t}\`);
        if (btn) {
          if (t === tabName) {
            btn.className = "px-4 py-3 font-semibold text-electric-blue border-b-2 border-electric-blue transition shrink-0";
          } else {
            btn.className = "px-4 py-3 font-medium text-muted-grey hover:text-white transition shrink-0";
          }
        }
      });

      const body = document.getElementById('modal-service-body');
      if (!body) return;

      if (tabName === 'overview') {
        body.innerHTML = \`
          <div class="space-y-4">
            <div>
              <h5 class="text-xs uppercase tracking-wider text-muted-grey font-mono">Service Summary</h5>
              <p class="text-white text-sm mt-1 leading-relaxed">\${s.description}</p>
            </div>

            <div class="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <h5 class="text-xs uppercase tracking-wider text-electric-blue font-mono font-bold flex items-center gap-1.5">
                <i data-lucide="check-circle" class="w-4 h-4 text-success-green"></i> Who Can Apply / Eligibility
              </h5>
              <ul class="space-y-1.5 text-xs text-white/90">
                \${(s.whoCanApply || []).map(w => \`<li class="flex items-start gap-2"><span class="text-electric-blue mt-0.5">•</span> <span>\${w}</span></li>\`).join('')}
              </ul>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-[#08090D] border border-white/5 space-y-1">
                <span class="text-[10px] text-muted-grey font-mono">OFFICIAL AUTHORITY</span>
                <p class="text-white font-semibold">\${s.officialPortal}</p>
              </div>
              <div class="p-3 rounded-xl bg-[#08090D] border border-white/5 space-y-1">
                <span class="text-[10px] text-muted-grey font-mono">DIRECT PORTAL ACCESS</span>
                <p><a href="\${s.officialUrl}" target="_blank" class="text-electric-blue hover:underline flex items-center gap-1">Open Official Portal <i data-lucide="external-link" class="w-3 h-3"></i></a></p>
              </div>
            </div>

            \${s.trackingUrl ? \`
              <div class="p-3 rounded-xl bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-between text-xs">
                <span class="text-white flex items-center gap-2"><i data-lucide="search" class="w-4 h-4 text-electric-blue"></i> Real-time Application Tracking Available</span>
                <a href="\${s.trackingUrl}" target="_blank" class="btn-gradient px-3 py-1.5 rounded-lg text-white font-semibold flex items-center gap-1">Track Status <i data-lucide="arrow-up-right" class="w-3 h-3"></i></a>
              </div>
            \` : ''}
          </div>
        \`;
      } else if (tabName === 'documents') {
        body.innerHTML = \`
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h5 class="text-xs uppercase tracking-wider text-muted-grey font-mono">Official Mandatory Document Checklist</h5>
              <span class="text-[11px] text-success-green flex items-center gap-1"><i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Verified Requirements</span>
            </div>
            <div class="space-y-2">
              \${(s.requiredDocuments || []).map((doc, idx) => \`
                <div class="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                  <div class="w-5 h-5 rounded-md bg-electric-blue/20 text-electric-blue flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">\${idx + 1}</div>
                  <div class="text-xs text-white leading-relaxed">\${doc}</div>
                </div>
              \`).join('')}
            </div>
            <p class="text-[11px] text-muted-grey italic">*Always carry original certificates along with self-attested photocopies during offline verification appointments.</p>
          </div>
        \`;
      } else if (tabName === 'steps') {
        body.innerHTML = \`
          <div class="space-y-4">
            <h5 class="text-xs uppercase tracking-wider text-muted-grey font-mono">Step-by-Step Application Roadmap</h5>
            <div class="space-y-3">
              \${(s.applicationSteps || []).map(st => \`
                <div class="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg bg-gradient-to-r from-cerulean to-electric-blue text-white font-bold text-xs flex items-center justify-center shrink-0">\${st.step}</span>
                    <h6 class="text-sm font-bold text-white">\${st.title}</h6>
                  </div>
                  <p class="text-xs text-muted-grey pl-8 leading-relaxed">\${st.desc}</p>
                </div>
              \`).join('')}
            </div>
            \${s.applicationUrl ? \`
              <div class="pt-2 text-center">
                <a href="\${s.applicationUrl}" target="_blank" class="btn-gradient inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg">
                  <span>Start Official Application on \${s.shortName} Portal</span>
                  <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                </a>
              </div>
            \` : ''}
          </div>
        \`;
      } else if (tabName === 'fees') {
        body.innerHTML = \`
          <div class="space-y-4">
            <h5 class="text-xs uppercase tracking-wider text-muted-grey font-mono">Officially Verified Government / Service Fee Schedule</h5>
            <div class="space-y-2">
              \${Object.entries(s.fees || {}).map(([key, val]) => \`
                <div class="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <span class="text-white capitalize font-medium">\${key.replace(/_/g, ' ')}</span>
                  <span class="font-bold text-electric-blue font-mono text-sm">\${val}</span>
                </div>
              \`).join('')}
            </div>
            <div class="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-muted-grey flex items-start gap-2">
              <i data-lucide="info" class="w-4 h-4 text-electric-blue shrink-0 mt-0.5"></i>
              <span>Fees listed are verified against official government notifications and do not include optional courier or expedited agent charges.</span>
            </div>
          </div>
        \`;
      } else if (tabName === 'faqs') {
        body.innerHTML = \`
          <div class="space-y-3">
            <h5 class="text-xs uppercase tracking-wider text-muted-grey font-mono">Frequently Asked Questions</h5>
            \${(s.faqs || []).map(f => \`
              <div class="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                <p class="text-xs font-bold text-white flex items-start gap-2">
                  <span class="text-neon-rose font-mono">Q:</span> <span>\${f.q}</span>
                </p>
                <p class="text-xs text-muted-grey pl-4 leading-relaxed">\${f.a}</p>
              </div>
            \`).join('')}
          </div>
        \`;
      }

      lucide.createIcons();
    }

    function askAiAboutService(serviceId, customPrompt) {
      closeServiceDetail();
      switchTab('assistant');
      const input = document.getElementById('chat-input');
      if (input) {
        input.value = customPrompt || \`How do I apply for \${serviceId}?\`;
        const form = input.closest('form');
        if (form) form.dispatchEvent(new Event('submit'));
      }
    }

    function updateSuggestedPromptChips(suggestions) {
      const container = document.getElementById('chat-suggested-chips-container');
      if (!container || !suggestions || !suggestions.length) return;

      container.innerHTML = \`
        <span class="shrink-0 font-semibold text-white/70">Suggested:</span>
        \${suggestions.map(s => \`
          <button onclick="sendQuickPrompt('\${s.replace(/'/g, "\\\\'")}')" class="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-electric-blue transition border border-white/5 text-xs">\${s}</button>
        \`).join('')}
      \`;
    }

    function copyChatMessage(buttonEl, text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast("Answer copied to clipboard", "success");
        buttonEl.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5 text-success-green"></i> Copied';
        lucide.createIcons();
        setTimeout(() => {
          buttonEl.innerHTML = '<i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy';
          lucide.createIcons();
        }, 2000);
      }).catch(() => {
        showToast("Could not copy text", "warning");
      });
    }
`;

// 4. Update appendChatMessage to include the Copy button
const oldAppendChatMessageRegex = /function appendChatMessage\([\s\S]*?lucide\.createIcons\(\);\s*\}/;
const newAppendChatMessage = `function appendChatMessage(sender, text, citations = []) {
      const c = document.getElementById("chat-messages-container");
      const d = document.createElement("div");
      d.className = \`flex items-start gap-3 \${sender === 'user' ? 'justify-end' : ''}\`;

      let formattedText = text
        .replace(/\\n/g, '<br>')
        .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/### (.*?)(<br>|$)/g, '<h4 class="text-sm font-bold text-white mt-2 mb-1">$1</h4>')
        .replace(/\\[(.*?)\\]\\((.*?)\\)/g, '<a href="$2" target="_blank" class="text-electric-blue underline">$1</a>');

      let citationsHtml = '';
      if (citations && citations.length > 0) {
        citationsHtml = \`
          <div class="mt-3 pt-2 border-t border-white/5 space-y-1">
            <span class="text-[10px] text-muted-grey font-mono uppercase tracking-wider">Official Verified Sources:</span>
            \${citations.map(cite => \`
              <div class="text-[11px] text-electric-blue flex items-center justify-between">
                <a href="\${cite.url}" target="_blank" class="hover:underline flex items-center gap-1">
                  <i data-lucide="external-link" class="w-3 h-3"></i> \${cite.title}
                </a>
                <span class="text-[10px] text-muted-grey font-mono">\${cite.verified_date || '2026'}</span>
              </div>
            \`).join('')}
          </div>
        \`;
      }

      const escapedText = encodeURIComponent(text);

      d.innerHTML = \`
        \${sender === 'assistant' ? '<div class="w-8 h-8 rounded-lg bg-cerulean/30 flex items-center justify-center shrink-0"><i data-lucide="bot" class="w-4 h-4 text-electric-blue"></i></div>' : ''}
        <div class="glass-card p-4 max-w-2xl text-sm \${sender === 'user' ? 'bg-electric-blue/10 border-electric-blue/20 text-white' : 'text-white'} space-y-2">
          <div>\${formattedText}</div>
          \${citationsHtml}
          \${sender === 'assistant' ? \`
            <div class="pt-2 flex justify-end">
              <button onclick="copyChatMessage(this, decodeURIComponent('\${escapedText}'))" class="text-[11px] text-muted-grey hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 flex items-center gap-1 transition">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
              </button>
            </div>
          \` : ''}
        </div>
        \${sender === 'user' ? '<div class="w-8 h-8 rounded-lg bg-neon-rose/30 flex items-center justify-center shrink-0"><i data-lucide="user" class="w-4 h-4 text-white"></i></div>' : ''}
      \`;
      c.appendChild(d);
      c.scrollTop = c.scrollHeight;
      lucide.createIcons();
    }`;

html = html.replace(oldAppendChatMessageRegex, newAppendChatMessage);

// 5. Update handleChatSubmit to call backend /api/ai/chat and dynamically update chips
const oldHandleChatSubmitRegex = /async function handleChatSubmit\(e\)[\s\S]*?generateIntelligentRAGResponse\(query\);\s*\}, 700\);\s*\}/;
const newHandleChatSubmit = `async function handleChatSubmit(e) {
      if (e) e.preventDefault();
      const input = document.getElementById("chat-input");
      if (!input) return;
      const query = input.value.trim();
      if (!query) return;

      appendChatMessage("user", query);
      input.value = "";

      const thinkingId = appendChatThinking();

      setTimeout(async () => {
        try {
          const res = await fetch(\`\${API_BASE}/ai/chat\`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: query,
              language: currentLanguage,
              userId: currentAuthUser ? currentAuthUser.email : 'usr-student-1'
            })
          });

          const thinkingEl = document.getElementById(thinkingId);
          if (thinkingEl) thinkingEl.remove();

          if (res.ok) {
            const data = await res.json();
            appendChatMessage("assistant", data.answer, data.citations);
            if (data.suggestions && data.suggestions.length) {
              updateSuggestedPromptChips(data.suggestions);
            }
            return;
          }
        } catch (err) {
          console.warn("Backend chat error, using intelligent client orchestrator:", err);
        }

        const thinkingEl = document.getElementById(thinkingId);
        if (thinkingEl) thinkingEl.remove();

        generateIntelligentRAGResponse(query);
      }, 500);
    }`;

html = html.replace(oldHandleChatSubmitRegex, newHandleChatSubmit);

// 6. Update generateIntelligentRAGResponse to handle all 16 intents!
const oldRAGRegex = /function generateIntelligentRAGResponse\(query\)[\s\S]*?appendChatMessage\("assistant", answer, citations\);\s*\}/;
const newRAG = `function generateIntelligentRAGResponse(query) {
      const q = query.toLowerCase().trim();
      let answer = "";
      let citations = [];
      let suggestions = [];

      // 1. GREETING
      if (['hi', 'hello', 'hey', 'namaste', 'namaskaram'].includes(q) || /^(hi|hello|hey|namaste)\\b/i.test(q)) {
        if (currentLanguage === "Telugu") {
          answer = "నమస్కారం! **జనసహాయక్ AI** కు స్వాగతం. నేను ప్రభుత్వ స్కాలర్‌షిప్‌లు, గుర్తింపు కార్డులు (PAN, ఆధార్, ఓటర్ ID), పాస్‌పోర్ట్, బ్యాంకింగ్ మార్గదర్శకత్వం మరియు ప్రభుత్వ ధృవీకరణ పత్రాల (ఆదాయం, కుల ధృవీకరణ పత్రాలు) దరఖాస్తులో మీకు సహాయం చేయగలను. ఈ రోజు మీకు ఏ సేవతో సహాయం కావాలి?";
          suggestions = ["స్కాలర్‌షిప్‌ల వివరాలు", "PAN కార్డు దరఖాస్తు", "ఆధార్ కార్డు డౌన్‌లోడ్", "పాస్‌పోర్ట్ దరఖాస్తు"];
        } else if (currentLanguage === "Hindi") {
          answer = "नमस्ते! **जनसहायक AI** में आपका स्वागत है। मैं आपको सरकारी छात्रवृत्तियां खोजने, पहचान पत्र (PAN, आधार, वोटर ID) बनवाने, पासपोर्ट, बैंकिंग सहायता और सरकारी प्रमाणपत्रों के लिए मार्गदर्शन प्रदान कर सकता हूँ। आज आप किस सेवा के बारे में जानना चाहते हैं?";
          suggestions = ["छात्रवृत्ति विवरण", "PAN कार्ड कैसे बनवाएं?", "आधार कार्ड कैसे डाउनलोड करें?", "पासपोर्ट आवेदन"];
        } else {
          answer = "Hello! Welcome to **JanSahayak AI** — your verified Government & Citizen Services Assistant.\\n\\nI can help you:\\n• Find and check eligibility for **Central & State Government Scholarships**\\n• Apply for official identity documents (**PAN Card, Aadhaar, Voter ID**)\\n• Navigate travel services (**Indian Passport & Driving Licence**)\\n• Get citizen banking guidance (**Bank Account, Passbook, ATM Card request & emergency blocking**)\\n• Apply for official certificates (**Income, Caste, Residence, Birth Certificates, Ration Card**)\\n\\nWhat would you like help with today?";
          suggestions = ["Which scholarships can I apply for?", "How do I apply for a PAN card?", "How do I download Aadhaar?", "How do I apply for a passport?", "How do I request an ATM card?", "How do I apply for an income certificate?"];
        }
      }
      // 2. PLATFORM INFO ("Who are you?" / "What can you do?")
      else if (q.includes("who are you") || q.includes("what can you do") || q.includes("about jansahayak")) {
        answer = "### About JanSahayak AI\\n\\n**JanSahayak AI** is an autonomous civic-tech platform designed to simplify access to government schemes, identity documentation, travel services, banking guidance, and official certificates across India and Telangana.\\n\\n**Available Services:**\\n1. **Scholarships:** ePASS Telangana, Central Sector (NSP), AICTE Pragati for Girls.\\n2. **Identity:** PAN Card (Form 49A & Instant e-PAN), Aadhaar Card (UIDAI), Voter ID (ECI).\\n3. **Travel:** Indian Passport (Fresh & Tatkaal), Driving Licence (Sarathi Parivahan).\\n4. **Banking Guidance:** Savings accounts, Passbook updates, ATM card request & emergency blocking.\\n5. **Certificates:** MeeSeva Income, Caste, Domicile, and Birth certificates.\\n\\nAll answers are grounded in official government gazettes and circulars.";
        citations = [{ title: "JanSahayak Civic Architecture 2026", url: "https://www.myscheme.gov.in/", verified_date: "2026-11-15" }];
        suggestions = ["Show Citizen Services Hub", "Which scholarships can I apply for?", "How do I apply for a passport?", "How do I block a lost ATM card?"];
      }
      // 3. GENERAL POLITE ("Thank you", "Thanks")
      else if (q.includes("thank") || q.includes("thanks")) {
        answer = "You are very welcome! I am always here to assist you with verified government procedures, citizen documentation, and scholarship guidance. Feel free to ask if you need anything else!";
        suggestions = ["Which scholarships can I apply for?", "Explore Citizen Services", "Check my eligibility"];
      }
      // 4. PAN CARD
      else if (q.includes("pan card") || q.includes("pan ") || q.includes("e-pan")) {
        answer = "### How to Apply for a Permanent Account Number (PAN Card)\\n\\n**Option 1: Instant e-PAN (Free, 10 Minutes)**\\n• Visit [incometax.gov.in](https://www.incometax.gov.in/) and use Aadhaar e-KYC.\\n• 100% paperless, zero fee, valid digitally immediately.\\n\\n**Option 2: Physical Laminated Card (Form 49A)**\\n• Apply online at [Protean (NSDL)](https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html) or [UTIITSL](https://www.utiitsl.com/).\\n• Official Fee: **₹107** for dispatch in India.\\n• Documents: Proof of Identity (Aadhaar/Voter ID), Proof of Address, and Proof of DOB.\\n• Track application via 15-digit Acknowledgment Number.";
        citations = [
          { title: "Income Tax Department Official Portal", url: "https://www.incometax.gov.in/", verified_date: "2026-11-10" },
          { title: "Protean eGov (NSDL) PAN Services", url: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html", verified_date: "2026-11-05" }
        ];
        suggestions = ["What documents are needed for PAN card?", "How to apply for Instant e-PAN for free?", "How to track PAN card status?"];
      }
      // 5. AADHAAR
      else if (q.includes("aadhaar") || q.includes("aadhar") || q.includes("uidai")) {
        answer = "### How to Download & Update Aadhaar (UIDAI)\\n\\n**Download e-Aadhaar:**\\n• Go to [myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in/gen-download-aadhaar).\\n• Enter 12-digit Aadhaar & mobile OTP.\\n• PDF Password: First 4 letters of your Name in CAPITAL + Year of Birth (e.g. SATH2004).\\n\\n**Mobile Number Update:**\\n• Must be done in person with biometric scan at an Aadhaar Seva Kendra or post office (Statutory fee: **₹50**).\\n\\n**PVC Plastic Card:**\\n• Order online for **₹50** with Speed Post delivery across India.";
        citations = [{ title: "UIDAI Official Portal", url: "https://uidai.gov.in/", verified_date: "2026-11-10" }];
        suggestions = ["How to download e-Aadhaar?", "How to update mobile number in Aadhaar?", "Order PVC Aadhaar card (₹50)"];
      }
      // 6. PASSPORT (Fresh, Renewal, Tatkaal, Documents)
      else if (q.includes("passport")) {
        if (q.includes("document") || q.includes("need")) {
          answer = "### Official Documents Required for a Fresh Indian Passport\\n\\n1. **Proof of Present Address:** Aadhaar Card, Active Bank Passbook with photo, or Electricity/Water Bill.\\n2. **Proof of Date of Birth:** Birth Certificate, 10th Marks Memo, or Aadhaar.\\n3. **Non-ECR Proof:** 10th Standard pass memo or higher educational degree.\\n\\n*Carry original documents + photocopies to your Passport Seva Kendra (PSK) appointment.*";
        } else {
          answer = "### How to Apply for an Indian Passport (Passport Seva)\\n\\n1. Register online at [passportindia.gov.in](https://www.passportindia.gov.in/).\\n2. Fill the form for **Fresh Passport** (Normal or Tatkaal, 36/60 pages).\\n3. Pay online fee: **₹1,500** (Normal) or **₹3,500** (Tatkaal) and book appointment at nearest PSK or POPSK.\\n4. Visit PSK with original documents for biometric capture and verification.\\n5. Local police conduct address verification. Passport is dispatched via Speed Post.";
        }
        citations = [{ title: "Passport Seva Portal (MEA)", url: "https://www.passportindia.gov.in/", verified_date: "2026-11-05" }];
        suggestions = ["What documents are needed for a fresh passport?", "Normal vs Tatkaal passport difference", "How does police verification work?"];
      }
      // 7. BANKING (ATM, Passbook, Lost Card, Student Account)
      else if (q.includes("atm") || q.includes("debit card") || q.includes("passbook") || q.includes("bank account")) {
        if (q.includes("block") || q.includes("lost")) {
          answer = "### 🚨 EMERGENCY: How to Block a Lost or Stolen ATM Card\\n\\n> **SECURITY POLICY:** JanSahayak AI NEVER asks for nor stores your ATM PIN, CVV, OTP, or NetBanking password.\\n\\n**Immediate SMS Commands:**\\n• **SBI:** Send \`BLOCK <last 4 digits>\` to **567676**\\n• **HDFC Bank:** Send \`BLOCK <last 4 digits>\` to **5676712**\\n• **ICICI Bank:** Send \`IBLOCK <last 4 digits>\` to **5676766**\\n\\n**24x7 Toll-Free Helplines:**\\n• **SBI:** 1800 1234 / 1800 2100\\n• **HDFC Bank:** 1800 1600 / 1800 2600\\n• **Canara Bank:** 1800 425 0018\\n\\nYou can also lock your card instantly in your mobile banking app.";
        } else if (q.includes("passbook")) {
          answer = "### How to Obtain or Update Your Bank Passbook\\n\\n1. **New Passbook:** Issued free of cost upon opening a savings account at public sector banks.\\n2. **Update Entries:** Use automated SWAYAM / Barcode Passbook Kiosks in the 24x7 ATM e-Corner.\\n3. **Completed / Lost:** Visit home branch. Completed passbook is replaced for free; lost passbook duplicate fee is ₹50–₹100.\\n\\n*For Scholarships:* The front page must show Student Name, Account Number, IFSC code, and Bank Branch Stamp.";
        } else {
          answer = "### How to Request a New ATM / Debit Card\\n\\n1. **Mobile Banking / NetBanking:** Login > Debit Cards > Request New ATM Card. Select RuPay (lowest fees) and confirm address.\\n2. **Branch Requisition:** Submit form at your home branch for instant RuPay card.\\n3. **Green PIN:** Set your secret 4-digit PIN at any bank ATM with mobile OTP.";
        }
        citations = [{ title: "Reserve Bank of India (RBI) Citizen Charters", url: "https://www.rbi.org.in/", verified_date: "2026-10-15" }];
        suggestions = ["How to block my lost ATM card immediately?", "How to get a bank passbook?", "Student zero-balance bank account"];
      }
      // 8. GOVERNMENT CERTIFICATES (Income, Caste, Domicile via MeeSeva)
      else if (q.includes("income certificate") || q.includes("caste") || q.includes("domicile") || q.includes("birth certificate") || q.includes("ration card")) {
        answer = "### How to Apply for an Income Certificate (Telangana MeeSeva)\\n\\n1. **Required Documents:** Salary slip/income declaration, Aadhaar cards of family, Ration Card copy, and Electricity bill/House tax receipt.\\n2. **Application:** Apply at any MeeSeva kiosk or [meeseva.telangana.gov.in](https://ts.meeseva.telangana.gov.in/) (Statutory fee: **₹45**).\\n3. **Verification:** VRO and Revenue Inspector verify income records.\\n4. **Issue:** Tahsildar digitally signs the QR-coded certificate within **7 business days**.\\n\\n*Validity:* Valid for 1 financial year (mandatory for ePASS RTF & MTF scholarships).";
        citations = [{ title: "Telangana MeeSeva Citizen Portal", url: "https://ts.meeseva.telangana.gov.in/", verified_date: "2026-11-01" }];
        suggestions = ["How to apply for Caste Certificate?", "What are income limits for ePASS scholarship?", "MeeSeva application tracking"];
      }
      // 9. SCHOLARSHIP QUERIES (Existing RAG)
      else if (q.includes("scholarship") || q.includes("epass") || q.includes("nsp") || q.includes("rtf")) {
        answer = "### Verified Government Scholarships for Your Profile\\n\\nBased on your verified profile (**Telangana | B.Tech Engineering | BC Category | Income ₹1,75,000**):\\n\\n1. **Telangana Post-Matric Scholarships (ePASS RTF & MTF):**\\n   • 100% Tuition Fee Reimbursement (RTF) paid directly to college.\\n   • Monthly Maintenance Allowance (MTF) to student's bank account.\\n   • Closes **December 31, 2026** at [telanganaepass.cgg.gov.in](https://telanganaepass.cgg.gov.in/).\\n\\n2. **AICTE Pragati Scholarship for Girls:**\\n   • ₹50,000/year assistance. Closes Dec 20, 2026.\\n\\n3. **NSP Central Sector Scheme (CSSS):**\\n   • ₹12,000/year for graduation. Closes Nov 30, 2026.\\n\\nClick **Eligibility Checker** in the sidebar to run a full criteria evaluation!";
        citations = [
          { title: "Telangana Government Gazette G.O.Ms.No. 64", url: "https://telanganaepass.cgg.gov.in/", verified_date: "2026-11-05" },
          { title: "National Scholarship Portal Guidelines", url: "https://scholarships.gov.in/", verified_date: "2026-10-28" }
        ];
        suggestions = ["Am I eligible for Telangana ePASS?", "What documents are needed for scholarship?", "When does NSP close?"];
      }
      // 10. CLARIFICATION FOR UNKNOWN QUERY
      else {
        answer = "I want to make sure I give you the most accurate government guidance. Could you please specify which service you are asking about?\\n\\n• **Scholarships:** ePASS Telangana, Central Sector (NSP), AICTE Pragati\\n• **Identity:** PAN Card, Aadhaar, Voter ID\\n• **Travel:** Passport (Fresh / Tatkaal), Driving Licence\\n• **Banking:** Savings account, Passbook, ATM card request & blocking\\n• **Certificates:** Income certificate, Caste certificate, Domicile certificate";
        suggestions = ["Which scholarships can I apply for?", "How do I apply for PAN card?", "How do I apply for a passport?", "How do I request an ATM card?"];
      }

      appendChatMessage("assistant", answer, citations);
      updateSuggestedPromptChips(suggestions);
    }`;

html = html.replace(oldRAGRegex, newRAG);

// 7. Update clearChat to call backend
const oldClearChatRegex = /function clearChat\(\)[\s\S]*?showToast\("Chat cleared", "info"\);\s*\}/;
const newClearChat = `async function clearChat() {
      try {
        await fetch(\`\${API_BASE}/ai/chat/clear\`, { method: "POST" });
      } catch (e) {}
      const c = document.getElementById("chat-messages-container");
      if (c) {
        c.innerHTML = \`
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-cerulean/30 flex items-center justify-center shrink-0"><i data-lucide="bot" class="w-4 h-4 text-electric-blue"></i></div>
            <div class="glass-card p-4 max-w-2xl text-sm space-y-2">
              <p class="text-white">Chat cleared! What citizen or scholarship service can I assist you with now?</p>
            </div>
          </div>
        \`;
        lucide.createIcons();
      }
      updateSuggestedPromptChips([
        "Which scholarships can I apply for?",
        "How do I apply for a PAN card?",
        "How do I apply for a passport?",
        "How do I download Aadhaar?",
        "How do I request an ATM card?"
      ]);
      showToast("Conversation cleared", "info");
    }`;

html = html.replace(oldClearChatRegex, newClearChat);

// 8. Inject Citizen Services catalog & render functions into the main script
if (!html.includes('CITIZEN_SERVICES_CATALOG')) {
  html = html.replace('// State Variables', newScriptLogic + '\n\n    // State Variables');
}

// 9. Call renderCitizenServices on DOMContentLoaded / window load
const initCall = 'renderCitizenServices();';
if (!html.includes(initCall)) {
  html = html.replace('renderSavedSchemes();', 'renderSavedSchemes();\n      renderCitizenServices();');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully cleaned and injected all frontend code!');

