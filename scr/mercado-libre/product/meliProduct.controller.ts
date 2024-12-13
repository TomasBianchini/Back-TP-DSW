import { NextFunction, Request, Response } from 'express';
import { orm } from '../../shared/db/orm.js';
import { MeliAccount } from '../account/meliAccount.entity.js';
import { Product } from '../../product/product.entity.js';

const em = orm.em;

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = res.locals.user;
    const meliAccount = await em.findOneOrFail(MeliAccount, {
      seller: sellerId,
      state: 'active',
    });
    const productId = req.body.productId;
    const product = await em.findOneOrFail(Product, {
      id: productId,
      state: 'Active',
      seller: sellerId,
    });
  } catch (error: any) {
    next(error);
  }
}
