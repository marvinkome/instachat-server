// app setup blueprint

import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import { connection } from './models';
import { schema } from './schema';
import mainRoute from './main';

const apolloServer = new ApolloServer({ schema });

function createApp() {
    return connection.then(() => {
        const app = express();

        // setup extensions
        // apollo
        apolloServer.applyMiddleware({ app });

        // body parser
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        // setup routes
        app.use('/', mainRoute);

        return app;
    });
}

export default createApp;
