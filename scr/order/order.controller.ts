import { Response, Request, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Order } from './order.entity.js';
import { validateOrder } from './order.schema.js';
import { Product } from '../product/product.entity.js';
import { Cart } from '../cart/cart.entity.js';
const em = orm.em;

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.cart_id;
    const orders = await em.find(
      Order,
      { cart: id },
      { populate: ['product'] }
    );
    res.status(200).json({ message: 'Found all orders', data: orders });
  } catch (err: any) {
    next(err);
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const order = await em.findOneOrFail(
      Order,
      { id },
      { populate: ['product'] }
    );
    res.status(200).json({ message: 'Found order', data: order });
  } catch (err: any) {
    next(err);
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const cartId = req.params.cart_id;
    if (!cartId) {
      return res.status(400).json({ message: 'Cart id is required' });
    }
    const user = res.locals.user;
    const validationResult = validateOrder({ ...req.body, cart: cartId });
    const product = await em.findOneOrFail(
      Product,
      validationResult.data.product
    );
    if (!product || !product.isAvailable(validationResult.data.quantity)) {
      return res.status(400).json({ message: 'Product not available' });
    }
    let cart = await em.findOneOrFail(Cart, {
      id: cartId,
      user: user,
      state: 'Pending',
    });
    cart.total += validationResult.data.subtotal;
    validationResult.data.cart = cart.id;
    const order = em.create(Order, {
      quantity: validationResult.data.quantity,
      product: product,
      cart: cart,
      subtotal: validationResult.data.subtotal,
    });
    em.persist(cart);
    await em.flush();
    res.status(201).json({ message: 'Order created', data: order });
  } catch (err: any) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id: string = req.params.id;
    const cartId: string = req.params.cart_id;
    await em.findOneOrFail(Cart, { id: cartId, state: 'Pending' });
    const orderToUpdate = await em.findOneOrFail(Order, { id });
    em.assign(orderToUpdate, req.body);
    await em.flush();
    res.status(200).json({ message: 'Order updated', data: orderToUpdate });
  } catch (err: any) {
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const cartId: string = req.params.cart_id;
    await em.findOneOrFail(Cart, { id: cartId, state: 'Pending' });
    const order = em.getReference(Order, id);
    em.remove(order);
    await em.flush();
    res.status(200).json({ message: 'Order removed' });
  } catch (err: any) {
    next(err);
  }
}

export { findAll, findOne, add, remove, update };
