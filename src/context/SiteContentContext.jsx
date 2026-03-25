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
  useEffect(() => { applyThemeColors(siteContent.theme?.colors); }, [siteContent]);

  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.setAttribute('href', resolveSiteAssetUrl(siteContent.branding?.logoSrc, 'logo.png'));
    }
  }, [siteContent]);

  // Load content: Firestore (live) or static JSON (fallback)
  useEffect(() => {
    const applyContent = (content) => {
      setSiteContent(content);
      setHasCachedContent(true);
      setLoadError('');
      setIsLoading(false);
      cache(content);
    };

    const handleError = (error) => {
      if (!hasCachedRef.current) setSiteContent(defaultSiteContent);
      setLoadError(error.message);
      setIsLoading(false);
    };

    // Use Firestore when configured
    if (isFirebaseConfigured && db && siteContentDocRef) {
      return onSnapshot(
        siteContentDocRef,
        (snap) => applyContent(resolveSiteContent(decodeSiteContentFromFirestore(snap.data()))),
        handleError,
      );
    }

    // Fall back to static JSON
    fetch(`${import.meta.env.BASE_URL}siteContent.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load content (${res.status})`);
        return res.json();
      })
      .then((data) => applyContent(resolveSiteContent(data)))
      .catch(handleError);

    return undefined;
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
