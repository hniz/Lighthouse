const e = require('express');
const Router = e.Router();
const NewPostRoute = require('./new');
const ViewPostRoute = require('./view');
const EditPostRoute = require('./edit');

Router.use('/', ViewPostRoute);
Router.use('/new', NewPostRoute);
Router.use('/edit', EditPostRoute);

module.exports = Router;
