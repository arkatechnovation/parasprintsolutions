import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';
const pdf = await PDFDocument.create();
pdf.setTitle('Paras Prints Solutions — Supplied Company Profile');
pdf.setSubject('The supplied company profile pages reproduced without content changes.');
for (let n = 1; n <= 13; n++) {
  const filename = `Company Profile Paras_page-${String(n).padStart(4, '0')}.jpg`;
  const image = await pdf.embedJpg(await fs.readFile(path.join('public/assets', filename)));
  const page = pdf.addPage([595.28, 841.89]);
  const scale = Math.min(page.getWidth() / image.width, page.getHeight() / image.height);
  const width = image.width * scale,
    height = image.height * scale;
  page.drawImage(image, {
    x: (page.getWidth() - width) / 2,
    y: (page.getHeight() - height) / 2,
    width,
    height,
  });
}
const directory = 'public/downloads';
await fs.mkdir(directory, { recursive: true });
await fs.writeFile(path.join(directory, 'paras-prints-company-profile.pdf'), await pdf.save());
console.log('Company profile created from all 13 supplied pages.');
