import { JWT } from '@auth/core/jwt';
import { type DefaultSession } from 'next-auth';

declare module '@auth/core/types' {
  interface Session {
    user: {
      username: string;
      email: string;
      role: 'user' | 'admin';
      isVerified: boolean;
      courses: [];
      _id: string;
      accessToken: string;
    } & DefaultSession['user'];
  }

  interface User {
    user: {
      username: string;
      email: string;
      role: 'user' | 'admin';
      isVerified: boolean;
      courses: [];
      _id: string;
    };
    accessToken: string;
  }

  interface Token {
    user: {
      username: string;
      email: string;
      role: 'user' | 'admin';
      isVerified: boolean;
      _id: string;
      accessToken: string;
    } & DefaultSession['token'];
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    sub: string;
    user: {
      username: string;
      email: string;
      role: 'user' | 'admin';
      isVerified: boolean;
      courses: [];
      _id: string;
    };
    accessToken: string;
  }
}
