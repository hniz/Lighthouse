const e = require('express');
const Router = e.Router();
const ViewProfileRoute = require('./view_profile');
const EditProfileRoute = require('./edit_profile');
const DeleteProfileRoute = require('./delete_profile');

Router.use('/edit', EditProfileRoute);
Router.use('/', ViewProfileRoute);
Router.use('/delete', DeleteProfileRoute);

module.exports = Router;
