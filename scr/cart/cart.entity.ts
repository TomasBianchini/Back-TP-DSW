import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Cascade,
  Collection,
  Reference,
} from '@mikro-orm/core';

import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { User } from '../users/user.entity.js';
import { PaymentType } from '../payment_type/payment_type.entity.js';
import { Shipping } from '../shipping/shipping.entity.js';
import { Order } from '../order/order.entity.js';

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
  payment_type!: Reference<PaymentType> | undefined;

  @ManyToOne(() => Shipping, { nullable: true })
  shipping!: Reference<Shipping> | undefined;

  @Property({ nullable: true })
  completed_at!: Date | null;

  isPending(): boolean {
    return this.state === 'Pending';
  }

  isCompleted(): boolean {
    return this.state === 'Completed';
  }
  isCanceled(): boolean {
    return this.state === 'Canceled';
  }
  isCancelable(shipping: Shipping): boolean {
    const now = new Date();
    const lastUpdated = new Date(this.updatedAt ?? now);
    const diffInMilliseconds = now.getTime() - lastUpdated.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 3600);
    if (
      shipping &&
      shipping.cancellationDeadline &&
      diffInHours > shipping.cancellationDeadline
    ) {
      return false;
    }
    return true;
  }
}
