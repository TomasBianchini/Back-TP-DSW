import { Router } from 'express';
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from './category.controller.js';
import { auth, isAdmin } from '../middlewares/auth.js';
import { discountRouter } from '../discount/discount.routes.js';

export const categoryRouter = Router();

categoryRouter.get('/', auth, findAll);

categoryRouter.get('/:id', auth, findOne);

categoryRouter.post('/', isAdmin, add);
categoryRouter.put('/:id', isAdmin, update);
categoryRouter.patch('/:id', isAdmin, update);

categoryRouter.delete('/:id', isAdmin, remove);

categoryRouter.use('/:category_id/discounts', discountRouter);
