const express = require('express');
const Router = express.Router();

Router.get('/', (req, res) => {
    res.render('join_class', {
        title: 'Join Class',
        loggedIn: req.session.token ? true : false,
    });
});



module.exports = Router;
