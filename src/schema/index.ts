import { gql, ApolloServer } from 'apollo-server-express';

const typeDefs = gql`
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello World'
    }
};

export default (app: Express.Application) => {
    const server = new ApolloServer({ typeDefs, resolvers });
    // @ts-ignore
    server.applyMiddleware({ app });

    return server;
};
