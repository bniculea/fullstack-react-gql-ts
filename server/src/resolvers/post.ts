import { QueryOrder } from '@mikro-orm/core';
import { Post } from './../entities/Post';
import { MyContext } from "src/types";
import {Resolver, Query, Ctx, Int, Arg, Mutation} from "type-graphql";

@Resolver()
export class PostResolver {

    @Query(() => [Post])
    posts(
        @Ctx() ctx: MyContext
    ): Promise<Array<Post>> {
        return ctx.em.find(Post, {})
    }

    @Query(()=>Post, {nullable: true})
    post(
        @Arg('id') id: number,  
        @Ctx() {em} : MyContext
        ): Promise<Post | null> {
            return em.findOne(Post, {id})
        }

    @Mutation(() => Post)
    async createPost(
        @Arg("title") title:string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = em.create(Post, {title, createdAt: new Date(), updatedAt: new Date()})
        await em.persistAndFlush(post);
        return post
    }
}

