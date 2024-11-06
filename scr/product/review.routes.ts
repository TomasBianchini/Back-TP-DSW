import Router from 'express';
import { findAll, findOne, add, update, remove } from './review.controller.js';
import { isAppropriate } from '../middlewares/chat_gpt.js';
import { auth } from '../middlewares/auth.js';
export const reviewRouter = Router();

reviewRouter.get('/', auth, findAll);
reviewRouter.get('/:id', auth, findOne);
reviewRouter.post('/', auth, add);
reviewRouter.put('/:id', auth, update);
reviewRouter.patch('/:id', auth, update);
reviewRouter.delete('/:id', auth, remove);
