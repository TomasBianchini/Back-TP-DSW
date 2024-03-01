import { Entity, Property, ManyToOne } from "@mikro-orm/core";

import { BaseEntity } from "../shared/db/baseEntity.entity.js";

import { Product } from "../product/product.entity.js";
import { Cart } from "./cart.entity.js";

@Entity()
export class Order extends BaseEntity {
  @Property({ nullable: false })
  quantity!: number;

  @Property({ nullable: false })
  state!: "Complete" | "Pending" | "Canceled";

  @ManyToOne(() => Product, { nullable: false })
  product!: Product;

  @ManyToOne(() => Cart, { nullable: false })
  cart!: Cart;
}
