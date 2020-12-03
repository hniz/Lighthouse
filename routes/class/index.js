const e = require('express');
const Router = e.Router();
const NewClassRoute = require('./new');

Router.use('/new', NewClassRoute);

module.exports = Router;
