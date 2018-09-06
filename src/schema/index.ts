import { makeExecutableSchema, PubSub } from 'apollo-server-express';

// types and resolvers
import { queryType, queryResolver } from './query';
import { mutationType, mutationResolver } from './mutations';
import { subscriptionType, subscriptionResolver } from './subscriptions';
import { userType, userResolvers } from './user';
import { groupType, groupResolvers } from './group';
import { messageType, messageResolvers } from './message';

export const pubsub = new PubSub();

export const schema = makeExecutableSchema({
    typeDefs: [
        queryType,
        mutationType,
        subscriptionType,
        userType,
        groupType,
        messageType
    ],
    resolvers: [
        queryResolver,
        mutationResolver,
        subscriptionResolver,
        groupResolvers,
        userResolvers,
        messageResolvers
    ]
});
