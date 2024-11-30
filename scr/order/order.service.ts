import { Order } from './order.entity.js';
import { Product } from '../product/product.entity.js';
import { validateOrder } from './order.schema.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function updateOrders(orders: Order[]) {
  const promises = orders.map(async (order) => {
    const validationResult = validateOrder(order);
    const orderToUpdate = await em.findOneOrFail(Order, { id: order.id });
    em.assign(orderToUpdate, order);

    const product = await em.findOneOrFail(Product, {
      id: validationResult.data.product,
      state: 'Active',
    });
    if (!product.isAvailable(order.quantity)) {
      throw new Error('Product not available');
    }

    product.stock -= order.quantity;
    await em.persistAndFlush([orderToUpdate, product]);
  });

  try {
    await Promise.all(promises);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export { updateOrders };
