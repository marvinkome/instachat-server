import { gql } from 'apollo-server-express';
import User from '../models/user';

export const queryType = gql`
    type Query {
        hello: String
        user(id: String!): User
        groups: String
    }
`;

export const queryResolver = {
    Query: {
        hello: () => 'Hello',
        user: async (root: any, { id }: any) => {
            const user = await User.findById(id);
            return user;
        }
        // groups: async () => {
        //     const groups = await (await groupRepository())
        //         .createQueryBuilder('group')
        //         .innerJoinAndSelect('group.userAssocs', 'userGroup')
        //         .innerJoinAndSelect('userGroup.role', 'role')
        //         .innerJoinAndSelect('userGroup.user', 'user')
        //         .getMany();

        //     return groups;
        // }
    }
};
