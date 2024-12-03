import { add, get, update, remove } from './meliAccount.controller.js';
import { auth, isSeller } from '../../middlewares/auth.js';
import { Router } from 'express';
const meliRouter = Router();

meliRouter.get('/:id', auth, get);
meliRouter.post('/', isSeller, add);
meliRouter.put('/:id', isSeller, update);
meliRouter.delete('/:id', isSeller, remove);

export { meliRouter };
