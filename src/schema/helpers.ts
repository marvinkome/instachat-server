import User from '../models/user';
import Invitation from '../models/invitation';
import { generate } from 'shortid';
import { Document } from 'mongoose';

export async function authUser(token: string) {
    // check if token is falsy aka: bad auth header
    if (!token.length) {
        throw Error(`No authorization header. Please put token in header
                with this format - \'Bearer <token>\'`);
    }

    // get the user
    const user = await User.findOne({ authKey: token });

    if (!user) {
        throw Error(
            "Can't authenticate, possibly because of user is logged on else where"
        );
    }

    return user;
}

export async function generateInviteId(group: Document) {
    // check if group invite exists
    const item = await Invitation.findOne({ group });
    if (item) {
        return { item };
    }

    // no item create new invite id
    const inviteId = generate();
    const invite = new Invitation({
        group,
        inviteId
    });

    await invite.save();
    return { item: invite };
}

export async function userCan(user: any, group: any, permission: any) {
    // check if user is authorized to send message in this group
    const userGroup = user.groups.find(
        (item: any) => String(item.group) === group.id
    );

    if (!userGroup) {
        return false;
    }

    if ((userGroup.role.permission & permission) !== permission) {
        return false;
    }

    return true;
}
