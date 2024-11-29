import { Response, Request, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { User } from './user.entity.js';
import { validateUser } from './user.schema.js';
import { UserFilter } from './user.filter.js';
import { ForbiddenError } from '../shared/constants/errors.js';
const em = orm.em;

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const filter: UserFilter = req.query;
    const users = await em.find(User, filter);
    res.status(200).json({ message: 'Found all users', data: users });
  } catch (err: any) {
    next(err);
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const user = await em.findOneOrFail(User, { id });
    res.status(200).json({ message: 'Found user', data: user });
  } catch (err: any) {
    next(err);
  }
}
async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = validateUser(req.body);
    const user = em.create(User, { ...validationResult.data, type: 'User' });
    await em.flush();
    res.status(201).json({ message: 'User created', data: user });
  } catch (err: any) {
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const user = await em.findOneOrFail(User, { id });
    user.state = 'Archived';
    await em.persistAndFlush(user);
    res.status(200).json({ message: 'User removed' });
  } catch (err: any) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const userId = res.locals.id;
    if (id !== userId) {
      throw new ForbiddenError('Forbidden');
    }
    const userToUpdate = await em.findOneOrFail(User, { id });
    em.assign(userToUpdate, req.body);
    await em.flush();
    res.status(200).json({ message: 'User updated', data: userToUpdate });
  } catch (err: any) {
    next(err);
  }
}

export { findAll, findOne, add, remove, update };
