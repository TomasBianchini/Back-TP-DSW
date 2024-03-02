import { findAll, findOne, add, update, remove } from "./order.controller.js";
import { Router } from "express";

export const orderRouter = Router();

orderRouter.get("/", findAll);
orderRouter.get("/:id", findOne);
orderRouter.post("/", add);
orderRouter.put("/:id", update);
orderRouter.patch("/:id", update);
orderRouter.delete("/:id", remove);
