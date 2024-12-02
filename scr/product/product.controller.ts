import { orm } from '../shared/db/orm.js';
import { Product } from '../product/product.entity.js';
import { validateProduct } from './product.schema.js';
import { NextFunction, Request, Response } from 'express';
import { ProductFilter } from './product.filter.js';
import { Seller } from '../users/seller.entity.js';
import { filterData } from './product.service.js';
import { MeliProduct } from '../mercado-libre/product/meliProduct.entity.js';

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
    const seller = await em.findOneOrFail(Seller, { id: sellerId });
    const product = em.create(Product, {
      ...validationResult.data,
      meliProduct: undefined,
    });
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
    const productToUpdate = await em.findOneOrFail(Product, {
      id,
      seller: sellerId,
    });
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
    const productToRemove = await em.findOneOrFail(Product, {
      id,
      seller: sellerId,
    });
    productToRemove.state = 'Archived';
    await em.persistAndFlush(productToRemove);
    res.status(200).json({ message: 'Product deleted', data: productToRemove });
  } catch (err: any) {
    next(err);
  }
}

export { findAll, findOne, add, update, remove };
