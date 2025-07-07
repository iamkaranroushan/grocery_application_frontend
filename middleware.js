import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // you'll use `jose` to verify JWT

const protectedRoutes = {
  admin: ['/admin', '/admin/edit', '/admin/dashboard'],
  customer: ['/user', '/cart', '/orders', '/checkout'],
};

// Replace this with your actual secret used to sign the JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET); // store in .env

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  let role = null;
  console.log(request);

  const token = request.cookies.get('jwtToken')?.value;
  console.log('[Middleware] jwtToken:', token);

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      role = payload.role;
      console.log('[Middleware] Decoded Role:', role);
    } catch (err) {
      console.error('[Middleware] Invalid token:', err);
    }
  }

  if (!role) {
    return NextResponse.redirect(new URL('/', request.url));
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
};
