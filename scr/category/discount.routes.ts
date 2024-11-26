import { Router } from 'express';
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from './discount.controller.js';
import { auth, isAdmin } from '../middlewares/auth.js';
export const discountRouter = Router({ mergeParams: true });

discountRouter.get('/', auth, findAll);

discountRouter.get('/:id', auth, findOne);
discountRouter.post('/', isAdmin, add);
discountRouter.put('/:id', isAdmin, update);
discountRouter.patch('/:id', isAdmin, update);
discountRouter.delete('/:id', isAdmin, remove);
