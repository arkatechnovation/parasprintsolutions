export class ApiError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}
export const ok = (res, data, status = 200, meta) =>
  res.status(status).json({ ok: true, data, ...(meta ? { meta } : {}) });
export function validate(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success)
    throw new ApiError(
      422,
      'Please check the highlighted fields.',
      Object.fromEntries(result.error.issues.map((i) => [i.path.join('.'), i.message])),
    );
  return result.data;
}
