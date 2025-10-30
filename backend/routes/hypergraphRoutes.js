const express = require('express');
const router = express.Router();
const axios = require('axios');
const BASE = process.env.HYPERGRAPH_API_URL || 'https://api.constellationnetwork.io';

router.post('/publish', async (req, res) => {
  try {
    const payload = req.body;
    const url = `${BASE}/streams/${process.env.HYPERGRAPH_STREAM_ID}/publish`;
    const resp = await axios.post(url, payload, { headers: { 'x-api-key': process.env.HYPERGRAPH_API_KEY } });
    res.json({ ok: true, resp: resp.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
