import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway } from '@apollo/gateway';
import AppSource from './gatewaySource';

const main = async () => {
    const gateway = new ApolloGateway({
        serviceList: [
            {
                name: "auth",
                url: `http://localhost:${process.env.AUTH_PORT}/${process.env.GRAPHQL_PATH}`,
                // http://localhost:4001/graphql
            },
            {
                name: "course",
                url: `http://localhost:${process.env.COURSE_PORT}/${process.env.GRAPHQL_PATH}`,
                // http://localhost:4002/graphql
            },
            {
                name: "student",
                url: `http://localhost:${process.env.STUDENT_PORT}/${process.env.GRAPHQL_PATH}`,
                // http://localhost:4003/graphql
            }
        ],
        buildService({ name, url }) {
            return new AppSource({ url })
        }
    });
    
    const apolloServer = new ApolloServer({
        gateway,
        subscriptions: false,
        context: ({ req }) => ({ req: req, res: req.res })
    });
    
    const app = express();
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
    
    app.listen(process.env.GATEWAY_PORT, () => console.log(`Gateway Server started at PORT ${process.env.GATEWAY_PORT}`));
};

main();