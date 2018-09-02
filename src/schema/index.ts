import { makeExecutableSchema } from 'apollo-server-express';
import { queryType, queryResolver } from './query';
import { mutationType, mutationResolver } from './mutations';
import { userType } from './user';

export const schema = makeExecutableSchema({
    typeDefs: [queryType, mutationType, userType],
    resolvers: [queryResolver, mutationResolver]
});
