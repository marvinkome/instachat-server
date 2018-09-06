import { gql } from 'apollo-server-express';
import { pubsub } from './index';

// models
import User from '../models/user';
import Group from '../models/group';
import Role from '../models/role';
import Perms from '../models/permission';
import Message from '../models/message';
import { authUser } from './helpers';

export const mutationType = gql`
    type Mutation {
        addUser(username: String!, email: String!, password: String!): User
        createGroup(name: String!, topic: String): Group
        updateUser(username: String!, email: String, password: String): User
        joinGroup(groupId: String!, role: String): UserGroup
        sendMessage(groupId: String!, message: String!): Message
        demoAction(text: String!): String
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
            const userGroup = await user.join_group(group, role);

            if (userGroup.err) {
                throw userGroup.err;
            }

            await user.save();
            return userGroup;
        },
        sendMessage: async (root: any, data: any, ctx: any) => {
            const user = await authUser(ctx);
            const group = await Group.findById(data.groupId);

            if (!group) {
                throw Error('Group not found');
            }

            // check if user is authorized to send message in this group
            // @ts-ignore
            const userGroup = user.groups.find(
                (item: any) => String(item.group) === group.id
            );

            if (!userGroup) {
                throw Error("Can't send message in a group you're not among");
            }

            if (
                (userGroup.role.permission & Perms.SEND_MESSAGE) !==
                Perms.SEND_MESSAGE
            ) {
                throw Error(
                    "You're not permitted to send message in this group"
                );
            }

            const message = new Message({
                message: data.message,
                from: user._id,
                toGroup: group._id
            });

            // await message.save();

            // publish change
            pubsub.publish('messageSent', {
                messageSent: message,
                group: group.id
            });

            return message;
        },
        demoAction: (root: any, data: any) => {
            pubsub.publish('DEMO', { demoAction: data.text });
            return data.text;
        }
    }
};
