import { MeliNotification } from './meliNotification.entity.js';
import { orm } from '../../shared/db/orm.js';

const em = orm.em;

async function processStockNotification(notification: MeliNotification) {
  console.log('Processing stock notification');
  console.log(notification);
}

export { processStockNotification };
