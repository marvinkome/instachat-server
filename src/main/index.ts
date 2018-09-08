import express from 'express';
import { verify } from 'jsonwebtoken';
import ShortUrl from '../models/shortenUrl';
import Role from '../models/role';
import Group from '../models/group';
import { authUser } from '../schema/helpers';
import { SECRET_KEY } from '../../config';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        msg: 'Welcome to chatapp Api: go to /graphql to start using the api'
    });
});

router.get('/invite/:code', async (req, res) => {
    const urlCode = req.params.code;
    const item = await ShortUrl.findOne({ urlCode });

    if (item) {
        // @ts-ignore
        return res.redirect(item.originalUrl);
    } else {
        return res.status(400).json({
            error: 'Invalid code'
        });
    }
});

router.get('/jwt-invite/:token', async (req, res) => {
    // verify user from header
    const header = req.headers.authorization;
    const authToken = header && header.split(' ')[1];

    if (!authToken) {
        return res.status(401).json({
            error: 'Invalid auth header'
        });
    }

    const user = await authUser(authToken);

    // get token
    const token = req.params.token;
    const payload = verify(token, SECRET_KEY);

    // @ts-ignore
    const groupId = payload.groupId;

    // check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(400).json({ error: 'Bad token' });
    }

    // check if user is already in the group
    // @ts-ignore
    const foundGroup = user.groups.filter(
        (item: any) => String(item.group) === group.id
    );
    if (foundGroup.length) {
        return res.json({
            msg: 'Already in the group'
        });
    }

    // add user to group with default role
    // @ts-ignore
    const userGroup = await user.join_group(group, Role.user);

    if (userGroup.err) {
        return res
            .status(500)
            .json({ error: 'An error occured while adding you to group' });
    }

    await user.save();
    res.json({
        // @ts-ignore
        msg: 'Welcome to ' + group.name
    });
});

export default router;
