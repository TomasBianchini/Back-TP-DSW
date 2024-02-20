import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Category } from "../category/category.entity.js";
import { Seller } from "../users/seller.entity.js";
@Entity()
export class Product extends BaseEntity {
  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ nullable: false })
  price!: number;

  @Property({ nullable: false })
  stock!: number;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  img_url!: "Active" | "Archived";

  @Property({ nullable: false })
  state!: "Active" | "Archived";

  @ManyToOne(() => Category, { nullable: false })
  category!: Rel<Category>;

  @ManyToOne(() => Seller, { nullable: false })
  seller!: Rel<Seller>;
  //TODO add reviews
}
