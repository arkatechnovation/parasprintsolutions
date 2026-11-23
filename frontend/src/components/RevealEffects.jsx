'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RevealEffects() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    const belowFold = new WeakSet();
    const animations = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            if (entry.boundingClientRect.top >= window.innerHeight) belowFold.add(entry.target);
            continue;
          }
          // Never delay the initial viewport or make content depend on JavaScript.
          if (belowFold.has(entry.target) && !reduced.matches) {
            const animation = entry.target.animate(
              [
                { opacity: 0.6, transform: 'translateY(14px)' },
                { opacity: 1, transform: 'none' },
              ],
              {
                duration: 500,
                delay: Number(entry.target.dataset.revealDelay) * 1000,
                easing: 'ease-out',
              },
            );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
          }
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    const stopAnimations = () => {
      if (reduced.matches) animations.forEach((animation) => animation.cancel());
    };
    reduced.addEventListener('change', stopAnimations);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      reduced.removeEventListener('change', stopAnimations);
    };
  }, [pathname]);
  return null;
}
