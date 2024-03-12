// import NextAuth from 'next-auth';
// import Credentails from 'next-auth/providers/credentials';
// import { LoginSchema } from './schemas/login';
// import authConfig from './auth.config';

// export const {
//   handlers: { GET, POST },
//   signIn,
//   auth,
//   signOut,
// } = NextAuth({
//   pages: {
//     signIn: '/auth/login',
//     error: '/auth/error',
//   },
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider === 'credentails') return true;
//       return true;
//     },
//     async session({ token, session }) {
//       console.log(token);
//       //   if (token.sub && session.user) {
//       //     session.user._id = token.sub;
//       //   }

//       //   if (token.role && session.user) {
//       //     session.user.role = token.user.role;
//       //   }

//       //   if (session.user) {
//       //     session.user.name = token.user.username;
//       //     session.user.email = token.user.email;
//       //     session.user.isVerified = token.user.isVerified;
//       //     session.user.accessToken = token.accessToken;
//       //   }

//       return session;
//     },
//     async jwt({ token, user }) {
//       if (!token.sub) return token;

//       token.name = user.user.username;
//       token.email = user.user.email;
//       token.user = user.user;
//       token.sub = user.user._id;
//       token.accessToken = user.accessToken;

//       return token;
//     },
//   },
//   session: { strategy: 'jwt' },
//   ...authConfig,
// });
