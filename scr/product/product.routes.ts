import { findAll, findOne, remove, update, add } from "./product.controller.js";
import { Router } from "express";
export const productRouter = Router();

productRouter.get("/", findAll);
productRouter.get("/:id", findOne);
productRouter.post("/", add);
productRouter.delete("/:id", remove);
productRouter.put("/:id", update);
productRouter.patch("/:id", update);
