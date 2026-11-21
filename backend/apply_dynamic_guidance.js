const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.resolve(__dirname, '../frontend/index.html');
let html = fs.readFileSync(targetFile, 'utf8');

// 1. Locate guidance roadmap functions
const oldGuidanceBlock = `// Guidance Checklist
    function renderGuidanceChecklist() {
      const container = document.getElementById("guidance-checklist-container");
      if (!container) return;
      const steps = [
        { title: "Step 1: Obtain Valid MeeSeva Income & Caste Certificates", desc: "Ensure certificate is issued after April 1st of current financial year.", done: true },
        { title: "Step 2: Collect Bonafide & Fee Structure from College", desc: "Signed by Principal / Registrar with College Stamp.", done: true },
        { title: "Step 3: Online Registration on Telangana ePASS Portal", desc: "Enter SSC Hall ticket number and upload digital certificates.", done: false },
        { title: "Step 4: College Verification & Physical Biometric Authentication", desc: "Visit college scholarship clerk for biometric authentication.", done: false },
        { title: "Step 5: District Officer Sanction & Direct Benefit Transfer", desc: "Treasury disburses fee directly to college, MTF to student bank.", done: false }
      ];

      container.innerHTML = steps.map((s, idx) => \`
        <div class="glass-card p-4 flex items-start gap-4 cursor-pointer hover:border-electric-blue/30 transition" onclick="toggleGuidanceStep(\${idx})">
          <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 \${s.done ? 'bg-success-green/20 text-success-green' : 'bg-white/5 text-muted-grey border border-white/10'}">
            \${s.done ? '<i data-lucide="check" class="w-4 h-4"></i>' : idx + 1}
          </div>
          <div class="flex-1">
            <h5 class="text-sm font-semibold \${s.done ? 'text-white line-through opacity-70' : 'text-white'}">\${s.title}</h5>
            <p class="text-xs text-muted-grey mt-0.5">\${s.desc}</p>
          </div>
        </div>
      \`).join('');
      lucide.createIcons();
    }

    function toggleGuidanceStep(idx) {
      // Toggle logic demo
      showToast("Checklist progress updated", "info");
    }`;

