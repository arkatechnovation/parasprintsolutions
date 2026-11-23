'use client';
import { useState } from 'react';
export default function ShareButtons({ title }) {
  const [status, setStatus] = useState('');
  return (
    <div className="share-buttons">
      <button
        className="button button--outline"
        onClick={async () => {
          try {
            if (navigator.share) await navigator.share({ title, url: location.href });
            else {
              await navigator.clipboard.writeText(location.href);
              setStatus('Link copied.');
            }
          } catch {
            setStatus('Use the page address to share this article.');
          }
        }}
      >
        Share this article
      </button>
      <span role="status">{status}</span>
    </div>
  );
}
