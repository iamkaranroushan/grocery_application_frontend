import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const protectedRoutes = {
    admin: ['/admin', '/admin/edit', '/admin/dashboard'],
    customer: ['/user', '/cart', '/orders', '/checkout'],
}


// Get secret key as a Uint8Array
const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('Missing JWT_SECRET env variable')
    return new TextEncoder().encode(secret)
}

export async function middleware(request) {
    const { pathname } = request.nextUrl
    const jwtToken = request.cookies.get('jwtToken')?.value
    console.log(jwtToken)
    if (!jwtToken) {
        console.log('[Middleware] No jwtToken found')
        return NextResponse.next()
    }

    try {
        const { payload } = await jwtVerify(jwtToken, getJwtSecretKey())
        const role = payload.role
        console.log('[Middleware] Role from token:', role)

        if (
            role === 'admin' &&
            protectedRoutes.customer.some(route => pathname.startsWith(route))
        ) {
            console.log("going to :", request.url , "not allowed as you are a", role)
            return NextResponse.redirect(new URL('/', request.url))
        }

        if (
            role === 'customer' &&
            protectedRoutes.admin.some(route => pathname.startsWith(route))
        ) {
            console.log("going to :", request.url, "not allowed as you are a", role)
            return NextResponse.redirect(new URL('/', request.url))
        }
    } catch (err) {
        console.error('[Middleware] JWT verification failed, returning to homepage.', err.message)
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
    ],
}
