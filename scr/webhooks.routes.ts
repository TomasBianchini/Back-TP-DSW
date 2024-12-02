import { Router } from 'express';
import { add } from './mercado-libre/notification/meliNotification.controller.js';

const webhooksRouter = Router();

webhooksRouter.post('/mercado-libre', add);
