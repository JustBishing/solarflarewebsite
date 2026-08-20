import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL, metaForPath } from './routeMeta.js';

/** Upserts a head tag, matching on `selector` and creating `tagName` if absent. */
const setTag = (tagName, selector, attrs) => {
  let el = document.head.querySelector(selector);

  if (!el) {
    el = document.createElement(tagName);
    document.head.appendChild(el);
  }

  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
};

/**
 * Keeps the head in sync on client-side navigation.
 *
 * The prerendered file for each route already ships the right tags, so this
 * only matters once React takes over routing — but without it every in-app
 * navigation leaves the previous page's title and description in place.
 */
const usePageMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaForPath(pathname);
    const canonical = `${SITE_URL}${meta.path}`;

    document.title = meta.title;

    setTag('meta', 'meta[name="description"]', {
      name: 'description',
      content: meta.description,
    });
    setTag('meta', 'meta[name="robots"]', {
      name: 'robots',
      content: meta.noindex ? 'noindex, nofollow' : 'index, follow',
    });
    setTag('meta', 'meta[property="og:title"]', {
      property: 'og:title',
      content: meta.title,
    });
    setTag('meta', 'meta[property="og:description"]', {
      property: 'og:description',
      content: meta.description,
    });
    setTag('meta', 'meta[property="og:url"]', { property: 'og:url', content: canonical });
    setTag('link', 'link[rel="canonical"]', { rel: 'canonical', href: canonical });
  }, [pathname]);
};

export default usePageMeta;
