'use client';

import { useEffect } from 'react';

const GTM_ID = 'GTM-N4D25ZFF';

function loadGTM() {
  if (window.__gtm_loaded) return;
  window.__gtm_loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}

export function GTMScript() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    // Deferred loading: first interaction OR 2-second timeout
    const timer = setTimeout(loadGTM, 2000);
    const interactionEvents = ['scroll', 'click', 'touchstart', 'keydown'] as const;

    const onInteraction = () => {
      clearTimeout(timer);
      loadGTM();
      interactionEvents.forEach(e => window.removeEventListener(e, onInteraction));
    };

    interactionEvents.forEach(e =>
      window.addEventListener(e, onInteraction, { once: true, passive: true })
    );

    // Global CTA click tracking via data attributes
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cta-name]');
      if (!target) return;

      window.dataLayer?.push({
        event: 'cta_click',
        cta_text: target.getAttribute('data-cta-name'),
        cta_location: target.getAttribute('data-cta-location'),
        cta_url: target.getAttribute('href') || target.getAttribute('data-cta-url'),
      });
    };

    document.addEventListener('click', handleClick);

    return () => {
      clearTimeout(timer);
      interactionEvents.forEach(e => window.removeEventListener(e, onInteraction));
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}
