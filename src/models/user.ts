import { model, Schema } from 'mongoose';
import { hash, compare } from 'bcrypt';

export const userSchema = new Schema({
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
    password: {
        type: String,
        required: true,
        maxlength: 128
    },
    about: {
        type: String,
        maxlength: 128
    },
    client_key: String,
    session_id: String
});

// presave - hash password
userSchema.pre('save', function(next) {
    // @ts-ignore
    const password = this.password;

    if (password) {
        const saltsRound = 10;
        hash(password, saltsRound, (err, passHash) => {
            // @ts-ignore
            this.password = passHash;
            next();
        });
    } else {
        next();
    }
});

// verify password
userSchema.methods.verify_password = function(password: string) {
    return compare(password, this.password);
};

const User = model('users', userSchema, 'users');

export default User;
