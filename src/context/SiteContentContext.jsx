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

const SITE_CONTENT_STORAGE_KEY = 'solarflare.siteContent.v1';

const getCachedSiteContent = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(SITE_CONTENT_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    return resolveSiteContent(JSON.parse(rawValue));
  } catch {
    return null;
  }
};

const SiteContentContext = createContext({
  hasCachedContent: false,
  isLoading: false,
  loadError: '',
  siteContent: defaultSiteContent,
});

export const SiteContentProvider = ({ children }) => {
  const cachedSiteContent = getCachedSiteContent();
  const [siteContent, setSiteContent] = useState(
    cachedSiteContent || defaultSiteContent,
  );
  const [hasCachedContent, setHasCachedContent] = useState(
    Boolean(cachedSiteContent),
  );
  const hasCachedContentRef = useRef(Boolean(cachedSiteContent));
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    hasCachedContentRef.current = hasCachedContent;
  }, [hasCachedContent]);

  useEffect(() => {
    applyThemeColors(siteContent.theme?.colors);
  }, [siteContent]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const favicon = document.querySelector('link[rel="icon"]');

    if (!favicon) {
      return;
    }

    favicon.setAttribute(
      'href',
      resolveSiteAssetUrl(siteContent.branding?.logoSrc, 'logo.png'),
    );
  }, [siteContent]);

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !siteContentDocRef) {
      setSiteContent(defaultSiteContent);
      setIsLoading(false);
      return undefined;
    }

    const unsubscribe = onSnapshot(
      siteContentDocRef,
      (snapshot) => {
        console.log('[DEBUG] onSnapshot fired, exists:', snapshot.exists(), 'data:', snapshot.data());
        const decodedSiteContent = decodeSiteContentFromFirestore(snapshot.data());
        const mergedSiteContent = resolveSiteContent(decodedSiteContent);

        setSiteContent(mergedSiteContent);
        setHasCachedContent(true);
        setLoadError('');
        setIsLoading(false);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            SITE_CONTENT_STORAGE_KEY,
            JSON.stringify(mergedSiteContent),
          );
        }
      },
      (error) => {
        console.error('[DEBUG] onSnapshot error:', error.code, error.message);
        setSiteContent((current) =>
          hasCachedContentRef.current ? current : defaultSiteContent,
        );
        setLoadError(error.message);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      hasCachedContent,
      isLoading,
      loadError,
      siteContent,
    }),
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
