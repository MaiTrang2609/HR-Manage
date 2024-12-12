import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: false,
  },
  reducers: {
    LoginStart: (state) => {
      return { ...state, loading: true };
    },
    LoginSuccess: (state) => {
      return { ...state, error: false, loading: false };
    },
    LoginFailed: (state) => {
      return { ...state, error: true, loading: false };
    },
    LogOutStart: (state) => {
      return { ...state, loading: true };
    },
    LogOutSuccess: (state) => {
      return { ...state, error: false, loading: false, user: null };
    },
    LogOutFailed: (state) => {
      return { ...state, error: true, loading: false };
    },
    GetMeStart: (state) => {
      return { ...state, loading: true };
    },
    GetMeSuccess: (state, action) => {
      return { ...state, error: false, loading: false, user: action.payload };
    },
    GetMeError: (state) => {
      return { ...state, error: true, loading: false };
    },
  },
});

export const {
  LoginStart,
  LoginFailed,
  LoginSuccess,
  LogOutStart,
  LogOutSuccess,
  LogOutFailed,
  GetMeStart,
  GetMeError,
  GetMeSuccess,
} = authSlice.actions;

export default authSlice.reducer;
