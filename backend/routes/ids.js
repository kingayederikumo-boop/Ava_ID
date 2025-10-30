const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const uploadUtil = require('../services/awsS3');
const { submitMessage } = require('../services/hederaService');
const { postProof } = require('../services/hypergraphService');

function IDModel() {
  try { return require('../services/db').ID; } catch(e) { return null; }
}

router.post('/add', async (req, res) => {
  try {
    const { title, base64 } = req.body;
    if (!base64) return res.status(400).json({ ok: false, error: 'No file' });

    const fileUrl = await uploadUtil.uploadBase64(base64, 'ids/');
    const hash = crypto.createHash('sha256').update(fileUrl).digest('hex');

    let hederaTx = null;
    if (process.env.HEDERA_TOPIC_ID) {
      const r = await submitMessage(process.env.HEDERA_TOPIC_ID, `AvaIDHash:${hash}`);
      hederaTx = JSON.stringify(r);
    }

    const proof = await postProof({ hash, fileUrl, title, hederaTx });

    const ID = IDModel();
    if (ID) {
      const newId = await ID.create({ title, fileUrl, verified: false, hederaTx: hederaTx ? hederaTx : null, hypergraphProof: JSON.stringify(proof) });
      return res.json({ ok: true, id: newId });
    }

    return res.json({ ok: true, fileUrl, hash, proof, hederaTx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
