import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const key: string | undefined = process.env.secret_key;
async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-access-token");
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  try {
    const decode = jwt.verify(token, key!);
    req.body.user = decode;
    next();
  } catch (error: any) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export { auth };
