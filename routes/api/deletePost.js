const e = require('express');
const { deletePost } = require('../../data/posts');
const { getUserByToken } = require('../../data/users');
const Router = e.Router();
const xss = require('xss');

Router.post('/', async(req, res) => {
    const token = req.session.token;
    const post_id = xss(req.body['post-id']);
    const getUser = await getUserByToken(token);

    if(getUser.error){
        res.status(getUser.statusCode).json({error: getUser.error});
    }

    const result = await deletePost(post_id);

    if(result.error){
        res.status(result.statusCode).json({error: result.error});
    } else {
        res.status(result.statusCode).json({});
    }

});


module.exports = Router;