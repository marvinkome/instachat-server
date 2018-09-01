import createApp from './src';

const { app, server } = createApp();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    // @ts-ignore
    console.log(`App is running in localhost:${port}${server.graphqlPath}`);
});
