const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.resolve(__dirname, '../frontend/index.html');
let html = fs.readFileSync(targetFile, 'utf8');

// Find existing startVoiceRecognition function to replace it cleanly
const oldVoiceStart = 'function startVoiceRecognition() {';
const oldVoiceEnd = '// Document OCR Demo & Handlers';

const vStart = html.indexOf(oldVoiceStart);
const vEnd = html.indexOf(oldVoiceEnd);

if (vStart === -1 || vEnd === -1) {
  console.error('Could not find startVoiceRecognition block! vStart:', vStart, 'vEnd:', vEnd);
  process.exit(1);
}

const newVoiceAndDashboardCode = `// =========================================================================
    // MULTILINGUAL VOICE ASSISTANT ENGINE (STT & TTS WITH 8 LANGUAGES)
    // =========================================================================
    let activeSpeechRecognition = null;
    let isVoiceListening = false;
    let isTtsVoiceEnabled = true;
    let lastSpokenText = "";
    let lastSpokenLang = "en-IN";

    // Standard BCP-47 Language Tag Mapping
    const LANGUAGE_SPEECH_MAP = {
      'English': { stt: 'en-IN', tts: 'en-IN', name: 'English (India)' },
      'Telugu': { stt: 'te-IN', tts: 'te-IN', name: 'తెలుగు (Telugu)' },
      'Hindi': { stt: 'hi-IN', tts: 'hi-IN', name: 'हिन्दी (Hindi)' },
      'Tamil': { stt: 'ta-IN', tts: 'ta-IN', name: 'தமிழ் (Tamil)' },
      'Kannada': { stt: 'kn-IN', tts: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
      'Malayalam': { stt: 'ml-IN', tts: 'ml-IN', name: 'മലയാളം (Malayalam)' },
      'Marathi': { stt: 'mr-IN', tts: 'mr-IN', name: 'मराठी (Marathi)' },
      'Bengali': { stt: 'bn-IN', tts: 'bn-IN', name: 'বাংলা (Bengali)' }
    };

    function toggleGlobalSpeech() {
      isTtsVoiceEnabled = !isTtsVoiceEnabled;
      const label = document.getElementById('tts-global-label');
      const icon = document.getElementById('tts-global-icon');
      if (isTtsVoiceEnabled) {
        if (label) label.innerText = "Voice ON";
        if (icon) icon.className = "w-3.5 h-3.5 text-electric-blue";
        showToast("AI Voice Readout Enabled", "info");
      } else {
        stopSpeechSynthesis();
        if (label) label.innerText = "Voice Muted";
        if (icon) icon.className = "w-3.5 h-3.5 text-muted-grey";
        showToast("AI Voice Readout Muted", "info");
      }
    }

    function toggleVoiceRecognition() {
      if (isVoiceListening) {
        stopVoiceRecognition(false);
      } else {
        startVoiceRecognition();
      }
    }

    function startVoiceRecognition() {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        showToast("Speech recognition is not supported in this browser. Please use Chrome/Edge or type your message.", "error");
        return;
      }

      // Stop any active AI speech before recording
      stopSpeechSynthesis();

      try {
        if (activeSpeechRecognition) {
          activeSpeechRecognition.abort();
        }

        const rec = new SpeechRec();
        activeSpeechRecognition = rec;
        
        const langConfig = LANGUAGE_SPEECH_MAP[currentLanguage] || LANGUAGE_SPEECH_MAP['English'];
        rec.lang = langConfig.stt;
        rec.continuous = true;
        rec.interimResults = true;
        rec.maxAlternatives = 1;

        const waveBar = document.getElementById('voice-recording-bar');
        const statusText = document.getElementById('voice-status-text');
        const interimText = document.getElementById('voice-interim-text');
        const micIcon = document.getElementById('mic-icon');
        const micBtn = document.getElementById('mic-btn');

        rec.onstart = () => {
          isVoiceListening = true;
          if (waveBar) waveBar.classList.remove('hidden');
          if (statusText) statusText.innerText = \`Listening in \${langConfig.name}... Speak now\`;
          if (interimText) interimText.innerText = "Listening for your voice...";
          if (micIcon) {
            micIcon.className = "w-5 h-5 text-neon-rose animate-ping";
          }
          if (micBtn) {
            micBtn.className = "p-3 rounded-xl bg-neon-rose/20 text-neon-rose border border-neon-rose/40 transition flex items-center justify-center";
          }
        };

        rec.onresult = (ev) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = ev.resultIndex; i < ev.results.length; ++i) {
            if (ev.results[i].isFinal) {
              finalTranscript += ev.results[i][0].transcript;
            } else {
              interimTranscript += ev.results[i][0].transcript;
            }
          }

          const chatInput = document.getElementById("chat-input");
          if (finalTranscript) {
            chatInput.value = (chatInput.value + ' ' + finalTranscript).trim();
          }
          if (interimText) {
            interimText.innerText = interimTranscript || finalTranscript || "Transcribing...";
          }
        };

        rec.onerror = (ev) => {
          console.warn("Speech recognition error:", ev.error);
          if (ev.error === 'not-allowed') {
            showToast("Microphone permission was denied. Please allow microphone access in your browser settings.", "error");
          } else if (ev.error === 'no-speech') {
            // Handled silently
          } else {
            showToast(\`Voice input notice: \${ev.error}\`, "info");
          }
          cleanupVoiceUI();
        };

        rec.onend = () => {
          cleanupVoiceUI();
        };

        rec.start();
      } catch (err) {
        console.error("Microphone start failed:", err);
        showToast("Could not access microphone: " + err.message, "error");
        cleanupVoiceUI();
      }
    }

    function stopVoiceRecognition(autoSubmit = false) {
      if (activeSpeechRecognition) {
        try {
          activeSpeechRecognition.stop();
        } catch(e) {}
        activeSpeechRecognition = null;
      }
      cleanupVoiceUI();

      if (autoSubmit) {
        const input = document.getElementById("chat-input");
        if (input && input.value.trim()) {
          handleChatSubmit(new Event('submit'));
        } else {
          showToast("No speech was detected to submit. Please try speaking again.", "info");
        }
      }
    }

    function cleanupVoiceUI() {
      isVoiceListening = false;
      const waveBar = document.getElementById('voice-recording-bar');
      if (waveBar) waveBar.classList.add('hidden');
      const micIcon = document.getElementById('mic-icon');
      if (micIcon) micIcon.className = "w-5 h-5 text-electric-blue";
      const micBtn = document.getElementById('mic-btn');
      if (micBtn) micBtn.className = "p-3 rounded-xl bg-white/5 hover:bg-white/10 text-muted-grey hover:text-white transition flex items-center justify-center";
    }

    // Text-To-Speech (TTS) Readout
    function speakText(text, lang = currentLanguage) {
      if (!isTtsVoiceEnabled || !('speechSynthesis' in window)) return;

      stopSpeechSynthesis();

      // Clean markdown tags and emojis for clean natural voice pronunciation
      const cleanText = text
        .replace(/[*#_\`\\[\\]()]/g, '')
        .replace(/₹/g, 'Rupees ')
        .replace(/https?:\\/\\/\\S+/g, 'link provided')
        .slice(0, 450); // Keep speech natural and concise

      const langConfig = LANGUAGE_SPEECH_MAP[lang] || LANGUAGE_SPEECH_MAP['English'];
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = langConfig.tts;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      lastSpokenText = cleanText;
      lastSpokenLang = langConfig.tts;

      const ttsBar = document.getElementById('tts-active-bar');

      utterance.onstart = () => {
        if (ttsBar) ttsBar.classList.remove('hidden');
      };

      utterance.onend = () => {
        if (ttsBar) ttsBar.classList.add('hidden');
      };

      utterance.onerror = () => {
        if (ttsBar) ttsBar.classList.add('hidden');
      };

      window.speechSynthesis.speak(utterance);
    }

    function stopSpeechSynthesis() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      const ttsBar = document.getElementById('tts-active-bar');
      if (ttsBar) ttsBar.classList.add('hidden');
    }

    function replayLastAssistantAnswer() {
      if (!lastSpokenText) {
        showToast("No recent response to replay.", "info");
        return;
      }
      if ('speechSynthesis' in window) {
        stopSpeechSynthesis();
        const utterance = new SpeechSynthesisUtterance(lastSpokenText);
        utterance.lang = lastSpokenLang || 'en-IN';
        const ttsBar = document.getElementById('tts-active-bar');
        utterance.onstart = () => { if (ttsBar) ttsBar.classList.remove('hidden'); };
        utterance.onend = () => { if (ttsBar) ttsBar.classList.add('hidden'); };
        utterance.onerror = () => { if (ttsBar) ttsBar.classList.add('hidden'); };
        window.speechSynthesis.speak(utterance);
      }
    }

    // =========================================================================
    // DYNAMIC DASHBOARD CALCULATION & RECENT ACTIVITY ENGINE
    // =========================================================================
    function updateDashboardMetrics() {
      // 1. Calculate Profile Completion Percentage from actual fields
      const name = (document.getElementById("prof-name")?.value || "").trim();
      const email = (document.getElementById("prof-email")?.value || "").trim();
      const state = (document.getElementById("prof-state")?.value || "").trim();
      const district = (document.getElementById("prof-district")?.value || "").trim();
      const edu = (document.getElementById("prof-edu")?.value || "").trim();
      const course = (document.getElementById("prof-course")?.value || "").trim();
      const category = (document.getElementById("prof-cat")?.value || "").trim();
      const income = Number(document.getElementById("prof-income")?.value || 0);

      const fields = [name, email, state, district, edu, course, category, income > 0];
      const filled = fields.filter(Boolean).length;
      const pct = Math.round((filled / fields.length) * 100);

      const pctEl = document.getElementById("dash-profile-pct");
      if (pctEl) pctEl.innerText = \`\${pct}% Complete\`;
      const fillBar = document.getElementById("dash-progress-fill");
      if (fillBar) fillBar.style.width = \`\${pct}%\`;

      // 2. Verified Schemes Count
      const totalSchemes = (allSchemes && allSchemes.length) ? allSchemes.length : FALLBACK_SCHEMES.length;
      const statTotal = document.getElementById("dash-stat-total-schemes");
      if (statTotal) statTotal.innerText = \`\${totalSchemes} Verified\`;

      // 3. Matched Eligible Schemes Calculation
      const matched = (allSchemes || FALLBACK_SCHEMES).filter(s => {
        if (s.income_limit && income > s.income_limit) return false;
        if (s.category_eligible && !s.category_eligible.includes("All") && !s.category_eligible.includes(category)) return false;
        if (s.education_level && !s.education_level.includes(edu)) return false;
        return true;
      });

      const statMatched = document.getElementById("dash-stat-matched-schemes");
      if (statMatched) statMatched.innerText = \`\${matched.length} Schemes\`;

      const profileSummary = document.getElementById("dash-profile-summary");
      if (profileSummary) {
        profileSummary.innerHTML = \`We evaluated your income (₹\${income.toLocaleString('en-IN')}) and \${category} category: <strong class="text-white">\${matched.length} schemes currently matched</strong> with official application portals ready.\`;
      }

      // 4. Closest Upcoming Deadline from Catalog
      let closestScheme = null;
      let closestDate = null;
      (allSchemes || FALLBACK_SCHEMES).forEach(s => {
        if (s.application_deadline) {
          const d = new Date(s.application_deadline);
          if (!isNaN(d.getTime())) {
            if (!closestDate || d < closestDate) {
              closestDate = d;
              closestScheme = s;
            }
          }
        }
      });

      const deadlineEl = document.getElementById("dash-stat-next-deadline");
      const deadlineSchemeEl = document.getElementById("dash-stat-deadline-scheme");
      if (deadlineEl && closestDate) {
        const formatted = closestDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
        deadlineEl.innerText = formatted;
        if (deadlineSchemeEl && closestScheme) {
          deadlineSchemeEl.innerText = \`\${closestScheme.name.slice(0, 24)}...\`;
        }
      }

      // 5. Missing Documents Verification Notice
      const missingAlert = document.getElementById("dash-missing-docs-text");
      if (missingAlert) {
        if (income > 0) {
          missingAlert.innerHTML = \`Active income (₹\${income.toLocaleString('en-IN')}) verified. Please ensure your <strong>MeeSeva Income Certificate</strong> is dated after April 1st of current financial year for ePASS submission.\`;
        } else {
          missingAlert.innerHTML = \`Please complete your annual family income field in Profile to identify mandatory income certificates.\`;
        }
      }

      // 6. Populate Saved Portals Grid on Dashboard
      renderDashboardSavedPortals();
    }

    function renderDashboardSavedPortals() {
      const container = document.getElementById("dash-saved-portals-list");
      if (!container) return;

      const defaultPortals = [
        { name: "Telangana ePASS Scholarship Portal", category: "Scholarships", url: "https://telanganaepass.cgg.gov.in/", badge: "State Portal" },
        { name: "National Scholarship Portal (NSP)", category: "Central Govt", url: "https://scholarships.gov.in/fresh", badge: "Central" },
        { name: "Income Tax Instant e-PAN Portal", category: "Identity", url: "https://www.incometax.gov.in/iec/foportal/", badge: "CBDT" },
        { name: "Passport Seva Kendra Portal", category: "Travel", url: "https://www.passportindia.gov.in/psp", badge: "MEA" }
      ];

      container.innerHTML = defaultPortals.map(p => \`
        <div class="p-2.5 rounded-xl bg-[#10131B] border border-white/5 flex items-center justify-between hover:border-neon-rose/30 transition">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-muted-grey">\${p.badge}</span>
            <span class="text-white text-xs font-medium">\${p.name}</span>
          </div>
          <button onclick="safeOpenPortal('\${p.url}', '\${p.name}')" class="text-xs text-electric-blue hover:underline flex items-center gap-1">
            Open <i data-lucide="external-link" class="w-3 h-3"></i>
          </button>
        </div>
      \`).join('');

      lucide.createIcons();
    }

    function quickAskFromDashboard(query) {
      switchTab('assistant');
      const input = document.getElementById("chat-input");
      if (input) {
        input.value = query;
        handleChatSubmit(new Event('submit'));
      }
    }
    
    `;

html = html.substring(0, vStart) + newVoiceAndDashboardCode + html.substring(vEnd);
fs.writeFileSync(targetFile, html, 'utf8');
console.log('✅ Injected full Voice Assistant Engine, TTS, and Dynamic Dashboard Calculation Engine!');

