import { Router } from "express";
import { findAll, findOne, remove, update, add } from "./seller.controller.js";

export const sellerRouter = Router();

sellerRouter.get("/", findAll);
sellerRouter.get("/:id", findOne);
sellerRouter.post("/", add);
sellerRouter.delete("/:id", remove);
sellerRouter.put("/:id", update);
sellerRouter.patch("/:id", update);
