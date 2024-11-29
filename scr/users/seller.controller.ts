import { Response, Request, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { validateSeller } from './user.schema.js';
import { UserFilter } from './user.filter.js';
import { Seller } from './seller.entity.js';
import { ForbiddenError } from '../shared/constants/errors.js';
const em = orm.em;

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const filter: UserFilter = req.query;
    const sellers = await em.find(Seller, filter);
    res.status(200).json({ message: 'Found all sellers', data: sellers });
  } catch (err: any) {
    next(err);
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const seller = await em.findOneOrFail(Seller, { id });
    res.status(200).json({ message: 'Found seller', data: seller });
  } catch (err: any) {
    next(err);
  }
}
async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = validateSeller(req.body);
    const seller = em.create(Seller, validationResult.data);
    await em.flush();
    res.status(201).json({ message: 'Seller created', data: seller });
  } catch (err: any) {
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const seller = await em.findOneOrFail(Seller, { id });
    seller.state = 'Archived';
    await em.persistAndFlush(seller);
    res.status(200).json({ message: 'seller removed' });
  } catch (err: any) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const sellerId = res.locals.id;
    if (id !== sellerId) {
      throw new ForbiddenError('Forbidden');
    }
    const sellerToUpdate = await em.findOneOrFail(Seller, { id });
    em.assign(sellerToUpdate, req.body);
    await em.flush();
    res.status(200).json({ message: 'Seller updated', data: sellerToUpdate });
  } catch (err: any) {
    next(err);
  }
}

export { findAll, findOne, add, remove, update };
