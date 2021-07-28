import dotenv from "dotenv";
dotenv.config()

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildFederatedSchema } from '@apollo/federation';
import { typeDefs, resolvers } from './authSchema.js';

const main = async () => {
    const app = express();
    app.use(express.json());

    const apolloServer = new ApolloServer({
        schema: buildFederatedSchema([{ typeDefs, resolvers }]),
        context: ({ req, res }) => ({ req, res }),
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(parseInt(process.env.AUTH_PORT), () => { // * 4001
        console.log('Auth Server started at PORT ' + process.env.AUTH_PORT);
    });
};

main();