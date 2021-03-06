const express = require('express');
const { getClassById } = require('../../data/classes');
const { getPostById, modifyPost } = require('../../data/posts');
const { getUserByToken } = require('../../data/users');
const Router = express.Router();

Router.post('/:postId', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error) {
        return res
            .status(userLookup.statusCode)
            .json({ error: userLookup.error });
    }
    const postLookup = await getPostById(req.params.postId);
    if (postLookup.error) {
        return res
            .status(postLookup.statusCode)
            .json({ error: postLookup.error });
    }
    const classLookup = await getClassById(postLookup.post.class);
    if (classLookup.error) {
        return res
            .status(classLookup.statusCode)
            .json({ error: classLookup.error });
    }
    const user = userLookup.user;
    const course = classLookup.class;
    const post = postLookup.post;
    if (course.instructor !== user._id.toString()) {
        return res
            .status(401)
            .json({ error: 'You are not authorized to endorse this post!' });
    }
    const endorse = req.query.endorse;
    if (typeof endorse === 'undefined') {
        return res
            .status(400)
            .json({ error: 'Missing "endorse" query parameter.' });
    }
    const modifyResult = await modifyPost({ endorse, id: post._id.toString() });
    if (modifyResult.error) {
        return res
            .status(modifyResult.statusCode)
            .json({ error: modifyResult.error });
    }
    return res.status(200).json({postId: req.params.postId, endorse});
});

module.exports = Router;
