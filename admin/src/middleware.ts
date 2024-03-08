import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { useAuthStore } from './stores/authStore';

export function middleware(req: NextRequest) {
  const { user } = useAuthStore.getState();

  const requestPath = req.nextUrl.pathname;

  let exceptionalRoutes = [
    '',
    'login',
    'register',
    'forget-password',
    'password-reset',
  ];

  let isGoingExceptionalRoutes = exceptionalRoutes.includes(
    requestPath as string
  );

  if (req.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/auth/register', req.url));
  }

  if (!user) {
    if (isGoingExceptionalRoutes) true;
    else NextResponse.redirect('/');
  } else true;
}
