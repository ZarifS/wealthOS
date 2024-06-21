import axios from 'axios';
import { getAPIServerURL } from '../utils';

const API_URL = getAPIServerURL() + '/spaces';

const createSpace = async (token: string, data: any) => {
    return axios.post(API_URL, data, {
      headers: {
        Authorization: token,
      },
    });
}

const getSpaceById = async (token: string, spaceId: string) => {
    return axios.get(`${API_URL}/${spaceId}`, {
      headers: {
        Authorization: token,
      },
    });
}

export default {
    createSpace,
    getSpaceById,
};