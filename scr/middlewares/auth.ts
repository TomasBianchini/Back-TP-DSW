import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const key: string | undefined = process.env.secret_key;

async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization');
  try {
    const realToken = await isAuth(token!);
    if (!realToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(realToken, key!);
    next();
  } catch (error: any) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization');
  try {
    const realToken = await isAuth(token!);
    if (!realToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decode: any = jwt.verify(realToken, key!);
    const user = decode.user;
    if (user.type !== 'Admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  } catch (error: any) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

async function isSeller(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  try {
    const tokenParts = token.split(' ');
    if (tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    const realToken = tokenParts[1];
    const decode: any = jwt.verify(realToken, key!);
    const user = decode.user;
    if (user.type !== 'Seller') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  } catch (error: any) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

async function isAuth(token: string) {
  try {
    if (!token) {
      return false;
    }
    const tokenParts = token.split(' ');
    if (tokenParts[0] !== 'Bearer') {
      return false;
    }
    return tokenParts[1];
  } catch (error: any) {
    return false;
  }
}

export { auth, isAdmin, isSeller };
