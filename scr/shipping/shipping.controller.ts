import { Request, Response } from "express";
import { Shipping } from "./shipping.entity.js";
import { orm } from "../shared/db/orm.js";
import { validateShipping } from "./shipping.schema.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const shippings = await em.find(Shipping, { state: "Active" });
    res.status(200).json({ message: "Found all shippings", data: shippings });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const shipping = await em.findOneOrFail(Shipping, { id });
    res.status(200).json({ message: "Found shipping", data: shipping });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const validationRsult = validateShipping(req.body);
    if (!validationRsult.success) {
      return res.status(400).json({ message: validationRsult.error.message });
    }
    const shipping = em.create(Shipping, validationRsult.data);
    await em.flush();
    res.status(201).json({ message: "Shipping created", data: shipping });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const shippingToUpdate = await em.findOneOrFail(Shipping, { id });
    em.assign(shippingToUpdate, req.body);
    await em.flush();
    res
      .status(201)
      .json({ message: "Shipping updated", data: shippingToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const shipping = em.getReference(Shipping, id);
    em.remove(shipping);
    await em.flush();
    res.status(200).json({ message: "Shipping removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
