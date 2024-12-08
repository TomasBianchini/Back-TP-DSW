import { NextFunction, Response, Request } from 'express';
import { processItemNotification } from './meliNotification.service.js';
import { MeliNotification } from './meliNotification.entity.js';
import { orm } from '../../shared/db/orm.js';
const em = orm.em;
async function add(req: Request, res: Response, next: NextFunction) {
  res.status(200).send('OK');
  const existingNotification = await em.findOne(MeliNotification, {
    id: req.body._id,
  });
  if (existingNotification) {
    existingNotification.attempts = req.body.attempts;
    await em.persistAndFlush(existingNotification);
    return;
  }
  const newMeliNotification: MeliNotification = new MeliNotification(
    req.body._id,
    req.body.resource,
    req.body.topic,
    req.body.user_id,
    req.body.application_id,
    req.body.sent,
    req.body.recieved
  );
  const newNotification = em.create(MeliNotification, newMeliNotification);
  await em.flush();
  if (newNotification.topic == 'questions') {
    ///
  } else if (newNotification.topic == 'messages') {
    // Do something
  } else if (newNotification.topic == 'items') {
    processItemNotification(newNotification);
  }
}

export { add };
