import { authUser, userCan, generateInviteId } from '../helpers';

import Invitation from '../../models/invitation';
import Group from '../../models/group';
import Role from '../../models/role';
import Perms from '../../models/permission';

export const typeDef = `
    # create a new group
    createGroup(name: String!, topic: String, image: String): Group

    # add user to group with inviteId
    joinGroup(inviteId: String!): Group

    # Create invite link to join group
    createInvite(groupId: String!): String
`;

export const resolvers = {
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
        const authorized = await userCan(user, group, Perms.CREATE_USER_INVITE);
        if (!authorized) {
            throw Error('Only admins can create invite links');
        }

        // create invite id
        const { item } = await generateInviteId(group);

        // generate a fake link with the id
        const appUrl = req.protocol + '://' + req.get('host');

        // @ts-ignore
        const url = appUrl + '/invite/' + encodeURIComponent(item.inviteId);
        return url;
    }
};
