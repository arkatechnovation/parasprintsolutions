# Public content during a database outage

Server-rendered pages read the live public API on every request. If the connection
fails, times out after three seconds, returns a server error, 408, 429, or an invalid
JSON envelope, the frontend uses the last successful response for that exact request
in the current server process. On a cold start it uses `src/data/catalog.json`.
The next request still tries the live API, so successful database reads resume
automatically. The process cache holds at most 500 requests.

The bundled snapshot uses the existing database document structure and the same
public filters, search fields, ordering and pagination as the backend. Drafts,
testimonials without confirmed permission, unverified certifications, private
settings and calculator rates are excluded. Empty live results remain empty.
Live 4xx responses are preserved; remembered 404/410 responses prevent the same
request from reviving a deleted record during a subsequent outage in that process.
No enquiries, quotations, uploads, estimates or submissions are simulated.

## Refresh after editing database content

From `frontend`, run `npm run fallback:sync` with the backend's normal database
environment configured. To read the existing persisted development database, use
`npm run fallback:sync -- --local`. The script uses the backend models, performs
read-only queries, and never runs the seed. It exports all published pages directly
from the database, including pages beyond the seed list.

Review and deploy the changed snapshot together with its image files. The script
requires referenced images to exist in `public/assets`, preserves image dimensions
and alternative text, and refuses incomplete essential content or remote images
that would make the fallback depend on another service. Bundle any new approved
images and update their database paths before refreshing. The existing page markup
and image sizing are shared by live and fallback content, preserving their layout.

The snapshot is a point-in-time copy. Database changes require another export and
deployment for cold-start fallback to reflect them. Successful responses cached in
one running process are not shared with other processes or persisted over restarts.

Run `npm run test:fallback` to verify outages and recovery, public filtering,
pagination, empty results, missing records, and bundled image files and dimensions.
