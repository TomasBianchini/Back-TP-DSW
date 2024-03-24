import { orm } from "../shared/db/orm.js";
import { PaymentType } from "./payment_type.entity.js";
import { Request, Response } from "express";
import { validatePayment_type } from "./payment_type.schema.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const payment_types = await em.find(PaymentType, { state: "Active" });
    res
      .status(200)
      .json({ message: "Found all payment types", data: payment_types });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const payment_type = await em.findOneOrFail(PaymentType, { id });
    res.status(200).json({ message: "Found payment type", data: payment_type });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const validationResult = validatePayment_type(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message });
    }
    const payment_type = em.create(PaymentType, validationResult.data);
    await em.flush();
    res
      .status(201)
      .json({ message: "Payment type created", data: payment_type });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const payment_typeToUpdate = await em.findOneOrFail(PaymentType, { id });
    em.assign(payment_typeToUpdate, req.body);
    await em.flush();
    res
      .status(200)
      .json({ message: "Payment type updated", data: payment_typeToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const payment_type = await em.findOne(PaymentType, { id });
    if (!payment_type) {
      return res.status(404).json({ message: "Payment type not found" });
    }
    payment_type.state = "Archived";
    await em.persistAndFlush(payment_type);
    res
      .status(200)
      .json({ message: "Payment type deleted", data: payment_type });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, remove, update };
