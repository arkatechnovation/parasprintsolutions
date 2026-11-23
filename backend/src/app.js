import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import routes from './routes/index.js';
import { errorHandler, rejectOperators } from './middleware/security.js';
import { ApiError } from './utils/errors.js';
export function createApp({ initialize } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', Math.max(0, Math.min(5, Number(process.env.TRUST_PROXY_HOPS) || 0)));
  app.use((req, res, next) => {
    req.id = crypto.randomUUID();
    res.set('X-Request-ID', req.id);
    next();
  });
  app.use(helmet());
  app.use(compression());
  const origins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((v) => v.trim());
  app.use(
    cors({
      origin: (origin, done) =>
        !origin || origins.includes(origin)
          ? done(null, true)
          : done(new ApiError(403, 'This origin is not allowed.')),
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Upload-Token'],
    }),
  );
  app.use(express.json({ limit: '128kb' }));
  app.use(rejectOperators);
  if (initialize) {
    app.use(async (req, res, next) => {
      try {
        await initialize();
        next();
      } catch {
        next(
          new ApiError(503, 'The database is temporarily unavailable. Please try again shortly.'),
        );
      }
    });
  }
  app.get('/api/v1/health', (req, res) =>
    res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
      ok: mongoose.connection.readyState === 1,
      data: { status: mongoose.connection.readyState === 1 ? 'ready' : 'unavailable' },
    }),
  );
  app.use(
    '/api/v1',
    rateLimit({
      windowMs: 60000,
      limit: Math.max(60, Math.min(10000, Number(process.env.API_RATE_LIMIT) || 1000)),
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { ok: false, error: { message: 'Too many requests. Please try again shortly.' } },
    }),
    routes,
  );
  app.use((req, res, next) => next(new ApiError(404, 'Endpoint not found.')));
  app.use(errorHandler);
  return app;
}
