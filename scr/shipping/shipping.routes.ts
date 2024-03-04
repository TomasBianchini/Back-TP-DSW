import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./shipping.controller.js";
import { Router } from "express";

export const shippingRouter = Router();

shippingRouter.get("/", findAll);
shippingRouter.get("/:id", findOne);
shippingRouter.post("/", add);
shippingRouter.put("/:id", update);
shippingRouter.patch("/:id", update);
shippingRouter.delete("/:id", remove);
