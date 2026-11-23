import { setTimeout } from 'node:timers/promises';

export async function waitForApi(origin, { timeoutMs = 120000, intervalMs = 500 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${origin.replace(/\/$/, '')}/api/v1/health`, {
        signal: AbortSignal.timeout(Math.max(1, Math.min(2000, deadline - Date.now()))),
      });
      if (response.ok) return;
    } catch {
      // The database/API may still be starting. Do not launch Next.js yet.
    }
    await setTimeout(Math.min(intervalMs, Math.max(0, deadline - Date.now())));
  }
  throw new Error(
    'The backend is not ready. Run npm run dev from the project root to start both services, or start npm run dev -w backend in another terminal. Check backend startup logs and database configuration.',
  );
}
