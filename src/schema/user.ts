import { gql } from 'apollo-server-express';

export const userType = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        about: String
        clientId: String
        sessionId: String
    }
`;

export const userResolvers = {
    User: {}
};
