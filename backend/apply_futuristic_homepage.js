const fs = require('fs');

const indexHtmlPath = 'c:/Nxtwave-Sathwika/jansahayak-ai/frontend/index.html';
let content = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Add HUMAN NEXT-style glowing animations and hero styling in <style>
const customStyles = `
    /* HUMAN NEXT Futuristic Design Language Extensions */
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    @keyframes floatSlow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-12px) rotate(1deg); }
    }
    @keyframes borderGlow {
      0%, 100% { border-color: rgba(0, 123, 167, 0.4); box-shadow: 0 0 25px rgba(0, 123, 167, 0.2); }
      50% { border-color: rgba(255, 45, 149, 0.5); box-shadow: 0 0 35px rgba(255, 45, 149, 0.25); }
    }
    .neon-glow-box {
      animation: borderGlow 6s infinite ease-in-out;
    }
    .glow-sphere-blue {
      background: radial-gradient(circle, rgba(0, 123, 167, 0.35) 0%, rgba(41, 182, 246, 0.1) 50%, transparent 70%);
      filter: blur(40px);
    }
    .glow-sphere-pink {
      background: radial-gradient(circle, rgba(255, 45, 149, 0.35) 0%, rgba(255, 45, 149, 0.08) 50%, transparent 70%);
      filter: blur(40px);
    }
    .futuristic-hero-card {
      background: linear-gradient(135deg, rgba(16, 19, 27, 0.85) 0%, rgba(10, 10, 15, 0.95) 100%);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
    }
    .futuristic-hero-card:hover {
      border-color: rgba(41, 182, 246, 0.4);
      box-shadow: 0 15px 35px -10px rgba(0, 123, 167, 0.3);
    }
    .futuristic-heading {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      letter-spacing: -0.04em;
      line-height: 1.05;
    }
    .human-next-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
`;

// Inject into <style> if not already present
if (!content.includes('HUMAN NEXT Futuristic Design Language Extensions')) {
  content = content.replace('</style>', `${customStyles}\n  </style>`);
}

