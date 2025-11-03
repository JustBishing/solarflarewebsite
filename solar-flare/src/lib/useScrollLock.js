import { useEffect } from 'react';

export const useScrollLock = (locked) => {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const original = {
      html: html.style.overflow || '',
      body: body.style.overflow || '',
    };

    if (locked) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      html.style.overflow = original.html;
      body.style.overflow = original.body;
    }

    return () => {
      html.style.overflow = original.html;
      body.style.overflow = original.body;
    };
  }, [locked]);
};

export default useScrollLock;
