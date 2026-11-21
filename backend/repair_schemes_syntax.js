const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../frontend/index.html');
let content = fs.readFileSync(targetFile, 'utf8');

// The corrupted section:
// an_deadline: "2026-12-20",
// official_url: "https://www.myscheme.gov.in/",
// r          documents: ["X/XII Marks Memo", "Income Certificate", "AICTE College Admission Letter"]
// },
// {
// id: "ts-overseas-vidyanidh              name: "Ambedkar Overseas Vidya Nidhi Scheme",

const searchRegex = /an_deadline:\s*"2026-12-20"[\s\S]*?name:\s*"Ambedkar Overseas Vidya Nidhi Scheme"/;

const replacement = `application_deadline: "2026-12-20",
        official_url: "https://www.myscheme.gov.in/",
        required_documents: ["X/XII Marks Memo", "Income Certificate", "AICTE College Admission Letter"]
      },
      {
        id: "ts-overseas-vidyanidhi",
        name: "Ambedkar Overseas Vidya Nidhi Scheme"`;

if (searchRegex.test(content)) {
  content = content.replace(searchRegex, replacement);
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('✅ Corrupted scheme block repaired successfully!');
} else {
  console.log('Search pattern not matched. Checking contents:');
  const idx = content.indexOf('an_deadline');
  console.log(content.substring(idx - 50, idx + 200));
}

