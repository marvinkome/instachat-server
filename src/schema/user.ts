import { gql } from 'apollo-server-express';

export const userType = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        about: String
        clientId: String
        sessionId: String
        """
         should only be used with groups
        """
        role: String
        groups: [Group]
    }
`;

export const userResolvers = {
    User: {
        groups: (root: any) => {
            const groups = root.groupAssocs.reduce(
                (total: any[], curr: any) => {
                    total.push({
                        ...curr.group
                    });

                    return total;
                },
                []
            );

            return groups;
        }
    }
};
