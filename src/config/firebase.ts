import * as admin from 'firebase-admin';
import * as path from 'path';
import dotenv from 'dotenv';
import { Logger } from '../shared/logger';

dotenv.config();

try {
  let serviceAccount: any;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    // Decode base64 encoded service account for production environments (Render)
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    serviceAccount = JSON.parse(decoded);
  } else {
    // Resolve path to the service account key which is located in the project root for local development
    const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
    serviceAccount = require(serviceAccountPath);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // databaseURL: "https://<DATABASE_NAME>.firebaseio.com" // Uncomment if using Realtime DB
  });
  
  Logger.info('✅ Firebase Admin initialized successfully.');
} catch (error) {
  Logger.error(`❌ Firebase Admin initialization error: ${error}`);
  Logger.error('👉 Ensure FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is set in Render, or serviceAccountKey.json exists locally.');
  process.exit(1);
}

export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export const auth = admin.auth();
