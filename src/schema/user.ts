import { gql } from 'apollo-server-express';
import Group from '../models/group';

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
        groups: [UserGroup]
    }
`;

export const userResolvers = {
    User: {
        groups: (root: any) => {
            // map
            const userGroup = root.groups.map(async (item: any) => {
                const group = await Group.findById(item.group);
                return {
                    role: item.role,
                    group
                };
            });

            return userGroup;
        }
    }
};
