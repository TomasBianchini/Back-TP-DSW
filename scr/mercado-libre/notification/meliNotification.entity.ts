import { Property, Entity, ManyToOne, Rel, PrimaryKey } from '@mikro-orm/core';
import { MeliAccount } from '../account/meliAccount.entity.js';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class MeliNotification {
  @PrimaryKey()
  _id?: ObjectId = new ObjectId();

  @Property()
  id!: string;

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
}
