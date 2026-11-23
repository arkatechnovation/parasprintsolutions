import crypto from 'node:crypto';
import { rateLimit } from 'express-rate-limit';
import { ApiError } from '../utils/errors.js';
export const submissionLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    ok: false,
    error: { message: 'Too many requests. Please try again later or contact us directly.' },
  },
});
export const uploadLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { ok: false, error: { message: 'Upload limit reached. Please try again later.' } },
});
export function internalOnly(req, res, next) {
  const expected = process.env.INTERNAL_API_KEY;
  const provided = req.get('authorization')?.replace(/^Bearer /, '') || '';
  if (!expected || expected.length < 32)
    return next(new ApiError(503, 'Internal integrations are not configured.'));
  const a = crypto.createHash('sha256').update(expected).digest();
  const b = crypto.createHash('sha256').update(provided).digest();
  if (!crypto.timingSafeEqual(a, b)) return next(new ApiError(401, 'Authentication required.'));
  next();
}
export function rejectOperators(req, res, next) {
  function inspect(value, depth = 0) {
    if (depth > 12) throw new ApiError(400, 'Request is too complex.');
    if (value && typeof value === 'object')
      for (const [key, child] of Object.entries(value)) {
        if (
          key.startsWith('$') ||
          /[.\[\]]/.test(key) ||
          ['__proto__', 'constructor', 'prototype'].includes(key)
        )
          throw new ApiError(400, 'Invalid request fields.');
        inspect(child, depth + 1);
      }
  }
  try {
    inspect(req.body);
    inspect(req.query);
    next();
  } catch (error) {
    next(error);
  }
}
export function errorHandler(error, req, res, next) {
  // eslint-disable-line no-unused-vars
  const status =
    error.status ||
    (error.code === 'LIMIT_FILE_SIZE'
      ? 413
      : error.name === 'MulterError'
        ? 400
        : error.type === 'entity.too.large'
          ? 413
          : error instanceof SyntaxError
            ? 400
            : 500);
  if (status >= 500)
    console.error('request_failure', {
      requestId: req.id,
      name: error.name,
      code: error.code || 'internal',
    });
  res.status(status).json({
    ok: false,
    error: {
      message:
        status >= 500 && !(error instanceof ApiError)
          ? 'The service is temporarily unavailable. Please try again or contact the team.'
          : error.message,
      ...(error.fields ? { fields: error.fields } : {}),
      requestId: req.id,
    },
  });
}
