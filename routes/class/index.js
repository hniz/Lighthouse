const e = require('express');
const Router = e.Router();
const NewClassRoute = require('./new');
const EditClassRoute = require('./edit');
const JoinClassRoute = require('./join');
const ViewClassRoute = require('./view');
const LeaveClassRoute = require('./leave');

Router.use('/leave', LeaveClassRoute);
Router.use('/new', NewClassRoute);
Router.use('/edit', EditClassRoute);
Router.use('/join', JoinClassRoute);
Router.use('/', ViewClassRoute);

module.exports = Router;
