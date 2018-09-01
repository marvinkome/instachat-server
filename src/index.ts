// app setup blueprint

import express from 'express';
import bodyParser from 'body-parser';
import mainRoute from './main';

function createApp() {
    const app = express();

    // setup extensions
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // setup routes
    app.use('/', mainRoute);

    return app;
}

export default createApp;
