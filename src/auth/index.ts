import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { userRepository } from '../models';
import { SECRET_KEY } from '../../config';

const authRouter = Router();

authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // check for user in db
    const repo = await userRepository();
    const user = await repo.findOne({ username });

    // verify user
    if (!user) {
        return res.status(401).json({
            msg: 'User with that username not found'
        });
    }

    const passwordMatch = await user.verifyPassword(password);

    if (!passwordMatch) {
        return res.status(401).json({
            msg: 'Incorrect password'
        });
    }

    // encode jwt token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY);

    // save token in db also
    user.clientId = token;
    await repo.save(user);

    // return
    res.json({
        msg: 'Verified',
        token
    });
});

authRouter.get(
    '/protected',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            msg: 'yah you got this'
        });
    }
);

export default authRouter;
