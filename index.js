// entry file for server

const createApp = require('./src');
const app = createApp();

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log('Server is running on localhost:' + app.get('port')); // eslint-disable-line
});
