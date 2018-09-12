import { Schema, model } from 'mongoose';

export const messageSchema = new Schema({
    message: String,
    timestamp: {
        default: Date.now,
        type: Date
    },
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    toGroup: { type: Schema.Types.ObjectId, ref: 'Group' }
});

const message = model('Message', messageSchema);
export default message;
