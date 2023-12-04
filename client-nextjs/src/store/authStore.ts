import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorageWithExpiry, getTokenExpiry, setLocalStorageWithExpiry, TOKEN_KEY } from 'utils';
import AuthService, { RegisterPayload, LoginPayload } from '../services/authService';

let token;

if (typeof window !== 'undefined') {
  token = getLocalStorageWithExpiry(TOKEN_KEY);
}

interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  token: string | null;
  error: {status?: number, message: string} | null;
}

const initialState: AuthState = token
  ? { isLoggedIn: true, token, loading: false, error: null }
  : { isLoggedIn: false, token: null, loading: false, error: null };

export const register = createAsyncThunk(
  'auth/register',
  async (
    { firstName, lastName, email, password, confirmedPassword }: RegisterPayload,
    thunkAPI
  ) => {
    try {
      const { token } = await AuthService.register({
        firstName,
        lastName,
        email,
        password,
        confirmedPassword,
      });
      if (!token) {
        throw new Error('No token received');
      }
      const tokenTTL = getTokenExpiry(token) - Date.now();
      setLocalStorageWithExpiry(TOKEN_KEY, token, tokenTTL);
      return { token };
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginPayload, thunkAPI) => {
    try {
      const { token } = await AuthService.login({ email, password });
      if (!token) {
        throw new Error('No token received');
      }
      const tokenTTL = getTokenExpiry(token) - Date.now();
      setLocalStorageWithExpiry(TOKEN_KEY, token, tokenTTL);
      return { token };
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state: AuthState) => {
      state.loading = true;
      state.error = null;
      state.isLoggedIn = false;
      state.token = null;
    });
    builder.addCase(register.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.loading = false;
    });
    builder.addCase(register.rejected, (state: AuthState, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = {message: action.payload};
    });
    builder.addCase(login.pending, (state: AuthState) => {
      state.loading = true;
      state.error = null;
      state.token = null;
      state.isLoggedIn = false;
    });
    builder.addCase(login.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.loading = false;
    });
    builder.addCase(login.rejected, (state: AuthState, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = {message: action.payload};
    });
  },
});

const { reducer } = authSlice;
export default reducer;
