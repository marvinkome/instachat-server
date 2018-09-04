import { gql } from 'apollo-server-express';
import User from '../models/user';
import Group from '../models/group';

export const queryType = gql`
    type Query {
        user: User
        group(id: String!): Group
    }
`;

export const queryResolver = {
    Query: {
        user: async (root: any, data: any, ctx: any) => {
            // get token from context
            const token: string = ctx.token;

            // check if token is falsy aka: bad auth header
            if (!token) {
                throw Error(`No authorization header. Please put token in header
                with this format - \'Bearer <token>\'`);
            }

            // get the user
            const user = await User.findOne({ authKey: token });
            return user;
        },
        group: async (root: any, { id }: any) => {
            const group = await Group.findById(id);
            return group;
        }
    }
};
