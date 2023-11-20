import axios from 'axios';
import { getAPIServerURL } from '../utils';

const API_URL = getAPIServerURL() + '/user';

const getUserData = async (token: string) => {
  return axios.get(API_URL, {
    headers: {
      Authorization: token,
    },
  });
};

export {
  getUserData,
};
