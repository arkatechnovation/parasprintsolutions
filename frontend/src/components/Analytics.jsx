'use client';
import { useEffect, useState } from 'react';
import { track } from '@/lib/client-api';
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const [prompt, setPrompt] = useState(false);
  useEffect(() => {
    const load = () => {
      if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;
      window['ga-disable-' + id] = false;
      if (window.gtag) {
        window.gtag('consent', 'update', { analytics_storage: 'granted' });
        return;
      }
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('consent', 'default', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      window.gtag('js', new Date());
      window.gtag('config', id);
      const s = document.createElement('script');
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      s.async = true;
      document.head.appendChild(s);
    };
    if (id && localStorage.getItem('paras-analytics-consent') === 'yes') load();
    const click = (e) => {
      const preference = e.target.closest('[data-analytics-preferences]');
      if (preference) {
        setPrompt(true);
        return;
      }
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const event = href.startsWith('tel:')
        ? 'phone_click'
        : href.startsWith('mailto:')
          ? 'email_click'
          : href.includes('wa.me')
            ? 'whatsapp_click'
            : href.startsWith('/request-a-quote')
              ? 'quote_click'
              : null;
      if (event) track(event);
    };
    const enable = () => load();
    document.addEventListener('click', click);
    window.addEventListener('paras-consent', enable);
    return () => {
      document.removeEventListener('click', click);
      window.removeEventListener('paras-consent', enable);
    };
  }, [id]);
  if (!prompt) return null;
  return (
    <div className="consent-panel" role="dialog" aria-label="Analytics preferences">
      <h2>Analytics preferences</h2>
      <p>
        {id
          ? 'Allow optional analytics to help understand website use. Forms work with either choice.'
          : 'Optional analytics is not configured. No analytics script is loaded.'}
      </p>
      <div className="d-flex gap-2 flex-wrap">
        <button
          className="button"
          onClick={() => {
            localStorage.setItem('paras-analytics-consent', 'yes');
            window.dispatchEvent(new Event('paras-consent'));
            setPrompt(false);
          }}
        >
          Allow analytics
        </button>
        <button
          className="button button--outline"
          onClick={() => {
            localStorage.setItem('paras-analytics-consent', 'no');
            if (id) window['ga-disable-' + id] = true;
            if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
            setPrompt(false);
          }}
        >
          Decline
        </button>
        <button className="text-link" onClick={() => setPrompt(false)}>
          Close
        </button>
      </div>
    </div>
  );
}
