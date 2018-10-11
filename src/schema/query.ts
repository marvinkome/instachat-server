import { gql } from 'apollo-server-express';
import User from '../models/user';
import Group from '../models/group';
import { authUser } from './helpers';

export const queryType = gql`
    type Query {
        user: User
        group(id: String!): Group
        groups: [Group]
    }
`;

export const queryResolver = {
    Query: {
        user: async (root: any, data: any, ctx: any) => {
            // auth user
            return authUser(ctx.token);
        },
        group: async (root: any, { id }: any) => {
            const group = await Group.findById(id);
            return group;
        },
        groups: async (root: any, data: any, ctx: any) => {
            const user = await authUser(ctx.token);

            // @ts-ignore
            const userGroups = user.groups;
            const groups = userGroups.map(async (item: any) => {
                const group = await Group.findById(item.group);
                return group;
            });

            return groups;
        }
    }
};
