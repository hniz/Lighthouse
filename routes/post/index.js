const e = require('express');
const Router = e.Router();
const NewPostRoute = require('./new');
const ViewPostRoute = require('./view');

Router.use('/', ViewPostRoute);
Router.use('/new', NewPostRoute);

module.exports = Router;
