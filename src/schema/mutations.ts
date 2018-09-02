import { gql } from 'apollo-server-express';
import User from '../models/user';

export const mutationType = gql`
    type Mutation {
        addUser(username: String!, email: String!, password: String!): User
    }
`;

export const mutationResolver = {
    Mutation: {
        addUser: async (root: any, data: any) => {
            const user = new User(data);
            const res = await user.save();
            return res;
        }
    }
};
