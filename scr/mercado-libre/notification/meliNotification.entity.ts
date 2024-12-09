import { Property, Entity, ManyToOne, Rel, PrimaryKey } from '@mikro-orm/core';
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

  @Property()
  userId!: number;

  @Property()
  applicationId!: number;

  @Property()
  attempts!: number;

  @Property()
  sent!: Date;

  @Property()
  recieved!: Date;

  @ManyToOne(() => MeliAccount, { nullable: false })
  account!: Rel<MeliAccount>;

  constructor(
    meliId: string,
    resource: string,
    topic: string,
    userId: number,
    applicationId: number,
    sent: Date,
    recieved: Date
  ) {
    this.meliId = meliId;
    this.resource = resource;
    this.topic = topic;
    this.userId = userId;
    this.applicationId = applicationId;
    this.sent = sent;
    this.recieved = recieved;
  }
}
