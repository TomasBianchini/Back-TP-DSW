import { Router } from 'express';
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  cancelCart,
} from './cart.controller.js';
import { auth } from '../middlewares/auth.js';
import { orderRouter } from '../order/order.routes.js';
export const cartRouter = Router();

cartRouter.get('/', auth, findAll);

cartRouter.get('/:id', auth, findOne);

cartRouter.post('/', auth, add);

cartRouter.put('/:id/complete', auth, update);

cartRouter.patch('/:id/cancel', auth, cancelCart);

cartRouter.delete('/:id', auth, remove);

cartRouter.use('/:cart_id/orders', orderRouter);
