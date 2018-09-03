import { makeExecutableSchema } from 'apollo-server-express';
import { queryType, queryResolver } from './query';
import { mutationType, mutationResolver } from './mutations';
import { userType, userResolvers } from './user';
import { groupType, groupResolvers } from './group';

export const schema = makeExecutableSchema({
    typeDefs: [queryType, mutationType, userType, groupType],
    resolvers: [queryResolver, mutationResolver, groupResolvers, userResolvers]
});
