import {Entity, Property} from "@mikro-orm/core";
import { BaseEntity } from "../shared/baseEntity.entity.js";
 
@Entity()
export class PaymentType extends BaseEntity {
  @Property({ nullable: false, unique: true })
  payment_type!: string;
  @Property({ nullable: false })
  state!: "Active" | "Archived";
}
