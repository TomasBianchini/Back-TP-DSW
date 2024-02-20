import Router from "express";
import { findAll, findOne, add, update, remove } from "./review.controller.js";

export const reviewRouter = Router();

reviewRouter.get("/", findAll);
reviewRouter.get("/:id", findOne);
reviewRouter.post("/", add);
reviewRouter.put("/:id", update);
reviewRouter.patch("/:id", update);
reviewRouter.delete("/:id", remove);
