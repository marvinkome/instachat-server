import { gql } from 'apollo-server-express';
import { userRepository, groupRepository } from '../models';

export const queryType = gql`
    type Query {
        hello: String
        users: [User]
        groups: [Group]
    }
`;

export const queryResolver = {
    Query: {
        hello: () => 'Hello',
        users: async (root: any, arg: any, ctx: any) => {
            console.log(ctx);

            const users = await (await userRepository())
                .createQueryBuilder('user')
                .innerJoinAndSelect('user.groupAssocs', 'userGroup')
                .innerJoinAndSelect('userGroup.role', 'role')
                .innerJoinAndSelect('userGroup.group', 'group')
                .getMany();

            return users;
        },
        groups: async () => {
            const groups = await (await groupRepository())
                .createQueryBuilder('group')
                .innerJoinAndSelect('group.userAssocs', 'userGroup')
                .innerJoinAndSelect('userGroup.role', 'role')
                .innerJoinAndSelect('userGroup.user', 'user')
                .getMany();

            return groups;
        }
    }
};
