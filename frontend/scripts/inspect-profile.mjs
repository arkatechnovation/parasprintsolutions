import fs from 'node:fs/promises';
import { createCanvas, loadImage } from '@napi-rs/canvas';
const canvas = createCanvas(1000, 900),
  ctx = canvas.getContext('2d');
ctx.fillStyle = '#ddd';
ctx.fillRect(0, 0, 1000, 900);
for (let n = 1; n <= 13; n++) {
  const img = await loadImage(`tmp/pdfs/profile-${n}.png`);
  const x = ((n - 1) % 5) * 200,
    y = Math.floor((n - 1) / 5) * 300;
  ctx.drawImage(img, x + 4, y + 4, 192, 271);
  ctx.fillStyle = '#202020';
  ctx.font = '12px sans-serif';
  ctx.fillText('Page ' + n, x + 8, y + 291);
}
await fs.writeFile('../tmp/pdfs/contact-sheet.png', canvas.toBuffer('image/png'));
