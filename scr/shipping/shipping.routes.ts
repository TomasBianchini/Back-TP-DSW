import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from './shipping.controller.js';
import { Router } from 'express';
import { auth, isAdmin } from '../middlewares/auth.js';
export const shippingRouter = Router();

shippingRouter.get('/', auth, findAll);

shippingRouter.get('/:id', auth, findOne);

shippingRouter.post('/', isAdmin, add);

shippingRouter.put('/:id', isAdmin, update);

shippingRouter.patch('/:id', isAdmin, update);

shippingRouter.delete('/:id', isAdmin, remove);
