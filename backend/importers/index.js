// c:\Nxtwave-Sathwika\jansahayak-ai\backend\importers\index.js
// Modular Government Scheme Import Pipeline Engine
// Importers: myschemeImporter, dataGovImporter, scholarshipImporter, centralSchemeImporter, stateSchemeImporter, utSchemeImporter

const { SCHEMES: BASE_SCHEMES } = require('../schemesData');
const { CENTRAL_NATIONAL_SCHEMES } = require('../centralNationalSchemes');
const { STATE_NATIONAL_SCHEMES } = require('../stateNationalSchemes');
const { ADDITIONAL_STATE_UT_SCHEMES } = require('../allStatesSchemesCatalog');

const ALL_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const ALL_UTS = [
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

/**
 * Normalization helper: Standardizes field names, state names, and formats
 */
function normalizeScheme(raw, sourceTag) {
  const stateRaw = raw.state ? raw.state.trim() : 'All India (Central)';
  let normState = stateRaw;

  // Match state
  const stateMatch = ALL_STATES.find(s => s.toLowerCase() === stateRaw.toLowerCase());
  const utMatch = ALL_UTS.find(u => u.toLowerCase() === stateRaw.toLowerCase());
  if (stateMatch) normState = stateMatch;
  else if (utMatch) normState = utMatch;
  else if (stateRaw.toLowerCase().includes('central') || stateRaw.toLowerCase().includes('all india')) normState = 'All India (Central)';

  return {
    id: raw.id || `sch-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: raw.name ? raw.name.trim() : 'Unknown Scheme',
    ministry: raw.ministry ? raw.ministry.trim() : 'Government of India / State Department',
    state: normState,
    type: raw.type || (normState === 'All India (Central)' ? 'Central Sector Scheme' : (ALL_UTS.includes(normState) ? 'UT Scheme' : 'State Scheme')),
    domain: raw.domain || raw.scheme_category || 'Social Welfare & Development',
    target_beneficiaries: raw.target_beneficiaries || ['Citizens meeting eligibility criteria'],
    min_age: raw.min_age !== undefined ? raw.min_age : null,
    max_age: raw.max_age !== undefined ? raw.max_age : null,
    income_limit: raw.income_limit !== undefined ? raw.income_limit : null,
    category_eligible: raw.category_eligible || ['All'],
    gender_eligible: raw.gender_eligible || 'All',
    education_level: raw.education_level || ['All'],
    employment_status: raw.employment_status || ['All'],
    disability_status: raw.disability_status || 'All',
    benefits: raw.benefits || 'Financial or institutional government assistance',
    required_documents: raw.required_documents || ['Aadhaar Card', 'Resident/Domicile Certificate', 'Bank Passbook'],
    application_procedure: raw.application_procedure || 'Apply online on the official department portal.',
    application_deadline: raw.application_deadline || 'Active / Rolling',
    official_url: raw.official_url || 'https://www.india.gov.in/',
    guideline_url: raw.guideline_url || raw.official_url || 'https://www.india.gov.in/',
    source_url: raw.source_url || raw.official_url || 'https://www.india.gov.in/',
    last_verified: raw.last_verified || new Date().toISOString().split('T')[0],
    status: raw.status || 'Active',
    source_name: raw.source_name || sourceTag
  };
}

/**
 * 1. myScheme Importer
 */
function myschemeImporter() {
  const records = [
    ...CENTRAL_NATIONAL_SCHEMES.filter(s => (s.source_name || '').includes('myScheme') || (s.source_name || '').includes('National')),
    ...STATE_NATIONAL_SCHEMES.filter(s => (s.source_name || '').includes('myScheme') || (s.source_name || '').includes('Portal')),
    ...BASE_SCHEMES.filter(s => (s.source_name || '').includes('myScheme'))
  ];
  return records.map(r => normalizeScheme(r, 'myScheme Platform'));
}

/**
 * 2. National Scholarship Portal (NSP) Importer
 */
function scholarshipImporter() {
  const records = [
    ...BASE_SCHEMES.filter(s => (s.source_name || '').includes('NSP') || s.name.includes('Scholarship')),
    ...CENTRAL_NATIONAL_SCHEMES.filter(s => (s.source_name || '').includes('NSP') || s.name.includes('Scholarship') || s.domain.includes('Education')),
    ...ADDITIONAL_STATE_UT_SCHEMES.filter(s => (s.source_name || '').includes('NSP') || s.domain.includes('Scholarship') || s.name.includes('Scholarship'))
  ];
  return records.map(r => normalizeScheme(r, 'National Scholarship Portal'));
}

/**
 * 3. Central Scheme Importer
 */
function centralSchemeImporter() {
  const records = CENTRAL_NATIONAL_SCHEMES.filter(s => s.state === 'All India (Central)');
  return records.map(r => normalizeScheme(r, 'Central Ministries Feed'));
}

/**
 * 4. State Scheme Importer (Covers all 28 States)
 */
function stateSchemeImporter() {
  const records = [
    ...BASE_SCHEMES.filter(s => ALL_STATES.includes(s.state)),
    ...STATE_NATIONAL_SCHEMES.filter(s => ALL_STATES.includes(s.state)),
    ...ADDITIONAL_STATE_UT_SCHEMES.filter(s => ALL_STATES.includes(s.state))
  ];
  return records.map(r => normalizeScheme(r, 'State Official Portals'));
}

/**
 * 5. UT Scheme Importer (Covers all 8 UTs)
 */
function utSchemeImporter() {
  const records = [
    ...STATE_NATIONAL_SCHEMES.filter(s => ALL_UTS.includes(s.state)),
    ...ADDITIONAL_STATE_UT_SCHEMES.filter(s => ALL_UTS.includes(s.state))
  ];
  return records.map(r => normalizeScheme(r, 'UT Administration Portals'));
}

/**
 * Deduplicate & Build Unified National Scheme Repository
 */
function runAllImporters() {
  const importedList = [
    ...myschemeImporter(),
    ...scholarshipImporter(),
    ...centralSchemeImporter(),
    ...stateSchemeImporter(),
    ...utSchemeImporter()
  ];

  const map = new Map();
  let duplicatesCount = 0;

  for (const item of importedList) {
    if (map.has(item.id)) {
      duplicatesCount++;
    } else {
      map.set(item.id, item);
    }
  }

  const uniqueSchemes = Array.from(map.values());

  // Calculate Coverage
  const stateStats = {};
  ALL_STATES.forEach(s => stateStats[s] = 0);
  const utStats = {};
  ALL_UTS.forEach(u => utStats[u] = 0);

  let centralTotal = 0;
  uniqueSchemes.forEach(s => {
    if (s.state === 'All India (Central)') {
      centralTotal++;
    } else if (stateStats[s.state] !== undefined) {
      stateStats[s.state]++;
    } else if (utStats[s.state] !== undefined) {
      utStats[s.state]++;
    }
  });

  return {
    totalRawImported: importedList.length,
    totalUnique: uniqueSchemes.length,
    duplicatesDetected: duplicatesCount,
    centralCount: centralTotal,
    statesCount: Object.values(stateStats).filter(v => v > 0).length,
    utsCount: Object.values(utStats).filter(v => v > 0).length,
    stateCoverage: stateStats,
    utCoverage: utStats,
    schemes: uniqueSchemes
  };
}

module.exports = {
  myschemeImporter,
  scholarshipImporter,
  centralSchemeImporter,
  stateSchemeImporter,
  utSchemeImporter,
  runAllImporters,
  ALL_STATES,
  ALL_UTS
};

