const e = require('express');
const Router = e.Router();
const commentsRoute = require('./postComment');
const classPostsRoute = require('./getClassPosts');
const endorseRoute = require('./endorse');
const endorseCommentRoute = require('./endorseComment');
const similarityCheckRoute = require('./checkSimilarity');

Router.use('/comment', commentsRoute);
Router.use('/getClassPosts', classPostsRoute);
Router.use('/endorse', endorseRoute);
Router.use('/endorseComment', endorseCommentRoute);
Router.use('/similarity', similarityCheckRoute);

module.exports = Router;
