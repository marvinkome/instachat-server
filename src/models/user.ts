import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 24
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 64
    },
    about: {
        type: String,
        maxlength: 128
    },
    client_key: String,
    session_id: String,
    password: String
});

// presave - hash password
userSchema.pre('save', async function(next) {
    // @ts-ignore
    const password = this.password;

    if (password) {
        const saltsRound = 100;

        try {
            const hash = await bcrypt.hash(password, saltsRound);

            // @ts-ignore
            this.password = hash;
            next();
        } catch (e) {
            throw e;
        }
    } else {
        next();
    }
});

// verify password
userSchema.methods.verify_password = async function(password) {
    const match = await bcrypt.compare(password, this.password);
    return match;
};

const User = mongoose.model('users', userSchema);

export default User;
