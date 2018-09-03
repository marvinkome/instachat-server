import Permissions from './permission';
import Role from './role';
import UserGroup from './userGroup';
import {
    roleRepository,
    userRepository,
    groupRepository,
    userGroupRepository
} from './index';

export function createRoles() {
    // create all default roles
    const roles: {
        [key: string]: {
            permission: number;
            default: boolean;
        };
    } = {
        user: {
            permission: Permissions.SEND_MESSAGE,
            default: true
        },
        moderator: {
            permission: Permissions.SEND_MESSAGE | Permissions.DELETE_MESSAGE,
            default: false
        },
        administrator: {
            permission:
                Permissions.SEND_MESSAGE |
                Permissions.DELETE_MESSAGE |
                Permissions.DELETE_USER |
                Permissions.CREATE_USER_INVITE,
            default: false
        }
    };

    Object.keys(roles).forEach(async (r) => {
        // check if role exists
        const repo = await roleRepository();
        const role = await repo.findOne({ name: r });

        // if it doesn't create a new one
        if (!role) {
            const newRole = new Role();
            newRole.name = r;

            // insert permissions and make it default if true
            newRole.permission = roles[r].permission;
            newRole.default = roles[r].default;

            // save role
            repo.save(newRole);
        }
    });
}

export async function addMemberToGroup(
    groupName: string,
    username: string,
    rolename?: string
) {
    try {
        // get repos
        const groupRepo = await groupRepository();
        const userRepo = await userRepository();
        const roleRepo = await roleRepository();

        // find models
        const group = await groupRepo.findOne({ name: groupName });
        const user = await userRepo.findOne({ username });
        const role = rolename
            ? await roleRepo.findOne({ name: rolename })
            : await roleRepo.findOne({ default: true });

        if (!user) {
            return {
                err: 'User not found'
            };
        }

        if (!group) {
            return {
                err: 'User not found'
            };
        }

        if (!role) {
            return {
                err: 'No role with that name'
            };
        }

        // add user to group with default role
        const link = new UserGroup();
        link.user = user;
        link.group = group;
        link.role = role;
        const repo = await userGroupRepository();
        repo.save(link);

        return {
            group
        };
    } catch (err) {
        return {
            err
        };
    }
}
