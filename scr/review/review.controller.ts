import { NextFunction, Request, Response } from 'express';
import { Review } from './review.entity.js';
import { validateReview } from './review.schema.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await em.find(
      Review,
      { state: 'Active' },
      { populate: ['product'] }
    );
    res.status(200).json({ message: 'Found all reviews', data: reviews });
  } catch (err: any) {
    next(err);
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const review = await em.findOneOrFail(
      Review,
      { id },
      { populate: ['product'] }
    );
    res.status(200).json({ message: 'Found review', data: review });
  } catch (err: any) {
    next(err);
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = validateReview(req.body);
    const review = await em.create(Review, validationResult.data);
    await em.flush();
    res.status(201).json({ message: 'Review added', data: review });
  } catch (err: any) {
    next(err);
  }
}
async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const reviewToUpdate = await em.findOneOrFail(Review, { id });
    em.assign(reviewToUpdate, req.body);
    await em.flush();
    res.status(200).json({ message: 'Review updated', data: reviewToUpdate });
  } catch (err: any) {
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const reviewToRemove = await em.findOneOrFail(Review, { id });
    reviewToRemove.state = 'Archived';
    await em.persistAndFlush(reviewToRemove);
    res.status(200).json({ message: 'Review deleted', data: reviewToRemove });
  } catch (err: any) {
    next(err);
  }
}

export { findAll, findOne, add, remove, update };
