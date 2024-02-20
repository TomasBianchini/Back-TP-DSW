import Router from "express";
import { findAll, findOne, add, update, remove } from "./review.controller.js";
import { isAppropriate } from "../middlewares/chat_gpt.js";

export const reviewRouter = Router();

reviewRouter.get("/", findAll);
reviewRouter.get("/:id", findOne);
reviewRouter.post("/", isAppropriate, add);
reviewRouter.put("/:id", update);
reviewRouter.patch("/:id", update);
reviewRouter.delete("/:id", remove);
