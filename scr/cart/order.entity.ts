import { Entity, Property, ManyToOne } from "@mikro-orm/core";

import { BaseEntity } from "../shared/db/baseEntity.entity.js";

import { Product } from "../product/product.entity.js";
import { Cart } from "./cart.entity.js";
import { User } from "../users/user.entity.js";

@Entity()
export class Order extends BaseEntity {
  @Property({ nullable: false })
  quantity!: number;

  @ManyToOne(() => Product, { nullable: false })
  product!: Product | string;

  @Property({ nullable: false })
  subtotal!: number;

  @ManyToOne(() => Cart, { nullable: false })
  cart!: Cart;
}
