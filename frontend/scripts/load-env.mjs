import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

const frontendKeys = [
  'API_INTERNAL_URL',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_GA_ID',
  'GOOGLE_SITE_VERIFICATION',
  'CLOUDINARY_PUBLIC_CLOUD_NAME',
];

// Import only frontend settings; SMTP, database and private integration secrets
// stay out of the website process and its child environment.
export function loadFrontendEnv() {
  const filename = new URL('../.env', import.meta.url);
  if (!existsSync(filename)) return;
  const values = parseEnv(readFileSync(filename, 'utf8'));
  for (const key of frontendKeys) {
    if (process.env[key] === undefined && values[key] !== undefined) {
      process.env[key] = values[key];
    }
  }
}
