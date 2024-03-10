import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getAuth } from './servers/user-actions';

export async function middleware(req: NextRequest) {
  //   const user = await getAuth(req);

  const requestPath = req.nextUrl.pathname;

  //   let exceptionalRoutes = [
  //     '/',
  //     '/auth/login',
  //     '/auth/register',
  //     '/auth/forget-password',
  //     '/auth/password-reset',
  //   ];

  //   let isGoingExceptionalRoutes = exceptionalRoutes.includes(requestPath);

  if (requestPath === '/') {
    return NextResponse.rewrite(new URL('/auth/register', req.url));
  }

  //   if (!user && isGoingExceptionalRoutes) {
  //     return NextResponse.redirect(new URL('/auth/login', req.url));
  //   } else if (user && isGoingExceptionalRoutes) {
  //     return NextResponse.redirect(new URL('/dashboard', req.url));
  //   }

  //   return NextResponse.next();
}

// export const config = {
//   mathcher: ['/auth/:path*', '/dashboard/:path*'],
// };
