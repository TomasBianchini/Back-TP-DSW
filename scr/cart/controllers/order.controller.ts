import { Response, Request } from 'express';
import { orm } from '../../shared/db/orm.js';
import { Order } from '../entities/order.entity.js';
import { validateOrder } from '../schemas/order.schema.js';
import { Product } from '../../product/product.entity.js';
import { Cart } from '../entities/cart.entity.js';
import { checkProductAvailability } from '../../product/product.service.js';
const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const id = req.params.cart_id;
    const orders = await em.find(
      Order,
      { cart: id },
      { populate: ['product'] }
    );
    res.status(200).json({ message: 'Found all orders', data: orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const order = await em.findOne(Order, { id }, { populate: ['product'] });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Found order', data: order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const cartId = req.params.cart_id;
    if (!cartId) {
      return res.status(400).json({ message: 'Cart id is required' });
    }
    const user = res.locals.user;
    const validationResult = validateOrder({ ...req.body, cart: cartId });
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message });
    }
    const product = await em.findOne(Product, validationResult.data.product);
    if (
      !product ||
      (await !checkProductAvailability(product, validationResult.data.quantity))
    ) {
      return res.status(400).json({ message: 'Product not available' });
    }
    let cart = await em.findOne(Cart, {
      id: cartId,
      user: user,
      state: 'Pending',
    });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    } else {
      cart.total += validationResult.data.subtotal;
    }
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const cartId: string = req.params.cart_id;
    const cart = await em.findOne(Cart, { id: cartId, state: 'Pending' });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const orderToUpdate = await em.findOne(Order, { id });
    if (!orderToUpdate) {
      return res.status(404).json({ message: 'Order not found' });
    }
    em.assign(orderToUpdate, req.body);
    await em.flush();
    res.status(200).json({ message: 'Order updated', data: orderToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const order = em.getReference(Order, id);
    em.remove(order);
    await em.flush();
    res.status(200).json({ message: 'Order removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, remove, update };
