import { NextRequest, NextResponse } from 'next/server';
import { getMe } from '@/actions/servers/get-me';
import { getAccessTokenFromRefreshToken } from '@/actions/refresh-token';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!accessToken) {
      const response = NextResponse.redirect(
        new URL('/auth/login', request.url)
      );
      response.cookies.delete('refresh_token');

      return response;
    }

    const data = await getMe(accessToken);

    if (data.success === false) {
      const refreshToken = request.cookies.get('refresh_token');

      if (!refreshToken) {
        const response = NextResponse.redirect(
          new URL('/auth/login', request.url)
        );
        response.cookies.delete('refresh_token');

        return response;
      }

      const tokenData = await getAccessTokenFromRefreshToken(refreshToken);

      if (tokenData.success === false) {
        const response = NextResponse.redirect(
          new URL('/auth/login', request.url)
        );
        response.cookies.delete('refresh_token');

        return response;
      }

      const response = NextResponse.next();
      response.cookies.delete('access_token');

      response.cookies.set('access_token', tokenData.accessToken, {
        httpOnly: true,
        maxAge: 60,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;
    } else return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/auth')) {
    const accessToken = request.cookies.get('access_token');

    if (accessToken) {
      const data = await getMe(accessToken);

      if (data.user) {
        const response = NextResponse.redirect(
          new URL('/dashboard/home', request.url)
        );
        return response;
      }
      if (data.success === false) {
        const refreshToken = request.cookies.get('refresh_token');

        if (!refreshToken) {
          const response = NextResponse.next();
          response.cookies.delete('access_token');
          response.cookies.delete('refresh_token');
          return response;
        }

        const tokenData = await getAccessTokenFromRefreshToken(refreshToken);

        if (tokenData.success === false) {
          const response = NextResponse.next();
          response.cookies.delete('access_token');
          response.cookies.delete('refresh_token');

          return response;
        }

        const response = NextResponse.redirect(
          new URL('/dashboard/home', request.url)
        );
        response.cookies.delete('access_token');

        response.cookies.set('access_token', tokenData.accessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        return response;
      } else
        return NextResponse.redirect(new URL('/dashboard/home', request.url));
    }

    const response = NextResponse.next();
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');

    return response;
  }
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
