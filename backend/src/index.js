import './config/env.js';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';

// Vercel imports the Express application without opening a persistent listener.
// Connections are established on the first request and reused by warm functions.
const app = createApp({ initialize: () => connectDatabase() });
export default app;
