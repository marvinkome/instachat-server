import { authUser, userCan } from '../helpers';
import { pubsub, fcm } from '../index';
import { CLIENT_KEY } from '../../../config';

import Group from '../../models/group';
import Perms from '../../models/permission';
import Message from '../../models/message';

export const typeDef = `
    # Send message to group
    sendMessage(groupId: String!, message: String!): Message
    sendNotification: Boolean
    sendTopicNotification(groupId: String!): Boolean
`;

export const resolvers = {
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

        // send push notification
        try {
            fcm.send({
                to: `/topics/${data.groupId}`,
                collapse_key: 'new_message',
                delay_while_idle: false,
                data: {
                    // @ts-ignore
                    title: group.name,
                    // @ts-ignore
                    msg: message.message,
                    msgId: message._id,
                    groupId: data.groupId
                }
            });
            return true;
        } catch (e) {
            throw Error(e);
        }

        return message;
    },
    sendNotification: async (root: any, data: any) => {
        try {
            fcm.send({
                to: CLIENT_KEY,
                notification: {
                    title: 'Notification Title',
                    message: 'Notification Message'
                }
            });
            return true;
        } catch (e) {
            throw Error(e);
        }
    },
    sendTopicNotification: async (root: any, data: any) => {
        try {
            fcm.send({
                to: `/topics/${data.groupId}`,
                collapse_key: 'new_message',
                delay_while_idle: false,
                data: {
                    title: 'title',
                    msg: 'some data',
                    groupId: data.groupId
                }
            });
            return true;
        } catch (e) {
            throw Error(e);
        }
    }
};
