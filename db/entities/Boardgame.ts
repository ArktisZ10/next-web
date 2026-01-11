import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Boardgame {
  @PrimaryKey()
  _id!: ObjectId;

  // fields used by the boardgames page
  @Index()
  @Property()
  name!: string;

  @Property({ nullable: true })
  minPlayers?: number;

  @Property({ nullable: true })
  maxPlayers?: number;

  @Property({ nullable: true })
  minPlayTime?: number;

  @Property({ nullable: true })
  maxPlayTime?: number;

  @Property({ nullable: true })
  publisher?: string;

  @Property({ nullable: true })
  yearPublished?: number;
}
