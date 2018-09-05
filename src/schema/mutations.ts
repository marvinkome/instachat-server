import { gql } from 'apollo-server-express';
import User from '../models/user';
import Group from '../models/group';
import Role from '../models/role';
import Message from '../models/message';
import { authUser } from './helpers';

export const mutationType = gql`
    type Mutation {
        addUser(username: String!, email: String!, password: String!): User
        createGroup(name: String!, topic: String): Group
        updateUser(username: String!, email: String, password: String): User
        joinGroup(groupId: String!, role: String): UserGroup
        sendMessage(groupId: String!, message: String!): Message
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
        updateUser: async (root: any, data: any, ctx: any) => {
            const user = await authUser(ctx);

            // update username
            if (data.username) {
                // @ts-ignore
                user.username = data.username;
            }

            // update email
            if (data.email) {
                // @ts-ignore
                user.email = data.email;
            }

            // update password
            if (data.password) {
                // @ts-ignore
                user.password = data.password;
            }

            return user.save();
        },
        joinGroup: async (root: any, data: any, ctx: any) => {
            const user = await authUser(ctx);
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
        },
        sendMessage: async (root: any, data: any, ctx: any) => {
            const user = await authUser(ctx);
            const group = await Group.findById(data.groupId);

            if (!group) {
                throw Error('Group not found');
            }

            const message = new Message({
                message: data.message,
                from: user._id,
                toGroup: group._id
            });

            return message.save();
        }
    }
};
