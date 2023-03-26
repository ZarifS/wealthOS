import reducer, { register, logout } from '../../store/authStore';
import { configureStore } from '@reduxjs/toolkit';
import AuthService from '../../services/authService';

// Mock the AuthService
jest.mock('../../services/authService', () => {
  return {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    authHeader: jest.fn(),
  };
});

// Create a mock store
const store = configureStore({
  reducer: {
    auth: reducer,
  },
});

describe('authStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
    store.dispatch(logout());
  });

  it('should handle successful registration', async () => {
    (AuthService.register as jest.Mock).mockResolvedValueOnce({
      data: { token: 'test-token' },
    });

    await store.dispatch(
      register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password',
        confirmedPassword: 'password',
      })
    );

    const { auth } = store.getState();
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.token).toEqual('test-token');
    expect(auth.message).toBe(null);
  });

  // Add similar tests for the other actions (login and logout)
});
