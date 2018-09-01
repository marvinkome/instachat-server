// setup main routes
const User = require('../models/user');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.type('text/plain');
        res.send('Hello i\'m a Chat app');
    });

    app.get('/test', (req, res) => {
        User.find({}, (err, users) => {
            // const user = resp[0];
            // user = User.
            res.render('home', {
                users
            });
        });
    });

    app.get('/update/:name', (req, res) => {
        const username = req.params.name;
        User.findOne({ username }, (err, user) => {
            user.password = username;

            user.save((err) => {
                if (err) throw err;
                res.type('text/plain');
                res.send('User created');
            });
        });
    });

    app.get('/verify/:pass', (req, res) => {
        const pass = req.params.pass;
        User.findOne({ username: 'johndoe' }, (err, user) => {
            user.verify_password(pass).then((verified, err) => {
                if (err) throw err;
                res.type('text/plain');
                res.send('Verified ' + verified);
            });
        });
    });
};
