import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {
  ForbiddenError,
  UnauthorizedError,
} from '../shared/constants/errors.js';

const key: string | undefined = process.env.secret_key;

async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization');
    const realToken = await isAuth(token!);
    const decode: any = jwt.verify(realToken, key!);
    res.locals.user = decode.user.id;
    next();
  } catch (err: any) {
    return next(err);
  }
}

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization');
    const realToken = await isAuth(token!);
    const decode: any = jwt.verify(realToken, key!);
    const user = decode.user;
    if (user.type !== 'Admin') {
      throw new UnauthorizedError('unauthorized');
    }
    res.locals.user = decode.user.id;
    next();
  } catch (err: any) {
    return next(err);
  }
}

async function isSeller(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization');
    const realToken = await isAuth(token!);
    const decode: any = jwt.verify(realToken, key!);
    const user = decode.user;
    if (user.type !== 'Seller') {
      throw new UnauthorizedError('unauthorized');
    }
    res.locals.user = decode.user.id;
    next();
  } catch (err: any) {
    return next(err);
  }
}

async function isAuth(token: string) {
  try {
    if (!token) {
      throw new ForbiddenError('Forbidden');
    }
    const tokenParts = token.split(' ');
    if (tokenParts[0] !== 'Bearer') {
      throw new ForbiddenError('Forbidden');
    }
    return tokenParts[1];
  } catch (error: any) {
    throw new UnauthorizedError('Unauthorized');
  }
}

export { auth, isAdmin, isSeller };
