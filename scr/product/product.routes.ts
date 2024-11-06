import { findAll, findOne, remove, update, add } from './product.controller.js';
import { Router } from 'express';
import { auth, isSeller } from '../middlewares/auth.js';
export const productRouter = Router();

productRouter.get('/', auth, findAll);
productRouter.get('/:id', auth, findOne);
productRouter.post('/', isSeller, add);
productRouter.delete('/:id', isSeller, remove);
productRouter.put('/:id', isSeller, update);
productRouter.patch('/:id', isSeller, update);
