const express = require('express');
const { getPostComments } = require('../../data/comments');
const { getPostById } = require('../../data/posts');
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
