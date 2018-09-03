import { gql } from 'apollo-server-express';

export const groupType = gql`
    type Group {
        id: ID!
        name: String!
        topic: String
        createdOn: String
        users: [User]
    }
`;

export const groupResolvers = {
    Group: {
        users: (root: any) => {
            const users = root.userAssocs.reduce((total: any[], curr: any) => {
                total.push({
                    ...curr.user,
                    role: curr.role.name
                });

                return total;
            }, []);

            return users;
        }
    }
};
