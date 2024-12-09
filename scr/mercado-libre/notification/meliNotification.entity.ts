import {
  Property,
  Entity,
  ManyToOne,
  Rel,
  PrimaryKey,
  Reference,
} from '@mikro-orm/core';
import { MeliAccount } from '../account/meliAccount.entity.js';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class MeliNotification {
  @PrimaryKey()
  _id?: ObjectId = new ObjectId();

  @Property()
  meliId!: string;

  @Property()
  resource!: string;

  @Property()
  topic!: string;

  @ManyToOne(() => MeliAccount, { fieldName: 'userId' })
  userId!: Reference<MeliAccount>;

  @Property()
  applicationId!: number;

  @Property()
  attempts!: number;

  @Property()
  sent!: Date;

  @Property()
  recieved!: Date;

  constructor(
    meliId: string,
    resource: string,
    topic: string,
    userId: Reference<MeliAccount>,
    applicationId: number,
    sent: Date,
    recieved: Date,
    attempts: number
  ) {
    this.meliId = meliId;
    this.resource = resource;
    this.topic = topic;
    this.userId = userId;
    this.applicationId = applicationId;
    this.sent = sent;
    this.recieved = recieved;
    this.attempts = attempts;
  }
}
