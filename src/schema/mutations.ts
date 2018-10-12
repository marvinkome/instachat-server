import { gql } from 'apollo-server-express';
import Invitation from '../models/invitation';
import { pubsub } from './index';

// models
import User from '../models/user';
import Group from '../models/group';
import Role from '../models/role';
import Perms from '../models/permission';
import Message from '../models/message';
import { authUser, userCan, generateInviteId } from './helpers';

export const mutationType = gql`
    type Mutation {
        addUser(username: String!, email: String!, password: String!): User
        updateUser(username: String!, email: String, password: String): User
        createGroup(name: String!, topic: String): Group
        joinGroup(inviteId: String!): Group
        createInvite(groupId: String!): String
        sendMessage(groupId: String!, message: String!): Message
        setTypingState(groupId: String!, state: Boolean!): Boolean
    }
`;

export const mutationResolver = {
    Mutation: {
        addUser: async (root: any, data: any) => {
            const user = new User(data);
            return await user.save();
        },
        updateUser: async (root: any, data: any, ctx: any) => {
            const user = await authUser(ctx.token);

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
        createGroup: async (root: any, data: any, ctx: any) => {
            const user = await authUser(ctx.token);
            const group = new Group(data);
            const role = Role.admin;

            // create group
            await group.save();

            // add user as admin in group
            // @ts-ignore
            const userGroup = await user.join_group(group, role);
            if (userGroup.err) {
                throw userGroup.err;
            }
            await user.save();

            pubsub.publish('chatLog', {
                // @ts-ignore
                chatLog: `${user.username} created this group`
            });

            return group;
        },
        joinGroup: async (root: any, data: any, ctx: any) => {
            // default role - User
            const role = Role.user;

            // get user
            const user = await authUser(ctx.token);

            // get group id from invite id
            const invitation = await Invitation.findOne({
                inviteId: data.inviteId
            });
            if (!invitation) {
                throw Error('Invitation link is bad');
            }

            // get group from id
            // @ts-ignore
            const groupId = invitation.group;
            const group = await Group.findById(groupId);

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

            // resolve user group
            return group;
        },
        createInvite: async (root: any, data: any, { token, req }: any) => {
            const user = await authUser(token);
            console.log(data);

            const group = await Group.findById(data.groupId);

            if (!group) {
                throw Error('Group not found');
            }

            // check if user is authorized to create link
            const authorized = await userCan(
                user,
                group,
                Perms.CREATE_USER_INVITE
            );
            if (!authorized) {
                // TODO
                throw Error('Only admins can create invite links');
            }

            // create invite id
            const { item } = await generateInviteId(group);

            // generate a fake link with the id
            const appUrl = req.protocol + '://' + req.get('host');
            // @ts-ignore
            const url = appUrl + '/invite/' + encodeURIComponent(item.inviteId);
            return url;
        },
        sendMessage: async (root: any, data: any, ctx: any) => {
            const user = await authUser(ctx.token);
            const group = await Group.findById(data.groupId);

            if (!group) {
                throw Error('Group not found');
            }

            // check if user is authorized to send message in this group
            const authorized = await userCan(user, group, Perms.SEND_MESSAGE);
            if (!authorized) {
                throw Error('You are not authorized to perform this action');
            }

            const message = new Message({
                message: data.message,
                from: user._id,
                toGroup: group._id
            });

            // TODO
            // await message.save();

            // publish change
            pubsub.publish('messageSent', {
                messageSent: message,
                group: group.id
            });

            return message;
        },
        setTypingState: async (root: any, data: any, ctx: any) => {
            const user = await authUser(ctx.token);
            const group = await Group.findById(data.groupId);

            if (!group) {
                throw Error('Group not found');
            }

            pubsub.publish('setTypingState', {
                userTyping: {
                    user,
                    isTyping: data.state
                },
                group: group.id
            });

            return null;
        }
    }
};
