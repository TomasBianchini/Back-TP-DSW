import { Router } from 'express';
import { add as addMeliNotification } from './mercado-libre/notification/meliNotification.controller.js';

const webhooksRouter = Router();

webhooksRouter.post('/mercado-libre', addMeliNotification);

export default webhooksRouter;
