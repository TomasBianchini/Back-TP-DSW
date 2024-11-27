import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from '../controllers/order.controller.js';
import { Router } from 'express';
import { auth } from '../../middlewares/auth.js';
export const orderRouter = Router({ mergeParams: true });

orderRouter.get('/', auth, findAll);
orderRouter.get('/:id', auth, findOne);
orderRouter.post('/', auth, add);
orderRouter.put('/:id', auth, update);
orderRouter.patch('/:id', auth, update);
orderRouter.delete('/:id', auth, remove);
