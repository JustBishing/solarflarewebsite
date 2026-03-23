import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseEnvMap = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const missingFirebaseEnvKeys = Object.entries(firebaseEnvMap)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const firebaseConfig = {
  apiKey: firebaseEnvMap.VITE_FIREBASE_API_KEY,
  authDomain: firebaseEnvMap.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseEnvMap.VITE_FIREBASE_PROJECT_ID,
  storageBucket: firebaseEnvMap.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseEnvMap.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseEnvMap.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = missingFirebaseEnvKeys.length === 0;

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;
export const siteContentDocRef = db ? doc(db, 'siteContent', 'current') : null;

if (googleProvider) {
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase authentication is not configured.');
  }

  return signInWithPopup(auth, googleProvider);
};

export const signOutAdmin = async () => {
  if (!auth) {
    return;
  }

  await signOut(auth);
};

const withTimeout = (promise, timeoutMs, message) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => {
        reject(new Error(message));
      }, timeoutMs);
    }),
  ]);

const sanitizeForFirestore = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, sanitizeForFirestore(entryValue)]),
    );
  }

  return value;
};

export const saveSiteContent = async (content) => {
  if (!siteContentDocRef) {
    throw new Error('Firestore is not configured.');
  }

  if (!auth?.currentUser) {
    throw new Error('You need to be signed in before saving.');
  }

  await withTimeout(
    auth.currentUser.getIdToken(),
    10000,
    'Sign-in verification timed out. Refresh the page and try again.',
  );

  await withTimeout(
    setDoc(siteContentDocRef, sanitizeForFirestore(content), { merge: true }),
    15000,
    'Saving timed out. Check your internet connection and Firestore rules, then try again.',
  );
};
