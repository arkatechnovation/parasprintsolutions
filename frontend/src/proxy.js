import { NextResponse } from 'next/server';

const pages = new Set([
  '/',
  '/about',
  '/products',
  '/industries',
  '/manufacturing-process',
  '/infrastructure',
  '/quality-assurance',
  '/clients',
  '/gallery',
  '/blog',
  '/case-studies',
  '/packaging-calculator',
  '/request-a-quote',
  '/contact',
  '/faq',
  '/downloads',
  '/privacy-policy',
  '/terms-and-conditions',
  '/thank-you',
  '/quote',
  '/manufacturing',
  '/quality',
  '/legal',
]);

function missingPage() {
  // Respond before streaming starts, so unknown/draft pages have a real HTTP 404.
  // No visitor-provided path or query is interpolated into the fallback document.
  return new NextResponse(
    `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Paras Prints Solutions</title><style>body{font:16px/1.7 Arial,sans-serif;color:#202020;margin:0;background:#f5f5f3}main{max-width:850px;margin:10vh auto;padding:32px}img{width:155px;height:auto;margin-bottom:55px}small{color:#a85d38;letter-spacing:.12em}h1{font-size:clamp(32px,6vw,62px);line-height:1.12;letter-spacing:-.04em;max-width:22ch}p{color:#666;max-width:60ch}nav{display:flex;flex-wrap:wrap;gap:16px;margin-top:30px}a{color:#a85d38;text-underline-offset:5px}nav a:first-child{padding:12px 20px;background:#a85d38;color:white;text-decoration:none}nav a{align-self:center}a:focus-visible{outline:3px solid #a85d38;outline-offset:5px}</style></head><body><main><a href="/" aria-label="Paras Prints Solutions home"><img src="/assets/logo.png" alt="Paras Prints Solutions"></a><div><small>404 · PAGE NOT FOUND</small><h1>Let’s get you back to the right place.</h1><p>This page is not available. Explore the product range or contact the team with your packaging and printing requirement.</p><nav aria-label="Recovery links"><a href="/">Back to home</a><a href="/products">Explore products</a><a href="/contact">Contact the team</a></nav></div></main></body></html>`,
    {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex',
      },
    },
  );
}

export function proxy(request) {
  const path = request.nextUrl.pathname;
  if (pages.has(path)) return NextResponse.next();
  const match = path.match(/^\/(products|industries|blog|case-studies)\/([a-z0-9-]{1,100})$/);
  if (!match) return missingPage();
  // Record availability is checked by generateMetadata/page server functions.
  // Middleware cannot use Vercel service bindings.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/|_next/|assets/|downloads/|robots\\.txt|sitemap\\.xml|favicon\\.ico).*)'],
};
