import { MeliNotification } from './meliNotification.entity.js';
import { orm } from '../../shared/db/orm.js';

const em = orm.em;

async function processItemNotification(notification: MeliNotification) {}

export { processItemNotification };
