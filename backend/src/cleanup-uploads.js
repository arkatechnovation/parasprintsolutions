import './config/env.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { Media } from './models/index.js';
import { uploadDirectory } from './services/uploads.js';
try {
  await connectDatabase();
  const expired = await Media.find({
    claimedBy: { $exists: false },
    expiresAt: { $lt: new Date() },
  }).select('+storageKey');
  for (const item of expired) {
    if (item.provider === 'cloudinary') {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      await cloudinary.uploader.destroy(item.storageKey, {
        resource_type: 'raw',
        type: 'authenticated',
      });
    } else await fs.rm(path.join(uploadDirectory, path.basename(item.storageKey)), { force: true });
    await Media.deleteOne({ _id: item._id, claimedBy: { $exists: false } });
  }
  console.log(`Removed ${expired.length} expired, unclaimed uploads.`);
} finally {
  await disconnectDatabase();
}
