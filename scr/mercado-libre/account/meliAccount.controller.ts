import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { MeliAccount } from './meliAccount.entity.js';
import { meliAccountService } from './meliAccount.service.js';
import { BadRequestError } from '../../shared/utils/errors.js';
const em = orm.em;

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = res.locals.user;
    const existingMeliAccount = await em.findOne(MeliAccount, {
      seller: sellerId,
      state: 'active',
    });
    if (existingMeliAccount) {
      throw new BadRequestError('MeliAccount already exists');
    }
    const meliAccount = await meliAccountService.oauth(req.body.code);
    meliAccount.seller = sellerId;
    meliAccount.state = 'active';
    const newMeliAccount: MeliAccount = new MeliAccount(
      meliAccount.id,
      meliAccount.access_token,
      meliAccount.refresh_token,
      meliAccount.expires_in,
      meliAccount.token_type,
      meliAccount.scope,
      meliAccount.user_id,
      '',
      meliAccount.state,
      sellerId,
      'TEST'
    );
    newMeliAccount.nickname = await meliAccountService.getNickname(
      newMeliAccount
    );
    const existingMeliAccountByUserId = await em.findOne(MeliAccount, {
      userId: meliAccount.user_id,
    });
    if (existingMeliAccountByUserId) {
      throw new BadRequestError('MeliAccount already exists');
    }
    const accountCreated = em.create(MeliAccount, newMeliAccount);
    console.log('newMeliAccount: ', accountCreated);
    await em.flush();
    res.status(201).json({ message: 'MeliAccount created', data: meliAccount });
  } catch (err: any) {
    next(err);
  }
}

async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = res.locals.user;
    const meliId = req.params.id;
    const meliAccount: MeliAccount = await em.findOneOrFail(
      MeliAccount,
      {
        id: meliId,
        seller: sellerId,
      },
      { populate: ['seller'] }
    );
    meliAccount.decryptToken();
    res.status(200).json({ message: 'MeliAccount found', data: meliAccount });
  } catch (err: any) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {}

async function remove(req: Request, res: Response, next: NextFunction) {}

export { add, get, update, remove };
