// Keep the browser's conventional fallback URL valid without duplicating artwork.
export const dynamic = 'force-static';
export function GET() {
  return new Response(null, {
    status: 308,
    headers: { Location: '/assets/logo.png', 'Cache-Control': 'public, max-age=86400' },
  });
}
