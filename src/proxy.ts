import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin/:path*', '/api/generate-description'],
};

export function proxy(request: NextRequest) {
  // Local development is intentionally unguarded so testing stays frictionless.
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const expected = process.env.ADMIN_PASSWORD;

  // Fail closed: if no password is configured, deny rather than allow.
  if (!expected) {
    return new NextResponse('Admin access is not configured', { status: 503 });
  }

  const header = request.headers.get('authorization');
  if (header?.startsWith('Basic ')) {
    const decoded = atob(header.slice(6));
    const password = decoded.slice(decoded.indexOf(':') + 1);
    if (password === expected) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Sweet Nothing admin"' },
  });
}
