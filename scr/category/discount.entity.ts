import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Category } from './category.entity.js';

@Entity()
export class Discount extends BaseEntity {
  @Property({ nullable: false })
  value!: Number;

  @Property({ nullable: false })
  state!: 'Active' | 'Archived';

  @ManyToOne(() => Category, { nullable: false })
  category!: Rel<Category>;

  isActive(): boolean {
    return this.state === 'Active';
  }
}
