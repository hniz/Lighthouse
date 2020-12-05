const e = require('express');
const Router = e.Router();
const ViewProfileRoute = require('./view_profile');

Router.use('/', ViewProfileRoute);

module.exports = Router;
