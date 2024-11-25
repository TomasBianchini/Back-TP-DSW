import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Cascade,
  Collection,
} from '@mikro-orm/core';

import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { User } from '../../users/user.entity.js';
import { PaymentType } from '../../payment_type/payment_type.entity.js';
import { Shipping } from '../../shipping/shipping.entity.js';
import { Order } from './order.entity.js';

@Entity()
export class Cart extends BaseEntity {
  @Property({ nullable: false })
  state!: 'Completed' | 'Pending' | 'Canceled';

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @OneToMany(() => Order, (order: Order) => order.cart, {
    cascade: [Cascade.ALL],
  })
  orders = new Collection<Order>(this);

  @Property({ nullable: false })
  total!: number;

  @ManyToOne(() => PaymentType, { nullable: true })
  payment_type!: PaymentType | null;

  @ManyToOne(() => Shipping, { nullable: true })
  shipping!: Shipping | null;
}
