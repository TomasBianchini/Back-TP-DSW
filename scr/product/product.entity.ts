import {
  Entity,
  Property,
  ManyToOne,
  Rel,
  OneToMany,
  Collection,
  Cascade,
  OneToOne,
  Reference,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Category } from '../category/category.entity.js';
import { Seller } from '../users/seller.entity.js';
import { Review } from '../review/review.entity.js';
import { MeliProduct } from '../mercado-libre/product/meliProduct.entity.js';
@Entity()
export class Product extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  price!: number;

  @Property({ nullable: false })
  stock!: number;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  img_url!: string;

  @Property({ nullable: false })
  state!: 'Active' | 'Archived';

  @ManyToOne(() => Category, { nullable: false })
  category!: Rel<Category>;

  @ManyToOne(() => Seller, { nullable: false })
  seller!: Rel<Seller>;

  @OneToMany(() => Review, (review: Review) => review.product, {
    cascade: [Cascade.ALL],
  })
  reviews = new Collection<Review>(this);

  @OneToOne(() => MeliProduct, { nullable: true })
  meliProduct!: Reference<MeliProduct> | undefined;

  isActive() {
    return this.state === 'Active' ? true : false;
  }

  isAvailable(requestedQuantity: number): boolean {
    return this.stock >= requestedQuantity && this.isActive();
  }
}
