import { Order } from './order.entity.js';
import { Product } from '../product/product.entity.js';
import { validateOrder } from './order.schema.js';
import { orm } from '../shared/db/orm.js';
import { checkProductAvailability } from '../product/product.service.js';

const em = orm.em;

async function updateOrders(orders: Order[]) {
  try {
    return Promise.all(
      orders.map(async (order: Order) => {
        const validationResult = validateOrder(order);
        const orderToUpdate = await em.findOneOrFail(Order, { id: order.id });
        em.assign(orderToUpdate, order);
        await em.flush();
        const id: string = validationResult.data.product;
        let productToUpdate = await em.findOneOrFail(Product, {
          id,
          state: 'Active',
        });
        if (!checkProductAvailability(productToUpdate, order.quantity)) {
          throw new Error('Product not available');
        }
        productToUpdate.stock -= order.quantity;
        await em.persistAndFlush(productToUpdate);
      })
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export { updateOrders };
