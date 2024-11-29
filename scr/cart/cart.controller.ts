import { orm } from '../shared/db/orm.js';
import { Response, Request, NextFunction } from 'express';
import { Cart } from './cart.entity.js';
import { CartFilter } from './cart.filter.js';
import { Product } from '../product/product.entity.js';
import { updateOrders } from '../order/order.service.js';
import { validateCart } from './cart.schema.js';
import { Order } from '../order/order.entity.js';
import { calculateTotal } from './cart.service.js';
const em = orm.em;

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const user = res.locals.user;
    const filter: CartFilter = { user, ...req.query };
    const carts = await em.find(Cart, filter, {
      populate: [
        'orders',
        'user',
        'orders.product',
        'orders.product.category',
        'payment_type',
        'shipping',
      ],
    });

    res.status(200).json({ message: 'Found all carts', data: carts });
  } catch (err: any) {
    next(err);
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const user = res.locals.user;
    const cart = await em.findOne(
      Cart,
      { id, user },
      {
        populate: [
          'orders',
          'user',
          'orders.product',
          'orders.product.category',
          'payment_type',
          'shipping',
        ],
      }
    );
    res.status(200).json({ message: 'Found cart', data: cart });
  } catch (err: any) {
    next(err);
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const user = res.locals.user;
    const existingCart = await em.findOne(Cart, { user, state: 'Pending' });
    if (existingCart) {
      return res.status(400).json({ message: 'There is a cart pending' });
    }
    const cartToCreate: Cart = { ...req.body, user, state: 'Pending' };
    validateCart(cartToCreate);
    const cart = em.create(Cart, cartToCreate);
    await em.flush();
    res.status(201).json({ message: 'Cart created', data: cart });
  } catch (err: any) {
    next(err);
  }
}
async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const user = res.locals.user;
    const cart: Cart = req.body;
    const validationResult = validateCart(cart);
    const ordersArray = Array.from(cart.orders);
    await updateOrders(ordersArray);
    const cartToUpdate = await em.findOneOrFail(Cart, { id });
    let total: number = await calculateTotal(cartToUpdate);
    em.assign(cartToUpdate, { ...cart, total, user });
    await em.flush();
    res.status(200).json({ message: 'Order updated', data: cartToUpdate });
  } catch (err: any) {
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const cartToRemove = await em.findOneOrFail(Cart, { id });
    if (!cartToRemove.isPending()) {
      return res.status(400).json({ message: 'The cart is not pending' });
    }
    await em.nativeDelete(Order, { cart: id });
    await em.nativeDelete(Cart, { id });
    await em.flush();
    res.status(200).json({ message: 'Cart removed', data: cartToRemove });
  } catch (err: any) {
    next(err);
  }
}

async function cancelCart(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const cart = await em.findOneOrFail(
      Cart,
      { id },
      { populate: ['shipping', 'orders', 'orders.product'] }
    );
    if (cart.isCompleted() && cart.isCancelable()) {
      for (const order of cart.orders) {
        let productId: string;
        if (typeof order.product === 'string') {
          productId = order.product;
        } else {
          productId = order.product.id as string;
        }
        const product = await em.findOneOrFail(Product, { id: productId });
        product.stock += order.quantity;
        await em.persistAndFlush(product);
      }
      cart.state = 'Canceled';
      await em.flush();
      res.status(200).json({ message: 'Cart canceled', data: cart });
    } else {
      res.status(400).json({ message: 'The cart is not cancelable' });
    }
  } catch (err: any) {
    next(err);
  }
}

export { findAll, findOne, add, update, remove, cancelCart };
