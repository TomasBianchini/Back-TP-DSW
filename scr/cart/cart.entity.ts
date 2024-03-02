import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Cascade,
  Collection,
} from "@mikro-orm/core";

import { BaseEntity } from "../shared/db/baseEntity.entity.js";

import { User } from "../users/user.entity.js";
import { Order } from "./order.entity.js";

@Entity()
export class Cart extends BaseEntity {
  @Property({ nullable: false })
  state!: "Complete" | "Pending" | "Canceled";

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @OneToMany(() => Order, (order) => order.cart, {
    cascade: [Cascade.ALL],
  })
  orders = new Collection<Order>(this);

  @Property({ nullable: false })
  total!: number;

  @Property({ nullable: false })
  shipmethod!: "Standard" | "Express" | "Next Day" | "Pickup";
}
