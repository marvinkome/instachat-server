import { gql } from 'apollo-server-express';
import Message from '../models/message';
import { authUser } from './helpers';

export const groupType = gql`
    type Group {
        id: ID!
        name: String!
        topic: String
        createdOn: String
        messages(first: Int, sort: Boolean, after: String): [Message]
        role: Role
        lastMessage: Message
        numberOfNewMessages(messageTimestamp: String!): Int!
    }
`;

export const groupResolvers = {
    Group: {
        async messages(group: any, { first, sort, after }: any) {
            const messages = await Message.find({ toGroup: group._id })
                .where('timestamp')
                .gt(after || 0)
                .sort({ timestamp: sort ? -1 : 1 })
                .limit(first || null);

            return messages;
        },
        async role(group: any, args: any, { token }: any) {
            try {
                const user = await authUser(token);
                // @ts-ignore
                const groups = user.groups;

                // filter groups and get the group
                const filteredGroup = groups.filter(
                    (item: any) => String(item.group) === group.id
                )[0];

                // return the role
                return filteredGroup.role;
            } catch (e) {
                return null;
            }
        },
        async lastMessage(group: any, args: any) {
            const messages = await Message.findOne({ toGroup: group._id }).sort(
                '-timestamp'
            );

            return messages;
        },
        async numberOfNewMessages(group: any, { messageTimestamp }: any) {
            const messages = await Message.find({ toGroup: group._id })
                .where('timestamp')
                .gt(messageTimestamp || 0)
                .sort({ timestamp: -1 })
                .countDocuments();

            return messages;
        }
    }
};
