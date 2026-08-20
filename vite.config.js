import { createHash } from 'node:crypto';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The admin allowlist is hashed here, in Node, so the addresses never reach the
 * client as plaintext. Previously Admin.jsx read
 * import.meta.env.VITE_ADMIN_AUTHORIZED_EMAILS directly, which inlined five
 * students' email addresses into the public bundle — one `curl | grep` away
 * from being a phishing list.
 *
 * This is obfuscation, not authorization: SHA-256 of a short predictable string
 * is not a secret, and the real gate is and remains the Firestore security
 * rules. It exists so the bundle can't be harvested.
 */
const adminEmailHashes = (source) =>
  source
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .map((entry) => createHash('sha256').update(entry).digest('hex'));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const allowlist = process.env.VITE_ADMIN_AUTHORIZED_EMAILS
    || env.VITE_ADMIN_AUTHORIZED_EMAILS
    || '';

  return {
    base: '/',
    plugins: [react()],
    define: {
      __ADMIN_EMAIL_HASHES__: JSON.stringify(adminEmailHashes(allowlist)),
    },
    build: {
      rollupOptions: {
        output: {
          // Firestore is needed by every visitor; auth is needed by four
          // students. Splitting them means a sponsor no longer downloads
          // 446KB of @firebase/auth to read the tier table.
          manualChunks: {
            'firebase-app': ['firebase/app', 'firebase/firestore'],
            'firebase-auth': ['firebase/auth'],
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
          },
        },
      },
    },
  };
});
