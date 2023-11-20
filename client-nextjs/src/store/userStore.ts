// userStore.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
    error: unknown;
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
      console.log('Error trying to fetch user data:', error);
      return thunkApi.rejectWithValue(error.response.data);
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
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
