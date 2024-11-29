import { orm } from '../shared/db/orm.js';
import { Product } from '../product/product.entity.js';
import { validateProduct } from './product.schema.js';
import { NextFunction, Request, Response } from 'express';
import { ProductFilter } from './product.filter.js';
import { Seller } from '../users/seller.entity.js';
import { filterData } from './product.service.js';

const em = orm.em;

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const filter: ProductFilter = req.query;
    const products = await em.find(Product, filter, {
      populate: ['category', 'seller', 'reviews'],
    });
    let filteredProducts = await filterData(products);
    return res
      .status(200)
      .json({ message: 'Found all products', data: filteredProducts });
  } catch (err: any) {
    next(err);
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const product = await em.findOneOrFail(
      Product,
      { id },
      { populate: ['category', 'seller', 'reviews'] }
    );
    let filteredProduct = await filterData([product]);
    res
      .status(200)
      .json({ message: 'Found product', data: filteredProduct[0] });
  } catch (err: any) {
    next(err);
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = validateProduct(req.body);
    const sellerId = res.locals.user;
    const seller = await em.findOne(Seller, { id: sellerId });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    const product = em.create(Product, validationResult.data);
    await em.flush();
    res.status(201).json({ message: 'Product created', data: product });
  } catch (err: any) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const sellerId = res.locals.user;
    const productToUpdate = await em.findOne(Product, { id, seller: sellerId });
    if (!productToUpdate) {
      return res.status(404).json({ message: 'Product not found' });
    }
    em.assign(productToUpdate, req.body);
    await em.flush();
    res.status(200).json({ message: 'Product updated', data: productToUpdate });
  } catch (err: any) {
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const sellerId = res.locals.user;
    const productToRemove = await em.findOne(Product, { id, seller: sellerId });
    if (!productToRemove) {
      return res.status(404).json({ message: 'Product not found' });
    }
    productToRemove.state = 'Archived';
    await em.persistAndFlush(productToRemove);
    res.status(200).json({ message: 'Product deleted', data: productToRemove });
  } catch (err: any) {
    next(err);
  }
}

export { findAll, findOne, add, update, remove };
