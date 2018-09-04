import { Router } from 'express';
// import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { SECRET_KEY } from '../../config';
// import './passport';

const authRouter = Router();

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
    const token = jwt.sign({ userId: user.id, iat: 0 }, SECRET_KEY);

    // save token as authToken in db also
    // @ts-ignore
    user.authKey = token;
    await user.save();

    // return
    return res.json({
        token
    });
});

export default authRouter;
