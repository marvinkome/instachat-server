import { gql, withFilter } from 'apollo-server-express';
import { pubsub } from './index';

export const subscriptionType = gql`
    type Subscription {
        demoAction: String
        messageSent(groupId: String): Message
    }
`;

export const subscriptionResolver = {
    Subscription: {
        demoAction: {
            subscribe: () => pubsub.asyncIterator(['DEMO'])
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
