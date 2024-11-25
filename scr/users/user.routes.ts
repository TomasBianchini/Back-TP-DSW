import Router from 'express';

import { add, findAll, findOne, remove, update } from './user.controller.js';
import { auth, isAdmin } from '../middlewares/auth.js';
export const userRouter = Router();

userRouter.get('/', isAdmin, findAll);

userRouter.get('/:id', auth, findOne);

userRouter.post('/', add);

userRouter.delete('/:id', isAdmin, remove);

userRouter.put('/:id', isAdmin, update);

userRouter.patch('/:id', isAdmin, update);
