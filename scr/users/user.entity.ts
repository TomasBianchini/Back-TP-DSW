import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  EventArgs,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { hash, verify } from 'argon2';

@Entity()
export class User extends BaseEntity {
  @Property({ nullable: false, unique: true })
  user_name!: string;

  @Property({ nullable: false, unique: true })
  email!: string;

  @Property({ nullable: false, hidden: true })
  password!: string;

  @Property({ nullable: false })
  address!: string;

  @Property({ nullable: false })
  type!: 'Admin' | 'User' | 'Seller';

  @Property({ nullable: false })
  state!: 'Active' | 'Archived';

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(args: EventArgs<User>) {
    const password = args.changeSet?.payload.password;
    if (password) {
      this.password = await hash(password);
    }
  }
  async verifyPassword(password: string) {
    return verify(this.password, password);
  }

  isAdmin(): boolean {
    return this.type === 'Admin';
  }

  isSeller(): boolean {
    return this.type === 'Seller';
  }
}
