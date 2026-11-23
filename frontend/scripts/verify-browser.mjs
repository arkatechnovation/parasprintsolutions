import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const lighthouseRequire = createRequire(require.resolve('lighthouse'));
const { launch } = await import(pathToFileURL(lighthouseRequire.resolve('chrome-launcher')).href);
const puppeteer = (await import(pathToFileURL(lighthouseRequire.resolve('puppeteer-core')).href))
  .default;
const base = process.env.VERIFY_SITE_URL || 'http://localhost:3000';
const chrome = await launch({
  chromeFlags: ['--headless=new', '--disable-extensions', '--no-first-run'],
});
const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}` });
const errors = [];
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await fs.mkdir('../output/lighthouse/screenshots', { recursive: true });
try {
  const page = await browser.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle2' });
  await page.waitForFunction(() => document.querySelector('.hero-slide.is-active img')?.complete);
  const slide = () =>
    page.$eval('.hero-slide.is-active', (element) => element.getAttribute('aria-label'));
  const first = await slide();
  await pause(5500);
  assert.notEqual(await slide(), first, 'The hero must auto-advance.');
  await page.click('[aria-label="Pause slideshow"]');
  const paused = await slide();
  await pause(5300);
  assert.equal(await slide(), paused, 'Pause must stop autoplay.');
  await page.click('[aria-label="Next slide"]');
  assert.notEqual(await slide(), paused, 'Manual next must work while paused.');
  await page.hover('[aria-controls="menu-Products"]');
  await page.waitForSelector('#menu-Products', { visible: true });
  assert(
    await page.$eval('#menu-Products', (element) => {
      const rect = element.getBoundingClientRect();
      return rect.left >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight;
    }),
    'The product menu must fit in the viewport.',
  );
  await page.screenshot({ path: '../output/lighthouse/screenshots/products-menu.png' });
  await page.hover('h1');
  await page.click('[aria-label="Search products"]');
  await page.type('#product-search', 'corrugated');
  assert.match(
    await page.$eval('.search-results', (element) => element.textContent),
    /corrugated/i,
  );
  await page.keyboard.press('Escape');
  assert.equal(await page.$eval('.search-dialog', (element) => element.open), false);
  await page.screenshot({ path: '../output/lighthouse/screenshots/home-desktop.png' });

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.reload({ waitUntil: 'networkidle2' });
  const reduced = await slide();
  await pause(5500);
  assert.equal(await slide(), reduced, 'Reduced motion must disable autoplay.');
  await page.click('[aria-label="Play slideshow"]');
  await pause(5500);
  assert.notEqual(await slide(), reduced, 'Explicit play must override reduced motion.');
  await page.goto(`${base}/about`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '../output/lighthouse/screenshots/about-desktop.png' });
  await page.goto(`${base}/gallery`, { waitUntil: 'networkidle2' });
  assert.equal((await page.$$('.gallery-tile')).length, 62);
  await page.click('.gallery-tile');
  await page.waitForSelector('.lightbox[open]');
  const image = await page.$eval('.lightbox-bottom p', (element) => element.textContent);
  await page.click('[aria-label="Next image"]');
  assert.notEqual(await page.$eval('.lightbox-bottom p', (element) => element.textContent), image);
  await page.keyboard.press('Escape');
  assert.equal(await page.$eval('.lightbox', (element) => element.open), false);

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle2' });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
    'Mobile must not overflow horizontally.',
  );
  await page.screenshot({ path: '../output/lighthouse/screenshots/home-mobile.png' });
  await page.click('[aria-label="Open navigation"]');
  await page.waitForSelector('.mobile-menu[open]');
  await page.click('[aria-label="Close navigation"]');
  assert.equal(await page.$eval('.mobile-menu', (element) => element.open), false);

  for (const route of ['/products', '/gallery', '/contact']) {
    await page.goto(base + route, { waitUntil: 'networkidle2' });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
      `Mobile content must fit the page width: ${route}`,
    );
  }
  await page.goto(base, { waitUntil: 'networkidle2' });

  await page.setJavaScriptEnabled(false);
  await page.reload({ waitUntil: 'networkidle2' });
  assert.match(await page.$eval('h1', (element) => element.textContent), /Packaging/);
  assert.equal(await page.$eval('.hero-slide img', (element) => element.complete), true);
  assert.deepEqual(errors, [], 'No browser runtime errors are allowed.');
  console.log(
    'Verified autoplay, pause/next, reduced motion, product menu, search, all 62 gallery entries, lightbox, mobile navigation/overflow, and server-rendered content without JavaScript.',
  );
} finally {
  await browser.disconnect();
  await chrome.kill();
}
