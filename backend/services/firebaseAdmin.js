const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function initFirebaseAdmin() {
  try {
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '';
    if (keyPath && fs.existsSync(keyPath)) {
      const serviceAccount = require(keyPath);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('Firebase Admin initialized from service account file.');
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const json = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({ credential: admin.credential.cert(json) });
      console.log('Firebase Admin initialized from JSON env var.');
    } else {
      console.warn('No Firebase service account configured. Firebase Admin not initialized.');
    }
  } catch (err) {
    console.error('Firebase admin init error', err);
  }
}

module.exports = { initFirebaseAdmin, admin };
