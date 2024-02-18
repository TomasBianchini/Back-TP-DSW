import { Router } from "express";
import { add, findAll, findOne, remove, update } from "./payment_type.controller.js";

export const payment_typeRouter = Router();

payment_typeRouter.get("/", findAll);
payment_typeRouter.get("/:id", findOne);    
payment_typeRouter.post("/", add);    
payment_typeRouter.delete("/:id", remove);    
payment_typeRouter.put("/:id", update);
payment_typeRouter.patch("/:id", update);    
