import express from 'express';
import User from '../models/user';

const router = express.Router();

router.get('/', (req, res) => {
    User.find({}, (err, doc) => {
        res.send({
            message: doc
        });
    });
});

export default router;
