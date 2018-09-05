import { gql } from 'apollo-server-express';
import User from '../models/user';
import Group from '../models/group';
import { authUser } from './helpers';

export const queryType = gql`
    type Query {
        user: User
        group(id: String!): Group
    }
`;

export const queryResolver = {
    Query: {
        user: async (root: any, data: any, ctx: any) => {
            // auth user
            return authUser(ctx);
        },
        group: async (root: any, { id }: any) => {
            const group = await Group.findById(id);
            return group;
        }
    }
};
