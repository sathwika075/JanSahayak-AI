const fs = require('fs');
const readline = require('readline');

async function findIndexHtml() {
  const transcriptPath = 'C:/Users/DELL/.gemini/antigravity/brain/d6d08d89-d4a4-4695-95e9-83b1e6f8b879/.system_generated/logs/transcript_full.jsonl';
  if (!fs.existsSync(transcriptPath)) {
    console.log('Transcript not found');
    return;
  }

  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let bestIndex = -1;
  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (line.includes('page-assistant') && line.includes('page-finder') && line.includes('page-checker') && line.includes('page-admin')) {
      console.log(`Found candidate at line ${lineCount}, byte length: ${line.length}`);
      fs.writeFileSync('C:/Nxtwave-Sathwika/jansahayak-ai/backend/candidate_line.txt', line, 'utf8');
      break;
    }
  }
}

findIndexHtml().catch(console.error);

