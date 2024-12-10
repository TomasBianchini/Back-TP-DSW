import { MeliNotification } from './meliNotification.entity.js';
import { orm } from '../../shared/db/orm.js';
import { MeliAccount } from '../account/meliAccount.entity.js';
import { Filter } from 'mongodb';
import { FilterQuery } from '@mikro-orm/core';
import axios from 'axios';

const em = orm.em;

const endpoint_base = process.env.MELI_API_URL;

async function processStockNotification(notification: MeliNotification) {
  const userId = notification.userId;
  const meliAccount = await em.findOneOrFail(MeliAccount, { userId: userId });
  meliAccount.decryptToken();
  getItemStock(notification.resource, meliAccount);
}

async function getItemStock(resource: string, meliAccount: MeliAccount) {
  const response = await axios.get(`${endpoint_base}${resource}`, {
    headers: {
      Authorization: `Bearer ${meliAccount.accessToken}`,
    },
  });
  console.log(response.data);
}

export { processStockNotification };
