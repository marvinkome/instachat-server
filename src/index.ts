// app setup blueprint
import { createServer } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { ApolloServer } from 'apollo-server-express';

import { schema } from './schema';
import mainRoute from './main';
import authRoute from './auth';

const apolloServer = new ApolloServer({
    schema,
    context: ({ req, connection }: any) => {
        if (connection) {
            return {};
        } else {
            // get token from header
            const header = req.headers.authorization;
            const token = header && header.split(' ')[1];

            // add token to context to verify user
            return { token };
        }
    }
});

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

    apolloServer.applyMiddleware({ app });

    // setup routes
    app.use('/', mainRoute);
    app.use('/auth', authRoute);

    const server = createServer(app);
    apolloServer.installSubscriptionHandlers(server);

    return server;
}

export default createApp;
