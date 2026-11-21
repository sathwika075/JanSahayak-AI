const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.resolve(__dirname, '../frontend/index.html');
let html = fs.readFileSync(targetFile, 'utf8');

// =========================================================================
// 1. UPDATE LANGUAGE SELECTOR IN TOP HEADER
// =========================================================================
const oldHeaderLangs = `<div class="flex items-center bg-[#151B27] border border-white/10 rounded-xl p-1 text-xs">
          <button onclick="setLanguage('English')" id="lang-en"
            class="px-3 py-1.5 rounded-lg bg-electric-blue text-black font-semibold transition">English</button>
          <button onclick="setLanguage('Telugu')" id="lang-te"
            class="px-3 py-1.5 rounded-lg text-muted-grey hover:text-white transition">తెలుగు</button>
          <button onclick="setLanguage('Hindi')" id="lang-hi"
            class="px-3 py-1.5 rounded-lg text-muted-grey hover:text-white transition">हिन्दी</button>
        </div>`;

const newHeaderLangs = `<div class="flex items-center bg-[#151B27] border border-white/10 rounded-xl p-1 text-xs gap-1">
          <select id="language-select" onchange="setLanguage(this.value)" class="bg-[#10131B] text-white text-xs border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-electric-blue">
            <option value="English" selected>🌐 English</option>
            <option value="Telugu">తెలుగు (Telugu)</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
            <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
            <option value="Malayalam">മലയാളം (Malayalam)</option>
            <option value="Marathi">मराठी (Marathi)</option>
            <option value="Bengali">বাংলা (Bengali)</option>
          </select>
          <button id="tts-global-toggle-btn" onclick="toggleGlobalSpeech()" title="Toggle AI Voice Output" class="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-grey hover:text-white transition flex items-center gap-1">
            <i data-lucide="volume-2" id="tts-global-icon" class="w-3.5 h-3.5 text-electric-blue"></i>
            <span class="text-[11px] hidden sm:inline" id="tts-global-label">Voice ON</span>
          </button>
        </div>`;

if (html.includes(oldHeaderLangs)) {
  html = html.replace(oldHeaderLangs, newHeaderLangs);
  console.log('✅ Updated header language dropdown with 8 languages & Voice toggle!');
} else {
  console.log('Header language block not matched directly, checking normalized search...');
}

// =========================================================================
// 2. ENHANCE CHAT INPUT CONTROLS (RECORDING WAVEFORM, REPLAY, STOP SPEAKING)
// =========================================================================
const oldChatControls = `<form onsubmit="handleChatSubmit(event)" class="pt-3 border-t border-white/5 flex items-center gap-2">
          <input type="text" id="chat-input"
            placeholder="Ask about scholarships, eligibility, income limits, or documents..."
            class="flex-1 bg-[#10131B] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue transition placeholder:text-muted-grey/60"
            autocomplete="off">

          <button type="button" onclick="startVoiceRecognition()" id="mic-btn" title="Voice Input"
            class="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-muted-grey hover:text-white transition">
            <i data-lucide="mic" class="w-5 h-5"></i>
          </button>

          <button type="submit"
            class="btn-gradient px-5 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-cerulean/20 transition">
            <span>Send</span>
            <i data-lucide="send" class="w-4 h-4"></i>
          </button>
        </form>`;

const newChatControls = `<!-- Live Voice Recording Waveform & Control Bar -->
        <div id="voice-recording-bar" class="hidden mb-2 p-3 rounded-xl bg-[#151B27] border border-electric-blue/40 flex items-center justify-between animate-pulse">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1" id="voice-waveform-animation">
              <span class="w-1 h-3 bg-neon-rose rounded-full animate-bounce"></span>
              <span class="w-1 h-6 bg-electric-blue rounded-full animate-bounce delay-100"></span>
              <span class="w-1 h-4 bg-cerulean rounded-full animate-bounce delay-200"></span>
              <span class="w-1 h-7 bg-success-green rounded-full animate-bounce delay-300"></span>
              <span class="w-1 h-3 bg-neon-rose rounded-full animate-bounce delay-150"></span>
            </div>
            <div>
              <p class="text-xs font-semibold text-white flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-neon-rose animate-ping"></span>
                <span id="voice-status-text">Listening... Speak now</span>
              </p>
              <p class="text-[11px] text-muted-grey font-mono" id="voice-interim-text">Microphone capture in progress...</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" onclick="stopVoiceRecognition(false)" class="px-3 py-1.5 rounded-lg bg-neon-rose/20 hover:bg-neon-rose/30 text-neon-rose border border-neon-rose/40 text-xs font-semibold flex items-center gap-1 transition">
              <i data-lucide="square" class="w-3.5 h-3.5 fill-neon-rose"></i> Stop Recording
            </button>
            <button type="button" onclick="stopVoiceRecognition(true)" class="px-3 py-1.5 rounded-lg bg-success-green/20 hover:bg-success-green/30 text-success-green border border-success-green/40 text-xs font-semibold flex items-center gap-1 transition">
              <i data-lucide="send" class="w-3.5 h-3.5"></i> Submit Speech
            </button>
          </div>
        </div>

        <!-- Global Active TTS Speech Controller Bar -->
        <div id="tts-active-bar" class="hidden mb-2 p-2.5 rounded-xl bg-cerulean/20 border border-electric-blue/30 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-white">
            <i data-lucide="volume-2" class="w-4 h-4 text-electric-blue animate-pulse"></i>
            <span>JanSahayak Voice Assistant is speaking...</span>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" onclick="stopSpeechSynthesis()" class="px-2.5 py-1 rounded-lg bg-neon-rose/20 hover:bg-neon-rose/30 text-neon-rose text-xs font-medium flex items-center gap-1 transition">
              <i data-lucide="volume-x" class="w-3.5 h-3.5"></i> Stop Speaking
            </button>
            <button type="button" onclick="replayLastAssistantAnswer()" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1 transition">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Replay
            </button>
          </div>
        </div>

        <!-- Chat Input Form -->
        <form onsubmit="handleChatSubmit(event)" class="pt-3 border-t border-white/5 flex items-center gap-2">
          <input type="text" id="chat-input"
            placeholder="Ask about scholarships, eligibility, income limits, or documents..."
            class="flex-1 bg-[#10131B] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue transition placeholder:text-muted-grey/60"
            autocomplete="off">

          <button type="button" onclick="toggleVoiceRecognition()" id="mic-btn" title="Click to Speak (Speech-to-Text)"
            class="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-muted-grey hover:text-white transition flex items-center justify-center">
            <i data-lucide="mic" id="mic-icon" class="w-5 h-5 text-electric-blue"></i>
          </button>

          <button type="submit" id="chat-submit-btn"
            class="btn-gradient px-5 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-cerulean/20 transition">
            <span id="chat-submit-label">Send</span>
            <i data-lucide="send" class="w-4 h-4"></i>
          </button>
        </form>`;

if (html.includes(oldChatControls)) {
  html = html.replace(oldChatControls, newChatControls);
  console.log('✅ Replaced chat controls with full Waveform, Stop Recording, Replay, and Mic button!');
} else {
  console.log('Chat controls block not matched directly, checking substring...');
}

fs.writeFileSync(targetFile, html, 'utf8');
console.log('Saved partial updates to frontend/index.html');

