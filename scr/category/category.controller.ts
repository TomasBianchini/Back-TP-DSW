import { Category } from "./category.entity.js";
import { Request, Response } from "express";
import { orm } from "../shared/orm.js";

const em = orm.em;
async function findAll(req: Request, res: Response) {
  try {
    const categories = await em.find(Category, {});
    res.status(200).json({ message: "Found all categories", data: categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const category = await em.find(Category, { id });
    if(!category){
      res.status(404).json({message: "Category not found"});
    }
    res.status(200).json({ message: "Found category", data: category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    //TODO check if category exists and if category is valid 
    const category = em.create(Category, req.body);
    await em.flush();
    res.status(201).json({ message: "Category created ", data: category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const categoryToUpdate = await em.findOneOrFail(Category, { id });
    em.assign(categoryToUpdate, req.body);
    await em.flush();
    res
      .status(201)
      .json({ message: "Category updated ", data: categoryToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const category = em.getReference(Category, id);
    await em.removeAndFlush(category);
    res.status(201).json({ message: "Category deleted", data: category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
