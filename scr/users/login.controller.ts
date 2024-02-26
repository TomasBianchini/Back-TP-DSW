import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { User } from "./user.entity.js";
import jwt from "jsonwebtoken";
const em = orm.em;

async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await em.findOne(User, { email });
    if (!user || !user.verifyPassword(password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const key: string | undefined = process.env.secret_key ?? "";
    const token = jwt.sign({ id: user.id }, key, { expiresIn: "2h" });
    res.status(200).json({ message: "Login successful", data: user, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { login };
