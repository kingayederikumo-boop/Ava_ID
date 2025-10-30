const express = require('express');
const router = express.Router();
const { createTopic, submitMessage } = require('../services/hederaService');

router.post('/create-topic', async (req, res) => {
  try {
    const topicId = await createTopic();
    res.json({ ok: true, topicId });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { topicId, message } = req.body;
    if (!topicId || !message) return res.status(400).json({ ok: false, error: 'Missing fields' });
    const resp = await submitMessage(topicId, message);
    res.json({ ok: true, resp });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
