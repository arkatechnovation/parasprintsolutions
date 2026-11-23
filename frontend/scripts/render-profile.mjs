import fs from 'node:fs/promises';
import { createCanvas, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';
globalThis.DOMMatrix = DOMMatrix;
globalThis.ImageData = ImageData;
globalThis.Path2D = Path2D;
const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
class CanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    return { canvas, context: canvas.getContext('2d') };
  }
  getNoAlphaContext(canvas) {
    return canvas.getContext('2d', { alpha: false });
  }
  reset(target, width, height) {
    target.canvas.width = width;
    target.canvas.height = height;
  }
  destroy(target) {
    target.canvas.width = 0;
    target.canvas.height = 0;
    target.canvas = null;
    target.context = null;
  }
}
const bytes = new Uint8Array(
  await fs.readFile('public/downloads/paras-prints-company-profile.pdf'),
);
const document = await getDocument({
  data: bytes,
  CanvasFactory,
  isEvalSupported: false,
  useSystemFonts: true,
}).promise;
await fs.mkdir('../tmp/pdfs', { recursive: true });
for (let n = 1; n <= document.numPages; n++) {
  const page = await document.getPage(n);
  const viewport = page.getViewport({ scale: 0.65 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  await fs.writeFile(`tmp/pdfs/profile-${n}.png`, canvas.toBuffer('image/png'));
}
console.log(`Rendered ${document.numPages} profile pages for verification.`);
