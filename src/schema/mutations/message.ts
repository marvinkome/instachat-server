import { authUser, userCan } from '../helpers';
import { pubsub } from '../index';

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

        // TODO
        // await message.save();

        // publish change
        pubsub.publish('messageSent', {
            messageSent: message,
            group: group.id
        });

        return message;
    }
};
