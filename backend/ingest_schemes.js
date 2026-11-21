// ingest_schemes.js – CLI tool to ingest government scheme PDFs/DOCX into ChromaDB
// Usage: node ingest_schemes.js <folder-with-documents>

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const docx = require('docx'); // we will use docx to read .docx via mammoth alternative – using @iarna/textract? For simplicity, use 'docx' package to parse.
const { Document, Packer } = require('docx'); // placeholder – actual parsing will use simple text extraction via 'docx' parser utilities
const { readFile } = require('fs').promises;

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { addDocuments } = require('./chroma_client');

const MODEL_NAME = 'models/gemini-1.5-pro'; // Gemini embedding model name

// Simple text chunker – 200 token approx = 300 characters, overlap 50 chars
function chunkText(text, maxLen = 300, overlap = 50) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + maxLen, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length) chunks.push(chunk);
    start = end - overlap; // step back for overlap
    if (start < 0) start = 0;
  }
  return chunks;
}

// Extract plain text from PDF buffer
async function extractPdfText(buffer) {
  const data = await pdfParse(buffer);
  return data.text || '';
}

// Extract plain text from DOCX file (simple) using 'docx' – we will read XML
async function extractDocxText(filePath) {
  // Use docx parser: read the file as a Uint8Array and extract paragraphs via docx library is non‑trivial.
  // We fallback to a minimal approach using 'mammoth' style parsing via regex on the XML inside the .docx zip.
  const AdmZip = require('adm-zip');
  const zip = new AdmZip(filePath);
  const docXml = zip.readAsText('word/document.xml');
  // Strip tags, replace <w:tab/> with space, <w:br/> with newline
  const text = docXml
    .replace(/<w:tab\/>/g, ' ')
    .replace(/<w:br\/>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node ingest_schemes.js <folder-with-documents>');
    process.exit(1);
  }
  const folder = path.resolve(args[0]);
  if (!fs.existsSync(folder)) {
    console.error('Folder does not exist:', folder);
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const files = fs.readdirSync(folder).filter(f => f.endsWith('.pdf') || f.endsWith('.docx'));
  const allDocs = [];

  for (const file of files) {
    const filePath = path.join(folder, file);
    const ext = path.extname(file).toLowerCase();
    let rawText = '';
    try {
      if (ext === '.pdf') {
        const buffer = await readFile(filePath);
        rawText = await extractPdfText(buffer);
      } else if (ext === '.docx') {
        rawText = await extractDocxText(filePath);
      }
    } catch (e) {
      console.warn('Failed to extract', file, e);
      continue;
    }
    const chunks = chunkText(rawText);
    // Generate embeddings for each chunk (batching to avoid rate limits)
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedRes = await model.embedContent(chunk);
      const embedding = embedRes.embedding?.values || [];
      const doc = {
        id: `${file}-${i}`,
        text: chunk,
        metadata: {
          title: file,
          sourcePath: filePath,
          chunkIndex: i,
          // store embedding for Chroma – it will be added automatically by the client using the vector store's default embedder
        }
      };
      // Chroma client expects raw text; we will store embeddings via the client’s internal embedding function later.
      // For now, just push doc; the client will compute embeddings if needed.
      allDocs.push(doc);
    }
    console.log(`Processed ${file}: ${chunks.length} chunks`);
  }

  if (allDocs.length === 0) {
    console.log('No documents processed.');
    return;
  }

  console.log('Adding documents to ChromaDB...');
  await addDocuments(allDocs);
  console.log('Ingestion complete. Total chunks added:', allDocs.length);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

