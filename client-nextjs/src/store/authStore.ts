import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import AuthService, { RegisterPayload, LoginPayload } from "../services/authService";

let user;

if (typeof window !== 'undefined') {
  user = JSON.parse(localStorage.getItem("user") as string) || null;
}

export const register = createAsyncThunk(
  "auth/register",
  async ({ firstName, lastName, email, password, confirmedPassword }: RegisterPayload, thunkAPI) => {
    try {
      const response = await AuthService.register({ firstName, lastName, email, password, confirmedPassword });
      return response.data;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginPayload, thunkAPI) => {
    try {
      const data = await AuthService.login({ email, password });
      return { user: data };
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  return AuthService.logout();
});

interface AuthState {
  isLoggedIn: boolean,
  loading: boolean,
  user: any,
  message: string | null
}

const initialState: AuthState = user
  ? { isLoggedIn: true, user, loading: false, message: null }
  : { isLoggedIn: false, user: null, loading: false, message: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    "logout": (state) => {
      AuthService.logout();
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state: AuthState) => {
      state.loading = true;
      state.message = null;
      state.isLoggedIn = false;
      state.user = null;
    })
    builder.addCase(register.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user
      state.loading = false;
    })
    builder.addCase(register.rejected, (state: AuthState, action: PayloadAction<any>) => {
      state.loading = false;
      state.message = action.payload;
    })
    builder.addCase(login.pending, (state: AuthState) => {
      state.loading = true;
      state.message = null;
      state.user = null;
      state.isLoggedIn = false;
    })
    builder.addCase(login.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.loading = false;
    })
    builder.addCase(login.rejected, (state: AuthState, action: PayloadAction<any>) => {
      state.loading = false;
      state.message = action.payload
    })
  }
});

const { reducer } = authSlice;
export default reducer;