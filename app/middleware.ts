import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function authHandler(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api/login')) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('X-IAK');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized: No token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};