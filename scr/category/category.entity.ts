import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()
export class Category extends BaseEntity {
  @Property({ nullable: false, unique: true })
  category!: string;

  @Property({ nullable: false })
  state!: "Active" | "Archived";
}
