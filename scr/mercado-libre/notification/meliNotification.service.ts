import { MeliNotification } from './meliNotification.entity.js';
import { orm } from '../../shared/db/orm.js';
import { MeliAccount } from '../account/meliAccount.entity.js';
import { getStock } from '../product/meliProduct.service.js';
import axios from 'axios';

const em = orm.em;

const endpoint_base = process.env.MELI_API_URL;

async function processStockNotification(notification: MeliNotification) {
  const userId = notification.userId;
  const meliAccount = await em.findOneOrFail(MeliAccount, { userId: userId });
  meliAccount.decryptToken();
  getStock(notification.resource, meliAccount);
}

export { processStockNotification };
