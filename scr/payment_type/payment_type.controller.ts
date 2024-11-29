import { orm } from '../shared/db/orm.js';
import { PaymentType } from './payment_type.entity.js';
import { NextFunction, Request, Response } from 'express';
import { validatePayment_type } from './payment_type.schema.js';

const em = orm.em;

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const payment_types = await em.find(PaymentType, { state: 'Active' });
    res
      .status(200)
      .json({ message: 'Found all payment types', data: payment_types });
  } catch (error: any) {
    next(error);
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const payment_type = await em.findOneOrFail(PaymentType, { id });
    res.status(200).json({ message: 'Found payment type', data: payment_type });
  } catch (error: any) {
    next(error);
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = validatePayment_type(req.body);
    const payment_type = em.create(PaymentType, validationResult.data);
    await em.flush();
    res
      .status(201)
      .json({ message: 'Payment type created', data: payment_type });
  } catch (error: any) {
    next(error);
  }
}
async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const payment_typeToUpdate = await em.findOneOrFail(PaymentType, { id });
    em.assign(payment_typeToUpdate, req.body);
    await em.flush();
    res
      .status(200)
      .json({ message: 'Payment type updated', data: payment_typeToUpdate });
  } catch (error: any) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const payment_type = await em.findOneOrFail(PaymentType, { id });
    payment_type.state = 'Archived';
    await em.persistAndFlush(payment_type);
    res
      .status(200)
      .json({ message: 'Payment type deleted', data: payment_type });
  } catch (error: any) {
    next(error);
  }
}

export { findAll, findOne, add, remove, update };
