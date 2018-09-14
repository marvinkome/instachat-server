import { gql } from 'apollo-server-express';
import Message from '../models/message';
import { authUser } from './helpers';

export const groupType = gql`
    type Group {
        id: ID!
        name: String!
        topic: String
        createdOn: String
        messages(first: Int, sort: Boolean): [Message]
        role: Role
    }
`;

export const groupResolvers = {
    Group: {
        messages: async (group: any, { first, sort }: any) => {
            const messages = await Message.find({ toGroup: group._id })
                .sort({ timestamp: sort ? -1 : 1 })
                .limit(first || null);
            return messages;
        },
        role: async (group: any, args: any, { token }: any) => {
            try {
                const user = await authUser(token);
                // @ts-ignore
                const groups = user.groups;

                // filter groups and get the group
                const filteredGroup = groups.filter(
                    (item: any) => String(item.group) === group.id
                )[0];

                // return the role
                return filteredGroup.role;
            } catch (e) {
                return null;
            }
        }
    }
};
