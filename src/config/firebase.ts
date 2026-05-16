import * as admin from 'firebase-admin';
import * as path from 'path';
import dotenv from 'dotenv';
import { Logger } from '../shared/logger';

dotenv.config();

try {
  // Resolve path to the service account key which is located in the project root
  const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // databaseURL: "https://<DATABASE_NAME>.firebaseio.com" // Uncomment if using Realtime DB
  });
  
  Logger.info('✅ Firebase Admin initialized successfully.');
} catch (error) {
  Logger.error(`❌ Firebase Admin initialization error: ${error}`);
}

export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export const auth = admin.auth();
