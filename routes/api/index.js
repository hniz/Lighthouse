const e = require('express');
const Router = e.Router();
const commentsRoute = require('./postComment');
const classPostsRoute = require('./getClassPosts');
const endorseRoute = require('./endorse');
const endorseCommentRoute = require('./endorseComment');
const similarityCheckRoute = require('./checkSimilarity');
const voteRoute = require('./vote');
const loginRoute = require('./login');
const joinClassRoute = require('./joinClass');
const editProfileRoute = require('./editProfile');

Router.use('/joinClass', joinClassRoute);
Router.use('/login', loginRoute);
Router.use('/comment', commentsRoute);
Router.use('/getClassPosts', classPostsRoute);
Router.use('/endorse', endorseRoute);
Router.use('/endorseComment', endorseCommentRoute);
Router.use('/similarity', similarityCheckRoute);
Router.use('/vote', voteRoute);
Router.use('/edit_profile', editProfileRoute);

module.exports = Router;
