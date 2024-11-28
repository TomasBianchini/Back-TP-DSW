import { orm } from '../../shared/db/orm.js';
import { Response, Request } from 'express';
import { Cart } from '../entities/cart.entity.js';
import { CartFilter } from '../cart.filter.js';
import { Product } from '../../product/product.entity.js';
import { updateOrders } from '../services/order.service.js';
import { validateCart } from '../schemas/cart.schema.js';
import { Order } from '../entities/order.entity.js';
import { calculateTotal } from '../services/cart.service.js';
const em = orm.em;

async function findAll(req: Request, res: Response) {
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
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
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({ message: 'Found cart', data: cart });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    const existingCart = await em.findOne(Cart, { user, state: 'Pending' });
    if (existingCart) {
      return res.status(400).json({ message: 'There is a cart pending' });
    }
    const cartToCreate: Cart = { ...req.body, user, state: 'Pending' };
    const validationResult = validateCart(cartToCreate);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message });
    }
    const cart = em.create(Cart, cartToCreate);
    await em.flush();
    res.status(201).json({ message: 'Cart created', data: cart });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const user = res.locals.user;
    const cart: Cart = req.body;
    const validationResult = validateCart(cart);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message });
    }
    const ordersArray = Array.from(cart.orders);
    await updateOrders(ordersArray);
    const cartToUpdate = await em.findOneOrFail(Cart, { id });
    let total: number = await calculateTotal(cartToUpdate);
    em.assign(cartToUpdate, { ...cart, total, user });
    await em.flush();
    res.status(200).json({ message: 'Order updated', data: cartToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cartToRemove = await em.findOne(Cart, { id });
    if (!cartToRemove) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    if (!cartToRemove.isPending()) {
      return res.status(400).json({ message: 'The cart is not pending' });
    }
    await em.nativeDelete(Order, { cart: id });
    await em.nativeDelete(Cart, { id });
    await em.flush();
    res.status(200).json({ message: 'Cart removed', data: cartToRemove });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function cancelCart(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cart = await em.findOne(
      Cart,
      { id },
      { populate: ['shipping', 'orders', 'orders.product'] }
    );
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove, cancelCart };
