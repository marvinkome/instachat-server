import { Schema, model } from 'mongoose';

const invitationSchema = new Schema({
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    inviteId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now() }
});

const invitation = model('Invitation', invitationSchema);

export default invitation;
