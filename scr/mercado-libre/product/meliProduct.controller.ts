import { NextFunction, Request, Response } from 'express';
import { orm } from '../../shared/db/orm.js';
import { MeliAccount } from '../account/meliAccount.entity.js';
import { Product } from '../../product/product.entity.js';
import { MeliProduct } from './meliProduct.entity.js';
import { BadRequestError } from '../../shared/utils/errors.js';
import { meliProductService } from './meliProduct.service.js';

const em = orm.em;

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = res.locals.user;
    const meliAccount = await em.findOneOrFail(MeliAccount, {
      seller: sellerId,
      state: 'active',
    });
    meliAccount.decryptToken();
    const productId = req.body.productId;
    const product = await em.findOneOrFail(Product, {
      id: productId,
      state: 'Active',
      seller: sellerId,
    });
    const meliId = req.body.meliId;
    const existingProduct = await em.findOne(MeliProduct, {
      $or: [{ meliId: meliId }, { product: productId }],
    });
    if (existingProduct) {
      throw new BadRequestError(
        'MeliProduct or Product has already been linked'
      );
    }

    const response = await meliProductService.getOne(meliAccount, meliId);
    const newMeliProduct = em.create(MeliProduct, {
      meliId: meliId,
      account: meliAccount,
      product: product,
    });
    await em.persistAndFlush(newMeliProduct);
    res
      .status(201)
      .json({ message: 'MeliProduct created', data: newMeliProduct });
  } catch (error: any) {
    next(error);
  }
}

export { add };
