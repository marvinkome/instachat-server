import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';

export const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        maxlength: 24,
        required: true
    },
    email: {
        type: String,
        unique: true,
        maxlength: 64,
        required: true
    },
    password: {
        type: String,
        maxlength: 128,
        required: true
    },
    about: String,
    authKey: String,
    sessionId: String,
    groups: [
        {
            group: Schema.Types.ObjectId,
            role: String
        }
    ]
});

userSchema.pre('save', async function(next) {
    // @ts-ignore
    this.pasword = await hash(this.password, 10);
    next();
});

userSchema.methods.verify_password = function(password: string) {
    return compare(password, this.password);
};

const userModel = model('User', userSchema);
export default userModel;
