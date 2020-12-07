const e = require('express');
const Router = e.Router();
const commentsRoute = require('./postComment');
const classPostsRoute = require('./getClassPosts');

Router.use('/comment', commentsRoute);
Router.use('/getClassPosts', classPostsRoute);


module.exports = Router;
