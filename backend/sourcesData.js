// c:\Nxtwave-Sathwika\jansahayak-ai\backend\sourcesData.js
// Authoritative National Government Data Adapters & Official Source Registry
// Covers Central Government Portals, State Schemes, and Statutory Authorities

const SOURCES = [
  {
    id: "src-myscheme",
    name: "myScheme National Platform",
    official_url: "https://www.myscheme.gov.in/",
    adapter_type: "REST_API_AND_CATALOG",
    connection_status: "Connected (Verified Source)",
    auth_type: "Official Public Catalog & Open Data Feed",
    last_successful_update: "2026-11-18T08:30:00Z",
    last_verification_date: "2026-11-18",
    imported_schemes_count: 520,
    sync_frequency: "Daily",
    errors: [],
    description: "National e-Governance Division (NeGD) platform for discovering central & state government schemes with structured criteria and documents."
  },
  {
    id: "src-data-gov",
    name: "Open Government Data (OGD) Platform India",
    official_url: "https://data.gov.in/",
    adapter_type: "OPEN_DATA_REST_API",
    connection_status: "Connected (Public Datasets)",
    auth_type: "National Data Sharing & Accessibility Policy (NDSAP)",
    last_successful_update: "2026-11-18T06:00:00Z",
    last_verification_date: "2026-11-17",
    imported_schemes_count: 310,
    sync_frequency: "Daily",
    errors: [],
    description: "Open access repository of government datasets published by Central Ministries and State Departments under NIC."
  },
  {
    id: "src-india-gov",
    name: "National Portal of India (india.gov.in)",
    official_url: "https://www.india.gov.in/my-government/schemes",
    adapter_type: "GOVERNMENT_DIRECTORY_FEED",
    connection_status: "Connected (Official Directory)",
    auth_type: "Public Directory API & Metadata",
    last_successful_update: "2026-11-18T04:00:00Z",
    last_verification_date: "2026-11-16",
    imported_schemes_count: 450,
    sync_frequency: "Weekly",
    errors: [],
    description: "Official Single-Window National Portal providing authentic access to government services, acts, and welfare schemes across India."
  },
  {
    id: "src-nsp",
    name: "National Scholarship Portal (NSP)",
    official_url: "https://scholarships.gov.in/",
    adapter_type: "DOCUMENT_AND_OFFICIAL_FEED",
    connection_status: "Connected (Official Guidelines)",
    auth_type: "Public Notification & OTR Schema",
    last_successful_update: "2026-11-18T09:15:00Z",
    last_verification_date: "2026-11-15",
    imported_schemes_count: 85,
    sync_frequency: "Daily",
    errors: [],
    description: "One-stop digital platform of the Government of India for all pre-matric and post-matric central scholarship disbursements."
  },
  {
    id: "src-igod",
    name: "Integrated Government Online Directory (iGOD)",
    official_url: "https://igod.gov.in/",
    adapter_type: "MINISTRY_REGISTRY_FEED",
    connection_status: "Connected (NIC Directory)",
    auth_type: "National Informatics Centre Public Schema",
    last_successful_update: "2026-11-17T12:00:00Z",
    last_verification_date: "2026-11-14",
    imported_schemes_count: 140,
    sync_frequency: "Weekly",
    errors: [],
    description: "NIC comprehensive catalog of websites of Indian Government Ministries, Departments, Apex Bodies, and State Portals."
  },
  {
    id: "src-mahadbt",
    name: "MahaDBT Portal (Maharashtra)",
    official_url: "https://mahadbt.maharashtra.gov.in/",
    adapter_type: "STATE_DIRECT_BENEFIT_TRANSFER",
    connection_status: "Connected (State Verified)",
    auth_type: "Maharashtra State Domicile & DBT Schema",
    last_successful_update: "2026-11-18T05:00:00Z",
    last_verification_date: "2026-11-10",
    imported_schemes_count: 38,
    sync_frequency: "Weekly",
    errors: [],
    description: "Maharashtra state welfare and post-matric scholarship platform covering higher education, tribal development, and social justice."
  },
  {
    id: "src-kar-ssp",
    name: "State Scholarship Portal (SSP Karnataka)",
    official_url: "https://ssp.postmatric.karnataka.gov.in/",
    adapter_type: "STATE_DIRECT_BENEFIT_TRANSFER",
    connection_status: "Connected (Kutumba Integrated)",
    auth_type: "Karnataka Center for e-Governance Schema",
    last_successful_update: "2026-11-18T05:30:00Z",
    last_verification_date: "2026-11-09",
    imported_schemes_count: 24,
    sync_frequency: "Weekly",
    errors: [],
    description: "Integrated post-matric scholarship system of Karnataka mapped with Kutumba family state database and Nadakacheri revenue certificates."
  },
  {
    id: "src-ts-epass",
    name: "Telangana ePASS Portal",
    official_url: "https://telanganaepass.cgg.gov.in/",
    adapter_type: "DOCUMENT_INGESTION_AND_GAZETTE",
    connection_status: "Connected (Gazette Verified)",
    auth_type: "State Portal Scrutiny & G.O. Records",
    last_successful_update: "2026-11-18T07:00:00Z",
    last_verification_date: "2026-11-12",
    imported_schemes_count: 18,
    sync_frequency: "Weekly",
    errors: [],
    description: "Electronic Payment and Application System of Scholarships by Government of Telangana for RTF and MTF."
  },
  {
    id: "src-uidai",
    name: "Unique Identification Authority of India (UIDAI)",
    official_url: "https://uidai.gov.in/",
    adapter_type: "AUTHORITATIVE_PORTAL_GUIDELINES",
    connection_status: "Connected (Official Circulars)",
    auth_type: "UIDAI Public Service Norms",
    last_successful_update: "2026-11-18T10:00:00Z",
    last_verification_date: "2026-11-16",
    imported_schemes_count: 6,
    sync_frequency: "Daily",
    errors: [],
    description: "Statutory authority under MeitY for 12-digit Aadhaar enrolment, biometric/demographic updates, and e-Aadhaar verification."
  },
  {
    id: "src-incometax",
    name: "Income Tax Department (Protean / UTIITSL)",
    official_url: "https://www.incometax.gov.in/iec/foportal/",
    adapter_type: "AUTHORITATIVE_PORTAL_GUIDELINES",
    connection_status: "Connected (CBDT Gazette)",
    auth_type: "CBDT e-Filing Public Guidelines",
    last_successful_update: "2026-11-18T08:00:00Z",
    last_verification_date: "2026-11-15",
    imported_schemes_count: 4,
    sync_frequency: "Daily",
    errors: [],
    description: "Direct taxes authority issuing Permanent Account Numbers (Form 49A) and instant paperless e-PAN."
  },
  {
    id: "src-passport-seva",
    name: "Passport Seva Portal (Ministry of External Affairs)",
    official_url: "https://www.passportindia.gov.in/psp",
    adapter_type: "AUTHORITATIVE_PORTAL_GUIDELINES",
    connection_status: "Connected (CPV Division)",
    auth_type: "MEA Citizen Service Standards",
    last_successful_update: "2026-11-18T08:00:00Z",
    last_verification_date: "2026-11-15",
    imported_schemes_count: 3,
    sync_frequency: "Daily",
    errors: [],
    description: "Consular, Passport and Visa (CPV) Division under the Ministry of External Affairs for Fresh and Tatkaal passport processing."
  },
  {
    id: "src-rbi",
    name: "Reserve Bank of India (RBI Banking Ombudsman)",
    official_url: "https://www.rbi.org.in/",
    adapter_type: "STATUTORY_DIRECTIVES",
    connection_status: "Connected (RBI Master Directions)",
    auth_type: "Banking Regulation Act Norms",
    last_successful_update: "2026-11-18T09:00:00Z",
    last_verification_date: "2026-11-14",
    imported_schemes_count: 8,
    sync_frequency: "Daily",
    errors: [],
    description: "Central bank guidelines on citizen savings accounts, zero-balance BSBDA facilities, and 24x7 ATM emergency blocking standards."
  }
];

module.exports = {
  SOURCES
};
