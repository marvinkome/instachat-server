import { gql } from 'apollo-server-express';
import { userRepository } from '../models';

export const queryType = gql`
    type Query {
        hello: String
        users: [User]
    }
`;

export const queryResolver = {
    Query: {
        hello: () => 'hello',
        users: async () => {
            const repo = await userRepository();
            const users = await repo.find();

            return users;
        }
    }
};
