import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './authStore';
import userReducer from './userStore';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store;
