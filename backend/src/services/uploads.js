import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fileTypeFromBuffer } from 'file-type';
import { v2 as cloudinary } from 'cloudinary';
import { Media } from '../models/index.js';
import { ApiError } from '../utils/errors.js';
export const uploadDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../uploads',
);
const secret = () => {
  const key = process.env.UPLOAD_SESSION_SECRET;
  if (!key || key.length < 32)
    throw new ApiError(
      503,
      'Uploads are not configured. Please send your requirement without attachments.',
    );
  return key;
};
export const sessionHash = (token) => crypto.createHash('sha256').update(token).digest('hex');
export function createUploadSession() {
  const data = Buffer.from(
    JSON.stringify({ nonce: crypto.randomUUID(), expires: Date.now() + 30 * 60 * 1000 }),
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', secret()).update(data).digest('base64url');
  return `${data}.${signature}`;
}
export function verifyUploadSession(token) {
  if (typeof token !== 'string' || token.length > 1000)
    throw new ApiError(401, 'A valid upload session is required.');
  const [data, signature] = token.split('.');
  const expected = crypto
    .createHmac('sha256', secret())
    .update(data || '')
    .digest('base64url');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || '');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b))
    throw new ApiError(401, 'Upload session is invalid.');
  try {
    const value = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (!value.nonce || value.expires < Date.now()) throw Error();
  } catch {
    throw new ApiError(401, 'Upload session has expired. Please select your file again.');
  }
  return sessionHash(token);
}
export async function storeUpload(file, token) {
  const hash = verifyUploadSession(token);
  if (!file) throw new ApiError(422, 'Choose a file to upload.');
  if ((await Media.countDocuments({ uploadSession: hash })) >= 3)
    throw new ApiError(422, 'A maximum of three files can be attached.');
  const type = await fileTypeFromBuffer(file.buffer);
  const ext = path.extname(file.originalname).slice(1).toLowerCase().replace('jpeg', 'jpg');
  if (
    !type ||
    !['image/jpeg', 'image/png', 'application/pdf'].includes(type.mime) ||
    type.ext.replace('jpeg', 'jpg') !== ext ||
    type.mime !== file.mimetype
  )
    throw new ApiError(422, 'Upload a genuine JPG, PNG or PDF file.');
  const originalName = path
    .basename(file.originalname)
    .replace(/[^a-zA-Z0-9._ -]/g, '_')
    .slice(0, 180);
  let provider, storageKey;
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await new Promise((resolve, reject) =>
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'raw',
            type: 'authenticated',
            folder: 'paras-prints/private',
            public_id: crypto.randomUUID(),
          },
          (error, result) => (error ? reject(error) : resolve(result)),
        )
        .end(file.buffer),
    );
    provider = 'cloudinary';
    storageKey = result.public_id;
  } else if (process.env.ALLOW_LOCAL_UPLOADS === 'true' && process.env.NODE_ENV !== 'production') {
    await fs.mkdir(uploadDirectory, { recursive: true });
    storageKey = crypto.randomUUID() + '.' + ext;
    await fs.writeFile(path.join(uploadDirectory, storageKey), file.buffer, { flag: 'wx' });
    provider = 'local';
  } else
    throw new ApiError(
      503,
      'File storage is not configured. Please submit without an attachment or contact us.',
    );
  const doc = await Media.create({
    originalName,
    mime: type.mime,
    size: file.size,
    provider,
    storageKey,
    uploadSession: hash,
    expiresAt: new Date(Date.now() + 24 * 3600000),
  });
  return { id: doc._id, name: originalName, size: doc.size };
}
export async function validateAttachments(ids, token) {
  if (!ids.length) return;
  const hash = verifyUploadSession(token);
  const count = await Media.countDocuments({
    _id: { $in: [...new Set(ids)] },
    uploadSession: hash,
    claimedBy: { $exists: false },
    expiresAt: { $gt: new Date() },
  });
  if (count !== ids.length)
    throw new ApiError(
      422,
      'An attachment is unavailable or belongs to another session. Please upload it again.',
    );
}
