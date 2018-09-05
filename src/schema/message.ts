import { gql } from 'apollo-server-express';
import User from '../models/user';
import Group from '../models/group';

export const messageType = gql`
    type Message {
        id: ID!
        message: String
        timestamp: String
        from: User
        toGroup: Group
    }
`;

export const messageResolvers = {
    Message: {
        from: async (message: any) => {
            // get user from id
            const user = await User.findById(message.from);
            return user;
        },
        toGroup: async (message: any) => {
            // get group from id
            const group = await Group.findById(message.toGroup);
            return group;
        }
    }
};
