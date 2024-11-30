import { Router } from 'express';
import { findAll, findOne, remove, update, add } from './seller.controller.js';
import { auth, isSeller, isAdmin } from '../middlewares/auth.js';
export const sellerRouter = Router();

sellerRouter.get('/', isAdmin, findAll);
sellerRouter.get('/:id', auth, findOne);
sellerRouter.post('/', add);
sellerRouter.delete('/:id', isAdmin, remove);
sellerRouter.put('/:id', isSeller, update);
sellerRouter.patch('/:id', isSeller, update);
