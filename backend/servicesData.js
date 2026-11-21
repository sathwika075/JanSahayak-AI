// C:\Nxtwave-Sathwika\jansahayak-ai\backend\servicesData.js
// Authoritative, Officially Verified Catalog of Citizen Services
// Covers Identity, Travel, Banking (Citizen Services), and Government Certificates

const CITIZEN_SERVICES = [
  // =========================================================================
  // CATEGORY A: IDENTITY SERVICES
  // =========================================================================
  {
    id: "pan-card",
    category: "identity",
    categoryName: "Identity Services",
    name: "Permanent Account Number (PAN Card)",
    shortName: "PAN Card",
    icon: "credit-card",
    badge: "Central Govt (CBDT / ITD)",
    officialPortal: "Income Tax Department / Protean (NSDL) / UTIITSL",
    officialUrl: "https://www.incometax.gov.in/iec/foportal/",
    applicationUrl: "https://www.protean-tinpan.com/",
    trackingUrl: "https://www.trackpan.utiitsl.com/",
    instantPanUrl: "https://www.incometax.gov.in/iec/foportal/",
    description: "Application guidance for New PAN (Form 49A), Instant e-PAN using Aadhaar, PAN correction, reprint of physical PAN card, and PAN-Aadhaar linking.",
    whoCanApply: [
      "Any individual Indian citizen (including minors represented by parent/guardian).",
      "Non-Resident Indians (NRIs) and foreign citizens earning taxable income in India.",
      "Companies, LLPs, Partnership Firms, Trusts, and HUFs registered in India."
    ],
    requiredDocuments: [
      "Proof of Identity (POI): Aadhaar Card, Voter ID, Passport, or Driving Licence.",
      "Proof of Address (POA): Aadhaar Card, Utility Bill (within 3 months), Bank Account Statement, or Passport.",
      "Proof of Date of Birth (DOB): Birth Certificate, Aadhaar Card, 10th Marks Memo, or Passport.",
      "Two recent passport-sized color photographs (not required if applying via Aadhaar e-KYC paperless mode)."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Choose Application Mode",
        desc: "Option A: Instant e-PAN (Free, paperless, 10 minutes) via incometax.gov.in using Aadhaar e-KYC. Option B: Regular physical PAN card via Protean (NSDL) or UTIITSL online portal (Form 49A)."
      },
      {
        step: 2,
        title: "Fill Applicant Details",
        desc: "Provide personal details, parents' names, contact info, and select physical vs. e-PAN requirement."
      },
      {
        step: 3,
        title: "Upload Documents or Complete Aadhaar e-KYC",
        desc: "For digital mode, authenticate with Aadhaar OTP. For paper-based mode, sign and mail physical documents to the nearest NSDL/UTIITSL branch."
      },
      {
        step: 4,
        title: "Pay Official Fee & Obtain Acknowledgment",
        desc: "Make online payment and save the 15-digit Acknowledgment Number for tracking."
      },
      {
        step: 5,
        title: "Delivery & Tracking",
        desc: "e-PAN is emailed within 24-48 hours. Physical laminated PAN card is dispatched by India Post within 10-15 business days."
      }
    ],
    fees: {
      instant_e_pan: "Free of cost (via Income Tax e-Filing Portal with Aadhaar OTP)",
      physical_card_india: "₹107 (₹93 Application fee + 18% GST)",
      physical_card_overseas: "₹1,017 (for dispatch outside India)"
    },
    features: [
      "New PAN application (Form 49A)",
      "Instant paperless e-PAN in 10 minutes",
      "PAN Card Correction & Name/DOB Update",
      "Reprint of lost or damaged PAN card",
      "PAN Application Status Tracking",
      "PAN-Aadhaar Linking Guidance"
    ],
    faqs: [
      {
        q: "Can I get a PAN card immediately without paying a fee?",
        a: "Yes. The Income Tax Department provides 'Instant e-PAN' through Aadhaar e-KYC on incometax.gov.in. It is 100% free and valid digitally. A physical plastic card can later be ordered for ₹50 reprint fee."
      },
      {
        q: "Is Aadhaar mandatory to apply for a PAN card?",
        a: "Yes, quoting Aadhaar number is mandatory for Indian resident applicants under Section 139AA of the Income-tax Act."
      },
      {
        q: "How can I check my PAN application status?",
        a: "Visit the Protean (NSDL) TIN tracking page and enter your 15-digit acknowledgment number."
      }
    ],
    keywords: ["pan", "pan card", "utiitsl", "nsdl", "protean", "e-pan", "incometax", "form 49a", "tax id"]
  },

  {
    id: "aadhaar-card",
    category: "identity",
    categoryName: "Identity Services",
    name: "Aadhaar Card (UIDAI)",
    shortName: "Aadhaar Card",
    icon: "fingerprint",
    badge: "Central Govt (UIDAI)",
    officialPortal: "Unique Identification Authority of India (UIDAI)",
    officialUrl: "https://uidai.gov.in/",
    applicationUrl: "https://appointments.uidai.gov.in/",
    downloadUrl: "https://uidai.gov.in/en/my-aadhaar.htmlgen-download-aadhaar",
    trackingUrl: "https://uidai.gov.in/en/my-aadhaar.htmlcheck-aadhaar-status",
    pvcUrl: "https://uidai.gov.in/en/my-aadhaar.htmlgen-pvc",
    description: "Guidance for New Aadhaar enrolment, demographic & biometric updates, mobile number linking, e-Aadhaar download, and secure PVC card orders.",
    whoCanApply: [
      "Any resident of India who has resided in the country for 182 days or more in the past 12 months.",
      "Newborn children (Baal Aadhaar issued without biometrics until age 5, updated at age 5 and 15).",
      "Non-Resident Indians (NRIs) holding valid Indian Passport (can enrol upon arrival at any ASK)."
    ],
    requiredDocuments: [
      "Proof of Identity (POI): Passport, PAN Card, Ration Card, Voter ID, Driving Licence, or Government photo ID.",
      "Proof of Address (POA): Passport, Bank Statement/Passbook, Ration Card, Voter ID, Electricity Bill (last 3 months), or Water Bill.",
      "Proof of Date of Birth (DOB): Birth Certificate, SSLC Book/Certificate, Passport, or PAN Card.",
      "Proof of Relationship (POR) for minors: PDS card, MNREGA job card, or Medical claim card."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Locate Enrolment Centre or Book Appointment",
        desc: "Book an appointment online at appointments.uidai.gov.in or walk into any Aadhaar Seva Kendra (ASK), post office, or designated bank."
      },
      {
        step: 2,
        title: "Submit Documents & Complete Biometrics",
        desc: "Submit POI/POA documents. Operator records 10 fingerprints, both iris scans, and a live photograph."
      },
      {
        step: 3,
        title: "Obtain Enrolment Slip (EID)",
        desc: "Receive the 28-digit Enrolment ID slip containing the timestamp used for status tracking."
      },
      {
        step: 4,
        title: "Track Status & Download e-Aadhaar",
        desc: "Once processed (usually 5-15 days), download the digitally signed e-Aadhaar from myaadhaar.uidai.gov.in."
      }
    ],
    fees: {
      new_enrolment: "Free of cost (Mandatory by UIDAI)",
      mandatory_biometric_child: "Free of cost (at ages 5 and 15)",
      demographic_update: "₹50 (at centre or myAadhaar portal)",
      biometric_update: "₹100 (at authorized Aadhaar centre)",
      pvc_card_order: "₹50 (includes GST and Speed Post delivery across India)"
    },
    features: [
      "New Aadhaar Enrolment Appointment",
      "e-Aadhaar Instant Download (Regular & Masked)",
      "Online Address Update via myAadhaar",
      "Mobile Number & Email Linking at ASK",
      "Aadhaar PVC Card Home Delivery",
      "Aadhaar-Bank Account (NPCI) Seeding Status"
    ],
    faqs: [
      {
        q: "Can I update my mobile number online in Aadhaar?",
        a: "No. Mobile number update requires biometric verification (fingerprint scan) and must be done in person at an authorized Aadhaar Seva Kendra or post office."
      },
      {
        q: "What is Masked Aadhaar and is it legally valid?",
        a: "Masked Aadhaar hides the first 8 digits of your Aadhaar number, showing only the last 4. It is 100% legally valid everywhere (except government DBT schemes requiring full Aadhaar)."
      },
      {
        q: "How much does a PVC Aadhaar card cost?",
        a: "UIDAI charges an official fee of ₹50, which includes speed post delivery directly to your registered address."
      }
    ],
    keywords: ["aadhaar", "uidai", "myaadhaar", "pvc card", "e-aadhaar", "demographic", "biometric", "baal aadhaar"]
  },

  {
    id: "voter-id",
    category: "identity",
    categoryName: "Identity Services",
    name: "Voter ID Card (EPIC)",
    shortName: "Voter ID",
    icon: "vote",
    badge: "Election Commission of India",
    officialPortal: "Voters' Service Portal (ECI)",
    officialUrl: "https://voters.eci.gov.in/",
    applicationUrl: "https://voters.eci.gov.in/signup",
    trackingUrl: "https://voters.eci.gov.in/track-application-status",
    description: "Guidance for new voter registration (Form 6), overseas voter registration (Form 6A), shifting of residence/corrections (Form 8), and digital e-EPIC download.",
    whoCanApply: [
      "Every Indian citizen who has attained 18 years of age on the qualifying dates (1st Jan, 1st April, 1st July, 1st Oct).",
      "Resident of the assembly constituency where enrolling."
    ],
    requiredDocuments: [
      "Proof of Age/DOB: Birth Certificate, 10th Certificate, Aadhaar, PAN, Passport, or Driving Licence.",
      "Proof of Ordinary Residence: Water/Electricity/Gas Bill, Aadhaar Card, Bank Passbook, or Passport.",
      "One passport-size photograph."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Register on ECI Portal",
        desc: "Sign up on voters.eci.gov.in using mobile number and OTP."
      },
      {
        step: 2,
        title: "Fill Form 6 for New Registration",
        desc: "Enter constituency, personal details, permanent and current address."
      },
      {
        step: 3,
        title: "Field Verification by BLO",
        desc: "Booth Level Officer (BLO) visits or verifies documents locally."
      },
      {
        step: 4,
        title: "Electoral Roll Inclusion & e-EPIC Download",
        desc: "Once approved, download e-EPIC PDF online. Physical colored voter ID card is delivered via Speed Post for free."
      }
    ],
    fees: {
      registration_and_card: "Free of cost (Funded entirely by Government of India)"
    },
    features: [
      "Form 6: New Voter Registration (18+ citizens)",
      "Form 8: Correction of Name, Photo, Age, Address",
      "e-EPIC Digital Voter Card Download",
      "Track Application Reference Status",
      "Search Name in National Electoral Roll"
    ],
    faqs: [
      {
        q: "What is the fee for a new Voter ID card?",
        a: "New voter registration and the physical EPIC card are completely free of cost."
      },
      {
        q: "How can I download my digital Voter ID (e-EPIC)?",
        a: "Login to voters.eci.gov.in with your registered mobile or EPIC number and click 'e-EPIC Download'."
      }
    ],
    keywords: ["voter", "voter id", "epic", "eci", "election commission", "form 6", "form 8", "electoral roll"]
  },

  // =========================================================================
  // CATEGORY B: TRAVEL & TRANSPORT SERVICES
  // =========================================================================
  {
    id: "passport-service",
    category: "travel",
    categoryName: "Travel & Transport",
    name: "Indian Passport (Passport Seva)",
    shortName: "Passport",
    icon: "plane",
    badge: "Ministry of External Affairs (MEA)",
    officialPortal: "Passport Seva Portal (PSP)",
    officialUrl: "https://www.passportindia.gov.in/psp",
    applicationUrl: "https://www.passportindia.gov.in/psppsp",
    trackingUrl: "https://www.passportindia.gov.in/psppsp",
    description: "Guidance for Fresh Passport, Re-issue/Renewal of expired passport, Normal vs. Tatkaal schemes, document requirements, PSK appointment booking, and police verification.",
    whoCanApply: [
      "Citizens of India by birth, descent, or registration/naturalization.",
      "Minors (below 18 years) with consent of parents (Annexure C/D).",
      "Adults aged 18 and above (36-page or 60-page booklet)."
    ],
    requiredDocuments: [
      "Proof of Date of Birth: Birth Certificate, 10th Standard Marks Card/Transfer Certificate, or Aadhaar Card.",
      "Proof of Present Address: Aadhaar Card, Water/Electricity/Telephone Bill, Active Bank Account Passbook with photo, or Rent Agreement (registered).",
      "Non-ECR (Emigration Check Not Required) Proof: 10th Standard pass memo/degree certificate (avoids ECR stamping).",
      "Previous Passport original + self-attested copies (for re-issue/renewal applicants only)."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Register on Passport Seva Online Portal",
        desc: "Create an account on passportindia.gov.in and select your Regional Passport Office (RPO)."
      },
      {
        step: 2,
        title: "Fill Online Application Form",
        desc: "Choose Fresh vs Re-issue, Normal vs Tatkaal, and 36 vs 60 pages booklet."
      },
      {
        step: 3,
        title: "Pay Online & Schedule PSK Appointment",
        desc: "Payment is mandatory via SBI ePay before booking slot at nearest Passport Seva Kendra (PSK) or Post Office PSK (POPSK)."
      },
      {
        step: 4,
        title: "Visit PSK on Appointment Date",
        desc: "Carry all original documents + photocopies. Biometrics, photograph, and document verification happen in Counter A, B, and C."
      },
      {
        step: 5,
        title: "Police Verification & Delivery",
        desc: "Local police station conducts address verification. Passport is printed and dispatched via India Post Speed Post."
      }
    ],
    fees: {
      fresh_normal_36_pages: "₹1,500 (10 years validity)",
      fresh_normal_60_pages: "₹2,000 (10 years validity)",
      fresh_tatkaal_additional: "₹2,000 extra (Total ₹3,500 for fast-track processing)",
      minor_passport: "₹1,000 (5 years validity or till age 18)"
    },
    features: [
      "Fresh Ordinary Passport Application",
      "Renewal / Re-issue of expired or expiring passport",
      "Normal & Tatkaal Fast-Track processing",
      "PSK and POPSK Appointment Slot Booking",
      "Police Verification Status Guidance",
      "Passport Dispatched India Post Tracking"
    ],
    faqs: [
      {
        q: "What is the difference between Normal and Tatkaal passport?",
        a: "Normal passport takes 15-30 days and costs ₹1,500. Tatkaal passport is processed within 1-3 business days (with verification after dispatch or specific proof) and costs an additional ₹2,000 (total ₹3,500)."
      },
      {
        q: "What documents are required for a first-time fresh passport?",
        a: "For adults: (1) Proof of Address (e.g. Aadhaar / Bank Passbook / Electricity bill), (2) Proof of Date of Birth (Birth Certificate or 10th memo / Aadhaar), and (3) Non-ECR proof (10th pass certificate or higher degree)."
      },
      {
        q: "How does police verification work for passport?",
        a: "The local police station in your jurisdiction receives your file from the RPO. A police officer visits your address or calls you with original address and criminal record clearance documents."
      }
    ],
    keywords: ["passport", "tatkaal", "psk", "popsk", "mea", "passport seva", "police verification", "fresh passport", "renewal"]
  },

  {
    id: "driving-licence",
    category: "travel",
    categoryName: "Travel & Transport",
    name: "Driving Licence (Sarathi Parivahan)",
    shortName: "Driving Licence",
    icon: "car",
    badge: "Ministry of Road Transport & Highways (MoRTH)",
    officialPortal: "Parivahan Sewa (Sarathi)",
    officialUrl: "https://parivahan.gov.in/",
    applicationUrl: "https://parivahan.gov.in/",
    trackingUrl: "https://parivahan.gov.in/sarathiservice/applViewStatus.do",
    description: "Guidance for Learner's Licence (LL), Permanent Driving Licence (DL), DL renewal, duplicate DL, international driving permit, and application status.",
    whoCanApply: [
      "Motorcycle without gear (up to 50cc): Minimum 16 years (with parental consent).",
      "Light Motor Vehicle (Car/Motorcycle with gear): Minimum 18 years.",
      "Commercial / Transport Vehicle: Minimum 20 years + 1 year prior experience with LMV."
    ],
    requiredDocuments: [
      "Proof of Age: 10th Marks Memo, Birth Certificate, Aadhaar Card, or Passport.",
      "Proof of Address: Aadhaar Card, Voter ID, Passport, Electricity Bill, or Ration Card.",
      "Medical Certificate (Form 1A): Required for applicants above 40 years or transport category.",
      "Learner's Licence original copy (when applying for permanent DL)."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Apply for Learner's Licence (LL)",
        desc: "Submit Form 2 on sarathi.parivahan.gov.in, upload documents, pay fees, and take the online computer traffic rules test (contactless via Aadhaar in many states)."
      },
      {
        step: 2,
        title: "Hold LL for Minimum 30 Days",
        desc: "Learner's Licence is valid for 6 months. You can take the driving test between 30 and 180 days of issue."
      },
      {
        step: 3,
        title: "Book Driving Test Slot for Permanent DL",
        desc: "Schedule slot at your local Regional Transport Office (RTO) or automated testing track."
      },
      {
        step: 4,
        title: "Pass Practical Driving Test",
        desc: "Drive on the designated track (8-track / H-track for 4-wheelers). Once passed, DL is approved."
      },
      {
        step: 5,
        title: "Smart Card Delivery",
        desc: "Physical smart card DL is dispatched via Speed Post. Digital DL is immediately available on DigiLocker / mParivahan."
      }
    ],
    fees: {
      learners_licence_test: "₹150 to ₹200 (varies by state)",
      permanent_dl_driving_test: "₹300 test fee + ₹200 card issuance",
      renewal_dl: "₹200 (if applied before expiry or within grace period)"
    },
    features: [
      "Contactless Online Learner's Licence (LL) Test",
      "Permanent Driving Licence Slot Booking",
      "Driving Licence Renewal & Address Change",
      "Duplicate DL for lost or damaged cards",
      "Digital DL on DigiLocker / mParivahan",
      "Application Status Tracking"
    ],
    faqs: [
      {
        q: "Can I take the Learner's Licence test from home?",
        a: "Yes, under Aadhaar-based authentication on sarathi.parivahan.gov.in, citizens in most states (including Telangana) can take the online LL test directly from home with facial recognition."
      },
      {
        q: "How long is a Learner's Licence valid?",
        a: "A Learner's Licence is valid for 6 months across India. You can book a permanent driving test after 30 days of holding the LL."
      }
    ],
    keywords: ["driving licence", "dl", "learners licence", "ll", "parivahan", "sarathi", "rto", "transport"]
  },

  // =========================================================================
  // CATEGORY C: BANKING SERVICES (CITIZEN & BANK-SPECIFIC)
  // Note: Clearly designated as bank-specific citizen services.
  // =========================================================================
  {
    id: "bank-account",
    category: "banking",
    categoryName: "Banking Services",
    name: "Savings & Student Bank Account",
    shortName: "Bank Account",
    icon: "landmark",
    badge: "Bank-Specific Citizen Service",
    officialPortal: "Reserve Bank of India (RBI) / Respective Scheduled Banks",
    officialUrl: "https://www.rbi.org.in/",
    description: "Guidance for opening a Regular Savings Account, Student Zero-Balance Account, PMJDY Basic Savings Bank Deposit Account (BSBDA), and Aadhaar-NPCI DBT linking.",
    whoCanApply: [
      "Any Indian resident aged 18 and above.",
      "Minors aged 10+ can open self-operated student savings accounts in public sector banks.",
      "Underprivileged individuals can open PMJDY zero-balance accounts with simplified KYC."
    ],
    requiredDocuments: [
      "Officially Valid Document (OVD) for Identity & Address: Aadhaar Card, Passport, Voter ID, or Driving Licence.",
      "Permanent Account Number (PAN Card) or Form 60 declaration.",
      "Two recent passport-sized color photographs.",
      "College / School Bonafide Certificate or Student ID Card (for student specific concessions)."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Choose Bank & Account Type",
        desc: "Select a Public Sector Bank (e.g. SBI, Canara Bank, Union Bank) or Private Bank. For scholarships, request an 'Aadhaar-Seeded BSBDA Zero-Balance Account'."
      },
      {
        step: 2,
        title: "Apply Online via Video KYC or Visit Branch",
        desc: "Most banks allow instant opening via their mobile app (e.g. SBI YONO) using Aadhaar OTP and Video KYC."
      },
      {
        step: 3,
        title: "Complete Aadhaar-NPCI Seeding for DBT",
        desc: "CRITICAL FOR SCHOLARSHIPS: Submit the NPCI Aadhaar Seeding Consent Form at the branch so government scholarships credit to this account."
      },
      {
        step: 4,
        title: "Receive Welcome Kit",
        desc: "Account number, IFSC code, ATM Debit Card, Passbook, and NetBanking credentials are issued."
      }
    ],
    fees: {
      pmjdy_student_account: "Zero balance (No minimum balance maintenance charge)",
      regular_savings_account: "Varies by bank (₹0 to ₹3,000 depending on rural/urban branch tier)"
    },
    features: [
      "Student Zero-Balance Savings Account",
      "PMJDY (Jan Dhan) Account opening guidance",
      "Aadhaar NPCI Mapping for Government DBT Subsidies",
      "Comparison of major public & private banks",
      "Paperless Video KYC application steps"
    ],
    faqs: [
      {
        q: "What is an Aadhaar-seeded bank account for scholarships?",
        a: "Government DBT (Direct Benefit Transfer) scholarships like ePASS and NSP require your bank account to be linked with NPCI (National Payments Corporation of India). You must submit an Aadhaar seeding consent form to your branch."
      },
      {
        q: "Can students open a bank account with zero balance?",
        a: "Yes. Basic Savings Bank Deposit Accounts (BSBDA) and PMJDY accounts require ₹0 minimum balance and have no penalty charges."
      }
    ],
    keywords: ["bank account", "savings account", "student account", "zero balance", "pmjdy", "npci", "dbt", "rbi"]
  },

  {
    id: "bank-passbook",
    category: "banking",
    categoryName: "Banking Services",
    name: "Bank Passbook Services",
    shortName: "Bank Passbook",
    icon: "book-open",
    badge: "Bank-Specific Citizen Service",
    officialPortal: "Respective Branch / Bank Portal",
    officialUrl: "https://www.rbi.org.in/",
    description: "Guidance for obtaining a new physical passbook, updating transaction entries, replacement of completed/lost passbooks, and printing e-statements.",
    whoCanApply: [
      "Any savings or current account holder with physical passbook facility (primarily Public Sector Banks)."
    ],
    requiredDocuments: [
      "For First Time / Completed Passbook: Existing account number, ID proof, and old passbook (if completed).",
      "For Lost Passbook Replacement: Written request letter, FIR/Loss report copy (if requested by branch), Aadhaar/PAN Card proof, and passport photo."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Daily / Monthly Entry Updates",
        desc: "Use automated Self-Service Passbook Kiosk (SWAYAM / Barcode printer) at your bank's e-Corner. Simply insert passbook with magnetic stripe or barcode facing down."
      },
      {
        step: 2,
        title: "Completed Passbook Replacement",
        desc: "Visit your home branch with the filled passbook. The branch official issues a continuation passbook free of cost."
      },
      {
        step: 3,
        title: "Lost Passbook Replacement",
        desc: "Submit a written application to the Branch Manager requesting a duplicate passbook along with photo ID proof."
      }
    ],
    fees: {
      first_issue_and_completed: "Free of cost at all public sector banks",
      duplicate_lost_passbook: "Nominal fee ₹50 to ₹100 + GST (depending on bank)"
    },
    features: [
      "New Passbook issuance guidance",
      "Self-service automated kiosk updating instructions",
      "Duplicate passbook for lost/damaged cases",
      "MeeSeva/ePASS required passbook photo and front page verification"
    ],
    faqs: [
      {
        q: "What does government scholarship portals require from the bank passbook?",
        a: "Scholarship verification officers require the first page of the passbook clearly displaying: Student Name, Account Number, IFSC Code, Bank Branch name, and Bank Official Stamp/Signature."
      },
      {
        q: "Can I download an e-passbook on mobile?",
        a: "Yes. Most banks offer mobile m-Passbook apps (e.g. SBI YONO Quick, Canara e-Passbook, Union Bank mPassbook) showing real-time digital entries."
      }
    ],
    keywords: ["passbook", "bank passbook", "passbook update", "duplicate passbook", "bank stamp", "kiosk"]
  },

  {
    id: "atm-debit-card",
    category: "banking",
    categoryName: "Banking Services",
    name: "ATM / Debit Card Services",
    shortName: "ATM / Debit Card",
    icon: "credit-card",
    badge: "Bank-Specific Citizen Service",
    officialPortal: "Respective Bank / National Payments Corporation of India (NPCI)",
    officialUrl: "https://www.rbi.org.in/",
    description: "Guidance for requesting a new Debit card, replacement of expired/damaged cards, emergency blocking of lost/stolen cards, and Green PIN generation.",
    whoCanApply: [
      "Any individual savings or current account holder with active account status."
    ],
    requiredDocuments: [
      "Active bank account number.",
      "Registered mobile number (for OTP verification).",
      "No physical documents needed if applying via NetBanking or Mobile Banking app."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "EMERGENCY: Block Lost or Stolen Card Immediately",
        desc: "Call your bank's 24x7 toll-free helpline, send emergency SMS block command, or lock card instantly inside your bank's mobile app. NEVER delay blocking a missing card."
      },
      {
        step: 2,
        title: "Request Replacement or New ATM Card",
        desc: "Apply online through NetBanking/Mobile Banking under 'Cards' section or submit Form at the home branch."
      },
      {
        step: 3,
        title: "Delivery via Speed Post",
        desc: "The card is delivered in a sealed envelope to your registered communication address within 5-7 business days."
      },
      {
        step: 4,
        title: "Generate Green PIN",
        desc: "Set your 4-digit secret ATM PIN via any of your bank's ATMs, NetBanking, or IVR with registered mobile OTP."
      }
    ],
    fees: {
      rupay_classic_pmjdy: "Free of cost (Zero annual maintenance fee under PMJDY)",
      regular_visa_rupay_card: "Annual fee ₹125 to ₹250 + GST (varies by card tier)",
      replacement_damaged_card: "₹100 to ₹200 + GST"
    },
    features: [
      "Instant Emergency Card Blocking guidance (Toll-Free & SMS)",
      "New ATM Card issuance procedure",
      "Replacement of expired or damaged magnetic cards with EMV chip",
      "Green PIN generation without branch visit",
      "Domestic & International transaction limit controls"
    ],
    faqs: [
      {
        q: "How do I immediately block a lost SBI ATM card?",
        a: "Send an SMS with text 'BLOCK <last 4 digits of card>' to 567676 from your registered mobile number, or call toll-free 1800 1234 / 1800 2100 immediately."
      },
      {
        q: "Does JanSahayak AI ever ask for my ATM PIN or CVV?",
        a: "ABSOLUTELY NEVER. Never share your ATM PIN, 3-digit CVV, OTP, or net banking passwords with anyone, any website, or any AI assistant."
      }
    ],
    keywords: ["atm", "atm card", "debit card", "block atm", "lost card", "green pin", "rupay", "visa", "mastercard"]
  },

  {
    id: "cheque-book",
    category: "banking",
    categoryName: "Banking Services",
    name: "Cheque Book Request & Management",
    shortName: "Cheque Book",
    icon: "file-signature",
    badge: "Bank-Specific Citizen Service",
    officialPortal: "Respective Bank / RBI Guidelines",
    officialUrl: "https://www.rbi.org.in/",
    description: "Guidance for requesting a new cheque book online and offline, stopping payment of lost cheques, CTS-2010 standards, and cancelled cheque usage.",
    whoCanApply: [
      "Any savings or current account holder with cheque book facility enabled."
    ],
    requiredDocuments: [
      "Account number and registered mobile number.",
      "Requisition slip from previous cheque book (if applying via branch)."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Request Online via Mobile App or NetBanking",
        desc: "Navigate to Services > Cheque Book Request. Select number of leaves (20, 25, 50, or 100)."
      },
      {
        step: 2,
        title: "Confirm Communication Address",
        desc: "Verify that your registered delivery address is current."
      },
      {
        step: 3,
        title: "Delivery via Speed Post",
        desc: "Bank delivers CTS-2010 compliant personalized cheque book within 3-7 working days."
      }
    ],
    fees: {
      free_leaves: "Most banks provide 10-25 free cheque leaves per financial year",
      additional_leaves: "Approximately ₹2 to ₹4 per leaf + GST"
    },
    features: [
      "Cheque Book requisition via NetBanking/ATM",
      "Stop Payment of issued or lost cheque",
      "Preparation of Cancelled Cheque for scholarship / salary / ECS mandate",
      "Positive Pay System (PPS) guidelines for cheques above ₹50,000"
    ],
    faqs: [
      {
        q: "What is a 'Cancelled Cheque' and why is it needed for scholarships?",
        a: "A cancelled cheque has two parallel lines drawn across it with the word 'CANCELLED' written in between. It is used as official bank proof to confirm your Account Number, Name, and IFSC code without permitting money withdrawal."
      }
    ],
    keywords: ["cheque", "cheque book", "cancelled cheque", "cts 2010", "stop cheque", "positive pay"]
  },

  {
    id: "other-banking",
    category: "banking",
    categoryName: "Banking Services",
    name: "Digital Banking, KYC & UPI Guidance",
    shortName: "Digital Banking & KYC",
    icon: "smartphone",
    badge: "Bank-Specific Citizen Service",
    officialPortal: "National Payments Corporation of India (NPCI) / RBI",
    officialUrl: "https://www.rbi.org.in/",
    description: "Guidance for Bank KYC re-verification, Mobile Banking registration, NetBanking activation, Bank Statement download, and UPI safety guidelines.",
    whoCanApply: [
      "All bank account holders."
    ],
    requiredDocuments: [
      "Periodic KYC: Aadhaar Card, PAN Card, and latest Address proof.",
      "Bank Account Statement: No documents needed (downloadable via NetBanking / Mobile app)."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Periodic KYC Updation",
        desc: "RBI mandates periodic KYC. Low-risk accounts can complete re-KYC online via self-declaration or video-KYC without visiting a branch."
      },
      {
        step: 2,
        title: "Download Bank Account Statement",
        desc: "Generate password-protected 3/6/12 months PDF statement through mobile banking. Password format is typically date-of-birth + last digits of mobile/account."
      },
      {
        step: 3,
        title: "UPI Activation (BHIM / PhonePe / Google Pay)",
        desc: "Link bank account via registered SIM card and set 4 or 6 digit UPI PIN using Debit Card details."
      }
    ],
    fees: {
      kyc_and_statement: "Free of cost (Mandatory free service as per RBI regulations)"
    },
    features: [
      "RBI Re-KYC compliance instructions",
      "Official Bank Statement PDF download steps",
      "UPI payment safety & PIN security advisory",
      "NetBanking and Mobile Banking activation guide"
    ],
    faqs: [
      {
        q: "How often do I need to update KYC in my bank account?",
        a: "As per RBI norms: High-risk customers every 2 years, Medium-risk customers every 8 years, and Low-risk customers every 10 years. If there are no changes, a simple self-declaration is sufficient."
      }
    ],
    keywords: ["kyc", "re-kyc", "upi", "netbanking", "mobile banking", "bank statement", "npci", "rbi"]
  },

  // =========================================================================
  // CATEGORY D: GOVERNMENT CERTIFICATES (TELANGANA & EXTENSIBLE)
  // =========================================================================
  {
    id: "income-certificate",
    category: "certificate",
    categoryName: "Government Certificates",
    name: "Income Certificate (MeeSeva / Revenue)",
    shortName: "Income Certificate",
    icon: "file-text",
    badge: "State Govt (Revenue Department)",
    officialPortal: "Telangana MeeSeva Citizen Portal",
    officialUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    applicationUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    trackingUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    description: "Guidance for obtaining digitally signed Revenue Department Income Certificate via MeeSeva for scholarship eligibility, fee reimbursement, and government welfare schemes.",
    whoCanApply: [
      "Resident citizens of Telangana State whose annual family income needs certification for educational, welfare, or subsidy purposes."
    ],
    requiredDocuments: [
      "Application form duly filled and signed.",
      "Salary Certificate / Payslip (for salaried employees) or Income tax returns / Form 16.",
      "Aadhaar Card of the applicant and family members.",
      "Ration Card / Food Security Card copy.",
      "Electricity Bill or House Tax receipt."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Visit Nearest MeeSeva Centre or Online Portal",
        desc: "Apply through MeeSeva portal (meeseva.telangana.gov.in) or visit any authorized MeeSeva kiosk."
      },
      {
        step: 2,
        title: "Submit Documents & Pay User Charges",
        desc: "Operator scans documents and submits file to the concerned Tahsildar / Revenue Inspector (RI)."
      },
      {
        step: 3,
        title: "Enquiry & Digital Verification",
        desc: "VRO / RI conducts field verification and submits report to the Tahsildar."
      },
      {
        step: 4,
        title: "Digital Signature & Certificate Issue",
        desc: "Tahsildar digitally signs the certificate with QR code. Download printed copy on security paper with hologram."
      }
    ],
    fees: {
      meeseva_service_charge: "₹45 (Statutory service charge across Telangana)",
      validity: "Valid for 1 financial year from the date of issuance"
    },
    features: [
      "Revenue Department Tahsildar approval",
      "QR-code digitally signed authenticity",
      "Mandatory requirement for ePASS RTF & MTF",
      "Online MeeSeva application status tracking",
      "SLA processing time: 7 business days"
    ],
    faqs: [
      {
        q: "What is the validity of a MeeSeva Income Certificate in Telangana?",
        a: "A MeeSeva Income Certificate is valid for ONE financial year (April 1 to March 31). Scholarships require a certificate issued within the current academic/financial cycle."
      },
      {
        q: "What are the income ceilings for Telangana ePASS scholarships?",
        a: "Rural students: ₹1,50,000 per annum. Urban students: ₹2,00,000 per annum. SC/ST students: ₹2,50,000 per annum."
      }
    ],
    keywords: ["income certificate", "meeseva", "tahsildar", "vro", "revenue", "telangana", "annual income"]
  },

  {
    id: "caste-certificate",
    category: "certificate",
    categoryName: "Government Certificates",
    name: "Integrated Community / Caste Certificate",
    shortName: "Caste Certificate",
    icon: "award",
    badge: "State Govt (Revenue Department)",
    officialPortal: "Telangana MeeSeva Portal",
    officialUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    applicationUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    trackingUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    description: "Guidance for applying for an Integrated Community, Nativity, and Date of Birth Certificate for SC, ST, BC, and Minority students in Telangana via MeeSeva.",
    whoCanApply: [
      "Citizens belonging to Scheduled Castes (SC), Scheduled Tribes (ST), Backward Classes (BC), or Minority communities residing in the state."
    ],
    requiredDocuments: [
      "Application Form filled and signed.",
      "Aadhaar Card copy of applicant and parents.",
      "School Marks Memo / Transfer Certificate (TC) showing caste and date of birth.",
      "Father's / Sibling's existing certified Caste Certificate (if available).",
      "Ration Card or Electoral photo ID card."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Submit Application at MeeSeva",
        desc: "Submit application form along with school certificates and lineage documents."
      },
      {
        step: 2,
        title: "Revenue Scrutiny & Enquiry",
        desc: "Village Revenue Officer (VRO) and Mandal Revenue Inspector (MRI) verify caste records."
      },
      {
        step: 3,
        title: "Tahsildar Digital Signature",
        desc: "Tahsildar approves and signs the certificate electronically."
      },
      {
        step: 4,
        title: "Collect Hologram Certificate",
        desc: "Download digitally signed PDF or collect printout from MeeSeva center."
      }
    ],
    fees: {
      meeseva_service_charge: "₹45 (Statutory service fee)",
      validity: "Life-long validity (unless revoked by competent authority)"
    },
    features: [
      "Permanent Life-Long validity",
      "Integrated with Nativity and DOB",
      "Mandatory for reservation benefits and scholarships",
      "SLA processing time: 15 to 30 days"
    ],
    faqs: [
      {
        q: "Does a Caste Certificate in Telangana expire?",
        a: "No. An Integrated Caste Certificate has lifelong validity. You do not need to apply again every year, unlike an income certificate."
      }
    ],
    keywords: ["caste certificate", "community certificate", "sc", "st", "bc", "minority", "meeseva", "tahsildar"]
  },

  {
    id: "domicile-certificate",
    category: "certificate",
    categoryName: "Government Certificates",
    name: "Residence / Domicile Certificate",
    shortName: "Residence Certificate",
    icon: "home",
    badge: "State Govt (Revenue Department)",
    officialPortal: "Telangana MeeSeva Portal",
    officialUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    applicationUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    trackingUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    description: "Guidance for obtaining Residence / Domicile / Local Status Certificate proving permanent residency in Telangana for state quota admissions and government jobs.",
    whoCanApply: [
      "Any person who has resided in the State of Telangana for the prescribed consecutive period (typically 4 or 7 years of continuous study/residence)."
    ],
    requiredDocuments: [
      "Study / Bonafide Certificates from Class 4th to 10th or Degree proving local status.",
      "Aadhaar Card and Voter ID.",
      "House Tax Receipt / Electricity Bill / Sale Deed of property.",
      "Ration Card copy."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Submit Residence Application at MeeSeva",
        desc: "Fill form with period of stay and upload bonafide study certificates."
      },
      {
        step: 2,
        title: "Revenue Inspector Field Verification",
        desc: "Local revenue staff checks address records and local candidate rules."
      },
      {
        step: 3,
        title: "Tahsildar Digital Sign & Issue",
        desc: "Certificate is issued with barcode and verification URL."
      }
    ],
    fees: {
      meeseva_service_charge: "₹45",
      validity: "Permanent or as specified by admitting authority"
    },
    features: [
      "Determines 85% local candidate quota in state colleges",
      "Required for central government recruitments & defense quota",
      "SLA processing time: 7 business days"
    ],
    faqs: [
      {
        q: "Why is a Residence Certificate needed for higher education?",
        a: "In Telangana, 85% of seats in engineering, medical, and degree colleges are reserved for local candidates under the Presidential Order. This certificate proves your local candidate status."
      }
    ],
    keywords: ["domicile", "residence certificate", "local candidate", "nativity", "meeseva", "presidential order"]
  },

  {
    id: "birth-certificate",
    category: "certificate",
    categoryName: "Government Certificates",
    name: "Birth Certificate (GHMC / Municipalities)",
    shortName: "Birth Certificate",
    icon: "baby",
    badge: "Local Body / Municipal Administration",
    officialPortal: "CDMA Telangana / GHMC Citizen Services",
    officialUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    applicationUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    trackingUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    description: "Guidance for registering new births, obtaining digital birth certificates, inclusion of child's name, and obtaining certified non-availability certificates.",
    whoCanApply: [
      "Parents, guardians, or individuals born within the municipal/gram panchayat jurisdiction."
    ],
    requiredDocuments: [
      "Hospital Birth Report Form (issued at delivery by hospital).",
      "Aadhaar Cards of both parents.",
      "Marriage Certificate / Proof of parentage (if requested).",
      "Discharge summary of the mother."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Hospital Institutional Registration",
        desc: "Hospitals report births directly to the local municipal registrar within 21 days."
      },
      {
        step: 2,
        title: "Child Name Inclusion at MeeSeva",
        desc: "Parents apply to include child's name within 1 year without penalty."
      },
      {
        step: 3,
        title: "Download QR-coded Birth Certificate",
        desc: "Download digitally signed certificate from CDMA / GHMC portal or MeeSeva."
      }
    ],
    fees: {
      within_21_days: "Free of cost at hospital registration",
      meeseva_issue_fee: "₹45 user charge for certified printed copy"
    },
    features: [
      "Primary Proof of Date of Birth for Passport, School, and PAN",
      "Online name inclusion within 1 year",
      "Digital verification via GHMC/CDMA portal"
    ],
    faqs: [
      {
        q: "What if a birth was not registered within 21 days?",
        a: "Late registration between 21 and 30 days is done with a nominal fee. Between 30 days and 1 year, Tahsildar/RDO permission is required. Beyond 1 year, an order from the Judicial First Class Magistrate is required."
      }
    ],
    keywords: ["birth certificate", "ghmc", "cdma", "dob proof", "municipal", "gram panchayat"]
  },

  {
    id: "ration-card",
    category: "certificate",
    categoryName: "Government Certificates",
    name: "Food Security Card (Ration Card)",
    shortName: "Ration Card",
    icon: "shopping-bag",
    badge: "Civil Supplies Department",
    officialPortal: "Telangana Civil Supplies Consumer Affairs",
    officialUrl: "https://epds.telangana.gov.in/",
    applicationUrl: "https://ts.meeseva.telangana.gov.in/meeseva/home.htm",
    trackingUrl: "https://epds.telangana.gov.in/FoodSecurityAct/",
    description: "Guidance for Food Security Card (FSC) application, member addition/deletion, transfer of Fair Price Shop, and One Nation One Ration Card (ONORC) benefits.",
    whoCanApply: [
      "Families residing in Telangana meeting rural/urban income criteria for Below Poverty Line (BPL) food security support."
    ],
    requiredDocuments: [
      "Aadhaar Cards of all family members.",
      "Income Certificate / Proof of income.",
      "Address proof: Electricity bill or house tax receipt.",
      "Group family photograph."
    ],
    applicationSteps: [
      {
        step: 1,
        title: "Submit FSC Application at MeeSeva",
        desc: "Submit application form along with Aadhaar details of all members."
      },
      {
        step: 2,
        title: "Civil Supplies Field Inspection",
        desc: "Food Revenue Inspector verifies eligibility and income threshold."
      },
      {
        step: 3,
        title: "Approval & Card Generation",
        desc: "FSC number is assigned and physical card / digital coupon is issued."
      }
    ],
    fees: {
      meeseva_charge: "₹45"
    },
    features: [
      "Subsidized food grain entitlements",
      "Serves as definitive BPL proof for welfare schemes",
      "One Nation One Ration Card (ONORC) portable across India"
    ],
    faqs: [
      {
        q: "How does a Food Security Card help with student scholarships?",
        a: "Holding an active Food Security Card (Ration Card) in Telangana serves as primary corroborating proof of BPL/low-income status, speeding up income certificate and scholarship approval."
      }
    ],
    keywords: ["ration card", "food security card", "fsc", "civil supplies", "epds", "onorc", "bpl"]
  }
];

const SERVICE_CATEGORIES = [
  {
    id: "all",
    name: "All Citizen Services",
    icon: "layout-grid",
    count: CITIZEN_SERVICES.length
  },
  {
    id: "identity",
    name: "Identity Services",
    icon: "shield-check",
    count: CITIZEN_SERVICES.filter(s => s.category === "identity").length
  },
  {
    id: "travel",
    name: "Travel & Transport",
    icon: "plane",
    count: CITIZEN_SERVICES.filter(s => s.category === "travel").length
  },
  {
    id: "banking",
    name: "Banking Services",
    icon: "landmark",
    count: CITIZEN_SERVICES.filter(s => s.category === "banking").length
  },
  {
    id: "certificate",
    name: "Government Certificates",
    icon: "file-text",
    count: CITIZEN_SERVICES.filter(s => s.category === "certificate").length
  }
];

module.exports = { CITIZEN_SERVICES, SERVICE_CATEGORIES };

