import { model, Schema } from 'mongoose';
import { hash, compare } from 'bcrypt';

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
userSchema.pre('save', function(next) {
    // @ts-ignore
    const password = this.password;

    if (password) {
        const saltsRound = 100;
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

const User = model('users', userSchema);

export default User;
