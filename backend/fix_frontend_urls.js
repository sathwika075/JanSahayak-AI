/**
 * fix_frontend_urls.js
 * Fixes all broken URLs in frontend/index.html:
 * 1. instantPanUrl double-replace: iec/foportal/iec/foportal/ → iec/foportal/
 * 2. Ration card & Birth cert applicationUrl: home.htmmeeseva/home.htm → home.htm
 * 3. scholarships.gov.in/ 404 → scholarships.gov.in/fresh
 * 4. myaadhaar.uidai.gov.in → uidai.gov.in (since myaadhaar times out)
 */

const fs = require('fs');
const path = require('path');

const frontendFile = path.resolve(__dirname, '../frontend/index.html');
const backupFile   = frontendFile + '.bak_' + Date.now();

let html = fs.readFileSync(frontendFile, 'utf8');
const original = html;

// --- FIX 1: Double-replaced instantPanUrl ---
const before1 = 'https://www.incometax.gov.in/iec/foportal/iec/foportal/';
const after1  = 'https://www.incometax.gov.in/iec/foportal/';
let count1 = (html.match(new RegExp(before1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
html = html.split(before1).join(after1);
console.log(`Fix 1 (instantPanUrl double-path): replaced ${count1} occurrence(s)`);

// --- FIX 2: Double-concatenated MeeSeva URL ---
const before2 = 'home.htmmeeseva/home.htm';
const after2  = 'home.htm';
let count2 = (html.match(new RegExp(before2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
html = html.split(before2).join(after2);
console.log(`Fix 2 (MeeSeva double-concat): replaced ${count2} occurrence(s)`);

// --- FIX 3: scholarships.gov.in 404 → fresh ---
// Only fix the bare root URL that 404s, preserve any already-correct /fresh paths
const before3a = '"https://scholarships.gov.in/"';
const after3a  = '"https://scholarships.gov.in/fresh"';
let count3a = (html.match(new RegExp(before3a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
html = html.split(before3a).join(after3a);

const before3b = "'https://scholarships.gov.in/'";
const after3b  = "'https://scholarships.gov.in/fresh'";
let count3b = (html.match(new RegExp(before3b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
html = html.split(before3b).join(after3b);
console.log(`Fix 3 (scholarships.gov.in 404): replaced ${count3a + count3b} occurrence(s)`);

// --- FIX 4: myaadhaar.uidai.gov.in → uidai.gov.in ---
// myaadhaar times out for users outside India or behind WAF
// Use the main UIDAI portal as the safe fallback
const before4 = 'https://myaadhaar.uidai.gov.in/';
const after4  = 'https://uidai.gov.in/en/my-aadhaar.html';
let count4 = (html.match(new RegExp(before4.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
html = html.split(before4).join(after4);
console.log(`Fix 4 (myaadhaar → uidai.gov.in portal): replaced ${count4} occurrence(s)`);

// --- VERIFY no double-paths remain ---
const checks = [
  ['iec/foportal/iec', 'instantPanUrl still double-pathed'],
  ['home.htmmeeseva',  'MeeSeva URL still double-concatenated'],
];
let allOk = true;
for (const [pattern, label] of checks) {
  if (html.includes(pattern)) {
    console.error(`ERROR: ${label} — still found: ${pattern}`);
    allOk = false;
  }
}

if (!allOk) {
  console.error('Aborting — not writing file due to remaining errors.');
  process.exit(1);
}

// Save backup + write fixed file
if (html !== original) {
  fs.writeFileSync(backupFile, original, 'utf8');
  fs.writeFileSync(frontendFile, html, 'utf8');
  console.log(`\n✅ Fixed frontend/index.html written successfully.`);
  console.log(`   Backup saved to: ${path.basename(backupFile)}`);
  console.log(`   File size: ${html.length} bytes`);
} else {
  console.log('\nNo changes made — file already clean.');
}

