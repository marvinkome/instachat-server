import Permissions from './permission';
import Role from './role';
import { roleRepository } from './index';

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
