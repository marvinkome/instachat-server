import { gql } from 'apollo-server-express';
import User from '../models/user';
import Group from '../models/group';
import { userRepository, groupRepository } from '../models';
import { addMemberToGroup } from '../models/helpers';

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
            const repo = await userRepository();
            const user = new User();
            user.username = data.username;
            user.email = data.email;
            user.password = data.password;

            return await repo.save(user);
        },
        createGroup: async (root: any, data: any) => {
            const repo = await groupRepository();
            const group = new Group();
            group.name = data.name;
            if (data.topic) {
                group.topic = data.topic;
            }

            return await repo.save(group);
        },
        addUserToGroup: async (root: any, data: any) => {
            const { err, group } = await addMemberToGroup(
                data.group,
                data.username,
                data.role
            );

            if (err) {
                throw err;
            }
            return group;
        }
    }
};
