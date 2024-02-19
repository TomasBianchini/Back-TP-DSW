import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/baseEntity.entity.js";

@Entity()
export class User extends BaseEntity {
  @Property({ nullable: false, unique: true })
  user_name!: string;
  @Property({ nullable: false, unique: true })
  email!: string;
  @Property({ nullable: false })
  password!: string;
  @Property({ nullable: false, unique: true })
  address!: string;
  @Property({ nullable: false, unique: true })
  type!: "Admin" | "User" | "Seller";
  @Property({ nullable: false })
  state!: "Active" | "Archived";
}
