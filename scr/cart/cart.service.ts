import { Product } from '../product/product.entity.js';
import { Cart } from './cart.entity';
import { orm } from '../shared/db/orm';
import { BadRequestError } from '../shared/constants/errors.js';
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
async function cancelCart(
  cart: Cart,
  updatedCart: Cart,
  user: string
): Promise<void> {
  try {
    const orders = Array.from(cart.orders);
    const productsToUpdate = orders.map(async (order) => {
      const productId =
        typeof order.product === 'string' ? order.product : order.product.id;
      const product = await em.findOneOrFail(Product, { id: productId });
      product.stock += order.quantity;
      return product;
    });
    await Promise.all(productsToUpdate);
    updatedCart.state = 'Canceled';
    em.assign(updatedCart, { ...cart, user });
    await em.flush();
  } catch (error: any) {
    throw new Error(error.message);
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
    const orders = Array.from(cart.orders);
    await updateOrders(orders);
    let total: number = await calculateTotal(cartToUpdate);
    cartToUpdate.total = total;
    cartToUpdate.state = 'Completed';
    em.assign(cartToUpdate, { ...cartToUpdate, user });
    await em.flush();
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export { calculateTotal, cancelCart, completeCart, cancelPendingCart };
