import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import AuthService, {RegisterPayload, LoginPayload} from "../services/authService";

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
      const data = await AuthService.login({email, password});
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
  user: any
}

const initialState: AuthState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    "logout": (state) => {
      AuthService.logout();
      state.isLoggedIn = false;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(register.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user
    })
    builder.addCase(register.rejected, (state: AuthState) => {
      state.isLoggedIn = false;
    })
    builder.addCase(login.fulfilled, (state: AuthState, action:PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    })
    builder.addCase(login.rejected, (state: AuthState) => {
      state.isLoggedIn = false;
      state.user = null;
    })
  }
});

const { reducer } = authSlice;
export default reducer;