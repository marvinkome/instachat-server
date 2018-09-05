import { gql } from 'apollo-server-express';
import Message from '../models/message';

export const groupType = gql`
    type Group {
        id: ID!
        name: String!
        topic: String
        createdOn: String
        messages(first: Int, sort: Boolean): [Message]
    }
`;

export const groupResolvers = {
    Group: {
        messages: async (group: any, { first, sort }: any) => {
            const messages = await Message.find({ toGroup: group._id })
                .sort({ timestamp: sort ? -1 : 1 })
                .limit(first || null);
            return messages;
        }
    }
};
