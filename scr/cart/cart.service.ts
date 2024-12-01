import { Product } from '../product/product.entity.js';
import { Cart } from './cart.entity.js';
import { orm } from '../shared/db/orm.js';
import { BadRequestError } from '../shared/utils/errors.js';
import { Order } from '../order/order.entity.js';
import { updateOrders } from '../order/order.service.js';
const em = orm.em;
async function calculateTotal(cart: Cart): Promise<number> {
  let total: number = 0;
  for (const order of cart.orders) {
    total += order.subtotal;
  }
  return total;
}
async function cancelCart(cart: Cart): Promise<void> {
  try {
    const orders = Array.from(cart.orders);
    orders.map(async (order) => {
      const id =
        typeof order.product === 'string' ? order.product : order.product.id;
      const product = await em.findOneOrFail(Product, { id });
      const prod = { stock: product.stock + order.quantity };
      em.assign(product, prod);
      await em.flush();
      // return product;
    });
    const cartUpdated = { state: 'Canceled' as 'Canceled' };
    em.assign(cart, cartUpdated);
    await em.flush();
  } catch (error: any) {
    throw new Error();
  }
}

async function cancelPendingCart(cart: Cart): Promise<void> {
  try {
    if (!cart.isPending()) {
      throw new BadRequestError('The cart is not pending');
    }
    await em.nativeDelete(Order, { cart: cart.id });
    await em.nativeDelete(Cart, { id: cart.id });
    await em.flush();
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function completeCart(
  cart: Cart,
  cartToUpdate: Cart,
  user: string
): Promise<void> {
  try {
    const orders = Array.from(cartToUpdate.orders);
    await updateOrders(orders);
    let total: number = await calculateTotal(cartToUpdate);
    cart.total = total;
    cart.state = 'Completed';
    em.assign(cartToUpdate, { ...cart, user });
    await em.flush();
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export { calculateTotal, cancelCart, completeCart, cancelPendingCart };
