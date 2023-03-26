import axios from 'axios';
import { setLocalStorageWithExpiry, getAPIServerURL } from '../util';
const API_URL = getAPIServerURL + '/auth';

const TOKEN_EXPIRY = 15 * 1000; // in milliseconds
export const TOKEN_KEY = 'WEALTHOS-USER-TOKEN';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmedPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

const register = async ({
  firstName,
  lastName,
  email,
  password,
  confirmedPassword,
}: RegisterPayload) => {
  return axios.post(API_URL + '/signUp', {
    firstName,
    lastName,
    email,
    password,
    password2: confirmedPassword,
  });
};

const login = async ({ email, password }: LoginPayload) => {
  const response = await axios.post(API_URL + '/signIn', {
    email,
    password,
  });
  if (response.data.token) {
    setLocalStorageWithExpiry(TOKEN_KEY, response.data.token, TOKEN_EXPIRY);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const service = {
  register,
  login,
  logout,
};

export default service;
