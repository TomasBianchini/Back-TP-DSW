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

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.body.user.type !== "Admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}

async function isSeller(req: Request, res: Response, next: NextFunction) {
  if (req.body.user.type !== "Seller") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}

export { auth, isAdmin, isSeller };
