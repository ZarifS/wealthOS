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

const createSpace = async (token: string, data: any) => {
  return axios.post(API_URL + '/spaces', data, {
    headers: {
      Authorization: token,
    },
  });
}

export default {
  getUserData,
};
