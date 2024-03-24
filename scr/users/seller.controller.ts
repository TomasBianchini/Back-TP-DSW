import { Response, Request } from "express";
import { orm } from "../shared/db/orm.js";
import { User } from "./user.entity.js";
import { validateSeller, validateUser } from "./user.schema.js";
import { UserFilter } from "./user.filter.js";
import { Seller } from "./seller.entity.js";
const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const filter: UserFilter = req.query;
    const sellers = await em.find(Seller, filter);
    res.status(200).json({ message: "Found all sellers", data: sellers });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const seller = await em.findOneOrFail(Seller, { id });
    res.status(200).json({ message: "Found seller", data: seller });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function add(req: Request, res: Response) {
  try {
    const validationResult = validateSeller(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message });
    }
    const seller = em.create(Seller, validationResult.data);
    await em.flush();
    res.status(201).json({ message: "Seller created", data: seller });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const seller = await em.findOne(Seller, { id });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    seller.state = "Archived";
    await em.persistAndFlush(seller);
    res.status(200).json({ message: "seller removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const sellerToUpdate = await em.findOneOrFail(Seller, { id });
    em.assign(sellerToUpdate, req.body);
    await em.flush();
    res.status(200).json({ message: "Seller updated", data: sellerToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, remove, update };
