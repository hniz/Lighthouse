const e = require('express');
const { create } = require('../../data/comments');
const Router = e.Router();

Router.post('/', async (req, res) => {
    const token = req.session.token;
    const content = req.body['comment-content'];
    const parent_post = req.body['parent-id'];
    const result = await create({ userToken: token, parent_post, content });
    if (result.error) {
        res.status(result.statusCode).json({ error: result.error });
    } else {
        res.status(result.statusCode).json({});
    }
});

module.exports = Router;
