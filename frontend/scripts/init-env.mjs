import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const secret = () => randomBytes(48).toString('hex');
const configuration = `# Paras Prints Solutions - shared local configuration
# Both services read this file. Service-specific files and shell variables take priority.
# Do not commit this file. Restart npm run dev after editing it.

# Application: local development defaults
NODE_ENV=development
PORT=4000
API_INTERNAL_URL=http://127.0.0.1:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PUBLIC_SITE_URL=http://localhost:3000
FRONTEND_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
TRUST_PROXY_HOPS=0
API_RATE_LIMIT=1000

# Database: leave blank for the persistent automatic database used by npm run dev.
# For an existing MongoDB or Atlas instance, enter its real connection URI here.
# Example for a separately running local database: mongodb://127.0.0.1:27017/paras_prints
MONGODB_URI=

# Generated private keys; keep these stable and confidential.
INTERNAL_API_KEY=${secret()}
UPLOAD_SESSION_SECRET=${secret()}

# Private local uploads are development-only. Production requires Cloudinary.
ALLOW_LOCAL_UPLOADS=true
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
# Optional public-image cloud name for the frontend image optimizer.
CLOUDINARY_PUBLIC_CLOUD_NAME=

# Email: enter your SMTP provider settings to enable delivery.
# A blank SMTP_HOST keeps email disabled while enquiries are still saved.
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=info@parasprints.com
NOTIFICATION_EMAIL=info@parasprints.com

# Optional tracking and ownership verification; blank keeps them disabled.
NEXT_PUBLIC_GA_ID=
GOOGLE_SITE_VERIFICATION=

# Optional Docker MongoDB credentials. Local npm development does not use these.
# Before using Compose, set MONGODB_URI to the authenticated mongo service URI.
MONGO_ROOT_USER=paras_admin
MONGO_ROOT_PASSWORD=${secret()}
`;

try {
  writeFileSync(new URL('../.env', import.meta.url), configuration, { flag: 'wx', mode: 0o600 });
  console.log(
    'Created root .env with local defaults and generated private keys. Existing files were preserved.',
  );
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log('Root .env already exists; no values were overwritten.');
}
