import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { useAuthStore } from './stores/_authStore';

export function middleware(req: NextRequest) {
  //   const { isAuthenticated } = useAuthStore.getState();
  const requestPath = req.nextUrl.pathname;

  //   let exceptionalRoutes = [
  //     '/',
  //     'auth/login',
  //     'auth/register',
  //     'auth/forget-password',
  //     'auth/password-reset',
  //   ];

  //   let isGoingExceptionalRoutes = exceptionalRoutes.includes(
  //     requestPath as string
  //   );

  //   console.log(isAuthenticated);

  if (requestPath === '/') {
    return NextResponse.rewrite(new URL('/auth/register', req.url));
  }

  //   if (!isAuthenticated && isGoingExceptionalRoutes) {
  //     return NextResponse.redirect('/auth/login');
  //   } else {
  //     return NextResponse.next();
  //   }
}

// export const config = {
//   matcher: ['/', '/dashboard/*'],
// };
