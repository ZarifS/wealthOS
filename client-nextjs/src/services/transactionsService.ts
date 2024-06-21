import axios from 'axios';
import { getAPIServerURL } from '../utils';

const API_URL = getAPIServerURL() + '/transactions';

const createTransaction = async (token: string, data: any) => {
    return axios.post(API_URL, data, {
      headers: {
        Authorization: token,
      },
    });
}

const getTransactions = async (token: string, spaceId:string, filters: any) => {
    return axios.get(API_URL, {
      headers: {
        Authorization: token,
      },
      params: {...filters, spaceId},
    });
}

export default {
    createTransaction,
    getTransactions,
};