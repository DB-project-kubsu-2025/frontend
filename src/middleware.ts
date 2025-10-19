import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/utils/checkAuth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath =
    pathname === '/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/api');

  const isApiRoute =
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth');

  if (isPublicPath) {
    return NextResponse.next();
  }

  const tokenCheck = await verifyToken(request);
  if (tokenCheck.error || !tokenCheck.valid) {
    if (isApiRoute) {
      return NextResponse.json(
        { message: 'Неавторизованный доступ' },
        { status: 401 },
      );
    } else {
      const loginUrl = new URL('/login', request.url);
      if (pathname !== '/login') {
        return NextResponse.redirect(loginUrl);
      }
    }
  }
  if (tokenCheck.valid && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|static|public|img|favicon.ico).*)',
    '/api/((?!auth).*)',
  ],
};
