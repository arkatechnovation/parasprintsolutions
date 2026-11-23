import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { waitForApi } from './wait-for-api.mjs';
import { loadFrontendEnv } from './load-env.mjs';
const serviceDev = process.argv[2] === 'vercel-dev';
const mode = serviceDev ? 'dev' : process.argv[2];
if (!['dev', 'start'].includes(mode)) throw new Error('Choose dev, start or vercel-dev.');
const require = createRequire(new URL('../package.json', import.meta.url));
const directory = fileURLToPath(new URL('../', import.meta.url));
require('@next/env').loadEnvConfig(directory, mode === 'dev');
loadFrontendEnv();
if (!serviceDev && process.env.WAIT_FOR_API === 'true') {
  const api = process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000';
  console.log('Waiting for the API and database before starting the website…');
  try {
    await waitForApi(api, { timeoutMs: 5000 });
  } catch (err) {
    console.warn('Backend API not reachable; proceeding to start frontend anyway.');
  }
}
// Vercel runs and routes both services; it supplies the service's listening port.
// Do not probe a binding at startup: bindings belong to runtime requests.
if (serviceDev && !process.env.PORT) throw new Error('Vercel must provide the frontend PORT.');
const child = spawn(
  process.execPath,
  [require.resolve('next/dist/bin/next'), mode, '--port', serviceDev ? process.env.PORT : '3000'],
  {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    stdio: 'inherit',
    windowsHide: true,
  },
);
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
child.on('exit', (code) => {
  process.exitCode = code || 0;
});
