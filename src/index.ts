// app setup blueprint

import express, { Request } from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { decode } from 'jsonwebtoken';

import { schema } from './schema';
import mainRoute from './main';
import authRoute from './auth';

function getUser(header: string | undefined) {
    // check if token is not undefined
    if (!header) {
        return null;
    }

    // break token
    const token = header.split(' ')[1];

    // decode token
    const payload = decode(token);

    // check if payload is not falsy
    if (!payload) {
        return null;
    }

    // get userId from payload
    // @ts-ignore
    const { userId } = payload;

    return userId;
}

function createApp() {
    const app = express();

    // mongoose
    connect(
        'mongodb://localhost:27017/chatdb',
        {
            useNewUrlParser: true
        }
    );

    // body parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // setup extensions
    // apollo
    const apolloServer = new ApolloServer({
        schema,
        context: ({ req }: { req: Request }) => {
            const token = req.headers.authorization;
            const userId = getUser(token);
            return { userId };
        }
    });
    apolloServer.applyMiddleware({ app });

    // setup routes
    app.use('/', mainRoute);
    app.use('/auth', authRoute);

    return app;
}

export default createApp;
