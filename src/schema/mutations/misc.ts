import { authUser, userCan, generateInviteId } from '../helpers';
import { pubsub } from '../index';

import User from '../../models/user';
import Group from '../../models/group';

export const typeDef = `
    # Set typing state for group
    setTypingState(groupId: String!, state: Boolean!): Boolean

    viewingStatus(groupId: String!, viewing: Boolean!): Boolean
`;

export const resolvers = {
    async setTypingState(root: any, data: any, ctx: any) {
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
    },

    async viewingStatus(root: any, data: any, ctx: any) {
        const user = await authUser(ctx.token);
        const group = await Group.findById(data.groupId);

        if (!group) {
            throw Error('Group not found');
        }

        // toggle viewing status
        // if viewing status is false(not-viewing) set lastViewed
        const q = await User.updateOne(
            { "_id": user.id, 'groups.group': group._id },
            {
                $set: {
                    'groups.$.viewing': data.viewing,
                    ...(!data.viewing && {
                        'groups.$.lastViewed': new Date()
                    })
                }
            }
        );

        return null;
    }
};
