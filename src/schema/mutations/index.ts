import { gql } from 'apollo-server-express';

import * as GroupMutations from './group';
import * as UserMutations from './user';
import * as MessageMutations from './message';
import * as MiscMutations from './misc';

export const mutationType = gql`
    # root mutation
    type Mutation {
        ${GroupMutations.typeDef}

        ${UserMutations.typeDef}

        ${MessageMutations.typeDef}

        ${MiscMutations.typeDef}
    }
`;

export const mutationResolver = {
    Mutation: {
        ...GroupMutations.resolvers,
        ...UserMutations.resolvers,
        ...MessageMutations.resolvers,
        ...MiscMutations.resolvers
    }
};
