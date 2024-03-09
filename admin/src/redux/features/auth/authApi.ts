import { apiSlice } from '../api/apiSlice';
import { useRegistration } from './authSlice';

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
  }),
});

export const { useRegisterMutation, useActivationMutation } = authApi;
