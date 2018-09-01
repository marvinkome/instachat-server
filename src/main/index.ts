import express from 'express';
import User from '../models/user';

const router = express.Router();

router.get('/', (req, res) => {
    User.find({}, (err, doc) => {
        const newDoc = doc.reduce((total: any[], curr) => {
            total.push({
                // @ts-ignore
                username: curr.username
            });

            return total;
        }, []);
        res.send({
            message: newDoc
        });
    });
});

export default router;
