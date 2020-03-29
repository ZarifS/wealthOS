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

export default {
  authUser,
  fetchUser,
};
