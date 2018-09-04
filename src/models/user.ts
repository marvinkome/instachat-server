import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';
import Group from './group';

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
    groups: [
        {
            group: {
                type: Schema.Types.ObjectId,
                ref: 'Group'
            },
            role: {
                name: String,
                permission: Number
            }
        }
    ]
});

userSchema.pre('save', async function(next) {
    // @ts-ignore
    const passwordHash = await hash(this.password, 10);
    // @ts-ignore
    this.password = passwordHash;

    console.log(passwordHash);

    next();
});

userSchema.methods.verify_password = function(password: string) {
    return compare(password, this.password);
};

userSchema.methods.join_group = async function(groupId: string, role: any) {
    // find the group
    const group = await Group.findById(groupId);

    // verify group
    if (!group) {
        return {
            err: "Group with that id wasn't found, possibly deleted"
        };
    }

    const userGroup = {
        group: group._id,
        role
    };

    this.groups.push(userGroup);
    return userGroup;
};

const userModel = model('User', userSchema);
export default userModel;
