import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Discount } from "./discount.entity.js";
import { validateDiscount } from "./discount.schema.js";
import { DiscountFilter } from "./discount.filter.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    //TODO add filters to the query
    const filter: DiscountFilter = req.query;
    const discounts = await em.find(Discount, filter, {
      populate: ["category"],
    });
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
    const discount = em.create(Discount, validationResult.data);
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
    const discountToRemove = await em.findOne(Discount, { id });
    if (!discountToRemove) {
      return res.status(404).json({ message: "Discount not found" });
    }
    discountToRemove.state = "Archived";
    await em.persistAndFlush(discountToRemove);
    res
      .status(201)
      .json({ message: "discount deleted", data: discountToRemove });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
