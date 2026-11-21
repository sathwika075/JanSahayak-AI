# JanSahayak AI – Smart Government Services & Student Assistance Platform

> **Track 01:** Civic Pulse, Digital Governance & Public Information  
> Built as an autonomous, production-style civic intelligence platform for Indian students and citizens.

---

## 🏛️ Executive Summary

**JanSahayak AI** is an advanced AI-powered government welfare and scholarship assistant designed for Indian students. It helps discover central and state government scholarships, evaluates eligibility deterministically using published statutory rules, performs OCR extraction on MeeSeva/DigiLocker documents, provides conversational multi-lingual RAG guidance, and tracks application roadmaps to official government portals.

### Initial Focus & Scope
- **Central Government Schemes:** National Scholarship Portal (NSP), Department of Higher Education (CSSS), AICTE Pragati for Girls, UGC NFOBC.
- **Telangana State Schemes:** Telangana ePASS (RTF Tuition Fee Reimbursement & MTF Maintenance Fee), Ambedkar Overseas Vidya Nidhi, Shaadi Mubarak / Kalyana Lakshmi.
- **Official Open Data Sources:** myScheme.gov.in, data.gov.in, and API Setu compliance interfaces.

---

## 🎨 Visual Identity & UI Design System

Crafted to look like a modern, futuristic AI SaaS platform with a civic governance soul:
- **Jet Black Primary:** `#08090D`
- **Secondary Dark:** `#10131B`
- **Dark Card Background:** `#151B27`
- **Cerulean Blue Accent:** `#007BA7`
- **Electric Blue Highlight:** `#29B6F6`
- **Neon Rose Accent:** `#FF2D87`
- **Pink Highlight:** `#FF4FA3`
- **Status Green & Amber:** `#22C55E` / `#F59E0B`
- **Glassmorphism cards, responsive sidebar, data visualizations, and multi-lingual toggles.**

---

## 🚀 Key Features Across All 9 Pages

1. **Page 1: Home Dashboard**
   - Student profile completion tracker (95%).
   - Recommended scholarship cards based on user profile.
   - Upcoming deadlines and verified government statistics.
2. **Page 2: AI Government Assistant**
   - Grounded RAG conversational interface with official citations.
   - Multi-lingual support: **English, Telugu (తెలుగు), and Hindi (हिन्दी)**.
   - Speech recognition (voice input) and quick prompt chips.
   - Copy response and clear chat features.
3. **Page 3: Scholarship Finder**
   - Multi-criteria real-time search and filtering (Central vs State, Social Category, Education Level, Deadlines).
   - Direct link to official government submission portals.
4. **Page 4: Deterministic AI Eligibility Checker**
   - Mathematical and categorical evaluation engine in Python/JS.
   - Audits criteria: Annual Family Income, State Domicile, Reservation Category, Marks/CGPA, and Gender.
   - Zero LLM hallucination: Explains evidence with granular audit checks.
5. **Page 5: Document Intelligence (OCR)**
   - Optical field extraction for MeeSeva Income Certificates, Caste Certificates, and Marksheets.
   - Extracted field mapping (Annual Income, Reference Number, Issue Date, Student Name).
   - Quality warnings and compliance disclaimer (does not claim legal authentication).
6. **Page 6: Application Guidance**
   - Step-by-step verified roadmaps for state and central portals.
   - Interactive checklist with completed/pending toggles and deadline reminders.
7. **Page 7: Saved Schemes**
   - Bookmark schemes for quick reference, deadline tracking, and comparison.
8. **Page 8: Government Knowledge Hub (Admin)**
   - Status monitor for government data adapters (myScheme, NSP, ePASS, data.gov.in, API Setu).
   - Ingestion tool for official PDFs, circulars, and gazettes.
   - Vector embedding rebuild trigger.
9. **Page 9: Admin Analytics**
   - Real-time statistics: Registered students, verified schemes, document counts, and adapter health logs.

---

## 🛠️ Architecture & Technology Stack

```
jansahayak-ai/
├── backend/
│   ├── server.js               # High-performance REST API Server (Port 4000)
│   ├── schemesData.js          # Verified Official Government Schemes Catalog
│   ├── sourcesData.js          # Modular Government Data Adapters Configuration
│   ├── eligibilityEngine.js    # Deterministic Rule Evaluation Engine
│   ├── ragWorkflow.js          # 8-Node Agent Orchestrator with RAG Knowledge Base
│   ├── ocrProcessor.js         # Document Intelligence & Field Extraction
│   └── runTests.js             # Automated Test Suite (13/13 Tests Passing)
├── frontend/
│   ├── index.html              # Modern 9-Page Single Page Application UI
│   └── serve.js                # Frontend Server (Port 3000)
├── data/                       # Vector data and documents
├── tests/                      # Automated test scripts
├── .env.example                # Environment configuration template
└── README.md                   # Complete documentation
```

---

## 🧪 Automated QA Test Results

Run the verification test suite anytime:
```bash
node backend/runTests.js
```

**Results:**
- ✅ Official schemes loaded (Found 8 schemes)
- ✅ Telangana ePASS RTF scheme criteria valid
- ✅ Government source adapters configured (Found 5 adapters)
- ✅ myScheme adapter verified
- ✅ Eligibility engine: Valid student passes criteria
- ✅ Eligibility engine: High income correctly flagged
- ✅ Eligibility engine: State mismatch caught
- ✅ RAG Retrieval returns grounded official passages
- ✅ LangGraph Agent: Multi-lingual Telugu answer generated
- ✅ AI Agent provides verified source citations
- ✅ OCR Intelligence: Annual income accurately extracted
- ✅ OCR Intelligence: Certificate reference number extracted
- ✅ OCR: Government compliance disclaimer verified
**Summary: 13/13 Tests Passed (100% Passing)**

---

## 💻 How to Run Locally

### 1. Start the Backend Engine
```bash
node backend/server.js 

```
The REST API will be accessible at: `http://127.0.0.1:4000/api`

### 2. Start the Frontend Web Client
```bash
node frontend/serve.js
```
Open your browser and navigate to:
👉 **`http://localhost:3000`** (or open `frontend/index.html` directly in any web browser).

### 3. Demo Credentials
- **Student Profile:** `student@telangana.edu.in` / `Student@123`
- **Admin Profile:** `admin@jansahayak.gov.in` / `Admin@123`

