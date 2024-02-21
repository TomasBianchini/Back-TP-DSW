import {
  Cascade,
  Entity,
  OneToMany,
  Property,
  Collection,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Discount } from "./discount.entity.js";

@Entity()
export class Category extends BaseEntity {
  @Property({ nullable: false, unique: true })
  category!: string;

  @Property({ nullable: false })
  state!: "Active" | "Archived";

  @OneToMany(() => Discount, (discount) => discount.category, {
    cascade: [Cascade.ALL],
  })
  discounts = new Collection<Discount>(this);
}
