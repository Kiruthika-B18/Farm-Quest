import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

try {
  // If FIREBASE_SERVICE_ACCOUNT is set, use it. Otherwise, initialize without credentials 
  // (which relies on default credentials or acts as a mock locally if no auth rules apply).
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized with service account.');
  } else {
    admin.initializeApp();
    console.log('Firebase Admin initialized without explicitly provided service account credentials.');
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

export const db = admin.firestore();
