import Router from "express";

import { add, findAll, findOne, remove, update } from "./user.controller.js";
import { auth } from "../middlewares/auth.js";
export const userRouter = Router();

userRouter.get("/", auth, findAll);
userRouter.get("/:id", findOne);
userRouter.post("/", add);
userRouter.delete("/:id", remove);
userRouter.put("/:id", update);
userRouter.patch("/:id", update);
