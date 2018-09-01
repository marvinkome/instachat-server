// app setup blueprint

import express from 'express';

function createApp() {
    const app = express();
    return app;
}

export default createApp;
