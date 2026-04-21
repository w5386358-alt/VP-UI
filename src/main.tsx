import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    let refreshing = false;
    let lastUpdateCheck = 0;
    const MIN_UPDATE_INTERVAL = 5 * 60 * 1000;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none',
      });

      const promptUpdate = (worker?: ServiceWorker | null) => {
        if (!worker) return;
        worker.postMessage({ type: 'SKIP_WAITING' });
      };

      const requestUpdate = async (force = false) => {
        const now = Date.now();
        if (!force && now - lastUpdateCheck < MIN_UPDATE_INTERVAL) return;
        lastUpdateCheck = now;
        try {
          await registration.update();
        } catch {
          // noop
        }
      };

      if (registration.waiting) {
        promptUpdate(registration.waiting);
      }

      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            promptUpdate(installingWorker);
          }
        });
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          requestUpdate();
        }
      });

      window.addEventListener('focus', () => {
        requestUpdate();
      });

      window.addEventListener('pageshow', () => {
        requestUpdate();
      });

      window.addEventListener('online', () => {
        requestUpdate(true);
      });

      requestUpdate(true);
    } catch (error) {
      console.warn('service worker register failed', error);
    }
  });
}
