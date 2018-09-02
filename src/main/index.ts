import express from 'express';
import { userRepository } from '../models';

const router = express.Router();

router.get('/:pass', async (req, res) => {
    const password = req.params.pass;
    const repo = await userRepository();
    const user = await repo.findOne({ username: 'janedoe' });
    const match = user && (await user.verifyPassword(password));

    res.send({
        msg: match
    });
});

export default router;
