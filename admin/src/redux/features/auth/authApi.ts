import { apiSlice } from '../api/apiSlice';
import { useLoggedIn, useRegistration } from './authSlice';

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationCredentails = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoint here
    register: builder.mutation<RegistrationResponse, RegistrationCredentails>({
      query: (data) => ({
        url: 'register',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useRegistration(result.data?.activationToken)
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activationToken, activationCode }) => ({
        url: 'activate-user',
        method: 'POST',
        body: {
          activationToken,
          activationCode,
        },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          //   console.log(error);
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation } =
  authApi;
