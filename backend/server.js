require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// init services
const { initDB } = require('./services/db');
const { initFirebaseAdmin } = require('./services/firebaseAdmin');

// route imports
const authRoutes = require('./routes/authRoutes');
const idRoutes = require('./routes/idRoutes');
const hederaRoutes = require('./routes/hederaRoutes');
const hypergraphRoutes = require('./routes/hypergraphRoutes');
const ttsRoutes = require('./routes/ttsRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

// health
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// init Firebase Admin then DB and then mount routes
initFirebaseAdmin();

initDB()
  .then(() => {
    console.log('DB initialized');

    app.use('/api/auth', authRoutes);
    app.use('/api/ids', idRoutes);
    app.use('/api/hedera', hederaRoutes);
    app.use('/api/hypergraph', hypergraphRoutes);
    app.use('/api/tts', ttsRoutes);

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Ava ID backend running on ${PORT}`));
  })
  .catch((err) => {
    console.error('DB init error', err);
    process.exit(1);
  });
