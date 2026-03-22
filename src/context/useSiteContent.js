import { useContext } from 'react';
import { SiteContentContext } from './SiteContentContext.jsx';

export const useSiteContent = () => useContext(SiteContentContext);
