// import { Response, Request } from "express";
// import { orm } from "../shared/db/orm.js";
// import { Order } from "./order.entity.js";
// import { validateOrder } from "./order.schema.js";

// const em = orm.em;

// async function findAll(req: Request, res: Response) {
//   try {
//     const id = req.body.user.id;
//     const orders = await em.find(
//       Order,
//       { state: "Pending", user: id },
//       { populate: ["product", "user"] }
//     );
//     res.status(200).json({ message: "Found all orders", data: orders });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function findOne(req: Request, res: Response) {
//   try {
//     const id = req.params.id;
//     const order = await em.findOneOrFail(Order, { id });
//     res.status(200).json({ message: "Found order", data: order });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function add(req: Request, res: Response) {
//   try {
//     //TODO add validation for the product and user, verify that the product is active and it has stock
//     // and the user exists
//     const validationResult = validateOrder(req.body);
//     if (!validationResult.success) {
//       return res.status(400).json({ message: validationResult.error.message });
//     }
//     const order = em.create(Order, req.body);
//     await em.flush();
//     res.status(201).json({ message: "Order created", data: order });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function update(req: Request, res: Response) {
//   try {
//     const id = req.params.id;
//     const orderToUpdate = await em.findOneOrFail(Order, { id });
//     em.assign(orderToUpdate, req.body);
//     await em.flush();
//     res.status(200).json({ message: "Order updated", data: orderToUpdate });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function remove(req: Request, res: Response) {
//   try {
//     const id = req.params.id;
//     const order = em.getReference(Order, id);
//     em.remove(order);
//     await em.flush();
//     res.status(200).json({ message: "Order removed" });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }
