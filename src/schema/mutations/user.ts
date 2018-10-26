import User from '../../models/user';
import { authUser, userCan } from '../helpers';

export const typeDef = `
    # Add a new user
    addUser(username: String!, email: String!, password: String!): User

    # Update existing user
    updateUser(username: String, email: String, about: String): User,

    # register device token for push notification
    registerDevice(token: String!): User
`;

export const resolvers = {
    addUser: async (root: any, data: any) => {
        const user = new User(data);
        return await user.save();
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
        if (data.about) {
            // @ts-ignore
            user.about = data.about;
        }

        return user.save();
    },

    registerDevice: async (root: any, data: any, ctx: any) => {
        const user = await authUser(ctx.token);

        // @ts-ignore
        user.deviceToken = data.token;
        return user.save();
    }
};
