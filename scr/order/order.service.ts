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
    let productId =
      typeof order.product === 'string'
        ? validationResult.data.product
        : typeof validationResult.data.product === 'string'
        ? validationResult.data.product
        : validationResult.data.product.id;
    const product = await em.findOneOrFail(Product, {
      id: typeof productId === 'string' ? productId : productId.id,
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
