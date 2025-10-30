const express = require('express');
const router = express.Router();
const { generateElevenLabsSpeech } = require('../services/ttsService');
const fs = require('fs');

router.post('/generate', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    if (!text) return res.status(400).json({ ok: false, error: 'No text' });
    const vid = voiceId || process.env.ELEVENLABS_VOICE_ID;
    const filePath = await generateElevenLabsSpeech(vid, text);
    const data = fs.readFileSync(filePath);
    res.set('Content-Type', 'audio/mpeg');
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
