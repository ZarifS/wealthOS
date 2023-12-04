// userStore.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {getUserData} from '../services/userService';

export interface User {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    spaces: [string];
}

interface UserState {
    user: User | null;
    loading: boolean;
    error: {status?: number, message: string} | null;
  }

// Define the initial state
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Create async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (token: string, thunkApi) => {
    try {
      const response = await getUserData(token);
      return response.data;
    } catch (error: any) {
      const message =
      (error.response && error.response.data && error.response.data.message) ||
        error.message || error.toString();
      console.log('Error trying to fetch user data:', message);
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state: UserState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state: UserState, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state: UserState, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = {message: action.payload};
      });
  },
});

export default userSlice.reducer;
