import { Response, Request } from "express";
import { orm } from "../shared/db/orm.js";
import { User } from "./user.entity.js";
import { validateUser } from "./user.schema.js";
import { UserFilter } from "./user.filter.js";
const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const filter: UserFilter = req.query;
    const users = await em.find(User, filter);
    res.status(200).json({ message: "Found all users", data: users });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const user = em.findOneOrFail(User, { id });
    res.status(200).json({ message: "Found user", data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function add(req: Request, res: Response) {
  try {
    const validateResult = validateUser(req.body);
    if (!validateResult.success) {
      return res.status(400).json({ message: validateResult.error.message });
    }
    const user = em.create(User, req.body);
    await em.flush();
    res.status(201).json({ message: "User created", data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const user = await em.findOne(User, { id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.state = "Archived";
    await em.persistAndFlush(user);
    res.status(200).json({ message: "User removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const userToUpdate = await em.findOneOrFail(User, { id });
    em.assign(userToUpdate, req.body);
    await em.flush();
    res.status(201).json({ message: "User updated", data: userToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, remove, update };
