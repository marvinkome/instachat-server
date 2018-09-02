import { gql } from 'apollo-server-express';
import User from '../models/user';

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
            const res = await User.find({});
            return res;
        }
    }
};
