import { Category } from './category.entity.js';
import { NextFunction, Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { validateCategory } from './category.schema.js';
import { populate } from 'dotenv';
import { Discount } from '../discount/discount.entity.js';

const em = orm.em;
async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await em.find(
      Category,
      { state: 'Active' },
      { populate: ['discounts'] }
    );
    res.status(200).json({ message: 'Found all categories', data: categories });
  } catch (err: any) {
    next(err);
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const category = await em.findOneOrFail(
      Category,
      { id },
      { populate: ['discounts'] }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Found category', data: category });
  } catch (err: any) {
    next(err);
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = validateCategory(req.body);
    const category = em.create(Category, validationResult.data);
    await em.flush();
    res.status(201).json({ message: 'Category created', data: category });
  } catch (err: any) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const categoryToUpdate = await em.findOne(Category, { id });
    if (!categoryToUpdate) {
      return res.status(404).json({ message: 'Category not found' });
    }
    em.assign(categoryToUpdate, req.body);
    await em.flush();
    res
      .status(200)
      .json({ message: 'Category updated ', data: categoryToUpdate });
  } catch (err: any) {
    next(err);
  }
}
async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const category = em.findOne(Category, { id }, { populate: ['discounts'] });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await em.nativeDelete(Discount, { category: id });
    await em.nativeDelete(Category, { id });
    await em.flush();
    res.status(200).json({ message: 'Category deleted', data: category });
  } catch (err: any) {
    next(err);
  }
}

export { findAll, findOne, add, update, remove };
