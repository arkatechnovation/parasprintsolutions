# Deployment

For Vercel, follow [Vercel services deployment](vercel-services.md). Its public gateway and generated binding replace the standalone proxy configuration described below.

## Architecture

Next.js serves the public website and proxies `/api/v1` to Express. Express connects to MongoDB. Production uploads use authenticated Cloudinary assets; email uses configured SMTP. There is no administrative UI or public administrative mutation API.

Use Node 22.13+ (24 recommended). Keep `frontend/.env.local` and `backend/.env` separate. Never put database, SMTP, Cloudinary, upload-session or internal API secrets in a `NEXT_PUBLIC_` variable.

## Environment checklist

| Service             | Required configuration                                                                  |
| ------------------- | --------------------------------------------------------------------------------------- |
| Frontend            | `API_INTERNAL_URL`, `NEXT_PUBLIC_SITE_URL`                                              |
| Database            | `MONGODB_URI` on backend                                                                |
| Network             | `PORT`, exact `FRONTEND_ORIGINS`, correct `TRUST_PROXY_HOPS`                            |
| Private integration | Random `INTERNAL_API_KEY` of at least 32 characters                                     |
| Uploads             | Cloudinary name/key/secret and random `UPLOAD_SESSION_SECRET` >=32 characters           |
| Email               | SMTP host/port/security, credentials if needed, sender and company notification address |
| Optional tracking   | Valid GA4 ID and Search Console verification token                                      |

Generate keys using `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` locally, then place them in your secret manager. Do not print live deployed secrets into logs or commit them.

## Managed deployment

1. Provision MongoDB or Atlas with least-privilege application credentials, TLS and network restrictions. Use a dedicated database, not an existing unrelated database.
2. Configure backend secrets and run the seed command once. It inserts missing records and creates indexes without overwriting existing edits.
3. Deploy Express as a persistent Node service. Health: `/api/v1/health`. A configured database must be reachable before the server accepts traffic.
4. Set the frontend API origin at build time and runtime. Build with `npm run build`. The public pages render on the server and fetch published content from the API.
5. Run the frontend with `npm start -w frontend` and backend with `npm start -w backend`, or use the root combined start command under a suitable process supervisor.
6. Point the real HTTPS domain to the frontend. Set `NEXT_PUBLIC_SITE_URL` to that exact origin for canonicals and sitemap. Do not launch with localhost canonicals.
7. Restrict direct API/database access as appropriate. Allow only the configured frontend origins. Configure proxy-hop trust to match actual trusted reverse proxies; the default is zero. In a restricted single Next.js-proxy topology, one hop may be appropriate. An additional load balancer changes the topology.

If a hosting provider caps request bodies below 10 MB, either choose an appropriate Node host/reverse-proxy limit or lower the application/UI file limit consistently. A proxy should allow multipart overhead above the accepted 10 MB file. Serverless provider body/time limits must be checked for the selected plan; this project does not assume a particular provider's limits.

## Containers

The supplied Dockerfiles and Compose file are an alternative. Create an ignored `.env` containing `MONGO_ROOT_USER`, `MONGO_ROOT_PASSWORD`, `MONGODB_URI`, and service settings. For the included Mongo service, construct a URL-encoded URI such as `mongodb://<user>:<encoded-password>@mongo:27017/paras_prints?authSource=admin`. Use dedicated app credentials for a hardened deployment rather than root credentials.

```sh
docker compose build
docker compose up -d mongo
docker compose run --rm backend npm run seed -w backend
docker compose up -d
```

Only frontend port 3000 is published. Put a TLS reverse proxy in front. The API and Mongo service communicate over the internal Compose network. Mongo has a persistent volume. Configure external Atlas instead when suitable. SMTP and Cloudinary must still be real, configured services.

The frontend Docker build defaults `API_INTERNAL_URL=http://backend:4000`; override the build argument and matching runtime value together for another topology. Build and runtime public origins must also agree.

## Operations

- Schedule `npm run uploads:cleanup -w backend` daily with a configured database and file-provider credentials. It deletes only expired unclaimed uploads, not customer-owned attachments.
- Confirm a retention schedule for enquiries and claimed files, implement that operational policy, and align the privacy text before launch.
- Back up MongoDB and test restoration. Protect Cloudinary access and review provider retention/security settings.
- Monitor API health, HTTP failures and email delivery statuses. Missing SMTP records `not-configured`; delivery failure records `failed`. Saved submissions are retained.
- Review pending/failed notifications through authorised operations; do not expose enquiry lists publicly to solve an operations problem.
- Keep dependencies and runtime security patches current. `npm audit --omit=dev` is a production dependency check. A separate tooling advisory can still affect development packages; see QA.
- Run tests/build/HTTP verification before publishing new content or deploying changes.

## Launch gate

Confirm business/contact information, technical specifications and any public claims. Approve legal/privacy language and customer permissions. Test real MongoDB persistence, an actual external SMTP provider, private Cloudinary upload/retrieval, the real public domain, mobile viewports, keyboard navigation and reduced motion. The local SMTP capture test and HTTP crawler do not establish external delivery or browser visual quality.
