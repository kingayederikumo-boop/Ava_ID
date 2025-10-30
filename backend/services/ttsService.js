const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function generateElevenLabsSpeech(voiceId, text, outFilename = `speech-${Date.now()}.mp3`) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const res = await axios.post(url, { text }, {
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    responseType: 'arraybuffer'
  });

  const tmpDir = path.join(__dirname, '..', 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
  const filePath = path.join(tmpDir, outFilename);
  fs.writeFileSync(filePath, Buffer.from(res.data));
  return filePath;
}

module.exports = { generateElevenLabsSpeech };
