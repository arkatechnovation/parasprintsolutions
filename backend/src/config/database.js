import './env.js';
import mongoose from 'mongoose';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
let localServer;
let connectionPromise;
export async function connectDatabase({ local = false, test = false } = {}) {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connectionPromise) {
    connectionPromise = openDatabase({ local, test }).finally(() => {
      connectionPromise = undefined;
    });
  }
  return connectionPromise;
}

async function openDatabase({ local, test }) {
  let uri = process.env.MONGODB_URI;
  if (test || (!uri && local)) {
    const { MongoMemoryServer } = await import('mongodb-memory-server-core');
    const dbPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../.data/mongodb',
    );
    if (!test) await fs.mkdir(dbPath, { recursive: true });
    localServer = await MongoMemoryServer.create({
      binary: { version: '8.0.17' },
      instance: {
        ...(!test ? { dbPath } : {}),
        launchTimeout: 60000,
        storageEngine: 'wiredTiger',
        dbName: test ? 'paras_test' : 'paras_prints',
      },
    });
    uri = localServer.getUri();
    console.log(
      test
        ? 'Isolated test database ready.'
        : 'Persistent local MongoDB ready (backend/.data/mongodb).',
    );
  }
  if (!uri) throw new Error('MONGODB_URI is required. Use npm run dev for the local database.');
  // Request objects are never passed as filters: validators and rejectOperators
  // enforce scalar inputs. Server-created operators remain available here.
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
    autoIndex: process.env.NODE_ENV !== 'production',
  });
  return mongoose.connection;
}
export async function disconnectDatabase() {
  connectionPromise = undefined;
  await mongoose.disconnect();
  if (localServer) {
    await localServer.stop();
    localServer = undefined;
  }
}
