import { NextFunction, Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { Discount } from './discount.entity.js';
import { validateDiscount } from './discount.schema.js';
import { DiscountFilter } from './discount.filter.js';

const em = orm.em;

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.params.category_id || undefined;
    const filter: DiscountFilter = { ...req.query };
    if (category) {
      filter.category = category;
    }
    const discounts = await em.find(Discount, filter, {
      populate: ['category'],
    });
    res.status(200).json({ message: 'Found all discounts', data: discounts });
  } catch (err: any) {
    next(err);
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const discount = await em.findOne(
      Discount,
      { id },
      { populate: ['category'] }
    );
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    res.status(200).json({ message: 'Found discount', data: discount });
  } catch (err: any) {
    next(err);
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.params.category_id;
    const validationResult = validateDiscount(req.body);
    const valideDiscount = await em.findOne(Discount, {
      category: category,
      state: 'Active',
    });
    if (valideDiscount) {
      return res.status(400).json({
        message: 'There is already an acitve discount for this category',
      });
    }
    const discount = em.create(Discount, {
      ...validationResult.data,
      category,
    });
    await em.flush();
    res.status(201).json({ message: 'disocunt created', data: discount });
  } catch (err: any) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const discountToUpdate = await em.findOneOrFail(Discount, { id });
    em.assign(discountToUpdate, req.body);
    await em.flush();
    res
      .status(200)
      .json({ message: 'discount updated', data: discountToUpdate });
  } catch (err: any) {
    next(err);
  }
}
async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const discountToRemove = await em.findOneOrFail(Discount, { id });
    discountToRemove.state = 'Archived';
    await em.persistAndFlush(discountToRemove);
    res
      .status(200)
      .json({ message: 'discount deleted', data: discountToRemove });
  } catch (err: any) {
    next(err);
  }
}

export { findAll, findOne, add, update, remove };
