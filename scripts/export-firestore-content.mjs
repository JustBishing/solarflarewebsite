import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountJson) {
  throw new Error(
    'FIREBASE_SERVICE_ACCOUNT is required. Set it to the full Firebase service account JSON.',
  );
}

const serviceAccount = JSON.parse(serviceAccountJson);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();
const snapshot = await db.collection('siteContent').doc('current').get();

if (!snapshot.exists) {
  throw new Error('The Firestore document siteContent/current does not exist.');
}

const outputDir = path.resolve('backups');
const outputPath = path.join(outputDir, 'siteContent.current.json');
const payload = {
  exportedAt: new Date().toISOString(),
  source: 'siteContent/current',
  content: snapshot.data(),
};

await mkdir(outputDir, { recursive: true });
await writeFile(`${outputPath}`, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`Exported Firestore content to ${outputPath}`);
