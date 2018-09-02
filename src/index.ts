// app setup blueprint

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';
import mainRoute from './main';

function createApp() {
    const app = express();

    // setup extensions
    // apollo
    const apolloServer = new ApolloServer({ schema });
    apolloServer.applyMiddleware({ app });

    // mongo
    mongoose.connect(
        'mongodb://localhost:27017/chatdb',
        {
            useNewUrlParser: true
        }
    );
    // body parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // setup routes
    app.use('/', mainRoute);

    return app;
}

export default createApp;
