import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockLocalStorage } from '../testUtils';
import authService, { RegisterPayload, LoginPayload, TOKEN_KEY } from '../../services/authService';
import { getLocalStorageWithExpiry, getAPIServerURL } from '../../util';

const axiosMock = new MockAdapter(axios);

describe('authService', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage(),
    });
  });
  afterEach(() => {
    axiosMock.reset();
  });

  it('registers a user successfully', async () => {
    const payload: RegisterPayload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmedPassword: 'password123',
    };

    const mockToken = 'fake-token';

    axiosMock.onPost(getAPIServerURL + '/auth/signUp').reply(201, {
      token: mockToken,
    });

    const response = await authService.register(payload);

    expect(response).toEqual({ token: mockToken });
  });

  it('logs in a user successfully', async () => {
    const payload: LoginPayload = {
      email: 'john@example.com',
      password: 'password123',
    };

    const mockToken = 'fake-token';

    axiosMock.onPost(getAPIServerURL + '/auth/signIn').reply(200, {
      token: mockToken,
    });

    const response = await authService.login(payload);

    expect(response).toEqual({ token: mockToken });
    expect(getLocalStorageWithExpiry(TOKEN_KEY)).toEqual(mockToken);
  });

  test('logs out a user', () => {
    localStorage.setItem(TOKEN_KEY, 'fake-token');
    authService.logout();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});
