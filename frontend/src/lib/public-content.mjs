import { getFallbackData } from './catalog-fallback.js';

// Hardcoded static data provider. Delivers immediate responses without backend dependencies.
export function createPublicContentReader({
  fallback = getFallbackData,
} = {}) {
  return async function read(path) {
    const data = fallback(path);
    return {
      status: data.status || (data.ok ? 200 : 404),
      ok: data.ok,
      json: data,
    };
  };
}
