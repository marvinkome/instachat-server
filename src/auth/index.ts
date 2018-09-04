import { Router } from 'express';
// import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { SECRET_KEY } from '../../config';
// import './passport';

const authRouter = Router();

authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // check for user in db
    const user = await User.findOne({ username });

    // verify user
    if (!user) {
        return res.status(401).json({
            msg: 'User with that username not found'
        });
    }

    // @ts-ignore
    const passwordMatch: boolean = await user.verify_password(password);
    if (!passwordMatch) {
        return res.status(401).json({
            msg: 'Incorrect password'
        });
    }

    // encode jwt token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY);

    // save token as authToken in db also
    // @ts-ignore
    user.authKey = token;
    await user.save();

    // return
    res.json({
        msg: 'Verified',
        token
    });
});

export default authRouter;
