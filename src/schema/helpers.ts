import User from '../models/user';

export async function authUser(token: string) {
    // check if token is falsy aka: bad auth header
    if (!token.length) {
        throw Error(`No authorization header. Please put token in header
                with this format - \'Bearer <token>\'`);
    }

    // get the user
    const user = await User.findOne({ authKey: token });

    if (!user) {
        throw Error(
            "Can't authenticate, possibly because of user is logged on else where"
        );
    }

    return user;
}
