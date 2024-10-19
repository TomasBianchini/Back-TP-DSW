import { Order } from '../entities/order.entity.js';
import { Product } from '../../product/product.entity.js';
import { validateOrder } from '../schemas/order.schema.js';
import { orm } from '../../shared/db/orm.js';

const em = orm.em;

async function updateOrders(orders: Order[]) {
  try {
    return Promise.all(
      orders.map(async (order: Order) => {
        const validationResult = validateOrder(order);
        if (!validationResult.success) {
          throw new Error(validationResult.error.message);
        }
        const orderToUpdate = await em.findOneOrFail(Order, { id: order.id });
        em.assign(orderToUpdate, order);
        await em.flush();
        const id: string = validationResult.data.product;
        let productToUpdate = await em.findOneOrFail(Product, {
          id,
          state: 'Active',
        });
        if (productToUpdate.stock < order.quantity) {
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
