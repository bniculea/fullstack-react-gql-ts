import {Entity, PrimaryKey, Property } from "@mikro-orm/core"
import {ObjectType, Field} from 'type-graphql'

@ObjectType()
@Entity()
export class Post {

  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({type: 'date', onCreate: () => new Date()})
  createdAt: Date = new Date();

  @Field()
  @Property({type: 'date', onUpdate: () => new Date()})
  updatedAt: Date = new Date();

  @Field()
  @Property({type: 'text'})
  title!: string;

}