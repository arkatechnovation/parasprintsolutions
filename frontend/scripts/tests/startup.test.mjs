import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { waitForApi } from '../wait-for-api.mjs';

test('startup waits until the API and database are ready', async () => {
  let ready = false;
  let probes = 0;
  let timer;
  const server = http.createServer((req, res) => {
    probes++;
    if (probes === 1)
      timer = setTimeout(() => {
        ready = true;
      }, 100);
    res.writeHead(ready ? 200 : 503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: ready }));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    await waitForApi(`http://127.0.0.1:${server.address().port}`, {
      timeoutMs: 2000,
      intervalMs: 20,
    });
    assert(ready);
    assert(probes >= 2, 'The API was retried before it became ready.');
  } finally {
    clearTimeout(timer);
    await new Promise((resolve) => server.close(resolve));
  }
});

test('an unavailable API produces an actionable startup error', async () => {
  const server = http.createServer((req, res) => {
    res.writeHead(503);
    res.end();
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  await new Promise((resolve) => server.close(resolve));
  await assert.rejects(
    waitForApi(origin, { timeoutMs: 100, intervalMs: 20 }),
    /Run npm run dev from the project root/,
  );
});
