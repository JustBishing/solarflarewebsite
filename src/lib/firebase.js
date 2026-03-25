import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { encodeSiteContentForFirestore } from './siteContent.js';

const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const siteContentDocRef = db ? doc(db, 'siteContent', 'current') : null;

const googleProvider = app ? new GoogleAuthProvider() : null;
if (googleProvider) {
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

export const signInWithGoogle = () => {
  if (!auth || !googleProvider) {
    return Promise.reject(new Error('Firebase is not configured.'));
  }
  return signInWithPopup(auth, googleProvider);
};

export const signOutAdmin = () => (auth ? signOut(auth) : Promise.resolve());

const sanitize = (value) => {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, sanitize(v)]),
    );
  }
  return value;
};

export const saveSiteContent = async (content) => {
  if (!siteContentDocRef) throw new Error('Firestore is not configured.');
  if (!auth?.currentUser) throw new Error('Sign in before saving.');

  await auth.currentUser.getIdToken();
  await setDoc(
    siteContentDocRef,
    encodeSiteContentForFirestore(sanitize(content)),
    { merge: true },
  );
};
