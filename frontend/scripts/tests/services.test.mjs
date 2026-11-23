import { test } from 'node:test';
import assert from 'node:assert/strict';
import { backendUrl } from '../../frontend/src/lib/backend-url.mjs';

test('service binding takes precedence and preserves the target path prefix', () => {
  const environment = {
    VERCEL: '1',
    BACKEND_URL: 'https://internal.example.invalid/backend',
    API_INTERNAL_URL: 'http://127.0.0.1:4000',
  };
  assert.equal(
    backendUrl('/products?limit=2', environment).href,
    'https://internal.example.invalid/backend/api/v1/products?limit=2',
  );
  environment.BACKEND_URL = 'https://preview.example.invalid/';
  assert.equal(
    backendUrl('/settings', environment).href,
    'https://preview.example.invalid/api/v1/settings',
  );
});

test('Vercel cannot silently fall back to localhost or a manually configured API', () => {
  assert.throws(
    () => backendUrl('/products', { VERCEL: '1', API_INTERNAL_URL: 'http://localhost:4000' }),
    /missing its BACKEND_URL binding/,
  );
  assert.equal(backendUrl('/products', {}).href, 'http://127.0.0.1:4000/api/v1/products');
  assert.equal(
    backendUrl('/products', { API_INTERNAL_URL: 'http://api:4000' }).href,
    'http://api:4000/api/v1/products',
  );
});
