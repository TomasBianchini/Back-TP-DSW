import {
  Entity,
  Property,
  ManyToOne,
  OneToOne,
  Reference,
  PrimaryKey,
} from '@mikro-orm/core';
import { MeliAccount } from '../account/meliAccount.entity.js';
import { Product } from '../../product/product.entity.js';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class MeliProduct {
  @PrimaryKey()
  _id?: ObjectId = new ObjectId();

  @Property()
  meliId!: string;

  @ManyToOne(() => MeliAccount, { nullable: false })
  account!: Reference<MeliAccount>;

  @OneToOne(() => Product, { nullable: false })
  product!: Reference<Product>;
}
