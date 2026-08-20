import { initializeApp } from 'firebase/app';
import { doc, getFirestore } from 'firebase/firestore';

/**
 * App + Firestore only.
 *
 * Everything auth-related lives in firebaseAuth.js on purpose: this module is
 * imported by SiteContentContext, so anything it touches ships to every
 * visitor. @firebase/auth is ~446KB of source that only the four people who
 * open /admin will ever need, and a static import here pulled it into the main
 * bundle for every sponsor reading the tier table.
 */

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

export const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
export const siteContentDocRef = db ? doc(db, 'siteContent', 'current') : null;
