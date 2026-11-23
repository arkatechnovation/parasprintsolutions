import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { parseEnv } from 'node:util';

const filename = new URL('../../../.env', import.meta.url);
const configured = existsSync(filename);

test(
  'frontend imports shared configuration without importing backend secrets',
  { skip: !configured },
  () => {
    const environment = { ...process.env };
    for (const key of Object.keys(parseEnv(readFileSync(filename, 'utf8'))))
      delete environment[key];
    environment.NEXT_PUBLIC_SITE_URL = 'https://override.example.invalid';
    const code = `
    import {loadFrontendEnv} from './scripts/load-env.mjs';
    import {readFileSync} from 'node:fs';
    import {parseEnv} from 'node:util';
    const configuration=parseEnv(readFileSync('.env','utf8'));
    loadFrontendEnv();
    const allowed=['API_INTERNAL_URL','NEXT_PUBLIC_SITE_URL','NEXT_PUBLIC_GA_ID','GOOGLE_SITE_VERIFICATION','CLOUDINARY_PUBLIC_CLOUD_NAME'];
    if(Object.keys(configuration).some(key=>!allowed.includes(key)&&key in process.env))process.exit(1);
    if(process.env.NEXT_PUBLIC_SITE_URL!=='https://override.example.invalid')process.exit(2);
    if(!process.env.API_INTERNAL_URL)process.exit(3);
  `;
    const child = spawnSync(process.execPath, ['--input-type=module', '-e', code], {
      env: environment,
      cwd: new URL('../../../', import.meta.url),
      encoding: 'utf8',
    });
    assert(child.status === 0, 'Frontend environment filtering or override precedence failed.');
  },
);

test(
  'backend loads shared defaults and preserves explicit shell settings',
  { skip: !configured },
  () => {
    const environment = { ...process.env };
    for (const key of Object.keys(parseEnv(readFileSync(filename, 'utf8'))))
      delete environment[key];
    environment.PORT = '4501';
    const child = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `
    await import('./backend/src/config/env.js');
    if(process.env.PORT!=='4501')process.exit(1);
    if(!process.env.INTERNAL_API_KEY || process.env.INTERNAL_API_KEY.length<32)process.exit(2);
    if(!process.env.UPLOAD_SESSION_SECRET || process.env.UPLOAD_SESSION_SECRET.length<32)process.exit(3);
  `,
      ],
      { env: environment, cwd: new URL('../../../', import.meta.url), encoding: 'utf8' },
    );
    assert(child.status === 0, 'Backend environment loading or override precedence failed.');
  },
);
