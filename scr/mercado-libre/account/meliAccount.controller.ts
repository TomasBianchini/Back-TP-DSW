import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';

const em = orm.em;

async function add(req: Request, res: Response, next: NextFunction) {}

async function get(req: Request, res: Response, next: NextFunction) {}

async function update(req: Request, res: Response, next: NextFunction) {}

async function remove(req: Request, res: Response, next: NextFunction) {}

export { add, get, update, remove };
