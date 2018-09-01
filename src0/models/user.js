const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
userSchema.pre('save', function(next) {
    // hash password
    if (this.password) {
        const salts_round = 10;
        bcrypt.hash(this.password, salts_round, (err, hash) => {
            if (err) throw err;
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});

// verify password
userSchema.methods.verify_password = function(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('users', userSchema);

module.exports = User;
