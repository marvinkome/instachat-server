import { gql } from 'apollo-server-express';
import User from '../models/user';
import Group from '../models/group';

export const queryType = gql`
    type Query {
        hello: String
        user(id: String!): User
        group(id: String!): Group
    }
`;

export const queryResolver = {
    Query: {
        hello: () => 'Hello',
        user: async (root: any, { id }: any) => {
            const user = await User.findById(id);
            return user;
        },
        group: async (root: any, { id }: any) => {
            const group = await Group.findById(id);
            return group;
        }
    }
};
