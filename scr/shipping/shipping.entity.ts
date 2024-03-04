import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
@Entity()
export class Shipping extends BaseEntity {
  @Property({ nullable: false, unique: true })
  shipmethod!: string;

  @Property({ nullable: false })
  price!: number;

  @Property({ nullable: false })
  state!: "Active" | "Archived";
}
