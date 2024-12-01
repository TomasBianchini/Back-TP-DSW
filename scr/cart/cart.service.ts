import { Product } from '../product/product.entity.js';
import { Cart } from './cart.entity.js';
import { orm } from '../shared/db/orm.js';
import { BadRequestError } from '../shared/constants/errors.js';
import { Order } from '../order/order.entity.js';
import { ErrorDescription } from 'mongodb';
import { updateOrders } from '../order/order.service.js';
import { Category } from '../category/category.entity.js';
import { Seller } from '../users/seller.entity.js';
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
    const productsToUpdate = orders.map(async (order) => {
      const id =
        typeof order.product === 'string' ? order.product : order.product.id;
      const product = await em.findOneOrFail(Product, { id });
      product.stock += order.quantity;
      em.persistAndFlush(product);

      // Asigna las referencias y luego realiza el flush
      return product;
    });
    const products = await Promise.all(productsToUpdate);
    cart.state = 'Canceled';
    em.assign(cart, cart);
    await em.flush();
  } catch (error: ErrorDescription | any) {
    console.log(error);
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
