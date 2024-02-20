import { Request, Response } from "express";
import { orm } from "../shared/orm.js";
import { Discount } from "./discount.entity.js";
import { validateDiscount } from "./discount.schema.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const discounts = await em.find(Discount, {}, { populate: ["category"] });
    res.status(200).json({ message: "Found all discounts", data: discounts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const discount = await em.findOneOrFail(
      Discount,
      { id },
      { populate: ["category"] }
    );
    res.status(200).json({ message: "Found discount", data: discount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    //TODO here it's necessary to validate if there is a active discount for the same category
    const validationResult = validateDiscount(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message });
    }
    const discount = em.create(Discount, req.body);
    await em.flush();
    res.status(201).json({ message: "disocunt created", data: discount });
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
      .status(201)
      .json({ message: "discount updated", data: discountToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const discount = em.getReference(Discount, id);
    await em.removeAndFlush(discount);
    res.status(201).json({ message: "discount deleted", data: discount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
