import { gql } from 'apollo-server-express';

export const userType = gql`
    type User {
        username: String!
        email: String!
        password: String!
        about: String
        client_key: String
        session_id: String
    }
`;
