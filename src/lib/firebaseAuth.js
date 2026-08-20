import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { setDoc } from 'firebase/firestore';
import { app, siteContentDocRef } from './firebase.js';
import { encodeSiteContentForFirestore } from './siteContent.js';

/**
 * Admin-only surface. Reached exclusively through the lazily-loaded /admin
 * route, which keeps @firebase/auth out of the bundle a visitor downloads to
 * read the site. Do not import this from anything on a public page.
 */

export const auth = app ? getAuth(app) : null;

const googleProvider = app ? new GoogleAuthProvider() : null;
if (googleProvider) {
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

export const onAuthStateChanged = (...args) => onFirebaseAuthStateChanged(...args);

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
