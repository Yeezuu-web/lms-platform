// import { toast } from '@/components/ui/use-toast';
// import { withStorageDOMEvents } from '@/hooks/with-storage-dom-event';
// import { loginUser } from '@/servers/user-actions';
// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';
// import { immer } from 'zustand/middleware/immer';

// export type IUser = {
//   _id: string;
//   username: string;
//   email: string;
//   role: string;
//   isVerified: boolean;
//   courses: [];
// };

// type LoginCredentails = {
//   email: string;
//   password: string;
// };

// export type AuthStateType = {
//   isAuthenticated: boolean;
//   user?: IUser | null;
//   accessToken?: string;
// };

// export type AuthActionType = {
//   login: (credentials: LoginCredentails) => void;
// };

// export type AuthStore = AuthStateType & AuthActionType;

// export const defaultState: AuthStateType = {
//   isAuthenticated: false,
//   user: null,
//   accessToken: '',
// };

// export const useAuthStore = create<AuthStore>()(
//   persist(
//     immer((set) => ({
//       ...defaultState,

//       login: async (credentails: LoginCredentails) => {
//         try {
//           const result = await loginUser(credentails);
//           set((state) => {
//             state.user = result.user as IUser;
//             state.isAuthenticated = true;
//             state.accessToken = result.accessToken as string;
//           });
//         } catch (e: any) {
//           toast(e.message);
//           console.log(e);
//         }
//       },
//     })),
//     {
//       name: 'auth-user',
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );

// withStorageDOMEvents(useAuthStore);
