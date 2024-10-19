import { Response, Request } from "express";
import { orm } from "../shared/db/orm.js";
import { Order } from "./order.entity.js";
import { validateOrder } from "./order.schema.js";
import { Product } from "../product/product.entity.js";
import { Cart } from "./cart.entity.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const orders = await em.find(Order, {}, { populate: ["product"] });
    res.status(200).json({ message: "Found all orders", data: orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const order = await em.findOneOrFail(
      Order,
      { id },
      { populate: ["product"] }
    );
    res.status(200).json({ message: "Found order", data: order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const validationResult = validateOrder(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message });
    }
    const product = await em.findOne(Product, validationResult.data.product);
    if (
      !product ||
      !product.isActive() ||
      !product.isAvailable(validationResult.data.quantity)
    ) {
      return res.status(400).json({ message: "Product not available" });
    }
    let cart = await em.findOne(Cart, {
      user: req.body.user,
      state: "Pending",
    });

    if (!cart) {
      cart = em.create(Cart, {
        user: req.body.user,
        state: "Pending",
        total: req.body.subtotal,
      });
    } else {
      cart.total += validationResult.data.subtotal;
    }
    validationResult.data.cart = cart.id;
    const order = em.create(Order, {
      quantity: validationResult.data.quantity,
      product: product,
      cart: cart,
      subtotal: validationResult.data.subtotal,
    });
    em.persist(cart);
    await em.flush();
    res.status(201).json({ message: "Order created", data: order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const orderToUpdate = await em.findOneOrFail(Order, { id });
    em.assign(orderToUpdate, req.body);
    await em.flush();
    res.status(200).json({ message: "Order updated", data: orderToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const order = em.getReference(Order, id);
    em.remove(order);
    await em.flush();
    res.status(200).json({ message: "Order removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, remove, update };
