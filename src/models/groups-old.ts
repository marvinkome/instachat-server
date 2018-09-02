import { Schema, model } from 'mongoose';

export const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 24
    },
    topic: String,
    created_on: Date,

    // relationships
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

groupSchema.pre('save', function(next) {
    const currentDate = new Date();

    // @ts-ignore
    if (!this.created_on) {
        // @ts-ignore
        this.created_on = currentDate;
    }

    next();
});

const group = model('Group', groupSchema, 'groups');

export default group;
