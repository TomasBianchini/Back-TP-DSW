import { Request, Response, NextFunction } from 'express';
import { orm } from '../../shared/db/orm.js';
import { MeliAccount } from './meliAccount.entity.js';
import { meliAccountService } from './meliAccount.service.js';
import { BadRequestError } from '../../shared/utils/errors.js';
import { ObjectId } from '@mikro-orm/mongodb';

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
    console.log(meliAccount);
    const newMeliAccount: MeliAccount = new MeliAccount(
      meliAccount.access_token,
      meliAccount.refresh_token,
      meliAccount.expires_in,
      meliAccount.token_type,
      meliAccount.scope,
      meliAccount.user_id,
      '',
      meliAccount.state,
      sellerId
    );
    newMeliAccount.nickname = await meliAccountService.getNickname(
      newMeliAccount
    );
    const existingMeliAccountByUserId = await em.findOne(MeliAccount, {
      userId: meliAccount.user_id,
    });
    if (existingMeliAccountByUserId && existingMeliAccountByUserId.isActive()) {
      throw new BadRequestError('MeliAccount already exists');
    } else if (
      existingMeliAccountByUserId &&
      existingMeliAccountByUserId.isInactive()
    ) {
      em.assign(existingMeliAccountByUserId, newMeliAccount);
      await em.flush();
      res
        .status(201)
        .json({
          message: 'MeliAccount created',
          data: existingMeliAccountByUserId,
        });
    }
    const accountCreated = em.create(MeliAccount, newMeliAccount);
    await em.flush();
    res
      .status(201)
      .json({ message: 'MeliAccount created', data: accountCreated });
  } catch (err: any) {
    next(err);
  }
}

async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = res.locals.user;
    const id = new ObjectId(req.params.id);
    const meliAccount: MeliAccount = await em.findOneOrFail(
      MeliAccount,
      {
        _id: id,
        seller: sellerId,
      },
      { populate: ['seller'] }
    );
    res.status(200).json({ message: 'MeliAccount found', data: meliAccount });
  } catch (err: any) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = res.locals.user;
    const id = new ObjectId(req.params.id);
    const meliAccount: MeliAccount = await em.findOneOrFail(MeliAccount, {
      _id: id,
      seller: sellerId,
    });
    if (meliAccount.isActive()) {
      throw new BadRequestError('MeliAccount is already active');
    }
    let newMeliAccount = await meliAccountService.oauth(req.body.code);
    newMeliAccount = {
      accessToken: newMeliAccount.access_token,
      refreshToken: newMeliAccount.refresh_token,
      expiresIn: newMeliAccount.expires_in,
      tokenType: newMeliAccount.token_type,
      scope: newMeliAccount.scope,
      userId: newMeliAccount.user_id,
      nickname: meliAccount.nickname,
      seller: sellerId,
      state: 'active',
    };
    em.assign(meliAccount, newMeliAccount);
    await em.flush();
    res.status(200).json({ message: 'MeliAccount updated', data: meliAccount });
  } catch (err: any) {
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = res.locals.user;
    const id = new ObjectId(req.params.id);
    const meliAccount: MeliAccount = await em.findOneOrFail(MeliAccount, {
      _id: id,
      seller: sellerId,
    });
    if (meliAccount.isInactive()) {
      throw new BadRequestError('MeliAccount is already inactive');
    }
    meliAccount.decryptToken();
    if (meliAccount.isTokenExpired()) {
      console.log('Token expired, refreshing');
      const { accessToken, refreshToken } =
        await meliAccountService.refreshToken(meliAccount);
      meliAccount.accessToken = accessToken;
      meliAccount.refreshToken = refreshToken;
    }
    await meliAccountService.revokeGrant(meliAccount);
    meliAccount.state = 'inactive';
    await em.flush();
    res.status(200).json({ message: 'MeliAccount removed', data: meliAccount });
  } catch (err: any) {
    next(err);
  }
}

export { add, get, update, remove };
