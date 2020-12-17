const e = require('express');
const { create } = require('../../data/comments');
const Router = e.Router();
const xss = require('xss');

Router.post('/', async (req, res) => {
    const token = req.session.token;
    const content = xss(req.body['comment-content']);
    const parent_post = xss(req.body['parent-id']);
    const result = await create({ userToken: token, parent_post, content });
    if (result.error) {
        res.status(result.statusCode).json({ error: result.error });
    } else {
        res.status(result.statusCode).json({});
    }
});

module.exports = Router;
