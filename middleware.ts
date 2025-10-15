import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const tokenCheck = request.cookies.get('token')?.value;

  // if (!tokenCheck) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // } else {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }
}

export const config = {
  matcher: [
    '/((?!_next|static|public|img|favicon.ico).*)',
    '/api/((?!auth).*)',
  ],
};
