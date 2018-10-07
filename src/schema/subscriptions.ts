import { gql, withFilter } from 'apollo-server-express';
import { pubsub } from './index';

export const subscriptionType = gql`
    type UserTyping {
        user: User
        isTyping: Boolean
    }
    type Subscription {
        chatLog: String
        userTyping(groupId: String): UserTyping
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
        userTyping: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('setTypingState'),
                (payload, variables, context) => {
                    return (
                        payload.userTyping.user.id !== context.currentUser.id &&
                        payload.group === variables.groupId
                    );
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
