import { NextResponse } from 'next/server';
import { getFallbackData } from '@/lib/catalog-fallback';

export async function GET(request, { params }) {
  const { slug } = await params;
  const path = (slug || []).join('/');
  const search = request.nextUrl.search;
  const fallback = getFallbackData('/' + path + search);
  return NextResponse.json(fallback, { status: fallback.status || 200 });
}

export async function POST(request, { params }) {
  const { slug } = await params;
  const path = (slug || []).join('/');
  
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  if (path === 'calculator/estimate') {
    return NextResponse.json({
      ok: true,
      data: {
        mode: 'quotation',
        configuration: body,
        message:
          'Your specifications are ready. Our team will prepare a quotation after reviewing the material, artwork and delivery requirements.',
        disclaimer:
          'Specifications are reviewed by our engineering team before quotation.',
      },
    });
  }

  if (path === 'uploads/session') {
    return NextResponse.json({
      ok: true,
      data: {
        token: 'session_' + Math.random().toString(36).substring(2),
        expiresIn: 1800,
      },
    });
  }

  if (path === 'uploads') {
    return NextResponse.json({
      ok: true,
      data: {
        id: 'upload_' + Math.random().toString(36).substring(2),
      },
    });
  }

  // Handle enquiries, quotations, calculator/submit
  const prefix = path.includes('quote')
    ? 'QUO'
    : path.includes('calc')
    ? 'CALC'
    : 'ENQ';
  const reference = `${prefix}-${Date.now().toString(36).toUpperCase()}`;

  return NextResponse.json({
    ok: true,
    data: {
      reference,
      message: 'Thank you! Your request has been received.',
    },
  });
}

