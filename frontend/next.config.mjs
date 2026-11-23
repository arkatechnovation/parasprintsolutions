export default {
  poweredByHeader: false,
  // Resolve missing records in request-time metadata before streaming a 200 shell.
  htmlLimitedBots: /.*/,
  images: {
    // WebP avoids the expensive first-request AVIF encoding measured in the audit.
    formats: ['image/webp'],
    qualities: [75, 80, 85],
    remotePatterns:
      process.env.CLOUDINARY_PUBLIC_CLOUD_NAME &&
      /^[a-z0-9-]+$/.test(process.env.CLOUDINARY_PUBLIC_CLOUD_NAME)
        ? [
            {
              protocol: 'https',
              hostname: 'res.cloudinary.com',
              pathname: `/${process.env.CLOUDINARY_PUBLIC_CLOUD_NAME}/image/upload/**`,
            },
          ]
        : [],
  },
  async redirects() {
    return [
      ['/quote', '/request-a-quote'],
      ['/manufacturing', '/manufacturing-process'],
      ['/quality', '/quality-assurance'],
      ['/products/duplex-boxes-monocartons', '/products/duplex-boxes'],
      ['/legal', '/privacy-policy'],
    ].map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
