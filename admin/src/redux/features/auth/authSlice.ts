import { IUser } from '@/servers/user-actions';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  token: string | null;
  user: IUser | null;
}

const initialState: AuthState = {
  token: '' || null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    useRegistration: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    useLoggedIn: (state, action) => {
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
