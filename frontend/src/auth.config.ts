// import type { NextAuthConfig } from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';

// import { LoginSchema } from '@/schemas/login';

// export default {
//   providers: [
//     Credentials({
//       async authorize(value) {
//         const validatedFields = LoginSchema.safeParse(value);

//         if (!validatedFields.success) {
//           return null;
//         }

//         const response = await fetch('http://localhost:8000/api/v1/login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(validatedFields.data),
//           credentials: 'include' as const,
//         });

//         if (!response.ok) return null;

//         const data = await response.json();

//         if (!data?.user) return null;

//         if (data?.user) return data;

//         return null;
//       },
//     }),
//   ],
// } satisfies NextAuthConfig;
