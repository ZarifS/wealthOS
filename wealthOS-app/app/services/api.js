import axios from 'axios';

const api = axios.create({
  /**
   * Import the config from the App/Config/index.js file later
   */
  baseURL: 'https://wealthx-api.zshahriar.now.sh',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const fetchUser = async (email, password) => {
  console.log('Calling /auth/login with:', email, password);
  try {
    const result = await api.post('/auth/login', { email, password });
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default {
  fetchUser,
};
