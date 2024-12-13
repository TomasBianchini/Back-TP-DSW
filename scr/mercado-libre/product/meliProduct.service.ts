import { MeliProduct } from './meliProduct.entity.js';

import { MeliAccount } from '../account/meliAccount.entity.js';

import axios from 'axios';

const endpoint_base = process.env.MELI_API_URL;

async function getOne(meliAccount: MeliAccount, id: string) {
  const response = await axios.get(`${endpoint_base}/items/${id}`, {
    headers: {
      Authorization: `Bearer ${meliAccount.accessToken}`,
    },
  });
  console.log(response);
  return response.data;
}

async function getStock(resource: string, meliAccount: MeliAccount) {
  const response = await axios.get(`${endpoint_base}${resource}`, {
    headers: {
      Authorization: `Bearer ${meliAccount.accessToken}`,
    },
  });
  return response.data;
}

export const meliProductService = {
  getOne,
  getStock,
};
