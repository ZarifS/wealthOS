import axios from 'axios';
import { setLocalStorageWithExpiry, getAPIServerURL, getTokenExpiry } from '../utils';
const API_URL = getAPIServerURL() + '/auth';

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
  const response = await axios.post(API_URL + '/signUp', {
    firstName,
    lastName,
    email,
    password,
    password2: confirmedPassword,
  });
  return response.data;
};

const login = async ({ email, password }: LoginPayload) => {
  const response = await axios.post(API_URL + '/signIn', {
    email,
    password,
  });
  if (response.data.token) {
    const tokenTTL = getTokenExpiry(response.data.token) - Date.now();
    setLocalStorageWithExpiry(TOKEN_KEY, response.data.token, tokenTTL);
  }
  return response.data;
};

const service = {
  register,
  login,
  logout,
};

export default service;
