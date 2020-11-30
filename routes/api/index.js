const express = require('express');
const Router = express.Router();
const createUserRoute = require('./create_user');

Router.use('/create-user', createUserRoute);

module.exports = Router;
