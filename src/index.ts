// app setup blueprint

import express, { Request } from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { decode } from 'jsonwebtoken';

import { schema } from './schema';
import mainRoute from './main';
import authRoute from './auth';

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
            // get token from header
            const header = req.headers.authorization;
            const token = header && header.split(' ')[1];

            // add token to context to verify user
            return { token };
        }
    });
    apolloServer.applyMiddleware({ app });

    // setup routes
    app.use('/', mainRoute);
    app.use('/auth', authRoute);

    return app;
}

export default createApp;
