import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { encodeSiteContentForFirestore } from './siteContent.js';

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
export const storage = app ? getStorage(app) : null;
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

const getFirebaseStorageErrorMessage = (error) => {
  const code = error?.code || '';

  if (code === 'storage/unauthorized') {
    return 'Image upload failed: Firebase Storage rules denied this upload for the current account.';
  }

  if (code === 'storage/unauthenticated') {
    return 'Image upload failed: you are not signed in anymore. Refresh the page and sign in again.';
  }

  if (code === 'storage/retry-limit-exceeded') {
    return 'Image upload failed: Firebase Storage retried too many times. Check your internet connection or Storage bucket settings.';
  }

  if (code === 'storage/quota-exceeded') {
    return 'Image upload failed: the Firebase Storage quota has been exceeded.';
  }

  if (code === 'storage/object-not-found') {
    return 'Image upload failed: the destination Storage path could not be found.';
  }

  if (code === 'storage/unknown') {
    return 'Image upload failed: Firebase Storage returned an unknown error. Check the Storage bucket and rules.';
  }

  return error?.message || 'Image upload failed.';
};

const slugifyFileName = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const uploadSiteImage = async (file, folder = 'general') => {
  if (!storage) {
    throw new Error('Firebase Storage is not configured.');
  }

  if (!auth?.currentUser) {
    throw new Error('You need to be signed in before uploading images.');
  }

  const timestamp = Date.now();
  const safeFileName = slugifyFileName(file.name || `upload-${timestamp}`);
  const storageRef = ref(
    storage,
    `site-content/${folder}/${timestamp}-${safeFileName}`,
  );

  await withTimeout(
    auth.currentUser.getIdToken(),
    10000,
    'Sign-in verification timed out. Refresh the page and try again.',
  );

  const snapshot = await withTimeout(
    uploadBytes(storageRef, file, {
      contentType: file.type || 'application/octet-stream',
    }),
    20000,
    'Image upload timed out. Check your internet connection and Storage rules, then try again.',
  );

  try {
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    throw new Error(getFirebaseStorageErrorMessage(error));
  }
};

export { getFirebaseStorageErrorMessage };

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
    setDoc(
      siteContentDocRef,
      encodeSiteContentForFirestore(sanitizeForFirestore(content)),
      { merge: true },
    ),
    15000,
    'Saving timed out. Check your internet connection and Firestore rules, then try again.',
  );
};
