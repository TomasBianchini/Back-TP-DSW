import {
  Entity,
  Property,
  PrimaryKey,
  DateTimeType,
  BeforeCreate,
  BeforeUpdate,
  OneToOne,
  Reference,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { decrypt, encrypt } from '../../shared/utils/encryptor.js';
import { Seller } from '../../users/seller.entity.js';
@Entity()
export class MeliAccount {
  @PrimaryKey()
  _id?: ObjectId = new ObjectId();

  @Property({ nullable: false, unique: true })
  id!: string;

  @Property({ nullable: false })
  accessToken!: string;

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
  userId!: number;

  @Property({ nullable: false })
  nickname!: string;

  @Property({ nullable: false })
  state!: 'active' | 'inactive';

  @OneToOne(() => Seller, { nullable: false })
  seller!: Reference<Seller>;

  @Property({ type: DateTimeType })
  createdAt? = new Date();

  @Property({
    type: DateTimeType,
    onUpdate: () => new Date(),
  })
  updatedAt? = new Date();

  constructor(
    id: string,
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    tokenType: string,
    scope: string,
    userId: number,
    nickname: string,
    state: 'active' | 'inactive',
    seller: Reference<Seller>
  ) {
    this.id = id;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
    this.tokenType = tokenType;
    this.scope = scope;
    this.userId = userId;
    this.nickname = nickname;
    this.state = state;
    this.seller = seller;
  }

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

  isActive() {
    return this.state === 'active';
  }

  isInactive() {
    return this.state === 'inactive';
  }
}
