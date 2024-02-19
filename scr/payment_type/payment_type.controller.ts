import { orm } from "../shared/orm.js";
import { PaymentType } from "./payment_type.entity.js";
import { Request, Response } from "express";
import { validatePayment_type } from "./payment_type.schema.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const payment_types = await em.find(PaymentType, {});
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
    if (!payment_type) {
      res.status(404).json({ message: "Payment type not found" });
    }
    res.status(200).json({ message: "Found payment type", data: payment_type });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const validateResult = validatePayment_type(req.body);
    if (!validateResult.success) {
      return res.status(400).json({ message: validateResult.error.message });
    }
    const payment_type = em.create(PaymentType, req.body);
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
      .status(201)
      .json({ message: "Payment type updated", data: payment_typeToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const payment_type = em.getReference(PaymentType, id);

    await em.removeAndFlush(payment_type);
    res
      .status(201)
      .json({ message: "Payment type deleted", data: payment_type });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, remove, update };
