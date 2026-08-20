import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured, siteContentDocRef } from '../lib/firebase.js';
import {
  decodeSiteContentFromFirestore,
  defaultSiteContent,
  resolveSiteContent,
} from '../lib/siteContent.js';
import { resolveSiteAssetUrl } from '../lib/assets.js';
import { applyThemeColors } from '../lib/theme.js';

const CACHE_KEY = 'solarflare.siteContent.v1';
const CONTENT_TIMEOUT_MS = 6000;

const getCached = () => {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? resolveSiteContent(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

const cache = (content) => {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch { /* ignore quota errors */ }
};

const SiteContentContext = createContext({
  hasCachedContent: false,
  isLoading: false,
  loadError: '',
  siteContent: defaultSiteContent,
});

export const SiteContentProvider = ({ children }) => {
  const cached = getCached();
  const [siteContent, setSiteContent] = useState(cached || defaultSiteContent);
  const [hasCachedContent, setHasCachedContent] = useState(Boolean(cached));
  const hasCachedRef = useRef(Boolean(cached));
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => { hasCachedRef.current = hasCachedContent; }, [hasCachedContent]);
  // Takes no argument on purpose: the palette is locked in theme.js and any
  // stored theme colours are ignored.
  useEffect(() => { applyThemeColors(); }, []);

  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.setAttribute('href', resolveSiteAssetUrl(siteContent.branding?.logoSrc, 'logo.png'));
    }
  }, [siteContent]);

  // Load content: Firestore (live) or static JSON (fallback)
  useEffect(() => {
    let settled = false;

    const applyContent = (content) => {
      settled = true;
      setSiteContent(content);
      setHasCachedContent(true);
      setLoadError('');
      setIsLoading(false);
      cache(content);
    };

    const handleError = (error) => {
      settled = true;
      if (!hasCachedRef.current) setSiteContent(defaultSiteContent);
      setLoadError(error.message);
      setIsLoading(false);
    };

    // A slow-but-not-failing Firestore never calls either callback, and the
    // app gates its entire render on isLoading — so without this the site sits
    // on "Loading live content..." indefinitely. The bundled defaults are
    // already in memory; showing them beats showing a spinner forever.
    const timeout = window.setTimeout(() => {
      if (settled || hasCachedRef.current) return;
      setIsLoading(false);
    }, CONTENT_TIMEOUT_MS);

    const stop = (unsubscribe) => () => {
      window.clearTimeout(timeout);
      if (typeof unsubscribe === 'function') unsubscribe();
    };

    // Use Firestore when configured
    if (isFirebaseConfigured && db && siteContentDocRef) {
      const unsubscribe = onSnapshot(
        siteContentDocRef,
        (snap) => applyContent(resolveSiteContent(decodeSiteContentFromFirestore(snap.data()))),
        handleError,
      );
      return stop(unsubscribe);
    }

    // Fall back to static JSON
    fetch(`${import.meta.env.BASE_URL}siteContent.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load content (${res.status})`);
        return res.json();
      })
      .then((data) => applyContent(resolveSiteContent(data)))
      .catch(handleError);

    return stop();
  }, []);

  const value = useMemo(
    () => ({ hasCachedContent, isLoading, loadError, siteContent }),
    [hasCachedContent, isLoading, loadError, siteContent],
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

SiteContentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SiteContentContext };
