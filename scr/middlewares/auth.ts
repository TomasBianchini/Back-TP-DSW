import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const key: string | undefined = process.env.secret_key;

async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  try {
    const decode: any = jwt.verify(token, key!);
    req.body.user = decode.user;
    next();
  } catch (error: any) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  try {
    const decode: any = jwt.verify(token, key!);
    const user = decode.user;
    if (user.type !== "Admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error: any) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function isSeller(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  try {
    const decode: any = jwt.verify(token, key!);
    const user = decode.user;
    if (user.type !== "Seller") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error: any) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export { auth, isAdmin, isSeller };
