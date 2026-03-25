import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  console.log("TOKEN FROM MIDDLEWARE", token);
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jose.jwtVerify(token, secret);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Middleware JWT verification error:", error);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token'); // Clear invalid token
    return response;
  }
}

export const config = {
  matcher: ['/profile', '/profile/edit'],
};
