import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './cart.controller.js';
import { auth } from '../middlewares/auth.js';
import { orderRouter } from '../order/order.routes.js';
export const cartRouter = Router();

cartRouter.get('/', auth, findAll);

cartRouter.get('/:id', auth, findOne);

cartRouter.post('/', auth, add);

cartRouter.put('/:id', auth, update);

cartRouter.delete('/:id', auth, remove);

cartRouter.use('/:cart_id/orders', orderRouter);
