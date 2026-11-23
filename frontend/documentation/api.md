# REST API reference

Base path: `/api/v1`. The frontend proxies this path to Express. Send JSON with `Content-Type: application/json` except for multipart upload requests.

| Resource              | Method and path                                | Access                                                    |
| --------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| Health                | `GET /health`                                  | Public; 200 when DB is ready, otherwise 503               |
| Products              | `GET /products`, `GET /products/:slug`         | Published only                                            |
| Categories            | `GET /categories`, `GET /categories/:slug`     | Published only                                            |
| Pages                 | `GET /pages/:slug`                             | Published only                                            |
| Industries            | `GET /industries`, `GET /industries/:slug`     | Published only                                            |
| Blog                  | `GET /blogs`, `GET /blogs/:slug`               | Published only                                            |
| Case studies          | `GET /case-studies`, `GET /case-studies/:slug` | Published only                                            |
| Clients               | `GET /clients`                                 | Published names from source                               |
| Testimonials          | `GET /testimonials`                            | Published and permission-confirmed only                   |
| Gallery               | `GET /gallery`, `GET /gallery/categories`      | Published only                                            |
| Machinery             | `GET /machines`                                | Published only                                            |
| Certifications        | `GET /certifications`                          | Published and verified only                               |
| Settings              | `GET /settings/public`                         | Explicit public keys only                                 |
| Calculator settings   | `GET /calculator/settings`                     | Public options; internal rates excluded                   |
| Estimate              | `POST /calculator/estimate`                    | Validated configuration, rate limited                     |
| Calculator submission | `POST /calculator/submit`                      | Public write, private stored record                       |
| Calculator records    | `GET /calculator/submissions`                  | Internal bearer key                                       |
| Enquiries             | `POST /enquiries`, `GET /enquiries`            | POST public; GET internal bearer key                      |
| Quotations            | `POST /quotations`, `GET /quotations`          | POST public; GET internal bearer key                      |
| Upload session        | `POST /uploads/session`                        | Short-lived scoped upload token                           |
| Upload                | `POST /uploads`                                | Valid upload token, multipart `file`                      |
| Private file          | `GET /uploads/:id`                             | Internal bearer key; bytes or short-lived Cloudinary link |

## Listing parameters

Public listings support `page` (1-10000), `limit` (1-100, default 24), `search` (up to 120 characters), `category` and `featured`. Product categories use their slug; gallery/blog filters use the displayed category string. `featured=true` selects core products. Search uses an escaped literal regex, never a user-provided MongoDB expression. Unsupported fields return 422.

```json
{
  "ok": true,
  "data": [],
  "meta": { "page": 1, "limit": 24, "total": 0, "pages": 0 }
}
```

## Enquiries

```json
{
  "customer": {
    "name": "Your name",
    "email": "you@example.com",
    "phone": "+91 90000 00000",
    "company": "Your company",
    "city": "Delivery city"
  },
  "subject": "Packaging enquiry",
  "message": "The product, quantity and requirements to discuss.",
  "productSlug": "corrugated-boxes",
  "source": "contact",
  "website": ""
}
```

Name, valid email, phone, subject and a message of at least ten characters are required. Company/city/product are optional. The honeypot `website` must be empty.

## Quotations

Send `customer`, `source`, empty `website`, a published `productSlug`, `requirements` (at least ten characters), integer `quantity` >=1, optional `dimensions`, `material`, `printing`, `finishing`, `attachmentIds` (max 3) and `uploadToken`. Website quantity/dimension caps are validation limits, not company capability or MOQ promises.

For safe retries use `Idempotency-Key: <UUID>`. A first valid submission returns 201; a repeated key returns the existing reference with 200 and does not send duplicate notifications. Keep the same key when retrying an uncertain request. Store only the returned reference in the success URL, never customer information.

```json
{
  "ok": true,
  "data": {
    "reference": "MongoDB ObjectId",
    "message": "Your request is saved. Our team will review your requirements."
  }
}
```

## Calculator

`GET /calculator/settings` provides allowed options and software input limits. POST an exact configuration to `/calculator/estimate`:

```json
{
  "product": "corrugated-boxes",
  "style": "rsc",
  "length": 400,
  "width": 300,
  "height": 250,
  "unit": "mm",
  "material": "kraft",
  "printing": "plain",
  "finishing": [],
  "quantity": 100
}
```

All dimensions must be positive and convertible to the configured millimetre cap. Quantity must be a positive integer. Options must belong to the selected product. Without verified rates the result uses `mode: "quotation"` and has no fabricated cost fields.

To save, POST `{ customer, configuration, requirements, source, website: "" }` to `/calculator/submit`, with an idempotency key. The server recalculates; it never trusts a browser-supplied amount.

## Upload workflow

1. POST `{ "website": "" }` to `/uploads/session`. The HMAC token expires after 30 minutes.
2. POST multipart field `file` to `/uploads` with `X-Upload-Token`. Genuine PNG, JPG and PDF only, maximum 10 MB per file and three per session.
3. Attach returned IDs and the same upload token to the quotation. Another session cannot claim these files. Only metadata IDs/names/sizes are returned to the browser, not storage keys or public URLs.
4. Claimed files remain private. Unclaimed files expire for maintenance after 24 hours; schedule `uploads:cleanup`. Retention of claimed files must follow the company's confirmed policy.

Private retrieval requires a bearer integration key. Cloudinary retrieval returns a link valid for 60 seconds; local development retrieval streams the bytes with attachment disposition. No customer file is exposed via a static URL.

## Private integrations

Configure a random `INTERNAL_API_KEY` of at least 32 characters on the backend. Send `Authorization: Bearer <key>` only from trusted server-side integrations. Missing configuration returns 503, incorrect credentials 401. Private lists paginate at 25 records and include internal notes; request-idempotency keys remain excluded. Do not embed the integration key in browser code.

There are deliberately no public CRUD or administrative mutation endpoints. A future admin application can add authenticated, authorised mutations over the existing models and services.

## Errors and limits

- 400 malformed/unsafe requests; 401 authentication/session failure; 403 disallowed origin; 404 unavailable content.
- 413 upload/body too large; 422 field validation; 429 rate limit; 503 missing service configuration.
- General API limit defaults to 1000 requests/minute/IP to accommodate server-rendered page reads; `API_RATE_LIMIT` is configurable.
- Submissions/estimates: 8 per 15 minutes/IP. Upload/session requests: 12 per 15 minutes/IP.
- JSON limit: 128 KB. Unknown object fields, MongoDB operator keys, prototype keys and bracket/dot query field notation are rejected.
- Generic internal failures return a request ID without stack traces, credentials or database details.

Configure `TRUST_PROXY_HOPS` for the exact trusted deployment path so the limiter receives the real client IP. A Next.js proxy or load balancer can otherwise make multiple users appear to share one address.
