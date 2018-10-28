import { gql } from 'apollo-server-express';
import Group from '../models/group';
import Message from '../models/message';

export const userType = gql`
    type Role {
        name: String!
        permission: Int!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        about: String
        clientId: String
        sessionId: String
        active: Boolean
        lastSeen: String
        deviceToken: String
        profilePic: String
        groups: [Group]
        group(groupId: String!): Group
        sentMessages: [Message]
    }
`;

export const userResolvers = {
    User: {
        groups: async (user: any) => {
            const userGroups = user.groups;
            const groups = userGroups.map(async (item: any) => {
                const group = await Group.findById(item.group);
                return group;
            });

            return groups;
        },
        group: async (user: any, { groupId }: any) => {
            const groups = user.groups;

            // filter groups and get the group
            const filteredGroup = groups.filter(
                (item: any) => String(item.group) === groupId
            )[0];

            // map
            const group = await Group.findById(filteredGroup.group);

            return group;
        },
        sentMessages: async (user: any) => {
            const messages = await Message.find({ from: user._id })
                .sort({ timestamp: -1 })
                .exec();
            return messages;
        }
    }
};
