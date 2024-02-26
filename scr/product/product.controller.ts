import { orm } from "../shared/db/orm.js";
import { Product } from "../product/product.entity.js";
import { validateProduct } from "./product.schema.js";
import { Request, Response } from "express";
import { ProductFilter } from "./product.filter.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const filter: ProductFilter = req.query;
    const products = await em.find(Product, filter, {
      populate: ["category", "seller", "reviews"],
    });
    return res
      .status(200)
      .json({ message: "Found all products", data: products });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const product = await em.findOneOrFail(
      Product,
      { id },
      { populate: ["category", "seller", "reviews"] }
    );
    res.status(200).json({ message: "Found product", data: product });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const validationResult = validateProduct(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message });
    }
    const product = em.create(Product, validationResult.data);
    await em.flush();
    res.status(201).json({ message: "Product created", data: product });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const productToUpdate = await em.findOneOrFail(Product, { id });
    em.assign(productToUpdate, req.body);
    await em.flush();
    res.status(201).json({ message: "Product updated", data: productToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const productToRemove = await em.findOne(Product, { id });
    if (!productToRemove) {
      return res.status(404).json({ message: "Product not found" });
    }
    productToRemove.state = "Archived";
    await em.persistAndFlush(productToRemove);
    res.status(200).json({ message: "Product deleted", data: productToRemove });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
