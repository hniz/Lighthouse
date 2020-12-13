const express = require('express');
const { getPostComments } = require('../../data/comments');
const { getPostById } = require('../../data/posts');
const { getUserByToken } = require('../../data/users');
const Router = express.Router();

Router.get('/:id', async (req, res) => {
    const postID = req.params.id;
    const postLookup = await getPostById(postID);
    if (postLookup.error) {
        return res.render('post', {
            title: 'Post not found!',
            error: postLookup.error,
        });
    }
    const user = await getUserByToken(req.session.token);
    if (user.error || !user.user.classes.includes(postLookup.post.class)) {
        return res.render('post', {
            title: 'Post not found!',
            error: 'You are not authorized to view this post!',
        });
    }
    const comments = await getPostComments(postID);
    if (comments.error) {
        return res.render('post', {
            title: 'Post not found!',
            error: comments.error,
        });
    }
    postLookup.post.comments = comments.comments;
    return res.render('post', {
        title: postLookup.post.name,
        post: postLookup.post,
    });
});

module.exports = Router;
