const e = require('express');
const Router = e.Router();
const NewPostRoute = require('./new');

Router.use('/new', NewPostRoute);

module.exports = Router;
