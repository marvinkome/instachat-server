import { authUser, userCan } from '../helpers';
import { pubsub, fcm } from '../index';

import Group from '../../models/group';
import Perms from '../../models/permission';
import Message from '../../models/message';

export const typeDef = `
    # Send message to group
    sendMessage(groupId: String!, message: String!): Message
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

        await message.save();

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
                    msg: `${user.username}: ${message.message}`,
                    // @ts-ignore
                    groupImg: group.image,
                    msgId: message._id,
                    groupId: data.groupId
                }
            });
        } catch (e) {
            throw Error(e);
        }

        return message;
    }
};
