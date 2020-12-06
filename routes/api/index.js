const e = require('express');
const Router = e.Router();
const commentsRoute = require('./postComment');

Router.use('/comment', commentsRoute);

module.exports = Router;
