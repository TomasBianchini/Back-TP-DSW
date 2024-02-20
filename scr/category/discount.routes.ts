import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./discount.controller.js";
//TODO add auth middleware and check user type in routes

export const discountRouter = Router();

discountRouter.get("/", findAll);
discountRouter.get("/:id", findOne);
discountRouter.post("/", add);
discountRouter.put("/:id", update);
discountRouter.patch("/:id", update);
discountRouter.delete("/:id", remove);
