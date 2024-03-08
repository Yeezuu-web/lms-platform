import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    useRegistration: (state, action) => {
      state.token = action.payload;
    },
    useLoggedIn: (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    useLoggedOut: (state) => {
      state.token = '';
      state.user = null;
    },
  },
});

export const { useRegistration, useLoggedIn, useLoggedOut } = authSlice.actions;
