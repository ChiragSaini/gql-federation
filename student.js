import dotenv from "dotenv";
dotenv.config()

import express from 'express';
import cookieParser from "cookie-parser";

import { ApolloServer } from 'apollo-server-express';
import { buildFederatedSchema } from '@apollo/federation';
import { typeDefs, resolvers } from './studentSchema';
import { authCheck } from './middleware';

const main = async () => {
    const app = express();
    app.use(cookieParser())
    app.use(authCheck());

    const apolloServer = new ApolloServer({
        schema: buildFederatedSchema([{ typeDefs, resolvers }]),
        context: ({ req, res }) => ({ req, res }),
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(parseInt(process.env.STUDENT_PORT), () => { // * 4003
        console.log('Student Server started at PORT ' + process.env.STUDENT_PORT);
    });
};

main();