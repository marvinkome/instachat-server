import { gql } from 'apollo-server-express';
import User from '../models/user';
import { userRepository } from '../models';

export const mutationType = gql`
    type Mutation {
        addUser(username: String!, email: String!, password: String!): User
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
        }
    }
};
