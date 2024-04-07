import { orm } from "../shared/db/orm.js";
import { Response, Request } from "express";

import { Cart } from "./cart.entity.js";
import { CartFilter } from "./cart.filter.js";
import { Order } from "./order.entity.js";
import { Product } from "../product/product.entity.js";
import { validateOrder } from "./order.schema.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const filter: CartFilter = req.query;
    const carts = await em.find(Cart, filter, {
      populate: [
        "orders",
        "user",
        "orders.product",
        "payment_type",
        "shipping",
      ],
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
      {
        populate: [
          "orders",
          "user",
          "orders.product",
          "payment_type",
          "shipping",
        ],
      }
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
    res.status(201).json({ message: "Cart created", data: cart });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function update(req: Request, res: Response) {
  try {
    const cart: Cart = req.body;
    const ordersArray = Array.from(cart.orders);
    const updatePromises = await Promise.all(
      ordersArray.map(async (order: Order) => {
        const validationResult = validateOrder(order);
        if (!validationResult.success) {
          throw new Error(validationResult.error.message);
        }
        const orderToUpdate = await em.findOneOrFail(Order, { id: order.id });
        em.assign(orderToUpdate, order);
        await em.flush();
        const id: string = validationResult.data.product;
        let productToUpdate = await em.findOneOrFail(Product, {
          id,
          state: "Active",
        });
        if (productToUpdate.stock < order.quantity) {
          throw new Error("Product not available");
        }
        productToUpdate.stock -= order.quantity;
        await em.persistAndFlush(productToUpdate);
      })
    );
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

async function cancelCart(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cart = await em.findOneOrFail(Cart, { id }, {populate:['shipping', 'orders', 'orders.product']});
    const currentDate = new Date();
    const cartUpdatedAt = new Date(cart.updatedAt ?? new Date());
    const timeDifference =
        currentDate.valueOf() - cartUpdatedAt.valueOf();
    const hoursDifference = timeDifference / (1000 * 3600);
    if(cart.shipping && cart.shipping.cancellationDeadline && hoursDifference > cart.shipping.cancellationDeadline) {
      throw new Error("The cart can't be canceled");
    }
    for (const order of cart.orders) {
      let productId: string;
      if (typeof order.product === 'string') {
        productId = order.product;
      } else {
        productId = order.product.id as string;
      }
      const product = await em.findOneOrFail(Product, { id: productId });
      product.stock += order.quantity;
      await em.persistAndFlush(product);
    }
    cart.state = "Canceled";
    await em.flush();
    res.status(200).json({ message: "Cart canceled", data: cart });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove, cancelCart };
