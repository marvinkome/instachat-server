import User from '../models/user';
import ShortUrl from '../models/shortenUrl';
import { isUri } from 'valid-url';
import { generate } from 'shortid';

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

export async function generateShortUrl(originalUrl: string, baseUrl: string) {
    if (!isUri(originalUrl) || !isUri(baseUrl)) {
        return {
            err: 'bad url'
        };
    }

    // check if item exists
    const item = await ShortUrl.findOne({ originalUrl });
    if (item) {
        return { item };
    }

    const urlCode = generate();
    const shortUrl = baseUrl + '/invite/' + urlCode;
    const updatedAt = Date.now();

    const url = new ShortUrl({
        originalUrl,
        urlCode,
        shortUrl,
        updatedAt
    });

    await url.save();
    return { item: url };
}

export async function userCan(user: any, group: any, permission: any) {
    // check if user is authorized to send message in this group
    const userGroup = user.groups.find(
        (item: any) => String(item.group) === group.id
    );

    if (!userGroup) {
        return false;
    }

    if ((userGroup.role.permission & permission) !== permission) {
        return false;
    }

    return true;
}
