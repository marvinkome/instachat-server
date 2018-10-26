import { makeExecutableSchema, PubSub } from 'apollo-server-express';
import FCMPush from 'fcm-push';

import { SERVER_KEY } from '../../config';
// types and resolvers
import { queryType, queryResolver } from './query';
import { mutationType, mutationResolver } from './mutations';
import { subscriptionType, subscriptionResolver } from './subscriptions';
import { userType, userResolvers } from './user';
import { groupType, groupResolvers } from './group';
import { messageType, messageResolvers } from './message';

export const pubsub = new PubSub();
export const fcm = new FCMPush(SERVER_KEY);

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
