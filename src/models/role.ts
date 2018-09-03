import Permissions from './permission';

export default {
    user: {
        name: 'user',
        permission: Permissions.SEND_MESSAGE
    },
    mod: {
        name: 'moderator',
        permission: Permissions.SEND_MESSAGE | Permissions.DELETE_MESSAGE
    },
    admin: {
        name: 'administrator',
        permission:
            Permissions.SEND_MESSAGE |
            Permissions.DELETE_MESSAGE |
            Permissions.DELETE_USER |
            Permissions.CREATE_USER_INVITE
    }
};
