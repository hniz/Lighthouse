const e = require('express');
const Router = e.Router();
const NewClassRoute = require('./new');
const EditClassRoute = require('./edit');

Router.use('/new', NewClassRoute);
Router.use('/edit', EditClassRoute);

module.exports = Router;