// 2. Build the complete Futuristic Homepage HTML according to all 12 sections
const futuristicHomepageHtml = `    <!-- ======================================================== -->
    <!-- PAGE 1: HUMAN NEXT FUTURISTIC HOMEPAGE & DASHBOARD -->
    <!-- ======================================================== -->
    <section id="page-dashboard" class="space-y-12 pb-16">

      <!-- SECTION 2: HERO SECTION (FULL SCREEN FUTURISTIC AI HERO) -->
      <div class="relative overflow-hidden rounded-3xl futuristic-hero-card neon-glow-box p-8 md:p-14 lg:p-16">
        <!-- Ambient Glowing Neon Lighting Spheres -->
        <div class="absolute -top-24 -left-24 w-96 h-96 glow-sphere-blue pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 glow-sphere-pink pointer-events-none"></div>
        <div class="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-cerulean/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <!-- Hero Text Content -->
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full human-next-pill border border-electric-blue/30 text-xs font-mono text-electric-blue">
              <span class="w-2 h-2 rounded-full bg-neon-rose animate-pulse"></span>
              <span>NEXT-GEN CIVIC ARTIFICIAL INTELLIGENCE</span>
              <span class="text-white/40">|</span>
              <span class="text-white/80">TELANGANA & INDIA</span>
            </div>

            <h1 class="futuristic-heading text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase">
              YOUR GOVERNMENT.<br>
              <span class="gradient-text">YOUR RIGHTS.</span><br>
              YOUR JANSAHAYAK.
            </h1>

            <p class="text-base sm:text-lg text-muted-grey max-w-xl leading-relaxed">
              One intelligent platform for government services, scholarships, identity documents and citizen assistance. Powered by LangGraph multi-agent orchestration and official state data.
            </p>

            <!-- Prominent CTA Action Buttons -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button onclick="switchTab('services')"
                class="btn-gradient px-7 py-4 rounded-2xl text-white font-bold text-sm tracking-wide transition flex items-center justify-center gap-3 shadow-xl hover:shadow-cerulean/50 group">
                <i data-lucide="grid" class="w-5 h-5 text-white group-hover:scale-110 transition"></i>
                <span>Explore Government Services</span>
                <i data-lucide="arrow-right" class="w-4 h-4 text-white/70 group-hover:translate-x-1 transition"></i>
              </button>

              <button onclick="switchTab('assistant')"
                class="px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm tracking-wide transition flex items-center justify-center gap-3 border border-white/15 hover:border-neon-rose/50 group">
                <div class="w-2.5 h-2.5 rounded-full bg-neon-rose animate-ping"></div>
                <i data-lucide="bot" class="w-5 h-5 text-neon-rose"></i>
                <span>Talk to JanSahayak AI</span>
              </button>
            </div>

            <!-- Profile Sync Status Bar -->
            <div class="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-2">
                <span class="text-muted-grey font-mono">Profile Sync:</span>
                <span class="font-bold text-success-green" id="dash-profile-pct">92% Complete</span>
                <span class="text-white/30">•</span>
                <span class="text-white/70" id="dash-greeting-text">Namaste, Sathwika!</span>
              </div>
              <div class="w-44 bg-white/5 rounded-full h-2 overflow-hidden">
                <div id="dash-progress-fill" class="bg-gradient-to-r from-cerulean via-electric-blue to-neon-rose h-2 rounded-full w-[92%] transition-all duration-700"></div>
              </div>
              <button onclick="switchTab('profile')" class="text-electric-blue hover:underline font-mono">Edit Profile &rarr;</button>
            </div>
          </div>

          <!-- Hero Illustration: Glowing 3D AI Assistant Core -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              <!-- Outer Glowing Rotational Halo -->
              <div class="absolute inset-0 rounded-full border border-electric-blue/30 border-dashed animate-spin" style="animation-duration: 25s;"></div>
              <div class="absolute inset-4 rounded-full border border-neon-rose/25 border-dashed animate-spin" style="animation-duration: 18s; animation-direction: reverse;"></div>
              
              <!-- Core AI Visual Card -->
              <div class="w-56 h-56 rounded-3xl bg-gradient-to-br from-[#121622] via-[#0E1017] to-[#1A0B1A] border border-white/15 p-6 flex flex-col items-center justify-center text-center shadow-2xl relative z-10 backdrop-blur-xl">
                <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-cerulean via-electric-blue to-neon-rose p-[2px] shadow-lg shadow-cerulean/30 mb-3">
                  <div class="w-full h-full bg-[#0A0D14] rounded-2xl flex items-center justify-center">
                    <i data-lucide="sparkles" class="w-10 h-10 text-white animate-pulse"></i>
                  </div>
                </div>
                <h3 class="font-bold text-white text-base tracking-wide">JanSahayak AI</h3>
                <p class="text-[11px] text-electric-blue font-mono mt-0.5">Autonomous Gov Assistant</p>
                
                <div class="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-muted-grey">
                  <span class="w-1.5 h-1.5 rounded-full bg-success-green"></span>
                  <span>100% Grounded Sources</span>
                </div>
              </div>

              <!-- Floating Micro-Badges around Core -->
              <div class="absolute -top-2 right-4 px-3 py-1.5 rounded-xl bg-[#10131B]/90 border border-electric-blue/40 text-[11px] font-mono text-white shadow-xl flex items-center gap-1.5">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-success-green"></i> MeeSeva Verified
              </div>

              <div class="absolute -bottom-2 left-4 px-3 py-1.5 rounded-xl bg-[#10131B]/90 border border-neon-rose/40 text-[11px] font-mono text-white shadow-xl flex items-center gap-1.5">
                <i data-lucide="languages" class="w-3.5 h-3.5 text-neon-rose"></i> Telugu • Hindi • English
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LIVE CITIZEN STATS METRICS (Actual Backend Data) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="futuristic-hero-card p-5 rounded-2xl cursor-pointer" onclick="switchTab('services')">
          <div class="flex items-center justify-between text-muted-grey">
            <span class="text-xs uppercase font-mono tracking-wider">Citizen Services</span>
            <div class="p-2 rounded-xl bg-cerulean/20 text-electric-blue"><i data-lucide="landmark" class="w-4 h-4"></i></div>
          </div>
          <p class="text-3xl font-extrabold text-white mt-3" id="dash-stat-services-count">11 Active</p>
          <span class="text-xs text-electric-blue flex items-center gap-1 mt-1 font-mono">
            Identity, Travel, Banking &rarr;
          </span>
        </div>

        <div class="futuristic-hero-card p-5 rounded-2xl cursor-pointer" onclick="switchTab('finder')">
          <div class="flex items-center justify-between text-muted-grey">
            <span class="text-xs uppercase font-mono tracking-wider">Verified Schemes</span>
            <div class="p-2 rounded-xl bg-neon-rose/20 text-neon-rose"><i data-lucide="award" class="w-4 h-4"></i></div>
          </div>
          <p class="text-3xl font-extrabold text-white mt-3" id="dash-stat-total-schemes">8 Schemes</p>
          <span class="text-xs text-neon-rose flex items-center gap-1 mt-1 font-mono">
            ePASS, NSP, AICTE &rarr;
          </span>
        </div>

        <div class="futuristic-hero-card p-5 rounded-2xl cursor-pointer" onclick="switchTab('checker')">
          <div class="flex items-center justify-between text-muted-grey">
            <span class="text-xs uppercase font-mono tracking-wider">Eligible Schemes</span>
            <div class="p-2 rounded-xl bg-success-green/20 text-success-green"><i data-lucide="check-circle" class="w-4 h-4"></i></div>
          </div>
          <p class="text-3xl font-extrabold text-white mt-3" id="dash-stat-matched-schemes">2 Matched</p>
          <span class="text-xs text-success-green flex items-center gap-1 mt-1 font-mono" id="dash-stat-matched-desc">
            100% Criteria Pass &rarr;
          </span>
        </div>

        <div class="futuristic-hero-card p-5 rounded-2xl cursor-pointer" onclick="switchTab('guidance')">
          <div class="flex items-center justify-between text-muted-grey">
            <span class="text-xs uppercase font-mono tracking-wider">Upcoming Deadline</span>
            <div class="p-2 rounded-xl bg-warning-amber/20 text-warning-amber"><i data-lucide="calendar" class="w-4 h-4"></i></div>
          </div>
          <p class="text-2xl font-extrabold text-white mt-3" id="dash-stat-next-deadline">Dec 31, 2026</p>
          <span class="text-xs text-warning-amber flex items-center gap-1 mt-1 font-mono" id="dash-stat-deadline-scheme">
            ePASS RTF Fresh &rarr;
          </span>
        </div>
      </div>

      <!-- SECTION 3: GOVERNMENT SERVICES SECTION (INTERACTIVE CARDS) -->
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-electric-blue uppercase tracking-widest">
              <i data-lucide="layers" class="w-3.5 h-3.5"></i> Authorized Civic Architecture
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">Official Government Services</h2>
            <p class="text-sm text-muted-grey">Click any service to view step-by-step guidance, documents and verified portals.</p>
          </div>
          <button onclick="switchTab('services')" class="text-xs font-mono text-electric-blue hover:text-white flex items-center gap-1 transition">
            View All 11 Services <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- 11 Verified Interactive Service Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <!-- 1. PAN Card -->
          <div class="futuristic-hero-card p-5 rounded-2xl flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-xl bg-cerulean/20 text-electric-blue flex items-center justify-center group-hover:scale-110 transition">
                <i data-lucide="credit-card" class="w-6 h-6"></i>
              </div>
              <h3 class="text-base font-bold text-white">PAN Card</h3>
              <p class="text-xs text-muted-grey leading-relaxed">Form 49A, Instant e-PAN within 10 minutes via Aadhaar OTP, and physical laminated card.</p>
            </div>
            <button onclick="switchTab('guidance', 'pan-card')" class="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-electric-blue hover:text-black text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-white/10">
              <span>Explore Service</span> &rarr;
            </button>
          </div>

          <!-- 2. Aadhaar Card -->
          <div class="futuristic-hero-card p-5 rounded-2xl flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-xl bg-neon-rose/20 text-neon-rose flex items-center justify-center group-hover:scale-110 transition">
                <i data-lucide="fingerprint" class="w-6 h-6"></i>
              </div>
              <h3 class="text-base font-bold text-white">Aadhaar Card</h3>
              <p class="text-xs text-muted-grey leading-relaxed">Official e-Aadhaar PDF download, PVC plastic card ordering, and biometric mobile update guidance.</p>
            </div>
            <button onclick="switchTab('guidance', 'aadhaar-card')" class="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-neon-rose hover:text-black text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-white/10">
              <span>Explore Service</span> &rarr;
            </button>
          </div>

          <!-- 3. Indian Passport -->
          <div class="futuristic-hero-card p-5 rounded-2xl flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-xl bg-cerulean/20 text-electric-blue flex items-center justify-center group-hover:scale-110 transition">
                <i data-lucide="plane" class="w-6 h-6"></i>
              </div>
              <h3 class="text-base font-bold text-white">Passport</h3>
              <p class="text-xs text-muted-grey leading-relaxed">Fresh and Tatkaal passport applications, PSK appointment booking, and police verification roadmap.</p>
            </div>
            <button onclick="switchTab('guidance', 'passport-service')" class="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-electric-blue hover:text-black text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-white/10">
              <span>Explore Service</span> &rarr;
            </button>
          </div>

          <!-- 4. Voter ID Card -->
          <div class="futuristic-hero-card p-5 rounded-2xl flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-xl bg-success-green/20 text-success-green flex items-center justify-center group-hover:scale-110 transition">
                <i data-lucide="check-square" class="w-6 h-6"></i>
              </div>
              <h3 class="text-base font-bold text-white">Voter ID (EPIC)</h3>
              <p class="text-xs text-muted-grey leading-relaxed">100% Free Form 6 application for new voters (18+), digital e-EPIC download, and BLO verification.</p>
            </div>
            <button onclick="switchTab('guidance', 'voter-id')" class="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-success-green hover:text-black text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-white/10">
              <span>Explore Service</span> &rarr;
            </button>
          </div>

          <!-- 5. ATM & Debit Card -->
          <div class="futuristic-hero-card p-5 rounded-2xl flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-xl bg-warning-amber/20 text-warning-amber flex items-center justify-center group-hover:scale-110 transition">
                <i data-lucide="shield-alert" class="w-6 h-6"></i>
              </div>
              <h3 class="text-base font-bold text-white">ATM Card & Banking</h3>
              <p class="text-xs text-muted-grey leading-relaxed">Emergency 24x7 card blocking via SMS/helpline, new RuPay card request, and Green PIN generation.</p>
            </div>
            <button onclick="switchTab('guidance', 'atm-debit-card')" class="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-warning-amber hover:text-black text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-white/10">
              <span>Explore Service</span> &rarr;
            </button>
          </div>

          <!-- 6. Bank Passbook -->
          <div class="futuristic-hero-card p-5 rounded-2xl flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-xl bg-cerulean/20 text-electric-blue flex items-center justify-center group-hover:scale-110 transition">
                <i data-lucide="book-open" class="w-6 h-6"></i>
              </div>
              <h3 class="text-base font-bold text-white">Bank Passbook</h3>
              <p class="text-xs text-muted-grey leading-relaxed">Self-service SWAYAM kiosk updating, duplicate passbook request, and scholarship branch seal.</p>
            </div>
            <button onclick="switchTab('guidance', 'bank-passbook')" class="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-electric-blue hover:text-black text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-white/10">
              <span>Explore Service</span> &rarr;
            </button>
          </div>

          <!-- 7. Income Certificate -->
          <div class="futuristic-hero-card p-5 rounded-2xl flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-xl bg-neon-rose/20 text-neon-rose flex items-center justify-center group-hover:scale-110 transition">
                <i data-lucide="file-check" class="w-6 h-6"></i>
              </div>
              <h3 class="text-base font-bold text-white">Income Certificate</h3>
              <p class="text-xs text-muted-grey leading-relaxed">Telangana MeeSeva revenue department application (₹45 fee, valid 1 financial year for scholarships).</p>
            </div>
            <button onclick="switchTab('guidance', 'income-certificate')" class="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-neon-rose hover:text-black text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-white/10">
              <span>Explore Service</span> &rarr;
            </button>
          </div>

          <!-- 8. Caste Certificate -->
          <div class="futuristic-hero-card p-5 rounded-2xl flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-xl bg-cerulean/20 text-electric-blue flex items-center justify-center group-hover:scale-110 transition">
                <i data-lucide="award" class="w-6 h-6"></i>
              </div>
              <h3 class="text-base font-bold text-white">Caste Certificate</h3>
              <p class="text-xs text-muted-grey leading-relaxed">Integrated SC/ST/BC community certificate with permanent lifelong validity for education & jobs.</p>
            </div>
            <button onclick="switchTab('guidance', 'caste-certificate')" class="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-electric-blue hover:text-black text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-white/10">
              <span>Explore Service</span> &rarr;
            </button>
          </div>

          <!-- 9. Domicile / Residence Certificate -->
          <div class="futuristic-hero-card p-5 rounded-2xl flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-xl bg-success-green/20 text-success-green flex items-center justify-center group-hover:scale-110 transition">
                <i data-lucide="home" class="w-6 h-6"></i>
              </div>
              <h3 class="text-base font-bold text-white">Domicile Certificate</h3>
              <p class="text-xs text-muted-grey leading-relaxed">Local candidate residency proof under Presidential Order for 85% university admission quotas.</p>
            </div>
            <button onclick="switchTab('guidance', 'domicile-certificate')" class="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-success-green hover:text-black text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-white/10">
              <span>Explore Service</span> &rarr;
            </button>
          </div>

          <!-- 10. Driving Licence -->
          <div class="futuristic-hero-card p-5 rounded-2xl flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-xl bg-warning-amber/20 text-warning-amber flex items-center justify-center group-hover:scale-110 transition">
                <i data-lucide="car" class="w-6 h-6"></i>
              </div>
              <h3 class="text-base font-bold text-white">Driving Licence</h3>
              <p class="text-xs text-muted-grey leading-relaxed">Sarathi Parivahan Learner's Licence test online, slot booking, and smart card driving licence.</p>
            </div>
            <button onclick="switchTab('guidance', 'driving-licence')" class="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-warning-amber hover:text-black text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-white/10">
              <span>Explore Service</span> &rarr;
            </button>
          </div>

          <!-- 11. Government Scholarships -->
          <div class="futuristic-hero-card p-5 rounded-2xl flex flex-col justify-between group sm:col-span-2">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-cerulean to-neon-rose text-white flex items-center justify-center group-hover:scale-110 transition">
                <i data-lucide="graduation-cap" class="w-6 h-6"></i>
              </div>
              <h3 class="text-base font-bold text-white">Government Scholarships</h3>
              <p class="text-xs text-muted-grey leading-relaxed">Telangana ePASS (RTF & MTF), National Scholarship Portal (NSP), AICTE Pragati & Saksham for girl students.</p>
            </div>
            <button onclick="switchTab('finder')" class="mt-4 w-full py-2.5 rounded-xl btn-gradient text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-lg">
              <span>Explore All Scholarships</span> &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- SECTION 4: AI ASSISTANT HIGHLIGHT (MEET JANSAHAYAK AI) -->
      <div class="futuristic-hero-card p-8 md:p-12 rounded-3xl border border-electric-blue/30 relative overflow-hidden">
        <div class="absolute -right-20 -bottom-20 w-80 h-80 glow-sphere-blue pointer-events-none"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div class="lg:col-span-8 space-y-4">
            <span class="text-xs font-mono text-neon-rose tracking-widest uppercase">MEET JANSAHAYAK AI</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Your Intelligent Government Services Companion</h2>
            <p class="text-sm text-muted-grey max-w-2xl leading-relaxed">
              Ask natural questions in English, Telugu (తెలుగు) or Hindi (हिन्दी). JanSahayak AI analyzes your requirements, guides your documents, and grounds every answer strictly in official gazettes.
            </p>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div class="flex items-center gap-2 text-white">
                <i data-lucide="check" class="w-4 h-4 text-success-green"></i> Text & Voice Chatbot
              </div>
              <div class="flex items-center gap-2 text-white">
                <i data-lucide="check" class="w-4 h-4 text-electric-blue"></i> English, Telugu & Hindi
              </div>
              <div class="flex items-center gap-2 text-white">
                <i data-lucide="check" class="w-4 h-4 text-neon-rose"></i> Document Guidance
              </div>
              <div class="flex items-center gap-2 text-white">
                <i data-lucide="check" class="w-4 h-4 text-success-green"></i> Scholarship Eligibility
              </div>
              <div class="flex items-center gap-2 text-white">
                <i data-lucide="check" class="w-4 h-4 text-electric-blue"></i> Official Fee Check
              </div>
              <div class="flex items-center gap-2 text-white">
                <i data-lucide="check" class="w-4 h-4 text-neon-rose"></i> 100% Verified Sources
              </div>
            </div>

            <div class="pt-3">
              <button onclick="switchTab('assistant')" class="btn-gradient px-6 py-3 rounded-xl text-white font-bold text-sm transition flex items-center gap-2 shadow-lg">
                <i data-lucide="message-square" class="w-4 h-4"></i> Start Conversation
              </button>
            </div>
          </div>

          <div class="lg:col-span-4 flex justify-center">
            <div class="p-4 rounded-2xl bg-[#0A0D14] border border-white/10 w-full max-w-sm space-y-3">
              <div class="text-[11px] font-mono text-muted-grey">SAMPLE QUICK INQUIRIES:</div>
              <div class="p-2.5 rounded-xl bg-white/5 hover:border-electric-blue/40 border border-white/5 cursor-pointer text-xs text-white transition flex items-center justify-between" onclick="quickAskFromDashboard('How do I apply for a PAN card?')">
                <span>"How do I apply for a PAN card?"</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-electric-blue"></i>
              </div>
              <div class="p-2.5 rounded-xl bg-white/5 hover:border-neon-rose/40 border border-white/5 cursor-pointer text-xs text-white transition flex items-center justify-between" onclick="quickAskFromDashboard('Aadhaar card ela download cheyali?')">
                <span>"Aadhaar card ela download cheyali?"</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-neon-rose"></i>
              </div>
              <div class="p-2.5 rounded-xl bg-white/5 hover:border-success-green/40 border border-white/5 cursor-pointer text-xs text-white transition flex items-center justify-between" onclick="quickAskFromDashboard('Which scholarships can I apply for?')">
                <span>"Which scholarships can I apply for?"</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-success-green"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 5: SCHOLARSHIPS SECTION (NEVER MISS AN OPPORTUNITY) -->
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-neon-rose uppercase tracking-widest">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Financial Aid & Welfare
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">Never Miss an Opportunity</h2>
            <p class="text-sm text-muted-grey">Track deadlines, test eligibility with your profile, and apply via direct official portals.</p>
          </div>
          <button onclick="switchTab('finder')" class="btn-gradient px-5 py-2.5 rounded-xl text-white text-xs font-bold transition flex items-center gap-2">
            <span>Explore Scholarships</span> <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="dashboard-recommended-grid">
          <!-- Dynamically populated from allSchemes -->
        </div>
      </div>

      <!-- SECTION 6: HOW IT WORKS (FOUR SIMPLE STEPS) -->
      <div class="futuristic-hero-card p-8 md:p-12 rounded-3xl space-y-8">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <span class="text-xs font-mono text-electric-blue uppercase tracking-widest">STREAMLINED PROCESS</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white">How JanSahayak Works</h2>
          <p class="text-xs text-muted-grey">Four simple steps from finding a scheme to receiving government benefits.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative">
            <span class="text-2xl font-black font-mono text-electric-blue">01</span>
            <h4 class="text-base font-bold text-white">Create Your Profile</h4>
            <p class="text-xs text-muted-grey leading-relaxed">Save your education level, family income, category, and state for personalized matching.</p>
          </div>

          <div class="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative">
            <span class="text-2xl font-black font-mono text-neon-rose">02</span>
            <h4 class="text-base font-bold text-white">Select Government Service</h4>
            <p class="text-xs text-muted-grey leading-relaxed">Choose from 11 core citizen services across identity, banking, mobility and certificates.</p>
          </div>

          <div class="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative">
            <span class="text-2xl font-black font-mono text-success-green">03</span>
            <h4 class="text-base font-bold text-white">Check Eligibility & Docs</h4>
            <p class="text-xs text-muted-grey leading-relaxed">Get an instant deterministic check and list of exact required documents before applying.</p>
          </div>

          <div class="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative">
            <span class="text-2xl font-black font-mono text-warning-amber">04</span>
            <h4 class="text-base font-bold text-white">Apply on Verified Portals</h4>
            <p class="text-xs text-muted-grey leading-relaxed">Follow verified, step-by-step instructions leading to official government endpoints.</p>
          </div>
        </div>
      </div>

      <!-- SECTION 7: TRUST, TRANSPARENCY & SECURITY -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="futuristic-hero-card p-6 rounded-2xl space-y-3">
          <div class="w-10 h-10 rounded-xl bg-success-green/20 text-success-green flex items-center justify-center">
            <i data-lucide="shield-check" class="w-5 h-5"></i>
          </div>
          <h3 class="text-base font-bold text-white">Official Government Sources</h3>
          <p class="text-xs text-muted-grey leading-relaxed">
            Every procedure, fee, and deadline is strictly checked against official government domains (.gov.in, .nic.in). We never invent paths.
          </p>
        </div>

        <div class="futuristic-hero-card p-6 rounded-2xl space-y-3">
          <div class="w-10 h-10 rounded-xl bg-electric-blue/20 text-electric-blue flex items-center justify-center">
            <i data-lucide="lock" class="w-5 h-5"></i>
          </div>
          <h3 class="text-base font-bold text-white">Privacy-First Architecture</h3>
          <p class="text-xs text-muted-grey leading-relaxed">
            Your profile details and uploaded documents stay private. JanSahayak AI never asks for or stores ATM PINs, CVVs, or NetBanking passwords.
          </p>
        </div>

        <div class="futuristic-hero-card p-6 rounded-2xl space-y-3">
          <div class="w-10 h-10 rounded-xl bg-neon-rose/20 text-neon-rose flex items-center justify-center">
            <i data-lucide="cpu" class="w-5 h-5"></i>
          </div>
          <h3 class="text-base font-bold text-white">Transparent AI Reasoning</h3>
          <p class="text-xs text-muted-grey leading-relaxed">
            Eligibility decisions show explicit passes and unmet criteria. No black-box AI claims — every result cites the exact government rule.
          </p>
        </div>
      </div>

      <!-- SECTION 9: FOOTER -->
      <footer class="border-t border-white/10 pt-10 pb-6 text-xs text-muted-grey space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <div class="w-7 h-7 rounded-lg bg-gradient-to-r from-cerulean to-neon-rose flex items-center justify-center font-bold text-white text-xs">JS</div>
              <span class="font-bold text-white text-sm">JanSahayak AI</span>
            </div>
            <p class="text-[11px] leading-relaxed">Autonomous civic tech platform connecting citizens with verified welfare schemes and government documentation.</p>
          </div>

          <div class="space-y-2">
            <h4 class="font-bold text-white text-xs uppercase tracking-wider">Services</h4>
            <ul class="space-y-1.5 text-[11px]">
              <li><a href="javascript:void(0)" onclick="switchTab('guidance', 'pan-card')" class="hover:text-white transition">PAN Card Guidance</a></li>
              <li><a href="javascript:void(0)" onclick="switchTab('guidance', 'aadhaar-card')" class="hover:text-white transition">Aadhaar Services</a></li>
              <li><a href="javascript:void(0)" onclick="switchTab('guidance', 'passport-service')" class="hover:text-white transition">Passport Seva</a></li>
              <li><a href="javascript:void(0)" onclick="switchTab('guidance', 'income-certificate')" class="hover:text-white transition">MeeSeva Certificates</a></li>
            </ul>
          </div>

          <div class="space-y-2">
            <h4 class="font-bold text-white text-xs uppercase tracking-wider">Official Portals</h4>
            <ul class="space-y-1.5 text-[11px]">
              <li><a href="https://telanganaepass.cgg.gov.in/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition flex items-center gap-1">Telangana ePASS <i data-lucide="external-link" class="w-2.5 h-2.5"></i></a></li>
              <li><a href="https://scholarships.gov.in/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition flex items-center gap-1">National Scholarship Portal <i data-lucide="external-link" class="w-2.5 h-2.5"></i></a></li>
              <li><a href="https://uidai.gov.in/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition flex items-center gap-1">UIDAI Official Portal <i data-lucide="external-link" class="w-2.5 h-2.5"></i></a></li>
              <li><a href="https://www.passportindia.gov.in/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition flex items-center gap-1">Passport Seva MEA <i data-lucide="external-link" class="w-2.5 h-2.5"></i></a></li>
            </ul>
          </div>

          <div class="space-y-2">
            <h4 class="font-bold text-white text-xs uppercase tracking-wider">Governance</h4>
            <p class="text-[11px] leading-relaxed">JanSahayak AI operates under civic transparency principles. Not a substitute for official department decisions.</p>
            <div class="pt-2 text-[10px] text-white/50">
              © 2026 JanSahayak AI. Built for Smart India Civic Tech.
            </div>
          </div>
        </div>
      </footer>
    </section>
`;

// Replace existing #page-dashboard section
const startDashboardMarker = '<!-- PAGE 1: HOME DASHBOARD -->';
const endDashboardMarker = '<!-- PAGE 2: AI GOVERNMENT ASSISTANT -->';

const startIndex = content.indexOf(startDashboardMarker);
const endIndex = content.indexOf(endDashboardMarker);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) +
    `<!-- PAGE 1: HOME DASHBOARD -->\n    <!-- ======================================================== -->\n` +
    futuristicHomepageHtml +
    content.substring(endIndex);
  
  fs.writeFileSync(indexHtmlPath, content, 'utf8');
  console.log('Successfully upgraded homepage with futuristic design language and all 12 sections!');
} else {
  console.error('Markers not found! startIndex:', startIndex, 'endIndex:', endIndex);
}

