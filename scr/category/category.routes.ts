import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./category.controller.js";
//TODO add auth middleware and check user type in routes

export const categoryRouter = Router();

categoryRouter.get("/", findAll);
categoryRouter.get("/:id", findOne);
categoryRouter.post("/", add);
categoryRouter.put("/:id", update);
categoryRouter.patch("/:id", update);
categoryRouter.delete("/:id", remove);
