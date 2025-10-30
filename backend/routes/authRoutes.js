const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { sign } = require('../utils/jwt');
const { User } = require('../services/db'); // exported after init
const { admin } = require('../services/firebaseAdmin');

function safeUserModel() {
  try { return require('../services/db').User; } catch(e) { return null; }
}

router.post('/signup', async (req, res) => {
  const UserModel = safeUserModel();
  if (!UserModel) return res.status(500).json({ ok: false, error: 'DB not ready' });

  const { email, password, displayName } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, error: 'Missing fields' });
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await UserModel.create({ email, passwordHash, displayName });
    const token = sign(user);
    res.json({ ok: true, token, user: { id: user.id, email: user.email, displayName: user.displayName } });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const UserModel = safeUserModel();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, error: 'Missing' });
  const user = await UserModel.findOne({ where: { email } });
  if (!user) return res.status(401).json({ ok: false, error: 'Invalid' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ ok: false, error: 'Invalid' });
  const token = sign(user);
  res.json({ ok: true, token, user: { id: user.id, email: user.email, displayName: user.displayName } });
});

// NEW: Firebase auth token exchange
router.post('/firebase', async (req, res) => {
  try {
    const idToken = req.body.idToken;
    if (!idToken) return res.status(400).json({ ok: false, error: 'Missing idToken' });
    if (!admin || !admin.auth) return res.status(500).json({ ok: false, error: 'Firebase Admin not initialized' });
    const decoded = await admin.auth().verifyIdToken(idToken);
    const email = decoded.email;
    const displayName = decoded.name || decoded.email;
    const UserModel = safeUserModel();
    let user = await UserModel.findOne({ where: { email } });
    if (!user) user = await UserModel.create({ email, displayName });
    const token = sign(user);
    res.json({ ok: true, token, user: { id: user.id, email: user.email, displayName: user.displayName } });
  } catch (err) {
    console.error('firebase token verify error', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
