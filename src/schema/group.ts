import { gql } from 'apollo-server-express';
import Message from '../models/message';
import User from '../models/user';
import { authUser } from './helpers';

export const groupType = gql`
    type Group {
        id: ID!
        name: String!
        topic: String
        image: String
        createdOn: String
        role: Role
        lastMessage: Message
        unreadCount: Int
        members: [User]
        lastViewed: String
        lastViewedMessage: String
        viewing: Boolean
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
        async lastViewed(group: any, args: any, { token }: any) {
            const user = await authUser(token);
            // @ts-ignore
            const groups = user.groups;

            // filter groups and get the group
            const filteredGroup = groups.find(
                (item: any) => String(item.group) === group.id
            );

            if (!filteredGroup) {
                return null;
            }
            return filteredGroup.lastViewed;
        },
        async lastViewedMessage(group: any, args: any, { token }: any) {
            const user = await authUser(token);
            // @ts-ignore
            const groups = user.groups;

            // filter groups and get the group
            const filteredGroup = groups.find(
                (item: any) => String(item.group) === group.id
            );

            if (!filteredGroup) {
                return null;
            }

            const viewTime = filteredGroup.lastViewed;

            const message = await Message.findOne({
                toGroup: group._id,
                timestamp: { $gt: viewTime }
            });

            return message ? message.id : null;
        },
        async viewing(group: any, args: any, { token }: any) {
            const user = await authUser(token);
            // @ts-ignore
            const groups = user.groups;

            // filter groups and get the group
            const filteredGroup = groups.find(
                (item: any) => String(item.group) === group.id
            );

            // return the role
            if (!filteredGroup) {
                return null;
            }
            return filteredGroup.viewing;
        },
        async lastMessage(group: any) {
            const messages = await Message.findOne({ toGroup: group._id }).sort(
                '-timestamp'
            );

            return messages;
        },
        async unreadCount(group: any, _: any, { token }: any) {
            const user = await authUser(token);

            // @ts-ignore
            const userGroup = user.groups.find(
                (i: any) => String(i.group) === group.id
            );

            if (!userGroup) {
                throw Error('Group not found');
            }

            if (userGroup.viewing) {
                return null;
            }

            const messages = await Message.find({ toGroup: group._id })
                .where('timestamp')
                .gt(userGroup.lastViewed || 0)
                .sort({ timestamp: -1 })
                .countDocuments();

            return messages;
        },
        async members(group: any) {
            return User.find({ 'groups.group': group._id });
        }
    }
};
