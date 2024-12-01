import { orm } from '../shared/db/orm.js';
import { Response, Request, NextFunction } from 'express';
import { Cart } from './cart.entity.js';
import { CartFilter } from './cart.filter.js';
import { Product } from '../product/product.entity.js';
import { updateOrders } from '../order/order.service.js';
import { validateCart } from './cart.schema.js';
import { Order } from '../order/order.entity.js';
import {
  calculateTotal,
  cancelCart,
  cancelPendingCart,
  completeCart,
} from './cart.service.js';
import { BadRequestError } from '../shared/constants/errors.js';
import { Shipping } from '../shipping/shipping.entity.js';
import { FilterQuery, Reference } from '@mikro-orm/core';
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
    const cart = await em.findOneOrFail(
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
    const pendingCart = await em.findOne(Cart, { user, state: 'Pending' });
    if (pendingCart) {
      return res.status(400).json({ message: 'There is a cart pending' });
    }
    const newCart: Cart = { ...req.body, user, state: 'Pending' };
    validateCart(newCart);
    const cart = em.create(Cart, newCart);
    await em.flush();
    res.status(201).json({ message: 'Cart created', data: cart });
  } catch (err: any) {
    next(err);
  }
}
async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const cartId: string = req.params.id;
    const currentUser: string = res.locals.user;
    const updatedCartData: Cart = req.body;
    const existingCart = await em.findOneOrFail(
      Cart,
      { id: cartId },
      { populate: ['orders', 'payment_type', 'shipping', 'user'] }
    );
    if (existingCart.user.id !== currentUser) {
      throw new BadRequestError('You cannot update a cart that is not yours');
    }
    validateCart(updatedCartData);

    if (existingCart.isCompleted()) {
      if (updatedCartData.state === 'Pending') {
        throw new BadRequestError(
          'The cart is already completed, you cannot change it to pending'
        );
      } else if (updatedCartData.state === 'Canceled') {
        if (!existingCart.shipping) {
          throw new BadRequestError('Shipping information is missing');
        }
        const shipping: Shipping = existingCart.shipping as any;
        if (existingCart.isCancelable(shipping)) {
          console.log('canceling cart');
          await cancelCart(existingCart);
        } else {
          throw new BadRequestError('The cart is not cancelable');
        }
      }
    } else if (existingCart.isPending()) {
      if (updatedCartData.state === 'Completed') {
        //TODO test
        if (!updatedCartData.shipping) {
          throw new BadRequestError('Shipping information is missing');
        }
        await em.findOneOrFail('Shipping', updatedCartData.shipping);
        if (!updatedCartData.payment_type) {
          throw new BadRequestError('Payment information is missing');
        }
        await em.findOneOrFail('PaymentType', updatedCartData.payment_type);
        await completeCart(updatedCartData, existingCart, currentUser);
      } else if (updatedCartData.state === 'Canceled') {
        await cancelPendingCart(existingCart);
      }
    } else if (existingCart.isCanceled()) {
      throw new BadRequestError('You cannot update a canceled cart');
    }

    res.status(200).json({ message: 'Cart updated', data: existingCart });
  } catch (error: any) {
    console.log(error.stack);
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const user = res.locals.user;
    const cartToRemove = await em.findOneOrFail(Cart, { id });
    if (cartToRemove.user.id !== user) {
      throw new BadRequestError('You cannot remove a cart that is not yours');
    }
    if (!cartToRemove.isPending()) {
      throw new BadRequestError('Bad request');
    }
    await em.nativeDelete(Order, { cart: id });
    await em.nativeDelete(Cart, { id });
    await em.flush();
    res.status(200).json({ message: 'Cart removed', data: cartToRemove });
  } catch (err: any) {
    next(err);
  }
}

export { findAll, findOne, add, update, remove };

//TODO test updating cart pending to completed and completed to canceled
