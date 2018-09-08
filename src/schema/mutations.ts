import { gql } from 'apollo-server-express';
import { format } from 'url';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '../../config';
import { pubsub } from './index';

// models
import User from '../models/user';
import Group from '../models/group';
import Role from '../models/role';
import Perms from '../models/permission';
import Message from '../models/message';
import { authUser, userCan, generateShortUrl } from './helpers';

export const mutationType = gql`
    type Mutation {
        addUser(username: String!, email: String!, password: String!): User
        createGroup(name: String!, topic: String): Group
        updateUser(username: String!, email: String, password: String): User
        joinGroup(groupId: String!, role: String): UserGroup
        sendMessage(groupId: String!, message: String!): Message
        createInvite(groupId: String!): String
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
        joinGroup: async (root: any, data: any, ctx: any) => {
            const user = await authUser(ctx.token);
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

            // await message.save();

            // publish change
            pubsub.publish('messageSent', {
                messageSent: message,
                group: group.id
            });

            return message;
        },
        createInvite: async (root: any, data: any, { token, req }: any) => {
            const user = await authUser(token);
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
                throw Error('Only admins can create invite links');
            }

            // create link with jwt
            // payload - { groupID }
            const jwttoken = sign({ groupId: group.id }, SECRET_KEY, {
                noTimestamp: true,
                expiresIn: '1h'
            });

            // url to invite
            const appUrl = req.protocol + '://' + req.get('host');
            const url = appUrl + '/jwt-invite/' + jwttoken;

            // shorten url
            const shortUrl = await generateShortUrl(url, appUrl);

            if (shortUrl.err) {
                throw Error('Cant generate url');
            }

            // @ts-ignore
            return shortUrl.item.shortUrl;
        }
    }
};
