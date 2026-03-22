import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Section from '../components/Section.jsx';
import { useSiteContent } from '../context/useSiteContent.js';
import { defaultSiteContent } from '../lib/siteContent.js';
import {
  auth,
  isFirebaseConfigured,
  saveSiteContent,
  signInWithGoogle,
  signOutAdmin,
} from '../lib/firebase.js';

const parseAuthorizedEmails = () =>
  (import.meta.env.VITE_ADMIN_AUTHORIZED_EMAILS || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

const authorizedEmails = parseAuthorizedEmails();

const isAuthorizedEmail = (email) => {
  if (!email) {
    return false;
  }

  const normalizedEmail = email.toLowerCase();

  return authorizedEmails.some((entry) => {
    if (entry === normalizedEmail) {
      return true;
    }

    if (entry.startsWith('@')) {
      return normalizedEmail.endsWith(entry);
    }

    return false;
  });
};

const formatJson = (value) => JSON.stringify(value, null, 2);

const Admin = () => {
  const { loadError, siteContent } = useSiteContent();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(!isFirebaseConfigured);
  const [draft, setDraft] = useState(formatJson(defaultSiteContent));
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isAuthorized = useMemo(
    () => isAuthorizedEmail(user?.email || ''),
    [user],
  );

  useEffect(() => {
    setDraft(formatJson(siteContent));
  }, [siteContent]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthChecked(true);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    setStatus('');
    setSaveError('');
    setIsSigningIn(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setStatus('');
    setSaveError('');

    try {
      await signOutAdmin();
    } catch (error) {
      setSaveError(error.message);
    }
  };

  const handleSave = async () => {
    setStatus('');
    setSaveError('');
    setIsSaving(true);

    try {
      const parsed = JSON.parse(draft);
      await saveSiteContent(parsed);
      setStatus('Saved. The public site will update from Firestore.');
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Section
      title="Admin mode"
      description="Sign in with Google, verify against the allowed email list, then edit the full website content document without touching the codebase."
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_1.25fr]">
        <article className="rounded-3xl border border-sf-border bg-sf-surface p-6 shadow-[0_28px_48px_-30px_rgba(0,0,0,0.65)] sm:p-8">
          <h3 className="text-xl font-semibold text-sf-text">Access control</h3>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-sf-muted">
            <p>
              Firebase config:{' '}
              <span className="font-semibold text-sf-text">
                {isFirebaseConfigured ? 'connected' : 'missing'}
              </span>
            </p>
            <p>
              Authorized accounts:{' '}
              <span className="font-semibold text-sf-text">
                {authorizedEmails.length
                  ? authorizedEmails.join(', ')
                  : 'none configured'}
              </span>
            </p>
            {authChecked && user ? (
              <p>
                Signed in as{' '}
                <span className="font-semibold text-sf-text">{user.email}</span>.
              </p>
            ) : null}
            <p>
              Edits write to the Firestore document{' '}
              <code className="rounded bg-black/20 px-2 py-1 text-xs text-sf-text">
                siteContent/current
              </code>
              .
            </p>
          </div>

          {loadError ? (
            <p className="mt-5 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Live content fallback active: {loadError}
            </p>
          ) : null}

          {!isFirebaseConfigured ? (
            <p className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Add the Firebase env vars before admin mode can sign in or save.
            </p>
          ) : null}

          {isFirebaseConfigured && !authChecked ? (
            <p className="mt-5 text-sm text-sf-muted">Checking session...</p>
          ) : null}

          {isFirebaseConfigured && authChecked && !user ? (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="mt-6 rounded-xl bg-sf-orange-1 px-5 py-3 text-sm font-semibold text-sf-bg transition hover:bg-sf-orange-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
            </button>
          ) : null}

          {isFirebaseConfigured && user && !isAuthorized ? (
            <>
              <p className="mt-5 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                This Google account is authenticated but not on the authorized
                admin list.
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-4 rounded-xl border border-sf-border px-5 py-3 text-sm font-semibold text-sf-text transition hover:border-sf-orange-1 hover:text-sf-orange-1"
              >
                Sign out
              </button>
            </>
          ) : null}

          {isFirebaseConfigured && user && isAuthorized ? (
            <>
              <p className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                Authorized. You can now update live website content.
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-4 rounded-xl border border-sf-border px-5 py-3 text-sm font-semibold text-sf-text transition hover:border-sf-orange-1 hover:text-sf-orange-1"
              >
                Sign out
              </button>
            </>
          ) : null}
        </article>

        <article className="rounded-3xl border border-sf-border bg-sf-surface p-6 shadow-[0_28px_48px_-30px_rgba(0,0,0,0.65)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-sf-text">
                Site content editor
              </h3>
              <p className="mt-2 text-sm text-sf-muted">
                Edit the JSON document that powers the public pages.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraft(formatJson(siteContent));
                  setStatus('Reset editor to the current live document.');
                  setSaveError('');
                }}
                className="rounded-xl border border-sf-border px-4 py-2 text-sm font-semibold text-sf-text transition hover:border-sf-orange-1 hover:text-sf-orange-1"
              >
                Reset to live
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(formatJson(defaultSiteContent));
                  setStatus('Loaded the built-in defaults into the editor.');
                  setSaveError('');
                }}
                className="rounded-xl border border-sf-border px-4 py-2 text-sm font-semibold text-sf-text transition hover:border-sf-orange-1 hover:text-sf-orange-1"
              >
                Load defaults
              </button>
            </div>
          </div>

          <textarea
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setStatus('');
              setSaveError('');
            }}
            spellCheck="false"
            className="mt-6 min-h-[34rem] w-full rounded-2xl border border-sf-border bg-black/20 p-4 font-mono text-sm leading-6 text-sf-text outline-none transition focus:border-sf-orange-1"
          />

          {status ? (
            <p className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {status}
            </p>
          ) : null}

          {saveError ? (
            <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {saveError}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleSave}
            disabled={!isFirebaseConfigured || !user || !isAuthorized || isSaving}
            className="mt-6 rounded-xl bg-sf-orange-1 px-5 py-3 text-sm font-semibold text-sf-bg transition hover:bg-sf-orange-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save live content'}
          </button>
        </article>
      </div>
    </Section>
  );
};

export default Admin;
