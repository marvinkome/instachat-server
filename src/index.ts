// app setup blueprint
import { createServer } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { ApolloServer } from 'apollo-server-express';

import { authUser } from './schema/helpers';
import { schema } from './schema';
import mainRoute from './main';
import authRoute from './auth';

function context({ req, connection }: any) {
    if (connection) {
        return { ...connection.context };
    } else {
        // get token from header
        const header = req.headers.authorization;
        const token = header && header.split(' ')[1];

        // add token to context to verify user
        return { token, req };
    }
}

async function onConnect(connParams: any) {
    if (!connParams.authToken) {
        throw Error('Missing auth token!');
    }

    const user = await authUser(connParams.authToken);

    // @ts-ignore
    user.active = true;
    user.save();

    // @ts-ignore
    console.log(user.username, 'has connected');

    return {
        currentUser: user
    };
}

async function onDisconnect(_: any, ctx: any) {
    const { currentUser } = await ctx.initPromise;
    if (!currentUser) {
        return;
    }

    currentUser.active = false;
    currentUser.lastSeen = new Date();
    currentUser.save();

    console.log(currentUser.username, 'has disconnected');
}

const apolloServer = new ApolloServer({
    schema,
    context,
    subscriptions: { onConnect, onDisconnect }
});

function createApp() {
    const app = express();

    // mongoose
    connect(
        process.env.MONGO_URL || '',
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
