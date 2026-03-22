import { createContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured, siteContentDocRef } from '../lib/firebase.js';
import { defaultSiteContent, resolveSiteContent } from '../lib/siteContent.js';

const SiteContentContext = createContext({
  isLoading: false,
  loadError: '',
  siteContent: defaultSiteContent,
});

export const SiteContentProvider = ({ children }) => {
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !siteContentDocRef) {
      setSiteContent(defaultSiteContent);
      setIsLoading(false);
      return undefined;
    }

    const unsubscribe = onSnapshot(
      siteContentDocRef,
      (snapshot) => {
        setSiteContent(resolveSiteContent(snapshot.data()));
        setLoadError('');
        setIsLoading(false);
      },
      (error) => {
        setSiteContent(defaultSiteContent);
        setLoadError(error.message);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      loadError,
      siteContent,
    }),
    [isLoading, loadError, siteContent],
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
