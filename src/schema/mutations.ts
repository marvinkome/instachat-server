import { gql } from 'apollo-server-express';
import User from '../models/user';
import Group from '../models/group';
// import { userRepository, groupRepository } from '../models';
// import { addMemberToGroup } from '../models/helpers';

export const mutationType = gql`
    type Mutation {
        addUser(username: String!, email: String!, password: String!): User
        createGroup(name: String!, topic: String): Group
        addUserToGroup(username: String!, group: String!, role: String): Group
    }
`;

export const mutationResolver = {
    Mutation: {
        addUser: async (root: any, data: any) => {
            const user = new User(data);
            return await user.save();
        },
        createGroup: async (root: any, data: any) => {
            const group = new Group(data);
            return await group.save();
        }
        // addUserToGroup: async (root: any, data: any) => {
        //     const { err, group } = await addMemberToGroup(
        //         data.group,
        //         data.username,
        //         data.role
        //     );

        //     if (err) {
        //         throw err;
        //     }
        //     return group;
        // }
    }
};
