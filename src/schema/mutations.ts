import { gql } from 'apollo-server-express';
import User from '../models/user';
import Group from '../models/group';
import Role from '../models/role';
// import { userRepository, groupRepository } from '../models';
// import { addMemberToGroup } from '../models/helpers';

export const mutationType = gql`
    type Mutation {
        addUser(username: String!, email: String!, password: String!): User
        createGroup(name: String!, topic: String): Group
        joinGroup(userId: String!, groupId: String!, role: String): UserGroup
    }
`;

export const mutationResolver = {
    Mutation: {
        addUser: async (root: any, data: any) => {
            const user = new User(data);
            return await user.save();
        },
        createGroup: async (root: any, data: any) => {
            const group = new Group(data);
            return await group.save();
        },
        joinGroup: async (root: any, data: any) => {
            const user = await User.findById(data.userId);
            const group = await Group.findById(data.groupId);
            let role = Role.user;

            if (data.role) {
                // check if role is available
                const roles = Object.keys(Role);
                if (data.role in roles) {
                    // @ts-ignore
                    role = Role[data.role];
                }
            }

            if (!user) {
                throw Error('User not found');
            }

            if (!group) {
                throw Error('Group not found');
            }

            // @ts-ignore
            const { err, res } = user.join_group(group, role);

            if (err) {
                throw err;
            }

            await user.save();
            return res;
        }
    }
};
