import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        msg: 'Welcome to chatapp Api: go to /graphql to start using the api'
    });
});

export default router;
