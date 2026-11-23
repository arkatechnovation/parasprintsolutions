'use client';
import { useSyncExternalStore } from 'react';
const query = '(prefers-reduced-motion: reduce)';
function subscribe(notify) {
  const media = window.matchMedia(query);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
}
const snapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => true;
export default function useReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
