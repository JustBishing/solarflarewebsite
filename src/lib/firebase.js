/**
 * Configuration only — deliberately imports nothing from `firebase/*`.
 *
 * This module is reachable from public pages, so anything it imports ships to
 * every visitor. It used to call initializeApp() and getFirestore() here,
 * which pulled firebase/app and firebase/firestore into the main bundle: ~80KB
 * gzipped, over a third of the page's JS, to read one world-readable document.
 *
 * Public pages now read that document over REST (see siteContentRest.js). The
 * SDK is initialised in firebaseAuth.js, which only the lazily-loaded /admin
 * route touches. Do not import `firebase/*` from this file.
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
