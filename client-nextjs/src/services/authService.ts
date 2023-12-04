import axios from 'axios';
import { getAPIServerURL } from '../utils';
const API_URL = getAPIServerURL() + '/auth';

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
  return response.data;
};

const service = {
  register,
  login,
};

export default service;
