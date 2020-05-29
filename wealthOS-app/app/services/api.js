import axios from 'axios';

const api = axios.create({
  /**
   * Import the config from the App/Config/index.js file later
   */
  baseURL: 'http://localhost:5000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const authUser = async (email, password) => {
  console.log('Calling /auth/login with:', email, password);
  const result = await api.post('/auth/login', { email, password });
  return result.data;
};

const fetchUser = async (token) => {
  console.log('Calling /user with:', token);
  const result = await api.get('/user', { headers: { Authorization: 'Bearer ' + token } });
  return result.data;
};

const registerUser = async (firstName, lastName, email, password, password2) => {
  console.log('Posting to /auth with user credentials');
  const result = await api.post('/auth', { firstName, lastName, email, password, password2 });
  return result.response;
};

const checkEmailExists = async (email) => {
  console.log('Calling /auth/emailExists with:', email);
  const result = await api.post('/auth/emailExists', { email });
  return result.data.emailExists;
};

export default {
  authUser,
  fetchUser,
  registerUser,
  checkEmailExists,
};
