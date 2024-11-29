import { Router } from 'express';
import {
  add,
  findAll,
  findOne,
  remove,
  update,
} from './payment_type.controller.js';
import { auth, isAdmin } from '../middlewares/auth.js';
import ErrorHandler from '../middlewares/ErrorHandler.js';
export const payment_typeRouter = Router();

payment_typeRouter.get('/', auth, findAll);
payment_typeRouter.get('/:id', auth, findOne);
payment_typeRouter.post('/', isAdmin, add);
payment_typeRouter.delete('/:id', isAdmin, remove);
payment_typeRouter.put('/:id', isAdmin, update);
payment_typeRouter.patch('/:id', isAdmin, update);
