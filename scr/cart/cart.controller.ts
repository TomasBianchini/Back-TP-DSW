import { orm } from "../shared/db/orm.js";
import { Response, Request } from "express";

import { Cart } from "./cart.entity.js";
import { CartFilter } from "./cart.filter.js";
import { Order } from "./order.entity.js";
import { Product } from "../product/product.entity.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const filter: CartFilter = req.query;
    const carts = await em.find(Cart, filter, {
      populate: ["orders", "user", "orders.product"],
    });
    res.status(200).json({ message: "Found all carts", data: carts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cart = await em.findOneOrFail(
      Cart,
      { id },
      { populate: ["orders", "user", "orders.product"] }
    );
    res.status(200).json({ message: "Found cart", data: cart });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const cart = em.create(Cart, req.body);
    await em.flush();
    res.status(201).json({ message: "C created", data: cart });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function update(req: Request, res: Response) {
  try {
    //TODO I must check the method to update the orders because it does not work
    const cart: Cart = req.body;
    const ordersArray = Array.from(cart.orders);
    ordersArray.forEach(async (order: Order) => {
      const orderToUpdate = await em.findOneOrFail(Order, { id: order.id });
      em.assign(orderToUpdate, order);
      const product = await em.findOneOrFail(Product, { id: order.product.id });
      if (product.stock < order.quantity) {
        return res.status(400).json({ message: "Product not available" });
      }
      product.stock = product.stock - order.quantity;
      em.persist(product);
      await em.flush();
    });
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
