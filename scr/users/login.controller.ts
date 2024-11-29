import { NextFunction, Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { User } from './user.entity.js';
import jwt from 'jsonwebtoken';
import { Seller } from './seller.entity.js';
import { InvalidCredentialsError } from '../shared/constants/errors.js';
const em = orm.em;

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    let user = await em.findOne(User, { email });
    if (!user) {
      user = await em.findOne(Seller, { email });
      if (!user) {
        throw new InvalidCredentialsError('Invalid credentials');
      }
    }
    if (user) {
      const verifyPassword = await user.verifyPassword(password);
      if (!verifyPassword) {
        throw new InvalidCredentialsError('Invalid credentials');
      }
      const key: string | undefined = process.env.secret_key ?? '';
      const token = jwt.sign({ user: user }, key, { expiresIn: '7d' });
      return res
        .status(200)
        .json({ message: 'Login successful', data: user, token });
    }
  } catch (err: any) {
    next(err);
  }
}

export { login };
