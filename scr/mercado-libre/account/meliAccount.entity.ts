import {
  Entity,
  Property,
  PrimaryKey,
  DateTimeType,
  BeforeCreate,
  BeforeUpdate,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { decrypt, encrypt } from '../../shared/utils/encrypt.js';
@Entity()
export class MeliAccount {
  @PrimaryKey()
  _id?: ObjectId = new ObjectId();

  @Property({ nullable: false, unique: true })
  id!: string;

  @Property({ nullable: false })
  accessToken!: string;

  @Property({ nullable: false })
  shopName!: string;

  @Property({ nullable: false })
  refreshToken!: string;

  @Property({ nullable: false })
  expiresIn!: number;

  @Property()
  expirationDate!: Date;

  @Property({ nullable: false })
  tokenType!: string;

  @Property({ nullable: false })
  scope!: string;

  @Property({ nullable: false })
  user_id!: number;

  @Property({ nullable: false })
  nickname!: string;

  @Property({ nullable: false })
  status!: string;

  @Property({ type: DateTimeType })
  createdAt? = new Date();

  @Property({
    type: DateTimeType,
    onUpdate: () => new Date(),
  })
  updatedAt? = new Date();

  isTokenExpired(): boolean {
    return new Date() > this.expirationDate;
  }

  @BeforeCreate()
  @BeforeUpdate()
  encrytToken() {
    this.accessToken = encrypt(this.accessToken);
    this.refreshToken = encrypt(this.refreshToken);
  }

  @BeforeCreate()
  @BeforeUpdate()
  setExpirationDate() {
    this.expirationDate = new Date(Date.now() + this.expiresIn * 1000);
  }

  decryptToken() {
    this.accessToken = decrypt(this.accessToken);
    this.refreshToken = decrypt(this.refreshToken);
  }
}
