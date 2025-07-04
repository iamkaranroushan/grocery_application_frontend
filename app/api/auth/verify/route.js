// app/api/auth/verify/route.js

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('Missing JWT_SECRET');
    return new TextEncoder().encode(secret);
};

export async function GET() {
    const cookieStore = await cookies(); // ✅ this is now awaited internally
    const jwt = cookieStore.get('jwtToken')?.value;

    if (!jwt) {
        return NextResponse.json({ role: null }, { status: 401 });
    }

    // continue with JWT verification...
    try {
        const { payload } = await jwtVerify(jwt, getJwtSecretKey());
        return NextResponse.json({ role: payload.role });
    } catch (err) {
        console.error('JWT verification failed:', err);
        return NextResponse.json({ role: null }, { status: 403 });
    }
}
