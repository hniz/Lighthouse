const e = require('express');
const Router = e.Router();
const commentsRoute = require('./postComment');
const classPostsRoute = require('./getClassPosts');
const endorseRoute = require('./endorse');
const endorseCommentRoute = require('./endorseComment');

Router.use('/comment', commentsRoute);
Router.use('/getClassPosts', classPostsRoute);
Router.use('/endorse', endorseRoute);
Router.use('/endorseComment', endorseCommentRoute);

module.exports = Router;
