import { gql } from 'apollo-server-express';

export const groupType = gql`
    type Group {
        id: ID!
        name: String!
        topic: String
        createdOn: String
    }
`;

export const groupResolvers = {
    Group: {}
};
