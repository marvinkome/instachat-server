import createApp from './src';

const expressPromise = createApp();
const port = process.env.PORT || 3000;

expressPromise.then((app) => {
    app.listen(port, () => {
        // @ts-ignore
        console.log(`App is running in localhost:${port}`);
    });
});
