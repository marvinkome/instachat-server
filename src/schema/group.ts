import { gql } from 'apollo-server-express';
import Message from '../models/message';

export const groupType = gql`
    type Group {
        id: ID!
        name: String!
        topic: String
        createdOn: String
        messages: [Message]
    }
`;

export const groupResolvers = {
    Group: {
        messages: async (group: any) => {
            const messages = await Message.find({ toGroup: group._id }).exec();
            return messages;
        }
    }
};
