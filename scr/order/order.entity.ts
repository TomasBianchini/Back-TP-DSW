import { Entity, Property, ManyToOne, Reference } from '@mikro-orm/core';

import { BaseEntity } from '../shared/db/baseEntity.entity.js';

import { Product } from '../product/product.entity.js';

import { Cart } from '../cart/cart.entity.js';
@Entity()
export class Order extends BaseEntity {
  @Property({ nullable: false })
  quantity!: number;

  @ManyToOne(() => Product, { nullable: false })
  product!: Product | string;

  @Property({ nullable: false })
  subtotal!: number;

  @ManyToOne(() => Cart, { nullable: false, lazy: true })
  cart!: Reference<Cart>;
}
