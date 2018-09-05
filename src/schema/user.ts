import { gql } from 'apollo-server-express';
import Group from '../models/group';
import Message from '../models/message';

export const userType = gql`
    type Role {
        name: String!
        permission: Int!
    }

    type UserGroup {
        group: Group
        role: Role
    }

    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        about: String
        clientId: String
        sessionId: String
        userGroups: [UserGroup]
        userGroup(groupId: String!): UserGroup
        sentMessages: [Message]
    }
`;

export const userResolvers = {
    User: {
        userGroups: (user: any) => {
            const groups = user.groups;
            // map
            return groups.map(async (item: any) => {
                const group = await Group.findById(item.group);
                return {
                    role: item.role,
                    group
                };
            });
        },
        userGroup: async (user: any, { groupId }: any) => {
            const groups = user.groups;

            // filter groups and get the group
            const filteredGroup = groups.filter((item: any) => {
                return String(item.group) === groupId;
            })[0];

            // map
            const group = await Group.findById(filteredGroup.group);

            return {
                role: filteredGroup.role,
                group
            };
        },
        sentMessages: async (user: any) => {
            const messages = await Message.find({ from: user._id }).exec();
            return messages;
        }
    }
};
