import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { SECRET_KEY } from '../../config';

const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            error: 'All fields are required'
        });
    }

    const user = new User({
        username,
        email,
        password
    });

    try {
        await user.save();
    } catch (e) {
        return res.status(500).json({
            error: 'Something went wrong'
        });
    }

    return res.json({
        msg: 'Account created. You can login now'
    });
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // check for user in db
    const user = await User.findOne({ email });

    // verify user
    if (!user) {
        return res.status(401).json({
            error: 'User with that email not found'
        });
    }

    // @ts-ignore
    const passwordMatch: boolean = await user.verify_password(password);

    if (!passwordMatch) {
        return res.status(401).json({
            error: 'Incorrect password'
        });
    }

    // encode jwt token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        noTimestamp: true
    });

    // save token as authToken in db also
    // @ts-ignore
    user.authKey = token;
    await user.save();

    // return
    return res.json({
        token
    });
});

authRouter.post('/logout', async (req, res) => {
    const token = req.headers.authorization;
    console.log(token);

    if (!token) {
        return res.status(400).json({
            resp: 'no token in header'
        });
    }

    // get user
    const user = await User.findOne({ authKey: token });

    if (!user) {
        return res.status(400).json({
            resp: 'user not found'
        });
    }

    // @ts-ignore
    user.authKey = null;
    await user.save();

    return res.json({
        resp: 'logout successfull'
    });
});

export default authRouter;
