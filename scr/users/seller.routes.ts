import { Router } from 'express';
import { findAll, findOne, remove, update, add } from './seller.controller.js';
import { auth, isAdmin } from '../middlewares/auth.js';
export const sellerRouter = Router();

sellerRouter.get('/', isAdmin, findAll);
sellerRouter.get('/:id', auth, findOne);
sellerRouter.post('/', add);
sellerRouter.delete('/:id', isAdmin, remove);
sellerRouter.put('/:id', isAdmin, update);
sellerRouter.patch('/:id', isAdmin, update);
