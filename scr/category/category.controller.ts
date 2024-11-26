import { Category } from './category.entity.js';
import { NextFunction, Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { validateCategory } from './category.schema.js';
import { populate } from 'dotenv';

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
    res.status(200).json({ message: 'Found category', data: category });
  } catch (err: any) {
    next(err);
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = validateCategory(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message });
    }
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
    const categoryToUpdate = await em.findOneOrFail(Category, { id });
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
    const category = em.getReference(Category, id);
    await em.removeAndFlush(category);
    res.status(200).json({ message: 'Category deleted', data: category });
  } catch (err: any) {
    next(err);
  }
}

export { findAll, findOne, add, update, remove };
