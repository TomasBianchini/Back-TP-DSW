import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { User } from "./user.entity.js";
import jwt from "jsonwebtoken";
import { Seller } from "./seller.entity.js";
const em = orm.em;

async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await em.findOne(User, { email });
    if (!user) {
      const seller = await em.findOne(Seller, { email });
      if (!seller) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (!seller.verifyPassword(password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const key: string | undefined = process.env.secret_key ?? "";
      const token = jwt.sign({ user: seller }, key, { expiresIn: "2h" });
      return res
        .status(200)
        .json({ message: "Login successful", data: seller, token });
    } else {
      if (!user.verifyPassword(password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const key: string | undefined = process.env.secret_key ?? "";
      const token = jwt.sign({ user: user }, key, { expiresIn: "2h" });
      return res
        .status(200)
        .json({ message: "Login successful", data: user, token });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { login };
