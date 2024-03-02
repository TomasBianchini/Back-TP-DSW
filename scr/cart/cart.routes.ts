import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./cart.controller.js";

export const cartRouter = Router();

cartRouter.get("/", findAll);
cartRouter.get("/:id", findOne);
cartRouter.post("/", add);
cartRouter.put("/:id", update);
cartRouter.patch("/:id", update);
cartRouter.delete("/:id", remove);
