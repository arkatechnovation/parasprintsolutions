import './config/env.js';
import crypto from 'node:crypto';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { createApp } from './app.js';
import { seed } from './seed.js';
const local = process.argv.includes('--local');
if (local && process.env.NODE_ENV !== 'production') {
  process.env.UPLOAD_SESSION_SECRET ||= crypto.randomBytes(48).toString('hex');
  process.env.ALLOW_LOCAL_UPLOADS ||= 'true';
}
try {
  await connectDatabase({ local });
  if (local) await seed();
  const port = Number(process.env.PORT || 4000);
  const server = createApp().listen(port, () =>
    console.log(`Paras API: http://localhost:${port}/api/v1/health`),
  );
  const shutdown = () =>
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} catch (error) {
  console.error(
    'API startup failed:',
    error.name === 'Error' ? error.message : 'Database configuration could not be loaded.',
  );
  process.exitCode = 1;
}
