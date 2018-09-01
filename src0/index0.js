// function to setup application
const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express3-handlebars');
const main = require('./main');

module.exports = function() {
    const app = express();

    // setup extentions
    mongoose.connect(
        'mongodb://localhost:27017/chatdb',
        {
            useNewUrlParser: true
        }
    );
    app.engine('handlebars', handlebars.create().engine);
    app.set('view engine', 'handlebars');

    // setup routes
    main(app);

    return app;
};
