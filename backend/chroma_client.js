// chroma_client.js – thin wrapper around ChromaDB for our RAG store
// Uses the official `chromadb` Node client (SQLite persistence)

const { ChromaClient } = require('chromadb');
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.CHROMA_DB_PATH || path.resolve(__dirname, '..', 'data', 'chroma');

// Singleton instance
let client = null;
let collection = null;

async function getClient() {
  if (!client) {
    client = new ChromaClient({ path: DB_PATH });
  }
  return client;
}

async function getCollection() {
  if (!collection) {
    const client = await getClient();
    // collection name is fixed for our app
    collection = await client.getOrCreateCollection({ name: 'scheme_chunks' });
  }
  return collection;
}

/**
 * Add an array of documents (chunks) to the collection.
 * Each doc must have: { id, text, metadata }
 */
async function addDocuments(docs) {
  const col = await getCollection();
  // Chroma expects arrays of ids, documents, metadatas
  const ids = docs.map(d => d.id);
  const documents = docs.map(d => d.text);
  const metadatas = docs.map(d => d.metadata);
  await col.add({ ids, documents, metadatas });
}

/**
 * Perform a similarity search.
 * @param {string} query – user query string
 * @param {number} k – number of results (default 5)
 * @returns {Array} – array of { id, text, metadata, distance }
 */
async function search(query, k = 5) {
  const col = await getCollection();
  // Use the collection's built‑in query method
  const result = await col.query({
    queryTexts: [query],
    nResults: k,
    include: ['documents', 'metadatas', 'distances', 'ids']
  });
  // Result arrays are nested because we passed a single query
  const ids = result.ids[0];
  const documents = result.documents[0];
  const metadatas = result.metadatas[0];
  const distances = result.distances[0];
  return ids.map((id, i) => ({ id, text: documents[i], metadata: metadatas[i], distance: distances[i] }));
}

module.exports = { addDocuments, search };

