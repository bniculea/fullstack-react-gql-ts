import 'reflect-metadata'
import {MikroORM} from  "@mikro-orm/core"
import { __prod__ } from "./constants"
import mikroOrmConfig from "./mikro-orm.config"
import express from 'express'
import {ApolloServer} from "@apollo/server"
import { expressMiddleware } from '@apollo/server/express4'
import {buildSchema} from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import cors from 'cors'
import pkg from 'body-parser'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http'
import { PostResolver } from "./resolvers/post"

const { json } = pkg

const main = async () => {
    
    const orm = await MikroORM.init(mikroOrmConfig)
    orm.getMigrator().up(); // run migrations before anything else
    const em = orm.em.fork(); // Create a new EntityManager instance for your context

    const app = express()
    const httpServer = http.createServer(app);
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })
    await apolloServer.start()
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        json(),
        expressMiddleware(apolloServer, {
            context: async ({ req }) => ({ token: req.headers.token, em }),
          }))

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })


    // // const post = em.create(Post, {title: 'my first post', createdAt: new Date(), updatedAt: new Date()})
    // // await em.persistAndFlush(post);
    // const posts = await em.find(Post, {})
    // console.log(posts)
}

main().catch(err => {console.log(err)})