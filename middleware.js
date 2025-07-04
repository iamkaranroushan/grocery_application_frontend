import { NextResponse } from 'next/server';

const protectedRoutes = {
  admin: ['/admin', '/admin/edit', '/admin/dashboard'],
  customer: ['/user', '/cart', '/orders', '/checkout'],
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  let role = null;

  try {
    const res = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (res.ok) {
      const data = await res.json();
      role = data.role;
      console.log('[Middleware] Role:', role);
    } else {
      console.log('[Middleware] No Role available.', res.status);
    }
  } catch (err) {
    console.error('[Middleware] Fetch error:', err);
  }

  if (!role) {
    return NextResponse.next();
  }

  if (
    role === 'admin' &&
    protectedRoutes.customer.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (
    role === 'customer' &&
    protectedRoutes.admin.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user',
    '/cart',
    '/orders',
    '/checkout',
  ],
}