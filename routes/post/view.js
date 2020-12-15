const express = require('express');
const { getClassById } = require('../../data/classes');
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
            loggedIn: req.session.token ? true : false,
        });
    }

    const user = await getUserByToken(req.session.token);
    if (user.error || !user.user.classes.includes(postLookup.post.class)) {
        return res.render('post', {
            title: 'Post not found!',
            error: 'You are not authorized to view this post!',
            loggedIn: req.session.token ? true : false,
        });
    }
    const comments = await getPostComments(postID);
    if (comments.error) {
        return res.render('post', {
            title: 'Post not found!',
            error: comments.error,
            loggedIn: req.session.token ? true : false,
        });
    }
    postLookup.post.comments = comments.comments;
    const classLookup = await getClassById(postLookup.post.class);
    if (classLookup.error) {
        return res.render('post', {
            title: 'Error',
            error: 'An internal error occurred.',
            loggedIn: req.session.token ? true : false,
        });
    }
    if (postLookup.post.author !== user.user._id.toString()) {
        return res.render('post', {
            isAuthor: false,
            title: postLookup.post.name,
            post: postLookup.post,
            postId: postLookup.post._id.toString(),
            instructor:
                classLookup.class.instructor === user.user._id.toString(),
            loggedIn: req.session.token ? true : false,
        });
    } else {
        return res.render('post', {
            isAuthor: true,
            title: postLookup.post.name,
            post: postLookup.post,
            postId: postLookup.post._id.toString(),
            instructor:
                classLookup.class.instructor === user.user._id.toString(),
            loggedIn: req.session.token ? true : false,
        });
    }
});

module.exports = Router;
