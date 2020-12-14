const e = require('express');
const Router = e.Router();
const NewClassRoute = require('./new');
const EditClassRoute = require('./edit');
const JoinClassRoute = require('./join');
const ViewClassRoute = require('./view');

Router.use('/new', NewClassRoute);
Router.use('/edit', EditClassRoute);
Router.use('/join', JoinClassRoute);
Router.use('/', ViewClassRoute);

module.exports = Router;
