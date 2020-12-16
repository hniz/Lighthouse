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
    let comments = await getPostComments(postID);
    if (comments.error) {
        return res.render('post', {
            title: 'Post not found!',
            error: comments.error,
            loggedIn: req.session.token ? true : false,
        });
    }
    postLookup.post.comments = comments.comments.map((comment) => {
        comment.upvoted =
            comment.votes && comment.votes[user.user._id.toString()] === 1;
        return comment;
    });
    const classLookup = await getClassById(postLookup.post.class);
    if (classLookup.error) {
        return res.render('post', {
            title: 'Error',
            error: 'An internal error occurred.',
            loggedIn: req.session.token ? true : false,
        });
    }
    return res.render('post', {
        isAuthor: postLookup.post.author === user.user._id.toString(),
        title: postLookup.post.title,
        post: postLookup.post,
        postId: postLookup.post._id.toString(),
        endorse: postLookup.post.endorse,
        instructor: classLookup.class.instructor === user.user._id.toString(),
        loggedIn: req.session.token ? true : false,
        upvoted:
            postLookup.post.votes &&
            postLookup.post.votes[user.user._id.toString()] === 1,
    });
});

module.exports = Router;
