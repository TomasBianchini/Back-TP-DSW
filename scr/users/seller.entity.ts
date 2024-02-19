import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { User } from "./user.entity.js";

@Entity()
export class Seller extends User {
  @Property({ nullable: false, unique: true })
  shop_name!: string;
  @Property({ nullable: false, unique: true })
  cuil!: string;
  @Property({ nullable: false, unique: true })
  cbu!: string;
  //TODO add a collection of products when product entity is created
  // @OneToMany(() => Product, (product) => product.seller, {
  //     cascade: [Cascade.ALL],
  //   })
  // products = new Collection<Product>(this)
}
