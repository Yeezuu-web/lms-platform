import { IUser } from '@/actions/get-user';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  token: string | null;
  user: IUser | null;
}

interface LoginPayload {
  accessToken: string;
  user: IUser;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice: any = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    useRegistration: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    useLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: IUser }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    useLoggedOut: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { useRegistration, useLoggedIn, useLoggedOut } = authSlice.actions;
export default authSlice.reducer;
