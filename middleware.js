import { NextResponse } from 'next/server'

const protectedRoutes = {
    admin: ['/admin', '/admin/edit', '/admin/dashboard'],
    customer: ['/user', '/cart', '/orders', '/checkout', '/categories'],
}

export function middleware(request) {
    const { pathname } = request.nextUrl
    const roleCookie = request.cookies.get('role')
    const role = roleCookie?.value

    if (!role) {
        return NextResponse.next()
    }

    // 🔐 Admins can't access customer routes
    if (
        role === 'admin' &&
        protectedRoutes.customer.some(route => pathname.startsWith(route))
    ) {
        return NextResponse.redirect(new URL('/', request.url)) // redirect to homepage
    }

    // 🔐 Customers can't access admin routes
    if (
        role === 'customer' &&
        protectedRoutes.admin.some(route => pathname.startsWith(route))
    ) {
        return NextResponse.redirect(new URL('/', request.url)) // redirect to homepage
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/user',
        '/cart',
        '/orders',
        '/checkout',
        '/categories/:path*',
        
    ],
}
