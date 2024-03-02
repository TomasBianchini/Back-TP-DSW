import { orm } from "../shared/db/orm.js";
import { Response, Request } from "express";

import { Cart } from "./cart.entity.js";
import { CartFilter } from "./cart.filter.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const filter: CartFilter = req.query;
    const orders = await em.find(Cart, filter, {
      populate: ["orders", "user"],
    });
    res.status(200).json({ message: "Found all orders", data: orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const order = await em.findOneOrFail(
      Cart,
      { id },
      { populate: ["orders", "user"] }
    );
    res.status(200).json({ message: "Found order", data: order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    //TODO add validation if the user has a pending cart or not, if he has a pending cart, add the order to that cart
    const cart = em.create(Cart, req.body);
    await em.flush();
    res.status(201).json({ message: "Order created", data: cart });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cartToUpdate = await em.findOneOrFail(Cart, { id });
    em.assign(cartToUpdate, req.body);
    await em.flush();
    res.status(200).json({ message: "Order updated", data: cartToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cartToRemove = await em.findOneOrFail(Cart, { id });
    em.remove(cartToRemove);
    await em.flush();
    res.status(200).json({ message: "Order removed", data: cartToRemove });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
