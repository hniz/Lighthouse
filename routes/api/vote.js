const express = require('express');
const { getCommentById, voteComment } = require('../../data/comments');
const { getPostById, votePost } = require('../../data/posts');
const { getUserByToken } = require('../../data/users');
const Router = express.Router();

const validVote = (vote) => vote >= 0 && vote <= 1;

Router.post('/post/:postId', async (req, res) => {
    const vote = req.query.vote;
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
    if (!validVote(vote)) {
        return res.status(400).json({ error: 'Vote must be 0 or 1.' });
    }

    const voteResult = await votePost({
        userId: userLookup.user._id.toString(),
        postId: req.params.postId,
        vote,
    });
    if(voteResult.error){
        return res.status(voteResult.statusCode).json({error: voteResult.error});
    }
    return res.status(200).send();
});

Router.post('/comment/:commentId', async (req, res) => {
    const vote = req.query.vote;
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error) {
        return res
            .status(userLookup.statusCode)
            .json({ error: userLookup.error });
    }
    const commentLookup = await getCommentById(req.params.commentId);
    if (commentLookup.error) {
        return res
            .status(commentLookup.statusCode)
            .json({ error: commentLookup.error });
    }
    if (!validVote(vote)) {
        return res.status(400).json({ error: 'Vote must be 0 or 1.' });
    }

    const voteResult = await voteComment({
        userId: userLookup.user._id.toString(),
        commentId: req.params.commentId,
        vote,
    });
    if(voteResult.error){
        return res.status(voteResult.statusCode).json({error: voteResult.error});
    }
    return res.status(200).send();
});

module.exports = Router;
