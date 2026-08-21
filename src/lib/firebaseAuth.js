import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './firebase.js';
import {
  decodeSiteContentFromFirestore,
  encodeSiteContentForFirestore,
  resolveSiteContent,
} from './siteContent.js';

/**
 * Admin-only surface, and the only place the Firebase SDK is initialised.
 * Reached exclusively through the lazily-loaded /admin route, which keeps both
 * firebase/app and @firebase/auth out of the bundle a visitor downloads to
 * read the site. Do not import this from anything on a public page — public
 * reads go through siteContentRest.js.
 */

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;
const siteContentDocRef = db ? doc(db, 'siteContent', 'current') : null;

export const auth = app ? getAuth(app) : null;

/**
 * Live subscription to the content document. Only the editor needs this: it is
 * how /admin notices that someone else saved while you were mid-edit. Public
 * pages fetch once over REST and are content to be a reload behind.
 */
export const subscribeSiteContent = (onContent, onError) => {
  if (!siteContentDocRef) return () => {};

  return onSnapshot(
    siteContentDocRef,
    (snap) => onContent(resolveSiteContent(decodeSiteContentFromFirestore(snap.data()))),
    onError,
  );
};

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
