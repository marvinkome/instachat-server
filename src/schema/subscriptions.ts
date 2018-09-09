import { gql, withFilter } from 'apollo-server-express';
import { pubsub } from './index';

export const subscriptionType = gql`
    type Subscription {
        chatLog: String
        messageSent(groupId: String): Message
    }
`;

export const subscriptionResolver = {
    Subscription: {
        chatLog: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('chatLog'),
                (payload, variables) => {
                    return payload.group === variables.groupId;
                }
            )
        },
        messageSent: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('messageSent'),
                (payload, variables) => {
                    return payload.group === variables.groupId;
                }
            )
        }
    }
};
