import { gql } from 'apollo-server-express';

export const userType = gql`
    type User {
        username: String!
        email: String!
        password: String!
        about: String
        clientId: String
        sessionId: String
    }
`;
