const axios = require('axios');
const BASE = process.env.HYPERGRAPH_API_URL || 'https://api.constellationnetwork.io';
async function postProof(payload) {
  const url = `${BASE}/streams/${process.env.HYPERGRAPH_STREAM_ID}/publish`;
  const res = await axios.post(url, payload, {
    headers: { 'x-api-key': process.env.HYPERGRAPH_API_KEY, 'Content-Type': 'application/json' }
  });
  return res.data;
}
module.exports = { postProof };
