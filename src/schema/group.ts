import { gql } from 'apollo-server-express';
import Message from '../models/message';
import User from '../models/user';
import { authUser } from './helpers';

export const groupType = gql`
    type Group {
        id: ID!
        name: String!
        topic: String
        createdOn: String
        role: Role
        lastMessage: Message
        unreadCount: Int
        members: [User]
        messages(first: Int, sort: Boolean, after: String): [Message]
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
        async lastMessage(group: any) {
            const messages = await Message.findOne({ toGroup: group._id }).sort(
                '-timestamp'
            );

            return messages;
        },
        async unreadCount(group: any, _: any, { token }: any) {
            const user = await authUser(token);
            const messages = await Message.find({ toGroup: group._id })
                .where('timestamp')
                // @ts-ignore
                .gt(user.lastSeen || 0)
                .sort({ timestamp: -1 })
                .countDocuments();

            return messages;
        },
        async members(group: any) {
            return User.find({ 'groups.group': group._id });
        }
    }
};
