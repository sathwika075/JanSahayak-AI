const fs = require('fs');

const raw = fs.readFileSync('C:/Nxtwave-Sathwika/jansahayak-ai/backend/candidate_line.txt', 'utf8');
const data = JSON.parse(raw);

console.log('Keys in data:', Object.keys(data));
console.log('type:', data.type);

let content = null;
if (data.content) {
  content = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
}
if (data.tool_calls) {
  content = JSON.stringify(data.tool_calls);
}

console.log('Content sample:', content ? content.slice(0, 200) : 'none');

// Search for <!DOCTYPE html>
if (content && content.includes('<!DOCTYPE html>')) {
  console.log('Found <!DOCTYPE html>!');
  const start = content.indexOf('<!DOCTYPE html>');
  const end = content.indexOf('</html>', start) + 7;
  const html = content.slice(start, end)
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
  fs.writeFileSync('C:/Nxtwave-Sathwika/jansahayak-ai/backend/original_clean_index.html', html, 'utf8');
  console.log('Saved to original_clean_index.html, length:', html.length);
}

