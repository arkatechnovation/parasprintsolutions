# Vercel services deployment

The root `vercel.json` deploys this npm workspace as one Vercel project. Select the repository root as the project root, not `frontend/` or `backend/`. Leave project-wide build/framework overrides unset; those settings belong to each service.

## Proposed services and routing — awaiting owner confirmation

| Service    | Root       | Public requests                            | Calls                                               |
| ---------- | ---------- | ------------------------------------------ | --------------------------------------------------- |
| `backend`  | `backend`  | `/api/*`; the app implements `/api/v1/*`   | MongoDB, SMTP and Cloudinary (external providers)   |
| `frontend` | `frontend` | All remaining paths, including Next assets | `backend` using the generated `BACKEND_URL` binding |

The API rewrite comes first and preserves the full URL path. Browser forms, uploads and calculator actions already call same-origin `/api/v1/...`, so the backend needs public ingress. Private enquiry/quotation/file endpoints still require application authorization. Neither service is wholly internal in this proposal. MongoDB is an external managed database, not another Vercel service.

Server-rendered pages resolve `BACKEND_URL` inside request-time functions, after `connection()`. The helper appends `api/v1/...` to the binding base and preserves any prefix. Never assign `BACKEND_URL` in `.env`, project settings, Docker configuration or build arguments: Vercel generates it. A missing binding on Vercel fails explicitly instead of connecting to localhost. Middleware performs no API requests. Metadata blocks streaming and there is no root loading boundary that flushes a premature HTTP 200, so missing database records can return HTTP 404 from server functions.

The Express entrypoint exports an app without opening a listener or seeding a database. Its first request establishes a shared MongoDB connection; concurrent requests reuse the pending connection, and warm requests reuse the pool. Connection failures return a sanitized 503 and can retry on a later request. `server.js` remains the standalone local/Docker entrypoint.

## Environment and persistent services

Configure the following in Vercel for the appropriate Production and Preview environments. These are ordinary environment variables shared by the project; none of the private values use a `NEXT_PUBLIC_` prefix. The frontend's shared-file loader imports only its explicit allowlist.

| Variables                                                                                            | Configuration                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `MONGODB_URI`                                                                                        | Dedicated, reachable MongoDB Atlas URI with application credentials. A blank URI or localhost database is not usable in deployed functions.                              |
| `NEXT_PUBLIC_SITE_URL`, `PUBLIC_SITE_URL`                                                            | Actual HTTPS website origin, without a trailing slash; use the intended preview origin for Preview.                                                                      |
| `FRONTEND_ORIGINS`                                                                                   | Comma-separated exact allowed website origins. Include each preview origin used to submit forms.                                                                         |
| `INTERNAL_API_KEY`, `UPLOAD_SESSION_SECRET`                                                          | Independent cryptographically random secrets, at least 32 characters each.                                                                                               |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`                               | Required for private production attachments. Set `ALLOW_LOCAL_UPLOADS=false`; function disk is not persistent storage.                                                   |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `NOTIFICATION_EMAIL` | Production email provider and sender/notification addresses. Missing SMTP leaves submissions saved with email not configured.                                            |
| `TRUST_PROXY_HOPS`, `API_RATE_LIMIT`                                                                 | Configure for the actual trusted proxy topology and traffic. The in-process rate limiter is per function instance; use shared enforcement if a global limit is required. |
| `NEXT_PUBLIC_GA_ID`, `GOOGLE_SITE_VERIFICATION`, `CLOUDINARY_PUBLIC_CLOUD_NAME`                      | Optional tracking, verification and approved public image configuration.                                                                                                 |

Do not copy local `PORT`, `API_INTERNAL_URL` or local MongoDB settings into the Vercel project. Vercel supplies its own ports. `API_INTERNAL_URL` remains supported only for standalone local/Docker hosting. `.vercelignore` excludes environment files, local database files, local uploads and build output.

With the production MongoDB configured in your local shell/secret manager, run `npm run seed` once against that intended database. The seed inserts missing content without overwriting existing edits. Functions do not seed on startup. Schedule upload cleanup externally using `npm run uploads:cleanup -w backend` with the appropriate credentials; there is no public cleanup endpoint.

## Local verification

Install dependencies at the repository root with `npm ci`, then run:

```sh
npx vercel dev --local --yes --listen 127.0.0.1:3100
```

This runs both services and injects their binding. `--local` does not pull Vercel environment variables; local ignored configuration still applies. The backend's dev command starts the local persistent database and seeds missing content. The frontend's `vercel-dev` launcher uses Vercel's port without waiting on the standalone API port. Use the single public gateway at port 3100, not a service's temporary port.

Stop standalone frontend/backend development servers first so two MongoDB processes do not open the same local database directory. For browser form testing, include `http://127.0.0.1:3100` in the local backend's `FRONTEND_ORIGINS`; set the local public site URLs to that gateway origin when checking canonical URLs.

```powershell
$env:VERIFY_SITE_URL='http://127.0.0.1:3100'
$env:VERIFY_API_URL='http://127.0.0.1:3100/api/v1'
npm run verify
```

Run `npm test`, `npm run lint` and `npm run build` too. A Vercel-mode build must succeed with `VERCEL=1` and **without** `BACKEND_URL` or a running backend. Build success alone does not verify runtime binding injection.

On this Windows machine, Vercel CLI 66.1.0 detected both services but failed installing its cached builders with `EPERM` on symlink creation. Full `vercel dev` integration remains unverified until that machine permission/tooling limitation is resolved (or the same command is run on a supported Linux environment). No deployment or project linking was performed.

Validation for this change: all 15 tests and frontend lint passed. A Vercel-mode production build succeeded without a binding (the final rebuild used `--webpack` after a concurrent local dev process stalled Turbopack). The current Vercel schema accepted the configuration using a draft-7 validator; the published schema mixes draft-04 metadata with newer keywords. The HTTP crawler passed 39 pages, 57 internal links, all 62 original and optimized images, downloads, metadata, redirects, missing-content 404s and private API denial checks through a temporary local HTTP router. That router checked public path behavior with the standalone API; it did not emulate or verify Vercel's runtime binding injection.

## Upload decision required before launch

The current application accepts 10 MB files through Express. Vercel Functions cap request bodies at 4.5 MB, including multipart overhead. Files exceeding that platform limit will be rejected before Express handles them. Choose either a consistent lower file limit (for example 4 MB in both browser validation and backend) or a direct-to-Cloudinary upload flow to retain 10 MB support. The existing limit has been preserved pending this product decision. Private file retrieval above the response-body limit also requires a streaming/download design compatible with the provider.

Do not launch until the domain/environment values, real database persistence, SMTP delivery, private file storage and this upload policy have been verified.

References: [services](https://vercel.com/docs/services), [routing](https://vercel.com/docs/services/routing), [bindings](https://vercel.com/docs/services/bindings), [Express](https://vercel.com/docs/frameworks/backend/express), [function limits](https://vercel.com/docs/functions/limitations).