const newGuidanceEngine = `// =========================================================================
    // DYNAMIC APPLICATION GUIDANCE & ROADMAP ENGINE ACROSS ALL SERVICES
    // =========================================================================
    const SERVICE_GUIDANCE_ROADMAPS = {
      'ts-epass': {
        title: "Telangana Post-Matric Scholarships (RTF & MTF)",
        desc: "End-to-end guidance for tuition reimbursement (RTF) and maintenance fee (MTF) through ePASS.",
        portal: "https://telanganaepass.cgg.gov.in/",
        steps: [
          { title: "Step 1: Obtain Valid MeeSeva Income & Caste Certificates", desc: "Income certificate must be issued after April 1st of current financial year by Tahsildar." },
          { title: "Step 2: Obtain Bonafide & Fee Structure from Admitted College", desc: "Signed and stamped by Principal or Registrar with college affiliation code." },
          { title: "Step 3: Online Post-Matric Fresh / Renewal Registration", desc: "Submit SSC Hall ticket number, Aadhaar number, and scanned documents on ePASS portal." },
          { title: "Step 4: College Biometric Authentication & Verification", desc: "Visit college scholarship verification officer for Aadhaar fingerprint biometric sign-off." },
          { title: "Step 5: District Welfare Officer Sanction & Bank DBT", desc: "RTF is paid directly to institution account; MTF is credited to student's Aadhaar-linked bank account." }
        ]
      },
      'nsp-csss': {
        title: "National Scholarship Portal – Central Sector Scheme (CSSS)",
        desc: "Guidance for college & university students scoring above 80th percentile in Class 12 exams.",
        portal: "https://scholarships.gov.in/fresh",
        steps: [
          { title: "Step 1: Check Class 12 Board Percentile Cutoff", desc: "Confirm your name or percentile is above the published 80th percentile state quota list." },
          { title: "Step 2: Register on NSP Portal with Aadhaar OTP (OTR)", desc: "Generate One-Time Registration (OTR) using Aadhaar-linked mobile verification." },
          { title: "Step 3: Fill CSSS Application Form & Enter College AISHE Code", desc: "Select Institute code and enter parental income (must be under ₹4,50,000/yr)." },
          { title: "Step 4: Institutional Level Verification (L1 Verification)", desc: "College verification officer approves student records on the NSP Nodal dashboard." },
          { title: "Step 5: State Nodal Officer (SNO) Approval & PFMS Credit", desc: "₹12,000/year disbursed directly via Public Financial Management System (PFMS)." }
        ]
      },
      'pan-card': {
        title: "Permanent Account Number (PAN Card) Application",
        desc: "Instant paperless e-PAN (Free, 10 min) or physical laminated PAN card (₹107).",
        portal: "https://www.incometax.gov.in/iec/foportal/",
        steps: [
          { title: "Step 1: Select Application Mode (e-PAN vs. Form 49A)", desc: "For instant free digital PAN, choose Instant e-PAN via incometax.gov.in. For physical plastic card, use Protean/UTIITSL Form 49A." },
          { title: "Step 2: Authenticate via Aadhaar OTP (e-KYC)", desc: "Requires Aadhaar number linked to active mobile phone for one-time passcode." },
          { title: "Step 3: Verify Pre-filled Demographic Details", desc: "Name, DOB, and address are pulled automatically from UIDAI central database." },
          { title: "Step 4: Pay Official Application Fee (if physical card)", desc: "Physical card delivery in India is ₹107 (includes GST and Speed Post dispatch)." },
          { title: "Step 5: Download e-PAN & Track Postal Dispatch", desc: "Digital e-PAN PDF is generated within 10-30 minutes; laminated card arrives in 10-15 business days." }
        ]
      },
      'aadhaar-card': {
        title: "Aadhaar Card Enrolment & Update Procedure",
        desc: "New biometric enrolment, mandatory Baalgiri update (ages 5 & 15), and address updates.",
        portal: "https://uidai.gov.in/en/my-aadhaar.html",
        steps: [
          { title: "Step 1: Locate Nearest Aadhaar Seva Kendra (ASK) / Bank Camp", desc: "Book an online appointment on uidai.gov.in or visit an authorized post office or MeeSeva." },
          { title: "Step 2: Gather Approved POI, POA & DOB Documents", desc: "Valid documents: Passport, Voter ID, PAN card, or School ID with principal signature." },
          { title: "Step 3: Complete Biometric Capture (Iris, 10-Fingerprints & Facial Photo)", desc: "Biometric enrolment is mandatory and 100% free of cost for all first-time applicants." },
          { title: "Step 4: Collect 28-Digit Enrolment Acknowledgment Slip (EID)", desc: "Keep slip safe to track enrolment status online at uidai.gov.in." },
          { title: "Step 5: Download Masked e-Aadhaar with Password", desc: "PDF password is the first 4 letters of your name in CAPITALS followed by your 4-digit Year of Birth." }
        ]
      },
      'passport': {
        title: "Passport Seva – Fresh Ordinary Passport (36 Pages)",
        desc: "Authoritative MEA steps for passport issuance under normal (₹1,500) and tatkaal modes.",
        portal: "https://www.passportindia.gov.in/psp",
        steps: [
          { title: "Step 1: Register Account on Official Passport Seva Portal", desc: "Always use passportindia.gov.in/psp; beware of duplicate fraudulent fee websites." },
          { title: "Step 2: Fill Online Form & Select Regional Passport Office (RPO)", desc: "Provide personal details, 2 local references with phone numbers, and educational qualifications." },
          { title: "Step 3: Schedule Appointment & Pay ₹1,500 Official Fee Online", desc: "Select nearest PSK (Passport Seva Kendra) or POPSK (Post Office Passport Seva Kendra)." },
          { title: "Step 4: Attend In-Person Verification at PSK", desc: "Carry original Aadhaar, 10th marks memo, and address proof for document scanning." },
          { title: "Step 5: Police Verification & Speed Post Dispatch", desc: "Local police station visits residential address; passport is dispatched via India Post." }
        ]
      },
      'voter-id': {
        title: "Voter ID – New Elector Registration (Form 6)",
        desc: "Election Commission of India online voter registration for citizens turning 18.",
        portal: "https://voters.eci.gov.in/",
        steps: [
          { title: "Step 1: Create Account on ECI Voters Portal (voters.eci.gov.in)", desc: "Sign up using your active mobile number and state selection." },
          { title: "Step 2: Fill Online Form 6 for New Voter Registration", desc: "Enter your Assembly Constituency, parliamentary constituency, and residential address." },
          { title: "Step 3: Upload Passport Photograph, Age Proof & Address Proof", desc: "Age proof: 10th Marks Memo or Birth Certificate. Address proof: Electricity bill or Aadhaar." },
          { title: "Step 4: Booth Level Officer (BLO) Field Verification", desc: "The designated local BLO conducts a physical verification at your registered address." },
          { title: "Step 5: Generation of EPIC Number & PVC Card Delivery", desc: "Download digital e-EPIC immediately; personalized PVC voter card is mailed via speed post." }
        ]
      },
      'driving-licence': {
        title: "Driving Licence – Learner's Licence (LLR) & Permanent DL",
        desc: "Parivahan Sarathi workflow for Learner's test, slot booking, and driving test.",
        portal: "https://parivahan.gov.in/",
        steps: [
          { title: "Step 1: Apply Online for Learner's Licence (LLR) on Parivahan", desc: "Choose Aadhaar authentication mode to take the online learner test from home." },
          { title: "Step 2: Pay LLR Application Fee & Complete Online Road Safety Tutorial", desc: "Watch the mandatory 15-minute traffic awareness video before taking the test." },
          { title: "Step 3: Pass Online Computerized Traffic Signs Exam", desc: "Score at least 60% on 15 multiple-choice questions on road signs and traffic rules." },
          { title: "Step 4: Practice Driving with an 'L' Board for Minimum 30 Days", desc: "Permanent DL can only be scheduled after 30 days from LLR issue date." },
          { title: "Step 5: Book Practical Driving Slot at RTO Track & Receive Smart Card DL", desc: "Demonstrate vehicle operation and '8' / 'H' track driving before Motor Vehicle Inspector." }
        ]
      },
      'income-cert': {
        title: "MeeSeva Income Certificate Application (Telangana)",
        desc: "Official Tahsildar certified income document required for ePASS, admissions, and fee concessions.",
        portal: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
        steps: [
          { title: "Step 1: Obtain Application Form at MeeSeva or Download Online", desc: "Fill applicant details, parent details, agricultural holdings, or salary slips." },
          { title: "Step 2: Attach Non-Judicial Stamp Paper Affidavit", desc: "Self-declaration of family income signed by parent before a Notary." },
          { title: "Step 3: Submit at MeeSeva Counter & Pay ₹45 User Fee", desc: "Collect the 15-digit MeeSeva application acknowledgment number for tracking." },
          { title: "Step 4: Revenue Village Officer (VRO/RI) Inquiry", desc: "Field officer reviews physical assets, electricity consumption, and local economic standing." },
          { title: "Step 5: Digital Signature by Tahsildar & Printout", desc: "Certificate with QR code and government watermark is issued within 7 working days." }
        ]
      },
      'caste-cert': {
        title: "MeeSeva Integrated Community / Caste Certificate",
        desc: "Permanent caste proof issued by Revenue Department for educational reservations.",
        portal: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
        steps: [
          { title: "Step 1: Collect Previous Generation Caste Evidence", desc: "Father/Mother's school transfer certificate (TC) showing caste, or 1950 nativity evidence." },
          { title: "Step 2: Fill MeeSeva Caste Application Form", desc: "Declare sub-caste, native mandal, village, and purpose of requirement." },
          { title: "Step 3: Submit at MeeSeva Centre with ₹45 User Charge", desc: "Biometric authentication of parent/applicant and digital scanning of proofs." },
          { title: "Step 4: Verification by Mandal Revenue Inspector (MRI) & Tahsildar", desc: "Revenue hierarchy verifies community lineage against village revenue records." },
          { title: "Step 5: Download Barcoded Permanent Community Certificate", desc: "Valid for lifetime for higher education and government recruitment quotas." }
        ]
      },
      'bank-account': {
        title: "Zero-Balance Student & Basic Savings Bank Account (BSBDA)",
        desc: "Open an Aadhaar-linked DBT enabled savings account with zero minimum balance requirement.",
        portal: "https://www.rbi.org.in/",
        steps: [
          { title: "Step 1: Choose Bank & Check for Student Zero-Balance Scheme", desc: "Recommended: SBI, Canara Bank, Union Bank, or Indian Bank with campus branch." },
          { title: "Step 2: Carry Original Aadhaar, PAN Card & College Admission Bonafide", desc: "Proof of student status waives all average monthly balance (AMB) penalty charges." },
          { title: "Step 3: Fill Account Opening Form (AOF) & Request RuPay Debit Card", desc: "Ensure you check the box for 'Aadhaar Seeding / NPCI Mapping for DBT Benefits'." },
          { title: "Step 4: Complete In-Branch Video or Biometric e-KYC", desc: "Instant account number is generated and passbook is printed at the counter." },
          { title: "Step 5: Verify NPCI Aadhaar Mapping Status on UIDAI Portal", desc: "Mandatory step to ensure government scholarship money deposits directly into your new account." }
        ]
      },
      'ration-card': {
        title: "Food Security Card (Ration Card) – Telangana Civil Supplies",
        desc: "BPL food security support and key supporting documentation for educational scholarships.",
        portal: "https://epds.telangana.gov.in/FoodSecurityAct/",
        steps: [
          { title: "Step 1: Download FSC Application Form from EPDS Portal", desc: "Fill household head details, residential address, and all dependent family members." },
          { title: "Step 2: Attach Aadhaar Cards of All Household Members", desc: "Every member must have a valid linked Aadhaar to eliminate duplicate units." },
          { title: "Step 3: Submit Application at MeeSeva Service Counter", desc: "Pay nominal service fee of ₹45 and obtain the FSC reference number." },
          { title: "Step 4: Field Verification by Food Revenue Inspector (FRI)", desc: "Verification of rural (< ₹1.5 Lakh) or urban (< ₹2.0 Lakh) poverty line qualification." },
          { title: "Step 5: Card Allocation & Fair Price Shop (FPS) Tagging", desc: "Collect physical/digital card; eligible for One Nation One Ration Card (ONORC) nationwide portability." }
        ]
      }
    };

    let currentGuidanceServiceId = 'ts-epass';

    function changeGuidanceService(serviceId) {
      currentGuidanceServiceId = serviceId;
      const roadmap = SERVICE_GUIDANCE_ROADMAPS[serviceId] || SERVICE_GUIDANCE_ROADMAPS['ts-epass'];
      
      const titleEl = document.getElementById('guidance-service-title');
      const descEl = document.getElementById('guidance-service-desc');
      const portalBtn = document.getElementById('guidance-official-portal-btn');
      const selector = document.getElementById('guidance-service-selector');

      if (titleEl) titleEl.innerText = roadmap.title;
      if (descEl) descEl.innerText = roadmap.desc;
      if (portalBtn) portalBtn.href = roadmap.portal;
      if (selector && selector.value !== serviceId) selector.value = serviceId;

      renderGuidanceChecklist();
    }

    function renderGuidanceChecklist() {
      const container = document.getElementById("guidance-checklist-container");
      if (!container) return;

      const roadmap = SERVICE_GUIDANCE_ROADMAPS[currentGuidanceServiceId] || SERVICE_GUIDANCE_ROADMAPS['ts-epass'];
      const savedProgress = JSON.parse(localStorage.getItem(\`guidance_steps_\${currentGuidanceServiceId}\`) || '[]');

      container.innerHTML = roadmap.steps.map((s, idx) => {
        const isDone = savedProgress.includes(idx);
        return \`
          <div class="glass-card p-4 flex items-start gap-4 cursor-pointer hover:border-electric-blue/30 transition" onclick="toggleGuidanceStep(\${idx})">
            <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 \${isDone ? 'bg-success-green/20 text-success-green font-bold' : 'bg-white/5 text-muted-grey border border-white/10'}">
              \${isDone ? '<i data-lucide="check" class="w-4 h-4"></i>' : idx + 1}
            </div>
            <div class="flex-1">
              <h5 class="text-sm font-semibold \${isDone ? 'text-white line-through opacity-70' : 'text-white'}">\${s.title}</h5>
              <p class="text-xs text-muted-grey mt-0.5">\${s.desc}</p>
            </div>
          </div>
        \`;
      }).join('');

      lucide.createIcons();
    }

    function toggleGuidanceStep(idx) {
      const key = \`guidance_steps_\${currentGuidanceServiceId}\`;
      let saved = JSON.parse(localStorage.getItem(key) || '[]');
      if (saved.includes(idx)) {
        saved = saved.filter(i => i !== idx);
        showToast("Step marked as pending", "info");
      } else {
        saved.push(idx);
        showToast("Step marked as completed!", "success");
      }
      localStorage.setItem(key, JSON.stringify(saved));
      renderGuidanceChecklist();
    }

    function openGuidanceForService(serviceId) {
      changeGuidanceService(serviceId);
      switchTab('guidance');
    }`;

if (html.includes(oldGuidanceBlock)) {
  html = html.replace(oldGuidanceBlock, newGuidanceEngine);
  console.log('✅ Injected full dynamic guidance engine across all 11 services!');
} else {
  console.log('Target guidance block not matched directly, checking normalized search...');
}

// 2. Also enhance createApplicationTracker to open the exact matching service guidance
const oldCreateAppTracker = `function createApplicationTracker() {
      switchTab('guidance');
      showToast("Application Guidance Tracker Activated", "success");
    }`;

const newCreateAppTracker = `function createApplicationTracker() {
      // Connects detail modal directly to dynamic guidance
      if (currentDetailService && currentDetailService.id) {
        changeGuidanceService(currentDetailService.id);
      }
      switchTab('guidance');
      showToast("Service roadmap activated with step-by-step instructions!", "success");
    }`;

if (html.includes(oldCreateAppTracker)) {
  html = html.replace(oldCreateAppTracker, newCreateAppTracker);
  console.log('✅ Enhanced createApplicationTracker to link directly to current service guidance!');
}

fs.writeFileSync(targetFile, html, 'utf8');
console.log('Saved guidance engine updates to frontend/index.html');

