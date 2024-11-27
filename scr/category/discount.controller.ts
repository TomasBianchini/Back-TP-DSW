import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { Discount } from './discount.entity.js';
import { validateDiscount } from './discount.schema.js';
import { DiscountFilter } from './discount.filter.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const category = req.params.category_id;
    const validationResult = validateDiscount(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message });
    }
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const discountToUpdate = await em.findOneOrFail(Discount, { id });
    em.assign(discountToUpdate, req.body);
    await em.flush();
    res
      .status(200)
      .json({ message: 'discount updated', data: discountToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const discountToRemove = await em.findOne(Discount, { id });
    if (!discountToRemove) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    discountToRemove.state = 'Archived';
    await em.persistAndFlush(discountToRemove);
    res
      .status(200)
      .json({ message: 'discount deleted', data: discountToRemove });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
