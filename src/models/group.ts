import { Schema, model } from 'mongoose';

export const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32
    },
    topic: String,
    createdOn: Date
});

groupSchema.pre('save', function(next) {
    // @ts-ignore
    if (!this.createdOn) {
        // @ts-ignore
        this.createdOn = new Date();
    }

    next();
});

const group = model('Group', groupSchema);
export default group;
