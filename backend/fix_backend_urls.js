/**
 * fix_backend_urls.js — Fix broken URLs in backend data files
 */
const fs = require('fs');
const path = require('path');

const files = [
  path.resolve(__dirname, 'servicesData.js'),
  path.resolve(__dirname, 'serviceAgents.js'),
  path.resolve(__dirname, 'sourcesData.js'),
  path.resolve(__dirname, 'ragWorkflow.js'),
  path.resolve(__dirname, 'schemesData.js'),
];

const fixes = [
  // Fix 1: instantPanUrl double-replace
  ['https://www.incometax.gov.in/iec/foportal/iec/foportal/', 'https://www.incometax.gov.in/iec/foportal/'],
  // Fix 2: MeeSeva double-concat
  ['home.htmmeeseva/home.htm', 'home.htm'],
  // Fix 3: scholarships.gov.in 404
  ['"https://scholarships.gov.in/"', '"https://scholarships.gov.in/fresh"'],
  ["'https://scholarships.gov.in/'", "'https://scholarships.gov.in/fresh'"],
  // Fix 4: myaadhaar.uidai.gov.in → uidai.gov.in portal
  ['https://myaadhaar.uidai.gov.in/', 'https://uidai.gov.in/en/my-aadhaar.html'],
];

let totalFixed = 0;

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${path.basename(filePath)}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  let fileChanges = 0;
  
  for (const [from, to] of fixes) {
    const count = (content.split(from).length - 1);
    if (count > 0) {
      content = content.split(from).join(to);
      console.log(`  [${path.basename(filePath)}] Fixed (${count}x): ${from.substring(0,60)}...`);
      fileChanges += count;
    }
  }
  
  if (fileChanges > 0) {
    fs.writeFileSync(filePath + '.bak', original, 'utf8');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Saved ${path.basename(filePath)} (${fileChanges} fix(es))`);
    totalFixed += fileChanges;
  } else {
    console.log(`  ✓ ${path.basename(filePath)} — no issues found`);
  }
}

console.log(`\nTotal fixes applied across all backend files: ${totalFixed}`);

