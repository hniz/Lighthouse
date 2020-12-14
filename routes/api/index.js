const e = require('express');
const Router = e.Router();
const commentsRoute = require('./postComment');
const classPostsRoute = require('./getClassPosts');
const endorseRoute = require('./endorse');

Router.use('/comment', commentsRoute);
Router.use('/getClassPosts', classPostsRoute);
Router.use('/endorse', endorseRoute);

module.exports = Router;
